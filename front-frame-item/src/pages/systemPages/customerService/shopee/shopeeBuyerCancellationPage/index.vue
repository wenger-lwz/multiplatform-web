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
        ref="cancelFilter"
        @filter-change="filterChange"
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
          <template v-else-if="column.dataIndex === 'Action'">
            <opbtn-group :btn-list="btnList" :row="record"></opbtn-group>
          </template>
          <template v-else-if="column.dataIndex === 'cancelStatusName'">
            <gb-text v-if="record?.cancelStatusName">
              <gj-badge :color="getStatusColor(record?.cancelStatus)"></gj-badge
              ><span class="platformStatus-color">{{
                record?.cancelStatusName
              }}</span>
            </gb-text>
          </template>
          <template v-else>
            <gb-text>{{ text || "-" }}</gb-text>
          </template>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <OrderDetail
    :dialogVisible="detailVisible"
    :orderId="detailRow.orderId"
    @cancel="cancelDetail"
    :isFooter="true"
  >
    <template #footer>
      <commonPopconfirm
        position="tr"
        content="请注意，一旦批准该取消申请，您将则无法撤消。Shopee将不会对于此订单的任何损失承担责任。"
        @ok="returnConfirm(detailRow, 'ACCEPT')"
      >
        <gj-button type="primary">同意</gj-button>
      </commonPopconfirm>
      <commonPopconfirm
        position="tr"
        content="通过拒绝此取消申请，此订单将返回到其原始状态。若您未出货，请在拒绝取消申请后安排出货。确认拒绝？"
        @ok="returnConfirm(detailRow, 'REJECT')"
      >
        <gj-button type="plian">拒绝</gj-button>
      </commonPopconfirm>
    </template>
  </OrderDetail>

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
import _ from "lodash";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import {
  tableColumns,
  getStatusColor,
} from "@pagesSystem/customerService/shopee/config/shopeeBuyerCancellation.js";
import returnOrRefundDispute from "@pagesSystem/customerService/shopee/components/returnOrRefundDispute.vue";
import OrderDetail from "@pagesSystem/order/shopee/orderManger/allOrderDetail.vue";
import OperateBar from "@/components/OperateBar.vue";
import {
  addAllocationRule,
  editAllocationRule,
} from "@/api/customerService/infrastructure.js";
import {
  getShopeeCancelOrder,
  getShopeeCancelShop,
} from "@/api/customerService/shopee.js";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
import TagGroup from "@/components/TagGroup.vue";
import FilterCondition from "./components/FilterCondition.vue";
// import returnOrRefundDetail from '../../components/returnOrRefundDetail.vue'
import { createUuid } from "@/utils/common";
import columnCopy from "@/components/columnCopy.vue";
import commonPopconfirm from "@/components/commonPopconfirm";

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
    // returnOrRefundDetail,
    getShopeeCancelOrder,
    columnCopy,
    OrderDetail,
    commonPopconfirm,
  },
  /* eslint-enable */
  setup() {
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
      fromDataSearch: {}, // 查询参数
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
          label: "同意",
          click: (row) => returnConfirm(row, "ACCEPT"),
          outside: true,
          tooltipContent:
            "请注意，一旦批准该取消申请，您将则无法撤消。Shopee将不会对于此订单的任何损失承担责任。",
          isPopConfirm: true,
        },
        {
          label: "拒绝",
          click: (row) => returnConfirm(row, "REJECT"),
          outside: true,
          tooltipContent:
            "通过拒绝此取消申请，此订单将返回到其原始状态。若您未出货，请在拒绝取消申请后安排出货。确认拒绝？",
          isPopConfirm: true,
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
            await editAllocationRule(params);
            GjMessage.success("修改成功");
            data.fromDialogVisible = false;
            searchTable();
          } else {
            // 添加
            await addAllocationRule(params);
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
      data.fromDataSearch = {};
      data.inputPopoverValue = {};
      data.searchActive = [];
      proxy.$refs.cancelFilter?.resetForm();
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
      getShopeeCancelOrder(params)
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
    const getQueryCondition = (filterData) => {
      data.fromDataSearch = {
        erpShopIds: filterData.erpShopIds || [],
        cancelReasons: filterData.cancelReasons || [],
        cancelByAndStatuses: filterData.cancelByAndStatuses || [],
        endTime: filterData.orderDate[1] || "",
        startTime: filterData.orderDate[0] || "",
        [filterData.itemTypeList.selectValue]:
          filterData.itemTypeList.inputValue || "",
      };
      searchTable();
    };
    // 搜索
    const filterChange = _.debounce(getQueryCondition, 200);

    const changeFilterSelect = (target) => {
      proxy.$refs.cancelFilter?.delTag(target);
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
    const returnConfirm = async (row, val) => {
      const params = {
        erpShopId: row.erpShopId || "",
        platformOrderId: row.platformOrderId || "",
        operation: val || "",
      };
      await getShopeeCancelShop(params);
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
      filterChange,
      changeFilterSelect,
      cancelDetail,
      acceptRefund,
      openDisputeInfo,
      returnConfirm,
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
:deep(.arco-modal) {
  :deep(.dialog-content) {
    height: calc(100vh - 191px);
  }
}
.platformStatus-color {
  margin-left: 4px;
}
</style>
