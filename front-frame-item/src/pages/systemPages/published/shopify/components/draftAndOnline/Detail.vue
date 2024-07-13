<template>
  <full-screen-dialog :dialogVisible="dialogVisible">
    <template #title>
      <div class="dialog-title">
        <span>{{ pageTitle }}</span>
        <gj-button @click="cancel">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="detail-content">
        <div class="left-silder">
          <div
            v-for="item in listData"
            :key="item.sectionId"
            :ref="item.sectionId"
            :id="item.sectionId"
          >
            <component
              :ref="
                (el) => {
                  setRefFunction(item, el);
                }
              "
              :is="item.sectionId"
              detailType="draft"
              :related-skus="relatedSkus"
              @specs-change="specsChange"
              @spu-change="spuChange"
              @sku-txt-change="skuTxtChange"
              @spu-txt-change="spuTxtChange"
              @variant-change="variantChange"
            />
          </div>
        </div>
        <div class="right-silder">
          <rightNav
            :layoutData="listData"
            :proxyData="proxyThis"
            :topIsFixed="false"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <slot name="footer"></slot>
      </span>
    </template>
  </full-screen-dialog>
</template>
<script>
import {
  ref,
  reactive,
  toRefs,
  defineComponent,
  computed,
  getCurrentInstance,
  provide,
  watch,
} from "vue";
import { useStore } from "vuex";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
import BasicInfo from "../BasicInfo.vue";
import ProductInfo from "../ProductInfo.vue";
import ProductDesc from "../Desc.vue";
import SearchEngineOpt from "../SearchEngineOpt.vue";
import SalesInformation from "./SalesInformation.vue";
import PictureInfo from "../PictureInfo.vue";
import rightNav from "@/components/rightNav";
import { getStoreProperties, getStoreWarehouse } from "@/api/published/shopify";

