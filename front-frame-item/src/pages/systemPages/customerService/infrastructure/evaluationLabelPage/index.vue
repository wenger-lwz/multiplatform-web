<template>
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
        placeholder="平台"
        class="search-select"
        allow-clear
        v-model="fromDataSearch.platformCode"
        @change="
          searchValueChange(
            fromDataSearch.platformCode,
            'platformCode',
            '平台',
            'select',
            labelTypeList,
            'label',
            'codeId'
          )
        "
      >
        <!-- <gj-option value="">全部</gj-option> -->
        <gj-option
          v-for="item in labelTypeList"
          :key="item.codeId"
          :value="item.codeId"
          >{{ item.label }}</gj-option
        >
      </gj-select>
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
    <template #table-content>
      <CommonTable
        ref="labelTableRef"
        :columns="form.columns"
        :tableData="form.tableData"
        rowKey="id"
        :loading="form.loading"
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
          <template v-else-if="column.dataIndex === 'scoreHighestList'">
            <gb-popover-edit
              v-if="record?.isEdit"
              title="评价区间"
              control
              :value="editRangList.rangeList"
              :rules="[{ required: true, message: customMessage }]"
              @cancel="cancelSetReplyPeriod"
              @ok="setReplyPeriod(record, $event)"
            >
              <gb-text>{{
                `${record?.scoreLowest}-${record?.scoreHighest}`
              }}</gb-text>
              <template #edit>
                <gj-form :model="editRangList">
                  <gj-form-item
                    field="rangeList"
                    validate-trigger="input"
                    :validate-status="customMessage ? 'error' : ''"
                    :hide-label="true"
                  >
                    <template #help>
                      {{ customMessage }}
                    </template>
                    <gb-num-range
                      :model-value="getModelValue(record)"
                      pre-placeholder="最小值"
                      suf-placeholder="最大值"
                      @change="changeRangeList(record, $event)"
                    >
                    </gb-num-range>
                  </gj-form-item>
                </gj-form>
              </template>
            </gb-popover-edit>
            <gb-text v-else>{{
              `${record.scoreLowest}-${record.scoreHighest}`
            }}</gb-text>
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
import addRulesForm from "@pagesSystem/customerService/infrastructure/components/addRulesForm.vue";
import OperateBar from "@/components/OperateBar.vue";
import {
  getCommentLabelList,
  disableOrEnableCommentLabelList,
  scoringIntervalCommentLabel,
} from "@/api/customerService/infrastructure.js";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { GjMessage } from "@gj/atom";
import TagGroup from "@/components/TagGroup.vue";
import {
  platformList,
  columnsList,
} from "@pagesSystem/customerService/infrastructure/config/evaluationLabelPage.js";

export default defineComponent({
  name: "storeAllocation",
  /* eslint-disable */
  components: {
    CommonPage,
    CommonTable,
    OperateBar,
    addRulesForm,
    OpbtnGroup,
    TagGroup,
  },
  /* eslint-enable */
  setup() {
    const data = reactive({
      searchActive: [],
      customMessage: "",
      labelTypeList: platformList,
      fromDataSearch: {
        platformCode: "",
        status: "",
        searchText: "",
      }, // 查询参数
      editRangList: {
        rangeList: [],
      },
      stateList: [
        // 状态
        { value: "1", label: "启用" },
        { value: "0", label: "禁用" },
      ],
      // table列表
      form: {
        rowSelection: [],
        noData: false, //无数据
        loading: false, //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        rowName: "id", //表格行 key 的取值字段
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
    });

    // 重置搜索条件
    const resetSearch = () => {
      data.fromDataSearch = {
        platformCode: "",
        status: "",
        searchText: "",
      };
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
    // 删除tag
    const changeFilterSelect = (id) => {
      data.fromDataSearch[id] = "";
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
      getCommentLabelList(params)
        .then((res) => {
          data.form.tableData = res.data.records || [];
          data.form.pagination.total = res.data.total;
        })
        .finally(() => {
          data.form.loading = false;
        });
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

    //状态
    const setIsActive = async (val) => {
      const params = {
        url: val.isActive ? "enable" : "disable",
        id: val.id,
      };
      await disableOrEnableCommentLabelList(params);
      GjMessage.success(`${val.isActive ? "启用" : "禁用"}成功!`);
      resetSearchTable();
    };
    // 处理评分区间
    const setReplyPeriod = (row, e) => {
      const parmas = {
        highScore: parseInt(data.editRangList.rangeList[1]),
        lowScore: parseInt(data.editRangList.rangeList[0]),
        platformCode: row?.platformId,
        scoreItemCode: row?.scoreItemCode,
        id: row?.id,
      };

      scoringIntervalCommentLabel(parmas)
        .then(() => {
          GjMessage.success(`修改成功!`);
          resetSearchTable();
          e.done();
        })
        .catch(() => {
          e.done(false);
        });
    };
    const cancelSetReplyPeriod = (e) => {
      data.editRangList.rangeList = [];
      e.done();
    };
    // 处理评分区间内容
    const getModelValue = (row) => {
      if (!data.editRangList.rangeList.length) {
        data.editRangList.rangeList = [row?.scoreLowest, row.scoreHighest];
      }
      return data.editRangList.rangeList || [];
    };
    // 处理评分区间内容
    const changeRangeList = (row, e) => {
      let maxFlag = false;
      let minFlag = false;
      if (e && e.length) {
        minFlag =
          row?.scoreOptionalMinimum <= parseInt(e[0]) &&
          parseInt(e[0]) <= row?.scoreOptionalMaximum;
        maxFlag =
          row?.scoreOptionalMinimum <= parseInt(e[1]) &&
          parseInt(e[1]) <= row?.scoreOptionalMaximum;
      }
      if (!minFlag || !maxFlag) {
        return (data.customMessage = `可输入的评分区间是${row?.scoreOptionalMinimum} ~ ${row?.scoreOptionalMaximum}`);
      } else if (parseInt(e[0]) > parseInt(e[1])) {
        return (data.customMessage = `您输入的最大值大于最小值，请重新输入！`);
      }
      data.editRangList.rangeList = e;
      data.customMessage = "";
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
      changeFilterSelect,
      searchValueChange,
      shopSearchChange,
      getModelValue,
      changeRangeList,
      cancelSetReplyPeriod,
    };
  },
});
</script>

<style lang="scss" scoped></style>
