<template>
  <div class="tip">
    <div>刊登队列</div>
    <div class="uploading">上传中：{{ statusData.succussNumber || 0 }}</div>
    <div class="failed">失败：{{ statusData.failedNumber || 0 }}</div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onBeforeMount } from "vue";

export default defineComponent({
  name: "QueueStatusTip",
  props: {
    statusData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const data = reactive({
      statueObject: props.statusData,
    });

    onBeforeMount(() => {});
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style scoped lang="scss">
.tip {
  display: flex;
  align-items: center;
  width: 270px;
  height: 32px;
  background: #1c2c49;
  border-radius: 2px;
  font-size: 13px;
  color: #ffffff;

  div {
    height: 18px;
    margin-left: 16px;
  }

  .uploading {
    width: 82px;
    font-size: 12px;
    text-align: right;
    // background: url(~@/svg/circularProgressBar.svg) no-repeat left;
    background-size: 18px 18px;
  }

  .failed {
    width: 73px;
    font-size: 12px;
    text-align: right;
    // background: url(~@/svg/warning.svg) no-repeat left;
    background-size: 18px 18px;
  }
}
</style>
