<template>
  <!-- v-permissions="['PLAT/allocationRules/add']"
       v-permissions="['PLAT/allocationRules/delete']" -->
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
        rowKey="rowKeyId"
        :loading="form.loading"
        :pagination="form.pagination"
        @onRowSelection="getSelection"
        @getTableCurrent="getTableCurrent"
      >
        <template #bodyCell="{ record, column, text }">
          <template v-if="column.dataIndex === 'itemInfo'">
            <gb-text>{{ record.itemName }}</gb-text>
            <div class="shop-theme_content">
              <span class="shop-theme_content_left" v-if="record.itemId">
                <columnCopy :isAnchor="false" :textValue="record.itemId" />
              </span>
              <span class="shop-theme_content_rigth" v-if="record.msku">
                <columnCopy :isAnchor="false" :textValue="record.msku" />
              </span>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'isActive'">
            <gj-switch
              v-model="record.isActive"
              @click="setAllocationRule(record)"
              size="small"
            />
          </template>
          <template v-else-if="column.dataIndex === 'returnStatusName'">
            <gb-text v-if="record?.returnStatusName">
              <gj-badge :color="getStatusColor(record?.returnStatus)"></gj-badge
              ><span class="platformStatus-color">{{
                record?.returnStatusName
              }}</span>
            </gb-text>
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
  />

  <!-- 争议编辑 -->
  <gb-modal
    v-model:visible="fromDialogVisible"
    :unmount-on-close="true"
    :mask-closable="false"
    width="600px"
    class="gb-modal-createFrom"
    @close="resetForm()"
    :render-to-body="false"
  >
    <template #title>
      <div class="modal-title">
        <span class="title">{{ fromTitle }}</span>
      </div>
    </template>
    <!-- 提出争议 -->
    <returnOrRefundDispute
      ref="createFrom"
      :fromType="fromType"
      :row="fromRow"
    ></returnOrRefundDispute>
    <template #footer>
      <gj-space size="medium">
        <gj-button type="plain" @click="resetForm()">取消</gj-button>
        <gj-button type="primary" class="ml-8" @click="submitForm()">
          确定</gj-button
        >
      </gj-space>
    </template>
  </gb-modal>
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
import {
  tableColumns,
  getStatusColor,
} from "@pagesSystem/customerService/shopee/config/shopeeReturnOrRefund.js";
import returnOrRefundDispute from "@pagesSystem/customerService/shopee/components/returnOrRefundDispute.vue";
import OperateBar from "@/components/OperateBar.vue";
import {
  getShopeeReturnOrder,
  getShopeeReturnConfirm,
  getShopeeReturnDispute,
} from "@/api/customerService/shopee.js";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
import TagGroup from "@/components/TagGroup.vue";
import FilterCondition from "./FilterCondition.vue";
import returnOrRefundDetail from "../../components/returnOrRefundDetail.vue";
import { createUuid } from "@/utils/common";
import columnCopy from "@/components/columnCopy.vue";

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
    getShopeeReturnOrder,
    columnCopy,
  },
  props: {
    returnStatusCategory: {
      type: String,
      default: () => {
        return "ALL";
      },
    },
  },
  /* eslint-enable */
  setup(props) {
    const { proxy } = getCurrentInstance();
    const $store = useStore();
    const selectedRow = ref([]);
    const selectedRowKeys = computed(() => {
      return selectedRow.value.map((item) => item.id);
    });

    const data = reactive({
      detailVisible: false,
      detailRow: {},
      searchActive: [],
      inputPopoverValue: {},
      fromDataSearch: {
        returnStatusCategory: props.returnStatusCategory,
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
      delPopupVisible: false, // pop批量删除弹框是否可见

      createFrom: {}, // form表单内容
      fromTitle: "向Shopee提出争议",
      fromType: 2, // 2添加 1编辑
      fromRow: {}, // 编辑行数据
      fromDialogVisible: false, // 编辑弹框是否显示
      importTitle: "导入标签",
      importType: 1, // 导入标签类型
    });

    //规则添加、编辑
    const handelLabel = (row, type) => {
      data.fromDialogVisible = true;
      data.fromType = type;
      data.fromRow = row ? row : {};
      data.fromTitle = type === 1 ? "向Shopee提出争议" : "向Shopee提出争议";
    };
    //  操作列数据
    const btnList = computed(() => {
      return [
        {
          label: "接受退款",
          click: (row) => returnConfirm(row),
          outside: true,
          tooltipContent:
            "您确定要接受该退款决定吗？在您接受后，您将不能就此请求提出任何争议。",
          isPopConfirm: true,
        },
        {
          label: "提出争议",
          click: (row) => handelLabel(row, 1),
          outside: true,
        },
        {
          label: "查看详情",
          click: (row) => lookEdit(row),
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

    //  保存
    const submitForm = () => {
      proxy.$refs["createFrom"].submitForm().then(async (res) => {
        data.createFrom = $store.getters.getParams
          ? $store.getters.getParams.createFrom
          : {};
        if (res === "200") {
          let params = {
            ...data.createFrom,
          };
          if (data.fromType === 1) {
            params.id = data.fromRow.id;
            // 编辑
            await getShopeeReturnDispute(params);
            GjMessage.success("修改成功");
            data.fromDialogVisible = false;
            searchTable();
          } else {
            // 添加
            await getShopeeReturnDispute(params);
            GjMessage.success("添加成功");
            data.fromDialogVisible = false;
            searchTable();
          }
        }
      });
    };

    // 重置
    const resetForm = () => {
      proxy.$refs["createFrom"].resetForm();
      data.fromDialogVisible = false;
    };

    // 全选
    const getSelection = (val) => {
      selectedRow.value = val;
    };

    // 重置搜索条件
    const resetSearch = () => {
      data.fromDataSearch = {
        returnStatusCategory: props.returnStatusCategory,
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
      getShopeeReturnOrder(params)
        .then((res) => {
          data.form.tableData = processTableData(res.data.records) || [];
          data.form.pagination.total = res.data.total || 0;
        })
        .finally(() => {
          data.form.loading = false;
        });
    };

    // 合并行
    const processTableData = (arr) => {
      const result = [];
      arr?.forEach((item) => {
        const { ...rest } = item;
        item.itemInfos.forEach((it, index) => {
          result.push({
            ...rest,
            ...it,
            rowKeyId: createUuid(),
            rowSSpan: index <= 0 ? item.itemInfos.length : undefined,
            rowSpan: index > 0 ? item.itemInfos.length : undefined,
          });
        });
      });
      return result;
    };
    // 搜索
    const getQueryCondition = (val) => {
      data.fromDataSearch = {
        returnStatusCategory: props.returnStatusCategory,
        erpShopIds: val.erpShopIds,
        returnReasons: val.returnReasons,
        solutions: val.solutions,
        endTime: val.generationDate[1],
        startTime: val.generationDate[0],
        [val.itemTypeList.selectValue]: val.itemTypeList.inputValue,
      };
      searchTable();
    };
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
    // 接受退款
    const returnConfirm = async (row) => {
      const params = {
        erpShopId: row.erpShopId || "",
        returnPlatformOrderId: row.returnPlatformOrderId || "",
      };
      await getShopeeReturnConfirm(params);
      GjMessage.success("操作成功");
      getSelection([]);
      resetSearchTable();
    };
    // 弹框里面接受退款
    const acceptRefund = (row) => {
      returnConfirm(row);
    };
    const openDisputeInfo = (row) => {
      handelLabel(row, 1);
    };

    onBeforeMount(() => {
      searchTable();
    });

    return {
      ...toRefs(data),
      handelLabel,
      resetForm,
      resetSearch,
      getTableCurrent,
      getSelection,
      selectedRowKeys,
      btnList,
      submitForm,
      searchTable,
      searchActiveChnge,
      getQueryCondition,
      changeFilterSelect,
      cancelDetail,
      acceptRefund,
      openDisputeInfo,
      getStatusColor,
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
.platformStatus-color {
  margin-left: 4px;
}
</style>
