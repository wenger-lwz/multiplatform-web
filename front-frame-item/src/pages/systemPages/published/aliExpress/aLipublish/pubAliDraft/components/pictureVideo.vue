<template>
  <div class="blockBox">
    <div class="title">
      <span class="text">图片视频</span>
      <span class="tip"
        >（将图片拖入框中，或者点击本地、相册、链接上传，拖动图片可调整顺序）</span
      >
    </div>
    <div class="boxWrap">
      <div class="squre-line">
        <gj-form
          ref="pictureVideoForm"
          :label-col-props="{ span: 24 }"
          :wrapper-col-props="{ span: 24 }"
          label-align="left"
          :rules="rules"
        >
          <gj-form-item
            field="productImage"
            :rules="[
              {
                required: true,
                validator: (value, cb) => validatorProductImage(value, cb),
              },
            ]"
          >
            <template #label>
              <div class="subTitle inline">
                <span class="text">产品图片</span>
                <span class="tip"
                  >（图片可用来作为平台商品的封面图，所有图片皆可成为平台主图）</span
                >
              </div>
            </template>

            <div class="infoList">
              <div v-if="proImageList.length > 0">
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
                          class="drag-image border8"
                          width="118"
                          height="118"
                          :src="element.resource"
                        >
                        </gj-image>
                        <div v-if="element.mainImage" class="drag-image-tag">
                          主图
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
          </gj-form-item>
        </gj-form>
      </div>

      <div class="squre-line">
        <div class="subTitle"><span class="text">营销图</span></div>
        <div class="markWrap">
          <div>
            <span class="tip">1:1白底图（不小于800*800）</span>
            <div class="">
              <div v-if="marketImageList[0]" class="drag-image-wrap">
                <gj-image
                  width="118"
                  height="118"
                  :key="index"
                  class="border8"
                  :src="marketImageList[0].resource"
                ></gj-image>
                <div class="actions-wrap">
                  <span class="actions">
                    <span class="action preview-handle">
                      <SvgIcon
                        svgClass="Showz"
                        :width="16"
                        @click="openImgView(marketImageList[0].resource)"
                      />
                    </span>
                    <span
                      class="action delete-handle"
                      @click="deleteMarkImage(0)"
                    >
                      <SvgIcon svgClass="close" :width="16" />
                    </span>
                  </span>
                </div>
              </div>
              <div class="image-box" v-else>
                <gj-button shape="round" @click="openModel(2, 0)"
                  >图片库
                </gj-button>
              </div>
            </div>
          </div>

          <div class="mf18">
            <span class="tip" style="display: block"
              >3:4场景图（不小于750*1000）</span
            >
            <div>
              <div v-if="marketImageList[1]" class="drag-image-wrap">
                <gj-image
                  width="118"
                  height="118"
                  :key="index"
                  class="border8 mr12"
                  :src="marketImageList[1].resource"
                ></gj-image>
                <div class="actions-wrap">
                  <span class="actions">
                    <span class="action preview-handle">
                      <SvgIcon
                        svgClass="Showz"
                        :width="16"
                        @click="openImgView(marketImageList[1].resource)"
                      />
                    </span>
                    <span
                      class="action delete-handle"
                      @click="deleteMarkImage(1)"
                    >
                      <SvgIcon svgClass="close" :width="16" />
                    </span>
                  </span>
                </div>
              </div>
              <div class="image-box" v-else>
                <gj-button shape="round" @click="openModel(2, 1)"
                  >图片库
                </gj-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- {{ customizedPic }} -->
      <!-- 变体图片 -->
      <div v-if="attr === 2 && customizedPic.length > 0" class="squre-line">
        <div class="subTitle"><span class="text">变体图片</span></div>
        <div
          v-for="(item, index) in customizedPic"
          :key="index"
          class="customizedWarp"
        >
          <div v-for="(item1, index1) in item.attrValues" :key="index1">
            <span class="tip">{{ item.zhName }}-{{ item1.zhName }}</span>
            <div class="infoList">
              <div v-if="item1.imageList.length > 0" class="drag-image-wrap">
                <div v-for="(item2, index2) in item1.imageList" :key="index2">
                  <gj-image
                    width="118"
                    height="118"
                    class="mr12 border8"
                    :src="item2"
                  ></gj-image>
                  <div class="actions-wrap">
                    <span class="actions">
                      <span class="action preview-handle">
                        <SvgIcon
                          svgClass="Showz"
                          :width="16"
                          @click="openImgView(item2)"
                        />
                      </span>
                      <span
                        class="action delete-handle"
                        @click="deleteAttrImage(index, index1, index2)"
                      >
                        <SvgIcon svgClass="close" :width="16" />
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="image-box" v-else>
                <gj-button shape="round" @click="openModel(3, item1)"
                  >图片库
                </gj-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="squre-line">
        <div class="subTitle">
          <span class="text">商品视频</span>
          <gj-popover>
            <SvgIcon svgClass="infoCircle" :width="12" class="ml4" />
            <template #content>
              <span class="videoTip">
                视频比例为1:1，3:4，9:16，时长30秒内，大小2GB 内，
                内容含商品主体，非PPT、无黑边、无水印、无中文等
              </span>
            </template>
          </gj-popover>
        </div>
        <div class="infoList">
          <div class="drag-image-wrap" v-if="videoInfo.thumbnailUrl">
            <gj-image
              width="118"
              :src="videoInfo.thumbnailUrl"
              :preview="false"
              class="border8"
              height="118"
            />
            <div class="actions-wrap">
              <span class="actions">
                <!-- <span class="action drag-handle">
                  <SvgIcon svgClass="drag" :width="14" />
                </span> -->
                <span class="action preview-handle">
                  <SvgIcon svgClass="Showz" :width="16" @click="playVideo" />
                </span>
                <span class="action delete-handle" @click="deleteVideo">
                  <SvgIcon svgClass="close" :width="16" />
                </span>
              </span>
            </div>
            <!-- <div class="actions-wrap" @click="playVideo">
              <span class="actions">
                <SvgIcon
                  svgClass="startVideo"
                  class="open-video"
                  :width="24"
                ></SvgIcon>
              </span>
            </div> -->
          </div>
          <div class="image-box" v-else>
            <gj-button shape="round" @click="openVideoModel()"
              >视频库</gj-button
            >
          </div>
        </div>
      </div>
    </div>
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
      :platform="''"
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
  ref,
  inject,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
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
    layoutData: {
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
    editInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const key = "pictureVideo";
    const shopId = inject("shopId");
    const specsType = inject("specsType");
    const draftSpu = inject("draftSpu");
    const customizedPic = inject("customizedPic");
    let productImages = ref([]);
    const endImage = [
      {
        resource: null,
        contentType: "button",
      },
    ];
    const data = reactive({
      playerUrl: "",
      previewImgSrc: "",
      previewVisible: false,
      attr: props.attr,
      customizedPic: [],
      visible: false,
      videoVisible: false,
      playerVisible: false,
      pictureInfo: {
        skutype: specsType.value,
        shopId: shopId.value,
        sku: draftSpu.value,
      },
      videoInfo: {},
      proImageList: [], //产品图
      marketImageList: [], //营销图
      attrImageList: [], //变体图
      imageType: "", //当前操作的图片类型 1产品图,2营销图,3变体图
      attrImageId: "", //当前操作变体图片类型
      marketType: 0, //营销图片类型
      // attrImageList: [], //变体图片
      editData: props.editInfo,
    });
    const submitForm = () => {
      let images = [];
      // productImages.value.push({
      //   mainImage: true,
      //   resource:
      //     'https://gerp-shenzhen-material.oss-cn-shenzhen.aliyuncs.com/dev/images/200/2022-05-05/e1b3132d8bbb4dd6b6357cc1e049a471_thumbnail.png',
      // })
      if (productImages.value.length > 0) {
        productImages.value[0].mainImage = true;
        // productImages.value[0].resource =
        //   'https://gerp-shenzhen-material.oss-cn-shenzhen.aliyuncs.com/dev/images/200/2022-05-05/e1b3132d8bbb4dd6b6357cc1e049a471_thumbnail.png'
        images.push({
          aliexpressResources: [...productImages.value],
          imageType: 1,
        });
      }
      if (data.marketImageList.length > 0) {
        if (data.marketImageList[0]) {
          images.push({
            aliexpressResources: [data.marketImageList[0]],
            imageType: 2,
            imageProperty: 1,
          });
        }
        if (data.marketImageList[1]) {
          images.push({
            aliexpressResources: [data.marketImageList[1]],
            imageType: 2,
            imageProperty: 2,
          });
        }
      }

      if (data.customizedPic.length > 0) {
        let aliexpressResources = [];
        data.customizedPic.forEach((item) => {
          item.attrValues.forEach((item1) => {
            if (item1.imageList.length > 0) {
              aliexpressResources.push({
                attrName: item.zhName,
                attrNameId: item.id,
                attrValue: item1.zhName,
                attrValueId: item1.id,
                attrValueDefinitionName: item1.attrValueDefinitionName,
                mainImage: false,
                resource: item1.imageList[0],
              });
            }
          });
        });
        images.push({
          aliexpressResources: aliexpressResources,
          imageType: 3,
        });
      }

      return setForm2(
        proxy,
        key,
        {
          aliexpressImages: images,
          videoUrl: data.videoInfo?.originalUrl,
          videoPic: data.videoInfo?.thumbnailUrl,
        },
        "pictureVideoForm"
      );
    };

    const cancel = (val) => {
      if (val == "tp") {
        data.visible = false;
      } else {
        data.videoVisible = false;
      }
    };

    const confirm = (val) => {
      if (Array.isArray(val)) {
        val = val[0];
      }

      data.videoVisible = false;
      // data.videourl = val.originalUrl
      data.videoInfo = { ...val };
      console.log(data.videoInfo);
    };

    const deleteVideo = () => {
      data.playerUrl = "";
      data.videoInfo = {};
    };

    watch(
      () => productImages,
      (n) => {
        data.proImageList = n.value.concat(endImage);
      },
      {
        deep: true,
        immediate: true,
      }
    );

    const confirmPic = (val) => {
      data.visible = false;
      if (data.imageType === 1) {
        val.forEach((element) => {
          productImages.value.push({
            mainImage: false,
            resource: element.originalUrl,
          });
        });
      } else if (data.imageType === 2) {
        if (data.marketType === 0) {
          data.marketImageList[0] = {
            mainImage: false,
            resource: val[0].originalUrl,
          };
        } else {
          data.marketImageList[1] = {
            mainImage: false,
            resource: val[0].originalUrl,
          };
        }
      } else if (data.imageType === 3) {
        data.customizedPic.forEach((item) => {
          if (item.attrValues) {
            item.attrValues.forEach((item1) => {
              if (item1.id === data.attrImageId) {
                item1.imageList = [];
                item1.imageList.push(val[0].originalUrl);
              }
            });
          }
        });
      }
    };

    const openModel = (type, item) => {
      if (draftSpu.value) {
        data.pictureInfo.sku = draftSpu.value;
        data.pictureInfo.skutype = specsType.value;

        data.visible = true;
        data.imageType = type;

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
      if (draftSpu.value) {
        data.pictureInfo.sku = draftSpu.value;
        data.pictureInfo.skutype = specsType.value;
        data.videoVisible = true;
      } else {
        GjMessage.error("请先选择关联sku/spu");
      }
    };

    const openImgView = (src) => {
      data.previewImgSrc = src;
      data.previewVisible = true;
    };

    const deleteProductImage = (index) => {
      productImages.value.splice(index, 1);
    };

    const deleteMarkImage = (index) => {
      data.marketImageList[index] = "";
    };

    const deleteAttrImage = (index, index1, index2) => {
      data.customizedPic[index]?.attrValues[index1]?.imageList.splice(
        index2,
        1
      );
    };

    const playVideo = () => {
      data.playerVisible = true;
      data.playerUrl = data.videoInfo?.originalUrl;
    };
    const validatorProductImage = (value, cb) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (productImages.value.length === 0) {
            cb("请选择产品图片");
          } else if (productImages.value.length > 6) {
            cb("最多上传6张图片");
          }

          resolve();
        }, 0);
      });
    };
    watch(
      () => props.attr,
      (newValue) => {
        data.attr = newValue;
      }
    );

    watch(
      () => customizedPic.value,
      (newvalue) => {
        data.customizedPic = JSON.parse(JSON.stringify(newvalue));
        data.customizedPic.forEach((item) => {
          if (item.attrValues && item.attrValues.length > 0) {
            item.attrValues.forEach((item1) => {
              item1.imageList = [];
              data.attrImageList.forEach((item2) => {
                console.log(item1, item2);
                if (item1.id == item2.attrValueId) {
                  item1.imageList.push(item2.resource);
                }
              });
            });
          }
        });
      },
      { deep: true }
    );

    watch(
      () => props.editInfo,
      (newValue) => {
        if (JSON.stringify(newValue) != "{}") {
          data.editData = JSON.parse(JSON.stringify(newValue));

          data.videoInfo.thumbnailUrl = data.editData.videoPic;
          data.videoInfo.originalUrl = data.editData.videoUrl;

          data.editData.aliexpressImages.forEach((item) => {
            if (item.imageType === 1) {
              productImages.value = item.aliexpressResources;
            } else if (item.imageType === 2) {
              if (item.imageProperty === 1) {
                data.marketImageList[0] = item.aliexpressResources[0];
              } else {
                data.marketImageList[1] = item.aliexpressResources[0];
              }
              // data.marketImageList = item.aliexpressResources
            } else if (item.imageType === 3) {
              data.attrImageList = item.aliexpressResources;
            }
          });
          // }originalUrl,
        }
      },
      { deep: true }
    );

    const onMove = (e) => {
      if (e.relatedContext.element.contentType == "button") return false;
      if (e.draggedContext.element.contentType == "button") return false;
      return true;
    };
    return {
      submitForm,
      ...toRefs(data),
      cancel,
      openModel,
      confirm,
      confirmPic,
      openVideoModel,
      openImgView,
      deleteProductImage,
      deleteMarkImage,
      deleteAttrImage,
      playVideo,
      onMove,
      validatorProductImage,
      deleteVideo,
    };
  },
});
</script>
<style lang="scss" scoped>
.blockBox {
  .boxWrap {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
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

    .customizedWarp {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      .tip {
        display: block;
      }
    }
    .tip {
      font-size: 12px;
      color: #808197;
    }
  }

  .markWrap {
    display: flex;
  }
  .infoList {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .image-box {
    width: 118px;
    height: 118px;
    background: #ccc;
    border-radius: 6px;
    text-align: center;
    line-height: 118px;
    border: 1px solid #fff;

    &:hover {
      // border: 1px solid #0045f0;
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
  .open-video {
    display: none;
  }
}
.mf18 {
  margin-left: 18px;
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

  .drag-image {
    // border-radius: 8px;
  }
  &:hover {
    .actions-wrap {
      display: block;
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 4, 48, 0.3);
    z-index: 100;
    border-radius: 6px;
  }
}

// .videoImage {
//   /deep/.arco-image-img {
//     position: relative;
//     top: -2px;
//   }
// }

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
.border8 {
  border-radius: 8px;
  border: 1px solid #e6e6ed;
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
.inline {
  display: inline-block;
}
</style>
