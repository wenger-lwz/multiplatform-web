<template>
  <div class="edit-draft-dialog">
    <gj-modal
      title="编辑配置草稿"
      modal-class="draft-screen-dialog"
      :visible="dialogVisible"
      :render-to-body="false"
      :closable="true"
      :unmount-on-close="true"
      :mask-closable="false"
      :footer="true"
      @cancel="cancel"
    >
      <template #default>
        <div class="draft-content">
          <gj-row>
            <gj-col :span="24" class="text-box">
              <div class="sku">{{ item.spu }}</div>
              <div class="type">
                {{ item.specsType == 2 ? "变体" : "单品" }}
              </div>
              <div class="shopClass">
                <span class="pl-10">站点:</span>
                <span>{{ item.siteName || "--" }}</span>
              </div>
            </gj-col>
          </gj-row>
          <gj-row>
            <gj-col :span="24" class="mb-32">
              <gj-form
                ref="draftFormRef"
                label-align="left"
                :label-col-props="{ span: 24 }"
                :wrapper-col-props="{ span: 24 }"
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
                      <template v-if="item.titleNotExistAll">
                        <gj-select
                          class="title-select"
                          placeholder="请选择标题"
                          allow-create
                          allow-clear
                          v-model="item.title"
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
                      >{{ item.productImages.length }}/{{
                        productImageMaxLen
                      }}</span
                    ></span
                  >
                </div>
                <draggable
                  tag="div"
                  item-key="hashCodes"
                  handle=".drag-handle"
                  group="productImages"
                  animation="300"
                  v-model="item.productImages"
                  class="content-draggable products-content-draggable b-d-d"
                >
                  <template #item="{ element, index }">
                    <div class="drag-image-wrap">
                      <gj-image
                        width="118"
                        height="118"
                        class="drag-image"
                        hide-footer
                        :src="element.resource"
                      />
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
                            @click="deleteProductImage(element, index)"
                          >
                            <SvgIcon svgClass="close" :width="16" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </template>
                </draggable>
                <div class="draft-item-tip draft-item-tip2">
                  <span class="text"
                    >商品资料图片
                    <span>(将此处图片拖到上方栏位即为选中)</span></span
                  >
                </div>
                <div class="draggable-wrap">
                  <draggable
                    tag="div"
                    item-key="hashCodes"
                    handle=".drag-handle"
                    group="productImages"
                    animation="300"
                    class="content-draggable product-images-content-draggable"
                    v-model="item.leftImages"
                    :move="productImageMove"
                  >
                    <template #item="{ element }">
                      <div class="drag-image-wrap">
                        <gj-image
                          width="118"
                          height="118"
                          class="drag-image"
                          hide-footer
                          :src="element.resource"
                        />
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
                          </span>
                        </div>
                      </div>
                    </template>
                  </draggable>
                  <div v-if="!item.leftImages.length" class="empty">
                    暂无数据
                  </div>
                </div>
              </div>
            </div>
            <!-- 变体图片 start-->
            <div class="draft-item mb-32">
              <div class="draft-item-tit">属性图片</div>
              <div
                class="draft-item-content"
                v-for="(varItem, indexNum) in item.variantImageList"
                :key="indexNum"
              >
                <div class="draft-item-tip">
                  <span class="text">
                    {{ varItem.attrName }}：{{ varItem.attrValueName }}
                    <span
                      >已选择{{ varItem.selectedImages.length }}/{{
                        variantImageMaxLen
                      }}</span
                    ></span
                  >
                </div>
                <draggable
                  tag="div"
                  item-key="hashCodes"
                  handle=".drag-handle"
                  class="content-draggable products-content-draggable b-d-d"
                  animation="300"
                  :group="`${varItem.attrName}-${varItem.attrValueName}`"
                  v-model="varItem.selectedImages"
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
                            @click="
                              deleteVariantImage(element, index, indexNum)
                            "
                          >
                            <SvgIcon svgClass="close" :width="16" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </template>
                </draggable>
                <div class="draft-item-tip draft-item-tip2">
                  <span class="text"
                    >商品资料图片
                    <span>(将此处图片拖到上方栏位即为选中)</span></span
                  >
                </div>
                <div class="draggable-wrap">
                  <draggable
                    tag="div"
                    item-key="hashCodes"
                    handle=".drag-handle"
                    animation="300"
                    class="content-draggable product-images-content-draggable"
                    :group="`${varItem.attrName}-${varItem.attrValueName}`"
                    :move="() => variantImageMove(varItem.selectedImages)"
                    v-model="varItem.unSelectImages"
                  >
                    <template #item="{ element }">
                      <div class="drag-image-wrap">
                        <gj-image
                          width="118"
                          height="118"
                          class="drag-image"
                          hide-footer
                          :src="element.resource"
                        />
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
                          </span>
                        </div>
                      </div>
                    </template>
                  </draggable>
                  <div v-if="!item.leftImages.length" class="empty">
                    暂无数据
                  </div>
                </div>
              </div>
            </div>
            <!-- 变体图片 end-->

            <!-- 视频 -->
            <div class="draft-item mb-32">
              <div class="draft-item-tit">视频</div>
              <div class="draft-item-content">
                <div class="draft-item-tip">
                  <span class="text"
                    >已选择视频<span
                      >{{ item.selectedVideo.length }}/{{ 1 }}</span
                    ></span
                  >
                </div>
                <draggable
                  tag="div"
                  item-key="hashCodes"
                  handle=".drag-handle"
                  v-model="item.selectedVideo"
                  group="video"
                  animation="300"
                  class="content-draggable products-content-draggable b-d-d"
                >
                  <template #item="{ element, index }">
                    <div class="drag-image-wrap">
                      <gj-image
                        width="118"
                        height="118"
                        class="drag-image"
                        hide-footer
                        :src="element.videoCoverUrl"
                      />
                      <div class="actions-wrap">
                        <span class="actions">
                          <span class="action drag-handle">
                            <SvgIcon svgClass="drag" :width="14" />
                          </span>
                          <span class="action preview-handle">
                            <SvgIcon
                              svgClass="startVideo"
                              :width="16"
                              @click="openVideoView(element.resourceId)"
                            />
                          </span>
                          <span
                            class="action delete-handle"
                            @click="deleteVideoItem(element, index)"
                          >
                            <SvgIcon svgClass="close" :width="16" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </template>
                </draggable>
                <div class="draft-item-tip draft-item-tip2">
                  <span class="text"
                    >商品资料视频
                    <span>(将此处视频拖到上方栏位即为选中)</span></span
                  >
                </div>
                <div class="draggable-wrap">
                  <draggable
                    tag="div"
                    item-key="hashCodes"
                    handle=".drag-handle"
                    group="video"
                    animation="300"
                    class="content-draggable product-images-content-draggable"
                    :move="videoMove"
                    v-model="item.leftVideos"
                  >
                    <template #item="{ element }">
                      <div class="drag-image-wrap">
                        <gj-image
                          width="118"
                          height="118"
                          class="drag-image"
                          :src="element.resourceId"
                          hide-footer
                        />
                        <div class="actions-wrap">
                          <span class="actions">
                            <span class="action drag-handle">
                              <SvgIcon svgClass="drag" :width="14" />
                            </span>
                            <span class="action preview-handle">
                              <SvgIcon
                                svgClass="Showz"
                                :width="16"
                                @click="openImgView(element.resourceId)"
                              />
                            </span>
                          </span>
                        </div>
                      </div>
                    </template>
                  </draggable>
                  <div v-if="!item.leftImages.length" class="empty">
                    暂无数据
                  </div>
                </div>
              </div>
            </div>
            <!-- 描述 -->
            <div class="draft-item mb-32">
              <div class="draft-item-tit">描述</div>
              <div class="draft-item-content draft-item-desc-content">
                <p class="desc-title">长描述</p>
                <gj-checkbox-group :model-value="longCheckBox">
                  <div class="long-desc">
                    <div
                      class="desc-item-checkbox-wrap"
                      v-for="(longDescItem, longDescIndex) in longDescriptions"
                      :key="longDescIndex"
                    >
                      <gj-image
                        class="drag-image"
                        width="118"
                        height="118"
                        alt="无图"
                        :src="longDescItem.previewUrl"
                      >
                        <template #extra>
                          <div class="actions">
                            <span class="action preview-handle">
                              <SvgIcon
                                svgClass="Showz"
                                :width="16"
                                @click="openImgView(longDescItem.previewUrl)"
                              />
                            </span>
                          </div>
                        </template>
                      </gj-image>
                      <div class="check-box">
                        <gj-checkbox
                          :value="longDescIndex"
                          @click="checkLongDesc(longDescIndex)"
                        ></gj-checkbox>
                      </div>
                    </div>
                  </div>
                </gj-checkbox-group>
              </div>
              <div class="draft-item-content draft-item-desc-content">
                <p class="desc-title">短描述</p>
                <gj-checkbox-group :model-value="shortCheckBox">
                  <div class="long-desc">
                    <div
                      class="desc-item-checkbox-wrap"
                      v-for="(
                        shortDescItem, shortDescIndex
                      ) in shortDescriptions"
                      :key="shortDescItem"
                    >
                      <gj-image
                        class="drag-image"
                        width="118"
                        height="118"
                        alt="无图"
                        :src="shortDescItem.previewUrl"
                      >
                        <template #extra>
                          <div class="actions">
                            <span class="action preview-handle">
                              <SvgIcon
                                svgClass="Showz"
                                :width="16"
                                @click="openImgView(shortDescItem.previewUrl)"
                              />
                            </span>
                          </div>
                        </template>
                      </gj-image>
                      <div class="check-box">
                        <gj-checkbox
                          :value="shortDescIndex"
                          @click="checkShortDesc(shortDescIndex)"
                        ></gj-checkbox>
                      </div>
                    </div>
                  </div>
                </gj-checkbox-group>
              </div>
            </div>
          </gj-row>
        </div>
        <gj-image-preview
          :src="previewImgSrc"
          v-model:visible="previewVisible"
        />
      </template>
      <template #footer>
        <gj-space>
          <gj-button @click="cancel">取消</gj-button>
          <gj-button type="primary" @click="saveDraft">确定</gj-button>
        </gj-space>
      </template>
    </gj-modal>
    <Video-modal
      :src="previewVideoUrl"
      v-model:visible="playerVisible"
    ></Video-modal>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, ref, onBeforeMount } from "vue";
