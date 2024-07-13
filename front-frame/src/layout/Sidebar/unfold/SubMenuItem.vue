<template>
  <gj-sub-menu :key="item1.key" class="normal-sub-menu">
    <template #icon>
      <svg-icon :svg-class="item1.icon" :width="16" />
    </template>
    <template #expand-icon-right>
      <svg-icon svg-class="caret-right" :width="12" />
    </template>
    <template #expand-icon-down>
      <svg-icon svg-class="caret-right" :width="12" />
    </template>
    <template #title> {{ $t(item1?.key, item1?.name) }}</template>

    <gj-sub-menu v-for="item2 in item1.children" :key="item2?.key">
      <template #icon></template>
      <template #expand-icon-right>
        <svg-icon svg-class="caret-right" :width="12" />
      </template>
      <template #expand-icon-down>
        <svg-icon svg-class="caret-right" :width="12" />
      </template>
      <template #title> {{ $t(item2?.key, item2?.name) }}</template>
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
            <transition :name="item3.collection ? 'zoom' : ''" mode="out-in">
              <svg-icon
                v-if="item3.collection"
                svg-class="favorites"
                :width="16"
              />
              <svg-icon v-else svg-class="disfavor" :width="16" />
            </transition>
          </span>
        </template>
        <router-link
          class="link"
          :to="item3?.route || ''"
        >
          <span :title="$t(item3.key, item3.name)">{{ $t(item3.key, item3.name) }}</span>
        </router-link>
      </gj-menu-item>
    </gj-sub-menu>
  </gj-sub-menu>
</template>

<script>
import { defineComponent, inject, computed } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import {useStore} from "vuex";

export default defineComponent({
  name: 'SubMenuItem',
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
    const { updateFavstatus } = inject('injectMenuScope')
    const $store = useStore()

    return {
      updateFavstatus
    }
  },
})
</script>
