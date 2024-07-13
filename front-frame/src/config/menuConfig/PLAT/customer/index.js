// 客服菜单
import customerTools from "./customerTools"
import eBay from "./eBay";
import lazada from "./lazada";
import shopee from "./shopee";

export const platCustomer = [
  {
    key: 'PLAT_customer',
    id: null,
    platform: 'PLAT',
    typeStyle: 'menu',
    icon: 'system',
    route: '',
    apiPath: '',
    description: '客服',
    parentKey: '',
    name: '客服',
    isMultiMenu: true,
    children: [
      customerTools,
      eBay,
      lazada,
      shopee,
    ]
  }
]