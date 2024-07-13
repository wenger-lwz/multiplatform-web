<template>
  <h2 class="title">
    产品描述
    <gj-button type="text" size="mini" @click="descsVisible = true"
      >素材中心</gj-button
    >
  </h2>
  <rich-text
    class="box-wrap"
    v-model="shopifyProductDesc.text"
    ref="editorRef"
    @material-center="openPic"
  />
  <pictures-center
    v-model:visible="visible"
    :sku="relatedSkuOrSpu"
    :skutype="'' + specsType"
    @close="closePicsCenter"
    @confirm="addImages"
  />
  <descs-center
    v-model:visible="descsVisible"
    @confirm="addDesc"
    @close="closeDescsCenter"
  />
</template>

<script>
import { reactive, toRefs, ref, inject, getCurrentInstance } from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import { GjMessage } from "@gj/atom";
import RichText from "@/components/RichText.vue";
import picturesCenter from "@/pages/systemPages/published/materialCenter/modal/picture.vue";
import descsCenter from "@pagesSystem/published/materialCenter/modal/text.vue";

export default {
  inheritAttrs: false,
  name: "ShopifyProductDesc",
  components: {
    RichText,
    picturesCenter,
    descsCenter,
  },
  setup() {
    const key = "shopifyProductDesc";
    const relatedSkuOrSpu = inject("relatedSkuOrSpu");
    const specsType = inject("specsType");
    const editorRef = ref(null);
    const visible = ref(false);
    const descsVisible = ref(false);
    const { proxy } = getCurrentInstance();
    const data = reactive({
      [key]: {
        text: "",
      },
    });

    const submitForm = () => {
      return setForm2(proxy, key, data[key]);
    };

    const setPageData = (aData) => {
      data[key].text = aData.descriptions ?? "";
      editorRef.value.setHtml(data[key].text);
    };

    const openPic = () => {
      if (!relatedSkuOrSpu.value) {
        if (specsType.value === 1) {
          return GjMessage.warning("请先选择关联SKU");
        } else {
          return GjMessage.warning("请先选择关联SPU");
        }
      }
      visible.value = true;
    };

    const addImages = (images) => {
      let t = data.shopifyProductDesc.text;
      images.forEach((item) => {
        t += `<img src="${item.thumbnailUrl}" />`;
      });
      data.shopifyProductDesc.text = t;
      editorRef.value.setHtml(t);
      visible.value = false;
    };

    const closePicsCenter = () => {
      visible.value = false;
    };

    const addDesc = (val) => {
      if (val.length) {
        const text = data[key].text + val[0].content;
        data[key].text = text;
        editorRef.value.setHtml(text);
      }
      descsVisible.value = false;
    };

    const closeDescsCenter = () => {
      descsVisible.value = false;
    };

    return {
      editorRef,
      visible,
      descsVisible,
      specsType,
      relatedSkuOrSpu,
      ...toRefs(data),
      submitForm,
      setPageData,
      openPic,
      addImages,
      closePicsCenter,
      addDesc,
      closeDescsCenter,
    };
  },
};
</script>
<style lang="scss" scoped>
.box-wrap {
  padding: 0 16px 0 8px;
}
</style>
