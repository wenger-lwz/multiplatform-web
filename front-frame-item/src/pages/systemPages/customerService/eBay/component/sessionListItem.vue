<template>
  <div class="session-list-item__box">
    <div class="sessionItem-divider">
      <gj-divider />
    </div>
    <div class="session-list-item" @click="sessionSelected">
      <div class="sessionItem-top">
        <gj-badge
          v-if="item.noReadCount > 0"
          :count="count"
          :dotStyle="{
            height: '15px',
            lineHeight: '15px',
            padding: '0 4px',
            top: '-4px',
            right: '-2px',
          }"
        >
          <div class="news-title fontNoWrap-1">{{ item.sessionName }}</div>
        </gj-badge>
        <div v-else class="news-title fontNoWrap-1">{{ item.sessionName }}</div>
        <div v-if="item.sessionType === 1" class="news-transfer fontNoWrap-1">
          {{ item.previousReceiverName }}转交
        </div>
        <div class="news-time fontNoWrap-1">
          {{ item.sessionLastTime.split("T")[1] }}
        </div>
      </div>
      <div class="sessionItem-content">
        <div class="sessionItem-content-top">
          <div class="fontNoWrap-1">{{ item.subject }}</div>
          <div v-if="item.noReadCount > 0" class="for-reply">
            ({{ item.noReadCount }}条未回)
          </div>
        </div>
        <div class="fontNoWrap-1">
          {{ item.text }}
        </div>
      </div>
      <div class="sessionItem-tags">
        <gj-tag :color="'red'">超过24小时</gj-tag>
        <gj-tag
          :color="'arcoblue'"
          v-for="tag of item.labelList"
          :key="tag.labelId"
          >{{ tag.labelName }}</gj-tag
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["sessionSelected"],
  setup(props, { emit }) {
    const data = reactive({
      count: 1,
    });

    const sessionSelected = () => {
      emit("sessionSelected", props.item);
    };
    return {
      ...toRefs(data),
      sessionSelected,
    };
  },
};
</script>

<style scoped lang="scss">
.sessionItem-divider {
  display: none;
  padding: 4px 12px;
}
.session-list-item {
  margin: 0 4px;
  padding: 15px 12px 8px 12px;
  font-size: 12px;
  line-height: 18px;
  &:hover {
    cursor: pointer;
    background: #e8f3ff;
    border-radius: 4px;
  }
  .sessionItem-top {
    display: flex;

    .news-title {
      line-height: 20px;
      font-weight: 700;
      color: #1d2129;
    }
    .news-transfer {
      min-width: 70px;
      margin-left: 8px;
      color: #00b42a;
    }
    .news-time {
      flex: 1;
      min-width: 62px;
      text-align: right;
      color: #86909c;
    }
  }
  .sessionItem-content {
    margin: 4px 0;
    .sessionItem-content-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      .fontNoWrap-1 {
        color: #4e5969;
      }
      .for-reply {
        min-width: 80px;
        text-align: right;
        color: #f53f3f;
      }
    }
    .fontNoWrap-1 {
      color: #86909c;
    }
  }
  .sessionItem-tags {
    .arco-tag + .arco-tag {
      margin-left: 4px;
    }
  }
}
.session-list-item__box + .session-list-item__box {
  .sessionItem-divider {
    display: block;
  }
}
</style>
