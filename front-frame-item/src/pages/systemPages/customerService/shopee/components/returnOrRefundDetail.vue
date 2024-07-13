<template>
  <gj-modal
    :visible="dialogVisible"
    :render-to-body="false"
    :unmount-on-close="true"
    :footer="true"
    @cancel="cancel"
    width="97%"
  >
    <template #title>
      <div class="dialog-title">
        <span>订单详情</span>
      </div>
    </template>
    <template #footer>
      <gj-button type="plain" @click="disputeInfoEidt">提出争议</gj-button>
      <commonPopconfirm
        position="tr"
        content="您确定要接受该退款决定吗？在您接受后，您将不能就此请求提出任何争议。"
        @ok="returnConfirm(detailRow)"
      >
        <gj-button type="primary">接受退款</gj-button>
      </commonPopconfirm>
    </template>
    <div class="order-content" ref="containerRef">
      <div class="layoutContent">
        <!-- 内容部分 -->
        <div
          v-for="item in listData"
          :key="item.sectionId"
          :id="`${item.sectionId}`"
          :ref="item.ref"
          class="titlewrap"
        >
          <span class="title">{{ item.name }}</span>
          <component :is="item.sectionId" :allDateDetail="allDateDetail" />
        </div>
      </div>
      <div class="layoutSider">
        <siderInfo
          :allDateDetail="allDateDetail"
          @look-orderId-detail="lookOrderId"
        ></siderInfo>
      </div>
    </div>
  </gj-modal>
  <OrderDetail
    :dialogVisible="detailVisible"
    :orderId="allDateDetail?.orderId"
    @cancel="cancelDetail"
  >
  </OrderDetail>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
  ref,
} from "vue";
import basicInfo from "@pagesSystem/customerService/shopee/components/BasicInfo.vue";
import disputedInfo from "@pagesSystem/customerService/shopee/components/disputedInfo.vue";
import returnInfo from "@pagesSystem/customerService/shopee/components/returnInfo.vue";
import goodsInfo from "@pagesSystem/customerService/shopee/components/GoodsInfo.vue";
import siderInfo from "@pagesSystem/customerService/shopee/components/siderInfo.vue";
import { getShopeeReturnDetail } from "@/api/customerService/shopee.js";
import commonPopconfirm from "@/components/commonPopconfirm";
import OrderDetail from "@pagesSystem/order/shopee/orderManger/allOrderDetail.vue";

export default defineComponent({
  name: "returnOrRefundDetail",
  emits: [
    "close-detail",
    "return-confirm",
    "disputeInfo_eidt",
    "cancel",
    "look-orderId-detail",
  ],
  components: {
    basicInfo,
    disputedInfo,
    goodsInfo,
    siderInfo,
    returnInfo,
    commonPopconfirm,
    OrderDetail,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    detailRow: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const containerRef = ref();
    const data = reactive({
      detailVisible: false,
      detailRow: {},
      orderList: [{ label: "订单编号", value: "Socrates33" }],
      buyleList: [
        { label: "买家名称", value: "Socrates1" },
        { label: "手机号", value: "Socrates2" },
        { label: "国际", value: "Socrates3" },
        { label: "城市", value: "Socrates4" },
        { label: "地区", value: "Socrates5" },
        { label: "区域", value: "Socrates6" },
        { label: "街道", value: "Socrates7" },
        { label: "地址", value: "Socrates8" },
        { label: "邮编", value: "Socrates9" },
      ],
      proxyThis: proxy,
      allDateDetail: {}, // 详情总数据
      listData: [
        { name: "基础信息", sectionId: "basicInfo", ref: "basicInfo" },
        { name: "商品规格", sectionId: "goodsInfo", ref: "goodsInfo" },
        {
          name: "争议信息",
          sectionId: "disputedInfo",
          ref: "disputedInfo",
        },
        { name: "退货物流", sectionId: "returnInfo", ref: "returnInfo" },
      ],
      templateName: {
        basicInfo: "basicInfo",
        disputedInfo: "disputedInfo",
        goodsInfo: "goodsInfo",
        returnInfo: "returnInfo",
      },
      id: "",
    });

    watch(
      () => props.dialogVisible,
      () => {
        if (props.dialogVisible) {
          data.id = props.detailRow.returnPlatformOrderId;
          toGetDetail();
        }
      }
    );

    const toGetDetail = async () => {
      const params = {
        returnPlatformOrderId: data.id,
      };
      const res = await getShopeeReturnDetail(params);
      if (res.code === 0) {
        data.allDateDetail = res.data || {};
      }
    };

    const cancel = () => {
      emit("cancel");
    };
    const returnConfirm = (row) => {
      emit("return-confirm", row);
    };
    const disputeInfoEidt = () => {
      emit("disputeInfo_eidt", props.detailRow);
    };
    // 查看详情页
    const lookOrderId = () => {
      data.detailVisible = true;
      data.detailRow = data.allDateDetail || {};
    };
    const cancelDetail = () => {
      data.detailVisible = false;
    };
    return {
      ...toRefs(data),
      toGetDetail,
      cancel,
      returnConfirm,
      disputeInfoEidt,
      lookOrderId,
      cancelDetail,
      containerRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.order-content {
  // position: relative;
  display: flex;
  width: 100%;
  height: calc(100vh - 191px);
  gap: 24px;
  // height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  // display: flex;
  .layoutContent {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 24px;
    // width: 100%;
    box-sizing: border-box;
    .title {
      position: relative;
      font-weight: bold;
      font-size: 14px;
      color: #1d2129;
      height: 18px;
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
    .titlewrap {
      display: flex;
      flex-direction: column;
      row-gap: 16px;
    }
  }
  .layoutSider {
    height: max-content;
    width: 256px;
    padding: 16px 18px;
    border: 1px solid #e6e6ed;
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box;
  }
}
</style>
