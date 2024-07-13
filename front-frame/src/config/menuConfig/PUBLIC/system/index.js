import { AMZSystem } from "./amz"
import { WLMTSystem } from "./walmart"

export const allSystem = [
  {
    key: 'ALL_System', // 所有系统设置
    id: null,
    platform: null,
    typeStyle: 'menu',
    icon: 'system',
    route: '',
    apiPath: '',
    description: '系统设置new',
    parentKey: '',
    isMultiMenu: true,
    children: [
      ...AMZSystem,
      ...WLMTSystem
    ]
  }
]