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
              detail-type="product"
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
          ></rightNav>
        </div>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <gj-button @click="cancel">取消</gj-button>
        <gj-button type="outline" @click="save" :loading="loading"
          >保存</gj-button
        >
        <gj-button
          type="primary"
          @click="saveAndGenerateDraft"
          :loading="draftLoading"
          >保存并生成草稿</gj-button
        >
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
  onBeforeMount,
  provide,
} from "vue";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
import BasicInfo from "../components/BasicInfo.vue";
import ProductInfo from "../components/ProductInfo.vue";
import ProductDesc from "../components/Desc.vue";
import SearchEngineOpt from "../components/SearchEngineOpt.vue";
import VariantInfo from "../components/VariantInfo.vue";
import PictureInfo from "../components/PictureInfo.vue";
import rightNav from "@/components/rightNav";
import {
  createProduct,
  updateProduct,
  getProductDetails,
} from "@/api/published/shopify";

export default defineComponent({
  components: {
    BasicInfo,
    ProductInfo,
    ProductDesc,
    SearchEngineOpt,
    VariantInfo,
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
    productId: {
      type: [String, undefined],
      default: () => {
        return "";
      },
    },
  },
  emits: ["cancel", "update-handler", "open-draft-config-page"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      loading: false,
      draftLoading: false,
      proxyThis: proxy,
      detailData: {},
    });
    const specs = ref(1);
    const relatedSkuOrSpu = ref("");
    const relatedSkus = ref([]);
    const productImages = ref([]);
    const variants = ref([]);
    // const detailData = ref({});

    const componentRef = ref([]);
    const setRefFunction = (item, el) => {
      if (!componentRef.value.find((it) => it.sectionId === item.sectionId)) {
        componentRef.value.push({ sectionId: item.sectionId, el: el });
      }
    };

    const defaultSect = [
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

    const variantSect = [
      {
        name: "变体信息",
        sectionId: "VariantInfo",
        ref: "variantInfo",
      },
    ];

    const listData = computed(() => {
      const isSingle = specs.value === 1;
      const list = isSingle
        ? defaultSect
        : defaultSect
            .slice(0, 2)
            .concat(variantSect)
            .concat(defaultSect.slice(2));
      return list;
    });

    onBeforeMount(() => {
      if (props.productId) {
        getProductDetails({
          id: props.productId,
        }).then((res) => {
          const aData = res.data;
          if (aData) {
            data.detailData = aData;
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
          }
        });
      }
    });

    const specsChange = (val) => {
      specs.value = val;
      // for (let targetRef of componentRef.value) {
      //   const isVariantRef =
      //     val === 2 &&
      //     props.type === 2 &&
      //     targetRef.sectionId === "VariantInfo";
      //   if (isVariantRef) {
      //     setTimeout(() => {
      //       console.log("isVariantRef", isVariantRef);
      //       console.log("detailData.detailData", data.detailData);
      //       targetRef.el.setPageData(data.detailData);
      //     }, 2000);
      //   }
      // }
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

    const store = useStore();

    const pageTitle = computed(() => {
      return props.type === 1 ? "添加商品" : "编辑商品";
    });

    const cancel = () => {
      emit("cancel");
    };

    const getPromiseArr = (fnName) => {
      const promiseArr = [];
      for (let targetRef of componentRef.value) {
        if (specs.value === 1 && targetRef.sectionId === "VariantInfo") {
          continue;
        }
        const fn = targetRef.el[fnName] || targetRef.el.submitForm;
        fn && promiseArr.push(fn());
      }
      return promiseArr;
    };

    const getParams = () => {
      const storeData = store.getters.getParams;

      const getSingleInfo = () => {
        const singleProduct = storeData.productInfo.singleProduct;
        return [
          {
            recommendPrice: singleProduct.recommendPrice,
            recommendPriceUnit: "USD",
            packingWeight: singleProduct.packingWeight,
            packingWeightUnit: singleProduct.packingWeightUnit,
            hsCode: singleProduct.hsCode,
            inventoryInfo: [],
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
          item.recommendPriceUnit = "USD";
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

      // const productInfo = storeData.productInfo
      const isSingleProduct = storeData.productInfo.specs === 1;
      const basicInfo = {
        categoryId: storeData.shopifyBasicInfo.categoryId,
        chargePersonId: storeData.shopifyBasicInfo.chargePersonId,
        chargePersonName: storeData.shopifyBasicInfo.chargePersonName,
      };

      const productInfo = {
        productCategoryId: storeData.productInfo.productCategoryId,
        productCategory: storeData.productInfo.productCategory,
        platformCategories: storeData.productInfo.platformCategories,
        specsType: storeData.productInfo.specs,
        spu: isSingleProduct
          ? storeData.productInfo.sku
          : storeData.productInfo.spu,
        // storeSku: storeData.productInfo.sku, 商品草稿店铺sku
        titles: [storeData.productInfo.title],
        supplier: storeData.productInfo.supplier,
        tags: storeData.productInfo.tags,
        collectionInfo: [], // 产品系列
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
        // searchEngineUrl: storeData.searchEngineOpt.url,
      };

      return {
        ...basicInfo,
        ...productInfo,
        ...property,
        descriptions,
        ...searchEngineOpt,
      };
    };

    const save = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr("submitForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          data.loading = true;
          const params = getParams();
          if (props.type === 1) {
            createProduct(params)
              .then(() => {
                GjMessage.success("创建商品成功！");
                setTimeout(() => {
                  emit("update-handler");
                }, 100);
              })
              .finally(() => {
                data.loading = false;
              });
          } else {
            updateProduct({
              ...params,
              id: props.productId,
            })
              .then(() => {
                GjMessage.success("更改成功！");
                setTimeout(() => {
                  emit("update-handler");
                }, 100);
              })
              .finally(() => {
                data.loading = false;
              });
          }
        }
      });
    };

    const saveAndGenerateDraft = () => {
      const promiseArr = getPromiseArr("submitForm");
      Promise.all(promiseArr).then((res) => {
        const isSubmit = res.every((item) => item);
        if (isSubmit) {
          data.draftLoading = true;
          const params = getParams();
          // console.log("params", params);
          if (props.type === 1) {
            createProduct(params)
              .then((res) => {
                emit("open-draft-config-page", res.data);
              })
              .finally(() => {
                data.draftLoading = false;
              });
          } else {
            updateProduct({ ...params, id: props.productId })
              .then(() => {
                emit("open-draft-config-page", props.productId);
              })
              .finally(() => {
                data.draftLoading = false;
              });
          }
        }
      });
    };

    provide("relatedSkuOrSpu", relatedSkuOrSpu);
    provide("specsType", specs);
    provide("productImages", productImages);
    provide("variants", variants);

    return {
      ...toRefs(data),
      pageTitle,
      specs,
      relatedSkus,
      specsChange,
      spuChange,
      cancel,
      save,
      saveAndGenerateDraft,
      setRefFunction,
      listData,
      relatedSkuOrSpu,
      skuTxtChange,
      spuTxtChange,
      variantChange,
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
  // padding: 0 16px 0 8px;
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
.dialog-footer {
  button {
    margin-left: 12px;
  }
}
</style>
