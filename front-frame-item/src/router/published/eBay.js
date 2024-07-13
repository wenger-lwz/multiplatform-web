const eBayPublish = [
  {
    path: "/pubEBayBoard",
    name: "PubEBayBoard",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_eBayBoard/EBAY_pubEBayBoard",
    },
    component: () =>
      import("@pagesSystem/published/eBay/eBayBoard/pubEBayBoard.vue"),
  },
  {
    path: "/componentBoard",
    name: "ComponentBoard",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_eBayBoard/EBAY_componentBoard",
    },
    component: () =>
      import("@pagesSystem/published/eBay/eBayBoard/componentBoard.vue"),
  },
  {
    path: "/pubEBayInfoBoard",
    name: "PubEBayInfoBoard",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_eBayBoard/EBAY_pubEBayInfoBoard",
    },
    component: () =>
      import("@pagesSystem/published/eBay/eBayBoard/pubEBayInfoBoard.vue"),
  },
  {
    path: "/eBayDiscount",
    name: "EBayDiscount",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_eBayMarketing/EBAY_eBayDiscount",
    },
    component: () =>
      import("@pagesSystem/published/eBay/eBayMarketing/eBayDiscount.vue"),
  },
  {
    path: "/standardAdvertising",
    name: "StandardAdvertising",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_eBayMarketing/EBAY_standardAdvertising",
    },
    component: () =>
      import(
        "@pagesSystem/published/eBay/eBayMarketing/standardAdvertising.vue"
      ),
  },
  {
    path: "/advancedAdvertising",
    name: "AdvancedAdvertising",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_eBayMarketing/EBAY_advancedAdvertising",
    },
    component: () =>
      import(
        "@pagesSystem/published/eBay/eBayMarketing/advancedAdvertising.vue"
      ),
  },
  {
    path: "/pubEBayDraft",
    name: "PubEBayDraft",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_eBayPublish/EBAY_pubEBayDraft",
    },
    component: () =>
      import("@pagesSystem/published/eBay/eBayPublish/draft/draftPage.vue"),
  },
  {
    path: "/pubEBayGoodsInfo",
    name: "PubEBayGoodsInfo",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_eBayPublish/EBAY_pubEBayGoodsInfo",
    },
    component: () =>
      import("@pagesSystem/published/eBay/eBayPublish/goods/goodsInfoPage.vue"),
  },
  {
    path: "/pubEBayOnLineGoods",
    name: "PubEBayOnLineGoods",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_eBayPublish/EBAY_pubEBayOnLineGoods",
    },
    component: () =>
      import(
        "@pagesSystem/published/eBay/eBayPublish/onlineGoods/onLineGoodsPage.vue"
      ),
  },

  {
    path: "/pubEBayVideoLibrary",
    name: "PubEBayVideoLibrary",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_eBayPublish/EBAY_pubEBayVideoLibrary",
    },
    component: () =>
      import(
        "@pagesSystem/published/eBay/eBayPublish/pubEBayVideoLibrary/index.vue"
      ),
  },
  {
    path: "/ebayReleaseLog",
    name: "EbayReleaseLog",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_ebayPublishlLog/EBAY_ebayReleaseLog",
    },
    component: () =>
      import("@pagesSystem/published/eBay/publishedLog/ebayReleaseLog.vue"),
  },
  {
    path: "/ebayUpdateLog",
    name: "EbayUpdateLog",
    meta: {
      key: "plantPublish/EBAY_eBay/EBAY_ebayPublishlLog/EBAY_ebayUpdateLog",
    },
    component: () =>
      import("@pagesSystem/published/eBay/publishedLog/ebayUpdateLog.vue"),
  },
];
export default eBayPublish;
