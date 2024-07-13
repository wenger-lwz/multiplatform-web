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
import allEvaluate from "./components/allEvaluate.vue";
import pendingEvaluate from "./components/pendingEvaluate.vue";
import processedEvaluate from "./components/processedEvaluate.vue";

export default defineComponent({
  name: "AllocationRules",
  components: {
    allEvaluate,
    pendingEvaluate,
    processedEvaluate,
  },
  setup() {
    const data = reactive({
      defalutActKey: "allEvaluate",
      activatedRow: 0,
    });

    const tabPane = [
      {
        replyStatus: 0,
        key: "allEvaluate",
        title: "全部",
        cp: allEvaluate,
      },
      {
        replyStatus: 1,
        key: "pendingEvaluate",
        title: "待处理",
        cp: pendingEvaluate,
      },
      {
        replyStatus: 2,
        key: "processedEvaluate",
        title: "已处理",
        cp: processedEvaluate,
      },
    ];

    const changeTab = (val) => {
      data.defalutActKey = val;
      data.activatedRow = 0;
      tabPane?.forEach((item) => {
        if (item.key === val) {
          data.activatedRow = item.replyStatus;
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
