import { errorConfig } from '@/config/httpErrorCode'
import axios from 'axios'
import { GjMessage } from "@gj/atom"
import { distoryLogin } from '@/utils/common'
import store from "@/store"
import { useVirtualEnv } from "@gj/env-cli/virtual-env.base";

let tipsErrorConfig = errorConfig.zh; // 默认中文

export function getApiAddr() {
  // 测试环境网关 http://gateway.apis.gerpgo.com/   生产环境网关 https://gateway.apist.gerpgo.com/
  // if (location.hostname.includes('trideer.') || location.hostname.includes('cloudgx.') || location.hostname.includes('.app.')) {
  //   return 'https://gateway.apist.gerpgo.com';
  // } else if (location.hostname.includes('.web.')) {
  //   return 'http://gateway.apis.gerpgo.com';
  // } else if (location.hostname.includes('.localtest.')) {
  //   return 'http://gateway.localtestapi.gerpgo.com';
  // } else {
  //   return 'http://gateway.apis.gerpgo.com';
  // }
  const { env } = useVirtualEnv();

  // 请在 .env 文件 修改 VITE_APP_BASE_URL
  return env?.gateway?.host || `${process.env.VUE_APP_PRODUCTION_API}`;
}

export const baseURL = getApiAddr();
// if (process.env.NODE_ENV === 'development') {
//   // 请修改 .env 文件的 VITE_APP_BASE_URL 变量
//   baseURL = `${process.env.VUE_APP_PRODUCTION_API}`;
//   baseURL = getApiAddr();
// } else {
//   baseURL = getApiAddr();
// }
/* eslint-disable */
/*
 * 和开发人员本地联调的地址 VUE_APP_DEV_API
 * 自动识别环境的地址 VUE_APP_PRODUCTION_API
 */
const service = axios.create({
  baseURL: baseURL,
  timeout: 30000
})

service.interceptors.request.use(
  config => {
    let isToken = true // 是否需要token
    // 空白参数拦截
    const params = config.data || config.params
    const language = store.getters?.language
    // if (language) tipsErrorConfig = errorConfig[language];

    if (config?.isToken?.toString() === 'false') {
      isToken = false
    }
    if (isToken) {
      config.headers.common['x-auth-token'] = store.getters?.getUserInfo?.token
    }

    const { env: { headers } } = useVirtualEnv();

    if (headers) {
      // eslint-disable-next-line no-return-assign
      Object.entries(headers).forEach(([key, value]) => config.headers[key] = value === null ? 'null' : value);
    }

    config.headers['Accept-Language'] = language === 'zh' ? 'zh-CN' : 'en-US'
    if (!(params instanceof FormData || config.skipProcessData)) {
      const resultParams = {}
      for (const key in params) {
        if (params[key] || params[key] === 0 || params[key] === '0') {
          resultParams[key] = typeof params[key] === 'string' ? params[key].toString().trim() : params[key]
        }
      }
      if (config.params) {
        config.params = resultParams
      } else if (config.data) {
        config.data = resultParams
      }
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    if (response.config.responseType === "blob") {
      return Promise.resolve(response)
    }
    // let hasError = false;
    const msg = getMessageFromResponse(response);

    // http 非正常返回
    if (response.status !== 200) {
      GjMessage.error(msg);
      return Promise.reject({
        ...response.data,
        errorMsg: msg
      });
      // 有些接口没有返回数据（response.data）但却是成功的，不需要报错
    } else if (response.data && !(response.data.code === 200 || response.data.code === 0)) {
      GjMessage.error(msg)
      return Promise.reject({
        ...response.data,
        errorMsg: msg
      });
    }

    return Promise.resolve({
      ...response.data,
      errorMsg: ''
    });
  },
  error => {
    const language = store.getters?.language;
    let msg = '';

    if (language) tipsErrorConfig = errorConfig[language];

    if (error?.response) {
      const status = error.response.status;
      msg = getMessageFromResponse(error.response);

      if (status === 401 || status === 403) {
        if (location.pathname !== '/auth/login') {
          distoryLogin()
        }
      }

      msg = msg || tipsErrorConfig[status] ||
        `${tipsErrorConfig["default"]}`

      GjMessage.error(
        msg
      )
      // 注释掉下面一行的 resolve，会执行函数底部的 reject
      // return Promise.resolve({...error.response.data, errorMsg: msg})
    } else {
      // 无状态返回, 例如网络错误
      let e = error.toString()
      if (e.indexOf("timeout") >= 0) {
        GjMessage.error(tipsErrorConfig["timeout"]);
      } else if (e.indexOf("Error: Network Error") >= 0) {
        GjMessage.error(
          `${tipsErrorConfig["Network"]}`
        )
      } else {
        GjMessage.error(
          `${tipsErrorConfig["default"]}`
        )
      }
    }
    return Promise.reject({ ...error, errorMsg: msg })
  }
)

function getMessageFromResponse(response) {
  const msg = response?.data?.msg || response?.data?.messages || tipsErrorConfig.default;
  return (msg instanceof Array ? msg[0] : msg) || '';
}

export default service

