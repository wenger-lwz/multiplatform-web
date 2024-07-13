<template>
  <div class="image-info" id="image-lz">
    <h2 class="title mb16">图片视频</h2>
    <gj-form
      ref="ProductImage"
      :model="productImage"
      class="image-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div class="squre-line mb16">
        <div class="image-tips mb16">
          产品图片<span
            >(图片可用来作为平台商品的封面图，所有图片皆可成为平台主图)</span
          >
        </div>
        <div class="image-list">
          <gb-upload-image
            class="add-img"
            :upload-data="{ categoryId: 3 }"
            :file-list-data="productImage.fileList"
            :is-disabled-dragg="false"
            :is-material-center="true"
            @onSuccessCallback="onSuccessCallback"
            @onSetMaterialCenterImg="onSetMaterialCenterImg"
          >
            <template #bottomText>添加图片</template>
          </gb-upload-image>
        </div>
      </div>

      <div class="squre-line mb16">
        <div class="image-tips mb8">变体图片</div>
        <div class="mb0">
          <gj-row :gutter="48">
            <gj-col :span="8">
              <gj-form-item
                field="people"
                :label-col-style="{ 'justify-content': 'flex-start' }"
                label="主属性名称"
              >
                <gj-select
                  v-model="productImage.people"
                  placeholder="请选择"
                  allow-clear
                  @change="getAttRList"
                >
                  <gj-option
                    v-for="item in attrList"
                    :key="item.id"
                    :value="item.id"
                    >{{ item.attrName }}</gj-option
                  >
                </gj-select>
              </gj-form-item>
            </gj-col>
          </gj-row>
        </div>
        <div
          class="value-image-list"
          v-for="(item, index) in productImage.valueImageList"
          :key="index"
        >
          <div class="mb16">
            {{ item.attrValue ? item.attrValue : "--" }}({{
              `${item.listImg.length}张`
            }})
          </div>

          <div
            class="image-list"
            :class="
              index !== productImage.valueImageList.length - 1 ? 'mb12' : ''
            "
          >
            <div class="image-list" v-for="img in item.listImg" :key="img">
              <div class="image-box">
                <gj-image width="120" :src="img.resource" />
              </div>
            </div>
            <div class="upload-btn image-box">
              <gj-button shape="round" @click="openModel('tp', 'sx', index)">
                添加图片
              </gj-button>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="squre-line mb16" v-if="imgThumbnailShow">
        <div class="image-tips mb8">变体图片</div>
        <div class="mb0">
          <p class="sub-title">属性值1</p>
          <gb-upload-image
            :code="200"
            :upload-data="{ categoryId: 3 }"
            :file-list-data="fileList1"
            :is-disabled-dragg="false"
            :is-disabled-set-main="true"
            :interfaceMethod="getListExport"
            @onSuccessCallback="onSuccessCallback"
          >
          </gb-upload-image>
          <gj-row :gutter="48">
            <gj-col :span="8">
              <gj-form-item
                field="people"
                :label-col-style="{ 'justify-content': 'flex-start' }"
                label="主属性名称"
              >
                <gj-select
                  v-model="productImage.people"
                  placeholder="请选择"
                  allow-clear
                  @change="getAttRList"
                >
                  <gj-option
                    v-for="item in attrList"
                    :key="item.id"
                    :value="item.id"
                    >{{ item.attrName }}</gj-option
                  >
                </gj-select>
              </gj-form-item>
            </gj-col>
          </gj-row>
        </div>
        <div
          class="value-image-list"
          v-for="(item, index) in valueImageList"
          :key="index"
        >
          <div class="mb16">{{ item.name }}（8张）</div>
          <div
            class="image-list"
            :class="index !== valueImageList.length - 1 ? 'mb12' : ''"
          >
            <div class="image-box" v-for="it in 8" :key="it"></div>
            <div class="upload-btn image-box">本地上传</div>
          </div>
        </div>
      </div> -->
      <div class="squre-line mb16">
        <div class="image-tips mb16">商品视频</div>
        <!-- <div class="image-list">
          <div class="image-list" v-if="productImage.videoObj.length > 0">
            <div
              class="image-box"
              @click="openVideo(item.resource)"
              v-for="item in productImage.videoObj"
              :key="item.hashCode"
            >
              <SvgIcon
                svgClass="startVideo"
                class="open-video"
                :width="24"
              ></SvgIcon>
              <gj-image
                width="120"
                :preview="false"
                :src="item.videoCoverUrl"
              />
            </div>
          </div>
          <div class="upload-btn image-box">
            <gj-button shape="round" @click="openModel('sp')"
              >添加视频
            </gj-button>
          </div>
        </div> -->
        <VideoUrl ref="videoRef" pageType="draft" />
      </div>
    </gj-form>
  </div>

  <!-- 素材中心 -->
  <picture-list
    :visible="Visible"
    :sku="productImage.sku"
    :skutype="productImage.skutype"
    @close="cancel('tp')"
    @confirm="confirmImage"
  ></picture-list>
  <video-list
    :visible="videoVisible"
    :sku="productImage.sku"
    :skutype="productImage.skutype"
    :showVideoLibrary="false"
    @close="cancel('sp')"
    @confirm="confirm"
  ></video-list>
  <Video-modal v-model:visible="playerVisible" :src="productImage.vidoeSrc">
  </Video-modal>
