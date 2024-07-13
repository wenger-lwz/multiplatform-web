<template>
  <div class="session-replyBox" :style="{ bottom: positionBottom }">
    <div class="session-replyBox-header">
      <div>
        <gj-upload :show-file-list="false" :custom-request="customRequest">
          <template #upload-button>
            <gj-tooltip content="图片">
              <SvgIcon svgClass="conversationImgUp" :width="32" />
            </gj-tooltip>
          </template>
        </gj-upload>
        <gj-trigger
          :popup-visible="showTemplateList"
          trigger="click"
          position="right"
          :popup-translate="[10, 0]"
          :arrow-style="{ zIndex: 5 }"
          :show-arrow="true"
        >
          <div>
            <gj-tooltip content="常用短语">
              <SvgIcon
                style="margin-left: 8px"
                svgClass="quickReply"
                :width="32"
                @click="showTemplateList = !showTemplateList"
              />
            </gj-tooltip>
          </div>
          <template #content>
            <div class="useful-expressionsw">
              <div class="useful-expressionsw-title">常用短语</div>
              <div class="useful-expressionsw-list">
                <div class="phrase-list-item phrase-list-th">
                  <div>常用语名称/主题</div>
                  <div>常用语</div>
                </div>
                <div class="phrase-list-container">
                  <div
                    class="phrase-list-item"
                    v-for="item of templateList"
                    :key="item.id"
                    @click="showTemplateList = false"
                  >
                    <div class="fontNoWrap-1">{{ item.name }}</div>
                    <div class="fontNoWrap-1">
                      {{ item.content }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </gj-trigger>
      </div>
      <div>
        <SvgIcon svgClass="customerServiceClosed" :width="20" @click="close" />
      </div>
    </div>
    <div class="session-replyBox-container">
      <div style="border-bottom: 1px dashed #e6e6ed">
        <p v-if="type === 'reply'" class="session-theme-input">
          {{ replyNews?.messageSubject }}
        </p>
        <input
          v-else
          type="text"
          v-model="themeInput"
          class="session-theme-input"
          placeholder="请输入主题"
        />
      </div>
      <textarea
        v-model="mailContent"
        class="session-container-input"
        placeholder="请输入邮件内容..."
      />
      <div class="session-imgList">
        <div
          class="imgList-img-container"
          v-for="(img, index) of imgList"
          :key="img.uid"
        >
          <gj-image width="36" height="36" :preview="false" :src="img.url" />
          <div class="imgList-img_hover">
            <div @click="imgList.splice(index, 1)">
              <SvgIcon svgClass="closeLine" :width="20" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="session-replyBox-footer">
      <p>
        <gj-checkbox v-model="emailCopyToSender" value="1"
          >传送副本到我的私人邮箱</gj-checkbox
        >
      </p>
      <p>
        <gj-checkbox v-model="displayToPublic" value="2"
          >在刊登商品的「常见问题」部分加入这个问题与答复，让所有买家都能看到。一旦发布无法修改</gj-checkbox
        >
      </p>
      <div class="sendOut-btn">
        <gj-button
          :loading="loading === 'sendOut'"
          type="primary"
          @click="sendOut"
          >发送</gj-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, inject } from "vue";
import {
  getReplyTemplate,
  uploadMessageImg,
  replyMessage,
  addMemberMessageAAQToPartner,
} from "@/api/customerService/eBay-zh";
import SvgIcon from "@/components/SvgIcon";
import { GjMessage } from "@gj/atom";

