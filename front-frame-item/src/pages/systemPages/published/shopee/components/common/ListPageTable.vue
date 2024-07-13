<template>
  <CommonTable
    ref="commonTableRef"
    :row-key="rowKey"
    :columns="tableColumns"
    :selectedRowKeys="selectedRowKeys"
    :tableData="tableData"
    :loading="loading"
    :scroll="scroll"
    :rowSelectionVisiable="true"
    :pagination="paginationProps"
    @onRowSelection="getSelection"
    @getTableCurrent="getTableCurrent"
    @change="sortChange"
  >
  </CommonTable>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  computed,
  watch,
  onBeforeMount,
} from "vue";
import CommonTable from "@/components/CommonTable.vue";

const DEFAULT_SORT = "createTime";
const DEFAULT_ORDER = "DESC";

export default defineComponent({
  props: {
    colunms: {
      type: Array,
      default: () => {
        return [];
      },
    },
    requestApi: {
      type: Function,
      required: true,
    },
  },
  components: {
    CommonTable,
  },
  setup(props, { emit }) {
    const data = reactive({
      rowKey: "id" ?? "draftId",
      loading: false,
      parmasObj: {},
      tableData: [],
      scroll: { x: "auto", y: "auto" },
      sort: DEFAULT_SORT,
      order: DEFAULT_ORDER,
    });

    const pageOption = reactive({
      pageCurrent: 1,
      pageSize: 20,
      total: 0,
    });
    const sortedInfo = ref();
    const commonTableRef = ref();
    const selectedRow = ref([]);

    const tableColumns = computed(() => {
      return props.colunms.map((item) => ({
        ...item,
        key: item.dataIndex,
      }));
    });

    const selectedRowKeys = computed(() => {
      return selectedRow.value.map((item) => item[data.rowKey]);
    });

    const paginationProps = computed(() => {
      return {
        total: pageOption.total,
        pageSize: pageOption.pageSize,
        pageCurrent: pageOption.pageCurrent,
      };
    });
    const searchDataParam = computed(() => {
      const { pageCurrent, pageSize } = pageOption;
      return {
        pageCurrent,
        pageSize,
        sort: data.sort,
        queue: data.order,
        ...data.parmasObj,
      };
    });
    const errorCallBack = () => {
      data.tableData = [];
      pageOption.total = 0;
    };

    const getSelection = (val) => {
      selectedRow.value = val;
    };

    const getTableData = (obj, firstCurrent) => {
      data.parmasObj = obj ?? data.parmasObj;
      if (firstCurrent) {
        // 重新从第一页来查询
        pageOption.pageCurrent = 1;
      }
      data.loading = true;
      selectedRow.value = [];
      const params = searchDataParam.value;
      props
        .requestApi(params)
        .then((res) => {
          data.tableData = res.data?.records || [];
          pageOption.total = res.data.total;
        })
        .catch(() => {
          errorCallBack();
        })
        .finally(() => {
          data.loading = false;
        });
    };
    const getTableCurrent = (e) => {
      pageOption.pageCurrent = e.pageCurrent || pageOption.pageCurrent;
      pageOption.pageSize = e.pageSize || pageOption.pageSize;
      getTableData();
    };

    watch(
      () => selectedRow.value,
      () => {
        emit("update:selectRow", selectedRow.value);
      }
    );

    const sortChange = (val) => {
      /**
       * @param {val} 公共表格傳入的值
       */
      // 这里只监听排序的，有需要的类型自己补充
      if (val.action === "sort") {
        const { order, field, column } = val.sorter;
        data.sort = column ? field : DEFAULT_SORT;
        data.order = order === "ascend" ? "ASC" : "DESC";
        sortedInfo.value = val.sorter;
        getTableData();
        commonTableRef.value.updateSortOrder(sortedInfo.value);
      }
    };

    const resetTableField = () => {
      sortedInfo.value = null;
      data.sort = DEFAULT_SORT; //默认
      data.order = DEFAULT_ORDER; //默认
      // 重置分页
      pageOption.pageCurrent = 1;
      pageOption.pageSize = 20;
      pageOption.total = 0;
      commonTableRef.value.updateSortOrder(sortedInfo.value);
    };

    onBeforeMount(() => {
      // getTableData();
    });

    return {
      ...toRefs(data),
      selectedRowKeys,
      tableColumns,
      commonTableRef,
      paginationProps,
      getSelection,
      getTableData,
      getTableCurrent,
      sortChange,
      resetTableField,
    };
  },
});
</script>
