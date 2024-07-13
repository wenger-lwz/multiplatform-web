<template>
  <gj-popover position="rt">
    <img
      :src="record.mainImage"
      width="36"
      height="36"
      class="product-img"
      onerror="this.classList.add('error')"
    />

    <template #content>
      <img
        :src="record.mainImage"
        class="product-img preview-img"
        onerror="this.classList.add('error')"
      />
    </template>
  </gj-popover>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "",
  props: {
    record: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  setup() {},
});
</script>

<style scoped lang="scss">
.product-img {
  border: 1px solid rgba(0, 4, 48, 0.05);
  border-radius: 4px;
  object-fit: cover;
}

.preview-img {
  max-width: 500px;
  max-height: 500px;
  object-fit: cover;
}

.product-img.error {
  display: inline-block;
  transform: scale(1);
  content: "";
  color: transparent;
}
.product-img.error::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url("../../../../../../svg/default-img.svg") no-repeat center /
    100% 100%;
}
</style>
