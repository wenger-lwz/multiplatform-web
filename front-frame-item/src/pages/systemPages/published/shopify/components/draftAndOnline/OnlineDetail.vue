<template>
  <detail
    v-if="dialogVisible"
    ref="detailRef"
    :productId="productId"
    :type="type"
    :dialogVisible="dialogVisible"
    @cancel="cancel"
  >
    <template #footer>
      <template v-if="platformStatus === 1">
        <span
          class="footer-status"
          :class="{ 'no-storage': updateState === 1 }"
        >
          <gj-radio-group
            v-if="updateState === 2"
            type="button"
            v-model="status"
            @change="statusChange"
          >
            <gj-radio :value="1">在线</gj-radio>
            <gj-radio :value="2">暂存</gj-radio>
          </gj-radio-group>
          <span>
            <gj-button @click="cancel">取消</gj-button>
            <template v-if="status === 1">
              <gj-button
                :type="updateState === 2 ? 'primary' : 'outline'"
                :loading="saveStoreLoading"
                @click="handleSaveStore"
                >保存</gj-button
              >
              <gj-button
                v-if="updateState === 1"
                type="primary"
                :loading="updateOnlineGoodLoading"
                @click="updateOnlineGood"
                >更新</gj-button
              >
            </template>
            <template v-else>
              <gj-button
                type="outline"
                :loading="deleteStoreLoading"
                @click="deleteModalVisible = true"
                >删除</gj-button
              >
              <gj-button
                type="outline"
                :loading="saveStoreLoading"
                @click="handleSaveStore"
                >保存</gj-button
              >
              <gj-button
                type="primary"
                :loading="updateOnlineGoodLoading"
                @click="updateOnlineGood"
                >更新</gj-button
              >
            </template>
          </span>
        </span>
      </template>
      <template v-else>
        <gj-button
          type="outline"
          :loading="relistingLoading"
          @click="handleUpdateAndRelisting"
          >更新并重新上架</gj-button
        >
        <gj-button type="primary" :loading="syncLoading" @click="handleSyncGood"
          >同步</gj-button
        >
      </template>
    </template>
  </detail>
  <gj-modal
    title="删除"
    :visible="deleteModalVisible"
    :render-to-body="false"
    unmountOnClose
    @ok="handleDeleteStore"
    @cancel="deleteModalVisible = fasle"
    >此操作不可逆，是否删除？</gj-modal
  >
</template>
<script>
import { defineComponent, ref, reactive, toRefs } from "vue";
import { GjMessage } from "@gj/atom";
import Detail from "./Detail.vue";
import {
  getOnlineDetail,
  updateDetailGood,
  getOnlineStoreDetail,
  saveStorage,
  deleteOnlineStorage,
  updateAndRelisting,
  syncGoods,
} from "@/api/published/shopify";

export default defineComponent({
  name: "OnlineDetail",
  components: {
    Detail,
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
      type: Number,
      required: true,
    },
  },
  emits: ["cancel", "update-handler"],
  setup(props, { emit }) {
    const detailRef = ref(null);
    const status = ref(1);
    const updateState = ref(1);
    const data = reactive({
      updateOnlineGoodLoading: false,
      saveStoreLoading: false,
      deleteStoreLoading: false,
      deleteModalVisible: false,
      relistingLoading: false,
      syncLoading: false,
    });

    if (props.productId) {
      getPlatOnlineDetail();
    }

    function getPlatOnlineDetail() {
      getOnlineDetail({
        id: props.productId,
        platformStatus: props.platformStatus,
      }).then((res) => {
        updateState.value = res.data.updateState;
        detailRef.value.initData(res);
      });
    }

    function getStoreDetail() {
      getOnlineStoreDetail({
        listingId: props.productId,
      }).then((res) => {
        detailRef.value.initData(res);
      });
    }

    const statusChange = (status) => {
      if (status === 1) {
        getPlatOnlineDetail();
      } else {
        getStoreDetail();
      }
    };

    const cancel = () => {
      emit("cancel");
    };

    const updateOnlineGood = async () => {
      let isSubmit = true;
      const result = await Promise.all(
        detailRef.value.getPromiseArr("submitForm")
      );
      isSubmit = result?.every((item) => item);
      if (isSubmit) {
        data.updateOnlineGoodLoading = true;
        const params = detailRef.value.getParams();
        params.listingId = props.productId;
        updateDetailGood(params)
          .then(() => {
            emit("update-handler");
            GjMessage.success("更新任务已提交，请稍后查看！");
          })
          .finally(() => {
            data.updateOnlineGoodLoading = false;
          });
      }
    };

    const handleSaveStore = async () => {
      let isSubmit = true;
      const result = await Promise.all(
        detailRef.value.getPromiseArr("submitForm")
      );
      isSubmit = result?.every((item) => item);
      if (isSubmit) {
        data.saveStoreLoading = true;
        const params = detailRef.value.getParams();
        params.listingId = props.productId;
        saveStorage(params)
          .then(() => {
            emit("update-handler");
            GjMessage.success("保存成功");
          })
          .finally(() => {
            data.saveStoreLoading = false;
          });
      }
    };

    const handleDeleteStore = async () => {
      data.deleteStoreLoading = true;
      const params = {
        listingIds: [props.productId],
      };
      deleteOnlineStorage(params)
        .then(() => {
          emit("update-handler");
          GjMessage.success("删除成功1个暂存！");
        })
        .finally(() => {
          data.deleteStoreLoading = false;
        });
    };

    const handleUpdateAndRelisting = async () => {
      let isSubmit = true;
      const result = await Promise.all(
        detailRef.value.getPromiseArr("submitForm")
      );
      isSubmit = result?.every((item) => item);
      if (isSubmit) {
        data.relistingLoading = true;
        const params = detailRef.value.getParams();
        params.id = props.productId;
        params.platformStatus = 3;
        updateAndRelisting(params)
          .then(() => {
            emit("update-handler");
            GjMessage.success("更新任务已提交，请稍后查看！");
          })
          .finally(() => {
            data.relistingLoading = false;
          });
      }
    };

    const handleSyncGood = () => {
      data.syncLoading = true;
      const params = {
        platformStatus: 3,
        listingIds: props.productId,
      };
      syncGoods(params)
        .then(() => {
          GjMessage.success("同步任务已提交，请稍后查看！");
        })
        .catch(() => {
          GjMessage.error("同步任务提交失败，请重试！");
        })
        .finally(() => {
          data.syncLoading = false;
        });
    };

    return {
      ...toRefs(data),
      updateState,
      detailRef,
      status,
      cancel,
      updateOnlineGood,
      statusChange,
      handleSaveStore,
      handleDeleteStore,
      handleUpdateAndRelisting,
      handleSyncGood,
    };
  },
});
</script>
<style lang="scss" scoped>
.footer-status {
  display: flex;
  justify-content: space-between;
}
.no-storage {
  justify-content: flex-end;
}
</style>
