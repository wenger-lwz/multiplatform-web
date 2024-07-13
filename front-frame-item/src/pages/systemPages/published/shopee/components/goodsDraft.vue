<template>
  <fullScreenDialog @open="open" :dialogVisible="dialogVisible">
    <template #title>
      <div class="dialog-title">
        <span @click="cancel">配置草稿</span>
        <gj-button @click="cancel">关闭</gj-button>
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
              size="small"
              :style="{ width: '200px', height: '24px' }"
              @clear="initDraftFun"
            >
              <gj-option
                :label="item.shopeeName"
                :value="item.shopeeId"
                v-for="item in shopeeList"
                :key="item.shopeeId"
              ></gj-option>
            </gj-select>
            <gj-button
              size="small"
              type="text"
              :style="{ marginLeft: '14px' }"
              @click="createDraftMenu"
              >生成草稿清单</gj-button
            >
          </div>
          <div class="headerRight">
            <gj-checkbox
              v-model="allSelect"
              :indeterminate="indeterminate"
              :disabled="!draftListLength"
              @change="selectAll"
              >全选</gj-checkbox
            >
            <span>({{ selectedRows.length }}/{{ draftListLength }})</span>
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
                  class="checkbox-draft"
                  v-model="item.isSeleced"
                  @change="setSeleced"
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
              <span>{{ item.siteName || "--" }}</span>
              <span>{{ item.shopName || "--" }}</span>
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
                      style="max-width: 165px"
                      v-model="item.titleVal"
                      placeholder="请选择"
                      size="mini"
                      allow-clear
                    >
                      <gj-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) in item.titles"
                        :key="index"
                      ></gj-option>
                    </gj-select>
                  </gj-form-item>
                </gj-col>
                <gj-col :span="12">
                  <gj-form-item>
                    <template #label>
                      <span>物流模板</span>
                    </template>
                    <gj-select
                      style="max-width: 165px"
                      v-model="item.logisticsTemplateIdList"
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
              <div style="display: flex">
                <draggable
                  v-if="item.proImages.length > 0"
                  tag="div"
                  ghostClass="dr-placeholder"
                  handle=".des-mover"
                  :list="item.proImages"
                  group="viewer"
                  animation="300"
                  item-key="type"
                  class="des-container-item-box"
                >
                  <template #item="{ element, index }">
                    <div class="des-container-item" v-if="index < 5">
                      <p class="item-zt" v-if="element.mainImage">主图</p>
                      <gj-image
                        width="50"
                        height="50"
                        class="des-mover-img"
                        :src="element.resource"
                      >
                        <template #extra>
                          <div class="actions">
                            <span class="action des-mover">
                              <SvgIcon svgClass="drag" :width="12" />
                            </span>
                            <span class="action">
                              <SvgIcon
                                svgClass="eye"
                                :width="12"
                                @click="openImgView(element, 'chanping')"
                              />
                            </span>
                          </div>
                        </template>
                      </gj-image>
                      <div class="more" v-if="index == 6">
                        <span style="text-align: center; margin-left: 5px"
                          >6</span
                        >
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
                <div v-else class="empty">暂无数据</div>
                <div
                  class="draft-item-more"
                  v-if="item.proImages.length > 5"
                  @click="openEditDrafts(item)"
                >
                  <span>{{ item.proImages.length - 5 }}</span>
                  <svg-icon svgClass="imgRigth" :width="12" />
                </div>
              </div>
            </div>
            <div v-if="item.specsType == 2">
              <div class="basicForm_title">属性图片</div>
              <div class="box_scoll">
                <!-- variantAttrs -->
                <gj-row style="margin-left: 4px">
                  <gj-col :span="24">
                    <div>
                      <span>颜色</span>
                      <span>：</span>
                      <span>红色</span>
                    </div>
                  </gj-col>
                  <gj-col :span="4">
                    <gj-image
                      width="50"
                      height="50"
                      src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
                    />
                  </gj-col>
                  <gj-col :span="4">
                    <gj-image
                      width="50"
                      height="50"
                      src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
                    />
                  </gj-col>
                  <gj-col :span="4">
                    <gj-image
                      width="50"
                      height="50"
                      src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
                    />
                  </gj-col>
                  <gj-col :span="4">
                    <gj-image
                      width="50"
                      height="50"
                      src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
                    />
                  </gj-col>
                  <gj-col :span="4">
                    <gj-image
                      width="50"
                      height="50"
                      src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
                    />
                  </gj-col>
                  <gj-col :span="4">
                    <div class="more">
                      <span style="text-align: center; margin-left: 5px"
                        >6</span
                      >
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
            </div>
            <!-- 视频 -->
            <div class="draft-item">
              <div class="draft-item-tit basicForm_title">视频</div>
              <div class="draft-item-content">
                <gj-row>
                  <gj-col :span="4">
                    <div class="video-item-box" v-if="item.videos.length > 0">
                      <template
                        v-for="(vid, index) in item.videos"
                        :key="vid.videoId"
                      >
                        <div class="video-item-wrap">
                          <gj-image
                            width="50"
                            height="50"
                            style="margin-right: 8px"
                            :src="vid.videoCoverUrl"
                            v-if="index < 6"
                          />
                          <div class="actions-wrap" v-if="vid.resource">
                            <div class="actions">
                              <span class="action preview-handle">
                                <SvgIcon
                                  svgClass="startVideo"
                                  :width="16"
                                  @click="openVideoView(vid.resource)"
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                    <div v-else class="empty">暂无数据</div>
                  </gj-col>
                  <gj-col :span="4" v-if="index == 6">
                    <div class="more">
                      <span style="text-align: center; margin-left: 5px"
                        >6</span
                      >
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
            </div>
            <!-- 描述 -->
            <div>
              <div class="basicForm_title">描述</div>
              <div v-for="it in item.descriptions" :key="it">
                {{ it }}

                <!-- <draggable
                  tag="div"
                  ghostClass="dr-placeholder"
                  handle=".des-mover"
                  :list="item.descriptions"
                  group="viewer"
                  animation="300"
                  item-key="type"
                  class="des-container-item-box"
                >
                  <template #item="{ element, index }">
                    <div class="des-container-item" v-if="index < 6">
                      <gj-image
                        width="50"
                        height="50"
                        class="des-mover-img"
                        :src="
                          element.previewUrl ||
                          'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp'
                        "
                      >
                        <template #extra>
                          <div class="actions">
                            <span class="action des-mover">
                              <SvgIcon svgClass="drag" :width="12" />
                            </span>
                            <span class="action">
                              <SvgIcon
                                svgClass="eye"
                                :width="12"
                                @click="openImgView(element, 'des')"
                              />
                            </span>
                          </div>
                        </template>
                      </gj-image>
                    </div>
                  </template>
                </draggable> -->
              </div>
            </div>
          </div>
          <gj-image-preview :src="cutterImg" v-model:visible="visible" />
        </div>
      </div>
    </template>
    <template #footer>
      <gj-space>
        <gj-button @click="cancel">取消</gj-button>
        <gj-button type="primary" @click="confirm" :disabled="!btnVisiable"
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
    @setCheboxDes="setCheboxDes"
  ></edit-draft>
  <Video-modal
    :src="previewVideoUrl"
    v-model:visible="playerVisible"
  ></Video-modal>
