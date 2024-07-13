<template>
  <CommonPage :pageRest="true" @common-page-rest="resetSearch">
    <template #tag-content>
      <TagGroup
        :list="searchActive"
        @tag-change="changeFilterSelect"
      ></TagGroup>
    </template>
    <template #filter-content>
      <FilterCondition
        ref="returnOrderAliFilter"
        @filter-change="getQueryCondition"
        @tag-change="searchActiveChnge"
      />
    </template>
    <!-- 操作 -->
    <template #operate_bar-content>
      <OperateBar :refreshShow="true" @operate-rest="searchTable"> </OperateBar>
    </template>
    <template #table-content>
      <CommonTable
        ref="labelTableRef"
        :columns="form.columns"
        :tableData="form.tableData"
        rowKey="id"
        :loading="form.loading"
        :pagination="form.pagination"
        @getTableCurrent="getTableCurrent"
      >
        <template #bodyCell="{ record, column, text }">
          <template v-if="column.dataIndex === 'itemInfo'">
            <a
              v-if="record.itemUrl"
              :href="record.itemUrl"
              target="_blank"
              class="linkItemUrl"
              ><gb-text>{{ record.itemTitle }}</gb-text></a
            >
            <gb-text v-else>{{ record.itemTitle }}</gb-text>
            <div class="shop-theme_content">
              <span class="shop-theme_content_left" v-if="record?.itemId">
                <columnCopy :isAnchor="false" :textValue="record?.itemId" />
              </span>
              <span class="shop-theme_content_rigth" v-if="record.msku">
                <columnCopy :isAnchor="false" :textValue="record.msku" />
              </span>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'itemImgUrl'">
            <gb-image width="36" :src="record?.itemImgUrl"></gb-image>
          </template>
          <template v-else-if="column.dataIndex === 'platformStatus'">
            <gb-text v-if="record?.platformStatusName">
              <gj-badge
                :color="getStatusColor(record?.platformStatus)"
              ></gj-badge
              ><span class="platformStatus-color">{{
                record?.platformStatusName
              }}</span>
            </gb-text>
            <gb-text v-else> - </gb-text>
          </template>
          <template v-else-if="column.dataIndex === 'messageValidTime'">
            <gj-space direction="vertical" fill :size="1">
              <gb-text width="36">{{ record?.messageValidTime }}</gb-text>
              <gj-space>
                <gj-tag
                  v-if="record?.bestOfferValidTimeByHour > 24"
                  color="red"
                  size="small"
                  >紧急</gj-tag
                >
                <gj-space>
                  剩余时间: {{ record?.bestOfferValidTimeByHour }}小时
                </gj-space>
              </gj-space>
            </gj-space>
          </template>
          <template v-else-if="column.dataIndex === 'buyerId'">
            <gj-space
              v-if="record?.buyerId || record?.buyerEmail"
              direction="vertical"
              fill
              :size="1"
            >
              <gb-text>{{ record?.buyerId || "-" }} </gb-text>
              <gb-text>{{ record?.buyerEmail || "-" }} </gb-text>
            </gj-space>
            <span v-else>{{ "-" }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'Action'">
            <opbtn-group :btn-list="btnList" :row="record"></opbtn-group>
          </template>
          <template v-else>
            <gb-text>{{ text || "-" }}</gb-text>
          </template>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <returnOrRefundDetail
    :dialogVisible="detailVisible"
    :detailRow="detailRow"
    @cancel="cancelDetail"
    @return-confirm="acceptRefund"
    @disputeInfo_eidt="openDisputeInfo"
    @counter-offer-confirm="counterOfferConfirm"
    @cancelPricce_eidt="cancelPricce"
    :isFlag="isFlag"
  />
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  computed,
  ref,
  getCurrentInstance,
} from "vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import { tableColumns } from "../config/index.js";
import returnOrRefundDispute from "@pagesSystem/customerService/shopee/components/returnOrRefundDispute.vue";
import OperateBar from "@/components/OperateBar.vue";
import {
  getDiscussPriceList,
  replyBestOffer,
  addToBuyerIMCreateSession,
} from "@/api/customerService/eBay.js";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { GjMessage } from "@gj/atom";
import TagGroup from "@/components/TagGroup.vue";
import FilterCondition from "./FilterCondition.vue";
import returnOrRefundDetail from "./buyerBargainingDetail.vue";
import columnCopy from "@/components/columnCopy.vue";
import { getStatusColor } from "../config/index.js";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "storeAllocation",
  /* eslint-disable */
  components: {
    CommonPage,
    CommonTable,
    OperateBar,
    returnOrRefundDispute,
    OpbtnGroup,
    FilterCondition,
    TagGroup,
    returnOrRefundDetail,
    getDiscussPriceList,
    columnCopy,
  },
  props: {
    bestOfferHanlerStatus: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },
  /* eslint-enable */
  setup(props) {
    const { proxy } = getCurrentInstance();
    const selectedRow = ref([]);
    const $router = useRouter();
    const selectedRowKeys = computed(() => {
      return selectedRow.value.map((item) => item.id);
    });

    const data = reactive({
      detailVisible: false,
      detailRow: {},
      searchActive: [],
      inputPopoverValue: {},
      fromDataSearch: {
        bestOfferHanlerStatus: props.bestOfferHanlerStatus,
      }, // 查询参数
      // table列表
      form: {
        rowSelection: [],
        noData: false, //无数据
        loading: false, //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        rowName: "id", //表格行 key 的取值字段
        columns: tableColumns,
        tableData: [],
        pagination: {
          //分页
          pageCurrent: 1,
          pageSize: 20,
          total: 0,
        },
      },
      fromType: 2, // 2添加 1编辑
      fromRow: {}, // 编辑行数据
      isFlag: false,
    });

    //  操作列数据
    const btnList = computed(() => {
      return [
        {
          label: "接受",
          click: (row) => returnConfirm(row, "ACCEPT"),
          outside: true,
          tooltipContent: "是否接受议价?",
          isPopConfirm: true,
        },
        {
          label: "拒绝",
          click: (row) => returnConfirm(row, "DECLINE"),
          outside: true,
          tooltipContent: "是否拒绝议价?",
          isPopConfirm: true,
        },
        {
          label: "提出议价",
          click: (row) => counterOfferConfirm(row, "COUNTER", 1),
        },
        {
          label: "详情",
          click: (row) => lookEdit(row),
        },
        {
          label: "联系买家",
          click: (row) => openDisputeInfo(row),
        },
      ];
    });

    // 查看详情页
    const lookEdit = (row) => {
      data.detailVisible = true;
      data.detailRow = row;
    };
    // 关闭详情页
    const cancelDetail = () => {
      data.detailVisible = false;
    };

    // 重置
    const resetForm = () => {
      proxy.$refs["createFrom"].resetForm();
    };

    // 重置搜索条件
    const resetSearch = () => {
      data.fromDataSearch = {
        bestOfferHanlerStatus: props.bestOfferHanlerStatus,
      };
      data.inputPopoverValue = {};
      data.searchActive = [];
      proxy.$refs.returnOrderAliFilter?.resetForm();
      data.form.pagination.pageSize = 20;
      resetSearchTable();
    };

    // 重置到第一页
    const resetSearchTable = () => {
      data.form.pagination.pageCurrent = 1;
      searchTable();
    };

    // 翻页
    const getTableCurrent = (e) => {
      data.form.pagination.pageCurrent =
        e.pageCurrent || data.form.pagination.pageCurrent;
      data.form.pagination.pageSize =
        e.pageSize || data.form.pagination.pageSize;
      searchTable();
    };

    // 获取列表
    const searchTable = () => {
      const params = {
        ...data.fromDataSearch,
        pageCurrent: data.form.pagination.pageCurrent,
        pageSize: data.form.pagination.pageSize,
      };
      data.form.loading = true;
      getDiscussPriceList(params)
        .then((res) => {
          data.form.tableData = res.data.records || [];
          data.form.pagination.total = res.data.total || 0;
        })
        .finally(() => {
          data.form.loading = false;
        });
    };
    // 搜索
    const getQueryCondition = (val) => {
      data.fromDataSearch = {
        bestOfferHanlerStatus: props.bestOfferHanlerStatus,
        bestOfferStatus: val.bestOfferStatus,
        bestOfferValidEndTime: val.timeSet[1],
        bestOfferValidStartTime: val.timeSet[0],
        [val.itemTypeList.selectValue]: val.itemTypeList.inputValue,
      };
      searchTable();
    };
    // 删除tag
    const changeFilterSelect = (target) => {
      proxy.$refs.returnOrderAliFilter?.delTag(target);
    };
    // 选择tag
    const searchActiveChnge = (target) => {
      data.searchActive = useChangeList(target, data.searchActive);
    };
    // 处理tags
    const useChangeList = (target, source) => {
      let result = [];
      if (Array.isArray(target)) {
        result = target.filter((item) => item.showValue?.length > 0);
      } else {
        const index = source.findIndex((item) => item.id === target.id);
        result = [...source];
        const { showName, showValue } = target;
        if (index >= 0) {
          if (!showValue || showValue.length <= 0) {
            result.splice(index, 1);
          } else {
            result[index].showName = showName;
            result[index].showValue = showValue;
          }
        } else if (showValue.length > 0) {
          result.push(target);
        }
      }
      return result;
    };
    // 接受拒绝
    const returnConfirm = async (row, val) => {
      const params = {
        bestOfferActionCodeType: val,
        erpShopId: row?.erpShopId || "",
        parentId: row?.id || "",
      };

      await replyBestOffer(params);
      GjMessage.success("操作成功");
      data.detailVisible = false;
      getSelection([]);
      resetSearchTable();
    };
    // 提出议价
    const counterOfferConfirm = (row, val, idx) => {
      data.isFlag = false;
      const params = {
        bestOfferActionCodeType: val,
        erpShopId: row?.erpShopId || "",
        parentId: row?.id || "",
      };
      replyBestOffer(params).then(() => {
        if (idx === 1) {
          data.detailVisible = true;
          data.detailRow = row;
        }
        data.isFlag = true;
      });
    };
    // 弹框里面接受退款
    const acceptRefund = (row, key) => {
      returnConfirm(row, key);
    };
    // 联系买家
    const openDisputeInfo = (row) => {
      const params = {
        erpShopId: row.erpShopId,
        itemId: row.itemId,
        buyerName: row.buyerName,
        itemName: row.itemTitle,
      };
      addToBuyerIMCreateSession(params).then((res) => {
        const query = {
          erpShopId: row.erpShopId,
          sessionId: res.data || "",
        };
        $router.push({
          path: "/eBayCustomerService",
          query,
        });
      });
    };
    // 关闭编辑议价
    const cancelPricce = (val) => {
      data.isFlag = val;
    };

    onBeforeMount(() => {
      searchTable();
    });

    return {
      ...toRefs(data),
      resetForm,
      resetSearch,
      getTableCurrent,
      selectedRowKeys,
      btnList,
      searchTable,
      searchActiveChnge,
      getQueryCondition,
      changeFilterSelect,
      cancelDetail,
      acceptRefund,
      openDisputeInfo,
      getStatusColor,
      counterOfferConfirm,
      cancelPricce,
    };
  },
});
</script>

<style lang="scss" scoped>
// //设置弹框样式
.shop-theme_content {
  display: flex;
  .shop-theme_content_left {
    flex: 1;
    margin-right: 8px;
  }
  .shop-theme_content_rigth {
    flex: 1;
  }
}
.linkItemUrl {
  color: blue;
}
.platformStatus-color {
  margin-left: 4px;
}
</style>
