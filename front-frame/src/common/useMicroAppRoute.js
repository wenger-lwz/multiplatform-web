import { useRoute } from "vue-router";
import { onMounted, reactive, watch, computed } from "vue";
import { getCurrentApp } from "@/utils/common";
import { appList, appListArray } from "@/config/apps";
import { useStore } from "vuex";
import { nextTick } from "@vue/runtime-core";
import { useMainAppNotice } from "@gj/micro-frontend";

export function useMicroAppRoute() {
  const $router = useRoute();
  const $store = useStore();
  const getStore = $store.getters;
  const { sendRouteChange, registerMicroApp, sendLeaveApp } = useMainAppNotice();

  const routesMap = computed(() => {
    return $store.getters.routesPathMap
  })

  const nodesMap = computed(() => {
    return $store.getters.menuMap
  })

  const data = reactive({
    appListArray,
    currentAppName: $router.fullPath?.split('/')[1] || 'multiplatform-web',
    hasAppList: {}, // 加载过的iframe标识
    userInfo: getStore.getUserInfo, // token在这里
    language: getStore.language, // 语言信息在这里
    is404: false, // 是否显示404
    isOverLoading: false, // 监听加载是否完毕
    timeDown: -1, // 控制预加载的定时器
  });

  const title = () => {

  }

  onMounted(() => {
    const notFound = location.pathname === '/404';

    if (notFound) {
      data.is404 = true
      return;
    }

    const currApp = getCurrentApp();
    const hasExist = appList[currApp.appName];

    if (!hasExist) {
      data.is404 = true;
      return;
    }

    data.is404 = false
    data.hasAppList[currApp.appName] = true
    data.currentAppName = currApp.appName;
    registerMicroApp();
    sendRouteChange(currApp.appName, { route: currApp.route, title: document.title });
    nextTick(() => {
      // 对其他子项目进行预加载
      // 要等第一个项目加载完成之后 马上执行 第二个子项目的预加载
      // data.timeDown = setInterval(() => {
      //   for (let index = 0; index < appListArray.length; index++) {
      //     if (!data.hasAppList[appListArray[index].name]) {
      //       data.hasAppList[appListArray[index].name] = true
      //       break;
      //     }
      //   }
      //   // 所有的子项目都已经加载完毕则停止定时器
      //   let isLoadAll = true
      //   for (const key in appList) {
      //     if (!data.hasAppList[key]) {
      //       isLoadAll = false
      //     }
      //   }
      //   if (isLoadAll) {
      //     clearInterval(data.timeDown)
      //   }
      // }, 5000);
    })
  });

  watch(() => $router.fullPath, (newValue, oldValue) => {
    // 防止语言通知延迟，打开的子项目不是基座选定的语言
    data.language = getStore.language
    const queryParams = {...($router.query || {})};
    // TODO 隐患 这些参数可能是子应用传过来的
    delete queryParams.key;
    delete queryParams.title;
    delete queryParams.isDetailPage;
    const notFound = newValue.split('/')[1] === '404';
    if (notFound) {
      data.is404 = true;
      return;
    }

    data.is404 = false;

    const currAppName = newValue.split('/')[1];
    const previousAppName = oldValue && oldValue.split('/')[1];
    const currApp = getCurrentApp();
    data.currentAppName = currApp.appName;

    if (currAppName === previousAppName) {
      // 这里不需要注册
      // registerMicroApp();
      nextTick(() => {
        sendRouteChange(currApp.appName, { route: currApp.route, queryParams: $router.query, title: document.title });
      })

    } else {
      (previousAppName && previousAppName !== '404') && sendLeaveApp(previousAppName, {});
      if (data.hasAppList[currApp.appName]) {
        // 已注册
        sendRouteChange(currApp.appName, { route: currApp.route, queryParams: $router.query, title: document.title });
      } else {
        // 未注册
        data.hasAppList[currApp.appName] = true;
        nextTick(() => {
          registerMicroApp();
          sendRouteChange(currApp.appName, { route: currApp.route, queryParams: $router.query, title: document.title });
        })

      }
    }
  }, { deep: true, immediate: true });

  return {
    data
  }
}
