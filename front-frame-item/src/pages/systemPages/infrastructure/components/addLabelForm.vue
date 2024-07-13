<template>
  <gj-form
    ref="from"
    :model="createFrom"
    :rules="rules"
    :label-align="'right'"
    :auto-label-width="true"
  >
    <gj-form-item
      label="标签编码"
      field="labelCode"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-input
        v-model="createFrom.labelCode"
        placeholder="请输入"
        show-word-limit
        :max-length="100"
        :disabled="fromType === 1"
      ></gj-input>
    </gj-form-item>

    <gj-form-item
      label="标签分类"
      field="labelType"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-select
        v-model="createFrom.labelType"
        placeholder="请选择"
        :disabled="fromType === 1"
      >
        <gj-option
          v-for="item in labelTypeList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </gj-option>
      </gj-select>
    </gj-form-item>

    <gj-form-item
      label="标签名称"
      field="title"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-input
        v-model="createFrom.title"
        placeholder="请输入"
        show-word-limit
        :max-length="200"
      ></gj-input>
    </gj-form-item>

    <gj-form-item
      label="描述"
      class="describeContent"
      field="describeContent"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-textarea
        v-model="createFrom.describeContent"
        placeholder="请输入"
        :auto-size="true"
        show-word-limit
        :max-length="1000"
      />
    </gj-form-item>
  </gj-form>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  watchEffect,
} from "vue";
import { setForm } from "@/utils/fnBusiness";
import { reg } from "@/utils/reg.js";
import { labelTypeList } from "../config/basicData";
export default defineComponent({
  props: {
    fromType: {
      type: Number,
      default: () => {
        return 2;
      },
    },
    // 编辑数据
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    // 表单验证部分
    const checkLabelCode = (value, callback) => {
      if (!value) {
        callback();
      } else if (
        !reg.shopNameReg.test(value.trim()) ||
        reg.emoji.test(value.trim()) ||
        reg.html.test(value.trim())
      ) {
        callback("标签编码格式错误，且长度在100字以内");
      } else {
        callback();
      }
    };

    const checkTitle = (value, callback) => {
      if (!value) {
        callback();
      } else if (
        !reg.shopNameReg.test(value.trim()) ||
        reg.emoji.test(value.trim()) ||
        reg.html.test(value.trim())
      ) {
        callback("标签名称格式错误，且长度在200字以内");
      } else {
        callback();
      }
    };

    const checkRemark = (value, callback) => {
      if (!value) {
        callback();
      } else if (
        !reg.shopNameReg.test(value.trim()) ||
        reg.html.test(value.trim())
      ) {
        callback("描述为非特殊字符，长度在1000字以内");
      } else {
        callback();
      }
    };

    const { proxy } = getCurrentInstance();
    const key = "createFrom";

    const data = reactive({
      labelTypeList: labelTypeList, // 标签列表
      // 添加/ 编辑标签
      createFrom: {
        labelCode: "", // 标签code
        labelType: null, // 标签类型 // 1 订单标签 ; 2 图片标签
        title: "", // 标签名称
        describeContent: "", // 描述
      },
      rules: {
        labelCode: [
          {
            required: true,
            message: "标签编码必填",
          },
          {
            min: 1,
            max: 100,
            message: "标签编码在1-100个字符之间",
          },
          { validator: checkLabelCode },
        ],
        labelType: [
          {
            required: true,
            message: "请选择标签分类",
          },
        ],
        title: [
          {
            required: true,
            message: "标签名称必填",
          },
          {
            min: 1,
            max: 200,
            message: "标签名称在1-200个字符之间",
          },
          { validator: checkTitle },
        ],
        describeContent: [
          { required: false, message: "描述" },
          { validator: checkRemark },
        ],
      },
    });

    const submitForm = () => {
      return setForm(proxy, key, data[key], "from");
    };

    const resetForm = () => {
      proxy.$refs["from"].resetFields();
    };

    watchEffect(() => {
      // 新建
      if (props.fromType === 2) {
        data.createFrom.labelCode = "";
        data.createFrom.title = "";
        data.createFrom.labelType = null;
        data.createFrom.describeContent = "";
      } else {
        // 编辑
        const { labelCode, title, labelType, describeContent } = props.row;
        data.createFrom = {
          ...data.createFrom,
          labelCode,
          title,
          labelType,
          describeContent,
        };
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
