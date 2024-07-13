<template>
  <!-- 自定义列 -->
  <gb-custom-column
    :id="'ALI_aliAllOrder_table'"
    :visible="columnVisible"
    :column="columnList"
    :get-classify="getClassify"
    :submit="setColumn"
    :code="0"
    @cancel="handleCancel"
    @getColumnList="getColumnList"
    @getResetDef="getResetDef"
  ></gb-custom-column>
  <CommonTable
    :id="'ALI_aliAllOrder_table'"
    ref="commonTableRef"
    :columns="columns"
    :tableData="form.tableData"
    :noData="form.noData"
    rowKey="rowKeyId"
    :loading="form.loading"
    bordered
    :pagination="form.pagination"
    @getTableCurrent="getTableCurrent"
    @change="sorterChange"
  >
    <template #bodyCell="{ column, record }">
      <!-- 店铺erpShopName -->
      <template v-if="column.dataIndex === 'erpShopName'">
        <gb-text>{{ record.erpShopName || "-" }}</gb-text>
      </template>
      <!-- 平台订单状态/取消状态 -->
      <template v-if="column.dataIndex === 'platformOrderStatus'">
        <div v-show="record?.platformOrderStatus">
          {{ record?.platformOrderStatus }}
        </div>
        <div v-show="record?.orderCancelStatus">
          {{ record?.orderCancelStatus }}
        </div>
        <span
          v-show="!(record?.platformOrderStatus || record?.orderCancelStatus)"
          >-</span
        >
      </template>
      <!-- so单 -->
      <!-- <template v-if="column.dataIndex === 'soOrderNumber'">
        <span>{{ record?.soOrderNumber || "-" }}</span>
      </template> -->
      <!-- 销售负责人 -->
      <!-- <template v-if="column.dataIndex === 'saleDirectorName'">
        <span>{{ record?.saleDirectorName || "-" }}</span>
      </template> -->
      <!-- 图片 -->
      <template v-if="column.dataIndex === 'productMainImageUrl'">
        <!-- <gb-table-image :url="record?.productMainImageUrl"></gb-table-image> -->
        <gb-image
          :src="record?.productMainImageUrl"
          :popover-src="record?.productMainImageUrl"
          :size="36"
        ></gb-image>
      </template>
      <!-- 商品名/商品ID/MSKU -->
      <template v-if="column.dataIndex === 'productName'">
        <div>
          <gb-text
            class="shop-theme_title"
            @click="openHelp(record?.listingUrl)"
            >{{ record.productName || "-" }}</gb-text
          >
          <div class="shop-theme_content">
            <span class="shop-theme_content_left" v-if="record.productId">
              <columnCopy
                :textValue="record.productId"
                :openUrl="record?.listingUrl"
              />
            </span>
            <span class="shop-theme_content_rigth" v-if="record.msku">
              <columnCopy :isAnchor="false" :textValue="record.msku" />
            </span>
          </div>
        </div>
      </template>
      <!-- 商品属性 -->
      <template v-if="column.dataIndex === 'productVariations'">
        <gb-text v-if="record?.productVariations?.length">
          {{ getProductVariations(record) }}
        </gb-text>
        <span v-else>-</span>
      </template>
      <!-- so状态 -->
      <!-- <template v-if="column.dataIndex === 'soOrderStatus'">
        <gj-badge
          v-show="record?.soOrderStatus"
          :status="getSoStatus(record?.soOrderStatusName)"
          :text="record?.soOrderStatus"
        />
        <span v-show="!record?.soOrderStatus">-</span>
      </template> -->
      <!-- 订单总金额 -->
      <template v-if="column.dataIndex === 'totalAmount'">
        <div v-show="record?.totalAmount">
          <span>{{ record?.currency }}&nbsp;</span>
          <span>{{ formatAmt(record?.totalAmount) }}</span>
        </div>
        <span v-show="!record?.totalAmount">-</span>
      </template>
      <!-- 买家支付金额 -->
      <template v-if="column.dataIndex === 'buyerPayAmount'">
        <div v-show="record?.buyerPayAmount">
          <span>{{ record?.currency }}&nbsp;</span>
          <span>{{ formatAmt(record?.buyerPayAmount) }}</span>
        </div>
        <span v-show="!record?.buyerPayAmount">-</span>
      </template>
      <!-- 买家ID/买家邮箱 -->
      <template v-if="column.dataIndex === 'buyerAccountId'">
        <gb-text v-show="record?.buyerAccountId">
          {{ record?.buyerAccountId }}
        </gb-text>
        <gb-text v-show="record?.buyerAccountEmail">
          {{ record?.buyerAccountEmail }}
        </gb-text>
        <span v-show="!(record?.buyerAccountId || record?.buyerAccountEmail)"
          >-</span
        >
      </template>
      <!-- 退款状态/退款总金额-->
      <template v-if="column.dataIndex === 'orderRefundStatus'">
        <div>{{ record?.orderRefundStatus }}</div>
        <div v-show="record?.refundedTotalAmount">
          <span>{{ record?.currency }}&nbsp;</span>
          <span>{{ formatAmt(record?.refundedTotalAmount) }}</span>
        </div>
        <span
          v-show="!(record?.orderRefundStatus || record?.refundedTotalAmount)"
          >-</span
        >
      </template>
      <!-- 订单下单时间 -->
      <template v-if="column.dataIndex === 'orderingTime'">
        <span>
          {{ record?.orderingTime ? utcTimeToBj(record.orderingTime) : "-" }}
        </span>
      </template>
      <!-- 订单付款时间 -->
      <template v-if="column.dataIndex === 'paymentTime'">
        <span>
          {{ record?.paymentTime ? utcTimeToBj(record.paymentTime) : "-" }}
        </span>
      </template>
      <!-- 订单最后更新时间 -->
      <template v-if="column.dataIndex === 'lastUpdatedTime'">
        <span>
          {{
            record?.lastUpdatedTime ? utcTimeToBj(record?.lastUpdatedTime) : "-"
          }}
        </span>
      </template>
      <!-- 操作 -->
      <template v-if="column.dataIndex === 'action'">
        <gj-button
          v-permissions="['ALI/aliAllOrder/info']"
          @click="handleChange(record.orderId)"
          type="text"
          >详情</gj-button
        >
      </template>
    </template>
  </CommonTable>
  <OrderDetail
    :dialogVisible="detailVisible"
    :orderId="orderId"
    @cancel="detailDialogCancel"
  />
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  ref,
  computed,
} from "vue";
import CommonTable from "@/components/CommonTable.vue";
import OrderDetail from "../allOrderDetail.vue";
import dayjs from "dayjs";
import { getOrderList } from "@/api/order/aliExpress";
import columnCopy from "@/components/columnCopy.vue";
import {
  getSoStatus,
  utcTimeToBj,
  openHelp,
} from "@pagesSystem/order/utils/orderUtil";
import { formatAmt } from "@/utils/format";
import { createUuid } from "@/utils/common";
import { setColumn, getClassify } from "@/api/publicColumn.js";
export default defineComponent({
  components: {
    OrderDetail,
    CommonTable,
    columnCopy,
  },
  setup() {
    const mergeRow = ({ record }) => {
      const obj = {
        props: {},
      };
      if (record.rowSSpan > 1) {
        obj.props.rowSpan = record.rowSSpan || 1;
      }
      if (record.rowSpan > 1 && !record.rowSSpan) {
        obj.props.rowSpan = 0;
      }
      return obj;
    };
    const data = reactive({
      setColumn,
      getClassify,
      columnVisible: false, // 自定义弹框
      columnList: [
        // 自定义表格默认展示列
        {
          classifyName: "基础组", // 组类的国际化
          classifyId: "jcz",
          children: [
            {
              dataIndex: "erpShopName", // 列的字段
              label: "店铺", // 列的国际化
              isSelected: true, // 初始化的时候是否被显示
              isFixed: true, // 是否固定
              isDefaultFixed: true, // 是否默认固定
            },
            {
              dataIndex: "platformOrderId",
              label: "平台订单编号",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "platformOrderStatus",
              label: "平台订单状态/取消状态",
              isSelected: true,
              isFixed: false,
            },
            // {
            //   dataIndex: "soOrderNumber",
            //   label: "SO单号",
            //   isSelected: true,
            //   isFixed: false,
            // },
            // {
            //   dataIndex: "saleDirectorName",
            //   label: "销售负责人",
            //   isSelected: true,
            //   isFixed: false,
            // },
            {
              dataIndex: "productMainImageUrl",
              label: "图片",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "productName",
              label: "商品名/商品ID/MSKU",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "productVariations",
              label: "商品属性",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "buyQuantity",
              label: "购买数量",
              isSelected: true,
              isFixed: false,
            },
            // {
            //   dataIndex: "soOrderStatus",
            //   label: "SO状态",
            //   isSelected: true,
            //   isFixed: false,
            // },
            {
              dataIndex: "buyTotalCount",
              label: "购买总数量",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "totalAmount",
              label: "订单总金额",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "buyerPayAmount",
              label: "买家支付金额",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "buyerAccountId",
              label: "买家ID/买家邮箱",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "orderRefundStatus",
              label: "退款状态/退款总金额",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "orderingTime",
              label: "订单下单时间",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "paymentTime",
              label: "订单付款时间",
              isSelected: true,
              isFixed: false,
            },
            {
              dataIndex: "lastUpdatedTime",
              label: "订单最后更新时间",
              isSelected: true,
              isFixed: false,
            },
          ],
        },
      ],
      dayjs: dayjs,
      searchActive: [],
      orderId: null,
      // 统计数据
      summaryData: {
        buyTotalCount: null,
        totalAmount: null,
        buyerPayAmount: null,
      },
      // table
      form: {
        scroll: {
          x: 2000,
          y: 600,
        },
        loading: false, //是否为加载中状态
        noData: false, //无数据
        rowName: "id", //表格行 key 的取值字段
        tableData: [],
        pagination: {
          //分页
          pageCurrent: 1,
          pageSize: 20,
          total: 0,
        },
      },
      filterData: {}, // 参数
      detailVisible: false, // 弹框
      sortParams: [],
      isSort: false,
    });

    const sortedInfo = ref();
    const commonTableRef = ref();
    const columns = computed(() => {
      const arr = [
        {
          title: "序号",
          dataIndex: "sn",
          width: 80,
          fixed: "left",
          isSortColumns: true, // 序号固定在左边，不参与自定义列
          customRender: mergeRow,
        },
        {
          title: "店铺",
          dataIndex: "erpShopName",
          width: 150,
          fixed: "left",
          customRender: mergeRow,
        },
        {
          title: "平台订单编号",
          dataIndex: "platformOrderId",
          width: 160,
          customRender: mergeRow,
        },
        {
          title: "平台订单状态/取消状态",
          dataIndex: "platformOrderStatus",
          width: 220,
          customRender: mergeRow,
        },
        // {
        //   title: "SO单号",
        //   dataIndex: "soOrderNumber",
        //   width: 160,
        //   customRender: mergeRow,
        // },
        // {
        //   title: "销售负责人",
        //   dataIndex: "saleDirectorName",
        //   width: 120,
        // },
        {
          title: "图片",
          dataIndex: "productMainImageUrl",
          width: 60,
        },
        {
          title: "商品名/商品ID/MSKU",
          dataIndex: "productName",
          width: 220,
        },
        {
          title: "商品属性",
          dataIndex: "productVariations",
          width: 180,
        },
        {
          title: "购买数量",
          dataIndex: "buyQuantity",
          width: 120,
        },
        // {
        //   title: "SO状态",
        //   dataIndex: "soOrderStatus",
        //   width: 120,
        //   customRender: mergeRow,
        // },
        {
          title: "购买总数量",
          dataIndex: "buyTotalCount",
          width: 120,
          sorter: true,
          showSorterTooltip: false,
          customRender: mergeRow,
        },
        {
          title: "订单总金额",
          dataIndex: "totalAmount",
          width: 120,
          sorter: true,
          showSorterTooltip: false,
          customRender: mergeRow,
        },
        {
          title: "买家支付金额",
          dataIndex: "buyerPayAmount",
          width: 130,
          sorter: true,
          showSorterTooltip: false,
          customRender: mergeRow,
        },
        {
          title: "买家ID/买家邮箱",
          dataIndex: "buyerAccountId",
          width: 160,
          customRender: mergeRow,
        },
        {
          title: "退款状态/退款总金额",
          dataIndex: "orderRefundStatus",
          width: 160,
          customRender: mergeRow,
        },
        {
          title: "订单下单时间",
          dataIndex: "orderingTime",
          width: 150,
          sorter: true,
          showSorterTooltip: false,
          customRender: mergeRow,
        },
        {
          title: "订单付款时间",
          dataIndex: "paymentTime",
          width: 150,
          sorter: true,
          showSorterTooltip: false,
          customRender: mergeRow,
        },
        {
          title: "订单最后更新时间",
          dataIndex: "lastUpdatedTime",
          width: 150,
          sorter: true,
          showSorterTooltip: false,
          customRender: mergeRow,
        },
        {
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          width: 74,
          isActionColumn: true, // 操作列加这个字段
          customRender: mergeRow,
        },
      ];
      return arr.map((item) => ({
        ...item,
        key: item.dataIndex,
      }));
    });

    // 点击自定义列
    const setting = () => {
      data.columnVisible = true;
    };
    // 自定义列取消
    const handleCancel = () => {
      data.columnVisible = false;
    };

    // 用户操作回调
    const getColumnList = (val) => {
      const selfColumnList = val.selectedList;
      commonTableRef.value.setSelfColumn(selfColumnList);
      data.columnVisible = false;
    };
    // 获取恢复默认设置的回调
    const getResetDef = (val) => {
      commonTableRef.value.getResetDef(val);
      data.columnVisible = false;
    };

    // 表格操作栏详情
    const handleChange = (id) => {
      data.orderId = id;
      data.detailVisible = true;
    };

    // 获取商品属性
    const getProductVariations = (recode) => {
      let res = "";
      if (!(recode && recode?.productVariations?.length)) return;
      recode.productVariations.forEach((item, index) => {
        let name = "";
        index === 0
          ? (name = item.variationAttrValue)
          : (name = "+" + item.variationAttrValue);
        res += name;
      });
      return res;
    };

    // 获取参数更新列表
    const getData = (aData) => {
      data.filterData = { ...aData };
      data.form.pagination.pageCurrent = 1;
      searchTable();
    };

    // 重置pageSize
    const reset = () => {
      data.form.pagination.pageSize = 20;
      sortedInfo.value = null;
      data.isSort = false;
      commonTableRef.value.updateSortOrder(sortedInfo.value);
    };

    // 参数
    const getParams = () => ({
      buyerAccountEmailFuzzySearch:
        data.filterData.buyerAccountEmailFuzzySearch || "",
      buyerAccountEmailExactSearch:
        data.filterData.buyerAccountEmailExactSearch || "",
      buyerAccountIdFuzzySearch:
        data.filterData.buyerAccountIdFuzzySearch || "",
      buyerAccountIdExactSearch:
        data.filterData.buyerAccountIdExactSearch || "",
      mskuFuzzySearch: data.filterData.mskuFuzzySearch || "",
      mskuExactSearch: data.filterData.mskuExactSearch || "",
      productIdFuzzySearch: data.filterData.productIdFuzzySearch || "",
      productIdExactSearch: data.filterData.productIdExactSearch || "",
      productNameFuzzySearch: data.filterData.productNameFuzzySearch || "",
      productNameExactSearch: data.filterData.productNameExactSearch || "",
      regionIds: data.filterData.regionIds || [],
      erpShopIds: data.filterData.erpShopIds || [],
      saleDirectorIds: data.filterData.saleDirectorIds || [],
      erpOrderNumbers: data.filterData.erpOrderNumbers || [],
      platformOrderNumbers: data.filterData.platformOrderNumbers || [],
      platformOrderStatuses: data.filterData.platformOrderStatuses || [],
      soOrderStatuses: data.filterData.soOrderStatuses || [],
      cancelStatuses: data.filterData.cancelStatuses || [],
      refundStatuses: data.filterData.refundStatuses || [],
      orderLastUpdatedEndTime: data.filterData.orderLastUpdatedEndTime || "",
      orderLastUpdatedStartTime:
        data.filterData.orderLastUpdatedStartTime || "",
      orderingStartTime: data.filterData.orderingStartTime || "",
      orderingEndTime: data.filterData.orderingEndTime || "",
      orderPayStartTime: data.filterData.orderPayStartTime || "",
      orderPayEndTime: data.filterData.orderPayEndTime || "",
    });

    // 排序
    const sorterChange = (val) => {
      data.sortParams = [];
      let obj = {};
      if (val.action === "sort") {
        const { order, field } = val.sorter;
        data.isSort = order ? true : false;
        obj.name = field;
        obj.ascSort = order === "ascend" ? true : false;
        data.sortParams.push(obj);
        searchTable();
        sortedInfo.value = val.sorter;
        commonTableRef.value.updateSortOrder(sortedInfo.value);
      }
    };

    // 翻页
    const getTableCurrent = (e) => {
      data.form.pagination.pageCurrent =
        e.pageCurrent || data.form.pagination.pageCurrent;
      data.form.pagination.pageSize =
        e.pageSize || data.form.pagination.pageSize;
      searchTable();
    };

    // 合并行
    const processTableData = (arr) => {
      const result = [];
      arr?.forEach((item) => {
        item.orderId = item.id;
        const { ...rest } = item;
        item.orderLines.forEach((it, index) => {
          result.push({
            ...rest,
            ...it,
            rowKeyId: createUuid(),
            rowSSpan: index <= 0 ? item.orderLines.length : undefined,
            rowSpan: index > 0 ? item.orderLines.length : undefined,
          });
        });
      });
      return result;
    };

    // 获取列表
    const searchTable = () => {
      const queryCondition = getParams();
      let params = {
        pageCurrent: data.form.pagination.pageCurrent,
        pageSize: data.form.pagination.pageSize,
        queryCondition: queryCondition,
      };
      // 是否有排序，无排序不传该字段
      if (data.isSort) {
        params.sortItems = data.sortParams;
      }
      data.form.loading = true;
      getOrderList(params)
        .then((res) => {
          if (res.code === 0) {
            data.form.tableData = processTableData(res.data?.records) || [];
            data.form.pagination.total = res.data?.total || 0;
          }
        })
        .finally(() => {
          data.form.loading = false;
        });
    };

    // 关闭详情
    const detailDialogCancel = () => {
      data.detailVisible = false;
    };
    onBeforeMount(() => {
      // searchTable();
    });

    return {
      ...toRefs(data),
      columns,
      commonTableRef,
      handleChange,
      sorterChange,
      detailDialogCancel,
      getTableCurrent,
      getData,
      getProductVariations,
      getSoStatus,
      createUuid,
      formatAmt,
      reset,
      handleCancel,
      getColumnList,
      getResetDef,
      setting,
      utcTimeToBj,
      openHelp,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@pagesSystem/order/css/orderPublic.scss";
</style>
