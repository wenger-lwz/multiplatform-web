<template>
  <!-- class 名称要统一成common-btn-group -->
  <div class="common-btn-group">
    <div class="btn-group-left">
      <slot name="left"></slot>
    </div>
    <div class="btn-group-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "OperateBtnGroup",
  props: {},
  setup() {},
});
</script>

<style scoped lang="scss">
.common-btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  font-size: 12px;
  .btn-group-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
  }
}
</style>
