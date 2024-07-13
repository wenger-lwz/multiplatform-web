<template>
  <CommonPage :pageRest="true" @common-page-rest="resetHandler">
    <template #tag-content>
      <TagGroup v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #filter-content>
      <SelectCondition
        ref="normalFilterRef"
        :timeOpt="timeOpt2"
        :titleListOpt="titleListOpt2"
        :showItem="['shopId', 'keyWord', 'hideTitle']"
        @filter-change="filterChange"
        @tag-change="changeList"
      />
    </template>
    <template #operate_bar-content>
      <OperateBar>
        <template #left>
          <gj-button type="primary" class="gray-border" @click="createTemplate"
            >添加模板</gj-button
          >
          <gj-popconfirm
            position="bl"
            :content="`您即将同步${hasSelectLen}个在线商品，同步后系统商品Listing为当前平台商品的在线Listing信息，是否继续？`"
            :popup-visible="syncModalVisible"
            @ok="syncFn"
            @cancel="syncModalVisible = false"
          >
            <gj-button type="primary" class="gray-border" @click="patchDelete"
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
        :colunms="tableColumns"
        :requestApi="getLogisticList"
        v-model:selectRow="selectRow"
        @table-data-change="tableDataChange"
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

      <LogisticsDetail
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
              v-for="item in shopListOpt"
              :key="item.shopId"
            ></gj-option>
          </gj-select>
        </div>
      </gj-modal>
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
import LogisticsDetail from "@pagesSystem/published/shopee/template/logisticsTemplate/LogisticsDetail.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import columnCopy from "@/components/columnCopy.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { emptyFilter, formatDateTime } from "@/utils/format";
import {
  getLogisticList,
  getListingVariantList,
  onGlobalSync,
  listingBatchPush,
  listingDown,
  getGlobalDetail,
  onGlobalpublish,
  delLogisticsTemplate,
} from "@/api/published/shopee";
import { getListingCommonShop } from "@/api/published/common";
import { getQueueInfo } from "@/api/public";

import {
  variantListColumns,
  timeOpt2,
  titleListOpt2,
  useChangeList,
} from "../../config";

export default defineComponent({
  name: "LogisticsTemplate",
  components: {
    CommonPage,
    TagGroup,
    SelectCondition,
    OperateBar,
    ListPageTable,
    LogisticsDetail,
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
      visible: false,
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

    const GjSpace = resolveComponent("GjSpace");
    const GjSpin = resolveComponent("GjSpin");
    const GbText = resolveComponent("GbText");

    /**
     * 更新隊列
     */
    const queueRef = ref();
    const queueTitleSuffix = ref("");
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

    const getBtnList = () => {
      return [
        {
          label: "编辑",
          outside: true,
          // permission: ["LZD/commodityInformation/view"],
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
          label: "删除",
          // permission: ["LZD/commodityInformation/copy"],
          isPopConfirm: false,
          tooltipContent: "此操作不可逆，是否删除？",
          click: (row) => {
            deleteRow([row.id]);
          },
        },
      ];
    };

    const tableColumns = [
      {
        key: "templateName",
        dataIndex: "templateName",
        title: "模板名称",
        minWidth: 150,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.templateName)}</GbText>;
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
        key: "createdBy",
        dataIndex: "createdBy",
        title: "创建人",
        minWidth: 100,
        customRender: ({ record }) => {
          return <GbText>{emptyFilter(record.createdBy)}</GbText>;
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

    const getData = (filterData) => {
      const parmasObj = {
        id: "",
        shopIds: filterData.shopId,
        templateName: filterData.keyWord,
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

    const verifyPatchListDown = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请请至少选择一条要操作的数据！");
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
        return GjMessage.warning("请请至少选择一条要操作的数据！");
      }
      for (let i = 0; i < data.selectRow.length; i++) {
        if (data.loadingMap[data.selectRow[i].id]) {
          return GjMessage.warning("所选商品暂时不可同步，请稍后再试！");
        }
      }
      data.syncModalVisible = true;
    };

    //批量删除
    const patchDelete = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }

      data.deleteRowIds = data.selectRow.map((it) => it.id);
      data.visible = true;
    };

    const handleCancel = () => {
      data.deleteRowIds = [];
      data.visible = false;
    };

    const deleteFn = (params) => {
      delLogisticsTemplate(params)
        .then(() => {
          const n = params.ids?.length;
          GjMessage.success(`已删除${n}个组件模板！`);
          pageTableRef.value?.getTableData(null, true);
        })
        .catch(() => {
          GjMessage.error("删除失败，若要删除请重试！");
        });
    };

    const handleOk = () => {
      deleteFn({ ids: data.deleteRowIds });
      data.visible = false;
    };

    const deleteRow = (record) => {
      data.visible = true;
      data.deleteRowIds = [record.id];
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

    const createTemplate = () => {
      data.draftIds = "";
      data.actionType = 1;
      data.detailVisible = true;
    };

    const verifyPatchUpdate = () => {
      if (hasSelectLen.value <= 0) {
        return GjMessage.warning("请请至少选择一条要操作的数据！");
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
      console.log(data.releaseCurrentRow, "data.releaseCurrentRow");
      if (data.shopValList.length == 0) {
        return false;
      }
      if (Array.isArray(data.releaseCurrentRow)) {
        const ids = data.releaseCurrentRow.map((item) => item);
        ids.forEach((id) => {
          data.loadingMap[id] = true;
        });
        onGlobalpublish({
          ids: ids,
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
      }
      data.releaseVisible = false;
    };

    // 批量发布- 取消
    const releaseCancel = () => {
      // data.deleteRowIds = [];
      data.releaseVisible = false;
    };

    // 单个发布
    const releaseRow = (record) => {
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
      data.releaseCurrentRow = record;
    };

    const getListingShopReq = () => {
      getListingCommonShop({ platformCode: "SHOPEE" }).then((res) => {
        data.shopListOpt = res.data;
      });
    };

    const shopChange = (val) => {
      console.log(val);
      data.shopValList = val;
    };

    onMounted(() => {
      getListingShopReq();
    });

    return {
      ...toRefs(data),
      getQueueInfo,
      getListingVariantList,
      timeOpt2,
      queueRef,
      queueTitleSuffix,
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
      getLogisticList,
      getGlobalDetail,
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
      patchDelete,
      handleCancel,
      handleOk,
      deleteFn,
      deleteRow,
      createTemplate,
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
</style>
