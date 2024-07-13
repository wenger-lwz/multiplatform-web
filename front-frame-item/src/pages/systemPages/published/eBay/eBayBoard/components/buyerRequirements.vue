<template>
  <div>
    <gj-form
      ref="buyerRequirementsForm"
      :model="buyerRequirementsInfo"
      :rules="rules"
      layout="vertical"
      class="formStyle"
    >
      <gj-form-item
        :label="item.label ? item.label : ''"
        :prop="item.prop"
        v-for="item in formData"
        :key="item.prop"
      >
        <template v-if="item.type === 'radio'">
          <gj-radio-group
            v-model="buyerRequirementsInfo[item.prop]"
            class="checkboxGroup"
          >
            <gj-space>
              <gj-radio
                v-for="(it, idx) in item.children"
                :key="idx"
                :value="it.value"
              >
                {{ it.label }}
              </gj-radio>
            </gj-space>
          </gj-radio-group>
        </template>
      </gj-form-item>
      <gj-form-item v-if="!buyerRequirementsInfo.disableBuyerRequirements">
        <div class="buyerInfoStyle">
          <gj-row class="grid-demo" :gutter="[10, 12]">
            <gj-col :span="5">
              <gj-checkbox
                v-model="buyerRequirementsInfo.shipToRegistrationCountry"
                >主要运送地址在我的运送范围之外</gj-checkbox
              ></gj-col
            >
            <gj-col :span="9">
              <gj-checkbox
                v-model="buyerRequirementsInfo.maximumUnpaidItemStrikesInfo"
              >
                <span>曾收到</span>
                <gj-select
                  v-model="
                    buyerRequirementsInfo.maximumUnpaidItemStrikesInfoCount
                  "
                  @click.prevent="setStopPropagation"
                  placeholder="天数"
                  class="checkboxSelectBox"
                  size="medium"
                  :disabled="
                    getDisabled(
                      buyerRequirementsInfo.maximumUnpaidItemStrikesInfo,
                      'maximumUnpaidItemStrikesInfoCount'
                    )
                  "
                >
                  <gj-option
                    v-for="item in siteList?.maximumUnpaidItemStrikesInfoCounts"
                    :key="item"
                    >{{ item }}</gj-option
                  > </gj-select
                ><span>个弃标个案，在过去</span>
                <gj-select
                  placeholder="天数"
                  v-model="
                    buyerRequirementsInfo.maximumUnpaidItemStrikesInfoPeriod
                  "
                  @click.prevent="setStopPropagation"
                  class="checkboxSelectBox"
                  size="medium"
                  :disabled="
                    getDisabled(
                      buyerRequirementsInfo.maximumUnpaidItemStrikesInfo,
                      'maximumUnpaidItemStrikesInfoPeriod'
                    )
                  "
                >
                  <gj-option
                    v-for="item in siteList?.maximumUnpaidItemStrikesInfoPeriod"
                    :key="item"
                    >{{ item }}</gj-option
                  > </gj-select
                ><span>天</span></gj-checkbox
              ></gj-col
            >
            <gj-col :span="10">
              <gj-checkbox
                v-model="buyerRequirementsInfo.maximumItemRequirements"
              >
                <span
                  >在过去10天内层出价或购买我的物品,已达到我所设定的限制：</span
                >
                <gj-select
                  @click.prevent="setStopPropagation"
                  placeholder="天数"
                  class="checkboxSelectBox"
                  size="medium"
                  v-model="buyerRequirementsInfo.maximumItemCount"
                  :disabled="
                    getDisabled(
                      buyerRequirementsInfo.maximumItemRequirements,
                      'maximumItemCount'
                    )
                  "
                >
                  <gj-option
                    v-for="item in siteList?.maximumItemCount"
                    :key="item"
                    >{{ item }}</gj-option
                  >
                </gj-select>
              </gj-checkbox></gj-col
            >
            <gj-col :span="8">
              <gj-checkbox
                class="disableCheckSty"
                v-model="buyerRequirementsInfo.minimumFeedbackScore"
                :disabled="!buyerRequirementsInfo.maximumItemRequirements"
              >
                <span>这项限制只适用于家信用指数等于或低于：</span>
                <gj-select
                  placeholder="天数"
                  @click.prevent="setStopPropagation"
                  class="checkboxSelectBox"
                  size="medium"
                  v-model="buyerRequirementsInfo.minimumFeedbackScoreValue"
                  :disabled="
                    getDisabled(
                      buyerRequirementsInfo.minimumFeedbackScore,
                      'minimumFeedbackScoreValue'
                    )
                  "
                >
                  <gj-option
                    v-for="item in siteList?.minimumFeedbackScoreValue"
                    :key="item"
                    >{{ item }}</gj-option
                  >
                </gj-select>
              </gj-checkbox></gj-col
            >
          </gj-row>
        </div>
      </gj-form-item>
    </gj-form>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  ref,
  reactive,
  toRefs,
  onMounted,
  computed,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import { editFormData, getSiteCnNames } from "./index.js";
// import { getOnlyQueryEbayBaseSiteInfo } from '@/api/published/ebay.js'
const DEAFULTVALUE = {
  shipToRegistrationCountry: false,
  maximumUnpaidItemStrikesInfo: false,
  maximumUnpaidItemStrikesInfoCount: "",
  maximumUnpaidItemStrikesInfoPeriod: "",
  maximumItemRequirements: false,
  maximumItemCount: "",
  minimumFeedbackScore: false,
  minimumFeedbackScoreValue: "",
};
export default defineComponent({
  name: "buyerRequirements",
  components: {},
  props: {
    formData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    queryEbayBaseSiteInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const buyerRequirementsForm = ref(null);
    const key = "buyerRequirementsInfo";
    const datas = reactive({
      buyerRequirementsInfo: {
        disableBuyerRequirements: false,
        shipToRegistrationCountry: false,
        maximumUnpaidItemStrikesInfo: false,
        maximumUnpaidItemStrikesInfoCount: "",
        maximumUnpaidItemStrikesInfoPeriod: "",
        maximumItemRequirements: false,
        maximumItemCount: "",
        minimumFeedbackScore: false,
        minimumFeedbackScoreValue: "",
      },
      formData: props.formData,
      rules: {},
    });
    // 禁止冒泡
    const setStopPropagation = (e) => {
      e.stopPropagation();
    };
    // 保存数据
    const submitForm = () => {
      Object.keys(datas[key]).forEach((j) => {
        if (datas.buyerRequirementsInfo.disableBuyerRequirements) {
          datas[key][j] = DEAFULTVALUE[j] ?? datas[key][j];
        }
      });
      return setForm2(proxy, key, datas[key], "buyerRequirementsForm");
    };
    // 重置清空缓存
    const resetForm = () => {
      buyerRequirementsForm.value.resetFields();
    };
    // 未获取到联动数据，禁止输入
    const getDisabled = (disable, val) => {
      if (!disable) {
        datas.buyerRequirementsInfo[val] = "";
      }
      return !disable;
    };
    //  获取站点数据
    const siteList = computed(() => {
      return getSiteCnNames();
    });

    onMounted(() => {
      // 回显数据
      if (editFormData(datas[key])) {
        datas[key] = editFormData(datas[key]);
      }
    });
    return {
      ...toRefs(datas),
      setStopPropagation,
      submitForm,
      resetForm,
      buyerRequirementsForm,
      getDisabled,
      siteList,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.arco-select).checkboxSelectBox {
  width: 125px;
}
.buyerInfoStyle {
  width: 100%;
  border: 1px solid #e6e6ed;
  padding: 20px;
  border-radius: 8px;
}
</style>
