<template>
  <CommonPageAction
    currentRouterPermission="PLAT/materialCenter/videoManagement/view"
  >
    <gj-spin :loading="loading === 'delete'">
      <div id="multiplatform_app-videoManagement" class="pictureImgList">
        <div class="gj-search-list">
          <SearchList
            ref="searchListRef"
            :defaultView="defaultView"
            :treeData="treeData"
            @search="search"
            @treeSelect="treeSelect"
          ></SearchList>
          <gj-divider />
          <gj-space>
            <gj-popconfirm
              v-if="defaultView"
              type="warning"
              position="top"
              content="删除后将不可回退，确认删除吗?"
              @ok="batchDelete"
            >
              <gj-button
                v-if="defaultView"
                v-permissions="['PLAT/materialCenter/videoManagement/delete']"
                type="plain"
                >批量删除</gj-button
              >
            </gj-popconfirm>
            <div class="img-selected-num">
              已选：<span>{{ getUpdataSelectList().length }}</span>
            </div>
          </gj-space>
        </div>
        <gj-layout>
          <gj-layout-sider v-if="defaultView">
            <gj-tree
              :field-names="{ key: 'category', title: 'categoryName' }"
              :data="treeData"
              @select="treeSelect"
            />
          </gj-layout-sider>
          <gj-layout-content>
            <gj-list
              v-if="list?.length"
              id="pictureImgListSkuList"
              @reach-bottom="reachBottomLoad"
            >
              <gj-list-item
                v-for="(skuItem, skuIndex) of list"
                :key="skuItem.sku"
              >
                <div class="pictureList-item-sku">
                  <div class="item-sku-title">
                    <span
                      >{{ skuItem.sku ? "SKU" : "SPU" }}：{{
                        skuItem.sku || skuItem.spu
                      }}
                    </span>
                    <span>{{ skuItem.skuName || skuItem.spuName }}</span>
                    <span>(共{{ skuItem.videosCount }}段)</span>
                  </div>
                  <div v-if="defaultView" class="item-sku-content">
                    <div :style="`min-width:${pageSize * fileCard_w}px`">
                      <div
                        class="previousPage-box"
                        v-if="skuItem.imagesCount > pageSize"
                      >
                        <div
                          @click="previousPage(skuItem)"
                          :class="skuItem.pageCurrent == 1 && 'page-disabled'"
                        >
                          <SvgIcon
                            svgClass="previousPage"
                            :width="16"
                          ></SvgIcon>
                        </div>
                      </div>
                      <div
                        class="nextPage-box"
                        v-if="skuItem.imagesCount > pageSize"
                      >
                        <div
                          @click="nextPage(skuItem)"
                          :class="
                            skuItem.pageCurrent * skuItem.pageSize >=
                              skuItem.imagesCount && 'page-disabled'
                          "
                        >
                          <SvgIcon svgClass="nextPage" :width="16"></SvgIcon>
                        </div>
                      </div>
                      <FileCard
                        v-for="(item, index) of skuItem.videos"
                        :key="item.resourceId"
                        :file="item"
                        :skuIndex="skuIndex"
                        :fileIndex="index"
                        :default-checked="
                          skuItem.fileSelectList.includes(item.resourceId)
                        "
                        :selection="true"
                        :closableRight="defaultView"
                        :closable="false"
                        :showRelatedInformation="true"
                        @select="skuImgSelect"
                        @preview="skuImgPreview"
                        @relatedInfo="skuShowRelatedInfo"
                        @close="skuImgClose"
                      ></FileCard>
                    </div>
                  </div>
                  <div v-else class="item-sku-contentModal">
                    <FileCard
                      v-for="(item, index) of skuItem.videos"
                      :key="item.resourceId"
                      :file="item"
                      :skuIndex="skuIndex"
                      :fileIndex="index"
                      :default-checked="
                        skuItem.fileSelectList.includes(item.resourceId)
                      "
                      :selection="true"
                      :closable="false"
                      :showRelatedInformation="true"
                      @select="skuImgSelect"
                      @preview="skuImgPreview"
                      @relatedInfo="skuShowRelatedInfo"
                      @close="skuImgClose"
                    ></FileCard>
                  </div>
                </div>
              </gj-list-item>
              <gj-spin v-show="loading === 'start'" :size="24" />
            </gj-list>
            <gj-empty v-else />
          </gj-layout-content>
        </gj-layout>
        <VideoModal
          v-model:visible="imagePreviewVisible"
          :src="previewImage"
        ></VideoModal>
        <RelationInfo
          v-model:visible="relationInfoVisible"
          :resourceId="resourceId"
        ></RelationInfo>
      </div>
    </gj-spin>
  </CommonPageAction>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from "vue";
import { GjMessage } from "@gj/atom";
import {
  getProductCategoryList,
  productVideoJumpPageList,
  bathDeleteProductVideo,
} from "@/api/published/materialCenter";
import CommonPageAction from "@/components/CommonPageAction.vue";
import SvgIcon from "@/components/SvgIcon";
import VideoModal from "@/components/VideoModal";
import FileCard from "../component/fileCard";
import RelationInfo from "../component/relationInfo";
import useGetTableList from "../hooks/useGetTableList";
import SearchList from "./searchList";

