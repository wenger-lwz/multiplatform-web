<template>
  <fullScreenDialog :dialogVisible="isVisible" :showFooter="false">
    <template #title>
      <div class="dialog-title">
        <span>详情页</span>
        <gj-button @click="handleCancel">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="detail-content">
        <div class="left-silder"></div>
      </div>
    </template>
  </fullScreenDialog>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
export default defineComponent({
  name: "eBayBoardDetail",
  components: {
    fullScreenDialog,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  setup(props, ctx) {
    const data = reactive({});
    const handleCancel = () => {
      ctx.emit("setVisible", false);
    };
    return {
      ...toRefs(data),
      handleCancel,
    };
  },
});
</script>
<style scoped lang="scss">
.detail-content {
  padding: 0px 24px 16px 8px;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  .left-silder {
    padding-right: 24px;
    width: calc(100% - 0px);
  }
  .right-silder {
    padding-top: 16px;
    height: 500px;
    width: 100px;
    position: fixed;
    right: 24px;
    top: 80px;
    background: rgb(119, 128, 119);
    .arco-anchor {
      width: 100%;
    }
  }
}
</style>
