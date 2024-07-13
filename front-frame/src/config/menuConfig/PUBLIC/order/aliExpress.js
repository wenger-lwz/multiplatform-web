const baseRoute = '/multiplatform-web';
export const ALIOrder = [
  {
    key: 'ALI_Order',
    id: null,
    platform: 'ALI',
    typeStyle: 'menu',
    icon: 'aliExpress',
    route: '',
    apiPath: '',
    description: '速卖通',
    parentKey: 'ALL_Order',
    children: [
      {
        key: 'ALI_OrderManger',
        id: null,
        platform: 'ALI',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '订单管理',
        parentKey: 'ALI_Order',
        children: [
          {
            key: 'ALI_AllOrder',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',
            icon: '',
            route: baseRoute + '/aliAllOrder',
            apiPath: '',
            description: '全部订单',
            parentKey: 'ALI_OrderManger',
            collection: true,
            children: [
              {
                key: 'ALI_AllOrder-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_AllOrder',
              },
            ]
          },
          {
            key: 'ALI_OrderAdd',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliOrderAdd',
            apiPath: '',
            description: '创建',
            parentKey: 'ALI_OrderManger',
            children: [
              {
                key: 'ALI_OrderAdd-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_OrderAdd',
              },
              {
                key: 'ALI_OrderAdd-add',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'add',
                icon: '',
                route: '',
                apiPath: '',
                description: '新增按钮',
                parentKey: 'ALI_OrderAdd',
              },
              {
                key: 'ALI_OrderAdd-delete',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'delete',
                icon: '',
                route: '',
                apiPath: '',
                description: '删除按钮',
                parentKey: 'ALI_OrderAdd',
              }
            ]
          },
          {
            key: 'ALI_ProcessedOrder',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliProcessedOrder',
            apiPath: '',
            description: '待处理',
            parentKey: 'ALI_OrderManger',
            children: [
              {
                key: 'ALI_ProcessedOrder-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_ProcessedOrder',
              }]
          },
          {
            key: 'ALI_DeliveryingOrder',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliDeliveryingOrder',
            apiPath: '',
            description: '发货中',
            parentKey: 'ALI_OrderManger',
            children: [
              {
                key: 'ALI_DeliveryingOrder-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_DeliveryingOrder',
              }]
          },
          {
            key: 'ALI_PartShippedOrder',
            id: null,
            plantfrom: null,
            typeStyle: 'page',
            isDing: false,
            icon: '',
            route: baseRoute + '/aliPartShippedOrder',
            apiPath: '',
            description: '部分发货',
            parentKey: 'ALI_OrderManger',
            children: [
              {
                key: 'ALI_PartShippedOrder-view',
                id: null,
                plantfrom: null,
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_PartShippedOrder',
              }]
          },
          {
            key: 'ALI_ShippedOrder',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliShippedOrder',
            apiPath: '',
            description: '已发货',
            parentKey: 'ALI_OrderManger',
            children: [
              {
                key: 'ALI_ShippedOrder-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_ShippedOrder',
              }]
          },
          {
            key: 'ALI_CancelOrder',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliCancelOrder',
            apiPath: '',
            description: '已取消',
            parentKey: 'ALI_OrderManger',
            children: [
              {
                key: 'ALI_CancelOrder-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_CancelOrder',
              }]
          }
        ]
      },
      {
        key: 'ALI_AnomalousOrder',
        id: null,
        platform: 'ALI',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '异常订单',
        parentKey: 'ALI_Order',
        children: [
          {
            key: 'ALI_MatchAnomalous',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliMatchAnomalous',
            apiPath: '',
            description: '匹配异常',
            parentKey: 'ALI_AnomalousOrder',
            children: [
              {
                key: 'ALI_MatchAnomalous-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_MatchAnomalous',
              }]
          },
          {
            key: 'ALI_ShortAnomalous',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliShortAnomalous',
            apiPath: '',
            description: '缺货异常',
            parentKey: 'ALI_AnomalousOrder',
            children: [
              {
                key: 'ALI_ShortAnomalous-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_ShortAnomalous',
              }]
          },
          {
            key: 'ALI_SendAnomalous',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliSendAnomalous',
            apiPath: '',
            description: '发货异常',
            parentKey: 'ALI_AnomalousOrder',
            children: [
              {
                key: 'ALI_SendAnomalous-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_SendAnomalous',
              }]
          },
          {
            key: 'ALI_LogisticsAnomalous',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliLogisticsAnomalous',
            apiPath: '',
            description: '物流异常',
            parentKey: 'ALI_AnomalousOrder',
            children: [
              {
                key: 'ALI_LogisticsAnomalous-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_LogisticsAnomalous',
              }]
          }
        ]
      },
      {
        key: 'ALI_AfterSalesOrder',
        id: null,
        platform: 'ALI',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '售后订单',
        parentKey: 'ALI_Order',
        children: [
          {
            key: 'ALI_CrmOrder',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliCrmOrder',
            apiPath: '',
            description: '客服订单',
            parentKey: 'ALI_AfterSalesOrder',
            children: [
              {
                key: 'ALI_CrmOrder-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_CrmOrder',
              }]
          },
          {
            key: 'ALI_ReturnOrder',
            id: null,
            platform: 'ALI',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/aliCrmOrder',
            apiPath: '',
            description: '退货退款订单',
            parentKey: 'ALI_AfterSalesOrder',
            children: [
              {
                key: 'ALI_ReturnOrder-view',
                id: null,
                platform: 'ALI',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'ALI_ReturnOrder',
              }]
          },
        ]
      }
    ]
  }
]