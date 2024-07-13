<template>
  点击 <svg-icon :svg-class=" 'fullscreen'" :width="12" /> 进入全屏~ <br/>
  展示更多数据，开启沉浸式体验！
</template>

<script>
import { defineComponent } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  name: 'ContentForFullscreen',
  components: {
    SvgIcon
  }
})
</script>