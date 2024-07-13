<template>
  <div class="log-info">
    <gj-table
      class="table-wrap"
      size="small"
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      :scroll="scroll"
    />
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  setup() {
    // const { proxy } = getCurrentInstance()
    const data = reactive({
      scroll: {
        x: 0,
        y: 400,
      },
      columns: [
        {
          title: "操作时间",
          dataIndex: "date",
        },
        {
          title: "操作类型",
          dataIndex: "type",
        },
        {
          title: "操作结果",
          dataIndex: "result",
        },
        {
          title: "操作用户",
          dataIndex: "user",
        },
        {
          title: "操作内容",
          dataIndex: "content",
        },
      ],
      tableData: [],
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss" scoped>
.log-info {
  // padding: 16px 20px 32px 16px;
}
:deep(.surely-table) {
  border: 1px solid #e6e6ed;
  box-sizing: border-box;
  border-radius: 4px;
}
</style>
