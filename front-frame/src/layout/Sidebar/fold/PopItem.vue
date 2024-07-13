<template>
  <component ref="itemRef" :is="currentComponent" :item1="item"></component>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import SubMenuPopItem from './SubMenuPopItem.vue'
// import MultiMenuPopItem from './MultiMenuPopItem.vue'

export default defineComponent({
  name: 'MenuItem',
  components: {
    SubMenuPopItem,
    // MultiMenuPopItem,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const itemRef = ref(null)
    const currentComponent = computed(() => {
      // if (props.item?.isMultiMenu) {
      //   return 'multi-menu-pop-item'
      // }
      return 'sub-menu-pop-item'
    })
    const togglePopup = (isShow) => {
      if (itemRef.value) {
        if (itemRef.value.popVisible && !isShow) {
          itemRef.value.hidePopup()
        } else if (!itemRef.value.popVisible && isShow) {
          itemRef.value.showPopup()
        }
      }
    }
    return {
      itemRef,
      currentComponent,
      togglePopup
    }
  },
})
</script>