export default defineComponent({
  name: "videoManagement",
  props: {
    defaultView: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    CommonPageAction,
    SvgIcon,
    VideoModal,
    FileCard,
    RelationInfo,
    SearchList,
  },
  emits: ["select"],
  setup(props, { emit }) {
    const container_w = document.body.offsetWidth - 200 - 24 - 86;
    const fileCard_w = 132;
    console.log(Math.floor(container_w / fileCard_w));
    const searchListRef = ref(null);
    const data = reactive({
      pageSize:
        Math.floor(container_w / fileCard_w) > 12
          ? 12
          : Math.floor(container_w / fileCard_w) < 5
          ? 4
          : Math.floor(container_w / fileCard_w),
      treeData: [],
      selectedKeys: [],
      previewImage: "",
      imagePreviewVisible: false,
      fileSelectList: [],
      listEnd: false,
      relationInfoVisible: false,
      resourceId: "",
      searchData: {
        category: "",
      },
    });
    // 获取分类
    getProductCategoryList().then((res) => {
      data.treeData = res.data;
    });
    const useGetTableListOption = {
      url: "/video/productVideoPageList",
      type: "reachBottom",
      callback: (arr) => {
        arr.forEach((item) => {
          item.pageSize = data.pageSize;
          item.pageCurrent = 1;
          item.fileSelectList = [];
          item.fileSelectList_e = [];
          item.videos.splice(data.pageSize, item.videos.length - data.pageSize);
        });
      },
    };
    if (props.defaultView) {
      useGetTableListOption.pagination = {
        limit: 12,
      };
    }
    const { list, loading, total, pagination, getTableList, paginationChange } =
      useGetTableList(useGetTableListOption);

    getTableList();
    // 下拉加载
    const reachBottomLoad = () => {
      if (list.value.length < total.value) {
        paginationChange({
          pageCurrent: pagination.value.pageCurrent + 1,
        });
      } else {
        data.listEnd = true;
      }
    };

    // 数据搜索
    const search = (searchData) => {
      data.searchData = {
        category: data.searchData.category,
        ...searchData,
      };
      // 判断是否是重置
      if (Object.keys(searchData).includes("category")) {
        data.selectedKeys = [];
        searchListRef.value.treeSelectValue = "";
      }
      list.value = [];
      data.fileSelectList = [];
      paginationChange(
        {
          pageCurrent: 1,
        },
        data.searchData
      );
    };
    // 分类搜索数据
    const treeSelect = (val) => {
      data.searchData.category = val[0];
      data.selectedKeys = val;
      searchListRef.value.search();
    };

    // 视频选中
    const skuImgSelect = (file, val, skuIndex) => {
      if (val) {
        list.value[skuIndex].fileSelectList.push(file.resourceId);
        list.value[skuIndex].fileSelectList_e.push(file);
        data.fileSelectList[skuIndex] = "";
      } else {
        const index = list.value[skuIndex].fileSelectList.findIndex(
          (item) => item === file.resourceId
        );
        const index_e = list.value[skuIndex].fileSelectList_e.findIndex(
          (item) => item.resourceId === file.resourceId
        );
        list.value[skuIndex].fileSelectList.splice(index, 1);
        list.value[skuIndex].fileSelectList_e.splice(index_e, 1);
      }
      emit("select", "videoManagementList", getUpdataSelectList_e());
    };

    // 视频播放
    const skuImgPreview = (url) => {
      data.previewImage = url;
      // 'https://video.ebaycdn.net/videos/v1/16b4cf701800a9f514e380ffffffd5a2/playlist.m3u8'
      data.imagePreviewVisible = true;
    };

    const getUpdataSelectList = () => {
      let result = [];
      Object.keys(data.fileSelectList).forEach((key) => {
        if (list.value[key].fileSelectList.length > 0) {
          result = [...result, ...list.value[key].fileSelectList];
        }
      });
      return result;
    };
    const getUpdataSelectList_e = () => {
      let result = [];
      Object.keys(data.fileSelectList).forEach((key) => {
        if (list.value[key].fileSelectList_e.length > 0) {
          result = [...result, ...list.value[key].fileSelectList_e];
        }
      });
      return result;
    };

    // 删除
    const skuImgClose = (file) => {
      if (loading.value === "delete") return;
      loading.value = "delete";
      bathDeleteProductVideo([file.resourceId]).then(() => {
        data.fileSelectList = {};
        loading.value = false;
        list.value = [];
        paginationChange({
          pageCurrent: 1,
        });
        GjMessage.success("删除成功!");
      });
    };

    // 批量删除
    const batchDelete = () => {
      const fileSelectList = getUpdataSelectList();
      if (fileSelectList.length > 0) {
        if (loading.value === "delete") return;
        loading.value = "delete";
        bathDeleteProductVideo(fileSelectList).then(() => {
          // let x = 0;
          // Object.keys(data.fileSelectList).forEach((key) => {
          //   const item = list.value[key];
          //   if (item.fileSelectList.length > 0) {
          //     productVideoJumpPageList({
          //       sku: item.sku,
          //       pageSize: item.pageSize,
          //       pageCurrent:
          //         item.videos.length === item.fileSelectList.length
          //           ? item.pageCurrent - 1
          //           : item.pageCurrent,
          //     }).then((res) => {
          //       x += 1;
          //       item.fileSelectList = [];
          //       item.videos = res.data.records;
          //       if (x === Object.keys(data.fileSelectList).length) {
          //         data.fileSelectList = {};
          //         loading.value = false;
          //         GjMessage.success("删除成功!");
          //       }
          //     });
          //   }
          // });
          data.fileSelectList = {};
          loading.value = false;
          list.value = [];
          paginationChange({
            pageCurrent: 1,
          });
          GjMessage.success("删除成功!");
        });
      } else {
        GjMessage.warning("请先选择视频!");
      }
    };

    // 查看关联信息
    // const skuShowRelatedInfo = inject("skuShowRelatedInfo");
    const skuShowRelatedInfo = (file) => {
      data.relationInfoVisible = true;
      data.resourceId = file.resourceId;
    };

    // 上一页
    const previousPage = (item) => {
      if (item.pageCurrent > 1) {
        if (loading.value === "previousPage") return;
        loading.value = "previousPage";
        productVideoJumpPageList({
          sku: item.sku,
          pageSize: item.pageSize,
          pageCurrent: item.pageCurrent - 1,
        }).then((res) => {
          item.pageCurrent -= 1;
          item.videos = res.data.records;
          loading.value = false;
        });
      }
    };

    // 下一页
    const nextPage = (item) => {
      if (item.pageCurrent * item.pageSize < item.imagesCount) {
        if (loading.value === "nextPage") return;
        loading.value = "nextPage";
        productVideoJumpPageList({
          sku: item.sku,
          pageSize: item.pageSize,
          pageCurrent: item.pageCurrent + 1,
        }).then((res) => {
          item.pageCurrent += 1;
          item.videos = res.data.records;
          loading.value = false;
        });
      }
    };

    return {
      fileCard_w,
      ...toRefs(data),
      searchListRef,
      loading,
      list,
      reachBottomLoad,
      getUpdataSelectList,
      search,
      treeSelect,
      skuImgSelect,
      skuImgPreview,
      skuImgClose,
      batchDelete,
      skuShowRelatedInfo,
      previousPage,
      nextPage,
    };
  },
});
</script>
<style lang="scss">
.gj-search-list {
  margin: 0 12px;
  border-bottom: 1px solid #f2f2f5;
  .arco-space {
    padding: 8px 0;
  }
  .arco-divider {
    margin: 0;
  }
}
</style>
<style scoped lang="scss">
.pictureImgList {
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
}
.arco-layout {
  overflow: hidden;
}
.arco-list-wrapper {
  height: 100%;
}
.arco-spin {
  display: block;
  text-align: center;
}
::v-deep .arco-list-bordered {
  border: 0;
  max-height: 100%;
  .arco-list-item {
    border: 0;
    padding: 0;
  }
}
.arco-btn + .arco-btn {
  margin-left: 10px;
}
::v-deep .arco-tree-node-title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.arco-layout-sider-light {
  box-sizing: border-box;
  box-shadow: none;
  border-right: 1px solid #f2f2f5;
}
.arco-layout-content {
  padding: 17px 12px;
}
.pictureList-item-sku {
  .item-sku-title {
    display: flex;
    align-items: center;
    // font-size: 12px;
    line-height: 16px;
    color: #000430;
    > span:first-child {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > span:nth-child(2) {
      // max-width: 300px;
      padding-left: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    > span:nth-child(3) {
      min-width: 60px;
      padding-left: 8px;
      color: #808197;
    }
  }
  .item-sku-content {
    margin: 11px 38px 26px 48px;
    > div {
      position: relative;
      display: inline-block;
      .previousPage-box,
      .nextPage-box {
        position: absolute;
        z-index: 1;
        display: flex;
        align-items: center;
        height: 100%;
        color: rgba(0, 4, 48, 0.5);
        > div {
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          &:hover {
            background: rgba(0, 69, 240, 0.15);
          }
        }
        .page-disabled {
          cursor: not-allowed;
          &:hover {
            color: rgba(0, 4, 48, 0.3);
            background: rgba(239, 239, 239, 0.3);
          }
        }
      }
      .previousPage-box {
        left: -30px;
      }
      .nextPage-box {
        right: -30px;
      }
    }
  }
}
// ::v-deep .upload-list-item .picture-mask .mask-icon > div {
// width: 90px;
// }
.img-selected-num {
  font-size: 12px;
  color: rgba(0, 4, 48, 0.4);
  > span {
    color: #0045f0;
  }
}
::v-deep .arco-tree-node-title {
  flex: 1;
  margin-right: 10px;
}
</style>
