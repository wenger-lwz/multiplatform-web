<template>
  <!-- 搜索条件 -->
  <gb-select
    class="search-gb-select"
    :trigger-props="{ autoFitPopupMinWidth: true }"
    :max-tag-count="1"
    placeholder="店铺"
    multiple
    allow-clear
    v-model="queryCondition.erpShopIds"
    @confirm="multipleSearch('erpShopIds')"
    @clear="multipleSearch('erpShopIds')"
    @remove="multipleSearch('erpShopIds')"
  >
    <gb-select-option
      v-for="item in shopList"
      :key="item.shopId"
      :value="item.shopId"
      >{{ item.shopName }}</gb-select-option
    >
  </gb-select>

  <!-- <gj-select
    class="search-select"
    :trigger-props="{ autoFitPopupMinWidth: true }"
    :max-tag-count="1"
    placeholder="销售负责人"
    multiple
    allow-clear
    v-model="queryCondition.saleDirectorIds"
    @change="multipleSearch('saleDirectorIds')"
    @remove="multipleSearch('saleDirectorIds')"
  >
    <gj-option
      v-for="item in directorList"
      :key="item.saleDirectorId"
      :value="item.saleDirectorId"
      >{{ item.saleDirectorName }}</gj-option
    >
  </gj-select> -->

  <gj-select
    class="search-select"
    :trigger-props="{ autoFitPopupMinWidth: true }"
    :max-tag-count="1"
    placeholder="平台订单状态"
    multiple
    allow-clear
    v-model="queryCondition.platformOrderStatuses"
    @change="multipleSearch('platformOrderStatuses')"
    @remove="multipleSearch('platformOrderStatuses')"
  >
    <gj-option
      v-for="item in platStatusList"
      :key="item.statusCode"
      :value="item.statusCode"
      >{{ item.statusName }}</gj-option
    >
  </gj-select>

  <!-- <gj-select
    class="search-select"
    :trigger-props="{ autoFitPopupMinWidth: true }"
    :max-tag-count="1"
    placeholder="SO单状态"
    multiple
    allow-clear
    v-model="queryCondition.soOrderStatuses"
    @change="multipleSearch('soOrderStatuses')"
    @remove="multipleSearch('soOrderStatuses')"
  >
    <gj-option
      v-for="item in omsStatusList"
      :key="item.statusCode"
      :value="item.statusCode"
      >{{ item.statusName }}</gj-option
    >
  </gj-select> -->
  <!-- 平台单号搜索 -->
  <gb-select-input
    class="search-gb-select-select"
    placeholder="请输入关键词"
    v-model="orderSearchValue"
    :options="orderTypeList"
    @selectChange="orderTypeChange"
    @search="orderChange"
  ></gb-select-input>

  <!-- item项搜索 -->
  <gj-input-group>
    <gj-select
      class="search-select-left"
      placeholder="请选择"
      v-model="itemType"
      @change="itemTypeChange"
      ><gj-option
        v-for="item in itemList"
        :key="item.value"
        :value="item.value"
        >{{ item.label }}</gj-option
      ></gj-select
    >
    <gj-select
      class="search-select-center"
      placeholder="请选择"
      v-model="fuzzyType"
      @change="itemTypeChange"
      ><gj-option
        v-for="item in fuzzyList"
        :key="item.value"
        :value="item.value"
        >{{ item.label }}</gj-option
      ></gj-select
    >
    <gj-input-search
      class="search-select-rigth"
      placeholder="请输入关键词"
      v-model="itemTypeValue"
      allow-clear
      @press-enter="itemTypeValueChange"
      @search="itemTypeValueChange"
      @clear="itemTypeValueChange"
    />
  </gj-input-group>

  <gj-input-group class="tag-time-search">
    <gj-tag size="large">下单日期</gj-tag>
    <appRangePicker
      class="search-range-picker"
      format="YYYY-MM-DD"
      v-model="orderingTime"
      @change="
        getValueByTime(
          'orderingStartTime',
          'orderingEndTime',
          '下单日期',
          'orderingTime',
          false
        )
      "
    ></appRangePicker>
  </gj-input-group>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  nextTick,
} from "vue";
import appRangePicker from "@/components/AppRangePicker.vue";
import {
  itemList,
  fuzzyList,
  allItemList,
  orderTypeList,
} from "@pagesSystem/order/config/basicData";
import {
  getDirector,
  getShop,
  getPlatStatus,
  getOmsStatus,
} from "@/api/order/aliExpress";
import dayjs from "dayjs";
import { getSearchName } from "@pagesSystem/order/utils/orderUtil";
export default defineComponent({
  name: "FilterCondition",
  emits: ["filter-change", "tag-change"],
  components: {
    appRangePicker,
  },
  setup(props, { emit }) {
    const data = reactive({
      // 请求参数
      queryCondition: {
        buyerAccountEmailFuzzySearch: "", // 买家eml模糊
        buyerAccountEmailExactSearch: "", // 买家eml精确
        buyerAccountIdFuzzySearch: "", // 买家id
        buyerAccountIdExactSearch: "", // 买家id
        mskuFuzzySearch: "", // musk
        mskuExactSearch: "", // musk
        productIdFuzzySearch: "", // 产品id
        productIdExactSearch: "", // 产品id
        productNameFuzzySearch: "", // 产品名称
        productNameExactSearch: "", // 产品名称
        erpShopIds: [], // 店铺
        saleDirectorIds: [], // 销售负责人
        erpOrderNumbers: [], // 系统订单编号
        platformOrderNumbers: [], // 平台订单编号
        platformOrderStatuses: [], // 平台状态
        soOrderStatuses: [], // so单状态
        cancelStatuses: [], // 取消状态
        refundStatuses: [], // 退款状态
        orderLastUpdatedEndTime: "", // 订单最晚更新时间
        orderLastUpdatedStartTime: "",
        orderingStartTime: "", // 下单日期
        orderingEndTime: "",
        orderPayStartTime: "", // 付款日期
        orderPayEndTime: "",
      },
      fetchTime: [],
      orderingTime: [],
      payTime: [],
      orderSearchValue: {
        key: "platformOrderNumbers",
        values: "",
      }, // 订单类型及值
      itemType: "productName", // 商品类型
      fuzzyType: 1, // 精确模糊
      itemTypeValue: "", // 商品值
      showAdvanceSearch: false, // 是否展开高级搜索
      orderTypeList: orderTypeList, // order类型下拉数据
      itemList: itemList, // 多选类目数据
      fuzzyList: fuzzyList,
      allItemList: allItemList,
      directorList: [], // 联系人列表
      shopList: [], // 店铺列表
      platStatusList: [], //平台状态
      omsStatusList: [], //so状态
      refundStatusList: [], //退款状态
      cancelStatusList: [], //取消状态
    });

    // 保存视图回显
    const changeQueryList = (val) => {
      val.forEach((item) => {
        const { code, connectCode, extra } = item;
        if (extra.type === "multiple") {
          data.queryCondition[connectCode] = code;
        } else if (extra.type === "time") {
          if (!extra.isAdvance) {
            // 非默认视图时间回显
            data[connectCode] = code;
          }
          // 参数赋值
          handleQueryTime(
            connectCode,
            dayjs(code[0]).format("YYYY-MM-DD HH:mm:ss"),
            dayjs(code[1]).format("YYYY-MM-DD HH:mm:ss")
          );
        } else if (extra.type === "item") {
          data.itemType = extra.itemType;
          data.fuzzyType = extra.fuzzyType;
          data[connectCode] = code;
          data.queryCondition[extra.modelName] = code;
        } else if (extra.type === "order") {
          data[connectCode] = extra.val;
          data.queryCondition[extra.val.key] = code;
        }
      });
      emit("filter-change", data.queryCondition);
    };

    // 默认视图tag删除
    const changeFilterCondition = (val) => {
      const { connectCode, extra } = val;
      if (extra.type === "multiple") {
        data.queryCondition[connectCode] = [];
      } else if (extra.type === "time") {
        if (!extra.isAdvance) {
          // 非默认视图时间删除赋值
          data[connectCode] = [];
        }
        // 清空搜索参数
        handleQueryTime(connectCode, "", "");
      } else if (extra.type === "item") {
        data.queryCondition[extra.modelName] = "";
        data[connectCode] = "";
      } else if (extra.type === "order") {
        data.queryCondition[extra.modelName] = [];
        data[connectCode] = {
          key: "platformOrderNumbers",
          values: "",
        };
      }
      // 重新请求接口
      emit("filter-change", data.queryCondition);
    };

    // 视图tag删除、回显日期处理
    const handleQueryTime = (connectCode, dataStrat, dataEnd) => {
      if (connectCode === "orderingTime") {
        data.queryCondition.orderingStartTime = dataStrat;
        data.queryCondition.orderingEndTime = dataEnd;
      } else if (connectCode === "fetchTime") {
        data.queryCondition.orderLastUpdatedStartTime = dataStrat;
        data.queryCondition.orderLastUpdatedEndTime = dataEnd;
      } else if (connectCode === "payTime") {
        data.queryCondition.orderPayStartTime = dataStrat;
        data.queryCondition.orderPayEndTime = dataEnd;
      }
    };

    // 高级筛选
    const advanceSearchChange = (params, list) => {
      data.queryCondition.refundStatuses = params.refundStatuses;
      data.queryCondition.cancelStatuses = params.cancelStatuses;

      const advancedList = {
        payTime: [
          "orderPayStartTime",
          "orderPayEndTime",
          "付款日期",
          "payTime",
          true,
          params.payTime,
        ],
        fetchTime: [
          "orderLastUpdatedStartTime",
          "orderLastUpdatedEndTime",
          "最后更新日期",
          "fetchTime",
          true,
          params.fetchTime,
        ],
        refundStatuses: [
          params.refundStatuses,
          list.refundStatusList,
          "退款状态",
          "refundStatuses",
          "statusCode",
          "statusName",
          true,
        ],
        cancelStatuses: [
          params.cancelStatuses,
          list.cancelStatusList,
          "取消状态",
          "cancelStatuses",
          "statusCode",
          "statusName",
          true,
        ],
      };

      Object.keys(params).forEach((key) => {
        // 处理默认视图tag及时间参数
        setTimeout(() => {
          if (key === "payTime" || key === "fetchTime") {
            getValueByTime(...advancedList[key]);
          } else if (key === "refundStatuses" || key === "cancelStatuses") {
            handleMultipleSearch(...advancedList.refundStatuses);
          }
        }, 0);
      });
      // 请求接口
      setTimeout(() => {
        emit("filter-change", data.queryCondition);
      }, 0);
    };

    // 日期搜索
    const getValueByTime = (
      dataStrat,
      dataEnd,
      name,
      modelName,
      isAdvance,
      tiemValue
    ) => {
      nextTick(() => {
        let val = [];
        if (modelName === "orderingTime") {
          val = data.orderingTime;
        } else {
          val = tiemValue;
        }

        const flag = val && val.length && val[0];

        data.queryCondition[dataStrat] =
          val && val.length
            ? dayjs(val[0]).format("YYYY-MM-DD") + " 00:00:00"
            : "";
        data.queryCondition[dataEnd] =
          val && val.length
            ? dayjs(val[1]).format("YYYY-MM-DD") + " 23:59:59"
            : "";
        let text = "";
        if (flag) {
          text =
            dayjs(val[0]).format("YYYY-MM-DD") +
            "-" +
            dayjs(val[1]).format("YYYY-MM-DD");
        }
        let extra = {};
        extra.type = "time";
        extra.isAdvance = isAdvance;
        const params = {
          key: name,
          value: text,
          connectCode: modelName,
          code: val,
          cascadeKey: "",
          extra,
        };
        emit("tag-change", params);
        if (!isAdvance) {
          emit("filter-change", data.queryCondition);
        }
      });
    };

    // 下拉多选
    const multipleSearch = (val) => {
      const searchList = {
        erpShopIds: [
          data.queryCondition.erpShopIds,
          data.shopList,
          "店铺",
          "erpShopIds",
          "shopId",
          "shopName",
          false,
        ],
        saleDirectorIds: [
          data.queryCondition.saleDirectorIds,
          data.directorList,
          "销售负责人",
          "saleDirectorIds",
          "saleDirectorId",
          "saleDirectorName",
          false,
        ],
        platformOrderStatuses: [
          data.queryCondition.platformOrderStatuses,
          data.platStatusList,
          "平台订单状态",
          "platformOrderStatuses",
          "statusCode",
          "statusName",
          false,
        ],
        soOrderStatuses: [
          data.queryCondition.soOrderStatuses,
          data.omsStatusList,
          "SO单状态",
          "soOrderStatuses",
          "statusCode",
          "statusName",
          false,
        ],
      };
      handleMultipleSearch(...searchList[val]);
    };

    // 下拉多选及tag处理 （val：value值, dataList：list列表, name：给tag的key, modelName：绑定的字段, value：list的valueName, label:list的labelName）
    const handleMultipleSearch = (
      val,
      dataList,
      name,
      modelName,
      value,
      label,
      isAdvance
    ) => {
      let text = "";
      if (val.length) {
        const arr = dataList.slice(0, 4);
        arr.forEach((element) => {
          if (val.indexOf(element[value]) > -1) {
            text += element[label] + ",";
          }
        });
        text = text.replace(/,$/, "");
      }
      let extra = {};
      extra.type = "multiple";
      extra.isAdvance = isAdvance;
      const params = {
        key: name,
        value: text,
        connectCode: modelName,
        code: val,
        cascadeKey: "",
        extra,
      };
      emit("tag-change", params);
      if (!isAdvance) {
        emit("filter-change", data.queryCondition);
      }
    };

    // 多行搜索下拉change
    const orderTypeChange = (val) => {
      data.orderSearchValue.values = Array.isArray(
        data.orderSearchValue?.values
      )
        ? data.orderSearchValue?.values
            .filter((item) => item && item.trim())
            .map((item) => item.trim())
        : [];
      if (val && data.orderSearchValue?.values) {
        let extra = {};
        extra.type = "order";
        extra.val = data.orderSearchValue;
        extra.modelName = data.val;
        extra.isAdvance = false;
        getValueByArrey(
          data.orderSearchValue.key,
          data.orderTypeList,
          data.orderSearchValue.values,
          true
        );
        getTags(
          data.orderSearchValue.key,
          data.orderTypeList,
          data.orderSearchValue.values,
          "orderSearchValue",
          true,
          extra
        );
      }
    };

    // order多行搜索
    const orderChange = (val) => {
      if (!val.key) return;
      val.values = Array.isArray(val?.values)
        ? val?.values
            .filter((item) => item && item.trim())
            .map((item) => item.trim())
        : [];
      let extra = {};
      extra.type = "order";
      extra.val = val;
      extra.modelName = val.key;
      extra.isAdvance = false;
      getValueByArrey(val.key, data.orderTypeList, val.values, true);
      getTags(
        val.key,
        data.orderTypeList,
        val.values,
        "orderSearchValue",
        true,
        extra
      );
    };

    // 商品类型change
    const itemTypeChange = () => {
      if (data.itemTypeValue.trim()) {
        itemTypeValueChange();
      }
    };

    // searchValuechange
    const itemTypeValueChange = () => {
      const searchName = getSearchName(data.itemType, data.fuzzyType);
      const newVal = data.itemTypeValue.trim();
      let extra = {};
      extra.type = "item";
      extra.modelName = searchName;
      extra.fuzzyType = data.fuzzyType;
      extra.itemType = data.itemType;
      extra.isAdvance = false;
      getValueByArrey(searchName, data.allItemList, newVal, false);
      getTags(
        searchName,
        data.allItemList,
        newVal,
        "itemTypeValue",
        false,
        extra
      );
    };

    // 参数处理(val:下拉框值、dataList：下拉框列表，newVal：搜索框值、isArrey：是否是数组)
    const getValueByArrey = (val, dataList, newVal, isArrey) => {
      dataList.forEach((element) => {
        if (element.value === val) {
          data.queryCondition[val] = newVal;
        } else {
          isArrey
            ? (data.queryCondition[element.value] = [])
            : (data.queryCondition[element.value] = "");
        }
      });
      emit("filter-change", data.queryCondition);
    };

    // tag处理(val:下拉框值、dataList：下拉框列表，newVal：搜索框值、modelName：搜索绑定值、isArrey：是否是数组、 extra：额外参数)
    const getTags = (val, dataList, newVal, modelName, isArrey, extra) => {
      let name = "";
      let text = "";
      dataList.forEach((item) => {
        if (item.value === val) {
          name = item.label;
        }
      });
      if (isArrey) {
        if (newVal.length) {
          text =
            newVal.length > 4
              ? newVal[0] + "," + newVal[1] + "," + newVal[2] + "," + newVal[3]
              : newVal.join(",");
        }
      } else {
        text = newVal;
      }
      const params = {
        key: name,
        value: text,
        connectCode: modelName,
        code: newVal,
        cascadeKey: "",
        extra,
      };
      emit("tag-change", params);
    };

    // 重置
    const reset = (flag) => {
      // 请求参数
      data.queryCondition = {
        buyerAccountEmailFuzzySearch: "",
        buyerAccountEmailExactSearch: "",
        buyerAccountIdFuzzySearch: "",
        buyerAccountIdExactSearch: "",
        mskuFuzzySearch: "",
        mskuExactSearch: "",
        productIdFuzzySearch: "",
        productIdExactSearch: "",
        productNameFuzzySearch: "",
        productNameExactSearch: "",
        erpShopIds: [], // 店铺
        saleDirectorIds: [], // 销售负责人
        erpOrderNumbers: [], // 系统订单编号
        platformOrderNumbers: [], // 平台订单编号
        platformOrderStatuses: [], // 平台状态
        soOrderStatuses: [], // so单状态
        cancelStatuses: [], // 取消状态
        refundStatuses: [], // 退款状态
        orderLastUpdatedEndTime: "", // 订单最晚更新时间
        orderLastUpdatedStartTime: "",
        orderingStartTime: "", // 下单日期
        orderingEndTime: "",
        orderPayStartTime: "", // 付款日期
        orderPayEndTime: "",
      };
      data.fetchTime = [];
      data.orderingTime = [];
      data.payTime = [];
      data.orderSearchValue = {
        key: "platformOrderNumbers",
        values: "",
      };
      data.itemType = "productName";
      data.fuzzyType = 1;
      data.itemTypeValue = "";
      if (flag) {
        emit("filter-change", data.queryCondition);
      }
    };

    // 获取负责人
    const toGetDirector = async () => {
      const res = await getDirector();
      data.directorList = res.data;
    };

    // 获取店铺
    const toGetShop = async () => {
      const res = await getShop();
      data.shopList = res.data;
    };

    // 获取平台状态
    const toGetPlatStatus = async () => {
      const res = await getPlatStatus();
      data.platStatusList = res.data;
    };

    // 获取so状态
    const toGetOmsStatus = async () => {
      const res = await getOmsStatus();
      data.omsStatusList = res.data;
    };

    onBeforeMount(() => {
      toGetDirector();
      toGetShop();
      toGetPlatStatus();
      toGetOmsStatus();
    });

    return {
      ...toRefs(data),
      advanceSearchChange,
      multipleSearch,
      itemTypeChange,
      itemTypeValueChange,
      reset,
      orderChange,
      orderTypeChange,
      changeFilterCondition,
      changeQueryList,
      getValueByTime,
    };
  },
});
</script>

<style lang="scss" scoped></style>
