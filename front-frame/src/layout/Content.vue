<template>
  <div class="base_content">
    <slot></slot>
    <div class="ctx_content">
      <router-view v-slot="{ Component }">
        <keep-alive :max="7">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Content'
})
</script>
