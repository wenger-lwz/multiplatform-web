<template>
  <CommonPage :pageRest="true" @common-page-rest="resetSearch">
    <template #tag-content>
      <TagGroup
        :list="searchActive"
        @tag-change="changeFilterSelect"
      ></TagGroup>
    </template>
    <template #filter-content>
      <FilterCondition
        ref="returnOrderAliFilter"
        @filter-change="getQueryCondition"
        @tag-change="searchActiveChnge"
      />
    </template>
    <template #table-content>
      <CommonCard
        ref="labelTableRef"
        :tableData="form.tableData"
        :loading="form.loading"
        :pagination="form.pagination"
        @onRowSelection="getSelection"
        @getTableCurrent="getTableCurrent"
      >
        <template #title="{ record }">
          <gj-space :size="32">
            <gj-space>
              <span class="deilt-content-label">订单编号</span>
              <!-- <span class="deilt-content-value">{{
                      record?.platformOrderId
                    }}</span> -->
              <gj-button
                class="tableInfopermissionsBtn"
                type="text"
                v-if="record?.platformOrderId"
                @click="lookEdit(record)"
              >
                <columnCopy
                  :isAnchor="false"
                  :textValue="record?.platformOrderId"
                >
                </columnCopy>
              </gj-button>
            </gj-space>
            <gj-space>
              <span class="deilt-content-label">店铺</span>
              <span class="deilt-content-value">{{ record?.erpShopName }}</span>
            </gj-space>
          </gj-space>
        </template>
        <template #extra="{ record }">
          <gj-space>
            <!-- <gj-avatar :size="32" shape="square">Arco</gj-avatar> -->
            <span v-if="record?.buyerName">{{ record?.buyerName }}</span>
          </gj-space>
        </template>
        <template #firstCardDemo="{ record }">
          <gj-space align="start">
            <gb-image :src="record?.erpShopName" :size="62" />
            <gj-space direction="vertical" fill :size="1">
              <gb-text class="selectedRowKeysStyle" :line="2">{{
                record?.itemName
              }}</gb-text>
              <gb-text v-if="record?.itemId">{{ record?.itemId }}</gb-text>
              <gb-text v-if="record?.msku">{{ record?.msku }}</gb-text>
              <gb-text v-if="record?.modelName">{{
                record?.modelName
              }}</gb-text>
            </gj-space>
          </gj-space>
        </template>
        <template #secondCardDemo="{ record }">
          <gj-space>
            <span>星级评分</span>
            <gj-rate :default-value="record?.ratingStar" readonly />
          </gj-space>
        </template>
        <template #thirdCardDemo="{ record }">
          <gj-space size="medium" direction="vertical" fill>
            <gj-row class="grid-demo" justify="space-between">
              <gj-col :span="4">
                <div>{{ record?.evaluationCreateTime }}</div>
              </gj-col>
              <gj-col :span="18">
                <gj-space align="start">
                  <span class="deilt-content-label">主评</span>
                  <gj-space direction="vertical" fill :size="1">
                    <gb-text :line="2" class="deilt-content-value">{{
                      record?.comment
                    }}</gb-text>
                  </gj-space>
                </gj-space>
              </gj-col>
              <gj-col :span="2" class="flex-btn-evaluate">
                <span v-if="record?.replyStatus">已回复</span>
                <gj-button
                  v-else
                  type="primary"
                  size="mini"
                  @click="handelLabel(record, 1)"
                  >回复</gj-button
                >
              </gj-col>
            </gj-row>
            <gj-row
              v-if="record?.replyStatus"
              class="grid-demo deilt-content-style"
              justify="space-between"
            >
              <gj-col :span="4"> </gj-col>
              <gj-col :span="20">
                <gj-space align="start" fill class="evaluate-content">
                  <span class="deilt-content-label">回复</span>
                  <gj-alert
                    type="warning"
                    :show-icon="false"
                    class="deilt-content-value"
                  >
                    {{ record?.reply || "-" }}
                  </gj-alert>
                </gj-space>
              </gj-col>
            </gj-row>
          </gj-space>
        </template>
      </CommonCard>
    </template>
  </CommonPage>
  <OrderDetail
    :dialogVisible="detailVisible"
    :orderId="detailRow.orderId"
    @cancel="cancelDetail"
  >
  </OrderDetail>
  <!-- 争议编辑 -->
  <gb-modal
    v-model:visible="fromDialogVisible"
    :unmount-on-close="true"
    :mask-closable="false"
    width="600px"
    class="gb-modal-createFrom"
    @close="resetForm()"
    :render-to-body="false"
  >
    <template #title>
      <div class="modal-title">
        <span class="title">{{ fromTitle }}</span>
      </div>
    </template>
    <!-- 提出争议 -->
    <evaluateModel
      ref="createFrom"
      :fromType="fromType"
      :row="fromRow"
    ></evaluateModel>
    <template #footer>
      <gj-space size="medium">
        <gj-button type="plain" @click="resetForm()">取消</gj-button>
        <gj-button type="primary" class="ml-8" @click="submitForm()">
          确定</gj-button
        >
      </gj-space>
    </template>
  </gb-modal>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  ref,
  getCurrentInstance,
} from "vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonCard from "@/components/CommonCard.vue";
import { tableColumns } from "@pagesSystem/customerService/shopee/config/shopeeStoreEvaluation.js";
import evaluateModel from "@pagesSystem/customerService/shopee/components/evaluateModel.vue";
import {
  getShopeeCommentPage_info,
  getShopeeCommentReply,
} from "@/api/customerService/shopee.js";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { useStore } from "vuex";
import TagGroup from "@/components/TagGroup.vue";
import FilterCondition from "./FilterCondition.vue";
import returnOrRefundDetail from "../../components/returnOrRefundDetail.vue";
import columnCopy from "@/components/columnCopy.vue";
import OrderDetail from "@pagesSystem/order/shopee/orderManger/allOrderDetail.vue";

