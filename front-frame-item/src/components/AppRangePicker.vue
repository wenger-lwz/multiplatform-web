<template>
  <gj-range-picker
    v-bind="$attrs"
    v-model="pickerValue"
    :value-format="valueFormat"
    class="app-picker"
    :shortcuts-position="shortcutsPosition"
    :shortcuts="shortcutsTranslate"
    @change="change"
  />
</template>

<script>
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  watch,
} from "vue";
import dayjs from "dayjs";

import { TIME_TO_TOMORROW } from "@/utils/format";

export default defineComponent({
  props: {
    showShortCut: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    shortcuts: {
      type: Array,
      default: () => {
        return [
          {
            label: "lazada.today",
            value: () => [dayjs().startOf("date"), dayjs().startOf("date")],
          },
          {
            label: "lazada.yesterday",
            value: () => [
              dayjs().subtract(1, "day").startOf("date"),
              dayjs().subtract(1, "day").startOf("date"),
            ],
          },
          {
            label: "lazada.last7days",
            value: () => [
              dayjs().subtract(6, "day").startOf("date"),
              dayjs().startOf("date"),
            ],
          },
          {
            label: "lazada.nearly30days",
            value: () => [
              dayjs().subtract(29, "day").startOf("date"),
              dayjs().startOf("date"),
            ],
          },
          {
            label: "lazada.thisMonth",
            value: () => [
              dayjs().startOf("month").startOf("date"),
              dayjs().startOf("date"),
            ],
          },
          {
            label: "lazada.lastMonth",
            value: () => [
              dayjs().subtract(1, "month").startOf("month").startOf("date"),
              dayjs().subtract(1, "month").endOf("month").startOf("date"),
            ],
          },
          {
            label: "lazada.yearToDate",
            value: () => [
              dayjs().startOf("year").startOf("date"),
              dayjs().startOf("date"),
            ],
          },
        ];
      },
    },
    shortcutsPosition: {
      type: String,
      default: () => {
        return "bottom";
      },
    },
    modelValue: {
      type: [Array, undefined],
    },
    valueFormat: {
      type: String,
      default: () => {
        return "timestamp";
      },
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      valueFormat: props.valueFormat,
      pickerValue: props.modelValue,
    });
    const shortcutsTranslate = computed(() => {
      return props.shortcuts.map((item) => ({
        ...item,
        label: proxy.$t(item.label),
      }));
    });
    watch(
      () => props.modelValue,
      () => {
        data.pickerValue = props.modelValue;
      }
    );
    const change = (val) => {
      let value = val;
      if (value) {
        value[1] = val[1] + TIME_TO_TOMORROW;
      }
      emit("update:modelValue", val);
    };
    return {
      ...toRefs(data),
      dayjs,
      change,
      shortcutsTranslate,
    };
  },
});
</script>

<style lang="scss" scoped></style>
