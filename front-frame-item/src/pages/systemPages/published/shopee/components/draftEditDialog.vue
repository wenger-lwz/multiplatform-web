<template>
  <fullScreenDialog
    class="child-fullScreenDialog"
    @cancel="cancelNesting"
    @open="openNesting"
    :dialogVisible="dialogVisible"
  >
    <template #title>
      <div class="dialog-title">
        <span @click="cancel">编辑配置草稿</span>
        <gj-button @click="cancel">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="draft-content" v-for="item in goodsList" :key="item">
        <gj-row>
          <gj-col :span="24" class="text-box">
            <div class="sku">{{ item.spu }}</div>
            <div class="type">{{ item.specsType == 2 ? "变体" : "单品" }}</div>
            <div class="shopClass">
              <span class="pdrigth">站点:</span>
              <span>{{ item.siteName || "--" }}</span>
            </div>
            <div class="shopClass">
              <span class="pdrigth">店铺:</span>
              <span>{{ item.shopName || "--" }}</span>
            </div>
          </gj-col>
        </gj-row>
        <gj-row>
          <gj-col :span="24">
            <gj-form
              ref="basicForm"
              :label-col-props="{ span: 24 }"
              :wrapper-col-props="{ span: 24 }"
              label-align="left"
              :model="ruleForm"
            >
              <gj-row>
                <gj-col :span="6">
                  <gj-form-item class="form-item-width">
                    <template #label>
                      <span>标题</span>
                      <span class="hot">*</span>
                    </template>
                    <gj-select
                      v-model="item.titles"
                      placeholder="请选择"
                      size="mini"
                      allow-clear
                    >
                      <gj-option
                        :label="item.title"
                        :value="item.title"
                        v-for="item in item.titles"
                        :key="item"
                      ></gj-option>
                    </gj-select>
                  </gj-form-item>
                </gj-col>
                <gj-col :span="6">
                  <gj-form-item class="form-item-width">
                    <template #label>
                      <span>物流模板</span>
                    </template>
                    <gj-select
                      v-model="item.listingTemplateId"
                      placeholder="请选择"
                      size="mini"
                      allow-clear
                    >
                      <gj-option
                        :label="item.name"
                        :value="item.id"
                        v-for="item in item.listingTemplates"
                        :key="item.id"
                      ></gj-option>
                    </gj-select>
                  </gj-form-item>
                </gj-col>
              </gj-row>
            </gj-form>
          </gj-col>
        </gj-row>
        <gj-row>
          <div class="blockBox">
            <!-- 产品图片 -->
            <div class="title">
              <span class="text">产品图片</span>
            </div>
            <div class="blockBox-item-box">
              <div class="squre-line">
                <div class="subTitle">
                  <span class="text"
                    >已选择{{ productList.length }}/{{ productImageslen }}</span
                  >
                </div>
                <div class="infoList">
                  <draggable
                    tag="div"
                    ghostClass="dr-placeholder"
                    handle=".des-mover"
                    :list="productList"
                    group="viewer"
                    animation="300"
                    item-key="type"
                    v-model="item.productList"
                    class="des-container-item-box"
                  >
                    <template #item="{ element, index }">
                      <div
                        class="des-container-item-product edit-draft-img-item"
                      >
                        <p class="item-zwt" v-if="index == 0">主位图</p>
                        <gj-image
                          width="120"
                          height="120"
                          class="des-mover-img-cunter"
                          :src="element.resource"
                        >
                          <template #extra>
                            <div class="actions">
                              <span class="action des-mover">
                                <SvgIcon svgClass="drag" :width="16" />
                              </span>
                              <span class="action" @click="onDownLoad">
                                <SvgIcon
                                  svgClass="Showz"
                                  :width="16"
                                  @click="openImgView(element, 'chanping')"
                                />
                              </span>
                              <span class="action" @click="onDownLoad">
                                <SvgIcon
                                  svgClass="close"
                                  :width="16"
                                  @click="removeImage(element, index, 'img')"
                                />
                              </span>
                            </div>
                          </template>
                        </gj-image>
                      </div>
                    </template>
                  </draggable>
                </div>

                <span class="tip" style="margin-top: 12px; display: block"
                  >商品资料图片(将此处图片拖到上方栏位即为选中)</span
                >
                <div class="infoList_Drag">
                  <draggable
                    tag="div"
                    ghostClass="dr-placeholder"
                    handle=".des-mover-t"
                    :list="productImages"
                    group="viewer"
                    animation="300"
                    item-key="type"
                    class="des-container-item-box"
                  >
                    <template #item="{ element }">
                      <div
                        class="des-container-item-product edit-draft-img-item"
                      >
                        <p class="item-zt" v-if="element.mainImage">主图</p>
                        <gj-image
                          width="120"
                          height="120"
                          class="des-mover-img"
                          :src="element.resource"
                        >
                          <template #extra>
                            <div class="actions">
                              <span class="action des-mover-t">
                                <SvgIcon svgClass="drag" :width="16" />
                              </span>

                              <span class="action" @click="onDownLoad">
                                <SvgIcon
                                  svgClass="Showz"
                                  :width="16"
                                  @click="openImgView(element, 'chanping')"
                                />
                              </span>
                            </div>
                          </template>
                        </gj-image>
                      </div>
                    </template>
                  </draggable>
                </div>
              </div>
            </div>
            <!-- 属性图片 -->
            <div class="title">
              <span class="text">属性图片</span>
            </div>
            <div class="blockBox-item-box" v-if="attributeList">
              <div
                class="squre-line"
                v-for="(atrr, i) in attributeList?.attrValues"
                :key="i"
              >
                <div class="subTitle">
                  <span class="text"
                    >{{ attributeList?.attrName }}：{{
                      atrr.attrValue
                    }}
                    已选择{{ atrr.length || 0 }}/{{
                      atrr?.attrImages.length || 0
                    }}</span
                  >
                </div>
                <div class="infoList">
                  <draggable
                    tag="div"
                    ghostClass="dr-placeholder"
                    handle=".des-mover"
                    :list="atrr.attrImages"
                    group="viewer"
                    animation="300"
                    item-key="type"
                    class="des-container-item-box"
                  >
                    <template #item="{ element, index }">
                      <div
                        class="des-container-item-product edit-draft-img-item"
                        v-if="index < 6"
                      >
                        <gj-image
                          width="120"
                          height="120"
                          class="des-mover-img-cunter"
                          :src="element.resource"
                        >
                          <template #extra>
                            <div class="actions">
                              <span class="action des-mover">
                                <SvgIcon svgClass="drag" :width="16" />
                              </span>
                              <span class="action" @click="onDownLoad">
                                <SvgIcon
                                  svgClass="Showz"
                                  :width="16"
                                  @click="openImgView(element, 'chanping')"
                                />
                              </span>
                              <span class="action" @click="onDownLoad">
                                <SvgIcon
                                  svgClass="closeIcon"
                                  :width="16"
                                  @click="removeImage(element, index)"
                                />
                              </span>
                            </div>
                          </template>
                        </gj-image>
                      </div>
                    </template>
                  </draggable>
                </div>

                <span class="tip" style="margin-top: 12px; display: block"
                  >商品资料图片(将此处图片拖到上方栏位即为选中)</span
                >
                <div class="infoList_Drag">
                  <draggable
                    tag="div"
                    ghostClass="dr-placeholder"
                    handle=".des-mover"
                    :list="atrr.attrImages"
                    group="viewer"
                    animation="300"
                    item-key="type"
                    class="des-container-item-box"
                  >
                    <template #item="{ element, index }">
                      <div
                        class="des-container-item-product edit-draft-img-item"
                        v-if="index < 6"
                      >
                        <gj-image
                          width="120"
                          height="120"
                          class="des-mover-img-cunter"
                          :src="element.resource || ''"
                        >
                          <template #extra>
                            <div class="actions">
                              <span class="action des-mover">
                                <SvgIcon svgClass="drag" :width="16" />
                              </span>
                              <span class="action" @click="onDownLoad">
                                <SvgIcon
                                  svgClass="Showz"
                                  :width="16"
                                  @click="openImgView(element, 'chanping')"
                                />
                              </span>
                            </div>
                          </template>
                        </gj-image>
                      </div>
                    </template>
                  </draggable>
                </div>
              </div>
            </div>
            <div class="blockBox-item-box" v-if="!attributeList">
              <div class="squre-line">
                <div class="subTitle">
                  <span class="text">已选择 0/ 0</span>
                </div>
                <div class="infoList">
                  <p style="height: 130px"></p>
                </div>
                <span class="tip" style="margin-top: 12px; display: block"
                  >商品资料图片(将此处图片拖到上方栏位即为选中)</span
                >
                <div class="infoList_Drag">
                  <gj-image width="120" height="120" src="" />
                </div>
              </div>
            </div>
            <!-- 视频 -->
            <div class="title">
              <span class="text">视频</span>
            </div>
            <div class="blockBox-item-box">
              <div class="squre-line">
                <div class="subTitle">
                  <span class="text"
                    >已选择视频{{ videoListItem.length }}/{{
                      videoListlen
                    }}</span
                  >
                </div>
                <div class="infoList">
                  <draggable
                    tag="div"
                    ghostClass="dr-placeholder"
                    handle=".des-mover"
                    :list="videoListItem"
                    group="viewer"
                    animation="300"
                    item-key="type"
                    class="des-container-item-box"
                  >
                    <template #item="{ element, index }">
                      <div
                        class="des-container-item-product edit-draft-img-item"
                        v-if="index < 6"
                      >
                        <p class="item-zwt" v-if="index == 0">主位图</p>
                        <gj-image
                          width="120"
                          height="120"
                          class="des-mover-img-cunter"
                          :src="element.videoCoverUrl"
                        >
                          <template #extra>
                            <div class="actions">
                              <span class="action des-mover">
                                <SvgIcon svgClass="drag" :width="12" />
                              </span>
                              <span class="action" @click="onDownLoad">
                                <SvgIcon
                                  svgClass="startVideo"
                                  :width="12"
                                  @click="openImgView(element, 'video')"
                                />
                              </span>
                              <span class="action" @click="onDownLoad">
                                <SvgIcon
                                  svgClass="closeIcon"
                                  :width="12"
                                  @click="removeImage(element, index, 'video')"
                                />
                              </span>
                            </div>
                          </template>
                        </gj-image>
                      </div>
                    </template>
                  </draggable>
                </div>

                <span class="tip" style="margin-top: 12px; display: block"
                  >商品资料视频(将此处视频拖到上方栏位即为选中)</span
                >
                <div class="infoList_Drag">
                  <draggable
                    tag="div"
                    ghostClass="dr-placeholder"
                    handle=".des-mover-t"
                    :list="videoList"
                    group="viewer"
                    animation="300"
                    item-key="type"
                    class="des-container-item-box"
                  >
                    <template #item="{ element, index }">
                      <div
                        class="des-container-item-product edit-draft-img-item"
                        v-if="index < 6"
                      >
                        <p class="item-zt" v-if="element.mainImage">主图</p>
                        <gj-image
                          width="120"
                          height="120"
                          class="des-mover-img"
                          :src="element.videoCoverUrl"
                        >
                          <template #extra>
                            <div class="actions">
                              <span class="action des-mover-t">
                                <SvgIcon svgClass="drag" :width="12" />
                              </span>

                              <span class="action" @click="onDownLoad">
                                <SvgIcon
                                  svgClass="startVideo"
                                  :width="12"
                                  @click="openImgView(element, 'video')"
                                />
                              </span>
                            </div>
                          </template>
                        </gj-image>
                      </div>
                    </template>
                  </draggable>
                </div>
              </div>
            </div>
            <!-- 描述 -->
            <div class="title">
              <span class="text">描述</span>
            </div>
            <div class="blockBox-item-box">
              <gj-radio-group
                v-model="desListVal"
                direction="vertical"
                @change="desChange"
              >
                <gj-radio
                  :value="it"
                  v-for="(it, index) in item.descriptions"
                  :key="index"
                  >{{ it }}</gj-radio
                >
              </gj-radio-group>
            </div>
          </div>
        </gj-row>
      </div>
      <gj-image-preview :src="cutterImg" v-model:visible="visible" />
      <Video-modal
        v-model:visible="playerVisible"
        :src="vidoeSrc"
      ></Video-modal>
    </template>
    <template #footer>
      <gj-space>
        <gj-button @click="cancel">取消</gj-button>
        <gj-button @click="editDraftConfirm">确定</gj-button>
      </gj-space>
    </template>
  </fullScreenDialog>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from "vue";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog.vue";
