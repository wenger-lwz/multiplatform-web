<template>
  <div class="blockBox">
    <div class="title">
      <span class="text">图片视频</span>
      <!-- <span class="tip"
        >（将图片拖入框中，或者点击本地、相册、链接上传，拖动图片可调整顺序）</span
      > -->
    </div>
    <div class="content">
      <div class="squre-line">
        <div class="subTitle">
          <span class="text">产品图片</span>
          <span class="tip"
            >（图片可用来作为平台商品的封面图，所有图片皆可成为平台主图）</span
          >
        </div>
        <div class="infoList">
          <draggable
            tag="div"
            handle=".drag-handle"
            :list="proImageList"
            group="productImages"
            animation="300"
            class="content-draggable product-images-content-draggable"
            :move="onMove"
          >
            <template #item="{ element, index }">
              <div class="drag-image-wrap">
                <template v-if="index !== proImageList.length - 1">
                  <gj-image
                    class="drag-image"
                    width="118"
                    height="118"
                    :src="element.resource"
                  >
                  </gj-image>
                  <div v-if="element.mainImage" class="drag-image-tag">
                    主图
                  </div>
                  <div class="setButton" @click="setMainImage(index)">
                    <span v-if="!element.mainImage"> 设为主图 </span>
                    <div v-else>取消主图</div>
                  </div>
                  <div class="actions-wrap">
                    <span class="actions">
                      <span class="action drag-handle">
                        <SvgIcon svgClass="drag" :width="14" />
                      </span>
                      <span class="action preview-handle">
                        <SvgIcon
                          svgClass="Showz"
                          :width="16"
                          @click="openImgView(element.resource)"
                        />
                      </span>
                      <span
                        class="action delete-handle"
                        @click="deleteProductImage(index)"
                      >
                        <SvgIcon svgClass="close" :width="16" />
                      </span>
                    </span>
                  </div>
                </template>
                <div v-else class="image-box">
                  <gj-button shape="round" @click="openModel(1)"
                    >图片库
                  </gj-button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="squre-line">
        <div class="subTitle"><span class="text">营销图</span></div>
        <span class="tip">1:1白底图（不小于800*800）</span>
        <div class="infoList">
          <draggable
            tag="div"
            handle=".drag-handle"
            :list="whiteImageList"
            group="marketImage"
            animation="300"
            class="content-draggable product-images-content-draggable"
            :move="onMove"
          >
            <template #item="{ element, index }">
              <div class="drag-image-wrap">
                <template v-if="index !== whiteImageList.length - 1">
                  <gj-image
                    class="drag-image"
                    width="118"
                    height="118"
                    :src="element.resource"
                  >
                  </gj-image>
                  <!-- <div v-if="element.mainImage" class="drag-image-tag">
                    主图
                  </div> -->
                  <div class="actions-wrap">
                    <span class="actions">
                      <span class="action drag-handle">
                        <SvgIcon svgClass="drag" :width="14" />
                      </span>
                      <span class="action preview-handle">
                        <SvgIcon
                          svgClass="Showz"
                          :width="16"
                          @click="openImgView(element.resource)"
                        />
                      </span>
                      <span
                        class="action delete-handle"
                        @click="deleteWhiteImage(index)"
                      >
                        <SvgIcon svgClass="close" :width="16" />
                      </span>
                    </span>
                  </div>
                </template>
                <div v-else class="image-box">
                  <gj-button shape="round" @click="openModel(2, 0)"
                    >图片库
                  </gj-button>
                </div>
              </div>
            </template>
          </draggable>
        </div>

        <span class="tip" style="margin-top: 12px; display: block"
          >3:4场景图（不小于750*1000）</span
        >
        <div class="infoList">
          <draggable
            tag="div"
            handle=".drag-handle"
            :list="sceneImageList"
            group="sceneImage"
            animation="300"
            class="content-draggable product-images-content-draggable"
            :move="onMove"
          >
            <template #item="{ element, index }">
              <div class="drag-image-wrap">
                <template v-if="index !== sceneImageList.length - 1">
                  <gj-image
                    class="drag-image"
                    width="118"
                    height="118"
                    :src="element.resource"
                  >
                  </gj-image>
                  <div class="actions-wrap">
                    <span class="actions">
                      <span class="action drag-handle">
                        <SvgIcon svgClass="drag" :width="14" />
                      </span>
                      <span class="action preview-handle">
                        <SvgIcon
                          svgClass="Showz"
                          :width="16"
                          @click="openImgView(element.resource)"
                        />
                      </span>
                      <span
                        class="action delete-handle"
                        @click="deleteSceneImage(index)"
                      >
                        <SvgIcon svgClass="close" :width="16" />
                      </span>
                    </span>
                  </div>
                </template>
                <div v-else class="image-box">
                  <gj-button shape="round" @click="openModel(2, 1)"
                    >图片库
                  </gj-button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- {{ customizedPic }} -->
      <!-- 变体图片 -->
      <div v-if="attr === 2 && customizedPic.length > 0" class="squre-line">
        <div class="subTitle"><span class="text">变体图片</span></div>
        <div v-for="(item, i) in customizedPic" :key="i">
          <div v-for="(item1, i1) in item.attrValues" :key="i1">
            <span class="tip"
              >{{ item.zhName }}-{{ item1.zhName }}({{
                item1.imageList.length - 1
              }})</span
            >
            <div class="infoList">
              <draggable
                tag="div"
                handle=".drag-handle"
                :list="item1.imageList"
                :group="item.zhName + item1.zhName"
                animation="300"
                class="content-draggable product-images-content-draggable"
                :move="onMove"
              >
                <template #item="{ element, index }">
                  <div class="drag-image-wrap">
                    <template v-if="index !== item1.imageList.length - 1">
                      <gj-image
                        class="drag-image"
                        width="118"
                        height="118"
                        :src="element.resource"
                      >
                      </gj-image>
                      <!-- <div v-if="element.mainImage" class="drag-image-tag">
                        主图
                      </div> -->
                      <div class="actions-wrap">
                        <span class="actions">
                          <span class="action drag-handle">
                            <SvgIcon svgClass="drag" :width="14" />
                          </span>
                          <span class="action preview-handle">
                            <SvgIcon
                              svgClass="Showz"
                              :width="16"
                              @click="openImgView(element.resource)"
                            />
                          </span>
                          <span
                            class="action delete-handle"
                            @click="deleteAttrImage(i, i1, index)"
                          >
                            <SvgIcon svgClass="close" :width="16" />
                          </span>
                        </span>
                      </div>
                    </template>
                    <div v-else class="image-box">
                      <gj-button shape="round" @click="openModel(3, item1)"
                        >图片库
                      </gj-button>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </div>
      </div>
      <div class="squre-line">
        <div class="subTitle">
          <span class="text">商品视频</span>
          <gj-popover>
            <SvgIcon
              svgClass="infoCircle"
              :width="12"
              style="margin-left: 4px"
            />
            <template #content>
              <span
                style="
                  font-size: 12px;
                  color: #333659;
                  display: block;
                  width: 308px;
                "
              >
                视频比例为1:1，3:4，9:16，时长30秒内，大小2GB 内，
                内容含商品主体，非PPT、无黑边、无水印、无中文等
              </span>
            </template>
          </gj-popover>
        </div>
        <div class="infoList">
          <draggable
            tag="div"
            handle=".drag-handle"
            :list="videoUrls"
            group="videoUrls"
            animation="300"
            class="content-draggable product-images-content-draggable"
            :move="onMove"
          >
            <template #item="{ element, index }">
              <div class="drag-image-wrap">
                <template v-if="index !== videoUrls.length - 1">
                  <gj-image
                    class="drag-image"
                    width="118"
                    height="118"
                    :src="element.videoPic"
                  >
                  </gj-image>
                  <div class="actions-wrap">
                    <span class="actions">
                      <span class="action drag-handle">
                        <SvgIcon svgClass="drag" :width="14" />
                      </span>
                      <span class="action preview-handle">
                        <SvgIcon
                          svgClass="Showz"
                          :width="16"
                          @click="openVideoView(element.videoUrl)"
                        />
                      </span>
                      <span
                        class="action delete-handle"
                        @click="deleteVideo(index)"
                      >
                        <SvgIcon svgClass="close" :width="16" />
                      </span>
                    </span>
                  </div>
                </template>
                <div v-else class="image-box">
                  <gj-button shape="round" @click="openVideoModel()"
                    >视频库
                  </gj-button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <!-- <gj-button @click="baocun">baocun</gj-button> -->
    <gj-image-preview :src="previewImgSrc" v-model:visible="previewVisible" />
    <picture-list
      v-model:visible="visible"
      :sku="pictureInfo.sku"
      :skutype="pictureInfo.skutype"
      @close="cancel('tp')"
      @confirm="confirmPic"
      :minWidth="imageType == 2 && marketType == 1 ? 700 : 800"
      :minHeight="imageType == 2 && marketType == 1 ? 1000 : 800"
      :maxWidth="5000"
      :maxHeight="5000"
      :isLimitRatio="true"
      :imgExceeding="1"
    ></picture-list>
    <video-list
      :visible="videoVisible"
      :sku="pictureInfo.sku"
      :skutype="pictureInfo.skutype"
      :showVideoLibrary="false"
      @close="cancel('sp')"
      @confirm="confirm"
    ></video-list>

    <Video-modal v-model:visible="playerVisible" :src="playerUrl">
    </Video-modal>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
