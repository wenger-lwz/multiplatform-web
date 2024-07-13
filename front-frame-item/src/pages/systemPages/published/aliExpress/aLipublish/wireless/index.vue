<!-- 无线端详描 -->
<template>
  <fullScreenDialog :dialogVisible="visible">
    <template #title>
      <div class="dialog-title">
        <span>无线详描</span>
        <gj-button @click="cancel" shape="round">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="wrap">
        <div class="moduleList">
          <div class="addModule mb24">
            <div class="title mb16">添加模块</div>
            <div
              class="item"
              v-for="(item, index) in addModule"
              :key="index"
              draggable="true"
              @dragstart="dragstart($event, item.type)"
              @dragend="dragend"
            >
              <SvgIcon
                :svgClass="svgObj[item.type]"
                :width="14"
                style="margin-top: 1px"
              />
              <span class="word">{{ item.name }}</span>
              <span class="num" v-if="item.type !== 'video'"
                >{{ usageCount[item.type] }}/30</span
              >
              <span class="num" v-if="item.type === 'video'"
                >{{ usageCount[item.type] }}/1</span
              >
            </div>
          </div>
          <div class="useModule">
            <div class="title mb16">使用中的模块</div>
            <draggable :list="viewData">
              <template #item="{ element, index }">
                <div class="item">
                  <SvgIcon
                    svgClass="drag"
                    :width="12"
                    style="margin-top: 1px"
                  />
                  <span class="word">{{ element.name }}</span>
                  <span class="num">
                    <SvgIcon
                      svgClass="copyIcon"
                      :width="12"
                      style="vertical-align: middle"
                      @click="copyTem(index)"
                    />
                    <SvgIcon
                      svgClass="closeIcon"
                      :width="16"
                      style="margin-left: 8px; vertical-align: middle"
                      @click="deleteTem(index)"
                    />
                  </span>
                </div>
              </template>
            </draggable>
          </div>
        </div>
        <div class="content">
          <div class="contentWrap">
            <div class="contentList" id="capture">
              <div
                class="dragArea mb16"
                v-if="showDropContent"
                :class="[showDropContent ? 'isactive' : 'disActive']"
                @drop="drop($event)"
                @dragover="dragover($event)"
                @dragleave="dragleave($event)"
              >
                拖拽左侧部件到此
              </div>

              <div
                v-for="(item, index) in viewData"
                :key="index"
                @click="handleClick(index)"
              >
                <!-- 文字 -->
                <dragText
                  v-if="item.type === 'text'"
                  :viewData="item"
                  :isActive="index === defaultSelect"
                  @copyTem="copyTem"
                  @deleteTem="deleteTem"
                ></dragText>

                <!-- 图片 -->
                <dragImage
                  v-if="item.type === 'image'"
                  :viewData="item"
                  :isActive="index === defaultSelect"
                  @copyTem="copyTem"
                  @deleteTem="deleteTem"
                ></dragImage>

                <!-- 图文 -->
                <dragTextAndImage
                  v-if="item.type === 'textAndImage'"
                  :viewData="item"
                  :isActive="index === defaultSelect"
                  @copyTem="copyTem"
                  @deleteTem="deleteTem"
                ></dragTextAndImage>

                <!-- 视频 -->
                <dragVideo
                  v-if="item.type === 'video'"
                  :viewData="item"
                  :isActive="index === defaultSelect"
                  @copyTem="copyTem"
                  @deleteTem="deleteTem"
                ></dragVideo>

                <div
                  class="dragArea mb16"
                  v-if="showDropContent"
                  :class="[showDropContent ? 'isactive' : 'disActive']"
                  @drop="drop($event, index)"
                  @dragover="dragover($event)"
                  @dragleave="dragleave($event)"
                >
                  拖拽左侧部件到此
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="operation">
          <!-- 设置文字 -->
          <setText
            :textData="viewData?.[defaultSelect]"
            v-if="selectType === 'text'"
          ></setText>

          <!-- 设置图片 -->
          <setImage
            :imageData="viewData?.[defaultSelect]"
            v-if="selectType === 'image'"
            @delectImg="delectImg"
            :spu="spu"
            :specsType="specsType"
          ></setImage>

          <!-- 设置图文 -->
          <setTextAndImage
            v-if="selectType === 'textAndImage'"
            :textImageData="viewData?.[defaultSelect]"
            @delectImg="delectImg"
          ></setTextAndImage>

          <!-- 设置视频 -->
          <setVideo
            :videoData="viewData?.[defaultSelect]"
            v-if="selectType === 'video'"
            @delectVideo="delectVideo"
            :spu="spu"
            :specsType="specsType"
          ></setVideo>
        </div>
        <gj-image-preview
          :src="previewImgSrc"
          v-model:visible="previewVisible"
        />
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <gj-button @click="cancel">取消</gj-button>
        <gj-button @click="view" :loading="loading">预览</gj-button>
        <gj-button @click="save">保存</gj-button>
        <gj-button type="primary" @click="goBack">返回商品发布页</gj-button>
      </span>
    </template>
  </fullScreenDialog>
  <!-- </gj-modal> -->
