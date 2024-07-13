//买家要求
<template>
  <div class="buyerRequirementsInfo-info" id="buyerRequirementsInfo-ebay">
    <gj-row :gutter="24" class="pt">
      <gj-col :span="12">
        <gj-space>
          <h2 class="title">买家要求</h2>
        </gj-space>
      </gj-col>
      <gj-col :span="12" class="header_rigth">
        <gj-row justify="end">
          <gj-space>
            <gj-select
              size="small"
              :style="{ width: '160px' }"
              v-model="buyerRequirementsInfo.buyerTemplateId"
              placeholder="请选择"
              allow-clear
              :trigger-props="{ autoFitPopupMinWidth: true }"
              @popup-visible-change="getItembuyerTemplateId"
            >
              <gj-option
                v-for="item in buyerTemplateList"
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
      ref="buyerRequirementsForm"
      :model="buyerRequirementsInfo"
      class="buyerRequirements-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="submitForm"
    >
      <gj-row :gutter="24">
        <gj-col :span="24">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="买家要求"
          >
            <gj-space size="large">
              <gj-radio-group
                v-model="buyerRequirementsInfo.disableBuyerRequirements"
                @change="shipToRegistrationCountryType"
              >
                <gj-radio :value="true">允许所有买家购买我的物品</gj-radio>
                <gj-radio :value="false">不允许以下买家购买我的物品</gj-radio>
              </gj-radio-group>
            </gj-space>
          </gj-form-item>
        </gj-col>
      </gj-row>
      <div
        class="squre-line mb16"
        v-if="!buyerRequirementsInfo.disableBuyerRequirements"
      >
        <gj-row>
          <gj-col :span="12" class="buyerRequirement-select">
            <gj-checkbox
              v-model="buyerRequirementsInfo.shipToRegistrationCountry"
              >主要运送地址在我的运送范围之外</gj-checkbox
            >
          </gj-col>
          <!-- 是否限制买家弃标次数 -->
          <gj-col :span="12" class="buyerRequirement-select">
            <gj-checkbox
              v-model="buyerRequirementsInfo.maximumUnpaidItemStrikesInfo"
              @change="checkboxChangeStrikes"
            ></gj-checkbox>
            <span class="pd-10">曾收到</span>
            <gj-select
              v-model="buyerRequirementsInfo.maximumUnpaidItemStrikesInfoCount"
              placeholder="请选择"
              allow-clear
              :style="{ width: '100px' }"
              :disabled="!buyerRequirementsInfo.maximumUnpaidItemStrikesInfo"
            >
              <gj-option
                v-for="item in maximumUnpaidItemStrikesInfoCountsList"
                :key="item"
                :value="item"
                >{{ item }}</gj-option
              >
            </gj-select>
            <span class="pd-10">个弃标个案，在过去</span>
            <gj-select
              v-model="buyerRequirementsInfo.maximumUnpaidItemStrikesInfoPeriod"
              placeholder="请选择"
              allow-clear
              :style="{ width: '100px' }"
              :disabled="!buyerRequirementsInfo.maximumUnpaidItemStrikesInfo"
            >
              <gj-option
                v-for="item in maximumUnpaidItemStrikesInfoPeriodList"
                :key="item"
                :value="item"
                >{{ item }}</gj-option
              >
            </gj-select>
            <span class="pd-10">天</span>
          </gj-col>
          <gj-col :span="12" class="buyerRequirement-select">
            <gj-checkbox v-model="buyerRequirementsInfo.maximumItemRequirements"
              >在过去10天内层出价或购买我的物品，已达到我所设定的限制：
            </gj-checkbox>
            <gj-select
              v-model="buyerRequirementsInfo.maximumItemCount"
              placeholder="请选择"
              allow-clear
              :style="{ width: '100px' }"
              :disabled="!buyerRequirementsInfo.maximumItemRequirements"
            >
              <gj-option
                v-for="item in maximumItemCountList"
                :key="item"
                :value="item"
                >{{ item }}</gj-option
              >
            </gj-select>
          </gj-col>
          <!-- 指数等于或低于 -->
          <gj-col :span="12" class="buyerRequirement-select">
            <gj-checkbox
              v-model="buyerRequirementsInfo.minimumFeedbackScore"
              @change="checkboxChangeScore"
              >这项限制只适用于卖家信用指数等于或低于：
            </gj-checkbox>
            <gj-select
              v-model="buyerRequirementsInfo.minimumFeedbackScoreValue"
              placeholder="请选择"
              allow-clear
              :style="{ width: '100px' }"
              :disabled="!buyerRequirementsInfo.minimumFeedbackScore"
            >
              <gj-option
                v-for="item in minimumFeedbackScoreValueList"
                :key="item"
                :value="item"
                >{{ item }}</gj-option
              >
            </gj-select>
          </gj-col>
        </gj-row>
      </div>
    </gj-form>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, onMounted, watch } from "vue";
