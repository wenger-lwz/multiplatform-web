<template>
  <!-- 日期 -->
  <appRangePicker
    class="search-range-picker"
    format="YYYY-MM-DD HH:mm:ss"
    v-model="queryCondition.orderDate"
    @change="dateChange"
  ></appRangePicker>
  <gj-input-group>
    <gb-select-input2
      v-model="queryCondition.itemTypeList"
      :options="itemList"
      placeholder="请输入"
      @search="itemTypeChange"
    ></gb-select-input2>
  </gj-input-group>
  <gb-multi-select
    v-model="queryCondition.erpShopIds"
    :options="erpShopIdList"
    placeholder="店铺"
    @ok="selectDataChange('erpShopIds', '店铺', queryCondition.erpShopIds)"
    @clear="selectDataChange('erpShopIds', '店铺', [])"
  />
  <gj-input-group>
    <cancelReson
      placeholder="取消原因"
      class="search-gb-select"
      popup-container="#multiplatform-web"
      :max-tag-count="1"
      :allow-search="true"
      :allow-clear="false"
      v-model="queryCondition.cancelReasons"
      @ok="cancelResonChange('cancelReasons', '取消原因', $event)"
      @change="
        cancelResonChange(
          'cancelReasons',
          '取消原因',
          queryCondition.cancelReasons
        )
      "
      @clear="
        cancelResonChange(
          'cancelReasons',
          '取消原因',
          queryCondition.cancelReasons
        )
      "
    >
    </cancelReson>
  </gj-input-group>
  <gb-multi-select
    v-model="queryCondition.cancelByAndStatuses"
    :options="solutionList"
    placeholder="状态"
    @ok="
      selectDataChange(
        'cancelByAndStatuses',
        '状态',
        queryCondition.cancelByAndStatuses
      )
    "
    @clear="selectDataChange('cancelByAndStatuses', '状态', [])"
  />
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  nextTick,
  onBeforeMount,
} from "vue";
import appRangePicker from "@/components/AppRangePicker.vue";
import { itemList } from "@pagesSystem/customerService/shopee/config/shopeeBuyerCancellation.js";
import dayjs from "dayjs";
import { setSearchValue } from "@/utils/format.js";
import { convertSelectedValue } from "@/utils/format";
import cancelReson from "./cancelReson.vue";
import {
  getShopeeCancelStatus,
  getShopeeReturnShop,
} from "@/api/customerService/shopee.js";

const DEFAULT_OBJ = {
  cancelByAndStatuses: [],
  orderDate: [],
  cancelReasons: [],
  erpShopIds: [],
  itemTypeList: { selectValue: "buyerName", inputValue: "" },
};

export default defineComponent({
  name: "FilterCondition",
  emits: ["filter-change", "tag-change"],
  components: {
    appRangePicker,
    cancelReson,
  },
  setup(props, { emit }) {
    const data = reactive({
      itemList: itemList, // 多选类目数据
      solutionList: [], //多选类型
      erpShopIdList: [], //多选店铺
      splitSymbol: ":",
      // 请求参数
      queryCondition: {
        cancelByAndStatuses: [],
        orderDate: [],
        cancelReasons: [],

        erpShopIds: [],
        itemTypeList: { selectValue: "buyerName", inputValue: "" },
      },
    });

    // 商品类型change
    const itemTypeChange = ({ selectValue, inputValue }) => {
      tagChangeItem(
        getKeywordLabel(selectValue),
        setSearchValue(inputValue, "itemTypeList"),
        "itemTypeList"
      );
    };
    // 获取label
    const getLabel = (list, value) => {
      return list.find((item) => item.value === value)?.label || "";
    };
    // keyWordLabel
    const getKeywordLabel = (value) => {
      return getLabel(itemList, value);
    };
    //  日期选择
    const dateChange = () => {
      nextTick(() => {
        tagChangeItem("下单日期", getTimeValue("orderDate"), "orderDate");
      });
    };
    // 时间处理
    const getTimeValue = (searchDataId) => {
      let value = data.queryCondition[searchDataId] || [];
      if (value && value.length && searchDataId === "orderDate") {
        value = setSearchValue(
          [
            dayjs(value[0]).format("YYYY-MM-DD"),
            dayjs(value[1]).format("YYYY-MM-DD"),
          ],
          "time"
        );
        data.queryCondition[searchDataId] = [
          dayjs(value[0]).format("YYYY-MM-DD HH:mm:ss"),
          dayjs(value[1]).format("YYYY-MM-DD HH:mm:ss"),
        ];
      }
      return value;
    };
    // tag处理
    const tagChangeItem = (showName, showValue, id) => {
      const searchItem = {
        showName,
        showValue,
        id,
        splitSymbol: data.splitSymbol,
      };
      emit("tag-change", searchItem);
      emit("filter-change", data.queryCondition);
    };

    // 取消原因
    const cancelResonChange = (searchDataId, searchDataName, value) => {
      const listArr = {
        cancelReasons: value,
      };

      const valueMap = {
        cancelReasons: "value",
      };
      const keyMap = {
        cancelReasons: "label",
      };

      const currentValue = {
        cancelReasons: value.map((item) => item?.value || item),
      };

      const showValue = convertSelectedValue(
        currentValue[searchDataId] || value,
        listArr[searchDataId],
        valueMap[searchDataId],
        keyMap[searchDataId]
      );
      tagChangeItem(
        searchDataName,
        setSearchValue(showValue, searchDataId),
        searchDataId
      );
    };

    // 下拉选择
    const selectDataChange = (searchDataId, searchDataName, value) => {
      const map = {
        erpShopIds: data.erpShopIdList,
        cancelByAndStatuses: data.solutionList,
      };

      let showValue = convertSelectedValue(
        value,
        map[searchDataId],
        "value",
        "label"
      );

      tagChangeItem(
        searchDataName,
        setSearchValue(showValue, searchDataId),
        searchDataId
      );
    };
    // 删除tag
    const delTag = (id) => {
      data.queryCondition[id] =
        DEFAULT_OBJ[id] ?? (Array.isArray(data.queryCondition[id]) ? [] : "");
      emit("filter-change", data.queryCondition);
    };
    // 重置
    const resetForm = () => {
      Object.keys(data.queryCondition).forEach((key) => {
        data.queryCondition[key] =
          DEFAULT_OBJ[key] ??
          (Array.isArray(data.queryCondition[key]) ? [] : "");
      });
    };
    const shopeeCancelStatus = () => {
      data.solutionList = [];
      getShopeeCancelStatus().then((res) => {
        data.solutionList = res.data?.map((item) => {
          return {
            ...item,
            label: item.cancelStatusName,
            value: item.cancelByAndStatus,
          };
        });
      });
    };
    const shopeeReturnShop = () => {
      getShopeeReturnShop().then((res) => {
        data.erpShopIdList = res.data?.map((item) => {
          return {
            ...item,
            label: item.erpShopName,
            value: item.erpShopId,
          };
        });
      });
    };

    onBeforeMount(() => {
      shopeeCancelStatus();
      shopeeReturnShop();
    });
    return {
      ...toRefs(data),
      dateChange,
      selectDataChange,
      itemTypeChange,
      resetForm,
      delTag,
      cancelResonChange,
    };
  },
});
</script>

<style lang="scss" scoped></style>
