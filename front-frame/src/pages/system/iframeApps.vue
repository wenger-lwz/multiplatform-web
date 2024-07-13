<!--所有平台进入这个文件 通过控制iframe的DIV影藏和显示来控制页面的切换效果-->
<template>
  <div class="apps_content">
    <div
      class="iframe_content"
      v-for="item in appListArray"
      :key="item.name"
      :class="
        currentAppName === item.name
          ? 'currentAppName'
          : 'add_hideOtherplatform'
      "
    >
      <iframe
        frameborder="0"
        :id="item.name"
        :src="
          item.url +
          '?token=' +
          userInfo?.token +
          '&language=' +
          language
        "
        v-if="hasAppList[item.name]"
        allow="clipboard-read; clipboard-write"
        @load="loadIframe()"
      ></iframe>
    </div>

    <div class="error_apps apps_404" v-if="is404">
      <page404></page404>
    </div>
    <message-warn></message-warn>
    <gj-modal width="1020px" v-model:visible="visible" @ok="readAnnouncement" @cancel="readAnnouncement" :footer="false" :header="false">
      <template #title></template>
      <UpdateAnnouncement :announcementDetail="announcementDetail" v-if="visible" @handleCancel="readAnnouncement"></UpdateAnnouncement>
    </gj-modal>
  </div>
</template>

<script>
import { defineComponent, toRefs,computed } from 'vue'
import { useMicroAppRoute } from '@/common/useMicroAppRoute'
import { useMicroAppListener } from '@/common/useMicroAppListener'
import page404 from './404';
import UpdateAnnouncement from '@/components/UpdateAnnouncement';
import { getVersionAnnouncement, markAnnouncement } from '@/api/system'
import MessageWarn from '@/common/message-warn/index'
import {noticeVersion} from '@/config/apps.js'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'iframeApps',
  components: {
    page404,
    UpdateAnnouncement,
    MessageWarn
  },
  setup() {
    const $store = useStore()
    const { data } = useMicroAppRoute()
    
    useMicroAppListener()

    // iframe 加载完毕
    const loadIframe = () => {
      data.isOverLoading = true
    }

    // 更新公告 --- 开始 ----
    const visible = computed(() => {
      return $store.getters.isAnnouncementVisible
    })

    const announcementDetail = computed(() => {
      return $store.getters.announcementDetail
    })

    const readAnnouncement = () => {      
      return $store.dispatch('readAnnouncement')
    }

    $store.dispatch('getAnnouncement')

    return {
      ...toRefs(data),
      loadIframe,
      announcementDetail,
      visible,
      readAnnouncement
    }
  },
})
</script>

<style scoped lang="scss">
.apps_content {
  width: 100%;
  height: 100%;
  position: relative;
  .iframe_content {
    width: 100%;
    height: 100%;
    // border: solid 1px red;
    position: absolute;
    iframe {
      width: 100%;
      height: 100%;
    }
  }
}
// 隐藏非当前平台的 iframe
.add_hideOtherplatform {
  top: -120%;
}

.error_apps {
  width: 100%;
  height: 100%;
}
</style>
