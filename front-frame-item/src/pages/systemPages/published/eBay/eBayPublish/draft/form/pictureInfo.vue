<template>
  <div class="basic-info" id="pictureInfo-ebay">
    <h2 class="title">图片视频</h2>
    <gj-form
      ref="pictureInfoForm"
      :model="pictureInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="submitForm"
    >
      <!-- 产品图片 -->
      <div class="squre-line mb16">
        <div class="image-tips mb16">
          产品图片
          <span>
            (生成草稿时随机选取12张图片，其中封面图片会从标记为主图的图片中随机选取)</span
          >
        </div>

        <div class="image-list">
          <div
            class="image-box-graph"
            v-for="(falg, index) in pictureInfo.productImages"
            :key="falg"
          >
            <div class="main-graph">
              <p class="main-graph-top">
                <span @click="graphBtn(index)" v-if="!falg.mainImage"></span>
                <span
                  @click="cancelGraphBtn(index)"
                  v-if="falg.mainImage"
                ></span>
              </p>

              <p class="main-graph-bottom">
                <span @click="openImgView(falg.resource)">
                  <SvgIcon svgClass="previewIcon" :width="14"></SvgIcon>
                </span>
                <span @click="delOpenVideo(index, 'imgs')">
                  <SvgIcon svgClass="close" :width="14"></SvgIcon>
                </span>
              </p>
            </div>
            <div class="grap-item-zt" v-if="falg.mainImage">
              <p>主图</p>
            </div>
            <gj-image
              width="120"
              height="120"
              :preview="false"
              :src="falg.resource"
            />
          </div>
          <div class="upload-btn image-box">
            <gj-button shape="round" @click="openModel('tp')"
              >添加图片
            </gj-button>
          </div>
        </div>
      </div>
      <!-- 属性图片 -->
      <div
        class="squre-line mb16"
        v-show="$store.getters.getgoodsData.specsType == 2"
      >
        <div class="image-tips mb8">属性图片</div>
        <div class="mb0">
          <gj-row :gutter="48">
            <gj-col :span="8">
              <gj-form-item
                field="people"
                :label-col-style="{ 'justify-content': 'flex-start' }"
                label="主属性名称"
              >
                <gj-select
                  v-model="pictureInfo.people"
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
          v-for="(item, index) in pictureInfo.valueImageList"
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
              index !== pictureInfo.valueImageList.length - 1 ? 'mb12' : ''
            "
          >
            <div
              class="image-list"
              v-for="(img, indexImg) in item.listImg"
              :key="img"
            >
              <div class="image-box">
                <div class="open-video">
                  <span class="icoRigth" @click="openImgView(img?.resource)">
                    <SvgIcon svgClass="previewIcon" :width="14"></SvgIcon>
                  </span>
                  <span
                    class="icoRigth"
                    @click="delOpenImgView(index, indexImg)"
                  >
                    <SvgIcon svgClass="close" :width="14"></SvgIcon>
                  </span>
                </div>
                <gj-image width="120" height="120" :src="img.resource" />
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
      <!-- 橱窗视频 -->
      <div class="squre-line mb16">
        <div class="image-tips mb16">橱窗视频</div>
        <div class="image-list">
          <div
            class="image-list"
            v-for="(item, index) in pictureInfo.vidoeObj"
            :key="index"
          >
            <div class="image-box">
              <div class="open-video">
                <span class="icoRigth" @click="openVideo(item.videoUrl)">
                  <SvgIcon svgClass="startVideo" :width="14"></SvgIcon>
                </span>
                <span class="icoRigth" @click="delOpenVideo(index, 'video')">
                  <SvgIcon svgClass="close" :width="14"></SvgIcon>
                </span>
              </div>
              <gj-image
                width="120"
                height="120"
                :preview="false"
                :src="item.videoCoverUrl || ''"
              />
            </div>
          </div>
          <div class="upload-btn image-box">
            <gj-button shape="round" @click="openModel('sp')"
              >添加视频
            </gj-button>
          </div>
        </div>
      </div>
    </gj-form>
  </div>
  <!-- 素材中心 -->
  <picture-list
    v-model:visible="Visible"
    :sku="pictureInfo.sku"
    :skutype="pictureInfo.skutype"
    @close="cancel('tp')"
    @confirm="confirmPicture"
  ></picture-list>
  <video-list
    v-model:visible="videoVisible"
    :sku="pictureInfo.sku"
    :skutype="pictureInfo.skutype"
    :showVideoLibrary="false"
    @close="cancel('sp')"
    @confirm="confirm"
  ></video-list>
  <Video-modal v-model:visible="playerVisible" :src="pictureInfo.vidoeSrc">
  </Video-modal>
  <gj-image-preview :src="cutterImg" v-model:visible="visible" />
</template>

