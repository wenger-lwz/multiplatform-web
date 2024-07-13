<template>
  <div class="detail-descriptions-info">
    <ul class="content-wrap">
      <li class="w-30">
        <span>买家退货期限</span>
        <gb-text>{{ allDateDetail?.returnShipDueDate || "-" }}</gb-text>
      </li>
      <li class="w-30">
        <span>卖家处理已退货期限</span>
        <gb-text>{{ allDateDetail?.returnSellerDueDate || "-" }}</gb-text>
      </li>
      <li class="w-40">
        <span>物流编号</span>
        <gb-text>{{ allDateDetail?.trackingNumber || "-" }}</gb-text>
      </li>
    </ul>
    <ul class="content-wrap" v-if="allDateDetail?.proofImages?.length">
      <li class="w-30">
        <span>物流状态</span>
        <gb-text>{{ allDateDetail?.logisticsStatusName || "-" }}</gb-text>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  props: {
    allDateDetail: {
      type: Object,
      default: () => {
        return null;
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

<style lang="scss" scoped>
@import "./index.scss";
</style>
