<!--组件模板-->
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
      ></FilterCondition>
    </template>
    <template #operate_bar-content>
      <OperateBtnGroup>
        <template #left>
          <gj-button type="primary" @click="createTemplate">添加模板</gj-button>

          <gj-button type="primary" @click="handelBatchSyncBtn"
            >同步模板</gj-button
          >
        </template>
      </OperateBtnGroup>
    </template>
    <template #table-content>
      <CommonTable
        ref="commonTableRef"
        :rowKey="'templateId'"
        :columns="tableColumns"
        :tableData="tableData"
        :loading="loading"
        :pagination="pagination"
        :rowSelectionVisiable="false"
        @getTableCurrent="getTableCurrent"
        @change="sortChange"
      >
        <template #bodyCell="{ record, column }">
          <div v-if="column.dataIndex === 'updateTime'">
            <span>{{
              formatDateTime(record.updateTime, "YYYY-MM-DD HH:mm:ss", "-")
            }}</span>
          </div>

          <div v-if="column.dataIndex === 'userName'">
            <span v-if="record.userName">{{ record.userName }}</span>
            <span v-else>-</span>
          </div>

          <div v-if="column.dataIndex === 'action'">
            <OpbtnGroup :btn-list="getBtnList()" :row="record"></OpbtnGroup>
            <!-- <gj-button
              type="text"
              @click="editTemplate(record.templateId)"
              :disabled="setButtonDisable(record)"
              >编辑</gj-button
            >
            <gj-popconfirm
              okText="确定"
              cancelText="取消"
              class="remark-pops"
              content="此操作不可逆，是否删除？"
              position="left"
              @ok="handelDeleteBtnByOne(record.templateId)"
            >
              <gj-button type="text">删除</gj-button>
            </gj-popconfirm> -->
          </div>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <EditDialog
    v-if="editDialogVisible"
    ref="editDialog"
    :dialogVisible="editDialogVisible"
    :editId="editId"
    :itemId="itemId"
    :isCreate="isCreate"
    @cancel="cancelEditDialog"
    @confirm="confirmEditDialog"
    :editData="editData"
  ></EditDialog>
  <syncModal
    :dialogVisible="syncModalVisible"
    @handleOk="handleOk"
    @handleCancel="handleCancel"
  ></syncModal>
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
import EditDialog from "./components/editDialog.vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import {
  getTemplateList,
  delTemplate,
  getTemplateDetail,
} from "@/api/published/aliexpress";
import OperateBtnGroup from "@/components/OperateBtnGroup.vue";
import FilterCondition from "./components/FilterCondition";
import TagGroup from "@/components/TagGroup.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";

import { useChangeList } from "../../aLipublish/pubAliOnLineGoods/components/data";

