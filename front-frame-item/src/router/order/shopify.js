export default [
  // 订单管理
  // 全部订单
  {
    path: "/shopifyAllOrder",
    name: "ShopifyAllOrder",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_OrderManger/SHOPIFY_AllOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopify/orderManger/allOrder.vue"),
  },
  // 订单详情
  {
    path: "/shopifyAllOrderDetail",
    name: "ShopifyAllOrderDetail",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_OrderManger/SHOPIFY_AllOrderDetail",
      typeStyle: "pageInfo",
    },
    component: () =>
      import("@pagesSystem/order/shopify/orderManger/allOrderDetail.vue"),
  },
  // 创建
  {
    path: "/shopifyOrderAdd",
    name: "ShopifyOrderAdd",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_OrderManger/SHOPIFY_OrderAdd",
    },
    component: () =>
      import("@pagesSystem/order/shopify/orderManger/orderAdd.vue"),
  },
  // 待处理
  {
    path: "/shopifyProcessedOrder",
    name: "ShopifyProcessedOrder",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_OrderManger/SHOPIFY_ProcessedOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopify/orderManger/processedOrder.vue"),
  },

  // 发货中
  {
    path: "/shopifyDeliveryingOrder",
    name: "ShopifyDeliveryingOrder",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_OrderManger/SHOPIFY_DeliveryingOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopify/orderManger/deliveryingOrder.vue"),
  },
  // 部分已发货
  {
    path: "/shopifyPartShippedOrder",
    name: "ShopifyPartShippedOrder",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_OrderManger/SHOPIFY_PartShippedOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopify/orderManger/partShippedOrder.vue"),
  },
  // 已发货
  {
    path: "/shopifyShippedOrder",
    name: "ShopifyShippedOrder",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_OrderManger/SHOPIFY_ShippedOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopify/orderManger/shippedOrder.vue"),
  },
  // 已取消
  {
    path: "/shopifyCancelOrder",
    name: "ShopifyCancelOrder",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_OrderManger/SHOPIFY_CancelOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopify/orderManger/cancelOrder.vue"),
  },
  // 异常订单
  // 匹配异常
  {
    path: "/shopifyMatchAnomalous",
    name: "ShopifyMatchAnomalous",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_AnomalousOrder/SHOPIFY_MatchAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/shopify/anomalousOrder/matchAnomalous.vue"),
  },
  // 缺货异常
  {
    path: "/shopifyShortAnomalous",
    name: "ShopifyShortAnomalous",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_AnomalousOrder/SHOPIFY_ShortAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/shopify/anomalousOrder/shortAnomalous.vue"),
  },
  // 发货异常
  {
    path: "/shopifySendAnomalous",
    name: "ShopifySendAnomalous",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_AnomalousOrder/SHOPIFY_SendAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/shopify/anomalousOrder/sendAnomalous.vue"),
  },
  // 物流异常
  {
    path: "/shopifyLogisticsAnomalous",
    name: "ShopifyLogisticsAnomalous",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_AnomalousOrder/SHOPIFY_LogisticsAnomalous",
    },
    component: () =>
      import(
        "@pagesSystem/order/shopify/anomalousOrder/logisticsAnomalous.vue"
      ),
  },
  // 售后订单
  // 客服订单
  {
    path: "/shopifyCrmOrder",
    name: "ShopifyCrmOrder",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_AfterSalesOrder/SHOPIFY_CrmOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopify/afterSalesOrder/crmOrder.vue"),
  },
  // 退款退货订单
  {
    path: "/shopifyReturnOrder",
    name: "ShopifyReturnOrder",
    meta: {
      key: "PLAT_Order/SHOPIFY_Order/SHOPIFY_AfterSalesOrder/SHOPIFY_ReturnOrder",
    },
    component: () =>
      import("@pagesSystem/order/shopify/afterSalesOrder/returnOrder.vue"),
  },
];
