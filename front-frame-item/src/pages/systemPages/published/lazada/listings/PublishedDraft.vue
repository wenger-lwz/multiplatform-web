<template>
  <CommonPage
    class="common-page-draft"
    currentRouterPermission="LZD/publishedDraft/view"
    :pageRest="true"
    @common-page-rest="resetHandler"
  >
    <template #tag-content>
      <TagGroup v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #filter-content>
      <SelectCondition
        ref="normalFilterRef"
        :timeOpt="timeOpt1"
        :titleListOpt="titleListOpt3"
        :showItem="[
          'shopId',
          'siteId',
          'status',
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
            v-permissions="['LZD/publishedDraft/add']"
            @click="createDraft"
            >添加草稿</gj-button
          >
          <gj-popconfirm
            position="bl"
            :content="`即将发布${hasSelectLen}条刊登草稿，是否继续？`"
            :popup-visible="releaseModalVisible"
            @ok="releaseFn"
            @cancel="releaseModalVisible = false"
          >
            <gj-button
              type="plain"
              v-permissions="['LZD/publishedDraft/patchRelease']"
              @click="verifyPatchRelease"
              >批量发布</gj-button
            >
          </gj-popconfirm>
          <gj-popconfirm
            position="bl"
            :content="`即将删除${hasSelectLen}条草稿，是否删除？`"
            :popup-visible="deleteModalVisible"
            @ok="deleteFn"
            @cancel="deleteModalVisible = false"
          >
            <gj-button
              type="plain"
              v-permissions="['LZD/publishedDraft/patchDelete']"
              @click="verifyPatchDelete"
              >批量删除</gj-button
            >
          </gj-popconfirm>
          <gj-button
            type="plain"
            v-permissions="['LZD/publishedDraft/patchOnTimeRelease']"
            @click="patchSetTimeRow"
            >批量定时发布</gj-button
          >
          <p class="selection-length">
            已选
            <span>{{ hasSelectLen }}</span>
          </p>
        </template>
        <template #right>
          <AppTablePopover
            ref="queueRef"
            style="width: 600px"
            title="刊登队列"
            :reqUntilShow="false"
            :titleSuffix="queueTitleSuffix"
            :record="queueRecord"
            :columns="queueColumns"
            :requestFunction="getQueueInfo"
            :handlerFunction="queueHandlerFunction"
            :paramObj="{ platformCode: 'LAZADA', businessType: '1' }"
          >
            <span class="queue-list-btn">{{ queueRecord }}</span>
          </AppTablePopover>
        </template>
      </OperateBar>
    </template>
    <template #table-content>
      <ListPageTable
        ref="pageTableRef"
        :colunms="tableColumns"
        :requestApi="getDraftTableList"
        v-model:selectRow="selectRow"
        @table-data-change="tableDataChange"
      ></ListPageTable>
      <PublishedDraftDetail
        v-if="detailVisible"
        :pids="draftIds"
        :requestApi="getDraftDetail"
        :parmas="{ id: draftIds }"
        :dialogType="actionType"
        :dialogVisible="detailVisible"
        @update-table-list="detailDialogUpdate"
        @update-table-list-load="detailDialogUpdateAndLoad"
        @cancel="detailDialogCancel"
      />
      <TimingModal
        v-if="timingModalVisible"
        :timeRow="timeRow"
        :visible="timingModalVisible"
        @handleOk="timingModalOk"
        @handleCancel="timingModalVisible = false"
      ></TimingModal>
    </template>
  </CommonPage>
</template>

<script>
import {
  computed,
  reactive,
  toRefs,
  ref,
  resolveComponent,
  defineComponent,
  watch,
} from "vue";
import _ from "lodash";
import { GjMessage } from "@gj/atom";
import { setDefaultView, getDefaultView } from "@/api/publicColumn";
import {
  specificationList,
  timeOpt1,
  titleListOpt3,
  variantListColumns,
} from "@pagesSystem/published/lazada/config";
import { useChangeList } from "@pagesSystem/published/lazada/hooks";
import { emptyFilter, formatDateTime, emptyValue } from "@/utils/format";
import {
  getDraftTableList,
  getDraftVariantList,
  deleteDraft,
  releaseDraft,
  patchReleaseDraft,
  getDraftDetail,
} from "@/api/published/lazada";
import { getQueueInfo } from "@/api/public";
import { clearStore } from "@/utils/common";

