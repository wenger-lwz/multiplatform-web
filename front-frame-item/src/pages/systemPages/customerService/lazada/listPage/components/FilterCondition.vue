<template>
  <gj-input-group>
    <gj-select
      class="search-select"
      v-model="queryCondition.reviewId"
      placeholder="全部评论"
      @change="selectDataChange('reviewId', '评论', $event)"
    >
      <gj-option
        v-for="item in reviewTageIdList"
        :key="item.id"
        :value="item.id"
      >
        {{ item.label }}
      </gj-option>
    </gj-select>
  </gj-input-group>
  <!-- 日期 -->
  <appRangePicker
    class="search-range-picker"
    format="YYYY-MM-DD HH:mm:ss"
    v-model="queryCondition.reviewDate"
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
import { getLazadaReviewClassifyTag } from "@/api/customerService/lazada.js";
const DEFAULT_OBJ = {
  ratingStars: [],
  reviewDate: [],
  reviewId: [],
  itemTypeList: { selectValue: "orderId", inputValue: "" },
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
      reviewTageIdList: [], //多选店铺
      splitSymbol: ":",
      // 请求参数
      queryCondition: {
        ratingStars: [],
        reviewDate: [],
        reviewId: [],
        itemTypeList: { selectValue: "orderId", inputValue: "" },
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
        tagChangeItem("评价日期", getTimeValue("reviewDate"), "reviewDate");
      });
    };
    // 时间处理
    const getTimeValue = (searchDataId) => {
      let value = data.queryCondition[searchDataId] || [];

      if (value && value.length && searchDataId === "reviewDate") {
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
      console.log("LKLLLL", data.queryCondition);
      emit("tag-change", searchItem);
      emit("filter-change", data.queryCondition);
    };
    // 下拉选择
    const selectDataChange = (searchDataId, searchDataName, value) => {
      let showValue = "";
      if (data.reviewTageIdList && data.reviewTageIdList.length) {
        showValue =
          data.reviewTageIdList.find((item) => item.id === value)?.label || "";
      }
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
      getLazadaReviewClassifyTag().then((res) => {
        data.reviewTageIdList = res.data;
      });
    };

    onBeforeMount(() => {
      shopeeReturnShop();
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
