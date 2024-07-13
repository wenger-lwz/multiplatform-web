// 亚马逊的统计菜单
export const AMZStatistical = [
  {
    key: 'AMZ_Statistical',
    id: null,
    platform: 'AMZ',
    typeStyle: 'menu',
    icon: 'amazon',
    route: '',
    apiPath: '',
    description: '亚马逊',
    parentKey: 'ALL_Statistical',
    children: [
      {
        key: 'v2.menu.statistics.trafficMenu',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: 'amazon',
        route: null,
        apiPath: '',
        description: '亚马逊流量',
        parentKey: 'AMZ_Statistical',
        children: [
          {
            key: 'v2.menu.statistics.salesAndTraffic',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'amazon',
            route: '/amz-web/statistics/salesAndTraffic',
            apiPath: '',
            description: '亚马逊流量表现',
            parentKey: 'v2.menu.statistics.trafficMenu',
          }
        ]
      },
      {
        key: 'v2.menu.statistics.profitMenu',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: 'amazon',
        route: null,
        apiPath: '',
        description: '亚马逊利润',
        parentKey: 'AMZ_Statistical',
        children: [
          {
            key: 'v2.menu.statistics.commodityProfitAnalysis',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'amazon',
            route: '/amz-web/statistics/commodityProfitAnalysis',
            apiPath: '',
            description: '亚马逊销售利润分析',
            parentKey: 'v2.menu.statistics.profitMenu',
          }
        ]
      },
      {
        key: 'v2.menu.statistics.salesMenu',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: '',
        route: null,
        apiPath: '',
        description: '亚马逊销售',
        parentKey: 'AMZ_Statistical',
        children: [
          {
            key: 'v2.menu.statistics.commodityOperationAnalysis',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'amazon',
            route: '/amz-web/statistics/commodityOperationAnalysis',
            apiPath: '',
            description: '亚马逊商品表现',
            parentKey: 'v2.menu.statistics.salesMenu',
          }
        ]
      },
    ]
  }
]