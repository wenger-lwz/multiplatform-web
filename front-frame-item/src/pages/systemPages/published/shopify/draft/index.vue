<template>
  <common-page
    class="common-list-page"
    :pageRest="true"
    @common-page-rest="resetHandler"
    id="shopify-draft"
  >
    <template #filter-content>
      <search-tag-community
        ref="normalFilterRef"
        :timeOpt="draftTimeOption"
        :titleListOpt="titleListOpt2"
        :showItem="[
          'shopId',
          'specsType',
          'status',
          'keyWord',
          'chargePersonId',
          'rangeValue',
        ]"
        @filter-change="filterChange"
        @tag-change="changeList"
      />
    </template>
    <template #tag-content>
      <tag-group v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #operate_bar-content>
      <operate-bar>
        <template #left>
          <gj-button
            v-for="item in btnList"
            :key="item.text"
            :type="item.type"
            @click="item.handler"
            >{{ item.text }}</gj-button
          >
          <p class="table-selected-rows-nums">
            <span>已选</span>
            <span>{{ selectedLength }}</span>
          </p>
        </template>
        <template #right>
          <queue-popover :platformCode="'SHOPIFY'" />
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
        @on-row-selection="selectChange"
        :selectedRowKeys="selectedRowKeys"
        :pagination="paginationProps"
        @getTableCurrent="getTableCurrent"
        @change="sortChange"
      />
    </template>
  </common-page>
  <gj-modal
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    unmountOnClose
  >
    <template #title>删除</template>
    <div>删除后，所选草稿将无法恢复，是否继续？</div>
  </gj-modal>
  <gj-modal
    :visible="releaseVisible"
    @cancel="releaseCancel"
    @ok="releaseOk"
    unmountOnClose
  >
    <template #title>{{ releaseTitle }}</template>
    <div>{{ releaseContent }}</div>
  </gj-modal>
  <draft-detail
    v-if="detailVisible"
    :type="actionType"
    :productId="productId"
    :platformStatus="platformStatus"
    :isCompleted="isCompleted"
    :dialogVisible="detailVisible"
    @cancel="detailDialogCancel"
    @update-handler="detailDialogUpdate"
    @update-completed-status="updateCompletedStatus"
  />
  <timing-modal
    v-if="timingModalVisible"
    :shopId="shopId"
    :timeRow="timeRow"
    :visible="timingModalVisible"
    @handleOk="timingModalOk"
    @handleCancel="timingModalCancel"
  />
</template>

<script>
import { computed, reactive, toRefs, watch, ref, resolveComponent } from "vue";
import { useRoute } from "vue-router";
import { GjMessage } from "@gj/atom";
import _ from "lodash";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import SearchTagCommunity from "../components/SearchTagCommunity.vue";
import OperateBar from "@/components/OperateBar.vue";
import TagGroup from "@/components/TagGroup.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import AppPopover from "@/components/AppPopover.vue";
import AppTablePopover from "@/components/AppTablePopover.vue";
import DraftDetail from "../components/draftAndOnline/DraftDetail.vue";
import TimingModal from "../components/TimeModal.vue";
import QueuePopover from "@/components/QueuePopover.vue";
import columnCopy from "@/components/columnCopy.vue";

