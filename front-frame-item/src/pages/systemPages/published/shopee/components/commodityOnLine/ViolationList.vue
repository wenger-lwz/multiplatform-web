<template>
  <CommonPage
    currentRouterPermission="Shopee/pubShopeeOnLineGoods/violationList/view"
    :pageRest="true"
    @common-page-rest="resetHandler"
  >
    <template #tag-content>
      <TagGroup v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #filter-content>
      <SelectCondition
        ref="normalFilterRef"
        :titleListOpt="titleListOpt2"
        :showItem="['shopId', 'siteId', 'keyWord', 'chargePersonId']"
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
              v-permissions="[
                'Shopee/pubShopeeOnLineGoods/violationList/batchOn',
              ]"
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
              v-permissions="[
                'Shopee/pubShopeeOnLineGoods/violationList/batchSync',
              ]"
              shape="round"
              type="primary"
              class="gray-border"
              @click="verifyPatchSync"
              >批量同步</gj-button
            >
          </gj-popconfirm>

          <gj-popconfirm
            position="bl"
            :content="`您即将删除${hasSelectLen}条在线商品，下架后商品将不能被买家检索查看到，是否继续？`"
            :popup-visible="listDownModalVisible"
            @ok="listDownFn"
            @cancel="listDownModalVisible = false"
          >
            <gj-button
              v-permissions="[
                'Shopee/pubShopeeOnLineGoods/violationList/delete',
              ]"
              shape="round"
              type="primary"
              class="gray-border"
              @click="verifyPatchListDown"
              >批量删除</gj-button
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
        v-model:selectRow="selectRow"
        :colunms="tableColumns"
        :requestApi="getListing"
      ></ListPageTable>

      <OnlineDetail
        v-if="detailVisible"
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
  resolveComponent,
  watch,
  computed,
} from "vue";
import _ from "lodash";
import CommonPage from "@/components/CommonPage.vue";
import TagGroup from "@/components/TagGroup.vue";
import { GjMessage } from "@gj/atom";

import OperateBar from "@/components/OperateBar.vue";
import SelectCondition from "@pagesSystem/published/shopee/components/common/SelectCondition.vue";
import ListPageTable from "@pagesSystem/published/shopee/components/common/ListPageTable.vue";
import AppTablePopover from "@pagesSystem/published/shopee/components/AppTablePopover.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import columnCopy from "@/components/columnCopy.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import OnlineDetail from "@pagesSystem/published/shopee/components/commodityOnLine/OnlineDetail.vue";
import PublishedDraftDetail from "@pagesSystem/published/shopee/components/publishedDraft/PublishedDraftDetail.vue";
import { emptyFilter, emptyValue } from "@/utils/format";
import {
  getListing,
  deleteOnlineShopee,
  listingPull,
  listingOnSelf,
  getListingVariantList,
  getListingDetail,
} from "@/api/published/shopee";
import {
  titleListOpt2,
  useChangeList,
  specificationList,
  variantListColumns,
} from "../../config";

export default defineComponent({
  name: "ViolationList",
  components: {
    CommonPage,
    TagGroup,
    SelectCondition,
    ListPageTable,
    /* eslint-disable */
    AppTablePopover,
    SvgIcon,
    columnCopy,
    OpbtnGroup,
    /* eslint-enable */
    OnlineDetail,
    PublishedDraftDetail,
    OperateBar,
  },
  setup() {
    const data = reactive({
      searchActive: [],
      variantListColumns: variantListColumns,
      detailVisible: false,
      draftDetailVisible: false,
      onlineIds: "",
      actionType: "",
      selectRow: [],
      loadingMap: {},
      listDownModalVisible: false,
      syncModalVisible: false,
      onSelfModalVisible: false,
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
          permission: ["Shopee/pubShopeeOnLineGoods/violationList/edi"],
          click: (row) => {
            data.onlineIds = row.id;
            data.actionType = 2;
            data.detailVisible = true;
          },
        },
        {
          label: "重新上架",
          permission: ["Shopee/pubShopeeOnLineGoods/violationList/on"],
          isPopConfirm: false,
          click: (row) => {
            const id = row.id;
            onSelfFn([id], row);
          },
        },
        {
          label: "同步",
          permission: ["Shopee/pubShopeeOnLineGoods/violationList/sync"],
          isPopConfirm: false,
          click: (row) => {
            syncFn([row.id]);
          },
        },
        {
          label: "删除",
          permission: ["Shopee/pubShopeeOnLineGoods/violationList/delete"],
          isPopConfirm: true,
          tooltipContent:
            "您即将删除1个在线商品，下架后商品将不能被买家检索查看到，是否继续？",
          click: (row) => {
            listDownFn([row.id]);
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
        key: "shopeeStatus",
        dataIndex: "shopeeStatus",
        title: "状态",
        minWidth: 160,
        customRender: ({ record }) => {
          return (
            <GbText>
              {emptyFilter(record?.shopeeStatus == 3 ? "禁售" : "shopee删除")}
            </GbText>
          );
        },
      },
      /* {
        key: 'bannedReason',
        dataIndex: 'bannedReason',
        title: '违反原因',
        minWidth: 160,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record?.bannedReason)}</GbText>;
        },
      }, */
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
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record[item])}</GbText>
        ),
      }));
      dkrColumns = dkrColumns.concat(
        variantListColumns.map((item) => ({
          ...item,
          title:
            item.showRecommendPriceUnit && recommendPriceUnit
              ? `${item.title}(${recommendPriceUnit})`
              : item.title,
          customRender: ({ record }) => (
            <GbText>{emptyFilter(record[item.dataIndex])}</GbText>
          ),
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
        platformStatus: "3",
        [keyMap[filterData.keyWordType]]: filterData.keyWord,
      };
      pageTableRef.value?.getTableData(parmasObj, true);
    };
    const filterChange = _.debounce(getData, 200);

    /**
     * tag
     */
    const resetHandler = () => {
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

    const verifyPatchListDown = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      for (let i = 0; i < data.selectRow.length; i++) {
        if (data.loadingMap[data.selectRow[i].id]) {
          return GjMessage.warning("所选商品暂时不可删除，请稍后再试！");
        }
      }
      data.listDownModalVisible = true;
    };

    const listDownFn = (id) => {
      const ids = id || data.selectRow.map((item) => item.id);
      deleteOnlineShopee({ ids: ids })
        .then(() => {
          GjMessage.success(
            "已删除 5 个商品，下架后可在“已下架”列表查看或重新上架。"
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

    const verifyPatchOnSelf = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.onSelfModalVisible = true;
    };

    const onSelfFn = (id, row) => {
      const status = data.selectRow.some((item) => item.shopeeStatus === 4);

      if (status === true) {
        return GjMessage.warning("存在状态为删除的数据，不能上架！");
      }

      if (status === true || row.shopeeStatus === 4) {
        return GjMessage.warning("此数据状态为删除，不能上架！");
      }

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

    watch(
      () => data.searchActive.length,
      () => {
        onRecalculateWh();
      }
    );

    return {
      ...toRefs(data),
      titleListOpt2,
      getListing,
      getListingDetail,
      tableColumns,
      normalFilterRef,
      pageTableRef,
      resetHandler,
      changeFilterSelect,
      filterChange,
      changeList,
      getListingVariantList,
      detailDialogUpdate,
      draftDetailDialogUpdate,
      detailDialogCancel,
      verifyPatchListDown,
      listDownFn,
      hasSelectLen,
      verifyPatchSync,
      syncFn,
      onSelfFn,
      verifyPatchOnSelf,
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
