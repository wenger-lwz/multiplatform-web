<template>
  <gj-popover
    trigger="click"
    content-class="price-popper-class"
    position="bottom"
    :append-to-body="false"
    :popup-visible="popupVisible"
    :update-at-scroll="true"
    :trigger-props="{
      updateAtScroll: true,
    }"
    @popup-visible-change="popupVisibleChange"
  >
    <gj-input-number
      placeholder="请输入"
      hide-button
      readonly
      :precision="2"
      :max="MAX_NUM_15"
      v-model="slotInputValue"
    >
      <template #prefix>{{ recommendPriceUnit }}</template>
    </gj-input-number>

    <template #content>
      <div class="content">
        <div class="price-content">
          <div class="header">
            <span>售价</span>
          </div>
          <div class="form-content">
            <gj-form ref="priceFormRef" :model="priceForm">
              <div
                v-for="item in columns"
                :key="item.dataIndex"
                class="form-input-item"
              >
                <gj-input-number
                  placeholder="请输入"
                  allow-clear
                  hide-button
                  :precision="2"
                  :max="MAX_NUM_15"
                  v-model="priceForm[item.dataIndex]"
                >
                  <template #prepend>{{ item.prepend }}</template>
                </gj-input-number>
              </div>
            </gj-form>
          </div>
        </div>
        <div class="promotionPrice-content">
          <div class="header">
            <span>促销价</span>
            <span @click="calcPrice">计算</span>
          </div>
          <div class="form-content">
            <gj-form ref="promotionPriceFormRef" :model="promotionPriceForm">
              <div
                v-for="(item, index) in columns"
                :key="item.dataIndex + index"
                class="form-input-item"
              >
                <gj-input-number
                  placeholder="请输入"
                  allow-clear
                  hide-button
                  :precision="2"
                  :max="MAX_NUM_15"
                  v-model="promotionPriceForm[item.dataIndex]"
                >
                  <template #prepend>{{ item.prepend }}</template>
                </gj-input-number>
              </div>
            </gj-form>
          </div>
        </div>
      </div>
      <div class="table-contents">
        <gj-table
          bordered
          :pagination="false"
          :data-source="tableData"
          :columns="columns"
        ></gj-table>
      </div>
      <div class="bottom">
        <gj-button size="mini" @click="cancel">取消</gj-button>
        <gj-button
          size="mini"
          type="primary"
          :disabled="needWaiting"
          @click="sure"
          >确定</gj-button
        >
      </div>
    </template>
  </gj-popover>
</template>

<script>
import { reactive, toRefs, computed, ref } from "vue";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
import { getGlobalPrice } from "@/api/published/lazada";
import { emptyFilter } from "@/utils/format";
import { useCheckIsEmpty } from "@pagesSystem/published/lazada/hooks";
const MAX_NUM_15 = Number("9".repeat(15)) - 0.01;

