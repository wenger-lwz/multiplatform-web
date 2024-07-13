export default [
  // // 刊登模板
  // {
  //   path: "/pubAliBoard",
  //   name: "PubAliBoard",
  //   meta: {
  //     key: "ALI_pubAliBoard",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aliExpressBoard/pubAliBoard.vue"
  //     ),
  // },

  // 组件刊登模板
  {
    path: "/pubAliComponentBoard",
    name: "PubAliComponentBoard",
    meta: {
      key: "ALI_pubAliComponentBoard",
    },
    component: () =>
      import(
        "@/pages/systemPages/published/aliExpress/aliExpressBoard/pubAliComponentBoard"
      ),
  },

  // // 编辑模板
  // {
  //   path: "/pubAliEditTempalte",
  //   name: "PubAliEditTempalte",
  //   meta: {
  //     key: "ALI_pubAliEditTempalte",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aliExpressBoard/pubAliEditTempalte.vue"
  //     ),
  // },

  // // 编辑组件模板
  // {
  //   path: "/pubAliEditComponent",
  //   name: "PubAliEditComponent",
  //   meta: {
  //     key: "ALI_pubAliEditComponent",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aliExpressBoard/pubAliEditComponent.vue"
  //     ),
  // },
  // {
  //   path: "/pubAliInfoBoard",
  //   name: "PubAliInfoBoard",
  //   meta: {
  //     key: "ALI_pubAliInfoBoard",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aliExpressBoard/pubAliInfoBoard.vue"
  //     ),
  // },
  // {
  //   path: "/multiAttributeBoard",
  //   name: "MultiAttributeBoard",
  //   meta: {
  //     key: "ALI_multiAttributeBoard",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aliExpressBoard/multiAttributeBoard.vue"
  //     ),
  // },
  // {
  //   path: "/autoCompatibleBoard",
  //   name: "AutoCompatibleBoard",
  //   meta: {
  //     key: "ALI_autoCompatibleBoard",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aliExpressBoard/autoCompatibleBoard.vue"
  //     ),
  // },
  // {
  //   path: "/packagingAndLogisticsBoard",
  //   name: "PackagingAndLogisticsBoard",
  //   meta: {
  //     key: "ALI_packagingAndLogisticsBoard",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aliExpressBoard/packagingAndLogisticsBoard.vue"
  //     ),
  // },
  // {
  //   path: "/productPropertyBoard",
  //   name: "ProductPropertyBoard",
  //   meta: {
  //     key: "ALI_productPropertyBoard",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aliExpressBoard/productPropertyBoard.vue"
  //     ),
  // },
  // {
  //   path: "/aLiSizeChart",
  //   name: "ALiSizeChart",
  //   meta: {
  //     key: "ALI_aLiSizeChart",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aliExpressBoard/aLiSizeChart.vue"
  //     ),
  // },
  // {
  //   path: "/pubAliAutoReplenishment",
  //   name: "pubAliAutoReplenishment",
  //   meta: {
  //     key: "ALI_pubAliAutoReplenishment",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aLiMarketing/pubAliAutoReplenishment.vue"
  //     ),
  // },

  // 刊登草稿
  {
    path: "/pubAliDraft",
    name: "PubAliDraft",
    meta: {
      key: "ALI_pubAliDraft",
    },
    component: () =>
      import("@/pages/systemPages/published/aliExpress/aLipublish/pubAliDraft"),
  },

  // 商品资料
  {
    path: "/pubAliGoodsInfo",
    name: "PubAliGoodsInfo",
    meta: {
      key: "ALI_pubAliGoodsInfo",
    },
    component: () =>
      import(
        "@/pages/systemPages/published/aliExpress/aLipublish/pubAliGoodsInfo"
      ),
  },

  // // 编辑、创建商品资料
  // {
  //   path: "/aliPublicEditPage",
  //   name: "AliPublicEditPage",
  //   meta: {
  //     key: "ALI_aliPublicEditPage",
  //     typeStyle: "pageInfo",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aLipublish/aliPublicEditPage"
  //     ),
  // },

  // // 编辑、创建刊登草稿
  // {
  //   path: "/aliPublicEditDraftPage",
  //   name: "AliPublicEditDraftPage",
  //   meta: {
  //     key: "ALI_aliPublicEditDraftPage",
  //     typeStyle: "pageInfo",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aLipublish/aliPublicEditDraftPage"
  //     ),
  // },
  // // 编辑无线端详描
  // {
  //   path: "/aliPublicWirelessPage",
  //   name: "AliPublicWirelessPage",
  //   meta: {
  //     key: "ALI_aliPublicWirelessPage",
  //     typeStyle: "pageInfo",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aLipublish/aliPublicEditDraftPage/wireless"
  //     ),
  // },

  //在线商品
  {
    path: "/pubAliOnLineGoods",
    name: "PubAliOnLineGoods",
    meta: {
      key: "ALI_pubAliOnLineGoods",
    },
    component: () =>
      import(
        "@/pages/systemPages/published/aliExpress/aLipublish/pubAliOnLineGoods"
      ),
  },

  // // 在线商品详情
  // {
  //   path: "/pubAliOnlineDetails",
  //   name: "PubAliOnlineDetails",
  //   meta: {
  //     key: "ALI_pubAliOnlineDetails",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aLipublish/pubAliOnlineDetails.vue"
  //     ),
  // },

  {
    path: "/pubAliReleaseLog",
    name: "PubAliReleaseLog",
    meta: {
      key: "ALI_pubAliReleaseLog",
    },
    component: () =>
      import(
        "@/pages/systemPages/published/aliExpress/aLipublish/publishLog/pubAliReleaseLog.vue"
      ),
  },
  {
    path: "/pubAliUpdateLog",
    name: "PubAliUpdateLog",
    meta: {
      key: "ALI_pubAliUpdateLog",
    },
    component: () =>
      import(
        "@/pages/systemPages/published/aliExpress/aLipublish/publishLog/pubAliUpdateLog.vue"
      ),
  },
  // {
  //   path: "/pubAliUpdateLogDetail",
  //   name: "PubAliUpdateLogDetail",
  //   meta: {
  //     key: "published/aliExpress/aLipublish/pubAliUpdateLogDetail",
  //   },
  //   component: () =>
  //     import(
  //       "@/pages/systemPages/published/aliExpress/aLipublish/pubAliUpdateLogDetail"
  //     ),
  // },

  // 营销
  {
    path: "/pubItemDiscount",
    name: "PubItemDiscount",
    meta: {
      key: "ALI_pubItemDiscount",
    },
    component: () =>
      import(
        "@/pages/systemPages/published/aliExpress/aLiMarketing/itemDiscount"
      ),
  },
];
