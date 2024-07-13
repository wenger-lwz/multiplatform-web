<template>
  <div class="squre-line mb16">
    <div class="video-btn mb8">Video URL</div>
    <div class="infoList">
      <div
        class="image-box drag-image-wrap"
        v-for="(item, index) in videoInfo.videoList"
        :key="index"
      >
        <gj-image width="120" :src="item.thumbnailUrl" :preview="false" />
        <div class="actions-wrap">
          <span class="actions">
            <span class="action preview-handle" v-if="item.resourceId">
              <SvgIcon
                svgClass="startVideo"
                :width="16"
                @click="playVideo(item)"
              />
            </span>
            <span class="action delete-handle" @click="deleteVideo(index)">
              <SvgIcon svgClass="close" :width="16" />
            </span>
          </span>
        </div>
      </div>
      <div class="upload-btn image-box">
        <gj-button shape="round" @click="openVideoModel">视频库</gj-button>
      </div>
    </div>
  </div>
  <video-list
    platform=""
    shopId=""
    :visible="videoVisible"
    :sku="videoInfo.dialogSku"
    :skutype="videoInfo.dialogSkuType"
    :showVideoLibrary="false"
    @close="cancel"
    @confirm="confirm"
  ></video-list>
  <Video-modal v-model:visible="playerVisible" :src="previewVideoUrl">
  </Video-modal>
</template>
<script>
import { reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { M_T } from "@/store/mutationsTypes";
import { GjMessage } from "@gj/atom";
import VideoModal from "@/components/VideoModal.vue";
import SvgIcon from "@/components/SvgIcon";
import videoList from "@/pages/systemPages/published/materialCenter/modal/video.vue";
export default {
  components: {
    VideoModal,
    SvgIcon,
    videoList,
  },
  props: {
    pageType: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const key = "videoInfo";
    const store = useStore();
    const data = reactive({
      [key]: {
        videoList: [],
        dialogSku: "",
        dialogSkuType: "",
      },
      previewVideoUrl: "",
      videoVisible: false,
      playerVisible: false,
    });

    const saveStoreData = () => {
      // 将数据保存store
      const params = {
        [key]: data[key],
      };
      store.commit(M_T.PARAMS_QUERY, params);
    };

    const openVideoModel = () => {
      const sku = store.getters.getParams?.productInfo.sku;
      const spu = store.getters.getParams?.productInfo.spu;
      const specsType = store.getters.getParams?.productInfo.specsType;
      if (sku || spu) {
        if (specsType === 2) {
          // 变体
          data[key].dialogSku = spu;
          data[key].dialogSkuType = "spu";
        } else {
          data[key].dialogSku = sku;
          data[key].dialogSkuType = "sku";
        }
        data.videoVisible = true;
      } else {
        GjMessage.warning("请先选择关联sku或spu");
      }
    };

    const setPageData = (respData) => {
      data[key].videoList = [];
      if (Array.isArray(respData.videoUrl) && respData.videoUrl.length > 0) {
        respData.videoUrl?.forEach((item) => {
          data[key].videoList.push({
            ...item,
            thumbnailUrl: item.videoCoverUrl,
          });
        });
      } else if (
        typeof respData.videoUrl === "object" &&
        respData.videoUrl?.resourceId
      ) {
        // 草稿的
        data[key].videoList[0] = {
          ...respData.videoUrl,
          thumbnailUrl: respData.videoUrl?.videoCoverUrl,
        };
      }
      saveStoreData();
    };

    const playVideo = (item) => {
      data.previewVideoUrl = item.resourceId;
      data.playerVisible = true;
    };

    const deleteVideo = (index) => {
      data[key].videoList.splice(index, 1);
      saveStoreData();
    };

    const cancel = () => {
      data.videoVisible = false;
    };

    const confirm = (val) => {
      data.videoVisible = false;
      if (Array.isArray(val)) {
        const temp =
          val?.map((item) => ({
            ...item,
            resourceId: item.originalUrl,
            resource: item.resourceId,
            videoCoverUrl: item.thumbnailUrl,
          })) || [];
        if (props.pageType) {
          data[key].videoList[0] = temp[0];
        } else {
          data[key].videoList = data[key].videoList.concat(temp);
        }
      } else {
        if (props.pageType) {
          data[key].videoList[0] = {
            ...val,
            videoCoverUrl: val.thumbnailUrl,
            resourceId: val.originalUrl,
            resource: val.resourceId,
          };
        } else {
          data[key].videoList.push({
            ...val,
            videoCoverUrl: val.thumbnailUrl,
            resourceId: val.originalUrl,
            resource: val.resourceId,
          });
        }
      }
      // 保存数据到store
      saveStoreData();
    };

    return {
      ...toRefs(data),
      openVideoModel,
      setPageData,
      playVideo,
      deleteVideo,
      cancel,
      confirm,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";

.infoList {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.drag-image-wrap {
  position: relative;
  .drag-image {
    // border-radius: 8px;
  }
  .action {
    // padding: 0px 4px;
    // font-size: 14px;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    background: #d9e3fd;
    color: #666883;
    border-radius: 20px;
    &:not(:first-child) {
      margin-left: 12px;
    }
  }
  .delete-handle {
    &:hover {
      color: #ff5c5c;
      background-color: #ffe7e7;
    }
    &:active {
      color: #fff;
      background-color: #ff5c5c;
    }
  }
  &:hover {
    .actions-wrap {
      display: block;
    }
    .arco-image {
      &:not(.arco-image-loading-error) {
        // border: 1px solid rgba(0, 69, 240, 0.8);
      }
    }
  }
  .actions-wrap {
    position: absolute;
    display: none;
    width: 120px;
    height: 120px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 4, 48, 0.3);
    z-index: 100;
    border-radius: 6px;
  }

  .actions {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    text-align: center;
    display: flex;
    justify-content: center;
    .action {
      // padding: 0px 4px;
      // font-size: 14px;
      height: 20px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;
      background: #d9e3fd;
      color: #666883;
      border-radius: 20px;
      &:not(:first-child) {
        margin-left: 12px;
      }
    }
    .delete-handle {
      &:hover {
        color: #ff5c5c;
        background-color: #ffe7e7;
      }
      &:active {
        color: #fff;
        background-color: #ff5c5c;
      }
    }
    .preview-handle {
      &:hover {
        background-color: #99b5f9;
      }
      &:active {
        color: #fff;
        background-color: #0045f0;
      }
    }
    .drag-handle {
      &:hover {
        cursor: move;
        background-color: #99b5f9;
      }
    }
  }
}

.image-box {
  width: 120px;
  height: 120px;
  background: #fafafb;
  border-radius: 6px;
  text-align: center;
  line-height: 120px;
  border: 1px solid #e6e6ed;
  overflow: hidden;

  &:hover {
    border-radius: 6px;
    box-sizing: content-box;
    border: 1px solid #0045f0;
    .open-video {
      display: inline-block;
      font-size: 24px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -15px;
      margin-top: -15px;
      z-index: 99;
    }
  }
}
.open-video {
  display: none;
}
</style>
