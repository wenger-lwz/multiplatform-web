export default [
  {
    path: "/eBayBuyerBargaining", //退货/退款
    name: "EBayBuyerBargaining",
    meta: {
      key: "PLAT_customerEbay/eBayBuyerBargaining",
    },
    component: () =>
      import(
        "@pagesSystem/customerService/eBay/listPage/eBayBuyerBargaining.vue"
      ),
  },
];
