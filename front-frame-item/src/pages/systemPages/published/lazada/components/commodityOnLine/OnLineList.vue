<template>
  <CommonPage
    :pageRest="true"
    currentRouterPermission="LZD/commodityOnLine/online/view"
    @common-page-rest="resetHandler"
  >
    <template #tag-content>
      <TagGroup v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #filter-content>
      <SelectCondition
        ref="normalFilterRef"
        :timeOpt="timeOpt2"
        :titleListOpt="titleListOpt2"
        :showItem="[
          'shopId',
          'siteId',
          'statusId',
          'keyWord',
          'chargePersonId',
          'rangeValue',
        ]"
        @filter-change="filterChange"
        @tag-change="changeList"
      />
    </template>
    <template #operate_bar-content>
      <OperateBar>
        <template #left>
          <gj-popconfirm
            position="bl"
            :content="`您即将下架${hasSelectLen}个在线商品，下架后商品将不能被买家检索查看到，是否继续？`"
            :popup-visible="listDownModalVisible"
            @ok="listDownFn"
            @cancel="listDownModalVisible = false"
          >
            <gj-button
              type="plain"
              v-permissions="['LZD/commodityOnLine/online/patchSelfOff']"
              @click="verifyPatchListDown"
              >批量下架</gj-button
            >
          </gj-popconfirm>

          <gj-popconfirm
            position="bl"
            :content="`您即将同步${hasSelectLen}个在线商品，同步后系统商品Listing为当前平台商品的在线Listing信息，是否继续？`"
            :popup-visible="syncModalVisible"
            @ok="syncFn"
            @cancel="syncModalVisible = false"
          >
            <gj-button
              type="plain"
              v-permissions="['LZD/commodityOnLine/online/patchSync']"
              @click="verifyPatchSync"
              >批量同步</gj-button
            >
          </gj-popconfirm>

          <gj-popconfirm
            position="bl"
            :content="`您即将更新${hasSelectLen}个在线商品，本地数据更新到平台，是否继续？`"
            :popup-visible="updateModalVisible"
            @ok="updateFn"
            @cancel="updateModalVisible = false"
          >
            <gj-button
              type="plain"
              v-permissions="['LZD/commodityOnLine/online/patchUpdate']"
              @click="verifyPatchUpdate"
              >批量更新</gj-button
            >
          </gj-popconfirm>

          <p class="selection-length">
            已选
            <span>{{ hasSelectLen }}</span>
          </p>
        </template>
        <template #right>
          <AppTablePopover
            style="width: 600px"
            title="更新队列"
            ref="queueRef"
            class="queue-list-table"
            :reqUntilShow="false"
            :titleSuffix="queueTitleSuffix"
            :record="queueRecord"
            :columns="queueColumns"
            :requestFunction="getQueueInfo"
            :handlerFunction="queueHandlerFunction"
            :paramObj="{ platformCode: 'LAZADA', businessType: '2' }"
          >
            <span class="queue-list-btn">{{ queueRecord }}</span>
          </AppTablePopover>
        </template>
      </OperateBar>
    </template>
    <template #table-content>
      <ListPageTable
        ref="pageTableRef"
        pageKey="-tabs"
        :colunms="tableColumns"
        :requestApi="getListing"
        v-model:selectRow="selectRow"
        @table-data-change="tableDataChange"
      ></ListPageTable>
      <OnlineDetail
        v-if="detailVisible"
        :detailHasTemp="detailHasTemp"
        :pids="onlineIds"
        :dialogType="actionType"
        :dialogVisible="detailVisible"
        @update-table-list="detailDialogUpdate"
        @cancel="detailDialogCancel"
      />

      <PublishedDraftDetail
        v-if="draftDetailVisible"
        :pids="onlineIds"
        :requestApi="getListingDetail"
        :parmas="{ listingId: onlineIds }"
        :dialogType="actionType"
        :dialogVisible="draftDetailVisible"
        @update-table-list="draftDetailDialogUpdate"
        @cancel="draftDetailVisible = false"
      />
    </template>
  </CommonPage>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  computed,
  resolveComponent,
  watch,
} from "vue";
import { GjMessage } from "@gj/atom";
import _ from "lodash";
import CommonPage from "@/components/CommonPage.vue";
import TagGroup from "@/components/TagGroup.vue";
import OperateBar from "@/components/OperateBar.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import columnCopy from "@/components/columnCopy.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import SelectCondition from "@pagesSystem/published/lazada/components/common/SelectCondition.vue";
import ListPageTable from "@pagesSystem/published/lazada/components/common/ListPageTable.vue";
import AppTablePopover from "@/components/AppTablePopover.vue";
import OnlineDetail from "@pagesSystem/published/lazada/components/commodityOnLine/OnlineDetail.vue";
import PublishedDraftDetail from "@pagesSystem/published/lazada/components/publishedDraft/PublishedDraftDetail.vue";
import { emptyFilter, formatDateTime, emptyValue } from "@/utils/format";
import {
  getListing,
  getListingVariantList,
  listingPull,
  listingBatchPush,
  listingDown,
  getListingDetail,
} from "@/api/published/lazada";
import { getQueueInfo } from "@/api/public";
import { useChangeList } from "@pagesSystem/published/lazada/hooks";
import {
  specificationList,
  variantListColumns,
  timeOpt2,
  titleListOpt2,
} from "../../config";

