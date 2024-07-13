// 客服Lazada
const baseRoute = '/multiplatform-web';
export default {
  key: "PLAT_customerLZD",
  id: null,
  platform: 'LZD',
  typeStyle: "menu",
  icon: "lazada",
  route: '',
  apiPath: null,
  description: "Lazada",
  name: 'Lazada',
  parentKey: "PLAT_customer",
  isMultiMenu: true,
  children: [
    {
      key: "PLAT_customerLZD_lazadaCustomerService",
      id: null,
      platform: 'LZD',
      typeStyle: "page",
      icon: '',
      route: baseRoute + "/lazadaCustomerService",
      apiPath: null,
      description: "客服消息",
      name: '客服消息',
      parentKey: "PLAT_customerLZD",
      isMultiMenu: true,
    },
    {
      key: "PLAT_customerLZD_lazadaBuyerComments",
      id: null,
      platform: 'LZD',
      typeStyle: "page",
      icon: '',
      route: baseRoute + "/lazadaBuyerComments",
      apiPath: null,
      description: "售后管理",
      name: '售后管理',
      parentKey: "PLAT_customerLZD",
      isMultiMenu: true,
    },
  ]
}
