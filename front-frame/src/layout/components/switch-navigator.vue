<template>
  <gj-modal
    v-bind="$attrs" 
    width="auto"
    unmount-on-close
    :mask-closable="false"
    lazy-load
  >
    <template #title>{{$t('switchNavigator')}}</template>
    <div class="switch-navigator">
      <gj-alert type="warning">注意：切换导航栏布局方式会刷新页面，会保留已收藏菜单和固定页签，请注意资料的保存！</gj-alert>
      <div class="content">
        <div class="img" @click="switchType(MenuType.sideBar)">
          <img :src="sideBar" v-show="type !== MenuType.sideBar" alt="" >
          <img :src="sideBarActive" v-show="type === MenuType.sideBar" alt="">
        </div>
        <div class="img" @click="switchType(MenuType.headerBar)">
          <img :src="headerBar" v-show="type !== MenuType.headerBar" alt="">
          <img :src="headerBarActive"  v-show="type === MenuType.headerBar" alt="">
        </div>
      </div>
    </div>
    <template #footer>
      <gj-button @click="handleClose">{{$t('cancel')}}</gj-button>
      <gj-button type="primary" @click="handleConfirm">{{$t('confirm')}}</gj-button>
    </template>
  </gj-modal>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { MenuType } from '@/enum/layout'
import sideBar from '@/assets/images/sideBar.png'
import headerBar from '@/assets/images/headerBar.png'
import sideBarActive from '@/assets/images/sideBar--active.png'
import headerBarActive from '@/assets/images/headerBar--active.png'

export default defineComponent({
  name: 'SwitchNavigator',

  setup(_, { emit }) {
    const $store = useStore();

    const menuType = computed(() => $store.getters.menuType);
    const type = ref($store.getters.menuType)

    const switchType = (v) => {
      type.value = v
    }

    const handleClose = () => {
      emit('update:visible', false)
    }

    const handleConfirm = () => {
      if (menuType.value === type.value) return emit('update:visible', false);
      $store.commit('SWITCH_MENU')
      emit('update:visible', false)
    }

    return {
      MenuType,
      type,
      sideBar,
      headerBar,
      sideBarActive,
      headerBarActive,
      switchType,
      handleClose,
      handleConfirm
    }
  }
})
</script>