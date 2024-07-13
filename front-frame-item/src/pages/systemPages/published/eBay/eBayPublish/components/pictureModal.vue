<template>
  <fullScreenDialog :dialogVisible="Visible">
    <template #title>
      <div class="dialog-title">
        <span>{{ openModelName == "sp" ? "视频库" : "图片库" }}</span>
        <gj-button @click="cancel" type="outline" shape="round">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <modalPicture
        v-if="openModelName == 'tp'"
        @confirm="getConfirmList"
      ></modalPicture>
      <modalVideo v-if="openModelName == 'sp'"></modalVideo>
    </template>
  </fullScreenDialog>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import fullScreenDialog from "@/pages/systemPages/published/components/fullScreenDialog.vue";
import modalPicture from "@/pages/systemPages/published/materialCenter/modal/picture.vue";
import modalVideo from "@/pages/systemPages/published/materialCenter/modal/video.vue";
export default defineComponent({
  name: "",
  components: {
    modalPicture,
    fullScreenDialog,
    modalVideo,
  },
  props: {
    Visible: {
      type: Boolean,
      default: false,
    },
    // 标题
    openModelName: {
      type: String,
      default: () => {
        return "图片库";
      },
    },
  },
  emits: ["cancel"],
  setup(props, { emit }) {
    const data = reactive({});
    const cancel = () => {
      emit("cancel", false);
    };
    const getConfirmList = () => {};
    return {
      ...toRefs(data),
      cancel,
      getConfirmList,
    };
  },
});
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
</style>
