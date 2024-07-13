<!-- 视频设置 -->
<template>
  <div class="image">
    <div class="type mb16">
      <SvgIcon svgClass="video" :width="18" style="margin-right: 8px" />
      <span>视频</span>
    </div>
    <div class="subTitle"><span class="tips">上传视频</span></div>
    <gj-button type="primary" size="small" @click="open">素材中心</gj-button>

    <div class="list" style="padding: 12px 0">
      <div
        class="item mb16"
        v-for="(item, index) in data.imageList"
        :key="index"
      >
        <SvgIcon
          svgClass="drag"
          :width="18"
          style="margin-top: 1px; margin-right: 8px"
        />
        <SvgIcon
          svgClass="video"
          :width="18"
          style="margin-top: 1px; margin-right: 8px"
        />
        <span class="imgName">{{ item.name }}</span>
        <span class="num">
          <SvgIcon svgClass="linkIcon" :width="18" style="margin-left: 8px" />
          <SvgIcon
            svgClass="closeIcon"
            :width="18"
            style="margin-left: 8px"
            @click="delectVideo(index)"
          />
        </span>
      </div>
    </div>
    <video-list
      :visible="videoVisible"
      :sku="pictureInfo.sku"
      :skutype="pictureInfo.skutype"
      :showVideoLibrary="false"
      @close="cancel('sp')"
      @confirm="confirm"
    ></video-list>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from "vue";
import SvgIcon from "@/components/SvgIcon";
import videoList from "@/pages/systemPages/published/materialCenter/modal/video.vue";

import { GjMessage } from "@gj/atom";
export default defineComponent({
  components: {
    SvgIcon,
    videoList,
  },
  name: "",
  props: {
    videoData: {
      type: Object,
      default: () => {},
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
  setup(props, { emit }) {
    const data = reactive({
      data: props.videoData,
      videoVisible: false,
      pictureInfo: {
        sku: "",
        skuType: "",
      },
      spu: props.spu,
      specsType: props.specsType,
    });

    const delectVideo = (index) => {
      emit("delectVideo", index);
    };

    const open = () => {
      if (data.spu) {
        data.pictureInfo.sku = data.spu;
        data.pictureInfo.skuType = data.specsType;
        data.videoVisible = true;
      } else {
        GjMessage.error("请先选择关联sku或spu");
      }
    };

    const confirm = (val) => {
      data.videoVisible = false;
      data.data.videoList[0] = {
        url: val.thumbnailUrl,
        name: val.content,
        videoUrl: val.originalUrl,
      };
      // data.videourl = val.originalUrl
      // data.videoInfo = { ...val }
      console.log(val);
    };

    const cancel = () => {
      data.videoVisible = false;
    };

    watch(
      () => props.videoData,
      (newvalue) => {
        data.data = newvalue;
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
      delectVideo,
      ...toRefs(data),
      open,
      confirm,
      cancel,
    };
  },
});
</script>
<style scoped lang="scss">
@import "../template.scss";
.imgName {
  display: inline-block;
  width: 150px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upload {
  width: 272px;
  min-height: 72px;
  background: #fafafb;
  border: 1px solid #e6e6ed;
  padding-bottom: 14px;
  padding-right: 12px;
  box-sizing: border-box;
  .top {
    display: flex;
    min-height: 16px;
    align-items: center;
    // justify-content: center;
    margin-left: 24px;
    margin-top: 28px;
    margin-bottom: 13px;
    span {
      flex: 1;
    }
  }
}
</style>
