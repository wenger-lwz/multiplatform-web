<template>
  <gj-modal
    :visible="visible"
    modal-class="materialCenter-modal"
    title="添加图片"
    width="93vw"
    :render-to-body="false"
    :unmount-on-close="true"
    :mask-closable="false"
    :footer="false"
    @cancel="close"
  >
    <!-- <div class="modalPictureVideo-header">
      <div class="modalPictureVideo-header-title">添加图片</div>
      <gj-button type="outline" shape="round" @click="close">关闭</gj-button>
    </div> -->
    <gj-tabs
      class="modal-content"
      default-active-key="1"
      :lazy-load="true"
      @change="tabsChange"
    >
      <gj-tab-pane key="1" title="本地上传">
        <imgUpload
          :showTreeSelect="showTreeSelect"
          :sku="sku"
          :skutype="skutype"
          :imgExceeding="imgExceeding"
          :isLimitRatio="isLimitRatio"
          :minWidth="minWidth"
          :minHeight="minHeight"
          :maxWidth="maxWidth"
          :maxHeight="maxHeight"
          @confirm="confirm"
        ></imgUpload>
      </gj-tab-pane>
      <gj-tab-pane key="2" title="素材中心">
        <pictureManagement
          :tabsRadioGroup="true"
          @select="pictureManagementSelect"
        ></pictureManagement>
      </gj-tab-pane>
    </gj-tabs>
    <div v-show="showPictureManagementFooter" class="pictureManagement-footer">
      <gj-button type="plain" @click="close">取消</gj-button>
      <gj-button type="primary" @click="confirm(selectList)">确认</gj-button>
    </div>
  </gj-modal>
</template>

<script>
import { reactive, toRefs } from "vue";
import imgUpload from "../component/imgUpload.vue";
import pictureManagement from "../pictureManagement/pictureManagement.vue";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 是否显示目录树
    showTreeSelect: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
      default: "",
    },
    skutype: {
      type: String,
      default: "",
    },
    imgExceeding: {
      type: Number,
      default: 2,
    },
    isLimitRatio: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    minWidth: {
      type: Number,
      default: () => {
        return 800;
      },
    },
    minHeight: {
      type: Number,
      default: () => {
        return 800;
      },
    },
    maxWidth: {
      type: Number,
      default: () => {
        return 800;
      },
    },
    maxHeight: {
      type: Number,
      default: () => {
        return 800;
      },
    },
  },
  components: {
    imgUpload,
    pictureManagement,
  },
  emits: ["update:visible", "close", "confirm"],
  setup(props, { emit }) {
    const data = reactive({
      showPictureManagementFooter: false,
      selectList: [],
    });

    const tabsChange = (val) => {
      if (val === "2") {
        data.showPictureManagementFooter = true;
      } else {
        data.showPictureManagementFooter = false;
      }
    };
    const pictureManagementSelect = (list) => {
      data.selectList = [...list];
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
    };

    return {
      ...toRefs(data),
      close,
      confirm,
      tabsChange,
      pictureManagementSelect,
    };
  },
};
</script>
<style lang="scss">
.modal-content #multiplatform-app_pictureManagement {
  height: calc(100% - 32px);
  padding: 0 12px;
  .pictureImgList .arco-layout-content {
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
<style scoped lang="scss">
.modalPictureVideo-header {
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
  display: flex;
  flex-direction: column;
  height: calc(100vh - 145px);
}

::v-deep .arco-tabs-content {
  flex: 1;
}
::v-deep .arco-tabs-content-list,
::v-deep .arco-tabs-pane {
  height: 100%;
}
.pictureManagement-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid #e6e6ed;
  .arco-btn {
    margin-right: 12px;
  }
}
</style>
