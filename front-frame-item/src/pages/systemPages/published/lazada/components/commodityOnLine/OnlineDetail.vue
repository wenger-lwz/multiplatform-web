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
              <BasicInfoLazada
                ref="basicInfoLz"
                :disabled="true"
                @site-change="changeSiteId"
              />
            </div>
            <div id="ProductInfoLazada" ref="ProductInfoLazada">
              <ProductInfoLazada
                ref="productInfoLz"
                pageType="online"
                @clear-data="clearData"
                @spu-change="spuChange"
              />
            </div>
            <template v-if="showAll">
              <div id="ProductPropertyLazada" ref="ProductPropertyLazada">
                <ProductPropertyLazada ref="productProtertyLz" />
              </div>
              <div id="SalesInformationLazada" ref="SalesInformationLazada">
                <SalesInformationLazada
                  ref="salesInformationLz"
                  pageType="online"
                  :related-skus="relatedSkus"
                />
              </div>
              <div id="ImageLazada" ref="ImageLazada">
                <ImageLazada ref="pictureVideo" pageType="online" />
              </div>
              <div id="RepairServiceLazada" ref="RepairServiceLazada">
                <RepairServiceLazada
                  ref="repairServiceLz"
                  :rulesObj="repairServicerules"
                />
              </div>
              <div id="PackageLazada" ref="PackageLazada">
                <PackageLazada ref="packagingInfoLz" />
              </div>
              <div id="LongDescLazada" ref="LongDescLazada">
                <LongDescLazada ref="longDescLz" :editable="false" />
              </div>
              <div id="ShortDescLazada" ref="ShortDescLazada">
                <ShortDescLazada ref="shortDescLz" :editable="false" />
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
      <gj-radio-group
        v-if="hasTemp"
        class="left-footer"
        type="button"
        v-model="radioStatus"
        @change="statusChange"
      >
        <gj-radio :value="1">在线</gj-radio>
        <gj-radio :value="2">暂存</gj-radio>
      </gj-radio-group>
      <span class="dialog-footer">
        <template v-if="hasTemp">
          <gj-popconfirm
            position="br"
            content="在线商品删除暂存"
            :popup-visible="deleteModelVisible"
            @ok="delTempStorage"
            @cancel="deleteModelVisible = false"
          >
            <gj-button
              type="plain"
              v-if="radioStatus === 2"
              @click="deleteModelVisible = true"
              >删除</gj-button
            >
          </gj-popconfirm>

          <gj-popconfirm
            position="br"
            content="存在暂存数据，是否覆盖"
            :popup-visible="saveModelVisible"
            @ok="handlerOnSave"
            @cancel="saveModelVisible = false"
          >
            <gj-button
              type="plain"
              :loading="saveLoading"
              @click="saveModelVisible = true"
              >保存</gj-button
            >
          </gj-popconfirm>

          <gj-button
            type="primary"
            v-if="radioStatus === 2"
            :loading="updateLoading"
            @click="handlerOnUpdate"
            >更新</gj-button
          >
        </template>
        <template v-else>
          <gj-button type="plain" :loading="saveLoading" @click="handlerOnSave"
            >保存</gj-button
          >
          <gj-button
            type="primary"
            :loading="updateLoading"
            @click="handlerOnUpdate"
            >更新</gj-button
          >
        </template>
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
  getListingDetail,
  lazadaUpdateToTemp,
  getListingDetailStorage,
  listingDirectPush,
  listingStorageDelete,
} from "@/api/published/lazada";
import { useRefSetData } from "@pagesSystem/published/lazada/hooks";

import rightNav from "@/components/rightNav";
import BasicInfoLazada from "@pagesSystem/published/lazada/components/publishedDraft/BasicInfo.vue";
import ProductInfoLazada from "@pagesSystem/published/lazada/components/publishedDraft/ProductInfo.vue";

