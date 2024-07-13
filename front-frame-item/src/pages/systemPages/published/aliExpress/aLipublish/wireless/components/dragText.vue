<template>
  <div class="textCon mb16" :class="{ activeClass: isActive }">
    <div class="title" :style="{ ...titleStyle }">{{ viewData.title }}</div>
    <div class="words" :style="{ ...wordStyle }">{{ viewData.content }}</div>
    <div class="butGroup" v-if="isActive">
      <SvgIcon
        svgClass="copyIcon"
        :width="12"
        class="copy"
        @click.stop="copyTem"
      />
      <SvgIcon
        svgClass="closeIcon"
        :width="16"
        class="delete"
        @click.stop="deleteTem"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, computed, watch } from "vue";
import SvgIcon from "@/components/SvgIcon";

export default defineComponent({
  components: {
    SvgIcon,
  },
  name: "",
  props: {
    isActive: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    viewData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      viewData: props.viewData,
      isActive: props.isActive,
    });
    const wordStyle = computed(() => {
      return {
        color: data.viewData.wordColor || "#333333",
        fontWeight: data.viewData.wordWeight || 500,
        fontSize: data.viewData.wordSize || "12px",
        textAlign: data.viewData.wordAlign || "left",
      };
    });

    const titleStyle = computed(() => {
      return {
        color: data.viewData.titleColor || "#333333",
        fontWeight: data.viewData.titleWeight || 700,
        fontSize: data.viewData.titleSize || "13px",
        textAlign: data.viewData.titleAlign || "left",
      };
    });
    const copyTem = () => {
      emit("copyTem");
    };
    const deleteTem = () => {
      emit("deleteTem");
    };

    watch(
      () => props.isActive,
      (newValue) => {
        data.isActive = newValue;
      }
    );

    watch(
      () => props.viewData,
      (newValue) => {
        data.viewData = newValue;
      }
    );

    return {
      ...toRefs(data),
      wordStyle,
      titleStyle,
      copyTem,
      deleteTem,
    };
  },
});
</script>
<style scoped lang="scss">
.textCon {
  padding: 16px;
  position: relative;
  background: #f2f2f5;
  min-height: 108px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #e6e6ed;
  padding: 24px 16px;
  .title {
    margin-bottom: 12px;
    min-height: 16px;
    line-height: 16px;
  }
  .words {
    min-height: 32px;
    line-height: 18px;
  }
  .butGroup {
    position: absolute;
    right: 4px;
    top: 8px;
    .copy,
    .delete {
      cursor: pointer;
      margin-left: 12px;
      vertical-align: middle;
    }
  }
}
.activeClass {
  background: #e6ecfe;
}
</style>
