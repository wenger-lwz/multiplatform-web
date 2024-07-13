<template>
  <div>单品折扣</div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  name: "",
  props: {},
  setup() {
    const data = reactive({});
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style scoped lang="scss"></style>
