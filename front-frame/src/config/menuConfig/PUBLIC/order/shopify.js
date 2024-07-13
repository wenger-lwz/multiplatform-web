const baseRoute = '/multiplatform-web';

export const SHOPIFYOrder = [
  {
    key: 'SHOPIFY_Order',
    id: null,
    platform: 'SHPY',
    typeStyle: 'menu',
    icon: 'shopify',
    route: '',
    apiPath: '',
    description: 'Shopify',
    parentKey: 'ALL_Order',
    children: [
      {
        key: 'SHOPIFY_OrderManger',
        id: null,
        platform: 'SHPY',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '订单管理',
        parentKey: 'SHOPIFY_Order',
        children: [
          {
            key: 'SHOPIFY_AllOrder',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyAllOrder',
            apiPath: '',
            description: '全部订单',
            parentKey: 'SHOPIFY_OrderManger',
            children: [
              {
                key: 'SHOPIFY_AllOrder-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_AllOrder',
              },
            ]
          },
          {
            key: 'SHOPIFY_OrderAdd',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyOrderAdd',
            apiPath: '',
            description: '创建',
            parentKey: 'SHOPIFY_OrderManger',
            children: [
              {
                key: 'SHOPIFY_OrderAdd-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_OrderAdd',
              },
              {
                key: 'SHOPIFY_OrderAdd-add',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'add',
                icon: '',
                route: '',
                apiPath: '',
                description: '新增按钮',
                parentKey: 'SHOPIFY_OrderAdd'
              },
              {
                key: 'SHOPIFY_OrderAdd-delete',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'delete',
                icon: '',
                route: '',
                apiPath: '',
                description: '删除按钮',
                parentKey: 'SHOPIFY_OrderAdd'
              }
            ]
          },
          {
            key: 'SHOPIFY_ProcessedOrder',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyProcessedOrder',
            apiPath: '',
            description: '待处理',
            parentKey: 'SHOPIFY_OrderManger',
            children: [
              {
                key: 'SHOPIFY_ProcessedOrder-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_ProcessedOrder',
              }]
          },
          {
            key: 'SHOPIFY_DeliveryingOrder',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyDeliveryingOrder',
            apiPath: '',
            description: '发货中',
            parentKey: 'SHOPIFY_OrderManger',
            children: [
              {
                key: 'SHOPIFY_DeliveryingOrder-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_DeliveryingOrder',
              }]
          },
          {
            key: 'SHOPIFY_PartShippedOrder',
            id: null,
            plantfrom: null,
            typeStyle: 'page',
            isDing: false,
            icon: '',
            route: baseRoute + '/shopifyPartShippedOrder',
            apiPath: '',
            description: '部分发货',
            parentKey: 'SHOPIFY_OrderManger',
            children: [
              {
                key: 'SHOPIFY_PartShippedOrder-view',
                id: null,
                plantfrom: null,
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_PartShippedOrder',
              }]
          },
          {
            key: 'SHOPIFY_ShippedOrder',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyShippedOrder',
            apiPath: '',
            description: '已发货',
            parentKey: 'SHOPIFY_OrderManger',
            children: [
              {
                key: 'SHOPIFY_ShippedOrder-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_ShippedOrder',
              }]
          },
          {
            key: 'SHOPIFY_CancelOrder',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyCancelOrder',
            apiPath: '',
            description: '已取消',
            parentKey: 'SHOPIFY_OrderManger',
            children: [
              {
                key: 'SHOPIFY_CancelOrder-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_CancelOrder',
              }]
          }
        ]
      },
      {
        key: 'SHOPIFY_AnomalousOrder',
        id: null,
        platform: 'SHPY',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '异常订单',
        parentKey: 'SHOPIFY_Order',
        children: [
          {
            key: 'SHOPIFY_MatchAnomalous',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyMatchAnomalous',
            apiPath: '',
            description: '匹配异常',
            parentKey: 'SHOPIFY_AnomalousOrder',
            children: [
              {
                key: 'SHOPIFY_MatchAnomalous-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_MatchAnomalous',
              }]
          },
          {
            key: 'SHOPIFY_ShortAnomalous',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyShortAnomalous',
            apiPath: '',
            description: '缺货异常',
            parentKey: 'SHOPIFY_AnomalousOrder',
            children: [
              {
                key: 'SHOPIFY_ShortAnomalous-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_ShortAnomalous',
              }]
          },
          {
            key: 'SHOPIFY_SendAnomalous',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifySendAnomalous',
            apiPath: '',
            description: '发货异常',
            parentKey: 'SHOPIFY_AnomalousOrder',
            children: [
              {
                key: 'SHOPIFY_SendAnomalous-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_SendAnomalous',
              }]
          },
          {
            key: 'SHOPIFY_LogisticsAnomalous',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyLogisticsAnomalous',
            apiPath: '',
            description: '物流异常',
            parentKey: 'SHOPIFY_AnomalousOrder',
            children: [
              {
                key: 'SHOPIFY_LogisticsAnomalous-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_LogisticsAnomalous',
              }]
          }
        ]
      },
      {
        key: 'SHOPIFY_AfterSalesOrder',
        id: null,
        platform: 'SHPY',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '售后订单',
        parentKey: 'SHOPIFY_Order',
        children: [
          {
            key: 'SHOPIFY_CrmOrder',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyCrmOrder',
            apiPath: '',
            description: '客服订单',
            parentKey: 'SHOPIFY_AfterSalesOrder',
            children: [
              {
                key: 'SHOPIFY_CrmOrder-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_CrmOrder',
              }]
          },
          {
            key: 'SHOPIFY_ReturnOrder',
            id: null,
            platform: 'SHPY',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopifyCrmOrder',
            apiPath: '',
            description: '退货退款订单',
            parentKey: 'SHOPIFY_AfterSalesOrder',
            children: [
              {
                key: 'SHOPIFY_ReturnOrder-view',
                id: null,
                platform: 'SHPY',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPIFY_ReturnOrder',
              }]
          },
        ]
      }
    ]
  }
]