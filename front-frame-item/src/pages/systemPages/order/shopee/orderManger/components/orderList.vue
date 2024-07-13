<template>
  <CommonPage
    ref="commonPageRef"
    :pageRest="true"
    :advanceSearch="true"
    @common-page-rest="resetSearchData"
    @popconfirmOk="popconfirmOk"
    @popconfirmVisibleChange="getVisibleChange"
    :currentRouterPermission="'SHPE/shopeeAllOrder/view'"
  >
    <!-- 默认视图 -->
    <template #tag-content>
      <gb-default-view
        :id="'SHOPEE_shopeeOrder_view'"
        :code="0"
        :get-list="getList"
        :post-list="postList"
        :query-map="queryMap"
        @del-query-condition="delQueryCondition"
        @change-query-list="changeQueryList"
      >
      </gb-default-view>
    </template>
    <!-- 搜索 -->
    <template #filter-content>
      <FilterCondition
        ref="orderShopeeFilter"
        @filter-change="filterChange"
        @tag-change="tagChange"
      ></FilterCondition>
    </template>
    <!-- 高级筛选 -->
    <template #advanceSearchContent>
      <div class="advance-search">
        <gj-input-group class="tag-time-search">
          <gj-tag size="large" class="rangePickerStyle">付款日期</gj-tag>
          <appRangePicker v-model="queryCondition.payTime"></appRangePicker>
        </gj-input-group>

        <gj-input-group class="tag-time-search">
          <gj-tag size="large" class="rangePickerStyle">最后更新日期</gj-tag>
          <appRangePicker v-model="queryCondition.fetchTime"></appRangePicker>
        </gj-input-group>

        <gj-select
          :trigger-props="{ autoFitPopupMinWidth: true }"
          :max-tag-count="1"
          placeholder="退款状态"
          multiple
          allow-clear
          v-model="queryCondition.refundStatuses"
        >
          <gj-option
            v-for="item in option.refundStatusList"
            :key="item.statusCode"
            :value="item.statusCode"
            >{{ item.statusName }}</gj-option
          >
        </gj-select>

        <gj-select
          :trigger-props="{ autoFitPopupMinWidth: true }"
          :max-tag-count="1"
          placeholder="取消状态"
          multiple
          allow-clear
          v-model="queryCondition.cancelStatuses"
        >
          <gj-option
            v-for="item in option.cancelStatusList"
            :key="item.statusCode"
            :value="item.statusCode"
            >{{ item.statusName }}</gj-option
          >
        </gj-select>
      </div>
    </template>
    <!-- 操作 -->
    <template #operate_bar-content>
      <OperateBar @setting="settingColumn" :setCustomVisiable="true">
      </OperateBar>
    </template>
    <template #table-content>
      <TableGroup ref="orderShopeeTable"></TableGroup>
    </template>
  </CommonPage>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  getCurrentInstance,
} from "vue";
import CommonPage from "@/components/CommonPage.vue";
import FilterCondition from "./FilterCondition.vue";
import TableGroup from "./TableGroup.vue";
import { setDefaultView, getDefaultView } from "@/api/publicColumn";
import OperateBar from "@/components/OperateBar.vue";
import appRangePicker from "@/components/AppRangePicker.vue";
import { getCancelStatus, getRefundStatus } from "@/api/order/shopee";

