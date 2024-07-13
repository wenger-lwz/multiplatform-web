<!-- 图片设置 -->
<template>
  <div class="image">
    <div class="type mb16">
      <SvgIcon svgClass="imgIcon" :width="18" style="margin-right: 8px" />
      <span>图片</span>
    </div>
    <div class="subTitle">
      <span class="tips">上传图片</span>
    </div>

    <gj-button size="small" type="primary" @click="open">素材中心</gj-button>

    <div class="list" style="padding: 12px 0; margin-right: 12px">
      <draggable :list="data.imageList">
        <template #item="{ element, index }">
          <div class="item mb16">
            <SvgIcon
              svgClass="drag"
              :width="12"
              style="margin-top: 1px; margin-right: 8px"
            />
            <SvgIcon
              svgClass="imgIcon"
              :width="14"
              style="margin-top: 1px; margin-right: 8px"
            />
            <span class="imgName">{{ element.name }}</span>
            <span class="num">
              <SvgIcon
                svgClass="linkIcon"
                :width="14"
                style="margin-left: 8px"
              />
              <SvgIcon
                svgClass="closeIcon"
                :width="18"
                style="margin-left: 8px"
                @click="delectImg(index)"
              />
            </span>
          </div>
        </template>
      </draggable>
    </div>

    <div class="check">
      <gj-checkbox v-model="data.clearGap">去除图片间隙 </gj-checkbox>
    </div>
    <picture-list
      v-model:visible="visible"
      :sku="pictureInfo.sku"
      :skutype="pictureInfo.skutype"
      @close="cancel"
      @confirm="confirmPic"
    ></picture-list>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, watch, inject } from "vue";
import SvgIcon from "@/components/SvgIcon";
import draggable from "vuedraggable";
import pictureList from "@/pages/systemPages/published/materialCenter/modal/picture.vue";

import { GjMessage } from "@gj/atom";
export default defineComponent({
  components: {
    SvgIcon,
    draggable,
    pictureList,
  },
  name: "",
  props: {
    imageData: {
      type: Object,
      default: () => {},
    },
    specsType: {
      type: Number,
      default: () => {
        return 1;
      },
    },
    spu: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props, { emit }) {
    const uploadInfo = inject("uploadspu");
    const data = reactive({
      visible: false,
      pictureInfo: {
        sku: "",
        skutype: "",
      },
      data: props.imageData,
      link: "",
      dragging: "",
      myArray: [
        { id: 10, name: "www.itxst.com" },
        { id: 20, name: "www.baidu.com" },
        { id: 30, name: "www.taobao.com" },
        { id: 40, name: "www.yahoo.com" },
      ],
      spu: props.spu,
      specsType: props.specsType,
    });

    const delectImg = (index) => {
      emit("delectImg", index);
    };

    const enter = () => {
      console.log(data.link);
    };

    const open = () => {
      console.log(uploadInfo);
      if (data.spu) {
        data.pictureInfo.sku = data.spu;
        data.pictureInfo.skutype = data.specsType;

        data.visible = true;
      } else {
        GjMessage.error("请先选择关联sku或spu");
      }
    };

    const cancel = () => {
      data.visible = false;
    };

    const confirmPic = (val) => {
      data.visible = false;
      val.forEach((item) => {
        data.data.imageList.push({
          url: item.originalUrl,
          name: item.name,
        });
      });
    };

    watch(
      () => props.imageData,
      (newvalue) => {
        data.data = newvalue;
      }
    );

    watch(
      () => props.spu,
      (newValue) => {
        data.spu = newValue;
      }
    );

    watch(
      () => props.specsType,
      (newValue) => {
        data.specsType = newValue;
      }
    );
    return {
      delectImg,
      enter,
      ...toRefs(data),
      open,
      cancel,
      confirmPic,
    };
  },
});
</script>
<style scoped lang="scss">
@import "../template.scss";
.imgName {
  display: inline-block;
  width: 150px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upload {
  width: 272px;
  min-height: 72px;
  background: #fafafb;
  border: 1px solid #e6e6ed;
  padding-bottom: 14px;
  padding-right: 12px;
  box-sizing: border-box;
  .top {
    display: flex;
    min-height: 16px;
    align-items: center;
    margin-left: 24px;
    margin-top: 28px;
    margin-bottom: 13px;
    span {
      flex: 1;
    }
  }
}
</style>
