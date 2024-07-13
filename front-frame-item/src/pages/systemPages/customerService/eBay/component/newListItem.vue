<template>
  <div
    :class="[
      'newList-item',
      item.senderType === 2 && 'newList-item-position__right',
    ]"
  >
    <div class="newList-item-title">
      <span>{{ item.buyerId }}</span>
      <!-- <span v-if="item.buyerEmail">{{ item.buyerEmail }}</span> -->
      <span v-if="item.messageStatus > 1">
        <gj-tag v-if="item.messageStatus === 2" color="red">未回复</gj-tag>
        <gj-tag v-if="item.messageStatus === 3" color="green">已回复</gj-tag>
      </span>
    </div>
    <div class="newList-item-time">
      <span
        >{{ item.sendTime.split("T")[0] }}
        {{ item.sendTime.split("T")[1] }}</span
      >
      <gj-tag v-if="item.remainingTime" :color="item.timeColor"
        >剩余{{ item.remainingTime }}分钟回复</gj-tag
      >
    </div>
    <div class="newList-item-subject">
      {{ item.messageSubject }}
    </div>
    <div class="newList-itemContent-box" v-if="sessionType !== 3">
      <div class="newList-item-content">
        <div ref="itemContentRef" :style="{ height: h }">
          <span>{{ item.messageText }}</span>
        </div>
        <div class="content-tags">
          <div class="textOpen-btn">
            <gj-button
              v-show="textOpenShow"
              size="mini"
              type="plain"
              shape="round"
              @click="textOpen"
              >展开</gj-button
            >
          </div>
          <div
            v-if="item.messageLabels && item.messageLabels.length > 0"
            class="content-tags-box"
          >
            <gj-tag
              color="arcoblue"
              v-for="tag of item.messageLabels"
              :key="tag"
              >催发货</gj-tag
            >
          </div>
        </div>
      </div>
      <div
        v-if="item.senderType === 1 && !isReplyDetails"
        class="newList-itemContent-operation"
      >
        <gj-tooltip content="回复">
          <SvgIcon svgClass="reply" :width="16" @click="reply" />
        </gj-tooltip>
        <div class="operation-splitLine"></div>
        <gj-tooltip content="转发">
          <SvgIcon svgClass="forward" :width="16" />
        </gj-tooltip>
      </div>
    </div>
    <div
      class="newList-item-imgList"
      v-if="
        !isReplyDetails &&
        item.messageMultimediaUrl &&
        item.messageMultimediaUrl.length
      "
    >
      <gj-image
        v-for="img of JSON.parse(item.messageMultimediaUrl)"
        :key="img.mediaURL"
        width="36"
        height="36"
        :src="img.mediaURL"
      />
    </div>
    <div v-if="!isReplyDetails" class="newList-item-replyNum">
      <span v-if="item.replyMessageCount" @click="openReplyDetails"
        >{{ item.replyMessageCount }}条回复</span
      >
      <span v-if="item.senderType === 1" @click="seeOriginalMail"
        >查看原始邮件</span
      >
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from "vue";
import SvgIcon from "@/components/SvgIcon";

export default {
  components: {
    SvgIcon,
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isReplyDetails: {
      type: Boolean,
      default: false,
    },
    sessionType: {
      type: [Number, Boolean],
    },
  },
  emits: ["reply", "openReplyDetails", "seeOriginalMail"],
  setup(props, { emit }) {
    const itemContentRef = ref(null);
    const data = reactive({
      // msgStatus: [],
      h: "",
      ch: 0,
      textOpenShow: false,
    });

    // 文本展开
    const textOpen = () => {
      data.h = data.ch + "px";
      data.textOpenShow = false;
    };

    // 回复
    const reply = () => {
      emit("reply");
    };

    // 查看回复详情
    const openReplyDetails = () => {
      emit("openReplyDetails");
    };

    // 查看原始邮件
    const seeOriginalMail = () => {
      emit("seeOriginalMail");
    };

    onMounted(() => {
      // 如果不是系统消息
      if (props.sessionType !== 3) {
        data.ch = itemContentRef.value.clientHeight;
        // 如果文本超过最大高度 显示展开按钮
        if (data.ch > 108) {
          data.h = "108px";
          data.textOpenShow = true;
        }
      }
    });

    return {
      itemContentRef,
      ...toRefs(data),
      textOpen,
      reply,
      openReplyDetails,
      seeOriginalMail,
    };
  },
};
</script>

<style scoped lang="scss">
.newList-item {
  font-family: "PingFang SC";
  font-style: normal;
  font-size: 12px;
  line-height: 18px;
  .newList-item-title {
    > span:first-child {
      padding-right: 8px;
      font-weight: 600;
      color: #1d2129;
    }
    // > span:nth-child(2) {
    //   color: #86909c;
    //   padding-right: 8px;
    // }
  }
  .newList-item-time {
    display: flex;
    align-items: center;
    margin-top: 4px;
    font-family: "PingFang TC";
    color: #86909c;
    .arco-tag {
      margin-left: 8px;
    }
  }
  .newList-item-subject {
    color: #1d2129;
  }
  .newList-itemContent-box {
    display: flex;
    margin-top: 4px;
    .newList-itemContent-operation {
      box-sizing: border-box;
      display: flex;
      opacity: 0;
      justify-content: space-between;
      align-items: center;
      width: 56px;
      height: 22px;
      margin: 0 2px;
      padding: 0 3px;
      border: 1px solid #dadde2;
      border-radius: 4px;
      color: #fff;
      .operation-splitLine {
        width: 1px;
        height: 14px;
        background: #e5e6e8;
      }
      .svg-icon {
        cursor: pointer;
      }
    }
  }
  &:hover {
    .newList-itemContent-operation {
      opacity: 1;
    }
  }

  .newList-item-content {
    box-sizing: border-box;
    max-width: calc(100% - 65px);
    padding: 8px 12px;
    background: #f2f3f5;
    border-radius: 4px;
    > div:first-child {
      transition: all 0.2s;
      overflow: hidden;
      text-align: left;
    }
    .content-tags {
      position: relative;
      .textOpen-btn {
        position: absolute;
        z-index: 2;
        left: 0;
        top: -18px;
        width: 100%;
        background: linear-gradient(
          180deg,
          rgba(242, 243, 245, 0) 0%,
          #f2f3f5 70.6%
        );
        text-align: center;
        .arco-btn {
          background: #fff;
        }
      }
      .content-tags-box {
        padding-top: 15px;
      }
      .arco-tag + .arco-tag {
        margin-left: 4px;
      }
    }
  }
  .newList-item-imgList {
    margin-top: 2px;
    height: 36px;
    .arco-image + .arco-image {
      margin-left: 4px;
    }
  }
  .newList-item-replyNum {
    margin-top: 4px;
    color: #0045f0;
    > span {
      cursor: pointer;
    }
    span + span {
      margin-left: 8px;
    }
  }
}
.newList-item-position__right {
  text-align: right;
  .newList-item-time,
  .newList-itemContent-box {
    justify-content: flex-end;
  }
  .newList-item-content {
    background: #e8f3ff;
  }
}
.newList-item + .newList-item {
  margin-top: 15px;
}
</style>