export default defineComponent({
  components: {
    TableGroup,
    FilterCondition,
    CommonPage,
    OperateBar,
    appRangePicker,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      getList: getDefaultView,
      postList: setDefaultView,
      queryMap: {
        key: "",
        value: "",
        connectCode: "",
        code: "",
        cascadeKey: "",
        extra: {},
      },
      // 高级搜索
      queryCondition: {
        refundStatuses: [],
        cancelStatuses: [],
        payTime: [],
        fetchTime: [],
      },
      saveQueryCondition: {
        refundStatuses: [],
        cancelStatuses: [],
        payTime: [],
        fetchTime: [],
      },
      option: {
        refundStatusList: [],
        cancelStatusList: [],
      },
    });
    // 高级搜索确认
    const popconfirmOk = () => {
      Object.keys(data.queryCondition).forEach((key) => {
        data.saveQueryCondition[key] = data.queryCondition[key];
      });
      proxy.$refs.orderShopeeFilter?.advanceSearchChange(
        data.queryCondition,
        data.option
      );
    };

    // 高级搜索弹框change
    const getVisibleChange = (val) => {
      if (val) {
        // 确认
        Object.keys(data.saveQueryCondition).forEach((key) => {
          data.saveQueryCondition[key] = data.queryCondition[key];
        });
      } else {
        // 关闭
        Object.keys(data.queryCondition).forEach((key) => {
          data.queryCondition[key] = data.saveQueryCondition[key];
        });
      }
    };

    // 设置自定义列
    const settingColumn = () => {
      proxy.$refs.orderShopeeTable?.setting();
    };

    // 搜索关联table
    const filterChange = (data) => {
      proxy.$refs.orderShopeeTable?.getData(data);
    };

    // 重置
    const resetSearchData = () => {
      data.queryMap = {}; // 此处不用重置搜索条件等，会触发默认视图回显，有清空及高度计算
    };

    // 重置高级搜索条件
    const resetAdvanceSearch = () => {
      data.queryCondition = {
        refundStatuses: [],
        cancelStatuses: [],
        payTime: [],
        fetchTime: [],
      };
      data.saveQueryCondition = {
        refundStatuses: [],
        cancelStatuses: [],
        payTime: [],
        fetchTime: [],
      };
    };

    // 关联默认视图tag
    const tagChange = (params) => {
      Object.assign(data.queryMap, params);
      proxy.$refs.orderShopeeTable?.$refs?.commonTableRef?.calculateWH();
    };

    // 默认视图删除
    const delQueryCondition = (val) => {
      console.log(val, "默认视图删除");
      const { connectCode, extra } = val;
      // 高级搜索处理
      if (extra.isAdvance) {
        data.queryCondition[connectCode] = [];
        data.saveQueryCondition[connectCode] = [];
      }
      // 搜索及参数处理
      proxy.$refs.orderShopeeFilter?.changeFilterCondition(val);
      // 计算table高度
      proxy.$refs.orderShopeeTable?.$refs?.commonTableRef?.calculateWH();
    };

    // 保存视图回显
    const changeQueryList = (val) => {
      console.log(val, "保存视图回显");
      // 1、重置方法
      resetAdvanceSearch();
      proxy.$refs.orderShopeeTable?.reset();
      if (val && val.length) {
        val.forEach((item) => {
          const { code, connectCode, extra } = item;
          // 高级搜索回显
          if (extra.isAdvance) {
            data.queryCondition[connectCode] = code;
            data.saveQueryCondition[connectCode] = code;
          }
        });
        proxy.$refs.orderShopeeFilter?.reset(false);
        // 2、重新赋值
        proxy.$refs.orderShopeeFilter?.changeQueryList(val);
      } else {
        proxy.$refs.orderShopeeFilter?.reset(true);
      }
      // 3.计算table高度
      proxy.$refs.orderShopeeTable?.$refs?.commonTableRef?.calculateWH();
    };

    // 获取退款状态
    const toGetRefundStatus = async () => {
      const res = await getRefundStatus();
      data.option.refundStatusList = res.data;
    };

    // 获取取消状态
    const toGetCancelStatus = async () => {
      const res = await getCancelStatus();
      data.option.cancelStatusList = res.data;
    };

    onBeforeMount(() => {
      toGetRefundStatus();
      toGetCancelStatus();
    });

    return {
      ...toRefs(data),
      filterChange,
      resetSearchData,
      tagChange,
      delQueryCondition,
      changeQueryList,
      settingColumn,
      popconfirmOk,
      getVisibleChange,
      resetAdvanceSearch,
    };
  },
});
</script>

<style lang="scss" scoped>
.advance-search {
  width: 320px;
  box-sizing: border-box;
}
:deep(.arco-tag).rangePickerStyle {
  width: max-content !important;
  overflow: inherit;
  color: #1d2129;
}
</style>
