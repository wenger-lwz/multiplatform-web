<template>
  <gj-popover title="" position="bottom">
    <span>{{ name }}</span>
    <template #content>
      <gj-table
        size="small"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
      />
    </template>
  </gj-popover>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  props: {
    name: {
      type: String,
      default: () => {
        return "";
      },
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup() {
    const data = reactive({});

    return {
      ...toRefs(data),
    };
  },
});
</script>

<style></style>
