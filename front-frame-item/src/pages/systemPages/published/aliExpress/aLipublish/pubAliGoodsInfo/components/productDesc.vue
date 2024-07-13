<template>
  <div class="blockBox">
    <div class="title">
      <div class="buttonWrap">
        <span class="text">产品描述</span>
        <!-- <gj-button size="small" type="text">素材中心</gj-button> -->
      </div>
    </div>
    <!-- PC详描编辑 -->
    <div class="subtitle">
      <span class="text">PC详描编辑</span>
      <span class="tip"
        >（该编辑器详描内容用于所有非APP端浏览AE商品时的详描展示。您也可以先用下方无线详描编辑完成后,
        再点击导入无线详描。）</span
      >
    </div>
    <div style="box-sizing: border-box; padding: 0 16px 0 8px">
      <gj-tabs
        type="card-gutter"
        :editable="true"
        @add="handlePcAdd"
        @delete="handlePcDelete"
        show-add-button
        @change="tabschang"
        :active-key="tabsActive"
      >
        <gj-tab-pane
          v-for="(item, index) of pcData"
          :key="item.key"
          :title="item.title"
        >
          <RichText
            v-model="item.textarea"
            ref="editorRef"
            id="editorRef"
            :hasUploadVideo="true"
            @material-center="openPic(index)"
            @material-upload-video="openVideo(index)"
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
    <div style="box-sizing: border-box; padding: 0 16px 0 8px">
      <gj-tabs
        type="card-gutter"
        :editable="true"
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
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import RichText from "@/components/RichText.vue";
import pictureList from "@/pages/systemPages/published/materialCenter/modal/picture.vue";
import videoList from "@/pages/systemPages/published/materialCenter/modal/video.vue";
import { GjMessage } from "@gj/atom";
import { createThumbnailEbay } from "@/utils/common";
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
    editInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const store = new useStore();
    const key = "productDesc";
    const data = reactive({
      visible: false,
      videoVisible: false,
      tabsActive: "1",
      pictureInfo: {
        skutype: store.state.aliexpress.proSpuType,
        sku: store.state.aliexpress.proSpuType,
      },
      currentIndex: 0,
      view: props.dataView,
      pcData: [
        {
          key: "1",
          title: "Tab 1",
          textarea: "",
          descriptionPic: "",
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
      editData: props.editInfo,
    });

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

    const tabschang = async (key) => {
      let desPicIndex = 0;
      let newIndex = data.pcData.findIndex(
        (item) => item.key === data.tabsActive
      );
      if (newIndex > -1) {
        desPicIndex = newIndex;
      }

      data.tabsActive = key;
      const obj = document.querySelectorAll("#editorRef")[desPicIndex];

      const res = await createThumbnailEbay(obj);

      data.pcData[desPicIndex].descriptionPic = res.data ? res.data : "";
    };

    const edit = (index) => {
      emit("editWireless", index);
      console.log(store.state);
    };

    const submitForm = async () => {
      let desPicIndex = 0;
      let newIndex = data.pcData.findIndex(
        (item) => item.key === data.tabsActive
      );
      if (newIndex > -1) {
        desPicIndex = newIndex;
      }

      const obj = document.querySelectorAll("#editorRef")[desPicIndex];
      const res = await createThumbnailEbay(obj);
      data.pcData[desPicIndex].descriptionPic = res.data ? res.data : "";

      return setForm2(proxy, key, {
        pcDescription: data.pcData.map((item) => {
          return {
            description: item.textarea,
            descriptionPic: item.descriptionPic,
          };
        }),
      });
    };

    const cancel = (val) => {
      if (val == "tp") {
        data.visible = false;
      } else {
        data.videoVisible = false;
      }
    };

    const getResult = () => {
      return proxy.$refs.editorRef.map((item) => item?.getElems());
    };

    const confirmPic = (val) => {
      const htmlArr = [];
      console.log(data.currentIndex);
      htmlArr.push(data.pcData[data.currentIndex].textarea);

      val.forEach((item) => {
        htmlArr.push(`<img src="${item.thumbnailUrl}"></img>`);
      });

      proxy.$refs.editorRef[data.currentIndex]?.setHtml(htmlArr.join("<br/>"));
      data.visible = false;
    };

    const confirmVideo = (val) => {
      console.log(data.pcData[data.currentIndex].textarea);

      const htmlArr = [];
      htmlArr.push(data.pcData[data.currentIndex].textarea);

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

    const openPic = (index) => {
      if (store.state.aliexpress.proSpu) {
        data.currentIndex = index;
        data.pictureInfo.sku = store.state.aliexpress.proSpu;
        data.pictureInfo.skutype = store.state.aliexpress.proSpuType;

        data.visible = true;
      } else {
        GjMessage.error("请先选择关联sku或spu");
      }
    };

    const openVideo = (index) => {
      if (store.state.aliexpress.proSpu) {
        data.currentIndex = index;
        data.pictureInfo.sku = store.state.aliexpress.proSpu;
        data.pictureInfo.skutype = store.state.aliexpress.proSpuType;
        data.videoVisible = true;
      } else {
        GjMessage.error("请先选择关联sku/spu");
      }
    };

    watch(
      () => props.editInfo,
      (newValue) => {
        console.log(newValue);
        if (JSON.stringify(newValue) != "{}") {
          data.editData = JSON.parse(JSON.stringify(newValue));

          data.pcData = data.editData.pcDescription.map((item, index) => {
            return {
              key: index + 1 + "",
              title: `Tab ${index + 1}`,
              textarea: item.description,
              descriptionPic: item.descriptionPic,
            };
          });

          proxy.$refs.editorRef.forEach((item, index) => {
            if (data.editData.pcDescription[index] != "") {
              item.setHtml(data.editData.pcDescription[index].description);
            }
          });

          if (data.editData.mobileDescription.length > 0) {
            data.wirelessData = data.editData.mobileDescription.map(
              (item, index) => {
                return {
                  key: index + 1 + "",
                  title: `Tab ${index + 1}`,
                };
              }
            );
          }
        }
      },
      { deep: true }
    );

    watch(
      () => props.dataView,
      (newValue) => {
        data.view = newValue;
      }
    );
    onMounted(() => {});

    return {
      handlePcAdd,
      handlePcDelete,
      handleWirelessAdd,
      handleWirelessDelete,
      edit,
      getResult,
      submitForm,
      ...toRefs(data),
      cancel,
      confirmVideo,
      openPic,
      openVideo,
      confirmPic,
      tabschang,
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
    padding: 12px 0 2px 0px;
    font-size: 14px;
    margin-bottom: 16px;
    font-weight: 600;
    .tip {
      font-size: 12px;
      color: #b3b4c1;
    }
  }

  .subtitle {
    color: #333659;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin-top: 17px;
    margin-bottom: 17px;
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
}
</style>
