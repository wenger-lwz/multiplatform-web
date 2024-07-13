<template>
  <gj-modal
    :visible="visible"
    modal-class="video-modal"
    width="976px"
    :render-to-body="false"
    :footer="false"
    @before-cancel="modalClose"
  >
    <template #title> 视频预览 </template>
    <video
      v-if="src"
      id="myVideo"
      :src="src"
      class="video-js vjs-big-play-centered"
    ></video>
  </gj-modal>
</template>

<script>
import { ref, nextTick, watch } from "vue";
import Video from "video.js";
import video_zhCN from "video.js/dist/lang/zh-CN.json";
import video_en from "video.js/dist/lang/en.json";
import "video.js/dist/video-js.css";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      default: "",
    },
    popupContainer: {
      type: String,
      default: "body",
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const videoNode = ref(null);

    const modalClose = () => {
      emit("update:visible", false);
    };

    watch(
      () => props.src,
      () => {
        if (!videoNode.value) {
          nextTick(() => {
            createdVideo();
          });
        } else {
          videoNode.value.src(props.src);
        }
      }
    );

    const createdVideo = () => {
      Video.addLanguage("zh-CN", video_zhCN);
      Video.addLanguage("en", video_en);
      videoNode.value = new Video(document.getElementById("myVideo"), {
        //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
        controls: true,
        // 视频封面图地址
        // poster: 'xxx',
        // 设置语言
        language: "zh-CN",
        autoplay: false,
        //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
        preload: "auto",
        //设置视频播放器的显示宽度（以像素为单位）
        width: "976px",
        //设置视频播放器的显示高度（以像素为单位）
        height: "549px",
        //  使用children的形式可以控制每一个控件的位置，以及显示与否
        // children: [],
      });
      videoNode.value.src(props.src);
    };

    return {
      modalClose,
    };
  },
};
</script>

<style lang="scss">
.video-modal {
  background: #000;
  .arco-modal-header {
    height: 32px;
    border: 0;
  }
  .arco-modal-close-btn,
  .arco-modal-title {
    color: #e6e6ed;
  }
  .arco-modal-body {
    padding: 0;
    border-radius: 0px 0px 10px 10px;
  }
  .arco-icon-hover:hover::before {
    background: #000;
  }
}
.video-js,
.video-js .vjs-tech {
  border-radius: 0px 0px 10px 10px;
}
.video-js .vjs-big-play-button {
  line-height: 1.63332em;
  border: 0;
  background: rgba(21, 21, 21, 0.85);
}
</style>
