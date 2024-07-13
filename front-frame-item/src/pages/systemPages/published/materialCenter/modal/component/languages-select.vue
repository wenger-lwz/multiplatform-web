<template>
  <gj-select
    v-model="selectValue"
    size="medium"
    placeholder="请选择"
    @change="change"
  >
    <gj-option
      v-for="item of languagesList"
      :key="item.value"
      :value="item.value"
      >{{ item.name }}</gj-option
    >
  </gj-select>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import { getLanguageList } from "@/api/published/materialCenter";

export default {
  props: {
    modelValue: {
      type: [Number, String],
      default: "",
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const data = reactive({
      languagesValue: "",
      languagesList: [],
    });

    const selectValue = computed({
      get: () => props.modelValue,
      set: (val) => emit("update:modelValue", val),
    });

    // 获取语种列表
    getLanguageList().then((res) => {
      data.languagesList = res.data;
    });

    const change = (val) => {
      emit("change", val);
    };

    return {
      ...toRefs(data),
      selectValue,
      change,
    };
  },
};
</script>

<style scoped lang="scss"></style>
