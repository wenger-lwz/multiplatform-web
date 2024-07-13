<template>
  <div class="product-title ellipsis">
    {{ record.defaultTitle }}
  </div>
  <div class="product-spu">
    <div class="product-title ellipsis">{{ record.spu }}</div>
    <div @click="onCopyText(record.spu)" class="copy-icon" v-if="record.spu">
      <SvgIcon svgClass="copyText"></SvgIcon>
    </div>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from "vue";
import SvgIcon from "@/components/SvgIcon";

export default defineComponent({
  name: "",
  props: {
    record: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  components: {
    SvgIcon,
  },
  setup() {
    const { appContext } = getCurrentInstance();

    // 复制SPU
    const onCopyText = (text) => {
      if (text) {
        navigator.clipboard?.writeText && navigator.clipboard.writeText(text);
        return appContext.config.globalProperties.$gjMessage.success(
          "复制成功"
        );
      }
    };

    return {
      onCopyText,
    };
  },
});
</script>

<style scoped lang="scss">
.product-title {
  max-width: 160px;
  color: #000430;
}

.product-spu {
  display: flex;
  .product-title {
    color: #0045f0;
  }

  .copy-icon {
    margin-left: 3px;
    cursor: pointer;
  }
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
