<template>
  <gj-modal 
    v-bind="$attrs" 
    width="auto"
    unmount-on-close
    :mask-closable="false"
    :footer="false"
  >
    <template #title>个人中心</template>
    <gj-spin :loading="loading" class="content-container">
      <gj-space direction="vertical" :size="24" fill>
        <gj-row class="user-info">
          <gj-col :span="12">
            <gj-row>
              <gj-col :span="6" class="label">用户名：</gj-col>
              <gj-col :span="6">{{ userInfo.loginname }}</gj-col>
            </gj-row>
          </gj-col>
          <gj-col :span="12">
            <gj-row>
              <gj-col :span="6" class="label">电话：</gj-col>
              <gj-col :span="6">
                <gj-input 
                  v-model="userInfo.phone" 
                  class="user-info-editor"
                  @blur="updateUserInfo()" 
                />
              </gj-col>
            </gj-row>
          </gj-col>
        </gj-row>
        <gj-row class="user-info">
          <gj-col :span="12">
            <gj-row>
              <gj-col :span="6" class="label">姓名：</gj-col>
              <gj-col :span="6">{{ userInfo.name }}</gj-col>
            </gj-row>
          </gj-col>
          <gj-col :span="12">
            <gj-row>
              <gj-col :span="6" class="label">默认站点：</gj-col>
              <gj-col :span="6">
                <gj-tree-select
                  v-model="userInfo.defaultMarket"
                  :data="marketTree"
                  class="user-info-editor"
                  @change="updateUserInfo()"
                ></gj-tree-select>
              </gj-col>
            </gj-row>
          </gj-col>
        </gj-row>
        <gj-row>
          <span style="margin-left: 16px;">安全性高的密码可以使账号更安全，建议您定期更换：</span>
          <gj-link :hoverable="false" @click="updatePassword()">修改密码</gj-link>
        </gj-row>
      </gj-space>
    </gj-spin>
  </gj-modal>
  <update-password v-model:visible="visible.updatePassword" v-if="visible.updatePassword"></update-password>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import UpdatePassword from './update-password.vue'
import { getUserInfo, updateUserInfo as updateUserInfoApi, getMarketTree } from '@/api/public'
import { GjMessage } from '@gj/atom'

export default defineComponent({
  components: {
    UpdatePassword,
  },
  setup() {
    // 获取用户信息
    const userInfo = ref({});
    const loading = ref(true);
    getUserInfo()
      .then(data => {
        userInfo.value = data;
      })
      .finally(() => {
        loading.value = false;
      });
    // 更新用户信息
    const updateUserInfo = () => {
      updateUserInfoApi(userInfo.value).then(() => {
        GjMessage.success('更新成功')
      })
    }
    // 获取店铺站点
    const marketTree = ref([]);
    getMarketTree().then(data => {
      marketTree.value = data;
    });

    // 修改密码
    const visible = reactive({
      updatePassword: false,
    });
    const updatePassword = () => {
      visible.updatePassword = true;
    };

    return {
      loading,
      userInfo,
      updatePassword,
      visible,
      updateUserInfo,
      marketTree,
    }
  },
})
</script>

<style lang="scss">
.content-container {
  width: 590px;
  .user-info {
    line-height: 32px;
    .label {
      text-align: right;
    }
    .user-info-editor {
      width: 190px;
    }
  }
}
</style>