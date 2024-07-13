import { M_T } from '../mutationsTypes'
const state = {
  languageInfo: getLanguage()
}
const getters = {
  language: state => {
    return state.languageInfo
  }
}
const mutations = {
  [M_T.LANGUAGE_INFO](state, newInfo) {
    localStorage.setItem(M_T.LANGUAGE_INFO, newInfo)
    state.languageInfo = newInfo
  }
}
const actions = {
  [M_T.LANGUAGE_INFO](ctx, newInfo) {
    ctx.commit(M_T.LANGUAGE_INFO, newInfo)
  }
}

function getLanguage () {
  if (localStorage.getItem(M_T.LANGUAGE_INFO)) {
    return localStorage.getItem(M_T.LANGUAGE_INFO)
  }
  const language = navigator.language || navigator.userLanguage
  if (language) {
    return language === 'zh-CN' ? 'zh' : language
  }
  return 'zh'
}

export default {
  state,
  getters,
  mutations,
  actions
}
