const baseRoute = '/multiplatform-web';
export default {
  id: null,
  icon: "lazada",
  key: "LZD_lazada",
  route: null,
  platform: "LZD",
  apiPath: null,
  description: "Lazada",
  typeStyle: "menu",
  parentKey: 'PLAT_Publish',
  children: [
    {
      id: null,
      icon: "publication",
      key: "LZD_lazadaPublish",
      route: null,
      platform: "LZD",
      apiPath: null,
      description: "刊登",
      typeStyle: "menu",
      parentKey: "LZD_lazada",
      children: [
        {
          id: null,
          typeStyle: 'page',
          key: "LZD_commodityInformation",
          route: baseRoute + "/commodityInformation",
          platform: "LZD",
          apiPath: null,
          description: "商品资料",
          parentKey: "LZD_lazadaPublish",
          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "LZD_commodityInformation-view",
              route: null,
              platform: "LZD",
              apiPath: null,
              description: "查看",
              parentKey: "LZD_commodityInformation",
              buttonType: "view"
            }
          ],
        },
        {
          id: null,
          typeStyle: 'page',
          key: "LZD_publishedDraft",
          route: baseRoute + "/publishedDraft",
          platform: "LZD",
          apiPath: null,
          description: "刊登草稿",
          parentKey: "LZD_lazadaPublish",
          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "LZD_publishedDraft-view",
              route: null,
              platform: "LZD",
              apiPath: null,
              description: "查看",
              parentKey: "LZD_publishedDraft",
              buttonType: "view"
            }
          ],
        },
        {
          id: null,
          typeStyle: 'page',
          key: "LZD_commodityOnLine",
          route: baseRoute + "/commodityOnLine",
          platform: "LZD",
          apiPath: null,
          description: "在线商品",
          parentKey: "LZD_lazadaPublish",
          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "LZD_commodityOnLine-view",
              route: "commodityOnLine-view",
              platform: "LZD",
              apiPath: null,
              description: "查看",
              parentKey: "LZD_commodityOnLine",
              buttonType: "view"
            }
          ],
        },
      ],
    },
    // {
    //   id: null,
    //   icon: "template",
    //   key: "LZD_lazadaBoard",
    //   route: null,
    //   platform: "LZD",
    //   apiPath: null,
    //   description: "模板",
    //   typeStyle: "menu",
    //   parentKey: "LZD_lazada",
    //   children: [
    //     {
    //       id: null,
    //       typeStyle: 'page',
    //       key: "LZD_pubLazadaBoard",
    //       route: baseRoute + "/pubLazadaBoard",
    //       platform: "LZD",
    //       apiPath: null,
    //       description: "刊登模板",
    //       parentKey: "LZD_lazadaBoard",
    //       children: [
    //         {
    //           id: null,
    //           typeStyle: "btn",
    //           key: "LZD_pubLazadaBoard-view",
    //           route: null,
    //           platform: "LZD",
    //           apiPath: null,
    //           description: "查看",
    //           parentKey: "LZD_pubLazadaBoard",
    //           buttonType: "view"
    //         }
    //       ],
    //     }
    //   ],
    // },
    // {
    //   id: null,
    //   icon: "marketing",
    //   key: "LZD_lazadaMarketing",
    //   route: null,
    //   platform: "LZD",
    //   apiPath: null,
    //   description: "营销",
    //   typeStyle: "menu",
    //   parentKey: "LZD_lazada",
    //   children: [
    //     {
    //       id: null,
    //       typeStyle: 'page',

    //       key: "LZD_flexiCombo",
    //       route: baseRoute + "/flexiCombo",
    //       platform: "LZD",
    //       apiPath: null,
    //       description: "flexiCombo",
    //       parentKey: "LZD_lazadaMarketing",
    //       children: [
    //         {
    //           id: null,
    //           typeStyle: "btn",
    //           key: "LZD_flexiCombo-view",
    //           route: null,
    //           platform: "LZD",
    //           apiPath: null,
    //           description: "查看",
    //           parentKey: "LZD_flexiCombo",
    //           buttonType: "view"
    //         }
    //       ],
    //     },
    //     {
    //       id: null,
    //       typeStyle: 'page',

    //       key: "LZD_lazadaCoupons",
    //       route: baseRoute + "/lazadaCoupons",
    //       platform: "LZD",
    //       apiPath: null,
    //       description: "优惠券",
    //       parentKey: "LZD_lazadaMarketing",
    //       children: [
    //         {
    //           id: null,
    //           typeStyle: "btn",
    //           key: "LZD_lazadaCoupons-view",
    //           route: null,
    //           platform: "LZD",
    //           apiPath: null,
    //           description: "查看",
    //           parentKey: "LZD_lazadaCoupons",
    //           buttonType: "view"
    //         }
    //       ],
    //     },
    //     {
    //       id: null,
    //       typeStyle: 'page',

    //       key: "LZD_freeShipping",
    //       route: baseRoute + "/freeShipping",
    //       platform: "LZD",
    //       apiPath: null,
    //       description: "免运费",
    //       parentKey: "LZD_lazadaMarketing",
    //       children: [
    //         {
    //           id: null,
    //           typeStyle: "btn",
    //           key: "LZD_freeShipping-view",
    //           route: null,
    //           platform: "LZD",
    //           apiPath: null,
    //           description: "查看",
    //           parentKey: "LZD_freeShipping",
    //           buttonType: "view"
    //         }
    //       ],
    //     }
    //   ],
    // },
    {
      id: null,
      icon: "publication",
      key: "LZD_pubLazadaLishLog",
      route: null,
      platform: "LZD",
      apiPath: null,
      description: "刊登日志",
      typeStyle: "menu",
      parentKey: "LZD_lazada",
      children: [
        {
          id: null,
          typeStyle: 'page',
          key: "LZD_pubLazadaReleaseLog",
          route: baseRoute + "/pubLazadaReleaseLog",
          platform: "LZD",
          apiPath: null,
          description: "发布日志",
          parentKey: "LZD_pubLazadaLishLog",
          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "LZD_pubLazadaReleaseLog-view",
              route: null,
              platform: "LZD",
              apiPath: null,
              description: "查看",
              parentKey: "LZD_pubLazadaReleaseLog",
              buttonType: "view"
            }
          ],
        },
        {
          id: null,
          typeStyle: 'page',
          key: "LZD_pubLazadaUpdateLog",
          route: baseRoute + "/pubLazadaUpdateLog",
          platform: "LZD",
          apiPath: null,
          description: "更新日志",
          parentKey: "LZD_pubLazadaLishLog",
          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "LZD_pubLazadaUpdateLog-view",
              route: null,
              platform: "LZD",
              apiPath: null,
              description: "查看",
              parentKey: "LZD_pubLazadaUpdateLog",
              buttonType: "view"
            }
          ],
        }
      ],
    }
  ]
}
