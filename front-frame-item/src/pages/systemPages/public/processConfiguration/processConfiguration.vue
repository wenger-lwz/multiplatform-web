<template>
  <!-- 流程图 -->
  <div class="flowPath wrapper">
    <!-- 流程主体 -->
    <qfBranch :list="processList"></qfBranch>
    <!-- 流程结束 -->
    <div class="qf-end-node">
      <div class="end-node">结束</div>
    </div>
  </div>
  <!-- 节点编辑对话框 -->
  <el-drawer
    :model-value="editDialogVisible === 'drawer'"
    direction="rtl"
    custom-class="flowPath-drawer"
    :with-header="false"
    :before-close="beforeClose"
  >
    <nodeEdit></nodeEdit>
  </el-drawer>
  <!-- 分支节点编辑对话框 -->
  <el-dialog
    :model-value="editDialogVisible === 'dialog'"
    title="筛选条件"
    width="1000px"
    custom-class="branchEdit-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="beforeClose"
  >
    <branchEdit></branchEdit>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import qfBranch from "./qf-branch.vue";
import nodeEdit from "./nodeEdit.vue";
import branchEdit from "./branchEdit.vue";
// import newPopup from './newPopup'

export default defineComponent({
  components: {
    qfBranch,
    nodeEdit,
    branchEdit,
    // newPopup,
  },
  setup() {
    const store = useStore();
    // console.log(store.state.processConfiguration)
    // 获取流程数据 数据映射
    store.dispatch("getProcessData");

    const beforeClose = () => {
      store.commit("EDIT_CLOS");
    };
    const poupVisible = ref(false);
    const closePopup = () => {
      poupVisible.value = false;
    };
    const popup = ref(null);
    const openDialog3 = (e) => {
      poupVisible.value = !poupVisible.value;
      if (poupVisible.value) {
        popup.value.show(e);
      }
    };

    return {
      processList: computed(() => store.state.processConfiguration.processList),
      editDialogVisible: computed(
        () => store.state.processConfiguration.editDialogVisible
      ),
      beforeClose,
      poupVisible,
      popup,
      closePopup,
      openDialog3,
    };
  },
});
</script>

<style lang="scss">
.flowPath-drawer {
  min-width: 720px;
  > .el-drawer__body {
    padding: 0;
  }
}
.branchEdit-dialog {
  .el-dialog__header {
    padding: 11px 16px;
    border-bottom: 1px solid #e4e7ed;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: LEFT;
    color: #000000;
    line-height: 22px;
  }
  .el-dialog__body {
    padding: 16px 24px;
  }
}
</style>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-width: min-content;
  min-height: 900px;
  padding: 20px;
  text-align: center;
  background-color: #f2f6fe;
  .qf-end-node {
    display: flex;
    align-items: center;
    justify-content: center;
    .end-node {
      width: 50px;
      height: 50px;
      line-height: 50px;
      background: linear-gradient(
        90deg,
        #1f6eef 0%,
        rgba(31, 139, 239, 0.67) 100%,
        #65c8ff 100%
      );
      box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.06);
      border-radius: 100%;
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      color: #fff;
    }
  }
}
</style>
