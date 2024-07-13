<template>
  <gb-select
    v-if="showItem.includes('shopId')"
    class="search-gb-select"
    placeholder="店铺"
    :allow-clear="false"
    v-model="searchData.shopId"
    :max-tag-count="1"
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

  <gb-select
    v-if="showItem.includes('siteId')"
    class="search-select"
    v-model="searchData.siteId"
    :max-tag-count="1"
    placeholder="站点"
    @confirm="handleChangeObject('siteId', '站点', $event)"
    @remove="handleChangeObject('siteId', '站点', searchData.siteId)"
  >
    <gb-select-option
      v-for="item in siteListLang"
      :key="item.platformCode"
      :value="item.platformCode"
    >
      {{ item.platformName }}
    </gb-select-option>
  </gb-select>

  <gj-select
    v-if="showItem.includes('specsType')"
    v-model="searchData.specsType"
    class="search-select"
    placeholder="规格"
    @change="selectDataChange('specsType', '规格')"
  >
    <gj-option
      v-for="item in specificationList"
      :key="item.code"
      :value="item.code"
      >{{ item.productName }}</gj-option
    >
  </gj-select>

  <gj-select
    v-if="showItem.includes('status')"
    v-model="searchData.status"
    class="search-select"
    placeholder="状态"
    @change="selectDataChange('status', '状态')"
  >
    <gj-option
      v-for="item in draftStatusListOpt"
      :key="item.value"
      :value="item.value"
      >{{ item.label }}</gj-option
    >
  </gj-select>

  <gj-select
    v-if="showItem.includes('statusId')"
    v-model="searchData.statusId"
    class="search-select"
    placeholder="修改状态"
    :trigger-props="{ autoFitPopupMinWidth: true }"
    @change="selectDataChange('statusId', '修改状态')"
  >
    <gj-option
      allow-clear
      v-for="item in statusListOpt"
      :key="item.value"
      :value="item.value"
    >
      {{ item.label }}
    </gj-option>
  </gj-select>

  <gj-input-group v-if="showItem.includes('keyWord')">
    <gj-select
      v-if="!showItem.includes('hideTitle')"
      v-model="searchData.keyWordType"
      class="search-select-left"
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
      :class="
        showItem.includes('hideTitle') ? 'search-select' : 'search-select-rigth'
      "
      :placeholder="
        showItem.includes('hideTitle') ? '请输入模板名称关键字' : '请输入'
      "
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
    placeholder="负责人"
    multiple
    class="search-gb-select"
    popup-container="#multiplatform-web"
    :max-tag-count="1"
    :allow-search="true"
    :allow-clear="false"
    v-model="searchData.chargePersonId"
    @ok="handleChangeObject('chargePersonId', '负责人', $event)"
    @clear="
      handleChangeObject('chargePersonId', '负责人', searchData.chargePersonId)
    "
  />
  <!-- @change="
      handleChangeObject('chargePersonId', '负责人', searchData.chargePersonId)
    " -->

  <gj-input-group
    v-if="showItem.includes('rangeValue')"
    class="tag-time-search"
  >
    <gj-select
      v-model="searchData.timeType"
      class="search-select-left"
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
    <AppRangePicker
      class="search-range-picker"
      @change="dateChange"
      v-model="searchData.rangeValue"
    />
  </gj-input-group>
</template>

<script>
import {
  onMounted,
  reactive,
  toRefs,
  watch,
  nextTick,
  ref,
  defineComponent,
} from "vue";
import { useI18n } from "vue-i18n";
import {
  draftStatusList,
  specificationList,
  statusListOpt,
} from "@pagesSystem/published/lazada/config";
import {
  getListingCommonShop,
  getListingCommonSiteId,
} from "@/api/published/common";
import { convertSelectedValue } from "@/utils/format";
import { formatDateTime } from "@/utils/format";
import AppRangePicker from "@/components/AppRangePicker.vue";
import SelectDirector from "@/components/SelectDirector.vue";

const DEFAULT_OBJ = {
  rangeValue: [],
  keyWordType: "1",
  timeType: "1",
};

