<template>
  <div class="authorPlantFrom">
    <input :value="anauthorUrl" class="hidden" id="copyInput" />
    <div class="logo"></div>

    <div class="authorizationTip">
      <!--本地授权-->
      <div class="authorizationSuccess" v-if="authorizationMethod === 1">
        <div class="text">店铺授权-{{ platformName }}</div>
        <gj-progress
          v-if="isMove === 1 && authorizationMethod === 1 && authorStatus < 0"
          class="content"
          :percent="percentage"
        ></gj-progress>
        <div
          class="content"
          v-if="authorizationMethod === 1 && authorStatus >= 0"
        >
          <SvgIcon
            svgClass="successIcon"
            :width="18"
            v-if="authorStatus === 1"
          ></SvgIcon>
          <SvgIcon
            svgClass="warningIcon"
            :width="18"
            v-else-if="authorStatus === 0"
          ></SvgIcon>
          <span class="tipTxt">
            {{ authorStatus === 1 ? "授权成功" : "授权失败" }}
          </span>
        </div>
      </div>

      <!--异地授权-->
      <div class="authorizationtext" v-if="authorizationMethod === 0">
        <div class="text">店铺授权-{{ platformName }}</div>
        <div class="txt">{{ anauthorUrl }}</div>
        <div class="copyLink">
          <gj-button @click="copyLink" type="primary" shape="round"
            >点击复制CODE</gj-button
          >
        </div>
      </div>

      <div class="bgImg"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs, reactive, onMounted } from "vue";
import { authorToken } from "@/api/infrastructure";
import SvgIcon from "@/components/SvgIcon.vue";
import { GjMessage } from "@gj/atom";

export default defineComponent({
  components: { SvgIcon },
  props: {
    id: {
      type: String,
      default: () => {
        return "";
      },
    },
    platformName: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props) {
    const paramsData = props;

    let query = sessionStorage.getItem("authorSessionJSon")
      ? JSON.parse(sessionStorage.getItem("authorSessionJSon"))
      : {};
    if (props.id === "ALIEXPRESS") {
      query = localStorage.getItem("authorSessionJSon")
        ? JSON.parse(localStorage.getItem("authorSessionJSon"))
        : {};
    }
    console.log(window.top.location, "window.top.location");

    const getQueryPrams = () => {
      // 此处用 window.top.location（ifarme嵌套多层获取地址的方法） 获取顶层地址
      let search = window.top.location.search;
      if (!search) {
        return {};
      } else {
        search = search.split("?")[1];
        const temp = search.split("&");
        const result = {};
        temp.forEach((item) => {
          const keyValue = item.split("=");
          result[keyValue[0]] = keyValue[1];
        });
        return result;
      }
    };

    let urlQuery = getQueryPrams();
    console.log(urlQuery, "urlQuery");
    const otherParams = urlQuery;
    const paramsContent = {};

    if (urlQuery?.state?.split("_")[1] === "0" && !query.authorizationMethod) {
      // 异地授权
      paramsContent.platformCode = paramsData.id; // 注意
      paramsContent.shopId = urlQuery.state.split("_")[0];
      paramsContent.authorizationMethod = urlQuery.state.split("_")[1];
    } else {
      // 本地授权
      paramsContent.platformCode = paramsData.id;
      paramsContent.shopId = query.shopId;
      paramsContent.authorizationMethod = query.authorizationMethod;
    }

    const data = reactive({
      platformCode: paramsContent.platformCode,
      shopId: paramsContent.shopId,
      // authorizationMethod: props.id === 'ALIEXPRESS' ? 1 : parseInt(paramsContent.authorizationMethod),
      authorizationMethod: parseInt(paramsContent.authorizationMethod),
      percentage: 0,
      // 状态控制
      authorStatus: -1, // 0授权失败 1授权成功
      isMove: -1,
      anauthorUrl: window.top.location.search.split("?")[1], // 异地授权后的code
    });

    onMounted(() => {
      data.isMove = 1;
      let i = 0;
      let timer = setInterval(() => {
        i++;
        data.percentage = Number((i * 0.01).toFixed(2));
        if (data.percentage >= 0.99) {
          clearInterval(timer);
          timer = null;
          data.isMove = -1;
        }
      }, 22);

      if (!query.platformCode || data.authorizationMethod === 0) {
        return;
      }

      let timerOut = setTimeout(() => {
        // 解码code
        if (paramsData.id === "EBAY") {
          otherParams.code = decodeURIComponent(otherParams.code);
        }
        console.log(otherParams, "参数");
        authorToken({
          platform: data.platformCode.toLocaleUpperCase(),
          otherParams: {
            ...query,
            ...otherParams,
          },
        })
          .then((rsp) => {
            console.log("回调", rsp);
            if (rsp.code === 0 || rsp.code === "0") {
              // 本地授权成功
              data.authorStatus = 1;
              // 清除本地缓存
              sessionStorage.removeItem("authorSessionJSon");
              localStorage.removeItem("authorSessionJSon");
            } else {
              // 本地授权失败
              data.authorStatus = 0;
              sessionStorage.removeItem("authorSessionJSon");
              localStorage.removeItem("authorSessionJSon");
            }
          })
          .catch(() => {
            // 本地授权失败
            data.authorStatus = 0;
            sessionStorage.removeItem("authorSessionJSon");
            localStorage.removeItem("authorSessionJSon");
          });
        clearTimeout(timerOut);
        timerOut = null;
      }, 1000);
    });

    const copyLink = () => {
      const dom = document.getElementById("copyInput");
      dom.select();
      /* eslint-disable-next-line */
      document.execCommand("Copy");
      GjMessage.success("复制成功");
    };

    return {
      ...toRefs(data),
      copyLink,
    };
  },
});
</script>

<style scoped lang="scss">
.authorPlantFrom {
  width: 100%;
  height: 100%;
  padding: 50px;
  display: flex;
  flex-flow: column;
  overflow-y: hidden;
  position: relative;
  box-sizing: border-box;

  .logo {
    width: 197px;
    height: 47px;
    background: url(../../../../assets/img/basicSettingCallbackCodeLogo.png)
      no-repeat top center;
  }

  .authorizationTip {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
    position: relative;

    .authorizationSuccess {
      position: relative;
      width: 520px;
      height: 174px;
      background: #f2f6fe;
      border-radius: 8px;
      .text {
        padding: 20px 0 40px 0;
        margin: 0 auto;
        text-align: center;
        font-weight: bold;
        font-size: 16px;
      }
      .content {
        width: 80%;
        margin-left: 50px;
        text-align: center;
        .tipTxt {
          font-size: 18px;
          font-weight: 700;
          color: #0045f0;
          margin-left: 16px;
        }
      }
      :deep(.arco-progress-line) {
        height: 12px !important;
      }
    }

    .bgImg {
      width: 480px;
      height: 400px;
      background: url(../../../../assets/img/basicSettingCallbackCodeBg.png)
        no-repeat top center;
      margin-top: 10px;
    }

    .authorizationtext {
      width: 520px;
      background: #f2f6fe;
      border-radius: 8px;
      right: 0;
      padding: 20px 0 24px 0;
      box-sizing: border-box;
      .text {
        margin: 0 auto;
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 16px;
      }
      .txt {
        height: 96px;
        color: #808197;
        padding: 0 26px;
        word-wrap: break-word;
        overflow: auto;
      }
      .copyLink {
        margin-top: 16px;
        width: 100%;
        text-align: center;
      }
    }
  }
}

.hidden {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
