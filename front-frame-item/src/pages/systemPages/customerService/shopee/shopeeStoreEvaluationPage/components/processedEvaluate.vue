<template>
  <baseTablePage :replyStatus="rowkey" />
</template>
<script>
import { defineComponent } from "vue";
import baseTablePage from "./storeEvaluationBaseTablePage.vue";

export default defineComponent({
  name: "processedEvaluate",
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
