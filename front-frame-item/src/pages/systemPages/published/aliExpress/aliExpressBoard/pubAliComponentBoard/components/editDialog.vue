<!--编辑/创建商品资料-->
<template>
  <fullScreenDialog :dialogVisible="visible">
    <template #title>
      <div class="dialog-title">
        <span>{{ isCreate ? "添加模板" : "编辑模板" }}</span>
        <gj-button @click="cancel" shape="round">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="blockBox">
        <div class="title">基础信息</div>
        <gj-form
          :model="basicInfo"
          class="form"
          :rules="rules"
          ref="basicForm"
          :label-col-props="{ span: 24 }"
          :wrapper-col-props="{ span: 24 }"
          label-align="left"
        >
          <gj-row :gutter="24">
            <gj-col :span="8">
              <gj-form-item label="模板名称" field="templateName">
                <gj-input v-model="basicInfo.templateName" :max-length="50">
                </gj-input>
              </gj-form-item>
            </gj-col>
            <gj-col :span="8">
              <gj-form-item
                label="店铺"
                validate-trigger="change"
                field="shopId"
              >
                <gj-select
                  v-model="basicInfo.shopId"
                  placeholder="请选择"
                  allow-clear
                  @change="change"
                  :trigger-props="{
                    updateAtScroll: true,
                  }"
                >
                  <gj-option
                    v-for="item in shopList"
                    :label="item.shopName"
                    :value="item.shopId"
                    :key="item.shopId"
                  ></gj-option>
                </gj-select>
              </gj-form-item>
            </gj-col>
            <gj-col :span="8">
              <gj-form-item label="模板类型" field="componentType">
                <gj-select
                  v-model="basicInfo.componentType"
                  placeholder="请选择"
                  allow-clear
                  :disabled="isCreate ? false : true"
                  :trigger-props="{
                    updateAtScroll: true,
                  }"
                >
                  <gj-option
                    :value="item.value"
                    v-for="item in componentTypeList"
                    :key="item.value"
                    >{{ item.label }}</gj-option
                  >
                </gj-select>
              </gj-form-item>
            </gj-col>
            <gj-col :span="8" v-if="basicInfo.componentType === 4">
              <gj-form-item label="车型" field="modelType">
                <gj-radio-group
                  v-model="basicInfo.modelType"
                  :disabled="isCreate ? false : true"
                  @change="componentTypeChange"
                >
                  <gj-radio :value="1" size="small">汽车车型库</gj-radio>
                  <gj-radio :value="2" size="small">摩托车车型库</gj-radio>
                </gj-radio-group>
              </gj-form-item>
            </gj-col>
          </gj-row>
        </gj-form>

        <template v-if="basicInfo.componentType === 2">
          <div class="title">产品描述</div>
          <div class="wrap">
            <RichText v-model="textarea"></RichText>
          </div>
        </template>

        <template v-if="basicInfo.componentType === 3">
          <div class="title">区域调价</div>
          <div class="wrap">
            <div class="squre-line region">
              <div class="regionTitle">
                <span class="span1"> 区域定价</span>
                <gj-button @click="setAreaPrice" size="small" type="text"
                  >设置/修改</gj-button
                >
              </div>
              <div class="gapContain">
                <gj-tag
                  closable
                  size="large"
                  class="regionTag"
                  v-for="(item, index) in tagList"
                  :key="item.value"
                  @close="closeTag(index)"
                  >{{ item.label }}</gj-tag
                >
              </div>
            </div>

            <gj-row class="retail">
              <gj-col :span="8">
                <div class="label">调价方式</div>
                <div class="selsetCon">
                  <gj-select
                    v-model="configurationType"
                    :trigger-props="{
                      updateAtScroll: true,
                    }"
                  >
                    <!-- <gj-option value="absolute">直接报价</gj-option> -->
                    <gj-option value="relative">调整比例</gj-option>
                    <gj-option value="percentage">调整金额</gj-option>
                  </gj-select>
                </div>
              </gj-col>
            </gj-row>

            <gj-row class="retail">
              <gj-col :span="8">
                <gj-popconfirm
                  position="bl"
                  :popup-visible="setPriceModel"
                  @ok="batchSetPrice"
                  @cancel="setPriceModel = false"
                >
                  <gj-button type="text" @click="setPriceModel = true"
                    >批量填充</gj-button
                  >
                  <template #content>
                    <gj-input-number
                      v-model="batchPrice"
                      :min="0"
                    ></gj-input-number>
                  </template>
                  <template #icon>
                    <span></span>
                  </template>
                </gj-popconfirm>
              </gj-col>
            </gj-row>

            <gj-table
              class="table-content"
              :columns="retailColumns"
              row-key="index"
              :data-source="table2Data"
              :pagination="false"
            >
              <template #bodyCell="{ index, column }">
                <template v-if="column.type === 'self'">
                  <!-- 直接报价 -->
                  <!-- <div v-if="configurationType === 'absolute'">
                    <gj-input-number
                      style="width: 125px"
                      placeholder="请输入"
                      v-model="table2Data[index][column['dataIndex']]"
                    >
                    </gj-input-number>
                  </div> -->

                  <!-- 调整比例 -->
                  <div v-if="configurationType === 'relative'">
                    <gj-input-number
                      :min="0"
                      style="width: 125px"
                      placeholder="请输入"
                      v-model="table2Data[index][column['dataIndex']]"
                    >
                      <template #suffix> % </template>
                    </gj-input-number>
                  </div>

                  <!-- 调整金额 -->
                  <div v-if="configurationType === 'percentage'">
                    <gj-input-number
                      :min="0"
                      style="width: 125px"
                      placeholder="请输入"
                      v-model="table2Data[index][column['dataIndex']]"
                    >
                    </gj-input-number>
                  </div>
                </template>
              </template>
            </gj-table>
          </div>
        </template>

        <template v-if="basicInfo.componentType === 4">
          <div class="title">
            配件兼容<gj-button type="text" @click="addCarTemplate"
              >添加</gj-button
            >
          </div>
          <compatibility
            :modelType="basicInfo.modelType"
            :carTableData="carTableData"
            ref="compatibility"
          ></compatibility>
          <!-- <carTable
            :carTableData="carTableData"
            :modelType="basicInfo.modelType"
          ></carTable> -->
        </template>
      </div>
    </template>

    <template #footer>
      <span class="dialog-footer">
        <gj-button @click="cancel" type="outline">取消</gj-button>

        <gj-button type="primary" @click="confirm">保存</gj-button>
      </span>
    </template>
  </fullScreenDialog>

  <areaModal
    :visible="areaVisible"
    :areaList="areaList"
    @handleOk="confirmAreaModal"
    @cancel="cancelAreaModal"
    ref="areaModalRef"
  ></areaModal>

  <goods-modal
    :cancelVisible="cancelVisible"
    :modelObj="modelObj"
    @cancelHandleOk="cancelHandleOk"
    @cancelHandleOff="cancelHandleOff"
  ></goods-modal>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch,
  onMounted,
  ref,
  nextTick,
} from "vue";

