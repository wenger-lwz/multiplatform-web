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
            <gj-form
              ref="draftRef"
              label-align="left"
              layout="horizontal"
              style="width: 500px"
              :rules="rules"
              :model="draftForm"
            >
              <gj-form-item
                label="店铺"
                field="stores"
                show-colon
                :label-col-props="{ span: 3 }"
                :validate-trigger="validateTriggerOpt"
              >
                <gj-select
                  class="w-230"
                  placeholder="请选择店铺"
                  multiple
                  allow-clear
                  :max-tag-count="1"
                  v-model="draftForm.stores"
                >
                  <gj-option
                    v-for="item in storeList"
                    :label="`${item.storeName}${
                      item.region ? '(' + item.region + ')' : ''
                    }`"
                    :value="item.storeId"
                    :key="item.storeId"
                  ></gj-option>
                </gj-select>
                <gj-button
                  size="mini"
                  type="text"
                  class="generate-btn"
                  @click="generateDraftList"
                  >生成草稿清单</gj-button
                >
              </gj-form-item>
            </gj-form>
          </div>

          <div class="header-right">
            <gj-checkbox
              v-model="allSelect"
              :disabled="!draftListLength"
              :indeterminate="indeterminate"
              @change="selectAll"
              >全选</gj-checkbox
            >
            <span>({{ selectedRowKeys.length }}/{{ draftListLength }})</span>
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
                  @change="setSeleced"
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
              <span>{{ item.siteName || "--" }}</span>
              <span>{{ item.shopName || "--" }}</span>
            </div>
            <!-- 标题和刊登模板 -->
            <gj-form
              label-align="left"
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
            >
              <gj-form-item
                label="标题"
                field="title"
                :validate-status="item.validateStatus"
                :rules="[
                  {
                    required: true,
                    validator: (value, cb) => customValidator(value, cb, item),
                  },
                ]"
                :validate-trigger="validateTriggerOpt"
              >
                <template v-if="item.titleNotExistAll">
                  <gj-select
                    class="title-select"
                    placeholder="请选择标题"
                    allow-create
                    v-model="item.title"
                    allow-clear
                  >
                    <gj-option
                      :label="titleItem.title"
                      :value="titleItem.title"
                      v-for="(titleItem, index) in item.titles"
                      :key="index"
                    ></gj-option>
                  </gj-select>
                </template>
                <template v-else>
                  <gj-input
                    placeholder="请输入"
                    allow-clear
                    show-word-limit
                    :max-length="255"
                    v-model="item.title"
                  />
                </template>
              </gj-form-item>
            </gj-form>
            <!-- 产品图片 -->
            <div class="draft-item">
              <div class="draft-item-tit">产品图片</div>
              <div class="draft-item-content">
                <draggable
                  class="draft-item-drag"
                  tag="div"
                  item-key="hashCodes"
                  handle=".drag-handle"
                  animation="300"
                  :list="item.productImages"
                  :group="`productImages-${idx}`"
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
                      <div v-if="element.mainImage" class="drag-image-tag">
                        主图
                      </div>
                      <div class="danger-tip-wrap">
                        <div class="actions-wrap">
                          <div class="actions">
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
                          </div>
                        </div>
                        <div class="danger-tip" v-if="element.exist">
                          <gj-tooltip
                            position="rb"
                            content="主图均在该店铺在线商品应用,选择该主图不影响发布,也可点击编辑更换"
                          >
                            <SvgIcon svgClass="warningIcon" :width="10" />
                          </gj-tooltip>
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
                    alt="暂无"
                    src=""
                  />
                </div>
              </div>
            </div>
            <div class="draft-item border-wrap">
              <div class="draft-item-tit">属性图片</div>
              <div
                :class="{
                  'no-content': !item.variantImageList?.length,
                }"
              >
                <template v-if="item.variantImageList?.length">
                  <div
                    v-for="(varItem, indexNum) in item.variantImageList"
                    :key="indexNum"
                  >
                    <p class="variant-title">
                      {{ varItem.attrName || "--" }}:
                      {{ varItem.attrValueName }}
                    </p>
                    <div class="draft-item-content">
                      <draggable
                        class="draft-item-drag"
                        tag="div"
                        item-key="hashCodes"
                        handle=".drag-handle"
                        animation="300"
                        :list="varItem.selectedImages"
                        :group="`${varItem.attrName}-${varItem.attrValueName}-${idx}`"
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
                            <div class="actions-wrap">
                              <div class="actions">
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
                              </div>
                            </div>
                          </div>
                        </template>
                      </draggable>
                      <div
                        class="draft-item-more"
                        v-if="varItem.selectedImages.length > 5"
                        @click="editDraft(item)"
                      >
                        <span>{{ varItem.selectedImages.length - 5 }}</span>
                        <svg-icon svgClass="imgRigth" :width="12" />
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="empty">暂无属性图片</div>
              </div>
            </div>
            <!-- 视频 -->
            <div class="draft-item">
              <div class="draft-item-tit">视频</div>
              <div class="draft-item-content">
                <div class="video-item-wrap">
                  <gj-image
                    class="drag-image"
                    width="48"
                    height="48"
                    :alt="getErrorName(item.video)"
                    :src="item.video?.videoCoverUrl"
                  >
                  </gj-image>
                  <div class="actions-wrap" v-if="item.video?.resourceId">
                    <div class="actions">
                      <span class="action preview-handle">
                        <SvgIcon
                          svgClass="startVideo"
                          :width="16"
                          @click="openVideoView(item.video?.resourceId)"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 描述 -->
            <div class="draft-item">
              <div class="draft-item-tit">描述</div>
              <div class="draft-item-content">
                <div class="long-desc">
                  <gj-image
                    class="drag-image"
                    width="48"
                    height="48"
                    :alt="
                      getErrorName(item.longDescriptions[item.longCheckBox])
                    "
                    :src="item.longDescriptions[item.longCheckBox]?.previewUrl"
                  >
                    <template #extra>
                      <div class="actions">
                        <span class="action preview-handle">
                          <SvgIcon
                            svgClass="Showz"
                            :width="16"
                            @click="
                              openImgView(
                                item.longDescriptions[item.longCheckBox]
                                  ?.previewUrl
                              )
                            "
                          />
                        </span>
                      </div>
                    </template>
                  </gj-image>
                  <p class="desc-title">长描述</p>
                </div>

                <div class="short-desc">
                  <gj-image
                    class="drag-image"
                    width="48"
                    height="48"
                    :alt="
                      getErrorName(item.shortDescriptions[item.shortCheckBox])
                    "
                    :src="
                      item.shortDescriptions[item.shortCheckBox]?.previewUrl
                    "
                  >
                    <template #extra>
                      <div class="actions">
                        <span class="action preview-handle">
                          <SvgIcon
                            svgClass="Showz"
                            :width="16"
                            @click="
                              openImgView(
                                item.shortDescriptions[item.shortCheckBox]
                                  ?.previewUrl
                              )
                            "
                          />
                        </span>
                      </div>
                    </template>
                  </gj-image>
                  <p class="desc-title">短描述</p>
                </div>
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
  <DraftEditDialog
    v-if="editDraftVisible"
    :dialogVisible="editDraftVisible"
    :draftsItem="draftsItem"
    @cancel="closeEditDraftModal"
    @saveDraft="saveDraft"
  />
  <Video-modal
    v-model:visible="playerVisible"
    :src="previewVideoUrl"
  ></Video-modal>
</template>
<script>
import { defineComponent, ref, reactive, toRefs, computed } from "vue";
import { useRouter } from "vue-router";
import { GjMessage } from "@gj/atom";
import { validateTriggerOpt } from "@common";
import { getStoreInformationlist } from "@api/published/common.js";
import Draggable from "vuedraggable";
import { getDraftList, createDraftByList } from "@/api/published/lazada";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog.vue";
import SvgIcon from "@/components/SvgIcon";
import VideoModal from "@/components/VideoModal.vue";
import DraftEditDialog from "./DraftEditDialog.vue";

// import { mockData } from "./data.js";

export default defineComponent({
  components: {
    Draggable,
    fullScreenDialog,
    SvgIcon,
    VideoModal,
    DraftEditDialog,
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
    const $router = useRouter();
    const titleRef = ref([]);
    const titleMap = ref(new Map());
    const state = reactive({
      selectedRowKeys: [],
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
      playerVisible: false,
      previewVideoUrl: "",
    });

    const rules = {
      stores: [{ required: true, message: "店铺必选" }],
    };

    const allSelect = computed(() => {
      const selectedRowLen = state.selectedRowKeys.length;
      const templateDataLen = state.drafts.length;
      if (selectedRowLen === 0) {
        return false;
      }
      return selectedRowLen === templateDataLen;
    });

    const indeterminate = computed(() => {
      const selectedRowLen = state.selectedRowKeys.length;
      const templateDataLen = state.drafts.length;
      if (selectedRowLen === 0) {
        return false;
      }
      if (selectedRowLen === templateDataLen) {
        return false;
      }
      return selectedRowLen < templateDataLen;
    });

    const cancel = () => {
      emit("cancel");
    };

    const getStoreList = () => {
      let params = {
        platformCode: "LAZADA",
      };
      getStoreInformationlist(params).then((res) => {
        state.storeList = res.data.map((item) => {
          // todo
          return {
            storeName: item.shopName,
            storeId: item.shopId,
            region: item.region,
          };
        });
      });
    };

    const getVariantImageList = (item) => {
      const result = [];
      let variantTemp = null;
      if (item.variantsImage) {
        item.variantsImage?.attributeValues?.forEach((it) => {
          variantTemp = {
            attrName: item.variantsImage.attrName,
            attrValueName: it.attrValueName,
            // 过滤缩略图
            selectedImages: it.variantImages.filter(
              (varItem) => !varItem.thumbnail
            ),
            // 过滤缩略图
            unSelectImages:
              item.variantsLeftImage?.attributeValues
                .find((attrItem) => attrItem.attrValueName === it.attrValueName)
                ?.variantImages.filter((varItem) => !varItem.thumbnail) || [],
          };
          result.push(variantTemp);
        });
      }
      return result;
    };

    // 生成草稿清单
    const generateDraftList = () => {
      if (state.draftForm.stores.length <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      let params = {
        productIds: props.goodsRow.join(),
        shopIds: state.draftForm.stores.join(),
      };
      getDraftList(params)
        .then((res) => {
          state.drafts = res.data.map((item) => {
            const longDescriptions =
              item.descriptions?.filter((it) => it.type === 0) || [];
            const shortDescriptions =
              item.descriptions?.filter((it) => it.type === 1) || [];
            // title的默认填充规则
            const flag = item.titles?.find((it) => !it.exist) || false;
            if (flag) {
              item.title = flag.title;
            }
            return {
              ...item,
              variantImageList: getVariantImageList(item),
              titleNotExistAll: flag,
              isSeleced: false,
              longCheckBox: [0],
              longDescriptions: longDescriptions,
              shortDescriptions: shortDescriptions,
              shortCheckBox: [0],
            };
          });
          if (res.data.length > 0) {
            state.draftListLength = res.data.length;
            state.isDisabled = true;
          }
        })
        .finally(() => {
          state.draftForm.stores = [];
        });
    };

    const editDraft = (draftItem) => {
      const draft = {
        ...draftItem,
        selectedVideo: draftItem.video ? [{ ...draftItem.video }] : [],
      };
      state.draftsItem = JSON.parse(JSON.stringify(draft));
      state.editDraftVisible = true;
    };

    const setSeleced = () => {
      state.selectedRowKeys = state.drafts.flatMap((item) =>
        !item.isSeleced ? [] : [item.productId]
      );
    };

    const selectAll = (isSelected) => {
      state.drafts = state.drafts.map((item) => {
        return {
          ...item,
          isSeleced: isSelected,
        };
      });
      if (isSelected) {
        state.selectedRowKeys = state.drafts.map((row) => {
          return row.productId;
        });
      } else {
        state.selectedRowKeys = [];
      }
    };

    const openImgView = (src) => {
      state.previewImgSrc = src;
      state.previewVisible = true;
    };

    const openVideoView = (src) => {
      state.previewVideoUrl = src;
      state.playerVisible = true;
    };

    const closeEditDraftModal = () => {
      state.editDraftVisible = false;
    };

    const saveDraft = (editObj) => {
      state.editDraftVisible = false;
      const productId = editObj.item.productId;
      const idx = state.drafts.findIndex(
        (draft) => draft.productId === productId
      );
      state.drafts[idx].title = editObj.item.title;
      state.drafts[idx].productImages = editObj.item.productImages;
      state.drafts[idx].leftImages = editObj.item.leftImages;

      state.drafts[idx].variantImageList = editObj.item.variantImageList;

      state.drafts[idx].video = editObj.item.selectedVideo[0] || {};
      state.drafts[idx].leftVideos = editObj.item.leftVideos || [];

      state.drafts[idx].descriptions = editObj.item.descriptions;
      state.drafts[idx].longDescriptions = editObj.longDescriptions;
      state.drafts[idx].longCheckBox = editObj.longCheckBox;
      state.drafts[idx].shortDescriptions = editObj.shortDescriptions;
      state.drafts[idx].shortCheckBox = editObj.shortCheckBox;
    };

    const customValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!record.title) {
            record.validateStatus = "error";
            cb("标题必填");
          }
          const target = record.titles?.find(
            (it) => value && it.title === value
          );
          if (target && target.exist) {
            record.validateStatus = "warning";
            cb("该标题已存在本店铺在线商品中");
          }
          resolve();
        }, 0);
      });
    };

    const getTitRefValidate = (titRef, idx) => {
      return new Promise((resolve) => {
        const productId = titleMap.value.get(idx);
        const isSelected = state.selectedRowKeys.includes(productId);
        if (isSelected) {
          titRef.validateField("title").then((errors) => {
            if (errors) {
              console.log("验证失败", errors);
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

    const getVariantImage = (oldImage, newImage) => {
      const { attributeValues, ...rest } = oldImage;
      const obj = { ...rest };
      obj.attributeValues = [];
      attributeValues?.forEach((it) => {
        const { variantImages, ...rs } = it;
        const temp = { ...rs };
        const target = newImage.find(
          (newIt) => newIt.attrValueName === it.attrValueName
        );
        temp.variantImages =
          variantImages?.filter((image) => image.thumbnail) || [];
        if (target) {
          temp.variantImages = [
            ...(target.selectedImages || []),
            ...temp.variantImages,
          ];
        }
        obj.attributeValues.push(temp);
      });
      return obj;
    };

    const confirm = async () => {
      if (state.selectedRowKeys.length == 0) {
        GjMessage.warning("请选择要生成的草稿！");
        return;
      }
      const promiseArr = titValidate();
      const res = await Promise.all(promiseArr);
      const isSubmit = res.every((item) => item);
      if (!isSubmit) {
        return;
      }
      const draftList = [];
      state.drafts.forEach((draft) => {
        if (draft.isSeleced) {
          const longDescItem = draft.longDescriptions[draft.longCheckBox];
          const shortDescItem = draft.shortDescriptions[draft.shortCheckBox];
          let descriptions = [];
          if (longDescItem) {
            descriptions.push(longDescItem);
          }
          if (shortDescItem) {
            descriptions.push(shortDescItem);
          }
          draftList.push({
            descriptions,
            productId: draft.productId,
            productImages: draft.productImages,
            shopId: draft.shopId,
            siteCode: draft.siteCode,
            specsType: draft.specsType,
            spu: draft.spu,
            titles: draft.title,
            variantsImage: getVariantImage(
              draft.variantsImage,
              draft.variantImageList
            ),
            video: draft.video,
          });
        }
      });
      const params = {
        draftList,
      };
      createDraftByList(params)
        .then(() => {
          GjMessage.success(`生成草稿成功`);
          setTimeout(() => {
            $router.push("/publishedDraft");
          }, 200);
        })
        .catch((res) => {
          GjMessage.warning(res.message);
        });
    };

    const getOtherLength = (arr = []) => {
      return arr.filter((item) => !item.thumbnail).length;
    };

    const getErrorName = (val) => {
      return val ? "无图" : "暂无";
    };

    return {
      ...toRefs(state),
      validateTriggerOpt,
      titleRef,
      titleMap,
      rules,
      allSelect,
      indeterminate,
      customValidator,
      cancel,
      confirm,
      getStoreList,
      generateDraftList,
      setSeleced,
      selectAll,
      openImgView,
      openVideoView,
      closeEditDraftModal,
      editDraft,
      saveDraft,
      getOtherLength,
      getErrorName,
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
  .danger-tip-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  &:hover {
    .actions-wrap {
      display: inline-block;
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
  .danger-tip {
    position: absolute;
    right: 2px;
    bottom: -3px;
    z-index: 101;
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
    padding: 16px 32px 0 0;
    display: flex;
    justify-content: space-between;
    .header-left {
      display: flex;
      align-items: center;
      .generate-btn {
        color: #0045f0;
        margin-left: 16px;
      }
      :deep(.w-230) {
        width: 230px;
      }
    }
    .header-right {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
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
      width: 384px;
      // height: 376px;
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
        span {
          word-break: break-all;
          &:last-child {
            margin-left: 12px;
          }
        }
      }
      .title-select {
        width: 100%;
      }
      .draft-item-tit {
        line-height: 16px;
        padding: 12px 0 4px 0;
        color: rgba(0, 4, 48, 0.8);
        font-size: 12px;
        font-weight: 400;
      }
      .draft-item-more {
        margin-left: 8px;
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

    // 属性图片
    .border-wrap {
      border: 1px solid #f2f2f5;
      border-radius: 8px;
      padding-left: 4px;
      margin-top: 14px;
      padding-bottom: 8px;
      max-height: 172px;
      min-height: 80px;
      box-sizing: content-box;
      overflow: hidden;
      overflow-y: auto;
      .draft-item-tit {
        padding: 0;
      }
      .variant-title {
        color: #666883;
        line-height: 12px;
        font-size: 12px;
        margin: 8px 4px;
      }
    }
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

.draft-item-content {
  display: flex;
  .long-desc {
    position: relative;
    margin-right: 12px;
  }
  .short-desc {
    position: relative;
  }
  .desc-title {
    font-size: 12px;
    line-height: 12px;
    position: absolute;
    color: #fff;
    left: 1px;
    right: 1px;
    bottom: 1px;
    text-align: center;
    background: #aaaab4;
    z-index: 99;
  }
  .video-item-wrap {
    position: relative;
    width: 48px;
    height: 48px;
    &:hover {
      .actions {
        display: flex;
      }
    }
    .actions {
      display: none;
    }
    .actions-wrap {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 99;
    }
  }
}
.variant-image-item {
  display: flex;
  .drag-image {
    margin-right: 8px;
  }
}
.draft-item-drag {
  display: flex;
  gap: 8px;
}
.drag-image-wrap {
  position: relative;
  // margin-right: 8px;
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
.empty {
  padding: 20px;
  color: #b3b4c1;
  font-size: 12px;
  text-align: center;
}
</style>
