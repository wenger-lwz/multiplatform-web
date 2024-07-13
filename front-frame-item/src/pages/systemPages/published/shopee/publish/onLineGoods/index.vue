<template>
  <div class="common-pages-tabs">
    <gj-tabs class="tab-pane-page" lazy-load justify>
      <gj-tab-pane v-for="item in tabPane" :key="item.key" :title="item.title">
        <component :is="item.cp"></component>
      </gj-tab-pane>
    </gj-tabs>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import OnLineList from "@pagesSystem/published/shopee/components/commodityOnLine/OnLineList";
import OffSelfList from "@pagesSystem/published/shopee/components/commodityOnLine/OffSelfList";
// import QuantityCheckList from '@pagesSystem/published/shopee/components/commodityOnLine/QuantityCheckList';
import ViolationList from "@pagesSystem/published/shopee/components/commodityOnLine/ViolationList";
// import SuspectDeletedList from '@pagesSystem/published/shopee/components/commodityOnLine/SuspectDeletedList';

export default defineComponent({
  name: "pubShopeeOnLineGoods",
  components: {
    OnLineList,
    OffSelfList,
    ViolationList,
    /* QuantityCheckList,    
    SuspectDeletedList, */
  },
  setup() {
    const data = reactive({});

    const tabPane = [
      {
        key: "1",
        title: "在线",
        cp: OnLineList,
      },
      {
        key: "2",
        title: "已下架",
        cp: OffSelfList,
      },
      {
        key: "4",
        title: "违规/删除",
        cp: ViolationList,
      },
      /* {
        key: '3',
        title: '待质量检测',
        cp: QuantityCheckList,
      },
      
      {
        key: '5',
        title: '疑似删除',
        cp: SuspectDeletedList,
      }, */
    ];

    return {
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
