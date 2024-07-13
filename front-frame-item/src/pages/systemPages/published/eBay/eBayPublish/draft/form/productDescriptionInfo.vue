<template>
  <div class="basic-info" id="productDescriptionInfo-ebay">
    <h2 class="descName">产品描述</h2>
    <gj-form
      ref="productDescriptionForm"
      :model="productDescriptionInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="submitForm"
    >
      <gj-row :gutter="24">
        <gj-col :span="24">
          <RichText
            v-model="productDescriptionInfo.descValue"
            id="editorRef"
            ref="editorRef"
            @material-center="openModel"
          ></RichText>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
  <picture-list
    v-model:visible="Visible"
    :sku="productDescriptionInfo.sku"
    :skutype="productDescriptionInfo.skutype"
    @close="cancel"
    @confirm="confirmPic"
  ></picture-list>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, watch } from "vue";
import { setForm } from "@/utils/fnBusiness";
import RichText from "@/components/RichText.vue";
import pictureList from "../../../../materialCenter/modal/picture.vue";
export default {
  emits: ["setShowItemFun", "attrFun"],
  components: {
    RichText,
    pictureList,
  },
  props: {
    actionType: {
      type: String,
      default: () => {
        return "";
      },
    },
    publicList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    goodsRowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    stroeCategoryId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    // const store = useStore()
    const key = "productDescriptionInfo";
    const data = reactive({
      Visible: false,
      currentRow: [],
      productDescriptionInfo: {
        descName: "详情描述：",
        descValue: "",
        previewUrl: "",
      },
      rules: {},
    });
    const submitForm = () => {
      return setForm(proxy, key, data[key], "productDescriptionForm");
    };
    const resetForm = () => {
      data.productDescriptionInfo = {
        descName: "详情描述：",
        descValue: "",
        previewUrl: "",
      };
    };

    const getResult = () => {
      return proxy.$refs.editorRef.map((item) => item?.getHtml());
    };
    const getEditorChange = (val) => {
      data.productDescriptionInfo.descValue = val;
    };
    const cancel = () => {
      data.Visible = false;
    };
    const openModel = () => {
      data.Visible = true;
    };
    const confirmPic = (val) => {
      const htmlArr = [];
      htmlArr.push(data.productDescriptionInfo.descValue);
      val.forEach((item) => {
        htmlArr.push(`<img src="${item.thumbnailUrl}"></img>`);
      });
      proxy.$refs.editorRef?.setHtml(htmlArr.join("<br/>"));
      data.Visible = false;
    };
    watch(
      () => props.goodsRowData,
      () => {
        data.currentRow = props.goodsRowData.descriptions;
        data.productDescriptionInfo.descValue = props.goodsRowData.description;
        proxy.$refs.editorRef?.setHtml(props.goodsRowData.description);
      }
    );
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      getResult,
      getEditorChange,
      cancel,
      openModel,
      confirmPic,
    };
  },
};
</script>

<style lang="scss" scoped>
.basic-info {
  .descName {
    padding: 16px 0 2px 0px;
    font-size: 14px;
  }
  .basic-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
.des-textarea {
  /deep/.arco-textarea {
    height: 120px;
    background: rgba(0, 4, 48, 0.05);
    border-radius: 4px;
    color: #333659;
    font-size: 12px;
  }
}
</style>
