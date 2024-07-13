<template>
  悬停点击 <svg-icon svg-class="disfavor" :width="12"/>
  收藏常用菜单~<br/>
  再也不怕找不到啦！
</template>

<script>
import { defineComponent } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  name: 'ContentForCollect',
  components: {
    SvgIcon
  }
})
</script>