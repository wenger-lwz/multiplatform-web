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
          <gj-radio :value="2" v-if="form.zoneVisible"
            >站点时区{{ zoneName }}</gj-radio
          >
        </gj-radio-group>
      </gj-form-item>
      <gj-form-item
        field="onlineTime"
        label="选择时间"
        :validate-trigger="validateTriggerOpt"
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
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  computed,
  ref,
  onBeforeMount,
} from "vue";
import { GjMessage } from "@gj/atom";
import { validateTriggerOpt } from "@common";
import { releaseTiming } from "@/api/published/lazada";
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
        onlineTime: "",
        timeZone: 2,
        zoneVisible: true,
      },
    });

    const timeRef = ref();
    const rules = reactive({
      timeZone: [{ required: true, message: "时区必填" }],
      onlineTime: [{ required: true, message: "时间必填" }],
    });

    const zoneName = computed(() => {
      let sameFlag = props.timeRow[0]?.siteCode;
      for (let i = 1; i < props.timeRow.length; i++) {
        if (props.timeRow[i].siteCode !== sameFlag) {
          return "";
        }
      }
      return `(${props.timeRow[0].siteName})`;
    });

    const handleOk = () => {
      // 校验必填数据
      timeRef.value.validate().then((res) => {
        if (!res) {
          const param = {
            enable: data.form.state,
            listingId: props.timeRow.map((item) => item.id),
            releaseTime: data.form.onlineTime,
            zone: data.form.timeZone === 1 ? false : true,
          };
          releaseTiming(param).then(() => {
            GjMessage.success("定时发布任务已提交，请稍后查看");
            emit("handleOk", data.form);
          });
          // .catch(() => {
          //   GjMessage.error("定时发布任务提交失败，请重试！");
          // });
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

    onBeforeMount(() => {
      // 跨境只显示北京时区
      const target = props.timeRow[0];
      if (props.timeRow.find((item) => item.siteCode === "cb")) {
        data.form.timeZone = 1;
        data.form.zoneVisible = false;
        data.form.onlineTime =
          props.timeRow.length > 1 ? "" : target?.publishTime || "";
      } else {
        if (props.timeRow.length > 1) {
          data.form.state = 1;
          data.form.timeZone = 2;
          data.form.onlineTime = "";
        } else {
          data.form.onlineTime = target?.publishTime || "";
          data.form.state =
            target?.publishMode === "2" && target?.enableTime === false ? 0 : 1;
          data.form.timeZone =
            target?.publishMode === "2" && target?.publishZone === false
              ? 1
              : 2;
        }
      }
    });

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
