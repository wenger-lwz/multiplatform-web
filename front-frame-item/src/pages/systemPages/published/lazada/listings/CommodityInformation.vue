<template>
  <CommonPage
    currentRouterPermission="LZD/commodityInformation/view"
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
        :titleListOpt="titleListOpt1"
        :showItem="[
          'siteId',
          'specsType',
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
            type="primary"
            v-permissions="['LZD/commodityInformation/add']"
            @click="createGoods"
            >添加商品</gj-button
          >
          <gj-button
            type="plain"
            v-permissions="['LZD/commodityInformation/patchDrafts']"
            @click="patchDraft"
            >生成草稿</gj-button
          >
          <gj-popconfirm
            position="bl"
            content="此操作不可逆，是否删除？"
            :popup-visible="deleteModelVisible"
            @ok="deleteFn"
            @cancel="patchDeleteCancel"
          >
            <gj-button
              type="plain"
              v-permissions="['LZD/commodityInformation/patchDelete']"
              @click="verifyPatchDelete"
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
        :colunms="tableColumns"
        :requestApi="getList"
        v-model:selectRow="selectRow"
      ></ListPageTable>
      <!-- 草稿中间页 -->
      <goods-draft
        v-if="draftVisible"
        :dialogVisible="draftVisible"
        :goodsRow="deleteRowIds"
        @cancel="draftDialogCancel"
        @confirm="draftDialogConfirm"
      />
      <CommodityDetail
        v-if="detailVisible"
        :pids="productIds"
        :dialogType="actionType"
        :dialogVisible="detailVisible"
        @cancel="detailDialogCancel"
        @update-table-list="detailDialogUpdate"
        @saveAndDraft="saveAndDraft"
      />
    </template>
  </CommonPage>
</template>

<script>
import {
  defineComponent,
  computed,
  reactive,
  toRefs,
  ref,
  resolveComponent,
  watch,
} from "vue";
import _ from "lodash";
import { GjMessage } from "@gj/atom";
import {
  specificationList,
  timeOpt2,
  titleListOpt1,
} from "@pagesSystem/published/lazada/config";
import { useChangeList } from "@pagesSystem/published/lazada/hooks";
import {
  getList,
  deleteProduct,
  addRemark,
  getVariantList,
} from "@/api/published/lazada";
import { clearStore } from "@/utils/common";
import { emptyFilter, formatDateTime, emptyValue } from "@/utils/format";

import { getRecord } from "@/api/public";
import CommonPage from "@/components/CommonPage.vue";
import TagGroup from "@/components/TagGroup.vue";
import OperateBar from "@/components/OperateBar.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import columnCopy from "@/components/columnCopy.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import AppTablePopover from "@/components/AppTablePopover.vue";
import SelectCondition from "@pagesSystem/published/lazada/components/common/SelectCondition.vue";
import ListPageTable from "@pagesSystem/published/lazada/components/common/ListPageTable.vue";
import GoodsDraft from "@pagesSystem/published/lazada/components/commodityInformation/GoodsDraft.vue";
import CommodityDetail from "@pagesSystem/published/lazada/components/commodityInformation/CommodityDetail.vue";

