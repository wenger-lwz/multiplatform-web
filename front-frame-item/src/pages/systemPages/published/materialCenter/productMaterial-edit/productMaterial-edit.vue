<template>
  <gj-spin class="productMaterial-edit-loading" :loading="loading === 'page'">
    <div class="productMaterial-edit-header">
      编辑产品素材
      <SvgIcon svgClass="close" :width="20" @click="close"></SvgIcon>
    </div>
    <gj-divider style="margin: 0" />
    <div class="edit-content">
      <div class="edit-content-row">
        <div class="content-row-title">图片</div>
        <div class="content-row-item content-row-item__border">
          <gj-button type="primary" @click="addTabs">添加标签</gj-button>
          <div style="margin-top: 6px">
            <FileCard
              v-for="(file, index) of imgList"
              :key="file.resourceId"
              :file="file"
              :fileIndex="index"
              :selection="true"
              :label-group="true"
              @preview="imgPreview"
              @close="imgFileClose"
              @select="imgFileSelect"
            ></FileCard>
            <div class="upload-list-item" @click="uploadImgVisible = true">
              <div class="picture-upload-button">
                <gj-button shape="round">添加图片</gj-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="edit-content-row">
        <div class="content-row-title">视频</div>
        <div class="content-row-item content-row-item__border">
          <FileCard
            v-for="(item, index) of videoList"
            :key="item.resourceId"
            :file="item"
            :fileIndex="index"
            @preview="videoPlay"
            @close="videoFileClose"
          ></FileCard>
          <div class="upload-list-item" @click="uploadVideoVisible = true">
            <div class="picture-upload-button">
              <gj-button shape="round">添加视频</gj-button>
            </div>
          </div>
        </div>
      </div>
      <div class="edit-content-row">
        <div class="content-row-title">标题文案</div>
        <div class="content-row-item">
          <gj-tabs @change="selectTitleKyeChange">
            <gj-tab-pane
              v-for="tab in titleList"
              :key="tab.value"
              :title="tab.name"
            ></gj-tab-pane>
          </gj-tabs>
        </div>
        <div class="content-row-item content-row-item__border p-12">
          <p class="font-1">标题</p>
          <div
            class="title-row"
            v-for="(item, index) of titles"
            :key="item.key"
          >
            <gj-textarea
              v-model.trim="item.textarea"
              placeholder="请输入(最多可输入255字符)"
              :max-length="255"
              auto-size
            />
            <div class="title-row-btns">
              <div
                class="title-add"
                @click="titles.push({ key: createUuid(), textarea: '' })"
              >
                <SvgIcon svgClass="titleAdd" :width="12"></SvgIcon>
              </div>
              <div
                v-if="titles.length > 1"
                class="title-close"
                @click="titles.length > 1 && titles.splice(index, 1)"
              >
                <SvgIcon svgClass="reduce" :width="14"></SvgIcon>
              </div>
            </div>
          </div>
        </div>
        <div class="content-row-item">
          <p class="font-1">纯文本描述</p>
          <gj-tabs
            :active-key="textsTabsValue"
            class="texts-tabs"
            type="card-gutter"
            :editable="true"
            @tab-click="(key) => (textsTabsValue = key)"
            @add="handleAdd('texts', 'textsTabsValue')"
            @delete="textsDelete"
            show-add-button
          >
            <gj-tab-pane
              v-for="(item, index) of texts"
              :key="item.key"
              :title="`tab-${index + 1}`"
              :closable="texts.length > 1"
            >
              <gj-textarea
                v-model="item.textarea"
                placeholder="(最多可输入5000字符)"
                :max-length="5000"
                :auto-size="{ minRows: 5 }"
                style="margin-top: 20px"
              />
            </gj-tab-pane>
          </gj-tabs>
        </div>
        <div class="content-row-item richText-row-item">
          <p class="font-1">富文本描述</p>
          <gj-tabs
            :active-key="richTextsTabsValue"
            class="texts-tabs"
            type="card-gutter"
            :editable="true"
            show-add-button
            @tab-click="(key) => (richTextsTabsValue = key)"
            @add="handleAdd('richTexts', 'richTextsTabsValue')"
            @delete="richTextsDelete"
          >
            <gj-tab-pane
              v-for="(item, index) of richTexts"
              :key="item.key"
              :title="`tab-${index + 1}`"
              :closable="richTexts.length > 1"
            >
              <RichText
                v-model="item.textarea"
                @getElems="(elem) => (item.elem = elem)"
              ></RichText>
            </gj-tab-pane>
          </gj-tabs>
        </div>
      </div>
      <gj-divider />
      <div class="footer" id="laji-footer">
        <gj-button type="plain" @click="close">取消</gj-button>
        <gj-spin :loading="loading === 'page'">
          <gj-button type="primary" @click="preservation">保存</gj-button>
        </gj-spin>
      </div>
      <gj-modal
        v-model:visible="tagsAddVisible"
        :width="500"
        :unmount-on-close="true"
        :render-to-body="false"
        title="添加标签"
        modal-class="tags-add"
        @ok="tagsAdd"
        @cancel="tagsAddVisible = false"
      >
        <div class="tags-add-content">
          <p class="tags-add-title">标签</p>
          <gj-select v-model="tagsValue" placeholder="请选择标签" multiple>
            <gj-option
              v-for="option of selectOption"
              :key="option.id"
              :value="option.id"
              >{{ option.title }}</gj-option
            >
          </gj-select>
        </div>
      </gj-modal>
      <gj-modal
        v-model:visible="uploadImgVisible"
        :width="812"
        :unmount-on-close="true"
        :render-to-body="false"
        :footer="false"
        title="上传图片"
        @cancel="uploadImgVisible = false"
      >
        <imgUpload
          :treeSelectDisabled="true"
          :sku="editId"
          :imgExceeding="5"
          :skutype="type ? 'sku' : 'spu'"
          @confirm="imgPush"
        ></imgUpload>
      </gj-modal>
      <gj-modal
        v-model:visible="uploadVideoVisible"
        :width="612"
        :unmount-on-close="true"
        :render-to-body="false"
        :footer="false"
        title="上传视频"
        @cancel="uploadVideoVisible = false"
      >
        <videoUpload
          :treeSelectDisabled="true"
          :sku="editId"
          :skutype="type ? 'sku' : 'spu'"
          @cancel="uploadVideoVisible = false"
          @confirm="videoPush"
        ></videoUpload>
      </gj-modal>
      <gj-image-preview
        v-model:visible="imagePreviewVisible"
        :src="previewImage"
        :render-to-body="false"
      />
      <VideoModal
        v-model:visible="videoPlayVisible"
        :src="videSrc"
      ></VideoModal>
    </div>
  </gj-spin>
