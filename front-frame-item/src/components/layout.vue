<template>
  <div class="layout" id="systemPage">
    <div id="layoutHeader">
      <slot name="seach"></slot>
      <slot name="btn"></slot>
    </div>
    <div calss="layouTable">
      <slot name="table"></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onBeforeMount } from "vue";
export default defineComponent({
  name: "",
  components: {},
  setup() {
    const data = reactive({});
    onBeforeMount(() => {});
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="scss" scoped>
.layout {
  overflow: hidden;
}
#layoutHeader {
  padding: 0px 10px;
}
</style>
