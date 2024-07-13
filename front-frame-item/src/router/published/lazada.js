export default [
  {
    path: "/pubLazadaBoard",
    name: "PubLazadaBoard",
    meta: {
      key: "plantPublish/LZD_lazada/LZD_lazadaBoard/LZD_pubLazadaBoard",
    },
    component: () =>
      import("@pagesSystem/published/lazada/template/ListingsTemplate.vue"),
  },
  /*
  {
    path: '/flexiCombo',
    name: 'FlexiCombo',
    meta: {
      key: 'published/lazada/lazadaMarketing/flexiCombo'
    },
    component: () => import('@pagesSystem/published/lazada/lazadaMarketing/flexiCombo.vue')
  },
  {
    path: '/flexiComboDetail',
    name: 'FlexiComboDetail',
    meta: {
      key: 'published/lazada/lazadaMarketing/flexiCombo/flexiComboDetail',
      typeStyle: 'pageInfo'
    },
    component: () => import('@pagesSystem/published/lazada/lazadaMarketing/flexiComboDetail.vue')
  },
  {
    path: '/lazadaCoupons',
    name: 'LazadaCoupons',
    meta: {
      key: 'published/lazada/lazadaMarketing/lazadaCoupons'
    },
    component: () => import('@pagesSystem/published/lazada/lazadaMarketing/lazadaCoupons.vue')
  },
  {
    path: '/lazadaCouponsDetail',
    name: 'LazadaCouponsDetail',
    meta: {
      key: 'published/lazada/lazadaMarketing/lazadaCoupons/lazadaCouponsDetail',
      typeStyle: 'pageInfo'
    },
    component: () => import('@pagesSystem/published/lazada/lazadaMarketing/lazadaCouponsDetail.vue')
  },
  {
    path: '/freeShipping',
    name: 'FreeShipping',
    meta: {
      key: 'published/lazada/lazadaMarketing/freeShipping'
    },
    component: () => import('@pagesSystem/published/lazada/lazadaMarketing/freeShipping.vue')
  },
  {
    path: '/freeShippingDetail',
    name: 'FreeShippingDetail',
    meta: {
      key: 'published/lazada/lazadaMarketing/freeShipping/freeShippingDetail',
      typeStyle: 'pageInfo'
    },
    component: () => import('@pagesSystem/published/lazada/lazadaMarketing/freeShippingDetail.vue')
  }, */
  {
    path: "/commodityInformation",
    name: "LZD_CommodityInformation",
    meta: {
      key: "plantPublish/LZD_lazada/LZD_lazadaPublish/LZD_commodityInformation",
    },
    component: () =>
      import("@pagesSystem/published/lazada/listings/CommodityInformation.vue"),
  },
  {
    path: "/publishedDraft",
    name: "LZD_PublishedDraft",
    meta: {
      key: "plantPublish/LZD_lazada/LZD_lazadaPublish/LZD_publishedDraft",
    },
    component: () =>
      import("@pagesSystem/published/lazada/listings/PublishedDraft.vue"),
  },
  {
    path: "/commodityOnLine",
    name: "LZD_CommodityOnLine",
    meta: {
      key: "plantPublish/LZD_lazada/LZD_lazadaPublish/LZD_commodityOnLine",
    },
    component: () =>
      import("@pagesSystem/published/lazada/listings/CommodityOnLine.vue"),
  },
  {
    path: "/commodityCrossBorder",
    name: "LZD_CommodityCrossBorder",
    meta: {
      key: "plantPublish/LZD_lazada/LZD_lazadaPublish/LZD_commodityCrossBorder",
    },
    component: () =>
      import("@pagesSystem/published/lazada/listings/CommodityCrossBorder.vue"),
  },

  {
    path: "/pubLazadaVideoLibrary",
    name: "LZD_PubLazadaVideoLibrary",
    meta: {
      key: "plantPublish/LZD_lazada/LZD_lazadaPublish/LZD_PubLazadaVideoLibrary",
    },
    component: () =>
      import("@pagesSystem/published/lazada/videoLibrary/index.vue"),
  },

  {
    path: "/pubLazadaReleaseLog",
    name: "PubLazadaReleaseLog",
    meta: {
      key: "plantPublish/LZD_lazada/LZD_pubLazadaLishLog/LZD_pubLazadaReleaseLog",
    },
    component: () =>
      import(
        "@pagesSystem/published/lazada/listingsLog/PubLazadaReleaseLog.vue"
      ),
  },
  {
    path: "/pubLazadaUpdateLog",
    name: "PubLazadaUpdateLog",
    meta: {
      key: "plantPublish/LZD_lazada/LZD_pubLazadaLishLog/LZD_pubLazadaUpdateLog",
    },
    component: () =>
      import(
        "@pagesSystem/published/lazada/listingsLog/PubLazadaUpdateLog.vue"
      ),
  },
];
