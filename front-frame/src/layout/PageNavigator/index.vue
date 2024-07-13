<template>
  <div :class="`header-content header-content--${theme}`">
    <div class="header-content-left">
      <div v-if="collapsible" class="collapse-btn" @click="toggleSideBar">
        <svg-icon
          :svg-class="collapsed ? 'unfold' : 'fold'"
          :width="12"
        />
      </div>
      <div class="tag-box">
        <ul class="tag-wrap" :style="`${collapsible ? 'margin-left: 10px;' : 'marign-left: -1px;'}`">
          <li v-for="(item, index) in tagsViews"
          :key="item.key"
          :class="`${currentRoute.path.includes(item.route) ? 'active' : ''}`"
          >
            <span
              class="thumbtack"
              @click="updatePinStatus(item)"
              v-if="item.key !== 'v2.menu.dashboard' && !item?.isDetailPage"
            >
              <svg-icon
                :svg-class="item.ding ? 'pinned' : 'pin'"
                :width="10"
              />
            </span>
            <router-link
              class="text"
              :to="{
                path: item.route,
                query: item.query
              }"
            >
            {{ getTagTxt($t, item) }}
            </router-link>
            <span
              class="close-btn"
              v-if="item.key !== 'v2.menu.dashboard'"
              @click="closeSelectedTag(item, index)"
            >
              <svg-icon svg-class="close" :width="10" />
            </span>
          </li>
        </ul>
        <gj-trigger
          class="gj-search-trigger-popup"
          trigger="click"
          position="bottom"
          animation-class="fade-in"
          :mouse-enter-delay="50"
          :mouse-leave-delay="50"
          :popup-offset="8"
          :auto-fit-popup-min-width="true"
          :blur-to-close="canClickOutside"
          :click-outside-to-close="canClickOutside"
          :duration="100"
          :popup-visible="popVisible"
          @popupVisibleChange="setPopVisible"
        >
          <span class="add-btn">
            <svg-icon svg-class="add" :width="12" />
          </span>
          <template #content>
            <search @item-click="setPopVisible" />
          </template>
        </gj-trigger>
      </div>
    </div>
    <div class="more" v-show="dropdownTags.length > 0">
      <gj-trigger
        class="menu-tag mini-scrollbar"
        trigger="click"
        position="bottom"
        :popup-offset="8"
        :disabled="dropdownTags.length ? false : true"
        :popup-visible="dropdownVisible"
        @popupVisibleChange="setDropdownVisible"
      >
        <span
          class="tag-collapsed"
          :class="{
            'dropdown-tags-open': dropdownVisible,
            'dropdown-tags-disabled': dropdownTags.length === 0
          }"
        >
          <svg-icon svg-class="caret-down" :width="10" />
        </span>
        <template #content>
          <ul v-if="dropdownTags.length > 0">
            <li v-for="item in dropdownTags" :key="item.key">
              <router-link
                :to="{
                  path: item.route,
                  query: item.query
                }"
                class="link"
                @click="removeDropdownTag(item.key, true)"
              >
                <span class="text">{{ getTagTxt($t, item) }}</span>
              </router-link>
              <span
                class="remove-tag"
                @click.stop="removeDropdownTag(item.key)"
              >
                <svg-icon svg-class="close" :width="10" />
              </span>
            </li>
          </ul>
        </template>
      </gj-trigger>
    </div>
  </div>

</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { defineComponent, onMounted, ref, computed, watch, nextTick } from 'vue'

import {MicroToMainEventType, useMainAppNotice} from '@gj/micro-frontend'
import { GjMessage } from '@gj/atom'

import { debounce } from '@/utils'
import SvgIcon from '@/components/SvgIcon.vue'
import { getTagTxt } from '@/utils/common'

import Search from '../Search/index.vue'

import { useInject as guideHookInject, TYPE as HookType } from '@/common/guide/useHook.js';
import {microTypeToName} from "@config/apps";
import {RouteStack} from "@/layout/PageNavigator/RouteStack";

