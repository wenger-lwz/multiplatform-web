<template>
  <div class="systemPage">标准广告(PLS)</div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "standardAdvertising",
  setup() {
    const data = reactive({});

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style scoped lang="scss"></style>
