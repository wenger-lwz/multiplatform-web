<template>
  <fullScreenDialog
    width="800px"
    height="92%"
    class="full_Dialog_ebay"
    title="上传视频"
    :dialogVisible="dialogVisible"
  >
    <template #title>
      <div class="dialog-title">
        <span>上传视频</span>
        <gj-button @click="cancel">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="detail-content">
        <div style="width: 180px">
          <gj-select
            placeholder="店铺"
            :trigger-props="{ autoFitPopupMinWidth: true }"
            v-model="shopId"
            allow-clear
            @change="getShopIdName"
            :class="wranText ? '' : 'shop-warn'"
          >
            <gj-option
              v-for="item in shopIdList"
              :value="item.shopId"
              :key="item.shopId"
              >{{ item.shopName }}</gj-option
            >
          </gj-select>
        </div>
        <div class="hot-text">
          <ul>
            <li class="hot-ico">
              <span class="hot-ico-item"
                ><SvgIcon svgClass="info" :width="12"></SvgIcon
              ></span>
              1.视频分辨率应该大于480P，时长小于301秒；
            </li>
            <li>
              2.视频支持的文件类型有wmv, avi, mpg, mpeg, 3gp, mov, mp4, flv,
              f4v, m4v, m2t, mts, rmvb, vob, mkv。
            </li>
          </ul>
        </div>
        <div class="imgbox">
          <div
            class="des-container-item-box"
            v-for="item in videList"
            :key="item"
          >
            <gj-image
              width="120"
              height="120"
              class="des-mover-img"
              :src="item.thumbnailUrl"
            >
              <template #extra>
                <div class="actions">
                  <span class="action left-mover">
                    <SvgIcon svgClass="drag" :width="12" />
                  </span>
                  <span class="action rigth-mover">
                    <SvgIcon
                      svgClass="eye"
                      :width="12"
                      @click="openImgView(item.thumbnailUrl)"
                    />
                  </span>
                </div>
              </template>
            </gj-image>
          </div>
          <div class="upload-btn image-box">
            <gj-button shape="round" @click="openModel('sp')"
              >添加视频
            </gj-button>
          </div>
        </div>
        <gj-image-preview :src="cutterImg" v-model:visible="visible" />
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <gj-button @click="cancel">取消</gj-button>
        <gj-button type="outline" @click="save" :loading="addLoading"
          >上传到Lazada</gj-button
        >
      </span>
    </template>
  </fullScreenDialog>
  <video-list
    v-model:visible="videoVisible"
    :showVideoLibrary="false"
    :showTreeSelect="false"
    @close="cancelVideo"
    @confirm="confirm"
  ></video-list>
</template>
<script>
import { reactive, toRefs, defineComponent, onBeforeMount } from "vue";
import fullScreenDialog from "@/pages/systemPages/published/components/fullScreenDialog.vue";
import videoList from "@/pages/systemPages/published/materialCenter/modal/video.vue";
// import { compatibilityCommonFun } from '../components/compatibilityInfo'
import { saveVideoInfo } from "@api/published/lazada.js";
import { getListingCommonShop } from "@/api/published/common";
import SvgIcon from "@/components/SvgIcon";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  emits: ["cancel", "tableUplod"],
  components: {
    fullScreenDialog,
    SvgIcon,
    videoList,
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
  },
  setup(props, { emit }) {
    const data = reactive({
      shopIdList: [],
      shopId: [],
      shopName: "",
      addLoading: false,
      cutterImg: "",
      visible: false,
      videList: [],
      videoVisible: false,
      wranText: true,
      type: "0",
    });

    const cancel = () => {
      emit("cancel");
    };
    const getShopIdName = (val) => {
      let current = data.shopIdList.filter((item) => item.shopId == val);
      data.shopName = current[0]?.shopName;
    };
    const getShopList = () => {
      getListingCommonShop({ platformCode: "LAZADA" }).then((res) => {
        data.shopIdList = res.data.map((item) => {
          return {
            shopId: item.shopId,
            shopName: item.shopName,
          };
        });
      });
    };
    const openModel = () => {
      data.videoVisible = true;
    };
    const save = () => {
      if (data.shopId.length == 0) {
        data.wranText = false;
        return GjMessage.warning("请选择店铺");
      } else {
        data.wranText = true;
        data.addLoading = true;
        let current = data.videList[0];
        let obj = {
          coverUrl: current.thumbnailUrl,
          description: current.description,
          fileName: current.content,
          platformCode: "LAZADA",
          shopId: data.shopId.toString(),
          gerpVideoId: current.resourceId,
          shopName: data.shopName,
          size: current.size,
          title: current.title,
          videoSource: data.type,
          videoUrl: current.originalUrl,
        };
        saveVideoInfo(obj)
          .then(() => {
            GjMessage.success("视频发布成功！");
          })
          .finally(() => {
            data.addLoading = false;
            emit("tableUplod");
          });
      }
    };
    const createFun = () => {};
    const cancelVideo = () => {
      data.videoVisible = false;
    };
    const openImgView = (val) => {
      data.visible = true;
      data.cutterImg = val;
    };
    const confirm = (val) => {
      val?.constructor === Object ? (data.type = 1) : (data.type = 2);
      if (data.type == 1) {
        data.videList[0] = val;
      } else {
        data.videList[0] = val[0];
      }
      data.videoVisible = false;
    };
    onBeforeMount(() => {
      getShopList();
    });
    return {
      ...toRefs(data),
      cancel,
      save,
      createFun,
      getShopList,
      openImgView,
      openModel,
      cancelVideo,
      confirm,
      getShopIdName,
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
      margin-top: -15px;
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
