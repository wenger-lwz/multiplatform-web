const baseRoute = '/multiplatform-web';
export default {
  id: null,
  icon: "aliExpress",
  key: "ALI_aliExpress",
  route: null,
  platform: "ALI",
  apiPath: null,
  description: "速卖通",
  typeStyle: "menu",
  parentKey: 'PLAT_Publish',

  children: [
    {
      id: null,
      icon: "template",
      key: "ALI_aliExpressBoard",
      route: null,
      platform: "ALI",
      apiPath: null,
      description: "模板",
      typeStyle: "menu",
      parentKey: "ALI_aliExpress",

      children: [
        {
          id: null,
          typeStyle: "page",
          key: "ALI_pubAliBoard",
          route: baseRoute + "/pubAliBoard",
          platform: "ALI",
          apiPath: null,
          description: "刊登模板",
          parentKey: "ALI_aliExpressBoard",

          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "ALI_pubAliBoard-view",
              platform: "ALI",
              apiPath: null,
              description: "查看",
              parentKey: "ALI_pubAliBoard",
              buttonType: "view"
            }
          ],
        },
        {
          id: null,
          typeStyle: "page",
          key: "ALI_pubAliComponentBoard",
          route: baseRoute + "/pubAliComponentBoard",
          platform: "ALI",
          apiPath: null,
          description: "组件模板",
          parentKey: "ALI_aliExpressBoard",

          collection: true,
          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "ALI_pubAliComponentBoard-view",
              platform: "ALI",
              apiPath: null,
              description: "查看",
              parentKey: "ALI_pubAliComponentBoard",
              buttonType: "view"
            }
          ],
        }
      ],
    },
    {
      id: null,
      icon: "marketing",
      key: "ALI_aLiMarketing",
      route: null,
      platform: "ALI",
      apiPath: null,
      description: "营销",
      typeStyle: "menu",
      parentKey: "ALI_aliExpress",

      children: [
        {
          id: null,
          typeStyle: "page",
          key: "ALI_pubAliAutoReplenishment",
          route: baseRoute + "/pubAliAutoReplenishment",
          platform: "ALI",
          apiPath: null,
          description: "自动补货",
          parentKey: "ALI_aLiMarketing",

          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "ALI_pubAliAutoReplenishment-view",
              platform: "ALI",
              apiPath: null,
              description: "查看",
              parentKey: "ALI_pubAliAutoReplenishment",
              buttonType: "view"
            }
          ],
        }
      ],
    },
    {
      id: null,
      icon: "publication",
      key: "ALI_aLipublish",
      route: null,
      platform: "ALI",
      apiPath: null,
      description: "刊登",
      typeStyle: "menu",
      parentKey: "ALI_aliExpress",

      children: [
        {
          id: null,
          typeStyle: "page",
          key: "ALI_pubAliGoodsInfo",
          route: baseRoute + "/pubAliGoodsInfo",
          platform: "ALI",
          apiPath: null,
          description: "商品资料",
          parentKey: "ALI_aLipublish",

          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "ALI_pubAliGoodsInfo-view",
              platform: "ALI",
              apiPath: null,
              description: "查看",
              parentKey: "ALI_pubAliGoodsInfo",
              buttonType: "view"
            },

          ],
        },
        {
          id: null,
          typeStyle: "page",
          key: "ALI_pubAliDraft",
          route: baseRoute + "/pubAliDraft",
          platform: "ALI",
          apiPath: null,
          description: "刊登草稿",
          parentKey: "ALI_aLipublish",

          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "ALI_pubAliDraft-view",
              route: null,
              platform: "ALI",
              apiPath: null,
              description: "查看",
              parentKey: "ALI_pubAliDraft",
              buttonType: "view"
            }

          ],
        },
        // {
        //   id: null,
        //   typeStyle: "page",
        //   key: "ALI_pubAliOnlineDetails",
        //   route: baseRoute + "/pubAliOnlineDetails",
        //   platform: "ALI",
        //   apiPath: null,
        //   description: "在线商品详情",
        //   parentKey: "ALI_pubAliGoodsInfo",

        //   children: [
        //     {
        //       id: null,
        //       typeStyle: "btn",
        //       key: "ALI_pubAliOnlineDetails-view",
        //       platform: "ALI",
        //       apiPath: null,
        //       description: "查看",
        //       parentKey: "ALI_pubAliOnlineDetails",
        //       buttonType: "view"
        //     }
        //   ],
        // },
        {
          id: null,
          typeStyle: "page",
          key: "ALI_pubAliOnLineGoods",
          route: baseRoute + "/pubAliOnLineGoods",
          platform: "ALI",
          apiPath: null,
          description: "在线商品",
          parentKey: "ALI_aLipublish",

          collection: true,
          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "ALI_pubAliOnLineGoods-view",
              route: null,
              platform: "ALI",
              apiPath: null,
              description: "查看",
              parentKey: "ALI_pubAliOnLineGoods",
              buttonType: "view"
            }
          ],
        }
      ],
    },
    {
      id: null,
      icon: "publication",
      key: "ALI_aliPublishLog",
      route: null,
      platform: "ALI",
      apiPath: null,
      description: "刊登日志",
      typeStyle: "menu",
      parentKey: "ALI_aliExpress",

      children: [
        {
          id: null,
          typeStyle: "page",
          key: "ALI_pubAliReleaseLog",
          route: baseRoute + "/pubAliReleaseLog",
          platform: "ALI",
          apiPath: null,
          description: "发布日志",
          parentKey: "ALI_aliPublishLog",

          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "ALI_pubAliReleaseLog-view",
              route: null,
              platform: "ALI",
              apiPath: null,
              description: "查看",
              parentKey: "ALI_pubAliReleaseLog",
              buttonType: "view"
            }
          ],
        },
        {
          id: null,
          typeStyle: "page",
          key: "ALI_pubAliUpdateLog",
          route: baseRoute + "/pubAliUpdateLog",
          platform: "ALI",
          apiPath: null,
          description: "更新日志",
          parentKey: "ALI_aliPublishLog",

          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "ALI_pubAliUpdateLog-view",
              route: null,
              platform: "ALI",
              apiPath: null,
              description: "查看",
              parentKey: "ALI_pubAliUpdateLog",
              buttonType: "view"
            }
          ],
        },
        {
          id: null,
          typeStyle: "page",
          key: "ALI_pubAliUpdateLogDetail",
          route: baseRoute + "/pubAliUpdateLogDetail",
          platform: "ALI",
          apiPath: null,
          description: "更新日志",
          parentKey: "ALI_aliPublishLog",

          children: [
            {
              id: null,
              typeStyle: "btn",
              key: "ALI_pubAliUpdateLogDetail-view",
              route: null,
              platform: "ALI",
              apiPath: null,
              description: "查看",
              parentKey: "ALI_pubAliUpdateLogDetail",
              buttonType: "view"
            }
          ],
        }
      ],
    }
  ],
}