</template>

<script>
import { reactive, toRefs, watch } from "vue";
import { GjMessage } from "@gj/atom";
import SvgIcon from "@/components/SvgIcon";
import VideoModal from "@/components/VideoModal";
import {
  getAllLabelList,
  getLanguageList,
  getBindInfoBySku,
  makeLabel,
  saveBind,
} from "@/api/published/materialCenter";
import { createUuid, createThumbnail } from "@/utils/common";
import FileCard from "../component/fileCard";
import RichText from "@/components/RichText";
import imgUpload from "../component/imgUpload";
import videoUpload from "../component/videoUpload";

export default {
  components: {
    SvgIcon,
    VideoModal,
    FileCard,
    RichText,
    imgUpload,
    videoUpload,
  },
  emits: ["close"],
  props: {
    editId: {
      type: String,
    },
    type: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      loading: false,
      tagsAddFileSelectList: [],
      titleList: {},
      selectTitleKye: "",
      titles: [{ key: "1", textarea: "" }],
      texts: [
        {
          key: "1",
          title: "Tab 1",
          textarea: "",
        },
      ],
      richTexts: [
        {
          key: "1",
          title: "Tab 1",
          textarea: "",
          img: null,
        },
      ],
      textsTabsValue: "1",
      richTextsTabsValue: "1",
      imgList: [],
      uploadImgVisible: false,
      videoList: [],
      uploadVideoVisible: false,
      // 视频播放器的src
      videSrc: "",
      // 视频播放器的开关
      videoPlayVisible: false,
      previewImage: "",
      imagePreviewVisible: false,
      tagsValue: [],
      selectOption: [],
      tagsAddVisible: false,
      // 富文本当前实例
      RichText: null,
    });
    // 获取语种列表
    getLanguageList().then((res) => {
      data.loading = "page";
      res.data.forEach((item, index) => {
        data.titleList[item.value] = {
          ...item,
          titles: index ? [{ key: createUuid(), textarea: "" }] : data.titles,
          texts: index
            ? [
                {
                  key: createUuid(),
                  title: "Tab 1",
                  textarea: "",
                },
              ]
            : data.texts,
          richTexts: index
            ? [
                {
                  key: createUuid(),
                  title: "Tab 1",
                  textarea: "",
                  img: null,
                },
              ]
            : data.richTexts,
        };
      });
      data.selectTitleKye = data.titleList[0].value;

      // 获取编辑的数据
      getBindInfoBySku({ sku: props.editId, type: props.type }).then((res) => {
        if (res.data) {
          data.imgList = res.data.images;
          data.videoList = res.data.videos;
          if (res.data.titleTextInfos && res.data.titleTextInfos.length > 0) {
            res.data.titleTextInfos.forEach((item) => {
              if (item.titles && item.titles.length > 0) {
                data.titleList[item.languageId].titles = item.titles.map(
                  (title) => {
                    return {
                      key: createUuid(),
                      textarea: title.content,
                    };
                  }
                );
              }
              if (item.texts && item.texts.length > 0) {
                data.titleList[item.languageId].texts = item.texts.map(
                  (text, index) => {
                    return {
                      key: createUuid(),
                      title: `Tab ${index + 1}`,
                      textarea: text.content,
                    };
                  }
                );
              }
              if (item.richTexts && item.richTexts.length > 0) {
                data.titleList[item.languageId].richTexts = item.richTexts.map(
                  (richText) => {
                    return {
                      key: createUuid(),
                      title: "Tab 1",
                      textarea: richText.content || "",
                      img: richText.thumbnailUrl || "",
                    };
                  }
                );
              }
              if (item.languageId === data.titleList[0].value) {
                data.titles = data.titleList[item.languageId].titles;
                data.texts = data.titleList[item.languageId].texts;
                data.richTexts = data.titleList[item.languageId].richTexts;
                data.textsTabsValue = data.texts[0].key;
                data.richTextsTabsValue = data.richTexts[0].key;
              }
            });
          }
        }
        data.loading = false;
      });
    });

    // 切换语言
    const selectTitleKyeChange = (key) => {
      data.loading = "page";
      setTimeout(() => {
        data.selectTitleKye = key;
      });
    };
    watch(
      () => data.selectTitleKye,
      (newVal, oldVal) => {
        if (oldVal || oldVal === 0) {
          data.titleList[oldVal].titles = [...data.titles];
          data.titles = data.titleList[newVal].titles;

          data.titleList[oldVal].texts = [...data.texts];
          data.texts = data.titleList[newVal].texts;
          data.textsTabsValue = data.texts[0].key;

          richTextsCreateThumbnail()
            .then(() => {
              data.titleList[oldVal].richTexts = [...data.richTexts];
              data.richTexts = data.titleList[newVal].richTexts;
              data.richTextsTabsValue = data.richTexts[0].key;
              data.loading = false;
            })
            .catch(() => {
              data.loading = false;
            });
        }
      }
    );

    const richTextsCreateThumbnail = () => {
      return new Promise((resolve, reject) => {
        let x = 0;
        data.richTexts.forEach((item) => {
          if (item.textarea) {
            createThumbnail(item.elem)
              .then((res) => {
                item.img = res.data;
                x += 1;
                if (x === data.richTexts.length) {
                  resolve(true);
                }
              })
              .catch((e) => {
                reject(e);
              });
          } else {
            x += 1;
            if (x === data.richTexts.length) {
              resolve(true);
            }
          }
        });
      });
    };
    // 获取标签列表
    getAllLabelList({ name: "" }).then((res) => {
      data.selectOption = res.data;
    });
    //
    const addTabs = () => {
      if (data.tagsAddFileSelectList.length === 0) {
        return GjMessage.warning("请选择要添加的图片!");
      }
      data.tagsAddVisible = true;
    };
    // 添加标签
    const tagsAdd = () => {
      if (data.loading === "tagsAdd") return;
      data.loading = "tagsAdd";
      makeLabel({
        resourceIds: data.tagsAddFileSelectList,
        labelIds: data.tagsValue,
      }).then(() => {
        GjMessage.success("添加成功!");
        data.tagsAddVisible = false;
        data.loading = false;
      });
    };

    // 添加图片
    const imgPush = (list) => {
      let urls = data.imgList.map((item) => item.originalUrl);

      if (list) {
        list.forEach((item) => {
          if (!urls.includes(item.originalUrl)) {
            data.imgList.push(item);
            urls = data.imgList.map((item) => item.originalUrl);
          }
        });
      }
      data.uploadImgVisible = false;
    };
    const imgFileSelect = (file, val) => {
      if (val) {
        data.tagsAddFileSelectList.push(file.resourceId);
      } else {
        const index = data.tagsAddFileSelectList.findIndex(
          (item) => item === file.resourceId
        );
        data.tagsAddFileSelectList.splice(index, 1);
      }
    };
    const imgPreview = (url) => {
      data.previewImage = url;
      data.imagePreviewVisible = true;
    };
    const imgFileClose = (file, index) => {
      data.imgList.splice(index, 1);
      if (data.tagsAddFileSelectList.includes(file.resourceId)) {
        const index = data.tagsAddFileSelectList.findIndex(
          (item) => item === file.resourceId
        );
        data.tagsAddFileSelectList.splice(index, 1);
      }
    };

    // 添加视频
    const videoPush = (res) => {
      let uniqueKeys = data.videoList.map((item) => item.uniqueKey);
      if (!uniqueKeys.includes(res.uniqueKey)) {
        data.videoList.push(res);
      }
      data.uploadVideoVisible = false;
    };
    // 视频预览播放
    const videoPlay = (src) => {
      data.videSrc = src;
      data.videoPlayVisible = true;
    };
    // 视频删除
    const videoFileClose = (file, index) => {
      data.videoList.splice(index, 1);
    };

    const handleAdd = (key, tabkey) => {
      const number = data[key].length + 1;
      const item = {
        key: createUuid(),
        title: `Tab ${number}`,
        textarea: "",
        img: null,
      };
      data[key].push(item);
      data[tabkey] = item.key;
    };
    // 纯文本删除
    const textsDelete = (key) => {
      const index = data.texts.findIndex((item) => item.key === key);
      if (data.texts[index + 1]) {
        data.textsTabsValue = data.texts[index + 1].key;
      } else {
        data.textsTabsValue = data.texts[index - 1].key;
      }
      data.texts.splice(index, 1);
    };
    // 富文本删除
    const richTextsDelete = (key) => {
      const index = data.richTexts.findIndex((item) => item.key === key);
      if (data.richTexts[index + 1]) {
        data.richTextsTabsValue = data.richTexts[index + 1].key;
      } else {
        data.richTextsTabsValue = data.richTexts[index - 1].key;
      }
      data.richTexts.splice(index, 1);
    };

    // 关闭按钮
    const close = () => {
      emit("close", false);
    };

    // 编辑保存
    const preservation = () => {
      data.loading = "page";
      const resourceIds = [
        ...data.imgList.map((item) => item.resourceId),
        ...data.videoList.map((item) => item.resourceId),
      ];
      const titleTexts = [];
      richTextsCreateThumbnail().then(() => {
        Object.keys(data.titleList).forEach((key) => {
          const item = data.titleList[key];
          titleTexts.push({
            languageId: key,
            titles: item.titles.map((title) => title.textarea),
            texts: item.texts.map((text) => text.textarea),
            richTexts: item.richTexts.map((richText) => {
              return {
                richText: richText.textarea,
                url: richText.img,
              };
            }),
          });
        });
        saveBind({
          sku: props.editId,
          type: props.type,
          resourceIds,
          titleTexts,
        }).then(() => {
          GjMessage.success("保存成功!");
          data.loading = false;
          emit("close", false);
        });
      });
    };

    return {
      ...toRefs(data),
      createUuid,
      imgFileClose,
      imgPreview,
      imgFileSelect,
      videoFileClose,
      videoPlay,
      selectTitleKyeChange,
      handleAdd,
      textsDelete,
      richTextsDelete,
      close,
      addTabs,
      tagsAdd,
      imgPush,
      videoPush,
      preservation,
    };
  },
};
</script>
<style scoped>
.tags-add .tags-add-content {
  padding: 16px;
}
</style>
<style scoped lang="scss">
$color-BlueBlack: rgba(0, 4, 48, 0.8);
.productMaterial-edit-loading {
  display: block;
  height: auto;
}

