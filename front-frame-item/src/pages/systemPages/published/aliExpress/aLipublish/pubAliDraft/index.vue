<template>
  <!-- 刊登草稿列表 -->
  <CommonPage :pageRest="true" @common-page-rest="resetSearch">
    <template #tag-content>
      <gb-default-view
        :id="'ALI_pubAliDraft_view'"
        :code="0"
        :get-list="getList"
        :post-list="postList"
        :query-map="queryMap"
        @del-query-condition="delQueryCondition"
        @change-query-list="changeQueryList"
      >
      </gb-default-view>
    </template>
    <template #filter-content>
      <!-- 店铺 -->
      <gb-select
        class="search-gb-select"
        placeholder="店铺"
        :allow-clear="false"
        v-model="formDataSearch.shopIds"
        :max-tag-count="1"
        @confirm="shopNameChange"
        @remove="shopNameChange"
      >
        <gb-select-option
          v-for="item in shopList"
          :key="item.shopId"
          :value="item.shopId"
        >
          {{ item.shopName }}
        </gb-select-option>
      </gb-select>

      <!-- 状态 -->
      <gj-select
        v-model="formDataSearch.publishState"
        placeholder="状态"
        @change="publishStateChange"
        class="search-select"
      >
        <gj-option
          v-for="(item, index) in publishStateList"
          :key="index"
          :value="item.value"
          >{{ item.label }}</gj-option
        >
      </gj-select>

      <!-- 标题 -->

      <gj-input-group>
        <gj-select
          class="search-select-left"
          placeholder="请选择"
          v-model="formDataSearch.type"
          :trigger-props="{ autoFitPopupMinWidth: true }"
          @change="keywordEnter"
        >
          <gj-option :value="1">标题</gj-option>
          <gj-option :value="2">SKU/SPU</gj-option>
        </gj-select>
        <gj-input-search
          class="search-select-rigth"
          :placeholder="keywordPLaceholder"
          v-model="formDataSearch.keyWords"
          @press-enter="keywordEnter"
          @search="keywordEnter"
        />
      </gj-input-group>

      <!-- 规格 -->
      <gj-select
        v-model="formDataSearch.specsType"
        placeholder="全部规格"
        @change="specsTypeChange"
        class="search-select"
      >
        <gj-option
          v-for="(item, index) in specsTypeList"
          :key="index"
          :value="item.value"
          >{{ item.label }}</gj-option
        >
      </gj-select>

      <!-- 负责人 -->
      <select-director
        multiple
        placeholder="负责人"
        :max-tag-count="1"
        class="search-gb-select"
        v-model="formDataSearch.chargePersonIds"
        @ok="chargePerson($event)"
      />

      <!-- 更新时间 -->

      <gj-input-group>
        <gj-select
          v-model="formDataSearch.timeType"
          placeholder="请选择"
          class="search-select-left"
          @change="dateChange(timeGroup)"
        >
          <gj-option label="创建时间" :value="1"></gj-option>
          <gj-option label="发布时间" :value="2"></gj-option>
        </gj-select>
        <gj-range-picker
          v-model="timeGroup"
          class="search-range-picker"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="dateChange(timeGroup)"
        />
      </gj-input-group>
    </template>
    <template #operate_bar-content>
      <OperateBtnGroup>
        <template #left>
          <gj-space>
            <gj-button type="primary" @click="createDrafts">添加草稿</gj-button>
            <gj-popconfirm
              :content="`即将发布${rowSelectionLength}个商品，是否确认发布？`"
              position="bl"
              :popup-visible="publishModel"
              @ok="handelBatchPublishBtn"
              @cancel="publishModel = false"
              :render-to-body="false"
            >
              <gj-button type="plain" @click="verifyBatchPublish"
                >批量发布</gj-button
              >
            </gj-popconfirm>

            <gj-button type="plain" @click="handelBatchTimingBtn"
              >批量定时</gj-button
            >
            <gj-popconfirm
              :content="`此操作不可逆，是否删除？`"
              position="bl"
              :render-to-body="false"
              :popup-visible="deleteModel"
              @ok="handelBatchDeleteBtn"
              @cancel="deleteModel = false"
              :ok-button-props="{
                status: 'danger',
              }"
            >
              <gj-button type="plain" @click="verifyBatchDelete"
                >批量删除</gj-button
              >
            </gj-popconfirm>
          </gj-space>
          <div class="quantity">
            <span class="text">已选</span>
            <span class="nember">{{ rowSelectionLength }}</span>
          </div>
        </template>
        <template #right>
          <QueuePopover :platformCode="'ALIEXPRESS'"></QueuePopover>
        </template>
      </OperateBtnGroup>
    </template>

    <template #table-content>
      <CommonTable
        ref="commonTableRef"
        :rowKey="'listingId'"
        :columns="tableColumns"
        :tableData="tableData"
        :loading="loading"
        :selectedRowKeys="selectedRowKeys"
        :rowSelectionVisiable="true"
        :pagination="pagination"
        @onRowSelection="getSelection"
        @getTableCurrent="getTableCurrent"
        @change="sortChange"
      >
        <template #bodyCell="{ record, column }">
          <div v-if="column.dataIndex === 'mainImage'">
            <gb-table-image :url="record?.mainImage"></gb-table-image>
          </div>

          <div v-if="column.dataIndex === 'spu'">
            <div class="title">
              <div class="div1">
                <gb-text>{{ record.defaultTitle }}</gb-text>
              </div>

              <div class="div2">
                <columnCopy :isAnchor="false" :textValue="record.spu" />
              </div>
            </div>
          </div>

          <div v-if="column.dataIndex === 'specsType'">
            <variantPopover
              v-if="record.specsType == 2"
              :record="record"
              :columnList="variantColumnList"
            ></variantPopover>
            <div v-if="record.specsType == 1">单品</div>
          </div>

          <div v-if="column.dataIndex === 'createTime'">
            <span>{{
              formatDateTime(record.createTime, "YYYY-MM-DD HH:mm:ss", "-")
            }}</span>
          </div>

          <div v-if="column.dataIndex === 'publishTime'">
            <span>{{
              formatDateTime(record.publishTime, "YYYY-MM-DD HH:mm:ss", "-")
            }}</span>
          </div>

          <div v-if="column.dataIndex === 'publishState'">
            <div style="display: flex; align-items: center">
              <span class="spot danger" v-if="record.publishState === 3"></span>
              <span class="spot waitting" v-else></span>
              <span v-if="record.publishState != 3">
                {{ publishState[record.publishState] }}
              </span>
              <gj-popover v-else position="bottom">
                <span>{{ publishState[record.publishState] }}</span>
                <template #content>
                  <p>{{ record.failReason }}</p>
                </template>
              </gj-popover>
              <SvgIcon
                v-if="record.publishState !== 2 && record.publishMode == 2"
                svgClass="time"
                :width="12"
                style="margin-left: 4px"
              ></SvgIcon>
            </div>
          </div>

          <div v-if="column.dataIndex === 'complete'">
            <gj-popover position="rt">
              <span
                >{{ record?.complete?.complete }} /
                {{ record?.complete?.sumComplete }}
              </span>
              <template #content>
                <div class="tip mb10">
                  <span
                    class="spot"
                    :class="
                      record?.complete?.baseInfo ? 'complete' : 'incomplete'
                    "
                  ></span
                  ><span>基础信息</span>
                </div>
                <div class="tip mb10">
                  <span
                    class="spot"
                    :class="
                      record?.complete?.productInfo ? 'complete' : 'incomplete'
                    "
                  ></span
                  ><span>产品信息</span>
                </div>
                <div class="tip mb10">
                  <span
                    class="spot"
                    :class="
                      record?.complete?.productAttr ? 'complete' : 'incomplete'
                    "
                  ></span
                  ><span>产品属性</span>
                </div>
                <div class="tip mb10">
                  <span
                    class="spot"
                    :class="
                      record?.complete?.sellInfo ? 'complete' : 'incomplete'
                    "
                  ></span
                  ><span>销售信息</span>
                </div>
                <div class="tip mb10">
                  <span
                    class="spot"
                    :class="
                      record?.complete?.pictureVideo ? 'complete' : 'incomplete'
                    "
                  ></span
                  ><span>图片视频</span>
                </div>
                <div class="tip mb10">
                  <span
                    class="spot"
                    :class="
                      record?.complete?.description ? 'complete' : 'incomplete'
                    "
                  ></span
                  ><span>商品描述</span>
                </div>
                <div class="tip">
                  <span
                    class="spot"
                    :class="
                      record?.complete?.logisticsInfo
                        ? 'complete'
                        : 'incomplete'
                    "
                  ></span
                  ><span>物流信息</span>
                </div>
              </template>
            </gj-popover>
          </div>

          <div v-if="column.dataIndex === 'action'">
            <div v-if="record.processStatus && record.processStatus == 2">
              <gj-spin />
            </div>
            <div v-else>
              <OpbtnGroup :btn-list="getBtnList()" :row="record"></OpbtnGroup>
            </div>
          </div>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <TimingModal
    :visible="timingModalVisible"
    @handleOk="handleOk"
    @handleCancel="handleCancel"
  ></TimingModal>
  <EditDialog
    v-if="editDialogVisible"
    ref="editDialog"
    :dialogVisible="editDialogVisible"
    :isCreate="isCreate"
    :editId="editId"
    @cancel="cancelEditDialog"
    @confirm="confirmEditDialog"
    :editData="editData"
  ></EditDialog>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  computed,
  ref,
} from "vue";
import SvgIcon from "@/components/SvgIcon";
import {
  getAliDraftList,
  releaseDraft,
  deleteDraft,
  batchrReleaseDraft,
  batchDeleteDraft,
  getShopList,
} from "@api/published/aliexpress";
import dayjs from "dayjs";
import { getDraftDetail } from "@api/published/aliexpress";
import QueuePopover from "@/components/QueuePopover.vue";
import TimingModal from "./components/timingModal.vue";
import CommonTable from "@/components/CommonTable.vue";
import variantPopover from "../../components/variant-popover.vue";
import EditDialog from "./components/editDialog.vue";
import SelectDirector from "@/components/SelectDirector.vue";
import { convertSelectedValue } from "@/utils/format";
import CommonPage from "@/components/CommonPage.vue";
import { setDefaultView, getDefaultView } from "@/api/publicColumn";
import OpbtnGroup from "@/components/opbtn-group.vue";
import columnCopy from "@/components/columnCopy.vue";
import OperateBtnGroup from "@/components/OperateBtnGroup.vue";
import { formatDateTime } from "@/utils/format.js";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  name: "pubAliDraft",
  props: {},
  components: {
    OpbtnGroup,
    CommonTable,
    SvgIcon,
    QueuePopover,
    TimingModal,
    variantPopover,
    EditDialog,
    SelectDirector,
    CommonPage,
    columnCopy,
    OperateBtnGroup,
  },
  setup() {
    const defaultSearch = {
      keyWords: "",
      type: 1,
      specsType: "",
      chargePersonIds: [],
      startTime: undefined,
      endTime: undefined,
      timeType: 1,
      shopIds: [],
      publishState: "",
    };
    const commonTableRef = ref();
    const selectedRow = ref([]);
    const sortedInfo = ref();
    const data = reactive({
      formatDateTime,
      variantColumnList: [
        {
          title: "店铺sku",
          dataIndex: "msku",
          width: 100,
        },
        {
          title: "库存",
          dataIndex: "quantity",
          width: 80,
        },
        {
          title: "售价",
          dataIndex: "recommendPrice",
          width: 100,
        },
      ],
      getList: getDefaultView,
      postList: setDefaultView,
      queryMap: {
        key: "",
        value: "",
        connectCode: "",
        code: "",
        cascadeKey: "",
        extra: {},
      },
      sort: "createTime",
      order: "desc",
      loading: false, //是否为加载中状态
      publishModel: false,
      timingModalVisible: false,
      deleteModel: false,
      tableData: [],
      timeGroup: [],
      formDataSearch: {
        ...defaultSearch,
      }, // 查询参数
      keywordPLaceholder: "请输入标题关键字",
      draftVisible: false, //配置草稿弹窗,
      editDialogVisible: false, //编辑/创建商品资料弹窗,
      onlineOrSyncVisible: false,
      remark: "",
      pagination: {
        total: 0,
        pageSize: 20,
        pageCurrent: 1,
      },

      isCreate: true, // true创建 false编辑
      editId: "",
      specsTypeList: [
        {
          label: "单品",
          value: 1,
        },
        {
          label: "变体",
          value: 2,
        },
      ],
      shopList: [],
      publishStateList: [
        {
          label: "待发布",
          value: 1,
        },
        {
          label: "发布失败",
          value: 3,
        },
        {
          label: "已发布",
          value: 2,
        },
      ],
      publishState: {
        1: "待发布",
        2: "已发布",
        3: "发布失败",
      },
      onlineType: 1,
      isBatch: false,
      draftId: "",
      editData: {},
    });

    const getBtnList = () => {
      return [
        {
          label: "编辑",
          click: (row) => editDraftInfo(row.listingId),
          outside: true,
          permission: ["ALI/pubAliDraft/edit"],
        },
        // {
        //   label: '发布',
        //   click: (row) => onHandleReleaseDraft(row.listingId),
        //   tooltipContent: '即将发布1个商品，是否确认发布',
        //   permission: ['ALI/pubAliDraft/release'],
        //   isPopConfirm: true,
        // },
        {
          label: "发布",
          click: (row) => onHandleReleaseDraft(row),
          permission: ["ALI/pubAliDraft/release"],
          isPopConfirm: false,
        },
        {
          label: "复制",
          click: (row) => copyDraft(row.listingId),
          permission: ["ALI/pubAliDraft/copy"],
          isPopConfirm: false,
        },
        {
          label: "定时",
          click: (row) => timingDraft(row),
          permission: ["ALI/pubAliDraft/timing"],
          isPopConfirm: false,
        },
        {
          label: "删除",
          click: (row) => onHandleDeleteDraft(row.listingId),
          tooltipContent: "此操作不可逆，是否删除？",
          permission: ["ALI/pubAliDraft/delete"],
          isPopConfirm: true,
          isDel: true,
        },
      ];
    };

    const rowSelectionLength = computed(() => {
      return selectedRowKeys.value.length;
    });

    const tableColumns = computed(() => {
      return [
        {
          title: "图片",
          dataIndex: "mainImage",
          key: "mainImage",
          fixed: "left",
          width: 70,
        },
        {
          title: "标题/SKU/SPU",
          dataIndex: "spu",
          key: "spu",
          width: 200,
        },
        {
          title: "店铺",
          dataIndex: "shopName",
          key: "shopName",
          width: 100,
          ellipsis: { showTitle: false },
          tooltip: { title: ({ value }) => value, placement: "topLeft" },
        },
        {
          title: "店铺SKU",
          dataIndex: "msku",
          key: "msku",
          width: 180,
        },
        {
          title: "AliExpress分类",
          dataIndex: "platformCategoryName",
          key: "platformCategoryName",
          width: 180,
          ellipsis: { showTitle: false },
          tooltip: { title: ({ value }) => value, placement: "topLeft" },
        },
        {
          title: "规格",
          dataIndex: "specsType",
          key: "specsType",
          width: 100,
        },
        {
          title: "售价",
          dataIndex: "recommendPrice",
          key: "recommendPrice",
          width: 160,
        },
        {
          title: "完整度",
          dataIndex: "complete",
          key: "complete",
          width: 100,
        },
        {
          title: "状态",
          dataIndex: "publishState",
          key: "publishState",
          width: 100,
        },
        {
          title: "负责人",
          dataIndex: "chargePersonName",
          key: "chargePersonName",
          width: 100,
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 180,
          showSorterTooltip: false,
          sorter: true,
        },
        {
          title: "发布时间",
          dataIndex: "publishTime",
          key: "publishTime",
          width: 180,
          showSorterTooltip: false,
          sorter: true,
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          width: 140,
          fixed: "right",
        },
      ];
    });

    const resetSearch = () => {
      data.queryMap = {};

      data.formDataSearch = { ...defaultSearch };
      data.timeGroup = [];

      sortedInfo.value = null;
      data.sort = "createTime"; //默认
      data.order = "desc"; //默认
      // 重置分页
      data.pagination.pageCurrent = 1;
      data.pagination.pageSize = 20;
      data.pagination.total = 0;

      commonTableRef.value.updateSortOrder(sortedInfo.value);

      getTableList();
    };

    //编辑草稿资料
    const editDraftInfo = (id) => {
      data.isCreate = false;
      data.editDialogVisible = true;
      data.editId = id;
      getDraftDetail(id).then((res) => {
        data.editData = res.data;
      });
    };

    //复制草稿资料
    const copyDraft = (id) => {
      data.isCreate = true;
      data.editDialogVisible = true;
      data.editId = "";

      getDraftDetail(id).then((res) => {
        data.editData = res.data;
      });
    };

    //创建商品
    const createDrafts = () => {
      data.editData = {};
      data.isCreate = true;
      data.editDialogVisible = true;
    };

    // 单条删除
    const onHandleDeleteDraft = (id) => {
      deleteDraft(id).then(() => {
        GjMessage.success("成功删除1个草稿！");

        getTableList();
      });
    };

    //配置草稿弹窗取消
    const cancel = () => {
      data.draftVisible = false;
    };
    //配置草稿弹窗确定
    const confirm = () => {
      data.draftVisible = false;
      getTableList();
    };

    //编辑/创建弹窗取消
    const cancelEditDialog = () => {
      data.editDialogVisible = false;
    };
    //编辑/创建弹窗确定
    const confirmEditDialog = () => {
      data.editDialogVisible = false;
      getTableList();
    };

    //关闭在线数量或者同步草稿弹窗
    const closeOnlineOrSyncDialog = () => {
      data.onlineOrSyncVisible = false;
    };

    const getTableList = () => {
      let params = {
        ...data.formDataSearch,
        pageSize: data.pagination.pageSize,
        pageCurrent: data.pagination.pageCurrent,
        sort: data.sort,
        order: data.order,
      };
      data.loading = true;

      getAliDraftList(params)
        .then((res) => {
          console.log(data.tableData);
          data.tableData = res.data.records;
          data.pagination.total = res.data.total;
        })
        .finally(() => {
          selectedRow.value = [];
          data.loading = false;
        });
    };

    const keywordEnter = () => {
      if (data.formDataSearch.type === 1) {
        data.keywordPLaceholder = "请输入标题关键字";
      } else {
        data.keywordPLaceholder = "请输入SKU/SPU";
      }
      const param = {
        key: data.formDataSearch.type === 1 ? "标题" : "SKU/SPU",
        value: data.formDataSearch.keyWords.trim(),
        connectCode: "keyWords",
        code: data.formDataSearch.keyWords.trim(),
        cascadeKey: "",
        extra: {
          keyWordsType: data.formDataSearch.type,
        },
      };
      changeQueryMap(param);
      commonTableRef.value.calculateWH();
      getTableList();
    };

    const chargePerson = (value) => {
      const eventValue = value.map((item) => item.value);
      let showValue = convertSelectedValue(eventValue, value);
      const param = {
        key: "负责人",
        value: showValue.join(),
        connectCode: "chargePersonIds",
        code: data.formDataSearch.chargePersonIds,
        cascadeKey: "",
        extra: {},
      };
      changeQueryMap(param);
      commonTableRef.value.calculateWH();
      getTableList();
    };

    const shopNameChange = () => {
      let showValue = convertSelectedValue(
        data.formDataSearch.shopIds,
        data.shopList,
        "shopId",
        "shopName"
      );
      const param = {
        key: "店铺",
        value: showValue.join(),
        connectCode: "shopIds",
        code: data.formDataSearch.shopIds,
        cascadeKey: "",
        extra: {},
      };
      changeQueryMap(param);
      commonTableRef.value.calculateWH();
      getTableList();
    };

    const publishStateChange = () => {
      const param = {
        key: "状态",
        value: convertSelectedValue(
          [data.formDataSearch.publishState],
          data.publishStateList
        ).join(),
        connectCode: "publishState",
        code: data.formDataSearch.publishState,
        cascadeKey: "",
        extra: {},
      };
      changeQueryMap(param);
      commonTableRef.value.calculateWH();
      getTableList();
    };

    const specsTypeChange = () => {
      const param = {
        key: "规格",
        value: convertSelectedValue(
          [data.formDataSearch.specsType],
          data.specsTypeList
        ).join(),
        connectCode: "specsType",
        code: data.formDataSearch.specsType,
        cascadeKey: "",
        extra: {},
      };
      changeQueryMap(param);
      commonTableRef.value.calculateWH();
      getTableList();
    };

    const dateChange = (val) => {
      let value = "";
      if (val.length > 0) {
        data.formDataSearch.startTime = val[0];
        data.formDataSearch.endTime = val[1];
        value = `${dayjs(val[0]).format("YYYY-MM-DD")} -
          ${dayjs(val[1]).format("YYYY-MM-DD")}`;
      } else {
        data.formDataSearch.startTime = "";
        data.formDataSearch.endTime = "";
        value = "";
      }
      const param = {
        key: data.formDataSearch.timeType === 1 ? "创建时间" : "发布时间",
        value: value,
        connectCode: "timeType",
        code: data.timeGroup,
        cascadeKey: "",
        extra: {
          // type: 'timeType',
          timeType: data.formDataSearch.timeType,
        },
      };
      changeQueryMap(param);
      commonTableRef.value.calculateWH();
      getTableList();
    };

    const goBack = () => {
      data.editDialogVisible = false;
    };

    //发布商品
    const onHandleReleaseDraft = (record) => {
      if (!record.complete || record.complete.complete !== 7) {
        return GjMessage.warning("选中的草稿需要补充完整信息才能定时发布！");
      }

      data.isBatch = false;
      releaseDraft({
        draftId: record.listingId,
        onlineType: 1,
      }).then(() => {
        GjMessage.success("发布任务已提交，请稍后查看!");
        getTableList();
      });
    };

    //定时发布商品
    const timingDraft = (record) => {
      if (!record.complete || record.complete.complete !== 7) {
        return GjMessage.warning("选中的草稿需要补充完整信息才能定时发布！");
      }

      data.isBatch = false;
      data.timingModalVisible = true;
      data.draftId = record.listingId;
    };
    //批量发布前验证
    const verifyBatchPublish = () => {
      if (selectedRowKeys.value.length <= 0) {
        return GjMessage.warning("至少选择一条要操作的数据!");
      }

      let tempItem = null;
      for (let i = 0; i < selectedRow.value.length; i++) {
        tempItem = selectedRow.value[i];
        // if (tempItem.publishState !== 1 && tempItem.publishState !== 3) {
        //   return GjMessage.warning('当前状态无法操作')
        // }
        if (!tempItem.complete || tempItem.complete.complete !== 7) {
          return GjMessage.warning("选中的草稿需要补充完整信息才能发布！");
        }
      }
      data.publishModel = true;
    };

    //批量发布
    const handelBatchPublishBtn = () => {
      data.isBatch = true;
      data.publishModel = false;
      batchrReleaseDraft({
        draftIds: selectedRowKeys.value,
        onlineType: 1,
      }).then(() => {
        GjMessage.success("发布任务已提交，请稍后查看!");
        getTableList();
      });
    };

    //批量删除前验证
    const verifyBatchDelete = () => {
      if (selectedRowKeys.value.length > 0) {
        data.deleteModel = true;
      } else {
        return GjMessage.warning("请至少选择一条要操作的数据!");
      }
    };

    //批量删除
    const handelBatchDeleteBtn = () => {
      data.deleteModel = false;
      const n = selectedRowKeys.value.length;
      batchDeleteDraft({
        listingIds: selectedRowKeys.value,
      }).then(() => {
        getTableList();
        GjMessage.success(`删除成功${n}个草稿！`);
      });
    };

    //批量定时
    const handelBatchTimingBtn = () => {
      if (selectedRowKeys.value.length <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据!");
      }

      let tempItem = null;
      for (let i = 0; i < selectedRow.value.length; i++) {
        tempItem = selectedRow.value[i];
        // if (tempItem.publishState !== 1 && tempItem.publishState !== 3) {
        //   return GjMessage.warning('当前状态无法操作')
        // }
        if (!tempItem.complete || tempItem.complete.complete !== 7) {
          return GjMessage.warning("选中的草稿需要补充完整信息才能发布！");
        }
      }
      data.isBatch = true;
      data.timingModalVisible = true;
      // data.isBatch = true
      // if (selectedRowKeys.value.length > 0) {
      //   data.timingModalVisible = true
      // } else {
      //   return GjMessage.warning('请至少选择一条要操作的数据!')
      // }
    };

    const handleOk = (val) => {
      data.timingModalVisible = false;
      if (data.isBatch) {
        batchrReleaseDraft({
          draftIds: selectedRowKeys.value,
          onlineType: 2,
          onlineTime: new Date(String(val.onlineTime)).getTime(),
          state: val.state,
        }).then(() => {
          GjMessage.success("发布任务已提交，请稍后查看!");
          getTableList();
        });
      } else {
        releaseDraft({
          draftId: data.draftId,
          onlineType: 2,
          onlineTime: new Date(String(val.onlineTime)).getTime(),
          state: val.state,
        }).then(() => {
          GjMessage.success("发布任务已提交，请稍后查看!");
          getTableList();
        });
      }
    };

    const handleCancel = () => {
      data.timingModalVisible = false;
    };
    const getTableCurrent = (e) => {
      if (Object.prototype.hasOwnProperty.call(e, "pageCurrent")) {
        data.pagination.pageCurrent = e.pageCurrent;
      }
      if (Object.prototype.hasOwnProperty.call(e, "pageSize")) {
        data.pagination.pageSize = e.pageSize;
      }
      getTableList();
    };

    const sortChange = (val) => {
      /**
       * @param {val} 公共表格傳入的值
       */
      // 这里只监听排序的，有需要的类型自己补充
      if (val.action === "sort") {
        const { order, field, column } = val.sorter;
        data.sort = column ? field : "createTime";
        data.order = order === "ascend" ? "asc" : "desc";
        sortedInfo.value = val.sorter;
        getTableList();
        commonTableRef.value.updateSortOrder(sortedInfo.value);
      }
    };

    const getSelection = (val) => {
      selectedRow.value = val;
    };

    const selectedRowKeys = computed(() => {
      return selectedRow.value.map((item) => item["listingId"]);
    });

    // 默认视图删除
    const delQueryCondition = (val) => {
      console.log(val);

      const { connectCode } = val;
      if (connectCode === "keyWords") {
        data.formDataSearch.keyWords = "";
      } else if (connectCode === "specsType") {
        data.formDataSearch.specsType = "";
      } else if (connectCode === "chargePersonIds") {
        data.formDataSearch.chargePersonIds = [];
      } else if (connectCode === "timeType") {
        data.timeGroup = [];
        data.formDataSearch.startTime = "";
        data.formDataSearch.endTime = "";
      } else if (connectCode === "publishState") {
        data.formDataSearch.publishState = "";
      } else if (connectCode === "shopIds") {
        data.formDataSearch.shopIds = [];
      }

      getTableList();
      // 计算table高度
      commonTableRef.value.calculateWH();
    };

    // 保存视图回显
    const changeQueryList = (val) => {
      if (val.length == 0) {
        data.timeGroup = [];
        data.formDataSearch = { ...defaultSearch };
      } else {
        console.log(val, "保存视图回显");
        val.forEach((element) => {
          const { code, connectCode, extra } = element;
          if (connectCode === "keyWords") {
            data.formDataSearch.keyWords = code;
            data.formDataSearch.type = extra.keyWordsType;
          } else if (connectCode === "timeType") {
            data.timeGroup = code;
            data.formDataSearch.timeType = extra.timeType;
            data.formDataSearch.startTime = code[0];
            data.formDataSearch.endTime = code[1];
          } else if (connectCode === "publishState") {
            data.formDataSearch.publishState = code;
          } else {
            data.formDataSearch[connectCode] = code;
          }
        });
      }

      sortedInfo.value = null;
      data.sort = "createTime"; //默认
      data.order = "desc"; //默认
      // 重置分页
      data.pagination.pageCurrent = 1;
      data.pagination.pageSize = 20;
      data.pagination.total = 0;
      commonTableRef.value.calculateWH();
      getTableList();
    };

    const changeQueryMap = (params) => {
      Object.assign(data.queryMap, params);
    };

    onMounted(() => {
      getTableList();
      getShopList({ platformCode: "ALIEXPRESS" }).then((res) => {
        data.shopList = res.data;
      });
    });

    return {
      ...toRefs(data),
      tableColumns,
      dateChange,
      resetSearch,
      createDrafts,
      onHandleReleaseDraft,
      timingDraft,
      editDraftInfo,
      cancel,
      confirm,
      cancelEditDialog,
      confirmEditDialog,
      onHandleDeleteDraft,
      closeOnlineOrSyncDialog,
      keywordEnter,
      chargePerson,
      specsTypeChange,
      shopNameChange,
      publishStateChange,
      goBack,
      verifyBatchPublish,
      handelBatchPublishBtn,
      verifyBatchDelete,
      handelBatchDeleteBtn,
      handelBatchTimingBtn,
      handleOk,
      handleCancel,
      getTableCurrent,
      getSelection,
      rowSelectionLength,
      commonTableRef,
      selectedRowKeys,
      sortChange,
      copyDraft,
      changeQueryList,
      delQueryCondition,
      getBtnList,
    };
  },
  beforeRouteEnter(to, form, next) {
    next((e) => {
      if (form.path == "/pubAliOnLineGoods") {
        if (to.query?.productId) {
          e.copyDraft(to.query.productId);
        }
      }
    });
  },
});
</script>
<style scoped lang="scss">
/deep/.arco-btn-outline {
  color: #000430;
  border: 1px solid #e6e6ed;
}

.quantity {
  margin-left: 12px;
  color: #00043066;
  .nember {
    color: #0045f0;
    margin-left: 2px;
  }
}

.title {
  .div1 {
    width: 151px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .div2 {
    // color: #0045f0;
    font-size: 12px;
    display: flex;
    align-items: center;
  }
}
.note-wrap {
  display: flex;
  align-items: center;
  .note {
    display: inline-block;
    max-width: 106px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.tip {
  display: flex;
  align-items: center;
}
.spot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  margin-right: 4px;
}
.mb10 {
  margin-bottom: 4px;
}

.incomplete {
  background-color: #ee7c30;
}
.complete {
  background-color: #2da641;
}

.danger {
  background-color: #ff5c5c;
}

.waitting {
  background-color: #0045f0;
}
</style>
