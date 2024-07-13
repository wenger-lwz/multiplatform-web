<template>
  <div class="content-view">
    <gj-tabs
      :default-active-key="defalutActKey"
      lazy-load
      destroy-on-hide
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
import allBuyerBargaining from "./components/allBuyerBargaining";
import pendingBuyerBargaining from "./components/pendingBuyerBargaining";
import processedBuyerBargaining from "./components/processedBuyerBargaining";

export default defineComponent({
  name: "AllocationRules",
  components: {
    allBuyerBargaining,
    pendingBuyerBargaining,
    processedBuyerBargaining,
  },
  setup() {
    const data = reactive({
      defalutActKey: "allBuyerBargaining",
      activatedRow: 0,
    });

    const tabPane = [
      {
        bestOfferHanlerStatus: 0,
        key: "allBuyerBargaining",
        title: "全部",
        cp: allBuyerBargaining,
      },
      {
        bestOfferHanlerStatus: 1,
        key: "pendingBuyerBargaining",
        title: "待处理",
        cp: pendingBuyerBargaining,
      },
      {
        bestOfferHanlerStatus: 2,
        key: "processedBuyerBargaining",
        title: "已处理",
        cp: processedBuyerBargaining,
      },
    ];

    const changeTab = (val) => {
      data.defalutActKey = val;
      data.activatedRow = 0;
      tabPane?.forEach((item) => {
        if (item.key === val) {
          data.activatedRow = item.bestOfferHanlerStatus;
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
