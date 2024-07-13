<template>
  <fullScreenDialog :dialogVisible="dialogVisible" class="full_Dialog_ebay">
    <template #title>
      <div class="dialog-title">
        <span>{{ actionName }}</span>
        <gj-button @click="cancel('off')">关闭</gj-button>
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
              @setShowItemFun="setShowItemFun"
              @attrFun="attrFun"
              :stroeCategoryId="stroeCategoryId"
              :actionType="actionType"
              :goodsRowData="goodsRowData"
              :publicList="publicList"
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
        <gj-button type="plain" @click="cancel('toast')">取消</gj-button>
        <gj-button type="primary" @click="save" :loading="addLoading"
          >保存</gj-button
        >
      </span>
    </template>
  </fullScreenDialog>
  <goods-modal
    :cancelVisible="cancelVisible"
    :modelObj="modelObj"
    @cancelHandleOk="cancelHandleOk"
    @cancelHandleOff="cancelHandleOff"
  ></goods-modal>
</template>
<script>
import {
  reactive,
  toRefs,
  defineComponent,
  getCurrentInstance,
  watch,
  ref,
  onMounted,
} from "vue";
import { GjMessage } from "@gj/atom";
import { useStore } from "vuex";
import rightNav from "@/components/rightNav";
import basicInfo from "../components/basicInfo.vue";
import productInfo from "../components/productInfo.vue";
import productAttributesInfo from "../components/productAttributes.vue";
import compatibilityInfo from "../components/compatibilityInfo.vue";
import variantInfo from "../components/variantInfo.vue";
import pictureInfo from "../components/pictureInfo.vue";
import productDescriptionInfo from "../components/productDescriptionInfo.vue";
import fullScreenDialog from "@/pages/systemPages/published/components/fullScreenDialog.vue";
import { compatibilityCommonFun } from "../components/compatibilityInfo";
import goodsModal from "@/pages/systemPages/published/eBay/eBayPublish/components/goodsModal.vue";
import {
  createProductList,
  getProductList,
  getProductCopyList,
  modifyProduct,
} from "@api/published/ebay.js";
export default defineComponent({
  emits: ["cancel", "tableUplod"],
  components: {
    basicInfo,
    productInfo,
    productAttributesInfo,
    compatibilityInfo,
    variantInfo,
    pictureInfo,
    productDescriptionInfo,
    fullScreenDialog,
    rightNav,
    goodsModal,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    actionType: {
      //操作
      type: String,
      default: () => {
        return "";
      },
    },
    rowData: {
      //列数据
      type: Object,
      default: () => {
        return {};
      },
    },
    stroeCategoryId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      actionName: "", //操作类型
      publicList: [], //数据字典
      goodsRowData: {}, //id查详情
      proxyThis: proxy,
      addLoading: false,
      cancelVisible: false,
      modelObj: {
        modelTitle: "",
        modelText: "",
      },
      ponentData: [],
      listData: [],
      defaultSect: [
        {
          name: "基础信息",
          sectionId: "basicInfo",
          ref: "basicInfo",
          isShow: true,
        },
        {
          name: "产品信息",
          sectionId: "productInfo",
          ref: "productInfo",
          isShow: true,
        },
        {
          name: "产品属性",
          sectionId: "productAttributesInfo",
          ref: "productAttributesInfo",
          isShow: true,
        },
        {
          name: "配件兼容性",
          sectionId: "compatibilityInfo",
          ref: "compatibilityInfo",
          isShow: false,
        },

        {
          name: "变体信息",
          sectionId: "variantInfo",
          ref: "variantInfo",
          isShow: false,
        },
        {
          name: "图片视频",
          sectionId: "pictureInfo",
          ref: "pictureInfo",
          isShow: true,
        },
        {
          name: "产品描述",
          sectionId: "productDescriptionInfo",
          ref: "productDescriptionInfo",
          isShow: true,
        },
      ],
      stroeCategoryId: "",
    });
    const componentRef = ref([]);
    const setRefFunction = (item, el) => {
      if (!componentRef.value.find((it) => it.sectionId === item.sectionId)) {
        componentRef.value.push({
          sectionId: item.sectionId,
          el: el,
        });
      }
    };
    const attrFun = (val) => {
      data.stroeCategoryId = val;
    };
    const store = useStore();
    const setShowItemFun = (key, val) => {
      data.defaultSect.forEach((item) => {
        if (item.sectionId == key) {
          item.isShow = val;
        }
      });
      data.listData = data.defaultSect.filter((item) => item.isShow);
    };
    const cancelHandleOk = () => {
      data.cancelVisible = false;
      emit("cancel");
    };
    const cancelHandleOff = () => {
      data.cancelVisible = false;
    };
    const cancel = (val) => {
      if (val == "toast") {
        data.modelObj = {
          modelTitle: "提示",
          modelText: "当前编辑未保存，关闭将不做保存，是否关闭？",
        };
        data.cancelVisible = true;
      } else {
        emit("cancel");
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_SPECSTYPE, 1);
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY, "");
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_CATEGORYID, "");
        let skuObj = {
          type: "",
          value: "",
        };
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_PICTURE, skuObj);
      }
    };

    const formAll = (fnName) => {
      const list = [];
      componentRef.value.forEach((targetRef) => {
        let arr = data.listData.filter(
          (item) => item.sectionId == targetRef.sectionId
        );
        if (arr.length !== 0) {
          const fn = targetRef.el[fnName] || targetRef.el.submitForm;
          list.push(fn());
        }
      });
      return list;
    };
    const save = () => {
      let formList = formAll("submitForm");
      Promise.all(formList).then(function (res) {
        let isSubmit = false;
        if (res.includes("404")) {
          isSubmit = true;
          console.log("验证失败", "获取到的表单的值", store.getters.getParams);
          // GjMessage.warning("过滤除验证失败的");
        } else {
          isSubmit = false;
          console.log("验证成功", "获取到的表单的值", store.getters.getParams);
        }
        if (!isSubmit) {
          let obj = {
            ...store.getters.getParams,
            // ...store.getters.getParams.basicInfo,
            // ...store.getters.getParams.productInfo,
            // ...store.getters.getParams.productAttributesInfo,
            // ...store.getters.getParams.compatibilityInfo,
            // ...store.getters.getParams.variantInfo,
            // ...store.getters.getParams.pictureInfo,
            // ...store.getters.getParams.productDescriptionInfo,
          };
          console.log(obj);
          let params = {
            categoryAttributes: obj.productAttributesInfo?.productList || [], //产品属性
            categoryId: obj.basicInfo.categoryId,
            categoryName: obj.basicInfo.categoryName,
            chargePersonId: obj.basicInfo.chargePersonId,
            chargePersonName: obj.basicInfo.chargePersonName,
            compatibilityNames: obj.compatibilityInfo?.columns || [], //兼容性大类
            compatibilityRecords:
              compatibilityCommonFun.getCompatibilityInfoData(
                obj.compatibilityInfo?.tableData,
                props.actionType,
                data.goodsRowData
              ), //兼容性列表,
            compatibilityTemplateId:
              obj.compatibilityInfo?.compatibilityTemplateId || "",
            conditionDescription: obj.productInfo.conditionDescription,
            descriptions: obj.productDescriptionInfo.tabsData,
            eanCode: obj.productInfo.eanCode,
            ebayCondition: obj.productInfo.ebayCondition,
            isbnCode: obj.productInfo.isbnCode || "",
            platformCategoryId:
              obj.productInfo.categoryId || obj.productInfo.platformCategoryId,
            platformCategories: obj.productInfo.platformCategories, //第一分类
            productImages: obj.pictureInfo.productImages,

            recommendPrice: obj.productInfo.recommendPrice,
            priceUnit: obj.basicInfo.priceUnit,
            recommendPriceUnit: obj.basicInfo.priceUnit, //根据站点获取的币种
            secondPlatformCategoryId: obj.productInfo.secondCategoryId,
            secondPlatformCategories: obj.productInfo.secondPlatformCategories, //第二分类
            siteId: obj.basicInfo.siteId,
            siteName: obj.basicInfo.siteName,
            specsType: obj.productInfo.specsType,
            spu: obj.productInfo.sku
              ? obj.productInfo.sku
              : obj.productInfo.spu,
            sku: obj.productInfo.sku
              ? obj.productInfo.sku
              : obj.productInfo.spu,
            subtitle: obj.productInfo.subtitle,
            titles: obj.productInfo.titleDescript.map((item) => {
              return item.titleDesc;
            }),
            upcCode: obj.productInfo.upcCode,
            variantAttrs: compatibilityCommonFun.getVariantInfoData(obj), //包括变体图片
            variants: compatibilityCommonFun.getVariantInfoTableData(obj),
            videoInfos:
              JSON.stringify(obj.pictureInfo.vidoeObj) == "{}"
                ? []
                : [obj.pictureInfo.vidoeObj].flat(),
          };
          data.addLoading = true;

          console.log(params, "入参");
          if (props.actionType == "add" || props.actionType == "copy") {
            createFun(params);
          }

          if (props.actionType == "edit") {
            editFun(params);
          }
        }
      });
    };
    const createFun = (params) => {
      createProductList(params)
        .then((res) => {
          const { code } = res;
          if (code === 0 || code === 200) {
            data.addLoading = false;
            GjMessage.success("商品资料保存成功！");
          } else {
            GjMessage.warning("商品资料保存失败！");
          }
          emit("cancel");
          emit("tableUplod");
        })
        .finally(() => {
          data.addLoading = false;
        });
    };
    const editFun = (params) => {
      modifyProduct(props.rowData.id, params)
        .then((res) => {
          const { code } = res;
          if (code === 0 || code === 200) {
            GjMessage.success("商品资料保存成功！");
          } else {
            GjMessage.success("商品资料保存失败！");
          }
          emit("cancel");
          emit("tableUplod");
        })
        .finally(() => {
          data.addLoading = false;
        });
    };

    const getEditGoodsId = (row) => {
      getProductList(row.id).then((res) => {
        const { code } = res;
        if (code === 0 || code === 200) {
          data.goodsRowData = res.data;
          data.stroeCategoryId = res.data.stroeCategoryId;
        }
      });
    };
    const getCopyGoodsId = async (row) => {
      await getProductCopyList(row.id).then((res) => {
        const { code } = res;
        if (code === 0 || code === 200) {
          data.goodsRowData = res.data;
          data.stroeCategoryId = res.data.stroeCategoryId;
        }
      });
    };
    watch(
      () => props.actionType,
      (newVal) => {
        if (newVal == "add") {
          data.actionName = "创建商品";
        } else if (newVal == "edit") {
          data.actionName = "编辑商品";
          getEditGoodsId(props.rowData);
        } else {
          data.actionName = "复制商品";
          getCopyGoodsId(props.rowData);
        }
      },
      {
        immediate: true,
      }
    );
    onMounted(() => {
      data.listData = data.defaultSect.filter((item) => item.isShow);
    });
    return {
      ...toRefs(data),
      setRefFunction,
      setShowItemFun,
      attrFun,
      cancel,
      save,
      formAll,
      createFun,
      getEditGoodsId,
      getCopyGoodsId,
      cancelHandleOk,
      cancelHandleOff,
    };
  },
});
</script>
<style lang="scss" scoped>
.full_Dialog_ebay {
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
    background: #fff;

    button {
      margin-left: 12px;
    }
  }
}
</style>
