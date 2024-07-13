<template>
  <div>
    <video
      id="refVideoJsItem"
      class="video-js vjs-default-skin box"
      controls
      muted
      preload="auto"
    >
      <source
        src="https://video.ebaycdn.net/videos/v1/16b4cf701800a9f514e380ffffffd5a2/playlist.m3u8"
        type="application/x-mpegURL"
      />
    </video>
    <gj-button @click="visible = true">add</gj-button>
    <titleMo v-model:visible="visible" @confirm="add"></titleMo>
  </div>
</template>

<script>
import Video from "video.js";
import video_zhCN from "video.js/dist/lang/zh-CN.json";
import video_en from "video.js/dist/lang/en.json";
import "video.js/dist/video-js.css";
// import 'videojs-contrib-hls'
import titleMo from "./modal/video.vue";

export default {
  components: {
    titleMo,
  },
  name: "VideoJsItem",
  props: {
    videoSrc: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      Video.addLanguage("zh-CN", video_zhCN);
      Video.addLanguage("en", video_en);
      Video("refVideoJsItem", {
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
    });
  },
  methods: {
    add(val) {
      console.log(val);
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>
