<template>
  <div class="trade-price" id="tradePrice">
    <h2 class="title">批发价</h2>
    <gj-form
      ref="tradePriceFormRef"
      :model="tradePrice"
      class="trade-price-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
    >
      <gj-row :gutter="24">
        <gj-col>
          <gj-button
            v-if="specsType == 2"
            class="add-trade"
            @click="addTradePric"
            shape="round"
            type="outline"
            >添加批发价</gj-button
          >
          <!-- :disabled="isDisabled" -->
        </gj-col>
      </gj-row>
      <template v-if="specsType == 1 || !isDisabled">
        <gj-row :gutter="24" v-if="specsType == 1">
          <gj-col :span="8">
            <gj-form-item
              class="mb16"
              field="price"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="售价"
              :validate-trigger="validateTriggerOpt"
            >
              <gj-input-number
                v-model="tradePrice.price"
                placeholder="请输入"
                allow-clear
                :min="0"
              >
                <template #prefix>{{
                  recommendPriceUnit ? recommendPriceUnit : "$"
                }}</template>
              </gj-input-number>
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item
              class="mb16"
              field="quantity"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="数量"
              :validate-trigger="validateTriggerOpt"
            >
              <gj-input
                v-model="tradePrice.quantity"
                placeholder="请输入"
                allow-clear
                :min="0"
              />
            </gj-form-item>
          </gj-col>
        </gj-row>
        <gj-row :gutter="24">
          <gj-col :span="24">
            <gj-table
              v-if="tradePrice.fromList.length > 0"
              :data-source="tradePrice.fromList"
              :columns="tradePrice.columns"
              row-key="id"
              ref="noteTable"
              :pagination="false"
              class="trade-price-table"
            >
              <template #bodyCell="{ record, index, column }">
                <template v-if="column.dataIndex === 'indexColumn'"
                  >批发价格0{{ index + 1 }}</template
                >
                <template v-if="column.dataIndex === 'minCount'">
                  <gj-form-item
                    hide-label
                    field="minCount"
                    :validate-trigger="['change', 'blur']"
                    :rules="[
                      {
                        validator: (value, cb) =>
                          customMinNumValidator(value, cb, record),
                      },
                    ]"
                  >
                    <gj-input-number
                      v-model="record.minCount"
                      :placeholder="index > 0 ? '上一行的最大数量' : '最小'"
                      :disabled="index > 0 ? true : false"
                      allow-clear
                      :min="1"
                      @change="setValue"
                    />
                  </gj-form-item>
                </template>
                <template v-if="column.dataIndex === 'maxCount'">
                  <gj-form-item
                    hide-label
                    field="maxCount"
                    :validate-trigger="['change', 'input', 'blur']"
                    :rules="[
                      {
                        validator: (value, cb) =>
                          customMaxNumValidator(value, cb, record),
                      },
                    ]"
                  >
                    <gj-input-number
                      v-model="record.maxCount"
                      :placeholder="index > 0 ? '最大' : '最大'"
                      allow-clear
                      :min="1"
                      @change="setValue"
                    />
                  </gj-form-item>
                </template>
                <template v-if="column.dataIndex === 'unitPrice'">
                  <gj-form-item
                    hide-label
                    field="unitPrice"
                    :validate-trigger="['change', 'blur']"
                    :rules="[
                      {
                        validator: (value, cb) =>
                          customUnitPriceValidator(value, cb, record),
                      },
                    ]"
                  >
                    <gj-input-number
                      v-model="record.unitPrice"
                      placeholder="请输入"
                      allow-clear
                      :min="0"
                    />
                  </gj-form-item>
                </template>
                <template v-if="column.dataIndex === 'action'">
                  <template
                    v-if="
                      tradePrice.fromList.length >= MAX_KEY_LENGTH &&
                      showTooltip
                    "
                  >
                    <gj-tooltip
                      content="最多可添加5个批发价"
                      position="top"
                      background-color="#fdf2ea"
                      :content-style="{
                        color: '#ee7c30',
                      }"
                    >
                      <div :class="index >= 1 ? '' : 'btn-svg'">
                        <SvgIcon
                          svgClass="addTitle"
                          :width="24"
                          @click="addSingleTradePric"
                          v-show="index === tradePrice.fromList.length - 1"
                        ></SvgIcon
                        ><SvgIcon
                          v-show="tradePrice.fromList.length > 1"
                          svgClass="subtract"
                          :width="24"
                          @click="removeSingleTradePric(index)"
                        ></SvgIcon>
                      </div>
                    </gj-tooltip>
                  </template>
                  <template v-if="tradePrice.fromList.length < MAX_KEY_LENGTH">
                    <div :class="index >= 1 ? '' : 'btn-svg'">
                      <SvgIcon
                        svgClass="addTitle"
                        :width="24"
                        @click="addSingleTradePric"
                        v-show="index === tradePrice.fromList.length - 1"
                      ></SvgIcon
                      ><SvgIcon
                        v-show="tradePrice.fromList.length > 1"
                        svgClass="subtract"
                        :width="24"
                        @click="removeSingleTradePric(index)"
                      ></SvgIcon>
                    </div>
                  </template>
                </template>
              </template>
            </gj-table>
          </gj-col>
        </gj-row>
      </template>
    </gj-form>
  </div>
</template>

