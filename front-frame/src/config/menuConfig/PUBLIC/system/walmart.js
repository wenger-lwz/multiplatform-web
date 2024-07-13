// 沃尔玛的系统设置菜单 WLMT
const baseRoute = '/walmart-web';
export const WLMTSystem = [
  {
    key: 'WLMT_System',
    id: null,
    platform: 'WLMT',
    typeStyle: 'menu',
    icon: 'walmart',
    route: '',
    apiPath: '',
    description: '沃尔玛',
    parentKey: 'ALL_System',
    children: [
      {
        key: 'WLMT_Business',
        id: null,
        platform: 'WLMT',
        typeStyle: 'menu',
        icon: 'walmart',
        route: null,
        apiPath: '',
        description: '沃尔玛业务设置',
        parentKey: 'WLMT_System',
        children: [
          {
            key: 'WLMT_marketManage',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: 'walmart',
            route: baseRoute + '/system/market',
            apiPath: '',
            description: '沃尔玛店铺管理',
            parentKey: 'WLMT_Business',
          }
        ]
      },
    ]
  }
]