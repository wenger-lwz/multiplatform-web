<template>
  <div class="">EditGlobal</div>
</template>

<script>
import { defineComponent, reactive, toRefs, onBeforeMount } from "vue";
export default defineComponent({
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
//@import url(); 引入公共css类
</style>
