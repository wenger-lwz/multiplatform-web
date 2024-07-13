<template>
  <gb-text>
    {{ remark || "-" }}
  </gb-text>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    remark: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup() {},
});
</script>

<style lang="scss" scoped></style>
