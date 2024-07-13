<template>
  <gj-pagination
    class="common_table_page"
    :total="pagination.total"
    :size="paginationSize"
    :current="pagination.pageCurrent"
    :page-size="pagination.pageSize"
    show-total
    show-jumper
    simple
    show-page-size
    :page-size-options="[20, 50, 100, 200, 500]"
    @change="currentChange"
    @page-size-change="pageSizeChange"
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppPagination",
  props: {
    pagination: {
      type: Object,
      default: () => {
        return {
          pageCurrent: 1,
          pageSize: 20,
          total: 0,
        };
      },
    },
    paginationSize: {
      type: String,
      default: () => {
        return "mini";
      },
    },
  },
  emits: ["onCurrentChange", "onPageSizeChange"],
  setup(props, { emit }) {
    const currentChange = (pageCurrent) => {
      emit("onCurrentChange", pageCurrent);
    };
    const pageSizeChange = (pageSize) => {
      emit("onPageSizeChange", pageSize);
    };
    return { currentChange, pageSizeChange };
  },
});
</script>

<style lang="scss" scoped>
.common_table_page {
  margin-right: 12px;
  :deep(.arco-pagination-jumper-input) {
    height: 24px !important;
  }
}
</style>
