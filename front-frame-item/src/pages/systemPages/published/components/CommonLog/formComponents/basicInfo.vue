<template>
  <gj-row :gutter="[24, 10]" class="rowMargin">
    <template v-for="item in formData?.info" :key="item.prop">
      <gj-col :span="item.colSpan" class="marginBotm">
        <gj-space direction="vertical" fill class="detailItemStyle">
          <div class="titleTxt">{{ item.label }}</div>
          <div class="contentTxt">{{ newDetailList[item.prop] }}</div>
          <div v-if="item.updated">
            <gj-space size="small">
              <span class="updatedTxt">更新前:</span>
              <span class="titleTxt">{{ oldDetailList[item.prop] }}</span>
            </gj-space>
          </div>
        </gj-space>
      </gj-col>
    </template>

    <gj-col :span="8">
      <slot name="formItem"></slot>
    </gj-col>
  </gj-row>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "basicInfo",
  components: {},
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    newDetailList: {
      type: Object,
      default: () => {
        return {};
      },
    },
    oldDetailList: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    const data = reactive({});
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