import SvgIcon from "@/components/SvgIcon";
import Draggable from "vuedraggable";
import VideoModal from "@/components/VideoModal.vue";
export default defineComponent({
  components: {
    Draggable,
    SvgIcon,
    VideoModal,
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
  emits: ["saveDraft", "cancel"],
  setup(props, { emit }) {
    const draftFormRef = ref(null);
    const data = reactive({
      item: props.draftsItem,
      longCheckBox: [],
      shortCheckBox: [],
      longDescriptions: [],
      shortDescriptions: [],
    });

    const state = reactive({
      draftForm: {},
      previewImgSrc: "",
      previewVisible: false,
      playerVisible: false,
      previewVideoUrl: "",
    });

    const productImageMaxLen = 8;
    const variantImageMaxLen = 8;

    onBeforeMount(() => {
      if (data.item.longDescriptions) {
        data.longDescriptions = data.item.longDescriptions;
        data.longCheckBox = data.item.longCheckBox || [];
      } else {
        data.longDescriptions =
          data.item.descriptions?.filter((it) => it.type === 0) || [];
      }
      if (data.item.shortDescriptions) {
        data.shortDescriptions = data.item.shortDescriptions || [];
        data.shortCheckBox = data.item.shortCheckBox || [];
      } else {
        data.shortDescriptions =
          data.item.descriptions?.filter((it) => it.type === 1) || [];
      }
    });

    const cancel = () => {
      emit("cancel");
    };

    const saveDraft = async () => {
      const errors = await draftFormRef.value.validateField("title");
      if (errors) {
        return;
      }
      emit("saveDraft", data);
    };

    const openImgView = (src) => {
      state.previewImgSrc = src;
      state.previewVisible = true;
    };

    const openVideoView = (src) => {
      state.previewVideoUrl = src;
      state.playerVisible = true;
    };

    const deleteProductImage = (row, idx) => {
      const temp = row;
      data.item.productImages.splice(idx, 1);
      data.item.leftImages.push(temp);
    };
    const deleteVariantImage = (row, idx, fIdx) => {
      const temp = row;
      data.item.variantImageList[fIdx].selectedImages.splice(idx, 1);
      data.item.variantImageList[fIdx].unSelectImages.push(temp);
    };
    const deleteVideoItem = (row, idx) => {
      const temp = row;
      data.item.selectedVideo.splice(idx, 1);
      data.item.leftVideos.push(temp);
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

    const checkLongDesc = (index) => {
      if (data.longCheckBox.indexOf(index) > -1) {
        data.longCheckBox = [];
      } else {
        data.longCheckBox = [index];
      }
    };

    const checkShortDesc = (index) => {
      if (data.shortCheckBox.indexOf(index) > -1) {
        data.shortCheckBox = [];
      } else {
        data.shortCheckBox = [index];
      }
    };

    const productImageMove = () => {
      if (data.item.productImages.length >= productImageMaxLen) {
        return false;
      }
      return true;
    };

    const variantImageMove = (arr) => {
      if (arr.length >= variantImageMaxLen) {
        return false;
      }
      return true;
    };

    const videoMove = () => {
      if (data.item.selectedVideo.length >= 1) {
        return false;
      }
      return true;
    };

    return {
      draftFormRef,
      ...toRefs(data),
      ...toRefs(state),
      cancel,
      openImgView,
      openVideoView,
      deleteProductImage,
      deleteVariantImage,
      deleteVideoItem,
      customValidator,
      getAttrValueDesc,
      saveDraft,
      checkLongDesc,
      checkShortDesc,
      productImageMaxLen,
      variantImageMaxLen,
      productImageMove,
      variantImageMove,
      videoMove,
    };
  },
});
</script>
<style lang="scss" scoped>
.edit-draft-dialog {
  :deep(.draft-screen-dialog) {
    width: calc(100vw - 200px);
    .arco-modal-body {
      height: calc(100vh - 187px);
      overflow: hidden;
      overflow-y: scroll;
    }
  }
  .dialog-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .draft-content {
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
    .desc-title {
      margin-bottom: 14px;
    }
    .long-desc,
    .short-desc {
      display: flex;
      gap: 8px;
      .desc-item-checkbox-wrap {
        position: relative;
      }
      .check-box {
        position: absolute;
        left: 8px;
        top: 8px;
        z-index: 99;
      }
    }
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
    --border-radius-small: 8px !important;
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
}
</style>
