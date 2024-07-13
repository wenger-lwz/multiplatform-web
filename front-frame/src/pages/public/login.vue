<template>
  <gj-row class="mainapp-login">
    <div class="gj-logo">
      <img src="@/assets/images/gj-logo.png" />
    </div>
    <div class="login-container">
      <div class="login-mascot login-mascot-0" :hidden="focusPassword"></div>
      <div class="login-mascot login-mascot-1" :hidden="!focusPassword"></div>
      <div class="login-form">
        <div class="login-title">欢迎登录 积加ERP</div>
        <gj-form ref="formRef" :model="form" @submit="handleSubmit">
          <gj-form-item
            field="username"
            hide-asterisk
            :rules="[{ required: true, message: '请输入用户名' }]"
            :validate-trigger="['change', 'input']"
          >
            <gj-input
              v-model="form.username"
              placeholder="用户名"
              class="login-input"
            >
              <template #prefix>
                <icon-user />
              </template>
            </gj-input>
          </gj-form-item>
          <gj-form-item
            field="password"
            hide-asterisk
            :rules="[{ required: true, message: $t('pleasePwd') }]"
            :validate-trigger="['change', 'input']"
            class="input-password"
          >
            <span class="arco-input-prefix">
              <icon-lock />
            </span>
            <gj-input-password
              v-model="form.password"
              :placeholder="$t('pleasePwd')"
              class="login-input"
              @focus="focusPassword = true"
              @blur="focusPassword = false"
            >
            </gj-input-password>
          </gj-form-item>
          <gj-form-item
            field="sevenDaysNoPassword"
            hide-asterisk
            class="seven-no-paddword"
          >
            <gj-checkbox
              :value="form.sevenDaysNoPassword"
              v-model="form.sevenDaysNoPassword"
              >{{ $t('isD7Nos') }}</gj-checkbox
            >
          </gj-form-item>
          <div class="form-item-submit">
            <gj-button
              html-type="submit"
              type="primary"
              :loading="loginLoading"
              class="login-btn"
              >登录</gj-button
            >
          </div>
          <!--锁定账号提示信息-->
          <div class="lock_user_info">
            当前账号已被锁定，请稍后再试！或联系管理员协助处理。
          </div>
        </gj-form>
      </div>
      <div class="login-duty"></div>
    </div>
    <footer class="login-fotter">
      Copyright©️ 2022 深圳市积加跨境网络科技有限公司. All rights reserved.
      粤ICP备2021055125号
    </footer>
  </gj-row>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login, getMenuList, getUserAttr } from '@/api/public'
import { useStore } from 'vuex'
import { GjMessage } from '@gj/atom'
import { getUrlParams } from '@/utils/common'
import { menuList } from '@/config/menuConfig'

export default defineComponent({
  setup() {
    const router = useRouter()
    const $store = useStore()
    const form = ref({
      username: '',
      password: '',
      sevenDaysNoPassword: true,
    })
    const formRef = ref(null)
    const loginLoading = ref(false)
    const handleSubmit = async ({ values, errors }) => {
      if (!errors) {
        const fd = new FormData()
        fd.append('username', form.value.username)
        fd.append('password', form.value.password)
        fd.append('sevenDaysNoPassword', form.value.sevenDaysNoPassword)
        loginLoading.value = true
        const loginInfo = await login(fd).finally(
          () => (loginLoading.value = false)
        )
        if (loginInfo?.data && loginInfo?.code === 0) {
          GjMessage.success('登录成功')
          // 存储用户信息在store1
          const userInfo = {
            name: '',
            token: loginInfo.data,
            timeDown: form.value.sevenDaysNoPassword
              ? new Date().getTime()
              : -1,
          }
          $store.dispatch('USER_INFO', JSON.stringify(userInfo))

          // 获取用户信息
          const user = await getUserAttr()
          if (user?.code === 0 && user?.data) {
            userInfo.name = user.data.name
          }
          $store.dispatch('USER_INFO', JSON.stringify(userInfo))
          const menuInfo = await getMenuList()
          if (menuInfo?.code === 0) {
            $store.dispatch('setSidebarMenu', menuInfo.data.concat(menuList))
          }
          router.push({
            path: '/amz-web/index',
          })
        }
      }
    }

    // 是否聚焦密码輸入框
    const focusPassword = ref(false)

    // 以下用于调试
    /*
     * 内部调试
     */
    onMounted(async () => {
      const params = getUrlParams()
      if (params['manager-token']) {
        const userInfo = {
          token: params['manager-token'],
          name: '你好',
        }
        $store.dispatch('USER_INFO', JSON.stringify(userInfo))
        const user = await getUserAttr()
        if (user?.code === 0 && user?.data) {
          userInfo.name = user.data.name
        }
        $store.dispatch('USER_INFO', JSON.stringify(userInfo))
        const menuInfo = await getMenuList()
        if (menuInfo?.code === 0) {
          $store.dispatch('setSidebarMenu', menuInfo.data)
          router.push({
            path: '/amz-web/index',
          })
        } else {
          $store.commit('CLEAR_LOGIN')
          $store.dispatch('USER_INFO', JSON.stringify({}))
          GjMessage.error(menuInfo?.msg || '未获取到菜单信息')
        }
      }
    })

    return {
      form,
      formRef,
      handleSubmit,
      loginLoading,
      focusPassword,
    }
  },
})
</script>

