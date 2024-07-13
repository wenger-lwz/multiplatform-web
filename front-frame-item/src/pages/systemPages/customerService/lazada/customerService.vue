<template>
  <div class="customerService-page">
    <SearchClass ref="searchClassRef"></SearchClass>
    <SessionList ref="sessionListRef"></SessionList>
    <!-- <SessionContent
      v-if="sessionListRef?.selectedValue"
      ref="sessionContentRef"
    ></SessionContent> -->
  </div>
</template>

<script>
import { ref, reactive, toRefs, provide } from "vue";
import SearchClass from "./searchClass.vue";
import SessionList from "./sessionList.vue";
// import SessionContent from "./sessionContent.vue";

export default {
  name: "lazadaCustomerService",
  components: {
    SearchClass,
    SessionList,
    // SessionContent,
  },
  setup() {
    const searchClassRef = ref(null);
    const sessionListRef = ref(null);
    const sessionContentRef = ref(null);

    provide("searchClassRef", () => searchClassRef.value);
    provide("sessionListRef", () => sessionListRef.value);
    // provide("sessionContentRef", () => sessionContentRef.value);

    const data = reactive({});

    return {
      searchClassRef,
      sessionListRef,
      sessionContentRef,
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
::v-deep .referralSession-modal .arco-modal-body {
  padding: 20px 0 0 0;
}
.customerService-page {
  display: flex;
  height: 100vh;
  background: #f3f6f7;
  // overflow: hidden;

  // .search-class {
  // }
  // .session-list {
  // }
  // .session-content {
  // }
}
</style>
