import _public from "./public";
import order from "./order";
import dashboard from "./dashboard";
import product from "./product";
import wms from "./wms";
import logistics from "./logistics";
import BI from "./BI";
import finance from "./finance";
import customerService from "./customerService";
import published from "./published";
import infrastructure from "./infrastructure";
import procurement from "./procurement";
// import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import ebayField from "./pubilshed/Ebay";
import shopeeField from "./pubilshed/shopee";
import materialCenter from "./pubilshed/materialCenter";
import aliExpress from "./pubilshed/aliExpress";
import lazada from "./pubilshed/lazada";

export default {
  // el: zhLocale.el,
  language: "中文",
  welcome: "欢迎",
  layout: "布局设置",
  loginout: "退出登录",
  cancel: "取消",
  submit: "确定",
  topLayout: "顶部导航",
  sideBarLayout: "侧边导航",
  ..._public,
  ...order,
  ...dashboard,
  ...product,
  ...wms,
  ...logistics,
  ...BI,
  ...finance,
  ...customerService,
  ...published,
  ...infrastructure,
  ...materialCenter,
  ...procurement,
  ...ebayField,
  ...shopeeField,
  ...aliExpress,
  ...lazada,
};
