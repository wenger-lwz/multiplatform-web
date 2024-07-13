<template>
  <!-- 日期 -->
  <appRangePicker
    class="search-range-picker"
    format="YYYY-MM-DD HH:mm:ss"
    v-model="queryCondition.evaluateDate"
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
    v-model="queryCondition.ratingStars"
    :options="solutionList"
    placeholder="评价星级"
    @ok="
      selectDataChange('ratingStars', '评价星级', queryCondition.ratingStars)
    "
    @clear="selectDataChange('ratingStars', '评价星级', [])"
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
import { itemList } from "@pagesSystem/customerService/shopee/config/shopeeReturnOrRefund.js";
import dayjs from "dayjs";
import { setSearchValue } from "@/utils/format.js";
import { convertSelectedValue } from "@/utils/format";
import {
  getShopeeReturnShop,
  getShopeeCommentRating_star,
} from "@/api/customerService/shopee.js";
const DEFAULT_OBJ = {
  ratingStars: [],
  evaluateDate: [],
  erpShopIds: [],
  itemTypeList: { selectValue: "buyerName", inputValue: "" },
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
      solutionList: [], //多选类型
      erpShopIdList: [], //多选店铺
      splitSymbol: ":",
      // 请求参数
      queryCondition: {
        ratingStars: [],
        evaluateDate: [],
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
        tagChangeItem("评价日期", getTimeValue("evaluateDate"), "evaluateDate");
      });
    };
    // 时间处理
    const getTimeValue = (searchDataId) => {
      let value = data.queryCondition[searchDataId] || [];

      if (value && value.length && searchDataId === "evaluateDate") {
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
        ratingStars: data.solutionList,
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
      getShopeeCommentRating_star().then((res) => {
        data.solutionList = res.data?.map((item) => {
          return {
            ...item,
            label: item.ratingStarName,
            value: item.ratingStar,
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
