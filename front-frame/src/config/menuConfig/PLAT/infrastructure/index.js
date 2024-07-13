/*
 * 多平台基础设置
 */
const baseRoute = '/multiplatform-web';
export const platInfrastructure = [
  {
    key: 'PLAT_Settings',
    id: null,
    platform: 'PLAT',
    typeStyle: 'menu',
    icon: 'system',
    route: '',
    apiPath: '',
    description: '设置',
    parentKey: '',
    name: '设置',
    children: [
      {
        key: 'PLAT_Settings_Settings',
        id: null,
        platform: 'PLAT',
        typeStyle: 'menu',
        icon: 'system',
        route: '',
        apiPath: '',
        description: '设置',
        parentKey: 'PLAT_Settings',
        name: '设置',
        children: [
          {
            key: 'PLAT_AuthorizationManage',
            id: null,
            platform: 'PLAT',
            typeStyle: 'page',
            icon: 'PLATAuthorizationManage',
            route: baseRoute + '/authorizationManage',
            apiPath: '',
            description: '平台授权管理',
            parentKey: 'PLAT_Settings_Settings',
            collection: true,
          },
          {
            key: 'PLAT_LabelManage',
            id: null,
            platform: 'PLAT',
            typeStyle: 'page',
            icon: 'PLATLabelManage',
            route: baseRoute + '/labelManage',
            apiPath: '',
            description: '标签管理',
            parentKey: 'PLAT_Settings_Settings',
          }
        ]
      }
    ]
  }
]
