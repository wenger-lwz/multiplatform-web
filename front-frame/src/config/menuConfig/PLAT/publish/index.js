import generalTools from './generalTools'
import aliExpress from './aliExpress'
import shopee from './shopee'
import shopify from './shopify'
import lazada from './lazada'
import materialCenter from './materialCenter'
import { eBayPublish } from "./ebay"

export const platPublish = [
  {
    key: 'PLAT_Publish',
    id: null,
    platform: 'PLAT',
    typeStyle: 'menu',
    icon: 'publish',
    route: '',
    apiPath: null,
    description: '刊登',
    parentKey: null,
    isMultiMenu: true,
    children: [
      generalTools,
      aliExpress,
      shopee,
      shopify,
      lazada,
      materialCenter,
      ...eBayPublish
    ]
  }
]
