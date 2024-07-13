<template>
  <fullScreenDialog :dialogVisible="dialogVisible">
    <template #title>
      <div class="dialog-title">
        <span>{{ pageTitle }}</span>
        <gj-button type="plain" @click="cancel">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <gj-spin :loading="loading" :size="32">
        <div class="detail-content">
          <div class="left-silder">
            <div id="BasicInfoLazada" ref="BasicInfoLazada">
              <BasicInfoLazada ref="basicInfoLz" @site-change="changeSiteId" />
            </div>

            <div id="ProductInfoLazada" ref="ProductInfoLazada">
              <ProductInfoLazada
                ref="productInfoLz"
                @clear-data="clearData"
                @spu-change="spuChange"
                @specs-change="specsChange"
              />
            </div>
            <template v-if="showAll">
              <div id="ProductPropertyLazada" ref="ProductPropertyLazada">
                <ProductPropertyLazada ref="productProtertyLz" />
              </div>
              <div
                id="VariantCommodity"
                ref="VariantCommodity"
                v-show="showVariant"
              >
                <VariantCommodity
                  ref="variantInfoLz"
                  :related-skus="relatedSkus"
                />
              </div>
              <div id="ImageLazada" ref="ImageLazada">
                <ImageLazada ref="pictureVideo" />
              </div>
              <div id="RepairServiceLazada" ref="RepairServiceLazada">
                <RepairServiceLazada ref="repairServiceLz" />
              </div>
              <div id="PackageLazada" ref="PackageLazada">
                <PackageLazada ref="packagingInfoLz" />
              </div>
              <div id="LongDescLazada" ref="LongDescLazada">
                <LongDescLazada ref="longDescLz" :editable="true" />
              </div>
              <div id="ShortDescLazada" ref="ShortDescLazada">
                <ShortDescLazada ref="shortDescLz" :editable="true" />
              </div>
            </template>
          </div>
          <div class="right-silder">
            <rightNav
              :layoutData="listData"
              :proxyData="proxyThis"
              :topIsFixed="false"
            ></rightNav>
          </div>
        </div>
      </gj-spin>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <gj-button type="plain" @click="cancel">取消</gj-button>
        <gj-button type="outline" @click="save" :loading="saveLoading"
          >保存</gj-button
        >
        <gj-button type="primary" @click="saveAndDraft" :loading="draftLoading"
          >保存并生成草稿</gj-button
        >
      </span>
    </template>
  </fullScreenDialog>
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
  defineAsyncComponent,
} from "vue";
import { useStore } from "vuex";
import { M_T } from "@/store/mutationsTypes";
import { GjMessage } from "@gj/atom";
import {
  createProduct,
  updateProduct,
  editProduct,
} from "@/api/published/lazada";
import { siteList } from "@pagesSystem/published/lazada/config";
import { useRefSetData } from "@pagesSystem/published/lazada/hooks";
import rightNav from "@/components/rightNav";
import BasicInfoLazada from "./BasicInfo.vue";
import ProductInfoLazada from "./ProductInfo.vue";
const ProductPropertyLazada = defineAsyncComponent(() =>
  import(
    "@pagesSystem/published/lazada/components/common/ProductPropertyLz.vue"
  )
);
const VariantCommodity = defineAsyncComponent(() =>
  import("./VariantCommodity.vue")
);
const ImageLazada = defineAsyncComponent(() =>
  import("@pagesSystem/published/lazada/components/common/ImageLz.vue")
);
const RepairServiceLazada = defineAsyncComponent(() =>
  import("@pagesSystem/published/lazada/components/common/RepairServiceLz.vue")
);
const PackageLazada = defineAsyncComponent(() =>
  import("@pagesSystem/published/lazada/components/common/PackageLz.vue")
);
const LongDescLazada = defineAsyncComponent(() =>
  import("@pagesSystem/published/lazada/components/common/LongDesc.vue")
);
const ShortDescLazada = defineAsyncComponent(() =>
  import("@pagesSystem/published/lazada/components/common/ShortDesc.vue")
);

import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";

