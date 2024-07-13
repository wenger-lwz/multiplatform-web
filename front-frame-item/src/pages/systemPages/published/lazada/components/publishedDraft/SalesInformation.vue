<template>
  <div class="sale-info" id="saleInfo-lz">
    <h2 class="title">销售信息</h2>
    <div class="sale-content">
      <keep-alive>
        <component
          ref="salesInformationRef"
          :pageType="pageType"
          :is="componentName"
          :related-skus="relatedSkus"
          :selectData="selectData"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, defineComponent } from "vue";
import { useStore } from "vuex";
import SalesInformationSingle from "./SalesInformationSingle.vue";
import VariantInfo from "@pagesSystem/published/lazada/components/common/VariantInfo.vue";
export default defineComponent({
  props: {
    relatedSkus: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selectData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    pageType: {
      type: String,
      default: () => {
        return "draft";
      },
    },
  },
  components: {
    SalesInformationSingle,
    VariantInfo,
  },
  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const componentName = computed(() => {
      return store.getters.getParams?.productInfo?.specsType === 2
        ? "VariantInfo"
        : "SalesInformationSingle";
    });

    const submitForm = () => {
      return proxy.$refs.salesInformationRef.submitDraftForm();
    };
    const saveForm = () => {
      return proxy.$refs.salesInformationRef.saveDraftForm();
    };

    const setPageData = (respData) => {
      // 延时处理
      setTimeout(() => {
        proxy.$refs.salesInformationRef.setPageData(respData);
      }, 0);
    };

    return {
      componentName,
      submitForm,
      saveForm,
      setPageData,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
.sale-info {
  .title {
    padding: 16px 0 8px 0px;
    font-size: 14px;
  }
  .sale-content {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
</style>
