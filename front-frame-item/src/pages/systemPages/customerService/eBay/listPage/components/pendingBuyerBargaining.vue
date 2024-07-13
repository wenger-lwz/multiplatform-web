<template>
  <baseTablePage :bestOfferHanlerStatus="rowkey" />
</template>
<script>
import { defineComponent } from "vue";
import baseTablePage from "./buyerBargainingTable.vue";

export default defineComponent({
  name: "pendingReturnOrRefund",
  components: { baseTablePage },
  props: {
    rowkey: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },
});
</script>
