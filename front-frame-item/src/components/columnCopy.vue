<template>
  <div class="gb-copy" v-if="!isAnchor">
    <gb-text ref="textRef">
      {{ textValue }}
    </gb-text>
    <div class="copy-icon">
      <svg-icon svgClass="copy" @click.stop="copy"></svg-icon>
    </div>
  </div>
  <div class="gb-copy open-url" v-else>
    <gb-text @click="openHelp(openUrl)" ref="textRef">
      {{ textValue }}
    </gb-text>
    <div class="copy-icon">
      <svg-icon svgClass="copy" @click.stop="copy"></svg-icon>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { GjMessage } from "@gj/atom";
import SvgIcon from "@/components/SvgIcon";

export default defineComponent({
  components: { SvgIcon },
  props: {
    textValue: {
      type: [Number, String],
      default: () => {
        return "";
      },
    },
    // 文本是否需要跳转
    isAnchor: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    openUrl: {
      type: String,
      default: () => {
        return "https://www.walmart.com/ip";
      },
    },
  },
  setup() {
    const textRef = ref(null);

    const openHelp = (url) => {
      if (url) {
        window.open(url);
      }
    };

    const copy = () => {
      const fmt = document.createDocumentFragment();
      const input = document.createElement("input");
      input.value = textRef.value.textContainerRef.innerHTML;
      input.style.opacity = 0;
      input.style.position = "absolute";
      input.style.left = 0;
      input.style.top = 0;
      fmt.appendChild(input);
      document.body.appendChild(fmt);
      input.focus();
      input.select();
      document.execCommand("copy", true);
      GjMessage.success("复制成功");
      document.body.removeChild(input);
    };

    return {
      textRef,
      openHelp,
      copy,
    };
  },
});
</script>
<style lang="scss" scoped>
.open-url {
  color: #0045f0;
  cursor: pointer;
}
.copy-icon {
  color: #86909c;
  cursor: pointer;
  &:hover {
    color: #0045f0;
  }
}
</style>
