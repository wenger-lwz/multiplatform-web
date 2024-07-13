// 沃尔玛的广告菜单 WLMT
const baseRoute = '/walmart-web';
export const WLMTAds = [
  {
    key: 'WLMT_Ads',
    id: null,
    platform: 'WLMT',
    typeStyle: 'menu',
    icon: 'walmart',
    route: '',
    apiPath: '',
    description: '广告',
    parentKey: 'ALL_Ads',
    children: [
      {
        key: 'WLMT_Advertising',
        id: null,
        platform: 'WLMT',
        typeStyle: 'menu',
        icon: 'icon-company',
        route: '',
        apiPath: '',
        description: '广告',
        parentKey: 'WLMT_Ads',
        name: '广告',
        children: [
          {
            key: 'WLMT_AdsManagement',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/ads/adsManagement',
            apiPath: '',
            description: '广告管理',
            parentKey: 'WLMT_Advertising',
            collection: true,
            name: '广告管理',
            children: []
          }
        ]
      }
    ]
  }
]