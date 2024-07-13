<template>
  <!-- 商品资料 -->
  <CommonPage :pageRest="true" @common-page-rest="resetSearch">
    <template #tag-content>
      <gb-default-view
        :id="'ALI_pubAliGoodsInfo_view'"
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
          class="search-select-left"
          v-model="formDataSearch.timeType"
          placeholder="创建时间"
          @change="dateChange(timeGroup)"
        >
          <gj-option :value="1">创建时间</gj-option>
          <gj-option :value="2">更新时间</gj-option>
        </gj-select>
        <gj-range-picker
          v-model="timeGroup"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="dateChange(timeGroup)"
          class="search-range-picker"
        />
      </gj-input-group>
    </template>
    <template #operate_bar-content>
      <OperateBtnGroup>
        <template #left>
          <gj-space>
            <gj-button type="primary" @click="createGoods">添加商品</gj-button>
            <gj-button type="plain" @click="batchGenerateDrafts"
              >生成草稿</gj-button
            >
            <gj-popconfirm
              content="此操作不可逆，是否删除？"
              position="bl"
              :popup-visible="deleteModel"
              :render-to-body="false"
              @ok="deleteDrafts"
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
      </OperateBtnGroup>
    </template>
    <template #table-content>
      <CommonTable
        ref="commonTableRef"
        :rowKey="'productId'"
        :columns="tableColumns"
        :tableData="tableData"
        :loading="loading"
        :pagination="pagination"
        :selectedRowKeys="selectedRowKeys"
        :rowSelectionVisiable="true"
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

          <div v-if="column.dataIndex === 'publishCount'">
            <span v-if="!record.publishCount || record.publishCount == 0">{{
              record.publishCount
            }}</span>
            <appPopover
              title="在线数量"
              :record="record"
              v-else
              :productId="record.productId"
              :columns="publishCountColumns"
              :hasPagination="true"
            />
          </div>

          <div v-if="column.dataIndex === 'createTime'">
            <span>{{
              formatDateTime(record.createTime, "YYYY-MM-DD HH:mm:ss", "-")
            }}</span>
          </div>

          <div v-if="column.dataIndex === 'updateTime'">
            <span>{{
              formatDateTime(record.updateTime, "YYYY-MM-DD HH:mm:ss", "-")
            }}</span>
          </div>

          <div v-if="column.dataIndex === 'remark'">
            <template v-if="record.remark">
              <div class="note-wrap">
                <gj-popover position="top">
                  <div class="note">{{ record.remark }}</div>
                  <template #content>
                    <div class="remark">
                      {{ record.remark }}
                    </div>
                  </template>
                </gj-popover>
                <gj-popconfirm
                  @ok="updateRemark(record)"
                  @popup-visible-change="popupChange(record)"
                  position="bottom"
                >
                  <div class="svg1">
                    <SvgIcon svgClass="editRemark" :width="12"></SvgIcon>
                  </div>
                  <template #icon>
                    <span></span>
                  </template>
                  <template #content>
                    <gj-input
                      v-model="remarkObj[record.productId]"
                      :max-length="50"
                      :style="{ width: '240px' }"
                      placeholder="请输入"
                      allow-clear
                      show-word-limit
                    >
                    </gj-input>
                  </template>
                </gj-popconfirm>
              </div>
            </template>
            <template v-if="!record.remark">
              <gj-popconfirm
                @ok="updateRemark(record)"
                @popup-visible-change="popupChange(record)"
                position="bottom"
              >
                <gj-button class="button" type="text">添加</gj-button>
                <template #icon>
                  <span></span>
                </template>
                <template #content>
                  <gj-input
                    v-model="remarkObj[record.productId]"
                    :max-length="50"
                    :style="{ width: '240px' }"
                    placeholder="请输入"
                    allow-clear
                    show-word-limit
                  >
                  </gj-input>
                </template>
              </gj-popconfirm>
            </template>
          </div>

          <div v-if="column.dataIndex === 'action'">
            <OpbtnGroup :btn-list="getBtnList()" :row="record"></OpbtnGroup>
          </div>
        </template>
      </CommonTable>
    </template>
  </CommonPage>

  <goods-draft
    :dialogVisible="draftVisible"
    :goodsRow="generateDraftsIds"
    @cancel="cancel"
    @confirm="confirm"
  />
  <EditDialog
    ref="editDialog"
    v-if="editDialogVisible"
    :dialogVisible="editDialogVisible"
    :isCreate="isCreate"
    :editId="editId"
    @generateDrafts="generateDrafts"
    @cancel="cancelEditDialog"
    @confirm="confirmEditDialog"
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
import EditDialog from "./components/editDialog.vue";
import goodsDraft from "./components/goodsDraft.vue";
import SvgIcon from "@/components/SvgIcon";
import { GjMessage } from "@gj/atom";
import appPopover from "../../components/app-popover.vue";
import variantPopover from "../../components/variant-popover.vue";
import SelectDirector from "@/components/SelectDirector.vue";
import CommonTable from "@/components/CommonTable.vue";
import CommonPage from "@/components/CommonPage.vue";
import { convertSelectedValue } from "@/utils/format";
import {
  getGoodsInfoList,
  addRemark,
  deleteProduct,
  batchDelete,
  getProductDetail,
} from "@api/published/aliexpress";
import dayjs from "dayjs";
import { useStore } from "vuex";
import { setDefaultView, getDefaultView } from "@/api/publicColumn";
import OpbtnGroup from "@/components/opbtn-group.vue";
import columnCopy from "@/components/columnCopy.vue";
import OperateBtnGroup from "@/components/OperateBtnGroup.vue";
import { formatDateTime } from "@/utils/format.js";
export default defineComponent({
  name: "pubAliGoodsInfo",
  props: {},
  components: {
    EditDialog,
    goodsDraft,
    SvgIcon,
    appPopover,
    variantPopover,
    CommonTable,
    CommonPage,
    SelectDirector,
    OpbtnGroup,
    columnCopy,
    OperateBtnGroup,
  },
  setup() {
    const selectedRow = ref([]);
    const sortedInfo = ref();
    const store = new useStore();
    const commonTableRef = ref();
    const defaultSearch = {
      keyWords: "",
      type: 1,
      specsType: "",
      chargePersonIds: [],
      startTime: undefined,
      endTime: undefined,
      timeType: 1,
    };
    const data = reactive({
      formatDateTime,
      variantColumnList: [
        {
          title: "建议售价",
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
      deleteModel: false,
      loading: false, //是否为加载中状态
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
      remarkObj: {},
      isCreate: true, // true创建 false编辑
      publishCountColumns: [
        {
          title: "itemId",
          dataIndex: "itemId",
          width: 100,
        },
        {
          title: "店铺",
          dataIndex: "shopName",
          width: 180,
        },
        {
          title: "店铺SKU",
          dataIndex: "shopSkucode",
          width: 100,
        },
        {
          title: "负责人",
          dataIndex: "createdBy",
          width: 100,
        },
        {
          title: "上架时间",
          dataIndex: "createdTime",
          width: 200,
        },
      ],
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
      generateDraftsIds: [],
    });

    const getBtnList = () => {
      return [
        {
          label: "编辑",
          click: (row) => editGoodsInfo(row.productId),
          outside: true,
          permission: ["ALI/pubAliGoodsInfo/edit"],
        },
        {
          label: "生成草稿",
          click: (row) => generateDrafts(row.productId),
          permission: ["ALI/pubAliGoodsInfo/draft"],
          isPopConfirm: false,
        },
        {
          label: "复制",
          click: (row) => copyGoodsInfo(row.productId),
          permission: ["ALI/pubAliGoodsInfo/copy"],
          isPopConfirm: false,
        },
        {
          label: "删除",
          click: (row) => deleteDraft(row.productId),
          // tooltipContent: '即将删除1条草稿，是否确认删除',
          tooltipContent: "此操作不可逆，是否删除?",
          permission: ["ALI/pubAliGoodsInfo/delete"],
          isPopConfirm: true,
          isDel: true,
        },
      ];
    };

    const rowSelectionLength = computed(() => {
      return selectedRow.value.length;
    });

    const selectedRowKeys = computed(() => {
      return selectedRow.value.map((item) => item["productId"]);
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
          title: "产品分类",
          dataIndex: "categoryName",
          key: "categoryName",
          width: 100,
        },
        {
          title: "规格",
          dataIndex: "specsType",
          key: "specsType",
          width: 100,
        },
        {
          title: "建议售价",
          dataIndex: "recommendPrice",
          key: "recommendPrice",
          width: 180,
        },
        {
          title: "在线数量",
          dataIndex: "publishCount",
          key: "publishCount",
          width: 100,
        },
        // {
        //   title: '状态',
        //   dataIndex: 'complete',
        //   key: 'complete',
        //   width: 180,
        // },
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
          title: "更新时间",
          dataIndex: "updateTime",
          key: "updateTime",
          width: 180,
          showSorterTooltip: false,
          sorter: true,
        },

        {
          title: "备注",
          dataIndex: "remark",
          key: "remark",
          width: 160,
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

    // 保存备注
    const updateRemark = (record) => {
      const params = {
        productId: record.productId,
        remark: data.remarkObj[record.productId],
      };
      addRemark(params).then(() => {
        GjMessage.success("编辑成功！");
        getTableList();
      });
    };

    const popupChange = (record) => {
      data.remarkObj[record.productId] = record.remark;
    };

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

    //编辑商品资料
    const editGoodsInfo = (productId) => {
      console.log(productId);
      data.isCreate = false;
      data.editDialogVisible = true;
      data.editId = productId;
      store.commit("setAliProductInfo", {});
      getProductDetail(productId).then((res) => {
        store.commit("setAliProductInfo", res.data);
        console.log(store.state.aliexpress.aliProductInfo);
      });
    };

    //复制商品资料
    const copyGoodsInfo = (productId) => {
      data.isCreate = true;
      data.editDialogVisible = true;
      store.commit("setAliProductInfo", {});
      getProductDetail(productId).then((res) => {
        store.commit("setAliProductInfo", res.data);
        console.log(store.state.aliexpress.aliProductInfo);
      });
    };

    //创建商品
    const createGoods = () => {
      data.isCreate = true;
      data.editDialogVisible = true;
      // proxy.$refs['editDialog'].resFormData()
      store.commit("setAliProductInfo", {});
    };

    // 单条删除
    const deleteDraft = (id) => {
      deleteProduct(id).then(() => {
        GjMessage.success("已删除1条商品资料！");
        getTableList();
      });
    };
    //批量删除前验证
    const verifyBatchDelete = () => {
      if (rowSelectionLength.value > 0) {
        data.deleteModel = true;
      } else {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
    };
    //批量删除
    const deleteDrafts = () => {
      data.deleteModel = false;
      let n = selectedRowKeys.value.length;
      batchDelete({
        productIds: selectedRowKeys.value,
      }).then(() => {
        GjMessage.success(`已删除${n}条商品资料！`);
        selectedRowKeys.value = [];
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

    const getTableList = () => {
      let params = {
        ...data.formDataSearch,
        pageSize: data.pagination.pageSize,
        pageCurrent: data.pagination.pageCurrent,
        sort: data.sort,
        order: data.order,
      };
      data.loading = true;
      getGoodsInfoList(params)
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
        extra: {
          // type: 'chargePersonIds',
        },
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
        key: data.formDataSearch.timeType === 1 ? "创建时间" : "更新时间",
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

    const getTableCurrent = (e) => {
      if (Object.prototype.hasOwnProperty.call(e, "pageCurrent")) {
        data.pagination.pageCurrent = e.pageCurrent;
      }
      if (Object.prototype.hasOwnProperty.call(e, "pageSize")) {
        data.pagination.pageSize = e.pageSize;
      }

      getTableList();
    };

    const getSelection = (val) => {
      // data.form.rowSelection = selectedRowKeys
      selectedRow.value = val;
    };
    onMounted(() => {
      getTableList();
    });

    const generateDrafts = (id) => {
      data.generateDraftsIds = [id];
      data.draftVisible = true;
    };

    const batchGenerateDrafts = () => {
      if (selectedRowKeys.value.length <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.generateDraftsIds = selectedRowKeys.value;
      data.draftVisible = true;
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
    return {
      ...toRefs(data),
      popupChange,
      updateRemark,
      dateChange,
      resetSearch,
      createGoods,
      editGoodsInfo,
      copyGoodsInfo,
      cancel,
      confirm,
      cancelEditDialog,
      confirmEditDialog,
      deleteDrafts,
      deleteDraft,
      keywordEnter,
      chargePerson,
      specsTypeChange,
      goBack,
      getTableCurrent,
      tableColumns,
      rowSelectionLength,
      verifyBatchDelete,
      selectedRowKeys,
      getSelection,
      sortChange,
      commonTableRef,
      changeQueryList,
      delQueryCondition,
      getBtnList,
      generateDrafts,
      batchGenerateDrafts,
    };
  },
});
</script>
<style scoped lang="scss">
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
    .remark {
      overflow-y: hidden;
      overflow-x: scroll;
      width: 206px;
      white-space: nowrap;
    }
  }

  .svg1 {
    cursor: pointer;
    margin-left: 4px;
  }
}

.ml4 {
  margin-left: 4px;
}
</style>
