<template>
  <component :is="currentComponent" :item1="item"></component>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import SubMenuItem from './SubMenuItem.vue'
import MultiMenuItem from './MultiMenuItem.vue'

export default defineComponent({
  name: 'MenuItem',
  components: {
    SubMenuItem,
    MultiMenuItem,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const currentComponent = computed(() => {
      if (props.item?.isMultiMenu) {
        return 'multi-menu-item'
      }
      return 'sub-menu-item'
    })
    return {
      currentComponent,
    }
  },
})
</script>
