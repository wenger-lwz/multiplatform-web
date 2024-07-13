<template>
  <gj-form
    ref="saleDraftFormRef"
    class="sale-info-form"
    :model="saleInfoLz"
    :label-col-props="{ span: 24 }"
    :wrapper-col-props="{ span: 24 }"
    :rules="rules"
  >
    <div class="mb8">
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            label="售价"
            class="mb8"
            field="recommendPrice"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input-number
              placeholder="请输入"
              allow-clear
              :precision="2"
              :max="MAX_NUM_15"
              :hide-button="true"
              v-if="!isSiteIdCB"
              v-model="saleInfoLz.recommendPrice"
            >
              <template #prefix>{{ recommendPriceUnit }}</template>
            </gj-input-number>

            <PopupPrice
              v-else
              showItemName="globalPrice"
              v-model:globalPrice="saleInfoLz.globalPrice"
              v-model:globalpromotionPrice="saleInfoLz.globalpromotionPrice"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            label="促销价"
            class="mb8"
            field="promotionPrice"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input-number
              placeholder="请输入"
              allow-clear
              :precision="2"
              :max="MAX_NUM_15"
              :hide-button="true"
              v-if="!isSiteIdCB"
              v-model="saleInfoLz.promotionPrice"
            >
              <template #prefix>{{ recommendPriceUnit }}</template>
            </gj-input-number>

            <PopupPrice
              v-else
              showItemName="globalpromotionPrice"
              v-model:globalPrice="saleInfoLz.globalPrice"
              v-model:globalpromotionPrice="saleInfoLz.globalpromotionPrice"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8" v-if="!isSiteIdCB">
          <gj-form-item
            label="促销时间"
            class="mb8"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <AppRangePicker
              style="width: 100%"
              v-model="saleInfoLz.rangeValue"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            label="库存"
            class="mb8"
            field="stockNumber"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input-number
              v-if="!isSiteIdCB"
              placeholder="请输入"
              allow-clear
              :precision="0"
              :hide-button="true"
              v-model="saleInfoLz.stockNumber"
            ></gj-input-number>

            <PopupStockNumber
              v-else
              :selectData="selectData"
              v-model:globalStockNumber="saleInfoLz.globalStockNumber"
              @update:globalStockNumber="updateGlobalStockNumber"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            label="包装重量"
            class="mb8"
            field="logisticsWeight"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input-number
              placeholder="请输入"
              allow-clear
              :precision="3"
              :max="MAX_NUM_20"
              :hide-button="true"
              v-model="saleInfoLz.logisticsWeight"
            >
              <template #suffix>kg</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            label="包装尺寸(单位：CM)"
            class="mb8"
            field="logisticsSize"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input-number
              placeholder="请输入"
              :precision="3"
              :max="MAX_NUM_110"
              :hide-button="true"
              v-model="saleInfoLz.logisticsSizeLong"
            >
              <template #prefix> 长 </template>
            </gj-input-number>
            <span class="input-seperate">*</span>
            <gj-input-number
              placeholder="请输入"
              :precision="3"
              :max="MAX_NUM_110"
              :hide-button="true"
              v-model="saleInfoLz.logisticsSizeWide"
            >
              <template #prefix> 宽 </template>
            </gj-input-number>
            <span class="input-seperate">*</span>
            <gj-input-number
              placeholder="请输入"
              :precision="3"
              :max="MAX_NUM_110"
              :hide-button="true"
              v-model="saleInfoLz.logisticsSizeHigh"
            >
              <template #prefix> 高 </template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            label="Taxes"
            class="mb8"
            field="taxes"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              placeholder="请选择"
              allow-clear
              v-model="saleInfoLz.taxes"
            >
              <gj-option>default</gj-option>
            </gj-select>
          </gj-form-item>
        </gj-col>
      </gj-row>
    </div>
  </gj-form>
</template>

