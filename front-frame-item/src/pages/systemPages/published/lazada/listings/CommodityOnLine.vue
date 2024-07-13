<template>
  <CommonPageAction currentRouterPermission="LZD/commodityOnLine/view">
    <div class="common-pages-tabs">
      <gj-tabs class="tab-pane-page" lazy-load justify>
        <gj-tab-pane
          v-for="item in tabPane"
          :key="item.key"
          :title="item.title"
        >
          <component :is="item.cp"></component>
        </gj-tab-pane>
      </gj-tabs>
    </div>
  </CommonPageAction>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import CommonPageAction from "@/components/CommonPageAction.vue";
import OnLineList from "../components/commodityOnLine/OnLineList";
import OffSelfList from "../components/commodityOnLine/OffSelfList";
import QuantityCheckList from "../components/commodityOnLine/QuantityCheckList";
import ViolationList from "../components/commodityOnLine/ViolationList";
import SuspectDeletedList from "../components/commodityOnLine/SuspectDeletedList";
// import store from "@/store";

export default defineComponent({
  name: "LZD_CommodityOnLine",
  components: {
    CommonPageAction,
    OnLineList,
    OffSelfList,
    QuantityCheckList,
    ViolationList,
    SuspectDeletedList,
  },
  setup() {
    const data = reactive({
      // permissionsList: store.getters.getPermissions,
    });

    const tabPane = [
      {
        key: "1",
        title: "在线",
        cp: OnLineList,
        permissions: ["LZD/commodityOnLine/online/view"],
      },
      {
        key: "2",
        title: "已下架",
        cp: OffSelfList,
        permissions: ["LZD/commodityOnLine/offline/view"],
      },
      {
        key: "3",
        title: "待质量检测",
        cp: QuantityCheckList,
        permissions: ["LZD/commodityOnLine/quantityCheck/view"],
      },
      {
        key: "4",
        title: "违规",
        cp: ViolationList,
        permissions: ["LZD/commodityOnLine/violation/view"],
      },
      {
        key: "5",
        title: "疑似删除",
        cp: SuspectDeletedList,
        permissions: ["LZD/commodityOnLine/suspectDeleted/view"],
      },
    ];

    // const controlTabPane = tabPane.filter(
    //   (item) => data.permissionsList[item.permissions]
    // );

    return {
      tabPane,
      // controlTabPane,
      ...toRefs(data),
    };
  },
});
</script>

<style scoped lang="scss">
.common-pages-tabs {
  height: 100%;
}
// 重置tabs 样式
.tab-pane-page {
  > :deep(.arco-tabs-content) {
    padding-top: 0;
  }
}
</style>
