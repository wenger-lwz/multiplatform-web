export default [
  {
    path: "/pubShopeeBoard",
    name: "PubShopeeBoard",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeBoard/SHPE_pubShopeeBoard",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/template/listingsTemplate/index.vue"
      ),
  },
  {
    path: "/pubShopeeLogisticsTemplate",
    name: "PubShopeeLogisticsTemplate",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeBoard/SHPE_pubShopeeLogisticsTemplate",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/template/logisticsTemplate/index.vue"
      ),
  },
  /* {
    path: '/shopeeComponentBoard',
    name: 'ShopeeComponentBoard',
    meta: {
      key: 'published/shopee/shopeeBoard/shopeeComponentBoard'
    },
    component: () => import('@pagesSystem/published/shopee/template/componentBoard/index.vue')
  }, */
  /* {
    path: '/shopeeSizeChart',
    name: 'ShopeeSizeChart',
    meta: {
      key: 'published/shopee/shopeeBoard/shopeeSizeChart'
    },
    component: () => import('@pagesSystem/published/shopee/template/sizeChart/index.vue')
  }, */
  {
    path: "/pubShopeeAutoReplenishment",
    name: "PubShopeeAutoReplenishment",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_pubShopeeAutoReplenishment",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/marketing/autoReplenishment/index.vue"
      ),
  },
  {
    path: "/searchAdvertising",
    name: "SearchAdvertising",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_searchAdvertising",
    },
    component: () =>
      import("@pagesSystem/published/shopee/marketing/searchAds/index.vue"),
  },
  {
    path: "/associatedAdvertising",
    name: "AssociatedAdvertising",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_associatedAdvertising",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/marketing/associatedAdvertising/index.vue"
      ),
  },
  {
    path: "/storeAdvertising",
    name: "StoreAdvertising",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_storeAdvertising",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/marketing/storeAdvertising/index.vue"
      ),
  },
  {
    path: "/coupons",
    name: "Coupons",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_coupons",
    },
    component: () =>
      import("@pagesSystem/published/shopee/marketing/coupons/index.vue"),
  },
  {
    path: "/discountActivity",
    name: "DiscountActivity",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_discountActivity",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/marketing/discountActivity/index.vue"
      ),
  },
  {
    path: "/suitThePreferential",
    name: "SuitThePreferential",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_suitThePreferential",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/marketing/suitThePreferential/index.vue"
      ),
  },
  {
    path: "/purchaseDiscount",
    name: "PurchaseDiscount",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_purchaseDiscount",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/marketing/purchaseDiscount/index.vue"
      ),
  },
  {
    path: "/limitedTimeToChoose",
    name: "LimitedTimeToChoose",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_limitedTimeToChoose",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/marketing/limitedTimeToChoose/index.vue"
      ),
  },
  {
    path: "/freightPromotion",
    name: "FreightPromotion",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_freightPromotion",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/marketing/freightPromotion/index.vue"
      ),
  },
  {
    path: "/focusOnTheRitual",
    name: "FocusOnTheRitual",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_focusOnTheRitual",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopee/marketing/focusOnTheRitual/index.vue"
      ),
  },
  {
    path: "/popularChoice",
    name: "PopularChoice",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeeMarketing/SHPE_popularChoice",
    },
    component: () =>
      import("@pagesSystem/published/shopee/marketing/popularChoice/index.vue"),
  },

  {
    path: "/pubShopeeDraft",
    name: "PubShopeeDraft",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeePublish/SHPE_pubShopeeDraft",
    },
    component: () =>
      import("@pagesSystem/published/shopee/publish/draft/index.vue"),
  },
  {
    path: "/pubShopeeGoodsInfo",
    name: "PubShopeeGoodsInfo",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeePublish/SHPE_pubShopeeGoodsInfo",
    },
    component: () =>
      import("@pagesSystem/published/shopee/publish/goodsInfo/index.vue"),
  },
  {
    path: "/pubShopeeGoodsInfoDetail",
    name: "pubShopeeGoodsInfoDetail",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeePublish/SHPE_pubShopeeGoodsInfoDetail",
    },
    component: () =>
      import("@pagesSystem/published/shopee/publish/goodsInfo/detail.vue"),
  },
  {
    path: "/pubShopeeOnLineGoods",
    name: "PubShopeeOnLineGoods",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeePublish/SHPE_pubShopeeOnLineGoods",
    },
    component: () =>
      import("@pagesSystem/published/shopee/publish/onLineGoods/index.vue"),
  },
  {
    path: "/pubShopeeGlobalGoods",
    name: "GlobalGoods",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeePublish/SHPE_globalGoods",
    },
    component: () =>
      import("@pagesSystem/published/shopee/publish/globalGoods/index.vue"),
  },
  {
    path: "/publicEditPage",
    name: "PublicEditPage",
    meta: {
      key: "published/shopee/shopeePublish/publicEditPage",
      typeStyle: "pageInfo",
    },
    component: () =>
      import("@pagesSystem/published/shopee/components/publicEditPage.vue"),
  },
  {
    path: "/publicEditGoodsPage",
    name: "publicEditGoodsPage",
    meta: {
      key: "published/shopee/shopeePublish/publicEditGoodsPage",
      typeStyle: "pageInfo",
    },
    component: () =>
      import("@pagesSystem/published/shopee/components/publicEditPage.vue"),
  },
  // {
  //   path: '/publicEditOnLineGoodsPage',
  //   name: 'publicEditOnLineGoodsPage',
  //   meta: {
  //     key: 'published/shopee/shopeePublish/publicEditOnLineGoodsPage',
  //     typeStyle: 'pageInfo'
  //   },
  //   component: () => import('@pagesSystem/published/shopee/components/publicEditPage.vue')
  // },
  // {
  //   path: '/publicEditGlobalGoodsPage',
  //   name: 'publicEditGlobalGoodsPage',
  //   meta: {
  //     key: 'published/shopee/shopeePublish/publicEditGlobalGoodsPage',
  //     typeStyle: 'pageInfo'
  //   },
  //   component: () => import('@pagesSystem/published/shopee/components/publicEditPage.vue')
  // },
  // {
  //   path: '/publicEditDraftPage',
  //   name: 'publicEditDraftPage',
  //   meta: {
  //     key: 'published/shopee/shopeePublish/publicEditDraftPage',
  //     typeStyle: 'pageInfo'
  //   },
  //   component: () => import('@pagesSystem/published/shopee/components/publicEditPage.vue')
  // },
  {
    path: "/pubShoppeReleaseLog",
    name: "PubShoppeReleaseLog",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeePublishLog/SHPE_pubShoppeReleaseLog",
    },
    component: () =>
      import("@pagesSystem/published/shopee/publishedLog/releaseLog/index.vue"),
  },
  {
    path: "/pubShoppeUpdateLog",
    name: "PubShoppeUpdateLog",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeePublishLog/SHPE_pubShoppeUpdateLog",
    },
    component: () =>
      import("@pagesSystem/published/shopee/publishedLog/updateLog/index.vue"),
  },
  {
    path: "/pubShopeeVideoLibrary",
    name: "PubShopeeVideoLibrary",
    meta: {
      key: "plantPublish/SHPE_shopee/SHPE_shopeePublish/SHPE_pubShopeeVideoLibrary",
    },
    component: () =>
      import("@pagesSystem/published/shopee/publish/videoLibrary/index.vue"),
  },

  // {
  //   path: '/pubShoppeListingsEdit',
  //   name: 'PubShoppeListingsEdit',
  //   meta: {
  //     key: 'plantPublish/shopee/shopeePublish/pubShoppeListingsEdit'
  //   },
  //   component: () => import('@pagesSystem/published/shopee/template/listingsTemplate/listingsEdit.vue')
  // },
  // {
  //   path: '/pubShoppeLogisticsEdit',
  //   name: 'PubShoppeLogisticsEdit',
  //   meta: {
  //     key: 'plantPublish/shopee/shopeePublish/pubShoppeLogisticsEdit'
  //   },
  //   component: () => import('@pagesSystem/published/shopee/template/logisticsTemplate/logisticsEdit.vue')
  // },
  // {
  //   path: '/pubShoppeUpdateLogDetail',
  //   name: 'PubShoppeUpdateLogDetail',
  //   meta: {
  //     key: 'plantPublish/shopee/shopeePublish/pubShoppeUpdateLogDetail'
  //   },
  //   component: () => import('@pagesSystem/published/shopee/publishedLog/updateLog/detail.vue')
  // }
];
