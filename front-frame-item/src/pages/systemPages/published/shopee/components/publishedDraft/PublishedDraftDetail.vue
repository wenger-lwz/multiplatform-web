<template>
  <fullScreenDialog :dialogVisible="dialogVisible">
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
            :id="`${item.sectionId}`"
          >
            <component
              :ref="
                (el) => {
                  setRefFunction(item, el);
                }
              "
              :editable="item.editable"
              :rulesObj="item.rules"
              :is="item.sectionId"
              :related-skus="relatedSkus"
              @site-change="changeSiteId"
              @clear-data="clearData"
              @spu-change="spuChange"
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
        <gj-button
          v-if="hideBtn !== true"
          type="outline"
          :loading="releaseLoading"
          @click="release"
          >发布</gj-button
        >
        <gj-button
          v-if="hideBtn !== true"
          type="outline"
          :loading="releaseTimeLoading"
          @click="releaseOnTime"
          >定时发布</gj-button
        >
        <gj-button type="primary" :loading="saveLoading" @click="save"
          >保存</gj-button
        >
      </span>
    </template>
  </fullScreenDialog>
  <TimingModal
    v-if="timingModalVisible"
    :list="siteList"
    :timeRow="timeRow"
    :visible="timingModalVisible"
    @handleOk="timingModalOk"
    @handleCancel="timingModalCancel"
  ></TimingModal>
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
  createNewDraft,
  editDraft,
  getDraftDetail,
  releaseDraft,
} from "@/api/published/shopee";

import rightNav from "@/components/rightNav";
import BasicInfo from "./BasicInfo.vue";
import ProductInfo from "./ProductInfo.vue";
const ProductProperty = defineAsyncComponent(() =>
  import("./ProductProperty.vue")
);
import ProductDescription from "@pagesSystem/published/shopee/components/publishedDraft/ProductDescription.vue";
import LogisticsInfo from "./LogisticsInfo.vue";
const Image = defineAsyncComponent(() => import("./Image.vue"));
/* const RepairServiceLazada = defineAsyncComponent(() =>
  import('../RepairServiceLz.vue')
);
const PackageLazada = defineAsyncComponent(() => import('../PackageLz.vue'));
const LongDescLazada = defineAsyncComponent(() => import("../LongDesc.vue"));
const ShortDescLazada = defineAsyncComponent(() => import("../ShortDesc.vue")); */

import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
import TimingModal from "@pagesSystem/published/shopee/components/TimeModal.vue";

