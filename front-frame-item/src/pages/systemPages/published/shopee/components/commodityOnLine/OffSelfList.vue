<template>
  <CommonPage
    currentRouterPermission="Shopee/pubShopeeOnLineGoods/offline/view"
    :pageRest="true"
    @common-page-rest="resetHandler"
  >
    <template #tag-content>
      <TagGroup v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #filter-content>
      <SelectCondition
        ref="normalFilterRef"
        :timeOpt="timeOpt3"
        :titleListOpt="titleListOpt2"
        :showItem="[
          'shopId',
          'siteId',
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
            :content="`即将上架${hasSelectLen}条商品，是否继续？`"
            :popup-visible="onSelfModalVisible"
            @ok="onSelfFn"
            @cancel="onSelfModalVisible = false"
          >
            <gj-button
              v-permissions="['Shopee/pubShopeeOnLineGoods/offline/batchOn']"
              shape="round"
              type="primary"
              class="gray-border"
              @click="verifyPatchOnSelf"
              >重新上架</gj-button
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
              v-permissions="['Shopee/pubShopeeOnLineGoods/offline/batchSync']"
              shape="round"
              type="primary"
              class="gray-border"
              @click="verifyPatchSync"
              >批量同步</gj-button
            >
          </gj-popconfirm>

          <p class="selection-length">
            已选
            <span>{{ hasSelectLen }}</span>
          </p>
        </template>
      </OperateBar>
    </template>
    <template #table-content>
      <ListPageTable
        ref="pageTableRef"
        pageKey="-tabs"
        :colunms="tableColumns"
        v-model:selectRow="selectRow"
        :requestApi="getListing"
      ></ListPageTable>

      <OnlineDetail
        v-if="detailVisible"
        :pids="onlineIds"
        :dialogType="actionType"
        :dialogVisible="detailVisible"
        :isTabType="true"
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
} from "vue";
import { GjMessage } from "@gj/atom";
import _ from "lodash";
import CommonPage from "@/components/CommonPage.vue";
import TagGroup from "@/components/TagGroup.vue";

import SelectCondition from "@pagesSystem/published/shopee/components/common/SelectCondition.vue";
import OperateBar from "@/components/OperateBar.vue";
import ListPageTable from "@pagesSystem/published/shopee/components/common/ListPageTable.vue";
import AppTablePopover from "@pagesSystem/published/shopee/components/AppTablePopover.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import columnCopy from "@/components/columnCopy.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import OnlineDetail from "@pagesSystem/published/shopee/components/commodityOnLine/OnlineDetail.vue";
import PublishedDraftDetail from "@pagesSystem/published/shopee/components/publishedDraft/PublishedDraftDetail.vue";
import { emptyFilter, formatDateTime, emptyValue } from "@/utils/format";
import {
  getListing,
  getListingVariantList,
  listingOnSelf,
  listingPull,
  getListingDetail,
} from "@/api/published/shopee";
import {
  timeOpt3,
  titleListOpt2,
  useChangeList,
  specificationList,
  variantListColumns,
} from "../../config";

