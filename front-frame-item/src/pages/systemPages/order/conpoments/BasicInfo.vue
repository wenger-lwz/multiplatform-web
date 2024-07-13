<template>
  <div class="basic-info">
    <ul class="content-wrap">
      <li class="w-30">
        <span>平台发货时间</span>
        <i>{{
          allDateDetail.platformOrderDeliveryTime
            ? utcTimeToBj(allDateDetail.platformOrderDeliveryTime)
            : "-"
        }}</i>
      </li>
      <li class="w-70">
        <span>预计最晚发货日期</span>
        <i>{{
          allDateDetail.estimateLatestDeliveryTime
            ? utcTimeToBj(allDateDetail.estimateLatestDeliveryTime)
            : "-"
        }}</i>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-30">
        <span>订单妥投时间</span>
        <i>-</i>
      </li>
      <li class="w-70">
        <span>买家留言</span>
        <i>{{ allDateDetail.buyerMessage || "-" }}</i>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-30">
        <span>预计最早发货日期</span>
        <i>{{
          allDateDetail.estimateEarliestDeliveryTime
            ? utcTimeToBj(allDateDetail.estimateEarliestDeliveryTime)
            : "-"
        }}</i>
      </li>
      <li class="w-70">
        <span>卖家备注</span>
        <i>-</i>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { utcTimeToBj } from "@pagesSystem/order/utils/orderUtil";
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
    const data = reactive({
      utcTimeToBj,
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss" scoped>
.basic-info {
  .content-wrap {
    display: flex;
    margin-bottom: 12px;
    li {
      list-style: none;
      display: flex;
      margin-right: 20px;
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      &:last-child {
        margin-right: 10px;
      }
      span {
        width: 100px;
        text-align: right;
        color: #86909c;
        margin-right: 8px;
      }
      i {
        font-style: normal;
        color: #1d2129;
      }
    }
    .w-30 {
      width: 30%;
    }
    .w-70 {
      width: 70%;
    }
  }
}
</style>
