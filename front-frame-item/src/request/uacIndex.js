// 中台相关
import { GjMessage } from "@gj/atom";
import errorConfig from "@/config";
import axios from "axios";
import store from "@/store";
import { microAppNotice, MicroToMainEventType } from "@gj/micro-frontend";
import { distoryLogin } from "@/utils/common";

const language =
  (localStorage.getItem("USER_INFO") &&
    JSON.parse(localStorage.getItem("USER_INFO")).language) ||
  (navigator.language || navigator.userLanguage).split("-")[0] ||
  "zh";

const tipsErrorConfig = errorConfig[language];

/* eslint-disable */
const service = axios.create({
  baseURL: process.env.VUE_APP_PRODUCTION_API_UAC,
  timeout: 30000,
});

service.interceptors.request.use(
  (config) => {
    let isToken = true; // 是否需要token
    // 空白参数拦截
    const params = config.data || config.params;
    if (config?.isToken?.toString() === "false") {
      isToken = false;
    }
    if (isToken) {
      config.headers.common["token"] = store.getters?.getUserInfo?.token;
    }
    config.headers.common["language"] = language === "zh" ? "zh-CN" : "en-US";
    config.headers.common["x-auth-token"] = store.getters?.getUserInfo?.token;

    if (!(params instanceof FormData) && !Array.isArray(params)) {
      const resultParams = {};
      for (const key in params) {
        if (params[key] || params[key] === 0 || params[key] === "0") {
          resultParams[key] =
            typeof params[key] === "string"
              ? params[key].toString().trim()
              : params[key];
        }
      }
      if (config.params) {
        config.params = resultParams;
      } else if (config.data) {
        config.data = resultParams;
      }
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    // http返回正常
    if (response.status === 200) {
      if (
        response.data.code === "200" ||
        response.data.code === 200 ||
        response.data.code === 0
      ) {
        // 接口返回正常
        return Promise.resolve(response.data);
      } else if (response.data instanceof Blob) {
        return Promise.resolve(response.data);
      } else {
        // 接口出现错误
        GjMessage.error(
          tipsErrorConfig[response.data.code] ||
            `${tipsErrorConfig["default"]},接口错误状态码为：${response.data.code}`
        );
        return Promise.reject(response.data);
      }
    } else {
      GjMessage.error(
        tipsErrorConfig[response.status] ||
          `${tipsErrorConfig["default"]},接口错误状态码为1：${response.status}`
      );
      return Promise.reject(response.data);
    }
  },
  (error) => {
    if (error.response) {
      const status = error?.response?.status;
      GjMessage.error(
        tipsErrorConfig[status] ||
          `${tipsErrorConfig["default"]},接口错误状态码为2：${status}`
      );
      if (status === 401 || status === 403) {
        distoryLogin();
        microAppNotice.emit(MicroToMainEventType.UNAUTHORIZED, {});
      }
    } else {
      let e = error.toString();
      if (e.indexOf("timeout") >= 0) {
        GjMessage.error(tipsErrorConfig["timeout"]);
      } else if (e.indexOf("Error: Network Error") >= 0) {
        GjMessage.error(
          `${tipsErrorConfig["Network"]},接口错误状态码为3：` + e.toString()
        );
      } else {
        GjMessage.error(
          `${tipsErrorConfig["default"]},接口错误状态码为4：` + e.toString()
        );
      }
    }
    return Promise.reject(error);
  }
);

export default service;
