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
              :is="item.sectionId"
              :ref="
                (el) => {
                  setRefFunction(item, el);
                }
              "
              @site-change="changeSiteId"
              @customRequest="customRequest || ''"
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
        <gj-button type="primary" @click="saveAndDraft" :loading="draftLoading"
          >保存并生成草稿</gj-button
        >
      </span>
    </template>
  </fullScreenDialog>
</template>
<script>
import {
  reactive,
  toRefs,
  defineComponent,
  computed,
  getCurrentInstance,
  onBeforeMount,
  ref,
} from "vue";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
import { M_T } from "@/store/mutationsTypes";
import BasicInfo from "@pagesSystem/published/shopee/components/BasicInfo.vue";
import ProductInfo from "@pagesSystem/published/shopee/components/ProductInfo.vue";
import ProductProperty from "@pagesSystem/published/shopee/components/ProductProperty.vue";
import ProductDescription from "@pagesSystem/published/shopee/components/ProductDescription.vue";
import ProductImage from "@pagesSystem/published/shopee/components/ProductImage.vue";
// import VariantInfo from './VariantInfo.vue';
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
import { createProduct, updateProduct } from "@api/published/shopee.js";
import rightNav from "@/components/rightNav";
import { getShopeeProductDetails } from "@api/published/shopee.js";

