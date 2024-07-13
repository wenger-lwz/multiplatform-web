<template>
  <gj-config-provider :locale="arcoLocale[$i18n.locale]">
    <router-view></router-view>

  </gj-config-provider>
</template>

<script>
import arcoLocale from './i18n/arcoLocale'
import {
  useMainAppProvide,
  useMainAppNotice,
} from '@gj/micro-frontend'
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { nameToMicroType } from './config/apps'
import { getCurrentApp } from './utils/common'
import { useStore } from 'vuex'
import { GjMessage } from '@gj/atom'
import { distoryLogin } from '@/utils/common'
import { useBuriedPoint } from "@/common/useBuriedPoint";

export default defineComponent({

  setup() {
    const $store = useStore()

    const data = reactive({
      arcoLocale,
    })

    useMainAppProvide({ nameToMicroType, getCurrentApp })

    useBuriedPoint();

    const { sendClick } = useMainAppNotice()

    // 沃尔玛401监听(暂定)
    const listeningPostMessage = () => {
      window.addEventListener('message', (e) => {
        if (e?.data?.data?.type === 'sendUnauthorized') {
          GjMessage.error('登录失效了，请重新登录')
          distoryLogin()
        }
      })
    }

    onMounted(() => {
      document.addEventListener('click', () => sendClick(''))
      // 查看7天登录是否过期
      const nowTime = new Date().getTime()
      const timeDown = $store.getters?.getUserInfo?.timeDown
      // 如果登录大于7天了，则销毁登录信息
      if (timeDown && timeDown !== -1) {
        if (timeDown + 7 * 24 * 60 * 60 * 1000 < nowTime) {
          GjMessage.error('登录失效了，请重新登录')
          distoryLogin()
        }
      }
      listeningPostMessage()
    })

    return {
      ...toRefs(data),
    }
  },
})
</script>
