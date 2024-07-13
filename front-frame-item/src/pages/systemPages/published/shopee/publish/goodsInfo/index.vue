<!-- 商品资料 -->
<template>
  <CommonPage
    currentRouterPermission="SHOPEE/pubShopeeGoodsInfo/view"
    :pageRest="true"
    @common-page-rest="resetHandler"
  >
    <template #tag-content>
      <TagGroup v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>

    <template #filter-content>
      <FilterCondition
        :timeOpt="[
          { label: '创建时间', value: '1' },
          { label: '更新时间', value: '2' },
        ]"
        :titleListOpt="[
          { label: '标题', value: '1' },
          { label: 'SPU/SKU', value: '2' },
        ]"
        :showItem="[
          'site',
          'specsType',
          'filterChangeFn',
          'chargePersonId',
          'keyWords',
          'rangeValue',
        ]"
        @filter-change="filterChange"
        @tag-change="changeList"
        ref="normalFilterRef"
      />
    </template>

    <template #operate_bar-content>
      <OperateBtnGroup>
        <template #left>
          <GjButton
            v-for="item in btnList"
            :class="item.class"
            :key="item.text"
            :type="item.type || undefined"
            :v-permissions="item.permissions"
            @click="item.handler"
            >{{ item.text }}</GjButton
          >
          <p class="selected-val">
            已选
            <span>{{ hasSelectLen }}</span>
          </p>
        </template>
      </OperateBtnGroup>
    </template>

    <template #table-content>
      <CommonTable
        ref="commonTableRef"
        :columns="columns"
        :tableData="tableData"
        row-key="id"
        :loading="loading"
        :scroll="scroll"
        :rowSelectionVisiable="true"
        :selectedRowKeys="selectedRowKeys"
        :pagination="paginationProps"
        @onRowSelection="getSelection"
        @getTableCurrent="getTableCurrent"
        @change="sortChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 图片 -->
          <template v-if="column.dataIndex === 'mainImage'">
            <gb-table-image :url="record.mainImage"></gb-table-image>
          </template>

          <template v-if="column.dataIndex === 'spu'">
            <div>
              <gj-tooltip :content="record.defaultTitle">
                <div class="ellipsis">{{ record.defaultTitle }}</div>
              </gj-tooltip>
            </div>
            <column-copy
              :textValue="record.spu"
              :isAnchor="false"
            ></column-copy>
          </template>

          <!-- 备注 -->
          <template v-if="column.dataIndex === 'remark'">
            <editRemark
              :record="record"
              :remarkVal="remark"
              @showEditRemark="showEditRemark(record)"
              @saveRemark="saveRemark"
            ></editRemark>
          </template>
        </template>
      </CommonTable>

      <CommodityInformationDetail
        v-if="detailVisible"
        :type="actionType"
        :fileListData="fileListData"
        :recordId="recordId"
        :dialogVisible="detailVisible"
        @cancel="detailDialogCancel"
        @update-handler="updateHandler"
        @saveAndDraft="saveAndDraft"
      />
    </template>
  </CommonPage>
  <!-- 生成草稿 -->
  <goods-draft
    :dialogVisible="draftVisible"
    :goodsRow="batchAll"
    @cancel="draftDialogCancel"
    @confirm="draftDialogConfirm"
  ></goods-draft>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  watch,
  h,
  ref,
  computed,
} from "vue";
// import { useStore } from 'vuex';
import _ from "lodash";
// import dayjs from 'dayjs';
import CommonPage from "@/components/CommonPage.vue";
import { GjButton, GjMessage, GjModal } from "@gj/atom";
import CommonTable from "@/components/CommonTable.vue";
import TagGroup from "@/components/TagGroup.vue";
import mainImg from "./mainImg.vue";
import productName from "./productName.vue";
import editRemark from "./editRemark.vue";
import more from "./more.vue";
import CommodityInformationDetail from "../../components/CommodityInformationDetail.vue";
import OperateBtnGroup from "@/components/OperateBtnGroup.vue";
import ActionColumn from "@/components/ActionColumn.vue";
import FilterCondition from "@pagesSystem/published/shopee/components/common/FilterCondition.vue";
import columnCopy from "@/components/columnCopy.vue";
import AppTablePopover from "@pagesSystem/published/shopee/components/AppTablePopover.vue";
import {
  getShopeeProduct,
  deleteShopeeProduct,
  addRemark,
} from "@api/published/shopee.js";
import { clearStore } from "@/utils/common";
// import { convertSelectedValue } from '@/utils/format';
import goodsDraft from "../../components/goodsDraft.vue";
import { emptyFilter } from "@/utils/format";
const DEFAULT_SORT = "createTime";
const DEFAULT_ORDER = "DESC";

