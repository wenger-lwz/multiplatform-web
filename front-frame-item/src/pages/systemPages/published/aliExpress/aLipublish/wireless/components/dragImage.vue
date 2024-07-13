<template>
  <div
    class="imageCon mb16"
    :class="{ activeClass: isActive, pd16: viewData.imageList.length > 0 }"
  >
    <div class="imageList" v-if="viewData.imageList.length > 0">
      <div
        v-for="(item, index) in viewData.imageList"
        :key="index"
        style="font-size: 0px"
        :class="{ mb8: !viewData.clearGap }"
      >
        <img :src="item.url" alt="" style="width: 100%" />
      </div>
    </div>
    <img
      src="../../../../../../static/images/wireless_bg1.jpg"
      style="width: 100%; height: 100%; border-radius: 6px"
      v-else
    />
    <div class="butGroup" v-if="isActive">
      <SvgIcon
        svgClass="copyIcon"
        :width="12"
        class="copy"
        @click.stop="copyTem"
        style="vertical-align: middle"
      />
      <SvgIcon
        svgClass="closeIcon"
        :width="20"
        class="delete"
        @click.stop="deleteTem"
        style="vertical-align: middle"
      />
    </div>
    <!-- <span class="tip" v-if="viewData.imageList.length === 0">更换样品图</span> -->
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
.imageCon {
  position: relative;
  min-height: 238px;
  box-sizing: border-box;
  text-align: center;
  border-radius: 6px;
  border: 1px solid #e6e6ed;
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
