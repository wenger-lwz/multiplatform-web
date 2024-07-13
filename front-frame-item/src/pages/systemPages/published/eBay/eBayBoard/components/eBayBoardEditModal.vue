<template>
  <fullScreenDialog :dialogVisible="isVisible" unmount-on-close>
    <template #title>
      <div class="dialog-title">
        <span>{{ templateTitle }}</span>
        <gj-button @click="handleCancel" shape="round">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="detail-content">
        <div class="left-silder">
          <template v-for="item in listData" :key="item.sectionId">
            <div class="formHeader">
              <gj-row type="flex" class="row-bg" justify="end">
                <gj-col :span="getIsShow(item) ? 12 : 24">
                  <gj-space>
                    <div class="titleName row-bg" :ref="item.sectionId">
                      {{ $t(item.sectionId) }}
                    </div>
                    <div v-if="item.titleBtn">
                      <gj-space>
                        <gj-button
                          class="btnModal"
                          type="text"
                          size="mini"
                          v-for="it in newFormData[item.componentName]"
                          :key="it.prop"
                          @click="changeInfo(it.prop)"
                          >{{ it.label }}
                        </gj-button>
                      </gj-space>
                    </div>
                  </gj-space>
                </gj-col>
                <gj-col :span="12" v-if="getIsShow(item)">
                  <div class="text_rigth row-bg">
                    <rigthBox
                      :action="getEbayTemplateAssemblyInfo"
                      :parmas="item"
                      @save_templateInfo="getSaveTemplateInfo"
                    ></rigthBox>
                  </div>
                </gj-col>
              </gj-row>
            </div>
            <component
              :is="item.componentName"
              :ref="item.ref"
              :stroeSiteId="stroeSiteId"
              @setStroeSiteId="setStroeSiteId"
              :formData="newFormData[item.componentName]"
              :queryEbayBaseSiteInfo="queryEbayBaseSiteInfo"
              :listingCommonShopId="listingCommonShopId"
            />
          </template>
        </div>
        <!-- <div class="right-silder">
          <rightNav :layoutData="listData" :proxyData="proxyThis"></rightNav>
        </div> -->
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <gj-button shape="round" @click="handleCancel">取消</gj-button>
        <gj-button shape="round" type="outline" @click="handleOk">
          保存
        </gj-button>
      </span>
    </template>
  </fullScreenDialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  computed,
} from "vue";
import basicInfo from "./basicInfo.vue";
import salesInfo from "./salesInfo.vue";
import logisticsPolicy from "./logisticsPolicy.vue";
import paymentPolicy from "./paymentPolicy.vue";
import returnPolicy from "./returnPolicy.vue";
import buyerRequirements from "./buyerRequirements.vue";
import locationOfGoods from "./locationOfGoods.vue";
import compatibilityInfo from "./compatibilityInfo.vue";
import { formData } from "./index.js";
import rigthBox from "./formHeadRigthBox.vue";
import { useStore } from "vuex";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
import rightNav from "@pagesSystem/published/components/rightNav";
import {
  getEbayTemplateAssemblyCreate,
  getEbayTemplateCreate,
  getEbayTemplateChange,
  getEbayTemplateAssemblyChange,
  getEbayTemplateAssemblyInfo,
} from "@/api/published/ebay.js";
import { clearStore } from "@/utils/common";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  name: "eBayBoardEditModal",
  components: {
    basicInfo,
    salesInfo,
    logisticsPolicy,
    paymentPolicy,
    returnPolicy,
    buyerRequirements,
    locationOfGoods,
    compatibilityInfo,
    rigthBox,
    fullScreenDialog,
    rightNav,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    templateTitle: {
      type: String,
      default: () => {
        return "";
      },
    },
    itemTabs: {
      type: Array,
      default: () => {
        return [];
      },
    },
    activeNameIndex: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },

  setup(props, ctx) {
    const { proxy } = getCurrentInstance();
    const $store = useStore();
    const defaultSect = [
      {
        name: "eBay.basicInfo",
        componentName: "basicInfo",
        ref: "basicForm",
        sectionId: "eBay.basicInfo",
      },
      {
        name: "eBay.salesInfo",
        componentName: "salesInfo",
        ref: "salesForm",
        sectionId: "eBay.salesInfo",
      },
      {
        name: "eBay.logisticsPolicy",
        componentName: "logisticsPolicy",
        ref: "logisticsPolicyForm",
        sectionId: "eBay.logisticsPolicy",
        isShow: false,
        url: "shipping",
      },
      {
        name: "eBay.paymentPolicy",
        componentName: "paymentPolicy",
        ref: "paymentPolicyForm",
        sectionId: "eBay.paymentPolicy",
        isShow: false,
        url: "payment",
      },
      {
        name: "eBay.returnPolicy",
        componentName: "returnPolicy",
        ref: "returnPolicyForm",
        sectionId: "eBay.returnPolicy",
        isShow: false,
        url: "return",
      },
      {
        name: "eBay.buyerRequirements",
        componentName: "buyerRequirements",
        ref: "buyerRequirementsForm",
        sectionId: "eBay.buyerRequirements",
        isShow: false,
        url: "buyer",
      },
      {
        name: "eBay.locationOfGoods",
        componentName: "locationOfGoods",
        ref: "locationOfGoodsForm",
        sectionId: "eBay.locationOfGoods",
        isShow: false,
        url: "location",
      },
      {
        name: "eBay.accessoryCompatibility",
        componentName: "compatibilityInfo",
        ref: "compatibilityForm",
        sectionId: "eBay.accessoryCompatibility",
        isShow: false,
        titleBtn: true,
      },
    ];
    const data = reactive({
      proxyThis: proxy,
      newFormData: formData,
      compatibilityVisibles: false,
      importVisible: false,
      templateName: {
        basicInfo: "eBay.basicInfo",
        logisticsPolicy: "eBay.logisticsPolicy",
        paymentPolicy: "eBay.paymentPolicy",
        returnPolicy: "eBay.returnPolicy",
        buyerRequirements: "eBay.buyerRequirements",
        locationOfGoods: "eBay.locationOfGoods",
        salesInfo: "eBay.salesInfo",
        compatibilityInfo: "eBay.accessoryCompatibility",
      },
      stroeSiteId: "",
    });
    const listData = computed(() => {
      const val = $store.getters.getdynamicProperties.templateParams.listData;
      return defaultSect.filter((item) => {
        if (val?.findIndex((j) => j.sectionId === item.sectionId) !== -1) {
          return item;
        }
      });
    });
    const isShow = computed(() => {
      return $store?.getters?.getdynamicProperties?.templateParams?.isShow;
    });
    const queryEbayBaseSiteInfo = computed(() => {
      return $store?.getters?.getdynamicProperties?.templateParams
        ?.queryEbayBaseSiteInfo;
    });
    const listingCommonShopId = computed(() => {
      return $store?.getters?.getdynamicProperties?.templateParams
        ?.listingCommonShopId;
    });

    const getPromiseArr = () => {
      const formList = proxy.$refs;
      const promiseArr = [];

      Object.keys(formList).forEach((key) => {
        const targetRef = formList[key][0];
        const fn = targetRef.submitForm;
        if (fn) {
          promiseArr.push(fn());
        }
      });
      return promiseArr;
    };
    const handleOk = () => {
      let isSubmit = true;
      const promiseArr = getPromiseArr();
      submitInfo(isSubmit, promiseArr);
    };
    const submitInfo = (isSubmit, promiseArr) => {
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          const storeData = $store.getters.getParams
            ? $store.getters.getParams
            : false;

          if (storeData) {
            let postFormData = {};
            for (const key in storeData) {
              for (const j in storeData[key]) {
                postFormData[j] = storeData[key][j];
              }
            }
            if (
              $store.getters.getdynamicProperties?.templateParams?.eaditCell
            ) {
              const id =
                $store.getters.getdynamicProperties?.templateParams?.eaditCell
                  ?.id;
              if (isShow.value) {
                getEbayCurrencyTemplateEdit(id, postFormData);
              } else {
                getEbayAssemblyTemplateEdit(id, postFormData);
              }
              return false;
            }
            if (isShow.value) {
              getEbayCurrencyTemplate(postFormData);
            } else {
              getEbayAssemblyTemplate(postFormData);
            }
          }
        }
      });
    };
    // 组件模版创建接口调用
    const getEbayAssemblyTemplate = (postFormData) => {
      const params = {
        url: props.itemTabs[props.activeNameIndex].url,
        params: {
          ...postFormData,
        },
      };
      getEbayTemplateAssemblyCreate(params).then(() => {
        ctx.emit("setVisible", false);
        clearStore();
      });
    };
    // 通用模版创建接口调用
    const getEbayCurrencyTemplate = (postFormData) => {
      console.log(postFormData, "ps12");
      getEbayTemplateCreate(postFormData).then(() => {
        ctx.emit("setVisible", false);
        clearStore();
      });
    };
    // 组件模版编辑接口调用
    const getEbayAssemblyTemplateEdit = (id, val) => {
      const params = {
        url: props.itemTabs[props.activeNameIndex].url,
        params: {
          id,
          ...val,
        },
      };
      getEbayTemplateAssemblyChange(params).then((res) => {
        GjMessage.success(res.message);
        ctx.emit("setVisible", false);
        clearStore();
      });
    };
    // 通用模版编辑接口调用
    const getEbayCurrencyTemplateEdit = (id, postFormData) => {
      const params = {
        id,
        params: { ...postFormData },
      };
      getEbayTemplateChange(params).then((res) => {
        GjMessage.success(res.message);
        ctx.emit("setVisible", false);
        clearStore();
      });
    };
    const handleCancel = () => {
      ctx.emit("setVisible", false);
    };
    const getIsShow = (val) => {
      if (val.isShow !== undefined) {
        val.isShow = $store.getters.getdynamicProperties.templateParams.isShow;
      }
      return val.isShow;
    };

    // 标题上的按钮点击
    const changeInfo = (val) => {
      if (val === "addCompatibilityInfo") {
        proxy.$refs["compatibilityForm"][0]?.addCompatibility();
      } else if (val === "importFromEBay") {
        proxy.$refs["compatibilityForm"][0]?.importCompatibility();
      }
    };
    const getVisible = (val) => {
      data.compatibilityVisibles = val;
    };
    const getSaveTemplateInfo = (val, id) => {
      const formList = [proxy.$refs["basicForm"], proxy.$refs[val.ref]];
      const promiseArr = [];

      formList.forEach((key) => {
        const targetRef = key[0];
        const fn = targetRef.submitForm;
        if (fn) {
          promiseArr.push(fn());
        }
      });
      let isSubmit = true;
      Promise.all(promiseArr).then((res) => {
        isSubmit = res.every((item) => item);
        if (isSubmit) {
          const storeData = $store.getters.getParams
            ? $store.getters.getParams
            : false;

          if (storeData) {
            let postFormData = {};
            for (const key in storeData) {
              for (const j in storeData[key]) {
                postFormData[j] = storeData[key][j];
              }
            }
            const params = {
              url: val.url,
              params: {
                id,
                ...postFormData,
              },
            };
            getEbayTemplateAssemblyChange(params).then((res) => {
              GjMessage.success(res.message);
              clearStore();
            });
          }
        }
      });
    };
    const setStroeSiteId = (val) => {
      data.stroeSiteId = val;
    };
    return {
      ...toRefs(data),
      isShow,
      listData,
      setStroeSiteId,
      handleOk,
      handleCancel,
      getIsShow,
      changeInfo,
      getVisible,
      queryEbayBaseSiteInfo,
      listingCommonShopId,
      getEbayTemplateAssemblyInfo,
      getSaveTemplateInfo,
    };
  },
});
</script>
<style scoped lang="scss">
.detail-content {
  padding: 16px;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  .left-silder {
    padding-right: 24px;
    width: calc(100% - 0px);
  }
  .right-silder {
    padding-top: 16px;
    height: 500px;
    width: 100px;
    position: fixed;
    right: 24px;
    top: 80px;
    // background: rgb(119, 128, 119);
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
.formHeader {
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  color: #000;
  .row-bg {
    height: 32px;
  }

  .titleName {
    display: flex;
    align-items: center;
  }
  .text_rigth {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  :deep(.arco-btn-size-medium).btnModal {
    font-weight: normal;
    padding: 0px;
    font-size: 12px;
  }
}
</style>
