<template>
  <div class="customerService-page">
    <SearchClass ref="searchClassRef"></SearchClass>
    <SessionList ref="sessionListRef"></SessionList>
    <div class="session-content"></div>
  </div>
</template>

<script>
import { ref, reactive, toRefs } from "vue";
import SearchClass from "./searchClass.vue";
import SessionList from "./sessionList.vue";

export default {
  name: "eBeyCustomerService",
  components: {
    SearchClass,
    SessionList,
  },
  setup() {
    const searchClassRef = ref(null);
    const sessionListRef = ref(null);

    const data = reactive({});

    return {
      searchClassRef,
      sessionListRef,
      ...toRefs(data),
    };
  },
};
</script>

<style scoped lang="scss">
::v-deep .arco-divider-horizontal.arco-divider-with-text {
  margin: 0;
  border-bottom-color: #e6e6ed;
}
.customerService-page {
  display: flex;
  height: 100vh;
  background: #f3f6f7;

  // .search-class {
  // }
  // .session-list {
  // }
  .session-content {
    flex: 1;
    min-width: 666px;
    margin: 12px;
    background: #fff;
    border-radius: 4px;
  }
}
</style>
