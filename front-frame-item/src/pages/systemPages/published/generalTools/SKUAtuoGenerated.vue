<template>
  <div class="header-tips">
    <gj-alert>未设置店铺规则时，系统将会按照默认规则生成店铺SKU</gj-alert>
  </div>
  <CommonPage
    :pageRest="true"
    @common-page-rest="resetSearch"
    currentRouterPermission="PLAT/SKUAtuoGenerated/view"
  >
    <template #filter-content>
      <gj-select
        v-model="searchData.platformCode"
        placeholder="平台"
        @change="changePlatform"
        class="search-select"
      >
        <gj-option
          v-for="item in platformList"
          :value="item.id"
          :key="item.id"
          >{{ item.cnName }}</gj-option
        >
      </gj-select>
      <gj-select
        class="search-select"
        v-model="searchData.shopCode"
        placeholder="店铺"
        @change="changeShopCode"
      >
        <gj-option
          v-for="item in shopList"
          :value="item.shopCode"
          :key="item.shopCode"
          >{{ item.shopName }}</gj-option
        >
      </gj-select>
      <gj-select
        class="search-select"
        v-model="searchData.status"
        placeholder="状态"
        @change="changeStatus"
      >
        <gj-option
          v-for="item in statusList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</gj-option
        >
      </gj-select>
    </template>
    <template #operate_bar-content>
      <OperateBar>
        <template #left>
          <gj-button
            type="primary"
            @click="multiEdit"
            v-permissions="['PLAT/SKUAtuoGenerated/edit']"
            >批量编辑</gj-button
          >
          <gj-popconfirm
            trigger="click"
            show-arrow
            position="bl"
            :popup-translate="[10, 12]"
            :popup-style="{ background: '#fff' }"
            :popup-visible="showCancelTrigger"
            @popup-visible-change="popupVisibleChange"
            @ok="multiCancel"
            @cancel="showCancelTrigger = false"
          >
            <gj-button
              type="plain"
              @click="multiCancelMsg"
              v-permissions="['PLAT/SKUAtuoGenerated/cancel']"
              >批量取消</gj-button
            >
            <template #content>
              <p>取消后将按照默认规则生成店铺SKU，是否取消？</p>
            </template>
          </gj-popconfirm>
          <div class="total-wrap">
            已选<span class="total">{{
              rowSelection.selectedRowKeys.length
            }}</span>
          </div>
        </template>
      </OperateBar>
    </template>
    <template #table-content>
      <CommonTable
        :columns="columns"
        :tableData="tableData"
        row-key="shopCode"
        :disabledLine="{ key: 'ruleTypeName', value: '默认规则' }"
        :scroll="scroll"
        :rowSelectionVisiable="true"
        :selectedRowKeys="rowSelection.selectedRowKeys"
        :pagination="paginationProps"
        @onRowSelection="handleSelectionChange"
        @getTableCurrent="pageChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <gj-badge
              :status="
                record.status == 1
                  ? 'processing'
                  : record.status == 2
                  ? 'success'
                  : ''
              "
              :text="record.statusName"
            />
          </template>
          <template v-if="column.dataIndex === 'platformCode'">
            <span>{{ translatePlatform(record.platformCode) }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <gj-button
              type="text"
              @click="handleEdit(record)"
              v-permissions="['PLAT/SKUAtuoGenerated/edit']"
            >
              编辑
            </gj-button>
            <commonPopconfirm
              content="取消后将按照默认规则生成店铺SKU，是否取消？"
              @ok="handleCancel(record)"
            >
              <gj-button
                v-permissions="['PLAT/SKUAtuoGenerated/cancel']"
                :disabled="record?.ruleType === 1"
                type="text"
                >取消</gj-button
              >
            </commonPopconfirm>
          </template>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <div id="skuGeneratedModal">
    <gj-modal
      v-model:visible="dialogVisible"
      :title="formTitle"
      :unmount-on-close="true"
      :render-to-body="false"
      :closable="false"
      width="800px"
      @close="resetData"
    >
      <template #title>
        <div class="modal-title">
          <h4>规则编辑</h4>
          <SvgIcon svgClass="close" :width="16" @click="resetData" />
        </div>
      </template>
      <sku-rules v-model:skuRules="skuRules"></sku-rules>
      <template #footer>
        <div class="footer-btn">
          <gj-button type="plain" @click="resetData">取消</gj-button>
          <gj-button type="primary" @click="submitData">确定</gj-button>
        </div>
      </template>
    </gj-modal>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import {
  getAllPlatformList,
  getShopByCondition,
  getSkuRuleData,
  editSkuRule,
  cancelSkuRule,
} from "@/api/published/generalTools";
import SkuRules from "./components/skuRulesComponent.vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import OperateBar from "@/components/OperateBar.vue";
import commonPopconfirm from "@/components/commonPopconfirm.vue";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  name: "SKUAtuoGenerated",
  components: {
    SkuRules,
    CommonTable,
    SvgIcon,
    CommonPage,
    OperateBar,
    commonPopconfirm,
  },
  setup() {
    const data = reactive({
      platformList: [], // 平台数据
      searchData: {
        platformCode: "",
        status: "", // 状态所选值
        shopCode: "", // 店铺所选值
      }, // 查询参数
      statusList: [
        { value: "1", label: "未设置" },
        { value: "2", label: "已设置" },
      ], // 状态下拉数据
      shopList: [], // 店铺下拉数据
      tableData: [], // 表格内容数据
      columns: [
        {
          title: "规则类型",
          dataIndex: "ruleTypeName",
        },
        {
          title: "平台",
          dataIndex: "platformCode",
        },
        {
          title: "店铺",
          dataIndex: "shopName",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
        },
        {
          title: "更新时间",
          dataIndex: "updatedTime",
        },

        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 200,
        },
      ], // 表格列
      formTitle: "规则编辑",
      dialogVisible: false,
      skuRules: {
        parentRule: [], // 父SKU列表数据
        sonRule: [], // 子SKU列表数据
        parentRuleStr: "",
        sonRuleStr: "",
        ruleType: "",
        others: [],
        shopCode: "",
      }, // 设置有关联SKU规则数据
      rowSelection: {
        selectedRowKeys: [], // 表格多选数据
      }, // 表格行选择配置项
      paginationProps: {
        pageCurrent: 1,
        pageSize: 20,
        total: 0,
      }, // 分页配置项
      scroll: {
        x: 1100,
        y: 0,
      }, // 表格滚动属性
      showCancelTrigger: false, // 是否显示批量取消的trigger
    });
    // 批量编辑
    const multiEdit = () => {
      if (data.rowSelection.selectedRowKeys.length === 0) {
        GjMessage.warning("至少选择一条要操作的记录");
      } else {
        data.dialogVisible = true;
        const tempArr = data.tableData.filter((item) =>
          data.rowSelection.selectedRowKeys.includes(item.shopCode)
        );
        console.log(tempArr);
        data.skuRules.ruleType = 2;
        data.skuRules.others = tempArr.map((item) => {
          return {
            platformCode: item.platformCode,
            shopCode: item.shopCode,
          };
        });
      }
    };
    // 批量取消按钮点击事件
    const multiCancelMsg = () => {
      if (data.rowSelection.selectedRowKeys?.length === 0) {
        GjMessage.warning("至少选择一条要操作的记录");
      } else {
        data.showCancelTrigger = true;
      }
    };
    const popupVisibleChange = (val) => {
      if (!val) {
        data.showCancelTrigger = val;
      }
    };
    // 批量取消
    const multiCancel = () => {
      let params = {
        shopCode: data.rowSelection.selectedRowKeys.join(","),
      };
      cancelSkuRule(params).then((res) => {
        GjMessage.success(res.message || "批量取消成功");
        data.showCancelTrigger = false;
        searchTable();
      });
    };
    // 表格多选回调监听事件
    const handleSelectionChange = (val) => {
      data.rowSelection.selectedRowKeys = val.map((item) => item.shopCode);
      console.log("handleSelectionChange");
    };
    // 表格操作栏取消
    const handleCancel = (item) => {
      let params = {
        shopCode: item.shopCode,
      };
      cancelSkuRule(params).then((res) => {
        GjMessage.success(res.message || "取消成功");
        searchTable();
      });
    };
    // 表格操作栏编辑
    const handleEdit = (item) => {
      Object.assign(data.skuRules, item.detail || {}, {
        ruleType: item.ruleType,
      });
      data.skuRules.others = [
        {
          shopCode: item.shopCode,
          platformCode: item.platformCode,
        },
      ];
      console.log(data.skuRules);
      data.dialogVisible = true;
    };
    // 列表查询方法
    const searchTable = () => {
      let params = {
        ...data.searchData,
        pageCurrent: data.paginationProps.pageCurrent,
        pageSize: data.paginationProps.pageSize,
      };
      console.log(params);
      // 调用查询接口
      getSkuRuleData(params).then((res) => {
        data.tableData = res.data.records;
        data.tableData[0] ? (data.tableData[0]["disabled"] = true) : "";
        data.paginationProps.total = res.data.total;
        data.rowSelection.selectedRowKeys = [];
      });
    };
    // 列表重置方法
    const resetSearch = () => {
      for (const key in data.searchData) {
        data.searchData[key] = "";
      }
      searchTable();
    };
    // 弹窗关闭回调监听事件
    const resetData = () => {
      data.dialogVisible = false;
      for (const key in data.skuRules) {
        data.skuRules[key] = key !== "id" ? [] : undefined;
      }
    };
    // 提交弹窗数据
    const submitData = () => {
      console.log(data.skuRules);
      if (
        data.skuRules.parentRule.length === 0 ||
        data.skuRules.sonRule.length === 0
      ) {
        GjMessage.warning("规则不能为空！");
        return false;
      }
      // 保存接口，清除数据
      editSkuRule(data.skuRules).then((res) => {
        data.dialogVisible = false;
        GjMessage.success(res.message || "编辑成功");
        searchTable();
      });
    };
    // 分页当前页变化
    const pageChange = (e) => {
      data.paginationProps = {
        ...data.paginationProps,
        pageCurrent: e.pageCurrent || data.paginationProps.pageCurrent,
        pageSize: e.pageSize || data.paginationProps.pageSize,
      };
      // 查询接口
      searchTable();
    };
    // 平台切换事件
    const changePlatform = () => {
      data.searchData.shopCode = "";
      getShopList();
      searchTable();
    };
    // 店铺切换事件
    const changeShopCode = () => {
      searchTable();
    };
    // 状态切换事件
    const changeStatus = () => {
      searchTable();
    };
    // 获取平台数据
    const getPlatformList = () => {
      getAllPlatformList().then((res) => {
        data.platformList = res.data;
      });
    };
    // 获取店铺数据
    const getShopList = async () => {
      let params = {
        platformCode: data.searchData.platformCode,
      };
      const res = await getShopByCondition(params);
      data.shopList = res.data;
    };
    // 转换表格的平台字段
    const translatePlatform = (val) => {
      if (!val) return "-";
      return data.platformList.filter((item) => item.id === val)[0]?.cnName;
    };
    onMounted(() => {
      getPlatformList();
      searchTable();
    });
    return {
      ...toRefs(data),
      multiEdit,
      multiCancel,
      multiCancelMsg,
      handleSelectionChange,
      handleCancel,
      handleEdit,
      searchTable,
      resetSearch,
      resetData,
      submitData,
      pageChange,
      changePlatform,
      changeShopCode,
      changeStatus,
      popupVisibleChange,
      translatePlatform,
    };
  },
});
</script>
<style scoped lang="scss">
.header-tips {
  padding: 12px 20px 0 20px;
}
.gj-common-layout {
  padding: 8px 0;
  &.border {
    border-bottom: 1px solid #f2f2f5;
  }
}
.query-condition {
  display: flex;
  gap: 8px;
  padding: 4px 8px;
  background: #f2f6fe;
  border-radius: 20px;
  color: #0045f0;
  align-items: center;
  svg {
    cursor: pointer;
    color: #b3b4c1;
  }
}
.total-wrap {
  font-size: 12px;
  color: #86909c;
  .total {
    color: #1f6eef;
    margin-left: 2px;
  }
}
.error-tips {
  background: #fdf2ea;
  border-radius: 4px;
  font-size: 12px;
  color: #ee7c30;
  padding: 12px 16px;
}
.modal-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  svg {
    cursor: pointer;
  }
}
.footer-btn {
  display: flex;
  justify-content: end;
  gap: 12px;
}
</style>