</template>

<script>
import {
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
  computed,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { getListExport } from "@api/published/shopee.js";
import { GjMessage } from "@gj/atom";
// import SvgIcon from '@/components/SvgIcon';
import pictureList from "@/pages/systemPages/published/materialCenter/modal/picture.vue";
import videoList from "@/pages/systemPages/published/materialCenter/modal/video.vue";
import VideoModal from "@/components/VideoModal.vue";
import VideoUrl from "./common/VideoUrl.vue";

export default {
  components: {
    // SvgIcon,
    pictureList,
    videoList,
    VideoModal,
    VideoUrl,
  },
  setup() {
    const key = "productImage";
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const attrList = computed(() => {
      return store.getters.getgoodsData.attributeListL;
    });

    const data = reactive({
      [key]: {
        properThumbnail: "",
        people: "",
        vidoeImgSrc: "",
        vidoeSrc: "",
        videoObj: [],
        variantAttrs: [],
        fileList: [],
        proImages: [],
        valueImageList: [], //变体属性图片
      },
      imgThumbnailItem: [],
      imgThumbnailShow: false,
      valueImageList: [],
      getListExport,
      Visible: false,
      videoVisible: false,
      playerVisible: false,
      fileList1: [],
    });

    const onSuccessCallback = (val) => {
      console.log(val, "成功11111");
    };

    const cancel = (val) => {
      if (val == "tp") {
        data.Visible = false;
      } else {
        data.videoVisible = false;
      }
    };

    const openModel = (val, text, index) => {
      console.log(store.getters.getgoodsData, "store.getters.getgoodsData");
      if (text) {
        data.Visible = true;
        data.flag = index;
      } else {
        if (store.getters.getgoodsData.picture.value) {
          data.productImage.spu = store.getters.getgoodsData.picture.value;
          data.productImage.spuType = store.getters.getgoodsData.picture.type;
          if (val == "tp") {
            data.Visible = true;
          } else {
            data.videoVisible = true;
          }
        } else {
          GjMessage.error("请先选择关联sku或spu");
        }
      }
    };

    // 获取视频信息
    const confirm = (val) => {
      console.log(val, "val");
      data.videoVisible = false;
      data.Visible = false;
      let arr = val.map((item) => {
        return {
          vidoeImgSrc: item.thumbnailUrl,
          vidoeSrc: item.originalUrl,
          contentType: item.contentType,
          hashCode: item.hashcode,
          size: item.size,
          platformVideoId: item.resourceId,
          resource: item.originalUrl,
          videoUrl: item.originalUrl,
          width: item.width,
          height: item.height,
          videoCoverUrl: item.thumbnailUrl,
        };
      });
      data.vidoeSrc = arr[0].originalUrl;

      data["productImage"].videoObj = data["productImage"].videoObj.concat(arr);
    };

    const openVideo = (src) => {
      console.log(src, "src");
      data.vidoeSrc = src;
      nextTick(() => {
        data.playerVisible = true;
      });
    };

    const onSetMaterialCenterImg = () => {
      openModel("tp");
    };

    // 获取图片信息
    const confirmImage = (val) => {
      data.Visible = false;
      if (data.flag == null) {
        let arr = [];
        val.map((item) => {
          return arr.push({
            uid: item.resourceId || item.uid,
            name: item.content || item.content,
            url: item.originalUrl || item.url,
            contentType: item.contentType || null,
            hashCode: item.hashcode || null,
            height: item.height || null,
            mainImage: 0,
            resource: item.originalUrl || null,
            size: item.size || null,
            videoCoverUrl: null,
            width: item.width || null,
          });
        });
        data["productImage"].fileList =
          data["productImage"].fileList.concat(arr);
      } else {
        // 变体主属性图片
        data.productImage.valueImageList[data.flag].listImg = [val]
          .flat()
          .map((item) => {
            return {
              uid: item.resourceId || item.uid,
              name: item.content || item.content,
              url: item.originalUrl || item.url,
              contentType: item.contentType || null,
              hashCode: item.hashcode || null,
              height: item.height || null,
              mainImage: 0,
              resource: item.originalUrl || null,
              size: item.size || null,
              videoCoverUrl: null,
              width: item.width || null,
            };
          });
      }
    };

    // watch(()=> store.getters.getProperty,(val)=>{
    //   data.imgThumbnailItem = val?.imgThumbnailItem || []
    // })

    watch(
      () => store.getters.getParams?.productInfo?.productType,
      (val) => {
        data.imgThumbnailShow = val === 2 ? true : false;
      }
    );
    // watch(()=> data[key].properThumbnail,(val)=>{
    //   const item = data.imgThumbnailItem.find(item => item.name === data[key].properThumbnail)
    //   data.valueImageList = item?.options || []
    // })

    const setPageData = (aData) => {
      if (aData.proImages) {
        data[key].fileList = aData.proImages.map((item) => {
          return {
            uid: item.hashCode,
            name: item.resource,
            url: item.resource,
          };
        });
      }

      if (aData.videos.length > 0) {
        data["productImage"].videoObj = aData.videos;
      }
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "ProductImage");
    };

    const getAttRList = () => {
      attrList.value.map((item) => {
        if (data.productImage.people == item.id) {
          //当前选中的
          data.productImage.variantAttrs.push(item);
          let arr = item.list.map((i) => {
            return {
              attrValue: i,
              parentName: item.attrName,
              listImg: [
                {
                  contentType: "png",
                  hashCode: "0",
                  height: 0,
                  mainImage: false,
                  platformUrlFlag: false,
                  resource: "", //URL ID
                  size: 0,
                  width: 0,
                },
              ],
            };
          });
          data.productImage.valueImageList = arr;
        }
      });
    };

    return {
      ...toRefs(data),
      submitForm,
      setPageData,
      onSuccessCallback,
      cancel,
      openModel,
      confirm,
      openVideo,
      attrList,
      onSetMaterialCenterImg,
      confirmImage,
      getAttRList,
    };
  },
};
</script>

