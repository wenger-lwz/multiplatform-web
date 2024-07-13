<template>
 <div class="right-content">
  <span class="new-announcement" @click="showAnnouncement">新功能</span>
  <!-- <span class="new">{{ $t('newFn') }}</span> -->
  <span class="download-icon" @click="toDownloadCenter">
    <svg-icon svg-class="download" :width="16" />
  </span>
  <span class="task-icon">
    <gj-task-center></gj-task-center>
  </span>
  <!-- 消息中心 -->
  <msg-center></msg-center>
  <span class="screen-full-icon" @click="toggleScreenfull">
    <svg-icon :svg-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" :width="12" />
  </span>
</div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import screenfull from 'screenfull'
import { useRouter } from 'vue-router'

import SvgIcon from '@/components/SvgIcon.vue'

import msgCenter from './msg-center.vue';
import GjTaskCenter from "./task-center";
import { useStore } from 'vuex'


export default defineComponent({
  name: 'NoticeBar',

  components: {
    GjTaskCenter,
    msgCenter,
    SvgIcon,

  },

  setup() {
    const isFullscreen = ref(false)
    const router = useRouter()
    const $store = useStore()
    
    // 展示更新公告弹窗
    const showAnnouncement = ()=>{
      $store.dispatch('showAnnouncement')
    }


    // 下载中心
    const toDownloadCenter = () => {
      router.push('/amz-web/reports/downloadCenter')
    }

    
    /**
     * 全屏，START
     */
    const toggleScreenfull = () => {
      if (!screenfull.enabled) {
        GjMessage.error({
          content: 'you browser can not work',
          closable: true
        })
        return false
      }
      screenfull.toggle()
    }

    const screenfullChange = () => {
      isFullscreen.value = screenfull.isFullscreen
    }

    function screenfullInit () {
      if (screenfull.enabled) {
        screenfull.on('change', screenfullChange)
      }
    }
    /**
     * 全屏，END
     */
    onMounted(() => {
      screenfullInit()

    })

    return {
      isFullscreen,
      toDownloadCenter,
      toggleScreenfull,
      showAnnouncement
    }
  }

})
</script>

<style lang="scss">
.right-content {
  display: flex;
  align-items: center;
  // padding-left: 12px;
}

.task-icon,
.notification-icon,
.download-icon,
.screen-full-icon {
  color: #babbc7;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: 8px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  &:active {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.6);
  }
}
.screen-full-icon {
  margin-right: 12px;
  &:active {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.6);
  }
}
.new-announcement{
  display: inline-block; 
  padding: 3px 4px;
  border-radius: 5px;
  background: #2DA641;
  color: #FFFFFF;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
}
</style>