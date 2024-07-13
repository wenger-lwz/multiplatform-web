<template>
  <!-- 店铺 -->
  <gb-select
    v-if="showItem.includes('shopIds')"
    class="search-gb-select"
    placeholder="店铺"
    :allow-clear="false"
    v-model="searchData.shopIds"
    :max-tag-count="1"
    @confirm="shopIdsChange"
    @remove="shopIdsChange"
  >
    <gb-select-option
      v-for="item in shopListOpt"
      :key="item.shopId"
      :value="item.shopId"
    >
      {{ item.shopName }}
    </gb-select-option>
  </gb-select>

  <!-- 更新状态 -->
  <gj-select
    v-if="showItem.includes('updateState')"
    v-model="searchData.updateState"
    class="search-select"
    placeholder="更新状态"
    @change="updateStateChange"
  >
    <gj-option
      v-for="item in updateStateList"
      :key="item.value"
      :value="item.value"
      >{{ item.label }}</gj-option
    >
  </gj-select>

  <!-- 规格 -->
  <gj-select
    v-if="showItem.includes('specsType')"
    v-model="searchData.specsType"
    class="search-select"
    placeholder="规格"
    @change="specsTypeChange"
  >
    <gj-option
      v-for="item in specificationList"
      :key="item.value"
      :value="item.value"
      >{{ item.label }}</gj-option
    >
  </gj-select>

  <!-- 负责人 -->
  <select-director
    v-if="showItem.includes('chargePersonIds')"
    multiple
    placeholder="负责人"
    :max-tag-count="1"
    class="search-gb-select"
    v-model="searchData.chargePersonIds"
    @ok="chargePerson($event)"
  />

  <gj-input-group v-if="showItem.includes('keyWords')">
    <gj-select
      v-model="searchData.type"
      class="search-select-left"
      placeholder="请选择"
      :trigger-props="{ autoFitPopupMinWidth: true }"
      @change="keywordEnter"
    >
      <gj-option
        v-for="item in titleListOpt"
        :key="item.value"
        :value="item.value"
        >{{ item.label }}</gj-option
      >
    </gj-select>
    <gj-input-search
      v-model="searchData.keyWords"
      class="search-select-rigth"
      :placeholder="`请输入${getLabel(titleListOpt, searchData.type)}`"
      @press-enter="keywordEnter"
      @search="keywordEnter"
    />
  </gj-input-group>

  <gj-input-group v-if="showItem.includes('rangeValue')">
    <gj-select
      v-model="searchData.timeType"
      class="search-select-left"
      placeholder="时间"
      :trigger-props="{ autoFitPopupMinWidth: true }"
    >
      <gj-option
        v-for="(item, index) in timeOpt"
        :key="index"
        :value="item.value"
        >{{ item.label }}</gj-option
      >
    </gj-select>
    <AppRangePicker
      @change="dateChange"
      v-model="searchData.rangeValue"
      class="search-range-picker"
    />
  </gj-input-group>

  <!-- 下架时间等同更新时间 -->
  <gj-input-group v-if="showItem.includes('upTime')">
    <gj-select
      v-model="searchData.timeType"
      class="search-select-left"
      placeholder="时间"
      :trigger-props="{ autoFitPopupMinWidth: true }"
    >
      <gj-option :value="1">下架时间</gj-option>
    </gj-select>
    <AppRangePicker
      @change="dateChange"
      v-model="searchData.rangeValue"
      class="search-range-picker"
    />
  </gj-input-group>

  <!-- 创建时间 -->
  <gj-input-group v-if="showItem.includes('createTime')">
    <gj-select
      v-model="searchData.timeType"
      class="search-select-left"
      placeholder="时间"
      :trigger-props="{ autoFitPopupMinWidth: true }"
    >
      <gj-option :value="1">创建时间</gj-option>
    </gj-select>
    <AppRangePicker
      @change="dateChange"
      v-model="searchData.rangeValue"
      class="search-range-picker"
    />
  </gj-input-group>
</template>

<script>
import { onMounted, reactive, toRefs, nextTick } from "vue";
// import dayjs from 'dayjs'
import { getListingCommonShop } from "@/api/published/common";
import AppRangePicker from "@/components/AppRangePicker.vue";
import SelectDirector from "@/components/SelectDirector.vue";
import { convertSelectedValue } from "@/utils/format";
import { getLabel } from "./data";
import { formatDateTime } from "@/utils/format.js";
import {
  titleListOpt,
  timeOpt,
  specificationList,
  updateStateList,
} from "./data";