const ProductPropertyLazada = defineAsyncComponent(() =>
  import(
    "@pagesSystem/published/lazada/components/common/ProductPropertyLz.vue"
  )
);
const SalesInformationLazada = defineAsyncComponent(() =>
  import(
    "@pagesSystem/published/lazada/components/publishedDraft/SalesInformation.vue"
  )
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
    SalesInformationLazada,
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
    detailHasTemp: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  emits: ["cancel", "update-table-list"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      loading: false,
      saveLoading: false,
      updateLoading: false,
      proxyThis: proxy,
      radioStatus: props.detailHasTemp ? 2 : 1,
      hasTemp: props.detailHasTemp,
      deleteModelVisible: false,
      saveModelVisible: false,
    });

    const relatedSkus = ref([]);
    const repairServicerules = [
      { id: "warrantyType", message: "保修类型必填" },
    ];

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
        name: "lazada.salesInformation",
        sectionId: "SalesInformationLazada",
        ref: "salesInformationLz",
      },
      {
        name: "lazada.pictureInformation",
        sectionId: "ImageLazada",
        ref: "pictureVideo",
      },
      {
        name: "lazada.repairService",
        sectionId: "RepairServiceLazada",
        rules: repairServicerules,
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
      },
      {
        name: "lazada.shortDescrition",
        sectionId: "ShortDescLazada",
        ref: "shortDescLz",
      },
    ];
    const store = useStore();
    const showAll = computed(
      () => store.getters.getParams?.productInfo?.lazadaType
    );
    const listData = computed(() => {
      return showAll.value ? [...defaultSect, ...otherSect] : defaultSect;
    });
    const pageTitle = "编辑在线商品";

    const onResponeCb = (res) => {
      if (res.code === 0) {
        const respData = res.data;
        if (respData.platformCategoryId) {
          // 说明有显示其他的模块
          store.commit(M_T.PARAMS_QUERY, {
            productInfo: {
              lazadaType: respData.platformCategoryId,
            },
          });
        }
        useRefSetData(proxy, respData);
        // 延时处理
        setTimeout(() => {
          useRefSetData(proxy, respData, ["basicInfoLz", "productInfoLz"]);
        }, 100);
      }
      setTimeout(() => {
        data.loading = false;
      }, 100);
    };

    const getListingDetailReq = async () => {
      data.loading = true;
      const res = await getListingDetail({ listingId: props.pids });
      onResponeCb(res);
    };

    const getListingDetailStorageReq = async () => {
      data.loading = true;
      const res = await getListingDetailStorage({ listingId: props.pids });
      onResponeCb(res);
    };

    onBeforeMount(async () => {
      if (props.pids) {
        if (data.radioStatus === 1) {
          getListingDetailReq();
        } else {
          getListingDetailStorageReq();
        }
      }
    });

    const changeSiteId = (val) => {
      const targetRef = proxy.$refs.productInfoLz;
      targetRef && targetRef.getCategoryData(val, true);
    };

    const clearData = () => {
      // 清空spu
      relatedSkus.value = [];
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

    const cancel = () => {
      emit("update-table-list");
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

      const getVariants = () => {
        const dataMap = storeData.variantInfoLz || {};
        let skuAttrItem = null;
        let result = dataMap.variantTableData || [];
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
              attrCustom: false,
              attrId: dataMap.salePropSelect[key],
              attrName: variantInfoItem.name,
              label: variantInfoItem.label,
              attributeValues: [],
              mainVariation:
                imageLz.mainVariantProperty === variantInfoItem.label,
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
          // 8张
          tempData = tempData.slice(0, 8);
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
        let videoList = {};
        const dataMap = storeData.videoInfo || {};
        if (dataMap.videoList[0]?.resource) {
          const item = dataMap.videoList[0];
          videoList = {
            contentType: item.contentType,
            hashCode: item.hashCode || item.hashcode,
            height: item.height,
            resource: item.resource,
            resourceId: item.resourceId,
            size: item.size,
            thumbnail: false,
            width: item.width,
            videoCoverUrl: item.videoCoverUrl, //
          };
        }
        return videoList;
      };

      const basicInfo = {
        siteCode: storeData.basicInfoLz.siteId,
        shopId: storeData.basicInfoLz.shopId,
        chargePersonId: storeData.basicInfoLz.chargePersonId,
        defaultTitle: storeData.productInfo.titleList,
        categoryId: storeData.basicInfoLz.categoryId,
        categoryName: storeData.basicInfoLz.categoryName,
      };
      const isSingleProduct = storeData.productInfo.specsType != 2;

      const property = {
        platformCategoryId: storeData.productInfo?.lazadaType,
        platformCategories: storeData.productInfo?.platformCategories || [],
        logisticsSizeLong: isSingleProduct
          ? String(storeData.saleInfoLz?.logisticsSizeLong ?? "")
          : "",
        logisticsSizeWide: isSingleProduct
          ? String(storeData.saleInfoLz?.logisticsSizeWide ?? "")
          : "",
        logisticsSizeHigh: isSingleProduct
          ? String(storeData.saleInfoLz?.logisticsSizeHigh ?? "")
          : "",
        logisticsWeight: isSingleProduct
          ? String(storeData.saleInfoLz?.logisticsWeight ?? "")
          : "",
        msku: storeData.productInfo.msku,
        productImages: getProductImages(storeData),
        videoUrl: getVideoUrl(storeData),
        quantity: isSingleProduct ? storeData.saleInfoLz?.stockNumber : "",
        recommendPrice: isSingleProduct
          ? storeData.saleInfoLz?.recommendPrice
          : "",
        recommendPriceUnit: storeData.basicInfoLz.recommendPriceUnit || "",
        specsType: storeData.productInfo.specsType,
        spu: isSingleProduct
          ? storeData.productInfo?.sku
          : storeData.productInfo?.spu,
        taxes: isSingleProduct ? storeData.saleInfoLz?.taxes : "",
        specialFromDate: isSingleProduct
          ? storeData.saleInfoLz?.rangeValue?.[0] || ""
          : "",
        specialPrice: isSingleProduct
          ? storeData.saleInfoLz?.promotionPrice ?? ""
          : "",
        specialToDate: isSingleProduct
          ? storeData.saleInfoLz?.rangeValue?.[1] || ""
          : "",
      };
      const variants = !isSingleProduct ? getVariants() : [];
      const variantAttrInfo = !isSingleProduct ? getvariantAttrInfo() : [];

      const warranty = {
        warranty: storeData.repairServiceLz?.warrantyTime,
        warrantyType: storeData.repairServiceLz?.warrantyType,
        productWarranty: storeData.repairServiceLz?.warrantyPolicy,
      };

      const packageInfo = {
        hazmat: storeData.packageLz?.hazmat.join(","),
        packageContent: storeData.packageLz?.packageContent,
      };

      return {
        autoQuantity: false,
        global: false,
        categoryAttributes: getCategoryAttributes(),
        ...basicInfo,
        ...property,
        variants,
        variantAttrInfo,
        ...warranty,
        ...packageInfo,
        descriptions: storeData.longDescLz?.text[0] ?? "",
        shortDescription: storeData.shortDescLz?.text[0] ?? "",
      };
    };

    const handlerOnSave = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr("saveForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          data.saveLoading = true;
          const params = getPramData();
          if (props.dialogType === 2) {
            params.id = props.pids;
          }
          lazadaUpdateToTemp(params)
            .then(() => {
              GjMessage.success("在线商品编辑保存成功");
            })
            // .catch(()=> {
            //   GjMessage.error('在线商品编辑保存失败')
            // })
            .finally(() => {
              data.saveLoading = false;
              data.saveModelVisible = false;
            });
        } else {
          data.saveModelVisible = false;
        }
      });
    };

    const handlerOnUpdate = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr("submitForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          data.updateLoading = true;
          const params = getPramData();
          if (props.dialogType === 2) {
            params.id = props.pids;
          }
          listingDirectPush(params)
            .then(() => {
              GjMessage.success("在线商品编辑更新成功");
              data.hasTemp = false;
              data.radioStatus = 1;
              setTimeout(() => {
                getListingDetailReq();
              }, 0);
            })
            .catch(() => {
              // GjMessage.error('在线商品编辑更新失败')
              data.hasTemp = true;
              data.radioStatus = 2;
              // 这里去重新请求数据
              setTimeout(() => {
                getListingDetailStorageReq();
              }, 0);
            })
            .finally(() => {
              data.updateLoading = false;
            });
        }
      });
    };
    const statusChange = (val) => {
      if (val === 1) {
        getListingDetailReq();
      } else {
        getListingDetailStorageReq();
      }
    };

    const delTempStorage = () => {
      listingStorageDelete({ listingId: props.pids })
        .then(() => {
          GjMessage.success("在线商品删除暂存成功");
          data.hasTemp = false;
          data.radioStatus = 1;
          getListingDetailReq();
        })
        // .catch(()=> {
        //   GjMessage.success("在线商品删除暂存失败");
        // })
        .finally(() => {
          data.deleteModelVisible = false;
        });
    };

    return {
      ...toRefs(data),
      relatedSkus,
      repairServicerules,
      showAll,
      listData,
      pageTitle,
      changeSiteId,
      clearData,
      spuChange,
      cancel,
      handlerOnSave,
      handlerOnUpdate,
      statusChange,
      delTempStorage,
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
.left-footer {
  float: left;
}
.dialog-footer {
  button {
    margin-left: 12px;
  }
}
</style>
