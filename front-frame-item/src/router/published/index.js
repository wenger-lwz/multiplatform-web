/* 刊登路由文件 */
import generalTools from "./generalTools";
import materialCenter from "./materialCenter";
import eBay from "./eBay";
import ali from "./ali";
import lazada from "./lazada";
import shopee from "./shopee";
import shopify from "./shopify";
const publishedRouter = [
  ...generalTools,
  ...materialCenter,
  ...eBay,
  ...lazada,
  ...shopee,
  ...ali,
  ...shopify,
  {
    path: "/404",
    name: "404",
    meta: {
      key: "404",
      typeStyle: "pageInfo",
      isToken: "noToken",
    },
    component: () => import("@/pages/404.vue"),
  },
];

export default publishedRouter;
