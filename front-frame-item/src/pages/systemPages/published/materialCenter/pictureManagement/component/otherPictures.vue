<template>
  <div class="pictureImgList">
    <div class="gj-search-list">
      <SearchList
        ref="searchListRef"
        :treeData="treeData"
        :defaultView="defaultView"
        @search="search"
        @treeSelect="treeSelect"
      ></SearchList>
      <gj-divider />
      <gj-space>
        <gj-button
          v-if="defaultView"
          v-permissions="['PLAT/materialCenter/pictureManagement/uploadImg']"
          type="primary"
          @click="uploadImgVisible = true"
          >上传图片</gj-button
        >
        <gj-button
          v-if="defaultView"
          v-permissions="['PLAT/materialCenter/pictureManagement/addTag']"
          type="plain"
          @click="tagsAdd(fileSelectList.map((item) => item.resourceId))"
          >添加标签</gj-button
        >
        <gj-popconfirm
          v-if="defaultView"
          :popup-visible="popconfirmShow"
          type="warning"
          position="top"
          content="删除后将不可回退，确认删除吗?"
          @popup-visible-change="openAutomatic"
          @ok="batchDelete(fileSelectList.map((item) => item.resourceId))"
        >
          <gj-button
            v-permissions="['PLAT/materialCenter/pictureManagement/delete']"
            type="plain"
            >批量删除</gj-button
          >
        </gj-popconfirm>
        <div class="img-selected-num">
          已选：<span>{{ fileSelectList.length }}</span>
        </div>
      </gj-space>
    </div>
    <gj-layout>
      <gj-layout-sider v-if="defaultView">
        <div class="add-class">
          <span>分类</span>
          <div class="add-class-icon" @click="addClassVisible = true">
            <SvgIcon svgClass="classAdd" :width="14"></SvgIcon>
          </div>
        </div>
        <gj-tree
          :field-names="{ key: 'id', title: 'name' }"
          :data="treeData"
          :selected-keys="selectedKeys"
          @select="treeSelect"
        />
      </gj-layout-sider>
      <gj-layout-content>
        <!-- <div
          style="position: relative"
          id="otherPicturesList"
          @reach-bottom="reachBottomLoad"
        > -->
        <gj-list v-if="list?.length" @reach-bottom="reachBottomLoad">
          <div class="pictureList-item-sku">
            <div class="item-sku-content">
              <FileCard
                v-for="item of list"
                :key="item.id"
                :file="item"
                :selection="true"
                :showSize="true"
                :closableRight="true"
                :closable="false"
                :showRelatedInformation="true"
                :labelGroup="true"
                @select="skuImgSelect"
                @preview="skuImgPreview"
                @relatedInfo="skuShowRelatedInfo"
                @close="skuImgClose"
              ></FileCard>
            </div>
          </div>
          <gj-spin v-if="loading === 'start'" :size="24" />
          <!-- <div v-if="listEnd">没有更多了</div> -->
        </gj-list>
        <gj-empty v-else />
      </gj-layout-content>
    </gj-layout>
    <gj-modal
      v-model:visible="addClassVisible"
      :width="500"
      title="添加分类"
      :footer="false"
      :render-to-body="false"
      modal-class="class-add"
    >
      <div>
        <gj-form
          ref="formRef"
          layout="vertical"
          :model="form"
          @submit="addClass"
          class="class-add-form"
        >
          <gj-form-item
            field="name"
            label="分类名称"
            :rules="[{ required: true, message: '产品分类不能为空' }]"
            :validate-trigger="['change', 'input']"
          >
            <gj-input v-model="form.name" placeholder="请输入...." />
          </gj-form-item>
          <gj-form-item field="parentId" label="父级分类">
            <gj-tree-select
              v-model="form.parentId"
              :data="addTreeData"
              :field-names="{ key: 'id', title: 'name' }"
              placeholder="请选择...."
            ></gj-tree-select>
          </gj-form-item>
          <gj-form-item row-class="class-add-footer">
            <div>
              <gj-button type="outline" @click="addClassVisible = false"
                >取消</gj-button
              >
              <gj-button type="primary" html-type="submit">确认</gj-button>
            </div>
          </gj-form-item>
        </gj-form>
      </div>
    </gj-modal>
    <gj-modal
      modal-class="otherPictures-uploadImg"
      v-model:visible="uploadImgVisible"
      :width="812"
      :unmount-on-close="true"
      :render-to-body="false"
      :footer="false"
      title="上传图片"
      @cancel="uploadImgVisible = false"
    >
      <imgUpload
        treeType="getCustomUploadDir"
        @confirm="uploadImgVisible = false"
      ></imgUpload>
    </gj-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, inject } from "vue";
