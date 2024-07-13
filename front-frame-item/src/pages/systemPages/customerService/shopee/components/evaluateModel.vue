<template>
  <gj-form
    ref="from"
    :model="createFrom"
    :rules="rules"
    :label-align="'right'"
    :auto-label-width="true"
  >
    <gj-alert type="warning" :show-icon="false" class="alertEvaluate">
      <gj-comment align="right">
        <template #avatar> <img src="" alt="" /> </template>
        <template #author>
          <gj-space :size="12">
            <span>{{ row?.buyerName }}</span>
            <gj-rate
              :default-value="row?.ratingStar"
              allow-half
              class="arco-rate"
            />
          </gj-space>
        </template>
        <template #datetime> {{ row?.evaluationCreateTime }} </template>
        <template #content>
          <gj-space :size="12">
            <span class="buyerName">{{ row?.buyerName }}</span>
            <span>{{ row?.comment }}</span>
          </gj-space>
        </template>
      </gj-comment>
    </gj-alert>

    <gj-form-item
      label="描述"
      field="comment"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-textarea
        v-model="createFrom.comment"
        placeholder="请输入"
        show-word-limit
        :max-length="500"
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
    rulesData: {
      type: String,
      default: () => {
        return "1";
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const key = "createFrom";

    const data = reactive({
      returnReason: [], // 标签列表
      // 创建/ 编辑标签
      createFrom: {
        comment: null, //描述
      },
      rules: {
        comment: [
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
      // 新建
      if (props.fromType === 2) {
        data.createFrom.comment = null;
      } else {
        // 回复
        data.createFrom.comment = null;
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
:deep(.arco-alert-warning).alertEvaluate {
  background: #f2f3f5;
}
</style>