</template>
<script>
import { defineComponent, reactive, toRefs, computed, watch } from "vue";
// import operation from './components/operation.vue'
import setText from "./components/setText.vue";
import dragText from "./components/dragText.vue";

import dragImage from "./components/dragImage";
import setImage from "./components/setImage";

import dragTextAndImage from "./components/dragTextAndImage.vue";
import setTextAndImage from "./components/setTextAndImage.vue";

import dragVideo from "./components/dragVideo.vue";
import setVideo from "./components/setVideo.vue";
import SvgIcon from "@/components/SvgIcon";
import { useStore } from "vuex";
import draggable from "vuedraggable";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
import html2canvas from "html2canvas";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  name: "",
  props: {
    viewData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    specsType: {
      type: Number,
      default: () => {
        return 1;
      },
    },
    spu: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  components: {
    dragText,
    setText,
    dragImage,
    setImage,
    dragTextAndImage,
    setTextAndImage,
    dragVideo,
    setVideo,
    SvgIcon,
    draggable,
    fullScreenDialog,
  },
  setup(props, { emit }) {
    const store = new useStore();
    const data = reactive({
      loading: false,
      previewImgSrc: "",
      previewVisible: false,
      // visible: store.getters.getWirelessVisible,
      visible: false,
      showDropContent: false, //显示中间可拖拽放置的位置
      active: false,
      viewData: props.viewData,
      svgObj: {
        text: "document",
        image: "imgIcon",
        textAndImage: "textAndImg",
        video: "video",
      },
      addModule: [
        {
          type: "text",
          name: "文字",
        },
        {
          type: "image",
          name: "图片",
        },
        // {
        //   type: "textAndImage",
        //   name: "图文",
        // },
        {
          type: "video",
          name: "视频",
        },
      ],
      dragObject: {
        //拖拽所需要添加的类型
        text: {
          type: "text",
          name: "文字",
          title: "HERE IS THE TITLE",
          content:
            "Describe the details of the selling point or other information,attracting and providing trust to your potential users.Describe the details of the selling point or other information,attracting and providing trust to your potential users.",
          wordColor: "#333",
          wordWeight: 500,
          wordAlign: "left",
          wordSize: "12px",
          titleColor: "#333",
          titleWeight: 700,
          titleAlign: "left",
          titleSize: "12px",
        },
        image: {
          type: "image",
          name: "图片",
          imageList: [],
          clearGap: false,
        },
        textAndImage: {
          type: "textAndImage",
          name: "图文",
          title: "HERE IS THE TITLE",
          content:
            "Describe the details of the selling point or other information,attracting and providing trust to your potential users.Describe the details of the selling point or other information,attracting and providing trust to your potential users.",
          wordColor: "#333",
          wordWeight: 500,
          wordAlign: "left",
          wordSize: "12px",
          titleColor: "#333",
          titleWeight: 700,
          titleAlign: "left",
          titleSize: "12px",
          imageList: [],
          clearGap: false,
        },
        video: {
          type: "video",
          name: "视频",
          videoList: [],
        },
      },
      usageCount: {
        text: 0,
        image: 0,
        textAndImage: 0,
        video: 0,
      },
      defaultSelect: 0, //默认选中模块
      dragging: "",
      spu: props.spu,
      specsType: props.specsType,
    });

    const dragstart = (event, type) => {
      data.showDropContent = true;
      event.dataTransfer.setData("type", type);
      console.log("dragstart");
      console.log(type);
    };
    const dragend = () => {
      data.showDropContent = false;
      console.log("dragend");
    };

    const drop = (event, index) => {
      event.preventDefault();
      var type = event.dataTransfer.getData("type");
      if (
        (type !== "video" && data.usageCount[type] >= 30) ||
        (type === "video" && data.usageCount[type] >= 1)
      ) {
        return GjMessage.warning("已超出最大数量");
      } else {
        const tem = JSON.parse(JSON.stringify(data.dragObject[type]));

        data.usageCount[type]++;

        if (!index) {
          data.viewData.unshift(tem);
        } else {
          data.viewData.splice(index, 0, tem);
        }
      }
    };

    const dragover = (event) => {
      event.preventDefault();
      event.target.innerText = "放置模块";
    };
    const dragleave = (event) => {
      event.preventDefault();
      event.target.innerText = "拖拽左侧部件到此";
    };
    const dragenter = (event) => {
      event.preventDefault();
    };

    //当前点击模块
    const handleClick = (index) => {
      data.defaultSelect = index;
    };

    const deleteTem = (index = data.defaultSelect) => {
      //获取删除类型
      const type = data.viewData[index]["type"];

      //可使用剩余数量减1
      data.usageCount[type] = data.usageCount[type] - 1;

      data.viewData.splice(index, 1);

      // data.defaultSelect = data.defaultSelect - 1 > 0 ? data.defaultSelect - 1 : 0
      data.defaultSelect = 0;

      // console.log(data.defaultSelect)
    };

    const copyTem = (index = data.defaultSelect) => {
      //获取复制类型
      const type = data.viewData[index]["type"];
      if (data.usageCount[type] >= 30) {
        GjMessage.warning("仅支持mp4格式的视频！");
      } else {
        const tem = JSON.parse(JSON.stringify(data.viewData[index]));
        data.viewData.splice(index, 0, tem);

        data.usageCount[type]++;
      }
    };

    //删除图片
    const delectImg = (index) => {
      data.viewData?.[data.defaultSelect]?.imageList.splice(index, 1);
    };

    //删除视频
    const delectVideo = (index) => {
      data.viewData?.[data.defaultSelect]?.imageList.splice(index, 1);
    };

    //获取当前选中的模块的类型
    const selectType = computed(() => {
      if (data.viewData.length > 0) {
        return data.viewData[data.defaultSelect]
          ? data.viewData[data.defaultSelect]["type"]
          : "";
      } else {
        return "";
      }
    });

    const save = () => {
      emit("confirmMobile", data.viewData);
    };

    //使用中模块互换位置
    const handleDragStart = (item) => {
      data.dragging = item;
    };
    const handleDragEnd = () => {
      data.dragging = null;
    };
    //首先把div变成可以放置的元素，即重写dragenter/dragover
    const handleDragOver = (e) => {
      e.dataTransfer.dropEffect = "move"; // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    };
    const handleDragEnter = (e, item) => {
      e.dataTransfer.effectAllowed = "move"; //为需要移动的元素设置dragstart事件
      if (item === data.dragging) {
        return;
      }
      const newItems = [...data.viewData];
      console.log(newItems);
      const src = newItems.indexOf(data.dragging);
      const dst = newItems.indexOf(item);

      newItems.splice(dst, 0, ...newItems.splice(src, 1));

      data.viewData = newItems;
    };
    const cancel = () => {
      emit("cancel");
    };

    const goBack = () => {
      emit("goBack");
    };

    const view = () => {
      data.loading = true;
      getShareImgBase64()
        .then((res) => {
          data.previewImgSrc = res;
          data.previewVisible = true;
        })
        .finally(() => {
          data.loading = false;
        });
    };

    const getShareImgBase64 = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // #capture 就是我们要获取截图对应的 DOM 元素选择器
          html2canvas(document.querySelector("#capture"), {
            useCORS: true, // 【重要】开启跨域配置
            allowTaint: true, // 允许跨域图片
          }).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            console.log(imgData);
            resolve(imgData);
          });
        }, 300); // 这里加上 300ms 的延迟是为了让 DOM 元素完全渲染完成后再进行图片的生成
      });
    };
    watch(
      () => props.viewData,
      (newValue) => {
        data.viewData = newValue || [];
        if (data.viewData.length === 0) {
          data.usageCount = {
            text: 0,
            image: 0,
            textAndImage: 0,
            video: 0,
          };
        } else {
          data.usageCount = {
            text: newValue.filter((item) => item.type === "text").length,
            image: newValue.filter((item) => item.type === "image").length,
            textAndImage: newValue.filter(
              (item) => item.type === "textAndImage"
            ).length,
            video: newValue.filter((item) => item.type === "video").length,
          };
        }
      },
      { deep: true }
    );

    watch(
      () => store.state.aliexpress.wirelessVisible,
      (newValue) => {
        data.visible = newValue;
      }
    );

    watch(
      () => props.spu,
      (newValue) => {
        data.spu = newValue;
      }
    );

    watch(
      () => props.specsType,
      (newValue) => {
        data.specsType = newValue;
      }
    );
    return {
      drop,
      dragover,
      dragend,
      dragstart,
      dragleave,
      dragenter,
      handleClick,
      deleteTem,
      copyTem,
      selectType,
      delectImg,
      delectVideo,
      save,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragEnter,
      cancel,
      confirm,
      goBack,
      view,
      ...toRefs(data),
    };
  },
});
</script>
<style scoped lang="scss">
.wrap {
  font-size: 12px;
  height: 100%;
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  .moduleList {
    width: 224px;
    padding: 0 12px;
    box-sizing: border-box;
    .addModule,
    .useModule {
      .title {
        height: 16px;
        display: flex;
        align-items: center;
        font-weight: 700;
        font-size: 12px;
        margin: 16px 0;
      }
      .item {
        height: 28px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        cursor: all-scroll;
        background: #f2f2f5;
        margin-bottom: 16px;
        padding: 0 10px;
        box-sizing: border-box;
        .word {
          width: 31px;
          margin: 0 8px;
          color: #666;
        }
        .num {
          flex: 1;
          text-align: right;
          color: #666;
        }
      }
      .item:hover {
        background: #edf7ff;
      }
    }
  }
  .operation {
    width: 300px;
    box-sizing: border-box;
    // padding: 0 16px;
    padding-left: 16px;
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .contentWrap {
      border-right: 2px solid #eeeff0;
      border-left: 2px solid #eeeff0;
      width: 100%;
      .contentList {
        margin: 20px auto 0;
        max-width: 868px;
        width: 100%;
        min-height: calc(100vh - 133px);
        .dragArea {
          height: 118px;
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;

          font-size: 13px;
        }
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 142px;
    height: 48px;
    z-index: 1;
    background-color: #fff;
    .bd {
      display: flex;
      justify-content: right;
      .gj-button {
        color: #333 !important;
        border: 1px solid #e4e5e6 !important;
        border-radius: 2px;
        font-size: 12px;
        margin-left: 20px;
      }
    }
  }
}
.dialog-footer {
  button {
    margin-left: 12px;
  }
}
.isactive {
  background: #eef3fb;
  border: 1px dashed #1f6eef;
  color: #1f6eef;
}
.disactive {
  background: #ffffff;
  border: 1px dashed #d8dadd;
  color: #999;
}
.mb8 {
  margin-bottom: 8px;
}
.mb16 {
  margin-bottom: 16px;
}

.mb24 {
  margin-bottom: 24px;
}
</style>
