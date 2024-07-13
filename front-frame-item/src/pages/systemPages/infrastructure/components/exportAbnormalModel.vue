<template>
  <gj-modal
    v-model:visible="exportAbnomalVisible"
    :unmount-on-close="true"
    :mask-closable="false"
    width="910px"
    @close="cancel()"
    :render-to-body="false"
  >
    <template #title>
      <div class="modal-title">
        <span class="title">导出异常记录</span>
      </div>
    </template>

    <div class="dialog-content">
      <gj-form
        :model="fromDataSearch"
        :label-align="'right'"
        :auto-label-width="true"
      >
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item label="搜索文件">
              <gj-input-search
                placeholder="请输入"
                allow-clear
                v-model="fromDataSearch.fileName"
                @press-enter="searchChange"
                @search="searchChange"
                @clear="searchChange"
              ></gj-input-search>
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item label="文件类型">
              <gj-select
                v-model="fromDataSearch.operType"
                placeholder="请选择"
                allow-clear
                @change="searchChange"
              >
                <gj-option
                  v-for="item in fileTypeList"
                  :value="item.value"
                  :key="item.value"
                >
                  {{ item.label }}
                </gj-option>
              </gj-select>
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item label="导入时间">
              <gj-range-picker
                format="YYYY-MM-DD"
                v-model="orderingTime"
                @change="timeChange"
              />
            </gj-form-item>
          </gj-col>
        </gj-row>
      </gj-form>
      <div class="action-wrap">
        <gj-space>
          <gj-button type="text" @click="handelDown('', 'batch')"
            >批量导出</gj-button
          >
          <span class="tip">仅保存近7天内的导入数据</span>
        </gj-space>
      </div>
      <div class="table-warp">
        <ModalTableHeight
          @getTableHeight="getTableHeight"
          ref="modalTableHeightRef"
          :class="tableData.length ? '' : 'cancel-checkbox'"
        >
          <template #table>
            <gj-table
              rowKey="id"
              :data-source="tableData"
              :pagination="false"
              :row-selection="{
                selectedRowKeys: rowSelection,
                onChange: onSelectChange,
              }"
              :scroll="{ y: tableHeight }"
              :columns="columns"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'index'">
                  <span>{{
                    index +
                    1 +
                    (pagination.pageCurrent - 1) * pagination.pageSize
                  }}</span>
                </template>
                <template v-if="column.key === 'operType'">
                  <span>
                    {{ record.operType === 1 ? "导入标签" : "导入更新标签" }}
                  </span>
                </template>
                <template v-if="column.key === 'action'">
                  <gj-button
                    @click="handelDown(record.id, 'single')"
                    type="text"
                    >导出</gj-button
                  >
                </template>
              </template>
            </gj-table>
          </template>
        </ModalTableHeight>
      </div>
    </div>
    <template #footer>
      <div class="dalogFromBtn">
        <AppPagination
          :pagination="pagination"
          @onCurrentChange="currentChange"
          @onPageSizeChange="pageSizeChange"
        />
      </div>
    </template>
  </gj-modal>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
} from "vue";
import dayjs from "dayjs";
import { GjMessage } from "@gj/atom";
import { abnormalList, bathDownError, downError } from "@/api/labelManagement";
import { fileTypeList } from "../config/basicData";
import { downFile, downUrlFile } from "@/utils/format";
import AppPagination from "@/components/AppPagination.vue";
import ModalTableHeight from "@/components/ModalTableHeight";
export default defineComponent({
  components: {
    AppPagination,
    ModalTableHeight,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      // 搜索条件
      fromDataSearch: {
        fileName: "",
        operType: null,
        module: "label",
        startDate: "",
        endDate: "",
      },
      fileTypeList,
      orderingTime: [
        dayjs().subtract(6, "day").format("YYYY-MM-DD"),
        dayjs().format("YYYY-MM-DD"),
      ],
      columns: [
        {
          title: "序号",
          key: "index",
          width: 60,
        },
        {
          title: "文件名称",
          dataIndex: "fileName",
          width: 360,
        },
        {
          title: "文件类型",
          dataIndex: "operType",
          key: "operType",
          width: 120,
        },
        {
          title: "导入时间",
          dataIndex: "createdTime",
          width: 180,
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 74,
          key: "action",
        },
      ],
      // table
      rowSelection: [],
      pagination: {
        //分页
        pageCurrent: 1,
        pageSize: 20,
        total: 0,
      },
      tableData: [],
      exportAbnomalVisible: false,
      tableSelectList: [], // 选择的数据
      tableHeight: "20vh",
    });

    // 导出操作
    const handelDown = async (id, type) => {
      let params = {};
      if (type === "single") {
        // 单个导出
        params.id = id;
        downLoadExcel(params);
      } else {
        // 批量导出
        if (!data.tableSelectList.length) {
          GjMessage.warning({
            content: "请至少选择一条要操作的数据！",
            closable: true,
          });
          return;
        } else {
          const datas = JSON.parse(JSON.stringify(data.tableSelectList));
          if (datas.length > 1) {
            params.ids = datas.join(",");
            downLoadZip(params);
          } else {
            params.id = data.tableSelectList[0];
            downLoadExcel(params);
          }
        }
      }
    };

    // 导出excel
    const downLoadExcel = async (params) => {
      const res = await downError(params);
      downUrlFile(res.data);
    };

    // 导出zip (两个及以上的导出为导出zip文件)
    const downLoadZip = async (params) => {
      const res = await bathDownError(params);
      downFile(res, "导出异常记录", "zip");
    };

    // 全选
    const onSelectChange = (selectedRowKeys) => {
      data.rowSelection = selectedRowKeys;
      data.tableSelectList = selectedRowKeys;
    };

    // 时间change
    const timeChange = (val) => {
      const start = Date.parse(dayjs().subtract(6, "day").format("YYYY-MM-DD"));
      const last = Date.parse(dayjs().format("YYYY-MM-DD"));
      if (val && val.length > 0) {
        if (Date.parse(val[0]) < start || Date.parse(val[1]) > last) {
          GjMessage.warning("请选择近7天内的时间");
          return;
        }
      }
      searchChange();
    };
    // 搜索
    const searchChange = () => {
      data.pagination.pageCurrent = 1;
      searchTable();
      setTableHeight();
    };

    // 分页
    const pageSizeChange = (val) => {
      data.pagination.pageSize = val;
      searchTable();
    };

    const currentChange = (val) => {
      data.pagination.pageCurrent = val;
      searchTable();
    };

    // 获取列表
    const searchTable = async () => {
      data.fromDataSearch.startDate =
        data.orderingTime && data.orderingTime.length
          ? data.orderingTime[0]
          : "";
      data.fromDataSearch.endDate =
        data.orderingTime && data.orderingTime.length
          ? data.orderingTime[1]
          : "";
      const params = {
        ...data.fromDataSearch,
        pageCurrent: data.pagination.pageCurrent,
        pageSize: data.pagination.pageSize,
      };
      const res = await abnormalList(params);
      data.tableData = res.data.records || [];
      data.pagination.total = res.data.total || 0;
    };

    // 取消恢复默认选项
    const cancel = () => {
      data.pagination = {
        pageCurrent: 1,
        pageSize: 20,
      };
      data.fromDataSearch = {
        fileName: "",
        type: null,
        module: "label",
        startDate: "",
        endDate: "",
      };
      data.orderingTime = [
        dayjs().subtract(6, "day").format("YYYY-MM-DD"),
        dayjs().format("YYYY-MM-DD"),
      ];
    };

    watch(
      () => data.exportAbnomalVisible,
      () => {
        if (data.exportAbnomalVisible) {
          searchTable();
          setTableHeight();
        }
      }
    );

    const setTableHeight = () => {
      setTimeout(() => {
        proxy.$refs.modalTableHeightRef?.setTableHeight();
      }, 0);
    };

    const getTableHeight = (val) => {
      if (val) {
        data.tableHeight = val;
      }
    };

    return {
      ...toRefs(data),
      cancel,
      timeChange,
      searchChange,
      currentChange,
      pageSizeChange,
      handelDown,
      onSelectChange,
      getTableHeight,
      downFile,
      downUrlFile,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-content {
  height: calc(100vh - 191px);
  width: 100%;
  box-sizing: border-box;
}

.action-wrap {
  margin-bottom: 16px;
  .tip {
    font-size: 12px;
    color: #808197;
  }
}
.table-warp {
  height: calc(100vh - 275px);
}

.dalogFromBtn {
  position: relative;
  min-height: 30px;
  padding: 0 16px;
  .arco-pagination {
    position: absolute;
    right: 0;
  }
}
:deep(.surely-table) {
  border: 1px solid #e6e6ed;
  box-sizing: border-box;
  border-radius: 4px;
  padding-bottom: 10px;
}
.cancel-checkbox {
  :deep(.surely-table-selection .surely-table-checkbox-inner) {
    background-color: #f5f5f5 !important;
    &::after {
      display: none;
    }
  }
}
</style>
