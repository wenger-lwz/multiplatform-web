<template>
  <div class="content-view">
    <gj-tabs
      :default-active-key="defalutActKey"
      :lazy-load="true"
      :destroy-on-hide="true"
      @change="changeTab"
    >
      <gj-tab-pane v-for="item in tabPane" :key="item.key" :title="item.title">
      </gj-tab-pane>
    </gj-tabs>
    <div class="tabs-content">
      <component :is="defalutActKey" :rowkey="activatedRow"></component>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import allReturnOrRefund from "./components/allReturnOrRefund.vue";
import pendingReturnOrRefund from "./components/pendingReturnOrRefund";
import processedReturnOrRefund from "./components/processedReturnOrRefund";

export default defineComponent({
  name: "AllocationRules",
  components: {
    allReturnOrRefund,
    pendingReturnOrRefund,
    processedReturnOrRefund,
  },
  setup() {
    const data = reactive({
      defalutActKey: "allReturnOrRefund",
      activatedRow: "ALL",
    });

    const tabPane = [
      {
        returnStatusCategory: "ALL",
        key: "allReturnOrRefund",
        title: "全部",
        cp: allReturnOrRefund,
      },
      {
        returnStatusCategory: "PROCESSED",
        key: "pendingReturnOrRefund",
        title: "待处理",
        cp: pendingReturnOrRefund,
      },
      {
        returnStatusCategory: "PENDING",
        key: "processedReturnOrRefund",
        title: "已处理",
        cp: processedReturnOrRefund,
      },
    ];

    const changeTab = (val) => {
      data.defalutActKey = val;
      data.activatedRow = "ALL";
      tabPane?.forEach((item) => {
        if (item.key === val) {
          data.activatedRow = item.returnStatusCategory;
        }
      });
    };
    return {
      tabPane,
      ...toRefs(data),
      changeTab,
    };
  },
});
</script>

<style scoped lang="scss">
.content-view {
  height: calc(100vh - 41px);
  :deep(.arco-tabs) {
    .arco-tabs-content {
      padding-top: 0px;
    }
  }
  .tabs-content {
    height: 100%;
  }
}
</style>
