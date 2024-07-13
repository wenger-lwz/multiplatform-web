<template>
  <div>
    <gj-form
      ref="logisticsPolicyForm"
      :model="logisticsPolicyInfo"
      :rules="rules"
      layout="vertical"
      class="formStyle"
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
                          @popup-visible-change="handleChange(it.prop, $event)"
                          @change="getShippingMethod(it.prop)"
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
                        <gj-space>
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
                        <gj-space
                          direction="vertical"
                          fill
                          class="tableBorderStyle"
                        >
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
                                  placeholder="请选择"
                                  class="search-select"
                                >
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
                                  class="search-select"
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
                                  :max="1000000000000000"
                                  :precision="2"
                                >
                                  <template #prefix>
                                    {{ logisticsPolicyInfo.priceUnit }}
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
                                  :max="1000000000000000"
                                  :precision="2"
                                >
                                  <template #prefix>
                                    {{ logisticsPolicyInfo.priceUnit }}
                                  </template>
                                </gj-input-number>
                              </template>
                              <template
                                v-if="column.dataIndex === 'freeShipping'"
                              >
                                <gj-switch
                                  v-model="
                                    getModel(item.isIntl)[index][
                                      column.dataIndex
                                    ]
                                  "
                                  :checked-value="checkedValue"
                                  :unchecked-value="unCheckedValue"
                                  size="small"
                                >
                                </gj-switch>
                              </template>
                              <template v-if="column.dataIndex === 'action'">
                                <gj-space>
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
          <gj-col :span="24" v-if="logisticsPolicyInfo[item.prop]">
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
                    <!-- <span
                      class="noSiteInfo"
                      v-if="
                        logisticsPolicyInfo.excludeLocationsList?.length === 0
                      "
                      >暂未选择不运送地区</span
                    > -->
                    <span
                      v-for="i in logisticsPolicyInfo.excludeLocationsList"
                      :key="i.countryCode"
                    >
                      {{ i.countryEnName }}</span
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
    width="533px"
    height="100vh-100px"
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
          <!-- <gj-empty v-if="excludeLocationsOption === {}" /> -->
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
      <gj-space class="dialog-footer">
        <gj-button shape="round" @click="handleCancel">取消</gj-button>
        <gj-button shape="round" type="outline" @click="handleOk">
          保存
        </gj-button>
      </gj-space>
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
  computed,
  watch,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
import fullScreenModal from "@pagesSystem/published/components/fullScreenDialog.vue";
import { editFormData, getSiteCnNames, getShopIds } from "./index.js";
import {
  getQueryEbayExcludeShippingLocations,
  getQueryEbayDispatchTimeMax,
  getEbayShippingMethod,
  setSaveEbayStoreRateTables,
  getQueryEbayShippingLocations,
  getQueryEbayStoreRateTables,
} from "@/api/published/ebay.js";
import { GjMessage } from "@gj/atom";
import { createUuid } from "@/utils/common";

