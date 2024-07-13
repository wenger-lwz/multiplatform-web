<template>
  <fullScreenDialog
    @cancel="cancel"
    @open="open"
    :render-to-body="false"
    :dialogVisible="dialogVisible"
  >
    <template #title>
      <div class="dialog-title">
        <span @click="cancel">配置草稿</span>
        <gj-button @click="cancel" shape="round">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="draft-content">
        <div class="header">
          <div>
            <gj-select
              v-model="ruleForm.shop"
              placeholder="请选择店铺"
              multiple
              allow-clear
              :max-tag-count="1"
              :style="{ width: '240px' }"
              @clear="initDraftFun"
            >
              <gj-option
                v-for="item in ebayList"
                :key="item.ebayshopId"
                :label="item.ebayName"
                :value="item.ebayId"
              ></gj-option>
            </gj-select>
            <gj-button type="text" class="deaMenu" @click="createDraftMenu"
              >生成草稿清单</gj-button
            >
          </div>
          <div class="headerRight">
            <gj-checkbox
              v-model="allSelect"
              :indeterminate="indeterminate"
              @change="allselected"
              >全选</gj-checkbox
            >
            <span>({{ currentIndex }}/{{ currentLen }})</span>
          </div>
        </div>
        <div class="draftList">
          <div
            class="draftItem"
            v-for="(item, index) in templateData"
            :key="index"
          >
            <div class="baseInfo">
              <div class="baseInfoLeft">
                <gj-checkbox
                  v-model="item.isSeleced"
                  @change="setSeleced(index)"
                ></gj-checkbox>
                <div class="sku">{{ item.spu }}</div>
                <div class="type">
                  {{ item.specsType == 2 ? "变体" : "单品" }}
                </div>
              </div>
              <div class="baseInfoRight" @click="openEditDrafts(item)">
                编辑
              </div>
            </div>
            <div class="shopClass">
              <span class="mr">{{ item?.siteName || "--" }}</span>
              <span>{{ item?.shopName || "--" }}</span>
            </div>
            <!-- 表单 -->
            <gj-form
              ref="basicForm"
              :label-col-props="{ span: 24 }"
              :wrapper-col-props="{ span: 24 }"
              label-align="left"
              :model="ruleForm"
            >
              <gj-row :gutter="8">
                <gj-col :span="12">
                  <gj-form-item>
                    <template #label>
                      <span>标题</span>
                      <span style="margin-left: 4px; color: red">*</span>
                    </template>
                    <gj-select
                      v-model="item.titleVal"
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
                <gj-col :span="12">
                  <gj-form-item>
                    <template #label>
                      <span>刊登模板</span>
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
            <!-- 产品图片 -->
            <div>
              <div class="basicForm_title" style="margin-top: 4px">
                产品图片
              </div>
              <gj-image
                width="50"
                height="50"
                src=""
                v-if="item?.productImages.length == 0"
              />
              <div>
                <draggable
                  tag="div"
                  ghostClass="dr-placeholder"
                  handle=".des-mover"
                  :list="item?.productImages"
                  group="viewer"
                  animation="300"
                  item-key="type"
                  class="des-container-item-box"
                >
                  <template #item="{ element, index }">
                    <div class="des-container-item" v-if="index < 6">
                      <p class="item-zt" v-if="element?.mainImage">主图</p>
                      <gj-image
                        width="50"
                        height="50"
                        class="des-mover-img"
                        :src="element?.resource || ''"
                      >
                        <template #extra>
                          <div class="actions">
                            <!-- <span class="action des-mover">
                              <SvgIcon svgClass="drag" :width="12" />
                            </span> -->
                            <span class="action">
                              <SvgIcon
                                svgClass="previewIcon"
                                :width="12"
                                @click="openImgView(element, 'product')"
                              />
                            </span>
                          </div>
                        </template>
                      </gj-image>
                      <div class="more" v-if="index == 6">
                        <span>6</span>
                        <span
                          style="text-align: center"
                          @click="openEditDrafts(item)"
                        >
                          <SvgIcon
                            svgClass="imgRigth"
                            :width="12"
                            @click="copyColum(record)"
                          >
                          </SvgIcon
                        ></span>
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
            <!-- 产品属性 -->
            <div>
              <div class="basicForm_title">属性图片</div>
              <div class="box_scoll" v-if="item.variantAttr">
                <gj-row
                  class="ml"
                  v-for="(attr, index) in item.variantAttr?.attrValues"
                  :key="index"
                >
                  <gj-col :span="24">
                    <div>
                      <span class="pd4">
                        {{ item?.variantAttr?.attrName }} :
                        {{ attr?.attrValue }}
                      </span>
                    </div>
                  </gj-col>
                  <gj-col :span="4" v-if="attr?.attrImages.length == 0">
                    <gj-image width="50" height="50" src="" />
                  </gj-col>
                  <gj-col
                    :span="4"
                    v-for="(imgURL, imgIndex) in attr?.attrImages"
                    :key="imgIndex"
                  >
                    <gj-image
                      width="50"
                      height="50"
                      :src="imgURL"
                      v-if="imgIndex < 6"
                    />
                  </gj-col>
                  <gj-col :span="4" v-if="attr?.attrImages.length == 6">
                    <div class="more">
                      <span>{{ index }}</span>
                      <span
                        style="text-align: center"
                        @click="openEditDrafts(item)"
                      >
                        <SvgIcon
                          svgClass="imgRigth"
                          :width="12"
                          @click="copyColum(record)"
                        >
                        </SvgIcon
                      ></span>
                    </div>
                  </gj-col>
                </gj-row>
              </div>
              <!-- 默认 -->
              <div class="box_scoll" v-if="!item.variantAttr">
                <gj-row class="ml">
                  <gj-col :span="24">
                    <div>
                      <span class="pd4">--</span>
                    </div>
                  </gj-col>
                  <gj-col :span="4">
                    <gj-image width="50" height="50" src="" />
                  </gj-col>
                </gj-row>
              </div>
            </div>
            <!-- 视频 -->
            <div>
              <div class="basicForm_title">视频</div>
              <gj-image
                width="50"
                height="50"
                src=""
                v-if="item?.videoInfos.length == 0"
              />
              <div>
                <draggable
                  tag="div"
                  ghostClass="dr-placeholder"
                  handle=".des-mover"
                  :list="item?.videoInfos"
                  group="viewer"
                  animation="300"
                  item-key="type"
                  class="des-container-item-box"
                >
                  <template #item="{ element, index }">
                    <div class="video-container-item" v-if="index < 6">
                      <gj-image
                        width="50"
                        height="50"
                        class="des-mover-img"
                        :src="element.videoCoverUrl || ''"
                      >
                        <template #extra>
                          <div class="actions">
                            <span class="action">
                              <SvgIcon
                                svgClass="startVideo"
                                :width="24"
                                @click="openvideoView(element)"
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
            <!-- 描述 -->
            <div>
              <div class="basicForm_title">描述</div>
              <div>
                <draggable
                  tag="div"
                  ghostClass="dr-placeholder"
                  handle=".des-mover"
                  :list="item?.descriptions"
                  group="viewer"
                  animation="300"
                  item-key="type"
                  class="des-container-item-box"
                >
                  <template #item="{ element, index }">
                    <div
                      class="des-container-item"
                      v-if="element.isChebox && index < 6"
                    >
                      <gj-image
                        width="50"
                        height="50"
                        class="des-mover-img"
                        :src="element.previewUrl || ''"
                      >
                        <template #extra>
                          <div class="actions">
                            <!-- <span class="action des-mover">
                              <SvgIcon svgClass="drag" :width="12" />
                            </span> -->
                            <span class="action">
                              <SvgIcon
                                svgClass="previewIcon"
                                :width="12"
                                @click="openImgView(element, 'des')"
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
          <gj-image-preview :src="cutterImg" v-model:visible="visible" />
        </div>
      </div>
    </template>
    <template #footer>
      <gj-space>
        <gj-button shape="round" @click="cancel">取消</gj-button>
        <gj-button shape="round" @click="confirm" :disabled="!btnVisiable"
          >生成草稿</gj-button
        >
      </gj-space>
    </template>
  </fullScreenDialog>
  <!-- 编辑草稿 -->
  <edit-draft
    :dialogVisible="editDraftVisible"
    :goodsList="templateDataItem"
    @cancelNesting="cancelNesting"
    @editDraftConfirm="editDraftConfirm"
  ></edit-draft>

  <Video-modal v-model:visible="playerVisible" :src="vidoeSrc"></Video-modal>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import { GjMessage } from "@gj/atom";
