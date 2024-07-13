<template>
  <!-- v-permissions="['PLAT/allocationRules/add']"
       v-permissions="['PLAT/allocationRules/delete']" -->
  <CommonPage :pageRest="true" @common-page-rest="resetSearch">
    <!-- 默认视图 -->
    <template #tag-content>
      <TagGroup
        :list="searchActive"
        @tag-change="changeFilterSelect"
      ></TagGroup>
    </template>
    <template #filter-content>
      <gj-select
        class="search-select"
        placeholder="状态"
        allow-clear
        v-model="fromDataSearch.status"
        @change="
          searchValueChange(
            fromDataSearch.status,
            'status',
            '状态',
            'select',
            stateList,
            'label',
            'value'
          )
        "
      >
        <gj-option
          v-for="item in stateList"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</gj-option
        >
      </gj-select>

      <gj-input-search
        class="search-input"
        placeholder="请输入内容"
        maxlength="20"
        v-model="fromDataSearch.searchText"
        allow-clear
        @press-enter="shopSearchChange"
        @search="shopSearchChange"
        @clear="shopSearchChange"
      />
    </template>
    <!-- 操作 -->
    <template #operate_bar-content>
      <OperateBar :refreshShow="true" @operate-rest="searchTable">
        <template #left>
          <gj-space>
            <gj-button @click="handelLabel('', 2)" type="primary"
              >添加常用语</gj-button
            >
            <!-- <gj-button type="plain">导入</gj-button> -->
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
        :selectedRowKeys="selectedRowKeys"
        :rowSelectionVisiable="true"
        :pagination="form.pagination"
        @onRowSelection="getSelection"
        @getTableCurrent="getTableCurrent"
      >
        <template #bodyCell="{ record, column, text }">
          <template v-if="column.dataIndex === 'isActive'">
            <gj-switch
              v-model="record.isActive"
              @click="setAllocationRule(record)"
              size="small"
            />
          </template>
          <template v-else-if="column.dataIndex === 'keyword'">
            <gb-text>{{ setKeyWord(record.keyWords) || "-" }}</gb-text>
          </template>
          <template v-else-if="column.dataIndex === 'platformList'">
            <gb-text>{{ setPlatforms(record.platforms) || "-" }}</gb-text>
          </template>
          <template v-else-if="column.dataIndex === 'code'">
            <gb-text>{{ record.code || "-" }}</gb-text>
          </template>
          <template v-else-if="column.dataIndex === 'labelName'">
            <gb-text> {{ record.labelName || "-" }}</gb-text>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
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
    width="600px"
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
    <addCommonWords
      ref="createFrom"
      :fromType="fromType"
      :row="fromRow"
    ></addCommonWords>
    <template #footer>
      <gj-space size="medium">
        <gj-button type="plain" @click="resetForm()">取消</gj-button>
        <gj-button type="primary" class="ml-8" @click="submitForm()">
          确定</gj-button
        >
      </gj-space>
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
import { columnsList } from "@pagesSystem/customerService/infrastructure/config/commonWordsPage.js";
import addCommonWords from "@pagesSystem/customerService/infrastructure/components/addCommonWords.vue";
import OperateBar from "@/components/OperateBar.vue";
import {
  getTemplateReplyList,
  addTemplateReply,
  editTemplateReply,
  delTemplateReply,
  disableOrEnableTemplateReply,
} from "@/api/customerService/infrastructure.js";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
import TagGroup from "@/components/TagGroup.vue";

