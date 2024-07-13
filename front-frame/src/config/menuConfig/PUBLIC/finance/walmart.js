// 沃尔玛的财务菜单 WLMT
const baseRoute = '/walmart-web';
export const WLMTFinance = [
  {
    key: 'WLMT_Finance',
    id: null,
    platform: 'WLMT',
    typeStyle: 'menu',
    icon: 'walmart',
    route: '',
    apiPath: '',
    description: '沃尔玛',
    parentKey: 'ALL_Finance',
    children: [
      {
        key: 'WLMT_FinanceReport',
        id: null,
        platform: 'WLMT',
        typeStyle: 'menu',
        icon: 'icon-company',
        route: '',
        apiPath: '',
        description: '数据报告',
        parentKey: 'WLMT_Finance',
        name: '数据报告',
        children: [
          {
            key: 'WLMT_ReconReport',
            id: null,
            platform: 'WLMT',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/finance/recon-report',
            apiPath: '',
            description: '对账报告',
            parentKey: 'WLMT_FinanceReport',
            collection: true,
            name: '对账报告',
            children: []
          }
        ]
      }
    ]
  }
]