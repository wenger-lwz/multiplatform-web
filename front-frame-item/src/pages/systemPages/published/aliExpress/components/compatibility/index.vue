<template>
  <div class="compatibility-wrap">
    <div>
      <gj-radio-group v-model="modelType" @change="modelTypeChange">
        <gj-radio :value="1">汽车</gj-radio>
        <gj-radio :value="2">摩托车</gj-radio>
      </gj-radio-group>
    </div>
    <h5 class="compatibility-tit">
      <gj-button type="primary" size="mini" @click="addCompatibility"
        >添加兼容</gj-button
      >
    </h5>
    <div class="compatibility-table-bar">
      <div class="selected-tip">
        已选的兼容信息<i
          >（最多可选中{{ maxSelectedCount }}个，已选{{
            computedSelectedTableRows.length
          }}个）</i
        >
      </div>
      <gj-input-search
        class="compatibility-table-search"
        placeholder="搜索.."
        @input="onInput"
      />
    </div>
    <gj-table
      class="compatibility-table"
      row-key="rowKey"
      :row-height="35"
      :scroll="{ y: 385 }"
      :animate-rows="false"
      :columns="computedTableColumns"
      :pagination="false"
      :data-source="compatibilityTableData"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'">
          {{ index + 1 }}
        </template>
        <template v-if="column.key === 'operation'">
          <gj-button type="text" size="mini" @click="deleteRow(record, index)"
            >删除</gj-button
          >
        </template>
      </template>
    </gj-table>
    <gj-modal
      class="ali-add-compatibility-modal"
      title="添加兼容信息"
      v-model:visible="visible"
      :render-to-body="false"
      @ok="handleOk"
      @cancel="handleCancel"
      fullscreen
    >
      <compatibility-cascader-panel
        v-model="modelValue"
        class="car-cascader-panel"
        :class="panelClass"
        :options="options"
        :loading="loading"
        multiple
        path-mode
        :model-type="modelType"
        :load-more="loadMore"
        :field-names="fieldNames"
        :defaultExpandKeys="defaultExpandKeys"
        @change="change"
      />
      <div class="selected-txt">选中的兼容信息</div>
      <gj-table
        class="compatibility-table"
        row-key="rowKey"
        :row-height="35"
        :scroll="{ y: 385 }"
        :animate-rows="false"
        :columns="computedTableColumns"
        :pagination="false"
        :data-source="dataSource"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'">
            {{ index + 1 }}
          </template>
          <template v-if="column.key === 'operation'">
            <gj-button type="text" size="mini" @click="deleteRow(record, index)"
              >删除</gj-button
            >
          </template>
        </template>
      </gj-table>
    </gj-modal>
  </div>
</template>

<script>
import { computed, watch, nextTick, ref } from "vue";
import CompatibilityCascaderPanel from "./components/CascaderPanel.vue";
import {
  indexColumn,
  handleColumn,
  carColumns,
  motorcycleColumns,
  columnKeysMap,
} from "./config";
import { getNextMotorAttr, getAllMotorAttr } from "@/api/published/aliexpress";