import { GjMessage } from "@gj/atom";
import {
  getOtherCategoryList,
  bathDeleteImages,
  addCategory,
  getOtherParentCategories,
} from "@/api/published/materialCenter";
import SvgIcon from "@/components/SvgIcon";
import FileCard from "../../component/fileCard";
import useGetTableList from "../../hooks/useGetTableList";
import imgUpload from "../../component/imgUpload";
import SearchList from "./otherPicturesSearchList";

export default defineComponent({
  props: {
    defaultView: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    SvgIcon,
    FileCard,
    SearchList,
    imgUpload,
  },
  emits: ["select"],
  setup(props, { emit }) {
    console.log(1111111, props.defaultView);
    const data = reactive({
      treeData: [],
      addTreeData: [],
      selectedKeys: [],
      fileSelectList: [],
      listEnd: false,
      popconfirmShow: false,
      addClassVisible: false,
      uploadImgVisible: false,
      form: {
        name: "",
        parentId: "",
      },
      searchData: {
        category: "",
      },
    });
    const formRef = ref(null);
    const searchListRef = ref(null);
    const InitClass = () => {
      getOtherCategoryList().then((res) => {
        if (res.data && res.data.length > 0) {
          data.treeData = res.data;
        }
      });
      getOtherParentCategories().then((res) => {
        if (res.data && res.data.length > 0) {
          data.addTreeData = res.data;
          data.form.parentId = res.data[0].id;
        }
      });
    };
    InitClass();

    const {
      list,
      loading,
      total,
      pagination,
      getTableList,
      paginationChange,
      deleteRow,
    } = useGetTableList({
      url: "/resource/otherImgPageList",
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

    const skuImgSelect = (file, val) => {
      if (val) {
        data.fileSelectList.push(file);
      } else {
        const index = data.fileSelectList.findIndex(
          (item) => item.resourceId === file.resourceId
        );
        data.fileSelectList.splice(index, 1);
      }
      emit("select", "otherPicturesSelectList", data.fileSelectList);
    };

    const skuImgClose = (file) => {
      deleteRow(bathDeleteImages, [file.resourceId]);
    };

    // 批量删除二次确认
    const openAutomatic = (val) => {
      if (val) {
        if (data.fileSelectList.length > 0) {
          data.popconfirmShow = true;
        } else {
          GjMessage.warning("请先选择图片!");
        }
      } else {
        data.popconfirmShow = false;
      }
    };

    const batchDelete = (fileSelectList) => {
      if (fileSelectList.length > 0) {
        deleteRow(bathDeleteImages, fileSelectList);
        data.fileSelectList = [];
      } else {
        GjMessage.warning("请先选择图片!");
      }
    };

    const addClass = () => {
      formRef.value.validate().then((vals) => {
        if (!vals) {
          addCategory(data.form).then(() => {
            InitClass();
            data.addClassVisible = false;
            GjMessage.success("添加成功!");
          });
        }
      });
    };

    const skuImgPreview = inject("skuImgPreview");
    const skuShowRelatedInfo = inject("skuShowRelatedInfo");
    const tagsAdd = inject("tagsAdd");

    getTableList();

    return {
      ...toRefs(data),
      formRef,
      searchListRef,
      list,
      loading,
      reachBottomLoad,
      search,
      treeSelect,
      skuImgSelect,
      skuImgPreview,
      skuImgClose,
      addClass,
      skuShowRelatedInfo,
      tagsAdd,
      batchDelete,
      openAutomatic,
    };
  },
});
</script>

<style lang="scss">
.class-add {
  .arco-modal-body {
    padding: 20px 0;
  }
  .class-add-form {
    .arco-row-justify-start {
      box-sizing: border-box;
      padding: 0 20px;
    }
  }
}
.class-add-footer {
  border-top: 1px solid #e6e6ed;
  margin: 0;
  > div {
    margin: 0 !important;
  }
  .arco-form-item-content {
    padding-top: 10px;
    justify-content: flex-end;
  }
}
.otherPictures-uploadImg {
  .arco-modal-body {
    padding: 20px 0 0 0;
  }
}
</style>
<style scoped lang="scss">
.pictureImgList {
  height: 100%;
  display: flex;
  flex-direction: column;
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
  .item-sku-content {
    > div {
      position: relative;
      display: inline-block;
    }
  }
}

.add-class {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 8px;
  color: #333659;
  .add-class-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background: #d9e3fd;
    }
  }
}
.img-selected-num {
  font-size: 12px;
  color: rgba(0, 4, 48, 0.4);
  > span {
    color: #0045f0;
  }
}
</style>
