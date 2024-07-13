<template>
  <gj-tabs default-active-key="1">
    <gj-tab-pane key="1" title="消息">
      <div class="search-msg">
        <gj-input-search
          v-model="queryText"
          placeholder="请输入"
          @search="getMsgList"
          @pressEnter="getMsgList"
        />
      </div>
      <div class="message-list">
        <div class="message-list-item" v-for="item of msgList" :key="item.id">
          <div class="message-theme fontNoWrap-1">
            {{ item.messageSubject }}
          </div>
          <div class="message-time">
            {{ item.sendTime.split("T")[0] }} {{ item.sendTime.split("T")[1] }}
          </div>
          <div class="message-text fontNoWrap-1">
            {{ item.messageText }}
          </div>
        </div>
      </div>
    </gj-tab-pane>
    <gj-tab-pane key="2" title="转交记录">
      <div class="transfer-list">
        <div class="transfer-list-item" v-for="item of 10" :key="item">
          <div class="flex">
            <div class="flex">
              <div class="c-1 mr-8">转交人</div>
              <div style="width: 110px" class="fontNoWrap-1">客服2客服2客</div>
            </div>
            <div style="min-width: 120px" class="c-1">2022-05-01 11:36：00</div>
          </div>
          <div class="flex">
            <div style="min-width: 36px" class="c-1 mr-8">处理人</div>
            <div class="fontNoWrap-1">客服3客服3客服3客</div>
          </div>
          <div class="flex c-1 fontNoWrap-1">
            备注: Hello, we recommend you keep your dseheje...
          </div>
        </div>
      </div>
    </gj-tab-pane>
  </gj-tabs>
</template>

<script>
import { reactive, toRefs } from "vue";
import {
  getQueryMessageList,
  getTransferRecordList,
} from "@/api/customerService/eBay-zh";

export default {
  props: {
    selectedValue: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const data = reactive({
      queryText: "",
      msgList: [],
      TransferList: [],
    });

    // 获取消息列表
    const getMsgList = () => {
      getQueryMessageList({
        erpShopId: props.selectedValue.erpShopId,
        queryText: data.queryText,
        sessionId: props.selectedValue.sessionId,
      }).then((res) => {
        if (res.data?.ebayMessageList) {
          data.msgList = res.data.ebayMessageList;
        }
      });
    };

    // 获取转交记录
    const getTransferList = () => {
      getTransferRecordList({
        erpShopId: props.selectedValue.erpShopId,
        sessionId: props.selectedValue.sessionId,
      }).then((res) => {
        if (res.data?.ebayMessageList) {
          // data.TransferList = res.data?.
        }
      });
    };

    getMsgList();
    getTransferList();

    return {
      ...toRefs(data),
      getMsgList,
    };
  },
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  justify-content: space-between;
}
.c-1 {
  color: #86909c;
}
.c-2 {
  color: #1d2129;
}
.mr-8 {
  margin-right: 8px;
}
.arco-tabs {
  height: 100%;
}
::v-deep .arco-tabs-content {
  height: calc(100% - 41px);
}
::v-deep .arco-tabs-content-list,
::v-deep .arco-tabs-pane {
  height: 100%;
}
.search-msg {
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e6ed;
}
.message-list {
  height: calc(100% - 43px);
  overflow-y: auto;
}
.transfer-list {
  height: 100%;
  overflow-y: auto;
}
.message-list-item {
  font-size: 12px;
  line-height: 18px;
  padding: 10px 0;
  .message-theme {
    color: #1d2129;
    font-weight: 600;
  }
  .message-time,
  .message-text {
    color: #86909c;
  }
}

.message-list-item + .message-list-item,
.transfer-list-item + .transfer-list-item {
  border-top: 1px solid #e6e6ed;
}
.transfer-list-item {
  font-size: 12px;
  line-height: 18px;
  padding-bottom: 10px;
  .flex + .flex {
    margin-top: 8px;
  }
}
.transfer-list-item + .transfer-list-item {
  padding-top: 10px;
}
</style>
