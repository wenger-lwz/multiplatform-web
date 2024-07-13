import { M_T } from '../mutationsTypes'

const state = {
  sidebarMenu: [],
  menuMap: {},
  routesPathMap: {},
  openKeys: [],
  selectedKey: '',
  selectedKeys: [],
  tabsActiveKey: {},
  favorites: [],
  routesPathRouteMap: {}
}

const getters = {
  sidebarMenu: state => {
    return state.sidebarMenu
  },
  menuMap: state => {
    return state.menuMap
  },
  routesPathMap: state => {
    return state.routesPathMap
  },
  routesPathRouteMap: state => {
    return state.routesPathRouteMap
  },
  openKeys: state => {
    return state.openKeys
  },
  selectedKeys: state => {
    return state.selectedKeys
  },
  selectedKey: state => {
    return state.selectedKey
  },
  tabsActiveKey: state => {
    return state.tabsActiveKey
  },
  favorites: state => {
    return Object.values(state.menuMap).filter(item => item.collection)
  }
}

const mutations = {
  SET_SIDEBAR_MENU(state, sidebarMenu) {
    state.sidebarMenu = sidebarMenu
    localStorage.setItem(M_T.MENU_INFO, JSON.stringify(sidebarMenu))
  },
  SET_MENU_MAP(state, menuMap) {
    state.menuMap = menuMap
  },
  SET_ROUTES_PATH_MAP(state, routesPathMap) {
    state.routesPathMap = routesPathMap
  },
  SET_ROUTES_PATH_ROUTE_MAP(state, routesPathMap) {
    state.routesPathRouteMap = routesPathMap
  },
  SET_OPEN_KEYS(state, openKeys) {
    state.openKeys = openKeys
  },
  SET_SELECTED_KEY(state, selectedKey) {
    state.selectedKey = selectedKey
  },
  SET_SELECTED_KEYS(state, selectedKeys) {
    state.selectedKeys = selectedKeys
  },
  INIT_TABS_ACTIVEKEY(state, tabsActiveKey) {
    state.tabsActiveKey = tabsActiveKey
  },
  SET_TAB_ACTIVE_KEY(state, { rootNodeKey, activeTabKey }) {
    if (state.tabsActiveKey[rootNodeKey] !== activeTabKey) {
      state.tabsActiveKey[rootNodeKey] = activeTabKey
    }
  },
  UPDATE_FAV_STATUS(state, node) {
    const n = state.menuMap[node.key]
    n.collection = node.collection
  },
  CANCEL_FAVORITE(state, key) {
    const i = state.favorites.findIndex(favorites => favorites.key === key)
    state.favorites.splice(i, 1)
  }
}

const actions = {
  setSidebarMenu({ commit }, sidebarMenu) {
    commit('SET_SIDEBAR_MENU', sidebarMenu)
  },
  setMenuMap({ commit }, menuMap) {
    commit('SET_MENU_MAP', menuMap)
  },
  setRoutesPathMap({ commit }, routesPathMap) {
    commit('SET_ROUTES_PATH_MAP', routesPathMap)
  },
  setRoutesPathRouteMap({ commit }, routesPathMap) {
    commit('SET_ROUTES_PATH_ROUTE_MAP', routesPathMap)
  },
  setTabsActiveKey({ state, commit }) {
    const tabsActiveKey = {}
    for (let menuItem of state.sidebarMenu) {
      if (menuItem?.isMultiMenu) {
        tabsActiveKey[menuItem.key] = ''
      }
    }
    commit('INIT_TABS_ACTIVEKEY', tabsActiveKey)
  },
  setDefaultOpenKeys({ state, commit }, path) {
    const openKeys = setDefaultOpenKeys({ state, commit }, path)
    openKeys.length && commit('SET_OPEN_KEYS', openKeys)
    setTabActiveKey({ state, commit }, path)
  },
  updateOpenKeys({ state, commit }, openProps) {
    const { key, openKeys, isRoot } = openProps
    if (isRoot) {
      if (!openKeys.length || state.menuMap[key]['parentKey']) {
        return
      }
    }
    const node = state.menuMap[key]
    const rootNodeKey = isRoot ? node.key : node.parentKey
    const isMultiMenu = state.menuMap[rootNodeKey]?.isMultiMenu
    const isInOpenKeys = openKeys.includes(rootNodeKey)
    if (isInOpenKeys) {
      setOpenkeys(isRoot, isMultiMenu, openKeys, rootNodeKey, node, { state, commit })
    }
    if (!isRoot) {
      setOpenkeys(isRoot, isMultiMenu, openKeys, rootNodeKey, node, { state, commit })
    }
  },
  setSelectedKey({ commit }, selectedKey) {
    commit('SET_SELECTED_KEY', selectedKey)
  },
  setDefaultSelectedKeys({ state, commit }, path) {
    let nodeKey = state.routesPathMap[path]
    const selectedKeys = nodeKey ? [nodeKey] : []
    commit('SET_SELECTED_KEYS', selectedKeys)
  },
  updateFavstatus({ commit }, node) {
    commit('UPDATE_FAV_STATUS', node)
  },
  cancelFavorite({ commit }, key) {
    commit('CANCEL_FAVORITE', key)
  }
}

