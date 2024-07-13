//onLineGoodsPage
<template>
  <CommonPage
    :pageRest="true"
    @common-page-rest="resetHandler"
    :currentRouterPermission="'EBAY/pubEBayOnLineGoods/view'"
  >
    <template #tag-content>
      <TagGroup
        :list="searchActive"
        @tag-change="changeFilterSelect"
      ></TagGroup>
    </template>
    <template #filter-content>
      <gjSiteIdShopIdSelect
        v-model:siteIds="searchObj.siteIds"
        v-model:shopIds="searchObj.shopIds"
        :allowClear="true"
        :params="{ platformCode: 'EBAY' }"
        @change-object-siteId="handleChange('siteIds', '站点', $event)"
        @change-object-shopId="handleChange('shopIds', '店铺', $event)"
      ></gjSiteIdShopIdSelect>
      <gj-input-group class="search-select">
        <gj-select
          placeholder="状态"
          v-model="searchObj.updateState"
          :trigger-props="{ autoFitPopupMinWidth: true }"
          @change="handleChange('updateState', '状态', [$event])"
        >
          <gj-option
            v-for="(item, index) in draftStatusList"
            :value="item.value"
            :key="index"
            >{{ item.name }}
          </gj-option>
        </gj-select>
      </gj-input-group>
      <gj-input-group>
        <gj-select
          v-model="searchObj.keyWordType"
          class="search-select-left"
          placeholder="标题"
          :trigger-props="{ autoFitPopupMinWidth: true }"
          @change="
            selectDataChange(
              'keyWords',
              getLabel(titleListOpt, searchObj.keyWordType)
            )
          "
        >
          <gj-option
            v-for="item in titleListOpt"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</gj-option
          >
        </gj-select>
        <gj-input-search
          v-model="searchObj.keyWords"
          class="search-select-rigth"
          placeholder="请输入"
          @keyup.enter="
            selectDataChange(
              'keyWords',
              getLabel(titleListOpt, searchObj.keyWordType)
            )
          "
          @search="
            selectDataChange(
              'keyWords',
              getLabel(titleListOpt, searchObj.keyWordType)
            )
          "
        />
      </gj-input-group>
      <gj-input-group class="search-select">
        <gj-select
          placeholder="全部规格"
          v-model="searchObj.specsType"
          @change="handleChange('specsType', '全部规格', [$event])"
        >
          <gj-option
            v-for="item in specifications"
            :key="item.value"
            :value="item.value"
            >{{ item.name }}
          </gj-option>
        </gj-select>
      </gj-input-group>

      <select-director
        multiple
        class="search-gb-select"
        placeholder="负责人"
        popup-container="#multiplatform-web"
        v-model="searchObj.chargePerson"
        @change="handleChargePersonChange('chargePerson', '负责人', $event)"
      />
      <gj-input-group class="gb-composite">
        <gj-select
          v-model="searchObj.timeType"
          class="search-select-left"
          placeholder="时间"
          :trigger-props="{ autoFitPopupMinWidth: true }"
          @change="
            selectDataChange(
              'rangeValue',
              getLabel(timeOptions, searchObj.timeType),
              'timeType'
            )
          "
        >
          <gj-option
            v-for="(item, index) in timeOptions"
            :key="index"
            :value="item.value"
            >{{ item.label }}</gj-option
          >
        </gj-select>
        <AppRangePicker
          class="search-range-picker"
          @change="dateChange"
          v-model="searchObj.rangeValue"
        />
      </gj-input-group>
    </template>
    <template #operate_bar-content>
      <OperateBtnGroup>
        <template #left>
          <gj-space align="center">
            <gj-button
              type="plain"
              v-permissions="['EBAY/pubEBayDraft/onLineBatchShelf']"
              @click="batchReleaseAll('offTheShelf')"
              >批量下架</gj-button
            >
            <gj-button
              v-permissions="['EBAY/pubEBayDraft/onLineBatchUpload']"
              @click="batchReleaseAll('update')"
              type="plain"
              >批量更新</gj-button
            >
            <gj-button
              v-permissions="['EBAY/pubEBayDraft/onLineBatchSynchro']"
              @click="batchReleaseAll('synchronization')"
              type="plain"
              >批量同步</gj-button
            >

            <div v-if="selectNub.length > 0">
              <span style="color: rgba(0, 4, 48, 0.4)">已 选</span>
              <span style="color: #0045f0; margin-left: 5px">{{
                selectNub
              }}</span>
            </div>
          </gj-space>
        </template>
        <template #right>
          <!-- businessType 1-发布刊登；2-更新商品) -->
          <QueuePopover :platformCode="'EBAY'" :businessType="2"></QueuePopover>
        </template>
      </OperateBtnGroup>
    </template>
    <template #table-content>
      <CommonTable
        :rowKey="'id'"
        :columns="tableColumns"
        :tableData="form.tableData"
        :loading="form.loading"
        :pagination="form.pagination"
        :selectedRowKeys="selectedRowKeys"
        @onRowSelection="getSelection"
        :rowSelectionVisiable="true"
        @change="handleChangeTable"
        @getTableCurrent="getTableCurrent"
      >
        <template #bodyCell="{ record, column, text }">
          <template v-if="column.dataIndex === 'mainImage'">
            <gb-image width="36" :src="text"></gb-image>
          </template>
          <template v-else-if="column.dataIndex === 'recommendPrice'">
            <span>{{ text }} {{ record.priceUnit }}</span>
          </template>
          <div v-else-if="column.dataIndex === 'specsType'">
            <span v-if="text == 1">单品</span>
            <tablee-pop
              v-if="text == 2"
              :popObj="{
                title: '变体信息',
                btnNmam: '变体',
                type: 'btxx',
              }"
              :popRecord="record"
            ></tablee-pop>
          </div>
          <template v-else-if="column.dataIndex === 'spu'">
            <p>{{ record.defaultTitle }}</p>
            <gb-copy>{{ emptyFilter(record.spu) }}</gb-copy>
          </template>
          <template v-else-if="column.dataIndex === 'updateState'">
            <gj-badge v-if="text === 1" status="success" text="正常" />
            <gj-badge
              v-else-if="text === 2"
              status="warning"
              text="暂存未更新"
            />
            <gj-popover v-else-if="text === 3">
              <gj-badge status="danger" text="更新失败" />

              <template #content>
                <span>{{ text }}</span>
              </template>
            </gj-popover>
            <span v-else>{{ emptyFilter("") }}</span>
          </template>
          <div v-else-if="column.dataIndex === 'createTime'">
            <span>{{ initFormatDateTime(record.createTime) }}</span>
          </div>
          <div v-else-if="column.dataIndex === 'publishTime'">
            <span>{{ initFormatDateTime(record.publishTime) }}</span>
          </div>
          <template v-else-if="column.dataIndex === 'remark'">
            <template v-if="record.remark">
              <div class="note-wrap">
                <gj-popover position="top">
                  <div class="note">{{ record.remark }}</div>
                  <template #content>
                    <div
                      style="
                        overflow-y: hidden;
                        overflow-x: scroll;
                        width: 206px;
                        white-space: nowrap;
                      "
                    >
                      {{ record.remark }}
                    </div>
                  </template>
                </gj-popover>
                <gj-popconfirm
                  @ok="updateRemark(record)"
                  @popup-visible-change="popupChange(record)"
                  position="bottom"
                >
                  <div style="cursor: pointer; margin-left: 4px">
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
                    <div
                      style="
                        margin: 16px 0 0 0;
                        height: 1px;
                        background: #e6e6ed;
                      "
                    ></div>
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
                <gj-button class="button" type="text" shape="round"
                  >添加</gj-button
                >
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
                    type="text"
                  >
                  </gj-input>
                  <div
                    style="margin: 16px 0 0 0; height: 1px; background: #e6e6ed"
                  ></div>
                </template>
              </gj-popconfirm>
            </template>
          </template>

          <template v-else-if="column.dataIndex === 'Action'">
            <opbtn-group :btn-list="btnList" :row="record"></opbtn-group>
          </template>
          <template v-else>
            <gb-text>{{ text || "--" }}</gb-text>
          </template>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <!-- edit/copy -->
  <details-edit
    v-if="addVisible"
    :dialogVisible="addVisible"
    :actionType="actionType"
    :rowData="rowData"
    listingType="1"
    @tableUplod="tableUplod"
    @cancel="addDialogCancel"
  ></details-edit>

  <gj-modal
    v-model:visible="visibleModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>
      <span>提示</span>
    </template>
    <div v-if="visibleModalType == 'offTheShelf'">
      您即将下架{{
        selectNub
      }}个在线商品，下架后商品将不能被买家检索查看到，是否继续？
    </div>
    <div v-if="visibleModalType == 'update'">
      您即将更新{{ selectNub }}个在线商品，本地数据更新到平台，是否继续？
    </div>
    <div v-if="visibleModalType == 'synchronization'">
      此操作不可逆，是否继续？
    </div>
  </gj-modal>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  // getCurrentInstance,
  computed,
  nextTick,
  ref,
} from "vue";
import { GjMessage } from "@gj/atom";
import {
  getListing,
  getListingOffline,
  getListingModifyBatch,
  getListingSync,
  modifyProductRemarks,
  getListingVariantList,
} from "@api/published/ebay.js";
import QueuePopover from "@/components/QueuePopover.vue";
import tableePop from "@/pages/systemPages/published/eBay/eBayPublish/components/variantPop.vue";
import CommonTable from "@/components/CommonTable.vue";
import SvgIcon from "@/components/SvgIcon";
import gjSiteIdShopIdSelect from "@/components/gj-siteId-shopId-select.vue";
import CommonPage from "@/components/CommonPage.vue";
import { convertSelectedValue } from "@/utils/format";
import { useStore } from "vuex";
import AppRangePicker from "@/components/AppRangePicker.vue";
import { formatDateTime } from "@/utils/format";
import dayjs from "dayjs";
import SelectDirector from "@/components/SelectDirector.vue";
import OperateBtnGroup from "@/components/OperateBtnGroup.vue";
// import { setDefaultView, getDefaultView } from '@/api/publicColumn'
import { handlerFunctions, useChangeList } from "./config.js";
import TagGroup from "@/components/TagGroup.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { setSearchValue } from "@/utils/format.js";
// import detailsEdit from './details.vue'
import detailsEdit from "./onlienEdit.vue";

