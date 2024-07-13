<template>
  <gj-modal 
    v-bind="$attrs" 
    width="auto"
    unmount-on-close
    :mask-closable="false"
    lazy-load
    :footer="false"
  >
    <template #title>用户数据权限</template>
    <gj-tabs class="tab-container">
      <gj-tab-pane key="1" title="关联数据组">
        <user-data-role :user-id="userId"></user-data-role>
      </gj-tab-pane>
      <gj-tab-pane key="2" title="站点权限">
        <user-market-role :user-id="userId"></user-market-role>
      </gj-tab-pane>
      <gj-tab-pane key="3" title="仓库权限">
        <user-warehouse-role :user-id="userId"></user-warehouse-role>
      </gj-tab-pane>
      <gj-tab-pane key="4" title="产品权限">
        <user-product-role :user-id="userId"></user-product-role>
      </gj-tab-pane>
      <gj-tab-pane v-if="showListingRole" key="5" title="商品权限">
        <user-listing-role :user-id="userId"></user-listing-role>
      </gj-tab-pane>
      <gj-tab-pane key="6" title="供应商权限">
        <user-supplier-role :user-id="userId"></user-supplier-role>
      </gj-tab-pane>
    </gj-tabs>
  </gj-modal>
</template>

<script>
import { defineComponent } from 'vue'
import UserDataRole from './data-role/index.vue'
import UserMarketRole from './market-role/index.vue'
import UserWarehouseRole from './warehouse-role/index.vue'
import UserProductRole from './product-role/index.vue'
import UserListingRole from './listing-role/index.vue'
import UserSupplierRole from './supplier-role/index.vue'

export default defineComponent({
  components: {
    UserDataRole,
    UserMarketRole,
    UserWarehouseRole,
    UserProductRole,
    UserListingRole,
    UserSupplierRole
  },
  props: {
    userId: {
      type: Number,
      require: true,
    },
    showListingRole: {
      type: Boolean,
      requie: true,
    }
  },
})
</script>

<style lang="scss">
.tab-container {
  margin: -20px -10px -10px;
  height: 500px;
  width: 1200px;

  .arco-tabs-nav::before {
    height: 1px;
  }
}
</style>