export default {
  name: "AliCompatibility",
  components: {
    CompatibilityCascaderPanel,
  },
  props: {
    carTableData: {
      type: Array,
      default: () => {
        return [];
      },
    },

    // modelType: {
    //   type: Number,
    //   default: () => {
    //     return 1
    //   },
    // },
  },
  setup(props) {
    const modelValue = ref([]);
    const defaultExpandKeys = ref("");
    const loading = ref(false);
    let options = ref([]);
    const fieldNames = {
      value: "id",
      label: "enName",
      isLeaf: "leaf",
    };
    const modelType = ref(1);
    const dataSource = ref([]);
    const compatibilityTableData = ref([]);
    const cloneCompatibilityTableData = ref([]);
    const maxSelectedCount = 3000;
    const visible = ref(false);

    watch(
      () => props.carTableData,
      (newValue) => {
        compatibilityTableData.value = newValue;
        cloneCompatibilityTableData.value = JSON.parse(
          JSON.stringify(newValue)
        );
      },
      {
        deep: true,
        immediate: true,
      }
    );
    // watch(
    //   () => props.modelType,
    //   (newValue) => {
    //     modelType.value = newValue
    //     nextTick(() => {
    //       resetCompatibility()
    //       init()
    //     })
    //   }
    // )

    watch(visible, (isVisible) => {
      if (!isVisible) {
        nextTick(() => {
          modelValue.value = [];
          dataSource.value = [];
        });
      }
    });

    const getAttr = async (option = {}) => {
      try {
        const params = {
          id: option?.id,
          pid: option?.pid,
          type: modelType.value,
          param: option?.param,
        };
        const res = await getNextMotorAttr(params);
        return await Promise.all(
          res?.data?.children?.map(async (item, idx) => {
            const children =
              idx === 0 && !item.leaf
                ? await getAttr({
                    pid: res.data.id,
                    id: res.data.children[0]?.id,
                    param: res.data?.param,
                  })
                : null;
            return {
              ...item,
              children,
            };
          })
        );
      } catch (error) {
        console.log("error", error);
        return null;
      }
    };

    const getExpandKeys = (items, valKeys = "") => {
      if (!items && !items?.length) {
        return `${valKeys}`;
      }
      const vks = valKeys ? `${valKeys}-${items[0].id}` : items[0].id;
      return getExpandKeys(items[0].children, vks);
    };

    const init = async () => {
      loading.value = true;
      const opt = await getAttr();
      loading.value = false;
      options.value = opt;
      const expandKeys = getExpandKeys(opt);
      nextTick(() => {
        defaultExpandKeys.value = expandKeys;
      });
    };

    init();

    const getNextAttr = (params, done) => {
      getNextMotorAttr(params).then((res) => {
        const nodes = res?.data?.children ?? [];
        done(nodes);
      });
    };

    const getAllAttr = (params, done) => {
      getAllMotorAttr(params).then((res) => {
        const nodes = res?.data?.children ?? [];
        done(nodes);
      });
    };

    const loadMore = (option, done, isAll = false) => {
      const params = {
        type: modelType.value,
        id: option.value,
        pid: option.raw.pid,
        param: option.raw.param,
      };
      if (isAll) {
        getAllAttr(params, done);
      } else {
        getNextAttr(params, done);
      }
    };

    const resetCompatibility = () => {
      modelValue.value = [];
      compatibilityTableData.value = [];
      cloneCompatibilityTableData.value = [];
    };

    const modelTypeChange = (val) => {
      modelType.value = val;
      resetCompatibility();
      init();
    };

    const change = (vals) => {
      const newVals = vals.filter(
        (val) => val.length === computedColumns.value.length
      );
      const newDataSource = newVals.map((item, index) => {
        let rowItem = {};
        for (let it of item) {
          const k = computedColumns.value[it.level].dataIndex;
          rowItem[k] = it.label;
          rowItem[`${k}Id`] = it.value;
          rowItem[`${k}Pid`] = it.raw.pid;
          if (it.isLeaf) {
            rowItem.id = it.value;
            rowItem.key = it.key;
            rowItem.rowKey = `${it.raw.pid}-${it.value}`;
            rowItem.index = index;
          }
        }
        return rowItem;
      });
      dataSource.value = newDataSource;
    };

    const panelClass = computed(() => {
      return {
        "motorcycle-cascader-panel": computedColumns.value.length === 5,
      };
    });

    const computedColumns = computed(() => {
      if (modelType.value === 1) {
        return carColumns;
      }
      return motorcycleColumns;
    });

    const computedTableColumns = computed(() => {
      if (modelType.value === 1) {
        return [indexColumn, ...carColumns, handleColumn];
      }
      return [indexColumn, ...motorcycleColumns, handleColumn];
    });

    const computedSelectedTableRows = computed(() => {
      if (cloneCompatibilityTableData.value.length > maxSelectedCount) {
        return cloneCompatibilityTableData.value.slice(0, maxSelectedCount);
      }
      return cloneCompatibilityTableData.value;
    });

    const onInput = (val) => {
      if (!val) {
        compatibilityTableData.value = cloneCompatibilityTableData.value;
        return false;
      }
      const newDataSource = cloneCompatibilityTableData.value.filter((item) => {
        let isInclude;
        for (let columnKey of columnKeysMap) {
          const k = `${columnKey.charAt(0).toLowerCase()}${columnKey.slice(1)}`;
          isInclude = item[k]
            ?.toLocaleLowerCase()
            ?.includes(val?.toLocaleLowerCase());
          if (isInclude) {
            break;
          }
        }
        return isInclude;
      });
      compatibilityTableData.value = [...newDataSource];
    };

    const updateModelValue = (record) => {
      const idx = modelValue.value.findIndex(
        (item) => item.join("-") === record.key
      );
      if (idx != -1) {
        modelValue.value.splice(idx, 1);
      }
    };

    const deleteRow = (record, index) => {
      const newDataSource = [...compatibilityTableData.value];
      newDataSource.splice(index, 1);
      compatibilityTableData.value = newDataSource;
      const idx = cloneCompatibilityTableData.value.findIndex(
        (item) => item.rowKey === record.rowKey
      );
      cloneCompatibilityTableData.value.splice(idx, 1);
      updateModelValue(record);
    };

    const addCompatibility = () => {
      visible.value = true;
    };

    const handleOk = () => {
      const addDataSource = dataSource.value.filter((item) => {
        const isAdd = cloneCompatibilityTableData.value.some(
          (i) => i.key === item.key
        );
        return !isAdd;
      });
      compatibilityTableData.value = [
        ...cloneCompatibilityTableData.value,
        ...addDataSource,
      ];
      cloneCompatibilityTableData.value = [
        ...cloneCompatibilityTableData.value,
        ...addDataSource,
      ];
    };

    const handleCancel = () => {};

    return {
      modelValue,
      modelType,
      loading,
      defaultExpandKeys,
      fieldNames,
      options,
      loadMore,
      change,
      modelTypeChange,
      panelClass,
      computedTableColumns,
      compatibilityTableData,
      dataSource,
      onInput,
      maxSelectedCount,
      computedSelectedTableRows,
      deleteRow,
      visible,
      addCompatibility,
      handleOk,
      handleCancel,
    };
  },
};
</script>
<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 7, 79, 0.1);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #999999;
}

