<template>
  <gj-space size="mini">
    <gj-select 
      v-model="params.state"
      placeholder="状态"
      allow-clear
      allow-search 
      style="width: 120px;"
    >
      <gj-option v-for="item in statusList" :value="item.id" :label="item.text" />
    </gj-select>
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
    <gj-input 
        v-model="keyword"        
        style="width: 150px;"
        placeholder="请输入MSKU"
        @keyup.enter="params.dataCode2 = keyword"
      />
  </gj-space>
</template>

<script>
import { defineComponent } from 'vue'
import { userFilterOption } from './hooks/use-filter'

export default defineComponent({
  props: {
    params: {
      require: true
    }
  },
  setup() {    
    return {
      ...userFilterOption()
    }
  }
})
</script>

<style>

</style>