</template>
<script>
import { defineComponent, reactive, toRefs, computed } from "vue";
import { GjMessage } from "@gj/atom";
import SvgIcon from "@/components/SvgIcon";
import { getStoreInformationlist } from "@api/published/common.js";
import Draggable from "vuedraggable";
import { createDraft, setDraftLists } from "@api/published/shopee.js";
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog.vue";
import editDraft from "./draftEditDialog.vue";
import VideoModal from "@/components/VideoModal.vue";

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
      currentIndex: 0,
      currentLen: 0,
      ruleForm: {
        shop: [],
        titleList: {},
      },
      shopeeList: [],
      btnVisiable: false,
      editDraftVisible: false,
      templateData: [],
      templateDataItem: [],
      cutterImg: "",
      visible: false,
      draftListLength: 0,
      selectedRows: [],
      playerVisible: false,
      previewVideoUrl: "",
    });

    const allSelect = computed(() => {
      const selectedRowLen = data.selectedRows.length;
      const templateDataLen = data.templateData.length;
      if (selectedRowLen === 0) {
        return false;
      }
      return selectedRowLen === templateDataLen;
    });

    // 修改描述选中状态
    const setCheboxDes = (row) => {
      data.templateDataItem = data.templateDataItem.map((item) => {
        return {
          ...item,
          descriptions: row,
        };
      });
      // data.templateDataItem = row
    };
    const cancelNesting = () => {
      data.editDraftVisible = false;
    };
    const editDraftConfirm = (row) => {
      data.editDraftVisible = false;
      data.templateData[0].descriptions = [row.des[0]];
      console.log(row, "编辑修改");
      console.log(data.templateData, "编辑修改2");
    };
    const openEditDrafts = (val) => {
      data.templateDataItem = [val];
      data.editDraftVisible = true;
    };
    const editDialogCancel = () => {
      data.editDraftVisible = false;
    };

    const indeterminate = computed(() => {
      const selectedRowLen = data.selectedRows.length;
      const templateDataLen = data.templateData.length;
      if (selectedRowLen === 0) {
        return false;
      }
      if (selectedRowLen === templateDataLen) {
        return false;
      }
      return selectedRowLen < templateDataLen;
    });

    const resetDrafts = () => {
      data.templateData = [];
      data.shopeeList = [];
      data.ruleForm.shop = [];
      data.btnVisiable = false;
      data.templateDataItem = [];
      data.cutterImg = "";
    };

    const cancel = () => {
      emit("cancel");
      resetDrafts();
    };
    const getShopIdList = () => {
      let params = {
        platformCode: "SHOPEE",
      };
      getStoreInformationlist(params).then((res) => {
        if (res.code === 0) {
          console.log(res.data, "res.data");
          data.shopeeList = res.data.map((item) => {
            return {
              shopeeName: item.shopName,
              shopeeId: item.shopId,
            };
          });
        }
      });
    };
    const open = () => {
      getShopIdList();
    };

    const confirm = () => {
      if (data.selectedRows.length == 0) {
        return GjMessage.warning("请先勾选要操作的内容行。");
      }
      /* data.templateData.forEach((flag) => {
        draftList.push({
          descriptions: flag.descriptions,
          listingTemplateId: flag.listingTemplateId,
          id: flag.id,
          proImages: flag.proImages,
          shopId: flag.shopId,
          shopName: flag.shopName || '3453',
          titles: flag.titles,
          variantAttrs: flag.variantAttrs || [],
          videos: flag.videos || [],
        });
      }); */

      const getSelectedRowsParams = () => {
        return data.selectedRows.map((flag) => {
          console.log(flag, "flag");
          console.log(
            flag.platformCategories.flat(),
            "flag.platformCategories.flat()"
          );
          return {
            descriptions: flag.descriptions || [],
            listingTemplateId: flag.listingTemplateId,
            logisticsTemplateIdList: flag.logisticsTemplateIdList,
            id: flag.id,
            proImages: flag.proImages,
            shopId: flag.shopId,
            shopName: flag.shopName,
            titles: flag.titles,
            variantAttrs: flag.variantAttrs || [],
            variants: flag.variants || [],
            videos: flag.videos || [],
            brand: flag.brand || {},
            attributes: flag.attributes || [],
            categoryId: flag.categoryId,
            categoryName: flag.categoryName,
            chargePersonId: flag.chargePersonId,
            chargePersonName: flag.chargePersonName,
            condition: flag.condition,
            defaultTitle: flag.defaultTitle,
            dimension: {
              height: flag.dimension.height,
              length: flag.dimension.length,
              width: flag.dimension.width,
            },
            mainImage: flag.mainImage,
            platformCategories: flag.platformCategories || [],
            platformCategoryId: flag.platformCategoryId,
            platformCategoryName: flag.platformCategoryName,
            recommendPrice: flag.recommendPrice,
            recommendPriceUnit: flag.recommendPriceUnit,
            site: flag.site,
            sizeChart: flag.sizeChart,
            specsType: flag.specsType,
            spu: flag.spu,
            weight: flag.weight,
          };
        });
      };

      let params = {
        draftPages: getSelectedRowsParams(),
      };
      // isSeleced
      setDraftLists(params).then((res) => {
        const { code, message } = res;
        if (code !== 200) {
          GjMessage.success(message);
        }
        console.log(res.data, "生成草稿");
        GjMessage.success(`成功生成草稿，请到草稿界面查看`);
        // GjMessage.success(`成功生成 ${res.data} 条草稿，请到草稿界面查看`);
        emit("cancel");
      });
    };
    // 生成草稿清单
    const createDraftMenu = () => {
      if (data.ruleForm.shop.length <= 0) {
        return GjMessage.warning("未选择店铺");
      }
      let params = {
        productIds: props.goodsRow,
        shopIds: [data.ruleForm.shop.join(",")],
      };
      createDraft(params).then((res) => {
        const { code, message } = res;
        if (code !== 200) {
          GjMessage.success(message);
        }
        if (res.data) {
          data.templateData = res.data.map((item) => {
            return {
              ...item,
              listingTemplateId: "",
              titles: item.titles,
              siteName: item.site,
              isSeleced: false,
              /* descriptions: item.descriptions.map((i) => {
              return {
                ...i,
                isChebox: false,
              };
            }), */
            };
          });
        }
        console.log(data.templateData, "templateData");
        if (res.data && res.data.length > 0) {
          data.draftListLength = res.data.length;
          data.btnVisiable = true;
        }
      });
    };

    const setSeleced = (index) => {
      console.log(index, "index");
      data.selectedRows = data.templateData.filter((item) => {
        return item.isSeleced;
      });
      /* let sum = 0;
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
      } */
    };

    const selectAll = (isSelected) => {
      data.templateData = data.templateData.map((item) => {
        return {
          ...item,
          isSeleced: isSelected,
        };
      });

      if (isSelected) {
        data.selectedRows = data.templateData.map((row) => {
          return row.productId;
        });
      } else {
        data.selectedRows = [];
      }
    };

    const openVideoView = (src) => {
      data.previewVideoUrl = src;
      data.playerVisible = true;
    };

    // 修改基本信息
    const editdraftDialogConfirm = (row) => {
      console.log(row, "queuuae");
    };
    // 图片
    const openImgView = (row, name) => {
      if (name == "chanping") {
        data.cutterImg = row.resource;
      }
      if (name == "des") {
        data.cutterImg =
          "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp";
      }
      data.visible = true;
      console.log(row, name);
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
      editdraftDialogConfirm,
      selectAll,
      getShopIdList,
      openImgView,
      cancelNesting,
      editDraftConfirm,
      setCheboxDes,
      allSelect,
      indeterminate,
      openVideoView,
      initDraftFun,
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
  // transform: translateY(-50%);
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
.draft-content {
  padding: 0 12px;
  .header {
    margin-bottom: 16px;
    padding: 20px 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .headerRight {
      display: flex;
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
      // height: 564px;
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
        font-weight: 700;
      }
      .shopClass span:nth-child(2) {
        padding-left: 12px;
      }
      .basicForm_title {
        margin-top: 12px;
        color: #000430;
        font-size: 12px;
      }
      .box_scoll {
        width: 100%;
        // height: 160px;
        border: 1px solid #f2f2f5;
        border-radius: 2px;
        overflow-y: scroll;
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
      top: -7px;
      left: 0px;
      z-index: 20;
      border: 1px solid #0045f0;
    }
    .action {
      display: initial;
      padding: 0px 4px;
      font-size: 14px;
      cursor: pointer;
      background: #d9e3fd;
      border-radius: 20px;
      margin-left: 3px;
      position: relative;
      top: 15px;
    }
  }
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
      .actions-wrap {
        border: 1px solid #0045f0;
        border-radius: 3px;
        background: rgba(0, 4, 48, 0.3);
      }
    }
    .actions {
      display: none;
      margin-top: -11px;
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
.empty {
  padding-top: 5px;
  color: #b3b4c1;
  word-break: keep-all;
}
.h-wrap {
  padding-top: 16px;
}
.checkbox-draft {
  padding-left: 0;
}
/deep/.arco-image-with-footer-inner .arco-image-footer {
  margin-top: -18px;
  top: 50%;
}
/deep/.arco-image-error-icon {
  position: relative;
  bottom: -7px;
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
.video-item-box {
  display: flex;
  gap: 8px;
}
</style>
