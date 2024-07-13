<template>
  <div class="normal-filter-content">
    <!-- <gj-select
      v-if="showItem.includes('shopId')"
      v-model="searchData.shopId"
      style="width: 100px"
      placeholder="店铺"
      :trigger-props="{ autoFitPopupMinWidth: true }"
      @change="selectDataChange('shopId', '店铺')"
    >
      <gj-option
        allow-clear
        v-for="item in shopListOpt"
        :key="item.shopId"
        :value="item.shopId"
      >
        {{ item.shopName }}
      </gj-option>
    </gj-select> -->

    <!-- <gj-select
      v-if="showItem.includes('site')"
      v-model="searchData.site"
      style="width: 100px"
      placeholder="站点"
      :trigger-props="{ autoFitPopupMinWidth: true }"
      @change="selectDataChange('site', '站点')"
    >
      <gj-option
        v-for="item in siteList"
        :key="item.platformCode"
        :value="item.platformCode"
        >{{ item.platformName }}</gj-option
      >
    </gj-select> -->

    <gb-select
      v-model="searchData.siteIds"
      placeholder="站点"
      class="search-select"
      :max-tag-count="1"
      @confirm="selectDataChange('siteIds', '站点', $event)"
      @remove="selectDataChange('siteIds', '站点', searchData.siteIds)"
    >
      <gb-select-option
        v-for="item in siteIdList"
        :key="item.platformId"
        :value="item.platformId"
        >{{ item.nameCn }}</gb-select-option
      >
    </gb-select>

    <gb-select
      v-if="showItem.includes('shopId')"
      v-model="searchData.shopId"
      placeholder="店铺"
      :trigger-props="{ autoFitPopupMinWidth: true }"
      @change="selectDataChange('shopId', '店铺')"
    >
      <gb-select-option
        allow-clear
        v-for="item in shopListOpt"
        :key="item.shopId"
        :value="item.shopId"
      >
        {{ item.shopName }}
      </gb-select-option>
    </gb-select>

    <gj-select
      v-if="showItem.includes('status')"
      v-model="searchData.status"
      style="width: 100px"
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

    <!-- <gj-select
      v-if="showItem.includes('statusId')"
      v-model="searchData.statusId"
      style="width: 100px"
      placeholder="状态"
      :trigger-props="{ autoFitPopupMinWidth: true }"
      @change="selectDataChange('statusId', '状态')"
    >
      <gj-option
        allow-clear
        v-for="item in statusListOpt"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </gj-option>
    </gj-select> -->

    <gj-input-group v-if="showItem.includes('keyWords')">
      <gj-select
        v-model="searchData.keyWordType"
        style="width: 95px"
        placeholder="标题"
        :trigger-props="{ autoFitPopupMinWidth: true }"
        @change="
          selectDataChange(
            'keyWords',
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
        v-model="searchData.keyWords"
        :style="{ width: '136px' }"
        placeholder="请输入"
        @keyup.enter="
          selectDataChange(
            'keyWords',
            getLabel(titleListOpt, searchData.keyWordType)
          )
        "
        @search="
          selectDataChange(
            'keyWords',
            getLabel(titleListOpt, searchData.keyWordType)
          )
        "
      />
    </gj-input-group>

    <gj-select
      v-if="showItem.includes('specsType')"
      v-model="searchData.specsType"
      style="width: 100px"
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

    <select-director
      class="search-gb-select"
      placeholder="负责人"
      v-if="showItem.includes('chargePersonId')"
      v-model="searchData.chargePersonId"
      :multiple="true"
      v-bind="cascaderProps"
      @ok="ok"
      @remove="
        selectDataChange('chargePersonId', '负责人', searchData.chargePersonId)
      "
    />

    <gj-input-group v-if="showItem.includes('rangeValue')">
      <gj-select
        v-model="searchData.timeType"
        style="width: 86px"
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
        style="width: 214px"
      />
    </gj-input-group>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, watch, nextTick, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { M_T } from "@/store/mutationsTypes";
import dayjs from "dayjs";
import {
  siteList,
  draftStatusList,
  specificationList,
  personList,
} from "@pagesSystem/published/shopee/config";
import AppRangePicker from "@/components/AppRangePicker.vue";
import SelectDirector from "@/components/SelectDirector.vue";
import { convertSelectedValue } from "@/utils/format";
import { setSearchValue } from "@/utils/format";

const DEFAULT_OBJ = {
  rangeValue: [],
  keyWordType: "1",
  timeType: "1",
};

export default {
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
    const $store = useStore();

    const data = reactive({
      searchData: {
        id: "",
        type: "",
        keyWords: "",
        specsType: "",
        chargePersonId: [],
        keyWordType: "1",
        timeType: "1",
        siteIds: [],
        shopIds: [],
        status: "",
        statusId: "",
        rangeValue: [],
        // keyWordType: '1',
      },
      splitSymbol: "：",
      seleceUser: [],
    });

    const getSiteId = () => {
      $store.dispatch(M_T.GET_SITEID_LIST, "SHOPEE");
    };

    getSiteId();

    const siteIdList = computed(() => {
      return $store.state.common.siteIdList;
    });

    const cascaderProps = {
      placeholder: "负责人",
      popupContainer: "#multiplatform-web",
      allowSearch: true,
      allowClear: true,
      maxTagCount: 1,
    };

    const directorChange = (directorItem) => {
      data.searchData.chargePersonId.push(directorItem.label);
      selectDataChange("chargePersonId", "负责人");
    };

    const ok = (val) => {
      data.seleceUser = val;
      selectDataChange("chargePersonId", "负责人");
    };

    // const shopListOpt = ref([]);
    const statusListOpt = [
      {
        label: "正常",
        value: "1",
      },
      {
        label: "更新失败",
        value: "2",
      },
      {
        label: "暂存未更新",
        value: "3",
      },
    ];
    const draftStatusListOpt = draftStatusList.slice(0, 2);
    /* const getShopListReq = () => {
      getShopList().then((res) => {
        if (res.code === 200) {
          shopListOpt.value = res.data;
        }
      });
    }; */

    const getLabel = (list, value) => {
      return list.find((item) => item.value === value)?.label || "";
    };

    const formatDateTime = (dateTime) => {
      if (dateTime) {
        return dayjs(dateTime).format("YYYY-MM-DD");
      } else {
        return "";
      }
    };

    const getShowValue = (searchDataId) => {
      // 要显示为 -> 全部 的id集合
      if (searchDataId === "rangeValue") {
        return (
          data.searchData[searchDataId]
            ?.map((it) => formatDateTime(it))
            .join("~") || ""
        );
      } else if (searchDataId === "chargePersonId") {
        const item = data.seleceUser.find(
          (it) => it.value == data.searchData[searchDataId][0]
        );
        const value = item?.label;
        return value;
      } else if (searchDataId === "status") {
        const item = draftStatusListOpt.find(
          (it) => it.value == data.searchData.status
        );
        const value = item?.label;
        return value;
      } else if (searchDataId === "specsType") {
        return data.searchData[searchDataId] == 2 ? "变体" : "单品";
      } else if (searchDataId === "keyWords") {
        const value = data.searchData.keyWords.trim();
        return value;
      } else if (searchDataId === "siteIds") {
        let value = convertSelectedValue(
          data.searchData.siteIds,
          siteIdList.value,
          "platformId",
          "nameCn"
        );
        value = setSearchValue(value);
        return value;
      } else {
        const ids = [
          "siteIds",
          "shopIds",
          "status",
          "specsType",
          "chargePersonId",
        ];
        let value = data.searchData[searchDataId];
        value = Array.isArray(value)
          ? value.filter((item) => item).join(",")
          : value;
        value = value || value === 0 ? value : null;
        return value ?? (ids.indexOf(searchDataId) > -1 ? "全部" : "");
      }
    };

    const selectDataChange = (searchDataId, searchDataName) => {
      console.log(searchDataId, "searchDataName,", searchDataName);
      const searchItem = {
        showName: searchDataName,
        showValue: getShowValue(searchDataId),
        id: searchDataId,
        splitSymbol: data.splitSymbol,
      };
      emit("filter-change", data.searchData);
      emit("tag-change", searchItem);
    };

    const createDefaultTagList = () => {
      const list = [];
      // 默认要显示在页面的id集合
      const ids = props.defaultShowIds;
      const nameMap = {
        shopIds: "店铺",
        siteIds: "站点",
        status: "状态",
        statusId: "状态",
        specsType: "规格",
        chargePersonId: "负责人",
        keyWords: getLabel(props.titleListOpt, data.searchData.keyWordType),
        rangeValue: "日期",
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

    const setDefultStatus = () => {
      Object.keys(data.searchData).forEach((key) => {
        data.searchData[key] =
          DEFAULT_OBJ[key] ?? (Array.isArray(data.searchData[key]) ? [] : "");
      });
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
        const searchItem = {
          showName: data.searchData.timeType == 1 ? "创建时间" : "更新时间",
          showValue: getShowValue("rangeValue"),
          id: "rangeValue",
          splitSymbol: data.splitSymbol,
        };
        emit("tag-change", searchItem);
      });
    };

    const change = (value) => {
      console.log("change-value", value);
    };

    const clear = () => {
      console.log("clear");
    };

    const popupVisibleChange = (visible) => {
      console.log("popup-visible-change", visible);
    };

    watch(
      () => data.searchData.rangeValue,
      () => {
        emit("filter-change", data.searchData);
      }
    );

    watch(
      () => data.searchData.siteIds,
      () => {
        emit("filter-change", data.searchData);
      }
    );

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
      // getShopListReq();
      // resetHandler();
    });

    return {
      ...toRefs(data),
      cascaderProps,
      siteList,
      specificationList,
      personList,
      // shopListOpt,
      statusListOpt,
      draftStatusListOpt,
      getLabel,
      selectDataChange,
      resetHandler,
      changeFilterCondition,
      dateChange,
      change,
      clear,
      popupVisibleChange,
      directorChange,
      siteIdList,
      ok,
    };
  },
};
</script>

<style lang="scss" scoped>
.normal-filter-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  :deep(.arco-select-view-single) .arco-select-view-suffix {
    padding-left: 0;
  }
}

/deep/.charge-person {
  width: 150px;
}
</style>
