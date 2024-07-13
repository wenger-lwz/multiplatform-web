const baseRoute = '/walmart-web';
// 财务 wlmtFinance
export default {
  key: 'WLMT_finance',
  id: null,
  platform: 'WLMT',
  typeStyle: 'menu',
  icon: 'icon-company',
  route: '',
  apiPath: '',
  description: '财务',
  parentKey: 'WLMT_WEB',
  name: '财务',
  children: [
    {
      key: 'WLMT_financeReport',
      id: null,
      platform: 'WLMT',
      typeStyle: 'menu',
      icon: 'icon-company',
      route: '',
      apiPath: '',
      description: '数据报告',
      parentKey: 'WLMT_finance',
      name: '数据报告',
      children: [
        {
          key: 'WLMT_reconReport',
          id: null,
          platform: 'WLMT',
          typeStyle: 'page',
          icon: '',
          route: baseRoute + '/finance/recon-report',
          apiPath: '',
          description: '店铺管理',
          parentKey: 'WLMT_financeReport',
          collection: true,
          name: '店铺管理',
          children: []
        }
      ]
    }
  ]
}