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
              <span>{{ item.storeName || "--" }}</span>
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
              <gj-row :gutter="24">
                <gj-col :span="6">
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
                    <gj-select
                      class="title-select"
                      allow-create
                      v-model="item.title"
                      placeholder="请选择标题"
                      :trigger-props="{
                        updateAtScroll: true,
                      }"
                    >
                      <gj-option
                        v-for="(titleItem, index) in item.titles"
                        :label="titleItem"
                        :value="titleItem"
                        :key="index"
                      ></gj-option>
                    </gj-select>
                  </gj-form-item>
                </gj-col>
                <gj-col :span="6">
                  <gj-form-item label="发货期" field="deliveryTime">
                    <gj-input-number
                      v-model="item.deliveryTime"
                      :min="1"
                      :max="30"
                      placeholder="请选择发货期"
                    >
                      <template #append>天</template>
                    </gj-input-number>
                  </gj-form-item>
                </gj-col>
                <gj-col :span="6">
                  <gj-form-item field="freightTemplateId">
                    <template #label>
                      <div class="inline">
                        运费模板
                        <gj-button
                          size="mini"
                          type="text"
                          @click="syncPlat('6', item.shopId)"
                          >同步</gj-button
                        >
                      </div>
                    </template>
                    <gj-select
                      v-model="item.freightTemplateId"
                      placeholder="请选择物流模板"
                      :trigger-props="{
                        updateAtScroll: true,
                      }"
                    >
                      <gj-option
                        v-for="costItem in item.freightTemplates"
                        :label="costItem.name"
                        :value="costItem.id"
                        :key="costItem.id"
                      ></gj-option>
                    </gj-select>
                  </gj-form-item>
                </gj-col>
                <gj-col :span="6">
                  <gj-form-item field="promiseTemplateId">
                    <template #label>
                      <div class="inline">
                        服务模板
                        <gj-button
                          type="text"
                          size="mini"
                          @click="syncPlat('7', item.shopId)"
                          >同步</gj-button
                        >
                      </div>
                    </template>
                    <gj-select
                      v-model="item.promiseTemplateId"
                      placeholder="请选择服务模板"
                      :trigger-props="{
                        updateAtScroll: true,
                      }"
                    >
                      <gj-option
                        v-for="serviceItem in item.promiseTemplates"
                        :label="serviceItem.name"
                        :value="serviceItem.id"
                        :key="serviceItem.id"
                      ></gj-option>
                    </gj-select>
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
                  >已选择<span>{{ item.proImageList.length }}/6</span></span
                >
              </div>
              <draggable
                tag="div"
                item-key="hashCodes"
                handle=".drag-handle"
                v-model="item.proImageList"
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
                    <div v-if="index === 0" class="drag-image-tag-bottom">
                      主图位
                    </div>
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
                  v-model="item.leftProImageList"
                  group="productImages"
                  animation="300"
                  class="content-draggable product-images-content-draggable"
                  :move="proMove"
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
                      <div v-if="element.mainImage" class="drag-image-tag">
                        主图
                      </div>
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
                <div v-if="item.leftProImageList.length === 0" class="empty">
                  暂无数据
                </div>
              </div>
            </div>
          </div>

          <!-- 变体图片 -->
          <div class="draft-item mb-32" v-if="item.specsType === 2">
            <div class="draft-item-tit">变体图片</div>
            <div class="draft-item-content attrImageWrap">
              <div class="draft-item-tip">
                <span class="text"
                  >已选择<span
                    >{{ item.attrImageList.length }}/{{
                      item.attrImageListLen
                    }}</span
                  ></span
                >
              </div>

              <draggable
                tag="div"
                item-key="hashCodes"
                handle=".drag-handle"
                v-model="item.attrImageList"
                group="attrImage"
                animation="300"
                class="content-draggable variants-content-draggable b-d-d"
              >
                <template #item="{ element, index }">
                  <div class="drag-image-wrap column">
                    <span class="attrValue">{{ element.attrValue }}</span>
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
                        <span
                          class="action delete-handle"
                          @click="deleteVariantImage(element, index)"
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
                  v-model="item.leftAttrImageList"
                  group="attrImage"
                  animation="300"
                  class="content-draggable product-images-content-draggable"
                  :move="move"
                >
                  <template #item="{ element }">
                    <div class="drag-image-wrap column">
                      <span class="attrValue">{{ element.attrValue }}</span>
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
                <div v-if="item.leftAttrImageList.length === 0" class="empty">
                  暂无数据
                </div>
              </div>
            </div>
          </div>

          <!-- 营销图片 -->
          <div class="draft-item mb-32">
            <div class="draft-item-tit">营销图片</div>
            <div class="draft-item-content attrImageWrap">
              <div class="draft-item-tip">
                <span class="text"
                  >已选择
                  <!-- <span
                    >{{ item.attrImageList.length }}/{{ item.attrImageListLen }}
                  </span> -->
                </span>
              </div>

              <draggable
                tag="div"
                item-key="hashCodes"
                handle=".drag-handle"
                v-model="item.marketImageList"
                group="attrImage"
                animation="300"
                class="content-draggable marking-content-draggable b-d-d"
              >
                <template #item="{ element, index }">
                  <div class="drag-image-wrap column">
                    <span class="attrValue">
                      {{ element.imageProperty == 1 ? "1:1" : "3:4" }}</span
                    >
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
                        <span
                          class="action delete-handle"
                          @click="deleteMarketImage(element, index)"
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
                  v-model="item.leftMarketImageList"
                  group="attrImage"
                  animation="300"
                  class="content-draggable product-images-content-draggable"
                  :move="marketMove"
                >
                  <template #item="{ element }">
                    <div class="drag-image-wrap column">
                      <span class="attrValue">
                        {{ element.imageProperty == 1 ? "1:1" : "3:4" }}</span
                      >
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
                <div v-if="item.leftAttrImageList.length === 0" class="empty">
                  暂无数据
                </div>
              </div>
            </div>
          </div>

          <!-- 视频 -->
          <div class="draft-item mb-32">
            <div class="draft-item-tit">视频</div>
            <div class="draft-item-content">
              <div class="draft-item-tip">
                <span class="text"
                  >已选择视频
                  <!-- <span
                    >{{ item.attrImageList.length }}/{{ item.attrImageListLen }}
                  </span> -->
                </span>
              </div>

              <draggable
                tag="div"
                item-key="hashCodes"
                handle=".drag-handle"
                v-model="item.video"
                group="attrImage"
                animation="300"
                class="content-draggable video-content-draggable b-d-d"
              >
                <template #item="{ element, index }">
                  <div class="drag-image-wrap">
                    <gj-image
                      width="118"
                      height="118"
                      class="drag-image"
                      :src="element.videoPic"
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
                            @click="openVideo(element.videoUrl)"
                          />
                        </span>
                        <span
                          class="action delete-handle"
                          @click="deleteVideo(element, index)"
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
                  >商品资料视频<span>将此处视频拖到上方栏位即为选中</span></span
                >
              </div>
              <div class="draggable-wrap">
                <draggable
                  tag="div"
                  item-key="hashCodes"
                  handle=".drag-handle"
                  v-model="item.videos"
                  group="attrImage"
                  animation="300"
                  class="content-draggable product-images-content-draggable"
                  :move="videoMove"
                >
                  <template #item="{ element }">
                    <div class="drag-image-wrap">
                      <gj-image
                        width="118"
                        height="118"
                        class="drag-image"
                        :src="element.videoPic"
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
                              @click="openVideo(element.videoUrl)"
                            />
                          </span>
                        </span>
                      </div>
                    </div>
                  </template>
                </draggable>
                <div v-if="item.leftAttrImageList.length === 0" class="empty">
                  暂无数据
                </div>
              </div>
            </div>
          </div>

          <!-- 描述 -->
          <div class="draft-item mb-32">
            <div class="draft-item-tit">描述</div>
            <div class="draft-item-content draft-item-desc-content">
              <gj-checkbox-group :model-value="descCheckBox">
                <div class="desc-content-wrap">
                  <div
                    class="desc-item-checkbox-wrap"
                    v-for="(descItem, descIndex) in item.pcDescriptions"
                    :key="descIndex"
                  >
                    <gj-image
                      class="drag-image"
                      width="118"
                      height="118"
                      alt="无图"
                      :src="descItem?.descriptionPic"
                    >
                      <template #extra>
                        <div class="actions">
                          <span class="action preview-handle">
                            <SvgIcon
                              svgClass="Showz"
                              :width="16"
                              @click="openImgView(descItem?.descriptionPic)"
                            />
                          </span>
                        </div>
                      </template>
                    </gj-image>
                    <div class="check-box">
                      <gj-checkbox
                        :value="descIndex"
                        @click="selectDesc(descIndex)"
                      ></gj-checkbox>
                    </div>
                  </div>
                </div>
              </gj-checkbox-group>
            </div>
          </div>
        </gj-row>
      </div>
      <gj-image-preview :src="previewImgSrc" v-model:visible="previewVisible" />
      <Video-modal v-model:visible="playerVisible" :src="playerUrl">
      </Video-modal>
    </template>
    <template #footer>
      <gj-space>
        <gj-button @click="cancel">取消</gj-button>
        <gj-button type="primary" @click="saveDraft">确定</gj-button>
      </gj-space>
    </template>
  </full-screen-dialog>