import pictureList from "@/pages/systemPages/published/materialCenter/modal/picture.vue";
import videoList from "@/pages/systemPages/published/materialCenter/modal/video.vue";
import Draggable from "vuedraggable";
import VideoModal from "@/components/VideoModal.vue";
export default defineComponent({
  components: {
    SvgIcon,
    pictureList,
    videoList,
    Draggable,
    VideoModal,
  },
  props: {
    editInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    attr: {
      type: Number,
      default: () => {
        return 2;
      },
    },
  },
  setup(props) {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const key = "pictureVideo";

    const data = reactive({
      playerVisible: false,
      playerUrl: "",
      attr: props.attr,
      customizedPic: [],
      visible: false,
      videoVisible: false,
      previewImgSrc: "",
      previewVisible: false,
      pictureInfo: {
        skutype: store.state.aliexpress.proSpuType,
        sku: store.state.aliexpress.proSpu,
      },
      proImageList: [
        {
          resource: null,

          contentType: "button",
        },
      ], //产品图
      whiteImageList: [
        {
          resource: null,

          contentType: "button",
        },
      ], //白底图
      sceneImageList: [
        {
          resource: null,

          contentType: "button",
        },
      ], //场景图
      attrImageList: [], //变体图
      imageType: "", //当前操作的图片类型 1产品图,2营销图,3变体图
      attrImageId: "", //当前操作变体图片类型
      marketType: 0, //营销图片类型  0是1/1  1是3/4
      videoUrls: [
        {
          resource: null,

          contentType: "button",
        },
      ],

      editData: props.editInfo,
    });
    const submitForm = () => {
      let images = [];

      if (data.proImageList.length > 1) {
        const newArr = [...data.proImageList];
        newArr.splice(newArr.length - 1);
        // data.proImageList[0].mainImage = true
        images.push({
          aliexpressResources: newArr,
          imageType: 1,
        });
      }

      if (data.whiteImageList.length > 1) {
        const newArr = [...data.whiteImageList];
        newArr.splice(newArr.length - 1);
        images.push({
          aliexpressResources: newArr,
          imageType: 2,
          imageProperty: 1,
        });
      }

      if (data.sceneImageList.length > 1) {
        const newArr = [...data.sceneImageList];
        newArr.splice(newArr.length - 1);
        images.push({
          aliexpressResources: newArr,
          imageType: 2,
          imageProperty: 2,
        });
      }

      if (data.customizedPic.length > 0) {
        let aliexpressResources = [];
        data.customizedPic.forEach((item) => {
          item.attrValues.forEach((item1) => {
            if (item1.imageList.length - 1 > 0) {
              const newArr = [...item1.imageList];
              newArr.splice(newArr.length - 1);

              newArr.forEach((element) => {
                aliexpressResources.push({
                  attrName: item.zhName,
                  attrNameId: item.id,
                  attrValue: item1.zhName,
                  attrValueId: item1.id,
                  attrValueDefinitionName: item1.attrValueDefinitionName,
                  mainImage: false,
                  resource: element.resource,
                });
              });

              // aliexpressResources.push({
              //   attrName: item.zhName,
              //   attrNameId: item.id,
              //   attrValue: item1.zhName,
              //   attrValueId: item1.id,
              //   attrValueDefinitionName: item1.attrValueDefinitionName,
              //   mainImage: false,
              //   resource: item1.imageList[0],
              // })
            } else {
              aliexpressResources.push({
                attrName: item.zhName,
                attrNameId: item.id,
                attrValue: item1.zhName,
                attrValueId: item1.id,
                attrValueDefinitionName: item1.attrValueDefinitionName,
                mainImage: false,
                resource: "",
              });
            }
          });
        });
        images.push({
          aliexpressResources: aliexpressResources,
          imageType: 3,
        });
      }
      const newVideoArr = [...data.videoUrls];
      newVideoArr.splice(newVideoArr.length - 1);

      console.log(images);
      console.log(newVideoArr);
      return setForm2(proxy, key, {
        images: images,
        videoUrls: newVideoArr,
      });
    };

    // const baocun = () => {
    //   submitForm()
    // }
    const cancel = (val) => {
      if (val == "tp") {
        data.visible = false;
      } else {
        data.videoVisible = false;
      }
    };

    const confirm = (val) => {
      if (!Array.isArray(val)) {
        val = [val];
      }
      data.videoVisible = false;
      val.forEach((item) => {
        data.videoUrls.splice(data.videoUrls.length - 1, 0, {
          videoPic: item.thumbnailUrl,
          videoUrl: item.originalUrl,
        });
      });
    };

    const confirmPic = (val) => {
      data.visible = false;
      if (data.imageType === 1) {
        val.forEach((element) => {
          data.proImageList.splice(data.proImageList.length - 1, 0, {
            mainImage: false,
            resource: element.originalUrl,
          });
        });
      } else if (data.imageType === 2) {
        if (data.marketType === 0) {
          val.forEach((element) => {
            data.whiteImageList.splice(data.whiteImageList.length - 1, 0, {
              mainImage: false,
              resource: element.originalUrl,
            });
          });
        } else {
          val.forEach((element) => {
            data.sceneImageList.splice(data.sceneImageList.length - 1, 0, {
              mainImage: false,
              resource: element.originalUrl,
            });
          });
        }
      } else if (data.imageType === 3) {
        data.customizedPic.forEach((item) => {
          if (item.attrValues) {
            item.attrValues.forEach((item1) => {
              if (item1.id === data.attrImageId) {
                val.forEach((element) => {
                  // item1.imageList.push({
                  //   mainImage: false,
                  //   resource: element.originalUrl,
                  // })
                  item1.imageList.splice(item1.imageList.length - 1, 0, {
                    mainImage: false,
                    resource: element.originalUrl,
                  });
                });
              }
            });
          }
        });
      }
    };

    const openModel = (type, item) => {
      if (store.state.aliexpress.proSpu) {
        data.pictureInfo.sku = store.state.aliexpress.proSpu;
        data.pictureInfo.skutype = store.state.aliexpress.proSpuType;
        data.imageType = type;
        data.visible = true;
        if (type === 2) {
          data.marketType = item;
        }
        if (type === 3) {
          data.attrImageId = item.id ? item.id : "";
        }
      } else {
        GjMessage.error("请先选择关联sku或spu");
      }
    };

    const openVideoModel = () => {
      if (store.state.aliexpress.proSpu) {
        data.pictureInfo.sku = store.state.aliexpress.proSpu;
        data.pictureInfo.skutype = store.state.aliexpress.proSpuType;
        data.videoVisible = true;
      } else {
        GjMessage.error("请先选择关联sku/spu");
      }
    };

    const openImgView = (src) => {
      data.previewImgSrc = src;
      data.previewVisible = true;
    };

    const openVideoView = (src) => {
      data.playerUrl = src;
      data.playerVisible = true;
    };

    const deleteVideo = (index) => {
      data.videoUrls.splice(index, 1);
    };

    const deleteProductImage = (index) => {
      data.proImageList.splice(index, 1);
    };

    const deleteWhiteImage = (index) => {
      data.whiteImageList.splice(index, 1);
    };

    const deleteSceneImage = (index) => {
      data.sceneImageList.splice(index, 1);
    };

    const deleteAttrImage = (index, index1, index2) => {
      data.customizedPic[index]?.attrValues[index1]?.imageList.splice(
        index2,
        1
      );
    };

    const setMainImage = (index) => {
      data.proImageList[index].mainImage = !data.proImageList[index].mainImage;
    };

    const onMove = (e) => {
      if (e.relatedContext.element.contentType == "button") return false;
      if (e.draggedContext.element.contentType == "button") return false;
      return true;
    };

    watch(
      () => props.attr,
      (newValue) => {
        data.attr = newValue;
      }
    );

    watch(
      () => store.state.aliexpress.proCustomizedPic,
      (newvalue) => {
        data.customizedPic = JSON.parse(JSON.stringify(newvalue));
        data.customizedPic.forEach((item) => {
          if (item.attrValues && item.attrValues.length > 0) {
            item.attrValues.forEach((item1) => {
              item1.imageList = [
                {
                  resource: null,
                  contentType: "button",
                },
              ];
              data.attrImageList.forEach((item2) => {
                console.log(item1, item2);

                if (item1.id == item2.attrValueId) {
                  item1.imageList.splice(item1.imageList.length - 1, 0, {
                    resource: item2.resource,
                    mainImage: item2.mainImage,
                  });
                }
              });
            });
          }
        });
      },
      { deep: true }
    );

    watch(
      () => store.state.aliexpress.shopCode,
      (newValue) => {
        data.pictureInfo.shopId = newValue;
      }
    );

    watch(
      () => props.editInfo,
      (newValue) => {
        if (JSON.stringify(newValue) != "{}") {
          data.editData = JSON.parse(JSON.stringify(newValue));

          // data.editData.aliexpressVideos.forEach((item) => {
          //   data.videoUrls.splice(data.videoUrls.length - 1, 0, item)
          // })
          data.videoUrls = data.editData.aliexpressVideos.concat(
            data.videoUrls
          );

          data.editData.aliexpressImages.forEach((item) => {
            if (item.imageType === 1) {
              data.proImageList = item.aliexpressResources.concat(
                data.proImageList
              );
            } else if (item.imageType === 2) {
              if (item.imageProperty === 1) {
                data.whiteImageList = item.aliexpressResources.concat(
                  data.whiteImageList
                );
              } else {
                data.sceneImageList = item.aliexpressResources.concat(
                  data.sceneImageList
                );
              }
            } else if (item.imageType === 3) {
              data.attrImageList = item.aliexpressResources;
            }
          });
        }
      },
      { deep: true }
    );

    return {
      submitForm,
      ...toRefs(data),
      cancel,
      openModel,
      confirm,
      confirmPic,
      openVideoModel,
      onMove,
      openImgView,
      openVideoView,
      deleteVideo,
      deleteProductImage,
      deleteWhiteImage,
      deleteSceneImage,
      deleteAttrImage,
      // baocun,
      setMainImage,
    };
  },
});
</script>
<style lang="scss" scoped>
.blockBox {
  .content {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
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

    .infoList {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      .image-box {
        width: 118px;
        height: 118px;
        background: #ccc;
        border-radius: 6px;
        text-align: center;
        line-height: 118px;
        border: 1px solid #fff;
      }
    }
  }
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
}

