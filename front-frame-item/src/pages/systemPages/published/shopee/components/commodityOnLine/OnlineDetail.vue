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
                ref="basicInfo"
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
            <div id="ProductPropertyLazada" ref="ProductPropertyLazada">
              <ProductPropertyLazada
                ref="productProperty"
                pageType="online"
                @clear-data="clearData"
                @spu-change="spuChange"
              />
            </div>
            <template v-if="showAll">
              <!-- <div id="ProductPropertyLazada" ref="ProductPropertyLazada">
                <ProductPropertyLazada ref="productProterty" />
              </div>
 -->
              <div id="ImageLazada" ref="ImageLazada">
                <ImageLazada ref="pictureVideo" pageType="online" />
              </div>
              <div id="ProductDescription" ref="ProductDescription">
                <ProductDescription
                  ref="productDescription"
                  pageType="online"
                />
              </div>
              <!-- <div id="RepairServiceLazada" ref="RepairServiceLazada">
                <RepairServiceLazada
                  ref="repairServiceLz"
                  :rulesObj="repairServicerules"
                />
              </div> -->
              <div id="LogisticsInfo" ref="LogisticsInfo">
                <LogisticsInfo ref="logisticsInfo" />
              </div>
              <!-- <div id="LongDescLazada" ref="LongDescLazada">
                <LongDescLazada ref="longDescLz" :editable="false" />
              </div>
              <div id="ShortDescLazada" ref="ShortDescLazada">
                <ShortDescLazada ref="shortDescLz" :editable="false" />
              </div> -->
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
        <template v-if="tabType">
          <gj-button type="plain" @click="cancel">取消</gj-button>

          <gj-button
            type="primary"
            :loading="updateLoading"
            @click="handlerOnReline"
            >重新上架</gj-button
          >
        </template>
        <template v-else-if="hasTemp">
          <gj-button type="plain" @click="cancel">取消</gj-button>

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
              >删除暂存</gj-button
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
          {{ data?.tabType }}
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
  lazadaUpdateToStorage,
  onReline,
} from "@/api/published/shopee";
import { siteList } from "@pagesSystem/published/shopee/config";

import rightNav from "@/components/rightNav";
import BasicInfoLazada from "@pagesSystem/published/shopee/components/publishedDraft/BasicInfo.vue";
import ProductInfoLazada from "@pagesSystem/published/shopee/components/publishedDraft/ProductInfo.vue";
const ProductDescription = defineAsyncComponent(() =>
  import(
    "@pagesSystem/published/shopee/components/publishedDraft/ProductDescription.vue"
  )
);
const LogisticsInfo = defineAsyncComponent(() =>
  import(
    "@pagesSystem/published/shopee/components/publishedDraft/LogisticsInfo.vue"
  )
);
const ProductPropertyLazada = defineAsyncComponent(() =>
  import(
    "@pagesSystem/published/shopee/components/publishedDraft/ProductProperty.vue"
  )
);
/* const SalesInformationLazada = defineAsyncComponent(() =>
  import(
    '@pagesSystem/published/lazada/components/publishedDraft/SalesInformation.vue'
  )
); */
const ImageLazada = defineAsyncComponent(() =>
  import("@pagesSystem/published/shopee/components/publishedDraft/Image.vue")
);
/* const RepairServiceLazada = defineAsyncComponent(() =>
  import('../RepairServiceLz.vue')
); */
/* const PackageLazada = defineAsyncComponent(() => import('../PackageLz.vue'));
const LongDescLazada = defineAsyncComponent(() => import('../LongDesc.vue'));
const ShortDescLazada = defineAsyncComponent(() => import('../ShortDesc.vue')); */

import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";

