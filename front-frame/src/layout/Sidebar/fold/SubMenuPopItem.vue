<template>
  <li class="gj-menu-item">
    <gj-trigger
      class="gj-menu-trigger-popup gj-menu-trigger-popup--vertical"
      :class="`${item1.isMultiMenu ? 'gj-menu-trigger-popup--vertical--max' : ''}`"
      trigger="hover"
      position="right"
      animation-class="fade-in"
      :disabled="disabled"
      :click-outside-to-close="false"
      :mouse-enter-delay="50"
      :mouse-leave-delay="50"
      :popup-offset="0"
      :auto-fit-popup-min-width="true"
      :duration="100"
      :popup-visible="popVisible"
      @popupVisibleChange="onVisibleChange"
      :show-arrow="false"
    >
      <div class="gj-menu-header" :class="{ 'pop-menu-item-active': item1.key === selectedKey }">
        <svg-icon :svg-class="item1.icon" :width="16" />
        <div class="menu-item-dec">{{ $t(item1.key, item1.name) }}</div>
      </div>
      <template #content>
        <div class="gj-menu-item__wrap">
          <template v-if="item1.isMultiMenu">
            <ul class="menu-side">
              <li v-for="(menuItem, index) in item1.children" 
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
          <!-- <h5 class="tit">
            <span class="gj-menu-icon">
              <svg-icon :svg-class="`popup-${item1.icon}`" :width="16" />
            </span>
            <span class="gj-menu-tit">{{ $t(item1.key) }}</span>
          </h5> -->
          <div class="gj-menu-pop">
            <template v-if="menuChildren.length &&
              menuChildren[0].typeStyle === 'menu'"
            >
              <div
                class="gj-menu-module"
                v-for="moduleItem in menuChildren"
                :key="moduleItem.key"
              >
                <div class="gj-menu-sub-tit">
                  <span class="dot"></span>{{ $t(moduleItem.key, moduleItem.name) }}
                </div>
                <ul class="gj-menu-inline-content">
                  <li
                    class="gj-menu-item"
                    v-for="leafItem in moduleItem.children"
                    :key="leafItem.key"
                  >
                    <span
                      class="favorite-icon"
                      :class="{ vs: leafItem.collection }"
                      @click.stop="updateFavstatus(leafItem.key)"
                    >
                      <transition :name="leafItem.collection ? 'zoom' : ''" mode="out-in">
                        <svg-icon v-if="leafItem.collection" svg-class="favorites" :width="12"  style="font-size: 12px;" />
                        <svg-icon v-else svg-class="disfavor" :width="12"  style="font-size: 12px;" />
                      </transition>
                    </span>
                    <router-link class="gj-menu-item-link" :to="leafItem.route || ''"
                      @click="onMenuItemClick(leafItem)"
                    >
                      <span :title="$t(leafItem.key, leafItem.name)">{{ $t(leafItem.key, leafItem.name) }}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </template>
            <template v-else>
              <!-- 没有下一级了 -->
              <div class="gj-menu-module">
                <div class="gj-menu-sub-tit">
                  <span class="dot"></span>{{ menuTitle }}
                </div>
                <ul class="gj-menu-inline-content">
                  <li v-for="moduleItem in menuChildren"
                    :key="moduleItem.key"
                    class="gj-menu-item"
                  >
                    <span
                      class="favorite-icon"
                      :class="{ vs: moduleItem.collection }"
                      @click.stop="updateFavstatus(moduleItem.key)"
                    >
                      <transition :name="moduleItem.collection ? 'zoom' : ''" mode="out-in">
                        <svg-icon v-if="moduleItem.collection" svg-class="favorites" :width="12"  style="font-size: 12px;" />
                        <svg-icon v-else svg-class="disfavor" :width="12"  style="font-size: 12px;" />
                      </transition>
                    </span>
                    <router-link class="gj-menu-item-link" :to="moduleItem.route || ''"
                      @click="onMenuItemClick(moduleItem)"
                    >
                      <span :title="$t(moduleItem.key, moduleItem.name)">{{ $t(moduleItem.key, moduleItem.name) }}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>
      </template>
    </gj-trigger>
  </li>
</template>

<script>
import { defineComponent, ref, inject, computed } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { brandsEnum, brands } from '@/enum/layout';
import { useStore } from 'vuex'

export default defineComponent({
  name: 'SubMenuPopItem',
  components: {
    SvgIcon,
  },
  props: {
    item1: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const $store = useStore()
    const {
      updateFavstatus
    } = inject('injectMenuScope')
    const disabled = ref(false);

    const popVisible = ref(false)

    const selectedKey = computed(() => {
      return $store.getters.selectedKey
    })

    const platformIndex = ref(0);

    const menuChildren = computed(() => {
      if (!props.item1.isMultiMenu) {
        return props.item1.children;
      }
      return props.item1.children[platformIndex.value].children
    })

    const menuTitle = computed(() => {
      if (!props.item1.isMultiMenu) {
        return props.item1.name;
      }
      return props.item1.children[platformIndex.value].name
    })

    const handleMenuHover = (index) => {
      platformIndex.value = index
    }

    const setPopVisible = (val) => {
      popVisible.value = val
    }

    const onVisibleChange = (visible) => {
      setPopVisible(visible)
    }

    const onMenuItemClick = (key) => {
      setPopVisible(false)
    }

    const showPopup = () => {
      setPopVisible(true)
      disabled.value = true
    }

    const hidePopup = () => {
      setPopVisible(false)
      disabled.value = false
    }

    return {
      selectedKey,
      popVisible,
      disabled,
      menuChildren,
      brandsEnum,
      menuTitle,
      brands,
      platformIndex,
      setPopVisible,
      handleMenuHover,
      onVisibleChange,
      onMenuItemClick,
      updateFavstatus,
      showPopup, // 上层调用
      hidePopup  // 上层调用
    }
  },
})
</script>
