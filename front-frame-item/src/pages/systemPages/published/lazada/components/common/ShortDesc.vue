<template>
  <TabRichText
    title="短描述"
    ref="tabsRichTextRef"
    id="shortDescript-lz"
    class="short-desc"
    :editable="editable"
  />
</template>

<script>
import { getCurrentInstance, reactive } from "vue";
import TabRichText from "@pagesSystem/published/lazada/components/common/TabRichText.vue";
import { setForm2 } from "@/utils/fnBusiness";
export default {
  props: {
    editable: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  components: {
    TabRichText,
  },
  setup(props) {
    const key = "shortDescLz";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      [key]: {
        text: [],
        previewUrl: [],
      },
    });
    const submitForm = () => {
      if (props.editable) {
        return new Promise((resolve) => {
          const handler = proxy.$refs.tabsRichTextRef.richTextsCreateThumbnail;
          handler()
            .then((respDataArr) => {
              data[key].text = respDataArr.map((it) => it.text);
              data[key].previewUrl = respDataArr.map((it) => it.previewUrl);
            })
            .finally(() => {
              resolve(setForm2(proxy, key, data[key]));
            });
        });
      } else {
        data[key].text = proxy.$refs.tabsRichTextRef.getResult();
        return setForm2(proxy, key, data[key]);
      }
    };

    const setPageData = (respData) => {
      if (Array.isArray(respData.descriptions)) {
        const target = respData.descriptions.filter((item) => item.type === 1);
        data[key].text = target.map((item) => item.descriptionInfo) || [];
        data[key].previewUrl = target.map((item) => item.previewUrl) || [];
      } else {
        data[key].text = respData.shortDescription || "";
        data[key].previewUrl = "";
      }
      proxy.$refs.tabsRichTextRef.setPageData(data[key]);
    };

    return {
      submitForm,
      setPageData,
    };
  },
};
</script>
<style lang="scss" scoped>
.short-desc {
  margin-top: 32px;
}
</style>
