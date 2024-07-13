<template>
  <div class="content-view">
    <gj-tabs
      v-model="activeName"
      @tab-click="handleClick"
      :destroy-on-hide="true"
    >
      <gj-tab-pane key="onLine" title="在线"> </gj-tab-pane>
      <gj-tab-pane key="removedFromTheShel" title="已下架"> </gj-tab-pane>
    </gj-tabs>
    <div class="tabContent">
      <onLineContent
        ref="onLineRef"
        v-if="activeName == 'onLine'"
      ></onLineContent>
      <removedFromTheShelfContent
        v-if="activeName == 'removedFromTheShel'"
        ref="removedFromTheShelfRef"
      ></removedFromTheShelfContent>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import onLineContent from "./onLineContent.vue";
import removedFromTheShelfContent from "./removedFromTheShelfContent.vue";

export default defineComponent({
  name: "componentBoard",
  components: { onLineContent, removedFromTheShelfContent },
  setup() {
    const datas = reactive({
      activeName: "onLine",
      onHide: true,
    });
    const handleClick = (val) => {
      datas.activeName = val;
    };
    return {
      ...toRefs(datas),
      handleClick,
    };
  },
});
</script>

<style scoped lang="scss">
.content-view {
  height: calc(100vh - 41px);
  :deep(.arco-tabs-nav::before) {
    height: 1px;
  }
  :deep(.arco-tabs) {
    .arco-tabs-content {
      padding-top: 0px;
    }
  }

  .tabContent {
    height: 100%;
  }
}
</style>