export default defineComponent({
  name: "classificationLabel",
  /* eslint-disable */
  components: {
    CommonPage,
    CommonTable,
    OperateBar,
    addCommonWords,
    OpbtnGroup,
    TagGroup,
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
      stateList: [
        // 状态
        { value: "1", label: "启用" },
        { value: "0", label: "禁用" },
      ],
      inputPopoverValue: {},
      fromDataSearch: {
        status: "",
        searchText: "",
      }, // 查询参数
      // table列表
      form: {
        rowSelection: [],
        noData: false, //无数据
        loading: false, //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        columns: columnsList,
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
      fromTitle: "添加常用语",
      fromType: 2, // 2添加 1编辑
      fromRow: {}, // 编辑行数据
      fromDialogVisible: false, // 编辑弹框是否显示
      importTitle: "导入",
      importType: 1, // 导入标签类型
    });

    //分类标签添加、编辑
    const handelLabel = (row, type) => {
      data.fromDialogVisible = true;
      data.fromType = type;
      data.fromRow = row ? row : {};
      data.fromTitle = type === 1 ? "编辑常用语" : "添加常用语";
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
            await editTemplateReply(params);
            GjMessage.success("修改成功");
            data.fromDialogVisible = false;
            searchTable();
          } else {
            // 添加
            console.log("JJJJJJJJJJJJJJJJJJJJJ", params);
            await addTemplateReply(params);
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
      await delTemplateReply(params);
      GjMessage.success("删除成功");
      resetSearchTable();
    };

    // 全选
    const getSelection = (val) => {
      selectedRow.value = val;
    };

    // 重置搜索条件
    const resetSearch = () => {
      data.fromDataSearch = {
        status: "",
        searchText: "",
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

    // 获取列表
    const searchTable = () => {
      const params = {
        ...data.fromDataSearch,
        pageCurrent: data.form.pagination.pageCurrent,
        pageSize: data.form.pagination.pageSize,
      };
      data.form.loading = true;
      getTemplateReplyList(params)
        .then((res) => {
          data.form.tableData = res.data.records || [];
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
      await disableOrEnableTemplateReply(params);
      GjMessage.success(`${val.isActive ? "启用" : "禁用"}成功!`);
      resetSearchTable();
    };

    // 删除tag
    const changeFilterSelect = (id) => {
      data.fromDataSearch[id] = "";
      searchTable();
    };
    // 搜索
    const searchValueChange = (val, id, name, type, list, label, value) => {
      const showName = name;
      let showValue = "";
      let flag = val ? true : false;
      if (type === "select") {
        list.forEach((item) => {
          if (item[value] === val) {
            showValue = item[label];
          }
        });
      } else {
        showValue = val ? val : "";
      }

      setSearchActive(showName, showValue, id, flag);
      resetSearchTable();
    };
    // 处理active tag
    const setSearchActive = (showName, showValue, id, flag) => {
      const splitSymbol = "：";
      if (data.searchActive.length) {
        let pushFlag = false;
        const itemValue = data.searchActive.map((item) => item.id);
        const index = itemValue.indexOf(id);
        if (index > -1) {
          // data.searchActive存在此项
          flag
            ? (data.searchActive[index].showValue = showValue)
            : data.searchActive.splice(index, 1);
        } else {
          pushFlag = true;
        }
        // data.searchActive不存在此项
        if (pushFlag) {
          data.searchActive.push({
            splitSymbol,
            id,
            showName,
            showValue,
          });
        }
      } else {
        // data.searchActive不存在此项
        if (!flag) return;
        data.searchActive.push({
          splitSymbol,
          id,
          showName,
          showValue,
        });
      }
    };

    // 输入内容搜索
    const shopSearchChange = () => {
      searchValueChange(
        data.fromDataSearch.searchText.trim(),
        "searchText",
        "模糊查询",
        "input"
      );
    };
    // setKeyWord
    const setKeyWord = (row) => {
      let keywords = [];
      if (row && row.length > 0) {
        row.forEach((item) => {
          keywords.push(item.name);
        });
      }
      return keywords.join(",");
    };
    // setKeyWord
    const setPlatforms = (row) => {
      let platformNameList = [];
      if (row && row.length > 0) {
        row.forEach((item) => {
          platformNameList.push(item.platformName);
        });
      }
      return platformNameList.join(",");
    };

    onBeforeMount(() => {
      searchTable();
    });

    return {
      ...toRefs(data),
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
      changeFilterSelect,
      searchValueChange,
      shopSearchChange,
      setKeyWord,
      setPlatforms,
      searchTable,
    };
  },
});
</script>

<style lang="scss" scoped></style>