export default defineComponent({
  name: "OnLineList",
  components: {
    CommonPage,
    TagGroup,
    OperateBar,
    SelectCondition,
    ListPageTable,
    AppTablePopover,
    OnlineDetail,
    PublishedDraftDetail,
    /* eslint-disable */
    SvgIcon,
    columnCopy,
    OpbtnGroup,
    /* eslint-enable */
  },
  setup() {
    const data = reactive({
      searchActive: [],
      selectRow: [],
      variantListColumns: variantListColumns,
      loadingMap: {},
      detailVisible: false,
      draftDetailVisible: false,
      onlineIds: "",
      actionType: "",
      listDownModalVisible: false,
      syncModalVisible: false,
      updateModalVisible: false,
      detailHasTemp: false,
    });

    // 计时器指针
    let tableTimer = null;
    let counter = 0;
    let timce = 0;
    const clearTableTimer = () => {
      clearInterval(tableTimer);
      counter = 0;
      tableTimer = null;
    };

    const beginTableTimer = () => {
      clearTableTimer();
      // 时间间隔，目前先写10s
      const timeGap = 10;
      tableTimer = setInterval(() => {
        counter++;
        if (counter % timeGap === 0) {
          timce++;
          //10*10s内还未完成发布,终止请求数据
          if (timce > 10) {
            timce = 0;
            return clearTableTimer();
          }
          pageTableRef.value?.getTableData(null, true, true);
        }
      }, 1000);
    };

    const GbImage = resolveComponent("GbImage");
    const GjSpace = resolveComponent("GjSpace");
    const GjSpin = resolveComponent("GjSpin");
    const GbText = resolveComponent("GbText");
    const GjBadge = resolveComponent("GjBadge");
    const GjTooltip = resolveComponent("GjTooltip");
    const GjTag = resolveComponent("GjTag");

    /**
     * 更新隊列
     */
    const queueRef = ref();
    const queueTitleSuffix = ref("");
    const queueRecord = ref("更新队列");
    const normalFilterRef = ref();
    const pageTableRef = ref();
    const queueColumns = [
      {
        title: "标题",
        dataIndex: "title",
        width: 140,
      },
      {
        title: "SKU",
        dataIndex: "sku",
        width: 140,
      },
      {
        title: "操作时间",
        dataIndex: "updatedTime",
        width: 140,
      },
      {
        title: "",
        dataIndex: "status",
        width: 20,
        customRender: ({ record }) => {
          if (record.status === 1) {
            return <SvgIcon svgClass="circleBar" width={16}></SvgIcon>;
          } else if (record.status === 2) {
            return <SvgIcon svgClass="successIcon" width={16}></SvgIcon>;
          } else if (record.status === 3) {
            return <SvgIcon svgClass="warning" width={16}></SvgIcon>;
          }
        },
      },
    ];

    const getBtnList = () => {
      return [
        {
          label: "编辑",
          outside: true,
          permission: ["LZD/commodityOnLine/online/edit"],
          click: (row) => {
            data.onlineIds = row.id;
            data.actionType = 2;
            data.detailVisible = true;
            data.detailHasTemp = row.updateState === 2 || row.updateState === 3;
          },
        },
        {
          label: "下架",
          permission: ["LZD/commodityOnLine/online/selfOff"],
          isPopConfirm: true,
          tooltipContent:
            "您即将下架1个在线商品，下架后商品将不能被买家检索查看到，是否继续？",
          click: (row) => {
            listDownFn([row.id]);
          },
        },
        {
          label: "复制",
          permission: ["LZD/commodityOnLine/online/copy"],
          isPopConfirm: false,
          click: (row) => {
            data.onlineIds = row.id;
            data.actionType = 1;
            data.draftDetailVisible = true;
          },
        },
        {
          label: "同步",
          permission: ["LZD/commodityOnLine/online/sync"],
          isPopConfirm: false,
          click: (row) => {
            syncFn([row.id]);
          },
        },
        {
          label: "更新",
          permission: ["LZD/commodityOnLine/online/update"],
          isPopConfirm: false,
          click: (row) => {
            updateFn([row.id]);
          },
        },
      ];
    };

    const tableColumns = [
      {
        key: "imgs",
        dataIndex: "imgs",
        title: "图片",
        minWidth: 80,
        fixed: "left",
        customRender: ({ record }) => {
          return (
            <GbImage
              src={record.mainImage}
              popover-src={record.mainImage}
              size="36"
            ></GbImage>
          );
        },
      },
      {
        fixed: "left",
        title: "标题/SPU/SKU",
        key: "spu",
        dataIndex: "spu",
        width: 150,
        autoHeight: true,
        customRender: ({ record }) => {
          const copyNode = record.spu ? (
            <columnCopy isAnchor={false} textValue={record.spu} />
          ) : (
            <span>{emptyValue}</span>
          );
          const elem = record.salePrice ? (
            <GjTag
              size="small"
              color="#FF5C5C"
              style="background-color: #FFE7E7;color:#FF5C5C"
            >
              促
            </GjTag>
          ) : null;
          const isCrossBorder = record.global ? (
            <GjTag
              size="small"
              color="#EE7C30"
              style="background-color: #FDF2EA;color:#EE7C30"
            >
              跨境
            </GjTag>
          ) : null;
          return (
            <div>
              <GbText>{emptyFilter(record.defaultTitle)}</GbText>
              <div>{copyNode}</div>
              <div class="salePrice-tag-box">
                {elem} {isCrossBorder}
              </div>
            </div>
          );
        },
      },
      {
        key: "platformItemId",
        dataIndex: "platformItemId",
        title: "商品ID",
        minWidth: 100,
        customRender: ({ record }) => {
          return (
            <div>
              {record.platformItemId ? (
                <columnCopy
                  isAnchor={record.lazadaUrl ? true : false}
                  textValue={record.platformItemId}
                  openUrl={record.lazadaUrl}
                />
              ) : (
                <span>{emptyValue}</span>
              )}
            </div>
          );
        },
      },
      {
        key: "shopName",
        dataIndex: "shopName",
        title: "店铺",
        minWidth: 100,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.shopName)}</GbText>;
        },
      },
      {
        key: "siteCode",
        dataIndex: "siteCode",
        title: "站点",
        minWidth: 100,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.siteName)}</GbText>;
        },
      },
      {
        key: "msku",
        dataIndex: "msku",
        title: "店铺SKU",
        minWidth: 150,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.msku)}</GbText>;
        },
      },
      {
        key: "platformCategoryName",
        dataIndex: "platformCategoryName",
        title: "Lazada分类",
        minWidth: 150,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.platformCategoryName)}</GbText>;
        },
      },
      {
        key: "specsType",
        dataIndex: "specsType",
        title: "规格",
        minWidth: 100,
        customRender: ({ record }) => {
          if (record.specsType === 2) {
            return (
              <AppTablePopover
                position="br"
                title="变体信息"
                record="变体"
                columns={data.variantListColumns}
                requestFunction={getListingVariantList}
                handlerFunction={handlerFunction}
                paramObj={{ listingId: record.id }}
              />
            );
          } else {
            const item = specificationList.find(
              (it) => it.code == record.specsType
            );
            return <span>{emptyFilter(item?.productName)}</span>;
          }
        },
      },
      {
        key: "price",
        dataIndex: "price",
        title: "售价",
        minWidth: 160,
        customRender: ({ record }) => {
          return (
            <GbText>
              {record.recommendPriceUnit ? record.recommendPriceUnit + ":" : ""}
              &nbsp;
              {emptyFilter(record?.recommendPrice)}
            </GbText>
          );
        },
      },
      {
        key: "quantity",
        dataIndex: "quantity",
        title: "数量",
        minWidth: 100,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.quantity)}</GbText>;
        },
      },
      {
        key: "updateState",
        dataIndex: "updateState",
        title: "更新状态",
        minWidth: 100,
        customRender: ({ record }) => {
          if (record.updateState === 1) {
            return <GjBadge status="success" text="正常" />;
          } else if (record.updateState === 2) {
            return record.failReason ? (
              <GjTooltip content={record.failReason}>
                <span>
                  <GjBadge status="warning" text="更新失败" />
                </span>
              </GjTooltip>
            ) : (
              <span>
                <GjBadge status="warning" text="更新失败" />
              </span>
            );
          } else if (record.updateState === 3) {
            return <GjBadge status="processing" text="暂存未更新" />;
          } else {
            return <span>{emptyValue}</span>;
          }
        },
      },
      {
        key: "chargePersonName",
        dataIndex: "chargePersonName",
        title: "负责人",
        minWidth: 100,
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.chargePersonName)}</span>;
        },
      },
      {
        key: "createTime",
        dataIndex: "createTime",
        showSorterTooltip: false,
        sorter: true,
        title: "创建时间",
        minWidth: 160,
        customRender: ({ record }) => {
          return <span>{formatDateTime(record.createTime)}</span>;
        },
      },
      {
        key: "updateTime",
        dataIndex: "updateTime",
        showSorterTooltip: false,
        sorter: true,
        title: "更新时间",
        minWidth: 160,
        customRender: ({ record }) => {
          return <span>{formatDateTime(record.updateTime)}</span>;
        },
      },
      {
        key: "operation",
        dataIndex: "operation",
        title: "操作",
        minWidth: 130,
        fixed: "right",
        customRender: ({ record }) => {
          return (
            <div>
              {data.loadingMap[record.id] ? (
                <GjSpace size="large">
                  <GjSpin />
                </GjSpace>
              ) : (
                <OpbtnGroup btn-list={getBtnList()} row={record}></OpbtnGroup>
              )}
            </div>
          );
        },
      },
    ];
    const hasSelectLen = computed(() => {
      return data.selectRow.length;
    });

    const handlerFunction = (res) => {
      const list = res.data || [];
      const result = [];
      let itemObj = null;
      let dkrColumns = [];
      let recommendPriceUnit = "";
      list.forEach((item, index) => {
        recommendPriceUnit = recommendPriceUnit || item.recommendPriceUnit;
        itemObj = { ...item, id: item.id || index };
        item.skuAttr?.forEach((it) => {
          itemObj[it.attrName] = it.attrValue;
        });
        result.push(itemObj);
      });
      dkrColumns = list
        .map((item) => item.skuAttr?.map((it) => it.attrName))
        .flat(1);
      dkrColumns = [...new Set(dkrColumns)];
      dkrColumns = dkrColumns.map((item) => ({
        title: item,
        dataIndex: item,
        minWidth: 120,
      }));
      dkrColumns = dkrColumns.concat(
        variantListColumns.map((item) => ({
          ...item,
          title:
            item.showRecommendPriceUnit && recommendPriceUnit
              ? `${item.title}(${recommendPriceUnit})`
              : item.title,
        }))
      );
      data.variantListColumns = [...dkrColumns];

      return { total: result.length, tableData: result };
    };

    const getData = (filterData) => {
      const keyMap = {
        1: "title",
        2: "itemId",
        3: "sku",
        4: "msku",
      };
      const parmasObj = {
        chargePerson: filterData.chargePersonId,
        shopId: filterData.shopId,
        siteCode: filterData.siteId,
        updateState: filterData.statusId,
        platformState: "1",
        [keyMap[filterData.keyWordType]]: filterData.keyWord,
        timeType: filterData.timeType === "1" ? "createTime" : "updateTime",
        startTime: filterData.rangeValue?.[0] || "",
        endTime: filterData.rangeValue?.[1] || "",
      };
      pageTableRef.value?.getTableData(parmasObj, true);
    };
    const filterChange = _.debounce(getData, 200);

    /**
     * tag
     */
    const resetHandler = () => {
      data.loadingMap = {};
      data.detailVisible = false;
      data.draftDetailVisible = false;
      data.listDownModalVisible = false;
      data.syncModalVisible = false;
      data.updateModalVisible = false;
      data.detailHasTemp = false;
      pageTableRef.value?.resetTableField();
      normalFilterRef.value?.resetHandler();
      queueRef.value?.resetHandler();
    };
    const changeFilterSelect = (id) => {
      normalFilterRef.value?.changeFilterCondition(id);
    };

    /**
     * select
     */
    const changeList = (target) => {
      data.searchActive = useChangeList(target, data.searchActive);
    };

    const queueHandlerFunction = (res) => {
      const list = res.data ?? [];
      const statsIngNum = list.filter((item) => item.status === 1)?.length || 0;
      const statsFailNum =
        list.filter((item) => item.status === 3)?.length || 0;
      queueTitleSuffix.value = `（上传中${statsIngNum} 失败${statsFailNum}）`;
      queueRecord.value = "更新队列" + `${statsIngNum}/${list.length}`;
      const result = list.map((item, index) => ({
        ...item,
        id: item.id || index,
      }));
      return { total: result.length, tableData: result };
    };

    const detailDialogUpdate = () => {
      pageTableRef.value?.getTableData(null, true);
      data.detailVisible = false;
    };

    const draftDetailDialogUpdate = () => {
      pageTableRef.value?.getTableData(null, true);
      data.draftDetailVisible = false;
    };

    const detailDialogCancel = () => {
      data.detailVisible = false;
    };

    const onRecalculateWh = () => {
      const fn = pageTableRef.value?.commonTableRef?.calculateWH;
      fn && fn();
    };

    watch(
      () => data.searchActive.length,
      () => {
        onRecalculateWh();
      }
    );

    const verifyPatchListDown = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      for (let i = 0; i < data.selectRow.length; i++) {
        if (data.loadingMap[data.selectRow[i].id]) {
          return GjMessage.warning("所选商品暂时不可下架，请稍后再试！");
        }
      }
      data.listDownModalVisible = true;
    };

    const listDownFn = (id) => {
      const ids = id || data.selectRow.map((item) => item.id);
      listingDown({ listingIds: ids })
        .then(() => {
          GjMessage.success(
            "下架任务已提交，下架后可在“已下架”列表查看或重新上架。"
          );
          pageTableRef.value?.getTableData(null, true);
        })
        // .catch(() => {
        //   GjMessage.error("下架任务提交失败，若要下架请重新操作！")
        // })
        .finally(() => {
          data.listDownModalVisible = false;
        });
    };

    const verifyPatchSync = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      for (let i = 0; i < data.selectRow.length; i++) {
        if (data.loadingMap[data.selectRow[i].id]) {
          return GjMessage.warning("所选商品暂时不可同步，请稍后再试！");
        }
      }
      data.syncModalVisible = true;
    };

    const syncFn = (id) => {
      const ids = id || data.selectRow.map((item) => item.id);
      listingPull({
        listingIds: ids,
      })
        .then(() => {
          GjMessage.success("同步任务已提交，请稍后查看！");
          pageTableRef.value?.getTableData(null, true);
        })
        // .catch(() => {
        //   GjMessage.error("同步任务提交失败，请重试！")
        // })
        .finally(() => {
          data.syncModalVisible = false;
        });
    };

    const verifyPatchUpdate = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      for (let i = 0; i < data.selectRow.length; i++) {
        if (data.loadingMap[data.selectRow[i].id]) {
          return GjMessage.warning("所选商品暂时不可更新，请稍后再试！");
        }
      }
      data.updateModalVisible = true;
    };

    const updateFn = (id) => {
      const ids = id || data.selectRow.map((item) => item.id);
      ids.forEach((item) => {
        data.loadingMap[item] = true;
      });
      listingBatchPush({
        listingIds: ids,
      })
        .then(() => {
          GjMessage.success("更新任务已提交，请稍后查看！");
          // 开启轮询
          timce = 0;
          beginTableTimer();
        })
        .catch(() => {
          // GjMessage.error("更新任务提交失败，请重试！");
          ids.forEach((item) => {
            data.loadingMap[item] = false;
          });
        })
        .finally(() => {
          data.updateModalVisible = false;
        });
    };

    const tableDataChange = (list) => {
      const loadingList = list.filter((item) => item.processStatus === 2);
      if (loadingList.length <= 0) {
        clearTableTimer();
        data.loadingMap = {};
      } else {
        data.loadingMap = {};
        loadingList.forEach((item) => {
          data.loadingMap[item.id] = true;
        });
        if (!tableTimer) {
          beginTableTimer();
        }
      }
    };

    return {
      ...toRefs(data),
      getQueueInfo,
      getListingVariantList,
      timeOpt2,
      queueRef,
      queueTitleSuffix,
      queueRecord,
      queueColumns,
      tableColumns,
      hasSelectLen,
      titleListOpt2,
      normalFilterRef,
      pageTableRef,
      resetHandler,
      changeFilterSelect,
      filterChange,
      changeList,
      getListing,
      getListingDetail,
      queueHandlerFunction,
      detailDialogUpdate,
      draftDetailDialogUpdate,
      detailDialogCancel,
      verifyPatchListDown,
      listDownFn,
      verifyPatchSync,
      syncFn,
      verifyPatchUpdate,
      updateFn,
      tableDataChange,
    };
  },
});
</script>

<style scoped lang="scss">
:deep(.item-id) {
  color: #0045f0;
  cursor: pointer;
}
.queue-list-btn {
  /* 苹方12 */
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  /* 蓝黑60% */
  color: rgba(0, 4, 48, 0.6);
  padding: 4px 8px;
  &:hover {
    /* 蓝黑10%等价 */
    background: #e6e6ed;
    border-radius: 16px;
  }
}
// 已选
.selection-length {
  color: #86909c;
  font-size: 12px;
  font-weight: 400;
  span {
    color: #0045f0;
  }
}
</style>
