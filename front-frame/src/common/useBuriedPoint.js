import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {watch, computed} from "vue";
import {useMainBuriedPoint, useMainAppNotice} from "@gj/micro-frontend";
import {MainToMicroEventType} from "@gj/micro-frontend";


export function useBuriedPoint() {
  const $router = useRoute();
  const $store = useStore();
  const { buriedPointInit, registerPage } = useMainBuriedPoint();
  const { sendBroadcast } = useMainAppNotice()

  const sensorsdata = buriedPointInit({
    server_url: 'https://shence.apist.gerpgo.com/sa?project=default',
    heatmap: {
      scroll_notice_map: 'not_collect',
      collect_tags: {
        div: true,
        li: true,
        img: true,
        label: true,
        span: true
      }
    },
    is_track_single_page: false,
    use_client_time: true,
    show_log: false,
    send_type: 'beacon',
  });

  registerPage({app: 'X'});

  const routesMap = computed(() => {
    return $store.getters.routesPathMap
  })

  const nodesMap = computed(() => {
    return $store.getters.menuMap
  })

  let startTime = 0;
  let startTitle = '';
  let recordPath = '';

  const trackStayDuration = (docTitle) => {
    const millisecond = +new Date() - startTime;
    if (startTitle) {
      // @ts-ignore
      sensorsdata.track('stayDuration', {
        millisecond,
        second: +(millisecond / 1000).toFixed(),
        minute: +(millisecond / 1000 / 60).toFixed(2),
        pageTitle: startTitle
      });
    }
    startTime = +new Date();
    startTitle = docTitle;
  };

  watch(() => $store.getters.routesPathMap, () => {
    if (!recordPath) {
      return;
    }
    const nodeKey = routesMap.value[recordPath];
    const node = nodesMap.value[nodeKey] || {};

    if (node.name) {
      trackStayDuration(node.name);
      document.title = node.name
      sensorsdata.quick('autoTrackSinglePage');
      sendBroadcast(MainToMicroEventType.CUSTOMIZE, {
        setTitle: node.name
      })
      recordPath = '';
    }
  });

  watch(() => $store.getters.routesPathRouteMap, () => {
    if (!recordPath) {
      return;
    }
    const routeNode = $store.getters.routesPathRouteMap[recordPath];

    if (routeNode && routeNode.title) {
      trackStayDuration(routeNode.title);
      document.title = routeNode.title
      sensorsdata.quick('autoTrackSinglePage');
      sendBroadcast(MainToMicroEventType.CUSTOMIZE, {
        setTitle: routeNode.title
      })
      recordPath = '';
    }
  }, {immediate: true, deep: true});

  watch(() => $router.fullPath, () => {
    const nodeKey = routesMap.value[$router.path];
    const node = nodesMap.value[nodeKey] || {};

    let title = node.name;

    if (!title) {
      title = $store.getters.routesPathRouteMap[$router.path]?.title;
    }

    if (title) {
      trackStayDuration(title);
      document.title = title;
      sensorsdata.quick('autoTrackSinglePage');
    } else {
      // 第一次进来 菜单数据不一定加载完成
      recordPath = $router.path;
    }
  }, {immediate: true})

}
