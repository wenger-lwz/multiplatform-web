// 亚马逊的系统设置菜单
const baseRoute = '/amz-web';
export const AMZFinance = [
  {
    key: 'AMZ_Finance',
    id: null,
    platform: 'AMZ',
    typeStyle: 'menu',
    icon: 'amazon',
    route: '',
    apiPath: '',
    description: '亚马逊',
    parentKey: 'ALL_Finance',
    children: [
      {
        key: 'v2.menu.finance.feeMenu',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: 'amazon',
        route: null,
        apiPath: '',
        description: '亚马付款',
        parentKey: 'AMZ_Finance',
        children: [
          {
            key: 'v2.menu.finance.payrollRequisition',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'amazon',
            route: '/amz-web/finance/payrollRequisition',
            apiPath: '',
            description: '亚马逊请款池',
            parentKey: 'v2.menu.finance.feeMenu',
          }
        ]
      },
      {
        key: 'v2.menu.finance.costManagement',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: 'amazon',
        route: null,
        apiPath: '',
        description: '亚马逊成本管理',
        parentKey: 'AMZ_Finance',
        children: [
          {
            key: 'v2.menu.finance.costCenter',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'amazon',
            route: '/amz-web/finance/costCenter',
            apiPath: '',
            description: '亚马逊成本中心',
            parentKey: 'v2.menu.finance.costManagement',
          }
        ]
      },
      {
        key: 'v2.menu.finance.paymentMenu',
        id: null,
        platform: 'AMZ',
        typeStyle: 'menu',
        icon: '',
        route: null,
        apiPath: '',
        description: '亚马逊回款',
        parentKey: 'AMZ_Finance',
        children: [
          {
            key: 'v2.menu.finance.monthSettlement',
            id: null,
            platform: 'AMZ',
            typeStyle: 'page',
            icon: 'amazon',
            route: '/amz-web/finance/monthSettlement',
            apiPath: '',
            description: '亚马逊月结算',
            parentKey: 'v2.menu.finance.paymentMenu',
          }
        ]
      },
    ]
  }
]