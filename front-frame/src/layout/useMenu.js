import { inject, provide, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n'
import { GjMessage } from '@gj/atom'

export const INJECT_KEY = 'injectMenuScope';


export const nodesMap = {}
export const routesMap = {}

export const useProvide = () => {
  const { t } = useI18n()
  const $store = useStore();
  const defaultActiveTabKeys = ref({});
  const currentSelectedKeys = ref([])
  
  const updateOpenKeys = (key, openKeys = [], isRoot = true) => {
    $store.dispatch('updateOpenKeys', { key, openKeys, isRoot })
  }

  const updateFavstatus = async (key) => {
    const node = nodesMap[key] || {}
    const params = {
      type: 'MENU_FAVORITES',
      contents: [key],
    }

    const favNode = { ...node, collection: !node.collection }
    const res = await $store.dispatch('updatePersonalize', {
      params,
      isAdd: favNode.collection,
    })
    if (res?.code !== 0) {
      const msg = favNode.collection
        ? t('menu.favoritesMenuFailed')
        : t('menu.failedFavoriteMenu')
      return GjMessage.error({
        content: msg,
        closable: true,
      })
    }
    const msg = favNode.collection
      ? t('menu.favoritesMenuSucceeded')
      : t('menu.menuFavoritesRemoved')
    GjMessage.success({
      content: msg,
      closable: true,
    })
    $store.dispatch('updateFavstatus', favNode)
  }
  const provider = reactive({
    currentSelectedKeys,
    defaultActiveTabKeys,
    updateOpenKeys,
    updateFavstatus,
  })

  provide(INJECT_KEY, provider)

  return provider
}


export const useInject = () => {
  return inject(INJECT_KEY);
}

const registerNode = (node, parentNode) => {
  nodesMap[node.key] = node
  nodesMap[node.key]['parent'] = parentNode
  if (node.route) {
    routesMap[node.route] = node.key
  }
}

export const registerNodes = (nodes) => {
  const traverse = function (nodes, parentNode) {
    const childNodes = nodes || []
    for (let i = 0, len = childNodes.length; i < len; i++) {
      const child = childNodes[i]
      if (child.typeStyle === 'btn') break
      registerNode(child, parentNode)
      traverse(child.children, child)
    }
  }

  traverse(nodes, null)
}