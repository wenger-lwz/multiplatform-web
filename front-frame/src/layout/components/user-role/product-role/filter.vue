<template>
  <gj-space size="mini">
    <gj-select 
      v-model="params.category"
      placeholder="品类（多选）" 
      multiple 
      allow-clear
      allow-search
      :max-tag-count="1"
      style="width: 200px;"
    >
      <gj-option v-for="item in productCategorys" :value="item.id" :label="item.text" />
    </gj-select>
    <gj-select 
      v-model="params.brand"
      placeholder="品牌"
      allow-clear
      allow-search 
      style="width: 140px;"
    >
      <gj-option v-for="item in productBrands" :value="item.id" :label="item.text" />
    </gj-select>
    <gj-select 
      v-model="params.productType"
      placeholder="类型" 
      allow-clear
      allow-search 
      style="width: 140px;"
    >
      <gj-option v-for="item in productTypes" :value="item.id" :label="item.text" />
    </gj-select>
    <gj-input-group>
      <gj-select
        v-model="params.dynamicKey"
        style="width: 110px;"
      >
        <gj-option v-for="item in keywordTypes" :value="item.id" :label="item.text" />
      </gj-select>
      <gj-input 
        v-model="keyword"        
        style="width: 150px;"
        placeholder="请输入内容"
        @keyup.enter="params.keyword = keyword"
      />
    </gj-input-group>
  </gj-space>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { userFilterOption } from './hooks/use-filter'

export default defineComponent({
  props: {
    params: {
      require: true
    }
  },
  setup() {    
    const { 
      productCategorys,
      productBrands,
      productTypes, 
      keywordTypes
    } = userFilterOption()

    const keyword = ref('');

    return {
      productCategorys,
      productBrands,
      productTypes,
      keywordTypes,
      keyword
    }
  }
})
</script>

<style>

</style>