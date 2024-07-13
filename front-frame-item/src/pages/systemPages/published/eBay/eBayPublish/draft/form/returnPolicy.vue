//退货政策
<template>
  <div class="returnPolicy-info" id="returnPolicyInfo-ebay">
    <gj-row :gutter="24" class="pt">
      <gj-col :span="12">
        <gj-space>
          <h2 class="title">退货政策</h2>
        </gj-space>
      </gj-col>
      <gj-col :span="12" class="header_rigth">
        <gj-row justify="end">
          <gj-space>
            <gj-select
              size="small"
              :style="{ width: '160px' }"
              v-model="returnPolicyInfo.returnTemplateId"
              placeholder="请选择"
              allow-clear
              :trigger-props="{ autoFitPopupMinWidth: true }"
              @popup-visible-change="getItemReturnTemplateId"
            >
              <gj-option
                v-for="item in returnTemplateList"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</gj-option
              >
            </gj-select>
            <gj-button type="text">另存为模板</gj-button>
          </gj-space>
        </gj-row>
      </gj-col>
    </gj-row>
    <gj-form
      ref="returnPolicyForm"
      :model="returnPolicyInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="submitForm"
    >
      <gj-row :gutter="24">
        <gj-col :span="6">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="国内退货政策"
          >
            <gj-switch
              size="small"
              v-model="returnPolicyInfo.domesticReturnEnable"
              :checked-value="true"
              :unchecked-value="false"
              @change="policyChangdome"
            /><span>允许退货</span>
          </gj-form-item>
        </gj-col>

        <gj-col :span="6">
          <gj-form-item
            :field="
              returnPolicyInfo.domesticReturnEnable
                ? 'domesticReturnTime'
                : 'ss'
            "
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="退货天数"
          >
            <gj-select
              v-model="returnPolicyInfo.domesticReturnTime"
              placeholder="请选择"
              allow-clear
              :disabled="!returnPolicyInfo.domesticReturnEnable"
            >
              <gj-option
                v-for="item in domesticList[0]?.returnsDurationValues"
                :key="item"
                :value="item"
                >{{ item }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>

        <gj-col :span="6">
          <gj-form-item
            :field="
              returnPolicyInfo.domesticReturnEnable
                ? 'domesticReturnType'
                : 'ss'
            "
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="退货方式"
          >
            <gj-select
              v-model="returnPolicyInfo.domesticReturnType"
              placeholder="请选择"
              allow-clear
              :disabled="!returnPolicyInfo.domesticReturnEnable"
            >
              <gj-option
                v-for="item in domesticList[0]?.refundMethod"
                :key="item"
                :value="item"
                >{{ item }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>

        <gj-col :span="6">
          <gj-form-item
            :field="
              returnPolicyInfo.domesticReturnEnable
                ? 'domesticReturnCostBy'
                : 'ss'
            "
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="退货运输有谁承担"
          >
            <gj-select
              v-model="returnPolicyInfo.domesticReturnCostBy"
              placeholder="请选择"
              allow-clear
              :disabled="!returnPolicyInfo.domesticReturnEnable"
            >
              <gj-option
                v-for="item in domesticList[0]?.shipmentPayeeValues"
                :key="item"
                :value="item"
                >{{ item }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>

        <gj-col :span="6">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="国际退货政策"
          >
            <gj-switch
              size="small"
              v-model="returnPolicyInfo.internationalReturnEnable"
              :checked-value="true"
              :unchecked-value="false"
              @change="policyChanginter"
            /><span>允许退货</span>
          </gj-form-item>
        </gj-col>

        <gj-col :span="6">
          <gj-form-item
            :field="
              returnPolicyInfo.internationalReturnTime
                ? 'internationalReturnTime'
                : ''
            "
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="退货天数"
          >
            <gj-select
              v-model="returnPolicyInfo.internationalReturnTime"
              placeholder="请选择"
              allow-clear
              :disabled="!returnPolicyInfo.internationalReturnEnable"
            >
              <gj-option
                v-for="item in international[0]?.returnsDurationValues"
                :key="item"
                :value="item"
                >{{ item }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>

        <gj-col :span="6">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="退货方式"
          >
            <gj-select
              v-model="returnPolicyInfo.internationalReturnType"
              placeholder="请选择"
              allow-clear
              :disabled="!returnPolicyInfo.internationalReturnEnable"
            >
              <gj-option
                v-for="item in international[0]?.refundMethod"
                :key="item"
                :value="item"
                >{{ item }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>

        <gj-col :span="6">
          <gj-form-item
            :field="
              returnPolicyInfo.internationalReturnEnable
                ? 'internationalReturnCostBy'
                : ''
            "
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="退货运输有谁承担"
          >
            <gj-select
              v-model="returnPolicyInfo.internationalReturnCostBy"
              placeholder="请选择"
              allow-clear
              :disabled="!returnPolicyInfo.internationalReturnEnable"
            >
              <gj-option
                v-for="item in international[0]?.shipmentPayeeValues"
                :key="item"
                :value="item"
                >{{ item }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="24">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="退货政策说明"
          >
            <gj-textarea
              id="editorRef"
              :disabled="!returnPolicyInfo.internationalReturnEnable"
              :default-value="returnPolicyInfo.returnDescription"
              placeholder="请输入"
              :max-length="4000"
              show-word-limit
              class="des-textarea"
            />
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, onMounted, watch } from "vue";
import { setForm } from "@/utils/fnBusiness";
import {
  getQueryEbayCategoryReturnPolicy,
  getEbayTemplateAssemblyInfo,
} from "@api/published/ebay.js";
import { validateTriggerOpt } from "@common";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
export default {
  emits: ["setShowItemFun", "attrFun"],
  props: {
    actionType: {
      type: String,
      default: () => {
        return "";
      },
    },
    publicList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    goodsRowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    stroeCategoryId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  components: {},
  setup(props) {
    const { proxy } = getCurrentInstance();
    const store = new useStore();
    const key = "returnPolicyInfo";
    const data = reactive({
      returnPolicyInfo: {
        domesticReturnEnable: false, //国内
        domesticReturnTime: "",
        domesticReturnType: "",
        domesticReturnCostBy: "",
        internationalReturnEnable: false, //国际
        internationalReturnTime: "",
        internationalReturnType: "",
        internationalReturnCostBy: "",
        returnTemplateId: "", //退后模板id
        returnDescription: "",
      },
      domesticList: [], //国内
      international: [], //国际
      locationCountryList: [],
      validateTriggerOpt,
      rules: {
        domesticReturnTime: [{ required: true, message: "退货天数必填" }],
        domesticReturnType: [{ required: true, message: "退货方式必填" }],
        domesticReturnCostBy: [
          { required: true, message: "退货运输有谁承担必填" },
        ],
        internationalReturnTime: [{ required: true, message: "退货天数必填" }],
        internationalReturnType: [{ required: true, message: "退货方式必填" }],
        internationalReturnCostBy: [
          { required: true, message: "退货运输有谁承担必填" },
        ],
      },
      locationTemplateList: [],
      returnTemplateList: [],
    });

    const policyChangdome = (val) => {
      if (val) {
        policyChang(true);
      } else {
        // resetForm()
        data.returnPolicyInfo.domesticReturnTime = "";
        data.returnPolicyInfo.domesticReturnType = "";
        data.returnPolicyInfo.domesticReturnCostBy = "";
      }
    };
    const policyChanginter = (val) => {
      if (val) {
        policyChang(true);
      } else {
        // resetForm()
        data.returnPolicyInfo.internationalReturnTime = "";
        data.returnPolicyInfo.internationalReturnType = "";
        data.returnPolicyInfo.internationalReturnCostBy = "";
      }
    };

    const policyChang = () => {
      data.domesticList = [];
      data.international = [];
      const params = {
        siteId: store.getters.getgoodsData.siteId,
        categoryId: store.getters.getgoodsData.categoryId,
      };
      if (!store.getters.getgoodsData.siteId) {
        data.returnPolicyInfo.domesticReturnEnable = false;
        data.returnPolicyInfo.internationalReturnEnable = false;
        return GjMessage.warning("基础信息站点需要补充完整才能选择！");
      }

      if (!store.getters.getgoodsData.categoryId) {
        data.returnPolicyInfo.domesticReturnEnable = false;
        data.returnPolicyInfo.internationalReturnEnable = false;
        return GjMessage.warning("产品信息分类需要补充完整才能选择！！");
      }

      getQueryEbayCategoryReturnPolicy(params).then((res) => {
        res.data.forEach((item) => {
          if (item.returnPolicyType === "domestic") {
            data.domesticList.push(item); //国内
          } else {
            data.international.push(item);
          }
        });
      });
    };

    const submitForm = () => {
      return setForm(proxy, key, data[key], "returnPolicyForm");
    };
    const resetForm = () => {
      proxy.$refs.returnPolicyForm.resetFields();
    };
    const getItemReturnTemplateId = (val) => {
      if (val) {
        const params = {
          url: "return",
          params: {
            pageCurrent: 1,
            pageSize: 100,
            siteIds: [store.getters.getgoodsData.siteId],
          },
        };
        getEbayTemplateAssemblyInfo(params).then((res) => {
          data.returnTemplateList = res.data?.records.map((item) => {
            return {
              name: item.name,
              id: item.id,
            };
          });
        });
      }
    };

    watch(
      () => props.goodsRowData,
      () => {
        data.returnPolicyInfo = { ...props.goodsRowData };
        policyChang(true);
      }
    );
    watch(
      () => props.stroeCategoryId,
      (newVal) => {
        if (!newVal) return;
        policyChang(true);
      }
    );

    onMounted(() => {
      // if (props.actionType == 'add') {}
    });
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      policyChang,
      policyChangdome,
      policyChanginter,
      getItemReturnTemplateId,
    };
  },
};
</script>

<style lang="scss" scoped>
.returnPolicy-info {
  box-sizing: border-box;
  padding: 0 16px 0 8px;
  .titles {
    padding: 16px 0 2px 0px;
    font-size: 14px;
  }
  .pt {
    padding: 16px 0px 2px 0px;
    // margin-right: 7px !important;
    .title {
      font-size: 14px;
    }
  }
  .header_rigth {
    text-align: left;
  }
  .returnPolicy-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
</style>
