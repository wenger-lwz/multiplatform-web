const baseRoute = '/multiplatform-web';

export default {
  id: null,
  icon: "shopify",
  key: "SHPY_shopify",
  route: null,
  platform: "SHPY",
  apiPath: null,
  description: "Shopify",
  typeStyle: "menu",
  parentKey: "PLAT_Publish",
  children: [
    // {
    //   id: null,
    //   icon: "template",
    //   key: "SHPY_shopifyBoard",
    //   route: null,
    //   platform: "SHPY",
    //   apiPath: null,
    //   description: "模板",
    //   typeStyle: "menu",
    //   parentKey: "SHPY_shopify",
    //   children: [
    //     {
    //       id: null,
    //       typeStyle: "page",
    //       key: "SHPY_pubShopifyBoard",
    //       route: baseRoute + "/pubShopifyBoard",
    //       platform: "SHPY",
    //       apiPath: null,
    //       description: "刊登模板",
    //       parentKey: "SHPY_shopifyBoard",
    //     },
    //     {
    //       id: null,
    //       typeStyle: "page",
    //       key: "SHPY_shopifyComponentBoard",
    //       route: baseRoute + "/shopifyComponentBoard",
    //       platform: "SHPY",
    //       apiPath: null,
    //       description: "组件模板",
    //       parentKey: "SHPY_shopifyBoard",
    //     }
    //   ]
    // },
    // {
    //   id: null,
    //   icon: "marketing",
    //   key: "SHPY_shopifyMarketing",
    //   route: null,
    //   platform: "SHPY",
    //   apiPath: null,
    //   description: "营销",
    //   typeStyle: "menu",
    //   parentKey: "SHPY_shopify",
    //   children: [
    //     {
    //       id: null,
    //       typeStyle: "page",
    //       key: "SHPY_pubShopifyAutoReplenishment",
    //       route: baseRoute + "/pubShopifyAutoReplenishment",
    //       platform: "SHPY",
    //       apiPath: null,
    //       description: "自动调价",
    //       parentKey: "SHPY_shopifyMarketing",
    //     }
    //   ]
    // },
    {
      id: null,
      icon: "publication",
      key: "SHPY_shopifyPublish",
      route: null,
      platform: "SHPY",
      apiPath: null,
      description: "刊登",
      typeStyle: "menu",
      parentKey: "SHPY_shopify",
      children: [
        {
          id: null,
          typeStyle: "page",
          key: "SHPY_pubShopifyGoodsInfo",
          route: baseRoute + "/pubShopifyGoodsInfo",
          platform: "SHPY",
          apiPath: null,
          description: "商品资料",
          parentKey: "SHPY_shopifyPublish",
        },
        {
          id: null,
          typeStyle: "page",
          key: "SHPY_pubShopifyDraft",
          route: baseRoute + "/pubShopifyDraft",
          platform: "SHPY",
          apiPath: null,
          description: "刊登草稿",
          parentKey: "SHPY_shopifyPublish",
        },
        {
          id: null,
          typeStyle: "page",
          key: "SHPY_pubShopifyOnLineGoods",
          route: baseRoute + "/pubShopifyOnLineGoods",
          platform: "SHPY",
          apiPath: null,
          description: "在线商品",
          parentKey: "SHPY_shopifyPublish",
        },
      ]
    },
    // {
    //   id: null,
    //   icon: "template",
    //   key: "SHPY_shopifyPublishLog",
    //   route: null,
    //   platform: "SHPY",
    //   apiPath: null,
    //   description: "刊登日志",
    //   typeStyle: "menu",
    //   parentKey: "SHPY_shopify",
    //   children: [
    //     {
    //       id: null,
    //       typeStyle: "page",
    //       key: "SHPY_shopifyReleaseLog",
    //       route: baseRoute + "/shopifyReleaseLog",
    //       platform: "SHPY",
    //       apiPath: null,
    //       description: "发布日志",
    //       parentKey: "SHPY_shopifyPublishLog",
    //     },
    //     {
    //       id: null,
    //       typeStyle: "page",
    //       key: "SHPY_shopifyUpdateLog",
    //       route: baseRoute + "/shopifyUpdateLog",
    //       platform: "SHPY",
    //       apiPath: null,
    //       description: "更新日志",
    //       parentKey: "SHPY_shopifyPublishLog",
    //     }
    //   ]
    // },
  ]
}
