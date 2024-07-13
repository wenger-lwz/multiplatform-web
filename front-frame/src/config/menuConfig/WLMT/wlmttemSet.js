const baseRoute = '/walmart-web';
// 系统设置 wlmtSet
export default {
  key: 'WLMT_systemSetting',
  id: null,
  platform: 'WLMT',
  typeStyle: 'menu',
  icon: 'icon-company',
  route: '',
  apiPath: '',
  description: '系统设置',
  parentKey: 'WLMT_WEB',
  name: '系统设置',
  children: [
    {
      key: 'WLMT_business',
      id: null,
      platform: 'WLMT',
      typeStyle: 'menu',
      icon: 'icon-company',
      route: '',
      apiPath: '',
      description: '业务设置',
      parentKey: 'WLMT_systemSetting',
      name: '业务设置',
      children: [
        {
          key: 'WLMT_marketManage',
          id: null,
          platform: 'WLMT',
          typeStyle: 'page',
          icon: '',
          route: baseRoute + '/system/market',
          apiPath: '',
          description: '店铺管理',
          parentKey: 'WLMT_business',
          collection: true,
          name: '店铺管理',
          children: []
        }
      ]
    }
  ]
}