export default defineComponent({
  name: "LZD_SelectCondition",
  components: {
    AppRangePicker,
    SelectDirector,
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
    const { locale } = useI18n();
    const data = reactive({
      searchData: {
        shopId: [],
        siteId: [],
        chargePersonId: [],
        status: "",
        statusId: "",
        rangeValue: [],
        specsType: "",
        keyWord: "",
        keyWordType: "1",
        timeType: "1",
      },
      splitSymbol: "：",
    });

    const siteList = ref([]);
    const shopListOpt = ref([]);
    const siteListLang = ref([]);

    const draftStatusListOpt = draftStatusList.slice(0, 2);
    const getShopListReq = () => {
      getListingCommonShop({ platformCode: "SHOPEE" }).then((res) => {
        shopListOpt.value = res.data;
      });
    };

    const getListingCommonSiteIdReq = () => {
      getListingCommonSiteId({ platformId: "SHOPEE" }).then((res) => {
        siteList.value = res.data;
        siteListLang.value = siteList.value.map((item) => {
          return {
            platformName: item.nameCn,
            platformCode: item.platformId,
          };
        });
      });
    };

    const getLabel = (list, value) => {
      return list.find((item) => item.value === value)?.label || "";
    };

    const getShowValue = (searchDataId) => {
      let value = "";
      let item = null;
      switch (searchDataId) {
        case "rangeValue":
          value =
            data.searchData[searchDataId]
              ?.map((it) => formatDateTime(it, "YYYY-MM-DD", ""))
              .join("~") || "";
          break;
        case "shopId":
          value = convertSelectedValue(
            data.searchData.shopId,
            shopListOpt.value,
            "platformCode",
            "platformName"
          );
          break;
        case "siteId":
          value = convertSelectedValue(
            data.searchData.siteId,
            siteListLang.value,
            "platformCode",
            "platformName"
          );
          break;
        case "status":
          item = draftStatusListOpt.find(
            (it) => it.value === data.searchData.status
          );
          value = item?.label;
          break;
        case "statusId":
          item = statusListOpt.find(
            (it) => it.value === data.searchData.statusId
          );
          value = item?.label;
          break;
        case "specsType":
          item = specificationList.find(
            (it) => it.code === data.searchData.specsType
          );
          value = item?.productName;
          break;
        case "keyWord":
          value = data.searchData.keyWord.trim();
          break;

        default:
          value = "";
          break;
      }
      return value;
    };

    const selectDataChange = (searchDataId, searchDataName) => {
      const searchItem = {
        showName: searchDataName,
        showValue: getShowValue(searchDataId),
        id: searchDataId,
        splitSymbol: data.splitSymbol,
      };
      emit("filter-change", data.searchData);
      emit("tag-change", searchItem);
    };

    const handleChangeObject = (searchDataId, searchDataName, value = []) => {
      const listArr = {
        siteId: siteListLang.value,
        shopId: shopListOpt.value,
        chargePersonId: value,
      };

      const valueMap = {
        siteId: "platformCode",
        shopId: "shopId",
        chargePersonId: "value",
      };
      const keyMap = {
        siteId: "platformName",
        shopId: "shopName",
        chargePersonId: "label",
      };

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

    const setDefultStatus = () => {
      Object.keys(data.searchData).forEach((key) => {
        data.searchData[key] =
          DEFAULT_OBJ[key] ?? (Array.isArray(data.searchData[key]) ? [] : "");
      });
    };

    const createDefaultTagList = () => {
      const list = [];
      // 默认要显示在页面的id集合
      const ids = props.defaultShowIds;
      const nameMap = {
        shopId: "店铺",
        siteId: "站点",
        status: "状态",
        statusId: "状态",
        specsType: "规格",
        keyWord: getLabel(props.titleListOpt, data.searchData.keyWordType),
        rangeValue: getLabel(props.timeOpt, data.searchData.timeType),
      };
      ids.forEach((item) => {
        list.push({
          showName: nameMap[item] || "",
          showValue: getShowValue(item),
          id: item,
          splitSymbol: data.splitSymbol,
        });
      });
      emit("tag-change", list);
    };

    const resetHandler = () => {
      setDefultStatus();
      createDefaultTagList();
      emit("filter-change", data.searchData);
    };

    const changeFilterCondition = (id) => {
      data.searchData[id] = Array.isArray(data.searchData[id]) ? [] : "";
      emit("filter-change", data.searchData);
    };

    const dateChange = () => {
      nextTick(() => {
        const showName = getLabel(props.timeOpt, data.searchData.timeType);
        const searchItem = {
          showName: showName,
          showValue: getShowValue("rangeValue"),
          id: "rangeValue",
          splitSymbol: data.splitSymbol,
        };
        emit("tag-change", searchItem);
        emit("filter-change", data.searchData);
      });
    };

    watch(
      () => locale.value,
      () => {
        if (locale.value.indexOf("zh") > -1) {
          data.splitSymbol = "：";
        } else {
          data.splitSymbol = ":";
        }
      }
    );

    onMounted(() => {
      getShopListReq();
      getListingCommonSiteIdReq();
      resetHandler();
    });

    return {
      ...toRefs(data),
      siteListLang,
      specificationList,
      shopListOpt,
      statusListOpt,
      draftStatusListOpt,
      getLabel,
      selectDataChange,
      handleChangeObject,
      resetHandler,
      changeFilterCondition,
      dateChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-select {
  width: 200px;
}
</style>
