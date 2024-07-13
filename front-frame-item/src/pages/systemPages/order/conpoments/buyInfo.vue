<template>
  <div class="buyer-info">
    <ul class="content-wrap">
      <li class="w-30">
        <span>买家ID</span>
        <i>{{ allDateDetail.buyerAccountId || "-" }}</i>
      </li>
      <li class="w-30">
        <span>邮箱</span>
        <i>{{ allDateDetail.buyerAccountEmail || "-" }}</i>
      </li>
      <li class="w-40">
        <span>买家税号</span>
        <i>{{ allDateDetail.buyerTaxNumber || "-" }}</i>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-30">
        <span>收件人姓名</span>
        <i>{{ allDateDetail.receiverName || "-" }}</i>
      </li>
      <li class="w-30">
        <span>收件人电话</span>
        <i>{{ allDateDetail.receiverPhone || "-" }}</i>
      </li>
      <li class="w-40">
        <span>收件人手机</span>
        <i>{{ allDateDetail.receiverMobilePhone || "-" }}</i>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-30">
        <span>收件人邮编</span>
        <i>{{ allDateDetail.receiverAddressPostCode || "-" }}</i>
      </li>
      <li class="w-30">
        <span>国家</span>
        <i>{{ allDateDetail.receiverAddressCountry || "-" }}</i>
      </li>
      <li class="w-40">
        <span>省/州</span>
        <i>{{ allDateDetail.receiverAddressState || "-" }}</i>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-30 mr-10">
        <span>城市</span>
        <i>{{ allDateDetail.receiverAddressCity || "-" }}</i>
      </li>
      <li class="w-70">
        <span>区</span>
        <i>{{ allDateDetail.receiverAddressArea || "-" }}</i>
      </li>
    </ul>
    <ul class="content-wrap">
      <li>
        <span>详细地址1</span>
        <i>{{ allDateDetail.receiverAddressDetail1 || "-" }} </i>
      </li>
    </ul>
    <ul class="content-wrap">
      <li>
        <span>详细地址2</span>
        <i>{{ allDateDetail.receiverAddressDetail2 || "-" }} </i>
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
.buyer-info {
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
    .w-25 {
      width: 25%;
    }
    .w-30 {
      width: 30%;
    }
    .w-40 {
      width: 40%;
    }
    .w-70 {
      width: 70%;
    }
    .mr-10 {
      margin-right: 10px;
    }
  }
}
</style>
