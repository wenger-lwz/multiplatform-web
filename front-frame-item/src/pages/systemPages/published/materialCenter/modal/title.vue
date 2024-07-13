<template>
  <gj-modal
    :visible="visible"
    modal-class="materialCenter-modal"
    title="素材中心-标题"
    width="67.5%"
    :render-to-body="false"
    :unmount-on-close="true"
    :mask-closable="false"
    :footer="false"
    @cancel="close"
  >
    <TitleCount @close="close" @confirm="confirm"></TitleCount>
  </gj-modal>
</template>

<script>
import { defineComponent } from "vue";
import TitleCount from "./component/title-content.vue";

export default defineComponent({
  components: {
    TitleCount,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:visible", "close", "confirm"],
  setup(props, { emit }) {
    // 取消关闭
    const close = () => {
      emit("update:visible", false);
    };
    // 确认
    const confirm = (list) => {
      if (list) {
        emit("confirm", list);
      } else {
        emit("close");
      }
    };

    return {
      close,
      confirm,
    };
  },
});
</script>

<style scoped lang="scss">
.pictureImgList {
  height: 83vh;
  display: flex;
  flex-direction: column;
  text-align: left;
}
.gj-search-list {
  padding: 8px 12px;
  border-bottom: 1px solid #f2f2f5;
  .search-list-item + .search-list-item {
    margin-left: 8px;
  }
}
.arco-layout {
  overflow: hidden;
}
.arco-list-wrapper {
  height: 100%;
}
.arco-spin {
  display: block;
  text-align: center;
}
::v-deep .arco-list-bordered {
  border: 0;
  max-height: 100%;
  .arco-list-item {
    border: 0;
    padding: 0;
  }
}
.arco-btn + .arco-btn {
  margin-left: 10px;
}
::v-deep .arco-tree-node-title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.arco-divider-horizontal.arco-divider-with-text {
  margin: 0;
}
.arco-layout-sider-light {
  box-sizing: border-box;
  box-shadow: none;
  border-right: 1px solid #f2f2f5;
}
.arco-layout-content {
  padding: 17px 12px;
}
.pictureList-item-sku {
  > div:first-child {
    // font-size: 12px;
    line-height: 16px;
    color: #000430;
    font-weight: 600;
    > span:nth-child(2) {
      padding-left: 8px;
      color: #808197;
    }
  }
}
// ::v-deep .upload-list-item .picture-mask .mask-icon > div {
// width: 90px;
// }
</style>