import { setForm } from "@/utils/fnBusiness";
import {
  getOnlyQueryEbayBaseSiteInfo,
  getEbayTemplateAssemblyInfo,
} from "@api/published/ebay.js";
import { validateTriggerOpt } from "@common";
import { useStore } from "vuex";
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
    const key = "buyerRequirementsInfo";
    const data = reactive({
      buyerRequirementsInfo: {
        disableBuyerRequirements: true, //是否禁止买家要求 ,
        shipToRegistrationCountry: false, //是否限制买家运送地址在运送范围之外 ,
        maximumUnpaidItemStrikesInfo: false, //是否限制买家弃标次数
        maximumItemRequirements: false, //我所设定的限制
        minimumFeedbackScore: false, //卖家信用指数等于或低于
        maximumUnpaidItemStrikesInfoCount: null, //弃标次数 ,
        maximumUnpaidItemStrikesInfoPeriod: "", //弃标日期范围 ,
        minimumFeedbackScoreValue: null, //信用指数
        buyerTemplateId: "",
        maximumItemCount: null,
      },
      maximumItemCountList: [],
      buyerTemplateList: [],
      maximumUnpaidItemStrikesInfoPeriodList: [],
      minimumFeedbackScoreValueList: [], //
      maximumUnpaidItemStrikesInfoCountsList: [],
      validateTriggerOpt,
      productTypeOpt: [],
      rules: {
        siteId: [{ required: true, message: "站点必填" }],
        chargePersonId: [{ required: true, message: "负责人必填" }],
      },
    });
    const shipToRegistrationCountryType = (val) => {
      data.buyerRequirementsInfo.disableBuyerRequirements = val;
      if (!val) {
        if (!store.getters.getgoodsData.siteId) return false;
        const params = {
          siteId: store.getters.getgoodsData.siteId,
          isAll: 0,
        };
        getOnlyQueryEbayBaseSiteInfo(params).then((res) => {
          const {
            maximumUnpaidItemStrikesInfoPeriod,
            minimumFeedbackScoreValue,
            maximumUnpaidItemStrikesInfoCounts,
            maximumItemCount,
          } = res.data[0];
          data.maximumItemCountList = maximumItemCount;
          console.log(data.maximumItemCountList, "pps");
          data.maximumUnpaidItemStrikesInfoPeriodList =
            maximumUnpaidItemStrikesInfoPeriod;
          data.minimumFeedbackScoreValueList = minimumFeedbackScoreValue;
          data.maximumUnpaidItemStrikesInfoCountsList =
            maximumUnpaidItemStrikesInfoCounts;
        });
      }
    };
    const checkboxChangeStrikes = (val) => {
      data.buyerRequirementsInfo.maximumUnpaidItemStrikesInfo = val;
    };
    const checkboxChangeScore = (val) => {
      data.buyerRequirementsInfo.minimumFeedbackScore = val;
    };
    const submitForm = () => {
      return setForm(proxy, key, data[key], "buyerRequirementsForm");
    };
    const resetForm = () => {
      proxy.$refs.buyerRequirementsForm.resetFields();
    };

    watch(
      () => props.goodsRowData,
      () => {
        data.buyerRequirementsInfo = { ...props.goodsRowData };
      }
    );

    const getItembuyerTemplateId = (val) => {
      if (val) {
        const params = {
          url: "buyer",
          params: {
            pageCurrent: 1,
            pageSize: 100,
            siteIds: [store.getters.getgoodsData.siteId],
          },
        };
        getEbayTemplateAssemblyInfo(params).then((res) => {
          data.buyerTemplateList = res.data?.records.map((item) => {
            return {
              name: item.name,
              id: item.id,
            };
          });
        });
      }
    };

    onMounted(() => {
      // if (props.actionType == 'add') {
      // }
    });
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      shipToRegistrationCountryType,
      checkboxChangeStrikes,
      checkboxChangeScore,
      getItembuyerTemplateId,
    };
  },
};
</script>

<style lang="scss" scoped>
.buyerRequirementsInfo-info {
  box-sizing: border-box;
  padding: 0 16px 0 8px;
  .pt {
    padding: 16px 0px 2px 0px;
    // margin-right: 7px !important;
    .title {
      padding: 16px 0 2px 0px;
      font-size: 14px;
      padding-top: 0px;
    }
  }
  .basic-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
.mb16 {
  margin-bottom: 16px;
}
.squre-line {
  padding: 12px;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e6e6ed;
  border-radius: 8px;
  .buyerRequirement-select {
    padding: 8px 0px;
  }
  .pd-10 {
    padding: 10px;
  }
}
.image-tips {
  font-size: 12px;
  span {
    color: #808197;
  }
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  .image-box {
    width: 120px;
    height: 120px;
    background: #ccc;
    border-radius: 6px;
  }
}
</style>
