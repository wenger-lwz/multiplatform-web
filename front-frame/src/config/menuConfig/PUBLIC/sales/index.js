import { AMZSale } from "./amz"
import { WLMTSale } from "./walmart"

export const allSale = [
  {
    key: 'ALL_Sale', // 所有系统销售
    id: null,
    platform: null,
    typeStyle: 'menu',
    icon: 'sale',
    route: '',
    apiPath: '',
    description: '销售new',
    parentKey: '',
    isMultiMenu: true,   // 样式
    children: [
      ...AMZSale,
      ...WLMTSale
    ]
  }
]