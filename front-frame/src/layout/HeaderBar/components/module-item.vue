<template>
<div class="header-bar__menu-item">
  <template v-if="data.length && data[0].typeStyle === 'menu'">
    <dl class="menu-item" v-for="moduleItem in data" :key="moduleItem.key">
      <dt class="menu-item-title">{{ $t(moduleItem.key, moduleItem.name) }}</dt>
      <dd class="menu-item-dd" v-for="leafItem in moduleItem.children" :key="leafItem.key">
        <span
          class="favorite-icon"
          :class="{ vs: leafItem.collection }"
          style="margin-right: 3px;"
          @click.stop="updateFavstatus(leafItem.key)"
        >
          <transition :name="leafItem.collection ? 'zoom' : '' " mode="out-in">
            <svg-icon v-if="leafItem.collection" svg-class="favorites" :width="14" style="font-size: 14px;" />
            <svg-icon v-else svg-class="disfavor" :width="14" style="font-size: 14px;" />
          </transition>
        </span>

        <router-link class="gj-menu-item-link" :to="leafItem.route || ''">
          <span :title="$t(leafItem.key, leafItem.name)">{{ $t(leafItem.key, leafItem.name) }}</span>
        </router-link>
      </dd>
    </dl>
  </template>
  <template v-else>
    <!-- 菜单只有一层 -->
    <dl class="menu-item">
      <dt class="menu-item-title">{{ title }}</dt>
      <dd class="menu-item-dd" v-for="moduleItem in data" :key="moduleItem.key">
        <span
          class="favorite-icon"
          :class="{ vs: moduleItem.collection }"
          style="margin-right: 3px;"
          @click.stop="updateFavstatus(moduleItem.key)"
        >
          <transition :name="moduleItem.collection ? 'zoom' : '' " mode="out-in">
            <svg-icon v-if="moduleItem.collection" svg-class="favorites" :width="14" style="font-size: 14px;" />
            <svg-icon v-else svg-class="disfavor" :width="14" style="font-size: 14px;" />
          </transition>
        </span>

        <router-link class="gj-menu-item-link" :to="moduleItem.route || ''">
          {{ $t(moduleItem.key, moduleItem.name) }}
        </router-link>
      </dd>
    </dl>
  </template>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

import { useInject} from '../../useMenu'


export default defineComponent({
  name: 'ModuleItem',
  components: {
    SvgIcon
  },
  props: {
    data: {
      type: Array,
      default:() => [],
    },
    title: {
      type: String,
      default: ''
    }
  },

  setup() {
    const { updateFavstatus } = useInject();

    return { updateFavstatus }
  }
})
</script>