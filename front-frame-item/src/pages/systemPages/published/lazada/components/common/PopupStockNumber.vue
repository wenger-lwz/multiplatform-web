<template>
  <gj-popover
    trigger="click"
    content-class="stocknumber-popper-class"
    position="bottom"
    :append-to-body="false"
    :popup-visible="popupVisible"
    :update-at-scroll="true"
    :trigger-props="{
      updateAtScroll: true,
    }"
    @popup-visible-change="popupVisibleChange"
  >
    <gj-input placeholder="" hide-button readonly v-model="slotInputValue">
    </gj-input>

    <template #content>
      <div class="header">
        <span>库存</span>
      </div>
      <div class="content">
        <gj-form ref="stockNumberFormRef" :model="inputForm">
          <gj-form-item
            v-for="(item, index) in columns"
            :key="item.dataIndex"
            :label="item.title"
            :field="item.dataIndex"
            :validate-trigger="validateTriggerOpt"
            :rules="item.rules"
          >
            <gj-input-number
              placeholder="请输入"
              allow-clear
              hide-button
              :precision="0"
              :disabled="item.readonly"
              v-model="inputForm[item.dataIndex]"
              @blur="inputBlur(index)"
            >
            </gj-input-number>
          </gj-form-item>
        </gj-form>
      </div>
      <div class="bottom">
        <gj-button size="mini" @click="cancel">取消</gj-button>
        <gj-button size="mini" type="primary" @click="sure">确定</gj-button>
      </div>
    </template>
  </gj-popover>
</template>

<script>
import { reactive, toRefs, computed, ref, watch } from "vue";
import { validateTriggerOpt } from "@common";
import { useCheckIsEmpty } from "@pagesSystem/published/lazada/hooks";

export default {
  props: {
    globalStockNumber: {
      type: Object,
      default: () => {
        return {};
      },
    },
    selectData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  emits: ["update:globalStockNumber", "update"],
  setup(props, { emit }) {
    const data = reactive({
      inputForm: {},
      popupVisible: false,
    });

    const stockNumberFormRef = ref();
    const TOTAL_DATA_INDEX = "total";
    const MY_DATA_INDEX = "my";

    const customValidator = (value, cb) => {
      return new Promise((resolve) => {
        if (useCheckIsEmpty(value)) {
          cb("库存必填");
        }
        if (value === 0) {
          cb("库存大于0");
        }
        resolve();
      });
    };

    const columns = [
      {
        title: "总计",
        dataIndex: TOTAL_DATA_INDEX,
        readonly: false,
      },
      {
        title: "MYR",
        dataIndex: MY_DATA_INDEX,
        rules: [
          {
            required: true,
            validator: (value, cb) => customValidator(value, cb),
          },
        ],
        readonly: true,
        // 马来西亚
      },
      {
        title: "IDR",
        dataIndex: "id",
        rules: [
          {
            required: true,
            validator: (value, cb) => customValidator(value, cb),
          },
        ],
        readonly: true,
      },
      {
        title: "SGD",
        dataIndex: "sg",
        rules: [
          {
            required: true,
            validator: (value, cb) => customValidator(value, cb),
          },
        ],
        readonly: true,
      },
      {
        title: "PHP",
        dataIndex: "ph",
        rules: [
          {
            required: true,
            validator: (value, cb) => customValidator(value, cb),
          },
        ],
        readonly: true,
      },
      {
        title: "THB",
        dataIndex: "th",
        rules: [
          {
            required: true,
            validator: (value, cb) => customValidator(value, cb),
          },
        ],
        readonly: true,
      },
      {
        title: "VND",
        dataIndex: "vn",
        rules: [
          {
            required: true,
            validator: (value, cb) => customValidator(value, cb),
          },
        ],
        readonly: true,
      },
    ];

    const showColumn = computed(() => {
      return columns.filter(
        (item) => props.selectData.indexOf(item.dataIndex) > -1
      );
    });

    columns.forEach((item) => {
      data.inputForm[item.dataIndex] = null;
    });

    const slotInputValue = computed(() => {
      let x = 0;
      Object.keys(data.inputForm).forEach((key) => {
        if (key !== TOTAL_DATA_INDEX && !useCheckIsEmpty(data.inputForm[key])) {
          x++;
        }
      });
      const n = showColumn.value.length;
      return `${x}/${n}`;
    });

    const inputBlur = (index) => {
      setTimeout(() => {
        if (index === 0) {
          const all = data.inputForm[TOTAL_DATA_INDEX];
          const qr = Math.floor(all / 6);
          Object.keys(data.inputForm).forEach((key) => {
            if (key !== TOTAL_DATA_INDEX) {
              data.inputForm[key] = qr;
            }
          });
          data.inputForm[MY_DATA_INDEX] = all - qr * 5;
        }
        stockNumberFormRef.value?.validate();
      }, 0);
    };

    const popupVisibleChange = (bool) => {
      data.popupVisible = bool;
    };

    const cancel = () => {
      data.popupVisible = false;
    };

    const sure = () => {
      stockNumberFormRef.value?.validate().then((res) => {
        if (!res) {
          emit("update:globalStockNumber", { ...data.inputForm });
          emit("update");
          data.popupVisible = false;
        }
      });
    };

    watch(
      () => props.globalStockNumber,
      () => {
        columns.forEach((item) => {
          data.inputForm[item.dataIndex] =
            props.globalStockNumber[item.dataIndex] ?? null;
        });
      },
      {
        deep: true,
      }
    );

    return {
      ...toRefs(data),
      validateTriggerOpt,
      stockNumberFormRef,
      customValidator,
      columns,
      slotInputValue,
      inputBlur,
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
.stocknumber-popper-class {
  padding: 0;
  width: 300px;
  .header {
    padding: 12px 16px 16px;
    line-height: 12px;
    span {
      color: #000430;
      font-size: 12px;
      flex-grow: 1;
      font-weight: 700;
    }
  }
  .content {
    padding: 0 16px 20px 16px;
    .arco-form-item:not(:last-child) {
      margin-bottom: 20px;
    }
    .arco-form-item-wrapper-col {
      position: relative;
    }
    .arco-form-item-message {
      position: absolute;
      bottom: -16px;
      left: 0;
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
