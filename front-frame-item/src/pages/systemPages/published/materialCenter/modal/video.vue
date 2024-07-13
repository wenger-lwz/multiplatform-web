<template>
  <gj-modal
    :visible="visible"
    modal-class="materialCenter-modal"
    title="添加视频"
    width="93vw"
    :render-to-body="false"
    :unmount-on-close="true"
    :mask-closable="false"
    :footer="false"
    @cancel="close"
  >
    <!-- <div class="modalVideo-header">
      <div class="modalVideo-header-title">添加视频</div>
      <gj-button type="outline" shape="round" @click="close">关闭</gj-button>
    </div> -->
    <div
      :class="[
        'modal-content',
        showPictureManagementFooter && 'modal-content_fh',
      ]"
    >
      <gj-tabs default-active-key="1" :lazy-load="true" @change="tabsChange">
        <gj-tab-pane class="modal-content-videoUpload" key="1" title="本地上传">
          <videoUpload
            :platform="platform"
            :shopId="shopId"
            :showTreeSelect="showTreeSelect"
            :sku="sku"
            :skutype="skutype"
            @cancel="close"
            @confirm="confirm"
          ></videoUpload>
        </gj-tab-pane>
        <gj-tab-pane v-if="showVideoLibrary" key="2" title="视频库">
          <videoLibrary
            :platform="platform"
            @select="selectVideo"
          ></videoLibrary>
        </gj-tab-pane>
        <gj-tab-pane key="3" title="素材中心">
          <videoManagement
            :defaultView="false"
            @select="selectVideo"
          ></videoManagement>
        </gj-tab-pane>
      </gj-tabs>
      <div
        v-show="showPictureManagementFooter"
        class="pictureManagement-footer"
      >
        <gj-button type="plain" @click="close">取消</gj-button>
        <gj-button type="primary" @click="confirm(selectList)">确认</gj-button>
      </div>
    </div>
  </gj-modal>
</template>

<script>
import { reactive, toRefs } from "vue";
import videoUpload from "../component/videoUpload.vue";
import videoManagement from "../videoManagement/videoManagement.vue";
import videoLibrary from "./component/videoLibrary.vue";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 是否显示视频库tab页
    showVideoLibrary: {
      type: Boolean,
      default: true,
    },
    // 平台名称
    platform: {
      type: String,
      default: "",
    },
    // 店铺id
    shopId: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      default: "",
    },
    skutype: {
      type: String,
      default: "",
    },
    // 是否显示目录树
    showTreeSelect: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    videoUpload,
    videoManagement,
    videoLibrary,
  },
  emits: ["update:visible", "close", "confirm"],
  setup(props, { emit }) {
    const data = reactive({
      showPictureManagementFooter: false,
      // 视频库tab页和素材中心tab页下列表的和
      selectList: [],
      // 视频库tab 页下选中的列表
      videoLibraryList: [],
      // 素材中心tab 页下选中的列表
      videoManagementList: [],
    });
    const tabsChange = (val) => {
      if (val === "1") {
        data.showPictureManagementFooter = false;
      } else {
        data.showPictureManagementFooter = true;
      }
    };
    const selectVideo = (key, list) => {
      data[key] = list;
      data.selectList = [...data.videoLibraryList, ...data.videoManagementList];
    };
    // 关闭 取消按钮
    const close = () => {
      data.showPictureManagementFooter = false;
      emit("update:visible", false);
      emit("close", false);
    };
    // 确认按钮
    const confirm = (list) => {
      if (list) {
        data.showPictureManagementFooter = false;
        emit("confirm", list);
      } else {
        close();
      }
      data.selectList = [];
      data.videoLibraryList = [];
      data.videoManagementList = [];
    };
    return {
      ...toRefs(data),
      tabsChange,
      selectVideo,
      close,
      confirm,
    };
  },
};
</script>

<style scoped lang="scss">
.modalVideo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f2f2f5;
  &-title {
    font-weight: bold;
  }
}
.modal-content {
  height: calc(100vh - 145px);
}
::v-deep .modal-content-videoUpload .arco-form-item {
  padding: 0 12px;
  box-sizing: border-box;
}
.modal-content_fh {
  > .arco-tabs {
    height: calc(100% - 49px);
  }
}
::v-deep .arco-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}
::v-deep .arco-tabs-content {
  flex: 1;
  padding-top: 0;
}
::v-deep .arco-tabs-content-list,
::v-deep .arco-tabs-pane,
::v-deep .arco-form {
  height: 100%;
  .arco-form-item:last-child {
    margin-bottom: 0;
    .form-footer-content {
      padding: 8px 16px;
    }
  }
}
::v-deep .form-footer {
  padding: 0 !important;
  border: 0;
  flex: 1;
  .arco-form-item-label-col {
    display: none;
  }
  .arco-form-item-wrapper-col,
  .arco-form-item-content-wrapper,
  .arco-form-item-content {
    height: 100%;
  }
  .arco-form-item-content {
    display: flex;
    align-items: flex-end;
    .form-footer-content {
      padding-top: 8px;
      border-top: 1px solid #e6e6ed;
    }
  }
}
.pictureManagement-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid #e6e6ed;
  .arco-btn + .arco-btn {
    margin-left: 10px;
  }
}
</style>
