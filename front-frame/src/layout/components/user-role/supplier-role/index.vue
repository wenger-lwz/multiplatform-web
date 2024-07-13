<template>
  <Filter :params="params" style="margin-bottom: 8px;"></Filter>
  <gb-table
    :columns="columns"
    :remote-data="remoteData"
    height="350px"
  >
    <template #td:state="{ row }">
      <span style="color: green" v-if="row?.state === 0">启用</span>
      <span style="color: red" v-if="row?.state === 1">禁用</span>
    </template>
    <template #td:paymentType="{ row }">
      <span v-if="row?.paymentType === 1">现结（{{row?.paymentRate * 100}}%）</span>
      <span v-if="row?.paymentType === 2">月结（{{row?.paymentCycle}}月）</span>
    </template>
  </gb-table>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { getUserSupplierRole } from '@/api/user'
import Filter from './filter.vue'
import { useRemoteTable, GbTable } from '@gj/biz';

export default defineComponent({
  components: {
    Filter,
    GbTable
  },
  props: {
    userId: {
      type: String,
      require: true,
    },
  },
  setup(props) {
    const params = reactive({
      buyerManagerId: null,
      dataCode: null,
      paymentType: null,
      id: null,
      state: null,
      createId: null,
      userId: props.userId
    });

    const columns = [
      {
        header: '供应商名称',
        field: 'dataName',
        width: 200,
      }, 
      {
        header: '状态',
        field: 'state',
        width: 100,
      },      
      {
        header: '采购员',
        field: 'buyerManager',
        width: 150,
      }, 
      {
        header: '结算方式',
        field: 'paymentType',
        width: 100,
      }, 
      {
        header: '创建人',
        field: 'create',
        width: 100,
      }, 
      {
        header: '创建时间',
        field: 'addTime',
        width: 100,
      }, 
    ]

    const { remoteData } = useRemoteTable({
      filter: params,
      api: ({ paging, filter }) => {
        const queryParams = {
          ...filter,
          ...paging
        }
        return getUserSupplierRole(queryParams);
      }
      });

    return {
      params,
      columns,
      remoteData
    }
  }
})
</script>
