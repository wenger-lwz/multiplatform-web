<template>
  <div class="squre-line">
    <div class="image-tips mb8">
      营销图片
      <gj-popover>
        <SvgIcon svgClass="vector02" :width="13"></SvgIcon>
        <template #content>
          <p>
            要求1:1白底图，上传符合规范的营销图将有机会展示在搜索、推荐、频道等商品导购场景。
          </p>
          <p>可上传多个营销图片，生成草稿时随机选择一个作为营销图片。</p>
        </template>
      </gj-popover>
      <gj-button type="text">要求</gj-button>
    </div>

    <div class="image-demand">
      <gj-alert :show-icon="false"
        ><SvgIcon svgClass="vector02" :width="13"></SvgIcon>注：1.
        图片格式只能为JPG、JPEG、PNG，且大小不超过1MB；2.
        图片宽高比例必须为1:1,像素不能低于330*330（建议1000*1000）; 3.
        上传图片的背景要求必须为纯白色或透明; 4.
        不允许出现logo水印、边框以及促销牛皮癣等信息.</gj-alert
      >
    </div>

    <div class="image-list">
      <draggable
        tag="div"
        item-key="hashCodes"
        handle=".drag-handle"
        :list="saleImages.images"
        group="marketingPicture"
        animation="300"
        class="draft-item-drag"
        :move="saleImageMove"
      >
        <template #item="{ element: item, index }">
          <div class="drag-image-wrap">
            <template v-if="index < saleImages.images.length - 1">
              <gj-image
                width="120"
                height="120"
                :key="index"
                class="border8"
                :src="item.resource"
              ></gj-image>
              <div class="actions-wrap">
                <span class="actions">
                  <span class="action drag-handle">
                    <SvgIcon svgClass="drag" :width="16" />
                  </span>
                  <span class="action preview-handle">
                    <SvgIcon
                      svgClass="Showz"
                      :width="16"
                      @click="openImgView(item.resource)"
                    />
                  </span>
                  <span
                    class="action delete-handle"
                    @click="deleteMarkImage(index)"
                  >
                    <SvgIcon svgClass="close" :width="16" />
                  </span>
                </span>
              </div>
            </template>
            <div
              class="image-box"
              v-if="index === saleImages.images.length - 1"
            >
              <gj-button shape="round" @click="openModal">图片库</gj-button>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
  <!-- 素材中心 -->
  <picture-list
    v-if="dialogVisiable"
    :visible="dialogVisiable"
    :sku="saleImages.dialogSku"
    :skutype="saleImages.dialogSkuType"
    :minWidth="330"
    :minHeight="330"
    :maxWidth="5000"
    :maxHeight="5000"
    :imgExceeding="1"
    :isLimitRatio="true"
    @close="cancel"
    @confirm="confirm"
  ></picture-list>
  <gj-image-preview :src="previewImgSrc" v-model:visible="previewVisible" />
</template>
<script>
import { reactive, toRefs, defineComponent } from "vue";
import Draggable from "vuedraggable";
import { GjMessage } from "@gj/atom";
import { useStore } from "vuex";
import { M_T } from "@/store/mutationsTypes";
import SvgIcon from "@/components/SvgIcon";
import pictureList from "@pagesSystem/published/materialCenter/modal/picture.vue";
export default defineComponent({
  components: {
    Draggable,
    SvgIcon,
    pictureList,
  },
  props: {
    pageType: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const store = useStore();
    const key = "saleImages";
    const saleImageLastItem = {
      itemType: "upload-btn",
      hashCodes: Symbol("abcd"),
    };
    const data = reactive({
      [key]: {
        images: [saleImageLastItem],
        dialogSku: "",
        dialogSkuType: "",
      },
      dialogVisiable: false,
      previewImgSrc: "",
      previewVisible: false,
    });

    const saveDataStore = () => {
      const params = {
        [key]: data[key],
      };
      store.dispatch(M_T.PARAMS_QUERY, params);
    };

    const setPageData = (respData) => {
      data[key].images = [];
      const list = respData?.productImages.filter(
        (item) => item.businessType === 0
      );
      if (props.pageType && list.length > 0) {
        data[key].images[0] = list[0];
      } else if (!props.pageType) {
        data[key].images = list || [];
      }
      data[key].images.push(saleImageLastItem);
      saveDataStore();
    };

    const openModal = () => {
      const sku = store.getters.getParams?.productInfo.sku;
      const spu = store.getters.getParams?.productInfo.spu;
      const specsType = store.getters.getParams?.productInfo.specsType;
      if (sku || spu) {
        if (specsType === 2) {
          // 变体
          data[key].dialogSku = spu;
          data[key].dialogSkuType = "spu";
        } else {
          data[key].dialogSku = sku;
          data[key].dialogSkuType = "sku";
        }
        data.dialogVisiable = true;
      } else {
        GjMessage.warning("请先选择关联sku或spu");
      }
    };

    const cancel = () => {
      data.dialogVisiable = false;
    };
    const confirm = (list) => {
      data.dialogVisiable = false;
      const temp =
        list?.map((item) => ({ ...item, resource: item.originalUrl })) || [];
      if (temp.length <= 0) {
        return;
      }
      const lastItem = data[key].images.splice(data[key].images.length - 1, 1);
      if (props.pageType) {
        data[key].images = [temp[0]];
      } else if (!props.pageType) {
        data[key].images = data[key].images.concat(temp);
      }
      data[key].images.push(lastItem[0]);

      saveDataStore();
    };

    const deleteMarkImage = (index) => {
      data[key].images.splice(index, 1);
      saveDataStore();
    };

    const openImgView = (src) => {
      data.previewImgSrc = src;
      data.previewVisible = true;
    };

    const saleImageMove = (e) => {
      if (
        e.relatedContext.element.itemType &&
        e.relatedContext.element.itemType === "upload-btn"
      ) {
        return false;
      }
      //不允许拖拽
      if (
        e.draggedContext.element.itemType &&
        e.draggedContext.element.itemType === "upload-btn"
      ) {
        return false;
      }
      return true;
    };

    return {
      ...toRefs(data),
      saveDataStore,
      setPageData,
      openModal,
      cancel,
      confirm,
      deleteMarkImage,
      openImgView,
      saleImageMove,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
.image-tips {
  font-size: 12px;
  .vector02 {
    vertical-align: middle;
    position: relative;
    top: -2px;
  }
  span {
    color: #808197;
  }
}
.image-demand {
  margin-bottom: 16px;
}
.image-list {
  max-height: 254px;
  overflow: hidden;
  overflow-y: scroll;

  .draft-item-drag {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .drag-image-wrap {
    position: relative;
    .drag-image {
      // border-radius: 8px;
    }
    &:hover {
      .actions-wrap {
        display: block;
      }
      .arco-image {
        &:not(.arco-image-loading-error) {
          // border: 1px solid rgba(0, 69, 240, 0.8);
        }
      }
    }
    .actions-wrap {
      position: absolute;
      display: none;
      width: 120px;
      height: 120px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 4, 48, 0.3);
      z-index: 100;
      border-radius: 6px;
    }
  }

  .actions {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    text-align: center;
    display: flex;
    justify-content: center;
    .action {
      // padding: 0px 4px;
      // font-size: 14px;
      height: 20px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;
      background: #d9e3fd;
      color: #666883;
      border-radius: 20px;
      &:not(:first-child) {
        margin-left: 12px;
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
}
</style>
