<template>
  <div>
    <gj-form
      ref="paymentPolicyForm"
      :model="paymentPolicyInfo"
      :rules="rules"
      layout="vertical"
      class="formStyle"
    >
      <gj-row :gutter="24">
        <gj-col v-for="item in formData" :key="item.prop" :span="24">
          <gj-form-item :label="`${item.label}`" :prop="item.prop">
            <template v-if="item.type === 'textarea'">
              <gj-textarea
                v-model.trim="paymentPolicyInfo[item.prop]"
                placeholder="请输入付款说明..."
                allow-clear
              />
            </template>
            <template v-if="item.type === 'checkbox'">
              <gj-space size="mini">
                <gj-switch
                  v-model="paymentPolicyInfo[item.prop]"
                  size="small"
                  :checked-value="checkedValue"
                  :unchecked-value="unCheckedValue"
                />
                <span>{{
                  paymentPolicyInfo[item.prop] ? "已开启" : "已关闭"
                }}</span>
              </gj-space>
            </template>
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import { editFormData } from "./index.js";
export default defineComponent({
  name: "paymentPolicy",
  components: {},
  props: {
    formData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const key = "paymentPolicyInfo";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      checkedValue: true,
      unCheckedValue: false,
      paymentPolicyInfo: {
        autoPay: false,
        payDescription: "",
      },
      formData: props.formData,
      rules: {},
    });
    // 保存数据
    const submitForm = () => {
      return setForm2(proxy, key, data[key], "paymentPolicyForm");
    };
    // 重置清空缓存
    const resetForm = () => {
      proxy.$refs["paymentPolicyForm"].resetFields();
    };

    onMounted(() => {
      // 编辑回显
      if (editFormData(data[key])) {
        data[key] = editFormData(data[key]);
      }
    });
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
    };
  },
});
</script>

<style lang="scss" scoped></style>
