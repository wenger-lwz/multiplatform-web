<!--编辑/创建商品资料-->
<template>
  <fullScreenDialog :dialogVisible="visible">
    <template #title>
      <div class="dialog-title">
        <span v-if="type == 'darft'">{{
          isCreate ? "添加草稿" : "编辑草稿"
        }}</span>
        <span v-else>编辑在线商品</span>
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
              @shopIdChange="shopIdChange"
              @setCustomizedPic="setCustomizedPic"
              :groupIdList="groupIdList"
              :newsList="newsList"
              :serviceList="serviceList"
              :costList="costList"
              :areaPlat="areaPlat"
              :skuList="skuList"
              :carList="carList"
              :dataView="mobileDescription[0]"
              :editInfo="editData"
              @updateAttr="updateAttr"
              @setCarParam="setCarParam"
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
      <template v-if="type == 'darft'">
        <span class="dialog-footer">
          <gj-button @click="cancel" type="outline">取消</gj-button>
          <gj-button type="outline" @click="release">发布</gj-button>
          <gj-button type="outline" @click="timingRelease">定时发布</gj-button>
          <gj-button type="primary" @click="confirm">保存</gj-button>
        </span>
      </template>
      <template v-if="type == 'online'">
        <!-- 正常状态 -->
        <template v-if="updateState == 1">
          <span class="dialog-footer">
            <gj-button type="primary" @click="handelUpdateBtnByOne"
              >更新</gj-button
            >
            <gj-button type="primary" @click="confirmOnline">保存</gj-button>
          </span>
        </template>

        <template v-else>
          <gj-radio-group
            class="left-footer"
            type="button"
            v-model="isTemp"
            @change="statusChange"
          >
            <gj-radio :value="1">在线</gj-radio>
            <gj-radio :value="2">暂存</gj-radio>
          </gj-radio-group>
          <gj-button type="primary" @click="handelDeleteBtn" v-if="isTemp == 2"
            >删除暂存</gj-button
          >
          <gj-button
            type="primary"
            @click="handelUpdateBtnByOne"
            v-if="isTemp == 2"
            >更新</gj-button
          >
          <gj-button type="primary" @click="confirmOnline">保存</gj-button>
        </template>
      </template>
    </template>
  </fullScreenDialog>
  <WirelessDialog
    @goBack="cancel"
    @confirmMobile="confirmMobile"
    @cancel="cancelWireless"
    :viewData="currentMobileDescription"
    :dialogVisible="wirelessVisible"
    :spu="draftSpu"
    :specsType="specsType"
  ></WirelessDialog>
  <TimingModal
    :visible="timingModalVisible"
    @handleOk="handleOk"
    @handleCancel="handleCancel"
  ></TimingModal>
  <goods-modal
    :cancelVisible="cancelVisible"
    :modelObj="modelObj"
    @cancelHandleOk="cancelHandleOk"
    @cancelHandleOff="cancelHandleOff"
  ></goods-modal>
