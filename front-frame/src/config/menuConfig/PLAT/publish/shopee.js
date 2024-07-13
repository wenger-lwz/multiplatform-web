const baseRoute = '/multiplatform-web';

export default {
  "id": null,
  "icon": "shopee",
  "key": "SHPE_shopee",
  "route": null,
  "platform": "SHPE",
  "apiPath": null,
  "description": "Shopee",
  "typeStyle": "menu",
  "parentKey": 'PLAT_Publish',
  "children": [
    {
      "id": null,
      "icon": "template",
      "children": [
        /* {
          "id": null,
          "typeStyle": "page",
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_pubShopeeBoard-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_pubShopeeBoard",
              "buttonType": "view"
            },
            {
              "id": null,
              "typeStyle": "detailPage",
              "children": [
                {
                  "id": null,
                  "typeStyle": "btn",
                  "key": "SHPE_pubShoppeListingsEdit-view",
                  "route": "",
                  "platform": "SHPE",
                  "apiPath": null,
                  "description": "查看",
                  "parentKey": "SHPE_pubShoppeListingsEdit",
                  "buttonType": "view"
                }
              ],
              "key": "SHPE_pubShoppeListingsEdit",
              "route": baseRoute + "/pubShoppeListingsEdit",
              "platform": "SHPE",
              "apiPath": null,
              "description": "编辑模板",
              "parentKey": "SHPE_pubShopeeBoard"
            }
          ],
          "key": "SHPE_pubShopeeBoard",
          "route": baseRoute + "/pubShopeeBoard",
          "platform": "SHPE",
          "apiPath": null,
          "description": "刊登模板",
          "parentKey": "SHPE_shopeeBoard"
        }, */
        {
          "id": null,
          "typeStyle": "page",
          "key": "SHPE_pubShopeeLogisticsTemplate",
          "route": baseRoute + "/pubShopeeLogisticsTemplate",
          "platform": "SHPE",
          "apiPath": null,
          "description": "物流模板",
          "parentKey": "SHPE_shopeeBoard",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_pubShoppeLogisticsEdit-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_pubShopeeLogisticsTemplate",
              "buttonType": "view"
            }
          ],
        }
      ],
      "key": "SHPE_shopeeBoard",
      "route": "",
      "platform": "SHPE",
      "apiPath": null,
      "description": "模板",
      "typeStyle": "menu",
      "parentKey": "SHPE_shopee"
    },
    /* {
      "id": null,
      "icon": "marketing",
      "children": [
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_searchAdvertising-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_searchAdvertising",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_searchAdvertising",
          "route": baseRoute + "/searchAdvertising",
          "platform": "SHPE",
          "apiPath": null,
          "description": "搜索广告",
          "parentKey": "SHPE_shopeeMarketing"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_associatedAdvertising-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_associatedAdvertising",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_associatedAdvertising",
          "route": baseRoute + "/associatedAdvertising",
          "platform": "SHPE",
          "apiPath": null,
          "description": "联合广告",
          "parentKey": "SHPE_shopeeMarketing"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_storeAdvertising-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_storeAdvertising",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_storeAdvertising",
          "route": baseRoute + "/storeAdvertising",
          "platform": "SHPE",
          "apiPath": null,
          "description": "商店广告",
          "parentKey": "SHPE_shopeeMarketing",
          collection: true,
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_coupons-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_coupons",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_coupons",
          "route": baseRoute + "/coupons",
          "platform": "SHPE",
          "apiPath": null,
          "description": "优惠券",
          "parentKey": "SHPE_shopeeMarketing",
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_discountActivity-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_discountActivity",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_discountActivity",
          "route": baseRoute + "/discountActivity",
          "platform": "SHPE",
          "apiPath": null,
          "description": "折扣活动",
          "parentKey": "SHPE_shopeeMarketing"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_suitThePreferential-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_suitThePreferential",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_suitThePreferential",
          "route": baseRoute + "/suitThePreferential",
          "platform": "SHPE",
          "apiPath": null,
          "description": "套装优惠",
          "parentKey": "SHPE_shopeeMarketing"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_purchaseDiscount-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_purchaseDiscount",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_purchaseDiscount",
          "route": baseRoute + "/purchaseDiscount",
          "platform": "SHPE",
          "apiPath": null,
          "description": "折扣活动",
          "parentKey": "SHPE_shopeeMarketing"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_limitedTimeToChoose-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_limitedTimeToChoose",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_limitedTimeToChoose",
          "route": baseRoute + "/limitedTimeToChoose",
          "platform": "SHPE",
          "apiPath": null,
          "description": "limitedTimeToChoose",
          "parentKey": "SHPE_shopeeMarketing"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_freightPromotion-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_freightPromotion",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_freightPromotion",
          "route": baseRoute + "/freightPromotion",
          "platform": "SHPE",
          "apiPath": null,
          "description": "加购优惠",
          "parentKey": "SHPE_shopeeMarketing"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_focusOnTheRitual-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_focusOnTheRitual",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_focusOnTheRitual",
          "route": baseRoute + "/focusOnTheRitual",
          "platform": "SHPE",
          "apiPath": null,
          "description": "关注礼",
          "parentKey": "SHPE_shopeeMarketing",
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_popularChoice-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_popularChoice",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_popularChoice",
          "route": baseRoute + "/popularChoice",
          "platform": "SHPE",
          "apiPath": null,
          "description": "热门精选",
          "parentKey": "SHPE_shopeeMarketing",
          collection: true,
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_pubShopeeAutoReplenishment-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_pubShopeeAutoReplenishment",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_pubShopeeAutoReplenishment",
          "route": baseRoute + "/pubShopeeAutoReplenishment",
          "platform": "SHPE",
          "apiPath": null,
          "description": "pubShopeeAutoReplenishment",
          "parentKey": "SHPE_shopeeMarketing"
        }
      ],
      "key": "SHPE_shopeeMarketing",
      "route": "",
      "platform": "SHPE",
      "apiPath": null,
      "description": "营销",
      "typeStyle": "menu",
      "parentKey": "SHPE_shopee"
    }, */
    {
      "id": null,
      "icon": "publication",
      "key": "SHPE_shopeePublish",
      "route": "",
      "platform": "SHPE",
      "apiPath": null,
      "description": "刊登",
      "typeStyle": "menu",
      "parentKey": "SHPE_shopee",
      "children": [
        {
          "id": null,
          "typeStyle": "page",
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_pubShopeeGoodsInfo-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_pubShopeeGoodsInfo",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_pubShopeeGoodsInfo",
          "route": baseRoute + "/pubShopeeGoodsInfo",
          "platform": "SHPE",
          "apiPath": null,
          "description": "商品资料",
          "parentKey": "SHPE_shopeePublish"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_pubShopeeDraft-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_pubShopeeDraft",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_pubShopeeDraft",
          "route": baseRoute + "/pubShopeeDraft",
          "platform": "SHPE",
          "apiPath": null,
          "description": "刊登草稿",
          "parentKey": "SHPE_shopeePublish"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_pubShopeeOnLineGoods-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_pubShopeeOnLineGoods",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_pubShopeeOnLineGoods",
          "route": baseRoute + "/pubShopeeOnLineGoods",
          "platform": "SHPE",
          "apiPath": null,
          "description": "在线商品",
          "parentKey": "SHPE_shopeePublish"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_globalGoods-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_globalGoods",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_globalGoods",
          "route": baseRoute + "/globalGoods",
          "platform": "SHPE",
          "apiPath": null,
          "description": "全球商品",
          "parentKey": "SHPE_shopeePublish"
        },
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_pubShopeeVideoLibrary-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_pubShopeeVideoLibrary",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_pubShopeeVideoLibrary",
          "route": baseRoute + "/pubShopeeVideoLibrary",
          "platform": "SHPE",
          "apiPath": null,
          "description": "视频库",
          "parentKey": "SHPE_shopeePublish"
        }
      ],
    },
    {
      "id": null,
      "icon": "publication",
      "children": [
        {
          "id": null,
          "typeStyle": "page",
          "isDing": false,
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_pubShoppeReleaseLog-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_pubShoppeReleaseLog",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_pubShoppeReleaseLog",
          "route": baseRoute + "/pubShoppeReleaseLog",
          "platform": "SHPE",
          "apiPath": null,
          "description": "发布日志",
          "parentKey": "SHPE_shopeePublishLog"
        },
        {
          "id": null,
          "typeStyle": "page",
          "children": [
            {
              "id": null,
              "typeStyle": "btn",
              "key": "SHPE_pubShoppeUpdateLog-view",
              "route": "",
              "platform": "SHPE",
              "apiPath": null,
              "description": "查看",
              "parentKey": "SHPE_pubShoppeUpdateLog",
              "buttonType": "view"
            }
          ],
          "key": "SHPE_pubShoppeUpdateLog",
          "route": baseRoute + "/pubShoppeUpdateLog",
          "platform": "SHPE",
          "apiPath": null,
          "description": "更新日志",
          "parentKey": "SHPE_shopeePublishLog"
        }
      ],
      "key": "SHPE_shopeePublishLog",
      "route": "",
      "platform": "SHPE",
      "apiPath": null,
      "description": "刊登日志",
      "typeStyle": "menu",
      "parentKey": "SHPE_shopee"
    }
  ],
}
