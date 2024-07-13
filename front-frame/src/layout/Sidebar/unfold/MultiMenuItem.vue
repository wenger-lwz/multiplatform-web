<template>
  <gj-sub-menu :key="item1.key" class="multi-sub-menu">
    <template #icon>
      <svg-icon :svg-class="item1.icon" :width="16" />
    </template>
    <template #expand-icon-right>
      <svg-icon svg-class="caret-right" :width="12" />
    </template>
    <template #expand-icon-down>
      <svg-icon svg-class="caret-right" :width="12" />
    </template>
    <template #title>
      {{ $t(item1?.key, item1?.name) }}
    </template>

    <div class="tab-wrap">
      <gj-tabs
        type="rounded"
        direction="vertical"
        :active-key="tabsActiveKey[item1.key]"
        @tab-click="expand"
      >
        <gj-tab-pane v-for="item2 in item1.children" :key="item2.key">
          <template #title>
            <svg-icon :svg-class="item2.icon" :width="20" />
          </template>
          <div class="platform">{{ $t(item2.key, item2.name) }}</div>
          <template
            v-if="
              item2.children[0].typeStyle === 'page' ||
              item2.children[0].typeStyle === 'detailPage'
            "
          >
            <gj-menu-item
              class="is-leaf"
              v-for="item3 in item2.children"
              :key="item3?.key"
            >
              <template #icon>
                <span
                  class="favorite-icon"
                  :class="{ vs: item3.collection }"
                  @click.stop="updateFavstatus(item3.key)"
                >
                  <transition
                    :name="item3.collection ? 'zoom' : ''"
                    mode="out-in"
                  >
                    <svg-icon
                      v-if="item3.collection"
                      svg-class="favorites"
                      :width="16"
                    />
                    <svg-icon v-else svg-class="disfavor" :width="16" />
                  </transition>
                </span>
              </template>
              <router-link :to="item3?.route || ''">
                {{ $t(item3?.key, item3?.name) }}
              </router-link>
            </gj-menu-item>
          </template>

          <template v-else>
            <gj-sub-menu v-for="item3 in item2.children" :key="item3.key">
              <template #icon>
                <!-- <icon-apps></icon-apps> -->
              </template>
              <template #expand-icon-right>
                <svg-icon svg-class="caret-right" :width="12" />
              </template>
              <template #expand-icon-down>
                <svg-icon svg-class="caret-right" :width="12" />
              </template>
              <template #title>
                {{ $t(item3?.key, item3?.name) }}
              </template>
              <gj-menu-item
                class="is-leaf"
                v-for="item4 in item3.children"
                :key="item4?.key"
              >
                <template #icon>
                  <span
                    class="favorite-icon"
                    :class="{ vs: item4.collection }"
                    @click.stop="updateFavstatus(item4.key)"
                  >
                    <transition
                      :name="item4.collection ? 'zoom' : ''"
                      mode="out-in"
                    >
                      <svg-icon
                        v-if="item4.collection"
                        svg-class="favorites"
                        :width="16"
                      />
                      <svg-icon v-else svg-class="disfavor" :width="16" />
                    </transition>
                  </span>
                </template>
                <router-link :to="item4?.route || ''">
                  {{ $t(item4?.key, item4?.name) }}
                </router-link>
              </gj-menu-item>
            </gj-sub-menu>
          </template>
        </gj-tab-pane>
      </gj-tabs>
    </div>
  </gj-sub-menu>
</template>

<script>
import { defineComponent, inject, computed } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'MultiMenuItem',
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
    const { updateOpenKeys, updateFavstatus } =
      inject('injectMenuScope')

    const $store = useStore();
    const tabsActiveKey = computed(() => {
      return $store.getters.tabsActiveKey
    })

    const expand = (key) => {
      updateOpenKeys(key, [], false)
    }

    return {
      tabsActiveKey,
      expand,
      updateFavstatus,
    }
  },
})
</script>

<style lang="scss" scoped>
.tab-wrap {
  .platform {
    font-size: 13px;
    line-height: 32px;
    font-weight: 600;
    padding-left: 8px;
    color: #fff;
  }
  :deep(.arco-tabs-nav-type-rounded) {
    .arco-tabs-nav-tab {
      margin: 0 7px;
    }
    .arco-tabs-tab {
      height: 32px;
      padding: 6px;
      margin-top: 0px;
      border-radius: 4px;
      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
      .arco-tabs-tab-title {
        color: #9da4af;
        border-bottom: 0;
        .svg-icon {
          width: 20px;
        }
      }
    }
    .arco-tabs-tab-active {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
  :deep(.arco-tabs-left.arco-tabs-vertical) {
    .arco-tabs-content {
      padding-left: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