const DEFAULT_OBJ = {
  rangeValue: [],
  keyWordType: "title",
  timeType: "createTime",
  platformStatus: "1",
};
export default defineComponent({
  name: "pubEBayDraft",
  components: {
    CommonTable,
    SvgIcon,
    gjSiteIdShopIdSelect,
    CommonPage,
    AppRangePicker,
    SelectDirector,
    QueuePopover,
    OperateBtnGroup,
    TagGroup,
    OpbtnGroup,
    tableePop,
    detailsEdit,
  },
  setup() {
    // const { proxy } = getCurrentInstance()
    const $store = useStore();
    const queueRecord = ref("更新队列");
    const queueTitleSuffix = ref("");
    const datas = reactive({
      visibleModal: false,
      searchActive: [],
      visible: false,
      visibleUpdate: false,
      visibleOffTheShelf: false,
      visibleFrom: {
        onlineTime: "",
        state: "",
        timeZone: "",
      },
      visPopover: false,
      searchObj: {
        shopIds: [],
        siteIds: [],
        specsType: "",
        chargePerson: [],
        updateState: "",
        keyWordType: "title",
        timeType: "createTime",
        keyWords: "",
        rangeValue: [],
        platformStatus: "1",
      },
      deletType: "",
      onlineType: 1,
      visibleModalType: "",
      options: [
        {
          name: "标题",
          flag: "title",
          value: "标题",
        },
        {
          name: "SKU/SPU",
          flag: "title",
          value: "SKU/SPU",
        },
      ],
      searchArr: [],
      platform: [],
      draftStatusList: [
        {
          value: 1,
          name: "正常",
        },
        {
          value: 2,
          name: "暂存未更新",
        },
        {
          value: 3,
          name: "更新失败",
        },
      ],
      specifications: [
        {
          name: "单体",
          value: "1",
        },
        {
          name: "变体",
          value: "2",
        },
      ],
      personList: [],
      titelActive: {},
      selectNub: 0,
      form: {
        border: false, //{wrapper: true, cell: true}是否显示边框
        hover: true, //是否显示选中效果
        rowSelection: [],
        loading: false, //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        noData: false, //无数据
        rowName: "id", //表格行 key 的取值字段
        tableData: [],
        pagination: {
          //分页
          pageCurrent: 1,
          pageSize: 20,
          total: 0,
        },
      },
      batchAll: [],
      addVisible: false,
      remarkObj: {},
      actionType: "listingEdit",
      rowData: {}, //表格列数据
      titleListOpt: [
        {
          label: "标题",
          name: "title",
          value: "title",
        },
        {
          label: "SKU/SPU",
          name: "SKU/SPU",
          value: "spu",
        },
        {
          label: "店铺sku",
          name: "shopSku",
          value: "msku",
        },
        {
          label: "itemID",
          name: "itemId",
          value: "itemId",
        },
      ],
      timeOptions: [
        { label: "创建时间", value: "createTime" },
        { label: "更新时间", value: "publishTime" },
      ],
      popconfirmContent: "",
      specificationList: [
        {
          code: 1,
          productName: "单品",
        },
        {
          code: 2,
          productName: "变体",
        },
      ],
      variantListColumns: [
        {
          title: "店铺SKU",
          dataIndex: "msku",
          width: 120,
        },
        {
          title: "库存",
          dataIndex: "quantity",
          align: "right",
          width: 60,
        },
        {
          title: "价格",
          dataIndex: "recommendPrice",
          align: "right",
          width: 120,
          showRecommendPriceUnit: true,
        },
      ],
      splitSymbol: ":",
    });
    const tableColumns = computed(() => {
      return [
        {
          title: "图片",
          dataIndex: "mainImage",
          key: "img",
          sortable: {
            sortDirections: ["ascend", "descend"],
          },
          fixed: "left",
          width: 120,
        },
        {
          title: "标题",
          dataIndex: "defaultTitle",
          width: 160,
        },
        // {
        //   title: '产品名/SKU/SPU',
        //   dataIndex: 'spu',
        //   sorter: {
        //     compare: (a, b) => a.spu - b.spu,
        //     multiple: 1,
        //   },
        //   width: 160,
        // },
        {
          title: "站点",
          dataIndex: "siteName",
          width: 140,
          resizable: true,
        },
        {
          title: "店铺",
          dataIndex: "shopName",
          width: 140,
        },
        {
          title: "Item ID",
          dataIndex: "platformItemId",
          width: 140,
        },
        {
          title: "规格",
          dataIndex: "specsType",
          width: 140,
        },
        {
          title: "店铺SKU",
          dataIndex: "msku",
          width: 180,
        },
        {
          title: "sku",
          dataIndex: "spu",
          width: 140,
        },
        {
          title: "ebay分类",
          dataIndex: "categoryId",
          width: 140,
        },
        {
          title: "数量",
          dataIndex: "quantity",
          width: 140,
        },
        {
          title: "售价",
          dataIndex: "recommendPrice",
          width: 140,
        },
        {
          title: "更新状态",
          dataIndex: "updateState",
          width: 140,
        },
        {
          title: "刊登天数",
          dataIndex: "listingDuration",
          width: 100,
        },
        {
          title: "负责人",
          dataIndex: "chargePersonName",
          width: 140,
        },
        // {
        //   title: '状态',
        //   dataIndex: 'platformStatus', //(0:未刊登，1：在线，2：已下架) ,
        //   width: 140,
        // },

        {
          title: "创建时间",
          dataIndex: "createTime",
          width: 160,
        },
        {
          title: "发布时间",
          dataIndex: "publishTime",
          width: 160,
        },
        {
          title: "操作",
          dataIndex: "Action",
          fixed: "right",
          width: 130,
        },
      ];
    });
    const queueColumns = computed(() => {
      return [
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
          title: "时间",
          dataIndex: "createdTime",
          width: 160,
        },
        {
          title: "结果",
          dataIndex: "status",
          width: 60,
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
    });

    // 接口调用
    const getList = () => {
      let params = {
        ...datas.searchObj,
        pageCurrent: datas.form.pagination.pageCurrent,
        pageSize: datas.form.pagination.pageSize,
      };
      if (!datas.searchObj.rangeValue) {
        datas.searchObj.rangeValue = [];
      }
      params[`${datas.searchObj.timeType}Start`] =
        datas.searchObj.rangeValue[0] || "";
      params[`${datas.searchObj.timeType}End`] =
        datas.searchObj.rangeValue[1] || "";
      params[datas.searchObj.keyWordType] = datas.searchObj.keyWords || "";
      getListing(params)
        .then((res) => {
          datas.form.tableData = res.data?.records || [{}];
          datas.form.pagination.total = res.data.total;
          datas.form.pagination.pageCurrent = res.data.pageCurrent;
          datas.form.pagination.pageSize = res.data.pageSize;
        })
        .catch(() => {
          errorCallBack();
        });
    };
    //重置按钮事件
    const resetHandler = () => {
      clearSearchObj();
      datas.form.pagination = {
        pageCurrent: 1,
        pageSize: 20,
        total: 0,
      };
      datas.searchActive = [];
      getList();
    };

    // 获取站点信息
    const queryEbayBaseSiteInfo = computed(() => {
      return $store.state.common.siteIdList;
    });
    // 获取店铺信息
    const listingCommonShopId = computed(() => {
      return $store.state.common.shopIdList;
    });
    // 下拉框选择店铺国家
    const handleChange = (searchDataId, searchDataName, value) => {
      const map = {
        siteIds: queryEbayBaseSiteInfo.value,
        shopIds: listingCommonShopId.value,
        updateState: datas.draftStatusList,
        specsType: datas.specifications,
      };
      const valueMap = {
        siteIds: "gerpId",
        shopIds: "shopId",
        updateState: "value",
        specsType: "value",
      };
      const keyMap = {
        siteIds: "nameCn",
        shopIds: "shopName",
        updateState: "name",
        specsType: "name",
      };

      let showValue = convertSelectedValue(
        value,
        map[searchDataId],
        valueMap[searchDataId],
        keyMap[searchDataId]
      );

      const searchItem = {
        showName: searchDataName,
        showValue: setSearchValue(showValue, searchDataId),
        id: searchDataId,
        splitSymbol: datas.splitSymbol,
      };
      changeList(searchItem);
      getList();
    };
    // 下拉框选择负责人
    const handleChargePersonChange = (searchDataId, searchDataName, value) => {
      if (!value) {
        value = [];
      }
      const map = {
        chargePerson: value,
      };
      const valueMap = {
        chargePerson: "value",
      };
      const keyMap = {
        chargePerson: "label",
      };
      const eventValue = value.map((item) => item.value);

      let showValue = convertSelectedValue(
        eventValue,
        map[searchDataId],
        valueMap[searchDataId],
        keyMap[searchDataId]
      );
      const searchItem = {
        showName: searchDataName,
        showValue: setSearchValue(showValue, searchDataId),
        id: searchDataId,
        splitSymbol: datas.splitSymbol,
      };
      datas.searchObj.chargePerson = eventValue;
      changeList(searchItem);
      getList();
    };
    // 生成tags
    const changeList = (target) => {
      datas.searchActive = useChangeList(target, datas.searchActive);
    };
    const changeFilterSelect = (id) => {
      datas.searchObj[id] = Array.isArray(datas.searchObj[id]) ? [] : "";
      getList();
    };
    // 获取label数据
    const getLabel = (list, value) => {
      return list.find((item) => item.value === value)?.label || "";
    };
    // 下拉框结合输入搜索
    const selectDataChange = (searchDataId, searchDataName) => {
      const searchItem = {
        showName: searchDataName,
        showValue: getShowValue(searchDataId),
        id: searchDataId,
        splitSymbol: datas.splitSymbol,
      };

      changeList(searchItem);
      getList();
    };
    //日期选择器
    const dateChange = () => {
      nextTick(() => {
        selectDataChange(
          "rangeValue",
          getLabel(datas.timeOptions, datas.searchObj.timeType)
        );
      });
    };
    // 获取tags的key名称
    const getShowValue = (searchDataId) => {
      let value = "";
      switch (searchDataId) {
        case "rangeValue":
          value =
            datas.searchObj[searchDataId]?.length > 0
              ? setSearchValue(
                  datas.searchObj[searchDataId].map((it) =>
                    formatDateTime(it, "YYYY-MM-DD", "")
                  ),
                  "time"
                )
              : "";
          break;
        case "keyWords":
          value = setSearchValue(datas.searchObj.keyWords, searchDataId);
          break;
      }
      return value;
    };
    //清空数据
    const errorCallBack = () => {
      datas.form.tableData = [];
      datas.form.pagination.total = 0;
    };

    const tableUplod = () => {
      getList();
    };
    const getUpdate = (val) => {
      datas.visibleUpdate = val;
      if (datas.selectNub < 1) {
        datas.visibleUpdate = false;
      }
    };

    const getOffTheShelf = (val) => {
      datas.visibleOffTheShelf = val;
      if (datas.selectNub < 1) {
        datas.visibleOffTheShelf = false;
      }
    };
    const popupChange = (record) => {
      datas.remarkObj[record.id] = record.remark;
    };
    const updateRemark = (record) => {
      const { id } = record;
      const value = datas.remarkObj[record.productId];
      let params = value;
      modifyProductRemarks(params, id).then((res) => {
        const { code, message } = res;
        if (code !== 200) {
          GjMessage.success(message);
        }
        GjMessage.success("编辑成功！");
        getList();
      });
    };

    // 分页切换
    const getTableCurrent = (e) => {
      datas.form.pagination = {
        pageCurrent: e.pageCurrent,
        total: e.total,
        pageSize: e.pageSize,
      };
      getList();
    };
    // 下架，更新，同步
    const batchRelease = (row, key) => {
      datas.onlineType = key == "offTheShelf" ? 1 : key == "update" ? 2 : 3;
      datas.form.rowSelection = [row];
      handleOk();
    };
    const handleCancel = () => {
      datas.visible = false;
      datas.form.rowSelection = [];
      datas.selectNub = 0;
    };
    //批量下架，更新，同步
    const batchReleaseAll = (val) => {
      datas.onlineType = val == "offTheShelf" ? 1 : val == "update" ? 2 : 3;
      if (datas.selectNub <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      } else {
        datas.visibleModalType = val;
        datas.visibleModal = true;
      }
      //   // offTheShelf 所选商品暂时不可下架，请稍后再试！
      //   // 您即将更新N个在线商品，本地数据更新到平台，是否继续？
      //   // 所选商品暂时不可同步，请稍后再试！
      // }
    };
    const handleOk = () => {
      let parmas = {
        ids: datas.form.rowSelection.map((item) => item.id),
      };
      if (datas.onlineType === 1) {
        listingOffline(parmas);
      } else if (datas.onlineType === 2) {
        listingModifyBatch(parmas);
      } else if (datas.onlineType === 3) {
        listingSync(parmas);
      }
      handleCancel();
      getList();
    };
    //批量下架
    const listingOffline = (val) => {
      getListingOffline(val).then((res) => {
        if (res.code === 0 || res.code === 200) {
          GjMessage.success(
            "下架任务已提交，下架后可在“已下架”列表查看或重新上架。"
          );
        } else {
          GjMessage.warning("下架任务提交失败，若要下架请重新操作！");
        }
      });
    };
    //批量更新
    const listingModifyBatch = (val) => {
      getListingModifyBatch(val).then((res) => {
        if (res.code === 0 || res.code === 200) {
          GjMessage.success("更新任务已提交，请稍后查看！");
        } else {
          GjMessage.warning("更新任务提交失败，请重试！");
        }
      });
    };
    //批量同步
    const listingSync = (val) => {
      getListingSync(val).then((res) => {
        if (res.code === 0 || res.code === 200) {
          GjMessage.success("同步任务已提交，请稍后查看！");
        } else {
          GjMessage.warning("同步任务提交失败，请重试！");
        }
      });
    };
    // 更新队列
    const queueHandlerFunction = (res) => {
      const list = res.data ?? [];
      const statsIngNum = list.filter((item) => item.status === 1)?.length || 0;
      const statsFailNum =
        list.filter((item) => item.status === 3)?.length || 0;
      queueTitleSuffix.value = `（上传中${statsIngNum} 失败${statsFailNum}）`;
      queueRecord.value = "更新队列" + `${statsIngNum}/${list.length}`;
      const result = list.map((item, index) => ({
        ...item,
        id: item.id || index,
      }));
      return { total: result.length, tableData: result };
    };
    // 变体信息
    const handlerFunction = (res) => {
      const list = handlerFunctions(res, datas.variantListColumns);
      datas.variantListColumns = list.variantListColumns;
      return list.tableList;
    };
    // 初始化筛选数据
    const clearSearchObj = () => {
      Object.keys(datas.searchObj).forEach((key) => {
        datas.searchObj[key] =
          DEFAULT_OBJ[key] ?? (Array.isArray(datas.searchObj[key]) ? [] : "");
      });
    };
    // 默认视图数据回显
    const changeQueryList = (target) => {
      clearSearchObj();
      if (target && target.length) {
        target.forEach((item) => {
          if (item.extra && item.extra !== {}) {
            Object.keys(item.extra).forEach((key) => {
              datas.searchObj[key] = item.extra[key];
            });
          } else {
            datas.searchObj[item.connectCode] = item.code;
          }
        });
      }
      getList();
    };

    const selectedRowKeys = computed(() => {
      return datas.form.rowSelection.map((item) => item["id"]);
    });
    // 多选
    const getSelection = (selectedRowKeys) => {
      datas.form.rowSelection = selectedRowKeys;
      datas.batchAll = selectedRowKeys;
      datas.selectNub = datas.batchAll.length;
    };

    const edit = (val) => {
      datas.addVisible = true;
      datas.actionType = "listingEdit";
      datas.rowData = val;
    };

    const copyRow = (val) => {
      datas.addVisible = true;
      datas.actionType = "listingCopy";
      datas.rowData = val;
    };
    const addDialogCancel = () => {
      datas.addVisible = false;
    };
    const handleChangeTable = (val) => {
      console.log(val, "table");
    };
    const emptyFilter = (data) => {
      if (data || data === 0) {
        return data;
      } else {
        return "-";
      }
    };
    const btnList = computed(() => {
      return [
        {
          label: "编辑",
          click: (row) => edit(row),
          outside: true,
          permission: ["EBAY/pubEBayOnLineGoods/onLine/edit"],
        },
        {
          label: "下架",
          click: (row) => batchRelease(row, "offTheShelf"),
          permission: ["EBAY/pubEBayOnLineGoods/onLine/offTheShelf"],
          tooltipContent: "即将下架该商品，是否确认?",
          isPopConfirm: true,
        },
        {
          label: "复制",
          click: (row) => copyRow(row),
          permission: ["EBAY/pubEBayOnLineGoods/onLine/copy"],
        },
        {
          label: "同步",
          isPopConfirm: true,
          click: (row) => batchRelease(row, "synchronization"),
          tooltipContent: "即将同步该商品，是否同步?",
          permission: ["EBAY/pubEBayOnLineGoods/onLine/synchronize"],
        },
        {
          label: "更新",
          click: (row) => batchRelease(row, "update"),
          tooltipContent: "即将更新该商品，是否确认更新?",
          isPopConfirm: true,
          // permission: ['EBAY/pubEBayOnLineGoods/onLine/update'],
        },
      ];
    });
    const initFormatDateTime = (dateTime) => {
      if (dateTime) {
        return dayjs(dateTime).format("YYYY-MM-DD hh:mm:ss");
      } else {
        return "--";
      }
    };
    onBeforeMount(() => {
      getList();
    });
    return {
      ...toRefs(datas),
      selectedRowKeys,
      dayjs,
      tableColumns,
      initFormatDateTime,
      resetHandler,
      handleChange,
      getLabel,
      dateChange,
      selectDataChange,
      getTableCurrent,
      getSelection,
      edit,
      copyRow,
      changeFilterSelect,
      addDialogCancel,
      updateRemark,
      popupChange,
      emptyFilter,
      tableUplod,
      handleChangeTable,
      batchReleaseAll,
      batchRelease,
      handleOk,
      handleCancel,
      getUpdate,
      getOffTheShelf,
      queueColumns,
      queueRecord,
      queueHandlerFunction,
      queueTitleSuffix,
      handlerFunction,
      getListingVariantList,
      handleChargePersonChange,
      changeQueryList,
      btnList,
    };
  },
});
</script>
<style lang="scss" scoped>
.item {
  padding: 8px 0px;
  border-bottom: 1px solid #f2f2f5;
  overflow: hidden;
}

.selectTotla {
  float: left;
  padding: 10px 15px 10px 0px;
  font-size: 12px;
  text-align: left;
  color: #000430;
}

.item_btn {
  padding: 8px 0px;
  .item-btn-rigth {
    margin: 8px;
    text-align: right;
  }
}

.authorizationManage,
.eye,
.selectDown,
.copyIcon,
.close {
  position: relative;
  top: 4px;
  font-size: 15px;
}

.grid-demo .arco-tag {
  border-radius: 20px;
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
.variantIcon {
  display: flex;
  width: max-content;
  align-items: center;
}
</style>