import Draggable from "vuedraggable";
import SvgIcon from "@/components/SvgIcon";
import editDraft from "./draftEditDialog.vue";
import fullScreenDialog from "../components/fullScreenDialog.vue";
import { getStoreInformationlist } from "@api/published/common.js";
import VideoModal from "@/components/VideoModal.vue";
import {
  getProductDraftLists,
  setProductDraftLists,
} from "@api/published/ebay.js";
export default defineComponent({
  components: {
    fullScreenDialog,
    SvgIcon,
    editDraft,
    Draggable,
    VideoModal,
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
  emits: ["cancel", "open", "confirm"],
  setup(props, { emit }) {
    const data = reactive({
      playerVisible: false,
      vidoeSrc: "",
      currentIndex: 0,
      currentLen: 0,
      indeterminate: false,
      allSelect: false,
      ruleForm: {
        shop: [],
        titleList: {},
      },
      ebayList: [],
      btnVisiable: false,
      editDraftVisible: false,
      templateData: [],
      templateDataItem: [],
      cutterImg: "",
      visible: false,
      edit: [],
    });

    const cancelNesting = () => {
      data.editDraftVisible = false;
    };
    const editDraftConfirm = (row) => {
      data.editDraftVisible = false;
      data.templateData.forEach((item) => {
        if (item.productId == row.id) {
          item.descriptions = row.descriptions;
          item.productImages = row.productList.map((item, index) => {
            return {
              ...item,
              mainImage: index == 0 ? true : false,
            };
          });
        }
      });
    };
    const openEditDrafts = (val) => {
      data.templateDataItem = [val];
      data.editDraftVisible = true;
    };
    const editDialogCancel = () => {
      data.editDraftVisible = false;
    };
    const cancel = () => {
      data.templateData = [];
      emit("cancel");
    };
    const getShopIdList = () => {
      let params = {
        platformCode: "EBAY",
      };
      getStoreInformationlist(params).then((res) => {
        data.ebayList = res.data.map((item) => {
          return {
            ebayName: item.shopName,
            ebayId: item.shopId,
          };
        });
      });
    };
    const open = () => {
      getShopIdList();
    };
    const confirm = () => {
      let draftList = [];
      if (data.currentIndex == 0) {
        return GjMessage.warning("请选择要生成的草稿！");
      }
      data.templateData.forEach((flag) => {
        draftList.push({
          description: flag.description[0] || {},
          listingTemplateId: flag.listingTemplateId,
          productId: flag.productId,
          productImages: flag.productImages,
          shopId: flag.shopId,
          shopName: flag.shopName,
          title: flag.titleVal,
          variantAttr: flag.variantAttr,
          videoInfos: flag.videoInfos,
        });
      });
      let params = {
        createByProducts: draftList,
      };
      setProductDraftLists(params).then((res) => {
        const { code } = res;
        if (code == 200 || code == 0) {
          GjMessage.success(
            `生成 ${res.data} 条草稿成功，可前往刊登草稿列表查看`
          );
        } else {
          GjMessage.success("生成失败，请重试！");
        }
        data.allSelect = false;
        data.indeterminate = false;
        data.templateData = [];
        emit("cancel");
      });
    };
    // 生成草稿清单
    const createDraftMenu = () => {
      if (data.ruleForm.shop.length <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      let params = {
        productIds: [...props.goodsRow],
        shopIds: [data.ruleForm.shop.join(",")],
      };
      getProductDraftLists(params).then((res) => {
        const { code } = res;
        if (code == 200 || code == 0) {
          data.templateData = res.data.map((item) => {
            return {
              ...item,
              videoInfos: item.videoInfos || [],
              listingTemplateId: "",
              titleVal: "",
              isSeleced: false,
              description: [item.description],
              descriptions: item.descriptions.map((i, index) => {
                return {
                  ...i,
                  isChebox: index == 0 ? true : false,
                };
              }),
            };
          });
          if (res.data.length > 0) {
            data.currentLen = res.data.length;
            data.btnVisiable = true;
          }
        } else {
          GjMessage.success("生成清单失败，请重试");
        }
      });
    };
    const setSeleced = () => {
      let sum = 0;
      data.templateData.forEach((item) => {
        if (item.isSeleced) {
          sum++;
        }
      });
      data.currentIndex = sum;
      if (data.currentIndex == data.currentLen) {
        data.allSelect = true;
        data.indeterminate = false;
      } else if (data.currentIndex == 0) {
        data.allSelect = false;
        data.indeterminate = false;
      } else {
        if (data.currentIndex > 0) {
          data.indeterminate = true;
        } else {
          data.indeterminate = false;
        }
      }
    };

    const allselected = (val) => {
      data.indeterminate = false;
      data.templateData = data.templateData.map((item) => {
        return {
          ...item,
          isSeleced: val,
        };
      });
    };
    const openvideoView = (val) => {
      data.vidoeSrc = val?.videoUrl;
      data.playerVisible = true;
    };
    // 图片
    const openImgView = (row, name) => {
      if (name == "product") {
        data.cutterImg = row.videoCoverUrl || row.resource;
      }
      if (name == "des") {
        data.cutterImg = row.previewUrl;
      }
      data.visible = true;
    };
    const initDraftFun = () => {
      data.templateData = [];
      data.currentIndex = 0;
      data.currentLen = 0;
      data.indeterminate = false;
      data.allSelect = false;
    };
    return {
      ...toRefs(data),
      cancel,
      confirm,
      open,
      createDraftMenu,
      openEditDrafts,
      editDialogCancel,
      setSeleced,
      allselected,
      getShopIdList,
      openImgView,
      openvideoView,
      cancelNesting,
      editDraftConfirm,
      initDraftFun,
    };
  },
});
</script>
<style lang="scss" scoped>
.draft-content {
  padding: 0 12px;
  .header {
    padding: 0 12px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .headerRight {
      display: flex;
    }
    .deaMenu {
      position: relative;
      top: 2px;
      left: 16px;
    }
  }
  .arco-modal-body {
    padding: 0;
  }
  .draftList {
    padding: 0 24px 0 10px;
    display: flex;
    flex-wrap: wrap;
    .draftItem {
      font-size: 12px;
      width: 364px;
      height: 564px;
      padding: 12px 12px 16px;
      box-sizing: border-box;
      margin-left: 14px;
      margin-bottom: 14px;
      border: 1px solid #e6e6ed;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .baseInfo {
        display: flex;
        justify-content: space-between;
        .baseInfoLeft {
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
        .baseInfoRight {
          color: #0045f0;
          cursor: pointer;
        }
      }
      .shopClass {
        margin-top: 10px;
        .mr {
          margin-right: 10px;
        }
      }
      .basicForm_title {
        margin-top: 12px;
        color: #000430;
        font-size: 12px;
      }
      .box_scoll {
        width: 100%;
        height: 160px;
        border: 1px solid #f2f2f5;
        border-radius: 2px;
        overflow-y: scroll;
        .ml {
          margin-left: 4px;

          .pd4 {
            padding: 4px;
            display: inline-block;
          }
        }
      }
      .more {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 1px solid #ccc;
        color: #0045f0;
        span {
          display: inline-block;
          width: 20px;
          line-height: 50px;
          text-align: center;
          margin-left: 5px;
        }
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
:deep(.arco-form-item) {
  margin-bottom: 0px;
}

.item-zt {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 2px 4px;
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 0px 0px 4px 4px;
  position: absolute;
  z-index: 10;
  left: calc(50% - 42px / 2);
  font-size: 12px;
}
.des-container-item-box {
  display: flex;
  justify-content: flex-start;
}
.open-video {
  display: none;
}
.des-container-item {
  position: relative;
  .des-mover-img {
    margin-right: 8px;
  }

  .actions {
    display: none;
  }
  &:hover {
    .actions {
      display: inline-block;
      width: 50px;
      height: 50px;
      box-sizing: border-box;
      border-radius: 3px;
      background: rgba(0, 4, 48, 0.3);
      position: absolute;
      top: -32px;
      left: 0px;
      z-index: 20;
      border: 1px solid #0045f0;
    }
    .action {
      padding: 0px 4px;
      font-size: 14px;
      cursor: pointer;
      background: #d9e3fd;
      border-radius: 20px;
      margin-left: 3px;
      position: relative;
      top: 15px;
      left: 10px;
    }
  }
}
.video-container-item {
  position: relative;
  .des-mover-img {
    margin-right: 8px;
  }

  .actions {
    display: none;
  }
  &:hover {
    .actions {
      display: inline-block;
      width: 50px;
      height: 50px;
      box-sizing: border-box;
      border-radius: 3px;
      background: rgba(0, 4, 48, 0.3);
      position: absolute;
      top: -32px;
      left: 0px;
      z-index: 20;
      border: 1px solid #0045f0;
    }
    .action {
      cursor: pointer;
      border-radius: 20px;
      margin-left: 3px;
      position: relative;
      top: 12px;
      left: 10px;
    }
  }
}
</style>