export default defineComponent({
  name: "LZD_CommodityInformation",
  components: {
    CommonPage,
    TagGroup,
    OperateBar,
    /* eslint-disable */
    SvgIcon,
    columnCopy,
    OpbtnGroup,
    AppTablePopover,
    /* eslint-enable */
    SelectCondition,
    ListPageTable,
    GoodsDraft,
    CommodityDetail,
  },
  setup() {
    const data = reactive({
      searchActive: [],
      variantListColumns: [],
      productIds: "",
      actionType: "",
      deleteModelVisible: false,
      deleteRowIds: [],
      draftVisible: false,
      detailVisible: false,
      selectRow: [],
      popupObj: {},
      remarkObj: {},
    });
    const normalFilterRef = ref();
    const pageTableRef = ref();
    const hasSelectLen = computed(() => data.selectRow.length);
    const GbImage = resolveComponent("GbImage");
    const GjInput = resolveComponent("GjInput");
    const GbText = resolveComponent("GbText");
    const GjButton = resolveComponent("GjButton");
    const GjPopover = resolveComponent("GjPopover");
    const GjTooltip = resolveComponent("GjTooltip");

    const getData = (filterData) => {
      const keyMap = {
        1: "title",
        2: "sku",
      };
      const parmasObj = {
        chargePerson: filterData.chargePersonId,
        siteCode: filterData.siteId,
        specsType: filterData.specsType,
        [keyMap[filterData.keyWordType]]: filterData.keyWord,
        timeType: filterData.timeType === "1" ? "createTime" : "updateTime",
        startTime: filterData.rangeValue?.[0] || "",
        endTime: filterData.rangeValue?.[1] || "",
      };
      pageTableRef.value?.getTableData(parmasObj, true);
    };

    const filterChange = _.debounce(getData, 200);

    const publishCountColumns = [
      {
        title: "itemID",
        dataIndex: "itemID",
        minWidth: 100,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.itemID)}</GbText>
        ),
      },
      {
        title: "店铺",
        dataIndex: "shopName",
        minWidth: 100,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.shopName)}</GbText>
        ),
      },
      {
        title: "店铺SKU",
        dataIndex: "shopSkucode",
        minWidth: 100,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.shopSkucode)}</GbText>
        ),
      },
      {
        title: "负责人",
        dataIndex: "chargePersonName",
        minWidth: 100,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.chargePersonName)}</GbText>
        ),
      },
      {
        title: "上架时间",
        dataIndex: "listingTime",
        minWidth: 100,
        customRender: ({ record }) => (
          <GbText>{formatDateTime(record.listingTime)}</GbText>
        ),
      },
    ];

    const publicCountFn = (res) => {
      const list = res.data?.records || [];
      const result = [];
      let itemObj = null;
      list.forEach((item) => {
        itemObj = { ...item, id: item.id || Date.now() };
        result.push(itemObj);
      });
      return { total: result.length, tableData: result };
    };

    const handlerFunction = (res) => {
      const list = res.data || [];
      const result = [];
      let itemObj = null;
      let dkrColumns = [];
      let recommendPriceUnit = "";
      list.forEach((item, index) => {
        recommendPriceUnit = recommendPriceUnit
          ? recommendPriceUnit
          : item.recommendPriceUnit;
        itemObj = { ...item, id: item.id || index };

        item.skuAttr?.forEach((it) => {
          itemObj[it.label] = it.attrValue;
        });
        result.push(itemObj);
      });
      dkrColumns = list
        .map((item) => item.skuAttr?.map((it) => it.label))
        .flat(1);
      dkrColumns = [...new Set(dkrColumns)].filter((item) => item);

      dkrColumns = dkrColumns.map((item) => ({
        title: item,
        dataIndex: item,
        minWidth: 130,
        key: item,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record[item])}</GbText>
        ),
      }));
      dkrColumns = dkrColumns.concat([
        {
          title: `建议售价${
            recommendPriceUnit ? "(" + recommendPriceUnit + ")" : ""
          }`,
          dataIndex: "recommendPrice",
          align: "right",
          width: 150,
          key: "recommendPrice",
          customRender: ({ record }) => (
            <GbText>{emptyFilter(record.recommendPrice)}</GbText>
          ),
        },
      ]);
      data.variantListColumns = dkrColumns;
      return { total: result.length, tableData: result };
    };

    const getBtnList = () => {
      return [
        {
          label: "编辑",
          click: (row) => editRow(row),
          permission: ["LZD/commodityInformation/edit"],
          outside: true,
        },
        {
          label: "草稿",
          click: (row) => draftRow(row),
          permission: ["LZD/commodityInformation/draft"],
          isPopConfirm: false,
        },
        {
          label: "复制",
          click: (row) => copyRow(row),
          permission: ["LZD/commodityInformation/copy"],
          isPopConfirm: false,
        },
        {
          label: "删除",
          click: (row) => deleteRow(row),
          tooltipContent: "此操作不可逆，是否删除？",
          permission: ["LZD/commodityInformation/delete"],
          isPopConfirm: true,
          isDel: true,
        },
      ];
    };

    const tableColumns = [
      {
        fixed: "left",
        title: "图片",
        key: "mainImage",
        dataIndex: "mainImage",
        width: 80,
        customRender: ({ record }) => (
          <GbImage
            src={record.mainImage}
            popover-src={record.mainImage}
            size="36"
          ></GbImage>
        ),
      },
      {
        fixed: "left",
        title: "标题/SPU/SKU",
        key: "spu",
        dataIndex: "spu",
        width: 150,
        customRender: ({ record }) => {
          const copyNode = record.spu ? (
            <columnCopy isAnchor={false} textValue={record.spu} />
          ) : (
            <span>{emptyValue}</span>
          );
          return (
            <div>
              <GbText>{emptyFilter(record.defaultTitle)}</GbText>
              <div>{copyNode}</div>
            </div>
          );
        },
      },
      {
        title: "站点",
        dataIndex: "siteName",
        key: "siteName",
        width: 100,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.siteName)}</GbText>;
        },
      },
      {
        title: "产品分类",
        key: "categoryName",
        dataIndex: "categoryName",
        width: 100,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.categoryName)}</GbText>
        ),
      },
      {
        title: "规格",
        key: "specsType",
        dataIndex: "specsType",
        width: 100,
        customRender: ({ record }) => {
          if (record.specsType === 2) {
            return (
              <AppTablePopover
                style={{ maxWidth: "600px" }}
                position="br"
                title="变体信息"
                record="变体"
                columns={data.variantListColumns}
                requestFunction={getVariantList}
                handlerFunction={handlerFunction}
                paramObj={{ id: record.id }}
              />
            );
          } else {
            const list = specificationList.find(
              (item) => item.code === record.specsType
            );
            return <span>{emptyFilter(list?.productName)}</span>;
          }
        },
      },
      {
        title: "建议售价",
        key: "recommendPrice",
        dataIndex: "recommendPrice",
        width: 100,
        customRender: ({ record }) => {
          return (
            <div class="recommendPrice-warp">
              <GbText>
                {record.recommendPriceUnit
                  ? record.recommendPriceUnit + ":"
                  : ""}
                &nbsp;
                {emptyFilter(record?.recommendPrice)}
              </GbText>
              <span>
                {record.siteCode === "cb" ? (
                  <GjTooltip content="本售价默认美元，详细信息请前往编辑页面查看">
                    <SvgIcon svgClass="arrowYiWen" width={15}></SvgIcon>
                  </GjTooltip>
                ) : null}
              </span>
            </div>
          );
        },
      },
      {
        title: "在线数量",
        key: "status",
        dataIndex: "status",
        width: 100,
        customRender: ({ record }) => {
          if (record.publishCount || record.publishCount === 0) {
            return (
              <AppTablePopover
                title="在线数量"
                record={record.publishCount}
                columns={publishCountColumns}
                requestFunction={getRecord}
                handlerFunction={publicCountFn}
                hasPagination={true}
                paramObj={{ productId: record.id, businessType: 1 }}
              />
            );
          } else {
            return <span>{emptyFilter(record.publishCount)}</span>;
          }
        },
      },
      {
        title: "负责人",
        key: "chargePersonName",
        dataIndex: "chargePersonName",
        width: 100,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.chargePersonName)}</GbText>
        ),
      },
      {
        title: "创建时间",
        key: "createTime",
        dataIndex: "createTime",
        width: 160,
        showSorterTooltip: false,
        sorter: true,
        customRender: ({ record }) => (
          <GbText>{formatDateTime(record.createTime)}</GbText>
        ),
      },
      {
        title: "更新时间",
        key: "updateTime",
        dataIndex: "updateTime",
        width: 160,
        showSorterTooltip: false,
        sorter: true,
        customRender: ({ record }) => (
          <GbText>{formatDateTime(record.updateTime)}</GbText>
        ),
      },
      {
        title: "备注",
        dataIndex: "remark",
        width: 160,
        customRender: ({ record }) => {
          const slots = {
            default: () => {
              return record.remark ? (
                <div class="remark-text">
                  <div>
                    <GbText>{emptyFilter(record.remark)}</GbText>
                  </div>
                  <div>
                    <SvgIcon svgClass="editRemark" width={12}></SvgIcon>
                  </div>
                </div>
              ) : (
                <GjButton class="button" type="text" size="mini">
                  添加
                </GjButton>
              );
            },
            content: () => (
              <div>
                <GjInput
                  v-model={data.remarkObj[record.id]}
                  max-length={50}
                  placeholder="请输入"
                  allow-clear
                  show-word-limit
                ></GjInput>
                <div class="edit-popup-btn-group">
                  <GjButton
                    size="mini"
                    onClick={() => {
                      data.popupObj[record.id] = false;
                    }}
                  >
                    取消
                  </GjButton>
                  <GjButton
                    size="mini"
                    type="primary"
                    onClick={() => updateRemark(record)}
                  >
                    确定
                  </GjButton>
                </div>
              </div>
            ),
          };
          return (
            <GjPopover
              popup-visible={data.popupObj[record.id]}
              trigger="click"
              content-class="edit-popup-wrap"
              onPopupVisibleChange={(bool) => popupChange(record, bool)}
              position="bottom"
              v-slots={slots}
            ></GjPopover>
          );
        },
      },
      {
        title: "操作",
        dataIndex: "action",
        fixed: "right",
        width: 130,
        customRender: ({ record }) => {
          return <OpbtnGroup btn-list={getBtnList()} row={record}></OpbtnGroup>;
        },
      },
    ];

    const createGoods = () => {
      data.productIds = "";
      data.actionType = 1;
      data.detailVisible = true;
    };

    const vertifyCommonFn = () => {
      if (hasSelectLen.value <= 0) {
        GjMessage.warning("请至少选择一条要操作的数据！");
        return false;
      }
      return true;
    };

    const patchDraft = () => {
      if (vertifyCommonFn()) {
        data.deleteRowIds = data.selectRow.map((it) => it.id);
        data.draftVisible = true;
      }
    };
    const verifyPatchDelete = () => {
      if (vertifyCommonFn()) {
        data.deleteRowIds = data.selectRow.map((it) => it.id);
        data.deleteModelVisible = true;
      }
    };

    const updateRemark = (record) => {
      const { id } = record;
      const value = data.remarkObj[id];
      addRemark({ id, remark: value })
        .then(() => {
          GjMessage.success("编辑成功！");
          pageTableRef.value?.getTableData();
        })
        // .catch(() => {
        //   GjMessage.error("编辑失败！");
        // })
        .finally(() => {
          data.popupObj[record.id] = false;
        });
    };
    const popupChange = (record, bool) => {
      data.popupObj[record.id] = bool;
      data.remarkObj[record.id] = record.remark;
    };

    const editRow = (row) => {
      data.actionType = 2;
      data.productIds = row.id;
      data.detailVisible = true;
    };
    const draftRow = (row) => {
      data.deleteRowIds = [row.id];
      data.draftVisible = true;
    };
    const copyRow = (row) => {
      data.productIds = row.id;
      data.actionType = 1;
      data.detailVisible = true;
    };
    const deleteRow = (row) => {
      data.deleteRowIds = [row.id];
      deleteFn();
    };
    const deleteFn = () => {
      const params = { ids: data.deleteRowIds };
      deleteProduct(params)
        .then(() => {
          const n = params?.ids?.length;
          GjMessage.success(`已删除${n}条商品资料！`);
          pageTableRef.value?.getTableData(null, true);
        })
        // .catch(() => {
        //   GjMessage.error("删除失败，若要删除请重新操作！");
        // })
        .finally(() => {
          data.deleteModelVisible = false;
        });
    };

    const patchDeleteCancel = () => {
      data.deleteRowIds = [];
      data.deleteModelVisible = false;
    };

    const draftDialogCancel = () => {
      data.draftVisible = false;
    };
    const draftDialogConfirm = () => {
      data.draftVisible = false;
      pageTableRef.value?.getTableData(null, true);
    };
    const detailDialogCancel = () => {
      data.detailVisible = false;
      clearStore();
    };
    const detailDialogUpdate = () => {
      data.detailVisible = false;
      clearStore();
      pageTableRef.value?.getTableData(null, true);
    };
    const saveAndDraft = (pIds) => {
      data.deleteRowIds = [pIds];
      data.detailVisible = false;
      clearStore();
      pageTableRef.value?.getTableData(null, true);
      data.draftVisible = true;
    };

    /**
     * tag
     */
    const resetHandler = () => {
      data.deleteModelVisible = false;
      data.draftVisible = false;
      data.detailVisible = false;
      normalFilterRef.value?.resetHandler();
      pageTableRef.value?.resetTableField();
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

    return {
      ...toRefs(data),
      specificationList,
      timeOpt2,
      titleListOpt1,
      getList,
      normalFilterRef,
      pageTableRef,
      hasSelectLen,
      publicCountFn,
      handlerFunction,
      publishCountColumns,
      tableColumns,
      filterChange,
      createGoods,
      patchDraft,
      verifyPatchDelete,
      deleteFn,
      patchDeleteCancel,
      draftDialogCancel,
      draftDialogConfirm,
      detailDialogCancel,
      detailDialogUpdate,
      saveAndDraft,
      updateRemark,
      popupChange,
      resetHandler,
      changeFilterSelect,
      changeList,
    };
  },
});
</script>

<style lang="scss">
.edit-popup-wrap {
  .edit-popup-btn-group {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>

<style lang="scss" scoped>
// 表格操作列
:deep(.more-wrap) {
  height: 22px;
  width: 22px;
  text-align: center;
  vertical-align: bottom;
  border-radius: 4px;
  color: #4e5969;
  cursor: pointer;
  &:hover {
    background: #f2f3f5;
    border-radius: 4px;
  }
  &:active {
    background: #e5e6eb;
    border-radius: 4px;
  }
  svg.more-ellipse {
    position: relative;
    top: 3px;
  }
}
.operate-bar-content {
  display: flex;
  align-items: center;
  gap: 8px;
}
:deep(.remark-text) {
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  svg {
    flex: 1;
    cursor: pointer;
  }
}
.selection-length {
  color: #86909c;
  font-size: 12px;
  font-weight: 400;
  span {
    color: #0045f0;
  }
}

:deep(.recommendPrice-warp) {
  display: flex;
  svg.arrowYiWen {
    width: 20px;
    position: relative;
    top: 1px;
  }
}
</style>
