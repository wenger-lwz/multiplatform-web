// 沃尔玛的工具菜单 WLMT
const baseRoute = '/walmart-web';
export const WLMTTool = [
  {
    key: 'WLMT_Tool',
    id: null,
    platform: 'WLMT',
    typeStyle: 'menu',
    icon: 'walmart',
    route: '',
    apiPath: '',
    description: '工具',
    parentKey: 'ALL_Tool',
    children: [
      {
        key: 'WLMT_Instrument',
        id: null,
        platform: 'WLMT',
        typeStyle: 'menu',
        icon: 'icon-company',
        route: '',
        apiPath: '',
        description: '工具',
        parentKey: 'WLMT_Tool',
        name: '工具',
        children: [
          {
            key: 'WLMT_ListingHijacker',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/tool/offerMonitor',
            apiPath: '',
            description: '商品跟卖',
            parentKey: 'WLMT_Instrument',
            collection: true,
            name: '商品跟卖',
            children: []
          },
          {
            key: 'WLMT_ModifyPrice',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/tool/modifyPrice',
            apiPath: '',
            description: '自动调价',
            parentKey: 'WLMT_Instrument',
            collection: true,
            name: '自动调价',
            children: []
          }
        ]
      }
    ]
  }
]