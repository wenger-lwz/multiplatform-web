<template>
  <div class="detail-descriptions-info">
    <div class="historicalBargaining-content">
      <div class="historicalBargaining-content-title">历史议价</div>
      <ul class="content-wrap">
        <li class="w-30">
          <span>议价类型</span>
          <gb-text>{{
            allDateDetail?.historyBestOffers?.discussType || "-"
          }}</gb-text>
        </li>
        <li class="w-30">
          <span>议价金额</span>
          <gb-text>{{
            allDateDetail?.historyBestOffers?.price || "-"
          }}</gb-text>
        </li>
        <li class="w-40">
          <span>议价数量</span>
          <gb-text>{{
            allDateDetail?.historyBestOffers?.quantity || "-"
          }}</gb-text>
        </li>
      </ul>
      <ul class="content-wrap">
        <li class="w-100">
          <span>创建时间</span>
          <gb-text>{{
            allDateDetail?.historyBestOffers?.createdTime || "-"
          }}</gb-text>
        </li>
      </ul>
      <ul class="content-wrap">
        <li class="w-100">
          <span>买家留言</span>
          <gb-text>{{
            allDateDetail?.historyBestOffers?.remarks || "-"
          }}</gb-text>
        </li>
      </ul>
    </div>
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
.detail-descriptions-info {
  row-gap: 24px;
}
.historicalBargaining-content {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  .historicalBargaining-content-title {
    font-weight: 600;
  }
}
</style>
