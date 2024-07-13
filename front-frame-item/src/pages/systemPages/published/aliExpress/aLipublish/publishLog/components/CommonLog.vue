<template>
  <layout>
    <template #seach>
      <commonView
        :activatList="activatList"
        @getCloseTags="closeTags"
      ></commonView>
      <gj-row class="rowHeightStyle">
        <gj-space>
          <gj-select
            v-model="formDataSearch.shopCode"
            placeholder="店铺"
            size="small"
            allow-clear
            allow-search
            @change="searchShopId"
            @popup-visible-change="getShopIdList"
            :loading="shopIdLoading"
            class="flexItem"
          >
            <gj-option
              v-for="item in shopList.children"
              :key="item.codeId"
              :label="item.name"
              :value="item.name"
            >
            </gj-option>
          </gj-select>
          <gj-select
            size="small"
            placeholder="负责人"
            v-model="formDataSearch.responsibleId"
            allow-clear
            allow-search
            @change="searchPersonList"
            @popup-visible-change="getPersonList"
            :loading="personListLoading"
            class="flexItem"
          >
            <gj-option
              v-for="(item, index) in personList.children"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></gj-option>
          </gj-select>
          <gj-input-group class="inputGrouStyle">
            <gj-select
              size="small"
              placeholder="标题"
              v-model="multipleSelect.name"
              @change="selectTitleOrSku"
              class="inputAndSelItem"
            >
              <gj-option
                v-for="item in options"
                :key="item.codeId"
                :label="item.name"
                :value="item.codeId"
              ></gj-option>
            </gj-select>

            <gj-input
              v-model="multipleSelect.value"
              size="small"
              placeholder="请输入内容"
              @keydown="searchTitleOrSku"
              class="selAndInputItem"
            >
              <template #suffix>
                <gj-tooltip content="搜索(快捷键: 回车键)">
                  <SvgIcon
                    svgClass="search"
                    :width="12"
                    @click="clickIconInput"
                  >
                  </SvgIcon>
                </gj-tooltip>
              </template>
            </gj-input>
          </gj-input-group>
          <gj-range-picker
            @change="timeChange"
            v-model="multipleSelect.timeValue"
            class="pickerItem"
          />
          <gj-button @click="resetSearch" type="text" class="btnTxt">
            重置
          </gj-button>
        </gj-space>
      </gj-row>
    </template>
    <template #table>
      <CommonTable
        :columns="form.columns"
        :tableData="form.tableData"
        :noData="form.noData"
        :row-key="form.rowName"
        :draggable="{}"
        :loading="form.loading"
        :filter-icon-align-left="false"
        :scroll="form.scroll"
        :row-selection="form.checkbox ? form.rowSelection : undefined"
        :pagination="form.pagination"
        @getTableCurrent="getTableCurrent"
        @getTableSize="pageSizeChange"
      ></CommonTable>
    </template>
  </layout>
  <slot name="loaddingPageStyle"></slot>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, h } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";
