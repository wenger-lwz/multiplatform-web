<template>
  <CommonPageAction currentRouterPermission="LZD/commodityCrossBorder/view">
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
import OnLineList from "../components/CommodityCrossBorder/OnLineList";
import OffSelfList from "../components/CommodityCrossBorder/OffSelfList";
import QuantityCheckList from "../components/CommodityCrossBorder/QuantityCheckList";
import ViolationList from "../components/CommodityCrossBorder/ViolationList";
import SuspectDeletedList from "../components/CommodityCrossBorder/SuspectDeletedList";
// import store from "@/store";

export default defineComponent({
  name: "LZD_CommodityCrossBorder",
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
        permissions: ["LZD/commodityCrossBorder/online/view"],
      },
      {
        key: "2",
        title: "已下架",
        cp: OffSelfList,
        permissions: ["LZD/commodityCrossBorder/offline/view"],
      },
      {
        key: "3",
        title: "待质量检测",
        cp: QuantityCheckList,
        permissions: ["LZD/commodityCrossBorder/quantityCheck/view"],
      },
      {
        key: "4",
        title: "违规",
        cp: ViolationList,
        permissions: ["LZD/commodityCrossBorder/violation/view"],
      },
      {
        key: "5",
        title: "疑似删除",
        cp: SuspectDeletedList,
        permissions: ["LZD/commodityCrossBorder/suspectDeleted/view"],
      },
    ];

    // const controlTabPane = tabPane.filter(
    //   (item) => data.permissionsList[item.permissions]
    // );

    return {
      // controlTabPane,
      tabPane,
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
