const baseRoute = '/multiplatform-web';
export const LAZADAOrder = [
  {
    key: 'LAZADA_Order',
    id: null,
    platform: 'LZD',
    typeStyle: 'menu',
    icon: 'lazada',
    route: '',
    apiPath: '',
    description: 'Lazada',
    parentKey: 'ALL_Order',
    children: [
      {
        key: 'LAZADA_OrderManger',
        id: null,
        platform: 'LZD',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '订单管理',
        parentKey: 'LAZADA_Order',
        children: [
          {
            key: 'LAZADA_AllOrder',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaAllOrder',
            apiPath: '',
            description: '全部订单',
            parentKey: 'LAZADA_OrderManger',
            children: [
              {
                key: 'LAZADA_AllOrder-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_AllOrder',
              },
            ]
          },
          {
            key: 'LAZADA_OrderAdd',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaOrderAdd',
            apiPath: '',
            description: '创建',
            parentKey: 'LAZADA_OrderManger',
            children: [
              {
                key: 'LAZADA_OrderAdd-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_OrderAdd',
              },
              {
                key: 'LAZADA_OrderAdd-add',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'add',
                icon: '',
                route: '',
                apiPath: '',
                description: '新增按钮',
                parentKey: 'LAZADA_OrderAdd',
              },
              {
                key: 'LAZADA_OrderAdd-delete',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'delete',
                icon: '',
                route: '',
                apiPath: '',
                description: '删除按钮',
                parentKey: 'LAZADA_OrderAdd',
              }
            ]
          },
          {
            key: 'LAZADA_ProcessedOrder',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaProcessedOrder',
            apiPath: '',
            description: '待处理',
            parentKey: 'LAZADA_OrderManger',
            children: [
              {
                key: 'LAZADA_ProcessedOrder-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_ProcessedOrder',
              }]
          },
          {
            key: 'LAZADA_DeliveryingOrder',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaDeliveryingOrder',
            apiPath: '',
            description: '发货中',
            parentKey: 'LAZADA_OrderManger',
            children: [
              {
                key: 'LAZADA_DeliveryingOrder-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_DeliveryingOrder',
              }]
          },
          {
            key: 'LAZADA_PartShippedOrder',
            id: null,
            plantfrom: null,
            typeStyle: 'page',
            isDing: false,
            icon: '',
            route: baseRoute + '/lazadaPartShippedOrder',
            apiPath: '',
            description: '部分发货',
            parentKey: 'LAZADA_OrderManger',
            children: [
              {
                key: 'LAZADA_PartShippedOrder-view',
                id: null,
                plantfrom: null,
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_PartShippedOrder',
              }]
          },
          {
            key: 'LAZADA_ShippedOrder',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaShippedOrder',
            apiPath: '',
            description: '已发货',
            parentKey: 'LAZADA_OrderManger',
            children: [
              {
                key: 'LAZADA_ShippedOrder-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_ShippedOrder',
              }]
          },
          {
            key: 'LAZADA_CancelOrder',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaCancelOrder',
            apiPath: '',
            description: '已取消',
            parentKey: 'LAZADA_OrderManger',
            children: [
              {
                key: 'LAZADA_CancelOrder-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_CancelOrder',
              }]
          }
        ]
      },
      {
        key: 'LAZADA_AnomalousOrder',
        id: null,
        platform: 'LZD',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '异常订单',
        parentKey: 'LAZADA_Order',
        children: [
          {
            key: 'LAZADA_MatchAnomalous',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaMatchAnomalous',
            apiPath: '',
            description: '匹配异常',
            parentKey: 'LAZADA_AnomalousOrder',
            children: [
              {
                key: 'LAZADA_MatchAnomalous-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_MatchAnomalous',
              }]
          },
          {
            key: 'LAZADA_ShortAnomalous',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaShortAnomalous',
            apiPath: '',
            description: '缺货异常',
            parentKey: 'LAZADA_AnomalousOrder',
            children: [
              {
                key: 'LAZADA_ShortAnomalous-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_ShortAnomalous',
              }]
          },
          {
            key: 'LAZADA_SendAnomalous',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaSendAnomalous',
            apiPath: '',
            description: '发货异常',
            parentKey: 'LAZADA_AnomalousOrder',
            children: [
              {
                key: 'LAZADA_SendAnomalous-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_SendAnomalous',
              }]
          },
          {
            key: 'LAZADA_LogisticsAnomalous',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaLogisticsAnomalous',
            apiPath: '',
            description: '物流异常',
            parentKey: 'LAZADA_AnomalousOrder',
            children: [
              {
                key: 'LAZADA_LogisticsAnomalous-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_LogisticsAnomalous',
              }]
          }
        ]
      },
      {
        key: 'LAZADA_AfterSalesOrder',
        id: null,
        platform: 'LZD',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '售后订单',
        parentKey: 'LAZADA_Order',
        children: [
          {
            key: 'LAZADA_CrmOrder',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaCrmOrder',
            apiPath: '',
            description: '客服订单',
            parentKey: 'LAZADA_AfterSalesOrder',
            children: [
              {
                key: 'LAZADA_CrmOrder-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_CrmOrder',
              }]
          },
          {
            key: 'LAZADA_ReturnOrder',
            id: null,
            platform: 'LZD',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/lazadaCrmOrder',
            apiPath: '',
            description: '退货退款订单',
            parentKey: 'LAZADA_AfterSalesOrder',
            children: [
              {
                key: 'LAZADA_ReturnOrder-view',
                id: null,
                platform: 'LZD',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'LAZADA_ReturnOrder',
              }]
          },
        ]
      }
    ]
  }
]