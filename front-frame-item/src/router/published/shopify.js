export default [
  {
    path: "/pubShopifyGoodsInfo",
    name: "PubShopifyGoodsInfo",
    component: () =>
      import("@pagesSystem/published/shopify/listings/index.vue"),
  },
  {
    path: "/pubShopifyDraft",
    name: "PubShopifyDraft",
    component: () => import("@pagesSystem/published/shopify/draft/index.vue"),
  },
  {
    path: "/pubShopifyOnlineGoods",
    name: "PubShopifyOnlineGoods",
    component: () =>
      import("@pagesSystem/published/shopify/onlineGoods/index.vue"),
  },
  {
    path: "/shopifyReleaseLog",
    name: "ShopifyReleaseLog",
    meta: {
      key: "plantPublish/SHPY_shopify/SHPY_shopifyPublishLog/SHPY_shopifyReleaseLog",
    },
    component: () =>
      import(
        "@pagesSystem/published/shopify/listingsLog/shopifyReleaseLog.vue"
      ),
  },
  {
    path: "/shopifyUpdateLog",
    name: "ShopifyUpdateLog",
    meta: {
      key: "plantPublish/SHPY_shopify/SHPY_shopifyPublishLog/SHPY_shopifyUpdateLog",
    },
    component: () =>
      import("@pagesSystem/published/shopify/listingsLog/shopifyUpdateLog.vue"),
  },
];