export default {
  components: {
    SvgIcon,
  },
  props: {
    type: {
      type: String,
      default: "reply",
    },
    replyNews: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const getSessionContentRef = inject("sessionContentRef");

    const data = reactive({
      loading: false,
      positionBottom: "-100%",
      themeInput: "",
      mailContent: "",
      imgList: [],
      templateList: [],
      emailCopyToSender: false,
      displayToPublic: false,
      showTemplateList: false,
    });

    const getTemplateList = () => {
      getReplyTemplate({
        pageCurrent: 0,
        pageSize: 20,
      }).then((res) => {
        data.templateList = res.data.records;
      });
    };
    getTemplateList();

    const close = () => {
      data.positionBottom = "-100%";
    };

    // 图片上传
    const customRequest = (file) => {
      console.log(file.fileItem);
      uploadMessageImg({
        files: file.fileItem.file,
        fileName: file.fileItem.file.name,
        // shopId: getSessionContentRef().selectedValue.erpShopId,
        shopId: "1526818491078324225",
      }).then((res) => {
        data.imgList.push({
          ...file.fileItem,
          resData: res.data,
        });
      });
    };

    // 回复发送消息
    const sendOut = () => {
      if (props.type === "sendOut" && data.themeInput === "") {
        return GjMessage.error("主题不能为空！");
      }
      if (data.mailContent === "") {
        return GjMessage.error("邮件内容不能为空！");
      }
      if (data.loading === "sendOut") return false;
      data.loading = "sendOut";
      let selectedValue = getSessionContentRef().selectedValue;
      // 判断是回复消息 还是主动发送消息
      if (props.type === "reply") {
        replyMessage({
          emailCopyToSender: data.emailCopyToSender,
          displayToPublic: data.displayToPublic,
          subject: props.replyNews.messageSubject,
          body: data.mailContent,
          erpShopId: selectedValue.erpShopId,
          parentMessageID: props.replyNews.id,
          itemId: selectedValue.itemId,
          messageMedia: data.imgList.map((item) => item.resData),
        })
          .then(() => {
            data.loading = false;
            getSessionContentRef().reset();
            close();
          })
          .catch(() => {
            data.loading = false;
          });
      } else {
        activeSendOut(selectedValue);
      }
    };

    // 向买家主动发送消息
    const activeSendOut = (selectedValue) => {
      addMemberMessageAAQToPartner({
        emailCopyToSender: data.emailCopyToSender,
        displayToPublic: data.displayToPublic,
        erpShopId: selectedValue.erpShopId,
        itemId: selectedValue.itemId,
        subject: data.themeInput,
        body: data.mailContent,
        messageMedia: data.imgList.map((item) => item.resData),
        buyerName: selectedValue.sessionName,
      })
        .then(() => {
          data.loading = false;
          getSessionContentRef().reset();
          close();
        })
        .catch(() => {
          data.loading = false;
        });
    };

    return {
      ...toRefs(data),
      getTemplateList,
      close,
      customRequest,
      sendOut,
      activeSendOut,
    };
  },
};
</script>
<style lang="scss">
.useful-expressionsw {
  box-sizing: border-box;
  padding: 12px;
  width: 480px;
  background: #ffffff;
  border-radius: 4px;
  filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.12))
    drop-shadow(0px 6px 18px rgba(0, 0, 0, 0.08))
    drop-shadow(0px 9px 28px rgba(0, 0, 0, 0.06));
  .useful-expressionsw-title {
    margin-bottom: 4px;
    font-weight: 600;
    font-size: 12px;
    line-height: 18px;
  }
  .useful-expressionsw-list {
    border: 1px solid #dadde2;
    border-radius: 4px;
    .phrase-list-container {
      height: 286px;
      overflow: auto;
    }
    .phrase-list-item {
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 31px;
      font-family: "PingFang SC";
      font-size: 12px;
      line-height: 18px;
      color: rgba(0, 4, 48, 0.8);
      cursor: pointer;
      &:hover {
        background: #f2f3f5;
      }
      > div:first-child {
        box-sizing: border-box;
        width: 120px;
        min-width: 120px;
        padding-right: 8px;
      }
    }
    .phrase-list-th {
      height: 38px;
      font-weight: 600;
      line-height: 16px;
      border-bottom: 1px solid #dadde2;
      cursor: text;
      &:hover {
        background: #fff;
      }
    }
    .phrase-list-item + .phrase-list-item {
      border-top: 1px solid #dadde2;
    }
  }
}
</style>
<style scoped lang="scss">
.session-replyBox {
  position: absolute;
  z-index: 3;
  left: 0;
  bottom: 0;
  width: 100%;
  transition: all 0.3s;
  // height: 372px;
  background: #fff;
  .session-replyBox-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    border-top: 1px solid #e6e6ed;
    border-bottom: 1px solid #e6e6ed;
    > div:first-child {
      height: 32px;
      display: flex;
    }
    .svg-icon {
      outline: none;
      cursor: pointer;
      color: #4e5969;
      &:hover {
        background: #f2f3f5;
        border-radius: 4px;
      }
      &:active {
        color: #0045f0;
      }
    }
    // .svg-icon + .svg-icon {
    //   margin-left: 8px;
    // }
  }
  .session-replyBox-container {
    padding: 10px 16px;
    border-bottom: 1px solid #e6e6ed;
    .session-theme-input {
      width: 100%;
      margin-bottom: 10px;
      border: 0;
      outline: none;
      line-height: 28px;
      font-weight: 600;
      font-size: 16px;
      color: #86909c;
    }
    .session-container-input {
      display: block;
      width: 100%;
      height: 110px;
      overflow-y: auto;
      margin-top: 10px;
      border: 0;
      outline: none;
      resize: none;
    }
    .session-imgList {
      margin-top: 8px;
      height: 36px;

      .imgList-img_hover {
        position: absolute;
        left: 1px;
        top: 1px;
        display: none;
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        background: rgba(0, 4, 48, 0.3);
        border-radius: 4px;
        > div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #d9e3fd;
          color: #666883;
          overflow: hidden;
          &:hover {
            background: #ffe7e7;
            color: #ff5c5c;
          }
        }
      }

      .imgList-img-container + .imgList-img-container {
        margin-left: 4px;
      }
    }
  }
  .session-replyBox-footer {
    padding: 12px 16px;
    > p {
      margin-bottom: 12px;
      font-size: 12px;
      line-height: 18px;
      color: #1d2129;
    }
    .sendOut-btn {
      text-align: right;
    }
  }
}
::v-deep .imgList-img-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  .arco-image-img {
    box-sizing: border-box;
    border: 1px solid rgba(0, 4, 48, 0.05);
  }
  &:hover {
    .imgList-img_hover {
      display: flex !important;
      justify-content: center;
      align-items: center;
    }
    .arco-image-img {
      border: 1px solid #0045f0;
    }
  }
}
</style>
