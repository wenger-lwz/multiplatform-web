<template>
  <gj-popconfirm
    trigger="click"
    v-bind="$attrs"
    content-class="confirm-content"
    :ok-button-props="okBtnProps"
    :cancel-button-props="cancelBtnProps"
    @ok="sendOk"
    @cancel="sendCancel"
  >
    <!-- <template #icon>
      <span></span>
    </template> -->
    <template #content>
      <slot name="content"></slot>
    </template>
    <slot></slot>
  </gj-popconfirm>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  name: "commonPopconfirm",
  emits: ["ok", "cancel"],
  props: {
    okButtonProps: {
      type: Object,
      default: () => {
        return {
          shape: "square",
          size: "mini",
        };
      },
    },
    cancelButtonProps: {
      type: Object,
      default: () => {
        return {
          shape: "square",
          size: "mini",
        };
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      okBtnProps: {
        shape: "square",
        size: "mini",
        ...props.okButtonProps,
      },
      cancelBtnProps: {
        shape: "square",
        size: "mini",
        ...props.cancelButtonProps,
      },
    });

    const sendOk = () => {
      emit("ok");
    };
    const sendCancel = () => {
      emit("cancel");
    };
    return {
      ...toRefs(data),
      sendOk,
      sendCancel,
    };
  },
});
</script>
<style lang="scss">
.arco-popconfirm-popup-content {
  &.confirm-content {
    padding-bottom: 12px !important;
  }
}
</style>
