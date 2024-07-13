export default [
  {
    path: "/lazadaBuyerComments",
    name: "LazadaBuyerComments",
    meta: {
      key: "PLAT_customerLZD_/lazadaBuyerComments",
    },
    component: () =>
      import(
        "@pagesSystem/customerService/lazada/listPage/lazadaBuyerComments.vue"
      ),
  },
  {
    path: "/lazadaCustomerService",
    name: "lazadaCustomerService",
    meta: {
      key: "PLAT_CustomerService/lazada/lazadaCustomerService",
    },
    component: () =>
      import("@pagesSystem/customerService/lazada/customerService.vue"),
  },
];
