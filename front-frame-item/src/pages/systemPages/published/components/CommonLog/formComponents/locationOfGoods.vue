<template>
  <gj-row :gutter="[24, 10]" class="rowMargin">
    <template v-for="item in formData?.info" :key="item.prop">
      <gj-col :span="item.colSpan" class="marginBotm">
        <gj-space direction="vertical" fill class="detailItemStyle">
          <div class="titleTxt">{{ item.label }}</div>
          <div class="contentTxt" v-if="newDetailList[item.prop]">
            {{ newDetailList[item.prop] }}
          </div>
          <div class="contentTxt" v-else>暂无更新数据</div>
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
  name: "locationOfGoods",
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