<style lang="scss" scoped>
.image-info {
  .title {
    padding: 16px 0 2px 0px;
    font-size: 14px;
    color: #000430;
    span {
      color: #b3b4c1;
      font-size: 12px;
    }
  }
  .image-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
</style>

<style lang="scss" scoped>
.open-video {
  display: none;
}
.mb8 {
  margin-bottom: 8px;
}
.mb12 {
  margin-bottom: 12px;
}
.mb16 {
  margin-bottom: 16px;
}
.squre-line {
  padding: 12px;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e6e6ed;
  border-radius: 8px;
}
.image-tips {
  font-size: 12px;
  span {
    color: #808197;
  }
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  .image-box {
    width: 120px;
    height: 120px;
    background: #ccc;
    border-radius: 6px;
    overflow: hidden;
  }
}

.sub-title {
  margin-bottom: 10px;
  color: #666883;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  .image-box {
    width: 120px;
    height: 120px;
    background: #fafafb;
    border-radius: 8px;
    text-align: center;
    line-height: 120px;
    position: relative;
    border: 1px solid #e6e6ed;
    .arco-btn {
      color: #0045f0;
    }
    &:hover {
      border: 1px solid #0045f0;
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
    .arco-btn:hover {
      background-color: #d9e3fd;
    }
    .arco-btn:active {
      color: #fff !important;
      background-color: #0045f0 !important;
    }
  }
  .image-box-graph {
    width: 120px;
    height: 120px;
    background: #ccc;
    border-radius: 6px;
    text-align: center;
    line-height: 120px;
    position: relative;
    border: 1px solid #fff;
    &:hover {
      border: 1px solid #0045f0;
      border-radius: 6px;
      box-sizing: content-box;
      .main-graph {
        display: inline-block;
        font-size: 24px;
        position: absolute;
        top: -52px;
        z-index: 100;
        span {
          display: inline-block;
          width: 120px;
          height: 24px;
          font-size: 12px;
          line-height: 24px;
          background: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          border-radius: 6px 6px 0px 0px;
          color: #0045f0;
        }
      }
    }
  }
}

/deep/.gj-skySelect {
  .arco-modal-body {
    height: inherit !important;
  }
}

/deep/.materialCenter-modal > .arco-modal-body {
  height: inherit !important;
}
/deep/.add-img .custom-upload {
  .media-btn {
    width: 80px;
    height: 32px;
    line-height: 32px;
    background: var(--color-secondary);
    color: #0045f0;
    border-radius: calc(32px * 0.5);
    top: 50%;
    margin-top: -16px;
    left: 50%;
    margin-left: -40px;
  }
  .local-box {
    display: none;
  }
}

/deep/.add-img .custom-upload .media-btn:hover {
  background: #d9e3fd;
}
/deep/.add-img .custom-upload .media-btn:active {
  color: #fff !important;
  background-color: #0045f0 !important;
  font-weight: normal;
}

/deep/.custom-list-picture .progress-wrap {
  display: none;
}
</style>