export default defineComponent({
  name: "storeAllocation",
  /* eslint-disable */
  components: {
    CommonPage,
    CommonCard,
    evaluateModel,
    OpbtnGroup,
    FilterCondition,
    TagGroup,
    returnOrRefundDetail,
    getShopeeCommentPage_info,
    columnCopy,
    OrderDetail,
  },
  props: {
    replyStatus: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },
  /* eslint-enable */
  setup(props) {
    const { proxy } = getCurrentInstance();
    const $store = useStore();
    const selectedRow = ref([]);
    const data = reactive({
      detailVisible: false,
      detailRow: {},
      searchActive: [],
      inputPopoverValue: {},
      fromDataSearch: {
        replyStatus: Number(props.replyStatus),
      }, // 查询参数
      // table列表
      form: {
        rowSelection: [],
        noData: false, //无数据
        loading: false, //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        rowName: "id", //表格行 key 的取值字段
        columns: tableColumns,
        tableData: [],
        pagination: {
          //分页
          pageCurrent: 1,
          pageSize: 20,
          total: 0,
        },
      },
      delPopupVisible: false, // pop批量删除弹框是否可见

      createFrom: {}, // form表单内容
      fromTitle: "回复评论",
      fromType: 2, // 2添加 1编辑
      fromRow: {}, // 编辑行数据
      fromDialogVisible: false, // 编辑弹框是否显示
      importTitle: "导入标签",
      importType: 1, // 导入标签类型
    });

    //规则添加、编辑
    const handelLabel = (row, type) => {
      data.fromDialogVisible = true;
      data.fromType = type;
      data.fromRow = row ? row : {};
      data.fromTitle = type === 1 ? "回复评论" : "回复评论";
    };

    // 查看详情页
    const lookEdit = (row) => {
      data.detailVisible = true;
      data.detailRow = row;
    };
    // 关闭详情页
    const cancelDetail = () => {
      data.detailVisible = false;
    };

    //  保存
    const submitForm = () => {
      const formeddd = proxy.$refs["createFrom"]?.submitForm();
      console.log();
      formeddd.then(async (res) => {
        data.createFrom = $store.getters.getParams
          ? $store.getters.getParams.createFrom
          : {};

        if (res === "200") {
          let params = {
            ...data.createFrom,
          };
          if (data.fromType === 1) {
            params.comment_id = data.fromRow.commentId;
            // 编辑
            await getShopeeCommentReply(params);
            // GjMessage.success('修改成功')
            // data.fromDialogVisible = false
            // searchTable()
          } else {
            // 添加
          }
        }
      });
    };

    // 重置
    const resetForm = () => {
      proxy.$refs["createFrom"].resetForm();
      data.fromDialogVisible = false;
    };

    // 全选
    const getSelection = (val) => {
      selectedRow.value = val;
    };

    // 重置搜索条件
    const resetSearch = () => {
      data.fromDataSearch = {
        replyStatus: Number(props.replyStatus),
      };
      data.inputPopoverValue = {};
      data.searchActive = [];
      proxy.$refs.returnOrderAliFilter?.resetForm();
      data.form.pagination.pageSize = 20;
      resetSearchTable();
    };

    // 重置到第一页
    const resetSearchTable = () => {
      data.form.pagination.pageCurrent = 1;
      searchTable();
    };

    // 翻页
    const getTableCurrent = (e) => {
      data.form.pagination.pageCurrent =
        e.pageCurrent || data.form.pagination.pageCurrent;
      data.form.pagination.pageSize =
        e.pageSize || data.form.pagination.pageSize;
      searchTable();
    };

    // 获取列表
    const searchTable = () => {
      data.form.tableData = [];
      const params = {
        ...data.fromDataSearch,
        pageCurrent: data.form.pagination.pageCurrent,
        pageSize: data.form.pagination.pageSize,
      };
      data.form.loading = true;
      getShopeeCommentPage_info(params)
        .then((res) => {
          data.form.tableData = res.data.records || [];
          data.form.pagination.total = res.data.total || 0;
        })
        .finally(() => {
          data.form.loading = false;
        });
    };

    // 搜索
    const getQueryCondition = (val) => {
      data.fromDataSearch = {
        replyStatus: Number(props.replyStatus),
        erpShopIds: val.erpShopIds,
        ratingStars: val.ratingStars,
        endTime: val.evaluateDate[1],
        startTime: val.evaluateDate[0],
        [val.itemTypeList.selectValue]: val.itemTypeList.inputValue,
      };
      searchTable();
    };
    const changeFilterSelect = (target) => {
      proxy.$refs.returnOrderAliFilter?.delTag(target);
    };
    // 选择tag
    const searchActiveChnge = (target) => {
      data.searchActive = useChangeList(target, data.searchActive);
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
        } else if (showValue.length > 0) {
          result.push(target);
        }
      }
      return result;
    };

    onBeforeMount(() => {
      searchTable();
    });
    return {
      ...toRefs(data),
      handelLabel,
      resetForm,
      resetSearch,
      getTableCurrent,
      getSelection,
      submitForm,
      searchTable,
      searchActiveChnge,
      getQueryCondition,
      changeFilterSelect,
      cancelDetail,
      lookEdit,
    };
  },
});
</script>

<style lang="scss" scoped>
// //设置弹框样式
.shop-theme_content {
  display: flex;
  .shop-theme_content_left {
    flex: 1;
    margin-right: 8px;
  }
  .shop-theme_content_rigth {
    flex: 1;
  }
}
.common-pages .layout-content {
  :deep(.comtent-wrap) {
    border: none !important;
  }
}

.arco-rate {
  min-height: 14px;
  max-height: 14px;
}
:deep(.arco-rate) {
  font-size: 14px;
}
.deilt-content-style {
  width: 100%;
}
.deilt-content-label {
  display: inline-block;
  width: max-content;
  color: #86909c;
  font-size: 12px;
}
.deilt-content-value {
  color: #1d2129;
  font-size: 12px;
}
.flex-btn-evaluate {
  display: flex;
  justify-content: flex-end;
}
.evaluate-content {
  width: 100%;
  :deep(.arco-space-item):last-child {
    width: 100%;
  }
}
:deep(.comtent-wrap) {
  border: none !important;
}
:deep(.table-content-wrap) {
  border-top: none !important;
}
</style>
