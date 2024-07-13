<template>
  <CommonPage
    :pageRest="true"
    currentRouterPermission="LZD/commodityCrossBorder/offline/view"
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
          <gj-button
            type="plain"
            v-permissions="['LZD/commodityCrossBorder/offline/patchSync']"
            @click="patchSync"
            >批量同步</gj-button
          >
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
        :requestApi="getGlobalListing"
        @table-data-change="tableDataChange"
      ></ListPageTable>
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
import columnCopy from "@/components/columnCopy.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import OperateBar from "@/components/OperateBar.vue";
import SelectCondition from "@pagesSystem/published/lazada/components/common/SelectCondition.vue";
import ListPageTable from "@pagesSystem/published/lazada/components/common/ListPageTable.vue";
import AppTablePopover from "@/components/AppTablePopover.vue";

import { emptyFilter, formatDateTime, emptyValue } from "@/utils/format";
import {
  getGlobalListing,
  getListingVariantList,
  globalSyncSingle,
  globalPatchSync,
} from "@/api/published/lazada";
import { useChangeList } from "@pagesSystem/published/lazada/hooks";
import {
  timeOpt3,
  titleListOpt2,
  specificationList,
  variantListColumns,
} from "../../config";

export default defineComponent({
  name: "OffSelfList",
  components: {
    CommonPage,
    TagGroup,
    OperateBar,
    SelectCondition,
    ListPageTable,
    /* eslint-disable */
    columnCopy,
    OpbtnGroup,
    AppTablePopover,
    /* eslint-enable */
  },
  setup() {
    const data = reactive({
      searchActive: [],
      selectRow: [],
      variantListColumns: variantListColumns,
      loadingMap: {},
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
    const GbText = resolveComponent("GbText");
    const GjTag = resolveComponent("GjTag");
    const GjPopover = resolveComponent("GjPopover");
    const GjBadge = resolveComponent("GjBadge");
    const GjSpace = resolveComponent("GjSpace");
    const GjSpin = resolveComponent("GjSpin");

    const normalFilterRef = ref();
    const pageTableRef = ref();
    const hasSelectLen = computed(() => {
      return data.selectRow.length;
    });

    const getBtnList = () => {
      return [
        {
          label: "同步",
          outside: true,
          permission: ["LZD/commodityCrossBorder/offline/sync"],
          isPopConfirm: false,
          click: (row) => {
            const id = row.id;
            if (data.loadingMap[id]) {
              return GjMessage.warning("所选商品暂时不可同步，请稍后再试！");
            }
            rowSync([id]);
          },
        },
      ];
    };

    const siteColumns = [
      {
        title: "站点",
        dataIndex: "siteCode",
        width: 60,
        customRender: ({ record }) => (
          <span>{emptyFilter(record.siteCode)}</span>
        ),
      },
      {
        title: "结果",
        dataIndex: "result",
        width: 140,
        customRender: ({ record }) => (
          <span>
            {record.release ? (
              record.result ? (
                <GjBadge status="success" text="发布成功" />
              ) : (
                <GjBadge status="warning" text="发布失败" />
              )
            ) : (
              <GjBadge status="processing" text="没有发布" />
            )}
          </span>
        ),
      },
      {
        title: "Lazada返回信息",
        dataIndex: "reason",
        width: 200,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.reason)}</GbText>
        ),
      },
    ];

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
        key: "siteList",
        dataIndex: "siteList",
        title: "发布到站点",
        minWidth: 100,
        customRender: ({ record, index }) => {
          const slots = {
            default: () => {
              return <GjButton type="text">{record.siteList.length}</GjButton>;
            },
            content: () => (
              <div>
                <gj-table
                  bordered
                  row-key={index}
                  columns={siteColumns}
                  data-source={record.siteList}
                  pagination={false}
                />
              </div>
            ),
          };
          return record.siteList?.length > 0 ? (
            <GjPopover
              trigger="click"
              content-class="site-popup-wrap"
              position="bottom"
              v-slots={slots}
            ></GjPopover>
          ) : (
            <span>{emptyValue}</span>
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
        minWidth: 90,
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
        platformState: "2",
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
      data.loadingMap = {};
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

    const patchSync = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      for (let i = 0; i < data.selectRow.length; i++) {
        if (data.loadingMap[data.selectRow[i].id]) {
          return GjMessage.warning("所选商品暂时不可同步，请稍后再试！");
        }
      }
      globalPatchSync({
        listingIds: data.selectRow.map((item) => item.id),
      }).then(() => {
        GjMessage.success("同步任务已提交，请稍后查看！");
        pageTableRef.value?.getTableData(null, true);
      }); // .catch(() => {
      //   GjMessage.error("同步任务提交失败，请重试！")
      // });
    };

    const rowSync = (id) => {
      const ids = id || data.selectRow.map((item) => item.id);
      globalSyncSingle({
        listingIds: ids,
      }).then(() => {
        GjMessage.success("同步任务已提交，请稍后查看！");
        pageTableRef.value?.getTableData(null, true);
      });
      // .catch(() => {
      //   GjMessage.error("同步任务提交失败，请重试！");
      // });
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
      timeOpt3,
      titleListOpt2,
      getGlobalListing,
      tableColumns,
      normalFilterRef,
      pageTableRef,
      hasSelectLen,
      resetHandler,
      changeFilterSelect,
      filterChange,
      changeList,
      getListingVariantList,
      patchSync,
      rowSync,
      tableDataChange,
    };
  },
});
</script>

<style scoped lang="scss">
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
