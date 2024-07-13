<template>
  <gj-modal
    v-model:visible="timingVisible"
    title="定时发布"
    title-align="start"
    :unmount-on-close="true"
    :maskClosable="false"
    :width="600"
    :onClose="handleCancel"
  >
    <gj-form :model="form" ref="timingForm" :rules="rules">
      <gj-form-item
        field="timeZone"
        label="选择时区"
        validate-trigger="input"
        required
      >
        <gj-radio v-model="form.timeZone" :value="1">默认时区(北京)</gj-radio>
      </gj-form-item>
      <gj-form-item
        field="onlineTime"
        label="选择时间"
        validate-trigger="input"
        format="x"
        required
      >
        <gj-date-picker showTime v-model="form.onlineTime" />
      </gj-form-item>
      <gj-form-item field="isRead" label="是否启用">
        <gj-radio v-model="form.state" :value="1">是</gj-radio>
        <gj-radio v-model="form.state" :value="2">否</gj-radio>
      </gj-form-item>
    </gj-form>

    <template #footer>
      <div class="dalogFromBtn">
        <gj-button type="outline" @click="handleCancel">取消</gj-button>
        <gj-button type="primary" @click="handleOk"> 确定</gj-button>
      </div>
    </template>
  </gj-modal>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
} from "vue";
export default defineComponent({
  name: "",
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      timingVisible: props.visible,
      form: {
        state: 1,
        onlineTime: "",
        timeZone: 1,
      },
      rules: {
        timeZone: [
          {
            required: true,
            message: "请选择时区",
            trigger: "change",
          },
        ],
        onlineTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
      },
    });

    const handleOk = () => {
      proxy.$refs["timingForm"].validate().then((res) => {
        if (!res) {
          emit("handleOk", data.form);
        }
      });
    };
    const handleCancel = () => {
      emit("handleCancel");
    };
    watch(
      () => props.visible,
      (newValue) => {
        data.timingVisible = newValue;
      }
    );
    return {
      ...toRefs(data),
      handleCancel,
      handleOk,
    };
  },
});
</script>
<style scoped lang="scss">
.dalogFromBtn {
  button {
    margin-left: 12px;
  }
}
</style>