export default defineComponent({
  name: "logisticsPolicy",
  components: { SvgIcon, fullScreenModal },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    queryEbayBaseSiteInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const key = "logisticsPolicyInfo";
    const { proxy } = getCurrentInstance();

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
      siteCurrency: "USD",
      logisticsPolicyInfo: {
        domesticDispatchTime: "",
        domesticShippingType: "",
        domesticRateTableEnable: false,
        domesticRateTable: "",
        internationalShippingType: "",
        internationalRateTableEnable: false,
        internationalRateTable: "",
        excludeLocationEnable: true,
        excludeLocations: [],
        domesticDispatchCost: "",
        internationalDispatchCost: "",
        priceUnit: "USD",
        domesticDispatchCostUnit: "USD",
        internationalDispatchCostUnit: "USD",
        domesticShippingMethods: [
          {
            id: 1,
            freeShipping: false,
            shippingAdditionalCost: 0,
            shippingAdditionalCostUnit: "USD",
            shippingCost: 0,
            shippingCostUnit: "USD",
            shippingMethod: "",
          },
        ],
        internationalShippingMethods: [
          {
            id: 2,
            shippingLocations: [],
            freeShipping: false,
            shippingAdditionalCost: 0,
            shippingAdditionalCostUnit: "USD",
            shippingCost: 0,
            shippingCostUnit: "USD",
            shippingMethod: "",
          },
        ],
      },
      tableData: props.formData.tableData,
      formData: props.formData.formData,
      formData1: props.formData.formData1,
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
      nonShippingAreaList: {},
      domesticListOptions: [],
      internationallistOptions: [],
      shippingLocationsOptions: [],
      freightTableOptionDonmestic: [],
      freightTableOptionInternal: [],
      excludeLocationsList: [],
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
    // 关闭不运送地区窗口
    const handleCancel = () => {
      datas.dialogVisible = false;
      datas.excludeLocationsOptionChilds = [];
    };

    // 回显时,父级勾选时,子级也要勾选
    const handleEcho = (curItem) => {
      datas.logisticsPolicyInfo.excludeLocations.forEach((echoItem) => {
        if (echoItem === curItem.countryCode) {
          curItem.isChecked = true;
          handleList(curItem.children, curItem.isChecked);
        }
      });
    };
    // 初始化数据，添加了一个半选和一个全选属性
    const unitChecked = (arr, parentCountryCode) => {
      arr.forEach((item) => {
        item.indeterminate = false;
        item.isChecked = false;
        if (parentCountryCode) {
          item.parentsCode = parentCountryCode;
        }
        if (item.children && item.children.length > 0) {
          unitChecked(item.children, item.countryCode);
        }
      });
      return arr;
    };
    // 点击是否选择运送地区
    const getNonShippingArea = () => {
      datas.dialogVisible = true;
    };
    // 获取不运送地区数据
    const getNonShippingAreaList = () => {
      const params = {
        siteId: siteCnName.value?.siteId,
      };
      getQueryEbayExcludeShippingLocations(params).then((res) => {
        let itemData = res.data;
        Object.keys(itemData).forEach((key) => {
          const newItemData = unitChecked(itemData[key], null);
          let tpa = [];
          newItemData.forEach((item, index) => {
            handleEcho(item);
            if (item.children && item.children.length > 0) {
              item.children.forEach((it) => {
                handleEcho(it);
                handlePreCheck(item);
                if (it.children && it.children.length > 0) {
                  it.children.forEach((j) => {
                    handleEcho(j);
                    handlePreCheck(it);
                    handlePreCheck(item);
                  });
                }
                tpa.push(it);
              });
            }
            itemData[key] = newItemData;
            if (index === itemData[key].length - 1) {
              itemData[key].push(...tpa);
            }
          });
        });
        datas.excludeLocationsOption = itemData;
        getNonShippingList();
      });
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

    // 保存选择不运送地区
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

    // 过滤数据，去重
    const unique = (val) => {
      return val.reduce((prev, cur) => {
        if (toString.call(cur) === "[object Object]") {
          let temp = prev.map((i) => i.countryCode);
          return temp.includes(cur.countryCode) ? prev : [...prev, cur];
        } else {
          return prev.includes(cur) ? prev : [...prev, cur];
        }
      }, []);
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

    // 站点选择后，自动请求处理时间，运输类型方式，处理费用等接口
    const handleChange = (key, val) => {
      if (val) {
        const params = {
          siteId: siteCnName.value?.siteId,
        };
        if (key === "domesticDispatchTime") {
          queryEbayDispatchTimeMax(params);
        } else if (
          key === "domesticShippingType" ||
          key === "internationalShippingType"
        ) {
          ebayShippingMethod(params);
        }
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
        datas.domesticShippingTypeOption =
          res.data.domesticShippingMethod.shippingServiceTypes;
        datas.internationalShippingTypeOption =
          res.data.internationalShippingMethod.shippingServiceTypes;
      });
    };

    // 点击同步所有店铺的的运费表信息
    const setSaveEbayStoreRate = () => {
      const params = {
        shopId: shopIdInfos.value,
      };
      setSaveEbayStoreRateTables(params).then((res) => {
        GjMessage.success(res.message);
      });
    };
    // 获取运费表信息
    const getFreightTable = (shippingType, val) => {
      if (val) {
        const params = {
          shopId: shopIdInfos.value,
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
          siteId: siteCnName.value?.siteId,
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

    // 判断显示国际国内运输方式数据
    const getShippingMethod = (val) => {
      if (
        val === "domesticShippingType" ||
        val === "internationalShippingType"
      ) {
        const params = {
          siteId: siteCnName.value?.siteId,
          shippingServiceType: datas[key][val],
        };
        getEbayShippingMethod(params).then((res) => {
          if (val === "domesticShippingType") {
            datas.domesticListOptions =
              res.data.domesticShippingMethod.domesticList;
          } else if (val === "internationalShippingType") {
            datas.internationallistOptions =
              res.data.internationalShippingMethod.internationallist;
          }
        });
      }
    };
    // 获取站点所有联动数据
    const siteCnName = computed(() => {
      return getSiteCnNames();
    });
    // 页面价格单位
    datas.logisticsPolicyInfo.priceUnit = computed(() => {
      return getSiteCnNames().siteCurrency || "USD";
    });
    // 获取店铺数据
    const shopIdInfos = computed(() => {
      return getShopIds();
    });

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

    // 监听页面站点信息
    watch(
      () => siteCnName.value.siteId,
      (val) => {
        if (val) {
          getNonShippingAreaList();
        }
      },
      { deep: true, immediate: true }
    );

    onMounted(() => {
      // 点击编辑回显
      if (editFormData(datas[key])) {
        datas.logisticsPolicyInfo = editFormData(datas[key]);
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
      handleChange,
      getShippingMethodOptions,
      setSaveEbayStoreRate,
      setSiteCurrency,
      getLogisticsPolicyInfoProp,
      getExcludeLocationEnable,
      getShippingMethod,
      getQueryEbayShipping,
      getFreightTable,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
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
.tableBorderStyle {
  border: 1px solid #f2f2f5;
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
}
</style>
