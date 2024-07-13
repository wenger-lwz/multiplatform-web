import { AMZFinance } from "./amz"
import { WLMTFinance } from "./walmart"

export const allFinance = [
  {
    key: 'ALL_Finance', // 所有系统财务
    id: null,
    platform: null,
    typeStyle: 'menu',
    icon: 'finance',
    route: '',
    apiPath: '',
    description: '财务new',
    parentKey: '',
    isMultiMenu: true,
    children: [
      ...AMZFinance,
      ...WLMTFinance
    ]
  }
]