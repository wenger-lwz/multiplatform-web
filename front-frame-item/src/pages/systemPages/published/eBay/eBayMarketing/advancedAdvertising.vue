<template>
  <div class="systemPage">高级广告(PLA)</div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "advancedAdvertising",
  setup() {
    const data = reactive({});

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style scoped lang="scss"></style>
