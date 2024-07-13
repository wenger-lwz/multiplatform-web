//draftPage 草稿
<template>
  <CommonPage
    :pageRest="true"
    @common-page-rest="reset"
    :currentRouterPermission="'EBAY/pubEBayDraft/view'"
  >
    <template #tag-content>
      <div class="tag-wrap" v-if="searchActive.length > 0">
        <gj-tag
          closable
          v-for="(item, index) in searchActive"
          :key="index"
          @close="tagClose(item)"
          class="normal-tag-btn"
        >
          <span>{{ item.activeName }}</span>
        </gj-tag>
      </div>
    </template>
    <template #filter-content>
      <gb-select
        class="search-gb-select"
        placeholder="站点"
        :allow-clear="false"
        :max-tag-count="1"
        multiple
        v-model="searchObj.siteIds"
        @confirm="platchangeFun"
        @clear="platchangeFun"
      >
        <gb-select-option
          v-for="item in platform"
          :value="item.platformCode"
          :key="item.platformCode"
          >{{ item.platformName }}
        </gb-select-option>
      </gb-select>
      <gb-select
        class="search-gb-select"
        placeholder="店铺"
        multiple
        :max-tag-count="1"
        v-model="searchObj.shopIds"
        @confirm="shopIdChangeFun"
      >
        <gb-select-option
          v-for="item in shopIdList"
          :value="item.shopId"
          :key="item.shopId"
          >{{ item.shopName }}
        </gb-select-option>
      </gb-select>
      <gj-select
        class="search-select"
        placeholder="状态"
        allow-clear
        v-model="searchObj.publishState"
        :trigger-props="{ autoFitPopupMinWidth: true }"
        @change="publishStateFun"
        @clear="publishStateFun"
      >
        <gj-option
          v-for="(item, index) in draftStatusList"
          :value="item.value"
          :key="index"
          >{{ item.name }}
        </gj-option>
      </gj-select>
      <gj-input-group>
        <gj-select
          class="search-select-left"
          placeholder="标题"
          :trigger-props="{ autoFitPopupMinWidth: true }"
          v-model="titleStatus"
          @change="titelTextChange(titleStatus, searchObj.spu)"
        >
          <gj-option
            v-for="(item, index) in options"
            :value="item.value"
            :key="index"
            >{{ item.name }}
          </gj-option>
        </gj-select>
        <gj-input-search
          v-model="searchObj.spu"
          @search="titelTextChange(titleStatus, searchObj.spu)"
          @keyup.enter="titelTextChange(titleStatus, searchObj.spu)"
          class="search-select-rigth"
          placeholder="请输入内容"
        />
      </gj-input-group>
      <gj-select
        class="search-select"
        placeholder="全部规格"
        allow-clear
        v-model="searchObj.specsType"
        @change="specificationsFun"
        @clear="specificationsFun"
      >
        <gj-option
          v-for="(item, index) in specifications"
          :key="index"
          :value="item.value"
          >{{ item.name }}
        </gj-option>
      </gj-select>

      <select-director
        class="search-select"
        placeholder="负责人"
        multiple
        :max-tag-count="1"
        allow-search
        allow-clear
        popup-container="#multiplatform-web"
        v-model="searchObj.chargePersonIds"
        @ok="personFun"
        @clear="personFun"
      />
      <gj-input-group class="gb-composite">
        <gj-select
          v-model="modeTimeStart"
          class="search-select-left"
          placeholder="时间"
          :trigger-props="{ autoFitPopupMinWidth: true }"
          @change="timeChange('time', rangeValue)"
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
          @change="timeChange"
          v-model="rangeValue"
        />
      </gj-input-group>
    </template>
    <template #operate_bar-content>
      <OperateBar>
        <template #left>
          <gj-space align="center">
            <gj-button
              v-permissions="['EBAY/pubEBayDraft/add']"
              type="primary"
              @click="createWares"
              >添加草稿</gj-button
            >
            <gj-button
              v-permissions="['EBAY/pubEBayDraft/batchRelease']"
              type="plain"
              @click="batchReleaseAll('lj')"
              >批量发布</gj-button
            >
            <gj-button
              v-permissions="['EBAY/pubEBayDraft/batchTiming']"
              type="plain"
              @click="batchReleaseAll('ds')"
              >批量定时</gj-button
            >
            <gj-button
              v-permissions="['EBAY/pubEBayDraft/batchDelete']"
              type="plain"
              @click="cutOut('all')"
              >批量删除</gj-button
            >
            <div style="margin: 8px" class="select-total">
              <span class="select-total-text">已选</span>
              <span class="select-total-num">{{ selectNub }}</span>
            </div>
          </gj-space>
        </template>
        <template #right>
          <QueuePopover :platformCode="'EBAY'"></QueuePopover>
        </template>
      </OperateBar>
    </template>

    <template #table-content>
      <CommonTable
        :rowKey="'id'"
        :columns="tableColumns"
        :tableData="form.tableData"
        :loading="form.loading"
        :scroll="form.scroll"
        :selectedRowKeys="selectedRowKeys"
        :rowSelectionVisiable="true"
        @onRowSelection="getSlection"
        :pagination="form.pagination"
        @change="handleChangeTable"
        @getTableCurrent="getTableCurrent"
        class="table_header"
      >
        <template #bodyCell="{ record, column, text }">
          <div v-if="column.dataIndex === 'mainImage'">
            <gb-image width="36" :src="text"></gb-image>
          </div>
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
          <div v-else-if="column.dataIndex === 'spu'">
            <p>{{ record.defaultTitle }}</p>
            <column-copy
              :textValue="record.spu"
              :isAnchor="false"
            ></column-copy>
          </div>
          <div v-else-if="column.dataIndex === 'remark'">
            <template v-if="record.remark">
              <div class="note-wrap">
                <gj-popover position="top">
                  <div class="note">{{ record.remark }}</div>
                  <template #content>
                    <div class="remark-now">
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
          </div>

          <div v-else-if="column.dataIndex === 'recommendPrice'">
            <span v-if="record.recommendPrice">
              {{ record.recommendPrice }}{{ record.priceUnit }}
            </span>
            <span v-else>
              {{ "--" }}
            </span>
          </div>
          <div v-else-if="column.dataIndex === 'publishState'">
            <span v-if="record.publishState == 1">
              <i class="hot1"></i>
              待发布
            </span>
            <span v-if="record.publishState == 2">
              <i class="hot2"></i>
              已发布
            </span>
            <span v-if="record.publishState == 3">
              <i class="hot3"></i>
              <gj-popover position="bottom">
                <span>发布失败</span>
                <template #content>
                  <span>{{ record?.failReason }}</span>
                </template>
              </gj-popover>
              <!-- failReason -->
            </span>
          </div>
          <div v-else-if="column.dataIndex === 'complete'">
            <complete-pop :record="record"></complete-pop>
          </div>
          <div v-else-if="column.dataIndex === 'createTime'">
            <span>{{ ebayPrototype.formatDateTime(record.createTime) }}</span>
          </div>
          <div v-else-if="column.dataIndex === 'publishTime'">
            <span>{{ ebayPrototype.formatDateTime(record.publishTime) }}</span>
          </div>
          <div v-else-if="column.dataIndex === 'Action'">
            <opbtn-group :btn-list="btnList" :row="record"></opbtn-group>
          </div>
          <div v-else>{{ text ? text : "--" }}</div>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <!-- add -->
  <goods-add
    v-if="addVisible"
    :dialogVisible="addVisible"
    :actionType="actionType"
    :rowData="rowData"
    @tableUplod="tableUplod"
    @cancel="addDialogCancel"
  ></goods-add>

  <gj-modal
    v-model:visible="visible"
    unmount-on-close
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>
      <span v-if="onlineType == 1">立即发布</span>
      <span v-if="onlineType == 2">定时发布</span>
      <span v-if="onlineType == 3 || onlineType == 4">提示</span>
    </template>
    <div v-if="onlineType == 1 || onlineType == 4">
      {{ publishText }}
    </div>
    <div v-else-if="onlineType == 2">
      <gj-form :model="form">
        <gj-row :gutter="24">
          <gj-col :span="20">
            <gj-form-item field="name" label="选择时区">
              <gj-radio-group
                v-model="visibleFrom.timeZone"
                @change="getTimezone"
              >
                <gj-radio value="Asia/Shanghai">默认时区（北京）</gj-radio>
                <gj-radio value="1">站点时区（美国）</gj-radio>
              </gj-radio-group>
            </gj-form-item>
          </gj-col>
          <gj-col :span="24">
            <gj-form-item field="onlineTime" label="选择时间">
              <!-- <gj-date-picker
                size="small"
                style="width: 200px"
                v-model="visibleFrom.onlineTime"
              /> -->
              <gj-date-picker
                style="width: 220px; margin: 0 24px 24px 0"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-model="visibleFrom.onlineTime"
                :disabledDate="(current) => dayjs(current).isBefore(dayjs())"
                :disabledTime="getDisabledTime"
                @change="onChange"
                @select="onSelect"
                @ok="onOk"
              />
            </gj-form-item>
          </gj-col>
          <gj-col :span="24">
            <gj-form-item field="state" label="是否启用">
              <gj-radio-group v-model="visibleFrom.state">
                <gj-radio :value="true">是</gj-radio>
                <gj-radio :value="false">否</gj-radio>
              </gj-radio-group>
            </gj-form-item>
          </gj-col>
        </gj-row>
      </gj-form>
    </div>
    <div v-else>此操作不可逆，是否删除？</div>
  </gj-modal>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  nextTick,
  computed,
} from "vue";
import { GjMessage } from "@gj/atom";
import dayjs from "dayjs";
import {
  getDraftLists,
  deleteDraftList,
  modifyProductRemarks,
  getDraftReleaseBatch,
  getDraftRelease,
  getQueryEbayBaseSiteInfo,
  getListingCommonShop,
} from "@api/published/ebay.js";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import OperateBar from "@/components/OperateBar.vue";
import SvgIcon from "@/components/SvgIcon";
import columnCopy from "@/components/columnCopy.vue";
import goodsAdd from "./goodsAdd.vue";
import completePop from "./form/moduleCodePop.vue";
import SelectDirector from "@/components/SelectDirector.vue";
import tableePop from "@/pages/systemPages/published/eBay/eBayPublish/components/variantPop.vue";
import QueuePopover from "@/components/QueuePopover.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { ebayPrototype } from "@/pages/systemPages/published/eBay/eBayPublish/components/ebayCommon";
import AppRangePicker from "@/components/AppRangePicker.vue";
export default defineComponent({
  name: "pubEBayDraft",
  components: {
    CommonPage,
    CommonTable,
    SvgIcon,
    goodsAdd,
    SelectDirector,
    columnCopy,
    tableePop,
    QueuePopover,
    OperateBar,
    AppRangePicker,
    completePop,
    OpbtnGroup,
  },
  setup() {
    const data = reactive({
      visible: false,
      publishText: "",
      visibleFrom: {
        id: "",
        onlineTime: "",
        state: true,
        onlineType: "",
        timeZone: "Asia/Shanghai",
      },
      visPopover: false,
      searchObj: {
        siteIds: [],
        shopIds: [],
        spu: "",
        title: "",
        msku: "",
        platformItemIdText: "",
        specsType: "",
        chargePersonIds: [],
        createTimeStart: "",
        publishState: "",
      },
      titleStatus: "1",
      deletType: "",
      onlineType: 1,
      options: [
        {
          name: "标题",
          flag: "title",
          value: "1",
        },
        {
          name: "SKU",
          flag: "title",
          value: "2",
        },
        {
          name: "item ID",
          flag: "title",
          value: "3",
        },
        {
          name: "店铺SKU",
          flag: "title",
          value: "4",
        },
      ],
      searchActive: [],
      platform: [],
      shopIdList: [],
      draftStatusList: [
        {
          value: 1,
          name: "待发布",
          flag: "publishState",
          nameValue: "状态：待发布",
        },
        {
          value: 2,
          name: "已发布",
          flag: "publishState",
          nameValue: "状态：已发布",
        },
        {
          value: 3,
          name: "发布失败",
          flag: "publishState",
          nameValue: "状态：发布失败",
        },
      ],
      specifications: [
        {
          name: "单品",
          value: "1",
          flag: "specsType",
          nameValue: "规格：单品",
        },
        {
          name: "变体",
          value: "2",
          flag: "specsType",
          nameValue: "规格：变体",
        },
      ],
      selectNub: 0,
      form: {
        border: false, //{wrapper: true, cell: true}是否显示边框
        hover: true, //是否显示选中效果
        rowSelection: [],
        scroll: {
          x: 2000,
          y: "auto",
        },
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
          seq: "",
          sortField: "",
        },
      },
      batchAll: [],
      addVisible: false,
      remarkObj: {},
      actionType: "",
      rowData: {}, //表格列数据
      rangeValue: [],
      modeTimeStart: "createTime",
      timeOptions: [
        { label: "创建时间", value: "createTime" },
        { label: "发布时间", value: "publishTime" },
      ],
      textClass: false,
    });
    const btnList = computed(() => {
      return [
        {
          label: "编辑",
          click: (row) => edit(row),
          outside: true,
          permission: ["EBAY/pubEBayDraft/edit"],
        },
        {
          label: "发布",
          click: (row) => batchRelease(row, "lj"),
          permission: ["EBAY/pubEBayDraft/release"],
          tooltipContent: "即将发布1个商品，是否确认发布？",
          isPopConfirm: true,
        },
        {
          label: "定时",
          click: (row) => batchRelease(row, "ds"),
          permission: ["EBAY/pubEBayDraft/timing"],
          tooltipContent: "即将发布1个商品，是否确认定时发布？",
          isPopConfirm: true,
        },
        {
          label: "复制",
          click: (row) => copyRow(row),
          permission: ["EBAY/pubEBayDraft/copy"],
        },
        {
          label: "删除",
          isPopConfirm: true,
          click: (row) => cutOut(row),
          tooltipContent: "此操作不可逆，是否删除？",
          permission: ["EBAY/pubEBayDraft/delete"],
        },
      ];
    });
    const tableColumns = computed(() => {
      return [
        {
          title: "图片",
          dataIndex: "mainImage",
          key: "img",
          fixed: "left",
          width: 120,
        },
        {
          title: "标题/SPU/SKU",
          dataIndex: "spu",
          fixed: "left",
          width: 160,
        },
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
          title: "规格",
          dataIndex: "specsType",
          width: 140,
        },
        {
          title: "店铺SKU",
          dataIndex: "msku",
          width: 160,
        },
        {
          title: "ebay分类",
          dataIndex: "platformCategoryName",
          width: 160,
        },
        {
          title: "售价",
          dataIndex: "recommendPrice",
          width: 140,
        },
        {
          title: "完整度",
          dataIndex: "complete",
          width: 140,
        },
        {
          title: "状态",
          dataIndex: "publishState", // platformStatus(0:未刊登，1：在线，2：已下架) ,
          width: 140,
        },
        {
          title: "负责人",
          dataIndex: "chargePersonName",
          width: 140,
        },
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
          width: 140,
        },
      ];
    });
    const popupChange = (record) => {
      data.remarkObj[record.id] = record.remark;
    };
    const updateRemark = (record) => {
      const { id } = record;
      const value = data.remarkObj[record.productId];
      let params = value;
      modifyProductRemarks(params, id).then((res) => {
        if (res.code == 0 || res.code == 200) {
          GjMessage.success("草稿保存成功！");
        } else {
          GjMessage.warning("草稿保存失败！");
        }
        getlist();
      });
    };
    //处理Serach中下拉框的单选
    const setSerachFun = (e, attr, row) => {
      let cunt = {};
      if (attr == "platformName") {
        row.forEach((item) => {
          if (e == item.platformCode) {
            cunt = {
              ...item,
              name: item.platformName,
            };
          }
        });
      } else {
        row.forEach((item) => {
          if (e == item.value) {
            cunt = item;
          }
        });
      }
      if (data.searchActive.length == 0) {
        return setPushFun(row, e, attr);
      } else {
        let active = false;
        data.searchActive.forEach((item, index) => {
          if (item.flag == cunt.flag) {
            data.searchActive.splice(index, 1);
            data.searchActive.push({
              activeName: cunt.nameValue,
              name: cunt[attr],
              value: cunt.value,
              flag: cunt.flag,
            });
            active = false;
          } else {
            active = true;
          }
        });
        if (active) {
          setPushFun(row, e, attr);
          active = false;
        }
      }
      getlist();
    };
    // 选中的查询条件
    const setPushFun = (row, e, name) => {
      let list = [];
      let obj = {};
      if (name == "platformName") {
        e.forEach((i) => {
          row.map((item) => {
            if (i === item.value) {
              obj = {
                activeName: item.nameValue,
                name: item[name],
                value: item.value,
                flag: item.flag,
              };
              list.push({
                activeName: item.nameValue,
                name: item[name],
                value: item.value,
                flag: item.flag,
              });
            }
          });
        });
        let b = list.map((item) => {
          return item.name;
        });
        obj.activeName = "站点 ：" + b.join(",");

        data.searchActive.forEach((item, index) => {
          if (item.flag == "platformName") {
            data.searchActive.splice(index, 1);
          }
        });
        data.searchActive.push(obj);
      } else {
        row.map((item) => {
          if (e === item.value) {
            data.searchActive.push({
              activeName: item.nameValue,
              name: item[name],
              value: item.value,
              flag: item.flag,
            });
          }
        });
      }

      getlist();
    };
    // 站点
    const platchangeFun = (e) => {
      if (e.length !== 0) {
        let nameArr = [];
        let beyondStr = "";
        if (e.length > 3) {
          e.forEach((ele, index) => {
            data.platform.forEach((item) => {
              if (index < 2) {
                if (item.platformCode == ele) {
                  nameArr.push(item.platformName);
                }
              }
            });
          });
          beyondStr = nameArr.join(",") + `,等${e.length}项`;
        } else {
          e.forEach((ele) => {
            data.platform.forEach((item) => {
              if (item.platformCode == ele) {
                nameArr.push(item.platformName);
              }
            });
          });
        }
        let createTure = false;
        data.searchActive.forEach((item, index) => {
          if (item.flag == "platformName") {
            data.searchActive.splice(index, 1);
            data.searchActive.push({
              name: nameArr.join(","),
              activeName:
                "站点" +
                " ：" +
                `${e.length > 3 ? beyondStr : nameArr.join(",")}`,
              flag: "platformName",
              value: e
                .map((item) => {
                  return item.value;
                })
                .join(","),
            });
            createTure = true;
          } else {
            createTure = false;
          }
        });
        if (!createTure) {
          data.searchActive.push({
            name: nameArr.join(","),
            activeName:
              "站点" +
              " ：" +
              `${e.length > 3 ? beyondStr : nameArr.join(",")}`,
            flag: "platformName",
            value: e
              .map((item) => {
                return item.value;
              })
              .join(","),
          });
        }
      } else {
        data.searchActive.forEach((item, index) => {
          if (item.flag == "platformName") {
            data.searchActive.splice(index, 1);
          }
        });
      }
      getlist();
    };
    // 店铺
    const shopIdChangeFun = (e) => {
      if (e.length !== 0) {
        let nameArr = [];
        let beyondStr = "";
        if (e.length > 3) {
          e.forEach((ele, index) => {
            data.shopIdList.forEach((item) => {
              if (index < 2) {
                if (item.shopId == ele) {
                  nameArr.push(item.shopName);
                }
              }
            });
          });
          beyondStr = nameArr.join(",") + `,等${e.length}项`;
        } else {
          e.forEach((ele) => {
            data.shopIdList.forEach((item) => {
              if (item.shopId == ele) {
                nameArr.push(item.shopName);
              }
            });
          });
        }
        let createTure = false;
        data.searchActive.forEach((item, index) => {
          if (item.flag == "shopIds") {
            data.searchActive.splice(index, 1);
            data.searchActive.push({
              name: nameArr.join(","),
              activeName:
                "店铺 :" + `${e.length > 3 ? beyondStr : nameArr.join(",")}`,
              flag: "shopIds",
              value: e.map((item) => {
                return item.shopId;
              }),
            });
            createTure = true;
          } else {
            createTure = false;
          }
        });
        if (!createTure) {
          data.searchActive.push({
            name: nameArr.join(","),
            activeName:
              "店铺 :" + `${e.length > 3 ? beyondStr : nameArr.join(",")}`,
            flag: "shopIds",
            value: e.map((item) => {
              return item.shopId;
            }),
          });
        }
      } else {
        data.searchActive.forEach((item, index) => {
          if (item.flag == "shopIds") {
            data.searchActive.splice(index, 1);
          }
        });
      }
      getlist();
    };
    // 规格
    const specificationsFun = (e) => {
      if (e) {
        setSerachFun(e, "name", data.specifications);
      } else {
        data.searchActive.forEach((item, index) => {
          if (item.flag == "specsType") {
            data.searchActive.splice(index, 1);
            getlist();
          }
        });
      }
    };
    // 状态
    const publishStateFun = (e) => {
      if (e) {
        setSerachFun(e, "name", data.draftStatusList);
      } else {
        data.searchActive.forEach((item, index) => {
          if (item.flag == "publishState") {
            data.searchActive.splice(index, 1);
            getlist();
          }
        });
      }
    };
    // 负责人
    const personFun = (e) => {
      if (e) {
        let createTure = false;
        data.searchActive.forEach((item, index) => {
          if (item.flag == "chargePersonIds") {
            data.searchActive.splice(index, 1);
            data.searchActive.push({
              name: e
                .map((item) => {
                  return item.label;
                })
                .join(","),
              activeName:
                "负责人" +
                " ：" +
                e
                  .map((item) => {
                    return item.label;
                  })
                  .join(","),
              flag: "chargePersonIds",
              value: e
                .map((item) => {
                  return item.value;
                })
                .join(","),
            });
            createTure = true;
          } else {
            createTure = false;
          }
        });
        if (!createTure) {
          data.searchActive.push({
            name: e
              .map((item) => {
                return item.label;
              })
              .join(","),
            activeName:
              "负责人" +
              " ：" +
              e
                .map((item) => {
                  return item.label;
                })
                .join(","),
            flag: "chargePersonIds",
            value: e
              .map((item) => {
                return item.value;
              })
              .join(","),
          });
        }
      } else {
        data.searchActive.forEach((item, index) => {
          if (item.flag == "chargePersonIds") {
            data.searchActive.splice(index, 1);
          }
        });
      }
      getlist();
    };

    //日期
    const timeChange = (e, rangeValue) => {
      if (e) {
        let time = [];
        if (e == "time") {
          if (rangeValue.length == 0) return false;
          time = rangeValue?.map((item) => {
            return ebayPrototype.formatDateTime(item);
          });
        } else {
          time = e?.map((item) => {
            return ebayPrototype.formatDateTime(item);
          });
        }
        let str = time?.map((item) => {
          return item.slice(0, -9);
        });
        let lable = data.timeOptions.filter(
          (v) => v.value == data.modeTimeStart
        );
        let createTure = false;
        data.searchActive.forEach((item, index) => {
          if (item.flag == "createTime" || item.flag == "publishTime") {
            data.searchActive.splice(index, 1);
            data.searchActive.push({
              name: lable[0].label,
              activeName: lable[0].label + " ：" + str.join("-"),
              flag: lable[0].value,
              value: str.join("-"),
            });
            createTure = true;
          } else {
            createTure = false;
          }
        });
        if (!createTure) {
          data.searchActive.push({
            name: lable[0].label,
            activeName: lable[0].label + " ：" + str.join("-"),
            flag: lable[0].value,
            value: str.join("-"),
          });
        }
      } else {
        data.searchActive.forEach((item, index) => {
          if (item.flag == "createTime" || item.flag == "publishTime") {
            data.searchActive.splice(index, 1);
          }
        });
      }
      nextTick(() => {
        getlist();
      });
    };
    // 标题文本
    const titelTextChange = (type, val) => {
      if (val) {
        let cunter = data.options.filter((v) => v.value == type);
        let createTure = false;
        data.searchActive.forEach((item, index) => {
          if (item.flag == "title") {
            data.searchActive.splice(index, 1);
            data.searchActive.push({
              name: cunter[0].name,
              activeName: cunter[0].name + " ：" + val,
              flag: cunter[0].flag,
              value: val,
            });
            createTure = true;
          } else {
            createTure = false;
          }
        });
        if (!createTure) {
          data.searchActive.push({
            name: cunter[0].name,
            activeName: cunter[0].name + " ：" + val,
            flag: cunter[0].flag,
            value: val,
          });
        }
        nextTick(() => {
          getlist();
        });
      } else {
        data.searchActive.forEach((item) => {
          if (item.flag == "title") {
            tagClose(item);
          }
        });
      }
    };
    const getlist = () => {
      let params = {
        ...data.searchObj,
        pageCurrent: data.form.pagination.pageCurrent,
        pageSize: data.form.pagination.pageSize,
        title: data.titleStatus == "1" ? data.searchObj.spu : "",
        spu: data.titleStatus == "2" ? data.searchObj.spu : "",
        platformItemIdText: data.titleStatus == "3" ? data.searchObj.spu : "",
        msku: data.titleStatus == "4" ? data.searchObj.spu : "",
        createTimeStart:
          data.modeTimeStart == "createTime"
            ? data.rangeValue
              ? data.rangeValue[0]
              : ""
            : "",
        createTimeEnd:
          data.modeTimeStart == "createTime"
            ? data.rangeValue
              ? data.rangeValue[1]
              : ""
            : "",
        updateTimeStart:
          data.modeTimeStart == "publishTime"
            ? data.rangeValue
              ? data.rangeValue[0]
              : ""
            : "",
        updateTimeEnd:
          data.modeTimeStart == "publishTime"
            ? data.rangeValue
              ? data.rangeValue[1]
              : ""
            : "",
      };
      getDraftLists(params).then((res) => {
        data.form.tableData = res.data.records;
        data.form.pagination.total = res.data.total;
      });
    };

    const getTableCurrent = (e) => {
      data.form.pagination = {
        ...data.form.pagination,
        pageCurrent: e.pageCurrent,
        pageSize: e.pageSize,
      };
      getlist();
    };

    const getTimezone = (val) => {
      if (val == 1) {
        data.visibleFrom = {
          ...data.visibleFrom,
          timeZone: "",
        };
      }
    };
    const handleOk = () => {
      if (data.onlineType == 3) {
        return deletFun();
      }
      if (data.onlineType == 4) {
        console.log("验证未通过");
        return handleCancel();
      }
      let d = new Date(data.visibleFrom.onlineTime);
      let params = {};
      if (data.onlineType == 2) {
        params.onlineVoList = [
          {
            id: data.visibleFrom.id,
            onlineTime: d.getTime(d),
            onlineType: data.onlineType,
            state: data.visibleFrom.state,
            timeZone: data.visibleFrom.timeZone,
          },
        ];
      } else {
        params.onlineVoList = data.batchAll.map((item) => {
          return {
            id: item,
            onlineTime: d.getTime(d),
            onlineType: data.onlineType,
            state: false,
            timeZone: "",
          };
        });
      }
      // if (!data.visibleFrom.onlineTime) return;
      getDraftReleaseBatch(params.onlineVoList).then((res) => {
        if (res.code == 0 || res.code == 200) {
          GjMessage.success("发布任务已提交，请稍后查看！");
          data.visible = false;
          getlist();
          data.form.rowSelection = [];
          data.selectNub = 0;
        } else {
          GjMessage.warning("发布任务提交失败，请重试！");
        }
      });
    };

    const handleCancel = () => {
      data.visible = false;
      data.form.rowSelection = [];
      data.selectNub = 0;
    };
    // 发布
    const batchRelease = (row, val) => {
      if (row.publishState == 2) {
        handleCancel();
        return GjMessage.warning("所选草稿暂时不可发布，请稍后再试！");
        // data.publishText = '所选草稿暂时不可发布，请稍后再试！'
        // data.visible = true
        // data.onlineType = 4
      } else {
        let list = row.completeDetails.filter((item) => !item.moduleEnable);
        if (list.length !== 0) {
          return GjMessage.warning("选中的草稿需要补充完整信息才能发布！");
          // data.publishText = '选中的草稿需要补充完整信息才能发布！'
          // data.visible = true
          // data.onlineType = 4
        } else {
          data.visibleFrom.id = row.id;
          data.onlineType = val == "lj" ? 1 : 2;
          if (data.onlineType == 2) {
            data.visible = true;
          } else {
            let params = {
              id: row.id,
              onlineTime: null,
              onlineType: data.onlineType,
              state: false,
              timeZone: "",
            };
            getDraftRelease(params).then((res) => {
              if (res.code == 0 || res.code == 200) {
                GjMessage.success("发布任务已提交，请稍后查看！");
                data.visible = false;
                getlist();
              } else {
                GjMessage.warning("发布任务提交失败，请重试！");
              }
            });
          }
        }
      }
    };
    //批量发布/批量定时发布
    const batchReleaseAll = (val) => {
      data.onlineType = val == "lj" ? 1 : 2;
      if (data.selectNub <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      } else {
        let isTrue = true;
        data.form.rowSelection.forEach((ele) => {
          let list = ele.completeDetails.filter((item) => !item.moduleEnable);
          if (list.length !== 0) {
            isTrue = false;
          }
        });
        // 1:待发布，2已发布,3发布失败
        let b = data.form.rowSelection.filter((item) => item.publishState == 2);
        if (b.length !== 0) {
          handleCancel();
          return GjMessage.warning("所选草稿暂时不可发布，请稍后再试！");
          // data.publishText = '所选草稿暂时不可发布，请稍后再试！'
          // data.visible = true
          // data.onlineType = 4
        }
        if (isTrue) {
          data.publishText = `即将发布${data.selectNub} 条商品，是否确认${
            data.onlineType == 1 ? "立即" : "定时"
          }发布 `;
          data.visible = true;
        } else {
          handleCancel();
          return GjMessage.warning("所选草稿暂时不可发布，请稍后再试！");
          // data.publishText = '选中的草稿需要补充完整信息才能发布！'
          // data.visible = true
          // data.onlineType = 4
        }
      }
    };

    // 删除/批量
    const cutOut = (val) => {
      if (data.selectNub <= 0 && val == "all") {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.onlineType = 3;
      data.deletType = val;
      data.visible = true;
    };
    const deletFun = () => {
      let params = {
        ids: [],
      };
      if (data.deletType == "all") {
        params.ids = data.batchAll;
      } else {
        params.ids = [data.deletType.id];
      }
      deleteDraftList(params).then((res) => {
        if (res.code == 0 || res.code == 200) {
          GjMessage.success(`已删除${params.ids.length}条商品资料！`);
          data.onlineType = 1;
          data.visible = false;
          getlist();
        } else {
          GjMessage.warning("删除失败，若要删除请重新操作！");
        }
      });
    };
    //创建
    const createWares = () => {
      data.addVisible = true;
      data.actionType = "add";
    };

    const goodsdraftRow = (val) => {
      data.batchAll = [val.id];
      // data.draftVisible = true
    };
    const selectedRowKeys = computed(() => {
      return data.form.rowSelection.map((item) => item["id"]);
    });
    // 多选
    const getSlection = (selectedRowKeys) => {
      data.form.rowSelection = selectedRowKeys;
      data.batchAll = selectedRowKeys.map((item) => {
        return item.id;
      });
      data.selectNub = data.batchAll.length;
    };

    const edit = (val) => {
      data.addVisible = true;
      data.actionType = "edit";
      data.rowData = val;
    };

    const copyRow = (val) => {
      data.addVisible = true;
      data.actionType = "copy";
      data.rowData = val;
    };

    const tableUplod = () => {
      getlist();
    };
    const tagClose = (val) => {
      if (val.flag == "createTime" || val.flag == "publishTime") {
        data.modeTimeStart = "createTime";
        data.rangeValue = [];
      }
      if (val.flag == "chargePersonIds") {
        data.searchObj.chargePersonIds = [];
      }
      if (val.flag == "platformName") {
        data.searchObj.siteIds = [];
      }
      if (val.flag == "title") {
        data.titleStatus = "1";
        data.searchObj.spu = "";
        data.searchObj.title = "";
      }
      Object.keys(data.searchObj).forEach((key) => {
        if (key == val.flag) {
          if (key == "shopIds") {
            data.searchObj.shopIds = [];
          } else {
            data.searchObj[key] = "";
          }
        }
      });
      data.searchActive.forEach((item, index) => {
        if (item.flag == val.flag) {
          data.searchActive.splice(index, 1);
        }
      });
      getlist();
    };
    const reset = () => {
      data.searchObj = {
        siteIds: [],
        shopIds: [],
        spu: "",
        title: "",
        specsType: "",
        chargePersonIds: [],
        createTimeStart: "",
        createTimeEnd: "",
        updateTimeStart: "",
        updateTimeEnd: "",
      };
      data.form.pagination = {
        pageCurrent: 1,
        pageSize: 20,
        total: 0,
      };
      data.modeTimeStart = "createTime";
      data.rangeValue = [];
      data.searchActive = [];
      getlist();
    };

    const addDialogCancel = () => {
      data.actionType = "";
      data.addVisible = false;
    };
    const handleChangeTable = (val) => {
      console.log(val, "table");
    };
    const getRegionList = () => {
      getQueryEbayBaseSiteInfo().then((res) => {
        data.platform = res.data.map((item) => {
          return {
            platformCode: item.gerpId,
            platformName: item.nameCn,
            value: item.gerpId,
            flag: "siteId",
            nameValue: "站点 :" + item.nameCn,
            select: true,
          };
        });
      });
      getListingCommonShop().then((res) => {
        data.shopIdList = res.data.map((item) => {
          return {
            shopId: item.shopId,
            shopName: item.shopName,
            value: item.shopId,
            flag: "shopId",
            nameValue: "店铺 :" + item.shopName,
          };
        });
      });
    };
    const getDisabledTime = () => {
      let time = new Date();
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      return {
        disabledHours: () => getRange(h, 24),
        disabledMinutes: () => getRange(mm, 60),
        disabledSeconds: () => getRange(s, 60),
      };
    };
    const getRange = (start, end) => {
      const result = [];
      for (let i = 0; i < end; i++) {
        if (i < start) {
          result.push(i);
        }
      }
      return result;
    };

    const popupChangeTable = (val) => {
      if (val) {
        data.textClass = true;
      } else {
        data.textClass = false;
      }
    };

    const onOk = (dateString, date) => {
      console.log(dateString, date, "1");
      data.visibleFrom.onlineTime = dateString;
    };
    const onChange = (dateString, date) => {
      console.log(dateString, date, "2");
      data.visibleFrom.onlineTime = dateString;
    };
    const onSelect = (dateString, date) => {
      console.log(dateString, date, "3");
      data.visibleFrom.onlineTime = dateString;
    };
    onBeforeMount(() => {
      getRegionList();
      getlist();
    });
    return {
      ...toRefs(data),
      btnList,
      ebayPrototype,
      selectedRowKeys,
      dayjs,
      tableColumns,
      onOk,
      getDisabledTime,
      getRange,
      onChange,
      onSelect,
      platchangeFun,
      shopIdChangeFun,
      specificationsFun,
      publishStateFun,
      titelTextChange,
      personFun,
      timeChange,
      createWares,
      getTableCurrent,
      getSlection,
      edit,
      cutOut,
      goodsdraftRow,
      copyRow,
      tagClose,
      reset,
      setSerachFun,
      addDialogCancel,
      updateRemark,
      popupChange,
      tableUplod,
      handleChangeTable,
      batchReleaseAll,
      batchRelease,
      handleOk,
      handleCancel,
      getTimezone,
      popupChangeTable,
    };
  },
});
</script>
<style lang="scss" scoped>
.remark-now {
  overflow-y: hidden;
  overflow-x: scroll;
  width: 206px;
  white-space: nowrap;
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

.tag-wrap {
  padding-top: 12px;
  display: flex;
  align-items: center;
  background: #fff;
  position: relative;
  min-height: 0px;
  flex-wrap: wrap;
  row-gap: 8px;

  .arco-tag {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }

  .normal-tag-btn {
    color: #165dff;

    .arco-icon {
      color: #b3b4c1;
    }

    .tag-text-content {
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.hot1,
.hot2,
.hot3 {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: -3px;
  right: 5px;
}
.hot1 {
  background: #0045f0;
}
.hot2 {
  background: #2da641;
}
.hot3 {
  background: #ff5c5c;
}
.table-pop-box {
  width: 180px;
  li {
    display: inline-block;
    width: 50%;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
}

.title-text {
  color: rgb(0, 69, 240);
}
.select-total {
  margin: 8px;
  .select-total-text {
    color: rgba(0, 4, 48, 0.4);
    font-size: 12px;
  }
  .select-total-num {
    color: #0045f0;
    margin-left: 5px;
    font-size: 12px;
  }
}
</style>
