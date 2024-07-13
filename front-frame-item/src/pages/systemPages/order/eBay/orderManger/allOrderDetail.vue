<template>
  <gj-modal
    :visible="dialogVisible"
    :render-to-body="false"
    :unmount-on-close="true"
    :mask-closable="false"
    :footer="false"
    width="97%"
  >
    <template #title>
      <div class="dialog-title">
        <span>订单详情</span>
      </div>
    </template>
    <div class="dialog-content">
      <orderDes :allDateDetail="allDateDetail" class="layoutHeader"></orderDes>
      <div class="order-content">
        <div class="layoutContent">
          <!-- 内容部分 -->
          <div
            v-for="item in listData"
            :key="item.sectionId"
            :id="`${item.sectionId}`"
            :ref="item.ref"
          >
            <span class="title">{{ $t(item.sectionId) }}</span>
            <component
              :is="item.sectionId"
              class="wrap"
              :allDateDetail="allDateDetail"
            />
          </div>
        </div>
        <!-- 右侧导航栏 -->
        <!-- <div class="layoutSider">
          <rightNav
            :layoutData="listData"
            :proxyData="proxyThis"
            :topIsFixed="true"
          ></rightNav>
        </div> -->
      </div>
    </div>
  </gj-modal>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
} from "vue";
// import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
import orderDes from "../../conpoments/orderDes.vue";
import basicInfo from "../../conpoments/BasicInfo.vue";
import buyerInfo from "../../conpoments/buyInfo.vue";
import goodsInfo from "../../conpoments/GoodsInfo.vue";
import performanceInfo from "../../conpoments/PerformanceInfo.vue";
import expenseDetails from "../../conpoments/ExpenseDetails.vue";
import operationLog from "../../conpoments/OperationLog.vue";
import { getDetail } from "@/api/order/ebay";
// import rightNav from "@/components/rightNav";

export default defineComponent({
  name: "orderList",
  components: {
    orderDes,
    basicInfo,
    buyerInfo,
    goodsInfo,
    performanceInfo,
    expenseDetails,
    operationLog,
    // fullScreenDialog,
    // rightNav,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    orderId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props, { emit }) {
    console.log(props);
    const { proxy } = getCurrentInstance();
    const data = reactive({
      proxyThis: proxy,
      allDateDetail: {}, // 详情总数据
      listData: [
        { name: "basicInfo", sectionId: "basicInfo", ref: "basicInfo" },
        { name: "buyerInfo", sectionId: "buyerInfo", ref: "buyerInfo" },
        { name: "goodsInfo", sectionId: "goodsInfo", ref: "goodsInfo" },
        {
          name: "operationLog",
          sectionId: "operationLog",
          ref: "operationLog",
        },
      ],
      templateName: {
        basicInfo: "basicInfo",
        buyerInfo: "buyerInfo",
        goodsInfo: "goodsInfo",
        operationLog: "operationLog",
      },
      id: "",
    });

    const cancel = () => {
      emit("cancel");
    };

    watch(
      () => props.dialogVisible,
      () => {
        if (props.dialogVisible) {
          data.id = props.orderId;
          toGetDetail();
        }
      }
    );

    const toGetDetail = async () => {
      const params = { orderId: data.id };
      const res = await getDetail(params);
      if (res.code === 0) {
        data.allDateDetail = res.data || {};
        data.allDateDetail.platformName = "ebay";
      }
    };

    return {
      ...toRefs(data),
      cancel,
      toGetDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-content {
  height: calc(100vh - 128px);
  width: 100%;
  box-sizing: border-box;
}
.layoutHeader {
  box-sizing: border-box;
}
.order-content {
  position: relative;
  width: 100%;
  height: calc(100% - 150px);
  box-sizing: border-box;
  // display: flex;
  .layoutContent {
    // flex-wrap: 1;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    .title {
      position: relative;
      font-weight: bold;
      font-size: 14px;
      color: #1d2129;
      height: 18px;
      line-height: 18px;
      margin-left: 12px;
      &::before {
        position: absolute;
        content: "";
        left: -11px;
        top: 2px;
        width: 4px;
        height: 14px;
        background: #1f6eef;
      }
    }
    .wrap {
      padding: 16px 10px 12px 0px;
    }
  }
}
</style>
