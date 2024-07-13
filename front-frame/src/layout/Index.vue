<template>
  <div :class="`layout layout--${menuType}`">
    <!-- 顶部菜单导航 -->
    <template v-if="MenuType.sideBar !== menuType">
      <header-bar  />
    </template>

    <!-- 侧边菜单导航 -->
    <template v-else>
      <side-bar />
    </template>

    <!-- 内容 -->
    <main-content>
      <div class="base_header">
        <div class="header-wrap">
          <PageNavigator
            :theme="MenuType.sideBar === menuType ? 'dark' : 'light'"
            :getAvailableWidth="getAvailableWidth"
            :collapsible="MenuType.sideBar === menuType"
          />

          <div class="right-button" ref="rightBarRef">
            <NoticeBar v-if="MenuType.sideBar === menuType" />
          </div>
        </div>
      </div>
    </main-content>

  </div>

  <!-- 下载（excel导出）消息 -->
  <DownloadMessage />

  <!-- 新手引导 -->
  <Guide />
</template>

<script>
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex';
import { pick } from 'lodash';
import { MenuType } from '@/enum/layout'
import { useProvide as pendingProvide } from '@/common/downloadMessage/usePendingMessage';
import { useProvide as resolvedProvide } from '@/common/downloadMessage/useResolvedMessage';
import Guide from '@/common/guide/index.vue';
import { useProvide as guideProvide } from '@/common/guide/useGuide.js';
import DownloadMessage from '@/common/downloadMessage/index.vue';
import { getCompanyInformation } from '@/api/system.js';

import SideBar from './Sidebar/index.vue'
import MainContent from './Content.vue'
import HeaderBar from './HeaderBar';
import PageNavigator from './PageNavigator/index.vue';
import NoticeBar  from './components/notice-bar.vue';

export default defineComponent({
  components: {
    SideBar,
    MainContent,
    HeaderBar,
    PageNavigator,
    NoticeBar,
    DownloadMessage,
    Guide
  },
  setup() {
    /**
     * 下载（excle导出）消息提供商
     */
    pendingProvide(); // 开始（等待导出）消息
    resolvedProvide();  // 完成消息

    // 新手引导
    guideProvide();

    const $store = useStore();

    const menuType = computed(() => $store.getters.menuType);

    const rightBarRef = ref(null);
    const collapsed = computed(() => $store.getters.collapsed);

    const getAvailableWidth = () => {
      const sidebarWidth = collapsed.value ? 56 : 196
      const rightbarWidth = rightBarRef.value.clientWidth
      const otherWidth = 24 + 10 + 40 + 36 + 0
      return (
        document.querySelector('#app').scrollWidth -
        (sidebarWidth + rightbarWidth + otherWidth)
      )
    }

    onMounted(async () => {
      // 获取公司信息在头部展示公司名称
      const { data } = await getCompanyInformation(1);

      $store.commit('SET_COMPANY_IFNO', pick(data, ['company']))
    })


    return {
      menuType,
      MenuType,
      rightBarRef,
      getAvailableWidth
    }
  },
})
</script>
