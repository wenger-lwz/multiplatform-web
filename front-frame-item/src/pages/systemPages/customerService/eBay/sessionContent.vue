<template>
  <div class="conversation-container">
    <gj-spin :loading="loading === 'getList'" class="session-content">
      <div
        v-if="selectedValue && selectedValue?.sessionType !== 3"
        class="session-putAway"
        @click="orderDetailShow = !orderDetailShow"
      >
        {{ orderDetailShow ? "收起" : "展开" }}
      </div>
      <div class="session-content-header">
        <div class="header-title fontNoWrap-1">
          {{ selectedValue?.sessionName }}
        </div>
        <div class="header-right">
          <gj-button type="plain" @click="viewMessageShow = true"
            >查看消息</gj-button
          >
          <gj-button type="plain" @click="referralSessionShow = true"
            >转交</gj-button
          >
          <gj-button type="plain">转交已处理</gj-button>
        </div>
      </div>
      <div
        ref="sessionNewsListRef"
        :class="[
          'session-news-list',
          selectedValue?.sessionType === 3 && 'session-news-list__nofooter',
        ]"
        @scroll="downUp"
      >
        <NewListItem
          v-for="item of list"
          :key="item.id"
          :item="item"
          :sessionType="selectedValue.sessionType"
          @reply="reply(item)"
          @openReplyDetails="openReplyDetails(item)"
          @seeOriginalMail="seeOriginalMail(item)"
        ></NewListItem>
      </div>
      <div class="session-content-footer">
        <gj-button type="plain" @click="reply('sendOut')"
          >议价-联系买家</gj-button
        >
      </div>
      <ReplyBox
        ref="replyBoxRef"
        :type="replyBoxType"
        :replyNews="replyNews"
      ></ReplyBox>
    </gj-spin>
    <transition
      v-if="selectedValue && selectedValue?.sessionType !== 3"
      name="drawer"
    >
      <OrderDetails
        v-show="orderDetailShow"
        :selectedValue="selectedValue"
      ></OrderDetails>
    </transition>
  </div>
  <gj-drawer
    :visible="replyDetailsShow"
    class="replyDetails-drawer"
    width="400px"
    title="回复详情"
    unmount-on-close
    :render-to-body="false"
    :footer="false"
    @cancel="replyDetailsShow = false"
  >
    <ReplyDetails
      :selectedValue="selectedValue"
      :replyDetailsId="replyDetailsId"
    ></ReplyDetails>
  </gj-drawer>
  <gj-drawer
    :visible="originalMailShow"
    class="originalMail-drawer"
    width="42vw"
    title="查看原始邮件"
    unmount-on-close
    :render-to-body="false"
    :footer="false"
    @cancel="originalMailShow = false"
  >
    <!-- <div v-if="originalMailHtml" v-html="originalMailHtml"></div> -->
    <iframe
      style="width: 100%; height: 100%"
      :srcdoc="originalMailHtml"
      frameborder="0"
    ></iframe>
  </gj-drawer>
  <gj-drawer
    :visible="viewMessageShow"
    class="viewMessage-drawer"
    width="322px"
    title="查看消息"
    unmount-on-close
    :render-to-body="false"
    :footer="false"
    @cancel="viewMessageShow = false"
  >
    <ViewMessage :selectedValue="selectedValue"></ViewMessage>
  </gj-drawer>
  <gj-modal
    v-model:visible="referralSessionShow"
    title="转交会话"
    modal-class="referralSession-modal"
    unmount-on-close
    :render-to-body="false"
    :footer="false"
    @cancel="referralSessionShow = false"
  >
    <ReferralSession
      :selectedValue="selectedValue"
      @ok="referralSessionShow = false"
    ></ReferralSession>
  </gj-modal>
</template>

