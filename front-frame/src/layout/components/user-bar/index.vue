<template>
  <div class="sidebar-user">
    <gj-dropdown
      class="user-bar"
      :position="menuType === MenuType.sideBar ? 'rb': 'br'"
      trigger="hover"
      :popup-translate="[5, 0]"
      :popup-visible="_dropDownVisible"
      @select="selectDropdown($event)"
      @popup-visible-change="handleDropDownChange"
    >
      <div class="sidebar-user-head">
        <span class="user-bar-avatar">
          <svg-icon svg-class="user" :width="22" />
        </span>
        <template v-if="!(collapsed && menuType === MenuType.sideBar)">
          <span class="user-bar-name">{{ userName }}</span>
          <span class="user-bar-arrow">
            <svg-icon svg-class="caret-down" :width="6" />
          </span>
        </template>
      </div>
      <template #content>
        <gj-doption value="userRole">
          {{ $t('viewDataPermis') }}
        </gj-doption>
        <gj-doption value="userCenter">
          {{ $t('userCenter') }}
        </gj-doption>
        <gj-doption value="help">
          {{ $t('helpDocument') }}
        </gj-doption>
        <gj-dsubmenu trigger="hover" class="locale-trigger-popup">
          <template #default
            >{{ $t('language') }}·{{ locale[language] }}</template
          >
          <template #content>
            <gj-doption
              :class="{ 'lg-active': language === 'zh' }"
              @click="languageChange('zh')"
              >简体中文</gj-doption
            >
            <gj-doption
              :class="{ 'lg-active': language === 'en' }"
              @click="languageChange('en')"
              >English(U.S.)</gj-doption
            >
          </template>
        </gj-dsubmenu>
        <gj-doption value="nav">
          {{ $t('switchNavigator') }}
        </gj-doption>
        <div class="line"></div>
        <gj-doption>
          <span class="text" @click="loginOut">
            {{ $t('loginOut') }}
          </span>
        </gj-doption>
      </template>
    </gj-dropdown>
  </div>

  <!-- 弹框, Start -->
  <user-center
    v-model:visible="visible.userCenter"
    v-if="visible.userCenter"
  ></user-center>
  <user-role
    v-model:visible="visible.userRole"
    v-if="visible.userRole"
    :user-id="userId"
    :show-listing-role="showListingRole"
  ></user-role>
  <switch-navigator
    v-model:visible="visible.navigator"
    v-if="visible.navigator"
  ></switch-navigator>
  <!-- 弹框, End -->
</template>

<script>
import { defineComponent, reactive, computed, ref  } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { distoryLogin } from '@/utils/common'
import i18n from '@/i18n'
import { M_T } from '@/store/mutationsTypes'

import { setLoginOut } from '@/api/public'
import { useMainAppNotice } from '@gj/micro-frontend'
import SvgIcon from '@/components/SvgIcon.vue'

import { useUserRole } from './hooks/use-user-role'
import UserCenter from '../user-center'
import UserRole from '../user-role'
import SwitchNavigator from '../switch-navigator.vue';
import { MenuType } from '@/enum/layout'
import { useInject as guideHookInject, TYPE as HookType } from '@/common/guide/useHook.js';

export default defineComponent({
  name: 'UserBar',

  components: {
    SvgIcon,
    UserCenter,
    UserRole,
    SwitchNavigator
  },

  setup() {
    const $store = useStore()
    const $router = useRouter()
    const collapsed = computed(() => {
      return $store.getters.collapsed
    })
    const menuType = computed(() => $store.getters.menuType)
    const visible = reactive({
      userCenter: false,
      userRole: false,
    })

    const _dropDownVisible = ref(false);
    const _dropDisable = ref(false);

    const locale = {
      zh: '简体中文',
      en: 'English(U.S.)',
    }

    const language = computed(() => {
      return $store.getters.language
    })

    const userName = computed(() => {
      return $store.getters?.getUserInfo?.name
    })

    const { userId, showListingRole } = useUserRole()
    const handleDropDownChange = (v) => {
      if (_dropDisable.value === false) {
        _dropDownVisible.value = v
      }
    }

    const selectDropdown = (type) => {
      if (type === 'help') {
        window.open('http://help.gerpgo.com/web/#/1', '_blank')
      } else if (type === 'downloadCenter') {
        $router.push('/amz-web/reports/downloadCenter')
      } else if (type === 'userCenter') {
        visible.userCenter = true
      } else if (type === 'userRole') {
        visible.userRole = true
      } else if (type === 'nav') {
        visible.navigator = true
      }
    }

    // 退出登录
    const loginOut = () => {
      setLoginOut().finally(() => {
        distoryLogin();
      })
    }

    const { sendLanguage } = useMainAppNotice()
    const languageChange = (language) => {
      // 切换基座的语言，并通知所有子应用切换语言
      $store.dispatch(M_T.LANGUAGE_INFO, language)
      i18n.global.locale.value = language
      sendLanguage(language)
      // console.log(
      //   '这里需要向所有子应用发起切换语言的通信，注意有的子项目（iframe）此时可能没有被激活',
      //   getCurrentApp()
      // )
    }

    /**
     * 设置新手引导的动作, start
     */
    const el = '.sidebar-user'
    const { set } = guideHookInject();
    set(el, () => {
      _dropDisable.value = true
      _dropDownVisible.value = true

    })
    set(el, () => {
      _dropDisable.value = false
      _dropDownVisible.value = false
    }, HookType.after)
    /**
     * 设置新手引导的动作, end
    */
    return {
      collapsed,
      menuType,
      MenuType,
      locale,
      language,
      visible,
      userName,
      userId,
      showListingRole,
      _dropDownVisible,
      handleDropDownChange,
      selectDropdown,
      loginOut,
      languageChange,
    }
  }

})
</script>

<style lang="scss">

  .sidebar-user {
    display: flex;
    padding: 8px 0 8px 0px;
    justify-content: center;

    .sidebar-user-head {
      width: 100%;
      color: #fff;
      display: flex;
      align-items: center;
      padding: 5px 6px 5px 6px;
      border-radius: 35px;
      height: 22px;
      max-width: 111px;
      cursor: pointer;

      .user-bar-name {
        padding: 0 10px 0 8px;
        font-size: 14px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .sidebar-user-head {
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      &:active {
        background-color: rgba(255, 255, 255, 0.15);
      }
      .user-bar-arrow {
        transition: all 0.2s ease;
      }
    }

    .sidebar-user-head.arco-dropdown-open {
      .user-bar-arrow {
        transform: rotate(-90deg);
      }
    }
  }
</style>
