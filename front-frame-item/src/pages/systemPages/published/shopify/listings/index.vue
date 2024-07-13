<template>
  <CommonPage
    class="common-list-page"
    :pageRest="true"
    @common-page-rest="resetHandler"
    id="shopify-product"
  >
    <template #tag-content>
      <TagGroup v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #filter-content>
      <search-tag-community
        ref="normalFilterRef"
        :timeOpt="timeOpt1"
        :titleListOpt="titleListOpt1"
        :showItem="['specsType', 'keyWord', 'chargePersonId', 'rangeValue']"
        @filter-change="filterChange"
        @tag-change="changeList"
      />
    </template>
    <template #operate_bar-content>
      <operate-bar>
        <template #left>
          <div class="btn-group">
            <gj-button type="primary" @click="createGoods">添加商品</gj-button>
            <gj-button type="plain" @click="batchGenerateDrafts"
              >生成草稿</gj-button
            >
            <gj-button type="plain" @click="batchDelete">批量删除</gj-button>
            <p class="table-selected-rows-nums">
              <span>已选</span>
              <span>{{ hasSelectLen }}</span>
            </p>
          </div>
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
        :scroll="scroll"
        :row-selection-visiable="true"
        :selectedRowKeys="selectedRowKeys"
        @on-row-selection="selectChange"
        :pagination="paginationProps"
        @getTableCurrent="getTableCurrent"
        @change="sortChange"
      >
        <template #bodyCell="{ record, column, text }">
          <div v-if="column.dataIndex === 'specsType'">
            <span v-if="text == 1">单品</span>
            <AppTablePopover
              v-else
              popup-container="#shopify-product"
              title="变体信息"
              record="变体"
              :columns="variantListColumns"
              :requestFunction="getVariantList"
              :handlerFunction="handlerFunction"
              :paramObj="{ id: record.id }"
            />
          </div>
        </template>
      </common-table>
    </template>
  </CommonPage>
  <gj-modal
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    unmountOnClose
  >
    <template #title> 删除 </template>
    <div>此操作不可逆，是否删除？</div>
  </gj-modal>
  <product-detail
    v-if="detailVisible"
    :productId="productId"
    :type="actionType"
    :dialogVisible="detailVisible"
    @cancel="detailDialogCancel"
    @update-handler="detailDialogUpdate"
    @open-draft-config-page="saveAndDraft"
  />
  <config-draft
    :dialogVisible="draftVisible"
    :goodsRow="deleteRowIds"
    @cancel="draftDialogCancel"
    @confirm="draftDialogConfirm"
  />
</template>

<script>
let rowKey = 0;
import { computed, reactive, toRefs, watch, ref, resolveComponent } from "vue";
import CommonPage from "@/components/CommonPage.vue";
import _ from "lodash";
import { GjButton, GjPopconfirm, GjPopover, GjMessage } from "@gj/atom";
import CommonTable from "@/components/CommonTable.vue";
import SearchTagCommunity from "@pagesSystem/published/shopify/components/SearchTagCommunity.vue";
import OperateBar from "@/components/OperateBar.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import AppTablePopover from "@/components/AppTablePopover.vue";
import ProductDetail from "./ProductDetail.vue";
import columnCopy from "@/components/columnCopy.vue";
import ConfigDraft from "./ConfigDraft.vue";
import TagGroup from "@/components/TagGroup.vue";
import { timeOpt1, titleListOpt1 } from "@pagesSystem/published/shopify/config";
import {
  getList,
  deleteProduct,
  addRemark,
  getVariantList,
} from "@/api/published/shopify";
import { clearStore } from "@/utils/common";
import { emptyFilter, formatDateTime } from "@/utils/format";