export default defineComponent({
  components: {
    Search,
    SvgIcon,
  },

  props: {
    getAvailableWidth: {
      type: Function
    },

    /**
     * 是否可折叠（侧栏），顶部导航栏不能折叠
     */
    collapsible: {
      type: Boolean,
      default: true,
    },

    /**
     * 黑白两色
     * dark，light
     */
    theme: {
      type: String,
      default: 'dark'
    }
  },

  setup(props) {
    const routeStack = RouteStack();

    const $store = useStore()
    const $router = useRouter()
    const { currentRoute } = $router
    const { t } = useI18n()

    const { sendClosePage, registerListener } = useMainAppNotice()

    const popVisible = ref(false)
    const dropdownVisible = ref(false)
    const canClickOutside = ref(true)
    const prevRoutePath = ref('')
    const availTagsWidth = ref(0)
    const prevInnerWidth = ref(0)

    const collapsed = computed(() => $store.getters.collapsed)
    const language = computed(() => $store.getters.language)
    const tagsViews = computed(() => {
      return $store.getters.visitedViews
    })

    const dropdownTags = computed(() => {
      return $store.getters.dropdownTags
    })

    const tagsWidth = computed(() => {
      return $store.getters.tagsWidth
    })

    const nodesMap = computed(() => {
      return $store.getters.menuMap
    })

    const menuData = computed(() => {
      return $store.getters.sidebarMenu
    })

    const routesPathRouteMap = computed(() => {
      return $store.getters.routesPathRouteMap
    })

    const routesMap = computed(() => {
      return $store.getters.routesPathMap
    })

    const pinnedTags = computed(() => {
      return $store.getters.pinnedTags
    })

    watch(
      () => currentRoute.value,
      (n, o) => {
        prevRoutePath.value = o.path
        addTag()
        o?.path && routeStack.push(o.path)
        $store.dispatch('setDefaultOpenKeys', n.path)
        $store.dispatch('setDefaultSelectedKeys', n.path)
        setSelectedKey(n.path)
      }
    )

    watch(
        () => $store.getters.routesPathRouteMap,
        (n, o) => {
          // 如果关闭tag时没有进行导航 这里不传参数会导致出现删除不了tag的现象
          addTag()
          // $store.dispatch('setDefaultSelectedKeys', n.route)
          // setSelectedKey(n.route)
        }, {immediate: true, deep: true}
    )

    watch(
      () => routesMap.value,
      async (n, o) => {
        if (n !== o) {
          setSelectedKey(currentRoute.value.path)
          const pinnedTags = await $store.dispatch('getPinnedTags')
          if (pinnedTags?.length) {
            for (let tag of pinnedTags) {
              addTag(tag.route)
            }
          }
          nextTick(() => {
            if (availTagsWidth.value === 0) {
              // fix async
              availTagsWidth.value = props.getAvailableWidth()
            }
            addTag();
            // console.log(tagsViews);
            tagsViews.value.forEach(tag => {
              const nodeKey = routesMap.value[tag.route];
              const node = nodesMap.value[nodeKey];
              if (node && tag.isDetailPage) {
                // tag.isDetailPage = false;
                Object.assign(tag, {
                  isDetailPage: false,
                  name: node.name,
                  key: node.key
                })
                // console.log(node, routesMap);
              }
            })
          })
        }
      }
    )

    watch(
      () => language.value,
      (n, o) => {
        nextTick(() => {
          const newTagsWidth = getTagsWidth(tagsViews.value)
          if (newTagsWidth > tagsWidth.value) {
            $store.dispatch('setTagsWidth', newTagsWidth)
            addTag(null, true)
          } else {
            $store.dispatch('setTagsWidth', newTagsWidth)
            updateTagsView()
          }
        })
      }
    )

    /**
     * 设置新手引导的动作, start
     */
    const el = '.tag-box .add-btn'
    const { set } = guideHookInject();
    set(el, () => {
      canClickOutside.value = false
    })
    set(el, () => {
      canClickOutside.value = true
    }, HookType.after)
    const el2 = '.tag-box .thumbtack';
    let addByGuide = false
    set(el2, () => {
      if (tagsViews.value.length < 2) {
        // 为了引导增加一个 tag，稍后移除
        function findRoute (m){
          if (m.children) {
            return findRoute(m.children[0])
          }
          return m.route
        }
        const r = findRoute(menuData.value[0])
        addTag(r);
        addByGuide = true;
      } else {
        addByGuide = false;
      }

    })
    set(el2, () => {
      // 模拟关闭tag
      if (addByGuide) {
        document.querySelector('.tag-box .close-btn').click();
      }
    }, HookType.after)
    /**
     * 设置新手引导的动作, end
    */

    const update = () => {
      availTagsWidth.value = props.getAvailableWidth()
      const innerWidth = window.innerWidth
      if (innerWidth === prevInnerWidth.value) return
      if (innerWidth > prevInnerWidth.value) {
        updateTagsView()
      } else {
        addTag(null, true)
      }
      prevInnerWidth.value = innerWidth
    }

    onMounted(() => {
      prevInnerWidth.value = window.innerWidth
      availTagsWidth.value = props.getAvailableWidth()
      const tagsWidth = getTagsWidth(tagsViews.value)
      $store.dispatch('setTagsWidth', tagsWidth)
      window.addEventListener('resize', debounce(update, 100))
    })

    function setSelectedKey(path) {
      const nodeKey = routesMap.value[path]
      let routeRootNodeKey = ''
      const node = nodesMap.value[nodeKey] || {}
      let parentKey = node.parentKey
      while (parentKey) {
        const parentNode = nodesMap.value[parentKey]
        if (parentNode) {
          if (!parentNode.parentKey) {
            routeRootNodeKey = parentKey
          }
          parentKey = parentNode.parentKey
        }
      }
      $store.dispatch('setSelectedKey', routeRootNodeKey)
    }

    const toggleSideBar = () => {
      $store.dispatch('toggleSideBar')
      availTagsWidth.value = props.getAvailableWidth()
      nextTick(() => {
        if (collapsed.value) {
          updateTagsView()
        } else {
          addTag(null, true)
        }
      })
    }

    const setPopVisible = (val) => {
      popVisible.value = val
    }

    const setDropdownVisible = (val) => {
      dropdownVisible.value = val
    }

    const updatePinStatus = async (tag) => {
      const isPinned = tag.ding
      const needTips = !isPinned && pinnedTags.value.length >= 4
      if (needTips) {
        return GjMessage.error({
          content: t('tag.upToTabsPinnedTip'),
          closable: true,
        })
      }
      const params = {
        type: 'MENU_PINNED',
        contents: [tag.key],
      }
      const pinTag = { ...tag, ding: !tag.ding }
      const res = await $store.dispatch('updatePersonalize', {
        params,
        isAdd: pinTag.ding,
      })
      if (res?.code !== 0) {
        const msg = pinTag.ding
          ? t('tag.pinningFailed')
          : t('tag.failedToCancelPinningTip')
        return GjMessage.error({
          content: msg,
          closable: true,
        })
      }
      const msg = pinTag.ding
        ? t('tag.pinnedSuccessfullyTip')
        : t('tag.pinningCancelled')
      GjMessage.success({
        content: msg,
        closable: true,
      })
      $store.dispatch('updatePinnedTag', pinTag)
    }

    const isActive = (tag) => {
      return tag.route === currentRoute.value.path
    }

    const toLastView = (options) => {
      const {mode} = options || {};
      console.log(options);
      if (options && typeof options === "object" && mode !== 'auto') {
        return
      }
      const latestView = routeStack.previous(tagsViews.value, options)
      if (latestView) {
        $router.push({path: latestView.route, query: (latestView.query || {})})
        return {route: latestView.route, query: (latestView.query || {})}
      } else {
        $router.push('/')
        return {route: '/', query: {}}
      }
    }

    registerListener(MicroToMainEventType.CLOSE_PAGE, event => {
      let { route, routeTo, queryParams, mode = 'auto' } = event.data;
      const { app: type } = event;
      const a = document.createElement('a');
      a.href = route;
      route = a.pathname
      const path = microTypeToName(type) + route;
      const visitedViews = $store.getters.visitedViews;
      const routeKey = routesMap.value[path];
      const routeNode = $store.getters.routesPathRouteMap[path];
      const node = nodesMap.value[routeKey]
      const tagNode = node || routeNode;
      const options = {routeTo, queryParams, mode};

      if (routeTo) {
        if (routeTo.split('/')[0]?.includes('web')) {

        } else {
          options.routeTo = microTypeToName(type) + routeTo;
        }
      }

      routeTo && (options.routeTo = microTypeToName(type) + routeTo);

      if (tagNode?.key) {
        const tagViewNode = visitedViews.find(tag => tag.key === tagNode.key || path === tag.route);
        tagViewNode && closeSelectedTag(tagViewNode, options);
      } else {
        const tagViewNode = visitedViews.find(tag => tag.route === path);

        tagViewNode && closeSelectedTag(tagViewNode, options);
      }
    });


    const closeSelectedTag = (tag, options) => {
      $store.dispatch('removeVistedView', tag.key)
      const deletedTagWidth = getTextWith(tag)
      $store.dispatch('minusTagWidth', deletedTagWidth)
      updateTagsView()
      let meta = {route: '', query: {}};
      if (isActive(tag)) {
        meta = toLastView(options)
      }
      const app = tag.route.split('/')
      let tempRoute = ''
      for (let index = 2; index < app.length; index++) {
        tempRoute += '/' + app[index]
      }
      const query = tag.query || {};
      Object.entries(query).forEach(([key, value]) => {
        if (!tempRoute.includes('?')) {
          tempRoute += `?${key}=${value}`;
        } else {
          tempRoute += `&${key}=${value}`
        }
      })

      const resBody = {
        route: tempRoute,
        to: '',
        queryParams: {}
      };

      if (!meta) {
        sendClosePage(app[1], resBody);
        return;
      }
      if (!meta.route) {
        // 此时关闭的不是当前激活的tag
        const visitedViews = $store.getters.visitedViews;
        const curPath = $router.currentRoute.value.path;
        const tagViewNode = visitedViews.find(tag => tag.route === curPath);

        if (tagViewNode && curPath.includes(app[1])) {
          resBody.to = curPath.replace('/' + app[1], '');
          resBody.queryParams = {...(tagViewNode.query || {})};
        }
      }
      // console.log({ route: tempRoute, to: meta.route.replace('/' + app[1], ''), query: {...meta.query} })
      // 1.先通知子应用释放被关闭页签的缓存
      if (meta.route && meta.route.includes(app[1])) {
        resBody.to = meta.route.replace('/' + app[1], '');
        resBody.queryParams = {...meta.query};
      }

      sendClosePage(app[1], resBody)
      // 2.再通知跳转
      // sendRouteChange(getCurrentApp().appName, {
      //   route: tagsViews.value[index - 1].route,
      // })
    }


    // fontStyle需与body的fontStyle保持一致
    // TOFIXED: 修改了样式，也要改这个方法
    function getTextWith(tag) {
      let fontStyle = `
        13px "PingFang SC",
        "Hiragino Sans GB",
        "noto sans",
        "Microsoft YaHei",
        "Helvetica Neue",
        Helvetica,
        Arial,
        sans-serif
      `
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      context.font = fontStyle
      const tagTxt = getTagTxt(t, tag)
      const dimension = context.measureText(tagTxt)
      let otherDimension
      if (tag.key === 'v2.menu.dashboard') {
        otherDimension = 16
      } else if (tag.isDetailPage) {
        otherDimension = 40
      } else {
        otherDimension = 64
      }
      return dimension.width + otherDimension
    }

    function getTagsWidth(tagsViews) {
      let tagsWidth = 0
      tagsViews.forEach((tab) => {
        const tabWidth = getTextWith(tab)
        tagsWidth += tabWidth
      })
      return tagsWidth
    }

    function getNode(tagPath, path, routeKey, isDetailPage, query) {
      if (tagPath) {
        return nodesMap.value[routeKey]
      } else if (isDetailPage) {
        const { key, title } = query
        const node = {
          key: path,
          name: title,
          route: path,
        }
        return node
      } else {
        return nodesMap.value[routeKey]
      }
    }

    function addTag(tagPath, isResize = false) {
      const path = tagPath ? tagPath : currentRoute.value.path
      let isDetailPage = currentRoute.value.query?.isDetailPage === '1'
      const query = currentRoute.value.query ?? {}
      const routeNode = $store.getters.routesPathRouteMap[path];
      let routeKey = tagPath ? routesMap.value[path] : routesMap.value[path]

      if (!routeKey) {
        routeKey = routeNode?.key;

        if (!routeKey && isDetailPage) {
          routeKey = tagPath ? routesMap.value[path] : (isDetailPage ? query.key : routesMap.value[path])
        }

        if (routeKey) {
          isDetailPage = true;
        }
      }

      if (!routeKey) {
        return
      }

      const isInTagsViews = tagsViews.value.some((v) => v.route === path)
      // console.log(isInTagsViews, 'isInTagsViews')
      if (isInTagsViews) {
        if (Object.keys(query).length >= 0) {
          $store.dispatch('updateTagQuery', { routeKey, query, path })
        }
        if (!isResize) {
          return
        }
      }
      if (dropdownTags.value.some((v) => v.route === path)) {
        $store.dispatch('removeDropdownView', routeKey)
      }
      const node = getNode(tagPath, path, routeKey, isDetailPage, (routeNode || query))
      const isPinned = pinnedTags.value.some((tag) => tag.key === node.key)
      const tagNode = {
        ding: isPinned,
        key: node.key,
        name: node.name,
        route: node.route,
        query,
        isDetailPage,
        isMultiMenu: node?.isMultiMenu,
        platform: node?.platform,
      }
      const tagWidth = getTextWith(tagNode)
      let prevRouteIdx = tagsViews.value.findIndex((tag) => {
        return tag.route === (isResize ? tagNode.route : prevRoutePath.value)
      })
      // console.log(addTag, 'addTag addTag');
      checkIsOverflow(
        tagsWidth.value,
        tagNode,
        tagWidth,
        prevRouteIdx,
        isResize
      )
    }

    function checkIsOverflow(
      tagsWidth,
      tagNode,
      tagWidth,
      prevRouteIdx,
      isResize
    ) {
      let deleteIndex = 0
      const isOverflow = isResize
        ? tagsWidth + 1 > availTagsWidth.value
        : tagsWidth + tagWidth > availTagsWidth.value
      if (isOverflow) {
        const tagsLen = tagsViews.value.length
        let deleteTag
        if (prevRouteIdx === tagsLen - 1) {
          deleteIndex = prevRouteIdx - 1
          prevRouteIdx = deleteIndex
          deleteTag = tagsViews.value.splice(deleteIndex, 1)[0]
        } else {
          deleteTag = tagsViews.value.pop()
        }
        const deletedTagWidth = getTextWith(deleteTag)
        $store.dispatch('minusTagWidth', deletedTagWidth)
        $store.dispatch('addDropdownView', deleteTag)
        $store.dispatch('setTagsViews', tagsViews.value)

        const tagsViewWidth = getTagsWidth(tagsViews.value)
        checkIsOverflow(
          tagsViewWidth,
          tagNode,
          tagWidth,
          prevRouteIdx,
          isResize
        )
      } else {
        if (isResize) return
        $store.dispatch('addView', { tagNode, tagWidth, prevRouteIdx })
      }
    }

    const updateTagsView = () => {
      if (!dropdownTags.value.length) {
        return
      }
      let firstDropdownTag = dropdownTags.value.slice(0, 1)[0]
      const firstDropdownTagWidth = getTextWith(firstDropdownTag)
      const availableWidth = availTagsWidth.value - tagsWidth.value
      if (firstDropdownTagWidth > availableWidth) {
        return
      }
      $store.dispatch('addView', {
        tagNode: firstDropdownTag,
        tagWidth: firstDropdownTagWidth,
      })
      $store.dispatch('removeDropdownView', firstDropdownTag.key)
      updateTagsView()
    }

    const removeDropdownTag = (key, isClosePopup = false) => {
      $store.dispatch('removeDropdownView', key)
      if (isClosePopup) {
        setDropdownVisible(false)
      }
    }

    return {
      popVisible,
      canClickOutside,
      setPopVisible,
      dropdownVisible,
      setDropdownVisible,
      tagsViews,
      dropdownTags,
      collapsed,
      toggleSideBar,
      closeSelectedTag,
      updatePinStatus,
      removeDropdownTag,
      getTagTxt,
      currentRoute
    }
  },
})
</script>
