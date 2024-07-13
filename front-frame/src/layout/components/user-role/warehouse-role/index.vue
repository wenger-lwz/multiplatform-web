<template>
  <gb-table
    :columns="columns"
    :remote-data="remoteData"
    height="390px"
  />
</template>

<script>
import { defineComponent } from 'vue'
import { getUserDataRole } from '@/api/user'
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
        header: '店铺',
        field: 'dataRelationName',
      },
      {
        header: '仓库',
        field: 'dataName',
      },
      {
        header: '来源数据组',
        field: 'groupName',
      },
      {
        header: '授权时间',
        field: 'addTime',
      },
    ]

    const { remoteData } = useRemoteTable({
      api: ({ paging }) => getUserDataRole({
        userId: props.userId,
        permissionType: 'Warehouse',
        page: paging.page,
        pagesize: paging.pagesize,
      }),
    });

    return {
      columns,
      remoteData
    }
  }
})
</script>
