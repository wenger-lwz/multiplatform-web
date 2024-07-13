// 亚马逊的销售菜单
export const AMZSale = [
  {
    key: 'AMZ_Sale',
    id: null,
    platform: 'AMZ',
    typeStyle: 'menu',
    icon: 'sale',
    route: '',
    apiPath: '',
    description: '亚马逊',
    parentKey: 'ALL_Sale',
    children: [
      {
        key: 'v2.menu.sale.goodsMenu',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: 'sale',
        route: null,
        apiPath: '',
        description: '亚马逊商品',
        parentKey: 'AMZ_Sale',
        children: [
          {
            key: 'v2.menu.sale.listing',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'sale',
            route: '/amz-web/sale/listing',
            apiPath: '',
            description: '亚马逊商品管理',
            parentKey: 'v2.menu.sale.goodsMenu',
          }
        ]
      },
      {
        key: 'v2.menu.sale.orderMenu',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: 'sale',
        route: null,
        apiPath: '',
        description: '亚马逊订单',
        parentKey: 'AMZ_Sale',
        children: [
          {
            key: 'v2.menu.sale.order',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'sale',
            route: '/amz-web/sale/order',
            apiPath: '',
            description: '亚马逊销售订单',
            parentKey: 'v2.menu.sale.orderMenu',
          }
        ]
      },
      {
        key: 'v2.menu.sale.promotionMenu',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: 'sale',
        route: null,
        apiPath: '',
        description: '亚马逊推广',
        parentKey: 'AMZ_Sale',
        children: [
          {
            key: 'v2.menu.sale.testOrder',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'sale',
            route: '/amz-web/sale/testOrder',
            apiPath: '',
            description: '亚马逊推广订单',
            parentKey: 'v2.menu.sale.promotionMenu',
          }
        ]
      },
    ]
  }
]