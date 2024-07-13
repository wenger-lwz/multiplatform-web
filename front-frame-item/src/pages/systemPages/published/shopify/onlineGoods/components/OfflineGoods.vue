<template>
  <common-page
    class="common-list-page"
    :pageRest="true"
    @common-page-rest="resetHandler"
  >
    <template #tag-content>
      <tag-group v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #filter-content>
      <search-tag-community
        ref="normalFilterRef"
        :timeOpt="offlineTimeOption"
        :titleListOpt="onlineInputOptions"
        :showItem="['shopId', 'keyWord', 'rangeValue']"
        @filter-change="filterChange"
        @tag-change="changeList"
      />
    </template>
    <template #operate_bar-content>
      <operate-bar>
        <template #left>
          <gj-button
            v-for="item in handleBtns"
            :key="item.text"
            :type="item.type"
            @click="item.handler"
            >{{ item.text }}</gj-button
          >
          <p class="table-selected-rows-nums">
            <span>已选</span>
            <span>{{ selectedRowIds.length }}</span>
          </p>
        </template>
      </operate-bar>
    </template>
    <template #table-content>
      <common-table
        ref="commonTableRef"
        :columns="tableColumns"
        :tableData="tableData"
        row-key="id"
        :loading="loading"
        :row-selection-visiable="true"
        :selectedRowKeys="selectedRowIds"
        @on-row-selection="selectChange"
        :pagination="paginationProps"
        @getTableCurrent="getTableCurrent"
        @change="sortChange"
      ></common-table>
    </template>
  </common-page>
  <gj-modal
    title="删除"
    :visible="deleteModalVisible"
    :render-to-body="false"
    unmountOnClose
    @ok="deleteRows"
    @cancel="cancelDeleteRows"
    >此操作不可逆，是否删除？</gj-modal
  >
  <gj-modal
    title="重新上架"
    :visible="onlineModalVisible"
    :render-to-body="false"
    unmountOnClose
    @ok="handleRelisting"
    @cancel="cancelOnlineGoods"
    >即将上架{{ onlineRowIds.length }}条商品，是否继续？</gj-modal
  >
  <gj-modal
    title="批量同步"
    :visible="syncModalVisible"
    :render-to-body="false"
    unmountOnClose
    @ok="handleSyncGoods"
    @cancel="syncModalVisible = false"
    >您即将同步{{
      syncRowIds.length
    }}条在线商品，同步后系统商品Listing为当前平台商品的在线Listing信息，是否继续？</gj-modal
  >
  <online-detail
    v-if="detailVisible"
    :productId="productId"
    :platformStatus="3"
    :type="actionType"
    :dialogVisible="detailVisible"
    @cancel="detailDialogCancel"
    @update-handler="detailDialogUpdate"
  />
</template>

<script>
import { computed, reactive, toRefs, watch, ref, resolveComponent } from "vue";
import { useRouter } from "vue-router";
import { GjMessage } from "@gj/atom";
import _ from "lodash";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import SearchTagCommunity from "../../components/SearchTagCommunity.vue";
import OperateBar from "@/components/OperateBar.vue";
import TagGroup from "@/components/TagGroup.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import AppPopover from "@/components/AppPopover.vue";
import AppTablePopover from "@/components/AppTablePopover.vue";
import OnlineDetail from "../../components/draftAndOnline/OnlineDetail.vue";
import columnCopy from "@/components/columnCopy.vue";
import {
  offlineTimeOption,
  onlineInputOptions,
  variantListColumns,
} from "@pagesSystem/published/shopify/config";
import {
  getOnlineList,
  getOnlineGoodVariant,
  relisting,
  syncGoods,
  deleteOnlineGoods,
} from "@/api/published/shopify";
import { clearStore } from "@/utils/common";
import { emptyFilter, formatDateTime } from "@/utils/format";

