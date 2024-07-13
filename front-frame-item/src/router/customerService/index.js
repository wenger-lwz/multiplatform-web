/* 订单路由文件 */
import infrastructure from "./infrastructure";
import shopee from "./shopee";
import eBay from "./eBay";
import lazada from "./lazada";

const serviceRouter = [
  ...infrastructure,
  ...shopee,
  ...eBay,
  ...lazada,
  {
    path: "/eBayCustomerService",
    name: "eBayCustomerService",
    meta: {
      key: "PLAT_customerEbay/eBayCustomerService",
    },
    component: () =>
      import("@pagesSystem/customerService/eBay/customerService.vue"),
  },
];

export default serviceRouter;
