<template>
  <baseTablePage :replyStatus="rowkey" />
</template>
<script>
import { defineComponent } from "vue";
import baseTablePage from "./storeEvaluationBaseTablePage.vue";

export default defineComponent({
  name: "allEvaluate",
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
