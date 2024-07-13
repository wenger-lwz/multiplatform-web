// 沃尔玛的销售菜单 WLMT
const baseRoute = '/walmart-web';
export const WLMTSale = [
  {
    key: 'WLMT_Sale',
    id: null,
    platform: 'WLMT',
    typeStyle: 'menu',
    icon: 'walmart',
    route: '',
    apiPath: '',
    description: '沃尔玛',
    parentKey: 'ALL_Sale',
    children: [
      {
        key: 'WLMT_Goods',
        id: null,
        platform: 'WLMT',
        typeStyle: 'menu',
        icon: 'icon-company',
        route: '',
        apiPath: '',
        description: '商品',
        parentKey: 'WLMT_Sale',
        name: '商品',
        children: [
          {
            key: 'WLMT_Listing',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/sale/listing',
            apiPath: '',
            description: 'Listing',
            parentKey: 'WLMT_Goods',
            collection: true,
            name: 'Listing',
            children: []
          }
        ]
      },

      {
        key: 'WLMT_Orders',
        id: null,
        platform: 'WLMT',
        typeStyle: 'menu',
        icon: 'icon-company',
        route: '',
        apiPath: '',
        description: '订单',
        parentKey: 'WLMT_Sale',
        name: '订单',
        children: [
          {
            key: 'WLMT_SaleOrders',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/sale/orders',
            apiPath: '',
            description: '销售订单',
            parentKey: 'WLMT_Orders',
            collection: true,
            name: '销售订单',
            children: []
          },
          {
            key: 'WLMT_ReturnOrder',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/sale/retExcOrders',
            apiPath: '',
            description: '退换货订单',
            parentKey: 'WLMT_Orders',
            collection: true,
            name: '退换货订单',
            children: []
          }
        ]
      }
    ]
  }
]