import CommonPage from "@/components/CommonPage.vue";
import TagGroup from "@/components/TagGroup.vue";
import OperateBar from "@/components/OperateBar.vue";
import columnCopy from "@/components/columnCopy.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import AppPopover from "@/components/AppPopover.vue";
import SelectCondition from "@pagesSystem/published/lazada/components/common/SelectCondition.vue";
import AppTablePopover from "@/components/AppTablePopover.vue";
import PublishedDraftDetail from "@pagesSystem/published/lazada/components/publishedDraft/PublishedDraftDetail.vue";
import ListPageTable from "@pagesSystem/published/lazada/components/common/ListPageTable.vue";
import TimingModal from "@pagesSystem/published/lazada/components/common/TimeModal.vue";

export default defineComponent({
  name: "LZD_PublishedDraft",
  components: {
    CommonPage,
    TagGroup,
    OperateBar,
    SelectCondition,
    /* eslint-disable */
    columnCopy,
    SvgIcon,
    OpbtnGroup,
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
      releaseModalVisible: false,
      deleteModalVisible: false,

      deleteRowIds: [],
      detailVisible: false,
      loadingMap: {},
      timingModalVisible: false,
      timeRow: [],
    });

    const GbImage = resolveComponent("GbImage");
    const GjBadge = resolveComponent("GjBadge");
    const GjTooltip = resolveComponent("GjTooltip");
    const GjSpin = resolveComponent("GjSpin");
    const GjSpace = resolveComponent("GjSpace");
    const SvgIcon = resolveComponent("SvgIcon");
    const GbText = resolveComponent("GbText");

    const pageTableRef = ref();
    const normalFilterRef = ref();
    const queueRef = ref();
    const queueTitleSuffix = ref("");
    const queueRecord = ref("刊登队列");
    const hasSelectLen = computed(() => data.selectRow.length);
    let needToLoadId = null;

    const getData = (filterData) => {
      const keyMap = {
        1: "title",
        2: "sku",
        3: "msku",
      };
      const parmasObj = {
        chargePerson: filterData.chargePersonId,
        siteCode: filterData.siteId,
        shopId: filterData.shopId,
        status: filterData.status,
        [keyMap[filterData.keyWordType]]: filterData.keyWord,
        timeType: filterData.timeType === "1" ? "createTime" : "publishTime",
        startTime: filterData.rangeValue?.[0] || "",
        endTime: filterData.rangeValue?.[1] || "",
      };
      pageTableRef.value?.getTableData(parmasObj, true);
    };
    const filterChange = _.debounce(getData, 200);

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
      if (needToLoadId) {
        data.loadingMap[needToLoadId] = true;
        if (!tableTimer) {
          timce = 0;
          beginTableTimer();
        }
      }
      // 清空
      needToLoadId = null;
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
        item.skuAttr?.forEach((it) => {
          itemObj[it.label] = it.attrValue;
        });
        result.push(itemObj);
      });
      dkrColumns = list
        .map((item) => item.skuAttr?.map((it) => it.label))
        .flat(1);
      dkrColumns = [...new Set(dkrColumns)];
      dkrColumns = dkrColumns.map((item) => ({
        title: item,
        dataIndex: item,
        minWidth: 130,
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

    const getBtnList = () => {
      return [
        {
          label: "编辑",
          click: (row) => editRow(row),
          permission: ["LZD/publishedDraft/edit"],
          outside: true,
        },
        {
          label: "发布",
          click: (row) => releaseRowFn(row),
          tooltipContent: "即将发布1条刊登草稿，是否继续？",
          permission: ["LZD/publishedDraft/release"],
          isPopConfirm: true,
        },
        {
          label: "复制",
          click: (row) => copyRow(row),
          permission: ["LZD/publishedDraft/copy"],
          isPopConfirm: false,
        },
        {
          label: "定时",
          click: (row) => setTimeRow(row),
          permission: ["LZD/publishedDraft/onTimeRelease"],
          isPopConfirm: false,
        },
        {
          label: "删除",
          click: (row) => deleteRow(row),
          tooltipContent: "此操作不可逆，是否删除？",
          permission: ["LZD/publishedDraft/delete"],
          isPopConfirm: true,
          isDel: true,
        },
      ];
    };

    const tableColumns = [
      {
        fixed: "left",
        title: "图片",
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
        title: "店铺",
        dataIndex: "shopName",
        width: 150,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.shopName)}</GbText>
        ),
      },
      {
        title: "站点",
        dataIndex: "siteName",
        width: 100,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.siteName)}</GbText>
        ),
      },
      {
        title: "店铺SKU",
        dataIndex: "msku",
        width: 150,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.msku)}</GbText>
        ),
      },
      {
        title: "Lazada分类",
        dataIndex: "platformCategoryName",
        width: 200,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.platformCategoryName)}</GbText>
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
          <div class="recommendPrice-warp">
            <GbText>
              {(record.recommendPriceUnit
                ? record.recommendPriceUnit + "："
                : "") + emptyFilter(record.recommendPrice)}
            </GbText>
            <span>
              {record.siteCode === "cb" ? (
                <GjTooltip content="本售价默认美元，详细信息请前往编辑页面查看">
                  <SvgIcon svgClass="arrowYiWen" width={15}></SvgIcon>
                </GjTooltip>
              ) : null}
            </span>
          </div>
        ),
      },
      {
        title: "完整度",
        dataIndex: "status",
        width: 100,
        customRender: ({ record }) => {
          const statusMapFunction = (key) => {
            return record.completeInfo?.[key] ? "#2DA641" : "#EE7C30";
          };
          const slots = {
            default: () => (
              <span class="copy-item">
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
                          color={statusMapFunction("base")}
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
                          color={statusMapFunction("attribute")}
                          text="产品属性"
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
                          color={statusMapFunction("image")}
                          text="图片信息"
                        />
                      </li>
                      <li>
                        <GjBadge
                          color={statusMapFunction("warranty")}
                          text="保修服务"
                        />
                      </li>
                      <li>
                        <GjBadge
                          color={statusMapFunction("packageInfo")}
                          text="包装信息"
                        />
                      </li>
                    </ul>
                  </div>
                  <div class="right-part-info" style="margin-left: 12px;">
                    <ul>
                      <li>
                        <GjBadge
                          color={statusMapFunction("longDescription")}
                          text="长描述"
                        />
                      </li>
                      <li>
                        <GjBadge
                          color={statusMapFunction("shortDescription")}
                          text="短描述"
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
                <AppPopover title="" position="bottom" v-slots={slots} />
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
                {record.failReason ? (
                  <GjTooltip content={record.failReason}>
                    <span>
                      <GjBadge status="warning" text="发布失败" />
                    </span>
                  </GjTooltip>
                ) : (
                  <span>
                    <GjBadge status="warning" text="发布失败" />
                  </span>
                )}
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
        width: 170,
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
        width: 170,
        customRender: ({ record }) => (
          <span>
            {record.publishMode === "2" &&
            record.publishZone &&
            record.enableTime
              ? (record.siteCode || emptyValue) + ": "
              : ""}
            {record.publishMode === "2" && !record.enableTime
              ? emptyValue
              : formatDateTime(record.publishTime)}
          </span>
        ),
      },
      {
        title: "",
        dataIndex: "action",
        fixed: "right",
        width: 130,
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

    const queueColumns = [
      {
        title: "标题",
        dataIndex: "title",
        width: 140,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.title)}</GbText>
        ),
      },
      {
        title: "SKU",
        dataIndex: "sku",
        width: 140,
        customRender: ({ record }) => (
          <GbText>{emptyFilter(record.sku)}</GbText>
        ),
      },
      {
        title: "操作时间",
        dataIndex: "updatedTime",
        width: 140,
        customRender: ({ record }) => (
          <GbText>{formatDateTime(record.updatedTime)}</GbText>
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

    const vertifyCommonFn = (
      vertifyLen,
      vertifySatus,
      vertifyComplete,
      row
    ) => {
      if (vertifyLen && hasSelectLen.value <= 0) {
        GjMessage.warning("请至少选择一条要操作的数据！");
        return false;
      }
      if (!vertifySatus && !vertifyComplete) {
        return true;
      }
      const arr = row ? [row] : data.selectRow;
      // const arr = row || data.selectRow;
      let tempItem = null;
      for (let i = 0; i < arr.length; i++) {
        tempItem = arr[i];
        if (data.loadingMap[tempItem.id]) {
          GjMessage.warning("当前状态无法操作");
          return false;
        }
        if (
          tempItem.publishState !== 1 &&
          tempItem.publishState !== 3 &&
          vertifySatus
        ) {
          GjMessage.warning("当前状态无法操作");
          return false;
        }
        if (
          vertifyComplete &&
          (!tempItem.completeInfo || tempItem.completeInfo.complete !== "9/9")
        ) {
          GjMessage.warning("请补全商品信息");
          return false;
        }
      }
      return true;
    };

    //批量发布
    const verifyPatchRelease = () => {
      if (vertifyCommonFn(true, true, true)) {
        data.releaseModalVisible = true;
      }
    };

    //批量删除
    const verifyPatchDelete = () => {
      if (vertifyCommonFn(true, true, false)) {
        data.deleteRowIds = data.selectRow.map((it) => it.id);
        data.deleteModalVisible = true;
      }
    };

    //批量定时发布
    const patchSetTimeRow = () => {
      if (vertifyCommonFn(true, true, true)) {
        data.timeRow = data.selectRow;
        data.timingModalVisible = true;
      }
    };

    const editRow = (row) => {
      if (vertifyCommonFn(false, true, false, row)) {
        data.actionType = 2;
        data.draftIds = row.id;
        data.detailVisible = true;
      }
    };

    const copyRow = (row) => {
      if (vertifyCommonFn(false, true, false, row)) {
        data.actionType = 1;
        data.draftIds = row.id;
        data.detailVisible = true;
      }
    };
    const setTimeRow = (row) => {
      if (vertifyCommonFn(false, true, true, row)) {
        data.timeRow = [row];
        data.timingModalVisible = true;
      }
    };
    const timingModalOk = () => {
      data.timingModalVisible = false;
      timce = 0;
      clearTableTimer();
      pageTableRef.value?.getTableData(null, true);
    };

    const deleteRow = (row) => {
      if (vertifyCommonFn(false, true, false, row)) {
        data.deleteRowIds = [row.id];
        deleteFn();
      }
    };

    const deleteFn = () => {
      const params = { ids: data.deleteRowIds };
      deleteDraft(params)
        .then(() => {
          const n = params.ids?.length;
          GjMessage.success(`删除成功${n}个草稿！`);
          pageTableRef.value?.getTableData(null, true);
        })
        // .catch(() => {
        //   GjMessage.error("删除失败，请重试！");
        // });
        .finally(() => {
          data.deleteModalVisible = false;
        });
    };

    // 批量发布- 确定
    const releaseFn = () => {
      const ids = data.selectRow.map((item) => item.id);
      ids.forEach((id) => {
        data.loadingMap[id] = true;
      });
      patchReleaseDraft({
        ids: ids,
      })
        .then(() => {
          GjMessage.success("发布任务已提交，请稍后查看！");
          // 开启轮询
          timce = 0;
          beginTableTimer();
        })
        .catch(() => {
          // GjMessage.error("发布任务提交失败，请重试！");
          ids.forEach((id) => {
            data.loadingMap[id] = false;
          });
        })
        .finally(() => {
          data.releaseModalVisible = false;
        });
    };

    const releaseRowFn = (row) => {
      if (!vertifyCommonFn(false, true, true, row)) {
        return;
      }
      const { id } = row;
      data.loadingMap[id] = true;
      releaseDraft({
        listingId: id,
      })
        .then(() => {
          GjMessage.success("发布任务已提交，请稍后查看！");
          // 开启轮询
          timce = 0;
          beginTableTimer();
        })
        .catch(() => {
          // GjMessage.error("发布任务提交失败，请重试！");
          data.loadingMap[id] = false;
        });
    };

    const detailDialogUpdate = () => {
      pageTableRef.value?.getTableData(null, true);
      data.detailVisible = false;
      clearStore();
    };

    const detailDialogUpdateAndLoad = (id) => {
      pageTableRef.value?.getTableData(null, true);
      queueRef.value?.resetHandler();
      data.detailVisible = false;
      clearStore();
      needToLoadId = id;
    };

    const detailDialogCancel = () => {
      data.detailVisible = false;
      clearStore();
    };

    const resetHandler = () => {
      data.releaseModalVisible = false;
      data.deleteModalVisible = false;
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
      setDefaultView,
      getDefaultView,
      timeOpt1,
      titleListOpt3,
      getDraftTableList,
      getDraftDetail,
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
      releaseFn,
      detailDialogUpdate,
      detailDialogUpdateAndLoad,
      detailDialogCancel,
      editRow,
      copyRow,
      setTimeRow,
      timingModalOk,
      deleteRow,
      deleteFn,
      verifyPatchRelease,
      verifyPatchDelete,
      patchSetTimeRow,
      tableDataChange,
      handlerFunction,
      queueHandlerFunction,
      resetHandler,
      getDraftVariantList,
      getQueueInfo,
      changeFilterSelect,
      changeList,
    };
  },
});
</script>

<style lang="scss" scoped>
// 刊登队列
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

:deep(.copy-item) {
  color: #0045f0;
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

:deep(.recommendPrice-warp) {
  display: flex;
  svg.arrowYiWen {
    width: 20px;
    position: relative;
    top: 1px;
  }
}
</style>
