<template>
  <div class="searchList">
    <gj-input-search
      v-model="name"
      :style="{ width: '200px' }"
      placeholder="请输入视频名称"
      @search="search"
    />
    <gj-select :style="{ width: '100px' }" placeholder="状态" @change="search">
      <gj-option
        v-for="item of options"
        :key="item.state"
        :value="item.state"
        :label="item.stateDescription"
      ></gj-option>
    </gj-select>
  </div>
  <gj-list @reach-bottom="reachBottomLoad">
    <div class="item-sku-content">
      <FileCard
        v-for="item of list"
        :key="item"
        :file="item"
        :selection="true"
        :closable="false"
        @select="videoSelect"
        @preview="videoPreview"
      ></FileCard>
    </div>
    <gj-spin v-if="loading === 'start'" :size="24" />
    <!-- <div v-if="listEnd">没有更多了</div> -->
  </gj-list>
  <VideoModal
    v-model:visible="imagePreviewVisible"
    :src="previewImage"
  ></VideoModal>
</template>

<script>
import { reactive, toRefs } from "vue";
import { getlistingCommonVideoState } from "@/api/modalFileUpload";
import VideoModal from "@/components/VideoModal.vue";
import useGetTableList from "../../hooks/useGetTableList";
import FileCard from "../../component/fileCard";

export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    // 平台名称
    platform: {
      type: String,
      default: "",
    },
  },
  components: {
    FileCard,
    VideoModal,
  },
  emits: ["select"],
  setup(props, { emit }) {
    const data = reactive({
      listEnd: false,
      imagePreviewVisible: false,
      previewImage: "",
      options: [],
      selectList: [],
    });

    const searchData = reactive({
      platformCode: props.platform,
      name: "",
      platformState: "",
    });

    // const types = {
    //   eBay: {},
    //   Lazada: {},
    //   shopee: {},
    // }
    getlistingCommonVideoState().then((res) => {
      data.options = res.data;
    });
    const { list, loading, total, pagination, getTableList, paginationChange } =
      useGetTableList({
        method: "get",
        url: "/listing-common/video",
        type: "reachBottom",
        pagination: {
          pageSize: 100,
        },
      });

    const reachBottomLoad = () => {
      if (list.value.length < total.value) {
        paginationChange({
          pageCurrent: pagination.value.pageCurrent + 1,
        });
      } else {
        data.listEnd = true;
      }
    };
    getTableList({ ...searchData });

    const videoSelect = (file, val) => {
      if (val) {
        data.selectList.push(file);
      } else {
        const index = data.selectList.findIndex(
          (item) => item === file.resourceId
        );
        data.selectList.splice(index, 1);
      }
      emit("select", "videoLibraryList", data.selectList);
    };
    // 视频播放
    const videoPreview = (url) => {
      data.previewImage = url;
      data.imagePreviewVisible = true;
    };

    const search = () => {
      list.value = [];
      getTableList({ ...searchData });
    };

    return {
      ...toRefs(data),
      ...toRefs(searchData),
      list,
      loading,
      reachBottomLoad,
      videoSelect,
      videoPreview,
      search,
    };
  },
};
</script>

<style scoped lang="scss">
.searchList {
  padding: 8px 12px;
}
.arco-divider {
  margin: 0;
}
.arco-input-search {
  margin-right: 10px;
}
::v-deep .arco-list-bordered {
  border: 0;
  max-height: 100%;
  .arco-list-item {
    border: 0;
    padding: 0;
  }
}
::v-deep .mask-icon > div {
  width: auto !important;
}
.arco-list-wrapper {
  height: calc(100% - 49px);
}
</style>
