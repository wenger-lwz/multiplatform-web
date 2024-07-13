// 亚马逊的订单菜单
export const AMZOrder = [
  {
    key: 'AMZ_Order',
    id: null,
    platform: null,
    typeStyle: 'menu',
    icon: 'amazon',
    route: '',
    apiPath: '',
    description: '亚马逊',
    parentKey: 'ALL_Order',
    children: [
      {
        key: 'AMZ_OrderManger',
        id: null,
        platform: null,
        typeStyle: 'page',

        icon: '',
        route: '/amz-web/orderManger',
        apiPath: '',
        description: '亚马逊订单管理',
        parentKey: 'AMZ_Order',
        children: []
      },
      {
        key: 'AMZ_OrderList',
        id: null,
        platform: null,
        typeStyle: 'page',

        icon: '',
        route: '/amz-web/orderList',
        apiPath: '',
        description: '亚马逊订单列表',
        parentKey: 'AMZ_Order',
        children: []
      },
      {
        key: 'AMZ_OrderError',
        id: null,
        platform: null,
        typeStyle: 'page',

        icon: '',
        route: '/amz-web/orderError',
        apiPath: '',
        description: '亚马逊错误订单',
        parentKey: 'AMZ_Order',
        children: []
      },
    ]
  }
]