<template>
  <div class="logistics-info" id="logistics-info">
    <h2 class="title">物流信息</h2>
    <gj-form
      ref="logisticsInfoFormRef"
      :model="logisticsInfo"
      class="logistics-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
    >
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="templateName"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="模板名称"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input
              v-model="logisticsInfo.templateName"
              placeholder="请输入"
              allow-clear
            >
            </gj-input>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="shopId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="店铺"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              v-model="logisticsInfo.shopId"
              @change="shopChange"
              placeholder="请选择店铺"
              allow-clear
            >
              <gj-option
                :label="item.shopName"
                :value="item.shopId"
                v-for="item in logisticsInfo.shopListOpt"
                :key="item.shopId"
              ></gj-option>
            </gj-select>
          </gj-form-item>
        </gj-col>
      </gj-row>
      <gj-row :gutter="24">
        <gj-col>
          <div class="logistics-box">
            <h5 class="header">物流方式</h5>
            <gj-table
              :data-source="logisticsInfo.templateData"
              :columns="columns"
              row-key="logistics_channel_id"
              ref="logisticsTable"
              :pagination="false"
              bordered
              class="temp-table"
              :row-selection="{
                selectedRowKeys: rowSelection,
                onChange: onSelectChange,
              }"
            >
              <template #headerCell="{ column }">
                <template v-if="column.dataIndex === 'logisticsMode'"
                  >物流方式
                  <span class="sync-logistics" @click="syncLogistics"
                    >同步shopee物流</span
                  ></template
                >
              </template>
              <template #bodyCell="{ record, column }">
                <template v-if="column.dataIndex === 'logisticsMode'">
                  {{ record.logistics_channel_name }}
                  <div>
                    重量限制：最小{{ record.item_min_weight }}kg，最大{{
                      record.item_max_weight
                    }}kg。
                  </div>
                </template>
                <template v-if="column.dataIndex === 'freight'">
                  {{ record.enabled === true ? 0 : "根据重量或大小自动计算" }}
                </template>
                <template v-if="column.dataIndex === 'freeShipping'">
                  <gj-switch v-model="record.enabled" size="small"></gj-switch>
                </template>
              </template>
            </gj-table>
          </div>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  getCurrentInstance,
  reactive,
  toRefs,
  onMounted,
  defineComponent,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import { validateTriggerOpt } from "@common";
import { getLogistics } from "@/api/published/shopee";
import { getListingCommonShop } from "@/api/published/common";

