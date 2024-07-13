<template>
  <GuideTempalte :el="el" :direction="direction" />
  
  <span v-show="!visible" class="guide-btn" @click="handleGuideClick">新手引导</span>
</template>

<script>
import { defineComponent, computed, watch, onMounted } from 'vue';

import GuideTempalte from './guideTemplate.vue';
import { useInject } from './useGuide'
import getConfig from './config.js'
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Guide',
  components: {
    GuideTempalte
  },
  setup() {
    // const delay = 300;
    const $store = useStore();
    const { current, reset, init, visible  } = useInject();
    // const el = computed(() => current.value?.el);
    const direction = computed(() => current.value?.direction);
    const menuType = computed(() => $store.getters.menuType);
    const collapsed = computed(() => $store.getters.collapsed);
    const menuData = computed(() => {
      return $store.getters.sidebarMenu
    })

    const needGuideLastStep = (menu) => {
      let need = false
      // 如果没有 review，feedback和买家列表，则不需要菜单搬家引导
      const kefu = menu.find(m => m.key === "v2.menu.crm");
      if (kefu) {
        const highlightMenus = ['/amz-web/sale/review', '/amz-web/sale/feedback', '/amz-web/sale/buyer']
        need = highlightMenus.some(l => kefu.children.some(i => i.children.some(n => n.route === l)));
      }
      return need;
    };

    const initConfig = (store) => {
      const need = needGuideLastStep(store.getters.sidebarMenu);
      const config = getConfig(store)
      if (need === false) config.pop();
      init(config);
    
      // 自动弹出新手引导
      const oldManKey = 'imAOldMan'
      const isOldMan = Boolean(localStorage.getItem(oldManKey));
      if (!isOldMan) {
        setTimeout(() => {
          localStorage.setItem(oldManKey, 1);
          reset();
        }, 2000)
      }
    }

    const handleGuideClick = () => {
      reset()
    }
    

    // watch(() => el.value, (v, o) => {
    //   console.log('watch', v)
    //   if (v ) {
    //     setTimeout(() => {
    //       if (document.querySelector(v) === null) {
    //         next()
    //       }
    //     }, delay)
    //   }
    // })

    watch(() => [menuType.value, collapsed.value], () => {
      // 重载配置
      setTimeout(() => {
        initConfig($store)
      }, 300)
    })

    watch(() => menuData.value, (v) => {
      if (!v || !v.length) return;
      initConfig($store);
    })


    onMounted(() => {
      if (menuData.value && menuData.value.length) initConfig($store);
    })

    return {
      // el,
      // delay,
      direction,
      visible,
      handleGuideClick
    }
  }
})
</script>

<style lang="scss">
.guide-btn {
  position: fixed;
  right: 0;
  bottom: 200px;
  width: 12px;
  z-index: 1000;
  padding: 8px 10px;
  color: white;
  font-size: 12px;
  line-height: 14px;
  background: #0045F0;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.12), 0px 6px 18px rgba(0, 0, 0, 0.08), 0px 9px 28px rgba(0, 0, 0, 0.06);
  border-radius: 8px 0 0 8px;
  cursor: pointer;
}
</style>