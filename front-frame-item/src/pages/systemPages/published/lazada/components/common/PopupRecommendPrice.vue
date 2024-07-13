<template>
  <gj-popover
    trigger="click"
    content-class="group-popper-class"
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
      <div class="header">
        <span>建议售价</span>
        <span @click="calcPrice">计算</span>
      </div>
      <div class="content">
        <div class="form-input-item">
          <div v-for="item in columns" :key="item.dataIndex">
            <gj-input-number
              placeholder="请输入"
              allow-clear
              hide-button
              :precision="2"
              :max="MAX_NUM_15"
              v-model="inputForm[item.dataIndex]"
            >
              <template #prepend>{{ item.prepend }}</template>
            </gj-input-number>
          </div>
        </div>
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
    globaRecommendPrice: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["update:globaRecommendPrice"],
  setup(props, { emit }) {
    const store = useStore();
    const data = reactive({
      // formulaVisible: false,
      inputForm: {},
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
      data.inputForm[item.dataIndex] = null;
    });

    const recommendPriceUnit = computed(() => {
      return store.getters.getParams?.basicInfoLz?.recommendPriceUnit;
    });

    const slotInputValue = computed(() => {
      return props.globaRecommendPrice.cb ?? null;
    });

    const calcPrice = () => {
      if (useCheckIsEmpty(data.inputForm["cb"])) {
        return GjMessage.warning("请输入美元信息");
      }
      if (data.inputForm["cb"] <= 0) {
        return GjMessage.warning("美元大于0");
      }
      data.needWaiting = true;
      getGlobalPrice({ price: data.inputForm["cb"] })
        .then((res) => {
          res?.data?.forEach((item) => {
            data.inputForm[item.siteCode] = useCheckIsEmpty(item.recommendPrice)
              ? null
              : Number.parseFloat(item.recommendPrice.toFixed(2));
          });
        })
        .finally(() => {
          data.needWaiting = false;
        });
    };

    // const toggleFormula = () => {
    //   data.formulaVisible = !data.formulaVisible;
    // };

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
            tableData.value = [result];
            data.hasReqDone = true;
          })
          .catch(() => {
            tableData.value = [{ cb: 1 }];
          });
      }

      if (bool) {
        columns.forEach((item) => {
          data.inputForm[item.dataIndex] =
            props.globaRecommendPrice[item.dataIndex] ?? null;
        });
      }
    };

    const cancel = () => {
      data.popupVisible = false;
    };

    const sure = () => {
      emit("update:globaRecommendPrice", { ...data.inputForm });
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
      // toggleFormula,
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
.group-popper-class {
  padding: 0;
  .header {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px 16px;
    line-height: 12px;
    span {
      &:first-child {
        color: #000430;
        font-size: 12px;
        flex-grow: 1;
        font-weight: 700;
      }
      &:last-child {
        color: #0045f0;
        cursor: pointer;
      }
    }
  }
  .content {
    padding: 0 16px 20px 16px;
    .form-input-item {
      display: flex;
      width: 500px;
      box-sizing: border-box;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
      & > div {
        width: 242px;
      }
    }
    .formula-image {
      text-align: center;
      img {
        height: 58px;
      }
    }
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
