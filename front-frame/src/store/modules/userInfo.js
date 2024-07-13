import { M_T } from '../mutationsTypes'
const state = {
  userInfo: {}
}
const getters = {
  getUserInfo: state => {
    if (localStorage.getItem(M_T.USER_INFO) && localStorage.getItem(M_T.USER_INFO) !== 'undefined') {
      state.userInfo = JSON.parse(localStorage.getItem(M_T.USER_INFO))
    }
    return state.userInfo
  }
}
const mutations = {
  [M_T.USER_INFO](state, newUserInfo) {
    state.userInfo = newUserInfo
    localStorage.setItem(M_T.USER_INFO, newUserInfo)
  }
}
const actions = {
  [M_T.USER_INFO](ctx, newUserInfo) {
    ctx.commit(M_T.USER_INFO, newUserInfo)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
