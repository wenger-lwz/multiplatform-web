<template>
  <div class="order-details">
    <div class="order-details-header">
      <gj-image width="62" :src="selectedValue.itemImgUrl" />
      <div class="details-attribute-name">
        <p>产品名称</p>
        <p>产品ID</p>
        <p>产品名称</p>
      </div>
      <div class="details-attribute-vlaue">
        <gb-text>{{ selectedValue.itemName }}</gb-text>
        <gb-text>{{ selectedValue.itemId }}</gb-text>
        <gb-text>$ {{ selectedValue.itemPrice }}</gb-text>
      </div>
    </div>
    <gj-tabs default-active-key="1">
      <gj-tab-pane key="1" title="订单">
        <div class="order-title">最新订单</div>
        <OrderItem v-if="orderList[0]" :item="orderList[0]"></OrderItem>
        <div v-if="orderList.length > 1">
          <div class="order-title">历史订单</div>
          <div class="history-orderList">
            <OrderItem
              v-for="item of orderList.splice(1, orderList.length - 1)"
              :key="item.id"
              :item="item"
            ></OrderItem>
          </div>
        </div>
      </gj-tab-pane>
      <gj-tab-pane key="2" title="议价">
        <BargainingItem
          v-if="bargainingList[0]"
          :item="bargainingList[0]"
        ></BargainingItem>
      </gj-tab-pane>
    </gj-tabs>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { getOrder, getDiscussPriceList } from "@/api/customerService/eBay-zh";
import OrderItem from "./orderItem.vue";
import BargainingItem from "./bargainingItem.vue";

export default {
  components: {
    OrderItem,
    BargainingItem,
  },
  props: {
    selectedValue: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const data = reactive({
      orderList: [],
      bargainingList: [],
    });
    // getOrder(props.selectedValue.sessionId).then((res) => {

    const getOrderList = () => {
      getOrder("1514144206409924610").then((res) => {
        data.orderList = res.data.records;
      });
    };

    const getBargainingList = () => {
      getDiscussPriceList({
        bestOfferHanlerStatus: 0,
        buyerName: "chena_3200",
        erpShopId: "1485451199615721473",
        itemIds: ["384856213125"],
        pageCurrent: 0,
        pageSize: 10,
      }).then((res) => {
        data.bargainingList = res.data.records;
      });
    };

    getOrderList();
    getBargainingList();

    return {
      ...toRefs(data),
    };
  },
};
</script>

<style scoped lang="scss">
::v-deep .arco-tabs {
  height: calc(100% - 103px);
}
::v-deep .arco-tabs-content {
  padding: 12px 20px;
  max-width: 270px;
  height: calc(100% - 41px);
  overflow-y: auto;
}

.order-details {
  max-width: 270px;
  min-width: 270px;
  height: 100%;
  border-left: 1px solid #c9cdd4;
  overflow: hidden;
  font-family: "PingFang SC";
  .order-details-header {
    display: flex;
    align-items: center;
    padding: 20px;
    font-size: 12px;
    border-bottom: 1px solid #e5e6eb;
    .details-attribute-name {
      p + p {
        margin-top: 8px;
      }
    }
    .details-attribute-name {
      min-width: 48px;
      color: #86909c;
      margin-left: 12px;
      margin-right: 8px;
    }
    .details-attribute-vlaue {
      color: #1d2129;
      .gb-text {
        display: block;
      }
      .gb-text + .gb-text {
        margin-top: 8px;
      }
      .gb-text:first-child {
        color: #0045f0;
      }
    }
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
}
</style>
