<template>
  <div>
    <gj-form
      ref="salesForm"
      :model="salesInfo"
      :rules="rules"
      class="formStyle"
      layout="vertical"
    >
      <gj-row :gutter="24">
        <template v-for="item in formData" :key="item.prop">
          <gj-col :span="8" v-if="setData(item)">
            <gj-form-item
              :label="`${item.label}`"
              :field="item.field ? item.prop : ''"
              :required="item.field ? item.field : false"
            >
              <template v-if="item.type === 'radio'">
                <gj-radio-group v-model="salesInfo[item.prop]">
                  <gj-radio
                    v-for="(it, idx) in item.children"
                    :key="idx"
                    :value="it.value"
                  >
                    {{ it.label }}
                  </gj-radio>
                </gj-radio-group>
              </template>
              <template v-if="item.type === 'switch'">
                <div v-for="(it, idx) in item.children" :key="idx">
                  <gj-space>
                    <gj-switch
                      v-model="salesInfo[item.prop]"
                      size="small"
                    /><span>{{ it.label }}</span>
                  </gj-space>
                </div>
              </template>
              <template v-if="item.type === 'salesSwitch'">
                <div v-for="(it, idx) in item.children" :key="idx">
                  <gj-space>
                    <gj-switch
                      v-model="salesInfo[item.prop]"
                      size="small"
                    /><span>{{
                      salesInfo[item.prop] ? "已开启" : "已关闭"
                    }}</span>
                  </gj-space>
                </div>
              </template>
              <template v-if="item.type === 'inputNum'">
                <gj-input-number
                  v-model="salesInfo[item.prop]"
                  :placeholder="item.placeholder"
                  :max="100000"
                  :min="0"
                  :precision="2"
                  class="flexItem"
                ></gj-input-number>
              </template>
              <template v-if="item.type === 'inputLotSize'">
                <gj-input
                  v-model.trim="salesInfo[item.prop]"
                  :placeholder="item.placeholder"
                  :disabled="!salesInfo.lotSizeCheckbox"
                  maxlength="100"
                  class="flexItem"
                ></gj-input>
              </template>
              <template v-if="item.type === 'select'">
                <gj-select
                  v-model="salesInfo[item.prop]"
                  :placeholder="$t(item.label)"
                  clearable
                  class="flexItem"
                  @popup-visible-change="
                    getQueryEbayCategoryListing(item.prop, $event)
                  "
                >
                  <!-- <gj-option
                    v-for="(j, idx) in item.children"
                    :key="idx"
                    :label="j.platformName"
                    :value="j.platformCode"
                  ></gj-option> -->
                  <gj-option
                    v-for="j in getOptionList(item.prop, 'option', null)"
                    :key="getOptionList(item.prop, 'key', j)"
                    :value="getOptionList(item.prop, 'key', j)"
                    >{{ getOptionList(item.prop, "name", j) }}</gj-option
                  >
                </gj-select>
              </template>
              <template v-if="item.type === 'selectInput'">
                <gj-select
                  v-model="salesInfo[item.prop]"
                  :placeholder="item.placeholder"
                  :class="
                    salesInfo[item.prop] !== '建议售价' ? 'priceSelectOne' : ''
                  "
                >
                  <gj-option
                    v-for="(it, idx) in item.children"
                    :key="idx"
                    :label="it.platformName"
                    :value="it.platformCode"
                  ></gj-option>
                </gj-select>
                <gj-input-number
                  v-if="salesInfo[item.prop] !== '建议售价'"
                  v-model="salesInfo[item.inputValue]"
                  :placeholder="`请输入${item.label}`"
                  :max="1000000000000000"
                  :min="0"
                  :precision="2"
                  :hide-button="true"
                  class="priceInputOne"
                >
                  <template #append v-if="item.btnTxt">
                    {{ salesInfo[item.btnTxt] }}
                  </template>
                </gj-input-number>
              </template>
              <template v-if="item.type === 'selectInputCheckbox'">
                <gj-input-number
                  v-model="salesInfo[item.inputValue]"
                  placeholder="0.00"
                  :max="100"
                  :min="0"
                  :precision="2"
                  :hide-button="true"
                  :class="item.btnTxt ? 'btnPriceInput' : 'appendItem'"
                >
                  <template #prepend>
                    <gj-select
                      v-model="salesInfo[item.prop]"
                      :placeholder="item.placeholder"
                      :class="
                        salesInfo[item.prop]
                          ? 'priceSelectOne'
                          : 'priceSelectNo'
                      "
                      @popup-visible-change="getEbayTaxJuridictions"
                    >
                      <gj-option
                        v-for="it in getOptionList(item.prop, 'option', null)"
                        :key="getOptionList(item.prop, 'key', it)"
                        :label="getOptionList(item.prop, 'name', it)"
                        :value="getOptionList(item.prop, 'key', it)"
                      ></gj-option>
                    </gj-select>
                  </template>
                  <template #append v-if="item.btnTxt">
                    {{ item.btnTxt }}
                  </template>
                </gj-input-number>
                <!-- <gj-checkbox
                  v-for="(it, idx) in item.salesTaxRateCheckbox"
                  :key="idx"
                  v-model="salesInfo[it.prop]"
                  :value="it.label"
                  >{{ it.label }}</gj-checkbox
                > -->
              </template>
              <template v-if="item.type === 'inputBox'">
                <gj-input-number
                  v-model="salesInfo[item.prop]"
                  :placeholder="item.placeholder"
                  class="appendItem"
                  :max="100"
                  :min="0"
                  :precision="2"
                  :hide-button="true"
                >
                  <template #append v-if="item.btnTxt">
                    {{ item.btnTxt }}
                  </template>
                </gj-input-number>
              </template>
            </gj-form-item>
          </gj-col>
          <gj-col :span="24" v-if="item.type === 'switchInput'">
            <div class="gjCloFlex">
              <gj-col :span="8">
                <gj-form-item :label="item.acceptlabel" :prop="item.prop">
                  <gj-space>
                    <gj-switch
                      v-model="salesInfo[item.prop]"
                      size="small"
                    /><span>{{
                      salesInfo[item.prop] ? "已开启" : "已关闭"
                    }}</span>
                  </gj-space>
                </gj-form-item>
              </gj-col>
              <gj-col :span="8" class="closePaddingRight">
                <gj-form-item :prop="item.acceptPrice.prop">
                  <template #label>
                    <gj-space>
                      <gj-switch
                        v-model="salesInfo[item.acceptPrice.propSwitch]"
                        :disabled="!salesInfo[item.prop]"
                        size="small"
                      /><span>{{ item.acceptPrice.label }}</span>
                    </gj-space>
                  </template>
                  <gj-select
                    v-model="salesInfo[item.acceptPrice.inputValue]"
                    :disabled="!salesInfo[item.acceptPrice.propSwitch]"
                    :placeholder="item.acceptPrice.placeholder"
                    class="priceSelectOne"
                    @click.prevent="setStopPropagation"
                  >
                    <gj-option
                      v-for="(j, idx) in item.acceptPrice.children"
                      :key="idx"
                      :label="j.platformName"
                      :value="j.platformCode"
                    ></gj-option>
                  </gj-select>
                  <gj-input-number
                    v-if="salesInfo[item.acceptPrice.inputValue] !== '建议售价'"
                    v-model.number="salesInfo[item.acceptPrice.prop]"
                    :disabled="!salesInfo[item.acceptPrice.propSwitch]"
                    :hide-button="true"
                    :max="1000000000000000"
                    :min="0"
                    :precision="2"
                    placeholder="请输入"
                    class="priceInputOne"
                  >
                    <template #append v-if="item.acceptPrice.btnTxt">
                      {{ salesInfo[item.acceptPrice.btnTxt] }}
                    </template>
                  </gj-input-number>
                </gj-form-item>
              </gj-col>
              <gj-col :span="8" class="closePaddingRight">
                <gj-form-item :prop="item.refusePrice.prop">
                  <template #label>
                    <gj-space>
                      <gj-switch
                        v-model="salesInfo[item.refusePrice.propSwitch]"
                        :disabled="!salesInfo[item.prop]"
                        size="small"
                      /><span>{{ item.refusePrice.label }}</span>
                    </gj-space>
                  </template>
                  <gj-select
                    v-model="salesInfo[item.refusePrice.inputValue]"
                    :disabled="!salesInfo[item.refusePrice.propSwitch]"
                    :placeholder="item.refusePrice.placeholder"
                    class="priceSelectOne"
                    @click.prevent="setStopPropagation"
                  >
                    <gj-option
                      v-for="(j, idx) in item.refusePrice.children"
                      :key="idx"
                      :label="j.platformName"
                      :value="j.platformCode"
                    ></gj-option>
                  </gj-select>
                  <gj-input-number
                    v-if="salesInfo[item.refusePrice.inputValue] !== '建议售价'"
                    v-model.number="salesInfo[item.refusePrice.prop]"
                    :disabled="!salesInfo[item.refusePrice.propSwitch]"
                    :max="1000000000000000"
                    :hide-button="true"
                    :min="0"
                    :precision="2"
                    placeholder="请输入"
                    class="priceInputOne"
                  >
                    <template #append v-if="item.refusePrice.btnTxt">
                      {{ salesInfo[item.refusePrice.btnTxt] }}
                    </template></gj-input-number
                  >
                </gj-form-item>
              </gj-col>
            </div>
          </gj-col>
        </template>

        <gj-col :span="8">
          <slot name="formItem"></slot>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  computed,
  onMounted,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import { editFormData, getSiteCnNames } from "./index.js";
