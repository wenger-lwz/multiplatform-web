<script>
import { defineComponent, ref, createVNode  } from 'vue';
import { useRouter } from 'vue-router'


import Template1 from './pendingMessageTemplate.vue'
import Template2 from './resolvedMessageTemplate.vue';

import { useInject as pendingInject } from './usePendingMessage';
import { useInject as resolvedInject } from './useResolvedMessage';
import { closeNotification, createNotification } from './utils'
import { useI18n } from 'vue-i18n';


const pendingMessageSet = ref([]);
const resolvedMessageSet = ref([]);

export default defineComponent({
  name: 'DonloadMessage',
  setup() {
    const router = useRouter()

    const { t } = useI18n();
    const { message: pendingMessage } = pendingInject();
    const { message: resolvedMessage , start } = resolvedInject();

    const clearPendingMessage = () => {
      closeNotification('', pendingMessageSet.value);
      pendingMessageSet.value = [];
    }

    const clearResolvedMessage = () => {
      closeNotification('', resolvedMessageSet.value);
      resolvedMessageSet.value = [];
    }


    const toDownloadCenter = () => {
      router.push(`/amz-web/reports/downloadCenter?timeStamp=${new Date().getTime()}`)

      clearPendingMessage();
      clearResolvedMessage();
    }

    // 下载导出开始时（pendingInject().notify
    pendingMessage.subscribe((key = Date.now()) => {
      // 只出现一个等待中提示
      if (pendingMessageSet.value.length) return;
      // 1. 发送消息
      const vNode = createVNode(Template1, {
        t,
        toDownloadCenter
      });
 
      pendingMessageSet.value.push({
        key,
        node: createNotification('info', {
          content: vNode,
          duration: 0,
          closable: true,
        })
      });

      // 2. 开始轮询（是否完成
      start();
    })

    // 可下载导出时
    resolvedMessage.subscribe((list, staus) => {
      if (list === null) {
        clearPendingMessage()
        return
      }
      // 1. 发送消息
      const vNode = createVNode(Template2, {
        t,
        toDownloadCenter,
        list,
      });
     
      resolvedMessageSet.value.push({
        key: Date.now(),
        node: createNotification('success', {
          content: vNode,
          duration: 0,
          closable: true,
        })
      });


      // 2. 清空所有等待消息
      clearPendingMessage()

    })






    return {} // 无返回
  }
})
</script>