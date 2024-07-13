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
      <gj-popover
        title=""
        :content-style="{ color: '#808197', backgroundColor: '#E6ECFE' }"
        position="tl"
        trigger="click"
        :arrow-style="{ backgroundColor: '#E6ECFE' }"
      >
        <gj-button type="text">要求</gj-button>
        <template #content>
          <SvgIcon svgClass="vector02" :width="13"></SvgIcon>
          要求1:1白底图，上传符合规范的营销图将有机会展示在搜索、推荐、频道等商品导购场景。可上传多个营销图片，生成草稿时随机选择一个作为营销图片。
        </template>
      </gj-popover>
    </div>
    <div class="image-list">
      <div v-for="(item, index) in saleImages.images" :key="index">
        <div class="drag-image-wrap">
          <gj-image
            width="120"
            height="120"
            :key="index"
            class="border8"
            :src="item.resource"
          ></gj-image>
          <div class="actions-wrap">
            <span class="actions">
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
        </div>
      </div>
      <div class="image-box">
        <gj-button shape="round" @click="openModal">图片库</gj-button>
      </div>
    </div>
  </div>
  <!-- 素材中心 -->
  <picture-list
    v-if="dialogVisiable"
    :visible="dialogVisiable"
    :sku="saleImages.dialogSku"
    :skutype="saleImages.dialogSkuType"
    @close="cancel"
    @confirm="confirm"
  ></picture-list>
  <gj-image-preview :src="previewImgSrc" v-model:visible="previewVisible" />
</template>
<script>
import { reactive, toRefs, defineComponent } from "vue";
import { GjMessage } from "@gj/atom";
import { useStore } from "vuex";
import { M_T } from "@/store/mutationsTypes";
import SvgIcon from "@/components/SvgIcon";
import pictureList from "@pagesSystem/published/materialCenter/modal/picture.vue";
export default defineComponent({
  components: {
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
    const data = reactive({
      [key]: {
        images: [],
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
        GjMessage.error("请先选择关联sku或spu");
      }
    };

    const cancel = () => {
      data.dialogVisiable = false;
    };
    const confirm = (list) => {
      const temp =
        list?.map((item) => ({ ...item, resource: item.originalUrl })) || [];
      if (props.pageType && temp.length > 0) {
        data[key].images[0] = temp[0];
      } else if (!props.pageType) {
        data[key].images = data[key].images.concat(temp);
      }
      data.dialogVisiable = false;
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

    return {
      ...toRefs(data),
      saveDataStore,
      setPageData,
      openModal,
      cancel,
      confirm,
      deleteMarkImage,
      openImgView,
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
.image-list {
  max-height: 254px;
  overflow: hidden;
  overflow-y: scroll;
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