<script>
import {
  getCurrentInstance,
  reactive,
  toRefs,
  onMounted,
  defineComponent,
  computed,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import SvgIcon from "@/components/SvgIcon";
import { validateTriggerOpt, createUuid } from "@common";
const MAX_KEY_LENGTH = 5;

export default defineComponent({
  inheritAttrs: false,
  props: {
    type: {
      type: [String, Number],
      default: () => {
        return "";
      },
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  emits: ["site-change"],
  components: {
    SvgIcon,
  },
  setup(props) {
    const store = useStore();
    const key = "tradePrice";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      MAX_KEY_LENGTH,
      showTooltip: false,
      [key]: {
        price: "",
        quantity: "",
        fromList: [
          {
            id: 0,
            minCount: "",
            maxCount: "",
            unitPrice: "",
          },
        ],
        columns: [
          {
            title: "",
            dataIndex: "indexColumn",
            width: 110,
          },
          {
            title: "最小数量",
            dataIndex: "minCount",
          },
          {
            title: "最大数量",
            dataIndex: "maxCount",
          },
          {
            title: "单价",
            dataIndex: "unitPrice",
          },
          {
            title: "",
            dataIndex: "action",
          },
        ],
      },
      type: props.type,
      isDisabled: true,
    });

    const recommendPriceUnit = computed(() => {
      return store.getters.getParams?.basicInfo?.recommendPriceUnit;
    });

    const specsType = computed(() => {
      return store.getters.getParams?.productInfo?.specsType;
    });

    const rules = {
      price: [{ required: true, message: "售价必填" }],
      quantity: [{ required: true, message: "数量必填" }],
    };

    const addTradePric = () => {
      data.isDisabled = false;
    };

    const addSingleTradePric = () => {
      if (data.tradePrice?.fromList?.length >= MAX_KEY_LENGTH) {
        return;
      }

      data.tradePrice.fromList.push({
        id: createUuid(),
        minCount: "",
        maxCount: "",
        unitPrice: "",
      });
      data.tradePrice.fromList = [...data.tradePrice.fromList];

      nextTick(() => {
        data.showTooltip = true;
        setValue();
      });
    };

    const removeSingleTradePric = (index) => {
      data.tradePrice.fromList.splice(index, 1);
      data.tradePrice.fromList = [...data.tradePrice.fromList];
      nextTick(() => {
        setValue();
      });
    };

    const setValue = () => {
      const list = data.tradePrice.fromList;
      if (data.tradePrice.fromList.length > 1) {
        let i = 0;
        for (i; i < data.tradePrice.fromList.length; i++) {
          if (list[i].minCount && !list[i].maxCount) {
            list[i + 1].minCount = list[i].minCount;
          } else if (i == data.tradePrice.fromList.length - 1) {
            return false;
          } else {
            list[i + 1].minCount = list[i].maxCount;
          }
        }
        data.tradePrice.fromList = [...list];
      }
    };

    const customUnitPriceValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        if (data.tradePrice.price && record.unitPrice > data.tradePrice.price) {
          cb("单价不能大于售价");
        }
        resolve();
      });
    };

    const customMaxNumValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        if (record.minCount && record.maxCount < record.minCount) {
          cb("最大数量必须大于最小数量");
        }
        resolve();
      });
    };

    const customMinNumValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        if (record.maxCount && record.minCount > record.maxCount) {
          cb("最小数量必须小于最大数量");
        }
        resolve();
      });
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "tradePriceFormRef");
    };
    const validate = () => {
      return proxy.$refs.tradePriceFormRef.validate();
    };
    const resetFields = () => {
      proxy.$refs.tradePriceFormRef.resetFields();
    };

    const setPageData = (respData) => {
      data[key].price = respData.recommendPrice;
      data[key].quantity = respData.piecesQuantity;

      if (respData.wholeSaleList && respData.wholeSaleList.length > 0) {
        data.tradePrice.fromList = respData.wholeSaleList.map((item) => {
          return {
            id: createUuid(),
            minCount: item.minCount,
            maxCount: item.maxCount,
            unitPrice: item.unitPrice,
          };
        });
      }

      saveStoreData();
    };

    const saveStoreData = () => {
      // 将数据保存store
      const params = {
        [key]: data[key],
      };
      store.commit(M_T.PARAMS_QUERY, params);
    };

    onMounted(() => {});
    return {
      ...toRefs(data),
      rules,
      validateTriggerOpt,
      submitForm,
      validate,
      resetFields,
      setPageData,
      recommendPriceUnit,
      addTradePric,
      addSingleTradePric,
      removeSingleTradePric,
      specsType,
      setValue,
      customUnitPriceValidator,
      customMaxNumValidator,
      customMinNumValidator,
      saveStoreData,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
.trade-price .addTitle {
  margin-right: 8px;
}
.trade-price {
  /deep/.surely-table-bordered {
    border-bottom: 0;
  }
  .btn-svg {
    margin-left: 0;
  }
}
.add-trade {
  margin: 5px 0 15px;
}
/deep/.trade-price-table {
  color: #000430;

  .surely-table-header {
    border: 1px solid #e6e6ed;
    border-bottom: 0;
    border-radius: 8px 8px 0 0;
  }
  .surely-table-header-container .surely-table-header-cell {
    // height: 32px !important;
    font-weight: 700;
    background-color: #f2f2f5;
    .surely-table-cell-box:before {
      width: 0;
    }
  }
  .surely-table-body {
    border: 1px solid #e6e6ed;
    border-bottom: 0;
    border-radius: 0 0 8px 8px;
  }
}
</style>
