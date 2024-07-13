<template>
  <full-screen-dialog :dialogVisible="dialogVisible">
    <template #title>
      <div class="dialog-title">
        <span>编辑配置草稿</span>
        <gj-button @click="cancel" shape="round">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="draft-content">
        <gj-row>
          <gj-col :span="24" class="text-box">
            <div class="sku">{{ item.spu }}</div>
            <div class="type">{{ item.specsType == 2 ? "变体" : "单品" }}</div>
            <div class="shopClass">
              <span class="pl-10">店铺:</span>
              <span>{{ item.storeName || "-" }}</span>
            </div>
          </gj-col>
        </gj-row>
        <gj-row>
          <gj-col :span="24" class="mb-32">
            <gj-form
              ref="draftRef"
              :label-col-props="{ span: 24 }"
              :wrapper-col-props="{ span: 24 }"
              label-align="left"
              :model="draftForm"
            >
              <gj-row>
                <gj-col :span="8">
                  <gj-form-item
                    label="标题"
                    field="title"
                    :rules="[
                      {
                        required: true,
                        validator: (value, cb) =>
                          customValidator(value, cb, item),
                      },
                    ]"
                  >
                    <gj-input
                      v-model="item.title"
                      :max-length="255"
                      placeholder="请输入"
                      allow-clear
                      show-word-limit
                    />
                  </gj-form-item>
                </gj-col>
              </gj-row>
            </gj-form>
          </gj-col>
          <!-- 产品图片 -->
          <div class="draft-item mb-32">
            <div class="draft-item-tit">产品图片</div>
            <div class="draft-item-content">
              <div class="draft-item-tip">
                <span class="text"
                  >已选择<span
                    >{{ item.selectedProductImages.length }}/{{
                      item.productImagesLen
                    }}</span
                  ></span
                >
              </div>
              <draggable
                tag="div"
                item-key="hashCodes"
                handle=".drag-handle"
                v-model="item.selectedProductImages"
                group="productImages"
                animation="300"
                class="content-draggable products-content-draggable b-d-d"
              >
                <template #item="{ element, index }">
                  <div class="drag-image-wrap">
                    <gj-image
                      width="118"
                      height="118"
                      class="drag-image"
                      :src="element.resource"
                      hide-footer
                    />
                    <div v-if="index === 0" class="drag-image-tag">主图位</div>
                    <div class="actions-wrap">
                      <span class="actions">
                        <span class="action drag-handle">
                          <svg-icon svgClass="drag" :width="14" />
                        </span>
                        <span class="action preview-handle">
                          <svg-icon
                            svgClass="Showz"
                            :width="16"
                            @click="openImgView(element.resource)"
                          />
                        </span>
                        <span
                          class="action delete-handle"
                          @click="deleteProductImage(element, index)"
                        >
                          <svg-icon svgClass="close" :width="16" />
                        </span>
                      </span>
                    </div>
                  </div>
                </template>
              </draggable>
              <div class="draft-item-tip draft-item-tip2">
                <span class="text"
                  >商品资料图片<span>将此处图片拖到上方栏位即为选中</span></span
                >
              </div>
              <div class="draggable-wrap">
                <draggable
                  tag="div"
                  item-key="hashCodes"
                  handle=".drag-handle"
                  v-model="item.unSelectedProductImages"
                  group="productImages"
                  animation="300"
                  class="content-draggable product-images-content-draggable"
                >
                  <template #item="{ element }">
                    <div class="drag-image-wrap">
                      <gj-image
                        width="118"
                        height="118"
                        class="drag-image"
                        :src="element.resource"
                        hide-footer
                      />
                      <div class="actions-wrap">
                        <span class="actions">
                          <span class="action drag-handle">
                            <svg-icon svgClass="drag" :width="14" />
                          </span>
                          <span class="action preview-handle">
                            <svg-icon
                              svgClass="Showz"
                              :width="16"
                              @click="openImgView(element.resource)"
                            />
                          </span>
                        </span>
                      </div>
                    </div>
                  </template>
                </draggable>
                <div v-if="!item.unSelectedProductImages.length" class="empty">
                  暂无数据
                </div>
              </div>
            </div>
          </div>
          <!-- 产品图片 -->
          <!-- 变体图片 -->
          <div v-if="item.specsType === 2" class="draft-item mb-32">
            <div class="draft-item-tit">变体图片</div>
            <div class="draft-item-content">
              <div class="draft-item-tip">
                <span class="text">已选择</span>
              </div>
              <draggable
                tag="div"
                item-key="hashCodes"
                handle=".drag-handle"
                v-model="item.selectedVariantImages"
                :group="{ name: 'variantImagess', pull: 'clone' }"
                animation="300"
                class="content-draggable variants-content-draggable b-d-d"
                @start="onstart"
                @end="onend"
              >
                <template #item="{ element, index }">
                  <div>
                    <div class="image-desc">
                      {{ getAttrValueDesc(element.variantAttrInfo) }}
                    </div>
                    <gj-image
                      width="118"
                      height="118"
                      class="drag-image drag-variant-image"
                      :src="element?.productImages?.[0]?.resource"
                      alt="无图"
                    >
                      <template #extra>
                        <span class="actions">
                          <span class="action drag-handle">
                            <svg-icon svgClass="drag" :width="14" />
                          </span>
                          <span class="action preview-handle">
                            <svg-icon
                              svgClass="Showz"
                              :width="16"
                              @click="
                                openImgView(
                                  element?.productImages?.[0]?.resource
                                )
                              "
                            />
                          </span>
                          <span
                            class="action delete-handle"
                            @click="deleteVariantImage(element, index)"
                          >
                            <svg-icon svgClass="close" :width="14" />
                          </span>
                        </span>
                      </template>
                    </gj-image>
                  </div>
                </template>
              </draggable>
              <!-- 商品资料图片 -->
              <div class="draft-item-tip draft-item-tip2">
                <span class="text"
                  >商品资料图片<span>将此处图片拖到上方栏位即为选中</span></span
                >
              </div>
              <div class="draggable-wrap">
                <draggable
                  tag="div"
                  item-key="hashCodes"
                  handle=".drag-handle"
                  v-model="item.unSelectedVariantAndPImages"
                  group="variantImagess"
                  animation="300"
                  class="content-draggable product-images-content-draggable"
                  @start="start"
                  @end="end"
                  :move="move"
                >
                  <template #item="{ element }">
                    <div>
                      <gj-image
                        width="118"
                        height="118"
                        class="drag-image drag-product-image"
                        :src="element?.resource"
                        alt="无图"
                      >
                        <template #extra>
                          <span class="actions">
                            <span class="action drag-handle">
                              <svg-icon svgClass="drag" :width="14" />
                            </span>
                            <span class="action preview-handle">
                              <svg-icon
                                svgClass="Showz"
                                :width="16"
                                @click="openImgView(element.resource)"
                              />
                            </span>
                          </span>
                        </template>
                      </gj-image>
                    </div>
                  </template>
                </draggable>
                <div
                  v-if="!item.unSelectedVariantAndPImages.length"
                  class="empty"
                >
                  暂无数据
                </div>
              </div>
            </div>
          </div>
          <!-- 变体图片 -->
          <!-- 描述 -->
          <div class="draft-item mb-32">
            <div class="draft-item-tit">描述</div>
            <div class="draft-item-content draft-item-desc-content">
              <gj-image
                width="118"
                height="118"
                class="drag-image"
                alt="无图"
                :src="item?.previewUrl"
              >
                <template #extra>
                  <span class="actions">
                    <span class="action preview-handle">
                      <svg-icon
                        svgClass="Showz"
                        :width="16"
                        @click="openImgView(item.previewUrl)"
                      />
                    </span>
                  </span>
                </template>
              </gj-image>
            </div>
          </div>
          <!-- 描述 -->
        </gj-row>
      </div>
      <gj-image-preview :src="previewImgSrc" v-model:visible="previewVisible" />
    </template>
    <template #footer>
      <gj-space>
        <gj-button shape="round" @click="cancel">取消</gj-button>
        <gj-button type="primary" shape="round" @click="saveDraft"
          >确定</gj-button
        >
      </gj-space>
    </template>
  </full-screen-dialog>
