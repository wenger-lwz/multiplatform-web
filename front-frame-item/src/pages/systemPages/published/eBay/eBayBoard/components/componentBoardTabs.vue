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
          class="inputItem"
          allow-clear
          @press-enter="handleSearch('name', '模板名称', formDataSearch.name)"
          @search="handleSearch('name', '模板名称', formDataSearch.name)"
          @clear="handleSearch('name', '模板名称', formDataSearch.name)"
        >
        </gj-input-search>
      </gj-space>
    </template>
    <template #operate_bar-content>
      <operate-bar :refreshShow="true" @operate-rest="getList">
        <template #left>
          <gj-space>
            <gj-button
              v-permissions="[
                `EBAY/componentBoard/${
                  itemTabs[Number(activeNameIndex)]?.permissionsKey
                }/add`,
              ]"
              type="plain"
              @click="createData"
              >创建模板</gj-button
            >
            <!-- <gj-button type="outline" class="btnWidthStyle btnBorderStyle"
            >上传</gj-button
          >
          <gj-button type="outline" class="btnWidthStyle btnBorderStyle"
            >同步</gj-button
          > -->
            <commonPopconfirm
              v-if="selectAll.length"
              position="br"
              @ok="delCellData(selectAll)"
            >
              <template #content>
                <div class="pop-confirm-content">
                  {{ `是否确认删除${selectAll.length}条数据？` }}
                </div>
              </template>
              <gj-button
                v-permissions="[
                  `EBAY/componentBoard/${
                    itemTabs[Number(activeNameIndex)]?.permissionsKey
                  }/delete`,
                ]"
                type="plain"
                >批量删除</gj-button
              >
            </commonPopconfirm>
            <gj-button
              v-else
              v-permissions="[
                `EBAY/componentBoard/${
                  itemTabs[Number(activeNameIndex)]?.permissionsKey
                }/delete`,
              ]"
              type="plain"
              @click="delCellData(selectAll)"
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
        :loading="form.loading"
        :rowSelectionVisiable="true"
        :pagination="form.pagination"
        @getTableCurrent="getTableCurrent"
        @on-row-selection="getSelection"
      >
        <template #bodyCell="{ record, column, text }">
          <div v-if="column.dataIndex === 'updateTime'">
            <span>{{ ebayPrototype.formatDateTime(record.updateTime) }}</span>
          </div>
          <template v-else-if="column.dataIndex === 'Action'">
            <opbtn-group :btn-list="btnList" :row="record"></opbtn-group>
          </template>

          <template v-else>
            <gb-text>{{ text || "-" }}</gb-text>
          </template>
        </template>
      </CommonTable>
    </template>
  </CommonPage>
  <div v-if="visible">
    <eBayBoardEditModal
      :isVisible="visible"
      @setVisible="getVisible"
      :templateTitle="templateTitle"
      :itemTabs="itemTabs"
      :activeNameIndex="activeNameIndex"
    ></eBayBoardEditModal>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  nextTick,
  computed,
} from "vue";
// import SvgIcon from '@/components/SvgIcon.vue'
import { useStore } from "vuex";
import {
  getEbayTemplateAssemblyInfo,
  getEbayTemplateAssemblyDelete,
  getEbayTemplateAssemblySearch,
} from "@/api/published/ebay.js";
import eBayBoardEditModal from "./eBayBoardEditModal.vue";
import CommonPage from "@/components/CommonPage.vue";
import CommonTable from "@/components/CommonTable.vue";
import { GjMessage } from "@gj/atom";
import { clearStoreData, useChangeList } from "./index.js";
import { convertSelectedValue } from "@/utils/format";
import TagGroup from "@/components/TagGroup.vue";
import OperateBar from "@/components/OperateBar.vue";
import gjSiteIdShopIdSelect from "@/components/gj-siteId-shopId-select.vue";
import commonPopconfirm from "@/components/commonPopconfirm";
import OpbtnGroup from "@/components/opbtn-group.vue";
import { setSearchValue } from "@/utils/format.js";
import { ebayPrototype } from "@/pages/systemPages/published/eBay/eBayPublish/components/ebayCommon";
export default defineComponent({
  name: "componentBoardTabs",
  components: {
    TagGroup,
    eBayBoardEditModal,
    CommonPage,
    CommonTable,
    OperateBar,
    gjSiteIdShopIdSelect,
    commonPopconfirm,
    OpbtnGroup,
  },
  props: {
    itemTabs: {
      type: Array,
      default: () => {
        return [];
      },
    },
    activeNameIndex: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const $store = useStore();
    const datas = reactive({
      templateTitle: "编辑模板",
      formDataSearch: {
        name: "",
        siteIds: [],
        shopIds: [],
      },
      activatList: [],
      visible: false,
      sitList: {
        name: "站点",
      },
      shopList: {
        name: "店铺",
      },
      form: {
        border: false, //{wrapper: true, cell: true}是否显示边框
        hover: true, //是否显示选中效果
        stripe: false, //是否开启斑马纹效果
        checkbox: true, //是否多选
        rowSelection: [],
        selectedRowKeys: [],
        loading: false, //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        noData: false, //无数据
        rowName: "id", //表格行 key 的取值字段
        columns: [
          {
            title: "模板名称",
            dataIndex: "name",
          },
          {
            title: "站点",
            // dataIndex: "siteId",
            dataIndex: "siteName",
          },
          {
            title: "更新人",
            dataIndex: "updatedBy",
          },
          {
            title: "更新时间",
            dataIndex: "updateTime",
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
          //分页
          current: 1,
          pageSize: 20,
          total: 0,
        },
      },
      activeName: "eBay.logisticsPolicy",
      selectAll: [],
      // queryEbayBaseSiteInfo: [],
      // listingCommonShopId: [],
      searchActive: [],
      splitSymbol: ":",
    });
    const queryEbayBaseSiteInfo = computed(() => {
      return $store.state.common.siteIdList;
    });
    const listingCommonShopId = computed(() => {
      return $store.state.common.shopIdList;
    });

    // 清空重置数据
    const resetHandler = () => {
      datas.formDataSearch = {
        name: "",
        siteIds: [],
        shopIds: [],
      };
      datas.searchActive = [];
      datas.form.pagination = {
        current: 1,
        pageSize: 20,
        total: 0,
      };
      getList();
    };
    // 切换tabs重置数据
    const resetFormList = () => {
      datas.formDataSearch = {
        name: "",
        siteIds: [],
        shopIds: [],
      };
      datas.searchActive = [];
      datas.form.pagination = {
        current: 1,
        pageSize: 20,
        total: 0,
      };
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
        siteIds: "nameCn",
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
    // 根据标题创建草稿
    const createData = () => {
      clearStoreData();
      datas.templateTitle = "创建模板";
      const params = {};
      getTemplateList(params, false);
    };

    // 删除table数据
    const delCellData = (val) => {
      if (val.length == 0) {
        return GjMessage.warning("至少选择一条要操作的数据");
      }
      const params = {
        url: props.itemTabs[props.activeNameIndex].url,
        params: {
          ids: val,
        },
      };

      getEbayTemplateAssemblyDelete(params).then(() => {
        if (datas.selectAll) {
          const selectAll = datas.selectAll.filter(
            (item) => !params.params.ids.includes(item)
          );
          datas.selectAll = selectAll;
        }
        getList();
      });
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

    // 编辑table数据
    const editCellData = (item) => {
      clearStoreData();
      datas.templateTitle = "编辑模板";
      const params = {
        url: props.itemTabs[props.activeNameIndex].url,
        id: item.id,
      };
      getEbayTemplateAssemblySearch(params).then((res) => {
        res.eaditCell = res.data;
        getTemplateList(res, true);
      });
    };

    // 弹框显示
    const getVisible = (val) => {
      datas.visible = val;
      resetHandler();
    };

    // 获取列表数据
    const getList = () => {
      const params = {
        url: props.itemTabs[props.activeNameIndex].url,
        params: {
          ...datas.formDataSearch,
          pageCurrent: datas.form.pagination.current,
          pageSize: datas.form.pagination.pageSize,
        },
      };
      datas.form.loading = true;
      getEbayTemplateAssemblyInfo(params)
        .then((res) => {
          datas.form.tableData = res.data?.records.map((item) => {
            let b = queryEbayBaseSiteInfo.value.filter(
              (key) => key.gerpId == item.siteId
            );
            return {
              ...item,
              siteName: b[0].nameCn || "--",
            };
          });
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
    //清空数据
    const errorCallBack = () => {
      datas.form.tableData = [];
      datas.form.pagination.total = 0;
    };
    //  获取tabs标题数据
    const getTemplateList = (val) => {
      nextTick(() => {
        getTabsTitle();
        val.listData = [
          { name: "eBay.basicInfo", sectionId: "eBay.basicInfo" },
          { name: datas.activeName, sectionId: datas.activeName },
        ];
        if (datas.activeName === "eBay.accessoryCompatibility") {
          val.templateTypeList = true;
        }
        val.queryEbayBaseSiteInfo = queryEbayBaseSiteInfo.value;
        val.listingCommonShopId = listingCommonShopId.value;
        val.isShow = false;
        $store.dispatch(proxy.$mt.DYNAMIC_EBAY_TEMPLATE, val);
        datas.visible = true;
      });
    };

    // 获取tabs标题数据
    const getTabsTitle = () => {
      props.itemTabs.filter((item, index) => {
        if (index === +props.activeNameIndex) {
          datas.activeName = item.title;
          return false;
        }
      });
    };

    // 数据勾选中
    const getSelection = (val) => {
      datas.form.rowSelection = val;
      datas.selectAll = val.map((item) => item.id);
    };

    // 产生tags
    const changeList = (target) => {
      datas.searchActive = useChangeList(target, datas.searchActive);
    };
    const btnList = computed(() => {
      return [
        {
          label: "编辑",
          click: (row) => editCellData(row),
          outside: true,
          permission: [
            `EBAY/componentBoard/${
              props.itemTabs[Number(props.activeNameIndex)]?.permissionsKey
            }/edit`,
          ],
        },
        {
          label: "删除",
          click: (row) => delCellData([row.id]),
          permission: [
            `EBAY/componentBoard/${
              props.itemTabs[Number(props.activeNameIndex)]?.permissionsKey
            }/delete`,
          ],
          tooltipContent: "是否确认删除该数据？",
          outside: true,
          isPopConfirm: true,
        },
      ];
    });
    const getCommonTableRef = () => {
      proxy.$refs?.commonTableRef?.calculateWH();
    };

    onMounted(() => {
      getList();
    });
    return {
      ...toRefs(datas),
      ebayPrototype,
      resetHandler,
      createData,
      getTabsTitle,
      getVisible,
      delCellData,
      getTableCurrent,
      getSelection,
      handleChange,
      changeFilterSelect,
      handleSearch,
      editCellData,
      queryEbayBaseSiteInfo,
      listingCommonShopId,
      getList,
      btnList,
      getCommonTableRef,
      resetFormList,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../index.scss";
.common-pages {
  // padding-top: 12px;
}
</style>
