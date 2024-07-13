<template>
  <div class="session-list">
    <div class="session-list-top">
      <gj-input-search placeholder="Please enter something" />
      <gj-radio-group v-model="tabsValue" type="button">
        <gj-radio value="all">全部</gj-radio>
        <gj-radio value="secon1d">未回复</gj-radio>
        <gj-radio value="seco2nd">即将超时</gj-radio>
        <gj-radio value="se3cond">客服转交</gj-radio>
      </gj-radio-group>
    </div>
    <gj-divider />
    <div class="session-list-content">
      <SessionListItem v-for="item of 20" :key="item"></SessionListItem>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import SessionListItem from "./sessionListItem.vue";

export default {
  components: {
    SessionListItem,
  },
  setup() {
    const data = reactive({
      tabsValue: "all",
    });

    return {
      ...toRefs(data),
    };
  },
};
</script>

<style scoped lang="scss">
.session-list {
  width: 300px;
  min-width: 250px;
  height: 100%;
  overflow: hidden;
  background: #fff;
  .session-list-top {
    padding: 8px 12px;
    .arco-input-search {
      margin-bottom: 8px;
    }
  }
  .session-list-content {
    height: calc(100% - 89px);
    overflow-y: auto;
  }
}
</style>