</template>
<script>
import { defineComponent, reactive, toRefs, ref, watch } from "vue";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog.vue";
import SvgIcon from "@/components/SvgIcon";
import Draggable from "vuedraggable";
export default defineComponent({
  components: {
    fullScreenDialog,
    Draggable,
    SvgIcon,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    draftsItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["saveDraft", "cancel", "open"],
  setup(props, { emit }) {
    const draftRef = ref(null);
    const oldIndex = ref(null);
    const targetImageItemMsku = ref("");
    const startImg = ref({});
    const targetImageItem = ref({});
    const state = reactive({
      item: props.draftsItem,
      draftForm: {},
      previewImgSrc: "",
      previewVisible: false,
    });

    watch(
      () => props.draftsItem,
      (n) => {
        state.item = n;
      },
      {
        deep: true,
      }
    );

    const cancel = () => {
      emit("cancel");
    };

    const saveDraft = async () => {
      const errors = await draftRef.value.validateField("title");
      console.log("验证", errors);
      if (errors) {
        return;
      }
      emit("saveDraft", state.item);
    };

    const openImgView = (src) => {
      state.previewImgSrc = src;
      state.previewVisible = true;
    };

    const deleteProductImage = (row, idx) => {
      const productImage = JSON.parse(JSON.stringify(row));
      state.item.selectedProductImages.splice(idx, 1);
      state.item.unSelectedProductImages.push(productImage);
    };

    const deleteVariantImage = (row, idx) => {
      const variantItemImage = JSON.parse(JSON.stringify(row.productImages[0]));
      state.item.selectedVariantImages[idx].productImages = [];
      state.item.unSelectedVariantAndPImages.push(variantItemImage);
    };

    const customValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!record.title) {
            cb("标题必填");
          }
          resolve();
        }, 0);
      });
    };

    const getAttrValueDesc = (variantAttrInfo = []) => {
      return variantAttrInfo
        .map((variantAttrItem) => {
          return variantAttrItem.attrValue;
        })
        .join("+");
    };

    const start = (e) => {
      oldIndex.value = e.oldIndex;
      startImg.value = state.item.unSelectedVariantAndPImages[oldIndex.value];
    };

    const getIsAvail = (toElement) => {
      if (!toElement) {
        return false;
      }
      const isSvg =
        typeof toElement?.className === "object" ||
        toElement?.className?.includes("svg");
      let toParentNodeClsName;
      let isError = false;
      if (!isSvg) {
        toParentNodeClsName = toElement?.parentNode?.className ?? "";
        console.log("toParentNodeClsName", toParentNodeClsName);
        isError =
          toParentNodeClsName.includes("arco-image-error") ||
          toElement.className.includes("arco-image-error");
      }
      return (
        isSvg || toParentNodeClsName.includes("drag-variant-image") || isError
      );
    };

    const end = (e) => {
      const toElement = e.originalEvent?.toElement;
      console.log("toElement", toElement.className);
      const isAvail = getIsAvail(toElement);
      if (isAvail) {
        const msku = targetImageItemMsku.value;
        const idx = state.item.selectedVariantImages.findIndex(
          (item) => item.msku === msku
        );
        if (idx !== -1) {
          const variantImage =
            state.item.selectedVariantImages[idx].productImages?.[0];
          let variantImageClone;
          if (variantImage) {
            variantImageClone = JSON.parse(JSON.stringify(variantImage));
            state.item.unSelectedVariantAndPImages[oldIndex.value] =
              variantImageClone;
          } else {
            state.item.unSelectedVariantAndPImages.splice(oldIndex.value, 1);
          }
          state.item.selectedVariantImages[idx].productImages[0] =
            startImg.value;
        }
        startImg.value = {};
        targetImageItem.value = {};
        targetImageItemMsku.value = "";
      }
    };

    const move = (e) => {
      const isDisable = e.to.className.includes(
        "product-images-content-draggable"
      );
      if (isDisable) {
        console.log("move-isDisable", isDisable);
        return true;
      }
      const toElement = e.originalEvent?.toElement;
      const toParentNodeCls = toElement?.parentNode?.className ?? "";
      if (toParentNodeCls.includes("drag-product-image")) {
        return true;
      }
      const isAvail = getIsAvail(toElement);
      if (isAvail) {
        const targetItem = e.relatedContext?.element;
        targetImageItemMsku.value = targetItem.msku;
        targetImageItem.value = targetItem.productImages[0];
      }
      return false;
    };

    const onstart = (e) => {
      oldIndex.value = e.oldIndex;
      startImg.value =
        state.item.selectedVariantImages[oldIndex.value].productImages[0];
      targetImageItemMsku.value =
        state.item.selectedVariantImages[oldIndex.value].msku;
    };

    const onend = (e) => {
      const toElement = e.to;
      const toParentNodeCls = toElement.className;
      if (toParentNodeCls.includes("product-images-content-draggable")) {
        const msku = targetImageItemMsku.value;
        const idx = state.item.selectedVariantImages.findIndex(
          (item) => item.msku === msku
        );
        const variantItemImage = JSON.parse(
          JSON.stringify(state.item.selectedVariantImages[idx].productImages[0])
        );
        state.item.selectedVariantImages[idx].productImages = [];
        state.item.unSelectedVariantAndPImages[e.newIndex] = variantItemImage;
      }
      startImg.value = {};
      targetImageItemMsku.value = "";
    };

    return {
      draftRef,
      ...toRefs(state),
      cancel,
      openImgView,
      deleteProductImage,
      deleteVariantImage,
      customValidator,
      getAttrValueDesc,
      start,
      end,
      move,
      onstart,
      onend,
      saveDraft,
    };
  },
});
</script>
<style lang="scss" scoped>
.draft-content {
  padding: 0 24px;
  .arco-modal-body {
    padding: 0;
  }
  .text-box {
    margin-top: 10px;
    div {
      display: inline-block;
      padding: 10px 10px 10px 0px;
    }

    .type {
      background: #e6ecfe;
      color: #0045f0;
      border-radius: 4px;
      padding: 1px 4px;
      margin-right: 10px;
      height: 16px;
      line-height: 16px;
    }
    .pl-10 {
      padding-right: 10px;
    }
  }
}
.mb-32 {
  margin-bottom: 32px;
}
.draft-item-content {
  padding: 12px 16px 16px 16px;
  margin-top: 16px;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e6e6ed;
  border-radius: 8px;
  .draft-item-tip {
    line-height: 16px;
    margin-bottom: 8px;
    .text {
      font-size: 12px;
      color: #000430;
      > span {
        color: #808197;
      }
    }
  }
  .draft-item-tip2 {
    margin: 12px 0 4px 0;
  }
  .tip {
    font-size: 12px;
    color: #808197;
  }
}

.draft-item-desc-content {
  padding-top: 16px;
}

.actions-wrap {
  border-radius: 8px !important;
}
.actions {
  .action {
    &:not(:first-child) {
      margin-left: 12px !important;
    }
  }
}
:deep(.arco-image) {
  .arco-image-footer {
    border-radius: 6px;
  }
}
.b-d-d {
  border-radius: 6px;
  border: 1px dashed #99b5f9;
}
.draft-item {
  flex: 0 0 100%;
  width: 100%;
}

.draggable-wrap,
.draft-item-desc-content {
  position: relative;
  .empty {
    color: #b3b4c1;
    font-size: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.content-draggable {
  min-height: 120px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  > div {
    margin: 8px 8px 0 0;
  }
}

.products-content-draggable,
.variants-content-draggable {
  padding: 0 0 8px 8px;
  .image-desc {
    color: #666883;
    padding-bottom: 12px;
    width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.draft-item-tit {
  line-height: 16px;
  color: #000430;
  font-size: 12px;
  font-weight: 700;
}
</style>
