<template>
  <div class="variant-info">
    <h2 class="title mb8">销售信息</h2>
    <gj-form
      ref="variantRef"
      :model="model"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <gj-form-item class="pb-16">
        <a-table
          class="table-full-width"
          row-key="rowKey"
          :columns="columns"
          :data="attrsAndValsData"
          :pagination="false"
          :scroll="{ x: 1000 }"
        >
          <template #columns>
            <a-table-column title="属性名" :width="200">
              <template #cell="{ record }">
                <div class="sale-prop-select">
                  <gj-select
                    v-model="attrNames[record.rowKey]"
                    placeholder="选择"
                    allow-clear
                    :trigger-props="{
                      autoFitPopupMinWidth: true,
                      updateAtScroll: true,
                    }"
                    @change="attrNameChange(record.rowKey)"
                    @clear="clearAttr(record.rowKey)"
                  >
                    <gj-option
                      v-for="attrItem in attrNameOptions"
                      :value="attrItem.attrNameId"
                      :key="attrItem.attrNameId"
                      :disabled="attrItem.disabled"
                      :label="attrItem.label"
                    />
                  </gj-select>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="属性值">
              <template #cell="{ record }">
                <gj-tag
                  v-for="(item, idx) in attrValues[record.rowKey]"
                  :key="item"
                  size="large"
                  closable
                  class="value-tag"
                  @close="deleteAttrVal(idx, record.rowKey)"
                  >{{ item }}</gj-tag
                >
                <gj-button
                  type="text"
                  @click="addAttrVal(record.rowKey)"
                  v-if="!editableData[record.rowKey]"
                  >添加新标签</gj-button
                >
                <gj-select
                  v-if="editableData[record.rowKey]"
                  class="sale-prop-select"
                  :style="{ width: '127px' }"
                  @change="attrValChange($event, record.rowKey)"
                  placeholder="按回车完成输入"
                  allow-create
                  :trigger-props="{
                    autoFitPopupMinWidth: true,
                    updateAtScroll: true,
                  }"
                />
              </template>
            </a-table-column>
            <a-table-column title="操作" :width="150" fixed="right">
              <template #cell="{ record, rowIndex }">
                <template v-if="attrsAndValsData.length >= MAX_KEY_LENGTH">
                  <gj-tooltip
                    content="当前只能添加三个属性，需删除一个方可添加"
                    position="top"
                    background-color="#fdf2ea"
                    :content-style="{
                      color: '#ee7c30',
                    }"
                  >
                    <svg-icon
                      @click="addAttrRow(record.rowKey)"
                      svgClass="addTitle"
                      :width="24"
                      style="margin-right: 8px; cursor: pointer"
                    />
                  </gj-tooltip>
                </template>
                <template v-if="attrsAndValsData.length < MAX_KEY_LENGTH">
                  <svg-icon
                    @click="addAttrRow(record.rowKey)"
                    svgClass="addTitle"
                    :width="24"
                    style="margin-right: 8px; cursor: pointer"
                  />
                </template>
                <svg-icon
                  @click="deleteAttrRow(record.rowKey, rowIndex)"
                  svgClass="subtract"
                  :width="24"
                  v-if="attrsAndValsData.length > 1"
                  style="cursor: pointer"
                />
              </template>
            </a-table-column>
          </template>
        </a-table>
      </gj-form-item>
      <gj-row :gutter="24" class="pb-16">
        <gj-col :span="7">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="建议售价"
          >
            <gj-input-number
              :min="0"
              :max="MAX_RECOMMEND_PRICE"
              :precision="2"
              :hide-button="true"
              v-model="batchMap.recommendPrice"
              placeholder="请输入"
              allow-clear
            >
              <template #prefix>
                <span>{{ detailType === "draft" ? currency : "USD" }}</span>
              </template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="7">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="包装重量"
          >
            <gj-input-number
              :min="0"
              :max="MAX_PACKING_WEIGHT"
              :precision="4"
              :hide-button="true"
              v-model="batchMap.packingWeight"
              placeholder="请输入"
              allow-clear
            />
            <gj-button
              type="text"
              size="mini"
              @click="batchInput"
              style="margin-left: 10px"
              >批量录入</gj-button
            >
          </gj-form-item>
        </gj-col>
      </gj-row>
      <div>
        <a-table
          class="table-content"
          row-key="rowKey"
          :scroll="scroll"
          :columns="variantTableColumns"
          :data="variantTableData"
          :pagination="false"
          :row-selection="rowSelection"
          @selection-change="selectionChange"
        />
      </div>
    </gj-form>
    <add-inventory
      v-model:visible="modalVisible"
      :row-inventory-info="rowInventoryInfo"
      @add-inventory="addRowInventory"
    />
  </div>
</template>

