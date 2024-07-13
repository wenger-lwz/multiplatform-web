<template>
  <baseTablePage :returnStatusCategory="rowkey" />
</template>
<script>
import { defineComponent } from "vue";
import baseTablePage from "./returnOrRefundBaseTablePage.vue";

export default defineComponent({
  name: "allReturnOrRefund",
  components: { baseTablePage },
  props: {
    rowkey: {
      type: String,
      default: () => {
        return "ALL";
      },
    },
  },
});
</script>
