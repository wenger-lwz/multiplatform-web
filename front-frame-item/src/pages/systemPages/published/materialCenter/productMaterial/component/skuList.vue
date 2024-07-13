<template>
  <CommonPage :pageRest="true" @common-page-rest="commonPageRest">
    <template #filter-content>
      <div class="productMaterial-search-list">
        <gb-select-input2
          v-model="selectInput"
          inputMore
          :options="options"
          @search="gbSearch"
        ></gb-select-input2>
        <gj-tree-select
          v-model="searchData.category"
          class="searchList-tree-select"
          size="medium"
          allow-clear
          :data="treeData"
          :field-names="{ key: 'category', title: 'categoryName' }"
          placeholder="产品分类"
          @change="search"
        ></gj-tree-select>
      </div>
    </template>
    <template #operate_bar-content>
      <OperateBar @operate-rest="refresh" :refreshShow="true"></OperateBar>
    </template>
    <template #table-content>
      <CommonTable
        :columns="skuColumns"
        :tableData="list"
        :pagination="getPagination"
        row-key="sku"
        @getTableCurrent="paginationChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'skuName'">
            <gb-text>{{ record.skuName }}</gb-text>
            <div>
              <ColumnCopy
                class="c-1"
                :isAnchor="false"
                :textValue="record.sku"
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
import { reactive, toRefs, computed } from "vue";
import { getProductCategoryList } from "@/api/published/materialCenter";
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
    OperateBar,
    ColumnCopy,
  },
  emits: ["edit"],
  setup(props, { emit }) {
    const defaultData = {
      selectInput: {
        selectValue: "0",
        inputValue: "",
        moreValue: [],
      },
      searchData: {
        category: "",
      },
    };

    const data = reactive({
      treeData: [],
      options: [
        { value: "0", label: "SKU" },
        { value: "1", label: "产品名称" },
      ],
      skuColumns: [
        {
          key: "skuName",
          title: "产品名/SKU",
          dataIndex: "skuName",
        },
        {
          title: "产品分类",
          dataIndex: "categoryName",
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

    // 获取分类
    getProductCategoryList().then((res) => {
      data.treeData = res.data;
    });

    const { list, pagination, total, paginationChange, getTableList } =
      useGetTableList({ url: "/resource/productSkuPageList" });

    getTableList();

    const getPagination = computed(() => {
      return {
        pageCurrent: pagination.value.pageCurrent,
        pageSize: pagination.value.pageSize,
        total: total.value,
      };
    });

    const gbSearch = (val) => {
      data.selectInput = val;
      search();
    };

    // 列表搜索
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
      emit("edit", row, "sku");
    };

    return {
      ...toRefs(data),
      list,
      getPagination,
      total,
      paginationChange,
      search,
      gbSearch,
      commonPageRest,
      refresh,
      edit,
    };
  },
};
</script>

<style lang="scss" scoped>
.gb-select-input2 {
  display: inline-flex;
}
::v-deep .searchList-tree-select {
  width: 160px;
  margin-left: 8px;
}
</style>