export default {
  components: {
    CommonTable,
    SearchTagCommunity,
    OperateBar,
    /* eslint-disable */
    SvgIcon,
    AppTablePopover,
    ProductDetail,
    CommonPage,
    ConfigDraft,
    TagGroup,
    columnCopy,
  },
  setup() {
    const GbImage = resolveComponent("GbImage");
    const GbText = resolveComponent("GbText");
    const commonTableRef = ref(null);
    const normalFilterRef = ref(null);
    const data = reactive({
      variantListColumns: [],
      selectedRowKeys: [],
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
      actionType: "",
      visible: false,
      deleteRowIds: [],
      draftVisible: false,
      detailVisible: false,
      remarkObj: {},
      scroll: {
        x: 2000,
        y: 0,
      },
    });

    const publishCountColumns = [
      {
        title: "itemID",
        dataIndex: "itemID",
        width: 115,
      },
      {
        title: "店铺",
        dataIndex: "shopName",
        width: 135,
      },
      {
        title: "店铺SKU",
        dataIndex: "shopSkucode",
        width: 135,
      },
      {
        title: "负责人",
        dataIndex: "chargePersonName",
        width: 75,
      },
      {
        title: "上架时间",
        dataIndex: "listingTime",
        width: 140,
      },
    ];

    const tableColumns = [
      {
        fixed: "left",
        title: "图片",
        dataIndex: "mainImage",
        width: 80,
        customRender: ({ record }) => <GbImage src={record?.mainImage} />,
      },
      {
        fixed: "left",
        title: "标题",
        dataIndex: "defaultTitle",
        width: 300,
        customRender: ({ record }) => {
          const copyNode = record.spu ? (
            <columnCopy isAnchor={false} textValue={record.spu} />
          ) : (
            <span>-</span>
          );
          return (
            <div>
              <GbText>{record.titles?.[0]}</GbText>
              <div>{copyNode}</div>
            </div>
          );
        },
      },
      {
        title: "Shopify分类",
        dataIndex: "categoryId",
        width: 150,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.productCategory)}</GbText>
        ),
      },
      {
        title: "规格",
        dataIndex: "specsType",
        width: 100,
      },
      {
        title: "建议售价",
        dataIndex: "recommendPrice",
        width: 200,
        customRender: ({ record }) => (
          <span>{emptyFilter(record.recommendedPriceRange)}</span>
        ),
      },
      {
        title: "在线数量",
        dataIndex: "publishCount",
        width: 100,
        customRender: ({ record }) => {
          return (
            <div>
              {record.publishCount > 0 ? (
                <AppTablePopover
                  title="在线数量"
                  record={record.publishCount}
                  columns={publishCountColumns}
                />
              ) : (
                <span>{emptyFilter(record.publishCount)}</span>
              )}
            </div>
          );
        },
      },
      {
        title: "负责人",
        dataIndex: "chargePersonName",
        width: 100,
        customRender: ({ record }) => (
          <span>{emptyFilter(record.chargePersonName)}</span>
        ),
      },
      {
        key: "createTime",
        title: "创建时间",
        dataIndex: "createTime",
        width: 160,
        showSorterTooltip: false,
        sorter: true,
        customRender: ({ record }) => (
          <span>{formatDateTime(record.createTime)}</span>
        ),
      },
      {
        key: "updateTime",
        title: "更新时间",
        dataIndex: "updateTime",
        width: 160,
        showSorterTooltip: false,
        sorter: true,
        customRender: ({ record }) => (
          <span>{formatDateTime(record.updateTime)}</span>
        ),
      },
      {
        title: "备注",
        dataIndex: "remark",
        width: 150,
        customRender: ({ record }) => {
          const slots = {
            default: () => {
              return record.remark ? (
                <div>
                  <span>{record.remark}</span>&nbsp;
                  <SvgIcon
                    svgClass="editRemark"
                    width={12}
                    style="cursor: pointer;"
                  ></SvgIcon>
                </div>
              ) : (
                <GjButton class="button" type="text">
                  添加
                </GjButton>
              );
            },
            icon: () => <span></span>,
            content: () => (
              <>
                <gj-input
                  v-model={data.remarkObj[record.id]}
                  max-length={50}
                  style="{ width: '240px' }"
                  placeholder="请输入"
                  allow-clear
                  show-word-limit
                ></gj-input>
                <div style="margin: 16px 0 0 0; height: 1px; background: #e6e6ed"></div>
              </>
            ),
          };
          return (
            <GjPopconfirm
              onOk={() => updateRemark(record)}
              onPopupVisibleChange={() => popupChange(record)}
              position="bottom"
              v-slots={slots}
            ></GjPopconfirm>
          );
        },
      },
      {
        title: "操作",
        dataIndex: "action",
        fixed: "right",
        width: 120,
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
                  <GjButton
                    type="text"
                    size="mini"
                    onClick={() => generateDrafts(record.id)}
                  >
                    草稿
                  </GjButton>
                </p>
                <p>
                  <GjButton
                    type="text"
                    size="mini"
                    onClick={() => copyRow(record)}
                  >
                    复制
                  </GjButton>
                </p>

                <p>
                  <GjButton
                    type="text"
                    size="mini"
                    onClick={() => deleteRow(record)}
                  >
                    删除
                  </GjButton>
                </p>
              </>
            ),
          };
          return (
            <div class="table-more-handles">
              <GjButton type="text" size="mini" onClick={() => editRow(record)}>
                编辑
              </GjButton>
              <GjPopover
                title=""
                trigger="click"
                position="bottom"
                v-slots={slots}
              ></GjPopover>
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
      const keyMap = {
        1: "defaultTitle",
        2: "spu",
      };
      const timeMap = {
        1: "createTime",
        2: "updateTime",
      };
      data.parmasObj = {
        chargePersonIds: filterData.chargePersonId,
        specsType: filterData.specsType,
        [keyMap[filterData.keyWordType]]: filterData.keyWord,
        [timeMap[filterData.timeType] + "Start"]:
          (filterData.rangeValue && filterData.rangeValue[0]) || "",
        [timeMap[filterData.timeType] + "End"]:
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

    const hasSelectLen = computed(() => data.selectedRowKeys.length);

    const selectChange = (selectedRows) => {
      data.selectedRowKeys = selectedRows.map((item) => item.id);
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
      data.selectedRowKeys = [];
      getList(params)
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

    const createGoods = () => {
      data.productId = "";
      data.actionType = 1;
      data.detailVisible = true;
    };

    const generateDrafts = (id) => {
      data.deleteRowIds = [id];
      data.draftVisible = true;
    };

    const batchGenerateDrafts = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.deleteRowIds = data.selectedRowKeys;
      data.draftVisible = true;
    };

    const batchDelete = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.deleteRowIds = data.selectedRowKeys;
      data.visible = true;
    };

    const updateRemark = (record) => {
      const { id } = record;
      const value = data.remarkObj[id];
      addRemark({ id, remark: value }).then((res) => {
        if (res.code === 0) {
          GjMessage.success("修改成功！");
          getData();
        } else {
          GjMessage.error("编辑失败！");
        }
      });
    };

    const popupChange = (record) => {
      data.remarkObj[record.id] = record.remark;
    };

    const editRow = (row) => {
      data.actionType = 2;
      data.productId = row.id;
      data.detailVisible = true;
    };

    const copyRow = (row) => {
      data.productId = row.id;
      data.actionType = 1;
      data.detailVisible = true;
    };

    const deleteRow = (row) => {
      data.visible = true;
      data.deleteRowIds = [row.id];
    };

    const deleteFn = (params) => {
      deleteProduct(params)
        .then(() => {
          const n = params?.ids?.length;
          GjMessage.success(`已删除${n}条商品资料！`);
          getData();
        })
        .catch(() => {
          GjMessage.error("删除失败，若要删除请重新操作！");
        });
    };

    const handleOk = () => {
      deleteFn({ ids: data.deleteRowIds });
      data.visible = false;
    };

    const handleCancel = () => {
      data.deleteRowIds = [];
      data.visible = false;
    };

    const draftDialogCancel = () => {
      data.draftVisible = false;
    };

    const draftDialogConfirm = () => {
      data.draftVisible = false;
    };

    const detailDialogCancel = () => {
      data.detailVisible = false;
    };

    const detailDialogUpdate = () => {
      data.pageOption.pageCurrent = 1;
      getData();
      data.detailVisible = false;
    };

    const saveAndDraft = (pIds) => {
      data.deleteRowIds = [pIds];
      data.detailVisible = false;
      data.draftVisible = true;
    };

    // 删除tags
    const changeFilterSelect = (id) => {
      // console.log("kkkk", id);
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
      let dkrColumns = [];
      let recommendPriceUnit = "";
      list.forEach((item) => {
        recommendPriceUnit = recommendPriceUnit
          ? recommendPriceUnit
          : item.recommendPriceUnit;
        let itemObj = {
          id: "rowKey-" + rowKey++,
          ...item,
        };
        item.variantAttrInfo.forEach((it) => {
          itemObj[it.attrName] = it.attrValue;
        });
        result.push(itemObj);
      });
      dkrColumns = list
        .map((item) => item.variantAttrInfo.map((it) => it.attrName))
        .flat(1);
      dkrColumns = [...new Set(dkrColumns)];
      dkrColumns = dkrColumns.map((item) => ({
        title: item,
        dataIndex: item,
        width: 100,
      }));
      dkrColumns = dkrColumns.concat([
        {
          title: `建议售价${
            recommendPriceUnit ? "(" + recommendPriceUnit + ")" : ""
          }`,
          dataIndex: "recommendPrice",
          width: 150,
        },
      ]);
      data.variantListColumns = dkrColumns;
      return { total: result.length, tableData: result };
    };

    return {
      ...toRefs(data),
      timeOpt1,
      titleListOpt1,
      hasSelectLen,
      publishCountColumns,
      tableColumns,
      paginationProps,
      filterChange,
      selectChange,
      getTableCurrent,
      createGoods,
      generateDrafts,
      batchGenerateDrafts,
      batchDelete,
      formatDateTime,
      draftDialogCancel,
      draftDialogConfirm,
      detailDialogCancel,
      detailDialogUpdate,
      saveAndDraft,
      updateRemark,
      popupChange,
      editRow,
      copyRow,
      deleteRow,
      handleOk,
      handleCancel,
      handlerFunction,
      changeFilterSelect,
      changeList,
      normalFilterRef,
      resetHandler,
      commonTableRef,
      sortChange,
      getVariantList,
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
    gap: 0 8px;
  }
}
</style>
