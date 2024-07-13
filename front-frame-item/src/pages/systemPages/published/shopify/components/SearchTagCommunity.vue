<template>
  <gb-select
    v-if="showItem.includes('shopId')"
    class="search-gb-select"
    placeholder="店铺"
    allow-clear
    v-model="searchData.shopId"
    @confirm="handleChangeObject('shopId', '店铺', $event)"
    @remove="handleChangeObject('shopId', '店铺', searchData.shopId)"
  >
    <gb-select-option
      v-for="item in shopListOpt"
      :key="item.shopId"
      :value="item.shopId"
    >
      {{ item.shopName }}
    </gb-select-option>
  </gb-select>
  <gj-select
    v-if="showItem.includes('specsType')"
    v-model="searchData.specsType"
    :style="{ width: '100px' }"
    placeholder="规格"
    allow-clear
    @change="selectDataChange('specsType', '规格')"
  >
    <gj-option
      v-for="item in specificationList"
      :key="item.code"
      :value="item.code"
      >{{ item.productName }}</gj-option
    >
  </gj-select>
  <!-- 草稿状态 -->
  <gj-select
    v-if="showItem.includes('status')"
    v-model="searchData.status"
    class="search-select"
    placeholder="状态"
    allow-clear
    @change="selectDataChange('status', '状态')"
  >
    <gj-option
      v-for="item in draftStatusList"
      :key="item.value"
      :value="item.value"
      >{{ item.label }}</gj-option
    >
  </gj-select>
  <!-- 草稿状态 -->
  <!-- 在线更改状态 -->
  <gj-select
    v-if="showItem.includes('updateState')"
    v-model="searchData.updateState"
    class="search-select"
    placeholder="状态"
    allow-clear
    @change="selectDataChange('updateState', '修改状态')"
  >
    <gj-option
      v-for="item in onlineChangeStatus"
      :key="item.value"
      :value="item.value"
      >{{ item.label }}</gj-option
    >
  </gj-select>
  <!-- 在线更改状态 -->
  <gj-input-group v-if="showItem.includes('keyWord')">
    <gj-select
      v-model="searchData.keyWordType"
      :style="{ width: '84px' }"
      placeholder="请选择"
      :trigger-props="{ autoFitPopupMinWidth: true }"
      @change="
        selectDataChange(
          'keyWord',
          getLabel(titleListOpt, searchData.keyWordType)
        )
      "
    >
      <gj-option
        v-for="item in titleListOpt"
        :key="item.value"
        :value="item.value"
        >{{ item.label }}</gj-option
      >
    </gj-select>
    <gj-input-search
      v-model="searchData.keyWord"
      class="search-select-rigth"
      placeholder="请输入"
      @keyup.enter="
        selectDataChange(
          'keyWord',
          getLabel(titleListOpt, searchData.keyWordType)
        )
      "
      @search="
        selectDataChange(
          'keyWord',
          getLabel(titleListOpt, searchData.keyWordType)
        )
      "
    />
  </gj-input-group>

  <select-director
    v-if="showItem.includes('chargePersonId')"
    multiple
    class="search-gb-select"
    v-model="searchData.chargePersonId"
    placeholder="负责人"
    :max-tag-count="1"
    allow-search
    allow-clear
    popup-container="#multiplatform-web"
    @ok="handleChangeObject('chargePersonId', '负责人', $event)"
  />

  <gj-input-group
    v-if="showItem.includes('rangeValue')"
    class="tag-time-search"
  >
    <gj-select
      v-model="searchData.timeType"
      :style="{ width: '100px' }"
      placeholder="时间"
      :trigger-props="{ autoFitPopupMinWidth: true }"
      @change="dateChange"
    >
      <gj-option
        v-for="(item, index) in timeOpt"
        :key="index"
        :value="item.value"
        >{{ item.label }}</gj-option
      >
    </gj-select>
    <app-range-picker
      v-model="searchData.rangeValue"
      @change="dateChange"
      style="width: 220px"
    />
  </gj-input-group>
</template>

