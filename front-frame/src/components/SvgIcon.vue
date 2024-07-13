<template>
  <SvgIcon
    :class="['svg', svgClass]"
    :name="svgClass"
    :style="{ 'font-size': width ? width + 'px' : '' }"
  ></SvgIcon>
</template>
<script>
import { defineComponent } from 'vue'
import SvgIcon from 'vue-svg-icon/Icon.vue'
export default defineComponent({
  components: {
    SvgIcon,
  },
  props: {
    svgClass: {
      type: String,
      default: () => {
        return 'null'
      },
    },
    width: {
      type: Number,
      default: () => {
        return 0
      },
    },
  },
})
</script>

<style scoped lang="scss">
.svg {
  width: 1em;
  height: 1em;
}
</style>
