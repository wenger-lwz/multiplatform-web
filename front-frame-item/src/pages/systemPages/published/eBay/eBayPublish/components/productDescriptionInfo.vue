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
          <gj-tabs
            class="tabs-box"
            type="card-gutter"
            :active-key="tabsActive"
            @change="tabscheng"
            :editable="true"
            @add="handleAdd"
            @delete="handleDelete"
            show-add-button
          >
            <gj-tab-pane
              v-for="item of productDescriptionInfo.tabsData"
              :key="item.key"
              :title="item.descName"
            >
              <RichText
                v-model="item.descValue"
                id="editorRef"
                ref="editorRef"
                @material-center="openModel"
              ></RichText>
            </gj-tab-pane>
          </gj-tabs>
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
import { createThumbnailEbay } from "@/utils/common";
import RichText from "@/components/RichText.vue";
import pictureList from "../../../materialCenter/modal/picture.vue";

export default {
  emits: ["setShowItemFun", "attrFun"],
  components: {
    RichText,
    pictureList,
    // EditorWang,
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
      tabsActive: "1",
      currentRow: [],
      skutype: "",
      productDescriptionInfo: {
        tabsData: [
          {
            key: "1",
            descName: "001",
            descValue: "",
            previewUrl: "",
          },
          {
            key: "2",
            descName: "002",
            descValue: "",
            previewUrl: "",
          },
          {
            key: "3",
            descName: "003",
            descValue: "",
            previewUrl: "",
          },
        ],
      },
      rules: {},
    });
    const submitForm = () => {
      return setForm(proxy, key, data[key], "productDescriptionForm");
    };
    const resetForm = () => {
      data.productDescriptionInfo.tabsData.forEach((item) => {
        item.descValue = "";
      });
    };
    const handleAdd = () => {
      const key = String(
        parseInt(
          data.productDescriptionInfo.tabsData[
            data.productDescriptionInfo.tabsData.length - 1
          ]?.key ?? 0
        ) + 1
      );
      const tabItem = {
        key: key,
        descName: ("00" + key).slice(-3),
      };
      data.productDescriptionInfo.tabsData.push(tabItem);
    };
    const handleDelete = (key) => {
      let a = data.productDescriptionInfo.tabsData.filter(
        (item) => item.key !== key
      );

      data.productDescriptionInfo.tabsData = a.map((item, index) => {
        return {
          ...item,
          key: index + 1,
        };
      });
      data.tabsActive = data.productDescriptionInfo.tabsData[0].key;
    };
    const getResult = () => {
      return proxy.$refs.editorRef.map((item) => item?.getHtml());
    };
    const getEditorChange = (val) => {
      data.productDescriptionInfo.tabsData.forEach((item) => {
        if (item.key == data.tabsActive) {
          item.descValue = val;
        }
      });
    };
    const tabscheng = (key) => {
      let old = Number(data.tabsActive) - 1;
      data.tabsActive = key;
      productDesFun(old);
    };
    const productDesFun = (index) => {
      // 点击切换生成图片
      const obj = document.querySelectorAll("#editorRef")[index];
      createThumbnailEbay(obj).then((res) => {
        data.productDescriptionInfo.tabsData[index].previewUrl = res.data;
      });
    };
    const cancel = () => {
      data.Visible = false;
    };
    const openModel = () => {
      data.Visible = true;
    };
    const confirmPic = (val) => {
      let sum = Number(data.tabsActive) - 1;
      const htmlArr = [];
      htmlArr.push(data.productDescriptionInfo.tabsData[sum].textarea);
      val.forEach((item) => {
        htmlArr.push(`<img src="${item.thumbnailUrl}"></img>`);
      });
      proxy.$refs.editorRef[sum]?.setHtml(htmlArr.join("<br/>"));
      data.Visible = false;
    };
    watch(
      () => props.goodsRowData,
      () => {
        data.productDescriptionInfo.tabsData = [];
        let descriptionsList = props.goodsRowData.descriptions;
        data.currentRow = props.goodsRowData.descriptions;
        data.productDescriptionInfo.tabsData = descriptionsList.map(
          (item, index) => {
            proxy.$refs.editorRef[index]?.setHtml(item.descValue);
            return {
              ...item,
              key: index + 1 + "",
            };
          }
        );
        // console.log(proxy.$refs, 'opopopo')
        // proxy.$refs.editorRef.setHtml(
        //   data.productDescriptionInfo.tabsData[0].descValue
        // )
      }
    );
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      handleAdd,
      handleDelete,
      getResult,
      getEditorChange,
      tabscheng,
      productDesFun,
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
.tabs-box {
  /deep/.arco-tabs-content {
    border: 1px solid #e5e6e8;
    box-sizing: border-box;
    border-radius: 0px 4px 4px 4px;
    padding: 12px;
  }
  /deep/.arco-tabs-nav-type-card-gutter .arco-tabs-tab {
    border-bottom: 0;
  }
  /deep/.arco-tabs-nav-type-card-gutter .arco-tabs-tab {
    height: 32px;
    font-size: 12px;
    background-color: #f7f8fa;
    color: #333659;
  }
  /deep/.arco-tabs-nav-type-card-gutter .arco-tabs-tab-active {
    background-color: #fff;
    color: #0045f0;
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