export default defineComponent({
  components: {
    BasicInfo,
    ProductInfo,
    ProductDesc,
    SearchEngineOpt,
    SalesInformation,
    PictureInfo,
    fullScreenDialog,
    rightNav,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    type: {
      type: Number,
      required: true,
    },
  },
  emits: ["cancel", "update-handler"],
  setup(props, { emit }) {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const data = reactive({
      loading: false,
      saveLoading: false,
      releaseLoading: false,
      releaseTimeLoading: false,
      timingModalVisible: false,
      timeRow: [],
      proxyThis: proxy,
    });
    const specs = ref(1);
    const relatedSkuOrSpu = ref("");
    const relatedSkus = ref([]);
    const productImages = ref([]);
    const variants = ref([]);
    const warehouses = ref([]);
    const currency = ref("-");
    const isResetStoreInfo = ref(false);

    const componentRef = ref([]);
    const setRefFunction = (item, el) => {
      if (!componentRef.value.find((it) => it.sectionId === item.sectionId)) {
        componentRef.value.push({ sectionId: item.sectionId, el: el });
      }
    };

    const listData = [
      {
        name: "基础信息",
        sectionId: "BasicInfo",
        ref: "basicInfo",
      },
      {
        name: "产品信息",
        sectionId: "ProductInfo",
        ref: "productInfo",
      },
      {
        name: "销售信息",
        sectionId: "SalesInformation",
        ref: "salesInformation",
      },
      {
        name: "图片信息",
        sectionId: "PictureInfo",
        ref: "pictureInfo",
      },
      {
        name: "产品描述",
        sectionId: "ProductDesc",
        ref: "productDesc",
      },
      {
        name: "搜索引擎优化（SEO）",
        sectionId: "SearchEngineOpt",
        ref: "searchEngineOpt",
      },
    ];

    const initData = (res) => {
      const aData = res.data;
      specs.value = aData.specsType;
      relatedSkuOrSpu.value = aData.spu;
      productImages.value = aData.productImages;
      variants.value = aData.variants;
      setTimeout(() => {
        componentRef.value.forEach((targetRef) => {
          const fn = targetRef.el.setPageData;
          fn && fn(aData);
        });
      }, 0);
    };

    const pageTitle = computed(() => {
      return props.type === 1 ? "添加商品" : "编辑商品";
    });

    const computedShopId = computed(
      () => store.getters.getParams?.shopifyBasicInfo?.shopItem?.shopId
    );

    watch(
      () => computedShopId.value,
      (newShopId) => {
        if (!newShopId) {
          warehouses.value = [];
          currency.value = "-";
        } else {
          getStoreProperties({
            shopId: newShopId,
          }).then((res) => {
            currency.value = res.data.currency;
          });
          getStoreWarehouse({
            shopId: newShopId,
          }).then((res) => {
            warehouses.value = res.data;
          });
        }
      }
    );

    const specsChange = (val) => {
      specs.value = val;
    };

    const spuChange = (val) => {
      relatedSkus.value = val;
    };

    const skuTxtChange = (val) => {
      relatedSkuOrSpu.value = val;
    };

    const spuTxtChange = (val) => {
      relatedSkuOrSpu.value = val;
    };

    const variantChange = (v) => {
      variants.value = v;
    };

    const cancel = () => {
      emit("cancel");
    };

    const getPromiseArr = (fnName) => {
      const promiseArr = [];
      componentRef.value.forEach((targetRef) => {
        const fn = targetRef.el[fnName] || targetRef.el.submitForm;
        promiseArr.push(fn());
      });
      return promiseArr;
    };

    const getParams = () => {
      const storeData = store.getters.getParams;

      const getSingleInfo = () => {
        const saleInfo = storeData.shopifySaleInfo;
        return [
          {
            ...saleInfo,
            recommendPriceUnit: currency.value,
            originalPriceUnit: currency.value,
          },
        ];
      };

      const getVariants = () => {
        const dataMap = storeData.variantInfoLz || {};
        const variantImages = storeData.pictureInfo.variantImages;
        let result = dataMap.variantTableData || [];
        result.forEach((item) => {
          item.variantAttrInfo = [];
          const variant = variantImages.find(
            (variantItem) => variantItem.msku === item.msku
          );
          if (variant) {
            item.productImages = variant.productImages ?? [];
          }
          // item.inventoryInfo = []; // 库存信息
          item.recommendPriceUnit = currency.value;
          item.originalPriceUnit = currency.value;
          Object.values(dataMap.attrNames)?.forEach((attrNameId) => {
            let attrName = dataMap.attrNameOptions.find(
              (attrNameItem) => attrNameItem.attrNameId === attrNameId
            )?.label;
            const skuAttrItem = {
              attrId: attrNameId,
              attrName,
              attrValue: item[attrName],
            };
            item.variantAttrInfo.push(skuAttrItem);
          });
        });
        return result;
      };

      const getvariantAttrInfo = () => {
        const result = [];
        const dataMap = storeData.variantInfoLz || {};
        Object.keys(dataMap.attrNames || {}).forEach((key) => {
          const variantInfoItem = dataMap.attrNameOptions.find(
            (it) => it.attrNameId === dataMap.attrNames[key]
          );
          if (variantInfoItem) {
            const item = {
              attrCustom: false,
              attrId: dataMap.attrNames[key],
              attrName: variantInfoItem.label,
              attrValuesList: [],
            };
            if (dataMap.attrValues[key]) {
              dataMap.attrValues[key].forEach((value) => {
                const valueList = {
                  attrCustom: false,
                  attrValueId: null, // shopify属性值id暂时不传
                  attrValueName: value,
                };
                item.attrValuesList.push(valueList);
              });
            }
            result.push(item);
          }
        });
        return result;
      };

      const isSingleProduct = storeData.productInfo.specs === 1;
      const basicInfo = {
        shopId: storeData.shopifyBasicInfo.shopItem.shopId,
        storeName: storeData.shopifyBasicInfo.storeName,
        categoryId: storeData.shopifyBasicInfo.categoryId,
        chargePersonId: storeData.shopifyBasicInfo.chargePersonId,
        chargePersonName: storeData.shopifyBasicInfo.chargePersonName,
      };

      const productInfo = {
        productCategoryId: storeData.productInfo.productCategoryId,
        productCategory: storeData.productInfo.productCategory,
        platformCategories: storeData.productInfo.platformCategories,
        specsType: storeData.productInfo.specs,
        storeSku: storeData.productInfo.singleProduct.storeSku,
        spu: isSingleProduct
          ? storeData.productInfo.sku
          : storeData.productInfo.spu,
        title: storeData.productInfo.title,
        titles: [storeData.productInfo.title],
        supplier: storeData.productInfo.supplier,
        tags: storeData.productInfo.tags,
        // collectionInfo: [], // 产品系列
        salesChannelsApplications: storeData.productInfo.channel,
        productImages: storeData.pictureInfo.productImages,
        templateStyle: storeData.productInfo.template,
      };

      const property = {
        variants: isSingleProduct ? getSingleInfo() : getVariants(),
        variantAttrs: getvariantAttrInfo(),
      };

      const descriptions = storeData.shopifyProductDesc.text;
      const searchEngineOpt = {
        searchEngineTitle: storeData.searchEngineOpt.titleDesc,
        searchEngineDesc: storeData.searchEngineOpt.sourceTitleDesc,
        searchEngineUrl: storeData.searchEngineOpt.url,
      };

      return {
        ...basicInfo,
        ...productInfo,
        ...property,
        descriptions,
        ...searchEngineOpt,
      };
    };

    provide("shopId", computedShopId);
    provide("warehouses", warehouses);
    provide("relatedSkuOrSpu", relatedSkuOrSpu);
    provide("specsType", specs);
    provide("productImages", productImages);
    provide("variants", variants);
    provide("currency", currency);
    provide("isResetStoreInfo", isResetStoreInfo);

    return {
      ...toRefs(data),
      pageTitle,
      specs,
      relatedSkus,
      specsChange,
      spuChange,
      cancel,
      setRefFunction,
      listData,
      relatedSkuOrSpu,
      skuTxtChange,
      spuTxtChange,
      variantChange,
      initData,
      getPromiseArr,
      getParams,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.basic-info) {
  .title {
    padding-top: 20px;
  }
}
:deep(.title) {
  padding: 32px 0 5px 0px;
  line-height: 16px;
  font-size: 14px;
}
:deep(.arco-form) {
  box-sizing: border-box;
}
:deep(.arco-form-item) {
  margin-bottom: 0;
}
.detail-content {
  padding: 0px 24px 16px 8px;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  .left-silder {
    padding-right: 24px;
    width: calc(100% - 100px);
  }
  .right-silder {
    padding-top: 16px;
    width: 100px;
    position: fixed;
    right: 24px;
    top: 80px;
    .arco-anchor {
      width: 100%;
    }
  }
}
:deep(.dialog-footer) {
  button {
    margin-left: 12px;
  }
}
</style>