::v-deep .materialCenter-imgUpload-content {
  padding-top: 16px;
}
.productMaterial-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  padding: 8px 16px 8px 24px;
  font-size: 14px;
  line-height: 16px;
  font-weight: bold;
  color: $color-BlueBlack;
  .svg-icon {
    cursor: pointer;
  }
}
.upload-list-item {
  position: relative;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
  width: 120px;
  height: 144px;
  margin: 6px;
  border: 1px solid #e6e6ed;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    border: 1px solid #99b5f9;
  }
}
.picture-upload-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
::v-deep.edit-content .arco-tabs-pane {
  position: relative;
  z-index: 1;
}
::v-deep .picture-upload-button .arco-btn {
  background: rgba(0, 69, 240, 0.05);
  font-size: 12px;
  color: #0045f0;
  &:hover {
    background: rgba(0, 69, 240, 0.15);
  }
}
.edit-content {
  padding: 12px 0;
  .edit-content-row {
    margin-bottom: 32px;
    .content-row-title {
      margin-bottom: 16px;
      padding: 0 16px;
      font-size: 14px;
      line-height: 16px;
      color: $color-BlueBlack;
    }
    .content-row-item {
      // max-height: 512px;
      margin: 0 24px 16px 24px;
      box-sizing: border-box;
      border-radius: 8px;
      > .font-1 {
        margin-bottom: 12px;
      }
    }
    .richText-row-item {
      max-height: none;
    }
    .content-row-item__border {
      padding: 12px 6px;
      border: 1px solid #e6e6ed;
    }
    .p-12 {
      padding: 12px;
    }
    .font-1 {
      margin-bottom: 4px;
      font-size: 12px;
      line-height: 16px;
    }
    .title-row-btns {
      display: flex;
      justify-content: space-between;
      width: 55px;
      margin-left: 16px;
    }
    .title-row {
      display: flex;
      align-items: center;
      .title-close,
      .title-add {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        color: #000;
        cursor: pointer;
      }
      .title-add {
        background: #d9e3fd;
      }
      .title-close {
        background: #ffe7e7;
      }
    }
    .title-row + .title-row {
      margin-top: 16px;
    }
  }
}
::v-deep .arco-modal-body {
  padding: 0;
}
::v-deep .arco-form-item {
  box-sizing: border-box;
  padding: 0 16px;
}

::v-deep .content-row-item__border > .arco-btn {
  margin-left: 6px;
}
::v-deep .arco-textarea-wrapper {
  border-radius: 4px;
}
::v-deep .title-row .arco-textarea {
  font-size: 12px;
}
::v-deep .arco-tabs-content {
  padding: 0;
}
::v-deep .texts-tabs .arco-textarea-wrapper {
  margin: 0 !important;
}
::v-deep .texts-tabs .arco-tabs-content {
  padding: 12px;
  border-radius: 0 0 4px 4px;
}
.footer {
  padding-right: 16px;
  text-align: right;
  .arco-btn {
    margin-left: 10px;
  }
}
</style>
