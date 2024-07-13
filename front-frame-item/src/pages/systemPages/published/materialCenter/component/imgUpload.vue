<template>
  <div class="materialCenter-imgUpload">
    <div class="materialCenter-imgUpload-content">
      <gj-tree-select
        v-if="showTreeSelect"
        v-model="treeSelectValue"
        :popup-visible="treeSelectShow"
        :fieldNames="{
          key: 'id',
          title: 'name',
        }"
        :data="treeSelectList"
        :disabled="treeSelectDisabled"
        placeholder="请选择上传目录"
        style="width: 300px"
        @change="treeSelectValueChange"
        @popup-visible-change="treeSelectShowChange"
      ></gj-tree-select>
      <div class="imgUpload-imgList">
        <gb-upload-image
          :uploadData="{
            categoryId: treeSelectValue_u,
          }"
          :code="0"
          :disabled="!treeSelectValue"
          :imgExceeding="imgExceeding"
          :isLimitRatio="isLimitRatio"
          :minWidth="minWidth"
          :minHeight="minHeight"
          :maxWidth="maxWidth"
          :maxHeight="maxHeight"
          :fileListData="fileListData"
          :interfaceMethod="fileUpload_c"
          @onSuccessCallback="onSuccessCallback"
          @onFailedCallback="onFailedCallback"
          @onRemoveImage="onRemoveImage"
        >
        </gb-upload-image>
      </div>
    </div>
    <div class="imgUpload-footer">
      <gj-button type="plain" @click="confirm(false)">取消</gj-button>
      <gj-button
        :loading="loading === 'handleSubmit'"
        type="primary"
        @click="confirm(imgList)"
        >确认</gj-button
      >
    </div>
    <gj-modal
      v-model:visible="tipVisible"
      class="treeSelectValueChangeModal"
      title="提示"
      hide-cancel
      @ok="treeSelectShow = true"
    >
      <div>更换目录后，图片将会清除，是否确认?</div>
    </gj-modal>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import {
  getUploadDir,
  getSkuListBySpu,
  getCustomUploadDir,
} from "@/api/published/materialCenter";
import { fileUpload_c, saveBindSku } from "@/api/fileUpload";
// import { createUuid } from '@/utils/common';

export default {
  props: {
    // 是否显示目录树
    showTreeSelect: {
      type: Boolean,
      default: true,
    },
    treeType: {
      type: String,
      default: "all",
    },
    sku: {
      type: String,
      default: "",
    },
    skutype: {
      type: String,
      default: "",
    },
    treeSelectDisabled: {
      type: Boolean,
      default: false,
    },
    imgExceeding: {
      type: Number,
      default: 5,
    },
    isLimitRatio: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    minWidth: {
      type: Number,
      default: () => {
        return 800;
      },
    },
    minHeight: {
      type: Number,
      default: () => {
        return 800;
      },
    },
    maxWidth: {
      type: Number,
      default: () => {
        return 800;
      },
    },
    maxHeight: {
      type: Number,
      default: () => {
        return 800;
      },
    },
  },
  emits: ["confirm"],
  setup(props, { emit }) {
    const data = reactive({
      loading: false,
      treeSelectList: [],
      treeSelectValue: "",
      treeSelectShow: false,
      treeSelectValue_u: "",
      fileListData: [],
      tipVisible: false,
      // imgUpUrl: `${process.env.VUE_APP_DEV_API}/resource/upload`,
    });

    let imgList = [];

    let catalogue_fn = null;
    if (props.treeType === "all") {
      catalogue_fn = getUploadDir;
    } else {
      catalogue_fn = getCustomUploadDir;
    }
    // 获取选择目录
    catalogue_fn().then((res) => {
      if (props.treeType !== "all") {
        // data.treeSelectValue = getChildrenId(res.data[0])
        // function getChildrenId(data) {
        //   if (data.children && data.children.length > 0) {
        //     return getChildrenId(data.children[0])
        //   } else {
        //     return data.id
        //   }
        // }
        // data.treeSelectValue_u = data.treeSelectValue
        data.treeSelectList = res.data;
        return false;
      }
      // 如果是spu
      if (props.skutype === "spu") {
        getSkuListBySpu({
          spu: props.sku,
        }).then((spuRes) => {
          let spuObj = {
            id: props.sku + "$sku$",
            name: props.sku,
          };
          if (spuRes.data && spuRes.data.length > 0) {
            spuObj.children = spuRes.data.map((item) => {
              return {
                id: item.sku + "$sku$",
                name: item.sku,
              };
            });
          }
          res.data[0].children = [spuObj];
          data.treeSelectValue = props.sku + "$sku$";
          data.treeSelectList = res.data;
          console.log(data.treeSelectList);
        });
      } else {
        // 如果是sku
        if (props.sku) {
          res.data[0].children = [
            {
              id: props.sku + "$sku$",
              name: props.sku,
            },
          ];
          data.treeSelectValue = props.sku + "$sku$";
        }
        data.treeSelectList = res.data;
      }
      res.data[0].disabled = true;
      res.data[1].disabled = true;
      data.treeSelectValue_u = res.data[0].id;
    });

    const treeSelectValueChange = (val) => {
      if (val.indexOf("$sku$") > 0) {
        if (data.treeSelectValue_u !== data.treeSelectList[0].id) {
          data.fileListData = [];
          imgList = [];
        }
        data.treeSelectValue_u = data.treeSelectList[0].id;
      } else {
        if (data.treeSelectValue_u !== val) {
          data.fileListData = [];
          imgList = [];
        }
        data.treeSelectValue_u = val;
      }
      data.treeSelectShow = false;
    };

    const treeSelectShowChange = (val) => {
      if (val) {
        if (imgList.length) {
          data.tipVisible = true;
        } else {
          data.treeSelectShow = true;
        }
      } else {
        data.treeSelectShow = false;
      }
    };

    // 删除图片
    const onRemoveImage = (file) => {
      console.log("删除的图片", file);
      const index = imgList.findIndex(
        (item) => item.resourceId === file.resourceId
      );
      if (index !== -1) {
        imgList(index, 0);
      }
    };
    const onFailedCallback = (e) => {
      console.log("接收到错误信息", e);
    };

    const onSuccessCallback = (e) => {
      imgList.push(e);
    };

    // 确认按钮
    const confirm = (list) => {
      if (props.treeType === "all") {
        if (data.treeSelectValue_u === data.treeSelectList[0].id) {
          emit("confirm", list);
        } else {
          saveBindSku({
            type: props.skutype,
            sku: props.sku,
            resourceIds: list.map((item) => item.resourceId),
          }).then(() => {
            emit("confirm", list);
          });
        }
      } else {
        emit("confirm", list);
      }
    };

    return {
      ...toRefs(data),
      imgList,
      treeSelectValueChange,
      treeSelectShowChange,
      fileUpload_c,
      onRemoveImage,
      onFailedCallback,
      onSuccessCallback,
      confirm,
    };
  },
};
</script>
<style lang="scss">
.treeSelectValueChangeModal {
  z-index: 2000 !important;
}
</style>
<style scoped lang="scss">
.materialCenter-imgUpload {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 590px;
}
.materialCenter-imgUpload-content {
  flex: 1;
  padding: 0 16px 16px 16px;
}

.imgUpload-imgList {
  margin-top: 16px;
}

.imgUpload-footer {
  border-top: 1px solid #e6e6ed;
  padding: 8px 16px;
  text-align: right;
  button + button {
    margin-left: 12px;
  }
}
</style>
