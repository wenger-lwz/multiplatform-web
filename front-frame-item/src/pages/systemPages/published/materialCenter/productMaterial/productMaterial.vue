<template>
  <CommonPageAction
    currentRouterPermission="PLAT/materialCenter/productMaterial/view"
  >
    <gj-tabs
      v-show="pageKey"
      class="productMaterial"
      default-active-key="1"
      :lazy-load="true"
    >
      <gj-tab-pane key="1" title="子产品素材">
        <skuList ref="skuListRef" @edit="edit"></skuList>
      </gj-tab-pane>
      <gj-tab-pane key="2" title="父产品素材">
        <spuList ref="spuListRef" @edit="edit"></spuList>
      </gj-tab-pane>
    </gj-tabs>

    <ProductMaterialEdit
      v-if="!pageKey"
      :editId="editId"
      :type="type"
      @close="editClose"
    ></ProductMaterialEdit>
  </CommonPageAction>
</template>

<script>
import { ref, reactive, toRefs } from "vue";
import CommonPageAction from "@/components/CommonPageAction.vue";
import ProductMaterialEdit from "../productMaterial-edit/productMaterial-edit.vue";
import skuList from "./component/skuList.vue";
import spuList from "./component/spuList.vue";

export default {
  name: "PLAT_materialCenter_productMaterial",
  components: {
    CommonPageAction,
    skuList,
    spuList,
    ProductMaterialEdit,
  },
  setup() {
    const skuListRef = ref(null);
    const spuListRef = ref(null);
    const data = reactive({
      pageKey: true,
      editId: "",
      type: "",
      // expandable: {
      //   title: "Expand",
      //   width: 80,
      // },
    });

    const edit = (row) => {
      if (row.sku) {
        data.type = 1;
      } else {
        data.type = 0;
      }
      data.editId = row.sku || row.spu;
      data.pageKey = false;
    };
    const editClose = () => {
      data.pageKey = true;
      if (data.type === 1) {
        skuListRef.value.refresh();
      } else {
        spuListRef.value.refresh();
      }
    };

    return {
      ...toRefs(data),
      skuListRef,
      spuListRef,
      edit,
      editClose,
    };
  },
};
</script>
<style lang="scss">
.productMaterial {
  .c-1 {
    font-size: 12px;
    color: #0045f0;
  }
  .arco-tabs-pane {
    height: calc(100vh - 41px);
  }
  .arco-tabs-content {
    padding: 0;
  }
}
// .productMaterial-search-list {
//   margin-bottom: 10px;
// }
</style>
