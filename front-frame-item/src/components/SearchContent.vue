<template>
  <div class="search_content">
    <span>
      <slot name="search"> </slot>
    </span>
    <span v-show="isSeniorSearch">
      <slot name="seniorSearch"> </slot>
    </span>
    <button @click="reset">重置</button>
    <button @click="search">搜索</button>
    <button @click="seniorSearch">高级搜索</button>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  emits: ["reset", "search", "seniorSearch"],
  props: {},
  setup(props, { emit }) {
    const data = reactive({
      isSeniorSearch: false,
    });
    const seniorSearch = () => {
      data.isSeniorSearch = !data.isSeniorSearch;
      emit("seniorSearch");
    };
    const reset = () => {
      emit("reset");
    };
    const search = () => {
      emit("search");
    };
    return {
      ...toRefs(data),
      seniorSearch,
      reset,
      search,
    };
  },
});
</script>
<style scoped lang="scss">
.search_content {
  border: solid 1px red;
}
</style>
