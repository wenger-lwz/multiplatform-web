<template>
  <Filter :params="params" style="margin-bottom: 8px;"></Filter>
  <gb-table
    :columns="columns"
    :remote-data="remoteData"
    height="350px"
  >
    <template #td:msku="{ row }">
      <template v-if="row?.mskuList?.length > 0">
        <div v-for="msku of row?.mskuList" :key="msku">
          {{ msku }}
        </div>
      </template>
      <template v-else>-</template>
    </template>
  </gb-table>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { getUserDataRole } from '@/api/user'
import Filter from './filter.vue'
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
      category: [],
      brand: null,
      productType: null,
      dynamicKey: 'dataCode',
      keyword: '',
      userId: props.userId,
      permissionType: 'SKU',      
    });

    const columns = [
      {
        header: '品类',
        field: 'category',
        width: 100,
      }, 
      {
        header: '品牌',
        field: 'brand',
        width: 100,
      },      
      {
        header: '图片',
        field: 'smallImageUrl',
        width: 60,
        image: true,
      },      
      {
        header: '产品名称',
        field: 'name',
        width: 250,
      },      
      {
        header: 'SKU',
        field: 'dataCode',
        width: 150,
      },      
      {
        header: 'MSKU',
        field: 'msku',
        width: 150,
      },       
      {
        header: '来源数据组',
        field: 'groupName',
        width: 100,
      },      
      {
        header: '授权时间',
        field: 'addTime',
        width: 155,
      },      
    ]

    const { remoteData } = useRemoteTable({
      filter: params,
      api: ({ paging, filter }) => {
        const queryParams = {
          ...filter,
          ...paging
        }
        if (queryParams.keyword) {
          queryParams[paramsValue.dynamicKey] = queryParams.keyword
        }
        
        return getUserDataRole(queryParams);
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
