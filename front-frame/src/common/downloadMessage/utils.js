import { GjNotification } from '@gj/atom'

/**
 * 创建(弹出)消息
 * @param {string} type success | info | warning | error
 */
export const createNotification = (type = 'info', configOrText) => {
  const types = ['success' , 'info' , 'warning', 'error'];
  if (types.includes(type)) {
   return GjNotification[type](configOrText)
  }
}

/**
 * 移除所有消息弹框
 */
export const clearNotification = () => {
  return GjNotification.clear()
}


export const removeNotification = (list = []) => {
  list.forEach(msg => {
    console.log('removeNotification ->', msg)
  })
}

export const closeNotification = (key = '', list) => {
  if (!key) {
    return list.forEach((item) => {
      const { node } = item;
      node.close && node.close();
    })
  }
  if (key instanceof Array) {
    list.forEach(item => {
      const { key: k, node } = item;
      key.includes(k) && node.close && node.close();
    })
  } else {
    const node = list.find(i => {
      return i.key === key
    })
    node && node.close && node.close();
  }
}