export default defineComponent({
  name: "PublishedDraftDetail",
  components: {
    BasicInfo,
    ProductInfo,
    ProductProperty,
    Image,
    /* RepairServiceLazada,
    PackageLazada,
    LongDescLazada,
    ShortDescLazada, */
    fullScreenDialog,
    rightNav,
    ProductDescription,
    LogisticsInfo,
    TimingModal,
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
    hideBtn: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  emits: ["cancel", "update-handler"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      saveLoading: false,
      releaseLoading: false,
      releaseTimeLoading: false,
      timingModalVisible: false,
      proxyThis: proxy,
      dialogType: props.dialogType,
      timeRow: [],
      hideBtn: props.hideBtn,
    });

    const relatedSkus = ref([]);
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
        name: "产品属性",
        sectionId: "ProductProperty",
        ref: "productProperty",
      },
    ];
    const otherSect = [
      { name: "图片信息", sectionId: "Image", ref: "pictureVideo" },
      {
        name: "产品描述",
        sectionId: "productDescription",
        ref: "productDescription",
      },
      {
        name: "物流信息",
        sectionId: "LogisticsInfo",
        ref: "logisticsInfo",
      },
    ];
    const store = useStore();
    const showAll = computed(
      () => store.getters.getParams?.productInfo?.shopeeType
    );
    const listData = computed(() => {
      return showAll.value ? [...defaultSect, ...otherSect] : defaultSect;
    });
    const pageTitle = computed(() => {
      if (props.dialogType == 1) {
        return "创建草稿";
      } else if (props.dialogType == 2) {
        return "编辑草稿";
      } else {
        return "复制草稿";
      }
      // return props.dialogType == 1 ? '创建草稿' : '编辑草稿';
    });

    onBeforeMount(() => {
      if (props.pids) {
        getDraftDetail(props.pids).then((res) => {
          const respData = res.data;
          if (respData.platformCategoryId) {
            // 说明有显示其他的模块
            store.commit(M_T.PARAMS_QUERY, {
              productInfo: {
                shopeeType: respData.platformCategoryId,
              },
            });
          }
          // 延时处理
          setTimeout(() => {
            componentRef.value.forEach((targetRef) => {
              const fn = targetRef.el?.setPageData;
              fn && fn(respData);
            });
          }, 100);
        });
      }
    });

    const changeSiteId = (val) => {
      const targetRef = componentRef.value.find(
        (it) => it.sectionId === "ProductInfo"
      );
      targetRef && targetRef.el.getCategoryData(val, true);
    };

    const clearData = () => {
      // 清空spu
      relatedSkus.value = [];
      // 延时处理
      setTimeout(() => {
        componentRef.value.forEach((targetRef) => {
          const fn = targetRef.el?.clearData;
          fn && fn();
        });
      }, 0);
    };

    const spuChange = (val) => {
      relatedSkus.value = val;
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

    const getPramData = () => {
      const storeData = store.getters.getParams;
      const getCategoryAttributes = () => {
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
              const item = {
                attrName: key,
                attributeType: attrItem.attributeType,
                attrValue,
                type: attrItem.type, // 0必填 1非必填
              };
              result.push(item);
            }
          }
        });
        return result;
      };

      const getVariants = () => {
        const dataMap = storeData.variantInfoLz || {};
        let skuAttrItem = null;
        let result = dataMap.tableData2 || [];
        result.forEach((item) => {
          item.skuAttr = [];
          Object.values(dataMap.salePropSelect)?.forEach((valueId) => {
            let attrName = dataMap.salePropItem.find(
              (selectItem) => selectItem.attributeId === valueId
            )?.name;
            skuAttrItem = {
              attrId: valueId,
              attrName: attrName,
              attrValue: item[attrName],
            };
            item.skuAttr.push(skuAttrItem);
            delete item.rowskey;
          });
        });
        return result;
      };

      const getvariantAttrInfo = () => {
        const result = [];
        const dataMap = storeData.variantInfoLz || {};
        const imageLz = storeData.imageLz || {};
        const getVariantImages = (key, imageLz) => {
          const result = [];
          if (imageLz.variantImages) {
            imageLz.variantImages[key]?.forEach((it) => {
              result.push({
                contentType: it.contentType,
                hashCode: it.hashcode,
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
                hashCode: it.hashcode,
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
              attrCustom: false,
              attrId: dataMap.salePropSelect[key],
              attrName: variantInfoItem.name,
              attributeValues: [],
              mainVariation:
                imageLz.mainVariantProperty === variantInfoItem.name,
            };
            if (dataMap.tagValueList[key]) {
              dataMap.tagValueList[key].forEach((value) => {
                const valueList = {
                  attrValueCustom: false,
                  attrValueId: null,
                  attrValueName: value,
                  variantImages: getVariantImages(value, imageLz),
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
          // 1张
          tempData = tempData.slice(0, 1);
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
          if (tempData) {
            // 8张
            tempData = tempData.slice(0, 8);
            tempData?.forEach((item) => {
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
        }
        return productImageList;
      };

      const getVideoUrl = (storeData) => {
        let videoList = {};
        if (storeData.videoInfo) {
          const dataMap = storeData.videoInfo || {};
          if (dataMap.videoList[0]?.resource) {
            const item = dataMap.videoList[0];
            console.log(item, "item");
            videoList = {
              contentType: item.contentType,
              hashCode: item.hashcode,
              height: item.height,
              resource: item.resource,
              videoId: item.resourceId,
              size: item.size,
              width: item.width,
              videoCoverUrl: item.thumbnailUrl,
            };
          }
        }
        return videoList;
      };

      const basicInfo = {
        site: storeData.basicInfo?.siteId,
        shopId: storeData.basicInfo?.shopId,
        chargePersonId: storeData.basicInfo?.chargePersonId,
        chargePersonName: storeData.basicInfo?.chargePersonName,
        categoryId: storeData.basicInfo?.categoryId,
        categoryName: storeData.basicInfo?.categoryName,
      };
      const isSingleProduct = storeData.productInfo?.specsType != 2;
      console.log(storeData, "storeData draft");
      // 产品信息
      const property = {
        platformCategoryId: storeData.productInfo?.shopeeType,
        platformCategoryName:
          storeData.productInfo?.platformCategories?.length > 0
            ? storeData.productInfo?.platformCategories?.at(-1).name
            : "",
        platformCategories: storeData.productInfo?.platformCategories || [],
        specsType: storeData.productInfo?.specsType,
        spu: isSingleProduct
          ? storeData.productInfo?.sku
          : storeData.productInfo?.spu,
        defaultTitle: storeData.productInfo?.titleList,
        msku: storeData.productInfo?.msku,
        mainImage: storeData.imageLz?.productImages[0]?.thumbnailUrl || "",
        condition: storeData.productInfo?.condition,
        preOrder: {
          daysToShip: storeData.productInfo?.preOrderDay || 0,
          preOrder: true,
        },
        wholeSaleList: storeData.tradePrice?.fromList || [],
        piecesQuantity: storeData.tradePrice?.quantity || "",
        recommendPrice: storeData.tradePrice?.price || "",
        proImages: getProductImages(storeData),
        video: getVideoUrl(storeData),
        /* quantity: isSingleProduct ? storeData.saleInfoLz.stockNumber : '',
        recommendPrice: isSingleProduct
          ? storeData.saleInfoLz.recommendPrice
          : '', */
        recommendPriceUnit: storeData.basicInfo?.recommendPriceUnit || "",
      };

      const dimension = {
        height: storeData.logisticsInfo?.high,
        length: storeData.logisticsInfo?.long,
        width: storeData.logisticsInfo?.wide,
      };

      let logisticList = [];
      if (
        storeData.logisticsInfo?.logisticsData &&
        storeData.logisticsInfo?.logisticsData.length > 0
      ) {
        logisticList = storeData.logisticsInfo?.logisticsData.map((item) => {
          return {
            free: item.isFreeShipping,
            logisticId: item.id,
            logisticName: item.logisticsListVal,
            shippingFee: 0,
          };
        });
      }

      const variants = !isSingleProduct ? getVariants() : [];
      const variantAttrInfo = !isSingleProduct ? getvariantAttrInfo() : [];

      return {
        /* autoQuantity: false,
        global: false, */
        categoryAttributes: getCategoryAttributes(),
        ...basicInfo,
        ...property,
        weight: storeData.logisticsInfo?.weight,
        dimension,
        logisticList,
        variants,
        variantAttrs: variantAttrInfo,
        description: storeData.productDescription?.desc || "",
      };
    };

    const save = () => {
      data.saveLoading = true;
      let isSubmit = true;
      const promiseArr = getPromiseArr("saveForm");
      Promise.all(promiseArr)
        .then((res) => {
          isSubmit = res.every((item) => item);
          if (isSubmit) {
            const params = getPramData();
            if (props.dialogType == 1 || props.dialogType == 3) {
              // 添加/创建草稿-保存
              createNewDraft(params)
                .then(() => {
                  GjMessage.success("创建草稿保存成功！");
                  emit("update-handler");
                })
                .finally(() => {
                  data.saveLoading = false;
                });
            } else {
              // 编辑草稿-保存
              editDraft({ ...params, id: props.pids })
                .then(() => {
                  GjMessage.success("编辑草稿保存成功！");
                  emit("update-handler");
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

    // 发布
    const release = async () => {
      let isSubmit = true;
      data.releaseLoading = true;
      const result = await Promise.all(getPromiseArr("submitForm"));
      isSubmit = result?.every((item) => item);
      if (isSubmit) {
        const params = getPramData();
        const releaseCb = (res) => {
          if (res.code !== 200) {
            data.releaseLoading = false;
            return GjMessage.error("发布失败！");
          }
          releaseDraft({
            draftIds: [res.data],
            // draftIds: ['f648ae3b-fefa-4db1-b2e0-df063b994c05'],
            onlineType: 1,
            /* draftIds: ids,, */
          })
            .then(() => {
              emit("update-handler");
              data.releaseLoading = false;
            })
            .catch(() => {
              data.releaseLoading = false;
            });
        };
        if (props.dialogType === 1) {
          editDraft(params)
            .then((res) => {
              releaseCb(res);
            })
            .catch(() => {
              data.releaseLoading = false;
            });
        } else {
          editDraft({ ...params, id: props.pids })
            .then((res) => {
              releaseCb(res);
            })
            .catch(() => {
              data.releaseLoading = false;
            });
        }
      } else {
        data.releaseLoading = false;
      }
    };

    // 定时发布
    const releaseOnTime = async () => {
      let isSubmit = true;
      data.releaseTimeLoading = true;
      const result = await Promise.all(getPromiseArr("submitForm"));
      isSubmit = result?.every((item) => item);
      if (isSubmit) {
        const params = getPramData();
        const releaseOnTimeCb = (res) => {
          if (res.code !== 200) {
            data.releaseLoading = false;
            return GjMessage.success("定时发布失败！");
          }
          data.timeRow = [{ id: res.data, siteCode: params.siteCode }];
          data.timingModalVisible = true;
        };
        if (props.dialogType === 1) {
          editDraft(params)
            .then((res) => {
              releaseOnTimeCb(res);
            })
            .finally(() => {
              data.releaseTimeLoading = false;
            });
        } else {
          editDraft({ ...params, id: props.pids })
            .then((res) => {
              releaseOnTimeCb(res);
            })
            .finally(() => {
              data.releaseTimeLoading = false;
            });
        }
      } else {
        data.releaseTimeLoading = false;
      }
    };

    const timingModalOk = () => {
      data.timingModalVisible = false;
      emit("update-handler");
    };
    const timingModalCancel = () => {
      data.timingModalVisible = false;
    };

    return {
      ...toRefs(data),
      relatedSkus,
      componentRef,
      setRefFunction,
      showAll,
      listData,
      pageTitle,
      changeSiteId,
      clearData,
      spuChange,
      cancel,
      save,
      release,
      releaseOnTime,
      timingModalOk,
      timingModalCancel,
    };
  },
});
</script>
<style lang="scss" scoped>
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
