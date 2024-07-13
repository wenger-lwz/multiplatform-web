<template>
  <h1>多平台首页</h1>
  <router-link to="/about">about</router-link>
  <h2>国际化</h2>
  <gj-button type="primary" @click="changeI18n('zh')">切换中文</gj-button>
  <gj-button type="outline" @click="changeI18n('en')">切换英文</gj-button>
  <h4>字节组件</h4>
  <gj-pagination :total="50" show-total show-jumper show-page-size />
  <h4>本地组件</h4>
  <div>国际化：{{ $t(`materialCenter`) }}</div>
  <div class="svgList">
    <div class="title">Svg图标集：</div>
    <gj-tooltip
      v-for="item in svgFileList"
      :key="item"
      background-color="#722ED1"
      :content="item"
      position="top"
    >
      <SvgIcon :svgClass="item" :width="30" :title="item"> 123 </SvgIcon>
    </gj-tooltip>
  </div>

  <div>
    <button @click="sendParentMessage">
      通知基座打开一个详情页面的路由,模拟
    </button>
  </div>

  <SearchContent @search="search" @seniorSearch="seniorSearch">
    <template #search>
      <input placeholder="请输入XXXX" />
      <input placeholder="请输入XXXX" />
      <input placeholder="请输入XXXX" />
      <select>
        <option>大魔王</option>
        <option>大魔王</option>
        <option>大魔王</option>
      </select>
    </template>
    <template #seniorSearch>
      <input placeholder="我是高级搜索" />
    </template>
  </SearchContent>
</template>

<script>
import {
  defineComponent,
  onMounted,
  getCurrentInstance,
  reactive,
  toRefs,
} from "vue";
import { useI18n } from "vue-i18n"; //要在js中使用国际化
import SvgIcon from "@/components/SvgIcon";
import SearchContent from "@/components/SearchContent";

export default defineComponent({
  name: "Home",
  components: {
    SvgIcon,
    SearchContent,
  },
  setup() {
    const data = reactive({
      svgFileList: [],
    });

    const { proxy } = getCurrentInstance();
    function changeI18n(type) {
      proxy.$i18n.locale = type;
      // console.log(proxy.$i18n.locale)
    }
    const { t } = useI18n();
    console.log("国际化js", t("materialCenter"));
    const getSvgFileList = () => {
      const files = require.context("@/svg/", false, /.svg$/).keys();
      data.svgFileList = files.map((key) =>
        key.replace(/\.\//, "").replace(/\.svg$/, "")
      );
    };

    const search = () => {
      console.log("点击了搜索");
    };

    const seniorSearch = () => {
      console.log("点击了高级搜索");
    };

    // 模拟打开详情页 向基座发送信息
    const sendParentMessage = () => {
      window.parent.postMessage(
        {
          type: "addTabRoute",
          url: "/multiplatform-web/eBayAllOrderDetail", // '平台前缀 ' + '/路由',
          queryParams: {
            // name: '张麻子',
            // age: 20,
          },
        },
        "*"
      );
    };

    onMounted(() => {
      getSvgFileList();
    });

    return {
      changeI18n,
      ...toRefs(data),
      sendParentMessage,
      search,
      seniorSearch,
    };
  },
});
</script>

<style scoped lang="scss">
.svgList {
  margin-top: 25px;
  margin-bottom: 25px;
  .title {
    width: 100%;
    height: 26px;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #000430;
  }
  svg {
    margin: 6px;
  }
}
</style>
