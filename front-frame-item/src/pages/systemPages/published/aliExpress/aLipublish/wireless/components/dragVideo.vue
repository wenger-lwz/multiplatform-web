<template>
  <div
    class="videoCon mb16"
    :class="{ activeClass: isActive, pd16: viewData.videoList.length > 0 }"
  >
    <div class="videoList" v-if="viewData.videoList.length > 0">
      <div
        v-for="(item, index) in viewData.videoList"
        :key="index"
        style="font-size: 0px"
      >
        <video
          style="width: 100%; margin-bottom: 8px"
          class="el-upload-list__item-thumbnail"
          :src="item.videoUrl"
          controls="controls"
        />
      </div>
    </div>
    <img
      src="../../../../../../static/images/wireless_bg2.jpg"
      style="width: 100%; height: 100%; border-radius: 6px"
      v-else
    />
    <div class="butGroup" v-if="isActive">
      <SvgIcon
        svgClass="copyIcon"
        :width="12"
        class="copy"
        @click.stop="copyTem"
      />
      <SvgIcon
        svgClass="closeIcon"
        :width="16"
        class="delete"
        @click.stop="deleteTem"
      />
    </div>

    <!-- <span class="tip">更换视频</span> -->
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from "vue";
import SvgIcon from "@/components/SvgIcon";

export default defineComponent({
  components: {
    SvgIcon,
  },
  name: "",
  props: {
    isActive: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    viewData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      viewData: props.viewData,
      isActive: props.isActive,
    });
    const copyTem = () => {
      emit("copyTem");
    };
    const deleteTem = () => {
      emit("deleteTem");
    };

    watch(
      () => props.isActive,
      (newValue) => {
        data.isActive = newValue;
      }
    );

    watch(
      () => props.viewData,
      (newValue) => {
        data.viewData = newValue;
      }
    );

    return {
      ...toRefs(data),
      copyTem,
      deleteTem,
    };
  },
});
</script>
<style scoped lang="scss">
.videoCon {
  position: relative;
  background: #f2f2f5;
  min-height: 238px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #e6e6ed;
  text-align: center;
  font-size: 0;
  .butGroup {
    position: absolute;
    right: 4px;
    top: 8px;
    .copy,
    .delete {
      cursor: pointer;
      margin-left: 12px;
      vertical-align: middle;
    }
  }
  .tip {
    margin-top: 88px;
    display: inline-block;
    font-size: 12px;
    padding: 7px 12px;
    color: #0045f0;
    background: rgba(0, 69, 240, 0.05);
  }
}
.activeClass {
  background: #e6ecfe;
}
.mb8 {
  margin-bottom: 8px;
}
.pd16 {
  padding: 16px;
}
</style>