<script>
import { ref, reactive, toRefs, nextTick } from "vue";
import { getMessageList } from "@/api/customerService/eBay-zh";
import NewListItem from "./component/newListItem.vue";
import ReplyBox from "./component/replyBox.vue";
import OrderDetails from "./component/orderDetails.vue";
import ReferralSession from "./component/referralSession.vue";
import ViewMessage from "./component/viewMessage.vue";
import ReplyDetails from "./component/replyDetails.vue";
// import { createUuid } from "@/utils/common";

export default {
  components: {
    NewListItem,
    ReplyBox,
    OrderDetails,
    ReferralSession,
    ViewMessage,
    ReplyDetails,
  },
  setup() {
    const sessionNewsListRef = ref(null);
    const replyBoxRef = ref(null);

    const data = reactive({
      loading: false,
      // 展开订单详情
      orderDetailShow: false,
      // 查看回复详情
      replyDetailsShow: false,
      // 查看原始邮件
      originalMailShow: false,
      // 查看消息
      viewMessageShow: false,
      // 转交
      referralSessionShow: false,
      startPage: 0,
      endPage: 10,
      total: 0,
      isDownUp: true,
      list: [
        /*
        {
          id: "1",
          name: "Hannah Whtie",
          mailbox: "<dtr63sxggt7qpq9@marketplace.amazon.com>",
          reply: 1, // 1回复 2未回复
          remainingTime: "30",
          timeColor: "orange",
          type: "",
          content: `Hello,we recommend you keep your conversations on eBay and avoid sharing
                     personal or business information we recommend you keep your conversations on eBay and avoid sharing personal or business information
                    conversations on eBay and avoid sharing personal or business informationHello,we
                     recommend you keep your conversations on eBay and avoid sharing personal or business in
                     formation we recommend you keep your conversations on eBay and avoid sharing personal or business information
                    conversations on eBay and avoid sharing personal or business information conversat
                    ions on eBay and avoid sharing personal or business informationHell
                    o,we recommend you keep your conversations on eBay and avoid sharing
                     personal or business information we recommend you keep your conversations on eBay and avoid sharing personal or business information
                    conversations on eBay and avoid sharing personal or business informatio
                    `,
        },
        {
          id: "2",
          name: "客服一号",
          color: "green",
          timeColor: "orange",
          type: "kefu",
          content: `Hello,we recommend you keep your conversations on eBay and avoid sharing`,
        },*/
      ],
      selectedValue: null,
      replyNews: null,
      replyBoxType: "reply",
      originalMailHtml: "",
      replyDetailsId: "",
    });

    // 获取消息
    const getList = (state) => {
      if (data.loading === "getList") return;
      data.loading = "getList";
      getMessageList({
        startPage: data.startPage,
        endPage: data.endPage,
        sessionId: data.selectedValue?.sessionId,
        erpShopId: data.selectedValue?.erpShopId,
      }).then((res) => {
        // console.log(res);
        if (res.data?.ebayMessageList) {
          data.list = [...res.data.ebayMessageList.reverse(), ...data.list];
          data.total = res.data.sessionMessageCount;
          data.startPage += data.endPage;
          data.endPage += data.endPage;
        }
        // 判断 是否是最后一页
        if (data.list.length >= data.total) {
          data.isDownUp = false;
        }
        // 如果列表重置
        if (state === "reset") {
          nextTick(() => {
            scrollToEnd();
            data.loading = false;
          });
        } else {
          // 获取历史消息后记录滚动条当前位置
          let oldScrollHeight = sessionNewsListRef.value.scrollHeight;
          nextTick(() => {
            // 当视图重新渲染后 跳转滚动条到记录的位置
            sessionNewsListRef.value.scrollTop =
              sessionNewsListRef.value.scrollHeight - oldScrollHeight;
            data.loading = false;
            // console.log(sessionNewsListRef.value.scrollTop)
            // console.log(sessionNewsListRef.value.scrollHeight)
            // console.log(sessionNewsListRef.value.clientHeight)
          });
        }
      });
    };

    // 重置
    const reset = (selectedValue) => {
      if (selectedValue) {
        data.selectedValue = selectedValue;
      }
      data.startPage = 0;
      data.endPage = 10;
      data.list = [];
      data.isDownUp = true;
      getList("reset");
    };

    // 滚动条定位到底部
    const scrollToEnd = () => {
      // console.dir(sessionNewsListRef.value);
      // console.log(sessionNewsListRef.value.scrollHeight);
      // console.log(sessionNewsListRef.value.clientHeight);
      // 滚动条定位到底部
      if (
        sessionNewsListRef.value.scrollHeight >
        sessionNewsListRef.value.clientHeight
      ) {
        sessionNewsListRef.value.scrollTop =
          sessionNewsListRef.value.scrollHeight -
          sessionNewsListRef.value.clientHeight;
      }
    };

    // 下拉加载
    const downUp = (e) => {
      // console.log(e.target.scrollTop);
      // console.log(e.target.scrollTop < 200);
      if (e.target.scrollTop === 0 && data.isDownUp) {
        // 获取历史消息
        getList();
      }
    };

    //

    // 消息回复
    const reply = (val) => {
      if (val === "sendOut") {
        data.replyBoxType = "sendOut";
      } else {
        data.replyBoxType = "reply";
        data.replyNews = val;
      }
      replyBoxRef.value.positionBottom = "0";
    };

    // 查看回复详情
    const openReplyDetails = (val) => {
      data.replyDetailsId = val.platformMessageId;
      data.replyDetailsShow = true;
    };

    // 查看原始邮件
    const seeOriginalMail = (val) => {
      data.originalMailHtml = val.messageOriginalText;
      data.originalMailShow = true;
    };

    return {
      sessionNewsListRef,
      replyBoxRef,
      ...toRefs(data),
      getList,
      reset,
      scrollToEnd,
      downUp,
      reply,
      openReplyDetails,
      seeOriginalMail,
    };
  },
};
</script>
<style lang="scss">
.originalMail-drawer {
  .arco-drawer-body {
    padding: 0;
    overflow: hidden;
  }
  .arco-drawer {
    min-width: 480px;
  }
}
.replyDetails-drawer .arco-drawer-body {
  padding: 0;
  overflow: hidden;
}
.viewMessage-drawer {
  .arco-drawer-body {
    padding: 8px 16px 16px 16px;
    overflow: hidden;
  }
  .arco-tabs-content {
    padding-top: 10px;
  }
}
</style>
<style scoped lang="scss">
.conversation-container {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 666px;
  margin: 12px;
  background: #fff;
  border-radius: 4px;
}
.session-content {
  position: relative;
  // width: 100%;
  flex: 1;
  overflow: hidden;
  .session-putAway {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 24px;
    height: 72px;
    padding: 0 2px;
    background: #e5e6eb;
    border: 1px solid #c9cdd4;
    border-right: 0;
    border-radius: 4px 0 0 4px;
    text-align: center;
    font-size: 12px;
    line-height: 16px;
    color: #4e5969;
    transform: translate(0, -50%);
    cursor: pointer;
  }
  .session-content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 16px;
    padding: 12px 0;
    border-bottom: 1px solid #e6e6ed;
    .header-title {
      font-family: "PingFang SC";
      font-style: normal;
      font-size: 12px;
      font-weight: 600;
    }
    .header-right {
      min-width: 227px;
      .arco-btn + .arco-btn {
        margin-left: 8px;
      }
    }
  }
  .session-news-list {
    box-sizing: border-box;
    height: calc(100vh - 57px - 24px - 49px);
    padding: 6px 16px;
    overflow-y: auto;
  }
  .session-news-list__nofooter {
    height: calc(100vh - 57px - 24px);
  }
  .session-content-footer {
    padding: 8px;
    border-top: 1px solid #e6e6ed;
  }
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  min-width: 0;
}

.drawer-enter-to,
.drawer-leave-from {
  opacity: 1;
  min-width: 270px;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.2s;
}
</style>
