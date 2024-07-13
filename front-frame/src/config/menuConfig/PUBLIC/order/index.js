import { EBAYOrder } from './ebay'
import { ALIOrder } from './aliExpress'
import { LAZADAOrder } from './lazada'
import { SHOPEEOrder } from './shopee'
import { SHOPIFYOrder } from './shopify'
import { AMZOrder } from "./amz"

export const allOrder = [
  {
    key: 'ALL_Order', // 所有平台的订单
    id: null,
    platform: null,
    typeStyle: 'menu',
    icon: 'order',
    route: '',
    apiPath: '',
    description: '订单',
    parentKey: '',
    isMultiMenu: true,
    children: [
      ...EBAYOrder,
      ...ALIOrder,
      ...LAZADAOrder,
      ...SHOPEEOrder,
      ...SHOPIFYOrder,
      ...AMZOrder
    ]
  }
]