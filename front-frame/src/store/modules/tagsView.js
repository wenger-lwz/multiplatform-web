import { getPinnedList, savePersonalize, deletePersonalize } from '@/api/public'

const state = {
  visitedViews: [
    {
      ding: false,
      key: 'v2.menu.dashboard',
      name: 'Dashboard',
      route: '/amz-web/index'
    }
  ],
  dropdownTags: [],
  tagsWidth: 0,
  pinnedTags: []
}

const getters = {
  visitedViews: (state) => {
    return state.visitedViews
  },
  dropdownTags: state => {
    return state.dropdownTags
  },
  tagsWidth: state => {
    return state.tagsWidth
  },
  pinnedTags: state => {
    return state.pinnedTags
  }
}

const mutations = {
  SET_TAGS_VIEWS(state, newInfo) {
    state.visitedViews = newInfo
  },
  SET_TAGS_WIDTH(state, tagsWidth) {
    state.tagsWidth = tagsWidth
  },
  ADD_TAG_WIDTH(state, tagWidth) {
    state.tagsWidth = state.tagsWidth + tagWidth
    // console.log('添加后tags宽度:', state.tagsWidth)
  },
  MINUS_TAG_WIDTH(state, tagWidth) {
    state.tagsWidth = state.tagsWidth - tagWidth
    // console.log('删除后tags宽度:', state.tagsWidth)
  },
  SET_VISITED_VIEWS(state, tagsViews) {
    state.visitedViews = tagsViews
  },
  ADD_VISITED_VIEW(state, node) {
    state.visitedViews.push(node)
  },
  REMOVE_VISITED_VIEW(state, tagKey) {
    const i = state.visitedViews.findIndex(tag => tag.key === tagKey)
    state.visitedViews.splice(i, 1)
  },
  INSERT_VISITED_VIEW(state, { tagNode, prevRouteIdx }) {
    state.visitedViews.splice(prevRouteIdx + 1, 0, tagNode)
  },
  UPDATE_TAG_QUERY(state, { routeKey, query, path }) {
    const i = state.visitedViews.findIndex(tag => tag.key === routeKey || tag.route === path)

    i > -1 && (state.visitedViews[i].query = query)
  },
  ADD_DROPDOWN_VIEW(state, dropdownTag) {
    state.dropdownTags.unshift(dropdownTag)
  },
  ROMOVE_DROPDOWN_VIEW(state, tagKey) {
    const i = state.dropdownTags.findIndex(tag => tag.key === tagKey)
    state.dropdownTags.splice(i, 1)
  },
  SET_PINNED_TAGS(state, pinnedTags) {
    state.pinnedTags = pinnedTags
  },
  ADD_PINNED_TAG(state, tag) {
    state.pinnedTags.push(tag)
  },
  UPDATE_PINNED_TAG_STS(state, pinnedTag) {
    const i = state.visitedViews.findIndex(tag => tag.key === pinnedTag.key)
    state.visitedViews[i].ding = pinnedTag.ding
  },
  ROMOVE_PINNED_TAG(state, pinnedTag) {
    const i = state.pinnedTags.findIndex(tag => tag.key === pinnedTag.key)
    state.pinnedTags.splice(i, 1)
  }
}

const actions = {
  setTagsViews({ commit }, tagsViews) {
    commit('SET_TAGS_VIEWS', tagsViews)
  },
  setTagsWidth({ commit }, tagsWidth) {
    commit('SET_TAGS_WIDTH', tagsWidth)
  },
  addTagWidth({ commit }, width) {
    commit('ADD_TAG_WIDTH', width)
  },
  minusTagWidth({ commit }, width) {
    commit('MINUS_TAG_WIDTH', width)
  },
  setVisitedViews({ commit }, tagsViews) {
    const visitedViews = []
    const cachedViews = []
    for (let tag of tagsViews) {
      if (!cachedViews.includes(tag.key)) {
        visitedViews.push(tag)
        cachedViews.push(tag.key)
      }
    }
    commit('SET_VISITED_VIEWS', visitedViews)
  },
  addView({ dispatch }, { tagNode, tagWidth, prevRouteIdx }) {
    if (prevRouteIdx === -1 || !prevRouteIdx) {
      dispatch('addVistedView', tagNode)
    } else {
      dispatch('insertVistedView', { tagNode, prevRouteIdx })
    }
    dispatch('addTagWidth', tagWidth)
  },
  addVistedView({ commit }, node) {
    commit('ADD_VISITED_VIEW', node)
  },
  removeVistedView({ commit }, tagKey) {
    commit('REMOVE_VISITED_VIEW', tagKey)
  },
  insertVistedView({ commit }, data) {
    commit('INSERT_VISITED_VIEW', data)
  },
  updateTagQuery({ commit }, data) {
    commit('UPDATE_TAG_QUERY', data)
  },
  addDropdownView({ commit }, node) {
    commit('ADD_DROPDOWN_VIEW', node)
  },
  removeDropdownView({ commit }, tagKey) {
    commit('ROMOVE_DROPDOWN_VIEW', tagKey)
  },
  getPinnedTags({ commit }) {
    return new Promise((resolve, reject) => {
      getPinnedList().then(res => {
        if (res?.code !== 0) {
          return reject('获取钉数据失败')
        }
        commit('SET_PINNED_TAGS', res.data)
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updatePinnedTag({ commit }, pinnedTag) {
    commit('UPDATE_PINNED_TAG_STS', pinnedTag)
    if (pinnedTag.ding) {
      commit('ADD_PINNED_TAG', pinnedTag)
    } else {
      commit('ROMOVE_PINNED_TAG', pinnedTag)
    }
  },
  updatePersonalize({ commit }, { params, isAdd }) {
    return new Promise((resolve, reject) => {
      if (isAdd) {
        savePersonalize(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      } else {
        deletePersonalize(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
