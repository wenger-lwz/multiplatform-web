<template>
  <div class="authorizationManage">
    <iframe
      frameborder="0"
      :src="pathUrl + '?token=' + token + '&language=' + language"
      class="auth-content"
    >
    </iframe>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import store from "@/store";

export default defineComponent({
  name: "AuthorizationManage",
  setup() {
    const data = reactive({
      token: "",
      language: "zh",
      pathUrl:
        process.env.NODE_ENV === "production"
          ? "//platauthor.app.gerpgo.com"
          : "//platauthor.gerpgo.com",
    });
    data.token = store.getters?.getUserInfo?.token;
    data.language = store.getters?.getUserInfo?.language || "zh";
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="scss" scoped>
.authorizationManage {
  width: 100%;
  height: 100%;
  .auth-content {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>
