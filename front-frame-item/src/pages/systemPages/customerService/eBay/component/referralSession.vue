<template>
  <gj-form
    ref="formRef"
    :label-col-props="{ span: 4 }"
    :model="form"
    @submit="handleSubmit"
  >
    <gj-form-item field="sessionId" label="会话">
      <p>{{ selectedValue.sessionName }}</p>
    </gj-form-item>
    <gj-form-item
      field="sessionReceiverId"
      label="转交客服"
      :rules="[{ required: true, message: '请选择转交客服' }]"
    >
      <SelectDirector
        placeholder="负责人"
        v-model="form.sessionReceiverId"
        @change="selectDirectorOk"
      />
      <!-- <gj-select v-model="form.sessionReceiverId" placeholder="请选择">
        <gj-option>Beijing</gj-option>
      </gj-select> -->
    </gj-form-item>
    <gj-form-item field="remark" label="备注">
      <gj-input v-model="form.remark" placeholder="请输入" />
    </gj-form-item>
    <gj-form-item row-class="form-footer">
      <div class="form-footer-content">
        <gj-button type="plain" @click="cancel">取消</gj-button>
        <gj-button
          :loading="loading === 'handleSubmit'"
          type="primary"
          html-type="submit"
          >确认</gj-button
        >
      </div>
    </gj-form-item>
  </gj-form>
</template>

<script>
import { reactive, toRefs } from "vue";
import { updateSessionReceiver } from "@/api/customerService/eBay-zh";
import SelectDirector from "@/components/SelectDirector.vue";

export default {
  components: {
    SelectDirector,
  },
  props: {
    selectedValue: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["ok"],
  setup(props, { emit }) {
    const data = reactive({
      loading: false,
      form: {
        shopId: props.selectedValue?.erpShopId,
        sessionId: props.selectedValue?.sessionId,
        sessionReceiverId: "",
        sessionReceiverName: "",
        remark: "",
      },
    });

    const cancel = () => {};
    const selectDirectorOk = (val) => {
      data.form.sessionReceiverName = val.label;
    };
    const handleSubmit = (val) => {
      if (!val.errors && data.loading !== "handleSubmit") {
        data.loading = "handleSubmit";
        updateSessionReceiver(data.form).then(() => {
          emit("ok");
          data.loading = false;
        });
      }
    };

    return {
      ...toRefs(data),
      cancel,
      selectDirectorOk,
      handleSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.form-footer-content {
  width: 100%;
  text-align: right;
  .arco-btn {
    margin-left: 10px;
  }
}
</style>
