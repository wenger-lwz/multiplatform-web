<template>
  <div class="systemPage">eBay打折</div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "eBayDiscount",
  setup() {
    const data = reactive({});

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style scoped lang="scss"></style>
