<template>
  <gj-form
    ref="from"
    :model="createFrom"
    :rules="rules"
    :label-align="'right'"
    :auto-label-width="true"
  >
    <gj-form-item
      label="模板名称"
      field="name"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-input
        v-model="createFrom.name"
        placeholder="请输入"
        show-word-limit
        :max-length="100"
      ></gj-input>
    </gj-form-item>

    <!-- <gj-form-item
      label="常用语名称/主题"
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
    </gj-form-item> -->

    <gj-form-item
      label="常用语名称/主题"
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
      label="常用语"
      field="content"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-textarea
        ref="describeContentRef"
        v-model="createFrom.content"
        placeholder="请输入内容，需要自动匹配平台/用户名，可选择下方对应的占位符"
        :auto-size="textareaSize"
        show-word-limit
        :max-length="1000"
      />
    </gj-form-item>
    <gj-form-item class="textareaSizeBtn">
      <gj-space size="medium">
        <span>占位符</span>
        <gj-button type="plain" @click="addUserName($event)"
          >[[用户名称]]</gj-button
        >
        <gj-button type="plain" @click="addUserName($event)"
          >[[平台名称]]</gj-button
        >
      </gj-space>
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
  ref,
  nextTick,
} from "vue";
import { setForm } from "@/utils/fnBusiness";
import { reg } from "@/utils/reg.js";
import { platformList } from "../config/commonWordsPage.js";
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
    const describeContentRef = ref(null);
    // 表单验证部分
    const checkLabelCode = (value, callback) => {
      if (!value) {
        callback();
      } else if (
        !reg.shopNameReg.test(value.trim()) ||
        reg.emoji.test(value.trim()) ||
        reg.html.test(value.trim())
      ) {
        callback("模板名称格式错误，且长度在100字以内");
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
        callback("常用语名称/主题格式错误，且长度在200字以内");
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
      labelTypeList: platformList, // 标签列表
      // 创建/ 编辑标签
      createFrom: {
        name: "", // 标签code
        labelType: null, // 标签类型 // 1 订单标签 ; 2 图片标签
        title: "", // 标签名称
        content: "", // 描述
      },
      rules: {
        name: [
          {
            required: true,
            message: "请完成必填项输入",
          },
          {
            min: 1,
            max: 100,
            message: "模板名称在1-100个字符之间",
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
            message: "请完成必填项输入",
          },
          {
            min: 1,
            max: 200,
            message: "常用语名称/主题在1-200个字符之间",
          },
          { validator: checkTitle },
        ],
        content: [
          { required: true, message: "请完成必填项输入" },
          { validator: checkRemark },
        ],
      },
      textareaSize: { minRows: 2, maxRows: 5 },
    });

    const submitForm = () => {
      return setForm(proxy, key, data[key], "from");
    };

    const resetForm = () => {
      proxy.$refs["from"].resetFields();
    };
    const addUserName = (val) => {
      if (val?.target) {
        describeContentRef.value.textareaRef.focus();
        let innerText = val?.target?.innerText;
        let start = describeContentRef.value.textareaRef.selectionStart;
        let end = describeContentRef.value.textareaRef.selectionEnd;
        data.createFrom.content += innerText;
        nextTick(() => {
          describeContentRef.value.textareaRef.selectionStart =
            start + data.createFrom.content.length;
          describeContentRef.value.textareaRef.selectionEnd =
            end + data.createFrom.content.length;
        });
      }
    };

    watchEffect(() => {
      // 新建
      if (props.fromType === 2) {
        data.createFrom.name = "";
        data.createFrom.title = "";
        data.createFrom.content = "";
      } else {
        // 编辑
        const { name, title, labelType, content } = props.row;
        data.createFrom = {
          ...data.createFrom,
          name,
          title,
          labelType,
          content,
        };
      }
    });

    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      addUserName,
      describeContentRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.describeContent {
  :deep(.arco-form-item-wrapper-col) {
    min-height: 60px;
  }
}
:deep(.arco-form-item-message) {
  width: 100%;
  text-align: right;
}
</style>
