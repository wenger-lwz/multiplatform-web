<template>
  <div class="table-content">
    <div
      v-bind="$attrs"
      ref="commonTableRef"
      class="cardContentStyle"
      :style="{ height: scroll.y + 'px' }"
    >
      <gj-empty v-if="!empty" class="empty-content" />
      <gj-space direction="vertical" fill :size="12">
        <gj-card
          :bordered="false"
          v-for="(record, index) in tableDatalist"
          :key="index"
          class="gj-card-table"
          :loading="loading"
        >
          <template #title>
            <slot name="title" :record="record"></slot>
          </template>
          <template #extra>
            <slot name="extra" :record="record"></slot>
          </template>
          <gj-card-grid :style="{ width: '25%' }">
            <gj-card class="card-demo" :bordered="false">
              <slot name="firstCardDemo" :record="record"></slot>
            </gj-card>
          </gj-card-grid>
          <gj-card-grid :style="{ width: '20%' }">
            <gj-card class="card-demo" :bordered="false">
              <slot name="secondCardDemo" :record="record"></slot>
            </gj-card>
          </gj-card-grid>
          <gj-card-grid :style="{ width: '55%' }">
            <gj-card class="card-demo" :bordered="false">
              <slot name="thirdCardDemo" :record="record"></slot>
            </gj-card>
          </gj-card-grid>
        </gj-card>
      </gj-space>
    </div>
    <div class="table-pagination" v-if="showPagination">
      <AppPagination
        :paginationSize="paginationSize"
        :pagination="pagination"
        @onCurrentChange="pageCurrentChange"
        @onPageSizeChange="pageSizeChange"
      />
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  computed,
  ref,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
  watchEffect,
} from "vue";
import AppPagination from "@/components/AppPagination.vue";
// import { getClassify } from '@/api/publicColumn.js'
import { debounce } from "@/utils/common";

