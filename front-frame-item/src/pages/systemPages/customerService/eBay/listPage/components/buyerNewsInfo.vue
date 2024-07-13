<template>
  <div class="detail-descriptions-info">
    <ul class="content-wrap">
      <li class="w-30">
        <span>买家名称</span>
        <gb-text>{{
          allDateDetail?.sellerBestOffer?.buyerName || "-"
        }}</gb-text>
      </li>
      <li class="w-30">
        <span>买家邮箱</span>
        <gb-text>{{
          allDateDetail?.sellerBestOffer?.buyerEmail || "-"
        }}</gb-text>
      </li>
      <li class="w-40">
        <span>买家评价</span>
        <gj-rate
          :default-value="allDateDetail?.sellerBestOffer?.buyerCommentLevel"
          readonly
        />
        <!-- <gb-text>{{
          allDateDetail?.sellerBestOffer?.buyerCommentLevel || '-'
        }}</gb-text> -->
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-30">
        <span>收货地址</span>
        <gb-text>{{
          allDateDetail?.sellerBestOffer?.buyerLocation || "-"
        }}</gb-text>
      </li>
      <li class="w-30">
        <span>注册日期</span>
        <gb-text>{{
          allDateDetail?.sellerBestOffer?.buyerRecordDate || "-"
        }}</gb-text>
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

:deep(.arco-rate) {
  min-height: 100%;
  max-height: 100%;
  font-size: 14px;
}
</style>