export default {
  components: {
    CommonTable,
    SearchTagCommunity,
    /* eslint-disable */
    SvgIcon,
    AppPopover,
    AppTablePopover,
    OnlineDetail,
    CommonPage,
    OperateBar,
    TagGroup,
    columnCopy,
  },
  setup() {
    const $router = useRouter();
    const GbImage = resolveComponent("GbImage");
    const GjButton = resolveComponent("GjButton");
    const GjSpin = resolveComponent("GjSpin");
    const GjSpace = resolveComponent("GjSpace");
    const GjPopover = resolveComponent("GjPopover");
    const SvgIcon = resolveComponent("SvgIcon");
    const GbText = resolveComponent("GbText");

    const commonTableRef = ref(null);
    const normalFilterRef = ref(null);
    const data = reactive({
      variantListColumns: variantListColumns,
      selectedRowIds: [],
      tableData: [],
      pageOption: {
        total: 0,
        pageCurrent: 1,
        pageSize: 20,
        sortField: "offlineTime",
        seq: "DESC",
      },
      searchActive: [],
      loading: false,
      parmasObj: {},
      productId: "",
      actionType: 1,
      onlineModalVisible: false,
      deleteModalVisible: false,
      syncModalVisible: false,
      detailVisible: false,
      onlineRowIds: [],
      deleteRowIds: [],
      syncRowIds: [],
      loadingMap: {},
      popupOperateObj: {},
    });

    const tableColumns = [
      {
        fixed: "left",
        title: "图片",
        dataIndex: "mainImage",
        width: 80,
        customRender: ({ record }) => (
          <GbImage width="36" src={record.mainImage}></GbImage>
        ),
      },
      {
        fixed: "left",
        title: "标题/SPU/SKU",
        dataIndex: "spu",
        width: 300,
        customRender: ({ record }) => {
          const copyNode = record.spu ? (
            <columnCopy isAnchor={false} textValue={record.spu} />
          ) : (
            <span>-</span>
          );
          return (
            <div>
              <GbText>{record.title}</GbText>
              <div>{copyNode}</div>
            </div>
          );
        },
      },
      {
        fixed: "left",
        title: "商品ID",
        dataIndex: "platformItemId",
        width: 150,
      },
      {
        title: "店铺",
        dataIndex: "storeName",
        width: 200,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.storeName)}</GbText>
        ),
      },
      {
        title: "店铺SKU",
        dataIndex: "storeSku",
        width: 200,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.storeSku)}</GbText>
        ),
      },
      {
        title: "Shopify分类",
        dataIndex: "productCategory",
        width: 150,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.productCategory)}</GbText>
        ),
      },
      {
        title: "规格",
        dataIndex: "specsType",
        width: 100,
        customRender: ({ record }) => {
          if (record.specsType === 2) {
            return (
              <AppTablePopover
                popup-container="#shopify-online-gooods"
                title="变体信息"
                record="变体"
                columns={data.variantListColumns}
                requestFunction={getOnlineGoodVariant}
                handlerFunction={handlerFunction}
                paramObj={{ id: record.id }}
              />
            );
          } else {
            return <span>单品</span>;
          }
        },
      },
      {
        title: "售价",
        dataIndex: "recommendPrice",
        width: 150,
        customRender: ({ record }) => (
          <span>{emptyFilter(record.recommendedPriceRange)}</span>
        ),
      },
      {
        title: "负责人",
        dataIndex: "chargePersonName",
        width: 100,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.chargePersonName)}</GbText>
        ),
      },
      {
        title: "下架人",
        dataIndex: "chargePersonName",
        width: 100,
        customRender: ({ record }) => (
          <span>{emptyFilter(record.chargePersonName)}</span>
        ),
      },
      {
        title: "下架时间",
        dataIndex: "offlineTimeStart",
        width: 180,
        key: "offlineTimeStart",
        showSorterTooltip: false,
        sorter: true,
        customRender: ({ record }) => (
          <span>{formatDateTime(record.offlineTimeStart)}</span>
        ),
      },
      {
        title: "",
        dataIndex: "action",
        fixed: "right",
        width: 130,
        customRender: ({ record }) => {
          const slots = {
            default: () => (
              <GjButton type="text" size="mini">
                <SvgIcon svgClass="more-ellipse" width={16} />
              </GjButton>
            ),
            content: () => (
              <>
                <p>
                  <GjButton type="text" onClick={() => relistingRow(record)}>
                    重新上架
                  </GjButton>
                </p>
                <p>
                  <GjButton type="text" onClick={() => copyRow(record)}>
                    复制
                  </GjButton>
                </p>
                <p>
                  <GjButton type="text" onClick={() => syncRow(record)}>
                    同步
                  </GjButton>
                </p>
                <p>
                  <GjButton type="text" onClick={() => deleteRow(record)}>
                    删除
                  </GjButton>
                </p>
              </>
            ),
          };

          return (
            <div class="table-more-handles">
              {data.loadingMap[record.id] ? (
                <GjSpin class="listing-table-loading" />
              ) : (
                <>
                  <GjButton
                    type="text"
                    size="mini"
                    onClick={() => editRow(record)}
                  >
                    编辑
                  </GjButton>
                  <GjPopover
                    onPopupVisibleChange={(bool) => popupChange(record, bool)}
                    trigger="click"
                    position="bottom"
                    v-slots={slots}
                  ></GjPopover>
                </>
              )}
            </div>
          );
        },
      },
    ];

    const paginationProps = computed(() => {
      return {
        total: data.pageOption.total,
        pageSize: data.pageOption.pageSize,
        pageCurrent: data.pageOption.pageCurrent,
        sortField: data.pageOption.sortField,
        seq: data.pageOption.seq,
      };
    });

    watch(
      () => data.detailVisible,
      (value) => {
        if (!value) {
          clearStore();
        }
      }
    );

    const filterChangeFn = (filterData) => {
      const title =
        filterData.keyWordType === "1" ? filterData.keyWord : undefined;
      const platformItemId =
        filterData.keyWordType === "2" ? filterData.keyWord : undefined;
      const spu =
        filterData.keyWordType === "3" ? filterData.keyWord : undefined;
      const storeSku =
        filterData.keyWordType === "4" ? filterData.keyWord : undefined;
      data.parmasObj = {
        platformStatus: 3,
        shopIds: filterData.shopId,
        title,
        spu,
        platformItemId,
        storeSku,
        offlineTimeStart:
          (filterData.rangeValue && filterData.rangeValue[0]) || "",
        offlineTimeEnd:
          (filterData.rangeValue && filterData.rangeValue[1]) || "",
      };
      data.pageOption.pageCurrent = 1;
      getData();
    };

    const searchDataParam = computed(() => {
      return {
        ...data.pageOption,
        ...data.parmasObj,
      };
    });

    const selectChange = (selectedRows) => {
      data.selectedRowIds = selectedRows.map((item) => item.id);
    };

    const sortChange = (val) => {
      if (val.action === "sort") {
        const { order, field, column } = val.sorter;
        data.pageOption.sortField = column ? field : "offlineTime";
        data.pageOption.seq = order === "ascend" ? "ASC" : "DESC";
        getData();
        commonTableRef.value.updateSortOrder(val.sorter);
      }
    };

    const errorCallBack = () => {
      data.tableData = [];
      data.pageOption.total = 0;
    };

    const getData = () => {
      const params = searchDataParam.value;
      data.selectedRowIds = [];
      getOnlineList(params)
        .then((res) => {
          data.tableData = res.data?.records || [];
          data.pageOption.total = res.data?.total;
        })
        .catch(() => {
          errorCallBack();
        });
    };

    const filterChange = _.debounce(filterChangeFn, 200);

    const getTableCurrent = (e) => {
      if (Object.prototype.hasOwnProperty.call(e, "pageCurrent")) {
        data.pageOption.pageCurrent = e.pageCurrent;
      }
      if (Object.prototype.hasOwnProperty.call(e, "pageSize")) {
        data.pageOption.pageSize = e.pageSize;
      }
      getData();
    };

    // 删除tags
    const changeFilterSelect = (id) => {
      normalFilterRef.value?.changeFilterCondition(id);
    };

    // 生成tags
    const changeList = (target) => {
      data.searchActive = useChangeList(target, data.searchActive);
    };

    // 重置按钮
    const resetHandler = () => {
      commonTableRef.value.updateSortOrder(null);
      normalFilterRef.value?.resetHandler();
    };

    // 处理tags
    const useChangeList = (target, source) => {
      let result = [];
      if (Array.isArray(target)) {
        result = target.filter((item) => item.showValue?.length > 0);
      } else {
        const index = source.findIndex((item) => item.id === target.id);
        result = [...source];
        const { showName, showValue } = target;
        if (index >= 0) {
          if (!showValue || showValue.length <= 0) {
            result.splice(index, 1);
          } else {
            result[index].showName = showName;
            result[index].showValue = showValue;
          }
        } else if (showValue) {
          result.push(target);
        }
      }
      return result;
    };

    const handlerFunction = (res) => {
      const list = res.data || [];
      const result = [];
      let itemObj = null;
      let dkrColumns = [];
      let recommendPriceUnit = "";
      list.forEach((item, index) => {
        recommendPriceUnit = recommendPriceUnit || item.recommendPriceUnit;
        itemObj = { ...item, id: item.id || index };
        item.variantAttrInfo?.forEach((it) => {
          itemObj[it.attrName] = it.attrValue;
        });
        result.push(itemObj);
      });
      dkrColumns = list
        .map((item) => item.variantAttrInfo?.map((it) => it.attrName))
        .flat(1);
      dkrColumns = [...new Set(dkrColumns)];
      dkrColumns = dkrColumns.map((item) => ({
        title: item,
        dataIndex: item,
        minWidth: 120,
        customRender: ({ record }) => <span>{emptyFilter(record[item])}</span>,
      }));
      dkrColumns = dkrColumns.concat(
        variantListColumns.map((item) => ({
          ...item,
          title:
            item.showRecommendPriceUnit && recommendPriceUnit
              ? `${item.title}(${recommendPriceUnit})`
              : item.title,
          customRender: ({ record }) => (
            <span>{emptyFilter(record[item.dataIndex])}</span>
          ),
        }))
      );
      data.variantListColumns = [...dkrColumns];
      return { total: result.length, tableData: result };
    };

    const popupChange = (record, bool) => {
      data.popupOperateObj[record.id] = bool;
    };

    const relistingRow = (record) => {
      data.popupOperateObj[record.id] = false;
      data.onlineModalVisible = true;
      data.onlineRowIds = [record.id];
    };

    const batchRelisting = () => {
      if (data.selectedRowIds.length === 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.onlineRowIds = data.selectedRowIds;
      data.onlineModalVisible = true;
    };

    const handleRelisting = () => {
      const option = {
        ids: data.onlineRowIds,
      };
      relisting(option)
        .then(() => {
          GjMessage.success("上架任务已提交，上架成功后可在“在线列表”查看。");
          getData();
        })
        .finally(() => {
          data.onlineModalVisible = false;
        });
    };

    const cancelOnlineGoods = () => {
      data.onlineModalVisible = false;
    };

    const syncRow = (record) => {
      data.popupOperateObj[record.id] = false;
      data.syncModalVisible = true;
      data.syncRowIds = [record.id];
    };

    const batchSync = () => {
      if (data.selectedRowIds.length === 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.syncModalVisible = true;
      data.syncRowIds = data.selectedRowIds;
    };

    const handleSyncGoods = () => {
      const params = {
        platformStatus: 3,
        listingIds: data.syncRowIds,
      };
      syncGoods(params)
        .then(() => {
          GjMessage.success("同步任务已提交，请稍后查看！");
          getData();
        })
        .catch(() => {
          GjMessage.error("同步任务提交失败，请重试！");
        })
        .finally(() => {
          data.syncModalVisible = false;
        });
    };

    const copyRow = (record) => {
      data.popupOperateObj[record.id] = false;
      // if (record.publishState !== 1 && record.publishState !== 3) {
      //   return GjMessage.warning("当前状态无法操作");
      // }
      const query = {
        productId: record.id,
        platformStatus: 3,
      };
      $router.push({
        path: "/pubShopifyDraft",
        query,
      });
    };

    const deleteRow = (record) => {
      data.popupOperateObj[record.id] = false;
      data.deleteModalVisible = true;
      data.deleteRowIds = [record.id];
    };

    const batchDelete = () => {
      if (data.selectedRowIds.length === 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.deleteRowIds = data.selectedRowIds;
      data.deleteModalVisible = true;
    };

    const deleteRows = () => {
      const params = {
        platformStatus: 3,
        listingIds: data.deleteRowIds,
      };
      deleteOnlineGoods(params)
        .then(() => {
          const len = data.deleteRowIds.length;
          GjMessage.success(`已删除${len}个在线商品！`);
          getData();
        })
        .catch(() => {
          GjMessage.error("删除失败，请重试！");
        })
        .finally(() => {
          data.deleteModalVisible = false;
        });
    };

    const cancelDeleteRows = () => {
      data.deleteModalVisible = false;
    };

    const editRow = (row) => {
      data.actionType = 2;
      data.productId = row.id;
      data.detailVisible = true;
    };

    const detailDialogCancel = () => {
      data.detailVisible = false;
    };

    const detailDialogUpdate = () => {
      data.pageOption.pageCurrent = 1;
      data.detailVisible = false;
      getData();
    };

    const handleBtns = [
      {
        text: "重新上架",
        handler: batchRelisting,
        type: "primary",
      },
      {
        text: "批量同步",
        handler: batchSync,
        type: "plain",
      },
      {
        text: "批量删除",
        handler: batchDelete,
        type: "plain",
      },
    ];

    return {
      ...toRefs(data),
      offlineTimeOption,
      onlineInputOptions,
      tableColumns,
      paginationProps,
      filterChange,
      selectChange,
      getTableCurrent,
      handlerFunction,
      changeFilterSelect,
      changeList,
      normalFilterRef,
      resetHandler,
      commonTableRef,
      sortChange,
      copyRow,
      popupChange,
      handleBtns,
      relistingRow,
      batchRelisting,
      handleRelisting,
      cancelOnlineGoods,
      handleSyncGoods,
      batchDelete,
      syncRow,
      batchSync,
      deleteRow,
      editRow,
      deleteRows,
      cancelDeleteRows,
      detailDialogCancel,
      detailDialogUpdate,
    };
  },
};
</script>

<style lang="scss" scoped>
.common-list-page {
  .btn-group {
    padding: 0 12px;
    height: 48px;
    display: flex;
    align-items: center;
    font-size: 12px;
    p {
      margin-right: 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      color: #00043066;
    }
    button {
      margin-right: 8px;
    }
  }
  svg.template {
    cursor: pointer;
  }
}
.queue-list-btn {
  margin-right: 12px;
}

.complete-txt {
  color: #0045f0;
}
</style>
