<template>
  <div class="image-info" id="image-lz">
    <h2 class="title mb8">
      图片信息
      <span
        >(尺寸在330x330和5000x5000px之间，图片大小≤1MB。将图片拖入框中，或者点击本地、相册上传，拖动图片可调整顺序，创建草稿随机选择其中八张进行创建)</span
      >
    </h2>
    <gj-form
      ref="imageFormRef"
      :model="imageLz"
      class="image-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div class="squre-line mb16">
        <div class="image-tips mb16">
          产品图片<b v-if="pageType"
            >({{ imageLz.productImages.length - 1 }}/8)
          </b>
          <span>
            (图片可用来作为平台商品的封面图，所有图片皆可成为平台主图)</span
          >
        </div>
        <div class="image-list">
          <draggable
            tag="div"
            item-key="hashCodes"
            handle=".drag-handle"
            :list="imageLz.productImages"
            group="productImages"
            animation="300"
            class="draft-item-drag"
            :move="productImageMove"
          >
            <template #item="{ element: item, index }">
              <div class="drag-image-wrap">
                <template v-if="index < imageLz.productImages.length - 1">
                  <gj-image
                    width="120"
                    height="120"
                    :key="index"
                    class="border8"
                    :src="item.resource"
                  ></gj-image>
                  <div class="actions-wrap">
                    <span class="actions">
                      <span class="action drag-handle">
                        <SvgIcon svgClass="drag" :width="16" />
                      </span>
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
                    <span class="main-images-tag" v-if="item.mainImage"
                      >主图</span
                    >
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
                </template>

                <div
                  class="image-box"
                  v-if="index === imageLz.productImages.length - 1"
                >
                  <gj-button shape="round" @click="openModal(0)"
                    >图片库</gj-button
                  >
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
      <div class="squre-line mb16" v-if="variantImageShow">
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
                  v-model="imageLz.mainVariantProperty"
                  :trigger-props="{
                    updateAtScroll: true,
                  }"
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
            {{ item }}
            <b v-if="pageType"
              >({{ imageLz.variantImages[item]?.length - 1 || 0 }}/8)</b
            >
          </div>
          <div class="image-list">
            <draggable
              tag="div"
              item-key="hashCodes"
              handle=".drag-handle"
              :list="imageLz.variantImages[item]"
              :group="`variantImages${item}`"
              animation="300"
              class="draft-item-drag"
              :move="variantImageMove"
            >
              <template #item="{ element: it, index }">
                <div class="drag-image-wrap">
                  <template
                    v-if="index < imageLz.variantImages[item].length - 1"
                  >
                    <gj-image
                      width="120"
                      height="120"
                      :key="index"
                      class="border8"
                      :src="it.resource"
                    ></gj-image>
                    <div class="actions-wrap">
                      <span class="actions">
                        <span class="action drag-handle">
                          <SvgIcon svgClass="drag" :width="16" />
                        </span>
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
                  </template>
                  <div
                    class="image-box"
                    v-if="index === imageLz.variantImages[item].length - 1"
                  >
                    <gj-button shape="round" @click="openModal(1, item)"
                      >图片库</gj-button
                    >
                  </div>
                </div>
              </template>
            </draggable>
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
            <b v-if="pageType"
              >({{ imageLz.variantThumbImages[item].length }}/1)
            </b>
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
            <div class="image-box">
              <gj-button shape="round" @click="openModal(2, item)"
                >图片库</gj-button
              >
            </div>
          </div>
        </div>
      </div>
    </gj-form>
    <!-- 素材中心 -->
    <picture-list
      v-if="dialogVisiable"
      :visible="dialogVisiable"
      :sku="imageLz.dialogSku"
      :skutype="imageLz.dialogSkuType"
      :minWidth="330"
      :minHeight="330"
      :maxWidth="5000"
      :maxHeight="5000"
      :imgExceeding="1"
      :isLimitRatio="true"
      @close="cancel"
      @confirm="confirm"
    ></picture-list>
    <gj-image-preview :src="previewImgSrc" v-model:visible="previewVisible" />
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  computed,
  getCurrentInstance,
  defineComponent,
} from "vue";
import Draggable from "vuedraggable";
import { GjMessage } from "@gj/atom";
import { useStore } from "vuex";
import { M_T } from "@/store/mutationsTypes";
import { setForm2 } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
import pictureList from "@pagesSystem/published/materialCenter/modal/picture.vue";

