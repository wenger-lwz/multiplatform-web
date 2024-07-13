<template>
  <div class="sidebar-container" :class="{ 'sidebar-collapsed': collapsed }">
    <gj-tooltip
      :content="companyTitle" 
      :content-class="collapsed ? '' : 'gj-tooltip-content-white'"
    >
      <div class="sidebar-logo">
      
        <svg-icon :svg-class="collapsed ? 'logo-collapsed' : 'logo'" />
      </div>
    </gj-tooltip>
    <!-- 收起 -->
    <ul v-show="collapsed" class="sidebar-menu-collapsed" :class="`${ isHideIcon ? 'hide-icon' : ''}`">
      <menu-pop-item :ref="setPopItemRef" v-for="item in menuData" :key="item.key" :item="item" />
    </ul>
    <!-- 展开 -->
    <gj-menu
      v-show="!collapsed"
      class="sidebar-menu"
      :level-indent="10"
      v-model:open-keys="currentOpenKeys"
      :selected-keys="selectedKeys"
      :accordion="true"
      @sub-menu-click="updateOpenKeys"
    >
      <menu-item v-for="item in menuData" :key="item.key" :item="item" />
    </gj-menu>
    <!-- 用户栏 -->
    <UserBar />
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  ref,
  watch,
  nextTick,
} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { GjMessage } from '@gj/atom'

import SvgIcon from '@/components/SvgIcon.vue'
import { getMenuList, getUserAttr } from '@/api/public'

import MenuItem from './unfold/Item.vue'
import MenuPopItem from './fold/PopItem.vue'
import UserBar from '../components/user-bar';
import { useProvide, nodesMap, routesMap, registerNodes } from '../useMenu'
import { useInject as guideHookInject, TYPE as HookType } from '@/common/guide/useHook.js';
import { disableDom, enableDom } from '@/common/guide/utils'
import { onResize } from '@/utils/window'
import { throttle } from 'lodash'

export default defineComponent({
  components: {
    MenuItem,
    MenuPopItem,
    SvgIcon,
    GjMessage,
    UserBar
  },
  setup() {
    const $store = useStore()
    const $route = useRoute()
    const { defaultActiveTabKeys, updateOpenKeys } = useProvide();
    const screenHeigth = ref(document.body.clientHeight);

    const isHideIcon = computed(() => screenHeigth.value <= 768);
    const companyTitle = computed(() => $store.getters.companyInfo.company || '');

    const setScreenHeigth =  throttle(() => {
      screenHeigth.value = document.body.clientHeight
    }, 100)
    onResize(() => {
      setScreenHeigth()
    })

    // 当前展开的菜单
    const currentOpenKeys = ref([])

    const collapsed = computed(() => {
      return $store.getters.collapsed
    })

    const menuData = computed(() => {
      return $store.getters.sidebarMenu
    })

    const openKeys = computed(() => {
      return $store.getters.openKeys
    })

    const selectedKeys = computed(() => {
      return $store.getters.selectedKeys
    })

    const tabsActiveKey = computed(() => {
      return $store.getters.tabsActiveKey
    })
    
   
    /**
     * 设置新手引导的动作, start
     */
    const popItemRef = ref([])
    const setPopItemRef = (el) => {
      if (el) {
        popItemRef.value.push(el)
      }
    };
    const el = [ '.sidebar-container.sidebar-collapsed' , '.arco-menu.sidebar-menu']
    const { set } = guideHookInject();
    let tplOpenKeys;
    set(el[0], (config) => {
      const kefuIndex = menuData.value.findIndex(m => m.key === "v2.menu.crm");
      popItemRef.value[kefuIndex > -1 ? kefuIndex : 0].togglePopup(true);
      setTimeout(() => {
        disableDom('.gj-menu-trigger-popup--vertical')
        if (config.title === '菜单搬家') highlightMenuFn(collapsed.value)
      }, 100)
    })
    set(el[1], (config) => {
      tplOpenKeys = openKeys.value
      $store.commit('SET_OPEN_KEYS', ["v2.menu.crm", "v2.menu.crm.crmMenu", "v2.menu.crm.invitationMenu"])
      setTimeout(() => {
        disableDom('.gj-menu-trigger-popup--vertical')
        if (config.title === '菜单搬家') highlightMenuFn(collapsed.value)
      }, 100)
    })
    set(el[0], (config) => {
      const kefuIndex = menuData.value.findIndex(m => m.key === "v2.menu.crm");
      popItemRef.value[kefuIndex > -1 ? kefuIndex : 0].togglePopup(false);
      if (config.title === '菜单搬家') highlightMenuFn(collapsed.value, true)
      enableDom('.gj-menu-trigger-popup--vertical')
    }, HookType.after)
    set(el[1], (config) => {
      $store.commit('SET_OPEN_KEYS', tplOpenKeys)
      enableDom('.gj-menu-trigger-popup--vertical')
      if (config.title === '菜单搬家') highlightMenuFn(collapsed.value, true)
    }, HookType.after)
    // 高亮特定的菜单

    function highlightMenuFn (collapsed, remove = false) {
      const highlightMenus = ['/amz-web/sale/review', '/amz-web/sale/feedback', '/amz-web/sale/buyer']
      const node = ['.gj-menu-trigger-popup--vertical', '.arco-menu.sidebar-menu'];
      const el = collapsed ? node[0] : node[1]
      const className = `guide-high-light-menu--${collapsed ? 'light' : 'dark'}`;
      highlightMenus.forEach(href => {
        const aDom = document.querySelector(`${el} a[href="${href}"]`);
        if (!aDom )return;
        // if (remove) {
        if (collapsed) {
          aDom.parentElement.classList[remove ? 'remove' : 'add'](className)
        } else {
          aDom.parentElement.parentElement.classList[remove ? 'remove' : 'add'](className)
        }
      })
    }
    /**
     * 设置新手引导的动作, end
     */

    watch(
      () => openKeys.value,
      (newOpenKeys) => {
        currentOpenKeys.value = newOpenKeys
      }
    )

    watch(
      () => tabsActiveKey.value,
      (newActiveTabKeys) => {
        defaultActiveTabKeys.value = newActiveTabKeys
      }
    )

    const init = async () => {
      const { path } = $route
      if (menuData.value.length === 0) {
        const menuInfo = await getMenuList()
        if (menuInfo?.code !== 0) {
          GjMessage.error('获取菜单失败')
          return
        }        
        // setTimeout(()=> {
        //   临时函数(menuInfo.data)
        // }, 100)
        $store.dispatch('setSidebarMenu', menuInfo.data) //.concat(platMenu)
        // 获取用户信息
        const userInfo = {
          ...$store.getters?.getUserInfo,
        }
        const user = await getUserAttr()
        if (user?.code === 0 && user?.data) {
          userInfo.name = user.data.name
        }
        $store.dispatch('USER_INFO', JSON.stringify(userInfo))
      }
      if (menuData.value.length) {
        nextTick(() => {
          registerNodes(menuData.value)
          $store.dispatch('setMenuMap', nodesMap)
          $store.dispatch('setRoutesPathMap', routesMap)
          $store.dispatch('setTabsActiveKey')
          $store.dispatch('setDefaultOpenKeys', path)
          $store.dispatch('setDefaultSelectedKeys', path)
          $store.dispatch('getAuth')
        })
      }
    }

    init()

    return {
      isHideIcon,
      collapsed,
      menuData,
      currentOpenKeys,
      companyTitle,
      selectedKeys,
      updateOpenKeys,
      setPopItemRef
    }
  },
})
</script>
