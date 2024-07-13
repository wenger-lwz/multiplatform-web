<template>
  <CommonPage
    :pageRest="true"
    @common-page-rest="resetSearch"
    :currentRouterPermission="'PLAT/labelManage/view'"
  >
    <!-- 默认视图 -->
    <template #tag-content>
      <TagGroup
        :list="searchActive"
        @tag-change="changeFilterSelect"
      ></TagGroup>
    </template>
    <template #filter-content>
      <!-- <gb-select-input
        placeholder="标签搜索"
        :showSelect="false"
        v-model="inputPopoverValue"
        @search="searchValueChange"
      ></gb-select-input> -->
      <gb-select-input2
        class="searchMore"
        v-model="inputPopoverValue"
        placeholder="请输入"
        :input-more="true"
        @search="searchValueChange"
      ></gb-select-input2>
    </template>
    <!-- 操作 -->
    <template #operate_bar-content>
      <div class="operate-setting">
        <OperateBar :refreshShow="true" @operate-rest="searchTable">
          <template #left>
            <gj-space>
              <gj-button
                type="primary"
                @click="handelLabel('', 2)"
                v-permissions="['PLAT/labelManage/add']"
                >添加</gj-button
              >

              <gj-dropdown @select="importChange">
                <gj-button
                  type="plain"
                  v-permissions="['PLAT/labelManage/import']"
                  >导入 <SvgIcon svgClass="down" :width="12"
                /></gj-button>
                <template #content>
                  <gj-doption
                    v-for="item in fileTypeList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</gj-doption
                  >
                </template>
              </gj-dropdown>

              <gj-button
                @click="exportAbnomal"
                v-permissions="['PLAT/labelManage/exportAbnomal']"
                type="plain"
                >导出异常记录</gj-button
              >
              <gj-popconfirm
                position="bl"
                trigger="click"
                content="是否删除选择的标签？"
                :ok-button-props="okButtonProps"
                @ok="handelDel('', 'batch')"
                v-if="selectedRowKeys.length"
              >
                <gj-button
                  v-permissions="['PLAT/labelManage/batchDelete']"
                  type="plain"
                  >批量删除</gj-button
                >
              </gj-popconfirm>

              <gj-button
                v-else
                v-permissions="['PLAT/labelManage/batchDelete']"
                @click="handelDel('', 'batch')"
                type="plain"
                >批量删除</gj-button
              >

              <div class="total-wrap">
                已选<span class="total">{{ selectedRowKeys.length }}</span>
              </div>
            </gj-space>
          </template>
        </OperateBar>
        <div class="table-type">
          <gj-radio-group
            type="button"
            v-model="fromDataSearch.labelType"
            @change="labelChange"
          >
            <gj-radio
              v-for="item in labelTypeList"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</gj-radio
            >
          </gj-radio-group>
        </div>
      </div>
    </template>
    <template #table-content>
      <CommonTable
        ref="labelTableRef"
        :columns="form.columns"
        :tableData="form.tableData"
        rowKey="id"
        :loading="form.loading"
        :selectedRowKeys="selectedRowKeys"
        :rowSelectionVisiable="true"
        :pagination="form.pagination"
        @onRowSelection="getSelection"
        @getTableCurrent="getTableCurrent"
      >
      </CommonTable>
    </template>
  </CommonPage>

  <!-- 添加编辑标签 -->
  <gj-modal
    v-model:visible="fromDialogVisible"
    :unmount-on-close="true"
    :mask-closable="false"
    width="500px"
    @close="resetForm()"
    :render-to-body="false"
  >
    <template #title>
      <div class="modal-title">
        <span class="title">{{ fromTitle }}</span>
      </div>
    </template>
    <!-- 新增表单 -->
    <addLabelForm
      ref="createFrom"
      :fromType="fromType"
      :row="fromRow"
    ></addLabelForm>
    <template #footer>
      <div class="dalogFromBtn">
        <gj-button type="plain" @click="resetForm()">取消</gj-button>
        <gj-button type="primary" class="ml-8" @click="submitForm()">
          确定</gj-button
        >
      </div>
    </template>
  </gj-modal>

  <!-- 导入 -->
  <importModal ref="import" :importType="importType"></importModal>

  <!-- 导入异常记录 -->
  <exportAbnormalModel ref="exportAbnomalRef"></exportAbnormalModel>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  getCurrentInstance,
  computed,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";
