<template>
  <!-- 店铺 -->
  <gb-select
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

  <gj-input-group>
    <gj-input-search
      v-model="searchData.keyWords"
      class="search-select-rigth"
      placeholder="请输入模板名称关键字"
      @press-enter="keywordEnter"
      @search="keywordEnter"
    />
  </gj-input-group>

  <!-- 模板类型 -->
  <gj-select
    v-model="searchData.componentType"
    class="search-select"
    placeholder="模板类型"
    @change="componentTypeChange"
  >
    <gj-option
      v-for="item in componentTypeList"
      :key="item.value"
      :value="item.value"
      >{{ item.label }}</gj-option
    >
  </gj-select>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";

import { getListingCommonShop } from "@/api/published/common";
import { convertSelectedValue } from "@/utils/format";

export default {
  components: {},
  props: {},
  emits: ["filter-change", "tag-change"],
  setup(props, { emit }) {
    const defaultSearch = {
      shopIds: [],
      keyWords: "",
      componentType: "",
    };
    const data = reactive({
      searchData: {
        ...defaultSearch,
      },
      splitSymbol: "：",
      shopListOpt: [],
      componentTypeList: [
        { value: 1, label: "商品分组" },
        { value: 2, label: "产品信息模块" },
        { value: 3, label: "区域调价模板" },
        { value: 4, label: "车型库模板" },
        { value: 5, label: "尺码模板" },
        { value: 6, label: "运费模板" },
        { value: 7, label: "服务模板" },
      ],
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
        showValue = showValueArr.splice(0, 3).join() + `等${len}`;
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

    const componentTypeChange = () => {
      // let showValueArr = convertSelectedValue(
      //   data.searchData.componentType,
      //   data.componentTypeList
      // )

      // let showValue = ''

      // if (showValueArr.length > 3) {
      //   let len = showValueArr.length
      //   showValue = showValueArr.splice(0, 3).join() + `等${len}`
      // } else {
      //   showValue = showValueArr.join()
      // }
      // const searchItem = {
      //   showName: '模板类型',
      //   showValue: showValue,
      //   id: 'componentType',
      //   splitSymbol: data.splitSymbol,
      // }

      let showValue = convertSelectedValue(
        [data.searchData.componentType],
        data.componentTypeList
      );
      const searchItem = {
        showName: "模板类型",
        showValue: showValue.join(),
        id: "componentType",
        splitSymbol: data.splitSymbol,
      };

      emit("filter-change", data.searchData);
      emit("tag-change", searchItem);
    };

    const keywordEnter = () => {
      const searchItem = {
        showName: "模板",
        showValue: data.searchData.keyWords.trim(),
        id: "keyWords",
        splitSymbol: data.splitSymbol,
      };
      emit("filter-change", data.searchData);
      emit("tag-change", searchItem);
    };

    onMounted(() => {
      getShopListReq();
    });

    return {
      ...toRefs(data),
      resetHandler,
      shopIdsChange,
      changeFilterCondition,
      componentTypeChange,
      keywordEnter,
    };
  },
};
</script>

<style lang="scss" scoped></style>
