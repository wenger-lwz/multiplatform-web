<template>
  <full-screen-dialog @open="getStoreList" :dialogVisible="dialogVisible">
    <template #title>
      <div class="dialog-title">
        <span>配置草稿</span>
        <gj-button @click="cancel">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="draft-content">
        <div class="header">
          <div class="header-left">
            <gj-select
              v-model="draftForm.stores"
              placeholder="请选择店铺"
              multiple
              allow-clear
              :max-tag-count="1"
              :style="{ width: '230px' }"
            >
              <gj-option
                :label="item.storeName"
                :value="item.shopId"
                v-for="item in storeList"
                :key="item.shopId"
              ></gj-option>
            </gj-select>
            <gj-button
              size="mini"
              type="text"
              class="generate-btn"
              @click="generateDraftList"
              >生成草稿清单</gj-button
            >
          </div>

          <div class="header-right">
            <gj-checkbox
              v-model="allSelect"
              :disabled="!draftListLength"
              :indeterminate="indeterminate"
              @change="selectAll"
              >全选</gj-checkbox
            >
            <span>({{ selectedRows.length }}/{{ draftListLength }})</span>
          </div>
        </div>
        <div v-if="drafts.length" class="draft-list">
          <div
            class="draft-list-item"
            v-for="(item, idx) in drafts"
            :key="item.productId"
          >
            <div class="draft-list-item-header">
              <div class="draft-list-item-header-left">
                <gj-checkbox
                  v-model="item.isSeleced"
                  @change="selectChange"
                ></gj-checkbox>
                <span class="sku">{{ item.spu }}</span>
                <span class="type">
                  {{ item.specsType == 2 ? "变体" : "单品" }}
                </span>
              </div>
              <div
                class="draft-list-item-header-right"
                @click="editDraft(item)"
              >
                编辑
              </div>
            </div>
            <div class="store-name">
              <span>{{ item.storeName }}</span>
            </div>
            <!-- 标题 -->
            <gj-form
              :model="draftForm"
              :ref="
                (el) => {
                  if (el) {
                    titleRef[idx] = el;
                    titleMap.set(idx, item.productId);
                  }
                }
              "
              :label-col-props="{ span: 24 }"
              :wrapper-col-props="{ span: 24 }"
              label-align="left"
            >
              <gj-form-item
                label="标题"
                field="title"
                :rules="[
                  {
                    required: true,
                    validator: (value, cb) => customValidator(value, cb, item),
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
            </gj-form>
            <!-- 产品图片 -->
            <div class="draft-item">
              <div class="draft-item-tit">产品图片</div>
              <div class="draft-item-content">
                <draggable
                  tag="div"
                  item-key="hashCodes"
                  handle=".drag-handle"
                  :list="item.productImages"
                  :group="`productImages-${idx}`"
                  animation="300"
                  class="draft-item-drag"
                >
                  <template #item="{ element, index }">
                    <div v-if="index < 5" class="drag-image-wrap">
                      <gj-image
                        width="48"
                        height="48"
                        class="drag-image"
                        alt="无图"
                        :src="element.resource"
                      />
                      <div v-if="index === 0" class="drag-image-tag">主图</div>
                      <div class="actions-wrap">
                        <div class="actions">
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
                        </div>
                      </div>
                    </div>
                  </template>
                </draggable>
                <div
                  class="draft-item-more"
                  v-if="item.productImages.length > 5"
                  @click="editDraft(item)"
                >
                  <span>{{ item.productImages.length - 5 }}</span>
                  <svg-icon svgClass="imgRigth" :width="12" />
                </div>
                <div v-if="!item.productImages.length" class="drag-image-wrap">
                  <gj-image
                    width="48"
                    height="48"
                    class="drag-image"
                    alt="无图"
                    src=""
                  />
                  <div class="drag-image-tag">主图</div>
                </div>
              </div>
            </div>
            <!-- 变体图片 -->
            <div class="draft-item">
              <div class="draft-item-tit">变体图片</div>
              <div
                class="draft-item-content"
                :class="{ 'no-content': !item.variantImages.length }"
              >
                <template v-if="item.variantImages.length">
                  <div
                    class="drag-image-wrap"
                    v-for="(imageItem, idx) in item.variantImages"
                    :key="idx"
                  >
                    <gj-image
                      v-if="idx < 5"
                      class="drag-image"
                      width="48"
                      height="48"
                      alt="无图"
                      :src="imageItem?.productImages?.[0]?.resource"
                    />
                    <div
                      v-else
                      class="draft-item-more"
                      @click="editDraft(item)"
                    >
                      <span>{{ item.variantImages.length - 5 }}</span>
                      <svg-icon svgClass="imgRigth" :width="12" />
                    </div>
                    <div class="drag-image-desc">
                      {{ getAttrValueDesc(imageItem.variantAttrInfo) }}
                    </div>
                    <div
                      v-if="imageItem?.productImages?.length"
                      class="actions-wrap"
                    >
                      <div class="actions">
                        <span class="action preview-handle">
                          <svg-icon
                            svgClass="Showz"
                            :width="16"
                            @click="
                              openImgView(
                                imageItem?.productImages?.[0]?.resource
                              )
                            "
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="empty">暂无数据</div>
              </div>
            </div>
            <!-- 描述 -->
            <div class="draft-item">
              <div class="draft-item-tit">描述</div>
              <div class="draft-item-content">
                <gj-image
                  class="drag-image"
                  width="48"
                  height="48"
                  alt="无图"
                  :src="item?.previewUrl"
                >
                  <template #extra>
                    <div class="actions">
                      <span class="action preview-handle">
                        <svg-icon
                          svgClass="Showz"
                          :width="16"
                          @click="openImgView(item?.previewUrl)"
                        />
                      </span>
                    </div>
                  </template>
                </gj-image>
              </div>
            </div>
          </div>
          <gj-image-preview
            :src="previewImgSrc"
            v-model:visible="previewVisible"
          />
        </div>
        <div v-else class="empty">暂无数据</div>
      </div>
    </template>
    <template #footer>
      <gj-space>
        <gj-button @click="cancel">取消</gj-button>
        <gj-button type="primary" @click="confirm" :disabled="!isDisabled"
          >生成草稿</gj-button
        >
      </gj-space>
    </template>
  </full-screen-dialog>
  <edit-draft
    :dialogVisible="editDraftVisible"
    :draftsItem="draftsItem"
    @cancel="closeEditDraftModal"
    @saveDraft="saveDraft"
  />
</template>
<script>
import { defineComponent, ref, reactive, toRefs, computed } from "vue";
import { GjMessage } from "@gj/atom";
import SvgIcon from "@/components/SvgIcon";
import Draggable from "vuedraggable";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog.vue";
import EditDraft from "./EditDraft.vue";
import { getStoreInformationlist } from "@api/published/common.js";
import { generateDrafts, createDrafts } from "@api/published/shopify.js";

export default defineComponent({
  components: {
    fullScreenDialog,
    SvgIcon,
    EditDraft,
    Draggable,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    goodsRow: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  emits: ["cancel", "confirm"],
  setup(props, { emit }) {
    const titleRef = ref([]);
    const titleMap = ref(new Map());
    const state = reactive({
      selectedRows: [],
      draftListLength: 0,
      draftForm: {
        stores: [],
      },
      storeList: [],
      isDisabled: false,
      editDraftVisible: false,
      drafts: [],
      draftsItem: {},
      previewImgSrc: "",
      previewVisible: false,
    });

    const allSelect = computed(() => {
      const selectedRowLen = state.selectedRows.length;
      const templateDataLen = state.drafts.length;
      if (selectedRowLen === 0) {
        return false;
      }
      return selectedRowLen === templateDataLen;
    });

    const indeterminate = computed(() => {
      const selectedRowLen = state.selectedRows.length;
      const templateDataLen = state.drafts.length;
      if (selectedRowLen === 0) {
        return false;
      }
      if (selectedRowLen === templateDataLen) {
        return false;
      }
      return selectedRowLen < templateDataLen;
    });

    const resetDrafts = () => {
      state.selectedRows = [];
      state.draftForm.stores = [];
      state.isDisabled = false;
      state.drafts = [];
      state.draftsItem = {};
      state.previewImgSrc = "";
    };

    const getStoreList = () => {
      let params = {
        platformCode: "SHOPIFY",
      };
      getStoreInformationlist(params).then((res) => {
        state.storeList = res.data.map((item) => {
          return {
            storeName: item.shopName,
            shopId: item.shopId,
          };
        });
      });
    };

    const getStoreName = (shopId) => {
      const matched = state.storeList.find(
        (storeItem) => storeItem.shopId === shopId
      );
      return matched?.storeName ?? "-";
    };

    const cancel = () => {
      emit("cancel");
      resetDrafts();
    };

    const generateDraftList = () => {
      if (state.draftForm.stores.length <= 0) {
        return GjMessage.warning("未选择店铺");
      }
      let params = {
        productId: props.goodsRow,
        shopId: state.draftForm.stores,
      };
      generateDrafts(params).then((res) => {
        state.drafts = res.data.map((item, index) => {
          return {
            ...item,
            index,
            isSeleced: false,
            storeName: getStoreName(item.shopId),
            variantImages: item?.variants ?? [],
          };
        });
        if (res.data.length > 0) {
          state.draftListLength = res.data.length;
          state.isDisabled = true;
        }
      });
    };

    const editDraft = (draftItem) => {
      const draft = {
        ...draftItem,
        productImagesLen: draftItem.productImages.length,
        selectedProductImages: draftItem?.productImages ?? [],
        unSelectedProductImages: draftItem?.unSelectedProductImages ?? [],
        selectedVariantImages: draftItem?.variantImages ?? [],
        unSelectedVariantAndPImages:
          draftItem?.unSelectedVariantAndPImages ?? draftItem.productImages,
      };
      state.draftsItem = JSON.parse(JSON.stringify(draft));
      state.editDraftVisible = true;
    };

    const saveDraft = (draftItem) => {
      state.editDraftVisible = false;
      const idx = state.drafts.findIndex(
        (draft) => draft.index === draftItem.index
      );
      state.drafts[idx].title = draftItem.title;
      state.drafts[idx].productImages = draftItem.selectedProductImages;
      state.drafts[idx].unSelectedProductImages =
        draftItem.unSelectedProductImages;
      state.drafts[idx].variantImages = draftItem.selectedVariantImages;
      state.drafts[idx].unSelectedVariantAndPImages =
        draftItem.unSelectedVariantAndPImages;
    };

    const selectChange = () => {
      state.selectedRows = state.drafts.filter((item) => {
        return item.isSeleced;
      });
    };

    const selectAll = (isSelected) => {
      state.drafts = state.drafts.map((item) => {
        return {
          ...item,
          isSeleced: isSelected,
        };
      });
      if (isSelected) {
        state.selectedRows = state.drafts;
      } else {
        state.selectedRows = [];
      }
    };

    const openImgView = (src) => {
      state.previewImgSrc = src;
      state.previewVisible = true;
    };

    const closeEditDraftModal = () => {
      state.editDraftVisible = false;
    };

    const getAttrValueDesc = (variantAttrInfo = []) => {
      return variantAttrInfo
        .map((variantAttrItem) => {
          return variantAttrItem.attrValue;
        })
        .join("+");
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

    const getTitRefValidate = (titRef, idx) => {
      return new Promise((resolve) => {
        const productId = titleMap.value.get(idx);
        const isSelected = state.selectedRows.includes(productId);
        if (isSelected) {
          titRef.validateField("title").then((errors) => {
            if (errors) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        } else {
          resolve(true);
        }
      });
    };

    const titValidate = () => {
      const arr = [];
      titleRef.value.forEach((titRef, idx) => {
        arr.push(getTitRefValidate(titRef, idx));
      });
      return arr;
    };

    const getSelectedRowsParams = () => {
      return state.selectedRows.map((draft) => {
        return {
          shopId: draft.shopId,
          storeName: draft.storeName,
          title: draft.title,
          productId: draft.productId,
          productImages: draft.productImages,
          variantImages: draft.variantImages,
          previewUrl: draft.previewUrl,
        };
      });
    };

    const confirm = async () => {
      if (state.selectedRows.length == 0) {
        GjMessage.warning("请先勾选要操作的内容行");
        return;
      }
      const promiseArr = titValidate();
      const res = await Promise.all(promiseArr);
      const isSubmit = res.every((item) => item);
      if (!isSubmit) {
        return;
      }

      const params = {
        draftCreateConfiguration: getSelectedRowsParams(),
      };
      createDrafts(params).then(() => {
        GjMessage.success(`生成草稿成功`);
        emit("confirm");
        resetDrafts();
      });
    };

    return {
      titleRef,
      titleMap,
      ...toRefs(state),
      allSelect,
      indeterminate,
      getStoreList,
      customValidator,
      cancel,
      confirm,
      generateDraftList,
      selectChange,
      selectAll,
      openImgView,
      getAttrValueDesc,
      closeEditDraftModal,
      editDraft,
      saveDraft,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.actions) {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  .action {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666883;
    background: #d9e3fd;
    border-radius: 20px;
    &:not(:first-child) {
      margin-left: 3px;
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
  &:hover {
    .actions-wrap {
      display: block;
    }
    .arco-image {
      &:not(.arco-image-loading-error) {
        border: 1px solid rgba(0, 69, 240, 0.8);
      }
    }
  }
  .actions-wrap {
    position: absolute;
    display: none;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 4, 48, 0.3);
    z-index: 100;
    border-radius: 4px;
  }
}
:deep(.arco-image) {
  --border-radius-small: 4px;
  border: 1px solid #e6e6ed;
  z-index: 99;
  &:not(.arco-image-loading-error) {
    &:hover {
      border: 1px solid rgba(0, 69, 240, 0.8);
      .arco-image-footer {
        display: block;
      }
    }
  }
  .arco-image-footer {
    top: 0;
    display: none;
  }
  .arco-image-overlay {
    border-radius: 8px;
    overflow: hidden;
  }
  .arco-image-error {
    background-color: #fff;
  }
  .arco-image-error-icon {
    display: none;
  }
  .arco-image-error-alt {
    padding: 0;
    color: #b3b4c1;
  }
}

.draft-content {
  padding: 0 12px 0 24px;
  .header {
    height: 32px;
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-left {
      display: flex;
      align-items: center;
      .generate-btn {
        color: #0045f0;
        margin-left: 16px;
      }
    }
    .header-right {
      display: flex;
    }
  }
  .arco-modal-body {
    padding: 0;
  }
  .draft-list {
    display: flex;
    flex-wrap: wrap;
    .draft-list-item {
      font-size: 12px;
      width: 366px;
      height: 376px;
      padding: 12px 12px 12px;
      box-sizing: border-box;
      margin-right: 14px;
      margin-bottom: 14px;
      border: 1px solid #e6e6ed;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .draft-list-item-header {
        display: flex;
        justify-content: space-between;
        .draft-list-item-header-left {
          display: flex;
          align-items: center;
          .sku {
            color: #000430;
            font-weight: 700;
            margin: 0 4px 0 8px;
          }
          .type {
            background: #e6ecfe;
            color: #0045f0;
            border-radius: 4px;
            padding: 1px 4px;
            height: 16px;
            line-height: 16px;
          }
          .shop {
            margin-left: 4px;
            color: #000430;
            font-weight: 700;
            width: 118px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .draft-list-item-header-right {
          color: #0045f0;
          cursor: pointer;
        }
      }
      .store-name {
        padding-top: 10px;
      }
      .draft-item-tit {
        line-height: 16px;
        padding: 12px 0 4px 0;
        color: rgba(0, 4, 48, 0.8);
        font-size: 12px;
        font-weight: 400;
      }
      .draft-item-more {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        border: 1px solid rgba(0, 4, 48, 0.05);
        box-sizing: border-box;
        color: #999bac;
        cursor: pointer;
        span {
          display: inline-block;
          padding: 0 6px;
          line-height: 50px;
        }
      }
    }
  }

  .empty {
    padding: 20px;
    color: #b3b4c1;
    font-size: 12px;
    text-align: center;
  }
}
:deep(.arco-form-item-label-col) {
  line-height: 24px;
}

:deep(.arco-form-item-wrapper-col) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  min-height: 24px;
}
:deep(.arco-form-item) {
  margin-bottom: 0px;
}
.draft-item-content {
  display: flex;
}
.draft-item-drag {
  display: flex;
}
.drag-image-wrap {
  position: relative;
  margin-right: 8px;
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
:deep(.drag-image-desc) {
  max-width: 40px;
  color: #000430;
  padding: 0 4px;
  height: 18px;
  text-align: center;
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.7);
  border-radius: 4px 4px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 100;
}
.no-content {
  height: 50px;
  align-items: center;
  justify-content: center;
}
</style>
