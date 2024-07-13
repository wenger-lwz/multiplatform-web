<template>
  <CommonPageAction
    currentRouterPermission="PLAT/materialCenter/pictureManagement/view"
  >
    <gj-radio-group v-if="tabsRadioGroup" v-model="tabsValue" type="button">
      <gj-radio value="first">产品图片</gj-radio>
      <gj-radio value="second">其他图片</gj-radio>
    </gj-radio-group>
    <gj-tabs
      id="multiplatform-app_pictureManagement"
      :class="tabsRadioGroup && 'tabsRadioGroup'"
      :active-key="tabsValue"
      :lazy-load="true"
      @tab-click="tabClick"
    >
      <gj-tab-pane key="first" title="产品图片">
        <PictureImgList
          :default-view="!tabsRadioGroup"
          @select="imgSelect"
        ></PictureImgList>
      </gj-tab-pane>
      <gj-tab-pane key="second" title="其他图片">
        <OtherPictures
          :default-view="!tabsRadioGroup"
          @select="imgSelect"
        ></OtherPictures>
      </gj-tab-pane>
    </gj-tabs>
    <gj-image-preview
      v-model:visible="imagePreviewVisible"
      :src="previewImage"
      :render-to-body="false"
    />
    <gj-modal
      :visible="tagsAddVisible"
      :width="500"
      :render-to-body="false"
      title="添加标签"
      modal-class="tags-add"
      @ok="tagsAdd"
      @cancel="tagsAddVisible = false"
    >
      <div>
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
    <RelationInfo
      v-model:visible="relationInfoVisible"
      :resourceId="resourceId"
    ></RelationInfo>
  </CommonPageAction>
</template>

<script>
import { reactive, toRefs, provide } from "vue";
import { getAllLabelList, makeLabel } from "@/api/published/materialCenter";
import { GjMessage } from "@gj/atom";
import CommonPageAction from "@/components/CommonPageAction.vue";
import PictureImgList from "./component/pictureImgList";
import OtherPictures from "./component/otherPictures";
import RelationInfo from "../component/relationInfo";

export default {
  name: "pictureManagement",
  props: {
    tabsRadioGroup: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CommonPageAction,
    PictureImgList,
    OtherPictures,
    RelationInfo,
  },
  emits: ["select"],
  setup(props, { emit }) {
    const data = reactive({
      tabsValue: "first",
      loading: false,
      relationInfoVisible: false,
      resourceId: "",
      tagsAddVisible: false,
      tagsValue: [],
      selectOption: [],
      tagsAddFileSelectList: [],
      previewImage: "",
      imagePreviewVisible: false,
      pictureImgSelectList: [],
      otherPicturesSelectList: [],
    });

    getAllLabelList({ name: "" }).then((res) => {
      data.selectOption = res.data;
    });

    provide("getTagOptions", () => data.selectOption);

    // 图片预览
    provide("skuImgPreview", (url) => {
      data.previewImage = url;
      data.imagePreviewVisible = true;
    });

    // 查看关联信息
    provide("skuShowRelatedInfo", (file) => {
      data.relationInfoVisible = true;
      data.resourceId = file.resourceId;
      console.log(11111, data.resourceId);
    });

    // 打开添加标签对话框
    provide("tagsAdd", (fileSelectList) => {
      // console.log(fileSelectList)
      data.tagsAddFileSelectList = [...fileSelectList];
      if (data.tagsAddFileSelectList.length > 0) {
        data.tagsAddVisible = true;
      } else {
        GjMessage.warning("请先选择图片!");
      }
    });

    // 添加标签
    const tagsAdd = () => {
      if (data.loading === "tagsAdd") return;
      if (data.tagsValue.length > 0) {
        data.loading = "tagsAdd";
        makeLabel({
          resourceIds: data.tagsAddFileSelectList,
          labelIds: data.tagsValue,
        })
          .then(() => {
            GjMessage.success("添加成功!");
            data.tagsAddVisible = false;
            data.loading = false;
          })
          .catch(() => {
            data.loading = false;
          });
      } else {
        GjMessage.warning("请选择标签!");
      }
    };

    const tabClick = (val) => {
      data.tabsValue = val;
    };

    const imgSelect = (key, list) => {
      data[key] = list;
      emit("select", [
        ...data.pictureImgSelectList,
        ...data.otherPicturesSelectList,
      ]);
    };

    return {
      ...toRefs(data),
      tagsAdd,
      tabClick,
      imgSelect,
    };
  },
};
</script>
<style lang="scss">
.tags-add {
  .tags-add-title {
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 5px;
  }
}
.gj-search-list {
  padding: 0 12px;
  border-bottom: 1px solid #f2f2f5;
  .gb-default-view,
  .arco-space {
    padding: 8px 0;
  }
  .arco-divider {
    margin: 0;
  }
  .gb-input-tag {
    width: 160px;
  }
}
.tabsRadioGroup .arco-tabs-nav {
  display: none;
}
.tabsRadioGroup .gj-search-list {
  padding: 0;
}
</style>
<style scoped lang="scss">
.arco-radio-group-button {
  margin-left: 12px;
}
.arco-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}
::v-deep .arco-tabs-content {
  flex: 1;
  padding: 0;
}
::v-deep .arco-tabs-pane,
::v-deep .arco-tabs-content-list {
  height: 100%;
}
</style>
