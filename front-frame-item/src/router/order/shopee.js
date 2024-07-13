export default [
  // 订单管理
  // 全部订单
  {
    path: "/shopeeAllOrder",
    name: "ShopeeAllOrder",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_OrderManger/SHOPEE_AllOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopee/orderManger/allOrder.vue"),
  },
  // 订单详情
  {
    path: "/shopeeAllOrderDetail",
    name: "ShopeeAllOrderDetail",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_OrderManger/SHOPEE_AllOrderDetail",
      typeStyle: "pageInfo",
    },
    component: () =>
      import("@pagesSystem/order/shopee/orderManger/allOrderDetail.vue"),
  },
  // 创建
  {
    path: "/shopeeOrderAdd",
    name: "ShopeeOrderAdd",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_OrderManger/SHOPEE_OrderAdd",
    },
    component: () =>
      import("@pagesSystem/order/shopee/orderManger/orderAdd.vue"),
  },
  // 待处理
  {
    path: "/shopeeProcessedOrder",
    name: "ShopeeProcessedOrder",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_OrderManger/SHOPEE_ProcessedOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopee/orderManger/processedOrder.vue"),
  },

  // 发货中
  {
    path: "/shopeeDeliveryingOrder",
    name: "ShopeeDeliveryingOrder",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_OrderManger/SHOPEE_DeliveryingOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopee/orderManger/deliveryingOrder.vue"),
  },
  // 部分已发货
  {
    path: "/shopeePartShippedOrder",
    name: "ShopeePartShippedOrder",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_OrderManger/SHOPEE_PartShippedOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopee/orderManger/partShippedOrder.vue"),
  },
  // 已发货
  {
    path: "/shopeeShippedOrder",
    name: "ShopeeShippedOrder",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_OrderManger/SHOPEE_ShippedOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopee/orderManger/shippedOrder.vue"),
  },
  // 已取消
  {
    path: "/shopeeCancelOrder",
    name: "ShopeeCancelOrder",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_OrderManger/SHOPEE_CancelOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopee/orderManger/cancelOrder.vue"),
  },
  // 异常订单
  // 匹配异常
  {
    path: "/shopeeMatchAnomalous",
    name: "ShopeeMatchAnomalous",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_AnomalousOrder/SHOPEE_MatchAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/shopee/anomalousOrder/matchAnomalous.vue"),
  },
  // 缺货异常
  {
    path: "/shopeeShortAnomalous",
    name: "ShopeeShortAnomalous",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_AnomalousOrder/SHOPEE_ShortAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/shopee/anomalousOrder/shortAnomalous.vue"),
  },
  // 发货异常
  {
    path: "/shopeeSendAnomalous",
    name: "ShopeeSendAnomalous",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_AnomalousOrder/SHOPEE_SendAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/shopee/anomalousOrder/sendAnomalous.vue"),
  },
  // 物流异常
  {
    path: "/shopeeLogisticsAnomalous",
    name: "ShopeeLogisticsAnomalous",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_AnomalousOrder/SHOPEE_LogisticsAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/shopee/anomalousOrder/logisticsAnomalous.vue"),
  },
  // 售后订单
  // 客服订单
  {
    path: "/shopeeCrmOrder",
    name: "ShopeeCrmOrder",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_AfterSalesOrder/SHOPEE_CrmOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopee/afterSalesOrder/crmOrder.vue"),
  },
  // 退款退货订单
  {
    path: "/shopeeReturnOrder",
    name: "ShopeeReturnOrder",
    meta: {
      key: "PLAT_Order/SHOPEE_Order/SHOPEE_AfterSalesOrder/SHOPEE_ReturnOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopee/afterSalesOrder/returnOrder.vue"),
  },
];
