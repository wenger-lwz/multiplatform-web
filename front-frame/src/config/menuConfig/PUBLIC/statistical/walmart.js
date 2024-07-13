// 沃尔玛的统计菜单 WLMT
const baseRoute = '/walmart-web';
export const WLMTStatistical = [
  {
    key: 'WLMT_Statistical',
    id: null,
    platform: 'WLMT',
    typeStyle: 'menu',
    icon: 'walmart',
    route: '',
    apiPath: '',
    description: '沃尔玛',
    parentKey: 'ALL_Statistical',
    children: [
      {
        key: 'WLMT_DataReports',
        id: null,
        platform: 'WLMT',
        typeStyle: 'menu',
        icon: 'icon-company',
        route: '',
        apiPath: '',
        description: '数据报告',
        parentKey: 'WLMT_Statistical',
        name: '数据报告',
        children: [
          {
            key: 'WLMT_ShopReport',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/statistics/shop-report',
            apiPath: '',
            description: '商品报告',
            parentKey: 'WLMT_DataReports',
            collection: true,
            children: []
          },
          {
            key: 'WLMT_AchieReport',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/statistics/achie-report',
            apiPath: '',
            description: '商品业绩报告',
            parentKey: 'WLMT_DataReports',
          },
          {
            key: 'WLMT_BuyboxReport',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/statistics/buybox-report',
            apiPath: '',
            description: 'Buybox报告',
            parentKey: 'WLMT_DataReports',
          },
          {
            key: 'WLMT_CapReport',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/statistics/cap-report',
            apiPath: '',
            description: 'CAP报告',
            parentKey: 'WLMT_DataReports',
          },
          {
            key: 'WLMT_PromotionReport',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/statistics/promotion-report',
            apiPath: '',
            description: '促销报告',
            parentKey: 'WLMT_DataReports',
          }
        ]
      }
    ]
  }
]