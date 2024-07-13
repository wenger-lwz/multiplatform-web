<template>
  <gj-form
    ref="saleDraftFormRef"
    :model="shopifySaleInfo"
    class="sale-info-form"
    :label-col-props="{ span: 24 }"
    :wrapper-col-props="{ span: 24 }"
    :rules="rules"
  >
    <div class="mb8">
      <h2 class="title mb8">销售信息</h2>
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
              :min="0"
              :hide-button="true"
              v-model="shopifySaleInfo.recommendPrice"
              placeholder="请输入"
              allow-clear
            >
              <template #prefix>{{ currency }}</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="原价"
          >
            <gj-input-number
              :min="0"
              :hide-button="true"
              v-model="shopifySaleInfo.originalPrice"
              placeholder="请输入"
              allow-clear
            >
              <template #prefix>{{ currency }}</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="inventoryInfo"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="库存"
          >
            <gj-button type="text" size="mini" @click="showInventoryModal">{{
              getInventoryTxt()
            }}</gj-button>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="transportation"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="是否运输"
          >
            <gj-switch v-model="shopifySaleInfo.transportation" size="mini" />
            <span class="pl-4">{{
              shopifySaleInfo.transportation ? "已开启" : "已关闭"
            }}</span>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            label="包装重量"
            field="packingWeight"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input-group style="flex: 1">
              <gj-input-number
                class="packing-weight-input"
                :hide-button="true"
                placeholder="请输入"
                allow-clear
                v-model="shopifySaleInfo.packingWeight"
              />
              <gj-select
                v-model="shopifySaleInfo.packingWeightUnit"
                :style="{ width: '80px', flexShrink: 0 }"
              >
                <gj-option
                  v-for="item in weightOptions"
                  :key="item.value"
                  :value="item.value"
                  >{{ item.label }}</gj-option
                >
              </gj-select>
            </gj-input-group>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="tax"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="是否收取税费"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-switch v-model="shopifySaleInfo.tax" size="mini" />
            <span class="pl-4">{{
              shopifySaleInfo.tax ? "已开启" : "已关闭"
            }}</span>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="continueSell"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="缺货是否继续销售"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-switch v-model="shopifySaleInfo.continueSell" size="mini" />
            <span class="pl-4">{{
              shopifySaleInfo.continueSell ? "已开启" : "已关闭"
            }}</span>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="HS代码"
          >
            <gj-input
              disabled
              allow-clear
              v-model="shopifySaleInfo.hsCode"
              class="input-dashed-disabled"
            />
          </gj-form-item>
        </gj-col>
      </gj-row>
    </div>
  </gj-form>
  <add-inventory
    v-model:visible="modalVisible"
    :row-inventory-info="shopifySaleInfo.inventoryInfo"
    @add-inventory="addInventory"
  />
</template>

<script>
import {
  getCurrentInstance,
  ref,
  reactive,
  toRefs,
  inject,
  watch,
  computed,
} from "vue";
import { GjMessage } from "@gj/atom";
import AddInventory from "../draftAndOnline/AddInventory.vue";
import { setForm2 } from "@/utils/fnBusiness";
import { tranStrToNumber } from "@/utils/common";
import { validateTriggerOpt } from "@common";
import { weightOptions } from "@pagesSystem/published/shopify/config";

export default {
  inheritAttrs: false,
  components: {
    AddInventory,
  },
  setup() {
    const key = "shopifySaleInfo";
    const { proxy } = getCurrentInstance();

    const shopId = inject("shopId");
    const currency = inject("currency");
    const isResetStoreInfo = inject("isResetStoreInfo");

    const modalVisible = ref(false);
    const data = reactive({
      [key]: {
        recommendPrice: null,
        originalPrice: null,
        inventoryInfo: [],
        transportation: false,
        continueSell: false,
        tax: false,
        hsCode: "955630",
        packingWeight: null,
        packingWeightUnit: "kg",
      },
    });

    watch(
      () => isResetStoreInfo.value,
      (isReset) => {
        if (isReset) {
          data[key].inventoryInfo = [];
          isResetStoreInfo.value = false;
        }
      }
    );

    const rules = computed(() => {
      return {
        recommendPrice: [
          {
            required: true,
            message: "售价必填",
          },
        ],
        warehouse: [
          {
            required: true,
            message: "仓库必填",
          },
        ],
        inventoryInfo: [
          {
            required: true,
            message: "库存必填",
            validator: (value, cb) => {
              return new Promise((resolve) => {
                if (!data[key]?.inventoryInfo?.length) {
                  cb("库存必填");
                }
                resolve();
              });
            },
          },
        ],
        packingWeight: [
          {
            required: data[key].transportation,
            message: "包装重量必填",
          },
        ],
      };
    });

    const getInventoryTxt = () => {
      const warehouseLen = data[key].inventoryInfo?.[0]?.inventoryItems?.length;
      return warehouseLen ? `${warehouseLen}个仓库存在库存` : "添加库存";
    };

    const showInventoryModal = () => {
      if (!shopId.value) {
        return GjMessage.warning("请先选择店铺");
      }
      modalVisible.value = true;
      const inventoryInfo = data[key]?.inventoryInfo?.[0];
      if (inventoryInfo) {
        data[key].inventoryInfo = [inventoryInfo];
      } else {
        data[key].inventoryInfo = [];
      }
    };

    const addInventory = (d) => {
      let isEmpty = true;
      const inventoryInfo = {
        inventoryItems: [],
        inventoryType: d.form.inventoryType,
      };
      for (let warehouse of d.managerWarehouses) {
        if (warehouse.productNum) {
          isEmpty = false;
          inventoryInfo.inventoryItems.push(warehouse);
        }
      }
      if (isEmpty) {
        data[key].inventoryInfo = [];
      } else {
        data[key].inventoryInfo[0] = inventoryInfo;
      }
      proxy.$refs.saleDraftFormRef.validateField("inventoryInfo");
    };

    const submitForm = () => {
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
      if (respData?.variants?.length) {
        const saleInfo = respData.variants[0];
        for (let k of Object.keys(data[key])) {
          if (k === "packingWeight") {
            data[key][k] = tranStrToNumber(saleInfo[k]);
          } else {
            data[key][k] = saleInfo[k];
          }
        }
      }
    };

    return {
      currency,
      ...toRefs(data),
      validateTriggerOpt,
      rules,
      weightOptions,
      modalVisible,
      showInventoryModal,
      addInventory,
      getInventoryTxt,
      validate,
      resetFields,
      submitForm,
      saveDraftForm,
      setPageData,
    };
  },
};
</script>
<style lang="scss" scoped>
.pl-4 {
  padding-left: 4px;
}
.mb8 {
  margin-bottom: 8px;
}
:deep(.packing-weight-input) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
