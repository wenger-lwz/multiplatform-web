<template>
  <gj-modal
    :mask-closable="false"
    unmount-on-close
    :render-to-body="false"
    :visible="timingVisible"
    title="定时发布"
    @ok="handleOk"
    @cancel="handleCancel"
    title-align="start"
  >
    <gj-form class="timing-form" ref="timeRef" :model="form" :rules="rules">
      <gj-form-item
        field="timeZone"
        label="选择时区"
        :validate-trigger="validateTriggerOpt"
        required
      >
        <gj-radio-group v-model="form.timeZone">
          <gj-radio :value="1">默认时区(北京)</gj-radio>
          <gj-radio :value="2">站点时区{{ zoneName }}</gj-radio>
        </gj-radio-group>
      </gj-form-item>
      <gj-form-item
        field="onlineTime"
        label="选择时间"
        :validate-trigger="validateTriggerOpt"
        format="x"
        required
      >
        <gj-date-picker
          showTime
          v-model="form.onlineTime"
          value-format="timestamp"
        />
      </gj-form-item>
      <gj-form-item field="state" label="是否启用">
        <gj-radio v-model="form.state" :value="1">是</gj-radio>
        <gj-radio v-model="form.state" :value="0">否</gj-radio>
      </gj-form-item>
    </gj-form>
  </gj-modal>
</template>
<script>
import { defineComponent, reactive, toRefs, watch, computed, ref } from "vue";
import { GjMessage } from "@gj/atom";
import { validateTriggerOpt } from "@common";
import { releaseDraft } from "@/api/published/shopee.js";
export default defineComponent({
  name: "TimeModal",
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    timeRow: {
      type: Array,
      default: () => {
        return [];
      },
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      timingVisible: props.visible,
      form: {
        state: 1,
        onlineTime:
          props.timeRow.length > 1 ? "" : props.timeRow[0]?.publishTime || "",
        timeZone: 1,
      },
    });

    const timeRef = ref();

    const rules = reactive({
      timeZone: [{ required: true, message: "时区必填" }],
      onlineTime: [{ required: true, message: "时间必填" }],
    });

    const zoneName = computed(() => {
      const siteCodeList = props.timeRow.map((it) => it.siteCode);
      let sameFlag = siteCodeList[0];
      for (let i = 1; i < siteCodeList.length; i++) {
        if (siteCodeList[i] !== sameFlag) {
          sameFlag = false;
          break;
        }
      }
      let result = "";
      if (sameFlag) {
        result = props.list.find(
          (it) => it.platformCode === sameFlag
        )?.platformName;
        result = result ? `(${result})` : "";
      }
      return result;
    });

    const handleOk = () => {
      // 校验必填数据
      timeRef.value.validate().then((res) => {
        if (!res) {
          //
          const param = {
            draftIds: props.timeRow.map((item) => item.id),
            onlineType: 2,
            onlineTime: data.form.onlineTime, //时间
            state: data.form.state, //是否启用
            timeType: data.form.timeZone === 1 ? "默认时区" : "站点时区",
          };
          releaseDraft(param).then((rsp) => {
            if (rsp.code === 200) {
              GjMessage.success("定时发布任务已提交，请稍后查看");
            }
            emit("handleOk", data.form);
          });
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
      validateTriggerOpt,
      timeRef,
      rules,
      zoneName,
      handleCancel,
      handleOk,
    };
  },
});
</script>
<style scoped lang="scss">
.timing-form {
  width: "600px";
}
</style>
