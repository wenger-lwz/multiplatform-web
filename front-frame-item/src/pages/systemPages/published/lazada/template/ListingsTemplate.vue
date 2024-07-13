<template>
  <div>lazada刊登模板</div>
</template>

<script>
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "ListingsTemplate",
  setup() {
    onMounted(() => {
      console.log("lazada刊登模板");
    });
    return {};
  },
});
</script>
