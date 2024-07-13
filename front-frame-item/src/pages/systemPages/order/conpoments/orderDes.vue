<template>
  <div class="order-des">
    <div class="order-title">
      <div class="title-wrap">
        <span class="title" v-if="allDateDetail.platformOrderId"
          >平台订单编号：{{ allDateDetail.platformOrderId }}</span
        >
        <!-- 平台状态各不同，且不同状态按不同颜色显示、lazada无平台状态 -->
        <gj-tag
          v-if="
            allDateDetail.platformOrderStatus &&
            allDateDetail.platformName === 'shopee'
          "
          class="status-tag"
          size="small"
          :color="getShopeePlatColor(allDateDetail?.platformOrderStatusName)"
          >{{ allDateDetail.platformOrderStatus }}</gj-tag
        >
        <gj-tag
          v-if="
            allDateDetail.platformOrderStatus &&
            allDateDetail.platformName === 'aliExpress'
          "
          class="status-tag"
          size="small"
          :color="getAliPlatColor(allDateDetail?.platformOrderStatusName)"
          >{{ allDateDetail.platformOrderStatus }}</gj-tag
        >
        <gj-tag
          v-if="
            allDateDetail.platformOrderStatus &&
            allDateDetail.platformName === 'ebay'
          "
          class="status-tag"
          size="small"
          :color="getEbayPlatColor(allDateDetail?.platformOrderStatusName)"
          >{{ allDateDetail.platformOrderStatus }}</gj-tag
        >
        <gj-tag
          v-if="
            allDateDetail.platformOrderStatus &&
            allDateDetail.platformName === 'shopify'
          "
          class="status-tag"
          size="small"
          :color="getShopifyPlatColor(allDateDetail?.platformOrderStatusName)"
          >{{ allDateDetail.platformOrderStatus }}</gj-tag
        >

        <!-- <span class="title" v-if="allDateDetail.soOrderNumber"
          >SO单号：{{ allDateDetail.soOrderNumber }}</span
        > -->
        <!-- so状态 -->
        <!-- <gj-tag
          v-if="allDateDetail?.soOrderStatus"
          :color="getSoTagStatus(allDateDetail?.soOrderStatusName)"
          size="small"
          >{{ allDateDetail.soOrderStatus }}</gj-tag
        > -->
      </div>
    </div>
    <div class="order-contents">
      <ul class="content-wrap">
        <li v-if="allDateDetail.regionName" class="w-30">
          <span class="item-label">店铺/站点</span>
          <i
            >{{ allDateDetail.erpShopName
            }}{{ "：" + allDateDetail.regionName }}</i
          >
        </li>
        <li v-else class="w-30">
          <span class="item-label">店铺</span>
          <i>{{ allDateDetail.erpShopName || "-" }}</i>
        </li>
        <li class="w-30">
          <span class="item-label">平台订单分类</span>
          <i>{{ allDateDetail.platformOrderFlag || "-" }}</i>
        </li>
        <li class="w-40">
          <span class="item-label">订单下单时间</span>
          <i>{{
            allDateDetail.orderingTime
              ? utcTimeToBj(allDateDetail.orderingTime)
              : "-"
          }}</i>
        </li>
      </ul>
      <ul class="content-wrap">
        <li class="w-30">
          <span class="item-label">订单总金额</span>
          <i v-show="allDateDetail.totalAmount"
            >{{ allDateDetail.currency }}&nbsp;
          </i>
          <i>{{ formatAmt(allDateDetail?.totalAmount) }}</i>
        </li>
        <li class="w-30">
          <span class="item-label">退款总金额</span>
          <i v-show="allDateDetail.refundedTotalAmount"
            >{{ allDateDetail.currency }}&nbsp;</i
          >
          <i>{{ formatAmt(allDateDetail?.refundedTotalAmount) }}</i>
        </li>
        <li class="w-40">
          <span class="item-label">订单付款时间</span>
          <i>{{
            allDateDetail?.paymentTime
              ? utcTimeToBj(allDateDetail?.paymentTime)
              : "-"
          }}</i>
        </li>
      </ul>
      <ul class="content-wrap">
        <li class="w-30">
          <span class="item-label">最后更新时间</span>
          <i>{{
            allDateDetail.lastUpdatedTime
              ? utcTimeToBj(allDateDetail.lastUpdatedTime)
              : "-"
          }}</i>
        </li>
        <li class="w-30">
          <span class="item-label"> 买家支付金额</span>
          <i v-show="allDateDetail.buyerPayAmount"
            >{{ allDateDetail.currency }}&nbsp;
          </i>
          <i>{{ formatAmt(allDateDetail?.buyerPayAmount) }}</i>
        </li>
        <li class="w-40">
          <span class="item-label">买家留言</span>
          <i>{{ allDateDetail.buyerMessage || "-" }}</i>
        </li>
      </ul>
    </div>
    <div class="info-steps">
      <!-- <gj-steps
        label-placement="vertical"
        :current="allDateDetail?.omsSoStatusStepDTO?.activequantity"
        :small="true"
      >
        <gj-step
          v-for="(subItem, indexs) in allDateDetail?.omsSoStatusStepDTO
            ?.soOrderStatus"
          :key="indexs"
          :title="subItem.soStatusName"
          :description="subItem.businessTime || '未完成'"
        >
        </gj-step>
      </gj-steps> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { utcTimeToBj } from "@pagesSystem/order/utils/orderUtil";
import { formatAmt } from "@/utils/format";
import {
  getSoTagStatus,
  getShopeePlatColor,
  getAliPlatColor,
  getEbayPlatColor,
  getLazadaPlatColor,
  getShopifyPlatColor,
} from "@pagesSystem/order/utils/orderUtil";

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
      formatAmt,
      getSoTagStatus,
      getShopeePlatColor,
      getAliPlatColor,
      getEbayPlatColor,
      getLazadaPlatColor,
      getShopifyPlatColor,
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss" scoped>
.order-des {
  padding-bottom: 24px;
  .order-title {
    font-size: 14px;
    padding-right: 80px;
    display: flex;
    justify-content: space-between;
    .title-wrap {
      .title {
        margin-right: 12px;
        font-weight: 700;
        color: #1d2129;
      }
      .status-tag {
        margin-right: 24px;
      }
    }
  }
  .order-contents {
    margin-top: 18px;
    .content-wrap {
      display: flex;
      font-size: 12px;
      margin-bottom: 12px;
      > li {
        list-style: none;
        display: flex;
        margin-right: 20px;
        height: 18px;
        line-height: 18px;
        font-size: 12px;
        &:last-child {
          margin-right: 10px;
        }
        .item-label {
          height: 18px;
          line-height: 18px;
          width: 100px;
          text-align: right;
          margin-right: 8px;
          color: #86909c;
        }
        i {
          font-style: normal;
          color: #1d2129;
        }
      }
      .w-30 {
        width: 30%;
      }
      .w-40 {
        width: 40%;
      }
    }
  }
  .info-steps {
    // padding: 8px 0;
    // margin-top: 16px;
    // margin-bottom: 6px;
    // background: #fafafb;
    // border-radius: 8px;
    // overflow-y: auto;
    border-bottom: 1px solid #e6e6ed;
  }
}
</style>
