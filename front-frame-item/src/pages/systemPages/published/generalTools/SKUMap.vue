<template>
  <CommonPage
    :pageRest="true"
    @common-page-rest="resetSearch"
    currentRouterPermission="PLAT/SKUMap/view"
  >
    <template #filter-content>
      <gj-select
        class="search-select"
        v-model="searchData.platformCode"
        placeholder="平台"
        @change="changePlatform('search')"
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
        v-model="searchData.stationCode"
        placeholder="站点"
        @change="changeStation('search')"
      >
        <gj-option
          v-for="item in siteList"
          :value="item.regionCode"
          :key="item.regionCode"
          >{{ item.regionCnName }}</gj-option
        >
      </gj-select>
      <gj-select
        class="search-select"
        v-model="searchData.shopCode"
        placeholder="店铺"
        @change="searchTable"
      >
        <gj-option
          v-for="item in shopList"
          :value="item.shopCode"
          :key="item.shopCode"
          >{{ item.shopName }}</gj-option
        >
      </gj-select>
      <gj-input-group>
        <gj-select
          class="search-select-left"
          v-model="searchData.skuType"
          placeholder="请选择"
          @change="searchTable"
        >
          <gj-option
            v-for="item in skuTypeList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</gj-option
          >
        </gj-select>
        <gj-input-search
          class="search-select-rigth"
          v-model="searchData.sku"
          placeholder="请输入"
          @search="searchTable"
        >
        </gj-input-search>
      </gj-input-group>
    </template>
    <template #operate_bar-content>
      <OperateBar>
        <template #left>
          <gj-button
            type="primary"
            @click="create"
            v-permissions="['PLAT/SKUAtuoGenerated/add']"
            >创建SKU映射</gj-button
          >
          <gj-popconfirm
            trigger="click"
            show-arrow
            position="bl"
            type="warning"
            :ok-button-props="okBtnProps"
            :popup-style="{ background: '#fff' }"
            :popup-visible="showTriggerModal"
            @popup-visible-change="popupVisibleChange"
            @ok="multiDel"
            @cancel="showTriggerModal = false"
          >
            <gj-button
              type="plain"
              @click="showDelMsg"
              v-permissions="['PLAT/SKUAtuoGenerated/delete']"
              >批量删除</gj-button
            >
            <template #content>
              <p>此操作不可逆，是否确认删除？</p>
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
        row-key="id"
        :scroll="scroll"
        :rowSelectionVisiable="true"
        :selectedRowKeys="rowSelection.selectedRowKeys"
        :pagination="paginationProps"
        @onRowSelection="handleSelectionChange"
        @getTableCurrent="pageChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'platformCode'">
            <span>{{ translatePlatform(record.platformCode) }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <gj-button
              type="text"
              @click="handleEdit(record)"
              v-permissions="['PLAT/SKUAtuoGenerated/edit']"
              >编辑</gj-button
            >
            <commonPopconfirm
              content="此操作不可逆，是否确认删除？"
              :ok-button-props="okBtnProps"
              type="warning"
              @ok="handleDel(record?.id)"
            >
              <gj-button
                type="text"
                v-permissions="['PLAT/SKUAtuoGenerated/delete']"
                >删除</gj-button
              >
            </commonPopconfirm>
          </template>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <!-- 创建/编辑 弹窗 -->
  <div id="skuModal">
    <gj-modal
      v-model:visible="showFormDialog"
      :unmount-on-close="true"
      :closable="false"
      :footer="false"
      :render-to-body="false"
      width="600px"
    >
      <template #title>
        <div class="modal-title">
          <h4>{{ formTitle }}</h4>
          <SvgIcon svgClass="close" :width="16" @click="resetData" />
        </div>
      </template>
      <gj-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        size="small"
        layout="vertical"
      >
        <gj-form-item label="平台：" field="platformCode">
          <gj-select
            v-model="formData.platformCode"
            size="small"
            placeholder="请选择"
            class="formSelect"
            @change="changePlatform('form')"
            :disabled="formData.type === 'edit'"
          >
            <gj-option
              v-for="item in platformList"
              :value="item.id"
              :key="item.id"
              >{{ item.cnName }}</gj-option
            >
          </gj-select>
        </gj-form-item>
        <gj-form-item
          label="站点："
          field="stationCode"
          v-if="formSiteList.length"
        >
          <gj-select
            v-model="formData.stationCode"
            size="small"
            placeholder="请选择"
            class="formSelect"
            :disabled="!formData.platformCode || formData.type === 'edit'"
            @change="changeStation('form')"
          >
            <gj-option
              v-for="item in formSiteList"
              :value="item.regionCode"
              :key="item.regionCode"
              >{{ item.regionCnName }}</gj-option
            >
          </gj-select>
        </gj-form-item>
        <gj-form-item label="店铺：" field="shopCode">
          <gj-select
            v-model="formData.shopCode"
            size="small"
            placeholder="请选择"
            class="formSelect"
            :disabled="!formData.platformCode || formData.type === 'edit'"
            @change="changeFormShopCode"
          >
            <gj-option
              v-for="item in formShopList"
              :value="item.shopCode"
              :key="item.shopCode"
              >{{ item.shopName }}</gj-option
            >
          </gj-select>
        </gj-form-item>
        <gj-form-item field="shopSku" label="店铺SKU：">
          <gj-input
            v-model="formData.shopSku"
            size="small"
            placeholder="请输入"
            class="formInput"
            :disabled="formData.type === 'edit'"
          ></gj-input>
        </gj-form-item>
        <div class="connect-sku">
          <div class="title">
            <h3>关联SKU<span>*</span></h3>
            <gj-button
              type="text"
              size="small"
              @click="selectSku"
              style="cursor: pointer; margin-left: 12px"
              >选择SKU</gj-button
            >
          </div>
          <p :class="{ active: formData.inventorySku }">
            {{ formData.inventorySku ? formData.inventorySku : "暂未关联SKU" }}
          </p>
        </div>
      </gj-form>
      <div class="dalogFromBtn">
        <gj-button type="plain" @click="resetData">取消</gj-button>
        <gj-button type="primary" @click="submitData">确定</gj-button>
      </div>
    </gj-modal>
    <!-- 选择SKU 弹窗 -->
    <gj-modal
      v-model:visible="showSkuDialog"
      title="选择SKU"
      :unmount-on-close="true"
      :render-to-body="false"
      :footer="false"
      width="700px"
      @close="cancelSelectSku"
    >
      <sku-select
        @chooseSkuCb="chooseSkuCb"
        @closeSelectSku="cancelSelectSku"
      ></sku-select>
    </gj-modal>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import OperateBar from "@/components/OperateBar.vue";
import SkuSelect from "./components/skuSelect.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import commonPopconfirm from "@/components/commonPopconfirm.vue";
import {
  getAllPlatformList,
  getRegionListByPlatformId,
  getShopByCondition,
  getSkuMappingList,
  saveSkuMappingData,
  updateSkuMappingData,
  deleteSkuMappingData,
} from "@/api/published/generalTools";
import { GjMessage } from "@gj/atom";
// import { copy } from '@common'
export default defineComponent({
  name: "SKUMap",
  components: {
    CommonPage,
    SkuSelect,
    SvgIcon,
    CommonTable,
    OperateBar,
    commonPopconfirm,
  },
  setup() {
    const formRef = ref();
    const data = reactive({
      okBtnProps: {
        status: "danger",
      },
      platformList: [], // 平台数据
      searchData: {
        platformCode: "",
        stationCode: "", // 站点所选值
        shopCode: "", // 店铺所选值
        skuType: "1", // sku类型
        sku: "", // sku
        inventorySku: "", // 库存sku
      }, // 查询参数
      siteList: [], // 列表搜索的站点下拉数据
      shopList: [], // 列表搜索的店铺下拉数据
      skuTypeList: [
        { value: "1", label: "店铺SKU" },
        { value: "2", label: "SKU" },
      ], // sku类型下拉数据
      formTitle: "创建SKU映射",
      showFormDialog: false, // 创建/编辑弹窗 控制
      showSkuDialog: false, // 选择SKU弹窗  控制
      formData: {
        platformCode: "",
        stationCode: "",
        stationName: "",
        shopCode: "",
        shopName: "",
        shopSku: "",
        inventorySku: "",
        type: "add",
      }, // 创建/编辑 弹窗表单数据
      formSiteList: [], // 创建/编辑 弹窗的站点下拉数据
      formShopList: [], // 创建/编辑 弹窗的店铺下拉数据
      rules: {
        platformCode: { required: true, message: "请选择平台" },
        stationCode: { required: true, message: "请选择站点" },
        shopCode: { required: true, message: "请选择店铺" },
        shopSku: [
          { required: true, message: "请输入店铺SKU" },
          { minLength: 5, message: "店铺SKU不少于5个字符" },
        ],
      },
      tableData: [], // 表格数据
      columns: [
        {
          title: "平台",
          dataIndex: "platformCode",
        },
        {
          title: "站点",
          dataIndex: "stationName",
        },
        {
          title: "店铺",
          dataIndex: "shopName",
        },
        {
          title: "店铺SKU",
          dataIndex: "shopSku",
        },
        {
          title: "SKU",
          dataIndex: "inventorySku",
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
      showTriggerModal: false, // 是否显示批量删除的弹窗
    });

    // 创建
    const create = () => {
      data.formData.type = "add";
      data.showFormDialog = true;
    };
    // 批量删除
    const multiDel = () => {
      data.showTriggerModal = false;
      let params = {
        ids: data.rowSelection.selectedRowKeys.join(","),
      };
      deleteSkuMappingData(params).then((res) => {
        console.log(res);
        GjMessage.success("删除成功");
        searchTable();
      });
    };
    // 表格多选回调监听事件
    const handleSelectionChange = (val) => {
      data.rowSelection.selectedRowKeys = val.map((item) => item.id);
    };
    // 表格操作栏删除
    const handleDel = (id) => {
      deleteSkuMappingData({ ids: id }).then((res) => {
        console.log(res);
        GjMessage.success("删除成功");
        searchTable();
      });
    };
    // 表格操作栏编辑
    const handleEdit = (obj) => {
      console.log("handleEdit");
      data.formTitle = "编辑SKU映射";
      Object.assign(data.formData, obj);
      data.formData.type = "edit";
      data.showFormDialog = true;
    };
    // 列表查询方法
    const searchTable = () => {
      let params = {
        ...data.searchData,
        pageNo: data.paginationProps.pageCurrent,
        pageSize: data.paginationProps.pageSize,
      };
      getSkuMappingList(params).then((res) => {
        console.log(res);
        data.paginationProps.total = res.data.total;
        data.tableData = res.data.records;
      });
    };
    // 列表重置方法
    const resetSearch = () => {
      for (const key in data.searchData) {
        data.searchData[key] = key === "skuType" ? "1" : "";
      }
      searchTable();
    };
    // 弹窗关闭回调监听事件
    const resetData = () => {
      data.showFormDialog = false;
      delete data.formData.id;
      for (const key in data.formData) {
        data.formData[key] = key === "type" ? data.formData.type : "";
      }
      console.log(data.formData);
    };
    // 提交弹窗数据
    const submitData = () => {
      formRef.value.validate().then((valid) => {
        if (!valid) {
          if (!data.formData.inventorySku) {
            GjMessage.error("关联SKU不能为空");
            return false;
          }
          // 请求接口
          let fn =
            data.formData.type === "add"
              ? saveSkuMappingData
              : updateSkuMappingData;
          fn(data.formData).then((res) => {
            resetData();
            GjMessage.success(
              res.message || data.formData.type === "add"
                ? "创建成功"
                : "编辑成功"
            );
            searchTable();
          });
        }
      });
    };
    // 选择sku
    const selectSku = () => {
      data.showSkuDialog = true;
    };
    // 监听选择sku回调
    const chooseSkuCb = (val) => {
      data.showSkuDialog = false;
      data.formData.inventorySku = val;
    };
    // 取消选择sku的回调事件
    const cancelSelectSku = () => {
      data.showSkuDialog = false;
    };
    // 获取创建/编辑弹窗下的站点列表
    const changePlatform = (type) => {
      // 参数data.formData.platform
      // 值 data.formSiteList
      // 请求站点数据
      if (type === "search") {
        getRegionList(data.searchData.platformCode, type);
        data.searchData.stationCode = "";
      } else {
        getRegionList(data.formData.platformCode, type);
      }
    };
    // 获取创建/编辑下的站点列表
    const changeStation = (type) => {
      // 参数data.formData.stationCode
      // 值 data.formShopList
      // 请求店铺数据
      if (type === "search") {
        getShopList(
          data.searchData.platformCode,
          data.searchData.stationCode,
          type
        );
        data.searchData.shopCode = "";
      } else {
        data.formData.stationName = data.formSiteList.filter(
          (item) => item.regionCode === data.formData.stationCode
        )[0]?.regionCnName;
        getShopList(
          data.formData.platformCode,
          data.formData.stationCode,
          type
        );
      }
    };
    // 获取店铺名
    const changeFormShopCode = (val) => {
      data.formData.shopName = data.formShopList.filter(
        (item) => item.shopCode === val
      )[0]?.shopName;
    };
    // 分页当前页变化
    const pageChange = (e) => {
      data.paginationProps = {
        ...data.paginationProps,
        pageCurrent: e.pageCurrent,
        pageSize: e.pageSize,
      };
      // 查询接口
      searchTable();
    };
    // 批量编辑按钮点击事件
    const showDelMsg = () => {
      if (data.rowSelection.selectedRowKeys?.length < 1) {
        GjMessage.warning("请先在表格中选择一个项目");
        return false;
      } else {
        data.showTriggerModal = true;
      }
    };
    // 获取平台数据
    const getPlatformList = () => {
      getAllPlatformList().then((res) => {
        console.log(res);
        data.platformList = res.data;
      });
    };
    // 获取站点数据
    const getRegionList = async (code, type) => {
      const res = await getRegionListByPlatformId({ platformCode: code });
      type === "search"
        ? (data.siteList = res.data)
        : (data.formSiteList = res.data);
      changeStation(type);
    };
    // 获取店铺数据
    const getShopList = async (platformCode, stationCode, type) => {
      let params = {
        platformCode: platformCode,
        stationCode: stationCode,
      };
      const res = await getShopByCondition(params);
      if (type === "search") {
        data.shopList = res.data;
        searchTable();
      } else {
        data.formShopList = res.data;
      }
    };
    // 转换表格的平台字段
    const translatePlatform = (val) => {
      if (!val) return "-";
      return data.platformList.filter((item) => item.id === val)[0]?.cnName;
    };
    const popupVisibleChange = (val) => {
      if (!val) {
        data.showTriggerModal = val;
      }
    };
    onMounted(() => {
      getPlatformList();
      searchTable();
    });
    return {
      formRef,
      ...toRefs(data),
      create,
      multiDel,
      handleEdit,
      handleDel,
      handleSelectionChange,
      resetSearch,
      resetData,
      submitData,
      selectSku,
      chooseSkuCb,
      cancelSelectSku,
      changePlatform,
      changeStation,
      pageChange,
      showDelMsg,
      changeFormShopCode,
      searchTable,
      translatePlatform,
      popupVisibleChange,
    };
  },
});
</script>
<style scoped lang="scss">
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
.trigger-modal {
  box-shadow: 1px 0px 10px 4px #0000001a;
  background: #fff;
  width: 300px;
  .popconfirm-top {
    display: flex;
    justify-content: space-between;
    padding: 8px 16px;
    border-bottom: 1px solid #e6e6ed;
    svg {
      cursor: pointer;
    }
  }
  .popconfirm-content {
    padding: 16px;
    font-size: 12px;
    color: #000;
    border-bottom: 1px solid #e6e6ed;
  }
  .popconfirm-footer {
    display: flex;
    justify-content: end;
    padding: 8px 16px;
    gap: 12px;
  }
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
.connect-sku {
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e6e6ed;
  box-sizing: border-box;
  border-radius: 8px;
  font-size: 12px;
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    h3 {
      display: flex;
      align-items: center;
      span {
        color: red;
      }
    }
  }
  p {
    color: #808197;
    &.active {
      color: #000;
      font-weight: 700;
    }
  }
}
.dalogFromBtn {
  display: flex;
  justify-content: end;
  gap: 12px;
  margin-top: 16px;
}
</style>