<script>
import {
  getCurrentInstance,
  reactive,
  toRefs,
  computed,
  defineComponent,
  ref,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { validateTriggerOpt, tranStrToNumber } from "@common";
import PopupStockNumber from "@pagesSystem/published/lazada/components/common/PopupStockNumber.vue";
import PopupPrice from "@pagesSystem/published/lazada/components/common/PopupPrice.vue";
import AppRangePicker from "@/components/AppRangePicker.vue";
import { useCheckIsEmpty } from "@pagesSystem/published/lazada/hooks";
const MAX_NUM_15 = Number("9".repeat(15)) - 0.01;
const MAX_NUM_20 = 20;
const MAX_NUM_110 = 110;

export default defineComponent({
  components: {
    PopupStockNumber,
    PopupPrice,
    AppRangePicker,
  },
  props: {
    selectData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const store = useStore();
    const key = "saleInfoLz";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      [key]: {
        recommendPrice: null,
        promotionPrice: null,
        rangeValue: [],
        stockNumber: null,
        logisticsWeight: null,
        logisticsSizeLong: null,
        logisticsSizeWide: null,
        logisticsSizeHigh: null,
        taxes: "",
        globalStockNumber: {},
        globalPrice: {},
        globalpromotionPrice: {},
      },
    });

    // 售价不能小于0
    const rules = ref({
      logisticsWeight: [{ required: true, message: "包装重量必填" }],
      taxes: [{ required: true, message: "Taxes必填" }],
      logisticsSize: [
        {
          required: true,
          validator: (value, cb) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                if (
                  useCheckIsEmpty(data[key].logisticsSizeLong) ||
                  useCheckIsEmpty(data[key].logisticsSizeWide) ||
                  useCheckIsEmpty(data[key].logisticsSizeHigh)
                ) {
                  cb("包装尺寸必填");
                }
                if (
                  data[key].logisticsSizeLong <= 0 ||
                  data[key].logisticsSizeWide <= 0 ||
                  data[key].logisticsSizeHigh <= 0
                ) {
                  cb("包装尺寸大于0");
                }
                resolve();
              }, 0);
            });
          },
        },
      ],
    });

    const isSiteIdCB = computed(() => {
      return store.getters.getParams?.basicInfoLz?.siteId === "cb";
    });

    const recommendPriceUnit = computed(() => {
      return store.getters.getParams?.basicInfoLz?.recommendPriceUnit;
    });

    const submitDraftForm = () => {
      return setForm2(proxy, key, data[key], "saleDraftFormRef");
    };
    const saveDraftForm = () => {
      return setForm2(proxy, key, data[key]);
    };

    const validate = () => {
      return proxy.$refs.saleDraftFormRef?.validate();
    };

    const resetFields = () => {
      proxy.$refs.saleDraftFormRef?.resetFields();
    };

    const setPageData = (respData) => {
      data[key].recommendPrice = tranStrToNumber(respData.recommendPrice);
      data[key].promotionPrice = tranStrToNumber(respData.specialPrice);
      if (respData.specialFromDate && respData.specialToDate) {
        data[key].rangeValue = [
          respData.specialFromDate,
          respData.specialToDate,
        ];
      }
      data[key].stockNumber = tranStrToNumber(respData.quantity);
      data[key].logisticsWeight = tranStrToNumber(respData.logisticsWeight);
      data[key].logisticsSizeLong = tranStrToNumber(respData.logisticsSizeLong);
      data[key].logisticsSizeWide = tranStrToNumber(respData.logisticsSizeWide);
      data[key].logisticsSizeHigh = tranStrToNumber(respData.logisticsSizeHigh);
      data[key].taxes = respData.taxes;
      if (isSiteIdCB.value) {
        respData.globalRelations?.forEach((item) => {
          data[key].globalStockNumber[item.siteCode] = item.quantity;
          data[key].globalPrice[item.siteCode] = item.price;
          data[key].globalpromotionPrice[item.siteCode] = item.salePrice;
        });
        // 回显美元
        data[key].globalPrice["cb"] = tranStrToNumber(respData.recommendPrice);
        data[key].globalpromotionPrice["cb"] = tranStrToNumber(
          respData.specialPrice
        );
        data[key].globalStockNumber["total"] = tranStrToNumber(
          respData.quantity
        );
      }
    };

    const updateGlobalStockNumber = () => {
      proxy.$refs.saleDraftFormRef?.validateField("stockNumber");
    };

    // 促销价在跨境时是必填的, 促销价比售价小
    watchEffect(() => {
      if (isSiteIdCB.value) {
        rules.value.promotionPrice = [
          {
            required: true,
            validator: (value, cb) => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  if (useCheckIsEmpty(data[key].globalpromotionPrice?.cb)) {
                    cb("促销价必填");
                  }
                  if (data[key].globalpromotionPrice?.cb <= 0) {
                    cb("促销价大于0");
                  }

                  if (
                    data[key].globalPrice?.cb <=
                    data[key].globalpromotionPrice?.cb
                  ) {
                    cb("请输入小于售价的价格");
                  }
                  resolve();
                }, 0);
              });
            },
          },
        ];

        rules.value.stockNumber = [
          {
            required: true,
            validator: (value, cb) => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  if (
                    props.selectData.find(
                      (item) => !data[key].globalStockNumber?.[item]
                    )
                  ) {
                    cb("库存必填且大于0");
                  }
                  resolve();
                }, 0);
              });
            },
          },
        ];
        rules.value.recommendPrice = [
          {
            required: true,
            validator: (value, cb) => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  if (useCheckIsEmpty(data[key].globalPrice?.cb)) {
                    cb("售价必填");
                  }
                  if (data[key].globalPrice?.cb <= 0) {
                    cb("售价大于0");
                  }
                  resolve();
                }, 0);
              });
            },
          },
        ];
      } else {
        rules.value.promotionPrice = undefined;
        rules.value.stockNumber = [{ required: true, message: "库存必填" }];
        rules.value.recommendPrice = [
          {
            required: true,
            validator: (value, cb) => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  if (useCheckIsEmpty(data[key].recommendPrice)) {
                    cb("售价必填");
                  }
                  if (data[key].recommendPrice <= 0) {
                    cb("售价大于0");
                  }
                  resolve();
                }, 0);
              });
            },
          },
        ];
      }
    });

    return {
      ...toRefs(data),
      validateTriggerOpt,
      MAX_NUM_15,
      MAX_NUM_20,
      MAX_NUM_110,
      rules,
      isSiteIdCB,
      recommendPriceUnit,
      validate,
      resetFields,
      submitDraftForm,
      saveDraftForm,
      setPageData,
      updateGlobalStockNumber,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
</style>