export default defineComponent({
  name: "PubShopeeGoodsInfoDetail",
  components: {
    rightNav,
    BasicInfo,
    ProductInfo,
    ProductProperty,
    ProductDescription,
    ProductImage,
    fullScreenDialog,
    // VariantInfo,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    recordId: {
      type: [String, undefined],
      default: () => {
        return "";
      },
    },
    fileListData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();

    const store = useStore();
    const componentRef = ref([]);
    const setRefFunction = (item, el) => {
      if (!componentRef.value.find((it) => it.sectionId === item.sectionId)) {
        componentRef.value.push({ sectionId: item.sectionId, el: el });
      }
    };

    const data = reactive({
      specsType: 1,
      recordId: props.recordId,
      fileListData: props.fileListData,
      loading: false,
      draftLoading: false,
      proxyThis: proxy,
    });

    const pageTitle = computed(() => {
      // return props.type === 1 ? '创建商品' : '编辑商品';
      if (props.type === 1) {
        return "创建商品";
      } else if (props.type === 2) {
        return "编辑商品";
      } else {
        return "复制商品";
      }
    });

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
      {
        name: "图片视频",
        sectionId: "ProductImage",
        ref: "productImage",
      },
      /* {
        name: '变体信息',
        componentName: 'moreAttr',
        ref: 'moreAttr',
      }, */
      /* {
        name: '图片视频',
        componentName: 'uploadImage',
        ref: 'uploadImage',
        fileListData: computed(() => {
          // 默认的显示的图片列表
          return props.fileListData
        }),
        uploadData: { categoryId: 10 }, // 上传附带参数，为必填，请传入各自平台的对应参数
      }, */
      {
        name: "产品描述",
        sectionId: "productDescription",
        ref: "productDescription",
      },
    ];

    /* const variantSect = [
      {
        name: '变体信息',
        sectionId: 'VariantInfo',
        ref: 'variantInfo',
      },
    ]; */

    const showAll = computed(() =>
      store.getters.getParams?.productInfo?.productType ? 1 : 2
    );

    /* const listData = computed(() => {
      return showAll.value ? defaultSect : defaultSect;
    }); */

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
      console.log(storeData, "storeData");
      const getCategoryAttributes = () => {
        const result = [];
        // const dataMap = storeData?.productProperty || {}
        /* const getAttrName = (key) => {
          let item = dataMap.mandatoryItem.find((it) => it.name === key)
          if (item) {
            return { ...item, type: 0 }
          }
          item = dataMap.advancedIsKeyPropItem.find((it) => it.name === key)
          if (item) {
            return { ...item, type: 1 }
          }
          item = dataMap.otherItem.find((it) => it.name === key)
          if (item) {
            return { ...item, type: 1 }
          }
          return null
        } */

        /* Object.keys(dataMap.propertyMap).forEach((key) => {
          if (dataMap.propertyMap[key] || dataMap.propertyMap[key] === 0) {
            let attrItem = getAttrName(key)
            const attrValue = dataMap.propertyMap[key]
            if (attrItem) {
              const item = {
                attrName: key,
                attributeType: attrItem.attributeType,
                attrNameId: attrItem.attributeId,
                attrValue,
                type: attrItem.type, // 0必填 1非必填
              }
              result.push(item)
            }
          }
        }) */
        return result;
      };

      /* const getTitles = (arr) => {
        return arr.map((item) => item.titleDesc).filter((item) => item);
      }; */

      /* const getDesc = (obj, type) => {
        if (!obj) return
        return obj.text
          .filter((item) => item)
          .map((item) => ({ type, descriptionInfo: item }))
      } */

      // 基础信息
      const basicInfo = {
        site: storeData.basicInfo.siteId,
        chargePersonId: storeData.basicInfo.chargePersonId,
        chargePersonName: storeData.basicInfo.chargePersonName,
        categoryId: storeData.basicInfo.categoryId,
        categoryName: storeData.basicInfo.categoryName,
        // titles: getTitles(storeData.productInfo.titleList),
        // platformCategoryId: storeData.basicInfo.productType,
      };

      const isSingleProduct = storeData.productInfo.productType !== "2";

      // 产品信息
      const property = {
        dimension: {
          length: isSingleProduct
            ? String(storeData.productInfo.singleProduct.long || "")
            : "",
          width: isSingleProduct
            ? String(storeData.productInfo.singleProduct.width || "")
            : "",
          height: isSingleProduct
            ? String(storeData.productInfo.singleProduct.height || "")
            : "",
        },
        weight: isSingleProduct
          ? String(storeData.productInfo.singleProduct.weight || "")
          : "",
        recommendPrice: isSingleProduct
          ? String(storeData.productInfo.singleProduct.price || "")
          : "",
        condition: isSingleProduct
          ? String(storeData.productInfo.singleProduct.condition || "")
          : "",
        platformCategoryId: isSingleProduct
          ? String(storeData.productInfo.platformCategoryId || "")
          : "",
        platformCategoryName: isSingleProduct
          ? String(storeData.productInfo.platformCategoryName || "")
          : "",
        spu: isSingleProduct
          ? String(storeData.productInfo.sku || storeData.productInfo.spu)
          : "",
        specsType: isSingleProduct
          ? String(storeData.productInfo.productType || "")
          : "",
        proImages: isSingleProduct ? storeData.productImage.fileList : [],
        videos: isSingleProduct ? storeData.productImage.videoObj : [],
        titles: isSingleProduct
          ? storeData.productInfo.titleList.map((item) => item.titleDesc) || []
          : "",
        // recommendPriceUnit: '',
        /* variants: !isSingleProduct ? getVariants() : [],
        variantAttrInfo: !isSingleProduct ? getvariantAttrInfo() : [], */
      };

      const attributes = storeData.productPropertyInfo.optionArr
        ? storeData.productPropertyInfo.optionArr.map((item) => {
            return {
              attrNameId: item.attribute_id,
              attrName: item.display_attribute_name,
              inputType: item.input_type,
              required: item.mandatory,
              attrValueList: item.page.map((it) => {
                return {
                  attrValueId: it.value_id,
                  attrValue: it.display_value_name,
                };
              }),
            };
          })
        : [];

      // 变体信息
      const getVariants = () => {
        const dataMap = storeData.variantInfo || {};
        /* const variantImages = storeData.productImage.valueImageList; */
        let result = dataMap.templateData || [];
        result.forEach((item) => {
          item.variantAttrInfo = [];
          /* const variant = variantImages.find(
            (variantItem) => variantItem.msku === item.msku
          );

          if (variant) {
            item.productImages = variant.productImages ?? [];
          }

          item.recommendPriceUnit = 'USD'; */
          Object.values(dataMap.tableData)?.forEach((it1) => {
            it1.skuAttrs.map((it2) => {
              const skuAttrItem = {
                variantId: "00",
                spu: it1.sku,
                price: it1.recommendPrice,
                enable: it1.isDisabled,
                quantity: it1.quantity,
                varAttrValues: [
                  {
                    varAttrId: it1.id,
                    varAttr: it2.attrName,
                    varAttrValueId: it1.id,
                    varAttrValue: it2.attrValue,
                  },
                ],
              };
              item.variantAttrInfo.push(skuAttrItem);
            });
          });
        });

        let r1 = result.map((item) => item.variantAttrInfo);
        return r1.flat(1);
      };

      const getvariantAttrInfo = () => {
        const result = [];
        /* const dataMap = storeData.variantInfo || {};
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
        }); */
        return result;
      };

      const variants = {
        variants: getVariants(),
        variantAttrs: getvariantAttrInfo(),
      };

      const descriptions = () => {
        let arr = [];
        if (storeData.productDescription) {
          storeData.productDescription.desc.map((item) =>
            arr.push(item.content)
          );
        }
        return arr;
      };

      return {
        id: props.recordId || "",
        remark: "",
        categoryAttributes: getCategoryAttributes(),
        ...basicInfo,
        ...property,
        attributes: attributes,
        ...variants,
        descriptions: descriptions(),
      };
    };

    const save = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr("saveForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          data.loading = true;
          const params = getPramData();
          if (props.type === 1) {
            createProduct(params)
              .then((res) => {
                if (res.code === 200) {
                  GjMessage.success("保存成功");
                  data.loading = false;
                  setTimeout(() => {
                    emit("updateHandler");
                  }, 100);
                } else {
                  data.loading = false;
                }
              })
              .catch(() => {
                data.loading = false;
              });
          } else if (props.type === 2) {
            updateProduct({ ...params, id: props.recordId })
              .then((res) => {
                if (res.code === 200) {
                  GjMessage.success("保存成功");
                  data.loading = false;
                  setTimeout(() => {
                    emit("cancel");
                    emit("updateHandler");
                  }, 100);
                } else {
                  data.loading = false;
                }
              })
              .catch(() => {
                data.loading = false;
              });
          } else {
            createProduct({ ...params, id: "" })
              .then((res) => {
                if (res.code === 200) {
                  GjMessage.success("复制成功");
                  data.loading = false;
                  setTimeout(() => {
                    emit("cancel");
                    emit("updateHandler");
                  }, 100);
                } else {
                  data.loading = false;
                }
              })
              .catch(() => {
                data.loading = false;
              });
          }
        }
      });
    };

    const saveAndDraft = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr("submitForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          data.draftLoading = true;
          const params = getPramData();
          if (props.type === 1) {
            createProduct(params)
              .then((res) => {
                if (res.code === 200) {
                  data.draftLoading = false;
                  emit("saveAndDraft", res.data);
                } else {
                  data.draftLoading = false;
                }
              })
              .catch(() => {
                data.draftLoading = false;
              });
          } else {
            updateProduct({ ...params, id: props.recordId })
              .then((res) => {
                emit("saveAndDraft", res.data);
              })
              .finally(() => {
                data.draftLoading = false;
              });
          }
        }
      });
    };

    const listData = computed(() => {
      const isSingle = data.specsType === 1;
      const list = isSingle ? defaultSect : defaultSect.slice(0, 2);
      // .concat(defaultSect.slice(2));
      return list;
    });

    const changeSiteId = (val) => {
      const targetRef = componentRef.value.find(
        (it) => it.sectionId === "ProductInfo"
      );
      console.log(targetRef, "targetRef");
      targetRef && targetRef.el.getCategoryData(val, true);
    };

    onBeforeMount(() => {
      if (props.recordId) {
        getShopeeProductDetails(props.recordId).then((res) => {
          const aData = res.data;

          if (aData.platformCategoryId) {
            // 说明有显示其他的模块
            store.commit(M_T.PARAMS_QUERY, {
              productInfo: {
                productTypeOpt: aData.platformCategoryId,
              },
            });
          }

          data.specsType = aData.specsType;

          setTimeout(() => {
            componentRef.value.forEach((targetRef) => {
              const fn = targetRef.el.setPageData;
              fn && fn(aData);
            });
          }, 0);
        });
      }
    });

    return {
      ...toRefs(data),
      pageTitle,
      showAll,
      listData,
      cancel,
      save,
      saveAndDraft,
      setRefFunction,
      changeSiteId,
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
  padding: 0 16px 0 8px;
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
