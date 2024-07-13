<template>
  <div class="session-list">
    <div class="session-list-top">
      <gj-input-search placeholder="Please enter something" />
      <gj-radio-group v-model="tabsValue" type="button">
        <gj-radio value="all">全部</gj-radio>
        <gj-radio value="secon1d">未回复</gj-radio>
        <gj-radio value="seco2nd">即将超时</gj-radio>
        <gj-radio value="se3cond">客服转交</gj-radio>
      </gj-radio-group>
    </div>
    <gj-divider />
    <div class="session-list-content">
      <SessionListItem
        v-for="item of messageList"
        :key="item"
        :item="item"
        @sessionSelected="sessionSelected(item)"
      ></SessionListItem>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, inject, nextTick } from "vue";
import { getSessionList } from "@/api/customerService/eBay-zh";
import SessionListItem from "./component/sessionListItem.vue";

export default {
  components: {
    SessionListItem,
  },
  setup() {
    // const { proxy } = getCurrentInstance();

    const getSessionContentRef = inject("sessionContentRef");

    const data = reactive({
      tabsValue: "all",
      messageList: [
        // {
        //   sessionName: "Hannah WhiteHaH",
        //   sessionType: 1,
        //   subject: "关于某某商品关于某某商品关于品关于某某某某…",
        //   text: "chenyun: Hello, we recommend you keep your ...",
        //   sessionLastTime: "11:36：00",
        //   noReadCount: 1,
        //   sessionLastMessageHandleTime: 24,
        //   labelList: [
        //     {
        //       labelId: "1",
        //       labelName: "标签1",
        //     },
        //     {
        //       labelId: "2",
        //       labelName: "标签2",
        //     },
        //   ],
        // },
        // {
        //   sessionName: "Hannah2 WhiteHaH",
        //   sessionType: 2,
        //   subject: "关于某某商品关于某某商品关于品关于某某某某…",
        //   text: "chenyun: Hello, we recommend you keep your ...",
        //   sessionLastTime: "11:36：00",
        //   noReadCount: 0,
        //   sessionLastMessageHandleTime: 24,
        //   labelList: [],
        // },
      ],
      selectedValue: null,
    });

    const getList = () => {
      getSessionList({
        startPage: 0,
        endPage: 30,
        erpShopId: "1485451199615721473",
        labelId: "",
        sessionQueryStatus: 1,
      }).then((res) => {
        data.messageList = res.data.ebaySessionList;
        data.selectedValue = data.messageList[0];
        nextTick(() => {
          getSessionContentRef().reset({
            ...data.selectedValue,
            erpShopId: "1485451199615721473",
          });
        });
      });
    };
    getList();

    // onUpdated(() => {
    //   console.log("onUpdated触发");
    //   console.log(proxy.$refs);
    // });

    const sessionSelected = (item) => {
      console.log(item);
      console.log(getSessionContentRef());
      data.selectedValue = item;
      getSessionContentRef().reset({
        ...item,
        erpShopId: "1485451199615721473",
      });
    };

    return {
      ...toRefs(data),
      getList,
      sessionSelected,
    };
  },
};
</script>

<style scoped lang="scss">
.session-list {
  width: 300px;
  min-width: 291px;
  height: 100%;
  overflow: hidden;
  background: #fff;
  .session-list-top {
    padding: 8px 12px;
    .arco-input-search {
      margin-bottom: 8px;
    }
  }
  .session-list-content {
    box-sizing: border-box;
    height: calc(100% - 89px);
    padding: 4px 0;
    overflow-y: auto;
  }
}
</style>
