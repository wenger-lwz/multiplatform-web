<template>
  <gj-form
    ref="saleDraftFormRef"
    :model="saleInfoLz"
    class="sale-info-form"
    :label-col-props="{ span: 24 }"
    :wrapper-col-props="{ span: 24 }"
    :rules="rules"
  >
    <div class="mb8">
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="recommendPrice"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="售价"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input-number
              :hide-button="true"
              v-model="saleInfoLz.recommendPrice"
              placeholder="请输入"
              allow-clear
            >
              <template #prefix>{{ recommendPriceUnit }}</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="promotionPrice"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="促销价"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input-number
              :hide-button="true"
              v-model="saleInfoLz.promotionPrice"
              placeholder="请输入"
              allow-clear
            >
              <template #prefix>{{ recommendPriceUnit }}</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="促销时间"
            :validate-trigger="validateTriggerOpt"
          >
            <AppRangePicker
              v-model="saleInfoLz.rangeValue"
              style="width: 100%"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="stockNumber"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="库存"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input
              v-model="saleInfoLz.stockNumber"
              placeholder="请输入"
              allow-clear
            ></gj-input>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="logisticsWeight"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="包装重量"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input-number
              :hide-button="true"
              placeholder="请输入"
              v-model="saleInfoLz.logisticsWeight"
              allow-clear
            >
              <template #suffix>kg</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="logisticsSize"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="包装尺寸(单位：CM)"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input-number
              :hide-button="true"
              placeholder="请输入"
              v-model="saleInfoLz.logisticsSizeLong"
            >
              <template #prefix> 长 </template>
            </gj-input-number>
            <span class="input-seperate">*</span>
            <gj-input-number
              :hide-button="true"
              placeholder="请输入"
              v-model="saleInfoLz.logisticsSizeWide"
            >
              <template #prefix> 宽 </template>
            </gj-input-number>
            <span class="input-seperate">*</span>
            <gj-input-number
              :hide-button="true"
              placeholder="请输入"
              v-model="saleInfoLz.logisticsSizeHigh"
            >
              <template #prefix> 高 </template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="taxes"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="Taxes"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              v-model="saleInfoLz.taxes"
              placeholder="请选择"
              allow-clear
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
import { getCurrentInstance, reactive, toRefs, computed } from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import { validateTriggerOpt } from "@common";
import AppRangePicker from "@/components/AppRangePicker.vue";

export default {
  components: {
    AppRangePicker,
  },
  setup() {
    const store = useStore();
    const key = "saleInfoLz";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      [key]: {
        recommendPrice: null,
        promotionPrice: null,
        rangeValue: [],
        stockNumber: "",
        logisticsWeight: null,
        logisticsSizeLong: null,
        logisticsSizeWide: null,
        logisticsSizeHigh: null,
        taxes: "",
      },
    });

    const isEmpty = (value) => {
      return value || value === 0 ? false : true;
    };

    const rules = {
      recommendPrice: [{ required: true, message: "售价必填" }],
      stockNumber: [{ required: true, message: "库存必填" }],
      logisticsWeight: [{ required: true, message: "包装重量必填" }],
      taxes: [{ required: true, message: "Taxes必填" }],
      logisticsSize: [
        {
          required: true,
          message: "包装尺寸必填",
          validator: (value, cb) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                if (
                  isEmpty(data[key].logisticsSizeLong) ||
                  isEmpty(data[key].logisticsSizeWide) ||
                  isEmpty(data[key].logisticsSizeHigh)
                ) {
                  cb("包装尺寸必填");
                }
                resolve();
              }, 0);
            });
          },
        },
      ],
    };

    const recommendPriceUnit = computed(() => {
      return store.getters.getParams?.basicInfoLz?.recommendPriceUnit;
    });

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "saleDraftFormRef");
    };

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
      data[key].siteId = respData.siteCode;
      data[key].shopId = respData.shopId;
      data[key].chargePersonId = respData.chargePersonId;
      const params = {
        [key]: data[key],
      };
      store.dispatch(M_T.PARAMS_QUERY, params);
    };

    return {
      ...toRefs(data),
      validateTriggerOpt,
      rules,
      recommendPriceUnit,
      validate,
      resetFields,
      submitForm,
      submitDraftForm,
      saveDraftForm,
      setPageData,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
</style>
