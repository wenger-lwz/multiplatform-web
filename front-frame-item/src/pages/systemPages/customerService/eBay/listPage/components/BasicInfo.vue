<template>
  <div class="detail-descriptions-info">
    <div class="detail-info">
      <div class="imageBox">
        <gj-image :src="allDateDetail?.bestOffer?.itemImgUrl" width="100" />
      </div>
      <div class="itemInfo-content">
        <gb-text>{{ allDateDetail?.bestOffer?.itemTitle || "-" }}</gb-text>
        <div class="itemInfo-content itemInfo-content-content">
          <ul class="content-wrap">
            <li class="w-30">
              <span class="content-wrap-title">商品ID</span>
              <gb-text>{{ allDateDetail?.bestOffer?.itemId || "-" }}</gb-text>
            </li>
            <li class="w-30">
              <span>商品价格</span>
              <gb-text>{{
                allDateDetail?.bestOffer?.itemPrice || "-"
              }}</gb-text>
            </li>
            <li class="w-40">
              <span>MSKU</span>
              <gb-text>{{ allDateDetail?.bestOffer?.itemMsku || "-" }}</gb-text>
            </li>
          </ul>
          <ul class="content-wrap">
            <li class="w-30">
              <span class="content-wrap-title">SKU</span>
              <gb-text>{{ allDateDetail?.bestOffer?.itemSku || "-" }}</gb-text>
            </li>
            <li class="w-70">
              <span>刊登结束时间</span>
              <gb-text>{{
                allDateDetail?.bestOffer?.itemEndTime || "-"
              }}</gb-text>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="detail-alert-info">
      <gj-alert type="warning" :show-icon="false">
        <template #title>
          <div
            v-if="allDateDetail?.bestOffer?.platformStatus === 'Pending'"
            class="alert-buyerName"
          >
            <span class="buyerName-color">{{
              allDateDetail?.bestOffer?.buyerName
            }}</span
            ><span>正在等待您的回应</span>
          </div>
          <div v-else class="alert-buyerName">
            <span>您已回应</span
            ><span class="buyerName-color">{{
              allDateDetail?.bestOffer?.buyerName
            }}</span
            ><span>议价</span>
          </div>
        </template>
        <div
          class="detail-alert-info-content"
          v-if="allDateDetail?.bestOffer?.platformStatus === 'Pending'"
        >
          <span>您可在</span>
          <span class="messageValidTime-color">{{
            allDateDetail?.bestOffer?.messageValidTime
          }}</span>
          <span>或刊登结束前回应买家议价</span>
        </div>
        <div class="detail-alert-info-content" v-else>
          <span class="platformStatus-color">您的回应:</span>
          <span
            class="messageValidTime-color"
            :style="{
              color: getStatusColor(allDateDetail?.bestOffer?.platformStatus),
            }"
            >{{ allDateDetail?.bestOffer?.platformStatusName || "-" }}</span
          >
        </div>
      </gj-alert>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { getStatusColor } from "../config/index.js";

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
      getStatusColor,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
.imgsSpace {
  height: 36px;
}
</style>
