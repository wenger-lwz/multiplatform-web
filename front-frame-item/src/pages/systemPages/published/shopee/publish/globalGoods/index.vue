<template>
  <CommonPage
    currentRouterPermission="Shopee/pubShopeeGlobalGoods/view"
    :pageRest="true"
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
          'specsType',
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
            :content="`您即将同步${hasSelectLen}个在线商品，同步后系统商品Listing为当前平台商品的在线Listing信息，是否继续？`"
            :popup-visible="syncModalVisible"
            @ok="syncFn"
            @cancel="syncModalVisible = false"
          >
            <gj-button
              v-permissions="['Shopee/pubShopeeGlobalGoods/batchSync']"
              type="primary"
              @click="verifyPatchSync"
              >批量同步</gj-button
            >
          </gj-popconfirm>

          <p class="selection-length">
            已选
            <span>{{ hasSelectLen }}</span>
          </p>
        </template>
        <template #right>
          <AppTablePopover
            title="更新队列"
            ref="queueRef"
            class="queue-list-table"
            :reqUntilShow="false"
            :titleSuffix="queueTitleSuffix"
            :record="queueRecord"
            :columns="queueColumns"
            :requestFunction="getQueueInfo"
            :handlerFunction="queueHandlerFunction"
            :paramObj="{ platformCode: 'SHOPEE', businessType: '2' }"
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
        :requestApi="getGlobalListing"
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
        @update-handler="detailDialogUpdate"
        @cancel="detailDialogCancel"
      />

      <gj-modal
        :maskClosable="false"
        :ok-loading="okLoading"
        :visible="releaseVisible"
        :okText="okText"
        :disabled="disabled"
        @cancel="releaseCancel"
        @ok="releaseOk"
        unmountOnClose
      >
        <template #title> {{ releaseTitle }} </template>
        <div>
          <!-- {{ releaseContent }} -->
          <p class="mb5">店铺</p>
          <gj-select
            v-model="shopList"
            @change="shopChange"
            placeholder="请选择"
            allow-clear
            multiple
          >
            <gj-option
              :label="item.shopName"
              :value="item.shopId"
              v-for="(item, index) in shopListOpt"
              :key="item.shopId"
              :disabled="item.shopId == publishedShops[index]"
            ></gj-option>
          </gj-select>
        </div>
      </gj-modal>

      <PublishedDraftDetail
        v-if="draftDetailVisible"
        :pids="onlineIds"
        :requestApi="getGlobalDetail"
        :parmas="{ listingId: onlineIds }"
        :dialogType="actionType"
        :dialogVisible="draftDetailVisible"
        :hideBtn="true"
        @update-table-list="draftDetailDialogUpdate"
        @update-handler="draftDetailDialogUpdate"
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
  onMounted,
} from "vue";
import { GjMessage } from "@gj/atom";
import _ from "lodash";
import CommonPage from "@/components/CommonPage.vue";
import TagGroup from "@/components/TagGroup.vue";
import SelectCondition from "@pagesSystem/published/shopee/components/common/SelectCondition.vue";
import OperateBar from "@/components/OperateBar.vue";
import ListPageTable from "@pagesSystem/published/shopee/components/common/ListPageTable.vue";
import AppTablePopover from "@pagesSystem/published/shopee/components/commodityOnLine/AppTablePopover.vue";
import OnlineDetail from "@pagesSystem/published/shopee/publish/globalGoods/OnlineDetail.vue";
import PublishedDraftDetail from "@pagesSystem/published/shopee/components/publishedDraft/PublishedDraftDetail.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import columnCopy from "@/components/columnCopy.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { emptyFilter, formatDateTime, emptyValue } from "@/utils/format";
import {
  getGlobalListing,
  getListingVariantList,
  onGlobalSync,
  listingBatchPush,
  listingDown,
  getGlobalDetail,
  onGlobalpublish,
  getPublishItem,
  getPublishShop,
} from "@/api/published/shopee";
import { getQueueInfo } from "@/api/public";

import {
  specificationList,
  variantListColumns,
  timeOpt2,
  titleListOpt2,
  useChangeList,
} from "../../config";