export default {
  props: {
    globalPrice: {
      type: Object,
      default: () => {
        return {};
      },
    },
    globalpromotionPrice: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showItemName: {
      type: String,
      required: true,
    },
  },
  emits: ["update:globalPrice", "update"],
  setup(props, { emit }) {
    const store = useStore();
    const data = reactive({
      // formulaVisible: false,
      priceForm: {},
      promotionPriceForm: {},
      popupVisible: false,
      hasReqDone: false,
      needWaiting: false,
    });

    const columns = [
      {
        title: "USD",
        dataIndex: "cb",
        prepend: "USD",
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.cb)}</span>;
        },
      },
      {
        title: "MYR",
        dataIndex: "my",
        prepend: "MYR",
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.my)}</span>;
        },
      },
      {
        title: "IDR",
        dataIndex: "id",
        prepend: "IDR",
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.id)}</span>;
        },
      },
      {
        title: "SGD",
        dataIndex: "sg",
        prepend: "SGD",
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.sg)}</span>;
        },
      },
      {
        title: "PHP",
        dataIndex: "ph",
        prepend: "PHP",
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.ph)}</span>;
        },
      },
      {
        title: "THB",
        dataIndex: "th",
        prepend: "THB",
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.th)}</span>;
        },
      },
      {
        title: "VND",
        dataIndex: "vn",
        prepend: "VND",
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.vn)}</span>;
        },
      },
    ];

    const tableData = ref([{ cb: 1 }]);

    columns.forEach((item) => {
      data.priceForm[item.dataIndex] = null;
      data.promotionPriceForm[item.dataIndex] = null;
    });

    const recommendPriceUnit = computed(() => {
      return store.getters.getParams?.basicInfoLz?.recommendPriceUnit;
    });

    const slotInputValue = computed(() => {
      return props[props.showItemName]?.cb ?? null;
    });

    const calcPrice = async () => {
      if (
        useCheckIsEmpty(data.priceForm["cb"]) &&
        useCheckIsEmpty(data.promotionPriceForm["cb"])
      ) {
        return GjMessage.warning("请输入美元信息");
      }
      if (data.priceForm["cb"] <= 0 && data.promotionPriceForm["cb"] <= 0) {
        return GjMessage.warning("美元大于0");
      }
      data.needWaiting = true;
      let promiseArr = [];
      let reqName = [];
      if (data.priceForm["cb"]) {
        promiseArr.push(getGlobalPrice({ price: data.priceForm["cb"] }));
        reqName.push("priceForm");
      }
      if (data.promotionPriceForm["cb"]) {
        promiseArr.push(
          getGlobalPrice({ price: data.promotionPriceForm["cb"] })
        );
        reqName.push("promotionPriceForm");
      }
      const [res0, res1] = await Promise.all(promiseArr);
      data.needWaiting = false;
      if (res0) {
        res0?.data?.forEach((item) => {
          data[reqName[0]][item.siteCode] = useCheckIsEmpty(item.recommendPrice)
            ? null
            : Number.parseFloat(item.recommendPrice.toFixed(2));
        });
      }
      if (res1) {
        res1?.data?.forEach((item) => {
          data[reqName[1]][item.siteCode] = useCheckIsEmpty(item.recommendPrice)
            ? null
            : Number.parseFloat(item.recommendPrice.toFixed(2));
        });
      }
    };

    const popupVisibleChange = (bool) => {
      data.popupVisible = bool;
      if (bool && !data.hasReqDone) {
        // 请求汇率
        getGlobalPrice({ price: 1 })
          .then((res) => {
            const result = {};
            res?.data?.forEach((item) => {
              result[item.siteCode] = useCheckIsEmpty(item.recommendPrice)
                ? null
                : Number.parseFloat(item.recommendPrice.toFixed(2));
            });
            result["cb"] = 1;
            tableData.value = [result];
            data.hasReqDone = true;
          })
          .catch(() => {
            tableData.value = [{ cb: 1 }];
          });
      }

      if (bool) {
        columns.forEach((item) => {
          data.priceForm[item.dataIndex] =
            props.globalPrice[item.dataIndex] ?? null;
          data.promotionPriceForm[item.dataIndex] =
            props.globalpromotionPrice[item.dataIndex] ?? null;
        });
      }
    };

    const cancel = () => {
      data.popupVisible = false;
    };

    const sure = () => {
      emit("update:globalPrice", { ...data.priceForm });
      emit("update:globalpromotionPrice", { ...data.promotionPriceForm });
      emit("update");
      data.popupVisible = false;
    };

    return {
      ...toRefs(data),
      MAX_NUM_15,
      columns,
      tableData,
      recommendPriceUnit,
      slotInputValue,
      calcPrice,
      popupVisibleChange,
      cancel,
      sure,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
</style>

<style lang="scss">
.price-popper-class {
  padding: 0;
  .content {
    padding: 14px 16px 0px;
    gap: 16px;
    display: flex;
    justify-content: space-between;
    .price-content {
      .header {
        padding-bottom: 16px;
        color: #000430;
        font-weight: 700;
      }
      .form-input-item {
        width: 242px;
        margin-bottom: 16px;
      }
    }
    .promotionPrice-content {
      .header {
        display: flex;
        padding-bottom: 16px;
        justify-content: space-between;
        color: #000430;
        font-weight: 700;
        span:last-child {
          cursor: pointer;
          color: #0045f0;
        }
      }
      .form-input-item {
        width: 242px;
        margin-bottom: 16px;
      }
    }
  }
  .table-contents {
    padding: 0 16px 16px;
  }
  .bottom {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #e6e6ed;
    padding: 8px 16px;
    gap: 0 8px;
  }
}
</style>
