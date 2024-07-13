<!--在线tab-->
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
        :showItem="['shopIds', 'chargePersonIds', 'specsType', 'keyWords']"
      ></FilterCondition>
    </template>
    <template #operate_bar-content>
      <OperateBtnGroup>
        <template #left>
          <gj-popconfirm
            content="此操作不可逆，是否删除？"
            position="bl"
            :popup-visible="deleteModel"
            @ok="handelBatchDeleteBtn"
            :render-to-body="false"
            @cancel="deleteModel = false"
            :ok-button-props="{
              status: 'danger',
            }"
          >
            <gj-button @click="verifyBatchDelete" type="plain"
              >批量删除</gj-button
            >
          </gj-popconfirm>
          <div class="quantity">
            <span class="text">已选</span>
            <span class="nember">{{ rowSelectionLength }}</span>
          </div>
        </template>
      </OperateBtnGroup>
    </template>
    <template #table-content>
      <CommonTable
        ref="commonTableRef"
        :rowKey="'listingId'"
        :columns="tableColumns"
        :tableData="tableData"
        :loading="loading"
        :pagination="pagination"
        :selectedRowKeys="selectedRowKeys"
        :rowSelectionVisiable="true"
        @getTableCurrent="getTableCurrent"
        @onRowSelection="getSelection"
        @change="sortChange"
      >
        <template #bodyCell="{ record, column }">
          <div v-if="column.dataIndex === 'mainImage'">
            <gb-table-image :url="record?.mainImage"></gb-table-image>
          </div>

          <div v-if="column.dataIndex === 'spu'">
            <div class="title">
              <div class="div1">
                <gb-text>{{ record.defaultTitle }}</gb-text>
              </div>
              <div class="div2">
                <columnCopy :isAnchor="false" :textValue="record.spu" />
              </div>
            </div>
          </div>

          <div v-if="column.dataIndex === 'itemId'">
            <columnCopy :openUrl="record.itemUrl" :textValue="record.itemId" />
          </div>

          <div v-if="column.dataIndex === 'msku'">
            <span v-if="record.msku">{{ record.msku }}</span>
            <span v-else>-</span>
          </div>

          <div v-if="column.dataIndex === 'specsType'">
            <variantPopover
              v-if="record.specsType == 2"
              :record="record"
              :columnList="variantColumnList"
            ></variantPopover>
            <div v-if="record.specsType == 1">单品</div>
          </div>

          <div v-if="column.dataIndex === 'recommendPrice'">
            <span v-if="record.recommendPrice">{{
              record.recommendPrice
            }}</span>
            <span v-else>-</span>
          </div>

          <div v-if="column.dataIndex === 'stock'">
            <span v-if="record.stock">{{ record.stock }}</span>
            <span v-else>-</span>
          </div>

          <div v-if="column.dataIndex === 'action'">
            <div v-if="record.processStatus && record.processStatus == 2">
              <gj-spin />
            </div>
            <div v-else class="but-group">
              <OpbtnGroup :btn-list="getBtnList()" :row="record"></OpbtnGroup>
            </div>
          </div>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  ref,
  computed,
} from "vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import {
  getOnlineGoodsInfoList,
  deleteOnlineGoods,
  batchOnlineGoods,
} from "@/api/published/aliexpress";
import OperateBtnGroup from "@/components/OperateBtnGroup.vue";
import FilterCondition from "./FilterCondition";
import TagGroup from "@/components/TagGroup.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { useChangeList, variantColumnList } from "./data";
import columnCopy from "@/components/columnCopy.vue";
import variantPopover from "../../../components/variant-popover.vue";
import { useRouter } from "vue-router";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  name: "",
  components: {
    CommonPage,
    CommonTable,
    OperateBtnGroup,
    FilterCondition,
    TagGroup,
    columnCopy,
    variantPopover,
    OpbtnGroup,
  },
  setup() {
    const $router = useRouter();
    const normalFilterRef = ref();
    const tableColumns = computed(() => {
      return [
        {
          key: "mainImage",
          title: "图片",
          dataIndex: "mainImage",
          fixed: "left",
          width: 70,
        },
        {
          key: "spu",
          title: "标题/SKU/SPU",
          dataIndex: "spu",
          width: 200,
        },
        {
          key: "itemId",
          title: "itemID",
          dataIndex: "itemId",
          width: 160,
        },
        {
          key: "shopName",
          title: "店铺",
          dataIndex: "shopName",
          width: 160,
        },
        {
          key: "msku",
          title: "店铺SKU",
          dataIndex: "msku",
          width: 180,
        },
        {
          key: "platformCategoryName",
          title: "AliExpress分类",
          dataIndex: "platformCategoryName",
          width: 140,
        },
        {
          key: "specsType",
          title: "规格",
          dataIndex: "specsType",
          width: 180,
        },
        {
          key: "recommendPrice",
          title: "售价",
          dataIndex: "recommendPrice",
          width: 180,
        },
        {
          key: "stock",
          title: "数量",
          dataIndex: "stock",
          width: 180,
        },

        {
          key: "chargePersonName",
          title: "负责人",
          dataIndex: "chargePersonName",
          width: 160,
        },
        {
          key: "key",
          title: "操作",
          dataIndex: "action",
          width: 140,
          fixed: "right",
        },
      ];
    });
    const data = reactive({
      variantColumnList: variantColumnList,
      searchActive: [],
      pagination: {
        total: 0,
        pageSize: 20,
        pageCurrent: 1,
      },
      sort: "createTime",
      order: "desc",
      platformStatus: 5,
      loading: false, //是否为加载中状态
      tableData: [],
      offModel: false,
      deleteModel: false,
      selectionData: [],
      paramsObj: {},
      editId: "",
    });
    const commonTableRef = ref(null);
    const selectedRow = ref([]);

    const getBtnList = () => {
      return [
        {
          label: "复制",
          click: (row) => copyDraft(row.listingId),
          permission: ["ALI/pubAliOnLineGoods/delete/copy"],
          isPopConfirm: false,
          outside: true,
        },
        {
          label: "删除",
          click: (row) => handelDeleteBtnByOne(row.listingId),
          tooltipContent: "此操作不可逆，是否删除？",
          permission: ["ALI/pubAliOnLineGoods/delete/delete"],
          isPopConfirm: true,
          outside: true,
          isDel: true,
        },
      ];
    };

    const getSelection = (val) => {
      selectedRow.value = val;
    };

    const sortedInfo = ref();

    const selectedRowKeys = computed(() => {
      return selectedRow.value.map((item) => item["listingId"]);
    });

    const sortChange = (val) => {
      /**
       * @param {val} 公共表格傳入的值
       */
      // 这里只监听排序的，有需要的类型自己补充
      if (val.action === "sort") {
        const { order, field, column } = val.sorter;
        data.sort = column ? field : "createTime";
        data.order = order === "ascend" ? "asc" : "desc";
        sortedInfo.value = val.sorter;
        getTableList();
        commonTableRef.value.updateSortOrder(sortedInfo.value);
      }
    };

    const getParams = () => {
      const params = {
        shopIds: data.paramsObj?.shopIds?.map((item) => item + "") || [],
        chargePersonIds:
          data.paramsObj?.chargePersonIds?.map((item) => item + "") || [],
        type: data.paramsObj.type || 1,
        keyWords: data.paramsObj.keyWords || "",
        specsType: data.paramsObj.specsType || "",

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
      getOnlineGoodsInfoList(tableParams)
        .then((res) => {
          data.tableData = res.data.records;
          data.pagination.total = res.data.total;

          commonTableRef.value.calculateWH();
        })
        .finally(() => {
          selectedRow.value = [];
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
      data.sort = "createTime"; //默认
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

    //勾选表格数据
    const selectionChange = (value) => {
      data.selectionData = value;
    };
    onBeforeMount(() => {
      getTableList();
    });

    const rowSelectionLength = computed(() => {
      return selectedRowKeys.value.length;
    });

    const verifyBatchOff = () => {
      if (rowSelectionLength.value > 0) {
        data.offModel = true;
      } else {
        return GjMessage.warning("至少选择一条要操作的数据!");
      }
    };

    //批量删除前验证
    const verifyBatchDelete = () => {
      if (rowSelectionLength.value > 0) {
        data.deleteModel = true;
      } else {
        return GjMessage.warning("至少选择一条要操作的数据!");
      }
    };
    //批量删除
    const handelBatchDeleteBtn = () => {
      data.deleteModel = false;
      batchOnlineGoods({
        itemIds: selectedRow.value.map((item) => item.itemId),
        type: 5,
      }).then(() => {
        getTableList();
        return GjMessage.success(`删除任务提交成功，请稍后查看！`);
      });
    };

    //单条删除
    const handelDeleteBtnByOne = (id) => {
      deleteOnlineGoods(id).then(() => {
        GjMessage.success("删除任务提交成功，请稍后查看！");
        getTableList();
      });
    };

    //复制在线商品
    const copyDraft = (id) => {
      const query = {
        productId: id,
      };
      $router.push({
        path: "/pubAliDraft",
        query,
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
      resetSearch,
      selectionChange,
      verifyBatchOff,
      verifyBatchDelete,
      handelBatchDeleteBtn,
      tableColumns,
      handelDeleteBtnByOne,
      copyDraft,
      rowSelectionLength,
      getTableCurrent,
      normalFilterRef,
      changeList,
      changeFilterSelect,
      filterChange,
      selectedRowKeys,
      getSelection,
      sortChange,
      getBtnList,
    };
  },
});
</script>

<style scoped lang="scss">
/deep/.opbtn-group_oustside {
  display: flex;
}
.but-group {
  display: flex;
}
.quantity {
  margin-left: 12px;
  color: #00043066;
  .nember {
    color: #0045f0;
    margin-left: 2px;
  }
}
</style>