import {
  draftTimeOption,
  titleListOpt2,
  variantListColumns,
} from "@pagesSystem/published/shopify/config";
import {
  getDraftList,
  getDraftVariantList,
  deleteDraft,
  publishDraft,
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
    DraftDetail,
    CommonPage,
    OperateBar,
    TagGroup,
    TimingModal,
    QueuePopover,
    columnCopy,
  },
  setup() {
    const $route = useRoute();
    const GbImage = resolveComponent("GbImage");
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
      selectedRowKeys: [],
      selectedRows: [],
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
      shopId: "",
      productId: "",
      platformStatus: null,
      actionType: 1,
      visible: false,
      deleteRowIds: [],
      isCompleted: false,
      detailVisible: false,
      scroll: {
        x: 2000,
        y: 0,
      },
      releaseTitle: "",
      releaseContent: "",
      releaseVisible: false,
      releaseCurrentRow: null,
      loadingMap: {},
      popupOperateObj: {},
      timeRow: [],
      timingModalVisible: false,
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
                popup-container="#shopify-draft"
                title="变体信息"
                record="变体"
                columns={data.variantListColumns}
                requestFunction={getDraftVariantList}
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
        title: "完整度",
        dataIndex: "completeInfo",
        width: 100,
        customRender: ({ record }) => {
          const statusMapFunction = (key) => {
            return record.completeInfo[key] ? "#2DA641" : "#EE7C30";
          };

          const slots = {
            default: () => (
              <span class="complete-txt">
                {emptyFilter(record.completeInfo?.complete)}
              </span>
            ),
            content: () => {
              return (
                <div
                  class="status-info"
                  style="display: flex;justify-content: space-between;"
                >
                  <div class="left-part-info">
                    <ul>
                      <li>
                        <GjBadge
                          color={statusMapFunction("baseInfo")}
                          text="基础信息"
                        />
                      </li>
                      <li>
                        <GjBadge
                          color={statusMapFunction("productInfo")}
                          text="产品信息"
                        />
                      </li>
                      <li>
                        <GjBadge
                          color={statusMapFunction("sellInfo")}
                          text="销售信息"
                        />
                      </li>
                      <li>
                        <GjBadge
                          color={statusMapFunction("imageInfo")}
                          text="图片信息"
                        />
                      </li>
                      <li>
                        <GjBadge
                          color={statusMapFunction("description")}
                          text="产品描述"
                        />
                      </li>
                      <li>
                        <GjBadge
                          color={statusMapFunction("seoOptimize")}
                          text="SEO优化"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              );
            },
          };

          return (
            <div>
              {!record.completeInfo?.complete ? (
                <span>-</span>
              ) : (
                <AppPopover position="bottom" v-slots={slots} />
              )}
            </div>
          );
        },
      },
      {
        title: "状态",
        dataIndex: "publishState",
        width: 100,
        customRender: ({ record }) => (
          <div>
            {record.publishState === 1 ? (
              record.publishMode === "2" ? (
                <div>
                  <GjBadge status="processing" text="待发布" />
                  <SvgIcon svgClass="icon" width={12}></SvgIcon>
                </div>
              ) : (
                <div>
                  <GjBadge status="processing" text="待发布" />
                </div>
              )
            ) : record.publishState === 2 ? (
              <div>
                <GjBadge status="success" text="已发布" />
              </div>
            ) : (
              <div>
                <GjTooltip content="发布失败的原因在这...">
                  <span>
                    <GjBadge status="warning" text="发布失败" />
                  </span>
                </GjTooltip>
              </div>
            )}
          </div>
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
        title: "创建时间",
        dataIndex: "createTime",
        width: 150,
        key: "createTime",
        showSorterTooltip: false,
        sorter: true,
        customRender: ({ record }) => (
          <span>{formatDateTime(record.createTime)}</span>
        ),
      },
      {
        title: "发布时间",
        dataIndex: "publishTime",
        key: "publishTime",
        showSorterTooltip: false,
        sorter: true,
        width: 100,
        customRender: ({ record }) => (
          <span>{formatDateTime(record.publishTime)}</span>
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
                  <GjButton type="text" onClick={() => releaseRow(record)}>
                    发布
                  </GjButton>
                </p>
                <p>
                  <GjButton type="text" onClick={() => copyRow(record)}>
                    复制
                  </GjButton>
                </p>
                <p>
                  <GjButton type="text" onClick={() => setTimeRow(record)}>
                    定时
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
                    popup-visible={data.popupOperateObj[record.id]}
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

    const { query } = $route;
    if (query?.productId) {
      data.actionType = 1;
      data.productId = query.productId;
      data.platformStatus = query.platformStatus;
      data.detailVisible = true;
    }

    const filterChangeFn = (filterData) => {
      const keyMap = {
        1: "title",
        2: "spu",
        3: "storeSku",
      };
      data.parmasObj = {
        shopIds: filterData.shopId,
        publishState: filterData.status,
        chargePersonIds: filterData.chargePersonId,
        specsType: filterData.specsType,
        [keyMap[filterData.keyWordType]]: filterData.keyWord,
        publishTimeStart:
          (filterData.rangeValue && filterData.rangeValue[0]) || "",
        publishTimeEnd:
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

    const selectedLength = computed(() => data.selectedRowKeys.length);

    const selectChange = (selectedRows) => {
      data.selectedRowKeys = selectedRows.map((item) => item.id);
      data.selectedRows = selectedRows;
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
      getDraftList(params)
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

    // 单个发布
    const releaseRow = (record) => {
      data.popupOperateObj[record.id] = false;
      if (record.publishState !== 1 && record.publishState !== 3) {
        return GjMessage.warning("选草稿暂时不可发布，请稍后再试！");
      }
      if (!record.completeInfo || record.completeInfo.complete !== "6/6") {
        return GjMessage.warning("选中的草稿需要补充完整信息才能定时发布！");
      }
      data.releaseTitle = "发布";
      data.releaseContent = "您即将发布1条刊登草稿，是否继续？";
      data.releaseVisible = true;
      data.releaseCurrentRow = [record];
    };

    // 定时
    const setTimeRow = async (record) => {
      data.popupOperateObj[record.id] = false;
      if (record.publishState !== 1 && record.publishState !== 3) {
        return GjMessage.warning("所选草稿暂时不可发布，请稍后再试！");
      }
      if (!record.completeInfo || record.completeInfo.complete !== "6/6") {
        return GjMessage.warning("选中的草稿需要补充完整信息才能定时发布！");
      }
      data.shopId = record.shopId;
      data.timeRow = [record];
      data.timingModalVisible = true;
    };

    const editRow = (row) => {
      if (row.publishState !== 1 && row.publishState !== 3) {
        return GjMessage.warning("当前状态无法操作");
      }
      data.actionType = 2;
      data.productId = row.id;
      // data.shopId = row.shopId;
      data.isCompleted = true;
      data.detailVisible = true;
    };

    const copyRow = (row) => {
      data.popupOperateObj[row.id] = false;
      if (row.publishState !== 1 && row.publishState !== 3) {
        return GjMessage.warning("所选草稿暂时不可复制，请稍后再试！");
      }
      data.actionType = 1;
      data.productId = row.id;
      // data.shopId = row.shopId;
      data.isCompleted = true;
      data.detailVisible = true;
    };

    const deleteRow = (row) => {
      data.popupOperateObj[row.id] = false;
      if (row.publishState !== 1 && row.publishState !== 3) {
        return GjMessage.warning("所选草稿暂时不可删除，请稍后再试！");
      }
      data.visible = true;
      data.deleteRowIds = [row.id];
    };

    const handleOk = () => {
      const params = {
        ids: data.deleteRowIds,
      };
      deleteDraft(params)
        .then(() => {
          const n = params.ids?.length;
          GjMessage.success(`删除成功${n}个草稿！`);
          getData();
        })
        .catch(() => {
          GjMessage.error("删除失败，请重试！");
        })
        .finally(() => {
          data.visible = false;
        });
    };

    const handleCancel = () => {
      data.deleteRowIds = [];
      data.visible = false;
    };

    const detailDialogCancel = () => {
      data.detailVisible = false;
    };

    const detailDialogUpdate = () => {
      data.pageOption.pageCurrent = 1;
      getData();
      data.detailVisible = false;
    };

    const updateCompletedStatus = () => {
      data.isCompleted = true;
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
        width: 120,
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

    const createDraft = () => {
      data.draftIds = "";
      data.actionType = 1;
      data.detailVisible = true;
    };

    // 批量发布
    const patchRelease = () => {
      if (selectedLength.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      let tempItem = null;
      for (let i = 0; i < data.selectedRows.length; i++) {
        tempItem = data.selectedRows[i];
        if (tempItem.publishState !== 1 && tempItem.publishState !== 3) {
          return GjMessage.warning("当前状态无法操作");
        }
        if (
          !tempItem.completeInfo ||
          tempItem.completeInfo.complete !== "6/6"
        ) {
          return GjMessage.warning("请补全商品信息");
        }
      }
      data.releaseCurrentRow = data.selectedRows;
      data.releaseTitle = "批量发布";
      data.releaseContent = `您即将发布${selectedLength.value}条刊登草稿，是否继续？`;
      data.releaseVisible = true;
    };

    // 批量发布
    const releaseOk = () => {
      const ids = data.releaseCurrentRow.map((item) => item.id);
      ids.forEach((id) => {
        data.loadingMap[id] = true;
      });
      const params = {
        ids,
        enableTime: true,
        publishMode: 1,
      };
      publishDraft(params)
        .then(() => {
          GjMessage.success("发布任务已提交，请稍后查看！");
        })
        .catch(() => {
          GjMessage.error("发布任务提交失败，请重试！");
        });
      data.releaseVisible = false;
    };

    // 批量发布 - 取消
    const releaseCancel = () => {
      data.deleteRowIds = [];
      data.releaseVisible = false;
    };

    // 批量定时发布
    const patchSetTimeRow = () => {
      if (selectedLength.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      let tempItem = null;
      for (let i = 0; i < data.selectedRows.length; i++) {
        tempItem = data.selectedRows[i];
        if (tempItem.publishState !== 1 && tempItem.publishState !== 3) {
          return GjMessage.warning("当前状态无法操作");
        }
        if (
          !tempItem.completeInfo ||
          tempItem.completeInfo.complete !== "6/6"
        ) {
          return GjMessage.warning("请补全商品信息");
        }
      }

      data.timeRow = data.selectedRows;
      data.timingModalVisible = true;
    };

    const timingModalOk = (form) => {
      const params = {
        enableTime: form.enable,
        ids: data.timeRow.map((item) => item.id),
        publishTime: form.publishTime,
        publishMode: 2,
        zone: data.timeRow.length === 1 ? form.timezone : undefined,
      };
      data.timingModalVisible = false;
      publishDraft(params).then(() => {
        GjMessage.success("定时发布任务已提交，请稍后查看");
      });
      getData();
    };

    const timingModalCancel = () => {
      data.timingModalVisible = false;
    };

    // 批量删除
    const patchDelete = () => {
      if (selectedLength.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      let tempItem = null;
      for (let i = 0; i < data.selectedRows.length; i++) {
        tempItem = data.selectedRows[i];
        if (tempItem.publishState !== 1 && tempItem.publishState !== 3) {
          return GjMessage.warning("当前状态无法操作");
        }
      }
      data.deleteRowIds = data.selectedRows.map((it) => it.id);
      data.visible = true;
    };

    const btnList = [
      {
        text: "添加草稿",
        handler: createDraft,
        type: "primary",
      },
      {
        text: "批量发布",
        handler: patchRelease,
        type: "plain",
      },
      {
        text: "批量删除",
        handler: patchDelete,
        type: "plain",
      },
      {
        text: "批量定时发布",
        handler: patchSetTimeRow,
        type: "plain",
      },
    ];

    return {
      ...toRefs(data),
      draftTimeOption,
      titleListOpt2,
      selectedLength,
      tableColumns,
      paginationProps,
      filterChange,
      selectChange,
      getTableCurrent,
      detailDialogCancel,
      detailDialogUpdate,
      updateCompletedStatus,
      handleOk,
      handleCancel,
      handlerFunction,
      changeFilterSelect,
      changeList,
      normalFilterRef,
      resetHandler,
      commonTableRef,
      sortChange,
      // add
      releaseRow,
      copyRow,
      setTimeRow,
      deleteRow,
      editRow,
      popupChange,
      btnList,
      createDraft,
      patchRelease,
      patchDelete,
      patchSetTimeRow,
      timingModalOk,
      timingModalCancel,
      releaseCancel,
      releaseOk,
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
