export default [
  {
    path: "/shopeeReturnOrRefund", //退货/退款
    name: "ShopeeReturnOrRefund",
    meta: {
      key: "PLAT_customerSHPE/shopeeReturnOrRefund",
    },
    component: () =>
      import(
        "@pagesSystem/customerService/shopee/shopeeReturnOrRefundPage/index.vue"
      ),
  },
  {
    path: "/shopeeBuyerCancellation", //买家取消
    name: "ShopeeBuyerCancellation",
    meta: {
      key: "PLAT_customerSHPE/shopeeBuyerCancellation",
    },
    component: () =>
      import(
        "@pagesSystem/customerService/shopee/shopeeBuyerCancellationPage/index.vue"
      ),
  },
  {
    path: "/shopeeStoreEvaluation", //商店评价
    name: "ShopeeStoreEvaluation",
    meta: {
      key: "PLAT_customerSHPE/shopeeStoreEvaluation",
    },
    component: () =>
      import(
        "@pagesSystem/customerService/shopee/shopeeStoreEvaluationPage/index.vue"
      ),
  },
];
