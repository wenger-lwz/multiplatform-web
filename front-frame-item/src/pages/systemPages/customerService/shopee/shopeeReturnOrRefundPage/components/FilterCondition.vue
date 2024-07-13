<template>
  <!-- 日期 -->
  <appRangePicker
    class="search-range-picker"
    format="YYYY-MM-DD HH:mm:ss"
    v-model="queryCondition.generationDate"
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
  <gb-multi-select
    v-model="queryCondition.returnReasons"
    :options="returnReasonList"
    placeholder="申请原因"
    @ok="
      selectDataChange(
        'returnReasons',
        '申请原因',
        queryCondition.returnReasons
      )
    "
    @clear="selectDataChange('returnReasons', '申请原因', [])"
  />
  <gb-multi-select
    v-model="queryCondition.solutions"
    :options="solutionList"
    placeholder="类型"
    @ok="selectDataChange('solutions', '类型', queryCondition.solutions)"
    @clear="selectDataChange('solutions', '类型', [])"
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
import {
  itemList,
  solutionList,
} from "@pagesSystem/customerService/shopee/config/shopeeReturnOrRefund.js";
import dayjs from "dayjs";
import { setSearchValue } from "@/utils/format.js";
import { convertSelectedValue } from "@/utils/format";
import {
  getShopeeReturnShop,
  getShopeeReturnReason,
} from "@/api/customerService/shopee.js";
const DEFAULT_OBJ = {
  solutions: [],
  generationDate: [],
  returnReasons: [],
  erpShopIds: [],
  itemTypeList: { selectValue: "platformOrderId", inputValue: "" },
};
export default defineComponent({
  name: "FilterCondition",
  emits: ["filter-change", "tag-change"],
  components: {
    appRangePicker,
  },
  setup(props, { emit }) {
    const data = reactive({
      itemList: itemList, // 多选类目数据
      solutionList: solutionList, //多选类型
      returnReasonList: [], //多选申请原因
      erpShopIdList: [], //多选店铺
      splitSymbol: ":",
      // 请求参数
      queryCondition: {
        solutions: [],
        generationDate: [],
        returnReasons: [],
        erpShopIds: [],
        itemTypeList: { selectValue: "platformOrderId", inputValue: "" },
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
        tagChangeItem(
          "生成日期",
          getTimeValue("generationDate"),
          "generationDate"
        );
      });
    };
    // 时间处理
    const getTimeValue = (searchDataId) => {
      let value = data.queryCondition[searchDataId] || [];

      if (value && value.length && searchDataId === "generationDate") {
        value = setSearchValue(
          [
            dayjs(value[0]).format("YYYY-MM-DD"),
            dayjs(value[1]).format("YYYY-MM-DD"),
          ],
          "time"
        );
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
    // 下拉选择
    const selectDataChange = (searchDataId, searchDataName, value) => {
      const map = {
        erpShopIds: data.erpShopIdList,
        returnReasons: data.returnReasonList,
        solutions: solutionList,
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
    const shopeeReturnReason = () => {
      getShopeeReturnReason().then((res) => {
        data.returnReasonList = res.data?.map((item) => {
          return {
            ...item,
            label: item.reasonName,
            value: item.reason,
          };
        });
      });
    };

    onBeforeMount(() => {
      shopeeReturnShop();
      shopeeReturnReason();
    });

    return {
      ...toRefs(data),
      dateChange,
      selectDataChange,
      itemTypeChange,
      resetForm,
      delTag,
    };
  },
});
</script>

<style lang="scss" scoped></style>
