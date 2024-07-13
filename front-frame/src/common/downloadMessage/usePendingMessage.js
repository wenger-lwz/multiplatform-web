/**
 * 下载（excel导出）开始时的通知
 */
import { provide, inject, ref, createVNode } from 'vue';

import MessageDAO from '@/service/message'
import { isNotBlank } from '@/utils/index';
import request from '@/request'


const INJECT_KEY = Symbol('downloadCenterPendingMessage');

export const messageSet = ref([]);

export const useProvide = () => {
  /**
   * 等待下载消息
   */
  const pendingMessage = new MessageDAO({
    name: 'pendingMessage',
    // 只提示一次，不需要轮询
  })

  /**
   * 消息通知
   * @param {string} url 
   */
  const notify =  async(payload = {
    url: '',
    key: Date.now()
  }) => {
    let { url, key } = payload;
    if (typeof payload === 'string') {
      url = payload;
      key = Date.now();
    }
    if (isNotBlank(url)) {
      console.log('isNotBlank', url)
      const { errorMsg } = await request({
        url: url,
        method: 'get'
      });
      if (errorMsg) return;
    }
    pendingMessage.next(key);
  }


  provide(INJECT_KEY, {
    notify, // 通知下载开始
    message: pendingMessage,
  })
}


export const useInject = () => {
  return inject(INJECT_KEY)
}