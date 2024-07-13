<template>
  <div class="order-item">
    <div class="order-attribute">
      <span>平台订单号</span>
      <gb-text> {{ item.platformOrderId || "-" }} </gb-text>
    </div>
    <div class="order-attribute">
      <span>平台订单状态</span>
      <span
        :class="platformOrderStatus[item.platformOrderStatus]?.color || 'c-4'"
        >{{ platformOrderStatus[item.platformOrderStatus]?.name || "-" }}</span
      >
    </div>
    <div class="order-attribute">
      <span>订单付款状态</span>
      <span :class="item.paymentTime ? 'c-3' : 'c-5'">{{
        item.paymentTime ? "已付款" : "未付款"
      }}</span>
    </div>
    <div class="order-attribute">
      <span>订单取消状态</span>
      <span
        :class="orderCancelStatus[item.orderCancelStatusName]?.color || 'c-4'"
        >{{ orderCancelStatus[item.orderCancelStatusName]?.name || "-" }}</span
      >
    </div>
    <div class="order-attribute">
      <span>订单发货状态</span>
      <span
        :class="orderDliveryStatus[item.orderDliveryStatus]?.color || 'c-4'"
        >{{ orderDliveryStatus[item.orderDliveryStatus]?.name || "-" }}</span
      >
    </div>
    <div class="order-attribute">
      <span>履约方</span>
      <span class="c-4">{{ item.orderPerformingParty || "-" }}</span>
    </div>
    <div class="order-attribute flex">
      <span>物流单号</span>
      <span
        class="logistics-order"
        v-if="item.logisticsOrderNo && item.logisticsOrderNo.length"
      >
        <ColumnCopy
          v-for="logistics of item.logisticsOrderNo"
          :key="logistics"
          class="c-1"
          :isAnchor="false"
          :textValue="logistics"
        ></ColumnCopy>
      </span>
      <span v-else>-</span>
    </div>
    <div class="order-product-list">
      <div
        class="order-product-item"
        v-for="product of item.orderLines"
        :key="product.productId"
      >
        <gj-image width="62" height="62" :src="product.productMainImageUrl" />
        <div class="product-attribute">
          <gb-text> {{ product.productName || "-" }} </gb-text>
          <gb-text> {{ product.productId || "-" }} </gb-text>
          <gb-text> $ {{ product.productUnitPrice || "-" }} </gb-text>
        </div>
      </div>
    </div>
    <div class="order-money">
      <div class="order-money-item">
        <p>平台总金额</p>
        <p>买家实付款金额</p>
      </div>
      <div class="order-money-item">
        <p>$ {{ item.totalAmount || "-" }}</p>
        <p>$ {{ item.buyerPayAmount || "-" }}</p>
      </div>
    </div>
    <div style="text-align: right">
      <gj-button type="primary" size="mini">订单详情</gj-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import ColumnCopy from "@/components/columnCopy.vue";

export default {
  components: {
    ColumnCopy,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const data = reactive({
      platformOrderStatus: {
        Active: {
          color: "c-3",
          name: "未付款",
        },
        Inactive: {
          color: "c-2",
          name: "未活动",
        },
        Completed: {
          color: "c-3",
          name: "付款完成",
        },
        Cancelled: {
          color: "c-4",
          name: "已取消",
        },
        Shipped: {
          color: "c-3",
          name: "已发货",
        },
        Default: {
          color: "c-2",
          name: "未发货",
        },
        Authenticated: {
          color: "c-3",
          name: "已确认",
        },
        InProcess: {
          color: "c-2",
          name: "处理中",
        },
      },
      orderCancelStatus: {
        0: {
          color: "c-4",
          name: "未取消",
        },
        1: {
          color: "c-2",
          name: "取消中",
        },
        2: {
          color: "c-2",
          name: "部分取消",
        },
        3: {
          color: "c-3",
          name: "已取消",
        },
      },
      orderDliveryStatus: {
        0: {
          color: "c-2",
          name: "未发货",
        },
        1: {
          color: "c-3",
          name: "全部发货",
        },
        2: {
          color: "c-3",
          name: "部分发货",
        },
      },
    });

    return {
      ...toRefs(data),
    };
  },
};
</script>

<style scoped lang="scss">
.c-1 {
  color: #0045f0;
}
.c-2 {
  color: #ff7d00;
}
.c-3 {
  color: #00b42a;
}
.c-4 {
  color: #1d2129;
}
.c-5 {
  color: #f53f3f;
}
.order-title {
  position: relative;
  padding-left: 12px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #333659;
  &::after {
    content: "";
    position: absolute;
    display: block;
    top: 2px;
    left: 0;
    width: 4px;
    height: 14px;
    background: #1f6eef;
    border-radius: 1px;
  }
}
.order-attribute {
  margin-top: 8px;
  font-size: 12px;
  line-height: 18px;
  color: #86909c;
  > span:first-child {
    display: inline-block;
    width: 72px;
    margin-right: 8px;
  }
  .logistics-order {
    max-width: 150px;
    word-break: break-all;
    overflow: hidden;
  }
}
.flex {
  display: flex;
}
.order-product-list {
  padding: 12px 0;
  border-bottom: 1px solid #e5e6eb;
  .order-product-item {
    display: flex;
    align-items: center;
    .arco-image {
      margin-right: 12px;
    }
    .product-attribute {
      font-family: "PingFang SC";
      font-style: normal;
      color: #1d2129;
      font-size: 12px;
      line-height: 18px;
      .gb-text {
        display: block;
      }
      .gb-text + .gb-text {
        margin-top: 4px;
      }
    }
  }
  .order-product-item + .order-product-item {
    margin-top: 12px;
  }
}
.order-money {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 12px;
  line-height: 18px;
  margin: 8px 0;
  color: #86909c;
  .order-money-item + .order-money-item {
    margin-left: 8px;
  }
}
</style>
