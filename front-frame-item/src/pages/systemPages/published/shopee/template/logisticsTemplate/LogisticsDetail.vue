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
            <div id="LogisticsInfo" ref="LogisticsInfo">
              <LogisticsInfo ref="logisticsInfo" @clear-data="clearData" />
            </div>
          </div>
        </div>
      </gj-spin>
    </template>

    <template #footer>
      <span class="dialog-footer">
        {{ data?.tabType }}
        <gj-button @click="cancel">取消</gj-button>

        <gj-button type="primary" :loading="saveLoading" @click="handlerOnSave"
          >保存</gj-button
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
  getLogisticDetail,
  getGlobalStoageDetail,
  createLogisticList,
  editLogisticList,
} from "@/api/published/shopee";
import { siteList } from "@pagesSystem/published/shopee/config";

const LogisticsInfo = defineAsyncComponent(() => import("./LogisticsInfo.vue"));
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";

export default defineComponent({
  name: "LogisticsDetail",
  components: {
    LogisticsInfo,
    fullScreenDialog,
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

    const logisticsInfo = ref(null);
    const relatedSkus = ref([]);
    const repairServicerules = [
      { id: "warrantyType", message: "保修类型必填" },
    ];

    const store = useStore();

    const pageTitle = computed(() => {
      return props.dialogType == 1 ? "创建模板" : "编辑模板";
    });

    const refSetData = (respData) => {
      const formList = proxy.$refs;
      Object.keys(formList).forEach((key) => {
        const targetRef = formList[key];
        const fn = targetRef?.setPageData;
        fn && fn(respData);
      });
    };

    const onResponeCb = (res) => {
      if (res.code === 0) {
        const respData = res.data;
        if (respData.platformCategoryId) {
          // 说明有显示其他的模块
          store.commit(M_T.PARAMS_QUERY, {
            productInfo: {
              shopeeType: respData.platformCategoryId,
            },
          });
        }
        if (props.dialogType == 2) {
          refSetData(respData);
        }
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
      const res = await getLogisticDetail({ id: props.pids });
      onResponeCb(res);
    };

    const getListingDetailStorageReq = async () => {
      data.loading = true;
      const res = await getGlobalStoageDetail({ id: props.pids });
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

      if (props.dialogType == 1) {
        console.log(logisticsInfo, "logisticsInfo");
        logisticsInfo.value?.clearData();
      }
    });

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
      let logisticObj = {};
      logisticObj = {
        shopId: storeData.logisticsInfo?.shopId,
        shopName: storeData.logisticsInfo?.shopName,
        templateName: storeData.logisticsInfo?.templateName,
      };
      let logisticList = [];
      if (
        storeData.logisticsInfo?.tableSelectList &&
        storeData.logisticsInfo?.tableSelectList.length > 0
      ) {
        logisticList = storeData.logisticsInfo?.tableSelectList.map((item) => {
          return {
            enabled: item.enabled,
            free: item.enabled,
            logisticId: item.logistics_channel_id,
            logisticName: item.logistics_channel_name,
            shippingFee: 0,
          };
        });
      }

      return {
        ...logisticObj,
        logisticList: logisticList,
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
          if (props.dialogType == 1) {
            console.log(params, "创建11111");
            createLogisticList({ shopeeLogisticTemplate: params })
              .then(() => {
                GjMessage.success("组件模板创建成功！");
                emit("update-handler");
              })
              .finally(() => {
                data.saveLoading = false;
                data.saveModelVisible = false;
              });
          } else {
            // 修改保存物流模板
            console.log(params, "编辑2222");
            params.id = props.pids;
            editLogisticList({ shopeeLogisticTemplate: params })
              .then(() => {
                GjMessage.success("组件模板保存成功！");
                emit("update-handler");
              })
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

    return {
      ...toRefs(data),
      siteList,
      relatedSkus,
      repairServicerules,
      pageTitle,
      clearData,
      cancel,
      handlerOnSave,
      logisticsInfo,
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
