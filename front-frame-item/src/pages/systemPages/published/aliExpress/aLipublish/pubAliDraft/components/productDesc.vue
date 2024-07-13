<template>
  <div class="blockBox">
    <!-- PC详描编辑 -->
    <div class="title">
      <div class="buttonWrap">
        <span class="text">产品描述</span>
        <!-- <gj-button size="small" type="text">素材中心</gj-button> -->
      </div>
      <div class="selectWrap">
        <gj-select
          placeholder="选择产品信息模板"
          v-model="newsTemplateId"
          @change="changeNewsTemplate"
          :trigger-props="{
            updateAtScroll: true,
            autoFitPopupMinWidth: true,
          }"
        >
          <gj-option
            v-for="item in newsList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></gj-option>
        </gj-select>
      </div>
    </div>

    <div class="subtitle">
      <span class="text">PC详描编辑</span>
      <span class="tip"
        >（该编辑器详描内容用于所有非APP端浏览AE商品时的详描展示。您也可以先用下方无线详描编辑完成后,
        再点击导入无线详描。）</span
      >
    </div>
    <gj-button size="small" type="text" class="exportBut" @click="exportMobile"
      >导入无线详描</gj-button
    >
    <div class="content">
      <gj-tabs
        type="card-gutter"
        :editable="false"
        @add="handlePcAdd"
        @delete="handlePcDelete"
        show-add-button
      >
        <gj-tab-pane v-for="item of pcData" :key="item.key" :title="item.title">
          <RichText
            v-model="item.textarea"
            ref="editorRef"
            @material-center="openPic"
            @material-upload-video="openVideo"
            :hasUploadVideo="true"
          ></RichText>
        </gj-tab-pane>
      </gj-tabs>
    </div>

    <!-- 无线详描编辑 -->
    <div class="subtitle">
      <span class="text">无线详描编辑</span>
      <span class="tip"
        >（该编辑器详描内容用于APP端浏览商品时的详描展示。您也可以先用上方PC详描编辑完成后,
        再点击导入PC详描。）</span
      >
    </div>
    <gj-button size="small" type="text" class="exportBut" @click="exportPc"
      >导入PC详描</gj-button
    >
    <div class="content">
      <gj-tabs
        type="card-gutter"
        :editable="false"
        @add="handleWirelessAdd"
        @delete="handleWirelessDelete"
        show-add-button
      >
        <gj-tab-pane
          v-for="(item, index) of wirelessData"
          :key="item.key"
          :title="item.title"
        >
          <div class="wrap">
            <div class="mask"></div>
            <gj-button
              type="primary"
              shape="round"
              @click="edit(index)"
              style="font-size: 12px"
              class="edit"
              >编辑描述</gj-button
            >
          </div>
        </gj-tab-pane>
      </gj-tabs>
    </div>
    <picture-list
      v-model:visible="visible"
      :sku="pictureInfo.sku"
      :skutype="pictureInfo.skutype"
      @close="cancel('tp')"
      @confirm="confirmPic"
    ></picture-list>
    <video-list
      :visible="videoVisible"
      :sku="pictureInfo.sku"
      :skutype="pictureInfo.skutype"
      :showVideoLibrary="false"
      @close="cancel('sp')"
      @confirm="confirmVideo"
      :platform="''"
    ></video-list>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  watch,
  inject,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import RichText from "@/components/RichText.vue";
