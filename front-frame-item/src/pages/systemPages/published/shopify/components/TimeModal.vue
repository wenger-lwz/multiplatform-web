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
        :label-col-props="{ span: 10 }"
        :wrapper-col-props="{ span: 12 }"
        field="publishTime"
        :label="computedTimeLabel"
        :validate-trigger="validateTriggerOpt"
        required
      >
        <gj-date-picker
          showTime
          v-model="form.publishTime"
          value-format="timestamp"
          style="width: 100%"
        />
      </gj-form-item>
      <gj-form-item
        field="enable"
        label="是否启用"
        :label-col-props="{ span: 10 }"
        :wrapper-col-props="{ span: 12 }"
      >
        <gj-radio v-model="form.enable" :value="1">是</gj-radio>
        <gj-radio v-model="form.enable" :value="0" style="margin-left: 20px"
          >否</gj-radio
        >
      </gj-form-item>
    </gj-form>
  </gj-modal>
</template>
<script>
import { defineComponent, reactive, toRefs, watch, ref, computed } from "vue";
import { validateTriggerOpt } from "@common";
import { getStoreProperties } from "@/api/published/shopify";
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
    shopId: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      timingVisible: props.visible,
      form: {
        timezone: "",
        enable: 1,
        publishTime:
          props.timeRow.length > 1 ? "" : props.timeRow[0]?.publishTime ?? "",
      },
    });

    const timeRef = ref();

    const rules = {
      publishTime: [
        {
          required: true,
          message: "时间必填",
        },
      ],
    };

    const computedTimeLabel = computed(() => {
      if (props.timeRow.length === 1) {
        return `选择时间(${data.form.timezone})`;
      }
      return "选择时间";
    });

    watch(
      () => props.visible,
      (newValue) => {
        data.timingVisible = newValue;
      }
    );

    const initTimezone = () => {
      if (props.timeRow.length === 1) {
        getStoreProperties({
          shopId: props.shopId,
        }).then((res) => {
          data.form.timezone = res.data?.iana_timezone;
        });
      }
    };

    initTimezone();

    const handleOk = () => {
      timeRef.value.validate().then((errors) => {
        if (!errors) {
          emit("handleOk", data.form);
        }
      });
    };

    const handleCancel = () => {
      emit("handleCancel");
    };

    return {
      ...toRefs(data),
      computedTimeLabel,
      validateTriggerOpt,
      timeRef,
      rules,
      handleCancel,
      handleOk,
    };
  },
});
</script>
