<template>
  <div class="product-property" id="productProperty-lz">
    <h2 class="title mb8">产品属性</h2>
    <gj-form
      ref="productPropertyFormRef"
      :model="productProperty.propertyMap"
      :rules="rules"
      class="product-property-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div
        class="squre-line mb16"
        v-for="(rowItem, index) in rowList"
        :key="index"
      >
        <div>{{ nameList[index] }}</div>
        <gj-row :gutter="24">
          <gj-col :span="8" v-for="item in rowItem" :key="item.name">
            <gj-form-item
              :field="item.name"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              :label="index === 1 ? undefined : item.label"
              :validate-trigger="validateTriggerOpt"
            >
              <template #label v-if="index === 1">
                {{ item.label }}&nbsp;<gj-tag color="#E6ECFE">KEY</gj-tag>
              </template>

              <!-- 品牌 -->
              <template v-if="item.name === 'brand'">
                <gj-select
                  placeholder="请选择"
                  allow-clear
                  :allow-search="true"
                  :loading="loading"
                  :multiple="false"
                  :allow-create="false"
                  :trigger-props="{
                    updateAtScroll: true,
                  }"
                  v-model="productProperty.propertyMap[item.name]"
                  @search="handleSearch"
                >
                  <gj-option
                    v-for="it in productProperty.options"
                    :value="it.lazadaBrandId"
                    :key="it.lazadaBrandId"
                    >{{ it.brandName }}</gj-option
                  >
                </gj-select>
              </template>

              <gj-select
                placeholder="请选择"
                allow-clear
                v-else-if="
                  item.inputType === 'singleSelect' ||
                  item.inputType === 'enumInput'
                "
                :multiple="false"
                :allow-create="false"
                :trigger-props="{
                  updateAtScroll: true,
                }"
                v-model="productProperty.propertyMap[item.name]"
              >
                <gj-option
                  v-for="it in item.options"
                  :value="it.name"
                  :key="it.name"
                  >{{ it.name }}</gj-option
                >
              </gj-select>

              <gj-select
                v-else-if="
                  item.inputType === 'multiSelect' ||
                  item.inputType === 'multiEnumInput'
                "
                :max-tag-count="1"
                :allow-create="false"
                :trigger-props="{
                  updateAtScroll: true,
                }"
                v-model="productProperty.propertyMap[item.name]"
                placeholder="请选择"
              >
                <gj-option
                  v-for="it in item.options"
                  :value="it.name"
                  :key="it.name"
                  >{{ it.name }}</gj-option
                >
              </gj-select>

              <gj-input
                v-else-if="item.inputType === 'text'"
                v-model="productProperty.propertyMap[item.name]"
                placeholder="请输入"
                allow-clear
              ></gj-input>
              <gj-input-number
                :hide-button="true"
                v-else-if="item.inputType === 'numeric'"
                v-model="productProperty.propertyMap[item.name]"
                placeholder="请输入"
                allow-clear
              ></gj-input-number>
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>
    </gj-form>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, watch, computed } from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { validateTriggerOpt } from "@common";
import { getBrandOption } from "@/api/published/lazada";

// 跨境站点用my
const SITEID_CB = "my";

export default {
  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const key = "productProperty";
    const data = reactive({
      [key]: {
        mandatoryItem: [],
        advancedIsKeyPropItem: [],
        otherItem: [],
        propertyMap: {},
        options: [],
      },
      rules: {},
      loading: false,
    });
    const nameList = computed(() => {
      return ["必填属性", "推荐属性", "附加属性"];
    });
    const rowList = computed(() => {
      return [
        data[key].mandatoryItem,
        data[key].advancedIsKeyPropItem,
        data[key].otherItem,
      ];
    });

    const getSiteId = (siteId) => {
      return siteId === "cb" ? SITEID_CB : siteId;
    };

    const validate = () => {
      return proxy.$refs.productPropertyFormRef.validate();
    };
    const resetFields = () => {
      proxy.$refs.productPropertyFormRef.resetFields();
    };
    const setInputData = (arr, cb) => {
      arr.forEach((item) => {
        if (item.inputType === "numeric") {
          const numberValue = parseFloat(data[key].propertyMap[item.name]);
          data[key].propertyMap[item.name] = Number.isNaN(numberValue)
            ? null
            : numberValue;
        } else if (
          item.inputType === "multiSelect" ||
          item.inputType === "multiEnumInput"
        ) {
          data[key].propertyMap[item.name] = data[key].propertyMap[item.name]
            ? Array.isArray(data[key].propertyMap[item.name])
              ? data[key].propertyMap[item.name]
              : data[key].propertyMap[item.name].split(",")
            : [];
        } else {
          data[key].propertyMap[item.name] =
            data[key].propertyMap[item.name] ?? "";
        }
        cb && cb(item);
      });
    };
    watch(
      () => store.getters.getProperty,
      (val) => {
        data[key].mandatoryItem = val?.mandatoryItem || [];
        data[key].advancedIsKeyPropItem = val?.advancedIsKeyPropItem || [];
        data[key].otherItem = val?.otherItem || [];
        setInputData(data[key].mandatoryItem, (item) => {
          data.rules[item.name] = [
            { required: true, message: `${item.label}必填` },
          ];
        });
        setInputData(data[key].advancedIsKeyPropItem);
        setInputData(data[key].otherItem);
      }
    );

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "productPropertyFormRef");
    };
    const saveForm = () => {
      return setForm2(proxy, key, data[key]);
    };

    const setPageData = (respData) => {
      respData.categoryAttributes?.forEach((item) => {
        data[key].propertyMap[item.attrName] = item.attrValue;
        if (item.attrName === "brand") {
          data[key].options = [
            {
              lazadaBrandId: item.attrValue,
              brandName: item.attrValueId,
            },
          ];
        }
      });
    };

    const handleSearch = (value) => {
      const siteId = store.getters.getParams?.basicInfoLz?.siteId;
      if (value && siteId) {
        data.loading = true;
        const parmas = {
          name: value,
          siteId: getSiteId(siteId),
        };
        getBrandOption(parmas)
          .then((res) => {
            data[key].options = res.data;
          })
          .finally(() => {
            data.loading = false;
          });
      } else {
        data[key].options = [];
      }
    };

    const clearData = () => {
      data[key].options = [];
    };

    return {
      ...toRefs(data),
      validateTriggerOpt,
      nameList,
      rowList,
      validate,
      resetFields,
      submitForm,
      saveForm,
      setPageData,
      handleSearch,
      clearData,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
.product-property {
  .title {
    padding: 32px 0 4px 0px;
    font-size: 14px;
  }
  .product-property-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }

  .arco-tag-custom-color {
    --color-white: #0045f0;
  }
  .squre-line {
    padding-bottom: 2px;
  }
  // 多选
  :deep(.gb-input-tag) {
    width: 100%;
  }
}
</style>
