import { WLMTTool } from "./walmart"

export const allTool = [
  {
    key: 'ALL_Tool', // 所有工具菜单
    id: null,
    platform: null,
    typeStyle: 'menu',
    icon: 'tool',
    route: '',
    apiPath: '',
    description: '工具new',
    parentKey: '',
    isMultiMenu: true,
    children: [
      ...WLMTTool
    ]
  }
]