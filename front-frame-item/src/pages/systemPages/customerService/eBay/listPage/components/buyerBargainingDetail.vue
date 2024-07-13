<template>
  <gj-modal
    :visible="dialogVisible"
    :render-to-body="false"
    :unmount-on-close="true"
    :footer="true"
    @cancel="cancel"
    width="990px"
    class="buyerBargaining-detail"
  >
    <template #title>
      <div class="dialog-title">
        <span>详情</span>
      </div>
    </template>
    <template #footer>
      <gj-space v-if="isFlag">
        <gj-button type="plain" @click="cancelPricce">取消</gj-button>
        <gj-button type="primary" @click="comfirmPrice">确定</gj-button>
      </gj-space>
      <gj-space v-else>
        <gj-button type="plain" @click="disputeInfoEidt(detailRow)"
          >联系买家</gj-button
        >
        <commonPopconfirm
          position="tr"
          content="是否拒绝议价?"
          @ok="returnConfirm(detailRow, 'DECLINE')"
        >
          <gj-button type="plain">拒绝议价</gj-button>
        </commonPopconfirm>
        <gj-button type="plain" @click="counterPrice(detailRow, 'DECLINE', 2)"
          >提出还价</gj-button
        >
        <commonPopconfirm
          position="tr"
          content="是否接受议价?"
          @ok="returnConfirm(detailRow, 'ACCEPT')"
        >
          <gj-button type="primary">接受议价</gj-button>
        </commonPopconfirm>
      </gj-space>
    </template>
    <!-- <div class="dialog-content"> -->
    <div class="order-content">
      <div class="layoutHeader">
        <basicInfo :allDateDetail="allDateDetail"></basicInfo>
        <!-- 内容部分 -->
        <gj-tabs
          :active-key="componentKey"
          :default-active-key="componentKey"
          @change="handleTabs"
        >
          <gj-tab-pane
            v-for="item in listData"
            :key="item.sectionId"
            :title="item.name"
          >
          </gj-tab-pane>
        </gj-tabs>
      </div>

      <div class="layoutContent">
        <!-- <div
          :key="item.sectionId"
          :id="`${item.sectionId}`"
          :ref="item.ref"
          class="titlewrap"
        >
          <span class="title">{{ item.name }}</span>
        </div> -->
        <component
          :is="componentKey"
          :ref="componentKey"
          :isFlag="isFlag"
          :allDateDetail="allDateDetail"
        />
      </div>
    </div>
    <!-- </div> -->
  </gj-modal>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
  onMounted,
} from "vue";
import basicInfo from "./BasicInfo.vue";
import buyerNewsInfo from "./buyerNewsInfo.vue";
import historicalBargainingInfo from "./historicalBargainingInfo.vue";
import latestBargainingInfo from "./latestBargainingInfo.vue";
import {
  getBestOfferDatail,
  replyBestOffer,
} from "@/api/customerService/eBay.js";
import commonPopconfirm from "@/components/commonPopconfirm";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";

export default defineComponent({
  name: "returnOrRefundDetail",
  emits: [
    "close-detail",
    "return-confirm",
    "disputeInfo_eidt",
    "cancel",
    "counter-offer-confirm",
    "cancelPricce_eidt",
  ],
  components: {
    basicInfo,
    buyerNewsInfo,
    latestBargainingInfo,
    historicalBargainingInfo,
    commonPopconfirm,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    isFlag: {
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
    const $store = useStore();
    const data = reactive({
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
        // { name: '基础信息', sectionId: 'basicInfo', ref: 'basicInfo' },
        {
          name: "最新议价",
          sectionId: "latestBargainingInfo",
          ref: "latestBargainingInfo",
        },
        {
          name: "买家消息",
          sectionId: "buyerNewsInfo",
          ref: "buyerNewsInfo",
        },
        {
          name: "历史议价",
          sectionId: "historicalBargainingInfo",
          ref: "historicalBargainingInfo",
        },
      ],
      templateName: {
        // basicInfo: 'basicInfo',
        buyerNewsInfo: "buyerNewsInfo",
        latestBargainingInfo: "latestBargainingInfo",
        historicalBargainingInfo: "historicalBargainingInfo",
      },
      id: "",
      componentKey: "latestBargainingInfo",
    });

    watch(
      () => props.dialogVisible,
      () => {
        if (props.dialogVisible) {
          data.id = props.detailRow.id;
          toGetDetail();
        }
      }
    );

    const toGetDetail = async () => {
      const res = await getBestOfferDatail(data.id);
      if (res.code === 0) {
        data.allDateDetail = res.data || {};
      }
    };

    const cancel = () => {
      emit("cancel");
    };
    const returnConfirm = (row, val) => {
      emit("return-confirm", row, val);
    };
    const disputeInfoEidt = (row) => {
      emit("disputeInfo_eidt", row);
    };

    const handleTabs = (val) => {
      data.componentKey = val;
    };
    const cancelPricce = () => {
      emit("cancelPricce_eidt", false);
    };
    const comfirmPrice = () => {
      //  保存
      proxy.$refs["latestBargainingInfo"].submitForm().then(async (res) => {
        const createFrom = $store.getters.getParams
          ? $store.getters.getParams.createFrom
          : {};
        if (res === "200") {
          const params = {
            bestOfferActionCodeType: "DECLINE",
            erpShopId: props.detailRow?.erpShopId || "",
            parentId: props.detailRow.id || "",
            ...createFrom,
          };
          replyBestOffer(params)
            .then(() => {
              GjMessage.success("操作成功");
            })
            .finally(() => {
              cancelPricce();
            });
        }
      });
    };
    const counterPrice = (row, key, idx) => {
      emit("counter-offer-confirm", row, key, idx);
      handleTabs("latestBargainingInfo");
    };
    onMounted(() => {});

    return {
      ...toRefs(data),
      toGetDetail,
      cancel,
      returnConfirm,
      disputeInfoEidt,
      handleTabs,
      cancelPricce,
      counterPrice,
      comfirmPrice,
    };
  },
});
</script>

<style lang="scss" scoped>
.layoutHeader {
  box-sizing: border-box;
}
.order-content {
  position: relative;
  height: calc(100vh - 200px);
  width: 100%;
  // height: calc(100% - 150px);
  box-sizing: border-box;
  // display: flex;
  .layoutContent {
    // flex-wrap: 1;
    height: calc(100vh - 398px);
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
<style lang="scss">
.buyerBargaining-detail {
  .arco-modal .arco-modal-body {
    padding: 24px 0px;
    .layoutHeader {
      .detail-descriptions-info {
        padding: 0px 24px;
      }
    }
    .layoutContent {
      padding: 16px 24px;
    }
  }
}
</style>
