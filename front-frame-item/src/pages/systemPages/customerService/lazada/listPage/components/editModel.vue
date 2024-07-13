<template>
  <gj-form
    ref="from"
    :model="createFrom"
    :rules="rules"
    :label-align="'right'"
    :auto-label-width="true"
  >
    <gj-form-item label="买家评论">
      <gj-space :size="6">
        <gb-text>{{ row.content }}</gb-text>
        <span>{{ row.reviewDateTime }}</span>
      </gj-space>
    </gj-form-item>
    <gj-form-item
      label="卖家回评"
      field="content"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-textarea
        v-model="createFrom.content"
        placeholder="请输入"
        show-word-limit
        :max-length="200"
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
  onMounted,
} from "vue";
import { setForm } from "@/utils/fnBusiness";

export default defineComponent({
  components: {},
  props: {
    // 编辑数据
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
    rulesData: {
      type: String,
      default: () => {
        return "1";
      },
    },
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const key = "createFrom";

    const data = reactive({
      returnReason: [], // 标签列表
      // 创建/ 编辑标签
      createFrom: {
        content: null, //描述
      },
      rules: {
        content: [
          {
            required: true,
            message: "请完成必填项输入",
          },
        ],
      },
    });

    const submitForm = () => {
      return setForm(proxy, key, data[key], "from");
    };

    const resetForm = () => {
      proxy.$refs["from"].resetFields();
    };

    onMounted(() => {});

    watchEffect(() => {
      data.createFrom.content = null;
    });

    return {
      ...toRefs(data),
      submitForm,
      resetForm,
    };
  },
});
</script>

<style lang="scss" scoped>
.alertEvaluate {
  margin-bottom: 20px;
  .arco-rate {
    min-height: 14px;
    max-height: 14px;
  }
  :deep(.arco-rate) {
    font-size: 14px;
  }
  .buyerName {
    color: transparent;
  }
}
.imagesContent {
  display: flex;
  flex-direction: column;
  .imagesContent—wrapper {
    width: 100%;
    // display: flex;
    // flex-direction: column;
  }
}
</style>
