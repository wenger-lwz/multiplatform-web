<template>
  <div class="image-info" id="image-lz">
    <h2 class="title mb16">图片视频</h2>
    <gj-form
      ref="imageFormRef"
      :model="imageLz"
      class="image-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div class="squre-line mb16">
        <div class="image-tips mb16">
          产品图片<span>(默认第一张图作为平台商品的主图，可拖拽调整)</span>
        </div>
        <div class="image-list">
          <div v-for="(item, index) in imageLz.productImages" :key="index">
            <div class="drag-image-wrap">
              <gj-image
                width="120"
                height="120"
                :key="index"
                class="border8"
                :src="item.resource"
              ></gj-image>
              <div class="actions-wrap">
                <span class="actions">
                  <span class="action preview-handle">
                    <SvgIcon
                      svgClass="Showz"
                      :width="16"
                      @click="openImgView(item.resource)"
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
              <div class="main-images-wrap">
                <span class="main-images-tag" v-if="item.mainImage">主图</span>
                <div
                  @click="setMainImage(item, false)"
                  v-if="item.mainImage"
                  class="main-images-btn"
                >
                  取消主图
                </div>
                <div
                  @click="setMainImage(item, true)"
                  v-else
                  class="main-images-btn"
                >
                  设为主图
                </div>
              </div>
            </div>
          </div>
          <div class="image-box">
            <gj-button shape="round" @click="openModal(0)">添加图片</gj-button>
          </div>
        </div>
      </div>
      <div class="squre-line mb16" v-if="variantImageShow">
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
                  v-model="imageLz.mainVariantProperty"
                  @change="mainVarPropertyChange"
                  placeholder="请选择"
                  allow-clear
                >
                  <gj-option
                    v-for="item in variantPropertyList"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.label }}</gj-option
                  >
                </gj-select>
              </gj-form-item>
            </gj-col>
          </gj-row>
        </div>
        <div
          class="value-image-list"
          v-for="item in valueImageList"
          :key="item"
        >
          <div class="variant-item-name">
            {{ item }}（{{ imageLz.variantImages[item].length }}张）
          </div>
          <div class="image-list">
            <div
              v-for="(it, index) in imageLz.variantImages[item]"
              :key="index"
            >
              <div class="drag-image-wrap">
                <gj-image
                  width="120"
                  height="120"
                  :key="index"
                  class="border8"
                  :src="it.resource"
                ></gj-image>
                <div class="actions-wrap">
                  <span class="actions">
                    <span class="action preview-handle">
                      <SvgIcon
                        svgClass="Showz"
                        :width="16"
                        @click="openImgView(it.resource)"
                      />
                    </span>
                    <span
                      class="action delete-handle"
                      @click="deleteVariantImage(item, index)"
                    >
                      <SvgIcon svgClass="close" :width="16" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div
              class="image-box"
              v-show="imageLz.variantImages[item]?.length < 8"
            >
              <gj-button shape="round" @click="openModal(1, item)"
                >图片库</gj-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="squre-line mb16" v-if="imgThumbnailShow">
        <div class="image-tips mb16">变体缩略图</div>
        <div
          class="value-image-list"
          v-for="item in thumbImageList"
          :key="item"
        >
          <div class="variant-item-name">
            {{ item }}
          </div>
          <div class="image-list">
            <div
              v-for="(it, index) in imageLz.variantThumbImages[item]"
              :key="index"
            >
              <div class="drag-image-wrap">
                <gj-image
                  width="120"
                  height="120"
                  :key="index"
                  class="border8"
                  :src="it.resource"
                ></gj-image>
                <div class="actions-wrap">
                  <span class="actions">
                    <span class="action preview-handle">
                      <SvgIcon
                        svgClass="Showz"
                        :width="16"
                        @click="openImgView(it.resource)"
                      />
                    </span>
                    <span
                      class="action delete-handle"
                      @click="delVarThumbImage(item, index)"
                    >
                      <SvgIcon svgClass="close" :width="16" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div
              class="image-box"
              v-show="imageLz.variantThumbImages[item]?.length < 1"
            >
              <gj-button shape="round" @click="openModal(2, item)"
                >图片库</gj-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="squre-line mb16">
        <div class="image-tips mb16">商品视频</div>
        <!-- <div class="image-list">
          <div class="image-list" v-if="imageLz.videoObj.length > 0">
            <div
              class="image-box"
              @click="openVideo(item.resource)"
              v-for="item in imageLz.videoObj"
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
    <!-- 素材中心 -->
    <picture-list
      v-if="dialogVisiable"
      :visible="dialogVisiable"
      :sku="imageLz.dialogSku"
      :skutype="imageLz.dialogSkuType"
      @close="cancel"
      @confirm="confirm"
    ></picture-list>
    <gj-image-preview :src="previewImgSrc" v-model:visible="previewVisible" />
    <Video-modal v-model:visible="playerVisible" :src="imageLz.vidoeSrc">
    </Video-modal>
  </div>