</template>
<script>
import {
  ref,
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch,
  onMounted,
  provide,
} from "vue";
import BasicInfo from "./basicInfo.vue";
import ProductInfo from "./productInfo.vue";
// import ProductAttr from './productAttr.vue'
import ProductAttr from "../../pubAliGoodsInfo/components/productAttr.vue";
import SalesInfo from "./salesInfo";
import PictureVideo from "./pictureVideo";
import Package from "./package";
import ProductDesc from "./productDesc";
import WirelessDialog from "../../wireless/index.vue";
import {
  getAttrById,
  updateAttrById,
  createDraft,
  editDraft,
  getPlatform,
  releaseDraft,
} from "@api/published/aliexpress";
import {
  editOnlineGoods,
  deleteTemporary,
  updateOnlineGoods,
} from "@api/published/aliexpress";
import TimingModal from "./timingModal.vue";
import rightNav from "@/components/rightNav";
import { clearStore } from "@/utils/common";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
import goodsModal from "@/pages/systemPages/published/eBay/eBayPublish/components/goodsModal.vue";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
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
    editData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: String,
      default: () => {
        return "darft";
      },
    },
    updateState: {
      type: [Number, String],
      default: () => {
        return "";
      },
    },
    itemId: {
      type: [Number, String],
      default: () => {
        return "";
      },
    },
  },
  components: {
    BasicInfo,
    ProductInfo,
    ProductAttr,
    Package,
    SalesInfo,
    PictureVideo,
    ProductDesc,
    WirelessDialog,
    TimingModal,
    rightNav,
    fullScreenDialog,
    goodsModal,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const store = new useStore();
    const data = reactive({
      type: props.type,
      wirelessVisible: false,
      proxyThis: proxy,
      listData: [
        { name: "基础信息", sectionId: "basicInfo", ref: "basicInfo" },
        { name: "产品信息", sectionId: "productInfo", ref: "productInfo" },
        { name: "产品属性", sectionId: "productAttr", ref: "productAttr" },
        { name: "销售资料", sectionId: "salesInfo", ref: "salesInfo" },
        { name: "图片视频", sectionId: "pictureVideo", ref: "pictureVideo" },
        { name: "产品描述", sectionId: "productDesc", ref: "productDesc" },
        { name: "包装物流", sectionId: "package", ref: "package" },
      ],

      visible: proxy.dialogVisible,
      isCreate: proxy.isCreate,
      editId: proxy.editId,
      productAttrArray: [],
      moreAttrArray: [],
      detailInfo: {},
      editBasicInfo: {},
      editProductInfo: {},
      mobileDescription: [],
      currentMobileDescription: [],
      current: 0,
      attrData: [],
      // specsType: 1, //1 为单体，2 为变体
      skuList: [],
      timingModalVisible: false,
      draftId: "",
      // draftSpu: '',
      editData: {},
      groupIdList: [],
      costList: [],
      serviceList: [],
      areaPlat: [],
      newsList: [],
      carList: [],
      cancelVisible: false,
      modelObj: {
        modelTitle: "",
        modelText: "",
      },
      updateState: props.updateState,
      itemId: props.itemId,
      isTemp: 2,
    });

    const shopId = ref("");
    provide("shopId", shopId);

    const specsType = ref(1);
    provide("specsType", specsType);

    const platformCategoryId = ref("");
    provide("platformCategoryId", platformCategoryId);

    const customizedPic = ref([]);
    provide("customizedPic", customizedPic);

    const draftSpu = ref("");
    provide("draftSpu", draftSpu);

    const setCustomizedPic = (arr) => {
      customizedPic.value = arr;
    };

    const isCarParam = ref(false);
    provide("isCarParam", isCarParam);

    const modelType = ref(1);
    provide("modelType", modelType);

    //用来判断切换为变体时 回显上次数据的依据
    const isSaveMoreAttrFalg = ref(false);
    provide("isSaveMoreAttrFalg", isSaveMoreAttrFalg);

    const setCarParam = (val) => {
      isCarParam.value = val.isCarParam;
      modelType.value = val.modelType;
    };

    const shopIdChange = (id) => {
      shopId.value = id;
      getProductPlat(id);
      getCostPlat(id);
      getServicePlat(id);
      getAreaPlat(id);
      getNewsPlat(id);
      getCarPlat(id);
    };

    const getNewsPlat = (id) => {
      if (!id) return;
      getPlatform({
        shopId: id,
        componentType: "2",
      }).then((res) => {
        data.newsList = res.data;
      });
    };

    const getCarPlat = (id) => {
      if (!id || !isCarParam.value) return;
      getPlatform({
        shopId: id,
        componentType: "4",
        modelType: modelType.value,
      }).then((res) => {
        data.carList = res.data;
      });
    };

    const getAreaPlat = (id) => {
      if (!id) return;
      getPlatform({
        shopId: id,
        componentType: "3",
      }).then((res) => {
        data.areaPlat = res.data;
      });
    };
    //获取运费模板下拉
    const getCostPlat = (id) => {
      if (!id) return;
      getPlatform({
        shopId: id,
        componentType: "6",
      }).then((res) => {
        data.costList = res.data;
      });
    };

    //获取服务模板下拉
    const getServicePlat = (id) => {
      if (!id) return;
      getPlatform({
        shopId: id,
        componentType: "7",
      }).then((res) => {
        data.serviceList = res.data;
      });
    };
    const getProductPlat = (id) => {
      if (!id) return;
      getPlatform({
        shopId: id,
        componentType: "1",
      }).then((res) => {
        data.groupIdList = res.data;
      });
    };

    const goBack = () => {
      data.wirelessVisible = false;
      emit("cancel");
    };

    const cancelHandleOk = () => {
      data.wirelessVisible = false;
      data.cancelVisible = false;
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
      () => props.editId,
      (newValue) => {
        data.editId = newValue;
      }
    );

    watch(
      () => props.editData,
      (newValue) => {
        data.editData = newValue;
        if (JSON.stringify(data.editData) === "{}") {
          data.mobileDescription = [];
          data.currentMobileDescription = [];
          draftSpu.value = "";
        } else {
          shopIdChange(newValue.shopId);
          draftSpu.value = newValue.spu;
          modelType.value = data.editData?.modelType || "";
          isCarParam.value = data.editData?.carParam || false;
          if (newValue.mobileDescription) {
            data.mobileDescription.push(JSON.parse(newValue.mobileDescription));
            data.currentMobileDescription = JSON.parse(
              newValue.mobileDescription
            );
          }
        }
      },
      { deep: true }
    );

    watch(
      () => props.updateState,
      (newValue) => {
        data.updateState = newValue;
      }
    );

    watch(
      () => props.itemId,
      (newValue) => {
        data.itemId = newValue;
      }
    );
    const editWireless = (value) => {
      data.wirelessVisible = true;
      data.current = value;
      if (data.mobileDescription[value]) {
        data.currentMobileDescription = data.mobileDescription[value];
      } else {
        data.currentMobileDescription = [];
      }
    };

    onMounted(() => {});

    const specsChange = (val) => {
      specsType.value = val;
      setAttrType();

      if (val === 1) {
        isSaveMoreAttrFalg.value = true;
      }
    };

    const getPromiseArr = (fnName) => {
      // const formList = proxy.$refs

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
        ...paramsList.packagInfo,
      };
      params.mobileDescription = data.mobileDescription.map((item) => {
        return JSON.stringify(item);
      })[0];
      params.modelType = isCarParam.value ? modelType.value : "";
      return params;
    };

    const confirmOnline = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr("submitForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          const params = getRequestParams();

          //保存编辑
          editOnlineGoods({
            ...params,
            listingId: data.editId,
          }).then(() => {
            emit("confirm");
            GjMessage.success("保存成功！");
          });
        }
      });
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
            createDraft(params).then(() => {
              emit("confirm");
              GjMessage.success("草稿保存成功！");
            });
          } else {
            //保存编辑
            editDraft({
              ...params,
              listingId: data.editId,
            }).then(() => {
              emit("confirm");
              GjMessage.success("草稿保存成功！");
            });
          }
        }
      });
    };

    const timingRelease = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr("submitForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          const params = getRequestParams();
          if (data.isCreate) {
            //保存新增
            createDraft(params).then((res) => {
              data.timingModalVisible = true;
              data.draftId = res.data;
            });
          } else {
            //保存编辑
            editDraft({
              ...params,
              listingId: data.editId,
            }).then((res) => {
              data.timingModalVisible = true;
              data.draftId = res.data;
              // GjMessage.success("保存成功！");
            });
          }
        }
      });
    };

    const handleOk = (val) => {
      data.timingModalVisible = false;
      emit("confirm");

      releaseDraft({
        draftId: data.draftId,
        onlineType: 2,
        onlineTime: new Date(String(val.onlineTime)).getTime(),
        state: val.state,
      }).then(() => {
        GjMessage.success("发布成功!");
      });
    };
    const handleCancel = () => {
      data.timingModalVisible = false;
      emit("confirm");
    };
    const release = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr("submitForm");
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          const params = getRequestParams();
          if (data.isCreate) {
            //保存新增
            createDraft(params).then((res) => {
              releaseDraft({
                draftId: res.data,
                onlineType: 1,
              }).then(() => {
                emit("confirm");
                GjMessage.success("发布成功!");
              });
            });
          } else {
            //保存编辑
            editDraft({
              ...params,
              listingId: data.editId,
            }).then((res) => {
              releaseDraft({
                draftId: res.data,
                onlineType: 1,
              }).then(() => {
                emit("confirm");
                GjMessage.success("发布成功!");
              });
            });
          }
        }
      });
    };

    //根据Id获取属性
    const getAttr = (val) => {
      platformCategoryId.value = val;
      customizedPic.value = [];
      isSaveMoreAttrFalg.value = false;

      setTimeout(() => {
        getCarPlat(shopId.value);
      }, 0);
      getAttrById(val).then((res) => {
        data.attrData = res.data;
        setAttrType();
      });
    };

    //区分属性
    const setAttrType = () => {
      if (data.attrData.length <= 0) return;
      if (specsType.value === 2) {
        data.productAttrArray = data.attrData.filter((item) => !item.sku); //产品属性
        data.moreAttrArray = data.attrData.filter((item) => item.sku); //变体属性
        console.log(data.productAttrArray);
      } else {
        data.productAttrArray = data.attrData;
      }
    };

    const updateAttr = () => {
      if (!platformCategoryId.value) {
        return GjMessage.warning("请选择要更新的类别属性");
      } else {
        updateAttrById(platformCategoryId.value).then(() => {
          getAttrById(platformCategoryId.value).then((res) => {
            data.attrData = res.data;
            setAttrType();
            GjMessage.success("属性更新成功");
          });
        });
      }
    };

    const confirmMobile = (arr) => {
      data.wirelessVisible = false;
      data.mobileDescription[data.current] = arr;
    };

    const cancelWireless = () => {
      data.wirelessVisible = false;
    };
    const getSkuList = (obj) => {
      data.skuList = obj.relatedSkus;
      draftSpu.value = obj.spu;
    };

    const importTransPCMobile = (arr) => {
      data.currentMobileDescription = arr;
      data.mobileDescription[0] = data.currentMobileDescription;
    };

    const componentRef = ref([]);
    const setRefFunction = (item, el) => {
      if (!componentRef.value.find((it) => it.sectionId === item.sectionId)) {
        componentRef.value.push({ sectionId: item.sectionId, el: el });
      }
    };

    //更新
    const handelUpdateBtnByOne = () => {
      updateOnlineGoods(data.itemId).then(() => {
        emit("confirm");
        return GjMessage.warning("更新任务已提交，请稍后查看!");
      });
    };

    const statusChange = (val) => {
      console.log(val);
      emit("statusChange", val);
    };

    const handelDeleteBtn = () => {
      deleteTemporary(data.editId).then(() => {
        emit("confirm");
      });
    };

    return {
      ...toRefs(data),
      specsType,
      draftSpu,
      cancel,
      confirm,
      specsChange,
      getAttr,
      editWireless,
      confirmMobile,
      cancelWireless,
      getSkuList,
      importTransPCMobile,
      release,
      timingRelease,
      handleOk,
      handleCancel,
      componentRef,
      setRefFunction,
      shopIdChange,
      setCustomizedPic,
      updateAttr,
      setCarParam,
      cancelHandleOk,
      cancelHandleOff,
      goBack,
      confirmOnline,
      handelUpdateBtnByOne,
      statusChange,
      handelDeleteBtn,
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
.left-footer {
  float: left;
}
</style>
