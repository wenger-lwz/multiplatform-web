<template>
  <div class="detail-descriptions-info">
    <ul class="content-wrap">
      <li class="w-30">
        <span>争议状态</span>
        <gb-text>{{
          allDateDetail?.disputeInfo?.negotiationStatus || "-"
        }}</gb-text>
      </li>
      <li class="w-30">
        <span>争议原因</span>
        <gb-text>{{
          allDateDetail?.disputeInfo?.disputeReason.join(",") || "-"
        }}</gb-text>
      </li>
      <li class="w-40">
        <span>争议内容</span>
        <gb-text>{{
          allDateDetail?.disputeInfo?.disputeTextReason.join(",") || "-"
        }}</gb-text>
      </li>
    </ul>
    <ul class="content-wrap" v-if="allDateDetail?.proofImages?.length">
      <li class="w-100">
        <span></span>
        <gj-space size="small" class="imgsSpace">
          <div v-for="(item, index) in allDateDetail?.proofImages" :key="index">
            <gb-image :src="item" :popoverSrc="item" :size="36" />
          </div>
        </gj-space>
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
