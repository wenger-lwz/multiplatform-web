<template>
  <gj-modal
    :visible="visible"
    modal-class="materialCenter-modal"
    title="素材中心-纯文本"
    width="67.5%"
    :render-to-body="false"
    :unmount-on-close="true"
    :mask-closable="false"
    :footer="false"
    @cancel="close"
  >
    <TextCount @close="close" @confirm="confirm"></TextCount>
  </gj-modal>
</template>

<script>
import { defineComponent } from "vue";
import TextCount from "./component/text-content.vue";

export default defineComponent({
  components: {
    TextCount,
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
