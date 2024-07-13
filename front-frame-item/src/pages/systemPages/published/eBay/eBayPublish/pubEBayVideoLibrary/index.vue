<!-- pubEBayVideoLibrary 视频库 -->
<template>
  <CommonPage
    :pageRest="true"
    @common-page-rest="reset"
    :currentRouterPermission="'EBAY/pubEBayVideoLibrary/view'"
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
      <gj-space>
        <gb-select
          class="search-gb-select"
          placeholder="店铺"
          :max-tag-count="1"
          allow-clear="false"
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

        <gj-input-group>
          <gj-select
            class="search-select-left"
            placeholder="标题"
            :trigger-props="{ autoFitPopupMinWidth: true }"
            v-model="titleStatus"
            @change="titelTextChange(titleStatus, searchObj.videoTitle)"
          >
            <gj-option
              v-for="(item, index) in options"
              :value="item.value"
              :key="index"
              >{{ item.name }}
            </gj-option>
          </gj-select>
          <gj-input-search
            v-model="searchObj.videoTitle"
            @search="titelTextChange(titleStatus, searchObj.videoTitle)"
            @keyup.enter="titelTextChange(titleStatus, searchObj.videoTitle)"
            class="search-select-rigth"
            placeholder="请输入内容"
          />
        </gj-input-group>

        <gj-select
          class="search-select"
          placeholder="状态"
          allow-clear
          v-model="searchObj.videoStateCode"
          @change="specificationsFun"
          @clear="specificationsFun"
        >
          <gj-option
            v-for="(item, index) in specifications"
            :key="index"
            :value="item.state"
            >{{ item.stateDescription }}
          </gj-option>
        </gj-select>
      </gj-space>
    </template>
    <template #operate_bar-content>
      <OperateBar>
        <template #left>
          <gj-space align="center">
            <gj-button
              type="primary"
              v-permissions="['EBAY/pubEBayVideoLibrary/uploadVideo']"
              @click="uploadVideo"
              >上传视频</gj-button
            >
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
        :pagination="form.pagination"
        @change="handleChangeTable"
        @getTableCurrent="getTableCurrent"
        class="table_header"
      >
        <template #bodyCell="{ record, column, text }">
          <div v-if="column.dataIndex === 'platformImageUrl'">
            <gb-image width="36" :src="record?.platformImageUrl"></gb-image>
          </div>

          <div v-else-if="column.dataIndex === 'videoTitle'">
            <p>{{ record.videoTitle }}</p>
            <column-copy
              :textValue="record?.platformVideoId || '--'"
              :isAnchor="false"
            ></column-copy>
          </div>

          <div v-else-if="column.dataIndex === 'videoStateCode'">
            <span v-if="record.videoStateCode == 'PENDING_UPLOAD'"
              >准备上传</span
            >
            <span v-if="record.videoStateCode == 'PROCESSING'">上传中</span>
            <span v-if="record.videoStateCode == 'PROCESSING_FAILED'"
              >上传失败</span
            >
            <span v-if="record.videoStateCode == 'LIVE'">上传成功</span>
            <span v-if="record.videoStateCode == 'BLOCKED'">已屏蔽</span>
          </div>

          <div v-else-if="column.dataIndex === 'uploadTime'">
            <span>{{ ebayPrototype.formatDateTime(record.uploadTime) }}</span>
          </div>
          <div v-else-if="column.dataIndex === 'failureTime'">
            <span>{{ ebayPrototype.formatDateTime(record.failureTime) }}</span>
          </div>
          <div v-else-if="column.dataIndex === 'Action'">
            <div>
              <gj-button
                type="text"
                size="small"
                @click="detailsViewFun(record)"
                v-permissions="['EBAY/pubEBayVideoLibrary/edit']"
              >
                详情
              </gj-button>
              <gj-popconfirm
                content="即将同步，是否确认?"
                @ok="handleOk"
                @cancel="handleCancel"
              >
                <gj-button
                  type="text"
                  v-permissions="['EBAY/pubEBayVideoLibrary/Synchro']"
                  size="small"
                  @click="edit(record)"
                >
                  同步
                </gj-button>
              </gj-popconfirm>
            </div>
          </div>
          <div v-else>{{ text ? text : "--" }}</div>
        </template>
      </CommonTable>
    </template>
  </CommonPage>

  <create-upload
    v-if="addVisible"
    :dialogVisible="addVisible"
    :rowData="rowData"
    @tableUplod="tableUplod"
    @cancel="addDialogCancel"
  ></create-upload>

  <details-view
    v-if="detailsVisible"
    :dialogVisible="detailsVisible"
    :rowData="rowData"
    @cancel="detailsDialogCancel"
  ></details-view>
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
// import { GjMessage } from '@gj/atom'

import { ebayPrototype } from "@/pages/systemPages/published/eBay/eBayPublish/components/ebayCommon";
import CommonTable from "@/components/CommonTable.vue";
import CommonPage from "@/components/CommonPage.vue";
import OperateBar from "@/components/OperateBar.vue";
import columnCopy from "@/components/columnCopy.vue";
import createUpload from "./createUpload.vue";
import detailsView from "./details.vue";