export default {
  components: {
    AppRangePicker,
    SelectDirector,
  },
  props: {
    showItem: {
      type: Array,
      default: () => {
        return ["shopId", "specsType", "keyWords", "rangeValue"];
      },
    },
  },
  emits: ["filter-change", "tag-change"],
  setup(props, { emit }) {
    const defaultSearch = {
      shopIds: [],
      chargePersonIds: [],
      // publishState: '',//发布状态
      type: 1,
      keyWords: "",
      specsType: "",
      timeType: 1,
      updateState: "",
      rangeValue: [],
    };
    const data = reactive({
      getLabel: getLabel,
      searchData: {
        ...defaultSearch,
      },
      splitSymbol: "：",
      shopListOpt: [],
      titleListOpt,
      timeOpt,
      updateStateList,
      specificationList,
    });

    const getShopListReq = () => {
      getListingCommonShop({ platformCode: "ALIEXPRESS" }).then((res) => {
        data.shopListOpt = res.data;
      });
    };

    const changeFilterCondition = (id) => {
      data.searchData[id] = Array.isArray(data.searchData[id]) ? [] : "";
      emit("filter-change", data.searchData);
    };

    const resetHandler = () => {
      data.rangeValue = [];
      data.searchData = { ...defaultSearch };
    };

    const shopIdsChange = () => {
      let showValueArr = convertSelectedValue(
        data.searchData.shopIds,
        data.shopListOpt,
        "shopId",
        "shopName"
      );

      let showValue = "";

      if (showValueArr.length > 3) {
        let len = showValueArr.length;
        showValue = showValueArr.splice(0, 3).join() + `等${len}项`;
      } else {
        showValue = showValueArr.join();
      }
      const searchItem = {
        showName: "店铺",
        showValue: showValue,
        id: "shopIds",
        splitSymbol: data.splitSymbol,
      };
      emit("filter-change", data.searchData);
      emit("tag-change", searchItem);
    };

    const updateStateChange = () => {
      let showValue = convertSelectedValue(
        [data.searchData.updateState],
        data.updateStateList
      );
      const searchItem = {
        showName: "更新状态",
        showValue: showValue.join(),
        id: "updateState",
        splitSymbol: data.splitSymbol,
      };
      emit("filter-change", data.searchData);
      emit("tag-change", searchItem);
    };

    const specsTypeChange = () => {
      let showValue = convertSelectedValue(
        [data.searchData.specsType],
        data.specificationList
      );
      const searchItem = {
        showName: "规格",
        showValue: showValue.join(),
        id: "specsType",
        splitSymbol: data.splitSymbol,
      };
      emit("filter-change", data.searchData);
      emit("tag-change", searchItem);
    };

    const chargePerson = (value) => {
      const eventValue = value.map((item) => item.value);
      let showValueArr = convertSelectedValue(eventValue, value);
      let showValue = "";

      if (showValueArr.length > 3) {
        let len = showValueArr.length;
        showValue = showValueArr.splice(0, 3).join() + `等${len}项`;
      } else {
        showValue = showValueArr.join();
      }
      const searchItem = {
        showName: "负责人",
        showValue: showValue,
        id: "chargePersonIds",
        splitSymbol: data.splitSymbol,
      };
      emit("filter-change", data.searchData);
      emit("tag-change", searchItem);
    };

    const keywordEnter = () => {
      let showName = getLabel(data.titleListOpt, data.searchData.type);

      const searchItem = {
        showName: showName,
        showValue: data.searchData.keyWords.trim(),
        id: "keyWords",
        splitSymbol: data.splitSymbol,
      };
      emit("filter-change", data.searchData);
      emit("tag-change", searchItem);
    };

    const dateChange = () => {
      nextTick(() => {
        let showValue =
          data.searchData.rangeValue
            ?.map((it) => formatDateTime(it, "YYYY-MM-DD", ""))
            .join("~") || "";
        const searchItem = {
          showName: "日期",
          showValue,
          id: "rangeValue",
          splitSymbol: data.splitSymbol,
        };
        emit("tag-change", searchItem);
        emit("filter-change", data.searchData);
      });
    };

    onMounted(() => {
      getShopListReq();
    });

    return {
      ...toRefs(data),
      dateChange,
      resetHandler,
      shopIdsChange,
      changeFilterCondition,
      updateStateChange,
      specsTypeChange,
      chargePerson,
      keywordEnter,
    };
  },
};
</script>

<style lang="scss" scoped></style>
