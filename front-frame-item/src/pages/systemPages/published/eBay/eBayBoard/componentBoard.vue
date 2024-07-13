<template>
  <div class="content-view">
    <gj-tabs
      v-model="activeName"
      @tab-click="handleClick"
      :destroy-on-hide="true"
    >
      <gj-tab-pane
        v-for="(item, index) in tableTabs"
        :key="index"
        :title="$t(item.title)"
      >
      </gj-tab-pane>
    </gj-tabs>

    <div class="tabContent">
      <componentBoardTabs
        ref="componentBoardTabsRef"
        :itemTabs="tableTabs"
        :activeNameIndex="activeName"
      ></componentBoardTabs>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  nextTick,
} from "vue";
import componentBoardTabs from "./components/componentBoardTabs.vue";

export default defineComponent({
  name: "componentBoard",
  components: {
    componentBoardTabs,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      activeName: 0,
      onHide: true,
      tableTabs: [
        {
          name: "eBay.logisticsPolicy",
          title: "eBay.logisticsPolicy",
          url: "shipping",
          permissionsKey: "logisticsPolicy",
        },
        {
          name: "eBay.paymentPolicy",
          title: "eBay.paymentPolicy",
          url: "payment",
          permissionsKey: "paymentPolicy",
        },
        {
          name: "eBay.returnPolicy",
          title: "eBay.returnPolicy",
          url: "return",
          permissionsKey: "returnPolicy",
        },
        {
          name: "eBay.buyerRequirements",
          title: "eBay.buyerRequirements",
          url: "buyer",
          permissionsKey: "buyerRequirements",
        },
        {
          name: "eBay.locationOfGoods",
          title: "eBay.locationOfGoods",
          url: "location",
          permissionsKey: "locationOfGoods",
        },
        {
          name: "eBay.accessoryCompatibility",
          title: "eBay.accessoryCompatibility",
          url: "compatibility",
          permissionsKey: "accessoryCompatibility",
        },
      ],
    });
    const handleClick = (val) => {
      data.activeName = +val;
      nextTick(() => {
        proxy.$refs.componentBoardTabsRef?.resetFormList();
        proxy.$refs.componentBoardTabsRef?.getList();
        proxy.$refs.componentBoardTabsRef?.getCommonTableRef();
      });
    };
    return {
      ...toRefs(data),
      handleClick,
    };
  },
});
</script>

<style scoped lang="scss">
.content-view {
  height: calc(100vh - 41px);
  :deep(.arco-tabs-nav::before) {
    height: 1px;
  }
  :deep(.arco-tabs) {
    .arco-tabs-content {
      padding-top: 0px;
    }
  }
  .tabContent {
    height: 100%;
  }
}
</style>
