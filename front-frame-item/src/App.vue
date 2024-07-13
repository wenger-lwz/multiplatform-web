<template>
  <div id="nav">
    <gj-config-provider :locale="arcoLocale[$i18n.locale]">
      <router-view v-slot="{ Component }">
        <keep-alive :max="7" :exclude="excludeList">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </gj-config-provider>
    <!--等待权限数据的记载-->
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  getCurrentInstance,
} from 'vue'
import { useRouter } from 'vue-router'
import arcoLocale from './i18n/arcoLocale'
import {
  MicroAppType,
  useMicroAppNotice,
  useMicroAppProvide,
  MainToMicroEventType,
} from '@gj/micro-frontend'
import store from '@/store'
import { M_T } from '@/store/mutationsTypes'
import getPermissions from '@api/permissions'
import { btnList } from '@/config/btnList'

useMicroAppProvide()
const { registerMicroApp } = useMicroAppNotice()
registerMicroApp(MicroAppType.MULTIPLATFORM)

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance()
    const $router = useRouter()
    const data = reactive({
      btnList,
      arcoLocale,
      excludeList: [],
      loadText: '正在使劲加载...',
      reLoad: false, // 权限数据未加载不允许加载页面
    })
    const { registerListener } = useMicroAppNotice()
    useMicroAppProvide()

    // 按钮权限信息
    const onPermissons = async () => {
      if (store.getters?.getUserInfo?.token) {
        const res = await getPermissions()
        if (res.code === 0 || res.cdoe === '0') {
          const temp = {}
          let rsp = res.data
          // rsp = rsp.concat(btnList);
          rsp.forEach((item) => {
            temp[item] = true
          })
          store.dispatch(M_T.PREMISSIONS_INFO_NOW_BTN, JSON.stringify(temp))
          data.reLoad = true
        } else {
          data.loadText = '权限读取失败，禁止加载！'
        }
      }
    }

    // 获取当前的路由信息
    const getCurrentRoute = (path) => {
      if (!path) {
        return
      }
      const cuRoute = proxy.$router.options.routes.filter((item) => {
        return item.path === path
      })[0]
      return cuRoute
    }

    onMounted(() => {
      onPermissons()
      registerListener((event) => {
        let name = null
        let index = null
        switch (event.type) {
          case MainToMicroEventType.CUSTOMIZE:
            break
          case MainToMicroEventType.BROADCAST:
            break
          case MainToMicroEventType.ROUTER_CHANGE:
            document.documentElement.dispatchEvent(new MouseEvent('mousedown'))
            document.documentElement.dispatchEvent(new MouseEvent('mouseup'))
            name = getCurrentRoute(event?.data?.route)?.name
            index = data.excludeList.indexOf(name)
            if (index >= 0) {
              data.excludeList.splice(index, 1)
            }
            setTimeout(() => {
              $router.push({
                path: event.data.route,
              })
            }, 100)
            break
          case MainToMicroEventType.CLOSE_PAGE:
            name = getCurrentRoute(event?.data?.route)?.name
            if (name) {
              data.excludeList.push(name)
            }
            break
          case MainToMicroEventType.LANGUAGE:
            // 中英文切换
            break
          case MainToMicroEventType.CLEAR_POPUP:
            console.log('通知子应用关闭各种拉下弹框')
            // 嵌入到angular应用时，如果存在下拉框展开的情形，会导致路由跳转时，下拉框不收起的问题
            // 查看element代码后发现element会监听如下事件进行下拉框收起动作
            document.documentElement.dispatchEvent(new MouseEvent('mousedown'))
            document.documentElement.dispatchEvent(new MouseEvent('mouseup'))
            break
          case MainToMicroEventType.CLOSE_ALL_PAGE:
            console.log('这个是什么消息通知')
            break
        }
      })
    })

    return {
      ...toRefs(data),
    }
  },
})
</script>
