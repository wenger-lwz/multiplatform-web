<template>
  <div class="search-class">
    <gj-tree :data="shopTreeData" />
    <gj-divider />
    <gj-tree :data="labelTreeData" />
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {
  setup() {
    const data = reactive({
      shopTreeData: [
        {
          title: "Trunk 0-0",
          key: "0-0",
          children: [
            {
              title: "Branch 0-0-0",
              key: "0-0-0",
            },
            {
              title: "Branch 0-0-1",
              key: "0-0-1",
            },
          ],
        },
      ],
      labelTreeData: [
        {
          title: "Trunk 0-0",
          key: "0-0",
          children: [
            { title: "Branch 0-0-0", key: "0-0-0" },
            { title: "Branch 0-0-1", key: "0-0-1" },
          ],
        },
      ],
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
.search-class {
  min-width: 130px;
  max-width: 180px;
  height: 100%;
  overflow-y: auto;
  padding: 0 4px;
}
</style>