export default defineComponent({
  name: "PubShopeeGlobalGoods",
  components: {
    CommonPage,
    TagGroup,
    SelectCondition,
    OperateBar,
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
      releaseTitle: "",
      releaseVisible: false,
      releaseContent: "",
      releaseCurrentRow: null,
      shopList: "",
      shopListOpt: [],
      okText: "立即发布",
      shopValList: [],
      disabled: true,
      okLoading: false,
      publishedShops: [],
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

    const sitesColumns = [
      {
        title: "标题",
        dataIndex: "defaultTitle",
        minWidth: 150,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.defaultTitle)}</GbText>
        ),
      },
      {
        title: "店铺",
        dataIndex: "shop_name",
        minWidth: 150,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.shop_name)}</GbText>
        ),
      },
      {
        title: "是否成功",
        dataIndex: "publish_status",
        minWidth: 100,
        customRender: ({ record }) => (
          <GbText>
            <p
              class={
                record.publish_status == "success"
                  ? "status_success"
                  : "status_fail"
              }
            >
              {emptyFilter(
                record.publish_status == "success" ? "成功" : "失败"
              )}
            </p>
          </GbText>
        ),
      },
      {
        title: "已发布店铺itemID",
        dataIndex: "item_id",
        minWidth: 180,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.item_id)}</GbText>
        ),
      },
      {
        title: "售价",
        dataIndex: "price",
        minWidth: 100,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.price)}</GbText>
        ),
      },
      {
        title: "责任人",
        dataIndex: "chargePersonName",
        minWidth: 150,
        customRender: ({ record }) => (
          <div>
            <p>发布人</p>
            {emptyFilter(record.chargePersonName)}
          </div>
        ),
      },
      {
        title: "时间",
        dataIndex: "price",
        minWidth: 150,
        customRender: ({ record }) => (
          <div>
            <p>发布时间</p>
            {formatDateTime(record.publishTime)}
          </div>
        ),
      },
      {
        title: "操作",
        dataIndex: "action",
        minWidth: 10,
        customRender: ({ record }) => (
          <div>
            {record.publish_status == "success" ? (
              <gj-button
                click={onEditOnline(record.item_id)}
                class="edit-online"
              >
                修改在线
              </gj-button>
            ) : (
              <gj-button
                click={onRepublish(record.item_id, record.shop_id)}
                class="edit-online"
              >
                重新发布
              </gj-button>
            )}
          </div>
        ),
      },
    ];

    const getBtnList = () => {
      return [
        {
          label: "编辑",
          outside: true,
          permission: ["Shopee/pubShopeeGlobalGoods/edit"],
          click: (row) => {
            data.onlineIds = row.id;
            data.actionType = 2;
            data.detailVisible = true;
            // data.detailHasTemp = true;
            data.detailHasTemp =
              row.updateStatus === 2 || row.updateStatus === 3;
          },
        },
        {
          label: "发布",
          permission: ["Shopee/pubShopeeGlobalGoods/releaseRow"],
          isPopConfirm: false,
          /* tooltipContent:
            '您即将下架1个在线商品，下架后商品将不能被买家检索查看到，是否继续？', */
          click: (row) => {
            releaseRow([row]);
          },
        },
        {
          label: "复制",
          permission: ["Shopee/pubShopeeGlobalGoods/copy"],
          isPopConfirm: false,
          click: (row) => {
            data.onlineIds = row.id;
            data.actionType = 1;
            data.draftDetailVisible = true;
          },
        },
        {
          label: "同步",
          permission: ["Shopee/pubShopeeGlobalGoods/sync"],
          isPopConfirm: false,
          click: (row) => {
            syncFn([row.id]);
          },
        },
        {
          label: "更新",
          permission: ["Shopee/pubShopeeGlobalGoods/update"],
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
          const elem = record.salePrice ? <i>促</i> : null;
          return (
            <div class="salePrice-image-box">
              {elem}
              <GbImage
                src={record.mainImage}
                popover-src={record.mainImage}
                size="36"
              ></GbImage>
            </div>
          );
        },
      },
      {
        key: "defaultTitle",
        dataIndex: "defaultTitle",
        title: "标题",
        minWidth: 150,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.defaultTitle)}</GbText>;
        },
      },
      {
        key: "itemId",
        dataIndex: "itemId",
        title: "itemId",
        minWidth: 100,
        customRender: ({ record }) => {
          return (
            <div>
              <columnCopy
                isAnchor={record.itemUrl ? true : false}
                textValue={record.itemId}
                openUrl={record.itemUrl}
              />
            </div>
          );
        },
      },
      {
        key: "spu",
        dataIndex: "spu",
        title: "SPU/SKU",
        minWidth: 150,
        customRender: ({ record }) => {
          if (record.spu) {
            return <columnCopy isAnchor={false} textValue={record.spu} />;
          } else {
            return <span>{emptyValue}</span>;
          }
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
        key: "shopName",
        dataIndex: "shopName",
        title: "店铺",
        minWidth: 100,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.shopName)}</GbText>;
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
        key: "platformCtegoryId",
        dataIndex: "platformCtegoryId",
        title: "Shopee分类",
        minWidth: 150,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.platformCtegoryId)}</GbText>;
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
        key: "publishSites",
        dataIndex: "publishSites",
        title: "发布到站点",
        minWidth: 150,
        customRender: ({ record }) => {
          if (record.publishSites || record.publishSites === 0) {
            return (
              <AppTablePopover
                class="sites-table"
                title="发布到站点"
                record={record.publishSites}
                columns={sitesColumns}
                requestFunction={getPublishItem}
                handlerFunction={publicSitesFn}
                hasPagination={false}
                paramObj={{ productId: record.itemId }}
              />
            );
          } else {
            return <span>{emptyFilter(record.publishSites)}</span>;
          }
        },
      },
      {
        key: "updateStatus",
        dataIndex: "updateStatus",
        title: "更新状态",
        minWidth: 100,
        customRender: ({ record }) => {
          if (record.updateStatus === 1) {
            return <GjBadge status="success" text="正常" />;
          } else if (record.updateStatus === 2) {
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
          } else if (record.updateStatus === 3) {
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
        id: "",
        chargePersonIds: filterData.chargePersonId.join(","),
        shopIds: filterData.shopId,
        sites: filterData.siteId.join(","),
        specsType: filterData.specsType,
        updateStatus: filterData.statusId,
        platformStatus: "1",
        productType: "1",
        [keyMap[filterData.keyWordType]]: filterData.keyWord,
        // timeType: filterData.timeType === '1' ? 'createTime' : 'updateTime',
        timeType: filterData.timeType,
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
      console.log("123456");
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
      listingDown({ ids: ids })
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
      onGlobalSync({
        ids: ids,
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
        ids: ids,
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

    // 批量发布- 确定
    const releaseOk = () => {
      console.log(
        data.releaseCurrentRow,
        "data.releaseCurrentRow",
        data.shopList,
        data.shopList.length
      );
      if (data.shopList.length == 0) {
        return false;
      }
      if (data.releaseCurrentRow) {
        const ids = data.shopList.map((item) => item);
        console.log(ids, "ids");
        ids.forEach((id) => {
          data.loadingMap[id] = true;
        });
        onGlobalpublish({
          onlineId: data.releaseCurrentRow,
          ids: ids,
        })
          .then((rsp) => {
            if (rsp.code === 200) {
              GjMessage.success(`发布任务已提交！</br>
发布成功的店铺商品将在“在线商品-在线”中显示；</br>
发布失败的店铺商品可在“全球商品”进行编辑重新发布。`);
            }
            // 开启轮询
            pageTableRef.value?.getTableData(null, true);
          })
          .catch(() => {
            ids.forEach((id) => {
              data.loadingMap[id] = false;
            });
          });
      }
      data.releaseVisible = false;
    };

    // 批量发布- 取消
    const releaseCancel = () => {
      data.shopList = [];
      data.releaseVisible = false;
    };

    // 单个发布
    const releaseRow = async (record) => {
      // data.popupOperateObj[record.id] = false;
      /* if (record.publishState !== 1 && record.publishState !== 3) {
        return GjMessage.warning('当前状态无法操作');
      } */
      // 完整度校验
      /* if (!record.completeInfo || record.completeInfo.complete !== '7/7') {
        return GjMessage.warning('所选刊登草稿存在信息不完整的草稿');
      } */
      data.releaseTitle = "选择要发布的店铺";
      data.releaseContent = "您即将发布1条全球商品，是否继续？";
      data.releaseVisible = true;
      data.releaseCurrentRow = record[0]?.id;
      data.publishedShops = record[0]?.publishedShops
        ? record[0]?.publishedShops
        : [];
      console.log(data.publishedShops, "record.publishedShops");
      await getListingShopReq(record[0]?.id);
    };

    const getListingShopReq = (val) => {
      getPublishShop({ productId: val }).then((res) => {
        data.shopListOpt = res.data;
      });
    };

    const shopChange = (val) => {
      data.shopList = val;
    };

    const publicSitesFn = (res) => {
      const list = res.data || [];
      const result = [];
      let itemObj = null;
      list.forEach((item) => {
        itemObj = { ...item, id: item.id || Date.now() };
        result.push(itemObj);
      });
      return { total: result.length, tableData: result };
    };

    const onEditOnline = () => {
      console.log();
    };

    const onRepublish = (item_id, shop_id) => {
      onGlobalpublish({
        onlineId: item_id,
        ids: [shop_id],
      }).then((rsp) => {
        if (rsp.code === 200) {
          GjMessage.success(`发布任务已提交！<br>
发布成功的店铺商品将在“在线商品-在线”中显示；<br>
发布失败的店铺商品可在“全球商品”进行编辑重新发布。`);
        }
        // 开启轮询
        pageTableRef.value?.getTableData(null, true);
      });
    };

    onMounted(() => {
      // getListingShopReq();
    });

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
      getGlobalListing,
      getGlobalDetail,
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
      releaseRow,
      releaseCancel,
      releaseOk,
      getListingShopReq,
      shopChange,
      publicSitesFn,
      sitesColumns,
      onEditOnline,
      onRepublish,
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
  margin-left: 4px;
  color: #000430;
  font-size: 12px;
  font-weight: 400;
  span {
    color: #0045f0;
  }
}
.gray-border {
  color: #4e5969;
  border-color: #e6e6ed;
  background-color: #fff;
}
.mb5 {
  margin-bottom: 5px;
}
/deep/.sites-table .surely-table-body .status_success {
  color: #2da641;
}
/deep/.sites-table .surely-table-body .status_fail {
  color: #ff5c5c;
}
</style>
<style lang="scss">
.edit-online {
  color: #0045f0;
}
.status_success {
  color: #2da641;
}
.status_fail {
  color: #ff5c5c;
}
</style>