import {
  getPubEBayVideoLibraryList,
  getListingCommonShop,
  setUpdateVideoStatus,
  getVideoStateShop,
} from "@api/published/ebay.js";
export default defineComponent({
  name: "PubEBayVideoLibrary",
  components: {
    CommonTable,
    columnCopy,
    CommonPage,
    OperateBar,
    createUpload,
    detailsView,
  },
  setup() {
    const data = reactive({
      addVisible: false,
      visibleUpdate: false,
      detailsVisible: false,
      rowData: {},
      searchObj: {
        shopIds: [],
        videoTitle: "",
        videoStateCode: "",
      },
      titleStatus: "1",
      options: [
        {
          name: "标题",
          flag: "videoTitle",
          value: "1",
        },
        {
          name: "id",
          flag: "videoTitle",
          value: "2",
        },
      ],
      searchActive: [],
      shopIdList: [],
      specifications: [],
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
      actionType: "",
    });
    const tableColumns = computed(() => {
      return [
        {
          title: "视频",
          dataIndex: "platformImageUrl",
          fixed: "left",
          width: 120,
        },
        {
          title: "标题/ID",
          dataIndex: "videoTitle",
          width: 180,
          fixed: "left",
        },
        {
          title: "店铺",
          dataIndex: "shopName",
          width: 120,
          resizable: true,
        },
        {
          title: "状态",
          dataIndex: "videoStateCode",
          width: 140,
        },

        {
          title: "上传时间",
          dataIndex: "uploadTime",
          // sorter: true,
          showSorterTooltip: false,
          width: 160,
        },
        {
          title: "失效时间",
          dataIndex: "failureTime",
          // sorter: true,
          showSorterTooltip: false,
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
      nextTick(() => {
        getlist();
      });
    };
    // 状态
    const specificationsFun = (e) => {
      if (e) {
        let cunter = data.specifications.filter((v) => v.value == e);
        let createTure = false;
        data.searchActive.forEach((item, index) => {
          if (item.flag == "videoStateCode") {
            data.searchActive.splice(index, 1);
            data.searchActive.push({
              name: cunter[0].name,
              activeName: cunter[0].nameValue,
              flag: cunter[0].flag,
              value: cunter[0].value,
            });
            createTure = true;
          } else {
            createTure = false;
          }
        });
        if (!createTure) {
          data.searchActive.push({
            name: cunter[0].name,
            activeName: cunter[0].nameValue,
            flag: cunter[0].flag,
            value: cunter[0].value,
          });
        }
      } else {
        data.searchActive.forEach((item, index) => {
          if (item.flag == "videoStateCode") {
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
          if (item.flag == "videoTitle") {
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
          if (item.flag == "videoTitle") {
            tagClose(item);
          }
        });
      }
    };
    const getlist = () => {
      console.log(data.titleStatus);
      let params = {
        // ...data.searchObj,
        videoStateCode: data.searchObj.videoStateCode,
        videoTitle: data.titleStatus == "1" ? data.searchObj.videoTitle : "",
        videoId: data.titleStatus == "2" ? data.searchObj.videoTitle : "",
        pageCurrent: data.form.pagination.pageCurrent,
        pageSize: data.form.pagination.pageSize,
      };
      console.log(params, "pp");
      getPubEBayVideoLibraryList(params).then((res) => {
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
    const uploadVideo = () => {
      data.addVisible = true;
    };
    const addDialogCancel = () => {
      data.addVisible = false;
    };
    const detailsDialogCancel = () => {
      data.detailsVisible = false;
    };
    const tableUplod = () => {
      getlist();
    };
    const edit = (val) => {
      data.visibleUpdate = true;
      data.rowData = val;
    };

    const tagClose = (val) => {
      Object.keys(data.searchObj).forEach((key) => {
        if (key == val.flag) {
          if (key == "shopIds") {
            data.searchObj[key] = [];
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
      data.titleStatus = "1";
      getlist();
    };
    const reset = () => {
      data.searchObj = {
        shopIds: [],
        videoTitle: "",
        videoStateCode: "",
      };
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

    const handleChangeTable = (val) => {
      if (val.action === "sort") {
        const { order, field } = val.sorter;
        if (order === "ascend") {
          data.form.pagination.seq = "asc";
        } else if (order === "descend") {
          data.form.pagination.seq = "desc";
        } else {
          data.form.pagination.seq = "desc";
        }
        data.form.pagination.sortField = order ? field : "";
        getlist();
      }
    };
    const handleCancel = () => {
      data.visibleUpdate = false;
    };
    const handleOk = () => {
      data.visibleUpdate = false;
      let params = {
        id: data.rowData.id,
        shopId: data.rowData.shopId,
        videoId: data.rowData.platformVideoId,
      };
      setUpdateVideoStatus(params).then((res) => {
        console.log(res);
      });
    };
    const getShopList = () => {
      getListingCommonShop().then((res) => {
        data.shopIdList = res.data.map((item) => {
          return {
            shopId: item.shopId,
            shopName: item.shopName,
            value: item.shopId,
            flag: "shopIds",
            nameValue: "店铺 :" + item.shopName,
          };
        });
      });
      getVideoStateShop().then((res) => {
        data.specifications = res.data.map((item) => {
          return {
            state: item.state,
            stateDescription: item.stateDescription,
            value: item.state,
            flag: "videoStateCode",
            nameValue: "状态 :" + item.stateDescription,
          };
        });
      });
    };
    const detailsViewFun = (val) => {
      data.rowData = val;
      data.detailsVisible = true;
    };
    onBeforeMount(() => {
      getShopList();
      getlist();
    });
    return {
      ...toRefs(data),
      ebayPrototype,
      tableColumns,
      shopIdChangeFun,
      specificationsFun,
      titelTextChange,
      uploadVideo,
      getTableCurrent,
      edit,
      tagClose,
      reset,
      tableUplod,
      handleChangeTable,
      getShopList,
      addDialogCancel,
      handleOk,
      handleCancel,
      detailsViewFun,
      detailsDialogCancel,
    };
  },
});
</script>
<style lang="scss" scoped>
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
</style>
