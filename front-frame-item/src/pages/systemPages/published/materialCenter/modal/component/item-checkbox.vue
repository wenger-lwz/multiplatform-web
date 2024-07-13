<template>
  <div class="item-checkbox">
    <gj-checkbox @change="change"></gj-checkbox>
    <gb-text class="item-checkbox-span">{{ item.content }}</gb-text>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
    },
    skuIndex: {
      type: Number,
    },
  },
  methods: {
    change(val) {
      this.$emit("select", this.item, val, this.skuIndex);
    },
  },
};
</script>

<style lang="scss" scoped>
.item-checkbox {
  display: flex;
  align-items: center;
  height: 30px;
  cursor: pointer;
  color: #333659;
  &:hover {
    background: #e6ecfe;
    border-radius: 4px;
    color: #0045f0;
  }
  .item-checkbox-span {
    margin-left: 8px;
    font-size: 12px;
    line-height: 16px;
  }
}
</style>
