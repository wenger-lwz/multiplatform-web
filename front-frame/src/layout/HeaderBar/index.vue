<template>
  <div class="header-bar-container">
    <gj-tooltip :content="companyTitle">
      <div class="header-bar-logo">
        <svg-icon svg-class="logo-collapsed" style="width: 43px; height: 24px;" />
      </div>
    </gj-tooltip>
    <div class="header-bar-menu">
      <gj-menu mode="horizontal"
        :default-collapsed="false"
        :show-collapse-button="false"
        :selected-keys="selectedKeys"
      >
        <gj-menu-item :class="`${selectedKey.includes(menu.key) ? 'arco-menu-selected' : ''}`" v-for="menu in menuData" :key="menu.key" @click.stop>
          <menu-item :ref="setMenuItemRef" :data="menu"></menu-item>
        </gj-menu-item>

      </gj-menu>
    </div>
    <div>
      <SwitchNav></SwitchNav>
    </div>
    <div class="header-bar-notice">
      <notice-bar></notice-bar>
    </div>
    <div class="header-bar-user">
      <user-bar></user-bar>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, watch, nextTick, ref  } from 'vue';
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import { getMenuList } from '@/api/public'
import SvgIcon from '@/components/SvgIcon.vue';
import { useInject as guideHookInject, TYPE as HookType } from '@/common/guide/useHook.js';
import { disableDom, enableDom } from '@/common/guide/utils'
import { GjMessage } from '@gj/atom'

import MenuItem from './components/menu-item.vue';
import SwitchNav from './components/switch-nav.vue';
import NoticeBar  from '../components/notice-bar.vue';
import UserBar  from '../components/user-bar/index.vue';
import { useProvide, nodesMap, routesMap, registerNodes } from '../useMenu'

export default defineComponent({
  name: 'HeaderBar',

  components: {
    SvgIcon,
    UserBar,
    NoticeBar,
    MenuItem,
    SwitchNav
  },

  setup() {
    const $store = useStore()
    const $route = useRoute()

    const companyTitle = computed(() => $store.getters.companyInfo.company || '');

    /**
     * 设置新手引导的动作, start
     */
    const { set } = guideHookInject();
    const el = '.header-bar__menu-item__wrap';
    set(el, (config) => {
      // 当引导聚焦 .header-bar-container 时
      const kefuIndex = menuData.value.findIndex(m => m.key === "v2.menu.crm");
      menuItemRef.value[kefuIndex > -1 ? kefuIndex : 0].showPopup();
      setTimeout(() => {
        disableDom(el)
        if (config.title === '菜单搬家') highlightMenuFn();
      }, 100)
    })
    set(el, (config) => {
      // 当引导聚焦 .header-bar-container 时
      const kefuIndex = menuData.value.findIndex(m => m.key === "v2.menu.crm");
      menuItemRef.value[kefuIndex > -1 ? kefuIndex : 0].hidePopup();
        enableDom(el);
        if (config.title === '菜单搬家') highlightMenuFn(true);
    }, HookType.after);

    function highlightMenuFn(remove= false) {
      const highlightMenus = ['/amz-web/sale/review', '/amz-web/sale/feedback', '/amz-web/sale/buyer']
      const className = 'guide-high-light-menu--light'
      highlightMenus.forEach(href => {
        const aDom = document.querySelector(`.header-bar__menu-item a[href="${href}"]`);
        if (!aDom )return;
        if (remove) {
          aDom.parentElement.classList.remove(className)
        } else {
          aDom.parentElement.classList.add(className)
        }
      })
    }
    /**
     * 设置新手引导的动作, end
     */

    const { defaultActiveTabKeys } = useProvide();

    const menuItemRef = ref([]);

    const menuData = computed(() => {
      return $store.getters.sidebarMenu
    })

    const tabsActiveKey = computed(() => {
      return $store.getters.tabsActiveKey
    })

    const selectedKey = computed(() => {
      return $store.getters.selectedKey
    })

    const selectedKeys = computed(() => {
      return $store.getters.selectedKeys
    })

    watch(
      () => tabsActiveKey.value,
      (newActiveTabKeys) => {
        defaultActiveTabKeys.value = newActiveTabKeys
      }
    )

    const setMenuItemRef = (el) => {
      if (el) {
        menuItemRef.value.push(el)
      }
    }

    const init = async () => {
      const { path } = $route
      if (menuData.value.length === 0) {
        const menuInfo = await getMenuList()
        if (menuInfo?.code !== 0) {
          GjMessage.error('获取菜单失败')
          return
        }
        // console.log(menuInfo.data);
        // 临时函数(menuInfo.data)
        $store.dispatch('setSidebarMenu', menuInfo.data) //.concat(platMenu)
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
      menuItemRef,
      menuData,
      selectedKey,
      selectedKeys,
      companyTitle,
      setMenuItemRef
    }
  }

})
</script>