export default defineComponent({
  name: "PubShopeeGoodsInfo",
  /* eslint-disable */
  components: {
    CommonPage,
    CommonTable,
    mainImg,
    productName,
    editRemark,
    CommodityInformationDetail,
    more,
    FilterCondition,
    OperateBtnGroup,
    TagGroup,
    ActionColumn,
    goodsDraft,
    AppTablePopover,
    columnCopy,
  },
  /* eslint-enable */
  setup() {
    /* const { appContext } = getCurrentInstance();
    const $store = useStore(); */

    const data = reactive({
      sort: DEFAULT_SORT,
      order: DEFAULT_ORDER,
      searchActive: [],
      rowSelection: {
        selectedRowKeys: [],
      },
      variantListColumns: [],
      actionType: 1,
      searchObj: {
        site: [],
        spu: "",
        title: "",
        specsType: "",
        chargePerson: "",
        createTimeStart: "",
        chargePersonId: [],
        rangeValue: [],
        keyWords: "",
        keyWordType: "1",
        timeType: "1",
      },
      options: [],
      timeOptions: [],
      dataList: [],
      platform: [],
      specifications: [],
      personList: [],
      titelActive: {},
      selectNub: 0,
      remark: "",
      parmasObj: {
        site: [],
      },
      total: 0,
      pageOption: {
        pageCurrent: 1,
        pageSize: 20,
      },
      form: {
        border: false, //{wrapper: true, cell: true}是否显示边框
        hover: true, //是否显示选中效果
        stripe: false, //是否开启斑马纹效果
        //是否为加载中状态
        tableHeader: true, //是否隐藏表头
        rowName: "name", //表格行 key 的取值字段
      },
      columns: [
        {
          title: "图片",
          dataIndex: "mainImage",
          fixed: "left",
          width: 50,
        },
        {
          title: "标题/SKU(SPU)",
          dataIndex: "spu",
          fixed: "left",
          width: 150,
        },
        {
          title: "站点",
          dataIndex: "site",
          width: 120,
          customRender: ({ record }) => (
            <span>{emptyFilter(record.siteName)}</span>
          ),
        },
        {
          title: "产品分类",
          dataIndex: "categoryName",
          width: 120,
          customRender: ({ record }) => (
            <GbText>{emptyFilter(record.categoryName)}</GbText>
          ),
        },
        {
          title: "规格",
          dataIndex: "specsType",
          width: 100,
          customRender: ({ record }) => {
            if (record.specsType === 2) {
              return (
                <AppTablePopover
                  style={{ maxWidth: "600px" }}
                  position="br"
                  title="变体信息"
                  record="变体"
                  columns={data.variantListColumns}
                  handlerFunction={handlerFunction}
                  paramObj={{ id: record.id }}
                  resData={record}
                />
              );
            } else {
              const list = data.specificationList.find(
                (item) => item.code === record.specsType
              );
              return <span>{emptyFilter(list?.productName)}</span>;
            }
          },
        },
        {
          title: "建议售价",
          width: 100,
          dataIndex: "recommendPrice",
          customRender: ({ record }) => {
            return (
              <div class="recommendPrice-warp">
                <GbText>
                  {record.recommendPriceUnit
                    ? record.recommendPriceUnit + ":"
                    : ""}
                  &nbsp;
                  {emptyFilter(record?.recommendPrice)}
                </GbText>
                <span>
                  {record.siteCode === "cb" ? (
                    <GjTooltip content="本售价默认美元，详细信息请前往编辑页面查看">
                      <SvgIcon svgClass="arrowYiWen" width={15}></SvgIcon>
                    </GjTooltip>
                  ) : null}
                </span>
              </div>
            );
          },
        },
        {
          title: "在线数量",
          width: 100,
          dataIndex: "publishCount",
        },
        {
          title: "负责人",
          width: 100,
          dataIndex: "chargePersonName",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 120,
          showSorterTooltip: false,
          sorter: true,
          customRender: ({ record }) =>
            h("span", {}, formatTime(record.createTime)),
        },
        {
          title: "更新时间",
          dataIndex: "updateTime",
          key: "updateTime",
          width: 120,
          showSorterTooltip: false,
          sorter: true,
          customRender: ({ record }) =>
            h("span", {}, formatTime(record.updateTime)),
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 150,
        },
        {
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          width: 60,
          customRender: ({ record }) => {
            return (
              <div>
                <GjButton
                  v-permissions="['Shopee/pubShopeeGoodsInfo/edit']"
                  type="text"
                  onClick={() => editDetails(record)}
                >
                  编辑
                </GjButton>
                <more
                  record={record}
                  editDetails={(item) => editDetails(item)}
                  copyProduct={(item) => copyProduct(item)}
                  createDrafts={(item) => createDrafts(item)}
                  deleteProduct={(item) => deleteProduct(item)}
                ></more>
              </div>
            );
          },
        },
      ],
      scroll: {
        x: 2000,
        y: 0,
      },
      loading: false,
      tableData: [],
      multipleSelection: [],
      detailVisible: false,
      recordId: "",
      fileListData: [],
      splitSymbol: ":",
      formDataSearch: {
        name: "",
        sites: [],
        shopIds: [],
      },
      draftVisible: false,
      batchAll: [],
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
      getVariantList: [],
    });

    const normalFilterRef = ref();
    const commonTableRef = ref();
    const sortedInfo = ref();

    // 草稿
    const draftDialogCancel = () => {
      data.draftVisible = false;
      data.batchAll = [];
      data.rowSelection.selectedRowKeys = [];
    };
    const draftDialogConfirm = () => {
      console.log("draftDialogConfirm");
    };

    // 批量生成草稿
    const createBatchDrafts = () => {
      if (hasSelectLen.value == 0) {
        return GjMessage.warning("请先在表格中勾选要操作的内容行。");
      }
      data.batchAll = data.multipleSelection.ids;
      data.draftVisible = true;
    };

    // 生成单个草稿
    const createDrafts = (id) => {
      data.batchAll = [id];
      data.draftVisible = true;
    };

    // 规格
    const specificationsFun = (e) => {
      setSerachFun(e, "name", data.specifications);
    };
    // 负责人
    const personFun = (e) => {
      setSerachFun(e, "chargePersonName", data.personList);
    };
    //日期
    const timeChange = (e) => {
      data.searchObj.createTimeStart = e;
      let createTure = false;
      data.searchActive.forEach((item, index) => {
        if (item.flag == "createTimeStart") {
          data.searchActive.splice(index, 1);
          data.searchActive.push({
            name: e,
            activeName: "日期 ：" + e,
            flag: "createTimeStart",
            value: e,
          });
          createTure = true;
        } else {
          createTure = false;
        }
      });
      if (!createTure) {
        data.searchActive.push({
          name: e,
          activeName: "日期 ：" + e,
          flag: "createTimeStart",
          value: e,
        });
      }
    };
    // 标题
    const titleFun = (e) => {
      data.options.map((item) => {
        if (e === item.name) {
          data.titelActive = item;
        }
      });
      data.searchActive.forEach((item, index) => {
        if (item.flag == "title") {
          data.searchActive.splice(index, 1);
          setTitelFun(data.searchObj.spu);
        }
      });
    };
    // 标题文本
    const titelTextChange = (e) => {
      if (e.target.value) {
        let createTure = true;
        data.searchActive.forEach((item, index) => {
          if (item.flag == "title" && item.spuFlag == "spu") {
            data.searchActive.splice(index, 1);
            setTitelFun(e);
            createTure = false;
          }
        });
        if (createTure) {
          setTitelFun(e);
        }
      } else {
        console.log("请输入文本值");
      }
    };

    //处理Serach中下拉框的单选
    const setSerachFun = (e, attr, row) => {
      let cunt = {};
      row.forEach((item) => {
        if (e == item.value) {
          cunt = item;
        }
      });
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
    };
    // 选中的查询条件
    const setPushFun = (row, e, name) => {
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
      getlist();
    };
    // 查询条件标题文
    const setTitelFun = () => {
      let row = data.options[0];
      data.searchActive.push({
        activeName: data.titelActive.name
          ? data.titelActive.name + " : " + data.searchObj.spu
          : row.name + " : " + data.searchObj.spu,
        name: data.searchObj.spu,
        flag: data.titelActive.flag ? data.titelActive.flag : row.flag,
        value: data.titelActive.value ? data.titelActive.value : row.value,
        spuFlag: "spu",
      });
    };

    // 创建商品
    const createGoods = () => {
      data.recordId = "";
      data.detailVisible = true;
      data.actionType = 1;
    };

    // 批量删除
    const batchDelete = () => {
      if (hasSelectLen.value == 0) {
        return GjMessage.warning("请先在表格中勾选要操作的内容行。");
      }

      GjModal.confirm({
        title: "提示",
        // content: `是否确认删除${hasSelectLen.value}条数据？`,
        content: "此操作不可逆，是否删除？",
        onOk: async () => {
          await deleteShopeeProduct(data.multipleSelection)
            .then((res) => {
              if (res.code === 200) {
                getlist();

                return GjMessage.success("删除成功！");
              }
            })
            .catch(() => {
              return GjMessage.error("删除失败！");
            });
        },
      });
    };

    const searchDataParam = computed(() => {
      return {
        ...data.pageOption,
        ...data.parmasObj,
        sort: data.sort,
        queue: data.order,
      };
    });

    const errorCallBack = () => {
      data.tableData = [];
      data.total = 0;
    };

    // 商品列表
    const getlist = () => {
      data.loading = true;
      const params = searchDataParam.value;
      data.rowSelection.selectedRowKeys = [];
      // data.selectNub = 0

      getShopeeProduct(params)
        .then((res) => {
          if (res.code === 200) {
            data.tableData = res.data?.records || [];
            data.total = res.data.total;
          } else {
            errorCallBack();
          }
        })
        .catch(() => {
          errorCallBack();
        })
        .finally(() => {
          data.loading = false;
        });
    };

    const filterChangeFn = (filterData) => {
      /*  const _title =
        filterData.keyWordType === '1' ? filterData.keyWords : undefined;
      const _spu =
        filterData.keyWordType === '2' ? filterData.keyWords : undefined;
 */
      console.log(filterData, "filterData");
      data.parmasObj = {
        chargePersonIds: filterData.chargePersonId.join(","),
        sites: filterData.siteIds.join(","),
        // shopIds: filterData.shopIds,
        specsType: filterData.specsType,
        /* title: _title,
        spu: _spu, */
        type: filterData.keyWordType,
        keyWords: filterData.keyWords,
        timeType: filterData.timeType,
        startTime: (filterData.rangeValue && filterData.rangeValue[0]) || "",
        endTime: (filterData.rangeValue && filterData.rangeValue[1]) || "",
      };

      // 重新从第一页来查询
      data.pageOption.pageCurrent = 1;
      getlist();
    };

    const hasSelectLen = computed(
      () => data.rowSelection.selectedRowKeys.length
    );

    const selectedRowKeys = computed(() => {
      return data.rowSelection.selectedRowKeys.map((item) => item["id"]);
    });

    const getSelection = (val) => {
      data.rowSelection.selectedRowKeys = val;
      const res = { ids: [] };
      val.map((item) => {
        return res.ids.push(item.id);
      });
      data.multipleSelection = res;
    };

    const filterChange = _.debounce(filterChangeFn, 200);

    const paginationProps = computed(() => {
      return {
        total: data.total,
        pageSize: data.pageOption.pageSize,
        pageCurrent: data.pageOption.pageCurrent,
      };
    });

    const paginationChange = (e) => {
      data.pageSize = e;
      getlist();
    };

    const saveRemark = (record, item) => {
      const params = {
        id: record.id,
        remark: item,
      };

      addRemark(params)
        .then((res) => {
          if (res.code === 200) {
            data.remark = "";
            getlist();

            return GjMessage.success("编辑成功！");
          } else {
            return GjMessage.error("编辑失败！");
          }
        })
        .catch(() => {
          return GjMessage.error("编辑失败！");
        });
    };

    const showEditRemark = (item) => {
      data.remark = item.remark;
    };

    // 查询商品资料详情
    // const getDetailsData = async () => {
    /* const d = {
        url: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
        mainImage: 0,
      }

      data.fileListData = [d] */
    /* const id = data.recordId;
      await getShopeeProductDetails(id)
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            const {
              /* site,
              chargePersonName,
              categoryId,
              titles,
              condition,
              specsType,
              weight,
              width,
              length,
              height, */
    /* imageList,
            } = res.data;

            // 获取主图列表
            const { resource, contentType, mainImage, size } = imageList[0];
            const d = {
              url: resource || '',
              isMain: mainImage,
              file: {
                type: `image/${contentType}` || '',
                size: size || 0,
              },
            };

            data.fileListData = [d]; */
    // store.getters.getParams['detailsData'] = res.data

    // 基础信息
    /* const basicInfoContent = {
              site: [{ value: site }],
              chargePersonName: [{ value: chargePersonName }],
              categoryId: [{ value: categoryId }],
            } */

    // 产品信息
    /* const t = titles.map((item) => {
              return { value: item }
            }) */

    /* const productInfoContent = {
              titles: t,
              condition: condition == 1 ? '全新' : '二手',
              specsType: specsType == 1 ? '单品' : '变体',
              weight,
              width,
              length,
              height,
            } */

    /* data.basicInfoDetailsData = basicInfoContent
            data.productInfoDetailsData = productInfoContent */
    /* } else {
            errorCallBack();
          }
        })
        .catch(() => {
          errorCallBack();
        })
        .finally(() => {
          data.loading = false;
        });
    }; */

    // 编辑商品资料
    const editDetails = (item) => {
      data.recordId = item.id;
      data.actionType = 2;
      data.detailVisible = true;
      // await getDetailsData();
    };

    const add0 = (m) => {
      return m < 10 ? "0" + m : m;
    };

    // 格式化时间戳
    const formatTime = (t) => {
      let time = new Date(t),
        y = time.getFullYear(),
        m = time.getMonth() + 1,
        d = time.getDate(),
        h = time.getHours(),
        mm = time.getMinutes(),
        s = time.getSeconds();

      return (
        y +
        "-" +
        add0(m) +
        "-" +
        add0(d) +
        " " +
        add0(h) +
        ":" +
        add0(mm) +
        ":" +
        add0(s)
      );
    };

    // 选择所有行
    /* const selectAll = (val) => {
      const res = { ids: [] }
      val.map((item) => {
        return res.ids.push(item)
      })

      data.selectNub = res.ids.length
      data.multipleSelection = res
    } */

    const getTableCurrent = (e) => {
      data.pageOption.pageCurrent =
        e.pageCurrent || data.pageOption.pageCurrent;
      data.pageOption.pageSize = e.pageSize || data.pageOption.pageSize;
      getlist();
    };

    /* const pageSizeChange = (e) => {
      data.form.pagination = {
        ...data.form.pagination,
        current: e.current,
        pageSize: e.pageSize,
      }
      getlist()
    } */

    // 复制
    const copyProduct = (item) => {
      data.recordId = item.id;
      data.actionType = 3;
      data.detailVisible = true;
    };

    // 删除商品
    const deleteProduct = async (id) => {
      let params = {
        ids: [id],
      };

      await deleteShopeeProduct(params)
        .then((res) => {
          if (res.code === 200) {
            getlist();

            return GjMessage.success("删除成功！");
          }
        })
        .catch(() => {
          return GjMessage.error("删除失败！");
        });
    };

    const btnList = [
      {
        text: "添加商品",
        handler: createGoods,
        type: "primary",
        permissions: ["Shopee/pubShopeeGoodsInfo/create"],
      },
      {
        text: "生成草稿",
        handler: createBatchDrafts,
        class: "gray-border",
        permissions: ["Shopee/pubShopeeGoodsInfo/batchDrafts"],
      },
      {
        text: "批量删除",
        handler: batchDelete,
        class: "gray-border",
        permissions: ["Shopee/pubShopeeGoodsInfo/batchDelete"],
      },
    ];

    const saveAndDraft = (pIds) => {
      data.recordId = [pIds];
      data.detailVisible = false;
      clearStore();
      data.draftVisible = true;
    };

    // 重置
    const resetHandler = () => {
      Object.keys(data.formDataSearch).forEach(
        (key) => (data.formDataSearch[key] = "")
      );
      sortedInfo.value = null;
      data.sort = DEFAULT_SORT; //默认
      data.order = DEFAULT_ORDER; //默认
      data.searchActive = [];
      data.form.pagination = {
        pageCurren: 1,
        pageSize: 20,
        totalRow: 0,
      };
      commonTableRef.value?.updateSortOrder(sortedInfo.value);
      normalFilterRef.value?.resetHandler();
      getlist();
    };

    const changeFilterSelect = (id) => {
      data.formDataSearch[id] = Array.isArray(data.formDataSearch[id])
        ? []
        : "";
      normalFilterRef.value?.changeFilterCondition(id);
    };

    const detailDialogCancel = () => {
      data.detailVisible = false;
    };

    const updateHandler = () => {
      data.detailVisible = false;
      getlist();
    };

    const changeList = (target) => {
      if (Array.isArray(target)) {
        data.searchActive = target;
      } else {
        const index = data.searchActive.findIndex(
          (item) => item.id === target.id
        );
        const { showName, showValue } = target;
        console.log(showValue, "showValue");
        if (index >= 0) {
          if (!showValue && showValue.length === 0) {
            data.searchActive.splice(index, 1);
          } else {
            data.searchActive[index].showName = showName;
            data.searchActive[index].showValue = showValue;
          }
        } else if (showValue) {
          data.searchActive.push(target);
        }
      }
    };

    const sortChange = (val) => {
      /**
       * @param {val} 公共表格傳入的值
       */
      // 这里只监听排序的，有需要的类型自己补充
      if (val.action === "sort") {
        const { order, field, column } = val.sorter;
        data.sort = column ? field : DEFAULT_SORT;
        data.order = order === "ascend" ? "ASC" : "DESC";
        sortedInfo.value = val.sorter;
        commonTableRef.value.updateSortOrder(sortedInfo.value);
        getlist();
      }
    };

    const handlerFunction = (res) => {
      const list = res || [];
      const result = [];
      let itemObj = null;
      let dkrColumns = [];
      let recommendPriceUnit = "";
      list.forEach((item, index) => {
        recommendPriceUnit = recommendPriceUnit
          ? recommendPriceUnit
          : item.price;
        itemObj = { ...item, id: item.variantId || index };

        item.varAttrValues?.forEach((it) => {
          itemObj[it.varAttrValue] = it.varAttr;
        });
        result.push(itemObj);
      });
      dkrColumns = list
        .map((item) => item.varAttrValues?.map((it) => it.varAttrValue))
        .flat(1);
      dkrColumns = [...new Set(dkrColumns)].filter((item) => item);
      // console.log(...keys, 'keys');

      dkrColumns = dkrColumns.map((item, index) => ({
        title: item[index],
        dataIndex: item[index],
        minWidth: 120,
        customRender: ({ record }) => <span>{emptyFilter(record[item])}</span>,
      }));

      dkrColumns = dkrColumns.concat([
        {
          title: "建议售价",
          dataIndex: "price",
          align: "right",
          width: 150,
          key: "price",
          customRender: ({ record }) => (
            <span>{emptyFilter(record.price)}</span>
          ),
        },
      ]);
      data.variantListColumns = dkrColumns;
      return { total: result.length, tableData: result };
    };

    const onRecalculateWh = () => {
      const fn = commonTableRef.value?.calculateWH;
      fn && fn();
    };

    watch(
      () => data.searchActive.length,
      () => {
        onRecalculateWh();
      }
    );

    onMounted(() => {
      getlist();
    });

    /* watch(
      () => data.searchObj.rangeValue,
      () => {
        getlist()
      }
    ) */

    return {
      ...toRefs(data),
      btnList,
      normalFilterRef,
      commonTableRef,
      paginationProps,
      hasSelectLen,
      specificationsFun,
      titleFun,
      titelTextChange,
      personFun,
      timeChange,
      createGoods,
      batchDelete,
      paginationChange,
      filterChange,
      editDetails,
      formatTime,
      // selectAll,
      getTableCurrent,
      // pageSizeChange,
      copyProduct,
      createDrafts,
      createBatchDrafts,
      resetHandler,
      detailDialogCancel,
      saveRemark,
      showEditRemark,
      deleteProduct,
      changeFilterSelect,
      getSelection,
      changeList,
      draftDialogCancel,
      draftDialogConfirm,
      sortChange,
      handlerFunction,
      updateHandler,
      saveAndDraft,
      selectedRowKeys,
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
}
.authorizationManage,
.eye,
.selectDown,
.close {
  position: relative;
  top: 4px;
  font-size: 15px;
}
.grid-demo .arco-tag {
  border-radius: 20px;
}

.selected-val {
  margin-left: 4px;
  color: #000430;
  span {
    color: #0045f0;
  }
}
.gray-border {
  border-color: #e6e6ed;
  background-color: #fff;
}
/deep/.table-column-copy-content-1 {
  color: #0045f0;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
