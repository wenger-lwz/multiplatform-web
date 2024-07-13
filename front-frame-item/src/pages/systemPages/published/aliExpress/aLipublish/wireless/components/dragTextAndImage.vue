<template>
  <div class="textCon mb16" :class="{ activeClass: isActive }">
    <div class="title" :style="{ ...titleStyle }">{{ viewData.title }}</div>
    <div class="words" :style="{ ...wordStyle }">{{ viewData.content }}</div>
    <div class="imageList" v-if="viewData.imageList.length > 0">
      <div
        v-for="(item, index) in viewData.imageList"
        :key="index"
        style="font-size: 0px"
        :class="{ mb8: !viewData.clearGap }"
      >
        <img :src="item.url" alt="" style="width: 100%" />
      </div>

      <!-- <span class="tip" v-if="viewData.imageList.length === 0">更换样品图</span> -->
    </div>
    <img
      src="../../../../../../static/images/wireless_bg1.jpg"
      style="width: 100%; height: 100%; border-radius: 6px"
      v-else
    />
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
  min-height: 346px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #e6e6ed;
  .title {
    margin-bottom: 12px;
    min-height: 16px;
    line-height: 16px;
  }
  .words {
    line-height: 18px;
    min-height: 32px;
    margin-bottom: 24px;
  }
  .imageList {
    background: #fafafb;
    border: 1px solid #e6e6ed;
    box-sizing: border-box;
    border-radius: 6px;
    height: 222px;
    text-align: center;
    display: inline-block;
    width: 100%;
    .tip {
      margin-top: 88px;
      display: inline-block;
      font-size: 12px;
      padding: 7px 12px;
      color: #0045f0;
      background: rgba(0, 69, 240, 0.05);
    }
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
.mb8 {
  margin-bottom: 8px;
}
</style>