import { editTemplate, createTemplate } from "@api/published/aliexpress";

import { clearStore } from "@/utils/common";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
import { getShopList } from "@api/published/aliexpress";
import RichText from "@/components/RichText.vue";
import areaModal from "../../../aLipublish/pubAliDraft/components/areaModal.vue";

import compatibility from "../../../components/compatibility/index.vue";
import { GjMessage } from "@gj/atom";
import goodsModal from "@/pages/systemPages/published/eBay/eBayPublish/components/goodsModal.vue";
export default defineComponent({
  emits: ["cancel", "confirm"],
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    editId: {
      type: String,
      default: () => {
        return "";
      },
    },
    editData: {
      type: Object,
      default: () => {
        return {};
      },
    },

    itemId: {
      type: [Number, String],
      default: () => {
        return "";
      },
    },
    isCreate: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  components: {
    fullScreenDialog,
    RichText,
    areaModal,
    compatibility,
    // carTable,
    goodsModal,
  },
  setup(props, { emit }) {
    const areaList = [
      {
        label: "Russian Federation",
        value: "RU",
      },
      {
        label: "United States",
        value: "US",
      },
      {
        label: "Canada",
        value: "CA",
      },
      {
        label: "Spain",
        value: "ES",
      },
      {
        label: "France",
        value: "FR",
      },
      {
        label: "United Kingdom",
        value: "UK",
      },
      {
        label: "Netherlands",
        value: "NL",
      },
      {
        label: "Israel",
        value: "IL",
      },
      {
        label: "Brazil",
        value: "BR",
      },
      {
        label: "Chile",
        value: "CL",
      },
      {
        label: "Australia",
        value: "AU",
      },
      {
        label: "Ukraine",
        value: "UA",
      },
      {
        label: "Belarus",
        value: "BY",
      },
      {
        label: "Japan",
        value: "JP",
      },
      {
        label: "Thailand",
        value: "TH",
      },
      {
        label: "Singapore",
        value: "SG",
      },
      {
        label: "South Korea",
        value: "KR",
      },
      {
        label: "Indonesia",
        value: "ID",
      },
      {
        label: "Malaysia",
        value: "MY",
      },
      {
        label: "Philippines",
        value: "PH",
      },
      {
        label: "Vietnam",
        value: "VN",
      },
      {
        label: "Italy",
        value: "IT",
      },
      {
        label: "Germany",
        value: "DE",
      },
      {
        label: "Saudi Arabia",
        value: "SA",
      },
      {
        label: "United Arab Emirates",
        value: "AE",
      },
      {
        label: "Poland",
        value: "PL",
      },
      {
        label: "Turkey",
        value: "TR",
      },
    ];
    const areaModalRef = ref();
    const { proxy } = getCurrentInstance();
    const compatibility = ref();
    const data = reactive({
      carTableData: [],
      visible: proxy.dialogVisible,
      editId: proxy.editId,
      editData: props.editData,
      itemId: props.itemId,
      isCreate: props.isCreate,
      componentTypeList: [
        { value: 2, label: "产品信息模块" },
        { value: 3, label: "区域调价模板" },
        { value: 4, label: "车型库模板" },
      ],
      basicInfo: {
        componentType: "",
        templateName: "",
        shopId: "",
        modelType: 1,
      },
      shopList: [],
      rules: {
        componentType: [
          {
            required: true,
            message: "请选择模板类型",
            trigger: "change",
          },
        ],
        modelType: [
          {
            required: true,
            message: "请选择车型",
            trigger: "change",
          },
        ],
        templateName: [
          {
            required: true,
            message: "请输入模板名称",
            trigger: "change",
          },
        ],
        shopId: [
          {
            required: true,
            message: "请选择店铺",
            trigger: "change",
          },
        ],
      },
      textarea: "",
      areaVisible: false,
      tagList: [],
      sizeTemplateId: "",
      configurationType: "relative",
      retailColumns: [],
      table2Data: [],
      setPriceModel: false,
      batchPrice: 0,
      cancelVisible: false,
      modelObj: {
        modelTitle: "",
        modelText: "",
      },
    });

    const closeTag = (index) => {
      data.tagList.splice(index, 1);

      setRetailColumns();
      areaModalRef.value.updataCheck(data.tagList.map((item) => item.value));
      setTable2Data();
    };
    const setTable2Data = () => {
      data.table2Data = [];
      let line = {};
      data.tagList.forEach((item1) => {
        line[item1.value] = "";
      });
      data.table2Data.push(line);
    };

    const setAreaPrice = () => {
      data.areaVisible = true;
    };

    const confirmAreaModal = (arr) => {
      data.areaVisible = false;
      data.tagList = [];
      areaList.forEach((item) => {
        arr.forEach((item1) => {
          if (item1 === item.value) {
            data.tagList.push(item);
          }
        });
      });
      setRetailColumns();
      setTable2Data();
    };

    const setRetailColumns = () => {
      data.retailColumns = data.tagList.map((item) => {
        return {
          type: "self",
          title: `${item.label}零售价`,
          dataIndex: item.value,
          width: 180,
        };
      });
    };

    const batchSetPrice = () => {
      data.setPriceModel = false;
      if (data.table2Data.length === 0) return;

      for (let key in data.table2Data[0]) {
        data.table2Data[0][key] = data.batchPrice;
      }
    };
    const cancelAreaModal = () => {
      data.areaVisible = false;
    };
    const echoAreaPriceAndTradePrice = () => {
      const configuration = data.editData.configuration;
      data.tagList = [];
      if (configuration) {
        data.configurationType = configuration?.configurationType;

        const countryVal =
          configuration?.configurationDatas[0]?.dataList?.map(
            (item) => item.country
          ) || [];

        areaList.forEach((item) => {
          countryVal.forEach((item1) => {
            if (item.value == item1) {
              data.tagList.push(item);
            }
          });
        });
      }

      areaModalRef.value.updataCheck(data.tagList.map((item) => item.value));

      setRetailColumns();
      setTable2Data();
      data.table2Data.forEach((item, index) => {
        configuration?.configurationDatas[index].dataList.forEach((item1) => {
          item[item1.country] = item1.price;
        });
      });
    };

    const cancelHandleOk = () => {
      emit("cancel");
    };
    const cancelHandleOff = () => {
      data.cancelVisible = false;
    };
    const cancel = () => {
      data.modelObj = {
        modelTitle: "提示",
        modelText: "当前编辑未保存，关闭将不做保存，是否关闭？",
      };
      data.cancelVisible = true;
    };

    const addCarTemplate = () => {
      compatibility.value.addCompatibility();
    };
    watch(
      () => props.dialogVisible,
      (newValue) => {
        data.visible = newValue;
        if (!newValue) {
          clearStore();
        }
      }
    );

    watch(
      () => props.editId,
      (newValue) => {
        data.editId = newValue;
      }
    );

    watch(
      () => props.updateState,
      (newValue) => {
        data.updateState = newValue;
      }
    );

    watch(
      () => props.itemId,
      (newValue) => {
        data.itemId = newValue;
      }
    );

    watch(
      () => props.editData,
      (newValue) => {
        data.editData = newValue;
        if (JSON.stringify(data.editData) !== "{}") {
          data.basicInfo.componentType = data.editData.componentType;
          data.basicInfo.templateName = data.editData.templateName;
          data.basicInfo.shopId = data.editData.shopId;
          data.basicInfo.modelType = data.editData.modelType;
          data.textarea = data.editData.textarea;
          if (data.editData.componentType == 2) {
            data.textarea = data.editData?.module?.moduleContents;
          } else if (data.editData.componentType == 3) {
            echoAreaPriceAndTradePrice();
          } else if (data.editData.componentType == 4) {
            nextTick(() => {
              compatibility.value.modelTypeChange(data.basicInfo.modelType);
              data.carTableData = data.editData?.carDataList.map((item) => {
                return {
                  ...item,
                  rowKey:
                    data.editData.modelType === 1
                      ? `${item.enginePid}-${item.engineId}`
                      : `${item.submodelPid}-${item.submodelId}`,
                };
              });
            });
          }
        }
      },
      { deep: true }
    );

    const getRequestParams = () => {
      let params = {
        componentType: data.basicInfo.componentType,
        shopId: data.basicInfo.shopId,
        templateName: data.basicInfo.templateName,
      };

      if (params.componentType == 2) {
        params.productDesc = data.textarea;
      } else if (params.componentType == 3) {
        let formatTable = [];

        data.table2Data.forEach((item, index) => {
          // formatTable[index] = []

          formatTable[index] = {
            dataList: [],
          };

          data.tagList.forEach((tItem) => {
            formatTable[index].dataList.push({
              country: tItem.value,
              price: item[tItem.value],
            });
          });
        });
        console.log(formatTable);
        const configuration = {
          configurationType: data.configurationType,
          configurationDatas: formatTable,
        };
        params.configuration = configuration;
      } else if (params.componentType == 4) {
        params.modelType = data.basicInfo.modelType;

        params.carDataList = compatibility.value.compatibilityTableData;
        console.log(params);
      }
      return params;
    };
    const confirm = () => {
      proxy.$refs["basicForm"].validate().then((res) => {
        if (!res) {
          const params = getRequestParams();
          if (!data.isCreate) {
            params.templateId = data.editId;
            editTemplate(params).then(() => {
              emit("confirm");
              GjMessage.success("组件模板保存成功！");
            });
          } else {
            createTemplate(params).then(() => {
              emit("confirm");
              GjMessage.success("组件模板保存成功！");
            });
          }
        }
      });
    };

    const componentTypeChange = () => {
      data.carTableData = [];
      compatibility.value.modelTypeChange(data.basicInfo.modelType);
    };
    onMounted(() => {
      getShopList({ platformCode: "ALIEXPRESS" }).then((res) => {
        data.shopList = res.data;
      });
    });
    return {
      ...toRefs(data),
      cancel,
      confirm,
      setAreaPrice,
      areaList,
      confirmAreaModal,
      cancelAreaModal,
      setRetailColumns,
      batchSetPrice,
      areaModalRef,
      compatibility,
      closeTag,
      cancelHandleOk,
      cancelHandleOff,
      componentTypeChange,
      addCarTemplate,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.arco-tabs-content) {
  height: auto !important;
}

.blockBox {
  .title {
    padding: 12px 0 2px 0px;
    font-size: 14px;
    font-weight: 600;
  }
  .form,
  .wrap {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }

  .region {
    .regionTitle {
      height: 28px;
      .span1 {
        font-weight: 600px;
      }
    }

    .regionTag {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #d9d9e0;
      color: rgba(0, 4, 48, 0.8);
      margin-right: 4px;
    }

    .gapContain {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 4px;
    }
  }
}
.dialog-footer {
  button {
    margin-left: 12px;
  }
}
.squre-line {
  padding: 12px;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e6e6ed;
  border-radius: 8px;
  margin-bottom: 10px;
}
</style>
