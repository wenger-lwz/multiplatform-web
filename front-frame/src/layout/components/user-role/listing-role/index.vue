<template>
  <Filter :params="params" style="margin-bottom: 8px;"></Filter>
  <gb-table
    :columns="columns"
    :remote-data="remoteData"
    height="350px"
  />
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { getUserListingRole } from '@/api/user'
import Filter from './filter.vue'
import { userFilterOption } from './hooks/use-filter'
import { useRemoteTable, GbTable } from '@gj/biz';

export default defineComponent({
  components: {
    Filter,
    GbTable
  },
  props: {
    userId: {
      type: Number,
      require: true,
    },
  },
  setup(props) {

    const params = reactive({
      state: 0,
      category: [],
      dataCode2: '', // msku
      userId: props.userId 
    });

    const columns = [
      {
        header: '店铺/站点',
        field: 'dataName',
        width: 130,
      }, 
      {
        header: '品类',
        field: 'category',
        width: 100,
      },      
      {
        header: 'SKU',
        field: 'product',
        width: 160,
      },      
      {
        header: '产品名称',
        field: 'productName',
        width: 200,
      },      
      {
        header: 'MSKU',
        field: 'dataCode2',
        width: 160,
      },      
      {
        header: '状态',
        field: 'stateName',
        width: 90,
      },   
    ]

    const { statusList } = userFilterOption()

    const { remoteData } = useRemoteTable({
      filter: params,
      api: ({ paging, filter }) => {
        const queryParams = {
          ...filter,
          ...paging
        }
        
        return getUserListingRole(queryParams).then((data) => {
          (data.rows || []).forEach(item => {
            if (!item.category) {
              item.category = '-'
            }
            if (!item.productName) {
              item.productName = '-'
            }
            const exist = statusList.find(status => status.id === item.state)
            item.stateName = exist ? exist.text : '-'
          })

          return data;
        })
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
