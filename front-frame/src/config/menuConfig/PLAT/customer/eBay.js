// 客服Ebay
const baseRoute = '/multiplatform-web';
export default {
  key: "PLAT_customerEbay",
  id: null,
  platform: 'EBAY',
  typeStyle: "menu",
  icon: "eBay",
  route: '',
  apiPath: null,
  description: "EBAY",
  name: 'EBAY',
  parentKey: "PLAT_customer",
  isMultiMenu: true,
  children: [
    {
      key: "PLAT_customerEbay_eBayCustomerService",
      id: null,
      platform: 'EBAY',
      typeStyle: "page",
      icon: '',
      route: baseRoute + "/eBayCustomerService",
      apiPath: null,
      description: "客服消息",
      name: '客服消息',
      parentKey: "PLAT_customerEbay",
      isMultiMenu: true,
    },
    {
      key: "PLAT_customerEbay_eBayBuyerBargaining",
      id: null,
      platform: 'EBAY',
      typeStyle: "page",
      icon: '',
      route: baseRoute + "/eBayBuyerBargaining",
      apiPath: null,
      description: "议价管理",
      name: '议价管理',
      parentKey: "PLAT_customerEbay",
      isMultiMenu: true,
    },
  ]
}
