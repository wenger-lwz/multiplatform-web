import {MicroAppType, MicroToMainEventType, useMainAppNotice} from "@gj/micro-frontend";
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { distoryLogin } from '@/utils/common'
import { microTypeToName } from "../config/apps";
import { computed } from 'vue'
import { useInject as usePendingMessageInject } from './downloadMessage/usePendingMessage'
import {RouteTable} from "@/common/RouteTable";

export function useMicroAppListener() {
  const { registerListener, sendRouteTableLoaded } = useMainAppNotice();
  const { notify } = usePendingMessageInject();
  const $router = useRouter()
  const $store = useStore()
  const routeTable = RouteTable();
  const routesMap = computed(() => {
    return $store.getters.routesPathMap
  })
  registerListener(event => {
    // 取消iframe的弹框蒙版
    // document.documentElement.dispatchEvent(new MouseEvent("mousedown"));
    // document.documentElement.dispatchEvent(new MouseEvent("mouseup"));

    switch (event.type) {
      case MicroToMainEventType.CLICK: {
        document.documentElement.dispatchEvent(new MouseEvent('mousedown'));
        break;
      }
      // 子应用404 通知基座应用 无需传递data字段
      case MicroToMainEventType.PAGE_404: {
        $router.push('/404')
        break;
      }
        /**
       * 子应用打开详情页面 通知基座应用
       * data: {
       *   key: string,
       *   title: string,
       *   queryParams: object,
       *   route: string
       * }
       */
      case MicroToMainEventType.ROUTER_CHANGE: {
        console.log('MicroToMainEventType.ROUTER_CHANGE');
        const { route, queryParams = {}, key, title, data } = event.data
        const { app: type } = event
        const path = microTypeToName(type) + route
        const routeMap = $store.getters.routesPathRouteMap;
        const isInMenu = routesMap.value[path] || routeMap[path]
        const currentRoute = $router.currentRoute.value;

        if (currentRoute.path === path && JSON.stringify(queryParams) === JSON.stringify(currentRoute.query || {})) {
          return;
        }

        if (!isInMenu) {
          if (path !== '/amz-web/index') {
            queryParams.key = key
            queryParams.title = title
            queryParams.isDetailPage = '1'
            $router.push({
              path,
              query: queryParams
            })
          }
        } else {
          $router.push({
            path,
            query: queryParams
          })
        }
        break;
      }
      case MicroToMainEventType.OPEN_PAGE:
        const { route, queryParams = {}, key, title } = event.data;
        queryParams && delete queryParams.__state__;
        $router.push({
          path: route,
          query: queryParams
        })
        break;
        // 子应用检测接口401 未授权时 通知基座应用 无需传递data字段
      case MicroToMainEventType.UNAUTHORIZED: {
        distoryLogin()
        break;
      }
      case MicroToMainEventType.CHECK_DOWNLOAD_CENTER: {
        /**
         * 消息通知
         * @param {string | object = {url, key}} payload
         */
        notify(event.data)
        break;
      }
      case MicroToMainEventType.ROUTE_TABLE:
        const routes = event.data;
        const routeMap = $store.getters.routesPathRouteMap;
        // console.log('ROUTE_TABLE');
        const goToAmz = () => {
          const route = routes[0];
          const urlPath = microTypeToName(event.app) + route.route;

          if ($router.currentRoute.value.path !== urlPath) {
            $router.push({
              path: urlPath,
              query: route.queryParams || {}
            })
          }
        }

        let change = false;
        let routed = false;

        for (const item of routes) {
          const route = microTypeToName(event.app) + item.route;
          // 子应用带过来的副作用字段
          if (item.queryParams) {
            delete item.queryParams.__state__;
          }

          item.key = item.key || route;

          if (item.refresh) {
            // 只有angular有这种情况
            if (routeMap[route]) {
              // goToAmz();
              continue
            }
            routeMap[route] = {...item};
            delete routeMap[route].refresh;

            change = true;
            continue;
          }

          if (event.app === MicroAppType.AMZ && routes.length === 1 && routeMap[route] && JSON.stringify(routeMap[route]) === JSON.stringify(item)) {
            goToAmz();
            routed = true;
            break;
          }

          if (routeMap[route] && JSON.stringify(routeMap[route]) === JSON.stringify(item)) {
            continue
          }

          routeMap[route] = item;

          change = true;
        }

        if (change) {
          $store.dispatch('setRoutesPathRouteMap', routeMap).then();
        }

        if (!routed && event.app === MicroAppType.AMZ && routes && routes.length) {
          !routes[0].refresh && goToAmz();
        }
        sendRouteTableLoaded(event.app);
        // const { route, queryParams = {}, key, title } = event.data
        break;
    }
  });
}