export default defineComponent({
  props: {
    pageKey: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    paginationSize: {
      //分页大小
      type: String,
      default: () => {
        return "mini";
      },
    },
    pagination: {
      //分页
      type: Object,
      default: () => {
        return {
          pageCurrent: 1,
          pageSize: 10,
          total: 0,
        };
      },
    },
    scroll: {
      //表格高度
      type: Object,
      default: () => {
        return {
          x: 1100,
          y: 0,
        };
      },
    },
    showPagination: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    id: {
      type: String,
      default: "",
    },
    rowSelectionVisiable: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    isSummary: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    "getTableCurrent",
    "expandedRowsChange",
    "change",
    "expand",
    "resizeColumn",
    "dragEndRow",
    "dragEndColumn",
    "onRowSelection",
    "showMoreSelect",
  ],
  components: {
    AppPagination,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      scroll: {
        x: props.scroll.x,
        y: props.scroll.y,
      },
      slotKeyList: [],
      showColumns: props.columns.map((item) => item),
      selectedRowKeys: [],
      empty: false,
      tableDatalist: [],
    });

    const commonTableRef = ref();

    onMounted(() => {
      data.slotKeyList = Object.keys(proxy.$slots);
      // if (props.id) {
      //   getLastTimeColumn()
      // }
      calculateWH();
      window.addEventListener("resize", debounce(calculateWH, 300));
    });

    // 动态计算table高度
    const calculateWH = () => {
      nextTick(() => {
        // 主容器高度
        let pageName = ".common-pages";
        if (props.pageKey) {
          pageName += props.pageKey;
        }
        const commonPageHeight =
          document.querySelector(pageName)?.clientHeight || 0;
        // 搜索区域的高度
        const searchHeight =
          document.querySelector("#layoutHeader")?.clientHeight || 0;

        // 导出等按钮区域的高度
        const actionBtnHeight =
          document.querySelector("#layoutContentOperate")?.clientHeight || 0;
        // 分页区域的高度
        // const pageHeight = props.isSummary === 1 ? 182 : 132
        //
        const tabsHeight =
          document.querySelector(".tab-pane-page >.arco-tabs-nav")
            ?.clientHeight || 0;
        const pageHeight = props.isSummary === 1 ? 130 : 80;

        if (commonPageHeight === 0) {
          return;
        }
        const heightScoll =
          commonPageHeight -
          (searchHeight + pageHeight + actionBtnHeight + tabsHeight);
        data.scroll.y = heightScoll;
      });
    };

    //排序、筛选变化时触发
    // const handleSelectionChange = (pagination, filters, sorter, actions) => {
    //   let obj = {
    //     pagination,
    //     filters,
    //     sorter,
    //     action: actions.action,
    //   }
    //   emit('change', obj)
    // }
    // 	展开的行变化时触发
    // const handleExpandedRowsChange = (expandedRows) => {
    //   emit('expandedRowsChange', expandedRows)
    // }
    // 	点击展开图标时触发
    // const handleExpand = (expanded, record) => {
    //   let obj = {
    //     ...expanded,
    //     ...record,
    //   }
    //   emit('expand', obj)
    // }
    watchEffect(() => {
      data.empty = props.tableData.length ? true : false;
      data.tableDatalist = props.tableData;
      console.log("LLLLLLLLLLLLLLLLLLL", data.tableDatalist);
    });
    // 拖动列时触发
    const handleResizeColumn = (width, column) => {
      let obj = {
        ...width,
        ...column,
      };
      emit("resizeColumn", obj);
    };
    // 拖拽行结束时触发
    const handleDragEndRow = (val) => {
      emit("dragEndRow", val);
    };
    // 拖拽列结束时触发
    const handleDragEndColumn = (val) => {
      emit("dragEndColumn", val);
    };
    const pageCurrentChange = (val) => {
      emit("getTableCurrent", { pageCurrent: val });
    };
    const pageSizeChange = (val) => {
      emit("getTableCurrent", { pageSize: val });
    };

    // 自定义列设置项
    const setColumnResult = (tempSelectColumn) => {
      data.showColumns = [];
      const copyColumns = props.columns.map((item) => item);
      tempSelectColumn.forEach((item) => {
        copyColumns.forEach((cItem) => {
          if (
            item.isSelected &&
            item.isFixed &&
            cItem.dataIndex === item.dataIndex
          ) {
            const tempcItem = {
              ...cItem,
            };
            tempcItem["fixed"] = "left";
            data.showColumns.push(tempcItem);
          } else if (
            item.isSelected &&
            !item.isFixed &&
            cItem.dataIndex === item.dataIndex
          ) {
            delete cItem["fixed"];
            data.showColumns.push(cItem);
          }
        });
      });
      copyColumns.forEach((item) => {
        if (item.isActionColumn) {
          // 操作列
          data.showColumns.push(item);
        } else if (item.isSortColumns) {
          // 序号列
          data.showColumns.unshift(item);
        } else if (item.isSelectColumn) {
          // 选择项
          data.showColumns.unshift(item);
        }
      });
    };
    // // 获取上一次自定义设置的列信息
    // const getLastTimeColumn = async () => {
    //   const oldColumn = await getClassify({ key: props.id })
    //   if (
    //     (oldColumn?.code === 0 || oldColumn?.code === '0') &&
    //     oldColumn.data
    //   ) {
    //     const columns = JSON.parse(oldColumn.data)
    //     if (columns.length === 0) {
    //       return
    //     }
    //     const tempSelectColumn = columns.filter((item) => {
    //       return item.isSelected && item.isSelected
    //     })
    //     setColumnResult(tempSelectColumn)
    //   }
    // }

    // 用户手动操作设置列
    const setSelfColumn = (val) => {
      setColumnResult(val);
    };

    // 恢复默认设置的函数
    const getResetDef = (val) => {
      setColumnResult(val);
    };

    //设置排序的函数
    const setSorterData = (SetColumnsList, configObj) => {
      const list = [...data.showColumns];
      list.forEach((item) => {
        if (
          Object.prototype.hasOwnProperty.call(configObj.sorter, [item.key])
        ) {
          item.sorter = configObj.sorter[item.key];
        }
      });

      data.showColumns = list;
    };

    const onSelectChange = (selectedRowKeys, selectedRows) => {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      data.selectedRowKeys = selectedRowKeys;
      emit("onRowSelection", selectedRows);
    };

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: data.selectedRowKeys,
        onChange: onSelectChange,
      };
    });

    const clearAllSelectedItems = () => {
      data.selectedRowKeys = [];
      emit("onRowSelection", []);
    };

    // 更新table 受控模式的sort的状态
    const updateSortOrder = (obj) => {
      const list = [...data.showColumns];
      if (obj) {
        list.forEach((item) => {
          if (obj.columnKey === item.key) {
            item.sortOrder = obj.order;
          } else {
            item.sortOrder = false;
          }
        });
      } else {
        list.forEach((item) => {
          item.sortOrder = false;
        });
      }
      data.showColumns = list;
    };

    const scrollTo = (pos, smooth) => {
      commonTableRef.value?.scrollTo(pos, smooth ? "smooth" : "auto");
    };

    const updateScroll = (obj) => {
      data.scroll.x = obj.x;
      data.scroll.y = obj.y;
    };

    onBeforeUnmount(() => {
      window.removeEventListener("resize", debounce(calculateWH, 300));
    });
    onActivated(() => {
      calculateWH();
      window.removeEventListener("resize", debounce(calculateWH, 300));
    });
    onDeactivated(() => {
      window.removeEventListener("resize", debounce(calculateWH, 300));
    });

    return {
      ...toRefs(data),
      commonTableRef,
      rowSelection,
      pageCurrentChange,
      pageSizeChange,
      // handleSelectionChange,
      handleDragEndColumn,
      // handleExpandedRowsChange,
      // handleExpand,
      handleResizeColumn,
      handleDragEndRow,
      setSelfColumn,
      getResetDef,
      setSorterData,
      clearAllSelectedItems,
      onSelectChange,
      updateSortOrder,
      scrollTo,
      updateScroll,
      calculateWH,
    };
  },
});
</script>

<style lang="scss" scoped>
.table-content {
  flex: 1;
  position: relative;
  height: 100%;
  .cardContentStyle {
    background-color: #f2f3f5;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.table-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  width: 100%;
  bottom: 16px;
  z-index: 10;
  border-top: 1px solid #e6e6ed;
  background-color: #ffffff;
  padding-top: 12px;
}
.empty-content {
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
}

:deep(.arco-card-grid) {
  box-shadow: 1px 0 0 0 #e5e6eb, 0 0px 0 0 #e5e6eb, 1px 0 0 0 #e5e6eb,
    1px 0 0 0 #e5e6eb inset, 0 1px 0 0 #e5e6eb inset;
}
.gj-card-table {
  border-radius: 4px;
}
:deep(::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.arco-alert) {
  padding: 4px 8px;
}
:deep(.arco-alert-warning) {
  background: #f2f3f5;
  margin-top: -8px;
}
:deep(.arco-card-header) {
  border-bottom: none;
}
</style>
