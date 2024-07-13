<template>
  <div class="pictureImgList">
    <div class="gj-search-list common-pages">
      <LanguagesSelect
        v-model="languagesValue"
        class="search-list-item search-select"
        @change="languagesSelectChange"
      ></LanguagesSelect>
      <gb-select-input2
        v-model="selectInput"
        class="search-list-item"
        inputMore
        :options="options"
        @search="gbSearch"
      ></gb-select-input2>
      <gj-button
        class="search-list-item"
        type="textPlain"
        @click="commonPageRest"
        >重置</gj-button
      >
    </div>
    <gj-layout>
      <gj-layout-sider>
        <ClassTree ref="classTreeRef" @select="treeChange"></ClassTree>
      </gj-layout-sider>
      <gj-layout-content>
        <gj-list id="pictureImgListSkuList" @reach-bottom="reachBottomLoad">
          <gj-list-item
            v-for="(item, skuIndex) of list"
            :key="item.sku || item.spu"
          >
            <div class="pictureList-item-sku">
              <div class="item-sku-title">
                <span
                  >{{ item.sku ? "SKU" : "SPU" }}：{{ item.sku || item.spu }}
                </span>
                <span>{{ item.skuName || item.spuName }}</span>
              </div>
              <div class="item-sku-content">
                <FileCard
                  v-for="(file, index) of item.richTexts"
                  :key="file"
                  :file="file"
                  :skuIndex="skuIndex"
                  :fileIndex="index"
                  :selection="true"
                  :closable="false"
                  :fileName="false"
                  @select="skuImgSelect"
                  @preview="skuImgPreview"
                ></FileCard>
              </div>
            </div>
          </gj-list-item>
          <gj-spin v-show="loading === 'start'" :size="24" />
        </gj-list>
      </gj-layout-content>
    </gj-layout>
  </div>
  <div class="materialCenter-modal-footer">
    <gj-button type="plain" @click="close">取消</gj-button>
    <gj-button type="primary" @click="confirm(richTextSelectList)"
      >确认</gj-button
    >
  </div>
  <gj-image-preview
    v-model:visible="imagePreviewVisible"
    :src="previewImage"
    :render-to-body="false"
  />
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from "vue";
import useGetTableList from "../../hooks/useGetTableList";
import ClassTree from "../../component/class-tree.vue";
import FileCard from "../../component/fileCard.vue";
import LanguagesSelect from "./languages-select.vue";

export default defineComponent({
  components: {
    ClassTree,
    FileCard,
    LanguagesSelect,
  },
  emits: ["close", "confirm"],
  setup(props, { emit }) {
    const classTreeRef = ref(null);
    const data = reactive({
      languagesValue: "",
      options: [{ value: "0", label: "SPU/SKU" }],
      selectInput: {
        selectValue: "0",
        inputValue: "",
        moreValue: [],
      },
      searchData: {
        category: "",
      },
      selectedKeys: [],
      fileSelectList: [],
      listEnd: false,
      pageSize: 10,
      imagePreviewVisible: false,
      previewImage: "",
      // 返回的选中列表
      richTextSelectList: [],
    });

    // 语种切换搜索
    const languagesSelectChange = (val) => {
      console.log(val);
    };

    const gbSearch = (val) => {
      data.selectInput = val;
      search();
    };

    // 多行搜索
    const search = () => {
      list.value = [];
      data.fileSelectList = [];
      let params = {
        languageId: data.languagesValue,
        ...data.searchData,
      };
      if (data.selectInput.moreValue.length) {
        params.itemContent = data.selectInput.moreValue.map((item) => {
          return item.trim();
        });
      }
      if (data.selectInput.inputValue) {
        params.itemContent = [data.selectInput.inputValue.trim()];
      }
      getTableList(params);
    };

    // 分类搜索
    const treeChange = (val) => {
      data.selectedKeys = val;
      search();
    };

    // 重置
    const commonPageRest = () => {
      data.selectInput = {
        selectValue: "0",
        inputValue: "",
        moreValue: [],
      };
      data.languagesValue = "";
      data.searchData = {
        category: "",
      };
      classTreeRef.value.restValues();
      search();
    };

    const { list, loading, total, pagination, getTableList, paginationChange } =
      useGetTableList({
        url: "/resource/productRichTextPageList",
        type: "reachBottom",
      });

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

    // 富文本选中
    const skuImgSelect = (file, val, skuIndex) => {
      if (val) {
        if (!list.value[skuIndex].fileSelectList) {
          list.value[skuIndex].fileSelectList = [];
        }
        list.value[skuIndex].fileSelectList.push(file);
        data.fileSelectList[skuIndex] = "";
      } else {
        const index = list.value[skuIndex].fileSelectList.findIndex(
          (item) => item.resourceId === file.resourceId
        );

        list.value[skuIndex].fileSelectList.splice(index, 1);
      }
      data.richTextSelectList = getUpdataSelectList();
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
    // 富文本预览
    const skuImgPreview = (val) => {
      data.previewImage = val;
      data.imagePreviewVisible = true;
    };

    // 取消关闭
    const close = () => {
      emit("close", false);
    };
    // 确认
    const confirm = (list) => {
      if (list) {
        emit("confirm", list);
      } else {
        emit("close");
      }
    };

    return {
      ...toRefs(data),
      languagesSelectChange,
      loading,
      list,
      gbSearch,
      search,
      treeChange,
      reachBottomLoad,
      getUpdataSelectList,
      skuImgSelect,
      skuImgPreview,
      close,
      confirm,
      classTreeRef,
      commonPageRest,
    };
  },
});
</script>

<style scoped lang="scss">
.pictureImgList {
  height: 83vh;
  display: flex;
  flex-direction: column;
  text-align: left;
}
.gj-search-list {
  padding: 8px 12px;
  border-bottom: 1px solid #f2f2f5;
  .search-list-item + .search-list-item {
    margin-left: 8px;
  }
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
.arco-divider-horizontal.arco-divider-with-text {
  margin: 0;
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
}
.gb-select-input2 {
  display: inline-flex;
}
::v-deep .upload-list-item .picture-mask .mask-icon > div {
  width: auto;
}
</style>
