<template>
  <CommonPage
    :pageRest="true"
    currentRouterPermission="LZD/commodityCrossBorder/suspectDeleted/view"
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
      <OperateBar @operate-rest="refresh" :refreshShow="true"></OperateBar>
    </template>
    <template #table-content>
      <ListPageTable
        ref="pageTableRef"
        pageKey="-tabs"
        :colunms="tableColumns"
        :requestApi="getGlobalListing"
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
  resolveComponent,
  watch,
} from "vue";
import _ from "lodash";
import CommonPage from "@/components/CommonPage.vue";
import TagGroup from "@/components/TagGroup.vue";
import OperateBar from "@/components/OperateBar.vue";
import SelectCondition from "@pagesSystem/published/lazada/components/common/SelectCondition.vue";
import ListPageTable from "@pagesSystem/published/lazada/components/common/ListPageTable.vue";
import AppTablePopover from "@/components/AppTablePopover.vue";
import columnCopy from "@/components/columnCopy.vue";

import { emptyFilter, emptyValue } from "@/utils/format";
import {
  getGlobalListing,
  getListingVariantList,
} from "@/api/published/lazada";
import { useChangeList } from "@pagesSystem/published/lazada/hooks";
import {
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
    AppTablePopover,
    columnCopy,
    /* eslint-enable */
  },
  setup() {
    const data = reactive({
      searchActive: [],
      variantListColumns: variantListColumns,
      detailVisible: false,
      onlineIds: "",
      actionType: "",
    });

    const GbImage = resolveComponent("GbImage");
    const GbText = resolveComponent("GbText");
    const GjTag = resolveComponent("GjTag");
    const GjPopover = resolveComponent("GjPopover");
    const GjBadge = resolveComponent("GjBadge");

    const normalFilterRef = ref();
    const pageTableRef = ref();

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
        chargePerson: filterData.chargePersonId,
        shopId: filterData.shopId,
        siteCode: filterData.siteId,
        updateState: filterData.statusId,
        platformState: "4",
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

    const refresh = () => {
      pageTableRef.value?.getTableData(null, true);
    };

    return {
      ...toRefs(data),
      titleListOpt2,
      getGlobalListing,
      tableColumns,
      normalFilterRef,
      pageTableRef,
      resetHandler,
      changeFilterSelect,
      filterChange,
      changeList,
      getListingVariantList,
      refresh,
    };
  },
});
</script>

<style scoped lang="scss"></style>
