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
        :showItem="[
          'shopIds',
          'chargePersonIds',
          'updateState',
          'specsType',
          'keyWords',
          'rangeValue',
        ]"
      ></FilterCondition>
    </template>
    <template #operate_bar-content>
      <OperateBtnGroup>
        <template #left>
          <gj-popconfirm
            :content="`您即将下架${rowSelectionLength}个在线商品，下架后商品将不能被买家检索查看到，是否继续？`"
            position="bl"
            :popup-visible="offModel"
            :render-to-body="false"
            @ok="handelBatchOffBtn"
            @cancel="offModel = false"
          >
            <gj-button @click="verifyBatchOff" type="plain">批量下架</gj-button>
          </gj-popconfirm>
          <!-- <gj-button size="small" type="primary">批量下架</gj-button> -->
          <gj-button @click="handelBatchSyncBtn" type="plain"
            >批量同步</gj-button
          >

          <gj-popconfirm
            :content="`您即将更新${rowSelectionLength}个在线商品，本地数据更新到平台，是否继续？`"
            position="bl"
            :popup-visible="updateModel"
            @ok="handelBatchUpdateBtn"
            :render-to-body="false"
            @cancel="updateModel = false"
          >
            <gj-button @click="verifyBatchUpdate" type="plain"
              >批量更新</gj-button
            >
          </gj-popconfirm>
          <!-- <gj-button @click="handelBatchUpdateBtn">批量更新</gj-button> -->
          <!-- <gj-popconfirm
            :content="`即将删除${rowSelectionLength}条在线商品，是否删除？`"
            position="bl"
            :popup-visible="deleteModel"
            @ok="handelBatchDeleteBtn"
            @cancel="deleteModel = false"
          >
            <gj-button @click="verifyBatchDelete" 
              >批量删除</gj-button
            >
          </gj-popconfirm> -->
          <!-- <div>
            已选
            <span>{{ rowSelectionLength }}</span>
          </div> -->

          <div class="quantity">
            <span class="text">已选</span>
            <span class="nember">{{ rowSelectionLength }}</span>
          </div>
        </template>
        <template #right>
          <QueuePopover
            :platformCode="'ALIEXPRESS'"
            title="更新队列"
          ></QueuePopover>
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

          <div v-if="column.dataIndex === 'updateState'">
            <span class="spot waitting" v-if="record.updateState === 1"></span>
            <span
              class="spot incomplete"
              v-else-if="record.updateState === 2"
            ></span>
            <span
              class="spot danger"
              v-else-if="record.updateState === 3"
            ></span>

            <span v-if="record.updateState != 3">
              {{ getLabel(updateStateList, record.updateState) }}
            </span>
            <gj-popover v-if="record.updateState == 3" position="bottom">
              <span>{{ getLabel(updateStateList, record.updateState) }}</span>
              <template #content>
                <p>{{ record.failReason }}</p>
              </template>
            </gj-popover>
            <span v-if="!record.updateState">-</span>
          </div>

          <div v-if="column.dataIndex === 'createTime'">
            <span>{{
              formatDateTime(record.createTime, "YYYY-MM-DD HH:mm:ss", "-")
            }}</span>
          </div>

          <div v-if="column.dataIndex === 'updateTime'">
            <span>{{
              formatDateTime(record.updateTime, "YYYY-MM-DD HH:mm:ss", "-")
            }}</span>
          </div>
          <div v-if="column.dataIndex === 'action'">
            <div v-if="record.processStatus && record.processStatus == 2">
              <gj-spin />
            </div>
            <div v-else>
              <OpbtnGroup :btn-list="getBtnList()" :row="record"></OpbtnGroup>
            </div>
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
    :updateState="updateState"
    type="online"
    @cancel="cancelEditDialog"
    @confirm="confirmEditDialog"
    @statusChange="statusChange"
    :editData="editData"
  ></EditDialog>
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
// import EditDialog from './editDialog.vue'
import EditDialog from "../../pubAliDraft/components/editDialog.vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import {
  getOnlineGoodsInfoList,
  batchOnlineGoods,
  getOnlineGoodsDetail,
  getTemporary,
  downOnlineGoods,
  syncOnlineGoods,
  updateOnlineGoods,
} from "@/api/published/aliexpress";
import OperateBtnGroup from "@/components/OperateBtnGroup.vue";
import FilterCondition from "./FilterCondition";
import QueuePopover from "@/components/QueuePopover.vue";
import TagGroup from "@/components/TagGroup.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import {
  useChangeList,
  getLabel,
  updateStateList,
  variantColumnList,
} from "./data";
import columnCopy from "@/components/columnCopy.vue";
import variantPopover from "../../../components/variant-popover.vue";
import { useRouter } from "vue-router";
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
    QueuePopover,
    TagGroup,
    EditDialog,
    columnCopy,
    variantPopover,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const $router = useRouter();
    console.log(proxy);
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
          title: "itemId",
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
          key: "updateState",
          title: "状态",
          dataIndex: "updateState",
          width: 160,
        },
        {
          key: "chargePersonName",
          title: "负责人",
          dataIndex: "chargePersonName",
          width: 160,
        },
        {
          key: "createTime",
          title: "创建时间",
          dataIndex: "createTime",
          width: 160,
          showSorterTooltip: false,
          sorter: true,
        },
        {
          key: "updateTime",
          title: "更新时间",
          dataIndex: "updateTime",
          width: 160,
          showSorterTooltip: false,
          sorter: true,
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
      formatDateTime: formatDateTime,
      getLabel: getLabel,
      updateStateList: updateStateList,
      variantColumnList: variantColumnList,
      searchActive: [],
      pagination: {
        total: 0,
        pageSize: 20,
        pageCurrent: 1,
      },
      sort: "createTime",
      order: "desc",
      platformStatus: 1,
      loading: false, //是否为加载中状态
      tableData: [],
      offModel: false,
      updateModel: false,
      deleteModel: false,
      selectionData: [],
      paramsObj: {},
      editDialogVisible: false,
      editId: "",
      editData: {},
      updateState: "",
      itemId: "",
    });
    const commonTableRef = ref(null);
    const selectedRow = ref([]);

    const getBtnList = () => {
      return [
        {
          label: "编辑",
          click: (row) =>
            editOnlineGoodsInfo(row.listingId, row.itemId, row.updateState),
          outside: true,
          permission: ["ALI/pubAliOnLineGoods/online/edit"],
        },
        {
          label: "下架",
          click: (row) => handelOffBtnByOne(row.itemId),
          tooltipContent:
            "您即将下架1个在线商品，下架后商品将不能被买家检索查看到，是否继续？",
          permission: ["ALI/pubAliOnLineGoods/online/off"],
          isPopConfirm: true,
        },
        {
          label: "复制",
          click: (row) => copyDraft(row.listingId),
          permission: ["ALI/pubAliOnLineGoods/online/copy"],
          isPopConfirm: false,
        },
        {
          label: "同步",
          click: (row) => handelSyncBtnByOne(row.itemId),
          permission: ["ALI/pubAliOnLineGoods/online/sync"],
          isPopConfirm: false,
        },
        {
          label: "更新",
          click: (row) => handelUpdateBtnByOne(row.itemId),
          permission: ["ALI/pubAliOnLineGoods/online/update"],
          isPopConfirm: false,
        },
        // {
        //   label: '删除',
        //   click: (row) => handelDeleteBtnByOne(row.listingId),
        //   tooltipContent: '即将删除1条在线商品，是否确认删除?',
        //   permission: ['ALI/pubAliOnLineGoods/online/delete'],
        //   isPopConfirm: true,
        // },
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
        timeType: data.paramsObj.timeType || 1,
        updateState: data.paramsObj.updateState,
        startTime:
          (data.paramsObj.rangeValue && data.paramsObj.rangeValue[0]) || "",
        endTime:
          (data.paramsObj.rangeValue && data.paramsObj.rangeValue[1]) || "",
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
          console.log(data.tableData);
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
        return GjMessage.warning("请至少选择一条要操作的数据!");
      }
    };

    const verifyBatchUpdate = () => {
      if (rowSelectionLength.value > 0) {
        data.updateModel = true;
      } else {
        return GjMessage.warning("请至少选择一条要操作的数据!");
      }
    };

    //批量下架
    const handelBatchOffBtn = () => {
      console.log(selectedRow.value);
      data.offModel = false;
      batchOnlineGoods({
        itemIds: selectedRow.value.map((item) => item.itemId),
        type: 2,
      }).then(() => {
        getTableList();
        return GjMessage.success(
          `下架任务已提交，下架后可在“已下架”列表查看或重新上架。`
        );
      });
    };

    //批量同步
    const handelBatchSyncBtn = () => {
      if (rowSelectionLength.value > 0) {
        batchOnlineGoods({
          itemIds: selectedRow.value.map((item) => item.itemId),
          type: 3,
        }).then(() => {
          getTableList();
          return GjMessage.success("同步任务已提交，请稍后查看!");
        });
      } else {
        return GjMessage.warning("请至少选择一条要操作的数据!");
      }
    };

    //批量更新
    const handelBatchUpdateBtn = () => {
      data.updateModel = false;
      if (rowSelectionLength.value > 0) {
        batchOnlineGoods({
          itemIds: selectedRow.value.map((item) => item.itemId),
          type: 4,
        }).then(() => {
          getTableList();
          return GjMessage.success("更新任务已提交，请稍后查看!");
        });
      } else {
        return GjMessage.warning("请至少选择一条要操作的数据!");
      }
    };

    //批量删除前验证
    const verifyBatchDelete = () => {
      if (rowSelectionLength.value > 0) {
        data.deleteModel = true;
      } else {
        return GjMessage.warning("请至少选择一条要操作的数据!");
      }
    };
    //批量删除
    const handelBatchDeleteBtn = () => {
      // batchDelete({
      //   productIds: data.form.rowSelection,
      // }).then((res) => {
      //   if (res.code === 200) {
      //     GjMessage.success('删除成功')
      //     data.form.rowSelection = []
      //     getTableList()
      //   } else {
      //     GjMessage.error('删除失败！')
      //   }
      // })
    };

    //下架单条商品
    const handelOffBtnByOne = (id) => {
      downOnlineGoods(id).then(() => {
        getTableList();
        return GjMessage.success(
          "已下架1个商品，下架后可在“已下架”列表查看或重新上架。"
        );
      });
    };

    //同步单个商品
    const handelSyncBtnByOne = (id) => {
      syncOnlineGoods(id).then(() => {
        getTableList();
        return GjMessage.success("同步任务已提交，请稍后查看!");
      });
    };

    //更新
    const handelUpdateBtnByOne = (id) => {
      updateOnlineGoods(id).then(() => {
        return GjMessage.success("更新任务已提交，请稍后查看!");
      });
    };

    //单条删除
    const handelDeleteBtnByOne = () => {
      // batchDelete({
      //   productIds: data.form.rowSelection,
      // }).then((res) => {
      //   if (res.code === 200) {
      //     GjMessage.success('删除成功')
      //     data.form.rowSelection = []
      //     getTableList()
      //   } else {
      //     GjMessage.error('删除失败！')
      //   }
      // })
    };

    //编辑
    const editOnlineGoodsInfo = (id, itemId, updateState = "") => {
      data.editDialogVisible = true;
      data.editId = id;
      data.updateState = updateState;
      data.itemId = itemId;

      if (updateState == 1) {
        getOnlineGoodsDetail(id).then((res) => {
          data.editData = res.data;
        });
      } else {
        getTemporary(id).then((res) => {
          data.editData = res.data;
        });
      }
    };

    const statusChange = (val) => {
      if (val == 1) {
        getOnlineGoodsDetail(data.editId).then((res) => {
          data.editData = res.data;
        });
      } else {
        getTemporary(data.editId).then((res) => {
          data.editData = res.data;
        });
      }
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

    //编辑/创建弹窗取消
    const cancelEditDialog = () => {
      data.editDialogVisible = false;
    };
    //编辑/创建弹窗确定
    const confirmEditDialog = () => {
      data.editDialogVisible = false;
      getTableList();
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
      selectionChange,
      verifyBatchOff,
      verifyBatchUpdate,
      handelBatchOffBtn,
      handelBatchSyncBtn,
      handelBatchUpdateBtn,
      verifyBatchDelete,
      handelBatchDeleteBtn,
      tableColumns,
      handelOffBtnByOne,
      handelSyncBtnByOne,
      handelDeleteBtnByOne,
      handelUpdateBtnByOne,
      editOnlineGoodsInfo,
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
      statusChange,
    };
  },
});
</script>

<style scoped lang="scss">
.spot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  margin-right: 4px;
}

.incomplete {
  background-color: #ee7c30;
}

.danger {
  background-color: #ff5c5c;
}

.waitting {
  background-color: #0045f0;
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
