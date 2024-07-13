//物流政策
<template>
  <div class="logisticsPolicy-info" id="logisticsPolicy-ebay">
    <gj-row :gutter="24" class="pt">
      <gj-col :span="12">
        <gj-space>
          <h2 class="title">物流政策</h2>
        </gj-space>
      </gj-col>
      <gj-col :span="12" class="header_rigth">
        <gj-row justify="end">
          <gj-space>
            <gj-select
              size="small"
              :style="{ width: '160px' }"
              v-model="logisticsPolicyInfo.logisticsTemplateId"
              placeholder="请选择"
              allow-clear
              :trigger-props="{ autoFitPopupMinWidth: true }"
              @popup-visible-change="getItemLogisticsTemplateId"
            >
              <gj-option
                v-for="item in logisticsTemplateList"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</gj-option
              >
            </gj-select>
            <gj-button type="text">另存为模板</gj-button>
          </gj-space>
        </gj-row>
      </gj-col>
    </gj-row>
    <gj-form
      ref="logisticsPolicyForm"
      :model="logisticsPolicyInfo"
      :rules="rules"
      layout="vertical"
      class="logisticsPolicyForm"
    >
      <gj-row :gutter="24">
        <template v-for="(item, idx) in formData" :key="idx">
          <gj-col :span="24">
            <gj-form-item :label="`${item.label}`" class="formDataStyle">
              <gj-row :gutter="24">
                <template v-for="it in item.children" :key="it.prop">
                  <gj-col
                    :span="it.type === 'table' ? 24 : 8"
                    v-if="
                      it.type === 'elInput' &&
                      getLogisticsPolicyInfoProp(item.isIntl)
                        ? it.ishide
                        : !it.ishide
                    "
                  >
                    <gj-form-item
                      class="formItemStyle"
                      :field="it.field ? it.prop : ''"
                      :required="it.field ? it.field : false"
                    >
                      <template #label v-if="it.label">
                        {{ it.label }}
                        <gj-button
                          type="text"
                          v-if="it.btnTxt"
                          @click="setSaveEbayStoreRate(item.isIntl)"
                          >{{ it.btnTxt }}</gj-button
                        >
                      </template>
                      <template v-if="it.type === 'select'">
                        <gj-select
                          v-model="logisticsPolicyInfo[it.prop]"
                          :placeholder="item.placeholder"
                          clearable
                          class="flexItem"
                          @popup-visible-change="
                            handleChangePop(it.prop, $event)
                          "
                          @change="handleChange(it.prop, $event)"
                        >
                          <gj-option
                            v-for="j in getOptionList(it.prop, 'option', null)"
                            :key="getOptionList(it.prop, 'key', j)"
                            :value="getOptionList(it.prop, 'key', j)"
                            >{{ getOptionList(it.prop, "name", j) }}</gj-option
                          >
                        </gj-select>
                      </template>
                      <template v-if="it.type === 'elInput'">
                        <gj-input-number
                          v-model="logisticsPolicyInfo[it.prop]"
                          placeholder="请输入"
                          class="flexItem"
                          :max="1000000000000000"
                          :precision="2"
                        >
                          <template #prefix>
                            {{ logisticsPolicyInfo?.priceUnit }}
                            <!-- {{ setSiteCurrency(null, null, it.companyProp) }} -->
                          </template>
                        </gj-input-number>
                      </template>
                      <template v-if="it.type === 'switch'">
                        <gj-space size="mini">
                          <gj-switch
                            v-model="logisticsPolicyInfo[it.prop]"
                            :checked-value="checkedValue"
                            :unchecked-value="unCheckedValue"
                            size="small"
                          /><span>{{
                            logisticsPolicyInfo[it.prop] ? "已开启" : "已关闭"
                          }}</span>
                        </gj-space>
                      </template>
                      <template v-if="it.type === 'freightTable'">
                        <gj-select
                          :disabled="setDisabled(it.prop)"
                          v-model="logisticsPolicyInfo[it.selectProp]"
                          :placeholder="it.placeholder"
                          clearable
                          class="flexItem"
                          @popup-visible-change="
                            getFreightTable(it.shippingType, $event)
                          "
                        >
                          <gj-option
                            v-for="j in getOptionList(
                              it.shippingType,
                              'option',
                              null
                            )"
                            :key="getOptionList(it.shippingType, 'key', j)"
                            :value="getOptionList(it.shippingType, 'key', j)"
                            >{{
                              getOptionList(it.shippingType, "name", j)
                            }}</gj-option
                          >
                        </gj-select>
                      </template>
                      <template v-if="it.type === 'table'">
                        <gj-space direction="vertical" fill>
                          <gj-table
                            :data-source="logisticsPolicyInfo[item.prop]"
                            :pagination="false"
                            :columns="it.tableHeadData"
                            rowKey="id"
                          >
                            <template #bodyCell="{ record, column, index }">
                              <template
                                v-if="column.dataIndex == 'shippingMethod'"
                              >
                                <gj-select
                                  v-model="
                                    getModel(item.isIntl)[index][
                                      column.dataIndex
                                    ]
                                  "
                                  :trigger-props="{
                                    autoFitPopupMinWidth: true,
                                  }"
                                  placeholder="请选择"
                                  class="selectStyle"
                                >
                                  <!-- <gj-option
                                    v-for="i in getShippingMethodOptions(
                                      item.isIntl
                                    )"
                                    :key="
                                      i.shippingMethodCode +
                                      i?.shippingServiceType
                                    "
                                    :value="
                                      i.shippingMethodCode +
                                      i?.shippingServiceType
                                    "
                                    >{{ i?.shippingMethodEnName }}</gj-option
                                  > -->
                                  <gj-option
                                    v-for="i in getShippingMethodOptions(
                                      item.isIntl
                                    )"
                                    :key="i.shippingMethodCode"
                                    :value="i.shippingMethodCode"
                                    >{{ i?.shippingMethodEnName }}</gj-option
                                  >
                                </gj-select>
                              </template>
                              <template
                                v-if="column.dataIndex === 'shippingLocations'"
                              >
                                <gj-select
                                  v-model="
                                    getModel(item.isIntl)[index][
                                      column.dataIndex
                                    ]
                                  "
                                  multiple
                                  placeholder="请选择"
                                  class="selectStyle"
                                  :max-tag-count="1"
                                  @popup-visible-change="getQueryEbayShipping"
                                >
                                  <gj-option
                                    v-for="itemOption in shippingLocationsOptions"
                                    :key="itemOption.id"
                                    :value="itemOption.countryCode"
                                    >{{ itemOption.countryEnName }}</gj-option
                                  >
                                </gj-select>
                              </template>
                              <template
                                v-if="column.dataIndex === 'shippingCost'"
                              >
                                <gj-input-number
                                  v-model="
                                    getModel(item.isIntl)[index][
                                      column.dataIndex
                                    ]
                                  "
                                  :hide-button="true"
                                  placeholder="请输入"
                                  class="elInputStyle tableItem"
                                >
                                  <template #prefix>
                                    {{
                                      setSiteCurrency(
                                        item.isIntl,
                                        index,
                                        column.unitProp
                                      )
                                    }}
                                  </template>
                                </gj-input-number>
                              </template>
                              <template
                                v-if="
                                  column.dataIndex === 'shippingAdditionalCost'
                                "
                                :hide-button="true"
                              >
                                <gj-input-number
                                  v-model="
                                    getModel(item.isIntl)[index][
                                      column.dataIndex
                                    ]
                                  "
                                  :hide-button="true"
                                  placeholder="请输入"
                                  class="elInputStyle tableItem"
                                >
                                  <template #prefix>
                                    {{
                                      setSiteCurrency(
                                        item.isIntl,
                                        index,
                                        column.unitProp
                                      )
                                    }}
                                  </template>
                                </gj-input-number>
                              </template>
                              <template
                                v-if="column.dataIndex === 'freeShipping'"
                              >
                                <gj-switch
                                  v-model="
                                    getModel(item.isIntl)[index][
                                      column.unitProp
                                    ]
                                  "
                                  :checked-value="checkedValue"
                                  :unchecked-value="unCheckedValue"
                                  size="small"
                                >
                                </gj-switch>
                              </template>
                              <template v-if="column.dataIndex === 'action'">
                                <gj-space size="min">
                                  <SvgIcon
                                    svgClass="addTitle"
                                    :width="24"
                                    @click="
                                      addModeOfTransport(
                                        record,
                                        index,
                                        item.isIntl
                                      )
                                    "
                                  ></SvgIcon>
                                  <SvgIcon
                                    v-if="index !== 0"
                                    svgClass="subtract"
                                    :width="24"
                                    @click="delRow(index, item.isIntl)"
                                  ></SvgIcon>
                                </gj-space>
                              </template>
                            </template>
                          </gj-table>
                        </gj-space>
                      </template>
                    </gj-form-item>
                  </gj-col>
                </template>
              </gj-row>
            </gj-form-item>
          </gj-col>
        </template>
      </gj-row>
      <!-- 不运送地区 -->
      <gj-row :gutter="24">
        <template v-for="(item, index) in formData1" :key="index">
          <gj-col :span="24">
            <gj-form-item :label="`${item.label}`">
              <gj-radio-group
                v-model="logisticsPolicyInfo[item.prop]"
                @change="getExcludeLocationEnable"
              >
                <gj-radio
                  v-for="(it, idx) in item.children"
                  :key="idx"
                  :value="it.value"
                  >{{ it.label }}</gj-radio
                >
              </gj-radio-group>
            </gj-form-item>
          </gj-col>
          <gj-col :span="24" v-if="!logisticsPolicyInfo[item.prop]">
            <div class="selectSiteStyle">
              <gj-form-item>
                <template #label v-if="item.label">
                  <span class="titleStyle">{{ item.titleTxt }}</span>
                  <gj-button
                    type="text"
                    v-if="item.btnTxt"
                    @click="getNonShippingArea"
                    >{{ item.btnTxt }}</gj-button
                  >
                </template>
                <div class="siteInfoStyle">
                  <gj-space>
                    <span
                      v-if="
                        logisticsPolicyInfo?.excludeLocationsList?.length === 0
                      "
                    ></span>
                    <span
                      v-for="item in logisticsPolicyInfo?.excludeLocationsList"
                      :key="item.countryCode"
                      v-else
                    >
                      {{ item.countryEnName }}</span
                    >
                  </gj-space>
                </div>
              </gj-form-item>
            </div>
          </gj-col>
        </template>
      </gj-row>
    </gj-form>
  </div>
  <fullScreenModal
    :dialogVisible="dialogVisible"
    height="100vh-100px"
    width="533px"
  >
    <template #title>
      <div class="dialog-title">
        <span>不运送地区</span>
        <gj-button @click="handleCancel" shape="round">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="nonShippingArea">
        <div class="nonShippingArea_left">
          <div
            v-for="item in Object.keys(excludeLocationsOption)"
            :key="item"
            class="itemContnia"
          >
            <span class="itemTitle"> {{ item }}</span>
            <ul class="itemBody">
              <li v-for="it in excludeLocationsOption[item]" :key="it.id">
                <gj-checkbox
                  :value="it.countryCode"
                  @change="getCheckItem(it, $event)"
                  :model-value="it.isChecked"
                  :indeterminate="it.indeterminate"
                ></gj-checkbox>
                <span
                  class="countryEnNameMargin"
                  @click="getItemChilds(item, it.id)"
                  >{{ it.countryEnName }}</span
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="nonShippingArea_line"></div>
        <div class="nonShippingArea_right">
          <gj-empty v-if="excludeLocationsOptionChilds.length === 0" />
          <ul class="itemBody" v-else>
            <li v-for="it in excludeLocationsOptionChilds" :key="it.id">
              <gj-checkbox
                :value="it.countryCode"
                :model-value="it.isChecked"
                :indeterminate="it.indeterminate"
                @change="getCheckItem(it, $event)"
              ></gj-checkbox>
              <span class="countryEnNameMargin">{{ it.countryEnName }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <gj-button shape="round" @click="handleCancel">取消</gj-button>
        <gj-button shape="round" type="outline" @click="handleOk">
          保存
        </gj-button>
      </span>
    </template>
  </fullScreenModal>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  watch,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import { useStore } from "vuex";
import SvgIcon from "@/components/SvgIcon";
import fullScreenModal from "@pagesSystem/published/components/fullScreenDialog.vue";
import { editFormData } from "./index.js";
import {
  getQueryEbayExcludeShippingLocations,
  getQueryEbayDispatchTimeMax,
  getEbayShippingMethod,
  setSaveEbayStoreRateTables,
  getQueryEbayShippingLocations,
  getQueryEbayStoreRateTables,
  getEbayTemplateAssemblyInfo,
} from "@/api/published/ebay.js";
import { GjMessage } from "@gj/atom";
import { createUuid } from "@/utils/common";

export default defineComponent({
  name: "logisticsPolicyInfo",
  emits: ["setShowItemFun", "attrFun"],
  components: {
    SvgIcon,
    fullScreenModal,
  },
  props: {
    actionType: {
      type: String,
      default: () => {
        return "";
      },
    },
    publicList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    goodsRowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    stroeCategoryId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props) {
    const key = "logisticsPolicyInfo";
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const datas = reactive({
      dialogVisible: false,
      checkedValue: true,
      unCheckedValue: false,
      checkItem: [],
      checkChildValue: [],
      domesticDispatchTimeOption: [],
      domesticShippingTypeOption: [],
      internationalShippingTypeOption: [],
      excludeLocationsOption: {},
      excludeLocationsOptionChilds: [],
      expandable: {
        width: 10,
      },
      logisticsPolicyInfo: {
        domesticDispatchTime: "",
        domesticShippingType: "",
        domesticRateTableEnable: false,
        domesticRateTable: "",
        internationalShippingType: "",
        internationalRateTableEnable: false,
        internationalRateTable: "",
        excludeLocationEnable: true,
        excludeLocations: [], //处理后的key
        excludeLocationsList: [],
        domesticDispatchCost: "",
        internationalDispatchCost: "",
        priceUnit: "USD",
        domesticDispatchCostUnit: "USD",
        internationalDispatchCostUnit: "USD",
        domesticShippingMethods: [
          {
            id: 1,
            freeShipping: false,
            shippingAdditionalCost: null,
            shippingAdditionalCostUnit: "USD",
            shippingCost: null,
            shippingCostUnit: "USD",
            shippingMethod: "",
          },
        ],
        internationalShippingMethods: [
          {
            id: 2,
            shippingLocations: [],
            freeShipping: false,
            shippingAdditionalCost: null,
            shippingAdditionalCostUnit: "USD",
            shippingCost: null,
            shippingCostUnit: "USD",
            shippingMethod: "",
          },
        ],
        logisticsTemplateId: "",
      },
      formData: [
        {
          label: "国内运输",
          prop: "domesticShippingMethods",
          isIntl: false,
          children: [
            {
              type: "select",
              label: "处理时间:",
              placeHolder: "请选择",
              field: true,
              isWarp: true,
              prop: "domesticDispatchTime",
            },
            {
              type: "select",
              label: "运输类型:",
              placeHolder: "请选择",
              field: true,
              isWarp: true,
              prop: "domesticShippingType",
            },
            {
              type: "elInput",
              label: "处理费用:",
              placeHolder: "请输入",
              prop: "domesticDispatchCost",
              companyProp: "domesticDispatchCostUnit",
              ishide: true,
            },
            {
              type: "switch",
              label: "使用运费表",
              isWarp: true,
              prop: "domesticRateTableEnable",
            },
            {
              type: "freightTable",
              label: "运费表",
              isWarp: false,
              placeHolder: "请选择",
              children: [{ label: "使用运费表", value: 0 }],
              prop: "domesticRateTableEnable",
              selectProp: "domesticRateTable",
              shippingType: "DOMESTIC",
              btnTxt: "同步店铺运费表",
              identification: "domestic",
            },
            {
              type: "table",
              prop: "domesticRateTableEnable",
              selectProp: "domesticRateTable",
              btnTxt: "同步店铺表",
              identification: "domestic",
              modeOfTransport: "添加运输方式",
              tableHeadData: [
                {
                  title: "国内运输方式",
                  key: "domesticShippingMethod",
                  dataIndex: "shippingMethod",
                },
                {
                  title: "运费",
                  key: "domesticShippingCost",
                  dataIndex: "shippingCost",
                  unitProp: "shippingCostUnit",
                },
                {
                  title: "每件加收",
                  dataIndex: "shippingAdditionalCost",
                  key: "domesticShippingAdditionalCost",
                  unitProp: "shippingAdditionalCostUnit",
                },
                {
                  title: "免运费",
                  dataIndex: "freeShipping",
                  key: "domesticFreeShipping",
                },
                { title: "操作", dataIndex: "action" },
              ],
            },
          ],
        },
        {
          label: "国际运输",
          prop: "internationalShippingMethods",
          isIntl: true,
          children: [
            {
              type: "select",
              label: "运输类型:",
              isWarp: true,
              placeHolder: "请选择",
              prop: "internationalShippingType",
            },
            {
              type: "elInput",
              label: "处理费用:",
              placeHolder: "请输入",
              prop: "internationalDispatchCost",
              companyProp: "internationalDispatchCostUnit",
              ishide: true,
            },
            {
              type: "switch",
              label: "使用运费表",
              isWarp: true,
              prop: "internationalRateTableEnable",
            },
            {
              type: "freightTable",
              label: "运费表",
              placeHolder: "请选择",
              isWarp: false,
              children: [{ label: "使用运费表" }],
              shippingType: "INTERNATIONAL",
              prop: "internationalRateTableEnable",
              selectProp: "internationalRateTable",
              btnTxt: "同步店铺运费表",
              identification: "international",
            },
            {
              type: "table",
              prop: "internationalRateTableEnable",
              identification: "international",
              modeOfTransport: "添加运输方式",
              tableHeadData: [
                {
                  title: "国际运输方式",
                  key: "internaShippingMethod",
                  dataIndex: "shippingMethod",
                },
                {
                  title: "配送地区",
                  dataIndex: "shippingLocations",
                  key: "internaShippingLocations",
                  width: 200,
                },
                {
                  title: "运费",
                  dataIndex: "shippingCost",
                  unitProp: "shippingCostUnit",
                  key: "internaShippingCostUnit",
                },
                {
                  title: "每件加收",
                  dataIndex: "shippingAdditionalCost",
                  unitProp: "shippingAdditionalCostUnit",
                  key: "internaShippingAdditionalCostUnit",
                },
                {
                  title: "免运费",
                  dataIndex: "freeShipping",
                  key: "internaFreeShipping",
                },
                { title: "操作", dataIndex: "action" },
              ],
            },
          ],
        },
      ],
      formData1: [
        {
          label: "不运送地区",
          type: "radio",
          prop: "excludeLocationEnable",
          children: [
            { label: "运送至所有国家", value: true },
            { label: "选择不运送地区", value: false },
          ],
          btnTxt: "选择不运送地区",
          titleTxt: "已选择",
        },
      ],
      rules: {
        domesticDispatchTime: [
          {
            required: true,
            message: "请选择时间",
          },
        ],
        domesticShippingType: [
          {
            required: true,
            message: "请选择运输类型",
          },
        ],
      },
      // tableData: props.formData.tableData,
      nonShippingAreaList: {},
      siteCnName: {},
      domesticListOptions: [],
      internationallistOptions: [],
      shippingLocationsOptions: [],
      freightTableOptionDonmestic: [],
      freightTableOptionInternal: [],
      siteCurrency: "",
      logisticsTemplateList: [],
    });

    // 是否显示处理费用
    const getLogisticsPolicyInfoProp = (val) => {
      if (
        val &&
        datas.logisticsPolicyInfo.internationalShippingType === "Calculated"
      ) {
        return true;
      } else if (
        !val &&
        datas.logisticsPolicyInfo.domesticShippingType === "Calculated"
      ) {
        return true;
      }
      return false;
    };

    // 获取下拉选项的数组
    const getOptionList = (val, key, itemval) => {
      if (key === "option" && itemval === null) {
        if (val === "domesticDispatchTime") {
          return datas.domesticDispatchTimeOption;
        } else if (val === "domesticShippingType") {
          return datas.domesticShippingTypeOption;
        } else if (val === "internationalShippingType") {
          return datas.internationalShippingTypeOption;
        } else if (val === "DOMESTIC") {
          return datas.freightTableOptionDonmestic;
        } else if (val === "INTERNATIONAL") {
          return datas.freightTableOptionInternal;
        }
      } else if (key === "key") {
        if (val === "domesticDispatchTime") {
          return itemval.handlingTimeValue;
        } else if (
          val === "domesticShippingType" ||
          val === "internationalShippingType"
        ) {
          return itemval;
        } else if (val === "DOMESTIC" || val === "INTERNATIONAL") {
          return itemval.rateTableId;
        }
      } else if (key === "name") {
        if (val === "domesticDispatchTime") {
          return itemval.displayName;
        } else if (
          val === "domesticShippingType" ||
          val === "internationalShippingType"
        ) {
          return itemval;
        } else if (val === "DOMESTIC" || val === "INTERNATIONAL") {
          return itemval.rateTableName;
        }
      }
    };

    //币种显示
    const setSiteCurrency = (isIntl, index, key) => {
      if (isIntl !== null) {
        getModel(isIntl)[index][key] = datas.siteCurrency;
        return getModel(isIntl)[index][key];
      }
      return (datas.logisticsPolicyInfo[key] = datas.siteCurrency);
    };

    // 获取v-model对应的国际国内对象
    const getModel = (val) => {
      let modelValue = datas.logisticsPolicyInfo.domesticShippingMethods;
      if (val) {
        modelValue = datas.logisticsPolicyInfo.internationalShippingMethods;
      }
      return modelValue;
    };

    // 是否使用运费表开启按钮
    const setDisabled = (val) => {
      if (datas.logisticsPolicyInfo[val]) {
        return false;
      }
      return true;
    };
    // 判断显示国际国内运输方式数据
    const getShippingMethodOptions = (isIntl) => {
      if (isIntl) {
        return datas.internationallistOptions;
      }
      return datas.domesticListOptions;
    };

    // 表格内点击添加行按钮
    const addModeOfTransport = (row, index, isIntl) => {
      const newTableData = {};
      Object.keys(row).forEach((i) => {
        newTableData[i] = "";
        if (i === "shippingLocations") {
          newTableData[i] = [];
        }
        if (i === "shippingCost" || i === "shippingAdditionalCost") {
          newTableData[i] = 0;
        }
        if (i === "shippingCostUnit" || i === "shippingAdditionalCostUnit") {
          newTableData[i] = row[i];
        }
        if (i === "freeShipping") {
          newTableData[i] = 0;
        }
        newTableData.id = createUuid();
      });
      let idx = ++index;
      let rows = getModel(isIntl);
      rows.splice(idx, 0, newTableData);
      if (isIntl) {
        datas.logisticsPolicyInfo.internationalShippingMethods = rows.map(
          (item) => item
        );
      } else {
        datas.logisticsPolicyInfo.domesticShippingMethods = rows.map(
          (item) => item
        );
      }
    };

    // 表格内删除行按钮
    const delRow = (index, isIntl) => {
      const rows = getModel(isIntl);
      if (rows.length > 1) {
        rows.splice(index, 1);
      }
      if (isIntl) {
        datas.logisticsPolicyInfo.internationalShippingMethods = rows.map(
          (item) => item
        );
      } else {
        datas.logisticsPolicyInfo.domesticShippingMethods = rows.map(
          (item) => item
        );
      }
    };
    // 保存数据
    const submitForm = () => {
      return setForm2(proxy, key, datas[key], "logisticsPolicyForm");
    };

    // 重置清除数据
    const resetForm = () => {
      proxy.$refs["logisticsPolicyForm"].resetFields();
    };

    // 点击是否选择运送地区
    const getNonShippingArea = () => {
      if (!store.getters.getgoodsData.siteId) {
        return GjMessage.warning("请优先选择站点!");
      }
      datas.dialogVisible = true;
      const params = {
        siteId: store.getters.getgoodsData.siteId,
      };
      getQueryEbayExcludeShippingLocations(params).then((res) => {
        let itemData = res.data;
        Object.keys(itemData).forEach((key) => {
          itemData[key].forEach((item) => {
            if (item.children != null) {
              item.indeterminate = false;
              item.children.forEach((it) => {
                itemData[key].push(it);
                it.indeterminate = false;
              });
            }
          });
        });
        datas.excludeLocationsOption = itemData;
      });
    };

    // 关闭不运送地区窗口
    const handleCancel = () => {
      datas.dialogVisible = false;
    };
    // 确认选择不运送地区
    const handleOk = () => {
      let params = [];

      Object.keys(datas.excludeLocationsOption).forEach((key) => {
        let res = handleParams(datas.excludeLocationsOption[key]);
        params.push(...res);
      });

      datas.logisticsPolicyInfo.excludeLocations = params;
      datas.dialogVisible = false;
      datas.excludeLocationsOptionChilds = [];
      getNonShippingList();
    };
    // 获取不运送地区集合
    const getNonShippingList = () => {
      let params = [];
      Object.keys(datas.excludeLocationsOption).forEach((item) => {
        let res = handleNonShippingList(datas.excludeLocationsOption[item]);
        params.push(...res);
      });
      datas.logisticsPolicyInfo.excludeLocationsList = params;
    };

    // 遍历循环匹配相同数据返回（递归）
    const handleNonShippingList = (list) => {
      let submitParams = [];
      if (list && list.length > 0) {
        list.forEach((curItem) => {
          datas.logisticsPolicyInfo.excludeLocations.forEach((echoItem) => {
            if (echoItem === curItem.countryCode) {
              submitParams.push({
                countryCode: curItem.countryCode,
                countryEnName: curItem.countryEnName,
              });
            } else if (curItem.children) {
              let temp = handleNonShippingList(curItem.children);
              submitParams.push(...temp);
            }
          });
        });
      }
      submitParams = unique(submitParams);
      return submitParams;
    };
    // 勾选时，父级也要状态改变
    const handleParams = (list) => {
      let submitParams = [];
      if (list && list.length > 0) {
        list.forEach((item) => {
          if (item.isChecked) {
            if (
              !submitParams.includes(item.countryCode) &&
              !submitParams.includes(item.parentsCode)
            ) {
              submitParams.push(item.countryCode);
            }
          }
          if (item.indeterminate) {
            let temp = handleParams(item.children);
            submitParams.unshift(...temp);
          }
        });
      }
      submitParams = unique(submitParams);
      return submitParams;
    };

    // 勾选时，子级状态也要响应
    const handleList = (list, flag) => {
      if (list && list.length > 0) {
        list.forEach((item) => {
          item.isChecked = flag;
          if (item.children && item.children.length > 0) {
            handleList(item.children, item.isChecked);
          }
        });
      }
    };

    // 父级勾选时
    const handlePreCheck = (obj) => {
      let isPreCheck = obj.children.some(
        (flagItem2) => flagItem2.isChecked === true
      );
      obj.isChecked = false;
      obj.indeterminate = false;
      if (isPreCheck) {
        let isPreAllCheck = obj.children.every(
          (flagItem2) => flagItem2.isChecked === true
        );
        obj.isChecked = isPreAllCheck;
        obj.indeterminate = !isPreAllCheck;
      }
    };

    // 勾选不运送地区
    const getCheckItem = (key, val) => {
      Object.keys(datas.excludeLocationsOption).forEach((key1) => {
        for (let item1 of datas.excludeLocationsOption[key1].values()) {
          if (item1.countryCode === key.countryCode) {
            item1.isChecked = val;
            item1.indeterminate = !val;
            if (!val) {
              item1.isChecked = val;
              item1.indeterminate = val;
            }
            handleList(item1.children, item1.isChecked);
            return;
          } else if (item1.children) {
            for (let item2 of item1.children.values())
              if (item2.countryCode === key.countryCode) {
                item2.isChecked = val;
                item2.indeterminate = !val;
                if (!val) {
                  item2.isChecked = val;
                  item2.indeterminate = val;
                }
                handleList(item2.children, item2.isChecked);
                handlePreCheck(item1);
                return;
              } else if (item2.children) {
                for (let item3 of item2.children.values()) {
                  if (item3.countryCode === key.countryCode) {
                    item3.isChecked = val;
                    handleList(item3.children, item3.isChecked);
                    handlePreCheck(item2);
                    handlePreCheck(item1);
                    return;
                  }
                }
              }
          }
        }
      });
    };

    // 过滤数据
    const unique = (val) => {
      return val.reduce(
        (prev, cur) => (prev.includes(cur) ? prev : [...prev, cur]),
        []
      );
    };

    // 点击地区显示具体地区的所有城市
    const getItemChilds = (val, id) => {
      datas.excludeLocationsOption[val].filter((item) => {
        if (item.id === id) {
          datas.excludeLocationsOptionChilds = item?.children
            ? item?.children
            : [];
        }
      });
    };
    const handleChange = (val, e) => {
      console.log(val, e);
      if (val == "domesticShippingType") {
        let bool = e == "Calculated" ? true : false;
        store.dispatch(proxy.$mt.DRAFT_INFO_DOMESTICTYPE, bool);
        const params = {
          siteId: store.getters.getgoodsData.siteId,
          shippingServiceType: datas.logisticsPolicyInfo.domesticShippingType,
        };
        queryEbayDispatchTimeMax(params);
        ebayShippingMethod(params);
        datas.siteCurrency = store.getters.getdraftData.priceUnit;
      }
    };
    // 站点选择后，自动请求处理时间，运输类型方式，处理费用等接口
    const handleChangePop = (val, e) => {
      console.log(val, e);
      if (e) {
        const params = {
          siteId: store.getters.getgoodsData.siteId,
          shippingServiceType: datas.logisticsPolicyInfo.domesticShippingType,
        };
        queryEbayDispatchTimeMax(params);
        ebayShippingMethod(params);
        // datas.siteCurrency = store.getters.getdraftData.priceUnit
      }
    };

    // 处理时间
    const queryEbayDispatchTimeMax = (params) => {
      getQueryEbayDispatchTimeMax(params).then((res) => {
        datas.domesticDispatchTimeOption = [...res.data];
      });
    };

    // 获取运输类型和方式
    const ebayShippingMethod = (params) => {
      getEbayShippingMethod(params).then((res) => {
        datas.domesticListOptions =
          res.data.domesticShippingMethod.domesticList;
        datas.internationallistOptions =
          res.data.internationalShippingMethod.internationallist;
        datas.domesticShippingTypeOption =
          res.data.domesticShippingMethod.shippingServiceTypes;
        datas.internationalShippingTypeOption =
          res.data.internationalShippingMethod.shippingServiceTypes;
      });
    };

    // 点击同步所有店铺的的运费表信息
    const setSaveEbayStoreRate = () => {
      let params = {
        shopId: store.getters.getdraftData.shopId,
      };
      setSaveEbayStoreRateTables(params).then((res) => {
        GjMessage.success(res.message);
      });
    };
    // 获取运费表信息
    const getFreightTable = (shippingType, val) => {
      if (val) {
        const params = {
          shopId: store.getters.getdraftData.shopId,
          shippingType,
        };
        getQueryEbayStoreRateTables(params).then((res) => {
          if (shippingType === "DOMESTIC") {
            datas.freightTableOptionDonmestic = res.data;
          } else if (shippingType === "INTERNATIONAL") {
            datas.freightTableOptionInternal = res.data;
          }
        });
      }
    };
    // 查询table中的配送地区
    const getQueryEbayShipping = (val) => {
      if (val) {
        const params = {
          siteId: store.getters.getgoodsData.siteId,
        };
        getQueryEbayShippingLocations(params).then((res) => {
          datas.shippingLocationsOptions = res?.data;
        });
      }
    };
    // 获取是否选择不运送地区
    const getExcludeLocationEnable = (val) => {
      datas[key].excludeLocationEnable = val;
    };

    const getItemLogisticsTemplateId = (val) => {
      if (val) {
        const params = {
          url: "shipping",
          params: {
            pageCurrent: 1,
            pageSize: 100,
            siteIds: [store.getters.getgoodsData.siteId],
          },
        };
        getEbayTemplateAssemblyInfo(params).then((res) => {
          datas.logisticsTemplateList = res.data?.records.map((item) => {
            return {
              name: item.name,
              id: item.id,
            };
          });
        });
      }
    };

    watch(
      () => store.getters.getgoodsData.siteId,
      (val) => {
        if (val) {
          datas.siteCurrency = store.getters.getdraftData.priceUnit;
        }
      }
    );
    watch(
      () => props.goodsRowData,
      () => {
        datas.logisticsPolicyInfo = { ...props.goodsRowData };
        datas.logisticsPolicyInfo.excludeLocationsList =
          props.goodsRowData.excludeLocations?.map((item, index) => {
            return {
              countryEnName: item,
              countryCode: index,
            };
          });
        console.log(props.goodsRowData.domesticShippingType, "ppp111");
        if (props.goodsRowData.domesticShippingType == "Flat") {
          store.dispatch(proxy.$mt.DRAFT_INFO_DOMESTICTYPE, false);
        } else {
          store.dispatch(proxy.$mt.DRAFT_INFO_DOMESTICTYPE, true);
        }
        handleChangePop("domesticDispatchTime", true);
      }
    );

    onMounted(() => {
      if (editFormData(datas[key])) {
        datas[key] = editFormData(datas[key]);
      }
    });
    return {
      ...toRefs(datas),
      delRow,
      setDisabled,
      addModeOfTransport,
      submitForm,
      resetForm,
      getModel,
      getNonShippingArea,
      handleCancel,
      handleOk,
      getOptionList,
      getItemChilds,
      getCheckItem,
      handleChangePop,
      handleChange,
      getShippingMethodOptions,
      setSaveEbayStoreRate,
      setSiteCurrency,
      getLogisticsPolicyInfoProp,
      getExcludeLocationEnable,
      getFreightTable,
      getQueryEbayShipping,
      getItemLogisticsTemplateId,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
.logisticsPolicy-info {
  box-sizing: border-box;
  padding: 0 16px 0 8px;
  .title {
    padding: 16px 0 2px 0px;
    font-size: 14px;
    padding-top: 0px;
  }
  .pt {
    padding: 16px 0px 2px 0px;
    // margin-right: 7px !important;
    .title {
      font-size: 14px;
    }
  }
  .header_rigth {
    text-align: left;
  }
  .logisticsPolicyForm {
  }
}

.arco-space-fill {
  display: flex;
  width: 100%;
}
:deep(.arco-form-item-content-flex) {
  display: block;
}
:deep(.arco-space-item) {
  .arco-select.selectStyle {
    height: 32px;
  }
}
:deep(.full-dialog) {
  .app-full-screen-dialog > .arco-modal-body {
    overflow-x: hidden;
    overflow-y: hidden;
  }
}
.titleStyle {
  color: #000430;
  font-weight: 700;
}
.noSiteInfo {
  color: #808197;
}
.selectSiteStyle {
  display: flex;
  border: 1px solid #e6e6ed;
  border-radius: 8px;
  padding-top: 12px;
  padding-left: 16px;
  box-sizing: border-box;
}
.nonShippingArea {
  height: 72vh;
  display: flex;
  overflow: hidden;
  padding: 16px 0px;
  box-sizing: border-box;
  .nonShippingArea_left,
  .nonShippingArea_right {
    padding-left: 18px;
  }
  .nonShippingArea_left {
    width: 50%;
    height: 100%;
    overflow: auto;
    justify-content: flex-start;

    .itemContnia {
      display: flex;
      flex-flow: column;
    }
    .itemTitle,
    .itemBody {
      display: flex;
      align-items: flex-start;
      height: 30px;
      font-size: 12px;
      color: #000430;
    }
    .itemTitle {
      font-weight: 700;
    }
  }
  .nonShippingArea_line {
    width: 1px;
    height: 100%;
    background: #000430;
  }
  .nonShippingArea_right {
    width: 50%;
    overflow: auto;
    justify-content: flex-end;
  }
  .itemBody {
    flex-basis: 100%;
    display: flex;
    flex-flow: column;
    li {
      height: 30px;
      display: flex;
      align-items: center;
    }
  }
  .countryEnNameMargin {
    margin-left: 8px;
    max-width: 280px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
