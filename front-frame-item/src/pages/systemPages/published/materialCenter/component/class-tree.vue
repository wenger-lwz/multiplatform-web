<template>
  <gj-tree
    class="gj-class-tree"
    :selected-keys="selectedKeys"
    :field-names="{ key: 'category', title: 'categoryName' }"
    :data="treeData"
    @select="select"
  />
</template>

<script>
import { reactive, toRefs } from "vue";
import { getProductCategoryList } from "@/api/published/materialCenter";

export default {
  // props: {
  //   selectedKeys: {
  //     type: Array,
  //   },
  // },
  emits: ["update:selectedKeys", "select"],
  setup(props, { emit }) {
    const data = reactive({
      treeData: [],
      selectedKeys: [],
    });

    // 获取分类
    getProductCategoryList().then((res) => {
      data.treeData = res.data;
    });

    const restValues = () => {
      data.selectedKeys = [];
    };

    const select = (val) => {
      data.selectedKeys = val;
      emit("select", val);
    };

    return {
      ...toRefs(data),
      restValues,
      select,
    };
  },
};
</script>

<style scoped lang="scss">
.gj-class-tree {
  margin-right: 5px;
}
::v-deep .arco-tree-node-title {
  flex: 1;
}
</style>
