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
// import enLocale from 'element-plus/lib/locale/lang/en'
import ebayField from "./pubilshed/Ebay";
import shopeeField from "./pubilshed/shopee";
import materialCenter from "./pubilshed/materialCenter";
import aliExpress from "./pubilshed/aliExpress";
import lazada from "./pubilshed/lazada";

export default {
  // el: enLocale.el,
  language: "English",
  welcome: "Welcome",
  layout: "Layout settings",
  loginout: "Login Out",
  cancel: "Cancel",
  submit: "Submit",
  topLayout: "Top Layout",
  sideBarLayout: "Sidebar Layout",
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
