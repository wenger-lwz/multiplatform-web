<template>
  <fullScreenDialog
    :dialogVisible="dialogVisible"
    width="800px"
    height="92%"
    class="full_Dialog_ebay"
  >
    <template #title>
      <div class="dialog-title">
        <span>详情</span>
        <gj-button @click="cancel">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="detail-content">
        <div>
          <gj-space>
            <gb-select :placeholder="rowData?.shopName" disabled>
              <gb-select-option
                v-for="item in List"
                :value="item.shopId"
                :key="item.shopId"
                >{{ item.shopName }}
              </gb-select-option>
            </gb-select>
          </gj-space>
        </div>
        <gj-form :model="rowData" layout="vertical">
          <gj-form-item label="视频标题">
            <gj-input disabled :placeholder="rowData?.videoTitle" />
          </gj-form-item>

          <gj-form-item label="视频">
            <div class="image-box" @click="openVideo">
              <SvgIcon
                svgClass="startVideo"
                class="open-video"
                :width="24"
              ></SvgIcon>
              <gj-image
                width="120"
                height="120"
                :preview="false"
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655375430&t=dd73e0b5cd29c04d3483045bd2b43234"
              />
            </div>
          </gj-form-item>
          <gj-form-item label="视频描述">
            <gj-textarea
              disabled
              :auto-size="{ minRows: 3 }"
              :placeholder="rowData?.videoStateDesp"
            />
          </gj-form-item>
        </gj-form>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <gj-button @click="cancel">取消</gj-button>
      </span>
    </template>
  </fullScreenDialog>
  <Video-modal v-model:visible="playerVisible" :src="vidoeSrc"></Video-modal>
</template>
<script>
import { reactive, toRefs, defineComponent, onBeforeMount } from "vue";
import SvgIcon from "@/components/SvgIcon";
import VideoModal from "@/components/VideoModal.vue";
import fullScreenDialog from "@/pages/systemPages/published/components/fullScreenDialog.vue";
// import { getVideoDetails } from '@api/published/shopee.js';
export default defineComponent({
  name: "PubShopeeVideoLibraryDetails",
  emits: ["cancel"],
  components: {
    fullScreenDialog,
    VideoModal,
    SvgIcon,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    rowData: {
      //列数据
      type: Object,
      default: () => {
        return {};
      },
    },
    videoDetailId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      shopIdList: [],
      visible: false,
      videList: [],
      videoVisible: false,
      playerVisible: false,
      vidoeSrc: "",
      videoDetailId: props.videoDetailId,
    });

    const cancel = () => {
      emit("cancel");
    };

    const openVideo = () => {
      data.playerVisible = true;

      data.vidoeSrc =
        props.rowData?.platformVideoUrl ||
        "https://vd4.bdstatic.com/mda-kf9pnwkveajkhr1v/sc/mda-kf9pnwkveajkhr1v.mp4?v_from_s=hkapp-haokan-hna&auth_key=1652787276-0-0-a4bfb7cd1592d5a71e18bfd96bc45b97&bcevod_channel=searchbox_feed&pd=1&cd=0&pt=3&logid=0276586188&vid=12474773332681693692&abtest=101830_2-102148_1-17451_1&klogid=0276586188";
    };

    /* const getDetails = async (val) => {
      await getVideoDetails({ id: val }).then((res) => {
        data.videList = res.data;
        console.log(res.data, 'res.data');
      });
    }; */

    onBeforeMount(() => {
      console.log(props.videoDetailId, "props.videoDetailId");
      /* if (props.videoDetailId) {
        getDetails(props.videoDetailId);
      } */
    });

    return {
      ...toRefs(data),
      cancel,
      confirm,
      openVideo,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.gb-input-tag) {
  width: 300px !important;
}
.detail-content {
  margin: 16px;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;

  .arco-anchor {
    width: 100%;
  }
  .hot-text {
    background: #e8f3ff;
    margin-top: 16px;
    padding: 10px 33px;
  }
  .hot-ico {
    position: relative;
  }
  .hot-ico-item {
    position: absolute;
    left: -20px;
    top: 1px;
  }

  .imgbox {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 16px;
    padding-bottom: 5px;
  }
  .des-container-item-box {
    .des-mover-img {
      margin-right: 8px;
      margin-top: 5px;
    }
    .actions {
      display: none;
    }
    &:hover {
      .actions {
        display: inline-block;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
        box-sizing: border-box;
        border-radius: 3px;
        background: rgba(0, 4, 48, 0.3);
        position: absolute;
        top: -102px;
        left: 0;
        z-index: 20;
        // border: 1px solid #0045f0;
      }
      .action {
        padding: 0px 4px;
        font-size: 14px;
        cursor: pointer;
        background: #d9e3fd;
        border-radius: 20px;
      }
      .left-mover {
        margin-right: 6px;
      }
      .rigth-mover {
        margin-left: 6px;
      }
    }
  }
}
.open-video {
  position: absolute;
  left: 0px;
  top: -2px;
}
:deep(.arco-image-img) {
  vertical-align: bottom;
}
.image-box {
  width: 120px;
  height: 120px;
  background: #fff;
  border-radius: 6px;
  text-align: center;
  line-height: 120px;
  box-sizing: content-box;
  position: relative;
  top: 2px;
  border: 1px solid #c9cdd4;
  &:hover {
    border: 1px solid #99b5f9;
    box-sizing: content-box;
    border-radius: 6px;
    box-sizing: content-box;
    .open-video {
      display: inline-block;
      font-size: 24px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -15px;
      margin-top: -13px;
      z-index: 99;
    }
  }
}

:deep(.arco-space-item) > .shop-warn {
  border: 1px solid red;
}
.dialog-footer {
  background: #fff;

  button {
    margin-left: 12px;
  }
}
</style>
