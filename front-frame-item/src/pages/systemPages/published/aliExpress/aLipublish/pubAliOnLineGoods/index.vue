<!--在线商品-->
<template>
  <div class="pubAliOnLineGoods">
    <gj-tabs :default-active-key="defalutActKey" lazy-load destroy-on-hide>
      <gj-tab-pane v-for="item in tabPane" :key="item.key" :title="item.title">
        <component :is="item.cp"></component>
      </gj-tab-pane>
    </gj-tabs>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";

import onlineTab from "./components/online.vue";
import removedTab from "./components/removed.vue";
import pendingTab from "./components/pending.vue";
import failedTab from "./components/failed.vue";
import deleteTab from "./components/delete.vue";

export default defineComponent({
  name: "pubAliOnLineGoods",
  props: {},
  components: {
    onlineTab,
    removedTab,
    pendingTab,
    failedTab,
    deleteTab,
  },
  setup() {
    const data = reactive({
      activeName: "onLine",
      tabPane: [
        {
          key: "1",
          title: "在线",
          cp: onlineTab,
        },
        {
          key: "2",
          title: "已下架",
          cp: removedTab,
        },
        {
          key: "3",
          title: "审核中",
          cp: pendingTab,
        },
        {
          key: "4",
          title: "审核不通中",
          cp: failedTab,
        },
        {
          key: "5",
          title: "疑似删除",
          cp: deleteTab,
        },
      ],
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style scoped lang="scss">
:deep(.arco-tabs-content) {
  padding-top: 0;
  height: calc(100vh - 41px);
  .arco-tabs-content-list {
    height: 100%;
    .arco-tabs-content-item {
      height: 100%;
      .arco-tabs-pane {
        height: 100%;
      }
    }
  }
}
</style>