</template>
<script>
import { defineComponent, reactive, toRefs, ref, watch, onMounted } from "vue";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog.vue";
import SvgIcon from "@/components/SvgIcon";
import Draggable from "vuedraggable";
import { getPlatform, syncPlatform } from "@/api/published/aliexpress";
import VideoModal from "@/components/VideoModal.vue";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  components: {
    fullScreenDialog,
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
  emits: ["saveDraft", "cancel", "open"],
  setup(props, { emit }) {
    const draftRef = ref(null);
    const state = reactive({
      item: props.draftsItem,
      draftForm: {},
      previewImgSrc: "",
      previewVisible: false,
      playerVisible: false,
      playerUrl: "",
      shopId: props.shopId,
      descCheckBox: [],
    });

    watch(
      () => props.shopId,
      (n) => {
        state.shopId = n;
      },
      {
        deep: true,
      }
    );

    watch(
      () => props.draftsItem,
      (n) => {
        state.item = JSON.parse(JSON.stringify(n));
        state.descCheckBox = state.item.descCheckBox;
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

      state.item.descCheckBox = state.descCheckBox;
      emit("saveDraft", state.item);
    };

    const openImgView = (src) => {
      state.previewImgSrc = src;
      state.previewVisible = true;
    };

    const openVideo = (src) => {
      state.playerVisible = true;
      state.playerUrl = src;
    };

    const deleteVideo = (row, idx) => {
      const video = JSON.parse(JSON.stringify(row));
      state.item.video.splice(idx, 1);
      state.item.videos.push(video);
    };

    const deleteProductImage = (row, idx) => {
      const productImage = JSON.parse(JSON.stringify(row));
      state.item.proImageList.splice(idx, 1);
      state.item.leftProImageList.push(productImage);
    };

    const deleteVariantImage = (row, idx) => {
      const productImage = JSON.parse(JSON.stringify(row));
      state.item.attrImageList.splice(idx, 1);
      state.item.leftAttrImageList.push(productImage);
    };

    const deleteMarketImage = (row, idx) => {
      const productImage = JSON.parse(JSON.stringify(row));
      state.item.marketImageList.splice(idx, 1);
      state.item.leftMarketImageList.push(productImage);
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

    const proMove = (e) => {
      let isDrag = true;
      if (e.to.className.includes("products-content-draggable")) {
        if (state.item.proImageList.length >= 6) {
          isDrag = false;
        } else {
          isDrag = true;
        }
      } else {
        isDrag = true;
      }

      return isDrag;
    };

    const videoMove = (e) => {
      let isDrag = true;
      if (e.to.className.includes("video-content-draggable")) {
        if (state.item.video.length >= 1) {
          isDrag = false;
        } else {
          isDrag = true;
        }
      } else {
        isDrag = true;
      }

      return isDrag;
    };

    const marketMove = (e) => {
      let isDrag = true;
      console.log(state.item);
      if (e.to.className.includes("marking-content-draggable")) {
        let imageProperty = e.draggedContext.element.imageProperty;

        const findIndex = state.item.marketImageList.findIndex(
          (item) => item.imageProperty === imageProperty
        );
        if (findIndex > -1) {
          isDrag = false;
        } else {
          //已选图片中不存在同一个颜色,可拖拽
          isDrag = true;
        }
        console.log(state.item);
      }
      return isDrag;
    };

    const move = (e) => {
      let isDrag = true;

      if (e.to.className.includes("variants-content-draggable")) {
        let draggedContextId = e.draggedContext.element.attrValueId;
        // let relatedContextId = e.relatedContext.element.attrValueId

        const findIndex = state.item.attrImageList.findIndex(
          (item) => item.attrValueId === draggedContextId
        );
        if (findIndex > -1) {
          isDrag = false;
        } else {
          //已选图片中不存在同一个颜色,可拖拽
          isDrag = true;
        }
        console.log(state.item);
      }

      return isDrag;
    };

    const selectDesc = (index) => {
      if (state.descCheckBox.includes(index)) {
        state.descCheckBox = [];
        state.item.pcDescription = [];
      } else {
        state.descCheckBox = [index];
        state.item.pcDescription = [state.item.pcDescriptions[index]];
      }
    };

    const getCostPlat = () => {
      if (!state.item.shopId) return;
      getPlatform({
        shopId: state.item.shopId,
        componentType: "6",
      }).then((res) => {
        state.item.freightTemplates = res.data;
      });
    };

    //获取服务模板下拉
    const getServicePlat = () => {
      if (!state.item.shopId) return;
      getPlatform({
        shopId: state.item.shopId,
        componentType: "7",
      }).then((res) => {
        state.item.promiseTemplates = res.data;
      });
    };

    const syncPlat = (type, id) => {
      syncPlatform({
        componentTypes: [type],
        shopId: [id],
      }).then(() => {
        if (type == "6") {
          getCostPlat();
        } else {
          getServicePlat();
        }
        GjMessage.success("同步成功");
      });
    };

    onMounted(() => {});
    return {
      draftRef,
      ...toRefs(state),
      cancel,
      openImgView,
      deleteProductImage,
      deleteVariantImage,
      deleteMarketImage,
      customValidator,
      move,
      saveDraft,
      syncPlat,
      marketMove,
      proMove,
      deleteVideo,
      openVideo,
      videoMove,
      selectDesc,
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

  .desc-content-wrap {
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
  .attrImageWrap {
    .actions-wrap {
      top: 30px;
    }
    .attrValue {
      margin-bottom: 12px;
    }
  }
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
.marking-content-draggable,
.video-content-draggable,
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
