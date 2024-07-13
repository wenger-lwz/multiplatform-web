<template>
  <detail
    v-if="dialogVisible"
    ref="detailRef"
    :type="type"
    :productId="productId"
    :dialogVisible="dialogVisible"
    @cancel="cancel"
  >
    <template #footer>
      <gj-button @click="cancel">取消</gj-button>
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
    </template>
  </detail>
  <timing-modal
    v-if="timingModalVisible"
    :shopId="computedShopId"
    :timeRow="timeRow"
    :visible="timingModalVisible"
    @handleOk="timingModalOk"
    @handleCancel="timingModalCancel"
  />
</template>
<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  computed,
  nextTick,
} from "vue";
import { GjMessage } from "@gj/atom";
import { useStore } from "vuex";
import Detail from "./Detail.vue";
import TimingModal from "../TimeModal.vue";
import {
  getOnlineDetail,
  getDraftDetails,
  createDraft,
  editDraft,
  publishDraft,
  publishDetailDraft,
} from "@/api/published/shopify";

export default defineComponent({
  name: "DraftDetail",
  components: {
    Detail,
    TimingModal,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    type: {
      type: Number,
      required: true,
    },
    productId: {
      type: [String, undefined],
      default: "",
    },
    platformStatus: {
      type: [String, undefined],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["cancel", "update-handler", "update-completed-status"],
  setup(props, { emit }) {
    const $store = useStore();
    const detailRef = ref(null);
    const data = reactive({
      saveLoading: false,
      releaseLoading: false,
      releaseTimeLoading: false,
      timingModalVisible: false,
      timeRow: [],
    });

    const computedShopId = computed(
      () => $store.getters.getParams?.shopifyBasicInfo?.shopItem?.shopId
    );

    if (!props.isCompleted && props.platformStatus) {
      getOnlineDetail({
        id: props.productId,
        platformStatus: +props.platformStatus,
      })
        .then((res) => {
          detailRef.value.initData(res);
        })
        .finally(() => {
          emit("update-completed-status");
        });
    } else if (props.productId) {
      getDraftDetails({
        id: props.productId,
      }).then((res) => {
        nextTick(() => {
          detailRef.value.initData(res);
        });
      });
    }

    const cancel = () => {
      emit("cancel");
    };

    const save = () => {
      data.saveLoading = true;
      let isSubmit = true;
      const promiseArr = detailRef.value.getPromiseArr("saveForm");
      Promise.all(promiseArr)
        .then((res) => {
          isSubmit = res.every((item) => item);
          if (isSubmit) {
            const params = detailRef.value.getParams();
            if (props.type === 1) {
              createDraft(params)
                .then(() => {
                  GjMessage.success("创建草稿成功！");
                  emit("update-handler");
                })
                .finally(() => {
                  data.saveLoading = false;
                });
            } else {
              editDraft({
                ...params,
                id: props.productId,
              })
                .then(() => {
                  GjMessage.success("草稿保存成功！");
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

    const release = async () => {
      let isSubmit = true;
      data.releaseLoading = true;
      const result = await Promise.all(
        detailRef.value.getPromiseArr("submitForm")
      );
      isSubmit = result?.every((item) => item);
      if (isSubmit) {
        const params = detailRef.value.getParams();
        params.id = props.productId;
        const timeParams = {
          enableTime: true,
          publishMode: 1,
        };

        const p = {
          ...timeParams,
          shopifyDraftReleaseByInfo: params,
        };
        // console.log("p", p);
        publishDetailDraft(p)
          .then(() => {
            emit("update-handler");
            data.releaseLoading = false;
            GjMessage.success("发布成功！");
          })
          .catch(() => {
            data.releaseLoading = false;
          });
      } else {
        data.releaseLoading = false;
      }
    };

    // 定时发布
    const releaseOnTime = async () => {
      let isSubmit = true;
      data.releaseTimeLoading = true;
      const result = await Promise.all(
        detailRef.value.getPromiseArr("submitForm")
      );
      isSubmit = result?.every((item) => item);
      if (isSubmit) {
        const params = detailRef.value.getParams();

        const releaseOnTimeCb = (res) => {
          if (res.code !== 0) {
            data.releaseLoading = false;
            return GjMessage.success("定时发布任务提交失败，请重试！");
          }
          data.timeRow = [
            {
              id: res.data,
            },
          ];
          data.timingModalVisible = true;
        };

        if (props.type === 1) {
          createDraft(params)
            .then((res) => {
              releaseOnTimeCb(res);
            })
            .finally(() => {
              data.releaseTimeLoading = false;
            });
        } else {
          editDraft({
            ...params,
            id: props.productId,
          })
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

    const timingModalOk = (form) => {
      const params = {
        enableTime: form.enable,
        ids: [data.timeRow[0].id],
        publishTime: form.publishTime,
        publishMode: 2,
        zone: form.timezone,
      };
      data.timingModalVisible = false;
      publishDraft(params).then(() => {
        GjMessage.success("定时发布任务已提交，请稍后查看");
        data.timingModalVisible = false;
        emit("update-handler");
      });
    };

    const timingModalCancel = () => {
      data.timingModalVisible = false;
    };

    return {
      ...toRefs(data),
      // add
      detailRef,
      computedShopId,
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
