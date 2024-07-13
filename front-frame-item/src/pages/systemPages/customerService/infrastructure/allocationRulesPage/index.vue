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
    <div class="table-content">
      <component :is="defalutActKey" :rowData="activatedRow"></component>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import StoreAllocation from "./components/storeAllocation.vue";
import commodityAllocation from "./components/commodityAllocation";
import SalesAllocation from "./components/salesAllocation";

export default defineComponent({
  name: "AllocationRules",
  components: {
    StoreAllocation,
    commodityAllocation,
    SalesAllocation,
  },
  setup() {
    const data = reactive({
      defalutActKey: "StoreAllocation",
      activatedRow: 1,
    });

    const tabPane = [
      {
        key: "StoreAllocation",
        title: "按店铺分配负责人",
        cp: StoreAllocation,
      },
      // {
      //   key: "commodityAllocation",
      //   title: "按商品自录分配负责人",
      //   cp: commodityAllocation,
      // },
      // {
      //   key: "SalesAllocation",
      //   title: "按销售分类分配负责人",
      //   cp: SalesAllocation,
      // },
    ];

    const changeTab = (val) => {
      data.defalutActKey = val;
      data.activatedRow = tabPane?.findIndex((item) => item.key === val) + 1;
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
  .table-content {
    height: 100%;
  }
}
</style>
