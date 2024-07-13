<template>
  <TabRichText
    class="long-desc"
    title="长描述"
    ref="tabsRichTextRef"
    id="longDescript-lz"
    :editable="editable"
  />
</template>

<script>
import { getCurrentInstance, reactive } from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import TabRichText from "@pagesSystem/published/lazada/components/common/TabRichText.vue";

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
    const key = "longDescLz";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      [key]: {
        text: [],
        previewUrl: [],
      },
    });

    const submitForm = () => {
      // editable:true表示商品资料, 需要缩略图
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
        const target = respData.descriptions.filter((item) => item.type === 0);
        data[key].text = target.map((item) => item.descriptionInfo) || [];
        data[key].previewUrl = target.map((item) => item.previewUrl) || [];
      } else {
        data[key].text = respData.descriptions || "";
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
.long-desc {
  margin-top: 22px;
}
</style>
