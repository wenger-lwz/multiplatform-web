<template>
  <gj-modal
    :visible="cancelVisible"
    unmount-on-close
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>
      <span>{{ modelObj.modelTitle }}</span>
    </template>
    <div>{{ modelObj.modelText }}</div>
  </gj-modal>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  emits: ["cancelHandleOk", "cancelHandleOff"],
  components: {},
  props: {
    cancelVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    modelObj: {
      type: Object,
      default: () => {
        return {
          modelTitle: "提示",
          modelText: "【切换分类后会清空下方编辑区域的所有信息，是否继续】",
        };
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({});
    const handleCancel = () => {
      emit("cancelHandleOff");
    };
    const handleOk = () => {
      emit("cancelHandleOk");
    };
    return {
      ...toRefs(data),
      handleCancel,
      handleOk,
    };
  },
});
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
</style>
