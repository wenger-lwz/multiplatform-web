<template>
  <CommonPage
    currentRouterPermission="SHOPEE/pubShopeeDraft/view"
    class="common-page-draft"
    :pageRest="true"
    @common-page-rest="resetHandler"
  >
    <template #tag-content>
      <TagGroup v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #filter-content>
      <FilterCondition
        :timeOpt="timeOpt4"
        :titleListOpt="titleListOpt3"
        :showItem="[
          'siteIds',
          'specsType',
          'status',
          'keyWords',
          'chargePersonId',
          'rangeValue',
        ]"
        @filter-change="filterChange"
        @tag-change="changeList"
        ref="normalFilterRef"
      />
    </template>
    <template #operate_bar-content>
      <OperateBtnGroup>
        <template #left>
          <gj-button
            v-for="item in btnList"
            :key="item.text"
            :class="item.class"
            :type="item.type || undefined"
            @click="item.handler"
            :v-permissions="item.permission"
            >{{ item.text }}</gj-button
          >
          <p class="selected-val">
            已选
            <span>{{ hasSelectLen }}</span>
          </p>
        </template>
        <template #right>
          <AppTablePopover
            ref="queueRef"
            style="width: 600px"
            :reqUntilShow="false"
            title="刊登队列"
            :titleSuffix="queueTitleSuffix"
            :record="queueRecord"
            :columns="queueColumns"
            :requestFunction="getQueueInfo"
            :handlerFunction="queueHandlerFunction"
            :paramObj="{ platformCode: 'SHOPEE', businessType: '1' }"
          >
            <span class="queue-list-btn">{{ queueRecord }}</span>
          </AppTablePopover>
        </template>
      </OperateBtnGroup>
    </template>
    <template #table-content>
      <ListPageTable
        ref="pageTableRef"
        :colunms="tableColumns"
        v-model:selectRow="selectRow"
        :requestApi="getDraftTableList"
      ></ListPageTable>
      <!-- 弹框 -->
      <gj-modal
        :visible="visible"
        @cancel="handleCancel"
        @ok="handleOk"
        unmountOnClose
      >
        <template #title> 删除 </template>
        <div>此操作不可逆，是否删除？</div>
      </gj-modal>

      <gj-modal
        :visible="releaseVisible"
        @cancel="releaseCancel"
        @ok="releaseOk"
        unmountOnClose
      >
        <template #title> {{ releaseTitle }} </template>
        <div>{{ releaseContent }}</div>
      </gj-modal>
      <PublishedDraftDetail
        v-if="detailVisible"
        :pids="draftIds"
        :dialogType="actionType"
        :hideBtn="false"
        :dialogVisible="detailVisible"
        @update-handler="detailDialogUpdate"
        @cancel="detailDialogCancel"
      />
      <TimingModal
        v-if="timingModalVisible"
        :list="siteList"
        :timeRow="timeRow"
        :visible="timingModalVisible"
        @handleOk="timingModalOk"
        @handleCancel="timingModalCancel"
      ></TimingModal>
    </template>
  </CommonPage>
</template>

<script>
import {
  computed,
  reactive,
  toRefs,
  watch,
  ref,
  resolveComponent,
  defineComponent,
} from "vue";
import _ from "lodash";
import { GjMessage } from "@gj/atom";
import { copy } from "@common";
import {
  siteList,
  specificationList,
  timeOpt4,
  titleListOpt3,
  variantListColumns,
  useChangeList,
} from "@pagesSystem/published/shopee/config";
import { emptyFilter, formatDateTime, emptyValue } from "@/utils/format";
import {
  getDraftTableList,
  getDraftVariantList,
  deleteDraft,
  // releaseDraft,
  releaseDraft,
} from "@/api/published/shopee.js";
import { getQueueInfo } from "@/api/public";
import { clearStore } from "@/utils/common";
import CommonPage from "@/components/CommonPage.vue";
import TagGroup from "@/components/TagGroup.vue";
import OperateBtnGroup from "@/components/OperateBtnGroup.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import columnCopy from "@/components/columnCopy.vue";
import FilterCondition from "@pagesSystem/published/shopee/components/common/FilterCondition.vue";
import AppTablePopover from "@pagesSystem/published/shopee/components/publishedDraft/AppTablePopover.vue";
import AppPopover from "@/components/AppPopover.vue";
import PublishedDraftDetail from "@pagesSystem/published/shopee/components/publishedDraft/PublishedDraftDetail.vue";
import ListPageTable from "@pagesSystem/published/shopee/components/common/ListPageTable.vue";
import TimingModal from "@pagesSystem/published/shopee/components/TimeModal.vue";

