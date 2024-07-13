export default [
  // 订单管理
  // 全部订单
  {
    path: "/lazadaAllOrder",
    name: "LazadaAllOrder",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_OrderManger/LAZADA_AllOrder",
    },
    component: () =>
      import("@pagesSystem/order/lazada/orderManger/allOrder.vue"),
  },
  // 订单详情
  {
    path: "/lazadaAllOrderDetail",
    name: "LazadaAllOrderDetail",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_OrderManger/LAZADA_AllOrderDetail",
      typeStyle: "pageInfo",
    },
    component: () =>
      import("@pagesSystem/order/lazada/orderManger/allOrderDetail.vue"),
  },
  // 创建
  {
    path: "/lazadaOrderAdd",
    name: "LazadaOrderAdd",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_OrderManger/LAZADA_OrderAdd",
    },
    component: () =>
      import("@pagesSystem/order/lazada/orderManger/orderAdd.vue"),
  },
  // 待处理
  {
    path: "/lazadaProcessedOrder",
    name: "LazadaProcessedOrder",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_OrderManger/LAZADA_ProcessedOrder",
    },
    component: () =>
      import("@pagesSystem/order/lazada/orderManger/processedOrder.vue"),
  },

  // 发货中
  {
    path: "/lazadaDeliveryingOrder",
    name: "LazadaDeliveryingOrder",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_OrderManger/LAZADA_DeliveryingOrder",
    },
    component: () =>
      import("@pagesSystem/order/lazada/orderManger/deliveryingOrder.vue"),
  },
  // 部分已发货
  {
    path: "/lazadaPartShippedOrder",
    name: "LazadaPartShippedOrder",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_OrderManger/LAZADA_PartShippedOrder",
    },
    component: () =>
      import("@pagesSystem/order/lazada/orderManger/partShippedOrder.vue"),
  },
  // 已发货
  {
    path: "/lazadaShippedOrder",
    name: "LazadaShippedOrder",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_OrderManger/LAZADA_ShippedOrder",
    },
    component: () =>
      import("@pagesSystem/order/lazada/orderManger/shippedOrder.vue"),
  },
  // 已取消
  {
    path: "/lazadaCancelOrder",
    name: "LazadaCancelOrder",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_OrderManger/LAZADA_CancelOrder",
    },
    component: () =>
      import("@pagesSystem/order/lazada/orderManger/cancelOrder.vue"),
  },
  // 异常订单
  // 匹配异常
  {
    path: "/lazadaMatchAnomalous",
    name: "LazadaMatchAnomalous",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_AnomalousOrder/LAZADA_MatchAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/lazada/anomalousOrder/matchAnomalous.vue"),
  },
  // 缺货异常
  {
    path: "/lazadaShortAnomalous",
    name: "LazadaShortAnomalous",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_AnomalousOrder/LAZADA_ShortAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/lazada/anomalousOrder/shortAnomalous.vue"),
  },
  // 发货异常
  {
    path: "/lazadaSendAnomalous",
    name: "LazadaSendAnomalous",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_AnomalousOrder/LAZADA_SendAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/lazada/anomalousOrder/sendAnomalous.vue"),
  },
  // 物流异常
  {
    path: "/lazadaLogisticsAnomalous",
    name: "LazadaLogisticsAnomalous",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_AnomalousOrder/LAZADA_LogisticsAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/lazada/anomalousOrder/logisticsAnomalous.vue"),
  },
  // 售后订单
  // 客服订单
  {
    path: "/lazadaCrmOrder",
    name: "LazadaCrmOrder",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_AfterSalesOrder/LAZADA_CrmOrder",
    },
    component: () =>
      import("@pagesSystem/order/lazada/afterSalesOrder/crmOrder.vue"),
  },
  // 退款退货订单
  {
    path: "/lazadaReturnOrder",
    name: "LazadaReturnOrder",
    meta: {
      key: "PLAT_Order/LAZADA_Order/LAZADA_AfterSalesOrder/LAZADA_ReturnOrder",
    },
    component: () =>
      import("@pagesSystem/order/lazada/afterSalesOrder/returnOrder.vue"),
  },
];
