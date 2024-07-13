<template>
  点击 <svg-icon :svg-class="'pin'" :width="12"/>
  固定页签，定制自己的首页菜单~<br/>
  一进入系统就看到，再也不用到处找！
</template>

<script>
import { defineComponent } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  name: 'ContentForFixNav',
  components: {
    SvgIcon
  }
})
</script>