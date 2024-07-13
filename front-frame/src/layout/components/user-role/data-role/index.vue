<template>
  <gb-table
    :columns="columns"
    :remote-data="remoteData"
    height="440px"
  >
    <template #td:role="{ row }">
      <span v-if="row?.permissionSwitchs?.Market">站点/</span>
      <span v-if="row?.permissionSwitchs?.Warehouse">仓库/</span>
      <span v-if="row?.permissionSwitchs?.SKU">产品/</span>
      <span v-if="row?.permissionSwitchs?.Listing">商品/</span>
      <span v-if="row?.permissionSwitchs?.Supplier">供应商</span>
    </template>
  </gb-table>
</template>

<script>
import { defineComponent } from 'vue'
import { getUserRelateDataRole } from '@/api/user'
import { useRemoteTable, GbTable } from '@gj/biz';

export default defineComponent({
  components: { GbTable },
  props: {
    userId: {
      type: Number,
      require: true,
    },
  },
  setup(props) {

    const columns = [
      {
        header: '组名',
        field: 'groupName',
      },
      {
        header: '描述',
        field: 'groupDesc',
      },
      {
        header: '创建时间',
        field: 'addTime',
      },
      {
        header: '拥有所有数据权限',
        field: 'role',
      },
    ];

    const { remoteData } = useRemoteTable({
      api: () => getUserRelateDataRole(props.userId),
    });
  
    return {
      columns,
      remoteData
    }
  }
})
</script>
