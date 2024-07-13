// 亚马逊的系统设置菜单
const baseRoute = '/amz-web';
export const AMZSystem = [
  {
    key: 'AMZ_System',
    id: null,
    platform: 'AMZ',
    typeStyle: 'menu',
    icon: 'amazon',
    route: '',
    apiPath: '',
    description: '亚马逊',
    parentKey: 'ALL_System',
    children: [
      {
        key: 'v2.menu.system.businessSettingMenu',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: 'amazon',
        route: null,
        apiPath: '',
        description: '亚马逊业务设置',
        parentKey: 'AMZ_System',
        children: [
          {
            key: 'v2.menu.system.marketInit',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'amazon',
            route: baseRoute + '/dpdj',
            apiPath: '',
            description: '亚马逊店铺对接',
            parentKey: 'v2.menu.system.businessSettingMenu',
          }
        ]
      },
      {
        key: 'v2.menu.finance.baseData',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: 'amazon',
        route: null,
        apiPath: '',
        description: '亚马逊基础设置',
        parentKey: 'AMZ_System',
        children: [
          {
            key: 'v2.menu.system.systemSetting',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'amazon',
            route: baseRoute + '/cssz',
            apiPath: '',
            description: '亚马逊参数设置',
            parentKey: 'v2.menu.finance.baseData',
          }
        ]
      },
      {
        key: 'v2.menu.system.authorityMenu',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: '',
        route: null,
        apiPath: '',
        description: '亚马逊权限管理',
        parentKey: 'AMZ_System',
        children: [
          {
            key: 'v2.menu.system.userList',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'amazon',
            route: baseRoute + '/yhgl',
            apiPath: '',
            description: '亚马逊用户管理',
            parentKey: 'v2.menu.system.authorityMenu',
          }
        ]
      },
    ]
  }
]