export default defineComponent({
  components: {
    Draggable,
    SvgIcon,
    pictureList,
  },
  props: {
    pageType: {
      type: String,
      default: "",
    },
  },
  emits: [],
  setup(props) {
    const key = "imageLz";
    const imageLastItem = {
      itemType: "upload-btn",
      hashCodes: Symbol("abcd"),
    };
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const data = reactive({
      [key]: {
        mainVariantProperty: "",
        productImages: [imageLastItem],
        variantImages: {},
        variantThumbImages: {},
        dialogSku: "",
        dialogSkuType: "",
      },
      dialogVisiable: false,
      previewVisible: false,
      previewImgSrc: "",
      dialogType: "",
      variantKey: "",
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

    const createUploadBtn = () => {
      return { ...imageLastItem };
    };

    const valueImageList = computed(() => {
      const item = variantPropertyList.value.find(
        (it) => it.value === data[key].mainVariantProperty
      );
      if (item) {
        item.options.forEach((varinatKey) => {
          data[key].variantImages[varinatKey] = data[key].variantImages[
            varinatKey
          ] || [createUploadBtn()];
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
        GjMessage.warning("请先选择关联sku或spu");
      }
    };

    const cancel = () => {
      data.dialogVisiable = false;
    };

    const confirm = (list) => {
      const temp =
        list?.map((item) => ({ ...item, resource: item.originalUrl })) || [];
      if (data.dialogType === 0) {
        const lastItem = data[key].productImages.splice(
          data[key].productImages.length - 1,
          1
        );
        data[key].productImages = data[key].productImages.concat(temp);
        if (props.pageType) {
          // 最多8张
          data[key].productImages = data[key].productImages.slice(0, 8);
        }
        data[key].productImages.push(lastItem[0]);
      } else if (data.dialogType === 1) {
        // 最多8张
        const variantKey = data.variantKey;
        const lastItem = data[key].variantImages[variantKey].splice(
          data[key].variantImages[variantKey].length - 1,
          1
        );
        data[key].variantImages[variantKey] =
          data[key].variantImages[variantKey].concat(temp);
        data[key].variantImages[variantKey] = data[key].variantImages[
          variantKey
        ].slice(0, 8);
        data[key].variantImages[variantKey].push(lastItem[0]);
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
      data[key].productImages = [];
      let productImages = respData.productImages || [];
      productImages = productImages.filter((it) => it.businessType === 1);
      data[key].productImages = productImages;
      data[key].productImages.push(imageLastItem);
      // 变体图片
      data[key].variantImages = {};
      // 变体缩略图
      data[key].variantThumbImages = {};
      if (respData.variantAttrInfo) {
        const target = respData.variantAttrInfo.find((it) => it.mainVariation);
        if (target) {
          // 变体主属性
          data[key].mainVariantProperty = target.label;
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
            // 按钮
            data[key].variantImages[it.attrValueName].push(createUploadBtn());
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

    const productImageMove = (e) => {
      if (
        e.relatedContext.element.itemType &&
        e.relatedContext.element.itemType === "upload-btn"
      ) {
        return false;
      }
      //不允许拖拽
      if (
        e.draggedContext.element.itemType &&
        e.draggedContext.element.itemType === "upload-btn"
      ) {
        return false;
      }
      return true;
    };

    const variantImageMove = (e) => {
      if (
        e.relatedContext.element.itemType &&
        e.relatedContext.element.itemType === "upload-btn"
      ) {
        return false;
      }
      //不允许拖拽
      if (
        e.draggedContext.element.itemType &&
        e.draggedContext.element.itemType === "upload-btn"
      ) {
        return false;
      }
      return true;
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
      productImageMove,
      variantImageMove,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
.image-info {
  .title {
    padding: 16px 0 4px 0px;
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
    .draft-item-drag {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
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
