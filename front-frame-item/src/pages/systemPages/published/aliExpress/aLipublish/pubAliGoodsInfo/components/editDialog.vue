<!--编辑/创建商品资料-->
<template>
  <div class="wrap">
    <fullScreenDialog :dialogVisible="visible">
      <template #title>
        <div class="dialog-title">
          <span>{{ isCreate ? "添加商品" : "编辑商品" }}</span>
          <gj-button @click="cancel" shape="round">关闭</gj-button>
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
                @specsChange="specsChange"
                :specs="specsType"
                :attr="specsType"
                :productAttrArray="productAttrArray"
                :variantAttrInfo="moreAttrArray"
                @getAttr="getAttr"
                @getSkuList="getSkuList"
                @importTransPCMobile="importTransPCMobile"
                @editWireless="editWireless"
                :skuList="skuList"
                :dataView="mobileDescription[0]"
                :editInfo="editData"
                @updateAttr="updateAttr"
                @setCarParam="setCarParam"
                :showCarPlat="false"
              />
            </div>
          </div>
          <div class="right-silder">
            <rightNav
              :layoutData="listData"
              :proxyData="proxyThis"
              :topIsFixed="true"
            ></rightNav>
          </div>
        </div>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <gj-button @click="cancel" type="outline">取消</gj-button>
          <gj-button type="outline" @click="confirm">保存</gj-button>
          <gj-button type="primary" @click="saveAndCreatDraft"
            >保存并生成草稿</gj-button
          >
        </span>
      </template>
    </fullScreenDialog>
    <WirelessDialog
      @goBack="cancel"
      @cancel="cancelWireless"
      @confirmMobile="confirmMobile"
      :dialogVisible="wirelessVisible"
      :viewData="currentMobileDescription"
      :spu="proSpu"
      :specsType="specsType"
    ></WirelessDialog>
    <goods-modal
      :cancelVisible="cancelVisible"
      :modelObj="modelObj"
      @cancelHandleOk="cancelHandleOk"
      @cancelHandleOff="cancelHandleOff"
    ></goods-modal>
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch,
  onMounted,
  computed,
  ref,
  provide,
} from "vue";
import BasicInfo from "./basicInfo.vue";
import ProductInfo from "./productInfo.vue";
import ProductAttr from "./productAttr";
import MoreAttr from "./moreAttr";
import PictureVideo from "./pictureVideo";
import ProductDesc from "./productDesc";
import WirelessDialog from "../../wireless/index.vue";
import {
  getAttrById,
  updateAttrById,
  addProduct,
  editProduct,
} from "@api/published/aliexpress";
import { useStore } from "vuex";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
import rightNav from "@/components/rightNav";
import { clearStore } from "@/utils/common";
import { GjMessage } from "@gj/atom";
import goodsModal from "@/pages/systemPages/published/eBay/eBayPublish/components/goodsModal.vue";
export default defineComponent({
  emits: ["cancel", "confirm"],
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    isCreate: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    editId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  components: {
    BasicInfo,
    ProductInfo,
    ProductAttr,
    MoreAttr,
    PictureVideo,
    ProductDesc,
    WirelessDialog,
    fullScreenDialog,
    rightNav,
    goodsModal,
  },
  setup(props, { emit }) {
    const store = new useStore();
    const { proxy } = getCurrentInstance();

    const data = reactive({
      wirelessVisible: false,
      proxyThis: proxy,
      visible: proxy.dialogVisible,
      isCreate: proxy.isCreate,
      editId: proxy.editId,
      productAttrArray: [],
      moreAttrArray: [],
      productId: proxy.$route.query.productId,
      detailInfo: {},
      editBasicInfo: {},
      editProductInfo: {},
      mobileDescription: [],
      currentMobileDescription: [],
      current: 0,
      attrData: [],
      specsType: 1, //1 为单体，2 为变体
      skuList: [],
      editData: {},
      proSpu: "",
      platformCategoryId: "",
      cancelVisible: false,
      modelObj: {
        modelTitle: "",
        modelText: "",
      },
    });

    const singleList = [
      { name: "基础信息", sectionId: "basicInfo", ref: "basicInfo" },
      { name: "产品信息", sectionId: "productInfo", ref: "productInfo" },
      { name: "产品属性", sectionId: "productAttr", ref: "productAttr" },
      { name: "图片视频", sectionId: "pictureVideo", ref: "pictureVideo" },
      { name: "产品描述", sectionId: "productDesc", ref: "productDesc" },
    ];

    const variant = [
      { name: "变体信息", sectionId: "moreAttr", ref: "moreAttr" },
    ];
    const listData = computed(() => {
      const list = [...singleList];
      if (data.specsType === 2) {
        list.splice(3, 0, variant[0]);
      }
      return list;
    });

    const componentRef = ref([]);
    const setRefFunction = (item, el) => {
      if (!componentRef.value.find((it) => it.sectionId === item.sectionId)) {
        componentRef.value.push({ sectionId: item.sectionId, el: el });
      }
    };

    watch(
      () => componentRef.value,
      (newValue) => {
        componentRef.value = newValue;
      }
    );

    const isCarParam = ref(false);
    provide("isCarParam", isCarParam);

    const modelType = ref(1);
    provide("modelType", modelType);

    const setCarParam = (val) => {
      isCarParam.value = val.isCarParam;
      modelType.value = val.modelType;
    };

    //用来判断切换为变体时 回显上次数据的依据
    const isSaveMoreAttrFalg = ref(false);
    provide("isSaveMoreAttrFalg", isSaveMoreAttrFalg);

    //用来判断切换为变体时 保存上一次数据
    const saveMoreAttr = ref({});
    provide("saveMoreAttr", saveMoreAttr);

    // const cancel = () => {
    //   emit('cancel')
    // }

    const cancelHandleOk = () => {
      data.cancelVisible = false;
      data.wirelessVisible = false;
      emit("cancel");
    };
    const cancelHandleOff = () => {
      data.cancelVisible = false;
    };
    const cancel = () => {
      data.modelObj = {
        modelTitle: "提示",
        modelText: "当前编辑未保存，关闭将不做保存，是否关闭？",
      };
      data.cancelVisible = true;
    };

    const cancelWireless = () => {
      data.wirelessVisible = false;
    };
    const goBack = () => {
      data.wirelessVisible = false;
      emit("cancel");
    };
    watch(
      () => props.dialogVisible,
      (newValue) => {
        data.visible = newValue;
        if (!newValue) {
          clearStore();
        }
      }
    );

    watch(
      () => props.isCreate,
      (newValue) => {
        data.isCreate = newValue;
      }
    );

    watch(
      () => store.state.aliexpress.proSpu,
      (newValue) => {
        data.proSpu = newValue;
      },
      { deep: true }
    );

    watch(
      () => props.editId,
      (newValue) => {
        data.editId = newValue;
      }
    );

    watch(
      () => store.state.aliexpress.aliProductInfo,
      (newValue) => {
        data.editData = newValue;
        // data.moreAttrArray = newValue.moreAttrArray || []
        data.mobileDescription = newValue.mobileDescription
          ? newValue.mobileDescription.map((item) => {
              return JSON.parse(item);
            })
          : [];
        modelType.value = data.editData?.modelType || "";

        isCarParam.value = data.editData?.carParam || false;
        console.log(data.mobileDescription);
      },
      { deep: true }
    );

    watch(
      () => store.state.aliexpress.draftSpu,
      (newValue) => {
        data.draftSpu = newValue;
      },
      { deep: true }
    );

    const resFormData = () => {
      data.editBasicInfo = {};
      data.editProductInfo = {};
    };

    const editWireless = (value) => {
      data.wirelessVisible = true;
      data.current = value;
      if (data.mobileDescription[value]) {
        data.currentMobileDescription = data.mobileDescription[value];
      } else {
        data.currentMobileDescription = [];
      }
    };

    onMounted(() => {
      if (data.productId) {
        console.log("data.productId");
      }
    });

    const specsChange = (val) => {
      data.specsType = val;
      setAttrType();

      console.log(componentRef.value);

      if (val === 1) {
        isSaveMoreAttrFalg.value = true;
      }
    };

    const getPromiseArr = (fnName) => {
      const promiseArr = [];
      componentRef.value.forEach((targetRef) => {
        const fn = targetRef.el[fnName] || targetRef.el.submitForm;
        promiseArr.push(fn());
      });
      return promiseArr;
    };

    const getRequestParams = () => {
      const paramsList = store.getters.getParams;
      const params = {
        ...paramsList.basicInfo,
        ...paramsList.moreAttr,
        ...paramsList.productInfo,
        ...paramsList.productAttr,
        ...paramsList.pictureVideo,
        ...paramsList.productDesc,
      };
      params.titles = params.titles.map((item) => item.value);

      params.mobileDescription = data.mobileDescription.map((item) => {
        return JSON.stringify(item);
      });

      params.modelType = isCarParam.value ? modelType.value : "";

      return params;
    };

    const confirm = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr("submitForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          const params = getRequestParams();

          if (data.isCreate) {
            //保存新增
            addProduct(params).then(() => {
              emit("confirm");
              GjMessage.success("商品资料保存成功！");
            });
          } else {
            //保存编辑
            editProduct({
              ...params,
              productId: data.editId,
            }).then(() => {
              emit("confirm");
              GjMessage.success("商品资料保存成功");
            });
          }
        }
      });
    };

    const saveAndCreatDraft = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr("submitForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          const params = getRequestParams();
          let creatDraft = "";

          if (data.isCreate) {
            //保存新增
            addProduct(params).then((res) => {
              creatDraft = res.data;
              GjMessage.success("保存成功！");
              emit("confirm");
              emit("generateDrafts", creatDraft);
            });
          } else {
            //保存编辑
            editProduct({
              ...params,
              productId: data.editId,
            }).then((res) => {
              creatDraft = res.data;
              GjMessage.success("保存成功！");
              emit("confirm");
              emit("generateDrafts", creatDraft);
            });
          }
        }
      });
    };

    //根据Id获取属性
    const getAttr = (val) => {
      data.platformCategoryId = val;
      isSaveMoreAttrFalg.value = false;
      getAttrById(val).then((res) => {
        data.attrData = res.data;
        setAttrType();
      });
    };

    //区分属性
    const setAttrType = () => {
      if (data.attrData.length <= 0) return;
      if (data.specsType === 2) {
        data.productAttrArray = data.attrData.filter((item) => !item.sku); //产品属性
        data.moreAttrArray = data.attrData.filter((item) => item.sku); //变体属性
        console.log(data.productAttrArray);
      } else {
        data.moreAttrArray = [];
        data.productAttrArray = data.attrData;
      }
    };

    //更新属性
    const updateAttr = () => {
      if (!data.platformCategoryId) {
        return GjMessage.warning("请选择要更新的类别属性");
      } else {
        updateAttrById(data.platformCategoryId).then(() => {
          getAttrById(data.platformCategoryId).then((res) => {
            data.attrData = res.data;
            setAttrType();
            GjMessage.success("属性更新成功");
          });
        });
      }
    };

    const confirmMobile = (arr) => {
      data.mobileDescription[data.current] = arr;
      data.wirelessVisible = false;
    };
    const getSkuList = (arr) => {
      data.skuList = arr;
    };
    return {
      ...toRefs(data),
      cancel,
      confirm,
      specsChange,
      getAttr,
      resFormData,
      editWireless,
      confirmMobile,
      goBack,
      cancelWireless,
      getSkuList,
      listData,
      componentRef,
      setRefFunction,
      saveAndCreatDraft,
      updateAttr,
      setCarParam,
      cancelHandleOk,
      cancelHandleOff,
    };
  },
});
</script>
<style lang="scss" scoped>
.detail-content {
  padding: 0px 24px 16px 8px;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .left-silder {
    flex: 0 1 auto;
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
