<template>
  <div class="search">
    <!-- <div class="search-bar mini-scrollbar">
      <div class="search-bar-input">
        <gj-input
          ref="inputRef"
          :placeholder="$t('search')"
          size="mini"
          allow-clear
          @input="inputChange"
          @clear="inputClear"
        >
          <template #suffix>
            <svg-icon svg-class="search" :width="12" />
          </template>
        </gj-input>
      </div>
      <ul v-if="searchResult.length">
        <li
          class="search-menu-item"
          v-for="menuItem in searchResult"
          :key="menuItem.key"
          @click="itemClick"
        >
          <router-link class="link" :to="menuItem.route || ''">
            <span class="item-tag" v-if="menuItem.isNew">{{ $t('menu.new') }}</span
            >{{ $t(menuItem.key) }}
          </router-link>
          <span
            class="favorite-icon"
            :class="{ vs: menuItem.collection }"
            @click.stop="updateFavstatus(menuItem.key)"
          >
            <transition :name="menuItem.collection ? 'zoom' : ''" mode="out-in">
              <svg-icon
                v-if="menuItem.collection"
                svg-class="favorites"
                :width="14"
              />
              <svg-icon v-else svg-class="disfavor" :width="14" />
            </transition>
          </span>
        </li>
      </ul>
      <div v-else class="no-search-result">
        {{ searchResultText }}
      </div>
    </div> -->
    <div class="favorites-menu">
      <div class="tit">{{ $t('menu.favorites') }}({{ favorites.length }})</div>
      <ul v-if="favorites.length">
        <li
          class="favorites-menu-item"
          v-for="menuItem in favorites"
          :key="menuItem.key"
        >
          <router-link class="link" :to="menuItem.route"
          @click="itemClick"
          
          >
            <span class="item-tag" v-if="menuItem.isNew">{{ $t('menu.new') }}</span
            >{{ getTagTxt($t, menuItem) }}
          </router-link>
          <span
            class="disfavor-icon"
            @click.stop="updateFavstatus(menuItem.key, true)"
          >
            <svg-icon svg-class="cancel-favorites" :width="14" />
          </span>
        </li>
      </ul>
      <gj-empty v-else class="no-favorites">
        <div class="txt">{{ $t('menu.noFavoriteMenu') }}</div>
        <div class="line"></div>
        <div class="txt icon">
          {{ $t('menu.favoriteTip1') }}<svg-icon svg-class="disfavor" :width="14" />
        </div>
        <div class="txt">{{ $t('menu.favoriteTip2') }}</div>
      </gj-empty>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, toRefs, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import SvgIcon from '@/components/SvgIcon.vue'
import { GjMessage } from '@gj/atom'
import { getTagTxt } from '@/utils/common'

export default defineComponent({
  name: 'Search',
  components: {
    SvgIcon,
  },
  props: {
    isFocus: {
      type: Boolean,
      default: false
    }
  },
  emits: ['item-click'],
  setup(props, { emit }) {
    const $store = useStore()
    const { t } = useI18n()
    const inputRef = ref(null)
    const state = reactive({
      searchResultText: '',
      searchResult: [],
    })

    const menuMap = computed(() => {
      return $store.getters.menuMap
    })

    const favorites = computed(() => {
      return $store.getters.favorites
    })

    onMounted(() => {
      if (props.isFocus) {
        inputRef.value.focus()
      }
    })

    const inputChange = (value) => {
      if (!value) {
        state.searchResult = []
        state.searchResultText = t('menu.noRelevantResults')
        return
      }
      const result = Object.values(menuMap.value).filter((menuItem) => {
        return  menuItem.typeStyle === 'page' &&
        t(menuItem.key).toLowerCase().indexOf(value.trim().toLowerCase()) !== -1
      })
      state.searchResult = result
      state.searchResultText = result.length ? '' : t('menu.noRelevantResults')
    }

    const inputClear = () => {
      state.searchResult = []
      state.searchResultText = t('menu.noRelevantResults')
    }

    const itemClick = () => {
      emit('item-click', false)
    }

    const updateFavstatus = async (key) => {
      const node = menuMap.value[key] || {}
      const params = {
        type: 'MENU_FAVORITES',
        contents: [key]
      }

      const favNode = { ...node, collection: !node.collection }
      const res = await $store.dispatch('updatePersonalize', { params, isAdd: favNode.collection })
      if (res?.code !== 0) {
        const msg = favNode.collection ? t('menu.favoritesMenuFailed') : t('menu.failedFavoriteMenu')
        return GjMessage.error({
          content: msg,
          closable: true
        })
      }
      const msg = favNode.collection ? t('menu.favoritesMenuSucceeded') : t('menu.menuFavoritesRemoved')
      GjMessage.success({
        content: msg,
        closable: true
      })
      $store.dispatch('updateFavstatus', favNode)
    }

    return {
      inputRef,
      ...toRefs(state),
      favorites,
      inputChange,
      inputClear,
      itemClick,
      updateFavstatus,
      getTagTxt
    }
  },
})
</script>
<style lang="scss" scoped>
.search {
  display: flex;
  .search-bar-input {
    --border-radius-small: 45px;
    padding: 8px 12px;
    border-bottom: 1px solid #e6e6ed;
  }
  > div {
    flex: 1;
    flex-shrink: 0;
  }

  ul {
    width: 171px;
    min-height: 200px;
    max-height: 500px;
    margin: 4px 5px 8px 4px;
    padding-right: 5px;
    overflow-y: auto;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #000430;
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    padding: 0 8px;
    margin: 4px 0px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #f2f6fe;
    }
    .link {
      width: 100%;
      color: #000430;
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-tag {
      width: 18px;
      height: 18px;
      line-height: 18px;
      margin-right: 4px;
      text-align: center;
      color: #fff;
      background-color: #2da641;
      border-radius: 4px;
    }
  }
  .search-bar {
    display: flex;
    flex-direction: column;
    ul {
      .search-menu-item {
        &:hover {
          .favorite-icon {
            opacity: 1;
          }
        }
      }
    }
    .no-search-result {
      font-size: 12px;
      text-align: center;
      padding: 20px 10px 20px 10px;
    }
  }
  .favorites-menu {
    // border-left: 1px solid #e6e6ed;
    .tit {
      color: #000430;
      height: 40px;
      line-height: 40px;
      padding: 0 16px 0;
      border-bottom: 1px solid #e6e6ed;
    }
    ul {
      .favorites-menu-item {
        &:hover {
          .disfavor-icon {
            opacity: 1;
          }
        }
      }
    }
  }
}

.favorite-icon,
.disfavor-icon {
  color: rgba(0, 4, 48, 0.5);
  width: 14px;
  flex-shrink: 0;
  opacity: 0;
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
}

.vs {
  opacity: 1;
}

.no-favorites {
  color: #b3b4c1;
  font-size: 12px;
  text-align: center;
  padding: 20px 20px 24px;
  .line {
    width: 50px;
    padding-top: 48px;
    margin: 0 auto;
    border-bottom: 1px solid #f2f2f5;
  }
  .txt {
    font-size: 12px;
    line-height: 16px;
    padding-top: 4px;
  }
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 14px;
    .disfavor {
      margin-left: 4px;
    }
  }
}
</style>