function getRouteRootNodeKey (state, path) {
  let openKeysInfo = {}
  let nodeKey = state.routesPathMap[path]
  if (!nodeKey) {
    return openKeysInfo
  }

  function getOpenKeysMap(nodeKey) {
    const openKeysMap = []
    let routeRootNodeKey = ''
    const node = state.menuMap[nodeKey] || {}
    let parentKey = node.parentKey
    node.key && openKeysMap.unshift(node.key)
    while (parentKey) {
      openKeysMap.unshift(parentKey)
      const parentNode = state.menuMap[parentKey]
      if (parentNode) {
        if (!parentNode.parentKey) {
          routeRootNodeKey = parentKey
        }
        parentKey = parentNode.parentKey
      }
    }
    const isMultiMenu = state.menuMap[routeRootNodeKey].isMultiMenu
    return {
      isMultiMenu,
      routeRootNodeKey,
      openKeysMap
    }
  }

  openKeysInfo = getOpenKeysMap(nodeKey)
  return openKeysInfo
}

function setDefaultOpenKeys ({ state }, path) {
  const { routeRootNodeKey, openKeysMap } = getRouteRootNodeKey(state, path)
  if (!routeRootNodeKey) {
    return []
  }
  const defaultOpenKeys = []
  const rootNode = state.menuMap[routeRootNodeKey] ?? {}
  if (rootNode.isMultiMenu) {
    const activeTabKey = openKeysMap[1]
    if (openKeysMap.length === 4) {
      defaultOpenKeys.push(rootNode.key)
      const node = state.menuMap[activeTabKey]
      const childNodes = node.children || []
      childNodes.forEach((childNode) => {
        defaultOpenKeys.push(childNode.key)
      })
    }
  } else {
    defaultOpenKeys.push(rootNode.key)
    rootNode?.children?.forEach((childNode) => {
      defaultOpenKeys.push(childNode.key)
    })
  }
  return [...new Set(state.openKeys.concat(defaultOpenKeys))]
}

function getActiveTabKey(state, node, isRoot) {
  if (isRoot) {
    if (state.tabsActiveKey[node.key]) {
      return state.tabsActiveKey[node.key]
    }
    return node?.children?.[0]['key']
  } else {
    return node.key
  }
}

function setTabActiveKey ({ state, commit }, path) {
  const { routeRootNodeKey, openKeysMap } = getRouteRootNodeKey(state, path)
  if (!routeRootNodeKey) {
    return ''
  }
  const rootNode = state.menuMap[routeRootNodeKey] ?? {}
  const activeTabKey = openKeysMap[1]
  commit('SET_TAB_ACTIVE_KEY', { rootNodeKey: rootNode.key, activeTabKey })
}

function setOpenkeys(isRoot, isMultiMenu, openKeys, rootNodeKey, node, { state, commit }) {
  const childrenOpenKeys = []
  if (isMultiMenu) {
    const tabKey = getActiveTabKey(state, node, isRoot)
    state.menuMap[tabKey]?.children?.forEach((childNode) => {
      childrenOpenKeys.push(childNode.key)
    })
    commit('SET_TAB_ACTIVE_KEY', { rootNodeKey, activeTabKey: tabKey })
  } else {
    node?.children.forEach((childNode) => {
      childrenOpenKeys.push(childNode.key)
    })
  }
  let newOpenKeys
  if (isRoot) {
    newOpenKeys = [...openKeys, rootNodeKey, ...childrenOpenKeys]
  } else {
    newOpenKeys = [...state.openKeys, rootNodeKey, ...childrenOpenKeys]
  }
  commit('SET_OPEN_KEYS', [...new Set(newOpenKeys)])
}

export default {
  state,
  getters,
  mutations,
  actions
}
