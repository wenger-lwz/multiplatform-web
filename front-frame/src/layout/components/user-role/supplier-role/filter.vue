<template>
  <gj-space size="mini">
    <gj-select 
      v-model="params.dataCode"
      placeholder="供应商"
      allow-clear 
      allow-search
      style="width: 200px;"
    >
      <gj-option v-for="item in suppliers" :value="item.id" :label="item.text" />
    </gj-select>
    <gj-select 
      v-model="params.state"
      placeholder="供应商状态"
      allow-clear
      allow-search
      style="width: 140px;"
    >
      <gj-option v-for="item in statusList" :value="item.id" :label="item.text" />
    </gj-select>
    <gj-select 
      v-model="params.buyerManagerId"
      placeholder="采购员"
      allow-clear
      allow-search
      :trigger-props="{autoFitPopupWidth: true}"
      style="width: 160px;"
    >
      <gj-option v-for="item in userList" :value="item.id" :label="item.text[1] + '【' + item.text[0] + '】'" />
    </gj-select>
    <gj-select 
      v-model="params.createId"
      placeholder="创建人"      
      allow-clear
      allow-search
      :trigger-props="{autoFitPopupWidth: true}"
      style="width: 160px;"
    >
      <gj-option v-for="item in userList" :value="item.id" :label="item.text[1] + '【' + item.text[0] + '】'" />
    </gj-select>
    <gj-select 
      v-model="params.paymentType"
      placeholder="结算方式"
      allow-clear
      allow-search
      style="width: 140px;"
    >
      <gj-option v-for="item in settlementMethod" :value="item.id" :label="item.text" />
    </gj-select>
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
