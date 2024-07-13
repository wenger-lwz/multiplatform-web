<template>
  <CommonPage
    class="common-pages-spu"
    :pageRest="true"
    @common-page-rest="commonPageRest"
  >
    <template #filter-content>
      <div class="productMaterial-search-list">
        <gb-select-input2
          v-model="selectInput"
          inputMore
          :options="options"
          @search="gbSearch"
        ></gb-select-input2>
      </div>
    </template>
    <template #operate_bar-content>
      <OperateBar @operate-rest="refresh" :refreshShow="true"></OperateBar>
    </template>
    <template #table-content>
      <CommonTable
        pageKey="-spu"
        :columns="spuColumns"
        :tableData="list"
        :pagination="{
          ...pagination,
          total,
        }"
        row-key="spu"
        @getTableCurrent="paginationChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'spuName'">
            <gb-text>{{ record.spuName }}</gb-text>
            <div>
              <ColumnCopy
                class="c-1"
                :isAnchor="false"
                :textValue="record.spu"
              ></ColumnCopy>
            </div>
          </template>
          <template v-if="column.key === 'operation'">
            <gj-button
              v-permissions="['PLAT/materialCenter/productMaterial/edit']"
              type="text"
              @click="edit(record)"
              >编辑</gj-button
            >
          </template>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
</template>

<script>
import { reactive, toRefs } from "vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import OperateBar from "@/components/OperateBar.vue";
import ColumnCopy from "@/components/columnCopy.vue";
// import SvgIcon from "@/components/SvgIcon";
import useGetTableList from "../../hooks/useGetTableList";

export default {
  components: {
    CommonPage,
    CommonTable,
    ColumnCopy,
    OperateBar,
  },
  emits: ["edit"],
  setup(props, { emit }) {
    const defaultData = {
      selectInput: {
        selectValue: "0",
        inputValue: "",
        moreValue: [],
      },
      searchData: {},
    };
    const data = reactive({
      options: [
        { value: "0", label: "SPU" },
        { value: "1", label: "产品名称" },
      ],
      spuColumns: [
        {
          key: "spuName",
          title: "产品名/SPU",
          dataIndex: "spuName",
        },
        {
          title: "已有图片",
          dataIndex: "imgCount",
        },
        {
          title: "已有视频",
          dataIndex: "videoCount",
        },
        {
          title: "已有标题",
          dataIndex: "titleCount",
        },
        {
          title: "已有文案",
          dataIndex: "textCount",
        },
        {
          title: "操作",
          key: "operation",
          width: 100,
        },
      ],
      selectInput: JSON.parse(JSON.stringify(defaultData.selectInput)),
      searchData: JSON.parse(JSON.stringify(defaultData.searchData)),
    });

    const { list, pagination, total, paginationChange, getTableList } =
      useGetTableList({ url: "/resource/productSpuPageList" });

    getTableList();

    const gbSearch = (val) => {
      data.selectInput = val;
      search();
    };

    const search = () => {
      let params = {};
      params.item = data.selectInput.selectValue;
      if (data.selectInput.moreValue.length) {
        params.itemContent = data.selectInput.moreValue.map((item) => {
          return item.trim();
        });
      }
      if (data.selectInput.inputValue) {
        params.itemContent = [data.selectInput.inputValue.trim()];
      }
      paginationChange(
        {
          pageCurrent: 1,
        },
        {
          ...params,
          ...data.searchData,
        }
      );
    };

    // 重置
    const commonPageRest = () => {
      data.selectInput = JSON.parse(JSON.stringify(defaultData.selectInput));
      data.searchData = JSON.parse(JSON.stringify(defaultData.searchData));
      search();
    };

    // 刷新
    const refresh = () => {
      let params = {};
      params.item = data.selectInput.selectValue;
      if (data.selectInput.moreValue.length) {
        params.itemContent = data.selectInput.moreValue.map((item) => {
          return item.trim();
        });
      }
      if (data.selectInput.inputValue) {
        params.itemContent = [data.selectInput.inputValue.trim()];
      }
      getTableList({
        ...params,
        ...data.searchData,
      });
    };

    const edit = (row) => {
      emit("edit", row);
    };

    return {
      ...toRefs(data),
      list,
      pagination,
      total,
      paginationChange,
      gbSearch,
      search,
      commonPageRest,
      refresh,
      edit,
    };
  },
};
</script>
