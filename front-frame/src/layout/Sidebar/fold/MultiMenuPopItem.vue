<template>
  <li class="gj-menu-item">
    <gj-trigger
      class="gj-menu-trigger-popup gj-multi-menu-trigger-popup"
      trigger="hover"
      position="right"
      animation-class="fade-in"
      :disabled="disabled"
      :click-outside-to-close="false"
      :mouse-enter-delay="50"
      :mouse-leave-delay="50"
      :popup-offset="16"
      :popup-translate="[0, 200]"
      :auto-fit-popup-min-width="true"
      :duration="100"
      :popup-visible="popVisible"
      @popupVisibleChange="onVisibleChange"
      show-arrow
    >
      <div
        class="gj-menu-header"
        :class="{ 'pop-menu-item-active': item1.key === selectedKey }"
      >
        <svg-icon :svg-class="item1.icon" :width="16" />
        <div class="menu-item-dec">{{ $t(item1.key) }}</div>
      </div>
      <template #content>
        <h5 class="tit">
          <span class="gj-menu-icon">
            <svg-icon :svg-class="item1.icon" :width="16" />
          </span>
          <span class="gj-menu-tit">{{ $t(item1.key) }}</span>
        </h5>
        <div class="gj-menu-pop">
          <div
            class="gj-menu-module"
            v-for="moduleItem in item1.children"
            :key="moduleItem.key"
          >
            <div class="gj-menu-sub-tit">
              <svg-icon
                class="module-icon"
                :svg-class="moduleItem.icon"
                :width="12"
              />
              {{ $t(moduleItem.key) }}
            </div>
            <template
              v-if="
                moduleItem.children[0].typeStyle === 'page' ||
                moduleItem.children[0].typeStyle === 'detailPage'
              "
            >
              <ul class="gj-menu-inline-content">
                <li
                  class="gj-menu-item"
                  v-for="leafItem in moduleItem.children"
                  :key="leafItem.key"
                  @click="onMenuItemClick(leafItem)"
                >
                  <span
                    class="favorite-icon"
                    :class="{ vs: leafItem.collection }"
                    @click.stop="updateFavstatus(leafItem.key)"
                  >
                    <transition
                      :name="leafItem.collection ? 'zoom' : ''"
                      mode="out-in"
                    >
                      <svg-icon
                        v-if="leafItem.collection"
                        svg-class="favorites"
                        :width="12"
                      />
                      <svg-icon v-else svg-class="disfavor" :width="12" />
                    </transition>
                  </span>
                  <router-link
                    class="gj-menu-item-link"
                    :to="leafItem.route || ''"
                  >
                    {{ $t(leafItem.key) }}
                  </router-link>
                </li>
              </ul>
            </template>

            <template v-else>
              <template
                v-for="platformItem in moduleItem.children"
                :key="platformItem.key"
              >
                <div class="gj-menu-platform">
                  <span class="dot"></span>{{ $t(platformItem.key) }}
                </div>
                <ul class="gj-menu-inline-content">
                  <li
                    class="gj-menu-item"
                    v-for="leafItem in platformItem.children"
                    :key="leafItem.key"
                    @click="onMenuItemClick(leafItem)"
                  >
                    <span
                      class="favorite-icon"
                      :class="{ vs: leafItem.collection }"
                      @click.stop="updateFavstatus(leafItem.key)"
                    >
                      <transition
                        :name="leafItem.collection ? 'zoom' : ''"
                        mode="out-in"
                      >
                        <svg-icon
                          v-if="leafItem.collection"
                          svg-class="favorites"
                          :width="12"
                        />
                        <svg-icon v-else svg-class="disfavor" :width="12" />
                      </transition>
                    </span>
                    <router-link
                      class="gj-menu-item-link"
                      :to="leafItem.route || ''"
                    >
                      {{ $t(leafItem.key) }}
                    </router-link>
                  </li>
                </ul>
              </template>
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
  setup() {
    const $store = useStore()
    const { updateFavstatus } = inject('injectMenuScope')
    const popVisible = ref(false)
    const disabled = ref(false)

    const selectedKey = computed(() => {
      return $store.getters.selectedKey
    })

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
      disabled.value = true;
    }

    const hidePopup = () => {
      setPopVisible(false);
      disabled.value = false
    }

    return {
      disabled,
      selectedKey,
      popVisible,
      setPopVisible,
      onVisibleChange,
      onMenuItemClick,
      updateFavstatus,
      showPopup, // 上层调用
      hidePopup  // 上层调用
    }
  },
})
</script>
