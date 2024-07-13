<template>
  <div class="modal_content_body_table" ref="modalContentBodyTable">
    <slot name="table"> </slot>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  nextTick,
  onDeactivated,
  onBeforeUnmount,
  onActivated,
} from "vue";

import { debounce } from "@/utils/common";

export default defineComponent({
  emits: ["getTableHeight"],
  setup(props, { emit }) {
    const modalContentBodyTable = ref(null);

    const setTableHeight = () => {
      nextTick(() => {
        let fHeight =
          (modalContentBodyTable.value?.clientHeight ||
            document.querySelector(".modal_content_body_table")?.clientHeight ||
            0) - 60;
        if (fHeight <= 0) {
          fHeight = 200;
        }
        emit("getTableHeight", fHeight);
      });
    };

    onMounted(() => {
      window.addEventListener("resize", debounce(setTableHeight, 300));
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", debounce(setTableHeight, 300));
    });
    onActivated(() => {
      window.removeEventListener("resize", debounce(setTableHeight, 300));
    });
    onDeactivated(() => {
      window.removeEventListener("resize", debounce(setTableHeight, 300));
    });

    return {
      modalContentBodyTable,
      setTableHeight,
    };
  },
});
</script>

<style scoped lang="scss">
.modal_content_body_table {
  height: 100%;
  width: 100%;
}
</style>