.content-draggable {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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
:deep(.drag-image-wrap) {
  position: relative;
  .drag-image-tag {
    display: block;
  }
  .setButton {
    display: none;
  }
  .drag-image {
  }
  .arco-image {
    border-radius: 8px;
    border: 1px solid #e6e6ed;
  }
  &:hover {
    .setButton {
      display: block;
    }
    .actions-wrap {
      display: block;
    }
    .drag-image-tag {
      display: none;
    }
    .arco-image {
      border-radius: 8px;
      border: 1px solid #0045f0;
      &:not(.arco-image-loading-error) {
        // border: 1px solid rgba(0, 69, 240, 0.8);
      }
    }
  }
  .actions-wrap {
    position: absolute;
    display: none;
    width: 118px;
    height: 118px;
    top: 1px;
    left: 1px;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 4, 48, 0.3);
    z-index: 100;
    border-radius: 8px;
  }
}

:deep(.setButton) {
  color: #0045f0;
  padding: 5px 0px;
  text-align: center;
  position: absolute;
  width: 118px;
  top: 1px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.7);
  // border-radius: 0 0 4px 4px;
  border-radius: 8px 8px 0 0;
  z-index: 101;
  cursor: pointer;
}

:deep(.drag-image-tag) {
  color: #000430;
  padding: 0 4px;
  min-width: 24px;
  height: 18px;
  text-align: center;
  position: absolute;
  top: 1px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0 0 4px 4px;
  z-index: 100;
}
.mr12 {
  margin-right: 12px;
}
.ml4 {
  margin-left: 4px;
}
.videoTip {
  font-size: 12px;
  color: #333659;
  display: block;
  width: 308px;
}
</style>
