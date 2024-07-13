<template>
  <div class="variant-info" id="variantInfo-Lz">
    <h2 class="title">变体信息</h2>
    <div class="variant-content">
      <VariantInfo ref="variantInfoRefs" :relatedSkus="relatedSkus" />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, defineComponent } from "vue";
import VariantInfo from "@pagesSystem/published/lazada/components/common/VariantInfo.vue";
export default defineComponent({
  props: {
    relatedSkus: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    VariantInfo,
  },
  setup() {
    const { proxy } = getCurrentInstance();

    const submitForm = () => {
      return proxy.$refs.variantInfoRefs?.submitForm();
    };
    const saveForm = () => {
      return proxy.$refs.variantInfoRefs?.submitForm();
    };

    const clearData = () => {
      proxy.$refs.variantInfoRefs?.clearData();
    };

    const setPageData = (respData) => {
      proxy.$refs.variantInfoRefs?.setPageData(respData);
    };

    return {
      submitForm,
      saveForm,
      clearData,
      setPageData,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
.variant-info {
  .title {
    padding: 16px 0 8px 0px;
    font-size: 14px;
  }
  .variant-content {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
</style>