export default defineComponent({
  name: "LogisticsInfo",
  inheritAttrs: false,
  props: {},
  setup() {
    const store = useStore();
    const key = "logisticsInfo";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      [key]: {
        templateName: "",
        logisticsVal: "",
        logisticsData: [{ id: 0, isFreeShipping: false, logisticsListVal: "" }],
        shopId: "",
        shopName: "",
        shopListOpt: [],
        templateData: [],
        tableSelectList: [], // 选择的数据
      },
      logisticsListOpt: [],
      rowSelection: [],
      columns: [
        {
          title: "物流方式",
          dataIndex: "logisticsMode",
          autoHeight: true,
        },
        {
          title: "运费",
          dataIndex: "freight",
          autoHeight: true,
        },
        {
          title: "免邮",
          dataIndex: "freeShipping",
          autoHeight: true,
        },
      ],
    });

    const rules = {
      templateName: [{ required: true, message: "模板名称必填" }],
      shopId: [{ required: true, message: "店铺必填" }],
    };

    // 根据店铺shopId同步物流信息
    const syncLogistics = async () => {
      const id = data.logisticsInfo.shopId;

      if (id) {
        await getLogistics({ shopId: id }).then((res) => {
          if (res.code === 0) {
            // data.logisticsListOpt = res.data;
            data.logisticsInfo.templateData = res.data?.map((item) => {
              return {
                logistics_channel_id: item.logistics_channel_id,
                logistics_channel_name: item.logistics_channel_name,
                item_min_weight: item.weight_limit.item_min_weight,
                item_max_weight: item.weight_limit.item_max_weight,
                enabled: item.enabled,
              };
            });
          }
        });
      }
    };

    // 添加物流方式
    const addLogistics = () => {
      let num = data.logisticsInfo.logisticsData.length;
      data.logisticsInfo.logisticsData.push({
        id: num++,
        isFreeShipping: false,
        logisticsListVal: "",
      });
      data.logisticsInfo.logisticsData = [...data.logisticsInfo.logisticsData];
    };

    // 删除物流方式
    const removeLogistics = (index) => {
      data.logisticsInfo.logisticsData.splice(index, 1);
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "logisticsInfoFormRef");
    };
    const validate = () => {
      return proxy.$refs.logisticsInfoFormRef.validate();
    };
    const resetFields = () => {
      proxy.$refs.logisticsInfoFormRef.resetFields();
    };

    const saveDataStore = () => {
      const params = {
        [key]: data[key],
      };
      store.dispatch(M_T.PARAMS_QUERY, params);
    };

    const setPageData = (respData) => {
      console.log(respData, "respData+++");
      data[key].shopId = respData.shopId;
      data[key].shopName = respData.shopName;
      data[key].templateName = respData.templateName;

      if (respData.logisticList && respData.logisticList.length > 0) {
        const d = respData.logisticList.map((item) => {
          // respData.logisticList.map((item) => {
          data.rowSelection.push(item.logisticId);

          return {
            logistics_channel_id: item.logisticId,
            logisticsListVal: item.logisticName,
            isFreeShipping: item.shippingFee,
            logistics_channel_name: item.logisticName,
            enabled: item.enabled,
          };
        });

        data[key].templateData = d;
      }
      syncLogistics();
      saveDataStore();
    };

    const getListingShopReq = () => {
      getListingCommonShop({ platformCode: "SHOPEE" }).then((res) => {
        data.logisticsInfo.shopListOpt = res.data;
      });
    };

    const shopChange = (val) => {
      const d = data.logisticsInfo.shopListOpt.filter(
        (item) => item.shopId == val
      );
      data.logisticsInfo.shopName = d[0].shopName;
      saveDataStore();
    };

    // 全选
    const onSelectChange = (selectedRowKeys) => {
      data.rowSelection = selectedRowKeys;
      console.log(data.logisticsInfo.templateData, "data.rowSelection");
      let d = data.logisticsInfo.templateData.filter(
        (item, index) => item.logistics_channel_id == selectedRowKeys[index]
      );
      data[key].tableSelectList = d;
      console.log(data.logisticsInfo.tableSelectList, "tableSelectList");
    };

    const clearData = () => {
      data[key].templateData = [];
    };

    onMounted(() => {
      // syncLogistics();
      getListingShopReq();
    });

    return {
      ...toRefs(data),
      validateTriggerOpt,
      rules,
      validate,
      resetFields,
      submitForm,
      setPageData,
      syncLogistics,
      addLogistics,
      removeLogistics,
      getListingShopReq,
      shopChange,
      onSelectChange,
      clearData,
    };
  },
});
</script>

<style lang="scss" scoped>
// @import "../common/index.scss";
.addTitle {
  margin-right: 8px;
}
.logistics-content {
  margin-bottom: 8px;
  margin-top: 10px;
  /deep/.arco-form-item-label {
    color: #000430;
  }
}
.freight-text {
  width: 100%;
  line-height: 30px;
  padding-left: 12px;
  border: 1px dashed #cccdd6;
  border-radius: 4px;
  background-color: #fafafb;
  color: #808197;
}
.freeshipping-text {
  display: inline-block;
  padding-left: 4px;
  color: #333659;
}

.action-columns {
  justify-content: flex-end;
  width: 100%;
  display: flex;
}
.logistics-info .title {
  padding: 12px 0 2px 0;
  font-weight: 700;
  font-size: 14px;
}
.logistics-box .header {
  font-weight: 700;
  font-size: 14px;
  padding-bottom: 12px;
}
.sync-logistics {
  color: #0045f0;
  cursor: pointer;
}
.logistics-info /deep/.surely-table-bordered {
  border-bottom: 0;
}
.logistics-info /deep/.surely-table-body .surely-table-row {
  color: #000430;
}
</style>
