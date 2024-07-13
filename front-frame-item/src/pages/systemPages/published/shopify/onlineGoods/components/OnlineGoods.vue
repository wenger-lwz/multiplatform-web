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
        :timeOpt="timeOpt1"
        :titleListOpt="onlineInputOptions"
        :showItem="[
          'shopId',
          'updateState',
          'keyWord',
          'chargePersonId',
          'rangeValue',
        ]"
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
        <template #right>
          <queue-popover
            title="更新队列"
            :platformCode="'SHOPIFY'"
            :businessType="2"
          />
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
      />
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
    title="批量下架"
    :visible="offlineModalVisible"
    :render-to-body="false"
    unmountOnClose
    @ok="handleOfflineGoods"
    @cancel="cancelOfflineGoods"
    >您即将下架{{
      offlineRowIds.length
    }}个在线商品，下架后商品将不能被买家检索查看到，是否继续？</gj-modal
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
  <gj-modal
    title="批量更新"
    :visible="updateModalVisible"
    :render-to-body="false"
    unmountOnClose
    @ok="handleUpdateGoods"
    @cancel="updateModalVisible = false"
    >您即将更新{{
      updateRowIds.length
    }}个在线商品，本地数据更新到平台，是否继续？</gj-modal
  >
  <online-detail
    v-if="detailVisible"
    :productId="productId"
    :platformStatus="1"
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
import QueuePopover from "@/components/QueuePopover.vue";
import columnCopy from "@/components/columnCopy.vue";
import {
  timeOpt1,
  onlineInputOptions,
  variantListColumns,
} from "@pagesSystem/published/shopify/config";
import {
  getOnlineList,
  getOnlineGoodVariant,
  offlineGoods,
  syncGoods,
  updateGoods,
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
    QueuePopover,
    columnCopy,
  },
  setup() {
    const $router = useRouter();
    const GbImage = resolveComponent("GbImage");
    const GjLink = resolveComponent("GjLink");
    const GjBadge = resolveComponent("GjBadge");
    const GjTooltip = resolveComponent("GjTooltip");
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
        sortField: "createTime",
        seq: "DESC",
      },
      searchActive: [],
      loading: false,
      parmasObj: {},
      productId: "",
      actionType: 1,
      offlineModalVisible: false,
      deleteModalVisible: false,
      syncModalVisible: false,
      updateModalVisible: false,
      detailVisible: false,
      offlineRowIds: [],
      deleteRowIds: [],
      syncRowIds: [],
      updateRowIds: [],
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
        customRender: ({ record }) => (
          <GjLink href={record.platformProductUrl} target="_blank">
            {record.platformItemId}
          </GjLink>
        ),
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
        title: "数量",
        dataIndex: "inventoryProductTotalNum",
        width: 100,
        customRender: ({ record }) => (
          <span>{emptyFilter(record.inventoryProductTotalNum)}</span>
        ),
      },
      {
        title: "更新状态",
        dataIndex: "updateState",
        width: 120,
        customRender: ({ record }) => {
          if (record.updateState === 1) {
            return <GjBadge status="processing" text="正常" />;
          } else if (record.updateState === 2) {
            return <GjBadge status="success" text="暂存未更新" />;
          } else {
            return (
              <GjTooltip content="发布失败的原因在这...">
                <span>
                  <GjBadge status="warning" text="更新失败" />
                </span>
              </GjTooltip>
            );
          }
        },
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
        title: "创建时间",
        dataIndex: "createTime",
        width: 180,
        key: "createTime",
        showSorterTooltip: false,
        sorter: true,
        customRender: ({ record }) => (
          <span>{formatDateTime(record.createTime)}</span>
        ),
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
        key: "updateTime",
        showSorterTooltip: false,
        sorter: true,
        width: 180,
        customRender: ({ record }) => (
          <span>{formatDateTime(record.updateTime)}</span>
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
                  <GjButton type="text" onClick={() => offlineGood(record)}>
                    下架
                  </GjButton>
                </p>
                <p>
                  <GjButton type="text" onClick={() => copyRow(record)}>
                    复制
                  </GjButton>
                </p>
                <p>
                  <GjButton type="text" onClick={() => sync(record)}>
                    同步
                  </GjButton>
                </p>
                <p>
                  <GjButton type="text" onClick={() => update(record)}>
                    更新
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
        platformStatus: 1,
        shopIds: filterData.shopId,
        chargePersonIds: filterData.chargePersonId,
        title,
        spu,
        platformItemId,
        storeSku,
        updateTimeStart:
          (filterData.rangeValue && filterData.rangeValue[0]) || "",
        updateTimeEnd:
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
        data.pageOption.sortField = column ? field : "createTime";
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

    const offlineGood = (record) => {
      data.popupOperateObj[record.id] = false;
      data.offlineModalVisible = true;
      data.offlineRowIds = [record.id];
    };

    const batchOfflineGoods = () => {
      if (data.selectedRowIds.length === 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.offlineRowIds = data.selectedRowIds;
      data.offlineModalVisible = true;
    };

    const handleOfflineGoods = () => {
      const option = {
        ids: data.offlineRowIds,
      };
      offlineGoods(option)
        .then(() => {
          GjMessage.success(
            "下架任务已提交，下架后可在“已下架”列表查看或重新上架。"
          );
          getData();
        })
        .finally(() => {
          data.offlineModalVisible = false;
        });
    };

    const cancelOfflineGoods = () => {
      data.offlineModalVisible = false;
    };

    const sync = (record) => {
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
        platformStatus: 1,
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

    const update = (record) => {
      data.popupOperateObj[record.id] = false;
      data.updateModalVisible = true;
      data.updateRowIds = [record.id];
    };

    const batchUpdate = () => {
      if (data.selectedRowIds.length === 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.updateModalVisible = true;
      data.updateRowIds = data.selectedRowIds;
    };

    const handleUpdateGoods = () => {
      const params = {
        listingIds: data.updateRowIds,
      };
      updateGoods(params)
        .then(() => {
          GjMessage.success("更新任务已提交，请稍后查看！");
          getData();
        })
        .catch(() => {
          GjMessage.error("更新任务提交失败，请重试！");
        })
        .finally(() => {
          data.updateModalVisible = false;
        });
    };

    const copyRow = (record) => {
      data.popupOperateObj[record.id] = false;
      // if (record.publishState !== 1 && record.publishState !== 3) {
      //   return GjMessage.warning("当前状态无法操作");
      // }
      const query = {
        productId: record.id,
        platformStatus: 1,
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
        platformStatus: 1,
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
        text: "批量下架",
        handler: batchOfflineGoods,
        type: "primary",
      },
      {
        text: "批量同步",
        handler: batchSync,
        type: "plain",
      },
      {
        text: "批量更新",
        handler: batchUpdate,
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
      timeOpt1,
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
      offlineGood,
      batchOfflineGoods,
      handleOfflineGoods,
      cancelOfflineGoods,
      handleSyncGoods,
      handleUpdateGoods,
      batchDelete,
      batchUpdate,
      sync,
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