export default defineComponent({
  components: {
    BasicInfoLazada,
    ProductInfoLazada,
    ProductPropertyLazada,
    VariantCommodity,
    ImageLazada,
    RepairServiceLazada,
    PackageLazada,
    LongDescLazada,
    ShortDescLazada,
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
    dialogType: {
      type: [Number, String],
      required: true,
    },
    pids: {
      type: [String, undefined],
      default: () => {
        return "";
      },
    },
  },
  emits: ["cancel", "update-table-list"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      specsType: 1,
      loading: false,
      saveLoading: false,
      draftLoading: false,
      proxyThis: proxy,
    });

    const defaultSect = [
      {
        name: "lazada.basicInfo",
        sectionId: "BasicInfoLazada",
        ref: "basicInfoLz",
      },
      {
        name: "lazada.productInformation",
        sectionId: "ProductInfoLazada",
        ref: "productInfoLz",
      },
    ];
    const otherSect = [
      {
        name: "lazada.productAttributes",
        sectionId: "ProductPropertyLazada",
        ref: "productProtertyLz",
      },
      {
        name: "lazada.variantInformation",
        sectionId: "VariantCommodity",
        ref: "variantInfoLz",
      },
      {
        name: "lazada.pictureInformation",
        sectionId: "ImageLazada",
        ref: "pictureVideo",
      },
      {
        name: "lazada.repairService",
        sectionId: "RepairServiceLazada",
        ref: "repairServiceLz",
      },
      {
        name: "lazada.packagingInformation",
        sectionId: "PackageLazada",
        ref: "packagingInfoLz",
      },
      {
        name: "lazada.longDescrition",
        sectionId: "LongDescLazada",
        ref: "longDescLz",
        editable: true,
      },
      {
        name: "lazada.shortDescrition",
        sectionId: "ShortDescLazada",
        ref: "shortDescLz",
        editable: true,
      },
    ];
    const store = useStore();
    const showAll = computed(
      () => store.getters.getParams?.productInfo?.lazadaType
    );
    const showVariant = computed(() => data.specsType === 2);
    const listData = computed(() => {
      const list = showVariant.value
        ? otherSect
        : [otherSect[0], ...otherSect.slice(2)];
      return showAll.value ? [...defaultSect, ...list] : defaultSect;
    });
    const pageTitle = computed(() => {
      return props.dialogType === 1 ? "添加商品" : "编辑商品";
    });
    const global = computed(
      () => store.getters.getParams?.basicInfoLz?.siteId === "cb"
    );
    const relatedSkus = ref([]);

    onBeforeMount(() => {
      if (props.pids) {
        data.loading = true;
        // 请求数据 绑定页面
        editProduct({ id: props.pids })
          .then((res) => {
            const respData = res.data;
            if (respData.platformCategoryId) {
              // 说明有显示其他的模块
              store.commit(M_T.PARAMS_QUERY, {
                productInfo: {
                  lazadaType: respData.platformCategoryId,
                },
              });
            }
            data.specsType = respData.specsType;
            useRefSetData(proxy, respData);
            // 延时处理
            setTimeout(() => {
              useRefSetData(proxy, respData, ["basicInfoLz", "productInfoLz"]);
            }, 100);
          })
          .finally(() => {
            setTimeout(() => {
              data.loading = false;
            }, 100);
          });
      }
    });

    const cancel = () => {
      emit("cancel");
    };
    const getPromiseArr = (fnName) => {
      const formList = proxy.$refs;
      const promiseArr = [];
      Object.keys(formList).forEach((key) => {
        const targetRef = formList[key];
        const fn = targetRef?.[fnName] || targetRef?.submitForm;
        if (fn) {
          promiseArr.push(fn());
        }
      });
      return promiseArr;
    };
    const getPramData = () => {
      const storeData = store.getters.getParams;
      const getCategoryAttributes = (storeData) => {
        const result = [];
        const dataMap = storeData?.productProperty || {};
        const getAttrName = (key) => {
          let item = dataMap.mandatoryItem.find((it) => it.name === key);
          if (item) {
            return { ...item, type: 0 };
          }
          item = dataMap.advancedIsKeyPropItem.find((it) => it.name === key);
          if (item) {
            return { ...item, type: 1 };
          }
          item = dataMap.otherItem.find((it) => it.name === key);
          if (item) {
            return { ...item, type: 1 };
          }
          return null;
        };
        Object.keys(dataMap.propertyMap || {}).forEach((key) => {
          if (dataMap.propertyMap[key] || dataMap.propertyMap[key] === 0) {
            let attrItem = getAttrName(key);
            const attrValue = Array.isArray(dataMap.propertyMap[key])
              ? dataMap.propertyMap[key].join(",")
              : dataMap.propertyMap[key];
            if (attrItem) {
              let attrValueId;
              if (key === "brand") {
                attrValueId = dataMap.options.find(
                  (it) => it.lazadaBrandId === attrValue
                )?.brandName;
              }
              const item = {
                attrName: key,
                attributeType: attrItem.attributeType,
                attrValue,
                attrValueId: attrValueId,
                type: attrItem.type, // 0必填 1非必填
              };
              result.push(item);
            }
          }
        });
        return result;
      };
      const getTitles = (arr) => {
        return arr.map((item) => item.titleDesc).filter((item) => item);
      };
      const getDesc = (obj, type) => {
        if (!obj) return;
        return obj.text
          .map((item, index) => ({
            type,
            descriptionInfo: item,
            previewUrl: obj.previewUrl[index],
          }))
          .filter((item) => item.descriptionInfo);
      };

      // 变体 table2
      const getVariants = (storeData) => {
        const dataMap = storeData.variantInfoLz || {};
        let skuAttrItem = null;
        let result = JSON.parse(JSON.stringify(dataMap.variantTableData || []));
        result.forEach((item) => {
          item.skuAttr = [];
          Object.values(dataMap.salePropSelect)?.forEach((valueId) => {
            let target = dataMap.salePropItem.find(
              (selectItem) => selectItem.attributeId === valueId
            );
            skuAttrItem = {
              label: target?.label,
              attrId: valueId,
              attrName: target?.name,
              attrValue: item[target?.label] || "",
            };
            item.skuAttr.push(skuAttrItem);
            delete item.rowskey;
          });
          if (global.value) {
            item.globalRelations = getGlobalRelations(item.globaRecommendPrice);
            item.recommendPrice = item.globaRecommendPrice?.["cb"];
          }
          delete item.globaRecommendPrice;
        });
        return result;
      };

      // 变体属性值 table1
      const getvariantAttrInfo = (storeData) => {
        const result = [];
        const dataMap = storeData.variantInfoLz || {};
        const imageLz = storeData.imageLz || {};
        const getVariantImages = (key, imageLz) => {
          const result = [];
          if (imageLz.variantImages) {
            let variantImagesTemp = JSON.parse(
              JSON.stringify(imageLz.variantImages[key] || [])
            );
            variantImagesTemp = variantImagesTemp.filter(
              (item) => !item.itemType
            );
            variantImagesTemp.forEach((it) => {
              result.push({
                contentType: it.contentType,
                hashCode: it.hashCode || it.hashcode,
                height: it.height,
                resource: it.resource,
                size: it.size,
                thumbnail: false,
                width: it.width,
              });
            });
          }
          if (imageLz.variantThumbImages) {
            imageLz.variantThumbImages[key]?.forEach((it) => {
              result.push({
                contentType: it.contentType,
                hashCode: it.hashCode || it.hashcode,
                height: it.height,
                resource: it.resource,
                size: it.size,
                thumbnail: true,
                width: it.width,
              });
            });
          }
          return result;
        };

        Object.keys(dataMap.salePropSelect || {}).forEach((key) => {
          const variantInfoItem = dataMap.salePropItem.find(
            (it) => it.attributeId === dataMap.salePropSelect[key]
          );
          if (variantInfoItem) {
            const item = {
              attrCustom: false, // 是否是自定义属性，自定义属性暂时没这功能
              attrId: dataMap.salePropSelect[key],
              attrName: variantInfoItem.name,
              label: variantInfoItem.label,
              attributeValues: [],
              mainVariation:
                imageLz.mainVariantProperty === variantInfoItem.label, // 变体主属性
            };
            if (dataMap.tagValueList[key]) {
              dataMap.tagValueList[key].forEach((value) => {
                const valueList = {
                  attrValueCustom: false,
                  attrValueId: null,
                  attrValueName: value,
                  variantImages: item.mainVariation
                    ? getVariantImages(value, imageLz)
                    : [],
                };
                const isAttrValueCustom = variantInfoItem.options.find(
                  (it) => it.name === value
                );
                valueList.attrValueCustom = !isAttrValueCustom;
                valueList.attrValueId = isAttrValueCustom?.optionId;
                item.attributeValues.push(valueList);
              });
            }
            result.push(item);
          }
        });
        return result;
      };

      const getProductImages = (storeData) => {
        const productImageList = [];
        let dataMap = storeData.saleImages || {};
        if (dataMap.images) {
          let tempData = JSON.parse(JSON.stringify(dataMap.images));
          tempData = tempData.filter((item) => !item.itemType);
          tempData.forEach((item) => {
            productImageList.push({
              businessType: 0,
              contentType: item.contentType,
              hashCode: item.hashCode || item.hashcode,
              height: item.height,
              mainImage: false,
              resource: item.resource,
              size: item.size,
              width: item.width,
            });
          });
        }
        dataMap = storeData.imageLz || {};
        if (dataMap.productImages) {
          // 过滤掉按钮
          let tempData = JSON.parse(JSON.stringify(dataMap.productImages));
          tempData = tempData.filter((item) => !item.itemType);
          tempData.forEach((item) => {
            productImageList.push({
              businessType: 1,
              contentType: item.contentType,
              hashCode: item.hashCode || item.hashcode,
              height: item.height,
              mainImage: !!item.mainImage,
              resource: item.resource,
              size: item.size,
              width: item.width,
            });
          });
        }
        return productImageList;
      };

      const getVideoUrl = (storeData) => {
        const videoList = [];
        const dataMap = storeData.videoInfo || {};
        if (dataMap.videoList) {
          dataMap.videoList.forEach((item) => {
            videoList.push({
              contentType: item.contentType,
              hashCode: item.hashCode || item.hashcode,
              height: item.height,
              resource: item.resource,
              resourceId: item.resourceId,
              size: item.size,
              thumbnail: false,
              width: item.width,
              videoCoverUrl: item.videoCoverUrl, //
            });
          });
        }
        return videoList;
      };

      const getGlobalRelations = (inputData) => {
        const result = [];
        siteList.forEach((item) => {
          result.push({
            price: inputData?.[item.platformCode],
            siteCode: item.platformCode,
          });
        });
        return result;
      };

      const basicInfo = {
        siteCode: storeData.basicInfoLz.siteId,
        chargePersonId: storeData.basicInfoLz.chargePersonId,
        titles: getTitles(storeData.productInfo.titleList),
        categoryId: storeData.basicInfoLz.categoryId,
        categoryName: storeData.basicInfoLz.categoryName,
      };
      const isSingleProduct = storeData.productInfo.specsType != 2;
      const propertyInfo = {
        platformCategoryId: storeData.productInfo?.lazadaType,
        platformCategories: storeData.productInfo?.platformCategories || [],
        logisticsSizeLong: isSingleProduct
          ? String(storeData.productInfo.singleProduct.long ?? "")
          : "",
        logisticsSizeWide: isSingleProduct
          ? String(storeData.productInfo.singleProduct.width ?? "")
          : "",
        logisticsSizeHigh: isSingleProduct
          ? String(storeData.productInfo.singleProduct.height ?? "")
          : "",
        logisticsWeight: isSingleProduct
          ? String(storeData.productInfo.singleProduct.weight ?? "")
          : "",
        productImages: getProductImages(storeData),
        videoUrl: getVideoUrl(storeData),
        recommendPrice: isSingleProduct
          ? global.value
            ? storeData.productInfo?.globaRecommendPrice?.cb
            : storeData.productInfo.singleProduct?.price
          : "",
        recommendPriceUnit: storeData.basicInfoLz.recommendPriceUnit || "",
        specsType: storeData.productInfo?.specsType,
        spu: isSingleProduct
          ? storeData.productInfo?.sku
          : storeData.productInfo?.spu,
        taxes: isSingleProduct
          ? storeData.productInfo?.singleProduct.taxes
          : "",
      };
      const variants = !isSingleProduct ? getVariants(storeData) : [];
      const variantAttrInfo = !isSingleProduct
        ? getvariantAttrInfo(storeData)
        : [];
      // 保修
      const warranty = {
        warranty: storeData.repairServiceLz?.warrantyTime,
        warrantyType: storeData.repairServiceLz?.warrantyType,
        productWarranty: storeData.repairServiceLz?.warrantyPolicy,
      };

      // 包装
      const packageInfo = {
        hazmat: storeData.packageLz?.hazmat.join(","),
        packageContent: storeData.packageLz?.packageContent,
      };

      const longDesc = getDesc(storeData.longDescLz, 0);
      const shortDesc = getDesc(storeData.shortDescLz, 1);
      let descriptions = [];
      if (longDesc) {
        descriptions = descriptions.concat(longDesc);
      }
      if (shortDesc) {
        descriptions = descriptions.concat(shortDesc);
      }
      return {
        global: global.value,
        globalRelations:
          isSingleProduct && global.value
            ? getGlobalRelations(storeData.productInfo?.globaRecommendPrice)
            : undefined,
        ...basicInfo,
        ...propertyInfo,
        categoryAttributes: getCategoryAttributes(storeData),
        variants,
        variantAttrInfo,
        ...warranty,
        ...packageInfo,
        descriptions,
      };
    };
    const save = () => {
      let isSubmit = true;
      data.saveLoading = true;
      const promiseArr = getPromiseArr("saveForm");
      Promise.all(promiseArr)
        .then((res) => {
          isSubmit = res.every((item) => item);
          if (isSubmit) {
            const params = getPramData();
            if (props.dialogType === 1) {
              createProduct(params)
                .then(() => {
                  GjMessage.success("商品资料保存成功！");
                  emit("update-table-list");
                })
                .finally(() => {
                  data.saveLoading = false;
                });
            } else {
              updateProduct({ ...params, id: props.pids })
                .then(() => {
                  GjMessage.success("商品资料保存成功！");
                  emit("update-table-list");
                })
                .finally(() => {
                  data.saveLoading = false;
                });
            }
          } else {
            data.saveLoading = false;
          }
        })
        .catch(() => {
          data.saveLoading = false;
        });
    };

    const saveAndDraft = () => {
      let isSubmit = true;
      data.draftLoading = true;
      const promiseArr = getPromiseArr("submitForm");
      Promise.all(promiseArr)
        .then((res) => {
          isSubmit = res.every((item) => item);
          if (isSubmit) {
            const params = getPramData();
            if (props.dialogType === 1) {
              createProduct(params)
                .then((res) => {
                  emit("saveAndDraft", res.data);
                })
                .finally(() => {
                  data.draftLoading = false;
                });
            } else {
              updateProduct({ ...params, id: props.pids })
                .then((res) => {
                  emit("saveAndDraft", res.data);
                })
                .finally(() => {
                  data.draftLoading = false;
                });
            }
          } else {
            data.draftLoading = false;
          }
        })
        .catch(() => {
          data.draftLoading = false;
        });
    };

    const changeSiteId = (val) => {
      const targetRef = proxy.$refs.productInfoLz;
      targetRef && targetRef.getCategoryData(val, true);
    };

    const clearData = () => {
      // 清空spu
      relatedSkus.value = [];
      data.specsType = 1;
      // 延时处理
      setTimeout(() => {
        const formList = proxy.$refs;
        Object.keys(formList).forEach((key) => {
          const targetRef = formList[key];
          const fn = targetRef?.clearData;
          fn && fn();
        });
      }, 0);
    };

    const spuChange = (val) => {
      relatedSkus.value = val;
    };

    const specsChange = (val) => {
      data.specsType = val;
    };

    return {
      ...toRefs(data),
      relatedSkus,
      showAll,
      showVariant,
      listData,
      pageTitle,
      cancel,
      save,
      saveAndDraft,
      changeSiteId,
      clearData,
      spuChange,
      specsChange,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.arco-spin-loading),
:deep(.arco-spin) {
  width: 100%;
}
.detail-content {
  padding: 0px 24px 16px 8px;
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
    height: 500px;
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
