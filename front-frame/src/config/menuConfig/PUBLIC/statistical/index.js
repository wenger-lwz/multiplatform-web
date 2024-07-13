import { AMZStatistical } from "./amz"
import { WLMTStatistical } from "./walmart"

export const allStatistical = [
  {
    key: 'ALL_Statistical', // 所有平台系统统计
    id: null,
    platform: null,
    typeStyle: 'menu',
    icon: 'statistics',
    route: '',
    apiPath: '',
    description: '统计new',
    parentKey: '',
    isMultiMenu: true,
    children: [
      ...AMZStatistical,
      ...WLMTStatistical
    ]
  }
]