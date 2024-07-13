<template>
  <CommonPage :pageRest="true" @common-page-rest="resetHandler">
    <template #tag-content>
      <TagGroup
        :list="searchActive"
        @tag-change="changeFilterSelect"
      ></TagGroup>
    </template>
    <template #filter-content>
      <gj-space>
        <gjSiteIdShopIdSelect
          v-model:siteIds="formDataSearch.siteIds"
          v-model:shopIds="formDataSearch.shopIds"
          :allowClear="true"
          :params="{ platformCode: 'EBAY' }"
          @change-object-siteId="handleChange('siteIds', '站点', $event)"
          @change-object-shopId="handleChange('shopIds', '店铺', $event)"
        ></gjSiteIdShopIdSelect>
        <gj-input-search
          v-model="formDataSearch.name"
          placeholder="请输入模板名称"
          allow-clear
          @press-enter="handleSearch('name', '模板名称', formDataSearch.name)"
          @search="handleSearch('name', '模板名称', formDataSearch.name)"
          @clear="handleSearch('name', '模板名称', formDataSearch.name)"
          class="inputItem"
        >
        </gj-input-search>
      </gj-space>
    </template>
    <template #operate_bar-content>
      <operate-bar :refreshShow="true" @operate-rest="getList">
        <template #left>
          <gj-space>
            <gj-button
              v-permissions="['EBAY/pubEBayBoard/add']"
              type="plain"
              @click="createData"
              >创建模板</gj-button
            >
            <commonPopconfirm
              position="br"
              @ok="delCellData(selectAll)"
              v-if="selectAll.length"
            >
              <template #content>
                <div class="pop-confirm-content">
                  {{ `是否确认删除${selectAll.length}条数据？` }}
                </div>
              </template>
              <gj-button
                v-permissions="['EBAY/pubEBayBoard/delete']"
                type="plain"
                >批量删除</gj-button
              >
            </commonPopconfirm>
            <gj-button
              v-else
              v-permissions="['EBAY/pubEBayBoard/delete']"
              @click="delCellData(selectAll)"
              type="plain"
              >批量删除</gj-button
            >
            <div>
              <span>已选</span>
              <span class="selectedRowKeysStyle">{{ selectAll.length }}</span>
            </div>
          </gj-space>
        </template>
      </operate-bar>
    </template>
    <template #table-content>
      <CommonTable
        :rowKey="'id'"
        :columns="form.columns"
        :tableData="form.tableData"
        :rowSelectionVisiable="true"
        :loading="form.loading"
        @on-row-selection="getSelection"
        :pagination="form.pagination"
        @getTableCurrent="getTableCurrent"
        ref="commonTableRef"
      >
        <template #bodyCell="{ record, column, text }">
          <template v-if="column.dataIndex === 'Action'">
            <!-- <gj-button type="text" @click="editCellData(record)"
              >编辑</gj-button
            >
            <gj-button type="text" @click="delCellData([record.id])"
              >删除</gj-button
            > -->
            <opbtn-group :btn-list="btnList" :row="record"></opbtn-group>
          </template>
          <template v-else>
            <gb-text>{{ text || "-" }}</gb-text>
          </template>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <div>
    <eBayBoardEditModalAll
      :isVisible="visible"
      @setVisible="getVisible"
      :templateTitle="templateTitle"
    ></eBayBoardEditModalAll>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  h,
  getCurrentInstance,
  nextTick,
  computed,
} from "vue";
import { useStore } from "vuex";
import {
  getEbayTemplateInfoList,
  getEbayTemplateDelete,
  getEbayTemplateSearch,
} from "@/api/published/ebay.js";
import eBayBoardEditModalAll from "./components/eBayBoardEditModalAll.vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import { GjMessage } from "@gj/atom";
import { clearStoreData, formatTime } from "./components/index.js";
import TagGroup from "@/components/TagGroup.vue";
import { convertSelectedValue } from "@/utils/format";
import gjSiteIdShopIdSelect from "@/components/gj-siteId-shopId-select.vue";
import OpbtnGroup from "@/components/opbtn-group.vue";
import commonPopconfirm from "@/components/commonPopconfirm";
import OperateBar from "@/components/OperateBar.vue";
import { useChangeList } from "./components/index.js";
import { setSearchValue } from "@/utils/format.js";
export default defineComponent({
  name: "",
  components: {
    eBayBoardEditModalAll,
    CommonPage,
    CommonTable,
    TagGroup,
    gjSiteIdShopIdSelect,
    OpbtnGroup,
    commonPopconfirm,
    OperateBar,
  },
  setup() {
    const $store = useStore();
    const { proxy } = getCurrentInstance();
    const datas = reactive({
      tableData: [],
      templateTitle: "编辑模板",
      formDataSearch: {
        name: "",
        siteIds: [],
        shopIds: [],
      },
      searchActive: [],
      visible: false,
      sitList: {
        name: "站点",
        children: [],
      },
      shopList: {
        name: "店铺",
        children: [],
      },
      params: {
        listData: [
          { name: "eBay.basicInfo", sectionId: "eBay.basicInfo" },
          { name: "eBay.salesInfo", sectionId: "eBay.salesInfo" },
        ],
        isShow: true,
      },
      selectAll: [],
      form: {
        border: false, //{wrapper: true, cell: true}是否显示边框
        hover: true, //是否显示选中效果
        stripe: false, //是否开启斑马纹效果
        checkbox: true, //是否多选
        rowSelection: [],
        loading: false, //是否为加载中状态
        noData: false, //无数据
        rowName: "name", //表格行 key 的取值字段
        columns: [
          {
            title: "模板名称",
            dataIndex: "name",
          },
          {
            title: "店铺",
            dataIndex: "shopId",
          },
          {
            title: "站点",
            dataIndex: "siteId",
          },
          {
            title: "备注",
            dataIndex: "payDescription",
          },
          {
            title: "更新人",
            dataIndex: "updatedBy",
          },
          {
            title: "最后更新时间",
            dataIndex: "updateTime",
            customRender: (record) => {
              const time = record?.record?.updateTime;
              if (time) {
                return h("span", {}, formatTime(record?.record?.updateTime));
              }
            },
          },

          {
            title: "操作",
            dataIndex: "Action",
            fixed: "right",
            width: 200,
          },
        ],
        tableData: [],

        pagination: {
          current: 1,
          pageSize: 20,
          total: 0,
        },
      },
      // listingCommonShopId: [],
      // queryEbayBaseSiteInfo: [],
      splitSymbol: ":",
    });

    const queryEbayBaseSiteInfo = computed(() => {
      return $store.state.common.siteIdList;
    });
    const listingCommonShopId = computed(() => {
      return $store.state.common.shopIdList;
    });
    //获取列表数据
    const getList = () => {
      const params = {
        ...datas.formDataSearch,
        pageCurrent: datas.form.pagination.current,
        pageSize: datas.form.pagination.pageSize,
      };
      datas.form.loading = true;
      getEbayTemplateInfoList(params)
        .then((res) => {
          datas.form.tableData = res.data?.records || [];
          datas.form.pagination.total = res.data.total;
          datas.form.pagination.current = res.data.pageCurrent;
          datas.form.pagination.pageSize = res.data.pageSize;
        })
        .catch(() => {
          errorCallBack();
        })
        .finally(() => {
          datas.form.loading = false;
        });
    };
    // 清空重置数据
    const resetHandler = () => {
      Object.keys(datas.formDataSearch).forEach(
        (key) => (datas.formDataSearch[key] = "")
      );
      datas.searchActive = [];
      datas.form.pagination = {
        current: 1,
        pageSize: 20,
        total: 0,
      };
      getList();
    };

    // 删除tags
    const changeFilterSelect = (id) => {
      datas.formDataSearch[id] = Array.isArray(datas.formDataSearch[id])
        ? []
        : "";
      getList();
    };
    // 下拉框选择店铺国家
    const handleChange = (searchDataId, searchDataName, value) => {
      const map = {
        siteIds: queryEbayBaseSiteInfo.value,
        shopIds: listingCommonShopId.value,
      };
      const valueMap = {
        siteIds: "gerpId",
        shopIds: "shopId",
      };
      const keyMap = {
        siteIds: "nameEn",
        shopIds: "shopName",
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
    // 输入模板名称
    const handleSearch = (searchDataId, searchDataName, value) => {
      const searchItem = {
        showName: searchDataName,
        showValue: setSearchValue(value, searchDataId),
        id: searchDataId,
        splitSymbol: datas.splitSymbol,
      };
      changeList(searchItem);
      getList();
    };
    // 产生tags
    const changeList = (target) => {
      datas.searchActive = useChangeList(target, datas.searchActive);
    };

    // 根据标题创建草稿
    const createData = () => {
      clearStoreData();
      datas.templateTitle = "创建模板";
      getTemplateList(datas.params);
    };

    const getTemplateList = (val) => {
      nextTick(() => {
        val.queryEbayBaseSiteInfo = queryEbayBaseSiteInfo.value;
        val.listingCommonShopId = listingCommonShopId.value;
        $store.dispatch(proxy.$mt.DYNAMIC_EBAY_TEMPLATE, val);
        datas.visible = true;
      });
    };

    // 编辑table数据
    const editCellData = (item) => {
      clearStoreData();
      datas.templateTitle = "编辑模板";
      getEbayTemplateSearch(item.id).then((res) => {
        datas.params.eaditCell = res.data;
        getTemplateList(datas.params);
      });
    };

    // 删除table数据
    const delCellData = (val) => {
      if (val.length == 0) {
        return GjMessage.warning("至少选择一条要操作的数据");
      }
      const params = {
        ids: val,
      };
      getEbayTemplateDelete(params).then((res) => {
        if (res.code == 200) {
          GjMessage.success(res.message);
        }
        if (datas.selectAll) {
          const selectAll = datas.selectAll.filter(
            (item) => !params.ids.includes(item)
          );
          datas.selectAll = selectAll;
        }
        getList();
      });
    };

    // 弹框显示
    const getVisible = (val) => {
      datas.visible = val;
      resetHandler();
    };

    // 数据勾选中
    const getSelection = (val) => {
      datas.form.rowSelection = val;
      datas.selectAll = val.map((item) => item.id);
    };

    // 切换列表页
    const getTableCurrent = (e) => {
      datas.form.pagination = {
        total: e.total,
        current: e.pageCurrent,
        pageSize: e.pageSize,
      };
      getList();
    };

    //清空数据
    const errorCallBack = () => {
      datas.form.tableData = [];
      datas.form.pagination.total = 0;
    };

    const btnList = computed(() => {
      return [
        {
          label: "编辑",
          click: (row) => editCellData(row),
          outside: true,
          permission: ["EBAY/pubEBayBoard/edit"],
        },
        {
          label: "删除",
          click: (row) => delCellData([row.id]),
          permission: ["EBAY/pubEBayBoard/delete"],
          tooltipContent: "是否确认删除该数据？",
          isPopConfirm: true,
          outside: true,
        },
      ];
    });
    onMounted(() => {
      getList();
    });
    return {
      ...toRefs(datas),
      editCellData,
      createData,
      delCellData,
      getSelection,
      getVisible,
      getTableCurrent,
      resetHandler,
      changeFilterSelect,
      handleChange,
      handleSearch,
      queryEbayBaseSiteInfo,
      listingCommonShopId,
      btnList,
      getList,
    };
  },
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
