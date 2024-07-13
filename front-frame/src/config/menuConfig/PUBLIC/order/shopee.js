const baseRoute = '/multiplatform-web';
export const SHOPEEOrder = [
  {
    key: 'SHOPEE_Order',
    id: null,
    platform: 'SHPE',
    typeStyle: 'menu',
    icon: 'shopee',
    route: '',
    apiPath: '',
    description: 'Shopee',
    parentKey: 'ALL_Order',
    children: [
      {
        key: 'SHOPEE_OrderManger',
        id: null,
        platform: 'SHPE',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '订单管理',
        parentKey: 'SHOPEE_Order',
        children: [
          {
            key: 'SHOPEE_AllOrder',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeAllOrder',
            apiPath: '',
            description: '全部订单',
            parentKey: 'SHOPEE_OrderManger',
            children: [
              {
                key: 'SHOPEE_AllOrder-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_AllOrder',
              },
            ]
          },
          {
            key: 'SHOPEE_OrderAdd',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeOrderAdd',
            apiPath: '',
            description: '创建',
            parentKey: 'SHOPEE_OrderManger',
            children: [
              {
                key: 'SHOPEE_OrderAdd-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_OrderAdd',
              },
              {
                key: 'SHOPEE_OrderAdd-add',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'add',
                icon: '',
                route: '',
                apiPath: '',
                description: '新增按钮',
                parentKey: 'SHOPEE_OrderAdd',
              },
              {
                key: 'SHOPEE_OrderAdd-delete',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'delete',
                icon: '',
                route: '',
                apiPath: '',
                description: '删除按钮',
                parentKey: 'SHOPEE_OrderAdd',
              }
            ]
          },
          {
            key: 'SHOPEE_ProcessedOrder',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeProcessedOrder',
            apiPath: '',
            description: '待处理',
            parentKey: 'SHOPEE_OrderManger',
            children: [
              {
                key: 'SHOPEE_ProcessedOrder-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_ProcessedOrder',
              }]
          },
          {
            key: 'SHOPEE_DeliveryingOrder',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeDeliveryingOrder',
            apiPath: '',
            description: '发货中',
            parentKey: 'SHOPEE_OrderManger',
            children: [
              {
                key: 'SHOPEE_DeliveryingOrder-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_DeliveryingOrder',
              }]
          },
          {
            key: 'SHOPEE_PartShippedOrder',
            id: null,
            plantfrom: null,
            typeStyle: 'page',
            isDing: false,
            icon: '',
            route: baseRoute + '/shopeePartShippedOrder',
            apiPath: '',
            description: '部分发货',
            parentKey: 'SHOPEE_OrderManger',
            children: [
              {
                key: 'SHOPEE_PartShippedOrder-view',
                id: null,
                plantfrom: null,
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_PartShippedOrder',
              }]
          },
          {
            key: 'SHOPEE_ShippedOrder',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeShippedOrder',
            apiPath: '',
            description: '已发货',
            parentKey: 'SHOPEE_OrderManger',
            children: [
              {
                key: 'SHOPEE_ShippedOrder-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_ShippedOrder',
              }]
          },
          {
            key: 'SHOPEE_CancelOrder',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeCancelOrder',
            apiPath: '',
            description: '已取消',
            parentKey: 'SHOPEE_OrderManger',
            children: [
              {
                key: 'SHOPEE_CancelOrder-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_CancelOrder',
              }]
          }
        ]
      },
      {
        key: 'SHOPEE_AnomalousOrder',
        id: null,
        platform: 'SHPE',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '异常订单',
        parentKey: 'SHOPEE_Order',
        children: [
          {
            key: 'SHOPEE_MatchAnomalous',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeMatchAnomalous',
            apiPath: '',
            description: '匹配异常',
            parentKey: 'SHOPEE_AnomalousOrder',
            children: [
              {
                key: 'SHOPEE_MatchAnomalous-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_MatchAnomalous',
              }]
          },
          {
            key: 'SHOPEE_ShortAnomalous',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeShortAnomalous',
            apiPath: '',
            description: '缺货异常',
            parentKey: 'SHOPEE_AnomalousOrder',
            children: [
              {
                key: 'SHOPEE_ShortAnomalous-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_ShortAnomalous',
              }]
          },
          {
            key: 'SHOPEE_SendAnomalous',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeSendAnomalous',
            apiPath: '',
            description: '发货异常',
            parentKey: 'SHOPEE_AnomalousOrder',
            children: [
              {
                key: 'SHOPEE_SendAnomalous-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_SendAnomalous',
              }]
          },
          {
            key: 'SHOPEE_LogisticsAnomalous',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeLogisticsAnomalous',
            apiPath: '',
            description: '物流异常',
            parentKey: 'SHOPEE_AnomalousOrder',
            children: [
              {
                key: 'SHOPEE_LogisticsAnomalous-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_LogisticsAnomalous',
              }]
          }
        ]
      },
      {
        key: 'SHOPEE_AfterSalesOrder',
        id: null,
        platform: 'SHPE',
        typeStyle: 'menu',
        icon: '',
        route: '',
        apiPath: '',
        description: '售后订单',
        parentKey: 'SHOPEE_Order',
        children: [
          {
            key: 'SHOPEE_CrmOrder',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeCrmOrder',
            apiPath: '',
            description: '客服订单',
            parentKey: 'SHOPEE_AfterSalesOrder',
            children: [
              {
                key: 'SHOPEE_CrmOrder-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_CrmOrder',
              }]
          },
          {
            key: 'SHOPEE_ReturnOrder',
            id: null,
            platform: 'SHPE',
            typeStyle: 'page',

            icon: '',
            route: baseRoute + '/shopeeCrmOrder',
            apiPath: '',
            description: '退货退款订单',
            parentKey: 'SHOPEE_AfterSalesOrder',
            children: [
              {
                key: 'SHOPEE_ReturnOrder-view',
                id: null,
                platform: 'SHPE',
                typeStyle: 'btn',
                buttonType: 'view',
                icon: '',
                route: '',
                apiPath: '',
                description: '查看',
                parentKey: 'SHOPEE_ReturnOrder',
              }]
          },
        ]
      }
    ]
  }
]