import { getButtonRoles } from '@/api/public';
import { MenuType } from '@/enum/layout';
import { MENU_COLLAPSED, MENU_TYPE } from '@/enum/storage';
import { M_T } from '../mutationsTypes'
import {noticeVersion} from '@/config/apps.js'
import { getVersionAnnouncement, markAnnouncement } from '@/api/system'

const collapsedLocalKey = MENU_COLLAPSED;
const menuTypeLocalKey = MENU_TYPE;
const state = {
  auth: [],
  collapsed: localStorage.getItem(collapsedLocalKey) ? !!+localStorage.getItem(collapsedLocalKey) : false,
  menuType: localStorage.getItem(menuTypeLocalKey) || MenuType.headerBar,
  companyInfo: {},
  isAnnouncementVisible: false,
  announcementDetail: {}
}

const getters = {
  collapsed: state => {
    return state.collapsed
  },
  menuType: state => {
    return state.menuType
  },
  auth: state => {
    return state.auth
  },
  companyInfo: state => {
    return state.companyInfo
  },
  isAnnouncementVisible: state => {
    return state.isAnnouncementVisible
  },
  announcementDetail: state => {
    return state.announcementDetail
  },
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.collapsed = !state.collapsed
    localStorage.setItem(collapsedLocalKey, state.collapsed ? 1 : 0)
  },
  SWITCH_MENU: state => {
    state.menuType = state.menuType === MenuType.sideBar ? MenuType.headerBar : MenuType.sideBar;
    localStorage.setItem(menuTypeLocalKey, state.menuType)
  },
  SET_AUTH: (state, newValue) => {
    state.auth = newValue;
  },
  CLEAR_LOGIN: () => {
    // 清除本地的用户和菜单信息
    const LOCAL = [M_T.USER_INFO, M_T.MENU_INFO];
    LOCAL.forEach(k => {
      localStorage.removeItem(k)
    })
  },
  CLEAR_SESSION: (_, clearAll = false) => {
    return sessionStorage.clear()
  },
  SET_COMPANY_IFNO: (state, payload) => {
    state.companyInfo = payload;
  },
  SET_ANNOUNCEMENT_VISIBILE: (state, newVal) => {
    state.isAnnouncementVisible = newVal
  },
  SET_ANNOUNCEMENT: (state, newVal) => {
    state.announcementDetail = newVal
  },
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  async getAuth({ commit }) {
    const auth = await getButtonRoles();
    commit('SET_AUTH', auth);
  },
  async getAnnouncement({ commit }) {    
    const res = await getVersionAnnouncement(noticeVersion)
    commit('SET_ANNOUNCEMENT', res.data || {});
    commit('SET_ANNOUNCEMENT_VISIBILE',  !!(res.data && res.data.id && !res.data.isRead));        
  },
  async showAnnouncement({ commit }) {    
    const res = await getVersionAnnouncement(noticeVersion)
    commit('SET_ANNOUNCEMENT', res.data || {});    
    commit('SET_ANNOUNCEMENT_VISIBILE',  true);
  },
  async readAnnouncement({ commit,state }) {    
    commit('SET_ANNOUNCEMENT_VISIBILE',  false);
    markAnnouncement({ids:[state.announcementDetail.id]})
  }

}

export default {
  state,
  getters,
  mutations,
  actions
}
