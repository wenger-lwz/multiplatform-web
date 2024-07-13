<template>
  <gj-modal
    :visible="visible"
    :mask-closable="false"
    unmount-on-close
    :ok-loading="okLoading"
    @cancel="close()"
    @ok="updatePassword()"
  >
    <template #title>修改密码</template>
    <gj-form ref="formRef" :model="form.model" :rules="form.rules" layout="vertical" >
      <gj-form-item
        field="oldPassword"
        label="旧密码"
        :hide-asterisk="false"
      >
        <gj-input v-model="form.model.oldPassword" type="password" />
      </gj-form-item>
      <gj-form-item
        field="newPassword"
        :hide-asterisk="false"
      >
        <template #label>
          <div class="pwd-title">
            <span>新密码</span>
            <gj-tooltip content="密码格式：必须同时包含字母、数字和特殊字符，且长度在8-20位字符之间，区分大小写；不能输入空格、逗号、分号">
              <svg-icon svg-class="question" :width="16" />
            </gj-tooltip>
          </div>
        </template>
        <gj-input v-model="form.model.newPassword" placeholder="输入8-20位字符，包含字母、数字、特殊符号" type="password" />
      </gj-form-item>
      <gj-form-item
        field="againNewPassword"
        label="再次输入新密码"
        :hide-asterisk="false"
      >
        <gj-input v-model="form.model.againNewPassword" type="password" />
      </gj-form-item>
    </gj-form>
  </gj-modal>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import { updateUserPassword } from '@/api/public'
import { GjMessage } from '@gj/atom'
import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  components: {
    SvgIcon
  },
  props: {
    visible: Boolean,
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const formRef = ref(null)
    const okLoading = ref(false)
    const form = reactive({
      model: {
        oldPassword: '',
        newPassword: '',
        againNewPassword: '',
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: '当前字段为必填项!',
          },
          {
            maxLength: 30,
            message: '字段长度不能超过30个字符',
          },
        ],
        newPassword: [
          {
            required: true,
            message: '当前字段为必填项!',
          },
          {
            match: /^(?=.*\d)(?=.*[A-Za-z])(?=.*[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e])(?!.*[,;])[\x21-\x7e]{8,20}$/,
            message: '格式错误！密码格式：必须同时包含字母、数字和特殊字符，且长度在8-20位字符之间，区分大小写；不能输入空格、逗号、分号'
          }
        ],
        againNewPassword: [
          {
            required: true,
            message: '当前字段为必填项!',
          },
          {
            match: /^(?=.*\d)(?=.*[A-Za-z])(?=.*[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e])(?!.*[,;])[\x21-\x7e]{8,20}$/,
            message: '格式错误！密码格式：必须同时包含字母、数字和特殊字符，且长度在8-20位字符之间，区分大小写；不能输入空格、逗号、分号',
          },
        ]
      }
    })
    const updatePassword = () => {
      if (form.model.newPassword !== form.model.againNewPassword) {
        GjMessage.error('两次输入的密码不一致！')
        return
      }
      formRef.value.validate((err) => {
        if (!err) {
          okLoading.value = true
          updateUserPassword(form.model)
            .then(() => {
              GjMessage.success('更新成功')
              close()
            })
            .finally(() => {
              okLoading.value = false
            })
        }
      });
    };
    const close = () => {
      emit('update:visible', false)
    }
    return {
      form,
      formRef,
      okLoading,
      close,
      updatePassword
    }
  },
})
</script>

<style lang="scss">
.pwd-title {
  display: inline-flex;
  align-items: center;
}
</style>
