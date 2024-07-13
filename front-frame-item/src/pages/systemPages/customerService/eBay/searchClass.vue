<template>
  <div class="search-class">
    <gj-tree
      v-if="shopTreeData.length > 0"
      :data="shopTreeData"
      :default-selected-keys="[shopTreeData[0].shopId]"
      :field-names="{
        key: 'shopId',
        title: 'shopName',
      }"
    >
      <template #extra="nodeData">
        <div class="tree-noReadCount" v-if="nodeData.noReadCount">
          ({{ nodeData.noReadCount }})
        </div>
      </template>
    </gj-tree>
    <gj-divider />
    <gj-tree
      :data="labelTreeData"
      :default-expanded-keys="['all']"
      :default-selected-keys="['all']"
      :field-names="{
        key: 'labelId',
        title: 'labelName',
      }"
    >
      <template #extra="nodeData">
        <div class="tree-noReadCount" v-if="nodeData.noReadCount">
          ({{ nodeData.noReadCount }})
        </div>
      </template>
    </gj-tree>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import {
  getEBayShopListMessage,
  getEBayLabelListMessage,
} from "@/api/customerService/eBay";

export default {
  setup() {
    const data = reactive({
      shopTreeData: [],
      labelTreeData: [
        {
          labelId: "all",
          labelName: "全部标签",
          children: [],
        },
      ],
    });

    getEBayShopListMessage().then((res) => {
      // console.log("店铺列表：", res.data.ebayShopMessageVOList);
      data.shopTreeData = res.data.ebayShopMessageVOList;
    });
    getEBayLabelListMessage().then((res) => {
      // console.log("标签列表：", res.data.ebayLabelMessageVOList);
      data.labelTreeData[0].children = res.data.ebayLabelMessageVOList;
    });

    return {
      ...toRefs(data),
    };
  },
};
</script>

<style scoped lang="scss">
::v-deep .arco-tree-node-title:hover {
  background: transparent;
}
::v-deep .arco-tree-node:hover {
  background: rgba(14, 66, 210, 0.1);
  border-radius: 4px;
}
::v-deep .arco-tree-node-selected .tree-noReadCount {
  color: #0045f0 !important;
}
.search-class {
  min-width: 130px;
  max-width: 180px;
  height: 100%;
  overflow-y: auto;
  padding: 0 4px;
  .tree-noReadCount {
    font-size: 12px;
    line-height: 18px;
    color: #808197;
  }
}
</style>
