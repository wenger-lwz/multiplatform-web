<template>
  <gj-input-group>
    <gb-select-input2
      v-model="queryCondition.itemTypeList"
      :options="itemList"
      placeholder="请输入"
      @search="itemTypeChange"
    ></gb-select-input2>
  </gj-input-group>
  <gj-input-group>
    <gj-select
      v-model="queryCondition.bestOfferStatus"
      allow-clear
      class="search-select"
      placeholder="全部状态"
      @change="
        selectDataChange(
          'bestOfferStatus',
          '状态',
          queryCondition.bestOfferStatus
        )
      "
      @clear="selectDataChange('bestOfferStatus', '状态', '')"
    >
      <gj-option
        v-for="item in solutionList"
        :key="item.statusCode"
        :value="item.statusCode"
        >{{ item.statusName }}</gj-option
      >
    </gj-select>
  </gj-input-group>

  <!-- 日期 -->
  <gj-input-group class="tag-time-search">
    <gj-tag size="large">{{ bestOfferValidTime }}</gj-tag>
    <appRangePicker
      class="search-range-picker"
      format="YYYY-MM-DD HH:mm:ss"
      v-model="queryCondition.timeSet"
      @change="dateChange"
    ></appRangePicker>
  </gj-input-group>
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
import { itemList } from "../config/index.js";
import dayjs from "dayjs";
import { setSearchValue } from "@/utils/format.js";
import { getBestOfferStatusList } from "@/api/customerService/eBay.js";
const DEFAULT_OBJ = {
  bestOfferStatus: "",
  timeSet: [],
  itemTypeList: { selectValue: "itemTitle", inputValue: "" },
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
      solutionList: [], //多选状态
      splitSymbol: ":",
      bestOfferValidTime: "议价处理期限",
      // 请求参数
      queryCondition: {
        bestOfferStatus: "",
        timeSet: [],
        itemTypeList: { selectValue: "itemTitle", inputValue: "" },
      },
    });

    // 商品状态change
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
          data.bestOfferValidTime,
          getTimeValue("timeSet"),
          "timeSet"
        );
      });
    };
    // 时间处理
    const getTimeValue = (searchDataId) => {
      let value = data.queryCondition[searchDataId] || [];

      if (value && value.length && searchDataId === "timeSet") {
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
      let showValue =
        data.solutionList.find((item) => item.statusCode === value)
          ?.statusName || "";
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
    const bestOfferStatusList = () => {
      getBestOfferStatusList().then((res) => {
        data.solutionList = res.data;
      });
    };

    onBeforeMount(() => {
      bestOfferStatusList();
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
