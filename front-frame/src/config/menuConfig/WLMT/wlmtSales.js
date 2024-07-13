const baseRoute = '/walmart-web';
// 销售 wlmtSales
export default {
  key: 'WLMT_sales',
  id: null,
  platform: 'WLMT',
  typeStyle: 'menu',
  icon: 'icon-company',
  route: '',
  apiPath: '',
  description: '销售',
  parentKey: 'WLMT_WEB',
  name: '销售',
  children: [
    {
      key: 'WLMT_goods',
      id: null,
      platform: 'WLMT',
      typeStyle: 'menu',
      icon: 'icon-company',
      route: '',
      apiPath: '',
      description: '商品',
      parentKey: 'WLMT_sales',
      name: '商品',
      children: [
        {
          key: 'WLMT_listing',
          id: null,
          platform: 'WLMT',
          typeStyle: 'page',
          icon: '',
          route: baseRoute + '/sale/listing',
          apiPath: '',
          description: 'Listing',
          parentKey: 'WLMT_goods',
          collection: true,
          name: 'Listing',
          children: []
        }
      ]
    },
    {
      key: 'WLMT_orders',
      id: null,
      platform: 'WLMT',
      typeStyle: 'menu',
      icon: 'icon-company',
      route: '',
      apiPath: '',
      description: '订单',
      parentKey: 'WLMT_sales',
      name: '订单',
      children: [
        {
          key: 'WLMT_saleOrders',
          id: null,
          platform: 'WLMT',
          typeStyle: 'page',
          icon: '',
          route: baseRoute + '/sale/orders',
          apiPath: '',
          description: '销售订单',
          parentKey: 'WLMT_orders',
          collection: true,
          name: '销售订单',
          children: []
        },
        {
          key: 'WLMT_returnOrder',
          id: null,
          platform: 'WLMT',
          typeStyle: 'page',
          icon: '',
          route: baseRoute + '/sale/retExcOrders',
          apiPath: '',
          description: '退换货订单',
          parentKey: 'WLMT_orders',
          collection: true,
          name: '退换货订单',
          children: []
        }
      ]
    }
  ]
}