<script>
import { getCurrentInstance, reactive, toRefs, watch, computed } from "vue";
import { setForm } from "@/utils/fnBusiness";
import pictureList from "../../../../materialCenter/modal/picture.vue";
import videoList from "../../../../materialCenter/modal/video.vue";
import VideoModal from "@/components/VideoModal.vue";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
import SvgIcon from "@/components/SvgIcon";
export default {
  emits: ["setShowItemFun", "attrFun"],
  components: {
    pictureList,
    videoList,
    VideoModal,
    SvgIcon,
  },
  props: {
    actionType: {
      type: String,
      default: () => {
        return "";
      },
    },
    publicList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    goodsRowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    stroeCategoryId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const key = "pictureInfo";
    const attrList = computed(() => {
      return store.getters.getgoodsData.attributeListL;
    });
    const data = reactive({
      Visible: false,
      visible: false,
      videoVisible: false,
      playerVisible: false,
      type: "",
      cutterImg: "",
      pictureInfo: {
        people: "",
        vidoeImgSrc: "",
        vidoeSrc: "",
        productImages: [],
        vidoeObj: [],
        variantAttrs: [], //属性名
        valueImageList: [], //变体属性图片
      },

      flag: null,
      rules: {},
    });
    const submitForm = () => {
      return setForm(proxy, key, data[key], "pictureInfoForm");
    };
    const resetForm = () => {
      proxy.$refs.pictureInfoForm.resetFields();
    };

    const getAttRList = () => {
      attrList.value.map((item) => {
        if (data.pictureInfo.people == item.id) {
          //当前选中的
          data.pictureInfo.variantAttrs.push(item);
          let arr;
          if (item?.list == undefined) {
            arr = item.attrValues.map((i) => {
              return {
                attrValue: i.attrValue,
                parentName: item.attrName,
                listImg: i.attrImages,
              };
            });
          } else {
            arr = item.list.map((i) => {
              return {
                attrValue: i,
                parentName: item.attrName,
                listImg: [
                  // {
                  //   contentType: 'png',
                  //   hashCode: '0',
                  //   height: 0,
                  //   mainImage: false,
                  //   platformUrlFlag: false,
                  //   resource: '', //URL ID
                  //   size: 0,
                  //   width: 0,
                  // },
                ],
              };
            });
          }
          data.pictureInfo.valueImageList = arr || [];
        }
      });
    };

    const cancel = (val) => {
      if (val == "tp") {
        data.Visible = false;
      } else {
        data.videoVisible = false;
      }
    };

    const openModel = (val, text, index) => {
      if (text) {
        data.Visible = true;
        data.flag = index;
      } else {
        if (store.getters.getgoodsData.picture.value) {
          data.pictureInfo.sku = store.getters.getgoodsData.picture.value;
          data.pictureInfo.skuType = store.getters.getgoodsData.picture.type;
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
      console.log(val);
      data.videoVisible = false;
      data.Visible = false;
      val?.constructor === Object ? (data.type = 1) : (data.type = 2);
      if (data.type == 1) {
        let obj = {
          contentType: val.content,
          hashCode: val.hashcode,
          height: val.height,
          resource: val.resourceId,
          videoCoverUrl: val.thumbnailUrl,
          size: val.size,
          videoSource: "1", //1：素材中心，2：视频库,3:ebay平台同步下来的 ,
          videoUrl: val.originalUrl,
          width: val.width,
        };
        data.pictureInfo.vidoeObj.push(obj);
      } else {
        let b = data.pictureInfo.vidoeObj;
        val.forEach((element) => {
          let obj = {
            contentType: element.content,
            hashCode: element.hashcode,
            height: element.height,
            resource: element.resourceId,
            videoCoverUrl: element.thumbnailUrl,
            size: element.size,
            videoSource: "1", //1：素材中心，2：视频库,3:ebay平台同步下来的 ,
            videoUrl: element.videoUrl || element.originalUrl,
            width: element.width,
          };
          let flag = b.filter((i) => i.hashCode == element.hashcode);
          if (flag.length == 0) {
            data.pictureInfo.vidoeObj.push(obj);
          }
        });
      }
      console.log(data.pictureInfo.vidoeObj, "row");
    };
    //
    const unique = (val, id) => {
      return val.reduce((prev, cur) => {
        let temp = prev.map((i) => i[id]);
        return temp.includes(cur[id]) ? prev : [...prev, cur];
      }, []);
    };
    const confirmPicture = (val) => {
      data.Visible = false;
      if (data.flag == null) {
        // 素材中心
        let arr = [...data.pictureInfo.productImages, ...val].flat();
        let productAttr = [];
        productAttr = arr.map((item) => {
          return {
            contentType: item.contentType || item.file.type,
            hashCode: item.hashcode || item.hashCode || item.uid,
            height: item.height || "",
            mainImage: false,
            platformUrlFlag: item.platformUrlFlag || "",
            resource: item.thumbnailUrl || item.resource,
            size: item.size || item.file.size,
            width: item.width || "",
            resourceId: item.resourceId,
            thumbnailUrl: item.thumbnailUrl,
          };
        });
        console.log(productAttr, "ppss");
        data.pictureInfo.productImages = unique(productAttr, "hashCode");
      } else {
        // 变体主属性图片
        let arr = [
          ...data.pictureInfo.valueImageList[data.flag].listImg,
          ...val,
        ].flat();
        let attr = [];
        attr = arr.map((item) => {
          return {
            ...item,
            contentType: item.contentType || item.file.type,
            hashCode: item.hashCode || item.hashcode || item.uid,
            height: item.height || "",
            mainImage: false,
            platformUrlFlag: item.platformUrlFlag || "",
            resource: item.resource || item.thumbnailUrl || item.url,
            size: item.size || item.file.size,
            width: item.width || "",
          };
        });
        data.pictureInfo.valueImageList[data.flag].listImg = unique(
          attr,
          "hashCode"
        );
      }
    };
    const openImgView = (val) => {
      data.cutterImg = val;
      data.visible = true;
      console.log(val, "ppss");
    };
    const delOpenImgView = (index, indexImg) => {
      data.pictureInfo.valueImageList[index].listImg.splice(indexImg, 1);
    };
    const openVideo = (val) => {
      data.playerVisible = true;
      data.pictureInfo.vidoeSrc = val;
    };
    const delOpenVideo = (index, type) => {
      if (type == "imgs") {
        data.pictureInfo.productImages.splice(index, 1);
      } else {
        data.pictureInfo.vidoeObj.splice(index, 1);
      }
    };
    const graphBtn = (index) => {
      data.pictureInfo.productImages[index].mainImage = true;
    };
    const cancelGraphBtn = (index) => {
      data.pictureInfo.productImages[index].mainImage = false;
    };

    watch(
      () => props.goodsRowData,
      () => {
        data.pictureInfo = { ...data.pictureInfo, ...props.goodsRowData };
        const { productImages, videoInfos, variantAttrs } = props.goodsRowData;
        data.pictureInfo.productImages = productImages;
        data.pictureInfo.vidoeObj = videoInfos || [];
        // 产品属性
        let list = variantAttrs.map((item, index) => {
          if (item.mainAttr) {
            data.pictureInfo.people = index;
            let parentName = item.attrName;
            data.pictureInfo.valueImageList = item.attrValues.map((item) => {
              return {
                ...item,
                parentName: parentName,
                listImg: item.attrImages,
              };
            });
          }
          return {
            ...item,
            id: index,
          };
        });
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_ATTRIBUTELIST, list);
      }
    );
    return {
      ...toRefs(data),
      attrList,
      submitForm,
      resetForm,
      cancel,
      openModel,
      confirm,
      confirmPicture,
      openVideo,
      delOpenVideo,
      openImgView,
      delOpenImgView,
      graphBtn,
      cancelGraphBtn,
      getAttRList,
    };
  },
};
</script>

<style lang="scss" scoped>
.open-video {
  display: none;
}
.main-graph {
  display: none;
}
.basic-info {
  .title {
    padding: 16px 0 2px 0px;
    font-size: 14px;
  }
  .basic-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
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
    background: #fff;
    border-radius: 6px;
    text-align: center;
    line-height: 120px;
    position: relative;
    border: 1px solid #c9cdd4;
    overflow: hidden;
    &:hover {
      box-shadow: border-box;
      border: 1px solid #0045f0;
      border-radius: 6px;
      box-sizing: content-box;
      .open-video {
        display: inline-block;
        width: 120px;
        height: 120px;
        text-align: center;
        position: absolute;
        z-index: 99;
        .icoRigth {
          width: 20px;
          height: 20px;
          line-height: 24px;
          display: inline-block;
          background: rgba(217, 227, 253, 1);
          border-radius: 50%;
          text-align: center;
          margin: 0px 6px;
        }
      }
    }
  }
  .image-box-graph {
    width: 120px;
    height: 120px;
    border-radius: 6px;
    text-align: center;
    line-height: 120px;
    position: relative;
    border: 1px solid #c9cdd4;
    &:hover {
      border: 1px solid #0045f0;
      border-radius: 6px;
      box-sizing: content-box;
      .main-graph {
        display: inline-block;
        width: 120px;
        height: 120px;
        position: absolute;
        z-index: 99;
        .main-graph-top {
          height: 24px;
          line-height: 24px;
          // background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(4px);
          border-radius: 4px 4px 0px 0px;
          font-size: 12px;
          color: rgba(0, 69, 240, 1);
        }
        .main-graph-bottom {
          margin-top: 26px;
          height: 20px;
          line-height: 20px;
          span {
            height: 20px;
            line-height: 24px;
            width: 20px;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            background: rgba(217, 227, 253, 1);
            margin: 0px 6px;
            border-radius: 50px;
          }
        }
      }
    }
  }
}

.grap-item-zt {
  width: 32px;
  height: 18px;
  position: absolute;
  bottom: 102px;
  z-index: 10;
  width: 120px;
  p {
    height: 18px;
    line-height: 18px;
    width: 32px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px);
    border-radius: 0px 0px 4px 4px;
  }
}

:deep(.arco-image-error) {
  border-radius: 6px;
}
:deep(.arco-image-img) {
  vertical-align: bottom;
}
</style>
