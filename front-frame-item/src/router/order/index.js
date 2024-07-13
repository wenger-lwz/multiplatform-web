/* 订单路由文件 */
import eBay from "./eBay";
import aliExpress from "./aliExpress";
import lazada from "./lazada";
import shopee from "./shopee";
import shopify from "./shopify";

const orderRouter = [...eBay, ...aliExpress, ...lazada, ...shopee, ...shopify];

export default orderRouter;
