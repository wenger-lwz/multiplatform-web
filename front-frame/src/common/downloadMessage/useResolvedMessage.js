/**
 * 下载（excel导出）完成时的通知
 */
import { provide, inject, ref } from 'vue';

import MessageDAO from '@/service/message'
import http from '@/request/index.js';


export const INJECT_KEY = Symbol('DwonloadCenterResolvedMessage');
export const messageSet = ref([]);

export const useProvide = () => {
  /**
   * 下载完成消息
   */
  const resolvedMessage = new MessageDAO({
    name: 'resolvedMessage',
    // 轮询下载是否完成
    time: 1000 * 3,
    // 轮询的方法
    checkMesaage: () => {
      http.get(`/v2/download/reportDownload/downloadNotify`).then(({ data }) => {
        // 若请求获取到下载完成数据
        if (data && data.downloadVos && data.downloadVos.length > 0) {
          resolvedMessage.next(data.downloadVos);
        } else
        // 是否继续轮询
        if (!data || !data.download) {
          resolvedMessage.clearInterval();
          resolvedMessage.next(null)
        }
      });
    }
  })


  const start = () => {
    resolvedMessage.setInterval();
  }

  provide(INJECT_KEY, {
    start,
    message: resolvedMessage
  })
}

export const useInject = () => {
  return inject(INJECT_KEY)
}

