import { ref, watch } from 'vue'
import { getGlobalParameter } from '@/api/public'
import { getCurrentUser } from '@/api/user'
import {useMainAppNotice, useMainBuriedPoint} from "@gj/micro-frontend";

export const useUserRole = () => {
  const userId = ref(null)
  const showListingRole = ref(false)
  const { login, setUserInfo } = useMainBuriedPoint();
  const { sendUserInfo } = useMainAppNotice()
  // 获取当前用户信息
  getCurrentUser()
    .then(data => {
      userId.value = data.id
      login(data);
      setUserInfo(data);
      sendUserInfo(data);
    })
  // 获取是否显示listing权限
  watch(userId, (id) => {
    getGlobalParameter('LISTING_PERMISSION_SWITCH')
      .then(data => {
        showListingRole.value = (data.content === '1' || userId.value === 1)
      })
  })

  return {
    userId,
    showListingRole
  }
}
