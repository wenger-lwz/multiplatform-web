import { createStore } from "vuex";
import userInfo from "./modules/userInfo"; // token及用户信息
import processConfiguration from "./modules/processConfiguration"; // 流程引擎
import dynamiceBay from "./modules/eBay";
import params from "./modules/params";
import lazada from "./modules/lazada";
import aliexpress from "./modules/aliexpress";
import common from "./modules/common";

export default createStore({
  // state: {},
  // mutations: {},
  // actions: {},
  modules: {
    userInfo,
    processConfiguration,
    dynamiceBay,
    params,
    lazada,
    aliexpress,
    common,
  },
});
