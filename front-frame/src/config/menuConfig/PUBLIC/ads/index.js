import { WLMTAds } from "./walmart"

export const allAds = [
  {
    key: 'ALL_Ads', // 所有广告菜单
    id: null,
    platform: null,
    typeStyle: 'menu',
    icon: 'ads',
    route: '',
    apiPath: '',
    description: '广告new',
    parentKey: '',
    isMultiMenu: true,
    children: [
      ...WLMTAds
    ]
  }
]