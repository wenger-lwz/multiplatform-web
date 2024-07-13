<template>
<div class="gj-message">
  <h3 class="gj-message-h3">{{t('download.isPreparing')}}</h3>
  <div style="margin-top: 12px;">
    {{ t('download.downloadFile1') }}
    <span class="link" @click="toDownloadCenter">{{t('download.downloadFile2')}}</span>
    {{t('download.downloadFile3')}}
  </div>

</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'pendingMessageTemplate',
  props: {
    t: {
      type: Function
    },
    toDownloadCenter: {
      type: Function
    }
  },

  setup() {
    return {
      text: 'pendingMessage'
    }
  }
})
</script>