export default defineComponent({
  name: "OffSelfList",
  components: {
    CommonPage,
    TagGroup,
    SelectCondition,
    OperateBar,
    ListPageTable,
    /* eslint-disable */
    AppTablePopover,
    SvgIcon,
    columnCopy,
    OpbtnGroup,
    /* eslint-enable */
    OnlineDetail,
    PublishedDraftDetail,
  },
  setup() {
    const data = reactive({
      searchActive: [],
      selectRow: [],
      variantListColumns: variantListColumns,
      detailVisible: false,
      draftDetailVisible: false,
      onlineIds: "",
      actionType: "",
      onSelfModalVisible: false,
      syncModalVisible: false,
    });

    const GbImage = resolveComponent("GbImage");
    const GbText = resolveComponent("GbText");

    const normalFilterRef = ref();
    const pageTableRef = ref();
    const hasSelectLen = computed(() => {
      return data.selectRow.length;
    });

    const getBtnList = () => {
      return [
        {
          label: "编辑",
          outside: true,
          permission: ["Shopee/pubShopeeOnLineGoods/offline/edit"],
          click: (row) => {
            data.onlineIds = row.id;
            data.actionType = 2;
            data.detailVisible = true;
          },
        },
        {
          label: "重新上架",
          permission: ["Shopee/pubShopeeOnLineGoods/offline/on"],
          isPopConfirm: false,
          click: (row) => {
            const id = row.id;
            onSelfFn([id]);
          },
        },
        {
          label: "复制",
          permission: ["Shopee/pubShopeeOnLineGoods/offline/copy"],
          isPopConfirm: false,
          click: (row) => {
            data.onlineIds = row.id;
            data.actionType = 1;
            data.draftDetailVisible = true;
          },
        },
        {
          label: "同步",
          permission: ["Shopee/pubShopeeOnLineGoods/offline/sync"],
          isPopConfirm: false,
          click: (row) => {
            const id = row.id;
            syncFn([id]);
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
        fixed: "left",
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.defaultTitle)}</GbText>;
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
              <columnCopy
                isAnchor={record.lazadaUrl ? true : false}
                textValue={record.platformItemId}
                openUrl={record.lazadaUrl}
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
        title: "Shopee分类",
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
        key: "chargePersonName",
        dataIndex: "chargePersonName",
        title: "负责人",
        minWidth: 100,
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.chargePersonName)}</span>;
        },
      },
      {
        key: "updateByName",
        dataIndex: "updateByName",
        title: "下架人",
        minWidth: 150,
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.updateByName)}</span>;
        },
      },
      {
        key: "updateTime",
        dataIndex: "updateTime",
        title: "下架时间",
        showSorterTooltip: false,
        sorter: true,
        minWidth: 150,
        customRender: ({ record }) => {
          return <span>{formatDateTime(record.updateTime)}</span>;
        },
      },
      {
        key: "operation",
        dataIndex: "operation",
        title: "操作",
        minWidth: 150,
        fixed: "right",
        customRender: ({ record }) => {
          return <OpbtnGroup btn-list={getBtnList()} row={record}></OpbtnGroup>;
        },
      },
    ];

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
        chargePersonIds: filterData.chargePersonId.join(","),
        shopIds: filterData.shopId,
        sites: filterData.siteId.join(","),
        specsType: filterData.specsType,
        updateState: filterData.statusId,
        platformStatus: "2",
        [keyMap[filterData.keyWordType]]: filterData.keyWord,
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
      data.detailVisible = false;
      data.draftDetailVisible = false;
      data.onSelfModalVisible = false;
      data.syncModalVisible = false;
      pageTableRef.value?.resetTableField();
      normalFilterRef.value?.resetHandler();
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

    const verifyPatchOnSelf = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.onSelfModalVisible = true;
    };

    const onSelfFn = (id) => {
      const ids = id || data.selectRow.map((item) => item.id);
      listingOnSelf({ ids: ids })
        .then(() => {
          GjMessage.success("上架任务已提交，上架成功后可在“在线列表”查看。");
          pageTableRef.value?.getTableData(null, true);
        })
        // .catch(() => {
        //   GjMessage.error("上架任务提交失败，请重试！");
        // })
        .finally(() => {
          data.onSelfModalVisible = false;
        });
    };

    const verifyPatchSync = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
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
        //   GjMessage.error("同步任务提交失败，请重试！");
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
          return GjMessage.warning("所选商品暂时不可同步，请稍后再试！");
        }
      }
      data.updateModalVisible = true;
    };

    return {
      ...toRefs(data),
      timeOpt3,
      titleListOpt2,
      getListing,
      getListingDetail,
      tableColumns,
      normalFilterRef,
      pageTableRef,
      hasSelectLen,
      resetHandler,
      changeFilterSelect,
      filterChange,
      changeList,
      getListingVariantList,
      detailDialogUpdate,
      draftDetailDialogUpdate,
      detailDialogCancel,
      verifyPatchOnSelf,
      onSelfFn,
      verifyPatchSync,
      syncFn,
      verifyPatchUpdate,
    };
  },
});
</script>

<style scoped lang="scss">
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
</style>