<style lang="scss" scoped>
.mainapp-login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('./images/background.jpeg');
  background-size: 100%;

  .gj-logo {
    position: absolute;
    top: 40px;
    left: 80px;
    > img {
      width: 160px;
    }
  }

  .login-mascot-0,
  .login-mascot-1,
  .login-duty {
    background-size: cover;
  }

  .login-container {
    position: relative;
    display: flex;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 12px 20px rgb(66 84 118 / 16%);
  }

  .login-form {
    height: 100%;
    position: relative;
    box-sizing: border-box;
  }

  .login-duty {
    height: 100%;
  }

  .input-password {
    margin-bottom: 4px;
  }

  .input-password.arco-form-item-error {
    margin-bottom: 0;
  }

  .login-title {
    margin-bottom: 40px;
    font-size: 24px;
    font-weight: bold;
    line-height: 32px;
    color: #1d2129;
  }

  .login-input,
  .login-btn {
    height: 40px;
    width: 310px;
  }

  .form-item-submit {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 60px;
  }

  .seven-no-paddword {
    margin-bottom: 60px;
    margin-left: -5px;
  }

  .arco-input-wrapper {
    background-color: #fff;
    border: 1px solid #dadde2;
    border-radius: 4px;
  }

  .login-fotter {
    position: fixed;
    bottom: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #999;
  }
}

@media (max-width: 1366px) {
  .mainapp-login {
    .gj-logo {
      top: 25px;
      left: 40px;

      img {
        width: 155px;
      }
    }
    .login-container {
      height: 456px;
    }
    .login-mascot {
      position: absolute;
      height: 70px;
      top: -70px;
      left: 120px;
    }
    .login-mascot-0 {
      width: 264px;
      background-image: url('./images/1366/mascot_0.png');
    }
    .login-mascot-1 {
      width: 264px;
      background-image: url('./images/1366/mascot_1.png');
    }
    .login-form {
      padding: 80px 60px 0 60px;
    }
    .login-duty {
      width: 400px;
      background-image: url('./images/1366/duty.png');
    }
    .form-item-submit {
      bottom: 72px;
    }
  }
}

@media (min-width: 1367px) and (max-width: 1660px) {
  .mainapp-login {
    .login-container {
      height: 514px;
    }
    .login-mascot {
      position: absolute;
      height: 80px;
      top: -80px;
      left: 120px;
    }
    .login-mascot-0 {
      width: 285px;
      background-image: url('./images/1660/mascot_0.png');
    }
    .login-mascot-1 {
      width: 285px;
      background-image: url('./images/1660/mascot_1.png');
    }
    .login-form {
      padding: 90px 70px 0 70px;
    }
    .login-duty {
      width: 450px;
      background-image: url('./images/1660/duty.png');
    }
    .form-item-submit {
      bottom: 110px;
    }
  }
}

@media (min-width: 1661px) {
  .mainapp-login {
    .login-container {
      height: 570px;
    }
    .login-mascot {
      position: absolute;
      height: 90px;
      top: -90px;
      left: 120px;
    }
    .login-mascot-0 {
      width: 305px;
      background-image: url('./images/1920/mascot_0.png');
    }
    .login-mascot-1 {
      width: 305px;
      background-image: url('./images/1920/mascot_1.png');
    }
    .login-form {
      padding: 100px 80px 0 80px;
    }
    .login-duty {
      width: 500px;
      background-image: url('./images/1920/duty.png');
    }
    .form-item-submit {
      bottom: 146px;
    }
  }
}

.arco-form-item-status-error {
  .arco-input-wrapper:not(.arco-input-disabled),
  .arco-input-wrapper:not(.arco-input-disabled):hover {
    background: #fff;
    border: 1px solid #f53f3f;
  }
}

.arco-input-wrapper:hover {
  background-color: #fff;
  border-color: #86909c;
}

.arco-input-wrapper:focus-within,
.arco-input-wrapper.arco-input-focus {
  background-color: var(--color-bg-2);
  border-color: rgb(var(--primary-6));
  box-shadow: 0 0 0 0 var(--color-primary-light-2);
}

:deep(.arco-input-suffix) {
  font-size: 16px;
}

:deep(.arco-form-item-content-flex) {
  position: relative;
}

:deep(.arco-input-prefix) {
  position: absolute;
  left: 0;
  z-index: 5;
}

:deep(.arco-form-item-label-col) {
  display: none;
}

:deep(.arco-checkbox-label) {
  color: #999;
  font-size: 12px;
}

.arco-btn-primary {
  width: 250px;
  height: 40px;
  border-radius: 4px;
  font-size: 14px;
}

.lock_user_info {
  display: none;
  color: red;
  margin-top: 10px;
}
</style>

<style>
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
</style>