import layout from "@/components/layout.vue";
import CommonTable from "@/components/CommonTable.vue";
import { GjMessage } from "@gj/atom";
import commonView from "@pagesSystem/published/components/CommonLog/CommonView.vue";
export default defineComponent({
  name: "",
  components: {
    SvgIcon,
    layout,
    CommonTable,
    commonView,
  },
  props: {
    platformCode: {
      type: String,
      default: () => {
        return "";
      },
    },
    columnsLsit: {
      type: Array,
      default: () => {
        return [];
      },
    },
    requestApi: {
      type: Function,
      defalut: () => {
        return () => {};
      },
    },
  },
  setup(props) {
    const data = reactive({
      shopIdLoading: false,
      personListLoading: false,
      activatList: [],
      multipleSelect: {
        value: "",
        name: "title",
        timeValue: [],
      },
      formDataSearch: {
        platformCode: props.platformCode,
        shopCode: "",
        title: "",
        sku: "",
        responsibleId: "",
        shopSku: "",
        itemId: "",
        publishStartTime: "",
        publishEndTime: "",
      },
      shopList: {
        name: "店铺",
        children: [],
      },
      publisherList: {
        name: "发布人",
        children: [],
      },
      personList: {
        name: "负责人",
        children: [],
      },
      options: [
        {
          name: "标题",
          codeId: "title",
        },
        {
          name: "SKU/SPU",
          codeId: "sku",
        },
        {
          name: "店铺sku",
          codeId: "shopSku",
        },
        {
          name: "itemID",
          codeId: "itemId",
        },
      ],

      form: {
        border: false, //{wrapper: true, cell: true}是否显示边框
        hover: true, //是否显示选中效果
        stripe: false, //是否开启斑马纹效果
        checkbox: false, //是否多选
        rowSelection: {
          //全选
          type: "checkbox",
          showCheckedAll: true,
        },
        scroll: {
          x: 2000,
          y: 0,
        },
        loading: false, //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        noData: false, //无数据
        rowName: "id", //表格行 key 的取值字段
        columns: [
          {
            title: "序号",
            dataIndex: "index",
            width: 80,
            render: (record) => {
              const index =
                data.form.pagination.total -
                record.rowIndex -
                (data.form.pagination.current - 1) *
                  data.form.pagination.pageSize;
              return h(
                "span",
                {
                  calss: ["publishResultStatus"],
                },
                index
              );
            },
          },
        ].concat(props.columnsLsit),
        tableData: [],
        pagination: {
          //分页
          current: 1,
          pageSize: 10,
          total: 0,
        },
      },
    });

    // 获取全部店铺数据
    const getShopIdList = (val) => {
      if (val && data.shopList.children.length == 0) {
        data.shopIdLoading = true;
        data.shopList.children = [
          { name: "A店铺", codeId: "aShop" },
          { name: "B店铺", codeId: "bShop" },
          { name: "C店铺", codeId: "cShop" },
          { name: "D店铺", codeId: "dShop" },
          { name: "E店铺", codeId: "eShop" },
          { name: "F店铺", codeId: "fShop" },
          { name: "G店铺", codeId: "gShop" },
        ];
        setTimeout(() => {
          data.shopIdLoading = false;
        }, 200);
      }
    };

    // 获取全部负责人数据
    const getPersonList = (val) => {
      if (val && data.personList.children.length == 0) {
        data.personListLoading = true;
        data.personList.children = [
          {
            name: "全部负责人",
            value: "0",
            codeId: "All",
          },
          {
            name: "单个负责人",
            value: "1",
            codeId: "single",
          },
        ];
        setTimeout(() => {
          data.personListLoading = false;
        }, 200);
      }
    };

    // 搜索店铺数据
    const searchShopId = (e) => {
      setActivetData(data.shopList, e);
    };
    // 搜索负责人数据
    const searchPersonList = (e) => {
      setActivetData(data.personList, e);
    };
    // 输入内容搜索
    const searchTitleOrSku = (e) => {
      const theEvent = window.event || e;
      const code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code == 13) {
        inputEvent(e);
      }
    };
    const clickIconInput = () => {
      inputEvent(data.multipleSelect.value);
    };
    const inputEvent = (e) => {
      data.formDataSearch[data.multipleSelect.name] = e;
      const index = data.activatList.findIndex(
        (item) => item.name === data.multipleSelect.name
      );
      if (data.multipleSelect.value) {
        let value = data.multipleSelect.value;
        data.multipleSelect.value = value.replace(/^\s+|\s+$/g, "");
        setActivatListStatus(index, data.multipleSelect);
      } else {
        data.activatList.splice(index, 1);
      }
      getList();
    };
    // 选择标题搜索
    const selectTitleOrSku = (e) => {
      const optionsData = data.options.filter((item) => item.codeId !== e);
      optionsData.forEach((item) => {
        data.formDataSearch[item.codeId] = "";
      });
      data.formDataSearch[e] = data.multipleSelect.value;
      if (data.multipleSelect.value) {
        setMultipleActivet(data.multipleSelect, optionsData);
        getList();
      }
    };

    const setMultipleActivet = (row, option) => {
      data.activatList.filter((item, index) => {
        option.forEach((element) => {
          if (element.codeId === item.name) {
            setActivatListStatus(index, row);
          }
        });
      });
    };
    // 设置下拉框已选的搜索标签
    const setActivetData = (row, e) => {
      const index = data.activatList.findIndex((it) => it.name === row.name);
      if (e) {
        setActivatListStatus(index, { name: row.name, value: e });
      } else {
        data.activatList.splice(index, 1);
      }
      getList();
    };
    const setActivatListStatus = (index, val) => {
      const obj = {
        name: val.name,
        value: val.value,
      };
      if (index !== -1) {
        data.activatList.splice(index, 1, obj);
      } else {
        data.activatList.push(obj);
      }
    };

    //获取列表数据
    const getList = () => {
      const params = {
        ...data.formDataSearch,
        pageCurrent: data.form.pagination.current,
        pageSize: data.form.pagination.pageSize,
      };
      data.form.loading = true;
      props
        .requestApi(params)
        .then((res) => {
          if (res.code !== 200) {
            GjMessage.error(res.message);
          }
          data.form.tableData = res.data.records;
          data.form.pagination.total = res.data.total;
          data.form.pagination.current = res.data.pageCurrent;
          data.form.pagination.pageSize = res.data.pageSize;
        })
        .finally(() => {
          data.form.loading = false;
        });
    };

    // 清空重置数据
    const resetSearch = () => {
      Object.keys(data.formDataSearch).forEach((key) => {
        if (data.formDataSearch[key] && key !== "platformCode") {
          data.formDataSearch[key] = "";
        }
      });
      Object.keys(data.multipleSelect).forEach((key) => {
        data.multipleSelect[key] = "";
        if (key === "name") {
          data.multipleSelect[key] = "title";
        }
        if (key === "timeValue") {
          data.multipleSelect[key] = [];
        }
      });
      data.form.pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
      };
      data.activatList = [];
      getList();
    };

    // 弹框显示
    // 切换列表页
    const getTableCurrent = (e) => {
      data.form.pagination = {
        ...data.form.pagination,
        current: e.current,
        pageSize: e.pageSize,
      };
      getList();
    };
    const pageSizeChange = (e) => {
      data.form.pagination = {
        ...data.form.pagination,
        current: e.current,
        pageSize: e.pageSize,
      };
      getList();
    };
    const closeTags = (val) => {
      if (val.value.name === "店铺") {
        data.formDataSearch.shopCode = "";
      } else if (
        val.value.name === "title" ||
        val.value.name === "sku" ||
        val.value.name === "shopSku" ||
        val.value.name === "itemId"
      ) {
        data.formDataSearch[val.value.name] = "";
        data.multipleSelect.value = "";
        data.multipleSelect.name = "title";
      } else if (val.value.name === "负责人") {
        data.formDataSearch.responsibleId = "";
      } else if (val.value.name === "日期") {
        data.multipleSelect.timeValue = [];
      }
      data.activatList.splice(val.idx, 1);

      getList();
    };
    const timeChange = (val) => {
      data.formDataSearch.publishStartTime = val[0];
      data.formDataSearch.publishEndTime = val[1];
      const obj = {
        name: "日期",
        value: `${val[0]} ~ ${val[1]}`,
      };
      setActivetData(obj, obj.value);
    };
    onMounted(() => {
      getList();
    });
    return {
      ...toRefs(data),
      resetSearch,
      getPersonList,
      getShopIdList,
      searchShopId,
      searchPersonList,
      searchTitleOrSku,
      getTableCurrent,
      pageSizeChange,
      selectTitleOrSku,
      closeTags,
      timeChange,
      clickIconInput,
    };
  },
});
</script>

<style scoped lang="scss">
@import "@pagesSystem/published/components/CommonLog/index.scss";
</style>