<script>
import { ref, reactive, toRefs, nextTick } from "vue";
import dayjs from "dayjs";
import SelectDirector from "@/components/SelectDirector.vue";
import AppRangePicker from "@/components/AppRangePicker.vue";
import {
  specificationList,
  draftStatusList,
  onlineChangeStatus,
} from "@pagesSystem/published/shopify/config";
import { convertSelectedValue } from "@/utils/format";
import { getStoreInformationlist } from "@/api/published/common";
export default {
  components: {
    SelectDirector,
    AppRangePicker,
  },
  props: {
    timeOpt: {
      type: Array,
      default: () => {
        return [];
      },
    },
    titleListOpt: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showItem: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultShowIds: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  emits: ["filter-change", "tag-change"],
  setup(props, { emit }) {
    const DEFAULT_OBJ = {
      rangeValue: [],
      keyWordType: "1",
      timeType: "1",
    };

    const data = reactive({
      specificationList,
      searchData: {
        shopId: [],
        chargePersonId: [],
        rangeValue: [],
        specsType: "",
        status: "",
        keyWord: "",
        keyWordType: "1",
        timeType: "1",
        // 在线
        updateState: "",
      },
      splitSymbol: "：",
    });

    // init
    const shopListOpt = ref([]);
    const getShopListReq = () => {
      getStoreInformationlist({ platformCode: "SHOPIFY" }).then((res) => {
        shopListOpt.value = res.data;
      });
    };
    getShopListReq();
    // onMounted(() => {
    //   Object.keys(data.searchData).forEach((key) => {
    //     data.searchData[key] = DEFAULT_OBJ[key] || "";
    //   });
    //   emit("filter-change", data.searchData);
    // });

    const setDefultStatus = () => {
      Object.keys(data.searchData).forEach((key) => {
        data.searchData[key] =
          DEFAULT_OBJ[key] ?? (Array.isArray(data.searchData[key]) ? [] : "");
      });
    };

    const resetHandler = () => {
      setDefultStatus();
      // createDefaultTagList() // !!!
      emit("tag-change", []); // !!!
      emit("filter-change", data.searchData);
    };

    resetHandler();

    const changeFilterCondition = (id) => {
      data.searchData[id] = Array.isArray(data.searchData[id]) ? [] : "";
      emit("filter-change", data.searchData);
    };

    const getShowValue = (searchDataId) => {
      let result = "";
      let item = null;
      switch (searchDataId) {
        case "specsType":
          result =
            data.specificationList.find(
              (item) => item.code === data.searchData[searchDataId]
            )?.productName || "";
          break;
        case "status":
          item = draftStatusList.find(
            (it) => it.value === data.searchData.status
          );
          result = item?.label;
          break;
        case "keyWord":
          result = data.searchData[searchDataId] || "";
          break;
        case "rangeValue":
          result = data.searchData[searchDataId];
          result = result
            ? [
                dayjs(result[0]).format("YYYY-MM-DD"),
                dayjs(result[1]).format("YYYY-MM-DD"),
              ].join("~")
            : "";
          break;
        default:
          result = "";
          break;
      }
      return result;
    };

    const selectDataChange = (searchDataId, searchDataName) => {
      const showValue = getShowValue(searchDataId);
      const searchItem = {
        id: searchDataId,
        showName: searchDataName,
        showValue,
        splitSymbol: data.splitSymbol,
      };
      emit("tag-change", searchItem);
      emit("filter-change", data.searchData);
    };

    const handleChangeObject = (searchDataId, searchDataName, value = []) => {
      const listArr = {
        chargePersonId: value,
        shopId: shopListOpt.value,
      };

      const valueMap = {
        chargePersonId: "value",
        shopId: "shopId",
      };
      const keyMap = {
        chargePersonId: "label",
        shopId: "shopName",
      };

      // 需要处理的数据
      const currentValue = {
        chargePersonId: value.map((item) => item.value),
      };

      const showValue = convertSelectedValue(
        currentValue[searchDataId] || value,
        listArr[searchDataId],
        valueMap[searchDataId],
        keyMap[searchDataId]
      );

      const searchItem = {
        showName: searchDataName,
        showValue: showValue,
        id: searchDataId,
        splitSymbol: data.splitSymbol,
      };
      emit("filter-change", data.searchData);
      emit("tag-change", searchItem);
    };

    const dateChange = () => {
      nextTick(() => {
        const showName = getLabel(props.timeOpt, data.searchData.timeType);
        selectDataChange("rangeValue", showName);
      });
    };

    const getLabel = (list, value) => {
      return list.find((item) => item.value === value)?.label || "";
    };

    return {
      shopListOpt,
      draftStatusList,
      onlineChangeStatus,
      ...toRefs(data),
      getLabel,
      selectDataChange,
      resetHandler,
      changeFilterCondition,
      dateChange,
      handleChangeObject,
    };
  },
};
</script>

<style lang="scss" scoped>
.tag-time-search .arco-picker {
  border-radius: 0 4px 4px 0;
}
</style>
