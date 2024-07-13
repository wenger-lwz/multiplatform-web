
/*
* 注意：请修改子应用 index.html 的id="app"
* 例如中台uac的 修改为： id="uac-web" 保持和下面的名字一致
*/

// 子项目名称
import { MicroAppType } from "@gj/micro-frontend";
import {getQueryVariable} from "@/utils";
import {useVirtualEnv} from "@gj/env-cli/virtual-env.base";

const configName = {
  // 多平台
  MULTIPLATFORM: 'multiplatform-web',
  // 沃尔玛
  WALMART: 'walmart-web',
  // 亚马逊(X版，暂时先使用iframe代替)
  AMZ: 'amz-web',
  // 中台  uac (暂时也是用iframe代替)
  UAC: 'uac-web',
  AMZ_XV: 'amzxv-web',
  AMZ_FBM: 'amzfbm-web',
  AMZ_FV: 'amzfv-web',
    // 亚马逊(X版VUE版本，暂时先使用iframe代替)
  AMZ_V: 'amzv-web',
}

// 子项目访问地址 默认为开发环境
const configEntryPort = {
  MULTIPLATFORM: '//localhost:30003',
  WALMART: '//localhost:30005',
  AMZ: '//localhost:30007',
  UAC: '//localhost:30009',
  AMZ_XV: '//localhost:30013',
  AMZ_FBM: '//localhost:30015',
  AMZ_FV: '//localhost:30017',
  AMZ_V: '//localhost:30011',
}

export function nameToMicroType(name) {
  const nameToMicroTypeMap = {};

  Object.entries(configName).forEach(([key, value]) => nameToMicroTypeMap[value] = key);

  return nameToMicroTypeMap[name];
}

export function microTypeToName(type) {
  let name;

  Object.entries(configName).forEach(([key, value]) => {
    if (MicroAppType[key] === type) {
      name = value;
    }
  });

  return `/${name}`;
}


// baseRoute
const baseRoute = {
  MULTIPLATFORM: '/multiplatform-app',
  WALMART: '/walmart-app',
  AMZ: '/amz-app',
  AMZ_V: '/amzv-app',
  UAC: '/uac-app',
  AMZ_XV: '/amzxv-app',
  AMZ_FBM: '/amzfbm-app',
}


if (process.env.NODE_ENV === 'localhost') {
  configEntryPort.MULTIPLATFORM = '//localhost:30003/multiplatform-app/'
  configEntryPort.WALMART = '//localhost:30005/walmart-app/'
  configEntryPort.AMZ = '//localhost:30007/amz-app/'
  configEntryPort.AMZ_V = '//localhost:30011/amzv-app/'
  configEntryPort.UAC = '//localhost:30009/uac-app/'
  configEntryPort.AMZ_XV = '//localhost:30013/amzxv-app/'
  configEntryPort.AMZ_FBM = '//localhost:30015/amzfbm-app/'
  configEntryPort.AMZ_FV = '//localhost:30017/amzfv-app/'

} else {
  let origin = location.origin;
  configEntryPort.MULTIPLATFORM = location.origin + '/multiplatform-app/'
  configEntryPort.WALMART = location.origin + '/walmart-app/'
  configEntryPort.AMZ = getQueryVariable('amzAppEntryPort', origin) + '/amz-app/'
  configEntryPort.AMZ_V = getQueryVariable('amzvAppEntryPort', origin) + '/amzv-app/'
  configEntryPort.UAC = getQueryVariable('uacAppEntryPort', origin) + '/uac-app/'
  configEntryPort.AMZ_XV = location.origin + '/amzxv-app/'
  configEntryPort.AMZ_FBM = location.origin + '/amzfbm-app/'
  configEntryPort.AMZ_FV = location.origin + '/amzfv-app/'
}

// 子应用集合
export const appList = {
  'multiplatform-web': {
    name: configName.MULTIPLATFORM,
    url: configEntryPort.MULTIPLATFORM,
    baseroute: '/multiplatform-web',
    // 自定义字段，是否是vite项目
    isVite: false,
    // 是否是iframe嵌套
    isIframe: true,
  },
  'uac-web': {
    name: configName.UAC,
    url: configEntryPort.UAC,
    baseroute: '/uac-web',
    isVite: true,
    isIframe: true,
  },
  'walmart-web': {
    name: configName.WALMART,
    url: configEntryPort.WALMART,
    baseroute: '/walmart-web',
    isVite: true,
    isIframe: true,
  },
  // 亚马逊暂时使用 iframe 代替
  'amz-web': {
    name: configName.AMZ,
    url: configEntryPort.AMZ,
    baseroute: '/amz-web',
    isVite: false,
    isIframe: true,
  },
  'amzxv-web': {
    name: configName.AMZ_XV,
    url: configEntryPort.AMZ_XV,
    baseroute: '/amzxv-web',
    isVite: true,
    isIframe: true,
  },
  'amzfbm-web': {
    name: configName.AMZ_FBM,
    url: configEntryPort.AMZ_FBM,
    baseroute: '/amzfbm-web',
    isVite: true,
    isIframe: true,
  },
  'amzfv-web': {
    name: configName.AMZ_FV,
    url: configEntryPort.AMZ_FV,
    baseroute: '/amzfv-web',
    isVite: false,
    isIframe: true,
  },
  // 亚马逊(vue页面)暂时使用 iframe 代替
  'amzv-web': {
    name: configName.AMZ_V,
    url: configEntryPort.AMZ_V,
    baseroute: '/amzv-web',
    isVite: false,
    isIframe: true,
  },
}

export const appListArray = [
  {
    name: configName.MULTIPLATFORM,
    url: configEntryPort.MULTIPLATFORM,
    baseroute: '/multiplatform-app/',
    isVite: false,
    isIframe: true,
  },
  {
    name: configName.UAC,
    url: configEntryPort.UAC,
    baseroute: '/uac-app',
    isVite: true,
    isIframe: true,
  },
  {
    name: configName.WALMART,
    url: configEntryPort.WALMART,
    baseroute: '/walmart-app/',
    isVite: true,
    isIframe: true,
  },
  {
    name: configName.AMZ,
    url: configEntryPort.AMZ,
    baseroute: '/amz-app/',
    isVite: false,
    isIframe: true,
  },
  {
    name: configName.AMZ_XV,
    url: configEntryPort.AMZ_XV,
    baseroute: '/amzxv-app/',
    isVite: false,
    isIframe: true,
  },
  {
    name: configName.AMZ_FBM,
    url: configEntryPort.AMZ_FBM,
    baseroute: '/amzfbm-app/',
    isVite: false,
    isIframe: true,
  },
  {
    name: configName.AMZ_FV,
    url: configEntryPort.AMZ_FV,
    baseroute: '/amzfv-app/',
    isVite: true,
    isIframe: true,
  },
  {
    name: configName.AMZ_V,
    url: configEntryPort.AMZ_V,
    baseroute: '/amzv-app/',
    isVite: false,
    isIframe: true,
  }
]

const { env } = useVirtualEnv();

export const noticeVersion = 'notice_version'   // 跟运维定的  notice_version会替换为版本号
// export const noticeVersion = 'main'
// export const noticeVersion = 'test-1.0.0'