export default defineComponent({
  name: "PubShopeeOnlineDetail",
  components: {
    BasicInfoLazada,
    ProductInfoLazada,
    ProductPropertyLazada,
    // SalesInformationLazada,
    ImageLazada,
    /* RepairServiceLazada,
    PackageLazada,
    LongDescLazada,
    ShortDescLazada, */
    ProductDescription,
    LogisticsInfo,
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
    isTabType: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  emits: ["cancel", "update-table-list", "update-handler"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      loading: false,
      saveLoading: false,
      updateLoading: false,
      proxyThis: proxy,
      timeRow: [],
      radioStatus: props.detailHasTemp ? 2 : 1,
      hasTemp: props.detailHasTemp,
      deleteModelVisible: false,
      saveModelVisible: false,
      tabType: props.isTabType,
    });

    const relatedSkus = ref([]);
    const repairServicerules = [
      { id: "warrantyType", message: "保修类型必填" },
    ];

    const defaultSect = [
      {
        name: "lazada.basicInfo",
        sectionId: "BasicInfoLazada",
        ref: "basicInfo",
      },
      {
        name: "lazada.productInformation",
        sectionId: "ProductInfoLazada",
        ref: "productInfoLz",
      },
      {
        name: "lazada.productAttributes",
        sectionId: "ProductPropertyLazada",
        ref: "productProterty",
      },
    ];
    const otherSect = [
      /* {
        name: "lazada.salesInformation",
        sectionId: "SalesInformationLazada",
        ref: "salesInformationLz",
      }, */
      {
        name: "lazada.pictureInformation",
        sectionId: "ImageLazada",
        ref: "pictureVideo",
      },
      {
        name: "shopee.onlineProductDescription",
        sectionId: "ProductDescription",
        ref: "productDescription",
      },
      {
        name: "shopee.logisticsInfo",
        sectionId: "LogisticsInfo",
        ref: "logisticsInfo",
      },
      /* {
        name: 'lazada.repairService',
        sectionId: 'RepairServiceLazada',
        rules: repairServicerules,
        ref: 'repairServiceLz',
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
      }, */
    ];
    const store = useStore();
    const showAll = computed(
      () => store.getters.getParams?.productInfo?.shopeeType
    );
    console.log(store.getters.getParams?.productInfo, "+++");
    const listData = computed(() => {
      return showAll.value ? [...defaultSect, ...otherSect] : defaultSect;
    });
    const pageTitle = "编辑在线商品";

    const refSetData = (respData) => {
      const formList = proxy.$refs;
      Object.keys(formList).forEach((key) => {
        const targetRef = formList[key];
        console.log(targetRef, "targetRef333");
        const fn = targetRef?.setPageData;
        fn && fn(respData);
      });
    };

    const onResponeCb = (res) => {
      if (res.code === 200) {
        const respData = res.data;
        if (respData.platformCategoryId) {
          // 说明有显示其他的模块
          store.commit(M_T.PARAMS_QUERY, {
            productInfo: {
              shopeeType: respData.platformCategoryId,
            },
          });
        }
        refSetData(respData);
        // 延时处理
        setTimeout(() => {
          refSetData(respData);
        }, 0);
      }
      setTimeout(() => {
        data.loading = false;
      }, 100);
    };

    const getListingDetailReq = async () => {
      data.loading = true;
      const res = await getListingDetail({ id: props.pids });
      onResponeCb(res);
    };

    const getListingDetailStorageReq = async () => {
      data.loading = true;
      const res = await getListingDetailStorage({ id: props.pids });
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
          dataMap.images.forEach((item) => {
            productImageList.push({
              businessType: 0,
              contentType: item.contentType,
              hashCode: item.hashcode,
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
          dataMap.productImages.forEach((item) => {
            productImageList.push({
              businessType: 1,
              contentType: item.contentType,
              hashCode: item.hashcode,
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
        if (storeData.videoInfo) {
          const dataMap = storeData.videoInfo || {};
          console.log(storeData, "dataMap");
          if (dataMap.videoList[0]?.resource) {
            const item = dataMap.videoList[0];
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
        shopName: storeData.basicInfo?.shopName,
        shopId: storeData.basicInfo?.shopId,
        chargePersonId: storeData.basicInfo?.chargePersonId,
        chargePersonName: storeData.basicInfo?.chargePersonId,
        categoryId: storeData.basicInfo?.categoryId,
        categoryName: storeData.basicInfo?.categoryName,
      };
      const isSingleProduct = storeData.productInfo?.specsType != 2;

      // 产品信息
      const property = {
        platformCategoryId: storeData.productInfo?.shopeeType,
        platformCategories: storeData.productInfo?.platformCategories || [],
        specsType: storeData.productInfo?.specsType,
        spu: isSingleProduct
          ? storeData.productInfo?.sku
          : storeData.productInfo?.spu,
        defaultTitle: storeData.productInfo?.titleList,
        msku: storeData.productInfo?.msku,
        condition: storeData.productInfo?.condition,
        preOrder: {
          days_to_ship: storeData.productInfo?.preOrderDay || 0,
          is_pre_order: false,
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
        variantAttrInfo,
        description: storeData.productDescription?.desc || "",
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

          if (data.radioStatus === 2) {
            lazadaUpdateToStorage(params)
              .then(() => {
                GjMessage.success("暂存商品编辑保存成功");
                emit("update-handler");
              })
              // .catch(()=> {
              //   GjMessage.error('在线商品编辑保存失败')
              // })
              .finally(() => {
                data.saveLoading = false;
                data.saveModelVisible = false;
              });
          } else {
            lazadaUpdateToTemp(params)
              .then(() => {
                GjMessage.success("在线商品编辑保存成功");
                emit("update-handler");
              })
              // .catch(()=> {
              //   GjMessage.error('在线商品编辑保存失败')
              // })
              .finally(() => {
                data.saveLoading = false;
                data.saveModelVisible = false;
              });
          }
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
              getListingDetailReq();
            })
            .catch(() => {
              // GjMessage.error('在线商品编辑更新失败')
              data.hasTemp = true;
              data.radioStatus = 2;
              // 这里去重新请求数据
              getListingDetailStorageReq();
            })
            .finally(() => {
              data.updateLoading = false;
            });
        }
      });
    };

    // 详情重新上架
    const handlerOnReline = () => {
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
          onReline(params)
            .then(() => {
              GjMessage.success(
                "上架任务已提交，上架成功后可在“在线列表”查看。"
              );
              data.hasTemp = false;
              data.radioStatus = 1;
              getListingDetailReq();
            })
            .catch(() => {
              // GjMessage.error('在线商品编辑更新失败')
              data.hasTemp = true;
              data.radioStatus = 2;
              // 这里去重新请求数据
              getListingDetailStorageReq();
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
      listingStorageDelete({ id: props.pids })
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
      siteList,
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
      handlerOnReline,
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
