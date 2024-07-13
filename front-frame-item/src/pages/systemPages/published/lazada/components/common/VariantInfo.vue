<template>
  <div class="variant-info">
    <gj-form
      ref="variantRef"
      :model="model"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div class="mb8">
        <gj-form-item>
          <gj-table
            class="table-full-width"
            row-key="key"
            bordered
            :data-source="tableData"
            :columns="variantTableColumns1"
            :pagination="false"
            :scroll="{ x: 'auto', y: 200 }"
          >
            <template #bodyCell="{ record, column }">
              <template v-if="column.key === 'properteyName'">
                <div class="sale-prop-select">
                  <gj-select
                    class="sale-prop-item-select"
                    placeholder="选择"
                    v-model="salePropSelect[record.key]"
                    :trigger-props="{
                      autoFitPopupMinWidth: true,
                      updateAtScroll: true,
                    }"
                    @change="
                      (value) => {
                        keyChange(value, record);
                      }
                    "
                  >
                    <gj-option
                      v-for="it in salePropItem"
                      :value="it.attributeId"
                      :key="it.attributeId"
                      :disabled="it.disabled"
                      >{{ it.label }}</gj-option
                    >
                  </gj-select>
                </div>
              </template>

              <template v-if="column.key === 'properteyValue'">
                <gj-tag
                  size="large"
                  class="value-tag"
                  closable
                  v-for="(item, index) in tagValueList[record.key]"
                  :key="item"
                  @close="tagDelete(index, record)"
                  ><gb-text>{{ item }}</gb-text>
                </gj-tag>
                <gj-button
                  type="text"
                  @click="addTableValueCloum(record)"
                  v-if="!addValueColumnBtnShowMap[record.key]"
                  >添加属性值</gj-button
                >
                <gj-select
                  class="sale-prop-select w-127"
                  placeholder="按回车完成输入"
                  maxlength="20"
                  allow-create
                  v-if="addValueColumnBtnShowMap[record.key]"
                  :trigger-props="{
                    autoFitPopupMinWidth: true,
                    updateAtScroll: true,
                  }"
                  @change="
                    (value) => {
                      valueChange(value, record);
                    }
                  "
                >
                  <gj-option
                    v-for="it in salePropValue[record.key]"
                    :value="it.name"
                    :key="it.name"
                    :disabled="it.disabled"
                    >{{ it.name }}</gj-option
                  >
                </gj-select>
              </template>

              <template v-if="column.key === 'action'">
                <div>
                  <template
                    v-if="tableData.length >= MAX_KEY_LENGTH && showTooltip"
                  >
                    <gj-tooltip
                      content="当前只能添加两个属性，需删除一个方可添加"
                      position="top"
                      background-color="#FDF2EA"
                      :content-style="{
                        color: '#EE7C30',
                      }"
                    >
                      <SvgIcon
                        @click="addTableRow(record)"
                        svgClass="addTitle"
                        :width="24"
                      ></SvgIcon>
                    </gj-tooltip>
                  </template>
                  <template v-if="tableData.length < MAX_KEY_LENGTH">
                    <SvgIcon
                      @click="addTableRow(record)"
                      svgClass="addTitle"
                      :width="24"
                    ></SvgIcon>
                  </template>
                  <SvgIcon
                    @click="subTableRow(record.key)"
                    svgClass="subtract"
                    :width="24"
                    v-if="tableData.length > 1"
                  ></SvgIcon>
                </div>
              </template>
            </template>
          </gj-table>
        </gj-form-item>
      </div>
      <div class="mb16">
        <gj-row :gutter="24">
          <gj-col :span="7">
            <gj-form-item
              field="people"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="建议售价"
            >
              <gj-input-number
                placeholder="请输入"
                allow-clear
                :precision="2"
                :max="MAX_NUM_15"
                :hide-button="true"
                v-model="batchMap.recommendPrice"
              >
                <template #prefix> {{ recommendPriceUnit }} </template>
              </gj-input-number>
            </gj-form-item>
          </gj-col>
          <gj-col :span="7">
            <gj-form-item
              field="people"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="包装重量"
            >
              <gj-input-number
                :precision="3"
                :max="MAX_NUM_20"
                :hide-button="true"
                v-model="batchMap.logisticsWeight"
                placeholder="请输入"
                allow-clear
              >
                <template #suffix> kg </template>
              </gj-input-number>
            </gj-form-item>
          </gj-col>
          <gj-col :span="10">
            <gj-form-item
              field="people"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="尺寸(单位：CM)"
            >
              <gj-input-number
                placeholder="请输入"
                :precision="3"
                :max="MAX_NUM_110"
                :hide-button="true"
                v-model="batchMap.logisticsSizeLong"
              >
                <template #prefix> 长 </template>
              </gj-input-number>
              <span class="input-seperate">*</span>
              <gj-input-number
                placeholder="请输入"
                :precision="3"
                :max="MAX_NUM_110"
                :hide-button="true"
                v-model="batchMap.logisticsSizeWide"
              >
                <template #prefix> 宽 </template>
              </gj-input-number>
              <span class="input-seperate">*</span>
              <gj-input-number
                placeholder="请输入"
                :precision="3"
                :max="MAX_NUM_110"
                :hide-button="true"
                v-model="batchMap.logisticsSizeHigh"
              >
                <template #prefix> 高 </template>
              </gj-input-number>
              <gj-button type="text" @click="batchInput">批量录入</gj-button>
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>
      <div class="mb16" v-show="showTableTwo">
        <a-table
          class="table-full-width"
          row-key="rowsKey"
          :scroll="{ x: 'auto', y: 200 }"
          :columns="table2Columns"
          :data="variantTableData"
          :pagination="false"
          :row-selection="rowSelection"
          @selection-change="selectionChange"
        />
      </div>
    </gj-form>
  </div>