import SvgIcon from "@/components/SvgIcon";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import addLabelForm from "@/pages/systemPages/infrastructure/components/addLabelForm";
import exportAbnormalModel from "@/pages/systemPages/infrastructure/components/exportAbnormalModel";
import importModal from "@/pages/systemPages/infrastructure/components/importModal";
import { GjMessage } from "@gj/atom";
import { labelTypeList, fileTypeList } from "./config/basicData";
import OpbtnGroup from "@/components/opbtn-group.vue";
import TagGroup from "@/components/TagGroup.vue";
import OperateBar from "@/components/OperateBar.vue";
import {
  getList,
  deleteLabel,
  updateLabel,
  saveLabel,
} from "@/api/labelManagement";
import tooltipMark from "./components/tooltipMark.vue";
export default defineComponent({
  name: "LabelManage",
  /* eslint-disable */
  components: {
    SvgIcon,
    CommonPage,
    CommonTable,
    addLabelForm,
    importModal,
    exportAbnormalModel,
    TagGroup,
    OperateBar,
    tooltipMark,
    OpbtnGroup,
  },
  /* eslint-enable */
  setup() {
    const { proxy } = getCurrentInstance();
    const $store = useStore();
    const selectedRow = ref([]);
    const selectedRowKeys = computed(() => {
      return selectedRow.value.map((item) => item.id);
    });

    const data = reactive({
      searchActive: [],
      inputPopoverValue: {},
      fromDataSearch: {
        titleList: [],
        labelType: 1, // 1 订单标签 ; 2 图片标签 3. shopify标签
      }, // 查询参数
      labelTypeList,
      fileTypeList,
      // table列表
      form: {
        rowSelection: [],
        noData: false, //无数据
        loading: false, //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        rowName: "id", //表格行 key 的取值字段
        columns: [
          {
            title: "标签编号",
            dataIndex: "labelCode",
            width: 280,
            customRender: ({ record }) => (
              <tooltipMark remark={record?.labelCode}></tooltipMark>
            ),
          },
          {
            title: "标签名称",
            dataIndex: "title",
            width: 280,
            customRender: ({ record }) => (
              <tooltipMark remark={record?.title}></tooltipMark>
            ),
          },
          {
            title: "描述",
            dataIndex: "describeContent",
            customRender: ({ record }) => (
              <tooltipMark remark={record.describeContent}></tooltipMark>
            ),
          },
          {
            title: "操作",
            dataIndex: "action",
            width: 134,
            customRender: ({ record }) => (
              <OpbtnGroup
                btn-list={getBtnList(record)}
                row={record}
              ></OpbtnGroup>
            ),
          },
        ],
        tableData: [],
        pagination: {
          //分页
          pageCurrent: 1,
          pageSize: 20,
          total: 0,
        },
      },
      createFrom: {}, // form表单内容
      fromTitle: "添加标签",
      fromType: 2, // 2添加 1编辑
      fromRow: {}, // 编辑行数据
      fromDialogVisible: false, // 编辑弹框是否显示
      importType: 1, // 导入标签类型
      btnList: [],
      okButtonProps: {
        status: "danger",
      },
    });

    const getBtnList = () => {
      data.btnList = [
        {
          label: "编辑",
          click: (row) => handelLabel(row, 1),
          outside: true,
          permission: ["PLAT/labelManage/edit"],
        },
        {
          label: "删除",
          click: (row) => handelDel(row.id, "single"),
          outside: true,
          permission: ["PLAT/labelManage/delete"],
          tooltipContent: "是否删除选择的标签？",
          isPopConfirm: true,
          isDel: true,
        },
      ];
      return data.btnList;
    };

    // 导入
    const importChange = (val) => {
      console.log(val);
      proxy.$refs["import"].importVisible = true;
      data.importType = val;
    };

    // 导入异常记录
    const exportAbnomal = () => {
      proxy.$refs["exportAbnomalRef"].exportAbnomalVisible = true;
    };

    // 标签form添加、编辑
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
            await updateLabel(params);
            GjMessage.success("修改成功");
            data.fromDialogVisible = false;
            searchTable();
          } else {
            // 添加
            await saveLabel(params);
            GjMessage.success("添加成功");
            data.fromDialogVisible = false;
            searchTable();
          }
        }
      });
    };

    // 标签form重置
    const resetForm = () => {
      proxy.$refs["createFrom"].resetForm();
      data.fromDialogVisible = false;
    };

    //标签添加、编辑
    const handelLabel = (row, type) => {
      data.fromDialogVisible = true;
      data.fromType = type;
      data.fromRow = row ? row : {};
      data.fromTitle = type === 1 ? "编辑标签" : "添加标签";
    };

    // 删除操作
    const handelDel = (id, type) => {
      if (type === "batch" && !selectedRowKeys.value.length) {
        GjMessage.warning({
          content: "请至少选择一条要操作的数据！",
          closable: true,
        });
        return;
      }

      let params = {};
      params.ids = type === "single" ? id : selectedRowKeys.value.join(",");
      delLabel(params);
    };

    // 删除
    const delLabel = async (params) => {
      await deleteLabel(params);
      GjMessage.success("删除成功");
      resetSearchTable();
    };

    // 全选
    const getSelection = (val) => {
      selectedRow.value = val;
    };

    // 删除tag
    const changeFilterSelect = (id) => {
      data.fromDataSearch[id] = [];
      data.inputPopoverValue = {};
      resetSearchTable();
    };

    // 搜索
    const searchValueChange = (val) => {
      let searchArr = [];
      val.inputValue
        ? (searchArr[0] = val.inputValue)
        : (searchArr = val.moreValue);
      searchArr = searchArr
        .filter((item) => item && item.trim())
        .map((item) => item.trim());
      data.fromDataSearch.titleList = searchArr;
      const showName = "搜索标签";
      let showValue = "";
      showValue = searchArr.length ? tagName(searchArr) : "";
      let flag = true;
      flag = searchArr.length ? true : false;
      setSearchActive(showName, showValue, "titleList", flag);
      resetSearchTable();
    };

    const tagName = (val) => {
      let name = "";
      if (val.length > 3) {
        name = val[0] + "," + val[1] + "等" + val.length + "项";
      } else {
        name = val.join(",");
      }
      return name;
    };

    // 处理active tag
    const setSearchActive = (showName, showValue, id, flag) => {
      const splitSymbol = "：";
      if (data.searchActive.length) {
        // data.searchActive存在此项
        const itemValue = data.searchActive.map((item) => item.id);
        const index = itemValue.indexOf(id);
        flag
          ? (data.searchActive[index].showValue = showValue)
          : data.searchActive.splice(index, 1);
      } else {
        if (!flag) return;
        // data.searchActive不存在此项
        data.searchActive.push({
          splitSymbol,
          id,
          showName,
          showValue,
        });
      }
    };

    // 标签类型 change
    const labelChange = (val) => {
      data.form.pagination.pageCurrent = 1;
      resetSearch(val);
    };

    // 重置搜索条件
    const resetSearch = (val) => {
      data.fromDataSearch = {
        titleList: [],
        labelType: val ? val : 1,
      };
      data.inputPopoverValue = {};
      data.searchActive = [];
      data.form.pagination.pageSize = 20;
      resetSearchTable();
    };

    // 重置到第一页
    const resetSearchTable = () => {
      selectedRow.value = [];
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

    // 重新计算table高度
    watch(
      () => data.searchActive,
      () => {
        proxy.$refs.labelTableRef?.calculateWH();
      },
      { deep: true }
    );

    // 获取列表
    const searchTable = () => {
      const params = {
        ...data.fromDataSearch,
        pageCurrent: data.form.pagination.pageCurrent,
        pageSize: data.form.pagination.pageSize,
      };
      data.form.loading = true;
      getList(params)
        .then((res) => {
          data.form.tableData = res.data.records;
          data.form.pagination.total = res.data.total;
        })
        .finally(() => {
          data.form.loading = false;
        });
    };

    onBeforeMount(() => {
      searchTable();
    });

    return {
      ...toRefs(data),
      searchValueChange,
      labelChange,
      submitForm,
      resetForm,
      resetSearch,
      handelLabel,
      handelDel,
      getTableCurrent,
      importChange,
      exportAbnomal,
      getSelection,
      selectedRowKeys,
      changeFilterSelect,
      searchTable,
      getBtnList,
    };
  },
});
</script>

<style lang="scss" scoped>
.table-type {
  height: 56px;
  padding: 0 16px;
  line-height: 56px;
  border-top: 1px solid #e6e6ed;
}
.searchMore {
  :deep(.gb-select-input2-select) {
    display: none;
  }
}

.ml-8 {
  margin-left: 8px;
}
.ml-4 {
  margin-left: 4px;
}
.mr-4 {
  margin-right: 4px !important;
}
.total-wrap {
  font-size: 12px;
  color: #86909c;
  .total {
    color: #1f6eef;
    margin-left: 2px;
  }
}
</style>
