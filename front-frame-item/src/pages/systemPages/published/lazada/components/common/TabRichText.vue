<template>
  <div class="descript">
    <h2 class="title">{{ title }}</h2>
    <gj-tabs
      class="desc-tabs"
      lazy-load
      destroy-on-hide
      type="card-gutter"
      :editable="editable"
      @add="handleAdd"
      @delete="handleDelete"
      show-add-button
    >
      <gj-tab-pane
        v-for="(item, index) of tabsData"
        :key="item.key"
        :title="item.title"
      >
        <RichText
          v-model="item.text"
          ref="editorRef"
          @material-center="openModel(index)"
          @getElems="(elem) => (item.elem = elem)"
        ></RichText>
      </gj-tab-pane>
    </gj-tabs>
    <picture-list
      :visible="dialogVisible"
      :sku="sku"
      :skutype="skutype"
      :minWidth="330"
      :minHeight="330"
      :maxWidth="5000"
      :maxHeight="5000"
      :imgExceeding="1"
      :isLimitRatio="true"
      @close="cancel"
      @confirm="confirm"
    ></picture-list>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, ref } from "vue";
// import { createThumbnail } from "@/utils/common";
import { createThumbnailEbay } from "@/utils/common";
import RichText from "@/components/RichText.vue";
import pictureList from "@pagesSystem/published/materialCenter/modal/picture.vue";
export default {
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    editable: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  components: {
    RichText,
    pictureList,
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      tabsData: [
        {
          key: "1",
          title: "001",
          text: "",
          previewUrl: "",
          elem: null,
        },
      ],
      sku: "",
      skutype: "",
      title: props.title,
      dialogVisible: false,
    });

    const currRichTextIndex = ref(-1);
    const handleAdd = (e, value, previewUrl) => {
      const key = String(
        parseInt(data.tabsData[data.tabsData.length - 1]?.key ?? 0) + 1
      );
      const tabItem = {
        key: key,
        title: ("00" + key).slice(-3),
        text: value || "",
        previewUrl: previewUrl || "",
        elem: null,
      };
      data.tabsData.push(tabItem);
    };
    const handleDelete = (key) => {
      data.tabsData = data.tabsData.filter((item) => item.key !== key);
    };

    const getResult = () => {
      let result = [];
      data.tabsData.forEach((item) => {
        result.push(item.text || "");
      });
      return result;
    };

    const richTextsCreateThumbnail = () => {
      return new Promise((resolve) => {
        let x = 0;
        data.tabsData.forEach((item) => {
          if (item.text) {
            createThumbnailEbay(item.elem)
              .then((res) => {
                item.previewUrl = res.data;
                x += 1;
                if (x === data.tabsData.length) {
                  resolve(data.tabsData);
                }
              })
              .catch(() => {
                resolve(data.tabsData);
              });
          } else {
            x += 1;
            if (x === data.tabsData.length) {
              resolve(data.tabsData);
            }
          }
        });
      });
    };

    const setPageData = (textData) => {
      if (Array.isArray(textData.text)) {
        textData.text.forEach((item, index) => {
          if (index > 0) {
            handleAdd(null, item, textData.previewUrl?.[index]);
          } else {
            data.tabsData[index].text = item;
            data.tabsData[index].previewUrl = textData.previewUrl?.[index];
          }
          setTimeout(() => {
            proxy.$refs.editorRef.forEach((ref, index) => {
              ref?.setHtml(textData.text[index]);
            });
          }, 0);
        });
      } else {
        data.tabsData[0].text = textData.text;
        setTimeout(() => {
          proxy.$refs.editorRef.forEach((ref) => {
            ref?.setHtml(textData.text);
          });
        }, 0);
      }
    };

    const openModel = (index) => {
      currRichTextIndex.value = index;
      data.dialogVisible = true;
    };

    const cancel = () => {
      currRichTextIndex.value = -1;
      data.dialogVisible = false;
    };

    const confirm = (list) => {
      data.dialogVisible = false;
      const temp =
        list?.map((item) => ({ ...item, resource: item.originalUrl })) || [];
      proxy.$refs.editorRef[currRichTextIndex.value]?.cmdInsertImage(temp);
    };

    return {
      ...toRefs(data),
      handleAdd,
      handleDelete,
      getResult,
      richTextsCreateThumbnail,
      setPageData,
      openModel,
      cancel,
      confirm,
    };
  },
};
</script>

<style lang="scss" scoped>
.descript {
  .title {
    font-size: 14px;
    margin-bottom: 12px;
  }
  > :deep(.arco-tabs .arco-tabs-content) {
    padding-top: 0;
  }
  > .desc-tabs {
    padding: 0 16px 0 8px;
  }
}
</style>
