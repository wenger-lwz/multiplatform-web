export default [
  // 订单管理
  // 全部订单
  {
    path: "/aliAllOrder",
    name: "AliAllOrder",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_OrderManger/ALI_AllOrder",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/orderManger/allOrder.vue"),
  },
  // 订单详情
  {
    path: "/aliAllOrderDetail",
    name: "AliAllOrderDetail",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_OrderManger/ALI_AllOrderDetail",
      typeStyle: "pageInfo",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/orderManger/allOrderDetail.vue"),
  },
  // 创建
  {
    path: "/aliOrderAdd",
    name: "AliOrderAdd",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_OrderManger/ALI_OrderAdd",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/orderManger/orderAdd.vue"),
  },
  // 待处理
  {
    path: "/aliProcessedOrder",
    name: "AliProcessedOrder",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_OrderManger/ALI_ProcessedOrder",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/orderManger/processedOrder.vue"),
  },

  // 发货中
  {
    path: "/aliDeliveryingOrder",
    name: "AliDeliveryingOrder",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_OrderManger/ALI_DeliveryingOrder",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/orderManger/deliveryingOrder.vue"),
  },
  // 部分已发货
  {
    path: "/aliPartShippedOrder",
    name: "AliPartShippedOrder",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_OrderManger/ALI_PartShippedOrder",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/orderManger/partShippedOrder.vue"),
  },
  // 已发货
  {
    path: "/aliShippedOrder",
    name: "AliShippedOrder",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_OrderManger/ALI_ShippedOrder",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/orderManger/shippedOrder.vue"),
  },
  // 已取消
  {
    path: "/aliCancelOrder",
    name: "AliCancelOrder",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_OrderManger/ALI_CancelOrder",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/orderManger/cancelOrder.vue"),
  },
  // 异常订单
  // 匹配异常
  {
    path: "/aliMatchAnomalous",
    name: "AliMatchAnomalous",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_AnomalousOrder/ALI_MatchAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/anomalousOrder/matchAnomalous.vue"),
  },
  // 缺货异常
  {
    path: "/aliShortAnomalous",
    name: "AliShortAnomalous",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_AnomalousOrder/ALI_ShortAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/anomalousOrder/shortAnomalous.vue"),
  },
  // 发货异常
  {
    path: "/aliSendAnomalous",
    name: "AliSendAnomalous",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_AnomalousOrder/ALI_SendAnomalous",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/anomalousOrder/sendAnomalous.vue"),
  },
  // 物流异常
  {
    path: "/aliLogisticsAnomalous",
    name: "AliLogisticsAnomalous",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_AnomalousOrder/ALI_LogisticsAnomalous",
    },
    component: () =>
      import(
        "@pagesSystem/order/aliExpress/anomalousOrder/logisticsAnomalous.vue"
      ),
  },
  // 售后订单
  // 客服订单
  {
    path: "/aliCrmOrder",
    name: "AliCrmOrder",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_AfterSalesOrder/ALI_CrmOrder",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/afterSalesOrder/crmOrder.vue"),
  },
  // 退款退货订单
  {
    path: "/aliReturnOrder",
    name: "AliReturnOrder",
    meta: {
      key: "PLAT_Order/ALI_Order/ALI_AfterSalesOrder/ALI_ReturnOrder",
    },
    component: () =>
      import("@pagesSystem/order/aliExpress/afterSalesOrder/returnOrder.vue"),
  },
];
