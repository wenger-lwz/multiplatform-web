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
                pageType="draft"
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
                  :related-skus="relatedSkus"
                  :selectData="selectData"
                />
              </div>
              <div id="ImageLazada" ref="ImageLazada">
                <ImageLazada ref="pictureVideo" pageType="draft" />
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
            <div class="release-section" v-if="global">
              <h3>发布至：</h3>
              <gj-space>
                <gj-checkbox
                  :model-value="checkedAll"
                  :indeterminate="indeterminate"
                  @change="handleChangeAll"
                  >全部
                </gj-checkbox>
                <gj-checkbox-group v-model="selectData" @change="handleChange">
                  <gj-checkbox
                    v-for="item in siteList"
                    :value="item.platformCode"
                    :key="item.platformCode"
                    >{{ item.platformName }}</gj-checkbox
                  >
                </gj-checkbox-group>
              </gj-space>
              <p class="release-error-tips" v-if="selectData.length <= 0">
                请至少选择一个站点发布
              </p>
              <div>
                <gj-space direction="vertical">
                  <p>库存是否自动分配：</p>
                  <gj-switch v-model="autoQuantity" />
                </gj-space>
              </div>
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
      </gj-spin>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <gj-button type="plain" @click="cancel">取消</gj-button>
        <gj-button type="outline" :loading="releaseLoading" @click="release"
          >发布</gj-button
        >
        <gj-button
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
  releaseDraft,
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
const SalesInformationLazada = defineAsyncComponent(() =>
  import("./SalesInformation.vue")
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
import TimingModal from "@pagesSystem/published/lazada/components/common/TimeModal.vue";

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
    requestApi: {
      type: Function,
      default: () => {
        return null;
      },
    },
    parmas: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["cancel", "update-table-list", "update-table-list-load"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      loading: false,
      saveLoading: false,
      releaseLoading: false,
      releaseTimeLoading: false,
      timingModalVisible: false,
      proxyThis: proxy,
      timeRow: [],
      autoQuantity: true,
    });

    const store = useStore();
    const indeterminate = ref(false);
    const checkedAll = ref(true);
    const selectAll = siteList.map((item) => item.platformCode);
    const selectData = ref(selectAll);

    const handleChangeAll = (value) => {
      indeterminate.value = false;
      if (value) {
        checkedAll.value = true;
        selectData.value = selectAll;
      } else {
        checkedAll.value = false;
        selectData.value = [];
      }
    };

    const handleChange = (values) => {
      if (values.length === siteList.length) {
        checkedAll.value = true;
        indeterminate.value = false;
      } else if (values.length === 0) {
        checkedAll.value = false;
        indeterminate.value = false;
      } else {
        checkedAll.value = false;
        indeterminate.value = true;
      }
    };

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

    const showAll = computed(
      () => store.getters.getParams?.productInfo?.lazadaType
    );
    const listData = computed(() => {
      return showAll.value ? [...defaultSect, ...otherSect] : defaultSect;
    });
    const pageTitle = computed(() => {
      return props.dialogType === 1 ? "添加草稿" : "编辑草稿";
    });
    const global = computed(
      () => store.getters.getParams?.basicInfoLz?.siteId === "cb"
    );

    const setSiteList = (respData) => {
      if (respData.global) {
        data.autoQuantity = respData.autoQuantity;
        const result = respData.siteList ?? [];
        selectData.value =
          result.filter((item) => item.release)?.map((item) => item.siteCode) ||
          [];
        if (selectData.value.length === siteList.length) {
          checkedAll.value = true;
          indeterminate.value = false;
        } else if (selectData.value.length > 0) {
          checkedAll.value = false;
          indeterminate.value = true;
        } else {
          checkedAll.value = false;
          indeterminate.value = false;
        }
      }
    };

    onBeforeMount(() => {
      if (props.pids) {
        data.loading = true;
        props
          .requestApi(props.parmas)
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
            useRefSetData(proxy, respData);
            // 回显发布站点信息
            setSiteList(respData);
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
            item.globalRelations = getGlobalRelations(item);
            item.recommendPrice = item.globalPrice?.["cb"];
            item.recomendPrice = item.globalpromotionPrice?.["cb"];
            item.remainNumber = item.globalStockNumber?.["total"];
          }
          delete item.globalPrice;
          delete item.globalpromotionPrice;
          delete item.globalStockNumber;
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
        const dataMap = storeData.videoInfo || {};
        if (dataMap.videoList?.[0]?.resource) {
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

      const getSiteList = () => {
        let result = [];
        if (global.value) {
          let temp = null;
          siteList.forEach((item) => {
            temp = {
              siteCode: item.platformCode,
              release: !!selectData.value.find(
                (it) => it === item.platformCode
              ),
            };
            result.push(temp);
          });
        }
        return result;
      };

      const getGlobalRelations = (inputData) => {
        const result = [];
        siteList.forEach((item) => {
          result.push({
            price: inputData?.globalPrice?.[item.platformCode],
            salePrice: inputData?.globalpromotionPrice?.[item.platformCode],
            quantity: inputData?.globalStockNumber?.[item.platformCode],
            siteCode: item.platformCode,
          });
        });
        return result;
      };

      const basicInfo = {
        siteCode: storeData.basicInfoLz.siteId,
        siteName: storeData.basicInfoLz.siteName,
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
        quantity: isSingleProduct
          ? !global.value
            ? storeData.saleInfoLz?.stockNumber
            : storeData.saleInfoLz?.globalStockNumber?.["total"]
          : "",
        recommendPrice: isSingleProduct
          ? !global.value
            ? storeData.saleInfoLz?.recommendPrice
            : storeData.saleInfoLz?.globalPrice?.["cb"]
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
          ? !global.value
            ? storeData.saleInfoLz?.promotionPrice ?? ""
            : storeData.saleInfoLz?.globalpromotionPrice?.["cb"]
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
        autoQuantity: data.autoQuantity,
        global: global.value,
        globalRelations:
          isSingleProduct && global.value
            ? getGlobalRelations(storeData.saleInfoLz)
            : undefined,
        siteList: getSiteList(),
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

    const save = () => {
      let isSubmit = true;
      // 跨境
      if (global.value) {
        if (selectData.value.length <= 0) {
          return GjMessage.warning("请至少选择一个站点发布");
        }
      }
      const promiseArr = getPromiseArr("saveForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          data.saveLoading = true;
          const params = getPramData();
          if (props.dialogType === 1) {
            createNewDraft(params)
              .then(() => {
                GjMessage.success("草稿保存成功！");
                emit("update-table-list");
              })
              // .catch(()=> {
              //   GjMessage.error("草稿保存失败！");
              // })
              .finally(() => {
                data.saveLoading = false;
              });
          } else {
            editDraft({ ...params, id: props.pids })
              .then(() => {
                GjMessage.success("草稿保存成功！");
                emit("update-table-list");
              })
              // .catch(()=> {
              //   GjMessage.error("草稿保存失败！");
              // })
              .finally(() => {
                data.saveLoading = false;
              });
          }
        }
      });
    };

    const release = async () => {
      let isSubmit = true;
      // 跨境
      if (global.value) {
        if (selectData.value.length <= 0) {
          return GjMessage.warning("请至少选择一个站点发布");
        }
      }
      const result = await Promise.all(getPromiseArr("submitForm"));
      isSubmit = result?.every((item) => item);
      if (isSubmit) {
        data.releaseLoading = true;
        const params = getPramData();
        const releaseCb = (res) => {
          releaseDraft({
            listingId: res.data,
          })
            .then(() => {
              GjMessage.success("发布任务已提交，请稍后查看！");
              emit("update-table-list-load", res.data);
            })
            // .catch(()=> {
            //   GjMessage.error("发布任务提交失败，请重试！");
            // })
            .finally(() => {
              data.releaseLoading = false;
            });
        };
        if (props.dialogType === 1) {
          createNewDraft(params)
            .then((res) => {
              releaseCb(res);
            })
            .catch(() => {
              // GjMessage.error("发布任务提交失败，请重试！");
              data.releaseLoading = false;
            });
        } else {
          editDraft({ ...params, id: props.pids })
            .then((res) => {
              releaseCb(res);
            })
            .catch(() => {
              // GjMessage.error("发布任务提交失败，请重试！");
              data.releaseLoading = false;
            });
        }
      }
    };

    // 定时发布
    const releaseOnTime = async () => {
      let isSubmit = true;
      const result = await Promise.all(getPromiseArr("submitForm"));
      isSubmit = result?.every((item) => item);
      if (isSubmit) {
        data.releaseTimeLoading = true;
        const params = getPramData();
        const releaseOnTimeCb = (res) => {
          data.releaseLoading = false;
          data.timeRow = [
            {
              id: res.data,
              siteCode: params.siteCode,
              siteName: params.siteName,
            },
          ];
          data.timingModalVisible = true;
        };
        if (props.dialogType === 1) {
          createNewDraft(params)
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
      }
    };

    const timingModalOk = () => {
      data.timingModalVisible = false;
      emit("update-table-list");
    };
    const timingModalCancel = () => {
      data.timingModalVisible = false;
    };

    return {
      ...toRefs(data),
      siteList,
      indeterminate,
      checkedAll,
      selectData,
      handleChangeAll,
      handleChange,
      relatedSkus,
      repairServicerules,
      showAll,
      listData,
      pageTitle,
      global,
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
    .release-section {
      margin-left: 8px;
      margin-top: 32px;
      h3 {
        font-size: 14px;
        padding-left: 0;
        margin-bottom: 8px;
      }
      .release-error-tips {
        color: #ff5c5c;
      }
    }
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
