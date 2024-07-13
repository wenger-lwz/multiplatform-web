<template>
  <div id="shopify-online-gooods">
    <gj-tabs default-active-key="1" lazy-load destroy-on-hide>
      <gj-tab-pane v-for="item in tabsMap" :key="item.key" :title="item.title">
        <component :is="item.name" />
      </gj-tab-pane>
    </gj-tabs>
  </div>
</template>
<script>
import { defineComponent } from "vue";

import OnlineGoods from "./components/OnlineGoods.vue";
import RemovedGoods from "./components/RemovedGoods.vue";
import OfflineGoods from "./components/OfflineGoods.vue";
// import {
//   getStoreInformationlist,
// } from "@api/published/common";

export default defineComponent({
  name: "shopifyOnLineGoods",
  components: {
    OnlineGoods,
    OfflineGoods,
    RemovedGoods,
  },
  setup() {
    // const storeList = ref([])
    const tabsMap = [
      {
        key: "1",
        title: "在线",
        name: OnlineGoods,
      },
      {
        key: "2",
        title: "已下架",
        name: OfflineGoods,
      },
      {
        key: "3",
        title: "疑似删除",
        name: RemovedGoods,
      },
    ];

    // const getStoreList = () => {
    //   let params = {
    //     platformCode: "SHOPIFY",
    //   };
    //   getStoreInformationlist(params).then((res) => {
    //     storeList.value = res.data.map((item) => {
    //       return {
    //         storeName: item.shopName,
    //         shopId: item.shopId,
    //       };
    //     });
    //   });
    // };

    // getStoreList()

    return {
      tabsMap,
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