::-webkit-scrollbar-corner {
  background-color: #f6f6f6;
}

.compatibility-wrap {
  padding: 10px 24px 24px 17px;
  .compatibility-tit {
    font-size: 14px;
    line-height: 16px;
    color: #000430;
    margin: 0;
    padding: 16px 0;
  }
}

:deep(.car-cascader-panel) {
  &.arco-cascader-panel {
    display: inline-flex;
    width: 100%;
    height: 400px;
    box-shadow: none;
  }
  .arco-cascader-panel-column-loading {
    .arco-spin {
      display: inline-flex;
      align-items: center;
    }
  }

  .arco-cascader-panel-column {
    flex: 0 0 16.666666666666668%;
    max-height: 400px;
    overflow: hidden;
    border-right: 1px solid var(--color-fill-3);
    .arco-cascader-panel-column-tit {
      font-size: 13px;
      color: #000430;
      font-size: 13px;
      line-height: 20px;
      margin: 0;
      padding: 6px 8px 0;
    }

    .arco-cascader-list {
      height: 320px;
      margin: 0 8px 8px 8px;
      padding-bottom: 4px;
    }

    .arco-input-search {
      width: calc(100% - 16px);
      margin: 6px 8px;
      border-radius: 4px;
    }
  }

  .arco-cascader-option-label {
    flex-grow: 0;
    width: calc(100% - 70px);
    text-overflow: ellipsis;
    overflow: hidden;
    height: 100%;
    white-space: nowrap;
  }

  .gj-panel-column-border-right-0 {
    border-right: 0;
  }

  .gj-panel-column-no-data {
    overflow: hidden;
  }

  .selected-num {
    position: absolute;
    top: 50%;
    right: 10px;
    color: var(--color-text-2);
    font-size: 12px;
    transform: translateY(-50%);
  }
}

.motorcycle-cascader-panel {
  .arco-cascader-panel-column {
    flex: 0 0 20%;
  }
}

.compatibility-table-bar {
  padding-top: 16px;
  .selected-tip {
    color: #000430;
    font-size: 12px;
    line-height: 16px;
    i {
      font-style: normal;
      color: #808197;
    }
  }
  .compatibility-table-search {
    width: 358px;
    margin: 4px 0 16px 0;
  }
}

.compatibility-table {
  border: 1px solid #e6e6ed;
  border-bottom: none;
  border-radius: 4px;
  .surely-table-header {
    height: 35px !important;

    .surely-table-header-cell {
      height: 35px !important;
    }
  }
}

.selected-txt {
  color: #999;
  font-size: 12px;
  margin-top: 25px;
  margin-bottom: 10px;
}

:deep(.ali-add-compatibility-modal) {
  .arco-modal-body {
    padding: 16px;
    height: calc(100vh - 96px);
    overflow-y: auto;
  }
}
</style>
