const baseRoute = '/multiplatform-web';
export const EBAYOrder = [
  {
    key: 'EBAY_Order',
    id: null,
    platform: 'EBAY',
    typeStyle: 'menu',
    icon: 'eBay',
    route: '',
    apiPath: '',
    description: 'EBay',
    parentKey: 'ALL_Order',
    children: [
      {
        key: 'EBAY_OrderManger',
        id: null,
        platform: 'EBAY',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '订单管理',
        parentKey: 'EBAY_Order',
        children: [
          {
            key: 'EBAY_AllOrder',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayAllOrder',
            apiPath: '',
            description: '全部订单',
            parentKey: 'EBAY_OrderManger',
            children: [
              {
                key: 'EBAY_AllOrder-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_AllOrder',
              },
            ]
          },
          {
            key: 'EBAY_OrderAdd',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayOrderAdd',
            apiPath: '',
            description: '创建',
            parentKey: 'EBAY_OrderManger',
            children: [
              {
                key: 'EBAY_OrderAdd-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_OrderAdd',
              },
              {
                key: 'EBAY_OrderAdd-add',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'add',
                icon: '',
                route: '',
                apiPath: '',
                description: '新增按钮',
                parentKey: 'EBAY_OrderAdd',
              },
              {
                key: 'EBAY_OrderAdd-delete',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'delete',
                icon: '',
                route: '',
                apiPath: '',
                description: '删除按钮',
                parentKey: 'EBAY_OrderAdd',
              }
            ]
          },
          {
            key: 'EBAY_ProcessedOrder',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayProcessedOrder',
            apiPath: '',
            description: '待处理',
            parentKey: 'EBAY_OrderManger',
            children: [
              {
                key: 'EBAY_ProcessedOrder-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_ProcessedOrder',
              }]
          },
          {
            key: 'EBAY_DeliveryingOrder',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayDeliveryingOrder',
            apiPath: '',
            description: '发货中',
            parentKey: 'EBAY_OrderManger',
            children: [
              {
                key: 'EBAY_DeliveryingOrder-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_DeliveryingOrder',
              }]
          },
          {
            key: 'EBAY_PartShippedOrder',
            id: null,
            plantfrom: null,
            typeStyle: 'page',
            isDing: false,
            icon: '',
            route: baseRoute + '/eBayPartShippedOrder',
            apiPath: '',
            description: '部分发货',
            parentKey: 'EBAY_OrderManger',
            children: [
              {
                key: 'EBAY_PartShippedOrder-view',
                id: null,
                plantfrom: null,
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_PartShippedOrder',
              }]
          },
          {
            key: 'EBAY_ShippedOrder',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayShippedOrder',
            apiPath: '',
            description: '已发货',
            parentKey: 'EBAY_OrderManger',
            children: [
              {
                key: 'EBAY_ShippedOrder-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_ShippedOrder',
              }]
          },
          {
            key: 'EBAY_CancelOrder',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayCancelOrder',
            apiPath: '',
            description: '已取消',
            parentKey: 'EBAY_OrderManger',
            children: [
              {
                key: 'EBAY_CancelOrder-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_CancelOrder',
              }]
          }
        ]
      },
      {
        key: 'EBAY_AnomalousOrder',
        id: null,
        platform: 'EBAY',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '异常订单',
        parentKey: 'EBAY_Order',
        children: [
          {
            key: 'EBAY_MatchAnomalous',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayMatchAnomalous',
            apiPath: '',
            description: '匹配异常',
            parentKey: 'EBAY_AnomalousOrder',
            children: [
              {
                key: 'EBAY_MatchAnomalous-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_MatchAnomalous',
              }]
          },
          {
            key: 'EBAY_ShortAnomalous',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayShortAnomalous',
            apiPath: '',
            description: '缺货异常',
            parentKey: 'EBAY_AnomalousOrder',
            children: [
              {
                key: 'EBAY_ShortAnomalous-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_ShortAnomalous',
              }]
          },
          {
            key: 'EBAY_SendAnomalous',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBaySendAnomalous',
            apiPath: '',
            description: '发货异常',
            parentKey: 'EBAY_AnomalousOrder',
            collection: true,
            children: [
              {
                key: 'EBAY_SendAnomalous-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_SendAnomalous',
              }]
          },
          {
            key: 'EBAY_LogisticsAnomalous',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayLogisticsAnomalous',
            apiPath: '',
            description: '物流异常',
            parentKey: 'EBAY_AnomalousOrder',
            children: [
              {
                key: 'EBAY_LogisticsAnomalous-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_LogisticsAnomalous',
              }]
          }
        ]
      },
      {
        key: 'EBAY_AfterSalesOrder',
        id: null,
        platform: 'EBAY',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '售后订单',
        parentKey: 'EBAY_Order',
        collection: true,
        children: [
          {
            key: 'EBAY_CrmOrder',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayCrmOrder',
            apiPath: '',
            description: '客服订单',
            parentKey: 'EBAY_AfterSalesOrder',
            children: [
              {
                key: 'EBAY_CrmOrder-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_CrmOrder',
              }]
          },
          {
            key: 'EBAY_ReturnOrder',
            id: null,
            platform: 'EBAY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/eBayCrmOrder',
            apiPath: '',
            description: '退货退款订单',
            parentKey: 'EBAY_AfterSalesOrder',
            children: [
              {
                key: 'EBAY_ReturnOrder-view',
                id: null,
                platform: 'EBAY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'EBAY_ReturnOrder',
              }]
          },
        ]
      }
    ]
  }
]