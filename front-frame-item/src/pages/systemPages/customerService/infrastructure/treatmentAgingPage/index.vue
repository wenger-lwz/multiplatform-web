<template>
  <CommonPage :isLayoutHeader="false">
    <template #table-content>
      <CommonTable
        ref="labelTableRef"
        :columns="form.columns"
        :tableData="form.tableData"
        rowKey="code"
        :loading="form.loading"
        :showPagination="false"
        :selectedRowKeys="selectedRowKeys"
        :rowSelectionVisiable="false"
        :pagination="form.pagination"
        @onRowSelection="getSelection"
        @getTableCurrent="getTableCurrent"
      >
        <template #bodyCell="{ record, column, text }">
          <template v-if="column.dataIndex === 'isActive'">
            <gj-switch
              v-model="record.isActive"
              @click="setIsActive(record)"
              size="small"
            />
          </template>
          <template v-else-if="column.dataIndex === 'replyPeriod'">
            <gb-popover-edit
              :model="object"
              control
              @ok="setReplyPeriod(record, $event)"
              title="处理时效"
            >
              <gb-text>{{
                record.replyPeriod ? `${record.replyPeriod}小时` : "-"
              }}</gb-text>
              <template #edit>
                <gj-radio-group
                  @change="handleRadio(record, $event)"
                  type="radio"
                  :default-value="record.replyPeriod"
                >
                  <gj-radio
                    v-for="item in radioList"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.name }}</gj-radio
                  >
                </gj-radio-group>
              </template>
            </gb-popover-edit>
          </template>
          <template v-else>
            <gb-text>{{ text || "-" }}</gb-text>
          </template>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
</template>

<script>
import { defineComponent, reactive, toRefs, onBeforeMount } from "vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import { tableColumns } from "@pagesSystem/customerService/infrastructure/config/treatmentAgingPage";
import addRulesForm from "@pagesSystem/customerService/infrastructure/components/addRulesForm.vue";
import OperateBar from "@/components/OperateBar.vue";
import {
  getHandlePeriodList,
  disableOrEnableHandlePeriodList,
  editHandlePeriodList,
} from "@/api/customerService/infrastructure.js";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { GjMessage } from "@gj/atom";

export default defineComponent({
  name: "storeAllocation",
  /* eslint-disable */
  components: {
    CommonPage,
    CommonTable,
    OperateBar,
    addRulesForm,
    OpbtnGroup,
  },
  props: {
    rowData: {
      type: Number,
      default: () => {
        return 1;
      },
    },
  },
  /* eslint-enable */
  setup() {
    const data = reactive({
      // table列表
      form: {
        rowSelection: [],
        noData: false, //无数据
        loading: false, //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        rowName: "id", //表格行 key 的取值字段
        columns: tableColumns,
        tableData: [],
        pagination: {
          //分页
          pageCurrent: 1,
          pageSize: 20,
          total: 0,
        },
      },
      delPopupVisible: false, // pop批量删除弹框是否可见
      createFrom: {}, // form表单内容
      radioValue: "",
      radioList: [
        { name: "12小时", value: 12 },
        { name: "24小时", value: 24 },
        { name: "48小时", value: 48 },
      ],
    });

    // 重置搜索条件
    const resetSearch = () => {
      data.form.pagination.pageSize = 20;
      resetSearchTable();
    };

    // 重置到第一页
    const resetSearchTable = () => {
      data.form.pagination.pageCurrent = 1;
      searchTable();
    };

    // 翻页
    const getTableCurrent = (e) => {
      data.form.pagination.pageCurrent =
        e.pageCurrent || data.form.pagination.pageCurrent;
      data.form.pagination.pageSize =
        e.pageSize || data.form.pagination.pageSize;
      searchTable();
    };

    // 获取列表
    const searchTable = () => {
      const params = {
        pageCurrent: data.form.pagination.pageCurrent,
        pageSize: data.form.pagination.pageSize,
      };
      data.form.loading = true;
      getHandlePeriodList(params)
        .then((res) => {
          data.form.tableData = res.data;
          data.form.pagination.total = res.data.total;
        })
        .finally(() => {
          data.form.loading = false;
        });
    };

    //状态
    const setIsActive = async (val) => {
      const params = {
        url: val.isActive ? "enable" : "disable",
        platformId: val.platformId,
      };
      await disableOrEnableHandlePeriodList(params);
      GjMessage.success(`${val.isActive ? "启用" : "禁用"}成功!`);
      resetSearchTable();
    };
    // 处理时效
    const setReplyPeriod = async (val, e) => {
      const params = {
        platformId: val.platformId,
        hours: val.replyPeriod,
      };
      await editHandlePeriodList(params);
      GjMessage.success(`修改成功!`);
      resetSearchTable();
      e?.done();
    };
    //
    const handleRadio = (val, e) => {
      val.replyPeriod = e;
    };
    onBeforeMount(() => {
      searchTable();
    });

    return {
      ...toRefs(data),
      resetSearch,
      getTableCurrent,
      getSelection,
      setReplyPeriod,
      setIsActive,
      handleRadio,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.layout-header) {
  display: none;
}
</style>
