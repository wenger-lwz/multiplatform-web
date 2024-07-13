<template>
  <div class="blockBox">
    <div class="title">
      <span class="text">图片信息</span>
    </div>
    <div class="boxWrap">
      <div class="squre-line">
        <div class="subTitle">
          <span class="text">产品图片</span>
          <span class="tip"
            >(图片可用来作为平台商品的封面图，所有图片皆可成为平台主图)</span
          >
        </div>
        <div class="draft-item-content">
          <template v-if="productImages.length > 0">
            <draggable
              tag="div"
              itemKey="key"
              handle=".drag-handle"
              v-model="productImages"
              group="productImages"
              animation="300"
              class="content-draggable product-images-content-draggable"
              :move="onMove"
            >
              <template #item="{ element, index }">
                <div class="drag-image-wrap">
                  <template v-if="index !== productImages.length - 1">
                    <gj-image
                      class="drag-image"
                      width="118"
                      height="118"
                      :src="element.resource"
                    >
                    </gj-image>
                    <div v-if="index === 0" class="drag-image-tag">主图</div>
                    <div v-if="element.resource" class="actions-wrap">
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
                          @click="deleteProductImage(element, index)"
                        >
                          <SvgIcon svgClass="close" :width="16" />
                        </span>
                      </span>
                    </div>
                  </template>
                  <div v-else class="upload-btn">
                    <gj-button @click="openPicturesCenter('product')"
                      >添加图片</gj-button
                    >
                  </div>
                </div>
              </template>
            </draggable>
          </template>
        </div>
      </div>
      <!-- 变体图片 -->
      <div v-if="specsType === 2" class="squre-line">
        <div class="subTitle">
          <span class="text">变体图片</span>
        </div>
        <div class="draft-item-content">
          <template v-if="variants.length">
            <div
              class="drag-image-wrap"
              v-for="(imageItem, idx) in variants"
              :key="idx"
            >
              <div class="image-desc">
                {{ getAttrValueDesc(imageItem.variantAttrInfo ?? []) }}
              </div>
              <gj-image
                class="drag-image"
                width="118"
                height="118"
                alt="无图"
                :src="imageItem?.productImages?.[0]?.resource"
              >
                <template #extra>
                  <span class="actions">
                    <span class="action preview-handle">
                      <svg-icon
                        svgClass="Showz"
                        :width="16"
                        @click="
                          openImgView(imageItem?.productImages?.[0]?.resource)
                        "
                      />
                    </span>
                    <span
                      class="action delete-handle"
                      @click="deleteVariantImage(idx)"
                    >
                      <svg-icon svgClass="close" :width="14" />
                    </span>
                  </span>
                </template>
                <template #error>
                  <gj-button @click="openUploadModal(idx)">添加图片</gj-button>
                </template>
              </gj-image>
            </div>
          </template>
          <div v-else class="empty">暂无数据</div>
        </div>
      </div>
      <!-- 变体图片 -->
    </div>
    <pictures-center
      v-model:visible="visible"
      :sku="relatedSkuOrSpu"
      :skutype="'' + specsType"
      @close="cancel"
      @confirm="confirmPic"
    />
    <gj-modal
      class="variant-images-modal"
      :width="792"
      title="上传图片"
      :visible="uploadModalVisible"
      :render-to-body="false"
      unmountOnClose
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="draft-item-content">
        <div
          class="drag-image-wrap"
          v-for="(imageItem, idx) in productImages"
          :key="idx"
        >
          <template v-if="idx !== productImages.length - 1">
            <gj-checkbox
              class="image-checkbox"
              :value="imageItem.hashCode"
              v-model="checkedImages"
              @change="checkChange"
            />
            <gj-image
              class="drag-image"
              width="118"
              height="118"
              alt="无图"
              :src="imageItem?.resource"
            >
              <template #extra>
                <span class="actions">
                  <span class="action preview-handle">
                    <svg-icon
                      svgClass="Showz"
                      :width="16"
                      @click="openImgView(imageItem?.resource)"
                    />
                  </span>
                  <span
                    class="action delete-handle"
                    @click="deleteProductImage(imageItem, idx)"
                  >
                    <svg-icon svgClass="close" :width="14" />
                  </span>
                </span>
              </template>
            </gj-image>
          </template>
          <div v-else class="upload-btn">
            <gj-button @click="openPicturesCenter()">添加图片</gj-button>
          </div>
        </div>
      </div>
    </gj-modal>
    <gj-image-preview :src="previewImgSrc" v-model:visible="previewVisible" />
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  getCurrentInstance,
  inject,
  watch,
} from "vue";
import Draggable from "vuedraggable";
import { GjMessage } from "@gj/atom";
import { setForm2 } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
import picturesCenter from "@/pages/systemPages/published/materialCenter/modal/picture.vue";
export default defineComponent({
  inheritAttrs: false,
  components: {
    SvgIcon,
    Draggable,
    picturesCenter,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const uploadModalVisible = ref(false);
    const relatedSkuOrSpu = inject("relatedSkuOrSpu");
    const specsType = inject("specsType");
    const productImages = inject("productImages");
    const variants = inject("variants");
    const key = "pictureInfo";
    const data = reactive({
      imageType: "product",
      attrImgIdx: -1,
      previewImgSrc: "",
      previewVisible: false,
      customizedPic: [],
      visible: false,
      productImages: [],
      variants: [],
      checkedImages: [],
    });

    const endImage = [
      {
        resource: null,
        hashCode: null,
        contentType: "button",
      },
    ];

    watch(
      () => variants,
      (n) => {
        data.variants = n;
      },
      {
        deep: true,
      }
    );

    watch(
      () => productImages,
      (n) => {
        data.productImages = n.value.concat(endImage);
      },
      {
        deep: true,
        immediate: true,
      }
    );

    const submitForm = () => {
      let newProductImages = [];
      if (data.productImages.length > 1) {
        newProductImages = JSON.parse(JSON.stringify(data.productImages));
        newProductImages[0].mainImage = true;
        newProductImages.pop();
      }
      return setForm2(proxy, key, {
        productImages: newProductImages,
        variantImages: data.variants,
      });
    };

    const cancel = () => {
      data.visible = false;
    };

    const removeDuplicateImages = (n) => {
      for (var i = 0; i < n.length - 1; i++) {
        for (var j = i + 1; j < n.length; j++) {
          if (!n[i].hashCode || !n[j].hashCode) {
            continue;
          }
          if (n[i].hashCode === n[j].hashCode) {
            n.splice(j, 1);
            j--;
          }
        }
      }
      return n;
    };

    const confirmPic = (images) => {
      data.visible = false;
      if (images.length) {
        const nImages = images.map((imageItem) => {
          return {
            height: 0,
            width: 0,
            size: imageItem.size,
            indexProductImage: 0, // ??
            mainImage: false,
            contentType: imageItem.contentType,
            hashCode: imageItem.hashcode,
            resource: imageItem.originalUrl,
          };
        });
        data.productImages.pop();
        const allImages = [...data.productImages, ...nImages, ...endImage];
        const newImages = removeDuplicateImages(allImages);
        data.productImages = newImages;
      }
    };

    const openPicturesCenter = (imageType) => {
      if (!relatedSkuOrSpu.value) {
        if (specsType.value === 1) {
          return GjMessage.warning("请先选择关联SKU");
        } else {
          return GjMessage.warning("请先选择关联SPU");
        }
      }
      data.visible = true;
      data.imageType = imageType;
    };

    const openImgView = (src) => {
      data.previewImgSrc = src;
      data.previewVisible = true;
    };

    const deleteProductImage = (imageItem, index) => {
      data.productImages.splice(index, 1);
      const hashCode = imageItem?.hashCode;
      for (let variantItem of data.variants) {
        if (variantItem?.productImages?.length) {
          if (variantItem?.productImages[0].hashCode === hashCode) {
            variantItem.productImages = [];
          }
        }
      }
    };

    const deleteVariantImage = (attrImgIdx) => {
      data.variants[attrImgIdx].productImages = [];
    };

    const getAttrValueDesc = (variantAttrInfo = []) => {
      return variantAttrInfo
        .map((variantAttrItem) => {
          return variantAttrItem.attrValue;
        })
        .join("+");
    };

    const openUploadModal = (attrImgIdx) => {
      if (!relatedSkuOrSpu.value) {
        return GjMessage.error("请先选择关联SPU");
      }
      data.imageType = "variant";
      data.attrImgIdx = attrImgIdx;
      uploadModalVisible.value = true;
    };

    const resetCheckedSts = () => {
      data.checkedImages = [];
    };

    const handleOk = () => {
      uploadModalVisible.value = false;
      if (data.checkedImages.length) {
        const checkedId = data.checkedImages[0];
        const checkedImageIdx = data.productImages.findIndex(
          (item) => item?.hashCode === checkedId
        );
        if (checkedImageIdx !== -1) {
          const checkedImage = data.productImages[checkedImageIdx];
          data.variants[data.attrImgIdx].productImages = [checkedImage];
        }
        resetCheckedSts();
      }
    };

    const handleCancel = () => {
      uploadModalVisible.value = false;
      resetCheckedSts();
    };

    const checkChange = (val) => {
      if (val.length) {
        data.checkedImages = [val.pop()];
      }
    };

    const onMove = (e) => {
      if (e.relatedContext.element.contentType == "button") return false;
      if (e.draggedContext.element.contentType == "button") return false;
      return true;
    };

    return {
      specsType,
      relatedSkuOrSpu,
      ...toRefs(data),
      cancel,
      openPicturesCenter,
      confirmPic,
      openImgView,
      deleteProductImage,
      deleteVariantImage,
      submitForm,
      getAttrValueDesc,
      openUploadModal,
      uploadModalVisible,
      checkChange,
      handleCancel,
      handleOk,
      onMove,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.image-checkbox) {
  padding-left: 0;
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 999;
}
:deep(.variant-images-modal) {
  .arco-modal-body {
    height: calc(100vh - 193px);
  }
}
:deep(.arco-modal-footer) {
  position: relative !important;
}
.blockBox {
  .boxWrap {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
  .title {
    padding-top: 32px;
    font-size: 14px;
    margin-bottom: 16px;
    font-weight: 600;
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
    .tip {
      font-size: 12px;
      color: #808197;
    }
  }
  .upload-btn {
    width: 118px;
    height: 118px;
    background: #fafafb;
    border-radius: 6px;
    text-align: center;
    line-height: 120px;
    border: 1px solid #e6e6ed;
    &:hover {
      border: 1px solid #0045f0;
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
    border-radius: 8px;
  }
  &:hover {
    .actions-wrap {
      display: block;
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

.draft-item-content {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-desc {
  color: #666883;
  padding-bottom: 12px;
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.drag-image) {
  border: 1px solid #e6e6ed;
  z-index: 99;
  &:hover {
    border: 1px solid rgba(0, 69, 240, 0.8);
  }
  &:not(.arco-image-loading-error) {
    &:hover {
      .arco-image-footer {
        display: block;
      }
    }
  }
  .arco-image-footer {
    top: 0;
    display: none;
    border-radius: 6px;
  }
  .arco-image-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fafafb;
  }
  .arco-image-error-icon {
    display: none;
  }
  .arco-image-error-alt {
    padding: 0;
    color: #b3b4c1;
  }
}
</style>
