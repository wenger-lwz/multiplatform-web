<!--审核不通过tab-->

<template>
  <CommonPage :pageRest="true" @common-page-rest="resetSearch">
    <template #tag-content>
      <TagGroup v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #filter-content>
      <FilterCondition
        @filter-change="filterChange"
        @tag-change="changeList"
        ref="normalFilterRef"
        :showItem="[
          'shopIds',
          'chargePersonIds',
          'specsType',
          'keyWords',
          'createTime',
        ]"
      ></FilterCondition>
    </template>

    <template #table-content>
      <CommonTable
        ref="commonTableRef"
        :rowKey="'listingId'"
        :columns="tableColumns"
        :tableData="tableData"
        :loading="loading"
        :pagination="pagination"
        @getTableCurrent="getTableCurrent"
        @change="sortChange"
      >
        <template #bodyCell="{ record, column }">
          <div v-if="column.dataIndex === 'mainImage'">
            <gb-table-image :url="record?.mainImage"></gb-table-image>
          </div>

          <div v-if="column.dataIndex === 'spu'">
            <div class="title">
              <div class="div1">
                <gb-text>{{ record.defaultTitle }}</gb-text>
              </div>
              <div class="div2">
                <columnCopy :isAnchor="false" :textValue="record.spu" />
              </div>
            </div>
          </div>

          <div v-if="column.dataIndex === 'itemId'">
            <columnCopy :openUrl="record.itemUrl" :textValue="record.itemId" />
          </div>

          <div v-if="column.dataIndex === 'msku'">
            <span v-if="record.msku">{{ record.msku }}</span>
            <span v-else>-</span>
          </div>

          <div v-if="column.dataIndex === 'specsType'">
            <variantPopover
              v-if="record.specsType == 2"
              :record="record"
              :columnList="variantColumnList"
            ></variantPopover>
            <div v-if="record.specsType == 1">单品</div>
          </div>

          <div v-if="column.dataIndex === 'recommendPrice'">
            <span v-if="record.recommendPrice">{{
              record.recommendPrice
            }}</span>
            <span v-else>-</span>
          </div>

          <div v-if="column.dataIndex === 'stock'">
            <span v-if="record.stock">{{ record.stock }}</span>
            <span v-else>-</span>
          </div>

          <div v-if="column.dataIndex === 'createTime'">
            <span>{{
              formatDateTime(record.createTime, "YYYY-MM-DD HH:mm:ss", "-")
            }}</span>
          </div>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onBeforeMount,
  ref,
  computed,
} from "vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import { getOnlineGoodsInfoList } from "@/api/published/aliexpress";
import FilterCondition from "./FilterCondition";
import TagGroup from "@/components/TagGroup.vue";
import { useChangeList, getLabel, variantColumnList } from "./data";
import columnCopy from "@/components/columnCopy.vue";
import variantPopover from "../../../components/variant-popover.vue";
import { formatDateTime } from "@/utils/format.js";
export default defineComponent({
  name: "",
  components: {
    CommonPage,
    CommonTable,
    FilterCondition,
    TagGroup,
    columnCopy,
    variantPopover,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    console.log(proxy);
    const normalFilterRef = ref();
    const tableColumns = computed(() => {
      return [
        {
          key: "mainImage",
          title: "图片",
          dataIndex: "mainImage",
          fixed: "left",
          width: 70,
        },
        {
          key: "spu",
          title: "标题/SKU/SPU",
          dataIndex: "spu",
          width: 200,
        },
        {
          key: "itemId",
          title: "itemID",
          dataIndex: "itemId",
          width: 160,
        },
        {
          key: "shopName",
          title: "店铺",
          dataIndex: "shopName",
          width: 160,
        },
        {
          key: "msku",
          title: "店铺SKU",
          dataIndex: "msku",
          width: 180,
        },
        {
          key: "platformCategoryName",
          title: "AliExpress分类",
          dataIndex: "platformCategoryName",
          width: 140,
        },
        {
          key: "specsType",
          title: "规格",
          dataIndex: "specsType",
          width: 180,
        },
        {
          key: "recommendPrice",
          title: "售价",
          dataIndex: "recommendPrice",
          width: 180,
        },
        {
          key: "stock",
          title: "数量",
          dataIndex: "stock",
          width: 180,
        },
        {
          key: "chargePersonName",
          title: "负责人",
          dataIndex: "chargePersonName",
          width: 160,
        },
        {
          key: "createTime",
          title: "创建时间",
          dataIndex: "createTime",
          width: 160,
          showSorterTooltip: false,
          sorter: true,
        },
      ];
    });
    const data = reactive({
      formatDateTime: formatDateTime,
      getLabel: getLabel,
      variantColumnList: variantColumnList,
      searchActive: [],
      pagination: {
        total: 0,
        pageSize: 20,
        pageCurrent: 1,
      },
      sort: "createTime",
      order: "desc",
      platformStatus: 4,
      loading: false, //是否为加载中状态
      tableData: [],
      paramsObj: {},
    });
    const commonTableRef = ref(null);
    const selectedRow = ref([]);

    const sortedInfo = ref();

    const sortChange = (val) => {
      /**
       * @param {val} 公共表格傳入的值
       */
      // 这里只监听排序的，有需要的类型自己补充
      if (val.action === "sort") {
        const { order, field, column } = val.sorter;
        data.sort = column ? field : "createTime";
        data.order = order === "ascend" ? "asc" : "desc";
        sortedInfo.value = val.sorter;
        getTableList();
        commonTableRef.value.updateSortOrder(sortedInfo.value);
      }
    };

    const getParams = () => {
      const params = {
        shopIds: data.paramsObj?.shopIds?.map((item) => item + "") || [],
        chargePersonIds:
          data.paramsObj?.chargePersonIds?.map((item) => item + "") || [],
        type: data.paramsObj.type || 1,
        keyWords: data.paramsObj.keyWords || "",
        specsType: data.paramsObj.specsType || "",
        timeType: data.paramsObj.timeType || 1,
        startTime:
          (data.paramsObj.rangeValue && data.paramsObj.rangeValue[0]) || "",
        endTime:
          (data.paramsObj.rangeValue && data.paramsObj.rangeValue[1]) || "",
        pageSize: data.pagination.pageSize,
        pageCurrent: data.pagination.pageCurrent,
        sort: data.sort,
        order: data.order,
        platformStatus: data.platformStatus,
      };

      console.log(params);
      return params;
    };

    const getTableList = () => {
      const tableParams = getParams();
      getOnlineGoodsInfoList(tableParams)
        .then((res) => {
          console.log(data.tableData);
          data.tableData = res.data.records;
          data.pagination.total = res.data.total;

          commonTableRef.value.calculateWH();
        })
        .finally(() => {
          selectedRow.value = [];
          data.loading = false;
        });
    };

    const filterChange = (obj) => {
      data.paramsObj = { ...obj };
      getTableList();
    };

    const resetSearch = () => {
      normalFilterRef.value?.resetHandler();
      data.searchActive = [];
      data.paramsObj = {};
      sortedInfo.value = null;
      data.sort = "createTime"; //默认
      data.order = "desc"; //默认
      // 重置分页
      data.pagination.pageCurrent = 1;
      data.pagination.pageSize = 20;
      data.pagination.total = 0;

      getTableList();
      commonTableRef.value.updateSortOrder(sortedInfo.value);
    };
    const changeFilterSelect = (id) => {
      normalFilterRef.value?.changeFilterCondition(id);
    };
    const changeList = (target) => {
      data.searchActive = useChangeList(target, data.searchActive);
    };

    onBeforeMount(() => {
      getTableList();
    });

    const getTableCurrent = (e) => {
      if (Object.prototype.hasOwnProperty.call(e, "pageCurrent")) {
        data.pagination.pageCurrent = e.pageCurrent;
      }
      if (Object.prototype.hasOwnProperty.call(e, "pageSize")) {
        data.pagination.pageSize = e.pageSize;
      }
      getTableList();
    };
    return {
      ...toRefs(data),
      commonTableRef,
      getTableList,
      resetSearch,
      tableColumns,
      getTableCurrent,
      normalFilterRef,
      changeList,
      changeFilterSelect,
      filterChange,
      sortChange,
    };
  },
});
</script>

<style scoped lang="scss"></style>
