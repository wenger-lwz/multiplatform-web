<template>
  <!-- v-permissions="['PLAT/allocationRules/add']"
       v-permissions="['PLAT/allocationRules/delete']" -->
  <CommonPage>
    <template #filter-content>
      <gj-radio-group
        type="button"
        v-model="fromDataSearch.platformId"
        @change="labelChange"
      >
        <gj-radio
          v-for="item in labelTypeList"
          :key="item.value"
          :value="item.codeId"
          >{{ item.label }}</gj-radio
        >
      </gj-radio-group>
    </template>
    <!-- 操作 -->
    <template #operate_bar-content>
      <OperateBar :refreshShow="true" @operate-rest="searchTable">
        <template #left>
          <gj-space>
            <gj-button @click="handelLabel('', 2)" type="primary"
              >添加规则</gj-button
            >
            <gj-button type="plain" @click="batchDelete">批量删除</gj-button>
            <div v-show="selectedRowKeys.length">
              已选<span class="selectedRowKeysStyle">{{
                selectedRowKeys.length
              }}</span>
            </div>
          </gj-space>
        </template>
      </OperateBar>
    </template>
    <template #table-content>
      <CommonTable
        ref="labelTableRef"
        :columns="form.columns"
        :tableData="form.tableData"
        rowKey="id"
        :loading="form.loading"
        :rowSelectionVisiable="true"
        :pagination="form.pagination"
        @onRowSelection="getSelection"
        @getTableCurrent="getTableCurrent"
      >
        <template #bodyCell="{ record, column, text }">
          <template v-if="column.dataIndex === 'isActive'">
            <gj-switch
              v-model="record.isActive"
              size="small"
              @click="setAllocationRule(record)"
            />
          </template>
          <template v-else-if="column.dataIndex === 'Action'">
            <opbtn-group :btn-list="btnList" :row="record"></opbtn-group>
          </template>
          <template v-else>
            <gb-text>{{ text || "-" }}</gb-text>
          </template>
        </template>
      </CommonTable>
    </template>
  </CommonPage>

  <!-- 添加编辑标签 -->
  <gb-modal
    v-model:visible="fromDialogVisible"
    :unmount-on-close="true"
    :mask-closable="false"
    width="500px"
    class="gb-modal-createFrom"
    @close="resetForm()"
    :render-to-body="false"
  >
    <template #title>
      <div class="modal-title">
        <span class="title">{{ fromTitle }}</span>
      </div>
    </template>
    <!-- 新增表单 -->
    <addRulesForm
      ref="createFrom"
      :fromType="fromType"
      :row="fromRow"
      :rulesData="fromDataSearch.allocationRule"
    ></addRulesForm>
    <template #footer>
      <div class="dalogFromBtn">
        <gj-button type="plain" @click="resetForm()">取消</gj-button>
        <gj-button type="primary" class="ml-8" @click="submitForm()">
          确定</gj-button
        >
      </div>
    </template>
  </gb-modal>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  computed,
  ref,
  getCurrentInstance,
} from "vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import {
  labelTypeList,
  tableColumns,
} from "@pagesSystem/customerService/infrastructure/config/allocationRulesPage";
import addRulesForm from "@pagesSystem/customerService/infrastructure/components/addRulesForm.vue";
import OperateBar from "@/components/OperateBar.vue";
import {
  getAllocationRuleList,
  addAllocationRule,
  editAllocationRule,
  delAllocationRule,
  disableOrEnableAllocationRule,
} from "@/api/customerService/infrastructure.js";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { useStore } from "vuex";
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
  setup(props) {
    const { proxy } = getCurrentInstance();
    const $store = useStore();
    const selectedRow = ref([]);
    const selectedRowKeys = computed(() => {
      return selectedRow.value.length > 0
        ? selectedRow.value?.map((item) => item.id)
        : [];
    });

    const data = reactive({
      searchActive: [],
      inputPopoverValue: {},
      fromDataSearch: {
        allocationRule: String(props.rowData),
        platformId: labelTypeList[0].codeId,
      }, // 查询参数
      labelTypeList: labelTypeList,
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
      fromTitle: "添加规则",
      fromType: 2, // 2添加 1编辑
      fromRow: {}, // 编辑行数据
      fromDialogVisible: false, // 编辑弹框是否显示
      importTitle: "导入标签",
      importType: 1, // 导入标签类型
    });

    //规则添加、编辑
    const handelLabel = (row, type) => {
      data.fromDialogVisible = true;
      data.fromType = type;
      data.fromRow = row ? row : {};
      data.fromTitle = type === 1 ? "编辑规则" : "添加规则";
    };
    //  操作列数据
    const btnList = computed(() => {
      return [
        {
          label: "编辑",
          click: (row) => handelLabel(row, 1),
          outside: true,
        },
        {
          label: "删除",
          click: (row) => handelDel(row.id, "single"),
          tooltipContent: "删除后将清除该信息，是否继续?",
          isPopConfirm: true,
          outside: true,
        },
      ];
    });

    //  保存
    const submitForm = () => {
      proxy.$refs["createFrom"].submitForm().then(async (res) => {
        data.createFrom = $store.getters.getParams
          ? $store.getters.getParams.createFrom
          : {};
        if (res === "200") {
          let params = {
            ...data.createFrom,
          };
          if (data.fromType === 1) {
            params.id = data.fromRow.id;
            // 编辑
            await editAllocationRule(params);
            GjMessage.success("修改成功");
            data.fromDialogVisible = false;
            searchTable();
          } else {
            // 添加
            await addAllocationRule(params);
            GjMessage.success("添加成功");
            data.fromDialogVisible = false;
            searchTable();
          }
        }
      });
    };

    // 重置
    const resetForm = () => {
      proxy.$refs["createFrom"].resetForm();
      data.fromDialogVisible = false;
    };

    // 批量删除
    const batchDelete = () => {
      if (selectedRowKeys.value.length <= 0) {
        GjMessage.warning({
          content: "请至少选择一条要操作的数据！",
          closable: true,
        });
      } else {
        handelDel("", "batch");
      }
    };
    // 删除操作
    const handelDel = (id, type) => {
      let ids = [];
      if (type === "single") {
        // 单个删除
        ids = [id];
      } else {
        // 批量删除
        ids = selectedRowKeys.value;
      }
      delLabel(ids);
    };
    // // // 删除
    const delLabel = async (params) => {
      await delAllocationRule(params);
      GjMessage.success("删除成功");
      getSelection([]);
      resetSearchTable();
    };

    // 全选
    const getSelection = (val) => {
      console.log("KJKJSSSSSSSSSS", val);
      selectedRow.value = val;
    };

    // 标签类型 change
    const labelChange = (val) => {
      selectedRow.value = [];
      data.form.pagination.pageCurrent = 1;
      resetSearch(val);
    };

    // 重置搜索条件
    const resetSearch = (val) => {
      data.fromDataSearch = {
        allocationRule: String(props.rowData),
        platformId: val ? val : labelTypeList[0].codeId,
      };
      data.inputPopoverValue = {};
      data.searchActive = [];
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

    // watch(
    //   () => data.searchActive,
    //   () => {
    //     proxy.$refs.labelTableRef?.calculateWH()
    //   },
    //   { deep: true }
    // )

    // 获取列表
    const searchTable = () => {
      const params = {
        ...data.fromDataSearch,
        pageCurrent: data.form.pagination.pageCurrent,
        pageSize: data.form.pagination.pageSize,
      };
      data.form.loading = true;
      getAllocationRuleList(params)
        .then((res) => {
          data.form.tableData = res.data.records;
          data.form.pagination.total = res.data.total;
        })
        .finally(() => {
          data.form.loading = false;
        });
    };
    const setAllocationRule = async (val) => {
      const params = {
        url: val.isActive ? "enable" : "disable",
        id: val.id,
      };
      await disableOrEnableAllocationRule(params);
      GjMessage.success(`${val.isActive ? "启用" : "禁用"}成功!`);
      resetSearchTable();
    };

    onBeforeMount(() => {
      searchTable();
    });

    return {
      ...toRefs(data),
      labelChange,
      handelLabel,
      resetForm,
      resetSearch,
      getTableCurrent,
      getSelection,
      batchDelete,
      selectedRowKeys,
      btnList,
      submitForm,
      setAllocationRule,
      searchTable,
    };
  },
});
</script>

<style lang="scss" scoped></style>