</template>

<script>
import { reactive, toRefs, computed, getCurrentInstance, nextTick } from "vue";
import { GjMessage } from "@gj/atom";
import { useStore } from "vuex";
import { M_T } from "@/store/mutationsTypes";
import { setForm2 } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
import pictureList from "@pagesSystem/published/materialCenter/modal/picture.vue";
import VideoModal from "@/components/VideoModal.vue";
import VideoUrl from "./common/VideoUrl.vue";

export default {
  // inherited: false,
  components: {
    SvgIcon,
    pictureList,
    VideoModal,
    VideoUrl,
  },
  emits: [],
  setup() {
    const key = "imageLz";
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const data = reactive({
      [key]: {
        mainVariantProperty: "",
        productImages: [],
        variantImages: {},
        variantThumbImages: {},
        dialogSku: "",
        dialogSkuType: "",
        videoObj: [],
        vidoeSrc: "",
      },
      dialogVisiable: false,
      previewVisible: false,
      previewImgSrc: "",
      dialogType: "",
      variantKey: "",
      playerVisible: false,
    });

    const variantImageShow = computed(() => {
      let flag = store.getters.getParams.productInfo?.specsType === 2;
      return flag;
    });

    const imgThumbnailShow = computed(() => {
      // 缩略图根据名称color来判断是否显示
      return (
        variantImageShow.value &&
        data[key].mainVariantProperty?.toLowerCase().indexOf("color") > -1
      );
    });

    const variantPropertyList = computed(() => {
      const customColumns =
        store.getters.getParams.variantInfoLz?.customColumns || [];
      return customColumns.map((item) => {
        return {
          label: item.label,
          value: item.label,
          options: item.customValue || [],
        };
      });
    });

    const valueImageList = computed(() => {
      const item = variantPropertyList.value.find(
        (it) => it.value === data[key].mainVariantProperty
      );
      if (item) {
        item.options.forEach((varinatKey) => {
          data[key].variantImages[varinatKey] =
            data[key].variantImages[varinatKey] || [];
          if (imgThumbnailShow.value) {
            data[key].variantThumbImages[varinatKey] =
              data[key].variantThumbImages[varinatKey] || [];
          }
        });
      }
      return item ? item.options : [];
    });

    const thumbImageList = computed(() => {
      return imgThumbnailShow.value ? valueImageList.value : [];
    });

    const openModel = (val, text, index) => {
      console.log(store.getters.getgoodsData, "store.getters.getgoodsData");
      if (text) {
        data.Visible = true;
        data.flag = index;
      } else {
        if (store.getters.getgoodsData.picture.value) {
          data.imageLz.spu = store.getters.getgoodsData.picture.value;
          data.imageLz.spuType = store.getters.getgoodsData.picture.type;
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

    const openVideo = (src) => {
      console.log(src, "src");
      data.imageLz.vidoeSrc = src;
      nextTick(() => {
        data.playerVisible = true;
      });
    };

    const saveDataStore = () => {
      const params = {
        [key]: data[key],
      };
      store.dispatch(M_T.PARAMS_QUERY, params);
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "imageFormRef");
    };

    const openModal = (dialogType, variantKey) => {
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
        data.dialogType = dialogType;
        data.variantKey = variantKey;
        data.dialogVisiable = true;
      } else {
        GjMessage.error("请先选择关联sku或spu");
      }
    };

    const cancel = () => {
      data.dialogVisiable = false;
    };

    const confirm = (list) => {
      const temp =
        list?.map((item) => ({ ...item, resource: item.originalUrl })) || [];
      if (data.dialogType === 0) {
        data[key].productImages = data[key].productImages.concat(temp);
      } else if (data.dialogType === 1) {
        // 最多8张
        const variantKey = data.variantKey;
        data[key].variantImages[variantKey] =
          data[key].variantImages[variantKey].concat(temp);
        data[key].variantImages[variantKey] = data[key].variantImages[
          variantKey
        ].slice(0, 8);
      } else if (data.dialogType === 2) {
        // 最多8张
        const variantKey = data.variantKey;
        data[key].variantThumbImages[variantKey] =
          data[key].variantThumbImages[variantKey].concat(temp);
        data[key].variantThumbImages[variantKey] = data[key].variantThumbImages[
          variantKey
        ].slice(0, 1);
      }

      data.dialogVisiable = false;
      saveDataStore();
    };

    const deleteProductImage = (index) => {
      data[key].productImages.splice(index, 1);
      saveDataStore();
    };
    const deleteVariantImage = (variantKey, index) => {
      data[key].variantImages[variantKey].splice(index, 1);
      saveDataStore();
    };
    const delVarThumbImage = (variantKey, index) => {
      data[key].variantThumbImages[variantKey].splice(index, 1);
      saveDataStore();
    };

    const openImgView = (src) => {
      data.previewImgSrc = src;
      data.previewVisible = true;
    };

    const setPageData = (respData) => {
      let productImages = respData.productImages || [];
      productImages = productImages.filter((it) => it.businessType === 1);
      data[key].productImages = productImages;
      // 变体图片
      data[key].variantImages = {};
      // 变体缩略图
      data[key].variantThumbImages = {};
      if (respData.variantAttrInfo) {
        const target = respData.variantAttrInfo.find((it) => it.mainVariation);
        if (target) {
          // 变体主属性
          data[key].mainVariantProperty = target.attrName;
          target.attributeValues?.forEach((it) => {
            data[key].variantImages[it.attrValueName] = [];
            data[key].variantThumbImages[it.attrValueName] = [];
            it.variantImages?.forEach((varImageItem) => {
              if (!varImageItem.thumbnail) {
                data[key].variantImages[it.attrValueName].push(varImageItem);
              } else {
                if (imgThumbnailShow.value) {
                  data[key].variantThumbImages[it.attrValueName].push(
                    varImageItem
                  );
                }
              }
            });
          });
        }
      }
    };

    const setMainImage = (item, flag) => {
      item.mainImage = flag;
    };

    const mainVarPropertyChange = () => {
      // 切换重置图片
      data[key].variantImages = {};
      // 重置缩略图
      data[key].variantThumbImages = {};
    };

    return {
      ...toRefs(data),
      variantImageShow,
      imgThumbnailShow,
      variantPropertyList,
      valueImageList,
      thumbImageList,
      submitForm,
      setPageData,
      openModal,
      cancel,
      confirm,
      deleteProductImage,
      deleteVariantImage,
      delVarThumbImage,
      openImgView,
      setMainImage,
      mainVarPropertyChange,
      openModel,
      openVideo,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./common/index.scss";
.image-info {
  .title {
    padding: 16px 0 2px 0px;
    font-size: 14px;
    span {
      color: #b3b4c1;
      font-size: 12px;
    }
  }
  .image-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }

  .image-tips {
    font-size: 12px;
    span {
      color: #808197;
    }
  }
  .image-list {
    max-height: 254px;
    overflow: hidden;
    overflow-y: scroll;
    .drag-image-wrap {
      position: relative;
      .drag-image {
        // border-radius: 8px;
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
        .main-images-tag {
          display: none !important;
        }
        .main-images-btn {
          display: block !important;
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
      .main-images-wrap {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        text-align: center;
        font-weight: 400;
        font-size: 12px;
        z-index: 101;
        .main-images-tag {
          padding: 2px 4px;
          color: #000430;
          border-radius: 0px 0px 4px 4px;
          background: rgba(255, 255, 255, 0.7);
        }
        .main-images-btn {
          padding: 2px 4px;
          background: rgba(255, 255, 255, 0.7);
          color: #0045f0;
          z-index: 101;
          display: none;
          cursor: pointer;
        }
      }
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

  .value-image-list {
    .variant-item-name {
      margin: 16px 0 12px;
    }
  }
}
</style>