<script>
import {
  ref,
  reactive,
  toRefs,
  watch,
  computed,
  inject,
  getCurrentInstance,
  nextTick,
} from "vue";
import { Table, TableColumn } from "@arco-design/web-vue";
import "@arco-design/web-vue/es/table/style/index.css";
import SvgIcon from "@/components/SvgIcon";
import AddInventory from "./draftAndOnline/AddInventory.vue";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
import _ from "lodash";
import { M_T } from "@/store/mutationsTypes";
import {
  calcDescartes,
  tranStrToNumber,
  validateTriggerOpt,
} from "@/utils/common";
import {
  MAX_PACKING_WEIGHT,
  MAX_RECOMMEND_PRICE,
  weightOptions,
} from "@pagesSystem/published/shopify/config";
import { getSkuRule } from "@/api/public";
import { setForm2 } from "@/utils/fnBusiness";

const MAX_VALUE_LENGTH = 20;
const MAX_KEY_LENGTH = 3;
let id = 0;
let variantId = 0;
let addId = 0;

export default {
  name: "ShopifyVariantInfo",
  props: {
    detailType: {
      type: String,
      default: "product",
    },
    relatedSkus: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    aTable: Table,
    aTableColumn: TableColumn,
    SvgIcon,
    AddInventory,
  },
  emits: ["variant-change"],
  setup(props, { emit }) {
    const shopId = inject("shopId", undefined);
    const currency = inject("currency", undefined);
    const { proxy } = getCurrentInstance();
    const key = "variantInfoLz";
    const $store = useStore();
    const modalVisible = ref(false);
    const activeRowKey = ref("");
    const rowInventoryInfo = ref([]);
    const data = reactive({
      availableGroup: {},
      totalCartesianProduct: [],
      selectedCartesianProduct: [],
      diffGroup: [],
      diffCopyGroup: [],
      newVariant: {},
      columns: [
        {
          title: "属性名",
          dataIndex: "attrName",
          width: 200,
          fixed: "left",
        },
        {
          title: "属性值",
          dataIndex: "attrValue",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 100,
          fixed: "right",
        },
      ],
      MAX_KEY_LENGTH,
      attrsAndValsData: [
        {
          rowKey: getKey("rowKey", ++id),
        },
      ],
      model: {},
      rowSelection: {
        type: "checkbox",
        showCheckedAll: true,
        selectedRowKeys: [],
      },
      scroll: {
        x: 1000,
        y: 440,
      },
      attrNameOptions: [
        {
          attrNameId: "0",
          label: "颜色",
          disabled: false,
        },
        {
          attrNameId: "1",
          label: "尺寸",
          disabled: false,
        },
        {
          attrNameId: "2",
          label: "材料",
          disabled: false,
        },
        {
          attrNameId: "3",
          label: "样式",
          disabled: false,
        },
      ],
      attrNames: {},
      attrValues: {},
      editableData: {},
      variantTableData: [],
      customColumns: [],
      batchMap: {
        // recommendPrice: null,
        // recommendPriceUnit: null,
        // packingWeightUnit: null,
        // packingWeight: null,
        // hsCode: null,
        // inventoryInfo: [],
        recommendPrice: null,
        originalPrice: null,
        storeSku: "",
        msku: "",
        inventoryInfo: [],
        packingWeight: null,
        packingWeightUnit: "kg",
        transportation: false,
        continueSell: false,
        tax: false,
        hsCode: null,
      },
      batchMap2: {
        recommendPrice: null,
        packingWeight: null,
      },
    });

    const recommendPriceColumn = {
      title() {
        return props.detailType === "draft" ? (
          <span class="recommend-price-tit">
            <span>*</span>售价
          </span>
        ) : (
          "建议售价"
        );
      },
      dataIndex: "recommendPrice",
      width: 160,
      render({ record, rowIndex }) {
        if (record?.type === "add") {
          return (
            <>
              <GjButton
                onClick={() => {
                  cancel();
                }}
              >
                取消
              </GjButton>
              <GjButton
                type="primary"
                class="save-btn"
                onClick={() => {
                  addDkr();
                }}
              >
                确定
              </GjButton>
            </>
          );
        } else {
          const slots = {
            prefix: () => {
              if (props.detailType === "draft") {
                return <span>{currency.value}</span>;
              }
              return <span>USD</span>;
            },
          };

          return (
            <GjFormItem
              hideLabel={true}
              field="recommendPrice"
              rules={[
                {
                  required: props.detailType === "draft" ? true : false,
                  validator: (value, cb) =>
                    validator(cb, record, "recommendPrice"),
                },
              ]}
              validateTrigger={validateTriggerOpt}
              labelColStyle={{ "justify-content": "flex-start" }}
              style="margin-bottom: 0"
            >
              <GjInputNumber
                min={0}
                max={MAX_RECOMMEND_PRICE}
                precision={2}
                hideButton={true}
                v-model={data.variantTableData[rowIndex].recommendPrice}
                v-slots={slots}
                placeholder="请输入"
                allowClear
              />
            </GjFormItem>
          );
        }
      },
    };

    const mskuColumn = {
      title() {
        return (
          <span class="related-sku-tit">
            <span>*</span>关联sku
          </span>
        );
      },
      dataIndex: "msku",
      width: 300,
      required: true,
      render({ record, rowIndex }) {
        return record?.type !== "add" ? (
          <GjFormItem
            hideLabel={true}
            field="msku"
            rules={[
              {
                required: true,
                validator: (value, cb) => validator(cb, record, "msku"),
              },
            ]}
            validateTrigger={validateTriggerOpt}
            labelColStyle={{ "justify-content": "flex-start" }}
            style="margin-bottom: 0"
          >
            <GjSelect
              v-model={data.variantTableData[rowIndex].msku}
              placeholder="请选择"
              allowClear
              triggerProps={{
                autoFitPopupMinWidth: true,
                updateAtScroll: true,
              }}
              onClear={() => {
                clearMsku(rowIndex);
              }}
            >
              {props.relatedSkus.map((skuItem) => (
                <GjOption
                  key={skuItem.sku}
                  value={skuItem.sku}
                  disabled={setIsDisabled(skuItem.sku)}
                >
                  {skuItem.sku}-{skuItem.skuName}
                </GjOption>
              ))}
            </GjSelect>
          </GjFormItem>
        ) : null;
      },
    };

    const packingWeightColumn = [
      {
        title: "包装重量",
        dataIndex: "packingWeight",
        width: 120,
        render({ record, rowIndex }) {
          const slots = {
            prefix: () =>
              data.variantTableData[rowIndex].transportation ? (
                <span class="red">*</span>
              ) : null,
          };

          return record?.type !== "add" ? (
            <GjFormItem
              hideLabel={true}
              field={`packingWeight${rowIndex}`}
              rules={[
                {
                  required:
                    data.variantTableData[rowIndex].transportation ?? false,
                  validator: (value, cb) =>
                    weightValidator(cb, record, "packingWeight"),
                },
              ]}
              validateTrigger={validateTriggerOpt}
              labelColStyle={{ "justify-content": "flex-start" }}
              style="margin-bottom: 0"
            >
              <GjInputNumber
                min={0}
                max={MAX_PACKING_WEIGHT}
                precision={4}
                hideButton={true}
                v-model={data.variantTableData[rowIndex].packingWeight}
                placeholder="请输入"
                allowClear
                v-slots={slots}
              ></GjInputNumber>
            </GjFormItem>
          ) : null;
        },
      },
      {
        title: "重量单位",
        dataIndex: "packingWeightUnit",
        width: 120,
        render({ record, rowIndex }) {
          return record?.type !== "add" ? (
            <GjSelect
              triggerProps={{
                updateAtScroll: true,
              }}
              v-model={data.variantTableData[rowIndex].packingWeightUnit}
            >
              {weightOptions.map((unitItem) => (
                <GjOption key={unitItem.value} value={unitItem.value}>
                  {unitItem.label}
                </GjOption>
              ))}
            </GjSelect>
          ) : null;
        },
      },
    ];

    const hsCodeColumn = {
      title: "HS代码",
      dataIndex: "hsCode",
      width: 120,
      render({ record, rowIndex }) {
        return record?.type !== "add" ? (
          <GjInputNumber
            min={0}
            hideButton={true}
            v-model={data.variantTableData[rowIndex].hsCode}
            placeholder="请输入"
            allowClear
          />
        ) : null;
      },
    };

    const handleColumn = {
      title: "操作",
      dataIndex: "action",
      width: 100,
      fixed: "right",
      render({ record, rowIndex }) {
        return record?.type !== "add" ? (
          <>
            {data.selectedCartesianProduct.length !==
            data.totalCartesianProduct.length ? (
              <SvgIcon
                onClick={() => {
                  addVariant(record);
                }}
                svgClass="addTitle"
                width={24}
                style="margin-right: 8px; cursor: pointer"
              />
            ) : null}
            <SvgIcon
              onClick={() => {
                deleteVariant(record, rowIndex);
              }}
              svgClass="subtract"
              width={24}
              style="cursor: pointer"
            />
          </>
        ) : null;
      },
    };

    const variantColumns = [
      recommendPriceColumn,
      mskuColumn,
      ...packingWeightColumn,
      hsCodeColumn,
      handleColumn,
    ];

    const variantColumnsDraft = [
      recommendPriceColumn,
      {
        title: "原价",
        dataIndex: "originalPrice",
        width: 160,
        hasUnit: true,
        render({ record, rowIndex }) {
          if (record?.type === "add") return null;
          const slots = {
            prefix: () => {
              return <span>{currency.value}</span>;
            },
          };
          return (
            <GjInputNumber
              min={0}
              hideButton={true}
              v-model={data.variantTableData[rowIndex].originalPrice}
              v-slots={slots}
              placeholder="请输入"
              allowClear
            />
          );
        },
      },
      {
        title() {
          return (
            <span class="store-sku-tit">
              <span>*</span>店铺SKU
              <GjButton
                type="text"
                size="mini"
                onClick={() => {
                  generateStoreSku();
                }}
              >
                自动生成
              </GjButton>
            </span>
          );
        },
        dataIndex: "storeSku",
        width: 170,
        render({ record, rowIndex }) {
          return record?.type !== "add" ? (
            <GjFormItem
              hideLabel
              field="storeSku"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => validator(cb, record, "storeSku"),
                },
              ]}
              validateTrigger={validateTriggerOpt}
              labelColStyle={{ "justify-content": "flex-start" }}
            >
              <GjInput
                hideButton={true}
                v-model={data.variantTableData[rowIndex].storeSku}
                placeholder="请输入"
                allowClear
              />
            </GjFormItem>
          ) : null;
        },
      },
      mskuColumn,
      {
        title() {
          return (
            <span class="inventory-info-tit">
              <span>*</span>库存
            </span>
          );
        },
        dataIndex: "inventoryInfo",
        width: 120,
        isRequired: true,
        render({ record }) {
          return record?.type !== "add" ? (
            <GjFormItem
              hideLabel={true}
              field="inventoryInfo"
              rules={[
                {
                  required: true,
                  validator: (value, cb) =>
                    validator(cb, record, "inventoryInfo"),
                },
              ]}
              validateTrigger={validateTriggerOpt}
              labelColStyle={{ "justify-content": "flex-start" }}
              style="margin-bottom: 0"
            >
              <GjButton
                type="text"
                size="mini"
                onClick={() => {
                  showInventoryModal(record);
                }}
              >
                {getInventoryTxt(record)}
              </GjButton>
            </GjFormItem>
          ) : null;
        },
      },
      {
        title: "是否运输",
        dataIndex: "transportation",
        width: 100,
        render({ record, rowIndex }) {
          return record?.type !== "add" ? (
            <GjSwitch
              size="mini"
              v-model={data.variantTableData[rowIndex].transportation}
              onChange={transportChange(rowIndex)}
            />
          ) : null;
        },
      },
      ...packingWeightColumn,
      {
        title: "是否收取税费",
        dataIndex: "tax",
        width: 120,
        render({ record, rowIndex }) {
          return record?.type !== "add" ? (
            <GjSwitch
              size="mini"
              v-model={data.variantTableData[rowIndex].tax}
            />
          ) : null;
        },
      },
      {
        title: "缺货继续销售",
        dataIndex: "continueSell",
        width: 120,
        render({ record, rowIndex }) {
          return record?.type !== "add" ? (
            <GjSwitch
              size="mini"
              v-model={data.variantTableData[rowIndex].continueSell}
            />
          ) : null;
        },
      },
      hsCodeColumn,
      handleColumn,
    ];

    const variantTableColumns = computed(() => {
      return [
        ...data.customColumns,
        ...(props.detailType === "draft"
          ? variantColumnsDraft
          : variantColumns),
      ];
    });

    const clearData = () => {
      data.attrsAndValsData = [
        {
          rowKey: getKey("rowKey", ++id),
        },
      ];
      data.variantTableData = [];
      data.attrNames = {};
      data.editableData = {};
      data.attrValues = {};
      data.customColumns = [];
      data.batchMap = {
        recommendPrice: null,
        recommendPriceUnit: null,
        originalPrice: null,
        storeSku: "",
        msku: "",
        inventoryInfo: [],
        packingWeight: null,
        packingWeightUnit: null,
        transportation: false,
        continueSell: false,
        tax: false,
        hsCode: null,
      };
    };

    watch(
      () => data.attrNames,
      (val) => {
        const values = Object.values(val);
        data.attrNameOptions.forEach((item) => {
          if (values.indexOf(item.attrNameId) > -1) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
      },
      {
        deep: true,
        immediate: true,
      }
    );

    watch(
      () => [data.attrNames, data.attrValues],
      () => {
        const params = $store.getters.getParams;
        params[key] = data;
        $store.dispatch(M_T.PARAMS_QUERY, params);
      },
      {
        deep: true,
        immediate: true,
      }
    );

    if (props.detailType === "draft") {
      const isResetStoreInfo = inject("isResetStoreInfo");
      watch(
        () => isResetStoreInfo.value,
        (isReset) => {
          if (isReset) {
            resetStoreSkusAndInventory();
            isResetStoreInfo.value = false;
          }
        }
      );
    }

    function resetStoreSkusAndInventory() {
      const newVariantTable = [...data.variantTableData];
      for (let variant of newVariantTable) {
        variant.storeSku = "";
        variant.inventoryInfo = [];
      }
      data.variantTableData = newVariantTable;
    }

    const msgsMap = {
      recommendPrice: "请输入售价",
      inventoryInfo: "请选择库存",
      storeSku: "请输入店铺SKU",
      msku: "请选择SKU",
      packingWeight: "请输入包装重",
    };

    const validator = (cb, record, dataIndex) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (
            props.detailType === "product" &&
            dataIndex === "recommendPrice"
          ) {
            cb();
          } else if (dataIndex === "inventoryInfo") {
            const len = record.inventoryInfo?.length;
            if (!len) {
              cb(msgsMap[dataIndex]);
            }
          } else if (!record[dataIndex]) {
            cb(msgsMap[dataIndex]);
          }
          resolve();
        }, 0);
      });
    };

    const weightValidator = (cb, record, dataIndex) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!record.transportation) {
            cb();
          } else if (!record[dataIndex]) {
            cb(msgsMap[dataIndex]);
          }
          resolve();
        }, 0);
      });
    };

    const addVariantValidator = (cb, label) => {
      return new Promise((resolve) => {
        if (!data.newVariant[label]) {
          cb(`请选择${label}`);
        }
        resolve();
      });
    };

    function getKey(prefix = "rowKey", id) {
      return `${prefix}-${id}`;
    }

    const getRowsData = (_descarteItem, _oldData) => {
      for (let index = 0; index < _oldData.length; index++) {
        const element = _oldData[index];
        const keys = Object.keys(_descarteItem);
        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];
          if (element[key] !== _descarteItem[key]) {
            break;
          }
          if (j === keys.length - 1) {
            return {
              rowKey: element.rowKey,
              sourceData: element,
            };
          }
        }
      }
      return {
        rowKey: getKey("rowKey", ++variantId),
        sourceData: {
          recommendPrice: null,
          originalPrice: null,
          storeSku: "",
          msku: "",
          inventoryInfo: [],
          packingWeight: null,
          packingWeightUnit: "kg",
          transportation: false,
          continueSell: false,
          tax: false,
          hsCode: null,
        },
      };
    };

    const getJsx = (record, column) => {
      return record?.dataIndex === "add" ? (
        <GjFormItem
          field="addField"
          hideLabel={true}
          rules={[
            {
              required: true,
              validator: (value, cb) =>
                addVariantValidator(cb, column.dataIndex),
            },
          ]}
        >
          <GjSelect
            class="sale-prop-select"
            placeholder="请选择"
            allow-clear
            triggerProps={{
              updateAtScroll: true,
            }}
            v-model={data.newVariant[column.dataIndex]}
            onChange={() => {
              selectChange(column.index);
            }}
            onPopupVisibleChange={() => {
              popupVisibleChange(column.index);
            }}
          >
            {data.availableGroup[column.dataIndex].map((item) => (
              <GjOption key={item} value={item} label={item}></GjOption>
            ))}
          </GjSelect>
        </GjFormItem>
      ) : (
        <span>{record[column.dataIndex]}</span>
      );
    };

    const setVariantTableColumns = () => {
      const customColumnsOld = JSON.parse(JSON.stringify(data.customColumns));
      data.customColumns = [];

      const attrNameKeys = Object.keys(data.attrNames);
      for (let index = 0; index < attrNameKeys.length; index++) {
        const attrNameKey = attrNameKeys[index];
        if (
          data.attrNames[attrNameKey] &&
          data.attrValues[attrNameKey] &&
          data.attrValues[attrNameKey].length > 0
        ) {
          let attrNameId = data.attrNames[attrNameKey];
          let label = "";
          // data.attrNameOptions 可能为空
          if (data.attrNameOptions.length > 0) {
            label = data.attrNameOptions.find(
              (item) => item.attrNameId === attrNameId
            )?.label;
          } else {
            label = customColumnsOld?.find(
              // ??? 删除?
              (item) => item.attrId === attrNameId
            )?.label;
          }
          data.customColumns.push({
            index,
            label,
            width: 150,
            dataIndex: label,
            title: label,
            customValue: data.attrValues[attrNameKey],
            render({ record, column }) {
              return getJsx(record, column);
            },
          });
        }
      }
    };

    const setVariantTableData = () => {
      const oldData = JSON.parse(JSON.stringify(data.variantTableData));
      data.variantTableData = [];
      let variantTableData = [];
      const list = data.customColumns.map((item) => item.customValue);
      let cartesianProduct = calcDescartes(list);
      data.availableGroup = {};
      data.totalCartesianProduct = JSON.parse(JSON.stringify(cartesianProduct));
      data.selectedCartesianProduct = JSON.parse(
        JSON.stringify(cartesianProduct)
      );
      for (let i = 0; i < cartesianProduct.length; i++) {
        const descarteValue = cartesianProduct[i];
        if (descarteValue) {
          const descarteItem = {};
          if (Array.isArray(descarteValue)) {
            descarteValue.forEach((it, index) => {
              descarteItem[data.customColumns[index].label] = it;
              descarteItem[it] = data.customColumns[index].customValue; // new ??

              descarteItem.dcrItem = descarteValue;
            });
          } else {
            descarteItem[data.customColumns[0].label] = descarteValue;
            descarteItem.dcrItem = descarteValue;
          }

          let { rowKey, sourceData } = getRowsData(descarteItem, oldData);
          variantTableData.push({
            rowKey,
            ...sourceData,
            ...descarteItem,
          });
        }
      }
      data.variantTableData = [...variantTableData];
    };

    const createDkrTable = () => {
      setVariantTableColumns();
      setVariantTableData();
      // new
      getVariants();
    };

    const attrNameChange = (rowKey) => {
      data.attrValues[rowKey] = [];
      createDkrTable();
    };

    const attrValChange = (value, rowKey) => {
      if (data.attrValues[rowKey]?.length >= MAX_VALUE_LENGTH) {
        return GjMessage.error("已达到添加上限");
      }
      if (Array.isArray(data.attrValues[rowKey])) {
        const isDuplicate = data.attrValues[rowKey]?.indexOf(value) > -1;
        if (isDuplicate) {
          GjMessage.error("属性值重复");
        } else {
          data.attrValues[rowKey].push(value);
        }
      } else {
        data.attrValues[rowKey] = [value];
      }
      data.editableData[rowKey] = false;
      createDkrTable();
    };

    const deleteAttrVal = (index, rowKey) => {
      const list = data.attrValues[rowKey] || [];
      list.splice(index, 1);
      createDkrTable();
    };

    const addAttrRow = (rowKey) => {
      if (data.attrsAndValsData?.length >= MAX_KEY_LENGTH) {
        return;
      }
      if (!data.attrValues[rowKey] || data.attrValues[rowKey].length <= 0) {
        return GjMessage.error("属性值不能为空");
      }
      const item = {
        rowKey: getKey("rowKey", ++id),
      };
      data.attrsAndValsData.push(item);
    };

    const deleteAttrRow = (rowKey, rowIndex) => {
      data.attrsAndValsData.splice(rowIndex, 1);
      delete data.attrNames[rowKey];
      delete data.attrValues[rowKey];
    };

    const addAttrVal = (rowKey) => {
      if (!data.attrNames[rowKey]) {
        data.editableData[rowKey] = false;
        return GjMessage.error("属性名不能为空");
      }
      data.editableData[rowKey] = true;
    };

    const setPageData = (aData) => {
      data.customColumns = [];
      if (aData.variantAttrs && aData.variantAttrs.length > 0) {
        data.attrsAndValsData = [];
        const result = [];
        aData.variantAttrs.forEach((item, idx) => {
          const rowKey = getKey("rowKey", ++id);
          result.push({ rowKey });
          data.attrNames[rowKey] = item.attrId;
          data.attrValues[rowKey] =
            item.attrValuesList?.map((it) => it.attrValueName) || [];
          data.customColumns.push({
            index: idx,
            width: 150,
            attrId: item.attrId,
            label: item.attrName,
            customValue: data.attrValues[rowKey],
            dataIndex: item.attrName,
            title: item.attrName,
            render({ record, column }) {
              return getJsx(record, column);
            },
          });
        });

        data.attrsAndValsData = result;
        // console.log("data.attrsAndValsData", data.attrsAndValsData);
      }
      const tempTableData = [];
      aData.variants?.forEach((item) => {
        const dcrItem = [];
        const tableItem = {
          ...item,
          rowKey: getKey("rowKey", ++variantId),
        };
        Object.keys(data.batchMap).forEach((dataIndex) => {
          if (
            dataIndex === "packingWeight" ||
            dataIndex === "recommendPrice" ||
            dataIndex === "hsCode"
          ) {
            tableItem[dataIndex] = tranStrToNumber(tableItem[dataIndex]);
          }
        });
        item.variantAttrInfo?.forEach((skuItem) => {
          dcrItem.push(skuItem.attrValue);
          tableItem[skuItem.attrName] = skuItem.attrValue;
        });
        tableItem.dcrItem = dcrItem;
        tableItem.inventoryInfo = item.inventoryInfo ?? [];
        tempTableData.push(tableItem);
      });
      data.variantTableData = tempTableData;
      // console.log("data.variantTableData", data.variantTableData);

      const list = data.customColumns.map((item) => item.customValue);
      let cartesianProduct = calcDescartes(list);
      data.availableGroup = {};
      data.totalCartesianProduct = JSON.parse(JSON.stringify(cartesianProduct));
      data.selectedCartesianProduct = data.variantTableData.map(
        (row) => row.dcrItem
      );
      getAvailableGroup();
    };

    const batchInput = () => {
      if (data.rowSelection?.selectedRowKeys.length <= 0) {
        GjMessage.error("请先选择再操作");
        return;
      }
      const list = [...data.variantTableData];
      data.rowSelection.selectedRowKeys.forEach((rowKey) => {
        const row = list.find((item) => item.rowKey === rowKey);
        Object.keys(data.batchMap2).forEach((dataIndex) => {
          if (data.batchMap[dataIndex] || data.batchMap[dataIndex] === 0) {
            row[dataIndex] = data.batchMap[dataIndex];
          }
        });
      });

      data.variantTableData = [...list];
    };

    const setIsDisabled = (sku) => {
      return data.variantTableData.some((item) => item.msku === sku);
    };

    const clearMsku = (rowIndex) => {
      data.variantTableData[rowIndex].msku = "";
    };

    const clearAttr = (k) => {
      data.attrNames[k] = "";
    };

    const addVariant = () => {
      if (data.variantTableData[0]?.type === "add") {
        return;
      }
      const item = {
        dataIndex: "add",
        type: "add",
        rowKey: getKey("addKey", ++addId),
        disabled: true,
      };
      data.variantTableData = [item, ...data.variantTableData];
    };

    const deleteVariant = (record, rowIndex) => {
      data.variantTableData.splice(rowIndex, 1);
      const dcrItemStr = record.dcrItem.toString();
      const idx = data.selectedCartesianProduct.findIndex((dcrItem) => {
        return dcrItem.toString() === dcrItemStr;
      });
      if (idx !== -1) {
        data.selectedCartesianProduct.splice(idx, 1);
        getAvailableGroup();
      }
      // add
      getVariants();
    };

    const getAvailableGroup = (isDiff = true) => {
      data.availableGroup = {};
      if (isDiff) {
        const diffGroup = _.differenceWith(
          data.totalCartesianProduct,
          data.selectedCartesianProduct,
          _.isEqual
        );
        data.diffGroup = diffGroup;
        data.diffCopyGroup = JSON.parse(JSON.stringify(diffGroup));
        // console.log("data.diffGroup", data.diffGroup);
        if (data.diffGroup.length) {
          for (let k of data.customColumns) {
            data.newVariant[k.label] = "";
          }
        }
      }

      const availableGroup = data.availableGroup;
      data.diffGroup.forEach((item) => {
        if (Array.isArray(item)) {
          item.forEach((attrVal, attrValIdx) => {
            const label = data.customColumns[attrValIdx].label;
            if (!availableGroup?.[label]?.includes(attrVal)) {
              if (availableGroup[label]?.length) {
                availableGroup[label].push(attrVal);
              } else {
                availableGroup[label] = [attrVal];
              }
            }
          });
        } else {
          const label = data.customColumns[0].label;
          if (availableGroup?.[label]?.length) {
            availableGroup[label].push(item);
          } else {
            availableGroup[label] = [item];
          }
        }
      });
    };

    const getAvailable = () => {
      const selectedValue = Object.values(data.newVariant);
      const availableGroup = data.diffCopyGroup.filter((item) => {
        let isEqual = true;
        for (let i = 0; i < selectedValue.length; i++) {
          const attrVal = selectedValue[i];
          if (!attrVal) {
            isEqual = true;
          } else if (attrVal !== item[i]) {
            isEqual = false;
            break;
          }
        }
        return isEqual;
      });

      data.diffGroup = availableGroup;
      getAvailableGroup(false);
    };

    const getAvailableDkrs = (columnIdx) => {
      const selectedAttrs = Object.values(data.newVariant).filter(
        (attrVal) => attrVal
      );
      if (selectedAttrs.length === 1) {
        const idx = Object.values(data.newVariant).findIndex((item) => item);
        if (idx === columnIdx) {
          data.diffGroup = data.diffCopyGroup;
          getAvailableGroup(false);
        } else {
          getAvailable();
        }
      } else {
        getAvailable();
      }
    };

    const selectChange = (columnIdx) => {
      if (data.customColumns.length === 1) {
        return;
      }
      getAvailableDkrs(columnIdx);
    };

    const popupVisibleChange = (visible, columnIdx) => {
      if (visible) {
        getAvailableDkrs(columnIdx);
      }
    };

    const getCurrentAddDkr = () => {
      const dkr = [];
      data.customColumns.forEach((column) => {
        const attrValue = data.newVariant[column.label];
        dkr.push(attrValue);
      });
      if (data.customColumns.length === 1) {
        return dkr[0];
      }
      return dkr;
    };

    const cancel = () => {
      data.variantTableData.splice(0, 1);
      data.variantTableData = [...data.variantTableData];
      for (let k in data.newVariant) {
        data.newVariant[k] = "";
      }
      data.diffGroup = data.diffCopyGroup;
      getAvailableGroup(false);
    };

    const addDkr = () => {
      proxy.$refs.variantRef.validateField("addField").then((errors) => {
        if (!errors) {
          const dkr = getCurrentAddDkr();
          data.selectedCartesianProduct.push(dkr);
          const item = {
            rowKey: getKey("rowKey", ++variantId),
            dcrItem: dkr,
            ...data.batchMap,
          };
          for (let k in data.newVariant) {
            item[k] = data.newVariant[k];
          }
          data.variantTableData.splice(0, 1);
          data.variantTableData = [...data.variantTableData, item];
          getAvailableGroup();
          getVariants(); // 获取变体图片组合
        }
      });
    };

    const submitForm = () => {
      return new Promise((resolove) => {
        proxy.$refs.variantRef?.validate().then((errors) => {
          if (!errors) {
            const params = $store.getters.getParams;
            params[key] = data;
            $store.dispatch(M_T.PARAMS_QUERY, params);
            resolove(true);
          } else {
            resolove(false);
          }
        });
      });
    };

    const saveDraftForm = () => {
      return setForm2(proxy, key, data);
    };

    // new
    const getVariantAttrInfo = (item) => {
      const variantAttrInfo = [];
      Object.values(data.attrNames)?.forEach((attrNameId) => {
        let attrName = data.attrNameOptions.find(
          (attrNameItem) => attrNameItem.attrNameId === attrNameId
        )?.label;
        const skuAttrItem = {
          attrId: attrNameId,
          attrName,
          attrValue: item[attrName],
        };
        variantAttrInfo.push(skuAttrItem);
      });
      return variantAttrInfo;
    };

    function getVariants() {
      const variants = data.variantTableData.map((variantItem) => {
        return {
          ...variantItem,
          variantAttrInfo: getVariantAttrInfo(variantItem),
        };
      });
      emit("variant-change", variants);
    }

    const generateStoreSku = () => {
      if (!shopId.value) {
        return GjMessage.warning("请先选择店铺");
      }
      getSkuRule({
        platformCode: "SHOPIFY",
        shopCode: shopId.value,
        variantCount: data.variantTableData.length,
      }).then((res) => {
        const newVariantTable = [...data.variantTableData];
        newVariantTable.forEach((item, index) => {
          item.storeSku = res.data?.sonRuleStr?.[index];
        });
        data.variantTableData = newVariantTable;
        nextTick(() => {
          proxy.$refs.variantRef.validateField("storeSku");
        });
      });
    };

    const showInventoryModal = (record) => {
      if (!shopId.value) {
        return GjMessage.warning("请先选择店铺");
      }
      modalVisible.value = true;
      activeRowKey.value = record.rowKey;
      const inventoryInfo = record?.inventoryInfo?.[0];
      if (inventoryInfo) {
        rowInventoryInfo.value = [inventoryInfo];
      } else {
        rowInventoryInfo.value = [];
      }
    };

    const addRowInventory = (d) => {
      let isEmpty = true;
      const newVariantTable = [...data.variantTableData];
      for (let variantItem of newVariantTable) {
        if (variantItem.rowKey === activeRowKey.value) {
          const inventoryInfo = {
            inventoryItems: [],
            inventoryType: d.form.inventoryType,
          };
          for (let warehouse of d.managerWarehouses) {
            if (warehouse.productNum) {
              isEmpty = false;
              inventoryInfo.inventoryItems.push(warehouse);
            }
          }
          if (isEmpty) {
            variantItem.inventoryInfo = [];
          } else {
            variantItem.inventoryInfo[0] = inventoryInfo;
          }
          break;
        }
      }
      data.variantTableData = newVariantTable;
      proxy.$refs.variantRef.validateField("inventoryInfo");
    };

    const getInventoryTxt = (record) => {
      const warehouseLen = record.inventoryInfo?.[0]?.inventoryItems?.length;
      return warehouseLen ? `${warehouseLen}个仓库存在库存` : "添加库存";
    };

    const transportChange = (index) => {
      proxy.$refs.variantRef.validateField(`packingWeight${index}`);
    };

    const selectionChange = (selectedRowKeys) => {
      data.rowSelection.selectedRowKeys = selectedRowKeys;
    };

    return {
      MAX_PACKING_WEIGHT,
      MAX_RECOMMEND_PRICE,
      modalVisible,
      currency,
      ...toRefs(data),
      rowInventoryInfo,
      variantTableColumns,
      clearData,
      addAttrRow,
      deleteAttrRow,
      validateTriggerOpt,
      validator,
      weightValidator,
      addVariantValidator,
      deleteVariant,
      addAttrVal,
      attrValChange,
      deleteAttrVal,
      submitForm,
      batchInput,
      setPageData,
      setIsDisabled,
      attrNameChange,
      addVariant,
      cancel,
      addDkr,
      selectChange,
      clearMsku,
      clearAttr,
      popupVisibleChange,
      generateStoreSku,
      showInventoryModal,
      addRowInventory,
      getInventoryTxt,
      saveDraftForm,
      transportChange,
      selectionChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.red {
  color: #ff5c5c;
}

.mb8 {
  margin-bottom: 8px;
}

.pb-16 {
  padding-bottom: 16px;
}

:deep(.related-sku-tit),
:deep(.recommend-price-tit),
:deep(.store-sku-tit),
:deep(.inventory-info-tit) {
  display: flex;
  align-items: center;
  span {
    color: #ff5c5c;
  }
}

:deep(.row-variant-add) {
  &.surely-table-row-selected {
    background-color: #fff;
  }
  .surely-table-cell {
    .surely-table-checkbox {
      display: none;
    }
  }
}
:deep(.save-btn) {
  margin-left: 8px;
}
.table-content {
  width: 100%;
}
:deep(.arco-form-item-content-flex) {
  max-width: 100%;
}
.sale-prop-select {
  :deep(.arco-select-view-single) {
    width: auto !important;
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

.value-tag {
  border-radius: 16px;
  margin: 2px 8px 2px 0;
}
.sale-prop-select.arco-select-view-single {
  padding: 2px 12px;
  border-radius: 16px;
  .arco-select-view-input {
    font-size: 12px;
  }
}

:deep(.table-full-width) {
  width: 100%;
}

:deep(.inventory-modal) {
  .arco-modal-footer {
    position: relative !important;
  }
}
</style>
