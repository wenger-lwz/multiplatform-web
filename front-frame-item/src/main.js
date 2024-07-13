import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import permissions from "./directive/permissions";
import tableInfopermissions from "./directive/tableInfopermissions";
import { M_T } from "./store/mutationsTypes";
import i18n from "./i18n";
import "./assets/css/reset.scss";
import GjAtom from "@gj/atom";
import GjBiz from "@gj/biz";
import "@gj/atom/theme-chalk/index.css";
import "@gj/biz/theme-chalk/index.css";
import {
  MainToMicroEventType,
  MicroAppType,
  useMicroAppNotice,
  useMicroAppProvide,
  useMicroBuriedPoint,
} from "@gj/micro-frontend";
// 获取token 和 语言信息
import { getQueryPrams } from "./utils/common";
const userInfo = getQueryPrams();
if (userInfo?.token) {
  store.dispatch(M_T.USER_INFO, JSON.stringify(userInfo));
}
useMicroAppProvide();
// 这种写法是必须的需要优先注册路由才能渲染项目
async function appInit() {
  const { registerMicroApp, sendRouteTable, registerOneListener } =
    useMicroAppNotice();
  // 注册应用
  registerMicroApp(MicroAppType.AMZ_FV);
  // 注册路由表
  sendRouteTable(router.options.routes);
  // 埋点
  useMicroBuriedPoint();

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(true);
    }, 1000);
    registerOneListener(MainToMicroEventType.ROUTE_TABLE_LOADED, () => {
      clearTimeout(timer);
      resolve(true);
    });
  });
}

appInit().then(() => {
  const app = createApp(App);
  app.config.globalProperties.$mt = M_T;
  app
    .use(store)
    .use(router)
    .use(GjAtom, { iconSrc: "" })
    .use(GjBiz)
    .use(i18n)
    .use(permissions)
    .use(tableInfopermissions)
    .mount("#multiplatform-web");
});
