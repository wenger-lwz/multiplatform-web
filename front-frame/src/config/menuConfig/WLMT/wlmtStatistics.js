const baseRoute = '/walmart-web';
// 统计 wlmtStatistics
export default {
  key: 'WLMT_statistics',
  id: null,
  platform: 'WLMT',
  typeStyle: 'menu',
  icon: 'icon-company',
  route: '',
  apiPath: '',
  description: '统计',
  parentKey: 'WLMT_WEB',
  name: '统计',
  children: [
    {
      key: 'WLMT_dataReports',
      id: null,
      platform: 'WLMT',
      typeStyle: 'menu',
      icon: 'icon-company',
      route: '',
      apiPath: '',
      description: '数据报告',
      parentKey: 'WLMT_statistics',
      name: '数据报告',
      children: [
        {
          key: 'WLMT_shopReport',
          id: null,
          platform: 'WLMT',
          typeStyle: 'page',
          icon: '',
          route: baseRoute + '/statistics/shop-report',
          apiPath: '',
          description: '商品报告',
          parentKey: 'WLMT_dataReports',
          collection: true,
          children: []
        },
        {
          key: 'WLMT_achieReport',
          id: null,
          platform: 'WLMT',
          typeStyle: 'page',
          icon: '',
          route: baseRoute + '/statistics/achie-report',
          apiPath: '',
          description: '商品业绩报告',
          parentKey: 'WLMT_dataReports',
        },
        {
          key: 'WLMT_buyboxReport',
          id: null,
          platform: 'WLMT',
          typeStyle: 'page',
          icon: '',
          route: baseRoute + '/statistics/buybox-report',
          apiPath: '',
          description: 'Buybox报告',
          parentKey: 'WLMT_dataReports',
        },
        {
          key: 'WLMT_capReport',
          id: null,
          platform: 'WLMT',
          typeStyle: 'page',
          icon: '',
          route: baseRoute + '/statistics/cap-report',
          apiPath: '',
          description: 'CAP报告',
          parentKey: 'WLMT_dataReports',
        },
        {
          key: 'WLMT_promotionReport',
          id: null,
          platform: 'WLMT',
          typeStyle: 'page',
          icon: '',
          route: baseRoute + '/promotion-report',
          apiPath: '',
          description: '促销报告',
          parentKey: 'WLMT_dataReports',
        }
      ]
    }
  ]
}