export default defineComponent({
  name: "PubShopeeDraft",
  components: {
    CommonPage,
    TagGroup,
    OperateBtnGroup,
    FilterCondition,
    /* eslint-disable */
    SvgIcon,
    AppPopover,
    /* eslint-enable */
    AppTablePopover,
    PublishedDraftDetail,
    ListPageTable,
    TimingModal,
  },
  setup() {
    const data = reactive({
      searchActive: [],
      variantListColumns: variantListColumns,
      selectRow: [],
      draftIds: "",
      actionType: "", // 1新建|复制 2编辑
      visible: false,
      deleteRowIds: [],
      detailVisible: false,
      remarkObj: {},
      releaseTitle: "",
      releaseContent: "",
      releaseVisible: false,
      releaseCurrentRow: null,
      loadingMap: {},
      timingModalVisible: false,
      timeRow: [],
      popupOperateObj: {},
    });

    const GbImage = resolveComponent("GbImage");
    const GjBadge = resolveComponent("GjBadge");
    const GjTooltip = resolveComponent("GjTooltip");
    const GjButton = resolveComponent("GjButton");
    const GjSpin = resolveComponent("GjSpin");
    const GjSpace = resolveComponent("GjSpace");
    const GjPopover = resolveComponent("GjPopover");
    const SvgIcon = resolveComponent("SvgIcon");

    const pageTableRef = ref();
    const normalFilterRef = ref();
    const queueRef = ref();
    const queueTitleSuffix = ref("");
    const queueRecord = ref("刊登队列");

    const filterChangeFn = (filterData) => {
      console.log(filterData, "filterData");
      /* const _title =
        filterData.keyWordType === '1' ? filterData.keyWords : undefined;
      const _sku =
        filterData.keyWordType === '2' ? filterData.keyWords : undefined;
      const _msku =
        filterData.keyWordType === '3' ? filterData.keyWords : undefined; */
      const parmasObj = {
        sites: filterData.siteIds.join(","),
        chargePersonIds: filterData.chargePersonId.join(","),
        specsType: filterData.specsType,
        timeType: filterData.timeType,
        // siteCode: filterData.siteId,
        id: filterData.id,
        type: filterData.keyWordType,
        // status: filterData.status,
        keyWords: filterData.keyWords,
        /* sku: _sku,
        msku: _msku, */
        publishState: filterData.status,
        startTime: (filterData.rangeValue && filterData.rangeValue[0]) || "",
        endTime: (filterData.rangeValue && filterData.rangeValue[1]) || "",
      };
      pageTableRef.value?.getTableData(parmasObj, true);
    };
    const filterChange = _.debounce(filterChangeFn, 200);
    const hasSelectLen = computed(() => data.selectRow.length);

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

    const queueHandlerFunction = (res) => {
      const list = res.data ?? [];
      const statsIngNum = list.filter((item) => item.status === 1)?.length || 0;
      const statsFailNum =
        list.filter((item) => item.status === 3)?.length || 0;
      queueTitleSuffix.value = `（上传中${statsIngNum} 失败${statsFailNum}）`;
      queueRecord.value = "刊登队列" + `${statsIngNum}/${list.length}`;
      const result = list.map((item, index) => ({
        ...item,
        id: item.id || index,
      }));
      return { total: result.length, tableData: result };
    };

    const popupChange = (record, bool) => {
      data.popupOperateObj[record.id] = bool;
    };

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
        width: 200,
        customRender: ({ record }) => {
          const copyNode = record.spu ? (
            <columnCopy isAnchor={false} textValue={record.spu} />
          ) : (
            <span>{emptyValue}</span>
          );
          return (
            <div>
              <div>
                <GjTooltip content={record.defaultTitle}>
                  <div class="ellipsis">{emptyFilter(record.defaultTitle)}</div>
                </GjTooltip>
              </div>
              <div>{copyNode}</div>
            </div>
          );
        },
      },
      {
        title: "店铺",
        dataIndex: "shopName",
        width: 200,
        customRender: ({ record }) => (
          <span>{emptyFilter(record.shopName)}</span>
        ),
      },
      {
        title: "站点",
        dataIndex: "site",
        width: 150,
        customRender: ({ record }) => (
          <span>{emptyFilter(record.siteName)}</span>
        ),
      },
      {
        title: "店铺SKU",
        dataIndex: "msku",
        width: 150,
        customRender: ({ record }) => <span>{emptyFilter(record.msku)}</span>,
      },
      {
        title: "Shopee分类",
        dataIndex: "platformCategoryName",
        width: 150,
        customRender: ({ record }) => (
          <span>{emptyFilter(record.platformCategoryName)}</span>
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
                position="br"
                title="变体信息"
                record="变体"
                columns={data.variantListColumns}
                requestFunction={getDraftVariantList}
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
        title: "售价",
        dataIndex: "recommendPrice",
        width: 150,
        customRender: ({ record }) => (
          <span>
            {(record.recommendPriceUnit
              ? record.recommendPriceUnit + "："
              : "") + emptyFilter(record.recommendPrice)}
          </span>
        ),
      },
      {
        title: "完整度",
        dataIndex: "complete",
        width: 100,
        customRender: ({ record }) => {
          const statusMapFunction = (key) => {
            return record.completeInfo[key] ? "#2DA641" : "#EE7C30";
          };
          const statusInfo = {
            display: "flex",
            "justify-content": "space-between",
            padding: "0 2px",
          };
          const textStyle = {
            "margin-bottom": "5px",
            color: "#666883",
          };

          const slots = {
            default: () => (
              <span>{emptyFilter(record.completeInfo?.complete)}</span>
            ),
            content: () => {
              return (
                <div class="status-info" style={statusInfo}>
                  <div class="left-part-info">
                    <ul>
                      <li style={textStyle}>
                        <GjBadge
                          color={statusMapFunction("baseInfo")}
                          text="基础信息"
                        />
                      </li>
                      <li style={textStyle}>
                        <GjBadge
                          color={statusMapFunction("productInfo")}
                          text="产品信息"
                        />
                      </li>
                      <li style={textStyle}>
                        <GjBadge
                          color={statusMapFunction("productAttr")}
                          text="产品属性"
                        />
                      </li>
                      <li style={textStyle}>
                        <GjBadge
                          color={statusMapFunction("sellInfo")}
                          text="销售信息"
                        />
                      </li>
                      <li style={textStyle}>
                        <GjBadge
                          color={statusMapFunction("pictureVideo")}
                          text="图片信息"
                        />
                      </li>
                      <li style={textStyle}>
                        <GjBadge
                          color={statusMapFunction("description")}
                          text="商品描述"
                        />
                      </li>
                      <li style={textStyle}>
                        <GjBadge
                          color={statusMapFunction("logisticsInfo")}
                          text="物流信息"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              );
            },
          };
          return (
            <>
              {!record.completeInfo?.complete ? (
                <span>-</span>
              ) : (
                <AppPopover title="" position="bottom" v-slots={slots} />
              )}
            </>
          );
        },
      },
      {
        title: "状态",
        dataIndex: "publishState",
        width: 100,
        customRender: ({ record }) => (
          <>
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
                <GjTooltip content={record.publishFailedReason}>
                  <span>
                    <GjBadge status="warning" text="发布失败" />
                  </span>
                </GjTooltip>
              </div>
            )}
          </>
        ),
      },
      {
        title: "负责人",
        dataIndex: "chargePersonName",
        width: 130,
        customRender: ({ record }) => (
          <span>{emptyFilter(record.chargePersonName)}</span>
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
        width: 150,
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
              <GjButton type="text">
                <div class="more-wrap">
                  <SvgIcon svgClass="more-ellipse" width={16} />
                </div>
              </GjButton>
            ),
            content: () => (
              <>
                <p>
                  <GjButton
                    type="text"
                    v-permission="['Shopee/pubShopeeDraft/release']"
                    onClick={() => releaseRow(record)}
                  >
                    发布
                  </GjButton>
                </p>
                <p>
                  <GjButton
                    v-permission="['Shopee/pubShopeeDraft/copy']"
                    type="text"
                    onClick={() => copyRow(record)}
                  >
                    复制
                  </GjButton>
                </p>
                <p>
                  <GjButton
                    v-permission="['Shopee/pubShopeeDraft/timing']"
                    type="text"
                    onClick={() => setTimeRow(record)}
                  >
                    定时
                  </GjButton>
                </p>
                <p>
                  <GjButton
                    v-permission="['Shopee/pubShopeeDraft/delete']"
                    type="text"
                    onClick={() => deleteRow(record)}
                  >
                    删除
                  </GjButton>
                </p>
              </>
            ),
          };
          return (
            <div>
              {data.loadingMap[record.id] ? (
                <GjSpace>
                  <GjSpin />
                </GjSpace>
              ) : (
                <div>
                  <GjButton type="text" onClick={() => editRow(record)}>
                    编辑
                  </GjButton>
                  <GjPopover
                    popup-visible={data.popupOperateObj[record.id]}
                    onPopupVisibleChange={(bool) => popupChange(record, bool)}
                    trigger="click"
                    position="bottom"
                    v-slots={slots}
                  ></GjPopover>
                </div>
              )}
            </div>
          );
        },
      },
    ];

    const queueColumns = [
      {
        title: "标题",
        dataIndex: "title",
        width: 140,
        customRender: ({ record }) => <span>{emptyFilter(record.title)}</span>,
      },
      {
        title: "SKU",
        dataIndex: "sku",
        width: 140,
        customRender: ({ record }) => <span>{emptyFilter(record.sku)}</span>,
      },
      {
        title: "操作时间",
        dataIndex: "updatedTime",
        width: 140,
        customRender: ({ record }) => (
          <span>{formatDateTime(record.updatedTime)}</span>
        ),
      },
      {
        title: "状态",
        dataIndex: "status",
        width: 30,
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

    const createDraft = () => {
      data.draftIds = "";
      data.actionType = 1;
      data.detailVisible = true;
    };

    //批量发布
    const patchRelease = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("至少选择一条要操作的数据！");
      }
      let tempItem = null;
      for (let i = 0; i < data.selectRow.length; i++) {
        tempItem = data.selectRow[i];
        if (tempItem.publishState !== 1 && tempItem.publishState !== 3) {
          return GjMessage.warning("所选草稿暂时不可发布，请稍后再试！");
        }
        if (
          !tempItem.completeInfo ||
          tempItem.completeInfo.complete !== "7/7"
        ) {
          return GjMessage.warning("选中的草稿需要补充完整信息才能发布！");
        }
      }
      data.releaseCurrentRow = data.selectRow;
      data.releaseTitle = "批量发布";
      data.releaseContent = `即将发布${hasSelectLen.value}个草稿，是否确认发布？`;
      data.releaseVisible = true;
    };

    //批量删除
    const patchDelete = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("至少选择一条要操作的数据！");
      }
      let tempItem = null;
      for (let i = 0; i < data.selectRow.length; i++) {
        tempItem = data.selectRow[i];
        if (tempItem.publishState !== 1 && tempItem.publishState !== 3) {
          return GjMessage.warning("所选草稿暂时不可删除，请稍后再试！");
        }
      }
      data.deleteRowIds = data.selectRow.map((it) => it.id);
      data.visible = true;
    };

    //批量定时发布
    const patchSetTimeRow = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("至少选择一条要操作的数据！");
      }
      let tempItem = null;
      for (let i = 0; i < data.selectRow.length; i++) {
        tempItem = data.selectRow[i];
        if (tempItem.publishState !== 1 && tempItem.publishState !== 3) {
          return GjMessage.warning("当前状态无法操作");
        }
        if (
          !tempItem.completeInfo ||
          tempItem.completeInfo.complete !== "7/7"
        ) {
          return GjMessage.warning("选中的草稿需要补充完整信息才能发布！");
        }
      }

      data.timeRow = data.selectRow;
      data.timingModalVisible = true;
    };

    const editRow = (row) => {
      if (row.publishState !== 1 && row.publishState !== 3) {
        return GjMessage.warning("当前状态无法操作");
      }
      data.actionType = 2;
      data.draftIds = row.id;
      data.detailVisible = true;
    };
    // 单个发布
    const releaseRow = (record) => {
      data.popupOperateObj[record.id] = false;
      if (record.publishState !== 1 && record.publishState !== 3) {
        return GjMessage.warning("当前状态无法操作");
      }
      // 完整度校验
      if (!record.completeInfo || record.completeInfo.complete !== "7/7") {
        return GjMessage.warning("选中的草稿需要补充完整信息才能发布！");
      }
      data.releaseTitle = "发布";
      data.releaseContent = "您即将发布1条刊登草稿，是否继续？";
      data.releaseVisible = true;
      data.releaseCurrentRow = record;
    };
    const copyRow = (record) => {
      data.popupOperateObj[record.id] = false;
      if (record.publishState !== 1 && record.publishState !== 3) {
        return GjMessage.warning("当前状态无法操作");
      }
      data.actionType = 3;
      data.draftIds = record.id;
      data.detailVisible = true;
    };
    const setTimeRow = (record) => {
      data.popupOperateObj[record.id] = false;
      if (record.publishState !== 1 && record.publishState !== 3) {
        return GjMessage.warning("当前状态无法操作");
      }
      if (!record.completeInfo || record.completeInfo.complete !== "7/7") {
        return GjMessage.warning("选中的草稿需要补充完整信息才能发布！");
      }
      data.timeRow = [record];
      data.timingModalVisible = true;
    };
    const timingModalOk = () => {
      data.timingModalVisible = false;
      pageTableRef.value?.getTableData(null, true);
    };
    const timingModalCancel = () => {
      data.timingModalVisible = false;
    };
    const deleteRow = (record) => {
      data.popupOperateObj[record.id] = false;
      if (record.publishState !== 1 && record.publishState !== 3) {
        return GjMessage.warning("所选草稿暂时不可删除，请稍后再试！");
      }
      data.visible = true;
      data.deleteRowIds = [record.id];
    };
    const deleteFn = (params) => {
      deleteDraft(params)
        .then(() => {
          const n = params.ids?.length;
          GjMessage.success(`删除成功${n}个草稿！`);
          pageTableRef.value?.getTableData(null, true);
        })
        .catch(() => {
          GjMessage.error("删除失败，请重试！");
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
    // 批量发布- 确定
    const releaseOk = () => {
      if (Array.isArray(data.releaseCurrentRow)) {
        const ids = data.releaseCurrentRow.map((item) => item.id);
        ids.forEach((id) => {
          data.loadingMap[id] = true;
        });
        releaseDraft({
          draftIds: ids,
          onlineType: 1,
        })
          .then((rsp) => {
            if (rsp.code === 200) {
              GjMessage.success("发布任务已提交，请稍后查看");
            }
            // 开启轮询
            pageTableRef.value?.getTableData(null, true);
          })
          .catch(() => {
            ids.forEach((id) => {
              data.loadingMap[id] = false;
            });
          });
      } else {
        data.loadingMap[data.releaseCurrentRow.id] = true;
        releaseDraft({
          draftIds: [data.releaseCurrentRow.id],
          onlineType: 1,
        })
          .then(() => {
            // 开启轮询
            pageTableRef.value?.getTableData(null, true);
          })
          .catch(() => {
            data.loadingMap[data.releaseCurrentRow.id] = false;
          });
      }
      data.releaseVisible = false;
    };
    // 批量发布- 取消
    const releaseCancel = () => {
      data.deleteRowIds = [];
      data.releaseVisible = false;
    };

    const detailDialogUpdate = () => {
      data.detailVisible = false;
      clearStore();
      pageTableRef.value?.getTableData(null, true);
    };

    const detailDialogCancel = () => {
      data.detailVisible = false;
      clearStore();
    };
    watch(
      () => data.detailVisible,
      (value) => {
        if (!value) {
          // 清空store数据
          clearStore();
        }
      }
    );

    const copyColum = (row) => {
      copy(row.spu);
    };

    const btnList = [
      {
        text: "添加草稿",
        handler: createDraft,
        type: "primary",
        permission: ["Shopee/pubShopeeDraft/create"],
      },
      {
        text: "批量发布",
        handler: patchRelease,
        class: "gray-border",
        permission: ["Shopee/pubShopeeDraft/batchRelease"],
      },
      {
        text: "批量删除",
        handler: patchDelete,
        class: "gray-border",
        permission: ["Shopee/pubShopeeDraft/batchDelete"],
      },
      {
        text: "批量定时发布",
        handler: patchSetTimeRow,
        class: "gray-border",
        permission: ["Shopee/pubShopeeDraft/batchTiming"],
      },
    ];

    /**
     * tag
     */
    const resetHandler = () => {
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

    return {
      ...toRefs(data),
      siteList,
      timeOpt4,
      titleListOpt3,
      getDraftTableList,
      btnList,
      normalFilterRef,
      pageTableRef,
      queueRef,
      queueTitleSuffix,
      queueRecord,
      hasSelectLen,
      tableColumns,
      queueColumns,
      filterChange,
      createDraft,
      patchRelease,
      patchDelete,
      detailDialogUpdate,
      detailDialogCancel,
      editRow,
      releaseRow,
      copyRow,
      setTimeRow,
      timingModalOk,
      timingModalCancel,
      deleteRow,
      handleOk,
      handleCancel,
      copyColum,
      handlerFunction,
      queueHandlerFunction,
      releaseOk,
      releaseCancel,
      resetHandler,
      changeFilterSelect,
      changeList,
      getDraftVariantList,
      getQueueInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
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
:deep(svg.icon) {
  margin-left: 3px;
}

:deep(.more-wrap) {
  height: 22px;
  width: 22px;
  text-align: center;
  vertical-align: bottom;
  border-radius: 4px;
  color: #4e5969;
  cursor: pointer;
  /*  &:hover {
    background: #f2f3f5;
    border-radius: 4px;
  }
  &:active {
    background: #e5e6eb;
    border-radius: 4px;
  } */
  svg.more-ellipse {
    position: relative;
    top: 3px;
  }
}
.selected-val {
  margin-left: 4px;
  color: #000430;
  span {
    color: #0045f0;
  }
}
.gray-border {
  border-color: #e6e6ed;
  background-color: #fff;
}
/deep/.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
