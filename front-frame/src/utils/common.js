import store from '@/store'
import {useMainAppNotice} from "@gj/micro-frontend";

/**
 * 获取项目名称和要去到的路由的函数
 * @return {appName: '', route: ''}
 */
export const getCurrentApp = () => {
  const routeList = location.pathname.split('/')
  const appName = routeList[1]
  let route = ''
  if (routeList.length >= 3) {
    for (let index = 2; index < routeList.length; index++) {
      route += '/' + routeList[index]
    }
  } else {
    // 对应的子应用的首页
    route = '/'
  }
  return {
    appName,
    route
  }
}

/**
 * 创建一个空白透明遮罩，基座有弹出框 下拉框等操作的时候 解决鼠标点击到iframe区域不会消失
 */
export const createBasePopup = () => {
  const isCollapsed = store.getters.getCollapsed
  document.body.style.position = 'relative'
  const fmt = document.createDocumentFragment()
  const div = document.createElement('div')
  fmt.appendChild(div)
  div.className = 'show-base-info'
  document.getElementsByTagName('body')[0].appendChild(div)

  div.style.position = 'absolute'
  div.style.zIndex = '500'
  div.style.width = isCollapsed ? 'calc(100vw - 40px)' : 'calc(100vw - 200px)'
  div.style.height = 'calc(100vh - 40px)'
  div.style.left = isCollapsed ? '40px' : '200px'
  div.style.top = '40px'

  div.addEventListener('click', () => {
    document.body.removeChild(div)
  })
}


// 401 或者退出登录的方法
export const distoryLogin = () => {
  const { sendSignOut } = useMainAppNotice();
  store.commit('CLEAR_LOGIN')
  store.commit('CLEAR_SESSION')
  store.dispatch('USER_INFO', JSON.stringify({}))
  store.dispatch('setSidebarMenu', JSON.stringify([]))
  store.dispatch('tagsViews', JSON.stringify([]))
  sendSignOut()
  // 还必须要清空store
  setTimeout(() => {
    location.href = '/auth/login'
  }, 500)
}

// 切割地址栏参数
export const getUrlParams = () => {
  const search = location?.search ? location?.search?.replace('?', '')?.split('&') : null
  const params = {}
  if (search) {
    search.forEach(item => {
      const temp = item.split('=')
      params[temp[0]] = temp[1]
    })
  }
  return params
}

export const getTagTxt = (t, tag) => {
  if (tag?.isDetailPage) {
    return tag.name
  }
  if (tag?.isMultiMenu) {
    return `${t(tag.key)}-${t(tag.platform)}`
  }
  return t(tag.key, tag.name)
}
