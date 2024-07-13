<template>
  <gj-trigger
    class="gj-menu-trigger-popup gj-headerbar-menu-trigger-popup"
    trigger="hover"
    position="bl"
    animation-class="fade-in"
    :mouse-enter-delay="50"
    :mouse-leave-delay="50"
    :disabled="disabled"
    :click-outside-to-close="false"
    :popup-offset="0"
    :popup-visible="popVisible"
    :auto-fit-popup-min-width="true"
    :duration="100"
    @popupVisibleChange="onVisibleChange"
  >
    <span 
    class="menu-text"
    :class="{ 'menu-text-active': data.key === selectedKey }"
    >{{ $t(data.key, data.name) }}</span>
    <template #content>
      <div class="header-bar__menu-item__wrap">
        <!-- 多平台 -->
        <template v-if="isMultiPlatform">
          <ul class="menu-side">
            <li v-for="(menuItem, index) in data.children" 
              :key="menuItem.key"
              @mouseover="handleMenuHover(index)"
              :class="{active: platformIndex === index}"
            >
              <span class="menu-brand">
                <svg-icon v-if="Object.values(brands).includes(menuItem.platform)"
                  :svg-class="`${
                    brandsEnum[menuItem.platform]
                  }-square${platformIndex === index ? '-active' : ''}`"
                  :width="90"
                  :height="40"
                  style="color: #86909C;"
                />
              </span>
            </li>
          </ul>
        </template>

        <ModuleItem :data="moduleItemData" :title="moduleItemTitle"></ModuleItem>
         
      </div>
    </template>
  </gj-trigger>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'

import { brandsEnum, brands } from '@/enum/layout';
import SvgIcon from '@/components/SvgIcon.vue'

import ModuleItem from './module-item.vue'

export default defineComponent({
  name: 'MenuItem',
  components: {
    ModuleItem,
    SvgIcon
  },
  props: {
    data: {
      type: Object,
      defaut: () => {}
    }
  }, 
  setup(props) {
    const $store = useStore();
    const platformIndex = ref(0);
    const platforms = [...new Set(props.data.children.map(i => i.platform))];
    const isMultiPlatform = props.data.isMultiMenu && platforms.length > 1;
    const popVisible = ref(false);
    const disabled = ref(false);

    const selectedKey = computed(() => {
      return $store.getters.selectedKey
    })
    const moduleItemData = computed(() => {
      if (!isMultiPlatform) return props.data.children;
      return props.data.children[platformIndex.value].children;
    });
     const moduleItemTitle = computed(() => {
      if (!isMultiPlatform) return props.data.name;
      return props.data.children[platformIndex.value].name;
    });


    const handleMenuHover = (index) => {
      platformIndex.value = index
    }

    const onVisibleChange = (v) => {
      popVisible.value = v;
    }

    const showPopup = () => {
      popVisible.value = disabled.value = true;
    }

    const hidePopup = () => {
      popVisible.value = disabled.value = false;
    }

    return {
      selectedKey,
      platforms,
      brandsEnum,
      brands,
      disabled,
      moduleItemTitle,
      platformIndex,
      isMultiPlatform,
      moduleItemData,
      popVisible,
      onVisibleChange,
      handleMenuHover,
      showPopup, // 上层调用
      hidePopup  // 上层调用
    }
  }
})
</script>