import syncModal from "./components/syncModal.vue";
import { syncPlatform } from "@/api/published/aliexpress";
import { formatDateTime } from "@/utils/format.js";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  name: "",
  components: {
    OpbtnGroup,
    CommonPage,
    CommonTable,
    OperateBtnGroup,
    FilterCondition,
    TagGroup,
    EditDialog,
    syncModal,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    console.log(proxy);
    const normalFilterRef = ref();
    const tableColumns = computed(() => {
      return [
        {
          key: "templateName",
          title: "模板名称",
          dataIndex: "templateName",
          width: 400,
        },

        {
          key: "shopName",
          title: "店铺",
          dataIndex: "shopName",
          width: 160,
        },

        {
          key: "userName",
          title: "更新人",
          dataIndex: "userName",
          width: 160,
        },
        // {
        //   key: 'createTime',
        //   title: '创建时间',
        //   dataIndex: 'createTime',
        //   width: 160,
        //   showSorterTooltip: false,
        //   sorter: true,
        // },
        {
          key: "updateTime",
          title: "更新时间",
          dataIndex: "updateTime",
          width: 230,
          showSorterTooltip: false,
          sorter: true,
        },
        {
          key: "action",
          title: "操作",
          dataIndex: "action",
          width: 140,
          fixed: "right",
        },
      ];
    });
    const data = reactive({
      formatDateTime: formatDateTime,
      // getLabel: getLabel,
      // updateStateList: updateStateList,
      searchActive: [],
      pagination: {
        total: 0,
        pageSize: 20,
        pageCurrent: 1,
      },
      sort: "updateTime",
      order: "desc",
      platformStatus: 1,
      loading: false, //是否为加载中状态
      tableData: [],
      offModel: false,
      deleteModel: false,
      selectionData: [],
      paramsObj: {},
      editDialogVisible: false,
      editId: "",
      editData: {},
      updateState: "",
      itemId: "",
      syncModalVisible: false,
      isCreate: false,
    });
    const commonTableRef = ref(null);

    const getBtnList = () => {
      return [
        {
          label: "编辑",
          click: (row) => editTemplate(row.templateId),
          outside: true,
          permission: ["ALI/pubAliComponentBoard/edit"],
          disabled: (row) => setButtonDisable(row),
        },

        {
          label: "删除",
          click: (row) => handelDeleteBtnByOne(row.templateId),
          tooltipContent: "此操作不可逆，是否删除？",
          permission: ["ALI/pubAliComponentBoard/delete"],
          outside: true,
          isPopConfirm: true,
          isDel: true,
          disabled: (row) => setButtonDisable(row),
        },
      ];
    };

    const sortedInfo = ref();

    const sortChange = (val) => {
      /**
       * @param {val} 公共表格傳入的值
       */
      // 这里只监听排序的，有需要的类型自己补充
      if (val.action === "sort") {
        const { order, field, column } = val.sorter;
        data.sort = column ? field : "updateTime";
        data.order = order === "ascend" ? "asc" : "desc";
        sortedInfo.value = val.sorter;
        getTableList();
        commonTableRef.value.updateSortOrder(sortedInfo.value);
      }
    };

    const getParams = () => {
      const params = {
        shopIds: data.paramsObj?.shopIds?.map((item) => item + "") || [],
        keyWords: data.paramsObj.keyWords || "",
        componentType: data.paramsObj.componentType,
        // componentType:
        //   data.paramsObj?.componentType?.map((item) => item + '') || [],
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
      getTemplateList(tableParams)
        .then((res) => {
          console.log(data.tableData);
          data.tableData = res.data.records;
          data.pagination.total = res.data.total;

          commonTableRef.value.calculateWH();
        })
        .finally(() => {
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
      data.sort = "updateTime"; //默认
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

    //同步模板
    const handelBatchSyncBtn = () => {
      data.syncModalVisible = true;
    };

    //单条删除
    const handelDeleteBtnByOne = (id) => {
      delTemplate(id).then(() => {
        GjMessage.success("已删除1个组件模板！");
        getTableList();
      });
    };

    const createTemplate = () => {
      data.isCreate = true;
      data.editDialogVisible = true;
    };

    //编辑
    const editTemplate = (id) => {
      data.editDialogVisible = true;
      data.isCreate = false;

      data.editId = id;
      // data.updateState = updateState
      // data.itemId = itemId
      getTemplateDetail(id).then((res) => {
        data.editData = res.data;
      });
    };

    const setButtonDisable = (record) => {
      if (!record.componentType || !record.source) {
        return true;
      } else if (
        record.source == 2 &&
        (record.componentType == 2 ||
          record.componentType == 3 ||
          record.componentType == 4)
      ) {
        return false;
      } else {
        return true;
      }
      // return false
    };

    //编辑/创建弹窗取消
    const cancelEditDialog = () => {
      data.editDialogVisible = false;
    };
    //编辑/创建弹窗确定
    const confirmEditDialog = () => {
      data.editDialogVisible = false;
      getTableList();
    };

    //同步弹窗取消
    const handleCancel = () => {
      data.syncModalVisible = false;
    };
    //同步弹窗确定
    const handleOk = (obj) => {
      data.syncModalVisible = false;
      syncPlatform({
        componentTypes: obj.componentTypes,
        shopId: obj.shopId,
        categoryId: "",
      }).then(() => {
        GjMessage.success("同步成功");
        getTableList();
      });
    };

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
      confirmEditDialog,
      cancelEditDialog,
      resetSearch,
      handelBatchSyncBtn,
      tableColumns,
      handelDeleteBtnByOne,
      editTemplate,
      getTableCurrent,
      normalFilterRef,
      changeList,
      changeFilterSelect,
      filterChange,
      sortChange,
      getBtnList,
      createTemplate,
      handleCancel,
      handleOk,
      setButtonDisable,
    };
  },
});
</script>

<style scoped lang="scss"></style>
