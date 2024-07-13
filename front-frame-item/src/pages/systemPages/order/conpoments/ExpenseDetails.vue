<template>
  <div class="expense-details">
    <div class="title">{{ title }}</div>
    <gj-table :columns="columns" :data="expensesData" :pagination="false" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watchEffect } from "vue";
export default defineComponent({
  props: {
    titleName: {
      type: String,
      default: () => {
        return "";
      },
    },
    allDateDetail: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  setup(props) {
    // const { proxy } = getCurrentInstance()
    const data = reactive({
      columns: [
        {
          title: "费用项",
          dataIndex: "feeName",
        },
        {
          title: "收入",
          dataIndex: "expenseAmount",
        },
        {
          title: "支出",
          dataIndex: "incomeAmount",
        },
      ],
      title: "",
      expensesData: [],
    });

    watchEffect(() => {
      data.title = props.titleName;
      data.expensesData = props.allDateDetail.orderIncomeExpenses;
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss" scoped>
.expense-details {
  padding-bottom: 0;
  .title {
    font-size: 14px;
    height: 16px;
    line-height: 16px;
    color: rgba(0, 4, 48, 0.8);
    margin-bottom: 12px;
  }
}
</style>