import {
  getQueryEbayTaxJuridictions,
  getQueryEbaySiteListingDuration,
} from "@/api/published/ebay.js";
// import { reg } from '@/utils/reg.js'
const DEFAULT = {
  buyItNowPriceCalculateType: "",
  reservePriceCalculateType: "",
  startPriceCalculateType: "建议售价",
  listingDuration: "",
  lotSize: "",
  lotSizeCheckbox: "fasle",
  priceCalculateType: "建议售价",
  quantity: 0,
  linePriceCalculateType: "",
};
export default defineComponent({
  name: "salesInfo",
  components: {},
  props: {
    formData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const key = "salesInfo";
    const datas = reactive({
      checkList: "",
      autoPrice: {
        autoAcceptPrice: false,
        offerPrice: false,
      },
      salesInfo: {
        listingType: "FixedPriceItem",
        privateListingEnable: true,
        listingDuration: "",
        priceCalculateType: "建议售价",
        priceCalculateValue: 0.0,
        startPriceCalculateType: "建议售价",
        startPriceCalculateValue: 0.0,
        reservePriceCalculateType: "",
        reservePriceCalculateValue: 0.0,
        linePriceCalculateType: "",
        linePriceCalculateValue: 0.0,
        buyItNowPriceCalculateType: "",
        buyItNowPriceCalculateValue: 0.0,
        quantity: 0,
        lotSizeCheckbox: false,
        lotSize: "",
        taxJurisdiction: "",
        salesTaxPercent: 0,
        shippingIncludedInTax: false,
        vatTaxPercent: 0,
        bestOfferEnabled: false,
        bestOfferAutoAcceptPrice: 0,
        autoAcceptPriceEnabled: false,
        offerPriceEnabled: false,
        minimumBestOfferPrice: 0,
        bestOfferAutoAcceptType: "",
        minimumBestOfferType: "",
        priceUnit: "USD",
      },
      formData: props.formData,
      rules: {
        quantity: [
          {
            required: true,
            message: "请输入库存",
            trigger: "blur",
          },
        ],
        listingDuration: [
          {
            required: true,
            message: "请输入刊登天数",
            trigger: "blur",
          },
        ],
        startPriceCalculateType: [
          {
            required: true,
            message: "请输入起拍价",
            trigger: "blur",
          },
        ],
      },
      listingDurationOption: [],
      taxJurisdictionOption: [],
    });
    //判断该select/input/switch等是不是属于固定/拍卖，如果属于就显示，属于就禁止显示
    const setData = (val) => {
      if (
        (datas.salesInfo.listingType === "FixedPriceItem" &&
          (val.prop == "buyItNowPriceCalculateType" ||
            val.prop == "reservePriceCalculateType" ||
            val.prop == "startPriceCalculateType" ||
            val.prop === "listingDuration" ||
            val.prop === "lotSize" ||
            val.prop === "lotSizeCheckbox")) ||
        (datas.salesInfo.listingType === "Chinese" &&
          (val.prop == "priceCalculateType" ||
            val.prop == "quantity" ||
            val.prop === "linePriceCalculateType"))
      ) {
        datas[key][val.prop] =
          DEFAULT[val.prop] ?? (Array.isArray(datas[key][val.prop]) ? [] : "");
        return false;
      } else if (!val.label && val.prop === "bestOfferEnabled") {
        return false;
      } else {
        return true;
      }
    };
    // 嵌套在checkbox时，禁止下拉或输入时，点击冒泡
    const setStopPropagation = (e) => {
      e.stopPropagation();
    };
    // 保存数据
    const submitForm = () => {
      return setForm2(proxy, key, datas[key], "salesForm");
    };
    // 重置清空数据
    const resetForm = () => {
      proxy.$refs["salesForm"].resetFields();
    };

    // 税率字段获取接口
    const getEbayTaxJuridictions = (val) => {
      if (val) {
        const params = {
          siteId: siteCnName.value?.siteId,
        };
        getQueryEbayTaxJuridictions(params).then((res) => {
          datas.taxJurisdictionOption = res.data;
        });
      }
    };

    // 刊登时长接口
    const getQueryEbayCategoryListing = (key, val) => {
      if (
        key === "listingDuration" &&
        val &&
        datas.salesInfo?.listingType === "Chinese" &&
        siteCnName.value?.siteId
      ) {
        const params = {
          siteId: siteCnName.value?.siteId,
          listingType: datas.salesInfo?.listingType,
        };
        getQueryEbaySiteListingDuration(params).then((res) => {
          datas.listingDurationOption = res.data?.durationValues || [];
        });
      }
    };

    // 获取下拉选项的数组
    const getOptionList = (val, key, itemval) => {
      if (key === "option" && itemval === null) {
        if (val === "listingDuration") {
          return datas.listingDurationOption;
        } else if (val === "taxJurisdiction") {
          return datas.taxJurisdictionOption;
        }
      } else if (key === "key") {
        if (val === "taxJurisdiction") {
          return itemval.juridictionCode;
        }
        return itemval;
      } else if (key === "name") {
        if (val === "taxJurisdiction") {
          return itemval.juridictionEnName;
        }
        return itemval;
      }
    };
    // 获取站点数据
    const siteCnName = computed(() => {
      return getSiteCnNames();
    });
    // 获取站点货币
    datas.salesInfo.priceUnit = computed(() => {
      return getSiteCnNames().siteCurrency || "USD";
    });

    onMounted(() => {
      // 回显
      if (editFormData(datas[key])) {
        datas[key] = editFormData(datas[key]);
      }
    });
    return {
      ...toRefs(datas),
      setData,
      setStopPropagation,
      submitForm,
      resetForm,
      getOptionList,
      getEbayTaxJuridictions,
      getQueryEbayCategoryListing,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
.formStyle {
  .checkboxInput {
    display: flex;
    flex-flow: column;
  }
  .arco-input-append {
    width: 44px;
    color: #333659;
    background-color: #f2f2f4;
  }
  .marginRight {
    margin-right: 16px;
  }
  //gj-input设置类型为number时，中文输入法光标上移问题
  :deep(.gj-input__inner) {
    line-height: 1px !important;
  }
}
:deep(.arco-form-item-content-wrapper) {
  width: 358px;
}
.gjCloFlex {
  display: flex;
  border: 1px solid #e6e6ed;
  border-radius: 8px;
  padding-top: 12px;
}
:deep(.arco-input-outer:hover) {
  .arco-input-number-mode-embed .arco-input-number-step {
    display: none;
  }
}
</style>
