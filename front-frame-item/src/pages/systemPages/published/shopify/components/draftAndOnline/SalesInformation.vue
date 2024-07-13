<template>
  <div class="sale-info" id="saleInfo-lz">
    <div class="sale-content">
      <keep-alive>
        <component
          ref="salesInformationRef"
          detailType="draft"
          :is="componentName"
          :related-skus="relatedSkus"
          @variant-change="variantChange"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, defineComponent, inject } from "vue";
import SalesInformationSingle from "./SalesInformationSingle.vue";
import VariantInfo from "../VariantInfo.vue";
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
    SalesInformationSingle,
    VariantInfo,
  },
  emits: ["variant-change"],
  setup(props, { emit }) {
    const specsType = inject("specsType");
    const { proxy } = getCurrentInstance();
    const componentName = computed(() => {
      return specsType.value === 1 ? "SalesInformationSingle" : "VariantInfo";
    });

    const submitForm = () => {
      return proxy.$refs.salesInformationRef.submitForm();
    };

    const saveForm = () => {
      return proxy.$refs.salesInformationRef.saveDraftForm();
    };

    const setPageData = (respData) => {
      proxy.$refs.salesInformationRef.setPageData(respData);
    };

    const variantChange = (variants) => {
      emit("variant-change", variants);
    };

    return {
      componentName,
      submitForm,
      saveForm,
      setPageData,
      variantChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.sale-info {
  .sale-content {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
:deep(.inventory-modal) {
  .arco-modal-footer {
    position: relative !important;
  }
}
</style>
