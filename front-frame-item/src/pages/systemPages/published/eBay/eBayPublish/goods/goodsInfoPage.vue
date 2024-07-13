// goodsInfoPage
<template>
  <CommonPage
    :pageRest="true"
    @common-page-rest="reset"
    :currentRouterPermission="'EBAY/pubEBayGoodsInfo/view'"
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
        multiple
        :allow-clear="false"
        :max-tag-count="1"
        v-model="searchObj.siteIds"
        @confirm="platchangeFun"
      >
        <gb-select-option
          v-for="item in platform"
          :value="item.platformCode"
          :key="item.platformCode"
          >{{ item.platformName }}
        </gb-select-option>
      </gb-select>
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
              type="primary"
              v-permissions="['EBAY/pubEBayGoodsInfo/add']"
              @click="createWares"
              >添加商品</gj-button
            >
            <gj-button
              type="plain"
              v-permissions="['EBAY/pubEBayGoodsInfo/batchDrafts']"
              @click="createDrafts"
              >生成草稿</gj-button
            >
            <gj-button
              type="plain"
              v-permissions="['EBAY/pubEBayGoodsInfo/batchDelete']"
              @click="cutOutAll"
              >批量删除</gj-button
            >
            <div style="margin: 8px" class="select-total">
              <span class="select-total-text">已选</span>
              <span class="select-total-num">{{ selectNub }}</span>
            </div>
          </gj-space>
        </template>
      </OperateBar>
    </template>
    <template #table-content>
      <CommonTable
        rowKey="id"
        :columns="tableColumns"
        :tableData="form.tableData"
        :loading="form.loading"
        :scroll="form.scroll"
        :rowSelectionVisiable="true"
        :selectedRowKeys="selectedRowKeys"
        :pagination="form.pagination"
        @onRowSelection="getSelection"
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
              :popObj="popObj"
              :popRecord="record"
            ></tablee-pop>
          </div>
          <div v-else-if="column.dataIndex === 'publishCount'">
            <tablee-pop
              :popObj="{
                title: '在线数量',
                btnNmam: record.publishCount,
                type: 'zxsu',
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
                      v-model="remarkObj[record.id]"
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
                    v-model="remarkObj[record.id]"
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
          <div v-else-if="column.dataIndex === 'createTime'">
            <span>{{ ebayPrototype.formatDateTime(record.createTime) }}</span>
          </div>
          <div v-else-if="column.dataIndex === 'updateTime'">
            <span>{{ ebayPrototype.formatDateTime(record.updateTime) }}</span>
          </div>
          <div v-else-if="column.dataIndex === 'Action'">
            <opbtn-group :btn-list="btnList" :row="record"></opbtn-group>
          </div>
          <div v-else>{{ text ? text : "--" }}</div>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <!-- 生成草稿 -->
  <goods-draft
    v-if="draftVisible"
    :dialogVisible="draftVisible"
    :goodsRow="batchAll"
    @cancel="draftDialogCancel"
    @confirm="draftDialogConfirm"
  ></goods-draft>

  <!-- add -->
  <goods-add
    v-if="addVisible"
    :dialogVisible="addVisible"
    :actionType="actionType"
    :rowData="rowData"
    @tableUplod="tableUplod"
    @cancel="addDialogCancel"
  ></goods-add>

  <goods-modal
    :cancelVisible="cancelVisible"
    :modelObj="modelObj"
    @cancelHandleOk="cancelHandleOk"
    @cancelHandleOff="cancelHandleOff"
  ></goods-modal>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  computed,
  nextTick,
} from "vue";
import { GjMessage } from "@gj/atom";
import { ebayPrototype } from "@/pages/systemPages/published/eBay/eBayPublish/components/ebayCommon";
import CommonTable from "@/components/CommonTable.vue";
import CommonPage from "@/components/CommonPage.vue";
import columnCopy from "@/components/columnCopy.vue";
import SvgIcon from "@/components/SvgIcon";
import goodsDraft from "./goodsDraft.vue";
import goodsAdd from "./goodsAdd.vue";
import tableePop from "@/pages/systemPages/published/eBay/eBayPublish/components/variantPop.vue";
import SelectDirector from "@/components/SelectDirector.vue";
import AppRangePicker from "@/components/AppRangePicker.vue";
import OperateBar from "@/components/OperateBar.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import goodsModal from "@/pages/systemPages/published/eBay/eBayPublish/components/goodsModal.vue";
import {
  getProductLists,
  deleteProductList,
  modifyProductRemarks,
  getQueryEbayBaseSiteInfo,
} from "@api/published/ebay.js";
export default defineComponent({
  name: "PubEBayOnLineGoods",
  components: {
    CommonTable,
    columnCopy,
    SvgIcon,
    CommonPage,
    AppRangePicker,
    goodsDraft,
    goodsAdd,
    SelectDirector,
    tableePop,
    OperateBar,
    goodsModal,
    OpbtnGroup,
  },
  setup() {
    const data = reactive({
      visPopover: false,
      cancelVisible: false,
      delectType: "",
      searchObj: {
        siteIds: [],
        spu: "",
        title: "",
        specsType: "",
        chargePersonIds: [],
        createTimeStart: "",
        createTimeEnd: "",
        updateTimeStart: "",
        updateTimeEnd: "",
      },
      modeTimeStart: "createTime",
      rangeValue: [],
      titleStatus: "1",
      options: [
        {
          name: "标题",
          flag: "title",
          value: "1",
        },
        {
          name: "SKU/SPU",
          flag: "title",
          value: "2",
        },
      ],
      searchActive: [],
      platform: [],
      specifications: [
        {
          name: "单品",
          specsType: "单品",
          value: "1",
          flag: "specsType",
        },
        {
          name: "变体",
          specsType: "变体",
          value: "2",
          flag: "specsType",
        },
      ],
      selectNub: 0,
      form: {
        border: false, //{wrapper: true, cell: true}是否显示边框
        hover: true, //是否显示选中效果
        rowSelection: [],
        loading: false, //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        noData: false, //无数据
        scroll: {
          x: 1100,
          y: "auto",
        },
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
      draftVisible: false,
      addVisible: false,
      remarkObj: {},
      actionType: "",
      rowData: {}, //表格列数据,
      popObj: {
        title: "变体信息",
        btnNmam: "变体",
        type: "btxx",
      },
      timeOptions: [
        { label: "创建时间", value: "createTime" },
        { label: "更新时间", value: "publishTime" },
      ],
      rowDta: {},
      modelObj: {
        modelTitle: "删除",
        modelText: "此操作不可逆，是否删除？",
      },
    });
    const btnList = computed(() => {
      return [
        {
          label: "编辑",
          click: (row) => edit(row),
          outside: true,
          permission: ["EBAY/pubEBayGoodsInfo/edit"],
        },
        {
          label: "生成草稿",
          click: (row) => goodsdraftRow(row),
          permission: ["EBAY/pubEBayGoodsInfo/draft"],
          tooltipContent: "即将生成草稿，是否确认?",
          isPopConfirm: true,
        },
        {
          label: "复制",
          click: (row) => copyRow(row),
          permission: ["EBAY/pubEBayGoodsInfo/copy"],
        },
        {
          label: "删除",
          isPopConfirm: true,
          click: (row) => cutOut(row, "synchronization"),
          tooltipContent: "此操作不可逆，是否删除？",
          permission: ["EBAY/pubEBayGoodsInfo/delete"],
        },
      ];
    });
    const tableColumns = computed(() => {
      return [
        {
          title: "图片",
          dataIndex: "mainImage",
          sortable: {
            sortDirections: ["ascend", "descend"],
          },
          fixed: "left",
          width: 120,
        },
        {
          title: "标题/SPU/SKU",
          dataIndex: "spu",
          width: 140,
          fixed: "left",
        },
        {
          title: "站点",
          dataIndex: "siteName",
          width: 140,
          // resizable: true,
        },
        {
          title: "系统产品分类",
          dataIndex: "categoryName",
          width: 140,
        },
        {
          title: "规格",
          dataIndex: "specsType",
          width: 140,
        },
        {
          title: "建议售价",
          dataIndex: "recommendPrice",
          width: 140,
        },
        // {
        //   title: '草稿记录',
        //   dataIndex: 'draftCount',
        //   width: 140,
        // },
        {
          title: "在线数量",
          dataIndex: "publishCount",
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
          sorter: true,
          showSorterTooltip: false,
          width: 160,
        },
        {
          title: "更新时间",
          dataIndex: "updateTime",
          sorter: true,
          showSorterTooltip: false,
          width: 160,
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 140,
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
      const value = data.remarkObj[record.id];
      let params = value;
      modifyProductRemarks(params, id).then((res) => {
        if (res.code == 0) {
          GjMessage.success("编辑成功！");
          getlist();
        }
      });
    };
    //处理Serach中下拉框
    const setSerachFun = (e, flagName, flagId, cunName, dataList) => {
      let nameArr = [];
      let beyondStr = "";
      if (e.length > 3) {
        e.forEach((ele, index) => {
          dataList.forEach((item) => {
            if (index < 2) {
              if (item[flagId] == ele) {
                nameArr.push(item[flagName]);
              }
            }
          });
        });
        beyondStr = nameArr.join(",") + `,等${e.length}项`;
      } else {
        e.forEach((ele) => {
          dataList.forEach((item) => {
            if (item[flagId] == ele) {
              nameArr.push(item[flagName]);
            }
          });
        });
      }
      let createTure = false;
      data.searchActive.forEach((item, index) => {
        if (item.flag == flagName) {
          data.searchActive.splice(index, 1);
          data.searchActive.push({
            name: nameArr.join(","),
            activeName: `${cunName}${
              e.length > 3 ? beyondStr : nameArr.join(",")
            }`,
            flag: flagName,
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
          activeName: `${cunName}${
            e.length > 3 ? beyondStr : nameArr.join(",")
          }`,
          flag: flagName,
          value: e
            .map((item) => {
              return item.value;
            })
            .join(","),
        });
      }
    };
    // 站点
    const platchangeFun = (e) => {
      if (e.length !== 0) {
        let dataList = data.platform;
        let cunName = "站点" + " ：";
        setSerachFun(e, "platformName", "platformCode", cunName, dataList);
      } else {
        data.searchActive.forEach((item, index) => {
          if (item.flag == "platformName") {
            data.searchActive.splice(index, 1);
          }
        });
      }
      getlist();
    };
    // 规格
    const specificationsFun = (e) => {
      if (e) {
        let dataList = data.specifications;
        let cunName = "规格" + " ：";
        let row = [e];
        setSerachFun(row, "specsType", "value", cunName, dataList);
      } else {
        data.searchActive.forEach((item, index) => {
          console.log(item);
          if (item.flag == "specsType") {
            data.searchActive.splice(index, 1);
          }
        });
      }
      getlist();
    };
    // 负责人
    const personFun = (e) => {
      if (e) {
        let createTure = false;
        let nameArr = [];
        let beyondStr = "";
        if (e.length > 3) {
          e.forEach((item, index) => {
            if (index < 2) {
              nameArr.push(item.label);
            }
          });
          beyondStr = nameArr.join(",") + `,等${e.length}项`;
        } else {
          beyondStr = e
            .map((item) => {
              return item.label;
            })
            .join(",");
        }
        data.searchActive.forEach((item, index) => {
          if (item.flag == "chargePersonIds") {
            data.searchActive.splice(index, 1);
            data.searchActive.push({
              name: e
                .map((item) => {
                  return item.label;
                })
                .join(","),
              activeName: "负责人" + " ：" + beyondStr,
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
            activeName: "负责人" + " ：" + beyondStr,
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
        siteIds: data.searchObj.siteIds,
        pageCurrent: data.form.pagination.pageCurrent,
        pageSize: data.form.pagination.pageSize,
        seq: data.form.pagination.seq,
        sortField: data.form.pagination.sortField,
        title: data.titleStatus == "1" ? data.searchObj.spu : "",
        spu: data.titleStatus == "2" ? data.searchObj.spu : "",
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
      getProductLists(params).then((res) => {
        data.form.tableData = res.data.records;
        data.form.pagination.total = res.data.total;
      });
    };
    const getTableCurrent = (e) => {
      data.form.pagination = {
        ...data.form.pagination,
        pageCurrent: e.pageCurrent,
        pageSize: e.pageSize,
        seq: "",
        sortField: "",
      };
      getlist();
    };
    //创建
    const createWares = () => {
      data.addVisible = true;
      data.actionType = "add";
    };
    //生成草稿
    const createDrafts = () => {
      if (data.selectNub <= 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      }
      data.draftVisible = true;
    };

    const goodsdraftRow = (val) => {
      data.batchAll = [val.id];
      data.draftVisible = true;
    };
    const selectedRowKeys = computed(() => {
      return data.form.rowSelection.map((item) => item["id"]);
    });
    // 多选
    const getSelection = (selectedRowKeys) => {
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
    const cutOutAll = () => {
      if (data.form.rowSelection.length == 0) {
        return GjMessage.warning("请至少选择一条要操作的数据！");
      } else {
        data.cancelVisible = true;
        data.delectType = "all";
      }
    };
    // 删除
    const cutOut = (val) => {
      // data.cancelVisible = true
      data.rowDta = val;
      data.delectType = "single";
      cancelHandleOk();
    };
    const cancelHandleOk = () => {
      let params = { ids: [] };
      if (data.delectType == "all") {
        params.ids = data.form.rowSelection.map((item) => {
          return item.id;
        });
      } else {
        params.ids = [data.rowDta?.id];
      }
      deleteProductList(params).then((res) => {
        if (res.code == 0 || res.code == 200) {
          GjMessage.success(`已删除${params.ids.length}条商品资料！`);
          getlist();
        } else {
          GjMessage.warning("删除失败，若要删除请重新操作！");
        }
      });
      data.cancelVisible = false;
      data.selectNub = 0;
      data.form.rowSelection = [];
    };
    const cancelHandleOff = () => {
      data.cancelVisible = false;
      data.selectNub = 0;
      data.form.rowSelection = [];
    };
    const tableUplod = () => {
      getlist();
    };
    const tagClose = (val) => {
      console.log(data.searchActive, val, "00");
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
        // data.titleStatus = '1'
        data.searchObj.spu = "";
        data.searchObj.title = "";
      }
      Object.keys(data.searchObj).forEach((key) => {
        if (key == val.flag) {
          data.searchObj[key] = "";
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
        spu: "",
        title: "",
        specsType: "",
        chargePersonIds: [],
        createTimeStart: "",
        createTimeEnd: "",
        updateTimeStart: "",
        updateTimeEnd: "",
      };
      data.modeTimeStart = "createTime";
      data.rangeValue = [];
      data.titleStatus = "1";
      data.form.pagination = {
        pageCurrent: 1,
        pageSize: 20,
        total: 0,
        seq: "",
        sortField: "",
      };
      data.searchActive = [];
      getlist();
    };

    const draftDialogCancel = () => {
      data.draftVisible = false;
      data.batchAll = [];
      data.form.rowSelection = [];
      data.selectNub = 0;
    };
    const draftDialogConfirm = () => {
      console.log("draftDialogConfirm");
    };

    const addDialogConfirm = () => {
      console.log("addDialogConfirm");
    };

    const addDialogCancel = () => {
      data.actionType = "";
      data.addVisible = false;
    };
    const handleChangeTable = (val) => {
      if (val.action === "sort") {
        const { order, field } = val.sorter;
        if (order === "ascend") {
          data.form.pagination.seq = "ASC";
        } else if (order === "descend") {
          data.form.pagination.seq = "DESC";
        } else {
          data.form.pagination.seq = "";
        }
        data.form.pagination.sortField = order ? field : "";
        console.log();
        getlist();
      }
    };
    const getRegionList = () => {
      getQueryEbayBaseSiteInfo().then((res) => {
        data.platform = res.data.map((item) => {
          return {
            platformCode: item.gerpId,
            platformName: item.nameCn,
            value: item.gerpId,
            flag: "siteIds",
            nameValue: "站点 :" + item.nameCn,
            select: true,
          };
        });
      });
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
      tableColumns,
      platchangeFun,
      specificationsFun,
      titelTextChange,
      personFun,
      timeChange,
      createWares,
      createDrafts,
      getTableCurrent,
      getSelection,
      edit,
      cutOut,
      cutOutAll,
      cancelHandleOk,
      cancelHandleOff,
      goodsdraftRow,
      copyRow,
      tagClose,
      reset,
      setSerachFun,
      draftDialogCancel,
      addDialogCancel,
      draftDialogConfirm,
      addDialogConfirm,
      updateRemark,
      popupChange,
      tableUplod,
      handleChangeTable,
    };
  },
});
</script>
<style lang="scss" scoped>
.remark-now {
  width: 206px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
  li {
    width: 100%;
    padding: 10px;
  }
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
