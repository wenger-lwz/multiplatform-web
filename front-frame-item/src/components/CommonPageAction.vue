<template>
  <div class="common-pages-action">
    <!-- v-if="permissionsList[currentRouterPermission]" -->
    <slot></slot>
  </div>
  <!-- <noPermissionPage v-else></noPermissionPage> -->
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import store from "@/store";
// import noPermissionPage from "@/pages/noPermissionPage.vue";
export default defineComponent({
  name: "CommonPageAction",
  components: {
    // noPermissionPage,
  },
  props: {
    currentRouterPermission: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup() {
    const data = reactive({
      permissionsList: store.getters.getPermissions,
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="scss" scoped>
.common-pages-action {
  width: 100%;
  height: 100%;
}
</style>
