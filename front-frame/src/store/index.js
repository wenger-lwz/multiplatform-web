import { createStore } from 'vuex'

import app from './modules/app' // 菜单的展开和收起
import userInfo from './modules/userInfo' // 储存登录的用户信息
import sidebarMenu from './modules/menu' // 菜单
import languageInfo from './modules/language' // 语言信息
import tagsView from './modules/tagsView' // 快捷菜单信息


export default createStore({
  modules: {
    app,
    userInfo,
    sidebarMenu,
    languageInfo,
    tagsView,
  },
})
