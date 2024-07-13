<template>
  <div class="product-info">
    <h2 class="title">产品信息</h2>
    <gj-form
      ref="productInfoFormRef"
      :model="productInfo"
      class="product-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
    >
      <gj-form-item
        :label-col-style="{ 'justify-content': 'flex-start' }"
        field="title"
      >
        <template #label>
          产品标题
          <gj-button type="text" size="mini" @click="titleVisible = true"
            >素材中心</gj-button
          >
        </template>
        <gj-input
          v-model="productInfo.title"
          :max-length="255"
          placeholder="请输入"
          allow-clear
          show-word-limit
        />
      </gj-form-item>
      <div class="mb16">
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item
              class="categories-cascader-item"
              label="Shopify产品类别"
              :label-col-style="{ 'justify-content': 'flex-start' }"
            >
              <gj-input-group style="flex: 1; min-width: 0">
                <gj-select
                  placeholder="请选择"
                  v-model="categoryType"
                  style="width: 86px; flex-shrink: 0"
                  :trigger-props="triggerProps"
                  @change="categoryTypeChange"
                >
                  <gj-option :value="0">标准</gj-option>
                  <gj-option :value="1">自定义</gj-option>
                </gj-select>
                <gj-cascader
                  v-if="categoryType === 0"
                  :options="categories"
                  v-model="productInfo.productCategoryId"
                  :input-value="productInfo.categoryLabels"
                  placeholder="请选择Shopify类别"
                  :trigger-props="triggerProps"
                  :format-label="format"
                  :load-more="loadMore"
                />
                <gj-input
                  v-else
                  allow-clear
                  v-model="productInfo.productCategory"
                />
              </gj-input-group>
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="规格"
            >
              <gj-radio-group v-model="productInfo.specs" @change="specsChange">
                <gj-radio :value="1">单品</gj-radio>
                <gj-radio :value="2">变体</gj-radio>
              </gj-radio-group>
            </gj-form-item>
          </gj-col>
          <gj-col
            :span="8"
            v-if="productInfo.specs === 1 && detailType === 'draft'"
          >
            <gj-form-item
              field="singleProduct.storeSku"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              :validate-trigger="validateTriggerOpt"
            >
              <template #label>
                店铺SKU
                <gj-button type="text" size="mini" @click="generateStoreSku"
                  >自动生成</gj-button
                >
              </template>
              <gj-input
                v-model="productInfo.singleProduct.storeSku"
                placeholder="请输入"
                allow-clear
              />
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>
      <div v-if="productInfo.specs === 1" class="squre-line mb16">
        <gj-form-item
          field="sku"
          :label-col-style="{ 'justify-content': 'flex-start' }"
          :rules="[{ required: true, message: 'sku必填' }]"
        >
          <template #label>
            关联SKU
            <gj-button @click="skuModalVisible = true" type="text" size="mini"
              >选择SKU</gj-button
            >
          </template>
          <div>
            <p v-if="productInfo.sku">{{ productInfo.sku }}</p>
            <p v-else style="color: #808197">暂未关联SKU</p>
          </div>
        </gj-form-item>
      </div>
      <div v-else class="squre-line mb16">
        <gj-form-item
          field="spu"
          :label-col-style="{ 'justify-content': 'flex-start' }"
          :rules="[{ required: true, message: 'spu必填' }]"
        >
          <template #label>
            关联SPU
            <gj-button @click="spuModalVisible = true" type="text" size="mini"
              >选择SPU</gj-button
            >
          </template>
          <div>
            <p v-if="productInfo.spu">{{ productInfo.spu }}</p>
            <p v-else style="color: #808197">暂未关联SPU</p>
          </div>
        </gj-form-item>
      </div>
      <gj-row :gutter="24" class="mb16">
        <template v-if="productInfo.specs === 1 && detailType === 'product'">
          <gj-col :span="8">
            <gj-form-item
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="建议售价"
            >
              <gj-input-number
                :min="0"
                :max="MAX_RECOMMEND_PRICE"
                :precision="2"
                :hide-button="true"
                placeholder="请输入"
                allow-clear
                v-model="productInfo.singleProduct.recommendPrice"
              >
                <template #prefix>{{ productInfo.currency }}</template>
              </gj-input-number>
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="包装重量"
            >
              <gj-input-group style="flex: 1">
                <gj-input-number
                  class="packing-weight-input"
                  :min="0"
                  :max="MAX_PACKING_WEIGHT"
                  :precision="4"
                  :hide-button="true"
                  placeholder="请输入"
                  allow-clear
                  v-model="productInfo.singleProduct.packingWeight"
                />
                <gj-select
                  v-model="productInfo.singleProduct.packingWeightUnit"
                  :style="{ width: '80px', flexShrink: 0 }"
                  :trigger-props="triggerProps"
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
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="HS代码"
            >
              <gj-input
                disabled
                allow-clear
                v-model="productInfo.singleProduct.hsCode"
                class="input-dashed-disabled"
              />
            </gj-form-item>
          </gj-col>
        </template>
        <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="供应商"
          >
            <gj-select
              placeholder="请选择"
              v-model="productInfo.supplier"
              :trigger-props="triggerProps"
            >
              <gj-option
                v-for="item in supplierList"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="标签"
          >
            <gj-select
              v-model="productInfo.tags"
              :max-tag-count="3"
              placeholder="请选择"
              :trigger-props="triggerProps"
              multiple
              allow-create
            >
              <gj-option
                v-for="tag of tagOptions"
                :key="tag.id"
                :value="tag.title"
                :tag-props="{ closable: true }"
                >{{ tag.title }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
        <!-- <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="产品系列"
          >
            <gj-select placeholder="请选择" v-model="productInfo.range">
              <gj-option
                v-for="item in ranges"
                :key="item.id"
                :value="item.id"
                >{{ item.label }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="销售渠道和应用"
          >
            <gj-select placeholder="请选择" v-model="productInfo.channel">
              <gj-option
                v-for="item in channels"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="模板样式"
          >
            <gj-select placeholder="请选择" v-model="productInfo.template">
              <gj-option
                v-for="item in templates"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col> -->
      </gj-row>
      <select-sku
        v-if="productInfo.specs === 1"
        v-model:visible="skuModalVisible"
        @confirm="setSku"
      />
      <select-spu v-else v-model:visible="spuModalVisible" @confirm="setSpu" />
      <select-title
        v-model:visible="titleVisible"
        @confirm="changeTitle"
        @close="titleVisible = false"
      />
    </gj-form>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, watch, inject } from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import SelectTitle from "@/pages/systemPages/published/materialCenter/modal/title.vue";
import {
  getFirstFloorCategory,
  getCategoryByParentId,
  getNormalLabel,
  getSupplierList,
  getTemplateStyleList,
  getSalesApplicationList,
} from "@/api/published/shopify";
import { getSkuRule, getSkuListBySpu } from "@/api/public";
import { GjMessage } from "@gj/atom";
import SelectSku from "@/components/SelectSku.vue";
import SelectSpu from "@/components/SelectSpu.vue";

import { weightOptions } from "@pagesSystem/published/shopify/config";
import { tranStrToNumber } from "@/utils/common";
import { validateTriggerOpt } from "@common";
import {
  MAX_PACKING_WEIGHT,
  MAX_RECOMMEND_PRICE,
} from "@pagesSystem/published/shopify/config";

export default {
  inheritAttrs: false,
  components: {
    SelectSku,
    SelectSpu,
    SelectTitle,
  },
  props: {
    detailType: {
      type: String,
      default: "product",
    },
  },
  emits: ["spu-change", "specs-change", "sku-txt-change", "spu-txt-change"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const $store = useStore();
    const key = "productInfo";
    const data = reactive({
      categoryType: 0,
      categories: [],
      supplierList: [],
      tagOptions: [],
      ranges: [],
      channels: [],
      templates: [],
      titleVisible: false,
      skuModalVisible: false,
      spuModalVisible: false,
      [key]: {
        productCategoryId: "",
        productCategory: "",
        categoryLabels: "",
        platformCategories: [],
        sku: "",
        spu: "",
        specs: 1,
        title: "",
        singleProduct: {
          storeSku: null,
          recommendPrice: null,
          packingWeight: null,
          packingWeightUnit: "kg",
          hsCode: "955630",
        },
        supplier: "",
        tags: [],
        range: "",
        channel: "",
        template: "",
        currency: "USD",
      },
    });

    const shopId = inject("shopId", undefined);

    const rules = {
      title: [
        {
          required: true,
          message: "产品标题必填",
        },
      ],
      "singleProduct.storeSku": [
        {
          required: true,
          message: "店铺SKU必填",
        },
      ],
    };

    const tagProps = {
      closable: true,
    };

    const triggerProps = {
      updateAtScroll: true,
    };

    if (props.detailType === "draft") {
      const isResetStoreInfo = inject("isResetStoreInfo");
      watch(
        () => isResetStoreInfo.value,
        (isReset) => {
          if (isReset) {
            data[key].singleProduct.storeSku = null;
          }
        }
      );
    }

    watch(
      () => data[key].specs,
      () => {
        const params = {
          [key]: data[key],
        };
        $store.commit(M_T.PARAMS_QUERY, params);
      }
    );

    const init = () => {
      getFirstFloorCategory().then((res) => {
        const d = res?.data ?? [];
        const categories = d.map((category) => {
          return {
            value: category.id,
            label: category.name,
            isLeaf: category.leafFlag,
          };
        });
        data.categories = categories;
      });
      getNormalLabel().then((res) => {
        data.tagOptions = res.data;
      });
      getSupplierList().then((res) => {
        data.supplierList = res.data;
      });
      getTemplateStyleList().then((res) => {
        data.templates = res.data;
      });
      getSalesApplicationList().then((res) => {
        data.channels = res.data;
      });
    };

    init();

    const validate = () => {
      return proxy.$refs.productInfoFormRef.validate();
    };

    const resetFields = () => {
      proxy.$refs.productInfoFormRef.resetFields();
    };

    const loadMore = (option, done) => {
      const params = {
        parentId: option.value,
      };

      getCategoryByParentId(params).then((res) => {
        const data = res?.data ?? [];
        let nodes = [];
        nodes = createTree(data);
        done(nodes);
      });
    };

    const createTree = (data) => {
      let traverse = function (nodes = []) {
        let newArr = [];
        newArr = nodes.map((item) => {
          return {
            value: item.id,
            label: item.name,
            isLeaf: item.leafFlag,
            children: item?.children?.length ? traverse(item.children) : null,
          };
        });
        return newArr;
      };
      return traverse(data);
    };

    const format = (options) => {
      const labels = options.map((option) => option.label);
      data[key].productCategory = options.slice(options.length - 1)?.[0]?.label;
      data[key].platformCategories = options.map((item) => {
        return {
          id: item.value,
          name: item.label,
        };
      });
      return labels.join(" / ");
    };

    const categoryTypeChange = () => {
      data[key].productCategory = "";
      data[key].productCategoryId = "";
      data[key].platformCategories = [];
    };

    const specsChange = (val) => {
      emit("specs-change", val);
    };

    const generateStoreSku = () => {
      if (!shopId.value) {
        return GjMessage.warning("请先选择店铺");
      }
      getSkuRule({
        platformCode: "SHOPIFY",
        shopCode: shopId.value,
      })
        .then((res) => {
          data[key].singleProduct.storeSku = res.data.parentRuleStr;
        })
        .finally(() => {
          proxy.$refs.productInfoFormRef.validateField(
            "singleProduct.storeSku"
          );
        });
    };

    const setSku = (sku) => {
      if (sku) {
        data[key].sku = sku;
        emit("sku-txt-change", sku);
      }
    };

    const setSpu = (spu) => {
      if (spu) {
        data[key].spu = spu;
        emit("spu-txt-change", spu);
        getSkuListBySpu({ spu }).then((res) => {
          emit("spu-change", res.data);
        });
      }
    };

    const changeTitle = (titles) => {
      data.titleVisible = false;
      if (titles.length) {
        data.productInfo.title = titles[0].content;
      }
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "productInfoFormRef");
    };

    const saveForm = () => {
      return setForm2(proxy, key, data[key]);
    };

    const setPageData = (aData) => {
      if (aData.specsType === 1) {
        data[key].sku = aData.spu;
      } else {
        data[key].spu = aData.spu;
        setSpu(aData.spu);
      }
      data[key].platformCategories = aData.platformCategories;
      data.categoryType =
        aData.productCategoryId && aData.platformCategories?.length ? 0 : 1;
      data[key].productCategory = aData.productCategory;
      data[key].categoryLabels =
        aData.platformCategories?.map((item) => item.name).join(" / ") ?? "";
      data[key].specs = aData.specsType;
      data[key].title = aData.title ?? aData.titles?.[0]; // 商品资料用titles
      data[key].supplier = aData.supplier;
      data[key].tags = aData.tags;
      data[key].channel = aData.salesChannelsApplications;
      data[key].template = aData.templateStyle;
      if (aData.specsType === 1) {
        const singleProduct = aData.variants[0];
        data[key].singleProduct = {
          recommendPrice: singleProduct.recommendPrice,
          packingWeight: tranStrToNumber(singleProduct.packingWeight),
          packingWeightUnit: singleProduct.packingWeightUnit,
          hsCode: singleProduct.hsCode,
        };
        if (props.detailType === "draft" && aData?.variants?.length) {
          data[key].singleProduct.storeSku = aData?.storeSku;
        }
      }
      data[key].specs = aData.specsType;
    };

    return {
      MAX_PACKING_WEIGHT,
      MAX_RECOMMEND_PRICE,
      rules,
      ...toRefs(data),
      validateTriggerOpt,
      tagProps,
      triggerProps,
      weightOptions,
      generateStoreSku,
      setSku,
      setSpu,
      validate,
      resetFields,
      format,
      loadMore,
      submitForm,
      saveForm,
      setPageData,
      specsChange,
      changeTitle,
      categoryTypeChange,
    };
  },
};
</script>
<style lang="scss" scoped>
:deep(.categories-cascader-item) {
  .arco-form-item-content-flex {
    min-width: 0;
    .arco-select-view-single {
      min-width: 0;
    }
  }
}
:deep(.packing-weight-input) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