import VideoModal from "@/components/VideoModal.vue";
import SvgIcon from "@/components/SvgIcon";
import Draggable from "vuedraggable";
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
    goodsList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  emits: ["cancelNesting", "editDraftConfirm", "cancel", "open"],
  setup(props, { emit }) {
    const data = reactive({
      desListVal: "",
      des: [],
      playerVisible: false,
      vidoeSrc: "",
      currentIndex: 2,
      currentLen: 3,
      ruleForm: {
        shop: [],
        titleList: {},
      },
      tabsVisiable: false,
      cutterImg: "",
      visible: false,
      productList: [],
      productImages: [],
      productImageslen: null,
      videoListItem: [],
      videoList: [],
      videoListlen: null,
      descriptions: [],
      id: "",
      //
      attributeList: {
        red: [
          {
            resource:
              "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
          },
          {
            resource:
              "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
          },
          {
            resource:
              "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
          },
        ],
        color: [
          {
            resource:
              "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
          },
          {
            resource:
              "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
          },
        ],
      },
    });
    const cancelNesting = () => {
      emit("cancelNesting");
    };
    const cancel = () => {
      emit("cancelNesting");
    };
    const editDraftConfirm = () => {
      let obj = {
        // ...data.attributeList,
        // ...data.videoList,
        videoList: [...data.videoListItem, ...data.videoList],
        productList: [...data.productList, ...data.productImages],
        descriptions: data.des,
        id: data.id,
      };
      console.log(obj);
      emit("editDraftConfirm", obj);
      data.productList = [];
    };
    const confirm = () => {
      emit("editDraftConfirm");
    };
    const openNesting = () => {
      // data.ebayList = [
      //   {
      //     ebayName: '美国',
      //     ebayId: 'USA',
      //   },
      // ]
    };
    // 图片视频
    const openImgView = (row, name) => {
      if (name == "video") {
        data.vidoeSrc = row?.videoUrl;
        data.playerVisible = true;
      }
      if (name == "des") {
        data.cutterImg = row.previewUrl;
      }
      data.visible = true;
      console.log(row, name);
    };
    const removeImage = (row, index, type) => {
      if (type == "img") {
        const temp = row;
        data.productList.splice(index, 1);
        data.productImages.push(temp);
      }
      if (type == "video") {
        console.log(row, index, type);
        data.videoListItem.splice(index, 1);
        data.videoList.push(row);
      }
    };
    // 描述单选
    const setCheboxFun = (index) => {
      data.descriptions = data.descriptions.map((item, i) => {
        return {
          ...item,
          isChebox: index == i ? true : false,
        };
      });
    };

    watch(
      () => props.dialogVisible,
      (newVal) => {
        if (newVal) {
          const { videos, descriptions, id, variantAttrs, proImages } =
            props.goodsList[0];
          console.log(props.goodsList[0], "pp111");
          data.productImages = proImages;
          data.productImageslen = proImages.length;
          data.videoList = videos;
          data.videoListlen = videos.length;
          data.attributeList = variantAttrs;
          data.descriptions = descriptions.map((item, index) => {
            return {
              ...item,
              isChebox: index == 0 ? true : false,
            };
          });
          data.id = id;
        }
      }
    );

    const desChange = (val) => {
      data.des = [val];
    };

    return {
      ...toRefs(data),
      cancelNesting,
      editDraftConfirm,
      openNesting,
      cancel,
      confirm,
      openImgView,
      removeImage,
      setCheboxFun,
      desChange,
    };
  },
});
</script>
<style lang="scss" scoped>
.child-fullScreenDialog {
  width: 80%;
  margin: 0 auto;

  .draft-content {
    padding: 0 24px;

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

      .pdrigth {
        padding-right: 10px;
      }
    }

    .arco-modal-body {
      padding: 0;
    }

    .form-item-width {
      width: 358px;

      .hot {
        margin-left: 4px;
        color: red;
      }
    }

    .blockBox {
      width: 100%;

      .title {
        padding: 16px 0 2px 0px;
        font-size: 14px;
        margin-bottom: 14px;

        .tip {
          font-size: 12px;
          color: #b3b4c1;
        }
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

        .infoList {
          border: 1px dashed #99b5f9;
        }

        .infoList_Drag {
          border: 1px dashed transparent;
        }

        .tip {
          font-size: 12px;
          color: #808197;
        }
      }

      .blockBox-item-box {
        box-sizing: border-box;
        padding: 0 16px 0 8px;

        .image-box {
          margin-top: 12px;
          margin-right: 12px;
        }
      }
    }
  }

  .des-container-item-box {
    /* display: flex;
    justify-content: flex-start; */
    min-height: 130px;
  }

  .des-container-item {
    position: relative;

    .des-mover-img {
      margin-right: 8px;
    }
    .actions-des {
      display: none;
    }
    .actions {
      display: none;
    }
    &:hover {
      .actions {
        display: inline-block;
        width: 120px;
        height: 120px;
        box-sizing: border-box;
        border-radius: 3px;
        background: rgba(0, 4, 48, 0.3);
        position: absolute;
        top: -101px;
        left: 0px;
        border: 1px solid #0045f0;
        text-align: center;
        line-height: 120px;
      }

      .action {
        // padding: 0px 4px;
        font-size: 14px;
        cursor: pointer;
        background: #d9e3fd;
        border-radius: 20px;
        margin-left: 3px;
      }
    }
  }

  .des-container-item-product {
    position: relative;
    display: inline-block;

    .des-mover-img {
      margin: 5px;
    }

    .des-mover-img-cunter {
      margin: 5px;
    }

    .actions {
      display: none;
    }

    &:hover {
      .actions {
        display: inline-block;
        width: 120px;
        height: 120px;
        box-sizing: border-box;
        border-radius: 6px;
        background: rgba(0, 4, 48, 0.3);
        position: absolute;
        top: -102px;
        left: 0px;
        border: 1px solid #0045f0;
        text-align: center;
        line-height: 120px;
      }

      .action {
        // padding: 0px 4px;
        font-size: 14px;
        cursor: pointer;
        background: #d9e3fd;
        border-radius: 20px;
        margin: 0px 6px;
      }
    }
  }

  .checkbox-select {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 10;
  }

  .item-zwt {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 2px 4px;
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    border-radius: 4px 4px 0px 0px;
    position: absolute;
    z-index: 10;
    bottom: 5px;
    left: calc(50% - 44px / 2);
    font-size: 12px;
  }

  .item-zt {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 2px 4px;
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    border-radius: 0px 0px 4px 4px;
    position: absolute;
    z-index: 10;
    top: 6px;
    left: calc(50% - 32px / 2);
    font-size: 12px;
  }
}
:deep(.arco-image) {
  --border-radius-small: 8px !important;
  .arco-image-footer {
    background: transparent;
  }
}
/deep/.edit-draft-img-item .arco-image-with-footer-inner .arco-image-footer {
  top: inherit;
}

.child-fullScreenDialog .edit-draft-img-item:hover {
  /deep/.actions {
    display: flex;
  }
}
</style>
