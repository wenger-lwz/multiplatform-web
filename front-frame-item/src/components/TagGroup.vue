<template>
  <div class="tag-wrap" v-if="searchActive.length > 0">
    <gj-tag
      closable
      v-for="(item, index) in searchActive"
      :key="item.id"
      @close="tagClose(item, index)"
      class="normal-tag-btn"
    >
      <span>{{ item.showName + item.splitSymbol + item.showValue }}</span>
    </gj-tag>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from "vue";
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  emits: ["update:list", "tag-change"],
  setup(props, { emit }) {
    const data = reactive({
      searchActive: props.list,
    });
    watch(
      () => props.list,
      () => {
        data.searchActive = props.list;
      },
      { deep: true }
    );
    const tagClose = (item, index) => {
      data.searchActive.splice(index, 1);
      emit("update:list", data.searchActive);
      emit("tag-change", item.id);
    };
    return {
      ...toRefs(data),
      tagClose,
    };
  },
};
</script>
<style lang="scss" scoped>
.tag-wrap {
  padding-top: 12px;
  display: flex;
  align-items: center;
  background: #fff;
  position: relative;
  min-height: 0px;
  flex-wrap: wrap;
  row-gap: 8px;

  .arco-tag {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }
  .normal-tag-btn {
    color: #165dff;
    .arco-icon {
      color: #b3b4c1;
    }
    .tag-text-content {
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