</template>

<script>
// 变体
import {
  reactive,
  toRefs,
  nextTick,
  watch,
  computed,
  getCurrentInstance,
  defineComponent,
  resolveComponent,
} from "vue";
import { useStore } from "vuex";
import { M_T } from "@/store/mutationsTypes";
import { GjMessage } from "@gj/atom";
import { getSkuRule } from "@/api/public";
import { emptyFilter } from "@/utils/format";
import { Table } from "@arco-design/web-vue";
import "@arco-design/web-vue/es/table/style/index.css";
import SvgIcon from "@/components/SvgIcon";
import PopupRecommendPrice from "./PopupRecommendPrice.vue";
import PopupPrice from "./PopupPrice.vue";
import PopupStockNumber from "./PopupStockNumber.vue";

import { setForm2 } from "@/utils/fnBusiness";
import {
  calcDescartes,
  tranStrToNumber,
  validateTriggerOpt,
} from "@/utils/common";
import { variantTableColumns1 } from "@pagesSystem/published/lazada/config";
import { useCheckIsEmpty } from "@pagesSystem/published/lazada/hooks";

const MAX_VALUE_LENGTH = 20;
const MAX_KEY_LENGTH = 2;
const DEFAULT_RADIO_STATUS = true;
let count = 2;
let count2 = 1;
const MAX_NUM_15 = Number("9".repeat(15)) - 0.01;

const MAX_NUM_20 = 20;
const MAX_NUM_110 = 110;

