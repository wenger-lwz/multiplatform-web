<!--
  消息中心下载提示模板
  如果有文件就下载，一次超过3个下载文件跳转下载中心。
-->
<template>
<div class="gj-message">
  <h3 class="gj-message-h3">{{t('download.isReady')}}</h3>
  <div style="margin-top: 12px;">
    {{t('download.choose1')}}<span v-if="list.length">{{t('download.choose2')}}</span>{{t('download.choose3')}}
    <span class="link" @click="toDownloadCenter">{{t('download.choose4')}}</span>
    {{t('download.choose5')}}
  </div>
  
  <!-- 超过三个直接去下载中心 -->
  <ul style="margin-top: 8px;" v-if="list.length < 4">
    <li class="filename" v-for="item in list" :key="item.id" style="margin-top: 4px;">
    <span class="link" @click="download(item)">
      {{item.fileName}}
    </span>
    </li>
  </ul>
</div>
</template>

<script>
import { defineComponent } from 'vue';
import { downloadFile } from '@/utils/index.js';
import http from '@/request/index.js';

export default defineComponent({
  name: 'ResolvedMessageTemplate',

  props: {
    /**
     * 使用 createVNode 创建的模板丢失了 app 上下文，所以从 props 传入
     */
    t: {
      type: Function,
    },
    toDownloadCenter: {
      type: Function,
    },
    list: {
      type: Array,
      default: () => []
    }
  },

  setup() {

    const download = (item) => {
      http({
        url: `/v2/download/reportDownload/batchDownload`,
        method: 'post',
        data: [item],
        responseType: 'blob',
        skipProcessData: true
      }).then(res => {
        downloadFile(res)
      })
    }

    return {
      download,
    }
  }
})
</script>

<style lang="scss">
.resolved-message {
  &-tooltip {

  }
}
</style>