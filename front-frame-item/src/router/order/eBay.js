export default [
  // 订单管理
  // 全部订单
  {
    path: "/eBayAllOrder",
    name: "EBayAllOrder",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_OrderManger/EBAY_AllOrder",
    },
    component: () => import("@pagesSystem/order/eBay/orderManger/allOrder.vue"),
  },
  // 订单详情
  {
    path: "/eBayAllOrderDetail",
    name: "EBayAllOrderDetail",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_OrderManger/EBAY_AllOrderDetail",
      typeStyle: "pageInfo",
    },
    component: () =>
      import("@pagesSystem/order/eBay/orderManger/allOrderDetail.vue"),
  },
  // 创建
  {
    path: "/eBayOrderAdd",
    name: "EBayOrderAdd",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_OrderManger/EBAY_OrderAdd",
    },
    component: () => import("@pagesSystem/order/eBay/orderManger/orderAdd.vue"),
  },
  // 待处理
  {
    path: "/eBayProcessedOrder",
    name: "EBayProcessedOrder",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_OrderManger/EBAY_ProcessedOrder",
    },
    component: () =>
      import("@pagesSystem/order/eBay/orderManger/processedOrder.vue"),
  },
  // 发货中
  {
    path: "/eBayDeliveryingOrder",
    name: "EBayDeliveryingOrder",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_OrderManger/EBAY_DeliveryingOrder",
    },
    component: () =>
      import("@pagesSystem/order/eBay/orderManger/deliveryingOrder.vue"),
  },
  // 部分已发货
  {
    path: "/eBayPartShippedOrder",
    name: "EBayPartShippedOrder",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_OrderManger/EBAY_PartShippedOrder",
    },
    component: () =>
      import("@pagesSystem/order/eBay/orderManger/partShippedOrder.vue"),
  },
  // 已发货
  {
    path: "/eBayShippedOrder",
    name: "EBayShippedOrder",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_OrderManger/EBAY_ShippedOrder",
    },
    component: () =>
      import("@pagesSystem/order/eBay/orderManger/shippedOrder.vue"),
  },
  // 已取消
  {
    path: "/eBayCancelOrder",
    name: "EBayCancelOrder",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_OrderManger/EBAY_CancelOrder",
    },
    component: () =>
      import("@pagesSystem/order/eBay/orderManger/cancelOrder.vue"),
  },
  // 异常订单
  // 匹配异常
  {
    path: "/eBayMatchAnomalous",
    name: "EBayMatchAnomalous",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_AnomalousOrder/EBAY_MatchAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/eBay/anomalousOrder/matchAnomalous.vue"),
  },
  // 缺货异常
  {
    path: "/eBayShortAnomalous",
    name: "EBayShortAnomalous",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_AnomalousOrder/EBAY_ShortAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/eBay/anomalousOrder/shortAnomalous.vue"),
  },
  // 发货异常
  {
    path: "/eBaySendAnomalous",
    name: "EBaySendAnomalous",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_AnomalousOrder/EBAY_SendAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/eBay/anomalousOrder/sendAnomalous.vue"),
  },
  // 物流异常
  {
    path: "/eBayLogisticsAnomalous",
    name: "EBayLogisticsAnomalous",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_AnomalousOrder/EBAY_LogisticsAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/eBay/anomalousOrder/logisticsAnomalous.vue"),
  },
  // 售后订单
  // 客服订单
  {
    path: "/eBayCrmOrder",
    name: "EBayCrmOrder",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_AfterSalesOrder/EBAY_CrmOrder",
    },
    component: () =>
      import("@pagesSystem/order/eBay/afterSalesOrder/crmOrder.vue"),
  },
  // 退款退货订单
  {
    path: "/eBayReturnOrder",
    name: "EBayReturnOrder",
    meta: {
      key: "PLAT_Order/EBAY_Order/EBAY_AfterSalesOrder/EBAY_ReturnOrder",
    },
    component: () =>
      import("@pagesSystem/order/eBay/afterSalesOrder/returnOrder.vue"),
  },
];