export default defineComponent({
  props: {
    pageType: {
      type: String,
      default: () => {
        return "";
      },
    },
    relatedSkus: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selectData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    aTable: Table,
    SvgIcon,
    /* eslint-disable */
    PopupRecommendPrice,
    PopupPrice,
    PopupStockNumber,
    /* eslint-enable */
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const key = "variantInfoLz";
    const store = useStore();
    const data = reactive({
      tableData: [{ key: 1 }],
      model: {},
      showTooltip: false,
      salePropItem: [],
      salePropSelect: {},
      addValueColumnBtnShowMap: {},
      tagValueList: {},
      salePropValue: {},
      variantTableData: [],
      customColumns: [],
      rowSelection: {
        type: "checkbox",
        showCheckedAll: true,
        selectedRowKeys: [],
      },
    });

    const state = reactive({
      batchMap: {
        recommendPrice: null,
        logisticsWeight: null,
        logisticsSizeLong: null,
        logisticsSizeWide: null,
        logisticsSizeHigh: null,
      },
    });

    const GbText = resolveComponent("GbText");

    const recommendPriceUnit = computed(() => {
      return store.getters.getParams?.basicInfoLz?.recommendPriceUnit;
    });

    const isSiteIdCB = computed(() => {
      return store.getters.getParams?.basicInfoLz?.siteId === "cb";
    });

    const customValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!record.sku) {
            cb("SKU必填");
          }
          resolve();
        }, 0);
      });
    };
    const customRPValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (isSiteIdCB.value) {
            if (useCheckIsEmpty(record.globalPrice?.cb)) {
              cb("售价必填");
            }
            if (record.globalPrice?.cb <= 0) {
              cb("售价大于0");
            }
          } else {
            if (useCheckIsEmpty(record.recommendPrice)) {
              cb("售价必填");
            }
            if (record.recommendPrice <= 0) {
              cb("售价大于0");
            }
          }

          resolve();
        }, 0);
      });
    };
    const customShopSkuValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!record.msku) {
            cb("店铺SKU必填");
          }
          resolve();
        }, 0);
      });
    };
    const customPromotionPriceValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (isSiteIdCB.value) {
            if (useCheckIsEmpty(record.globalpromotionPrice?.cb)) {
              cb("促销价必填");
            }
            if (record.globalpromotionPrice?.cb <= 0) {
              cb("促销价大于0");
            }
            if (record.globalPrice?.cb <= record.globalpromotionPrice?.cb) {
              cb("促销价小于售价");
            }
          } else {
            if (useCheckIsEmpty(record.recomendPrice)) {
              cb("促销价必填");
            }
            if (record.recomendPrice <= 0) {
              cb("促销价大于0");
            }
            if (record.recommendPrice <= record.recomendPrice) {
              cb("促销价小于售价");
            }
          }
          resolve();
        }, 0);
      });
    };
    const customRemainNumValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (isSiteIdCB.value) {
            if (
              props.selectData.find((item) => !record.globalStockNumber?.[item])
            ) {
              cb("库存必填且大于0");
            }
          } else {
            if (useCheckIsEmpty(record.quantity)) {
              cb("库存必填");
            }
            if (record.quantity <= 0) {
              cb("库存大于0");
            }
          }
          resolve();
        }, 0);
      });
    };
    const customLogWeightValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (useCheckIsEmpty(record.logisticsWeight)) {
            cb("包装重量必填");
          }
          if (record.logisticsWeight <= 0) {
            cb("包装重量大于0");
          }
          resolve();
        }, 0);
      });
    };
    const customLogisticValidator = (value, cb, record) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (
            useCheckIsEmpty(record.logisticsSizeLong) ||
            useCheckIsEmpty(record.logisticsSizeWide) ||
            useCheckIsEmpty(record.logisticsSizeHigh)
          ) {
            cb("包装尺寸必填");
          }
          if (
            record.logisticsSizeLong <= 0 ||
            record.logisticsSizeWide <= 0 ||
            record.logisticsSizeHigh <= 0
          ) {
            cb("包装尺寸大于0");
          }
          resolve();
        }, 0);
      });
    };

    // sku禁用
    const getSkuDisabled = (value) => {
      let disabledFlag = false;
      for (let i = 0; i < data.variantTableData.length; i++) {
        if (
          data.variantTableData[i].sku &&
          data.variantTableData[i].sku.indexOf(value) > -1
        ) {
          disabledFlag = true;
          break;
        }
      }
      return disabledFlag;
    };

    const skuRule = () => {
      const shopCode = store.getters.getParams?.basicInfoLz?.shopId;
      getSkuRule({
        platformCode: "LAZADA",
        shopCode,
        variantCount: data.variantTableData.length,
      })
        .then((res) => {
          const list = [...data.variantTableData];
          list.forEach((item, index) => {
            item.msku = res.data?.sonRuleStr?.[index];
          });
          data.variantTableData = [...list];
        })
        .finally(() => {
          // 校验必填
          proxy.$refs.variantRef.validateField("msku");
        });
    };

    const skuColumn = {
      title: () => {
        return (
          <div>
            <span class="require-symbol">*</span>关联SKU
          </div>
        );
      },
      dataIndex: "sku",
      width: 200,
      render({ record, rowIndex }) {
        return (
          <gj-form-item
            hide-label
            field="sku"
            rules={[
              {
                required: true,
                validator: (value, cb) => customValidator(value, cb, record),
              },
            ]}
            validate-trigger={validateTriggerOpt}
            label-col-style={{ "justify-content": "flex-start" }}
          >
            <gj-select
              v-model={data.variantTableData[rowIndex].sku}
              placeholder="请选择"
              trigger-props={{
                autoFitPopupMinWidth: true,
                updateAtScroll: true,
              }}
              allow-clear
              onClear={() => clearSku(rowIndex)}
            >
              {props.relatedSkus?.map((skuItem) => {
                return (
                  <gj-option
                    key={skuItem.sku}
                    value={skuItem.sku}
                    disabled={() => getSkuDisabled(skuItem.sku)}
                  >
                    {skuItem.sku}-{skuItem.skuName}
                  </gj-option>
                );
              })}
            </gj-select>
          </gj-form-item>
        );
      },
    };

    const taxesColumn = {
      title: "Taxes",
      dataIndex: "taxes",
      width: 130,
      render({ rowIndex }) {
        return (
          <gj-select
            placeholder="请选择"
            allow-clear
            trigger-props={{
              updateAtScroll: true,
            }}
            v-model={data.variantTableData[rowIndex].taxes}
          >
            <gj-option>default</gj-option>
          </gj-select>
        );
      },
    };

    const availabilityColumn = {
      title: "商品状态",
      dataIndex: "availability",
      width: 110,
      fixed: "right",
      render({ rowIndex }) {
        return (
          <gj-switch
            checked-color="#1f6eef"
            unchecked-color="#e4e5e6"
            v-model={data.variantTableData[rowIndex].availability}
          ></gj-switch>
        );
      },
    };

    const variantColumns = [
      {
        title: "建议售价",
        dataIndex: "recommendPrice",
        width: 200,
        render({ rowIndex }) {
          if (isSiteIdCB.value) {
            return (
              <PopupRecommendPrice
                v-model={[
                  data.variantTableData[rowIndex].globaRecommendPrice,
                  "globaRecommendPrice",
                ]}
              />
            );
          } else {
            const slot = {
              prefix: () => recommendPriceUnit.value,
            };
            return (
              <gj-input-number
                precision={2}
                max={MAX_NUM_15}
                v-model={data.variantTableData[rowIndex].recommendPrice}
                placeholder="请输入"
                hide-button={true}
                v-slots={slot}
                allow-clear
              ></gj-input-number>
            );
          }
        },
      },
      skuColumn,
      {
        title: "包装重量",
        dataIndex: "logisticsWeight",
        width: 120,
        render({ rowIndex }) {
          const slot = {
            suffix: () => "kg",
          };
          return (
            <gj-input-number
              placeholder="请输入"
              allow-clear
              precision={3}
              max={MAX_NUM_20}
              hide-button={true}
              v-slots={slot}
              v-model={data.variantTableData[rowIndex].logisticsWeight}
              disabled={
                isSiteIdCB.value ? (rowIndex > 0 ? true : false) : false
              }
              onChange={() => changeInputNumber("logisticsWeight")}
            ></gj-input-number>
          );
        },
      },
      {
        title: "包装尺寸(单位：CM)",
        dataIndex: "logisticsSize",
        width: 350,
        render({ rowIndex }) {
          const slotLong = {
            prefix: () => "长",
          };
          const slotWide = {
            prefix: () => "宽",
          };
          const slotHeight = {
            prefix: () => "高",
          };
          return (
            <div>
              <gj-input-number
                class="w-90"
                placeholder="请输入"
                allow-clear
                precision={3}
                max={MAX_NUM_110}
                hide-button={true}
                v-slots={slotLong}
                disabled={
                  isSiteIdCB.value ? (rowIndex > 0 ? true : false) : false
                }
                v-model={data.variantTableData[rowIndex].logisticsSizeLong}
                onChange={() => changeInputNumber("logisticsSizeLong")}
              ></gj-input-number>
              <span class="input-seperate">*</span>
              <gj-input-number
                class="w-90"
                placeholder="请输入"
                allow-clear
                precision={3}
                max={MAX_NUM_110}
                hide-button={true}
                v-slots={slotWide}
                disabled={
                  isSiteIdCB.value ? (rowIndex > 0 ? true : false) : false
                }
                v-model={data.variantTableData[rowIndex].logisticsSizeWide}
                onChange={() => changeInputNumber("logisticsSizeWide")}
              ></gj-input-number>
              <span class="input-seperate">*</span>

              <gj-input-number
                class="w-90"
                placeholder="请输入"
                allow-clear
                precision={3}
                max={MAX_NUM_110}
                hide-button={true}
                v-slots={slotHeight}
                disabled={
                  isSiteIdCB.value ? (rowIndex > 0 ? true : false) : false
                }
                v-model={data.variantTableData[rowIndex].logisticsSizeHigh}
                onChange={() => changeInputNumber("logisticsSizeHigh")}
              ></gj-input-number>
            </div>
          );
        },
      },
      taxesColumn,
      availabilityColumn,
    ];

    const variantColumnsDraft = [
      {
        title: () => {
          return (
            <div>
              <span class="require-symbol">*</span>售价
              <span>({recommendPriceUnit.value})</span>
            </div>
          );
        },
        dataIndex: "recommendPrice",
        width: 120,
        render({ rowIndex, record }) {
          return (
            <gj-form-item
              hide-label
              field="recommendPrice2"
              rules={[
                {
                  required: true,
                  validator: (value, cb) =>
                    customRPValidator(value, cb, record),
                },
              ]}
              validate-trigger={validateTriggerOpt}
              label-col-style={{ "justify-content": "flex-start" }}
            >
              {isSiteIdCB.value ? (
                <PopupPrice
                  showItemName="globalPrice"
                  v-model={[
                    data.variantTableData[rowIndex].globalPrice,
                    "globalPrice",
                  ]}
                  v-model={[
                    data.variantTableData[rowIndex].globalpromotionPrice,
                    "globalpromotionPrice",
                  ]}
                  onUpdate={updateGlobalPrice}
                />
              ) : (
                <gj-input-number
                  placeholder="请输入"
                  allow-clear
                  precision={2}
                  max={MAX_NUM_15}
                  hide-button={true}
                  v-model={data.variantTableData[rowIndex].recommendPrice}
                ></gj-input-number>
              )}
            </gj-form-item>
          );
        },
      },
      {
        title: () => {
          return (
            <div>
              <span class="require-symbol">*</span>店铺SKU
              <gj-button type="text" size="mini" readonly onClick={skuRule}>
                自动生成
              </gj-button>
            </div>
          );
        },
        dataIndex: "msku",
        width: 160,
        render({ rowIndex, record }) {
          return (
            <gj-form-item
              hide-label
              field="msku"
              rules={[
                {
                  required: true,
                  validator: (value, cb) =>
                    customShopSkuValidator(value, cb, record),
                },
              ]}
              validate-trigger={validateTriggerOpt}
              label-col-style={{ "justify-content": "flex-start" }}
            >
              <gj-input
                placeholder="请输入"
                allow-clear
                hide-button={true}
                v-model={data.variantTableData[rowIndex].msku}
              ></gj-input>
            </gj-form-item>
          );
        },
      },
      skuColumn,
      {
        title: () => {
          let headerNode = null;
          if (isSiteIdCB.value) {
            headerNode = <span class="require-symbol">*</span>;
          }
          return <div>{headerNode}促销价</div>;
        },
        dataIndex: "recomendPrice",
        width: 120,
        render({ rowIndex, record }) {
          return (
            <gj-form-item
              hide-label
              field="recomendPrice"
              rules={
                isSiteIdCB.value
                  ? [
                      {
                        required: true,
                        validator: (value, cb) =>
                          customPromotionPriceValidator(value, cb, record),
                      },
                    ]
                  : null
              }
              validate-trigger={validateTriggerOpt}
              label-col-style={{ "justify-content": "flex-start" }}
            >
              {isSiteIdCB.value ? (
                <PopupPrice
                  showItemName="globalpromotionPrice"
                  v-model={[
                    data.variantTableData[rowIndex].globalPrice,
                    "globalPrice",
                  ]}
                  v-model={[
                    data.variantTableData[rowIndex].globalpromotionPrice,
                    "globalpromotionPrice",
                  ]}
                  onUpdate={updateGlobalPrice}
                />
              ) : (
                <gj-input-number
                  placeholder="请输入"
                  allow-clear
                  precision={2}
                  max={MAX_NUM_15}
                  hide-button={true}
                  v-model={data.variantTableData[rowIndex].recomendPrice}
                ></gj-input-number>
              )}
            </gj-form-item>
          );
        },
      },
      {
        title: () => {
          return (
            <div>
              <span class="require-symbol">*</span>库存
            </div>
          );
        },
        dataIndex: "remainNumber",
        width: 120,
        render({ rowIndex, record }) {
          return (
            <gj-form-item
              hide-label
              field="remainNumber"
              rules={[
                {
                  required: true,
                  validator: (value, cb) =>
                    customRemainNumValidator(value, cb, record),
                },
              ]}
              validate-trigger={validateTriggerOpt}
              label-col-style={{ "justify-content": "flex-start" }}
            >
              {isSiteIdCB.value ? (
                <PopupStockNumber
                  selectData={props.selectData}
                  v-model={[
                    data.variantTableData[rowIndex].globalStockNumber,
                    "globalStockNumber",
                  ]}
                  onUpdate={updateGlobalStockNumber}
                />
              ) : (
                <gj-input-number
                  placeholder="请输入"
                  allow-clear
                  precision={0}
                  hide-button={true}
                  v-model={data.variantTableData[rowIndex].quantity}
                ></gj-input-number>
              )}
            </gj-form-item>
          );
        },
      },
      {
        title: () => {
          return (
            <div>
              <span class="require-symbol">*</span>包装重量
            </div>
          );
        },
        dataIndex: "logisticsWeight2",
        width: 120,
        render({ rowIndex, record }) {
          const slot = {
            suffix: () => "kg",
          };
          return (
            <gj-form-item
              hide-label
              field="logisticsWeight2"
              rules={[
                {
                  required: true,
                  validator: (value, cb) =>
                    customLogWeightValidator(value, cb, record),
                },
              ]}
              validate-trigger={validateTriggerOpt}
              label-col-style={{ "justify-content": "flex-start" }}
            >
              <gj-input-number
                placeholder="请输入"
                allow-clear
                precision={3}
                max={MAX_NUM_20}
                hide-button={true}
                v-slots={slot}
                disabled={
                  isSiteIdCB.value ? (rowIndex > 0 ? true : false) : false
                }
                v-model={data.variantTableData[rowIndex].logisticsWeight}
                onChange={() => changeInputNumber("logisticsWeight")}
              ></gj-input-number>
            </gj-form-item>
          );
        },
      },
      {
        title: () => {
          return (
            <div>
              <span class="require-symbol">*</span>包装尺寸(CM)
            </div>
          );
        },
        dataIndex: "logisticsSize2",
        width: 320,
        render({ rowIndex, record }) {
          const slotLong = {
            prefix: () => "长",
          };
          const slotWide = {
            prefix: () => "宽",
          };
          const slotHeight = {
            prefix: () => "高",
          };
          return (
            <gj-form-item
              hide-label
              field="logisticsSize2"
              rules={[
                {
                  required: true,
                  validator: (value, cb) =>
                    customLogisticValidator(value, cb, record),
                },
              ]}
              validate-trigger={validateTriggerOpt}
              label-col-style={{ "justify-content": "flex-start" }}
            >
              <gj-input-number
                class="w-90"
                placeholder="请输入"
                allow-clear
                precision={3}
                max={MAX_NUM_110}
                hide-button={true}
                disabled={
                  isSiteIdCB.value ? (rowIndex > 0 ? true : false) : false
                }
                v-slots={slotLong}
                v-model={data.variantTableData[rowIndex].logisticsSizeLong}
                onChange={() => changeInputNumber("logisticsSizeLong")}
              ></gj-input-number>
              <span class="input-seperate">*</span>
              <gj-input-number
                class="w-90"
                placeholder="请输入"
                allow-clear
                precision={3}
                max={MAX_NUM_110}
                hide-button={true}
                disabled={
                  isSiteIdCB.value ? (rowIndex > 0 ? true : false) : false
                }
                v-slots={slotWide}
                v-model={data.variantTableData[rowIndex].logisticsSizeWide}
                onChange={() => changeInputNumber("logisticsSizeWide")}
              ></gj-input-number>
              <span class="input-seperate">*</span>
              <gj-input-number
                class="w-90"
                placeholder="请输入"
                allow-clear
                precision={3}
                max={MAX_NUM_110}
                hide-button={true}
                disabled={
                  isSiteIdCB.value ? (rowIndex > 0 ? true : false) : false
                }
                v-slots={slotHeight}
                v-model={data.variantTableData[rowIndex].logisticsSizeHigh}
                onChange={() => changeInputNumber("logisticsSizeHigh")}
              ></gj-input-number>
            </gj-form-item>
          );
        },
      },
      {
        title: "Lazada SKU",
        dataIndex: "lazadaSku",
        width: 120,
        render({ record }) {
          return <gb-text>{emptyFilter(record.lazadaSku)}</gb-text>;
        },
      },
      taxesColumn,
      availabilityColumn,
    ];

    const table2Columns = computed(() => {
      let temp = variantColumnsDraft;
      // 在线商品的创建编辑页新增Lazada SKU字段
      if (props.pageType !== "online") {
        const index = temp.findIndex((item) => item.dataIndex === "lazadaSku");
        if (index > -1) {
          temp.splice(index, 1);
        }
      }
      return [
        ...data.customColumns,
        ...(props.pageType ? temp : variantColumns),
      ];
    });

    const showTableTwo = computed(() => {
      const keyList = Object.keys(data.salePropSelect);
      let flag = false;
      for (let i = 0; i < keyList.length; i++) {
        // key  value
        if (
          data.salePropSelect[keyList[i]] &&
          data.tagValueList[keyList[i]] &&
          data.tagValueList[keyList[i]].length > 0
        ) {
          flag = true;
          break;
        }
      }
      return flag;
    });

    // 设置value disabled
    watch(
      () => data.tagValueList,
      () => {
        Object.keys(data.tagValueList).forEach((key) => {
          data.salePropValue[key]?.forEach((item) => {
            const flag = data.tagValueList[key]?.indexOf(item.name) > -1;
            if (flag) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
          });
        });
      },
      { deep: true, immediate: true }
    );

    // 设置key disabled
    const setKeyDisabled = () => {
      const values = Object.values(data.salePropSelect);
      data.salePropItem.forEach((item) => {
        if (values.indexOf(item.attributeId) > -1) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    };

    const setSalePropValue = () => {
      Object.keys(data.salePropSelect).forEach((key) => {
        // 下拉框的值
        data.salePropValue[key] =
          data.salePropItem.find(
            (it) => it.attributeId === data.salePropSelect[key]
          )?.options || [];
        // 设置disabled
        data.salePropValue[key].forEach((item) => {
          const flag = data.tagValueList[key]?.indexOf(item.name) > -1;
          if (flag) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
      });
    };

    watch(
      () => store.getters.getProperty?.salePropItem,
      (val) => {
        data.salePropItem = JSON.parse(JSON.stringify(val || []));
        if (data.salePropItem.length > 0) {
          setKeyDisabled();
          setSalePropValue();
        }
      },
      { deep: true, immediate: true }
    );

    // 设置table2数据
    const createDkrTable = () => {
      // 重新构建全量DKR
      const customColumnsOld = JSON.parse(JSON.stringify(data.customColumns));
      data.customColumns = [];
      if (!showTableTwo.value) {
        return;
      }
      const keysList = Object.keys(data.salePropSelect);
      for (let index = 0; index < keysList.length; index++) {
        const element = keysList[index];
        if (
          data.salePropSelect[element] &&
          data.tagValueList[element] &&
          data.tagValueList[element].length > 0
        ) {
          let target = data.salePropSelect[element];
          // data.salePropItem 可能为空
          if (data.salePropItem.length > 0) {
            target = data.salePropItem.find(
              (item) => item.attributeId === target
            );
          } else {
            target = customColumnsOld?.find((item) => item.attrId === target);
          }

          data.customColumns.push({
            label: target?.label,
            attrNames: target.name,
            width: 130,
            minWidth: 130,
            dataIndex: target?.label,
            title: target?.label,
            customValue: data.tagValueList[element],
            render: ({ record }) => <GbText>{record[target?.label]}</GbText>,
          });
        }
      }
      const getRowsData = (_descarteItem, _oldData) => {
        for (let index = 0; index < _oldData.length; index++) {
          const element = _oldData[index];
          const keys = Object.keys(_descarteItem);
          for (let j = 0; j < keys.length; j++) {
            const keyItem = keys[j];
            if (element[keyItem] !== _descarteItem[keyItem]) {
              break;
            }
            if (j === keys.length - 1) {
              return { rowsKey: element.rowsKey, sourceData: element };
            }
          }
        }
        return {
          rowsKey: `${count2++}_rowskey`,
          sourceData: {
            msku: "",
            recommendPrice: null,
            sku: "",
            logisticsWeight: null,
            logisticsSizeLong: null,
            logisticsSizeWide: null,
            logisticsSizeHigh: null,
            taxes: "",
            availability: DEFAULT_RADIO_STATUS, // set DEFAULT_RADIO_STATUS
            globaRecommendPrice: {},
            globalStockNumber: {},
            globalPrice: {},
            globalpromotionPrice: {},
          },
        };
      };
      const oldData = JSON.parse(JSON.stringify(data.variantTableData));
      let result = [];
      const list = data.customColumns.map((item) => item.customValue);
      let dkrTableData = calcDescartes(list);
      for (let i = 0; i < dkrTableData.length; i++) {
        const descarteValue = dkrTableData[i];
        if (descarteValue) {
          const descarteItem = {};
          if (Array.isArray(descarteValue)) {
            descarteValue.forEach((it, index) => {
              descarteItem[data.customColumns[index].label] = it;
            });
          } else {
            descarteItem[data.customColumns[0].label] = descarteValue;
          }
          // DKR table data
          let { rowsKey, sourceData } = getRowsData(descarteItem, oldData);
          result.push({
            rowsKey,
            ...sourceData,
            ...descarteItem,
          });
        }
      }
      data.variantTableData = [...result];
    };

    // 存储 data数据,用于属性图片和缩略图的展示
    watch(
      () => [data.salePropSelect, data.tagValueList],
      () => {
        const params = store.getters.getParams;
        params[key] = data;
        store.dispatch(M_T.PARAMS_QUERY, params);
      },
      { deep: true, immediate: true }
    );

    const addTableRow = (record) => {
      if (data.tableData?.length >= MAX_KEY_LENGTH) {
        return;
      }
      if (
        !data.tagValueList[record.key] ||
        data.tagValueList[record.key].length <= 0
      ) {
        return GjMessage.warning("属性值不能为空");
      }
      const item = {
        key: count++,
      };
      data.tableData = [...data.tableData, item];
      setKeyDisabled();
      nextTick(() => {
        data.showTooltip = true;
      });
    };

    const subTableRow = (key) => {
      const index = data.tableData.findIndex((item) => item.key == key);
      if (index >= 0) {
        const list = [...data.tableData];
        list.splice(index, 1);
        data.tableData = list;
        delete data.salePropSelect[key];
        delete data.tagValueList[key];
      }
      setKeyDisabled();
    };

    const addTableValueCloum = (record) => {
      if (
        !data.salePropSelect[record.key] ||
        data.salePropSelect[record.key].length <= 0
      ) {
        data.addValueColumnBtnShowMap[record.key] = false;
        return GjMessage.warning("属性名不能为空");
      }
      data.addValueColumnBtnShowMap[record.key] = true;
    };

    const keyChange = (value, record) => {
      const valuesList = Object.values(data.salePropSelect);
      // 不允许相同的属性名存在
      if (valuesList.filter((it) => it === value).length > 1) {
        data.salePropSelect[record.key] = "";
        data.salePropValue[record.key] = [];
        return GjMessage.warning("属性名重复");
      }

      if (value) {
        const opt =
          data.salePropItem.find((item) => item.attributeId === value)
            ?.options || [];
        data.salePropValue[record.key] = opt;
      } else {
        data.salePropValue[record.key] = [];
      }
      data.tagValueList[record.key] = [];
      createDkrTable();
      setKeyDisabled();
    };

    const valueChange = (value, record) => {
      if (data.tagValueList[record.key]?.length >= MAX_VALUE_LENGTH) {
        data.addValueColumnBtnShowMap[record.key] = false;
        return;
      }
      if (Array.isArray(data.tagValueList[record.key])) {
        const flag = data.tagValueList[record.key]?.indexOf(value) > -1;
        if (flag) {
          GjMessage.warning("属性值重复");
        } else {
          data.tagValueList[record.key].push(value);
        }
      } else {
        data.tagValueList[record.key] = [value];
      }
      data.addValueColumnBtnShowMap[record.key] = false;
      createDkrTable();
    };
    const tagDelete = (index, record) => {
      const list = data.tagValueList[record.key] || [];
      list.splice(index, 1);
      createDkrTable();
    };

    const batchInput = () => {
      if (data.rowSelection.selectedRowKeys.length <= 0) {
        return GjMessage.warning("请先勾选要操作的内容行");
      }
      const list = [...data.variantTableData];
      data.rowSelection.selectedRowKeys.forEach((rowsId) => {
        const row = list.find((item) => item.rowsKey === rowsId);
        Object.keys(state.batchMap).forEach((key) => {
          if (state.batchMap[key] || state.batchMap[key] === 0) {
            if (isSiteIdCB.value && key !== "recommendPrice") {
              const inputValue = state.batchMap[key];
              list.forEach((it) => {
                it[key] = inputValue;
              });
            } else {
              row[key] = state.batchMap[key];
            }
          }
        });
      });
      data.variantTableData = [...list];

      // 校验必填
      proxy.$refs.variantRef.validateField([
        "recommendPrice2",
        "logisticsWeight2",
        "logisticsSize2",
      ]);
    };
    // 对外的方法
    const submitForm = () => {
      return setForm2(proxy, key, data);
    };
    const saveDraftForm = () => {
      return setForm2(
        proxy,
        key,
        data,
        props.pageType === "draft" ? "variantRef" : ""
      );
    };
    const submitDraftForm = () => {
      return setForm2(proxy, key, data, "variantRef");
    };
    const setPageData = (respData) => {
      data.showTooltip = true;
      data.tableData = [];
      data.variantTableData = [];
      // table 表格绑定的数据
      if (respData.variantAttrInfo && respData.variantAttrInfo.length > 0) {
        let result = [];
        respData.variantAttrInfo.forEach((item) => {
          const key = count++;
          result.push({ key });
          data.salePropSelect[key] = item.attrId;
          data.tagValueList[key] =
            item.attributeValues?.map((it) => it.attrValueName) || [];
          data.customColumns.push({
            attrId: item.attrId,
            label: item.label,
            attrNames: item.attrName,
            customValue: data.tagValueList[key],
            dataIndex: item.label,
            title: item.label,
            minWidth: 130,
            width: 130,
            render: ({ record }) => <GbText>{record[item.label]}</GbText>,
          });
        });

        data.tableData = [...result];
      } else {
        data.tableData = [{ key: 1 }];
      }
      // table2 表格绑定的数据
      let tableItem = {};
      let tempTableData = [];
      respData.variants?.forEach((item) => {
        tableItem = { ...item, rowsKey: `${count2++}_rowskey` };
        // 字节框架会有警告
        Object.keys(state.batchMap).forEach((key) => {
          tableItem[key] = tranStrToNumber(tableItem[key]);
        });
        item.skuAttr?.forEach((skuItem) => {
          tableItem[skuItem.label] = skuItem.attrValue;
        });
        // 跨境的 回显回显售价
        if (isSiteIdCB.value) {
          tableItem.globaRecommendPrice = {};
          tableItem.globalStockNumber = {};
          tableItem.globalPrice = {};
          tableItem.globalpromotionPrice = {};
          item.globalRelations?.forEach((it) => {
            tableItem.globaRecommendPrice[it.siteCode] = it.price;
            tableItem.globalStockNumber[it.siteCode] = it.quantity;
            tableItem.globalPrice[it.siteCode] = it.price;
            tableItem.globalpromotionPrice[it.siteCode] = it.salePrice;
          });
          tableItem.globaRecommendPrice["cb"] = item.recommendPrice;
          tableItem.globalPrice["cb"] = item.recommendPrice;
          tableItem.globalpromotionPrice["cb"] = item.recomendPrice;
          tableItem.globalStockNumber["total"] = item.remainNumber;
        }
        tempTableData.push(tableItem);
      });
      data.variantTableData = [...tempTableData];
      // 跨境的回显重量和尺寸
      if (isSiteIdCB.value) {
        const tempList = data.variantTableData;
        Object.keys(state.batchMap).forEach((key) => {
          if (key !== "recommendPrice") {
            const inputValue = tempList[0][key];
            tempList.forEach((item) => {
              item[key] = inputValue;
            });
          }
        });
        data.variantTableData = [...tempList];
      }
    };

    const clearData = () => {
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "boolean") {
          data[key] = false;
        } else if (Array.isArray(data[key])) {
          data[key] = [];
        } else if (typeof data[key] === "object") {
          data[key] = {};
        } else {
          data[key] = "";
        }
      });
      data.tableData = [{ key: 1 }];
      state.batchMap = {
        recommendPrice: null,
        logisticsWeight: null,
        logisticsSizeLong: null,
        logisticsSizeWide: null,
        logisticsSizeHigh: null,
      };
      proxy.$refs.variantRef.resetFields();
    };

    const clearSku = (index) => {
      data.variantTableData[index].sku = "";
      data.variantTableData = [...data.variantTableData];
      // 验证
      proxy.$refs.variantRef.validateField("sku");
    };

    const changeInputNumber = (key) => {
      if (isSiteIdCB.value) {
        const inputValue = data.variantTableData[0][key];
        const list = data.variantTableData;
        list.forEach((item) => {
          item[key] = inputValue;
        });
        data.variantTableData = [...list];
      }
    };

    const updateGlobalStockNumber = () => {
      setTimeout(() => {
        proxy.$refs.variantRef.validateField("remainNumber");
      }, 0);
    };

    const updateGlobalPrice = () => {
      setTimeout(() => {
        proxy.$refs.variantRef.validateField([
          "recommendPrice2",
          "recomendPrice",
        ]);
      }, 0);
    };

    const selectionChange = (selectedRowKeys) => {
      data.rowSelection.selectedRowKeys = selectedRowKeys;
    };

    return {
      ...toRefs(data),
      ...toRefs(state),
      emptyFilter,
      validateTriggerOpt,
      MAX_KEY_LENGTH,
      MAX_NUM_15,
      MAX_NUM_20,
      MAX_NUM_110,
      recommendPriceUnit,
      isSiteIdCB,
      variantTableColumns1,
      table2Columns,
      showTableTwo,
      clearData,
      // 变体
      addTableRow,
      subTableRow,
      addTableValueCloum,
      keyChange,
      valueChange,
      tagDelete,
      submitForm,
      batchInput,
      setPageData,
      saveDraftForm,
      submitDraftForm,
      skuRule,
      customValidator,
      customRPValidator,
      customShopSkuValidator,
      customPromotionPriceValidator,
      customRemainNumValidator,
      customLogWeightValidator,
      customLogisticValidator,
      getSkuDisabled,
      createDkrTable,
      clearSku,
      changeInputNumber,
      updateGlobalStockNumber,
      updateGlobalPrice,
      selectionChange,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
:deep(.table-full-width) {
  width: 100%;
}
// 变体label
.sale-prop-select {
  :deep(.sale-prop-item-select) {
    max-width: 140px;
  }
  :deep(.arco-select-view-single) {
    width: auto;
    padding: 0 8px;
    font-size: 12px;
    border-radius: 16px;
    .arco-select-view-suffix {
      padding-left: 0;
    }
    .arco-select-view-value {
      width: auto;
      padding: 6px;
    }
    .arco-select-view-input {
      width: 36px;
      padding: 6px;
      font-size: 12px;
    }
  }
}
svg.addTitle {
  margin-right: 8px;
}
:deep(.w-90) {
  width: 90px;
}
:deep(.w-127) {
  width: 127px;
}

// 变体value  tag定制
.value-tag {
  border-radius: 16px;
  max-width: 105px;
  padding-right: 24px;
  margin: 2px 8px 2px 0;
  position: relative;
  :deep(.arco-tag-close-btn) {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.sale-prop-select.arco-select-view-single {
  padding: 2px 12px;
  border-radius: 16px;
  .arco-select-view-input {
    font-size: 12px;
  }
}
:deep(.require-symbol) {
  color: #ff5c5c;
}
:deep(.input-seperate) {
  padding: 0 8px;
}

:deep(.arco-form-item) {
  margin-bottom: 10px;
}
</style>
