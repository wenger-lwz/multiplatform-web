<template>
  <gj-row class="rowHeightStyle">
    <gj-space>
      <gj-button-group size="samll">
        <gj-button type="text" class="viewBtnLeft">
          <SvgIcon svgClass="eye" :width="16"> </SvgIcon>
          <span class="viewTxt"> 视图 </span>
        </gj-button>
        <gj-button type="text" class="viewBtnRight">
          <template #icon>
            <span class="invisibleLine"></span>
            <SvgIcon svgClass="selectDown" :width="16"> </SvgIcon>
          </template>
        </gj-button>
      </gj-button-group>
      <gj-tag
        class="gjTag"
        v-for="(item, index) in activatList"
        :key="item.value"
      >
        <gj-space size="small">
          <span>{{ `${$t(item.name)}:` }}</span>
          <span>{{ item.value }}</span>
        </gj-space>
        <SvgIcon
          class="closeTag"
          svgClass="close"
          :width="14"
          @click="closeTags(item, index)"
        />
      </gj-tag>
    </gj-space>
  </gj-row>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";

export default defineComponent({
  name: "",
  components: { SvgIcon },
  props: {
    activatList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, ctx) {
    const data = reactive({});

    const closeTags = (val, i) => {
      ctx.emit("getCloseTags", {
        value: val,
        idx: i,
      });
    };

    return {
      ...toRefs(data),
      closeTags,
    };
  },
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