import { getTemplateDetail } from "@/api/published/aliexpress";
import pictureList from "@/pages/systemPages/published/materialCenter/modal/picture.vue";
import videoList from "@/pages/systemPages/published/materialCenter/modal/video.vue";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  name: "",
  components: {
    RichText,
    pictureList,
    videoList,
  },
  props: {
    dataView: {
      type: Array,
      default: () => {
        return [];
      },
    },
    newsList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    editInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const key = "productDesc";

    const shopId = inject("shopId");
    const specsType = inject("specsType");
    const draftSpu = inject("draftSpu");

    const data = reactive({
      visible: false,
      videoVisible: false,
      pictureInfo: {
        skutype: specsType.value,
        shopId: shopId.value,
        sku: draftSpu.value,
      },
      newsTemplateId: "",
      pcData: [
        {
          key: "1",
          title: "Tab 1",
          textarea: "",
        },
      ],
      wirelessData: [
        {
          key: "1",
          title: "Tab 1",
        },
      ],
      mobileDescription: [],
      pcDescription: [],
      newsList: props.newsList,
      view: props.dataView,
      editData: props.editInfo,
    });

    const hsize = {
      H1: "32px",
      H2: "24px",
      H3: "18px",
      H4: "16px",
      H5: "14px",
      H6: "13px",
    };

    const fontSize = {
      1: "10px",
      2: "13px",
      3: "16px",
      4: "18px",
      5: "24px",
      6: "32px",
      7: "48px",
    };
    const changeNewsTemplate = (val) => {
      getTemplateDetail(val).then((res) => {
        const str = res.data.module.moduleContents || "";
        if (str) {
          proxy.$refs.editorRef[0]?.setHtml(str);
        }
      });
    };

    const handlePcAdd = () => {
      data.pcData.push({
        key: `${data.pcData.length + 1}`,
        title: `Tab ${data.pcData.length + 1}`,
      });
    };
    const handlePcDelete = (key) => {
      data.pcData = data.pcData.filter((item) => item.key !== key);
    };

    const handleWirelessAdd = () => {
      data.wirelessData.push({
        key: `${data.wirelessData.length + 1}`,
        title: `Tab ${data.wirelessData.length + 1}`,
      });
    };
    const handleWirelessDelete = (key) => {
      data.wirelessData = data.wirelessData.filter((item) => item.key !== key);
    };

    const edit = (index) => {
      emit("editWireless", index);
    };
    const submitForm = () => {
      return setForm2(proxy, key, {
        pcDescription: data.pcData[0].textarea,
      });
    };
    const getResult = () => {
      return data.pcData.map((item) => item.textarea);
      // return proxy.$refs.editorRef.map((item) => item?.getElems())
    };

    const exportMobile = () => {
      proxy.$refs.editorRef[0]?.setHtml(transPC());

      console.log(data.view);
    };

    const exportPc = () => {
      // console.log(proxy.$refs.editorRef[0].getHtml())
      transPCMobile(data.pcData[0].textarea);
    };

    const transPC = () => {
      const htmlArr = [];
      data.view.forEach((item) => {
        if (item.type === "image") {
          item.imageList.forEach((imageItem) => {
            htmlArr.push(`<img src="${imageItem.url}"></img>`);
          });
        } else if (item.type === "text") {
          if (item.title) {
            htmlArr.push(
              `<p style="color:${item.titleColor}; font-size:${item.titleSize} !important;font-weight: ${item.titleWeight};">${item.title}</p>`
            );
          }
          if (item.content) {
            htmlArr.push(
              `<p style="color:${item.wordColor}; font-size:${item.wordSize} !important;font-weight: ${item.wordWeight};">${item.content}<p>`
            );
          }
        } else if (item.type === "video") {
          htmlArr.push(
            `<video src="${item.videoList[0]?.videoUrl}" controls="controls"></video><br/>`
          );
        }
      });
      return htmlArr.join("<br/>");
    };

    const transPCMobile = (htmlString) => {
      if (!htmlString) return;
      const mobileArr = [];
      var ele = document.createElement("div");
      ele.style.display = "none";
      ele.innerHTML = htmlString;
      ele.children.forEach((item) => {
        let color = "#333";
        let size = "12px";
        let hasFont = false;
        if (item.children && item.children[0]?.nodeName === "FONT") {
          color = item.children[0].color;
          size = fontSize[item.children[0].size];
          hasFont = true;
        }
        console.log(item);
        if (item.nodeName === "P" && item.innerHTML != "<br>") {
          if (mobileArr.filter((item) => item.type === "text").length === 30)
            return;
          mobileArr.push({
            type: "text",
            name: "文字",
            title: item.innerText,
            content:
              "Describe the details of the selling point or other information,attracting and providing trust to your potential users.Describe the details of the selling point or other information,attracting and providing trust to your potential users.",
            wordColor: "#333",
            wordWeight: 500,
            wordAlign: "left",
            wordSize: "12px",
            titleColor: color,
            titleWeight: 700,
            titleAlign: "left",
            titleSize: size,
          });
        } else if (item.nodeName === "IMG") {
          if (mobileArr.filter((item) => item.type === "image").length === 30)
            return;
          mobileArr.push({
            type: "image",
            name: "图片",
            imageList: [
              {
                url: item.src,
              },
            ],
            clearGap: false,
          });
        } else if (
          item.nodeName == "H1" ||
          item.nodeName == "H2" ||
          item.nodeName == "H3" ||
          item.nodeName == "H4" ||
          item.nodeName == "H5" ||
          item.nodeName == "H6"
        ) {
          if (mobileArr.filter((item) => item.type === "text").length === 30)
            return;
          mobileArr.push({
            type: "text",
            name: "文字",
            title: item.innerText,
            content:
              "Describe the details of the selling point or other information,attracting and providing trust to your potential users.Describe the details of the selling point or other information,attracting and providing trust to your potential users.",
            wordColor: "#333",
            wordWeight: 500,
            wordAlign: "left",
            wordSize: "12px",
            titleColor: color,
            titleWeight: 400,
            titleAlign: "left",
            titleSize: hasFont ? size : hsize[item.nodeName],
          });
        } else if (item.nodeName === "VIDEO") {
          if (mobileArr.filter((item) => item.type === "video").length === 1)
            return;
          mobileArr.push({
            type: "video",
            name: "视频",
            videoList: [
              {
                videoUrl: item.src,
              },
            ],
          });
        }
      });

      ele.innerHTML = "";
      console.log(mobileArr);
      emit("importTransPCMobile", mobileArr);
    };

    const cancel = (val) => {
      if (val == "tp") {
        data.visible = false;
      } else {
        data.videoVisible = false;
      }
    };

    watch(
      () => props.editInfo,
      (newValue) => {
        if (JSON.stringify(newValue) != "{}") {
          data.editData = newValue;
          proxy.$refs.editorRef[0]?.setHtml(data.editData.pcDescription);
        }
      },
      { deep: true }
    );

    onMounted(() => {});

    watch(
      () => props.newsList,
      (newValue) => {
        data.newsList = newValue;
        data.newsTemplateId = "";
      }
    );

    const confirmPic = (val) => {
      const htmlArr = [];
      htmlArr.push(data.pcData[0].textarea);
      val.forEach((item) => {
        htmlArr.push(`<img src="${item.thumbnailUrl}"></img>`);
      });

      proxy.$refs.editorRef[0]?.setHtml(htmlArr.join("<br/>"));
      data.visible = false;
    };

    const confirmVideo = (val) => {
      console.log(data.pcData[0].textarea);

      const htmlArr = [];
      htmlArr.push(data.pcData[0].textarea);

      if (Array.isArray(val)) {
        val.forEach((item) => {
          htmlArr.push(
            `<video src="${item.originalUrl}" controls="controls"></video>`
          );
        });
      } else {
        htmlArr.push(
          `<video src="${val.originalUrl}" controls="controls"></video>`
        );
      }

      proxy.$refs.editorRef[0]?.setHtml(htmlArr.join("<br/>"));
      data.videoVisible = false;
    };

    const openPic = () => {
      if (draftSpu.value) {
        data.pictureInfo.sku = draftSpu.value;
        data.pictureInfo.skutype = specsType.value;

        data.visible = true;
      } else {
        GjMessage.error("请先选择关联sku或spu");
      }
    };

    const openVideo = () => {
      if (draftSpu.value) {
        data.pictureInfo.sku = draftSpu.value;
        data.pictureInfo.skutype = specsType.value;
        data.videoVisible = true;
      } else {
        GjMessage.error("请先选择关联sku/spu");
      }
    };

    watch(
      () => props.dataView,
      (newValue) => {
        data.view = newValue;
      }
    );
    return {
      handlePcAdd,
      handlePcDelete,
      handleWirelessAdd,
      handleWirelessDelete,
      edit,
      getResult,
      submitForm,
      ...toRefs(data),
      exportMobile,
      exportPc,
      changeNewsTemplate,
      cancel,
      confirmPic,
      confirmVideo,
      openPic,
      openVideo,
    };
  },
});
</script>
<style scoped lang="scss">
:deep(.arco-tabs-content) {
  padding-top: 0px;
}
.wrap {
  position: relative;
  height: 150px;
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 15px;
    left: 0;
    background: rgba(0, 4, 48, 0.5);
  }
  .edit {
    position: absolute;
    width: 80px;
    top: calc(50% - 16px);
    left: calc(50% - 40px);
  }
}

.blockBox {
  .title {
    display: flex;
    justify-content: space-between;
    padding-right: 16px;
    .buttonWrap {
      .text {
        font-weight: 600;
        font-size: 14px;
      }
    }
    .selectWrap {
      width: 160px;
    }
  }

  .subtitle {
    color: #333659;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin-top: 17px;
    .tip {
      font-size: 12px;
      color: #808197;
    }
  }

  .squre-line {
    padding: 12px;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #e6e6ed;
    border-radius: 8px;
    margin-bottom: 14px;
    .subTitle {
      margin-bottom: 4px;
      .text {
        font-size: 12px;
        color: #000430;
      }
    }
    .tip {
      font-size: 12px;
      color: #808197;
    }
  }

  .content {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }

  .exportBut {
    margin: 12px 0;
  }
}
</style>
