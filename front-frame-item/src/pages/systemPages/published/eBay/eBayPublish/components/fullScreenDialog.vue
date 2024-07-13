<template>
  <div class="full-dialog">
    <gj-modal
      width="100%"
      modal-class="app-full-screen-dialog"
      :visible="visible"
      :render-to-body="false"
      :closable="false"
      :unmount-on-close="true"
      :mask-closable="false"
      :footer="showFooter"
      @cancel="cancel"
      @open="open"
    >
      <template #title>
        <slot name="title"></slot>
      </template>
      <template #default>
        <slot name="content"></slot>
      </template>
      <template #footer>
        <slot name="footer"></slot>
      </template>
    </gj-modal>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from "vue";

export default defineComponent({
  emits: ["cancel", "open"],
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    showFooter: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      visible: props.dialogVisible,
    });

    const cancel = () => {
      emit("cancel");
    };
    const open = () => {
      emit("open");
    };
    watch(
      () => props.dialogVisible,
      () => {
        data.visible = props.dialogVisible;
      }
    );

    return {
      ...toRefs(data),
      cancel,
      open,
    };
  },
});
</script>
<style lang="scss" scoped>
.full-dialog {
  :deep(.app-full-screen-dialog) {
    height: 100vh;
    position: relative;
    .arco-modal-header {
      padding: 0 16px 0 24px;
      .dialog-title {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
    .arco-modal-body {
      padding: 0;
      overflow-x: hidden;
      overflow-y: auto;
      height: calc(100vh - 113px);
    }

    .arco-modal-footer {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      background: #fff;
    }
  }
}
</style>
