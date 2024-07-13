<template>
  <div class="basic-info" id="compatibilityInfo-ebay">
    <gj-row :gutter="24" class="pt">
      <gj-col :span="12">
        <gj-space>
          <h2 class="title">配件兼容性</h2>
          <gj-button type="text" @click="addCompatibility"
            >添加兼容信息
          </gj-button>
          <gj-button type="text" @click="importCompatibility"
            >从eBay导入</gj-button
          >
        </gj-space>
      </gj-col>
      <gj-col :span="12" class="header_rigth">
        <gj-row justify="end">
          <gj-space>
            <gj-select
              size="small"
              :style="{ width: '160px' }"
              v-model="compatibilityInfo.compatibilityTemplateId"
              placeholder="请选择模板"
              allow-clear
              @popup-visible-change="getTemplateList"
            >
              <gj-option
                v-for="item in locationData"
                :key="item.id"
                :value="item.name"
                >{{ item.name }}</gj-option
              >
            </gj-select>

            <gj-button type="text">另存为模板</gj-button>
          </gj-space>
        </gj-row>
      </gj-col>
    </gj-row>

    <div>
      <gj-form
        ref="compatibilityForm"
        class="basic-info-form"
        :model="compatibilityInfo"
        :label-col-props="{ span: 24 }"
        :wrapper-col-props="{ span: 24 }"
        :rules="rules"
        @submit="submitForm"
      >
        <!--添加兼容信息  -->
        <div v-if="compatibilityVisible == 'add'">
          <gj-col :span="24">
            <div class="cascader_footer">
              <gj-button type="outline" size="mini" @click="offTable"
                >关闭</gj-button
              >
            </div>
          </gj-col>
          <gj-row
            :gutter="24"
            class="cascader_box"
            v-if="compatibilityList.length > 0"
          >
            <gj-col
              :span="5"
              class="item_border"
              v-for="(item, propertIndex) in compatibilityList"
              :key="item"
            >
              <div>
                <p class="header_titel">{{ item.propertyName }}</p>
                <gj-input-search
                  :placeholder="item.propertyName"
                  v-model="item.searchKeyVal"
                  @change="searchKeyChange(item, propertIndex)"
                  size="mini"
                />
                <div class="" style="height: 264px; margin-top: 8px">
                  <ul class="ulScooll">
                    <li
                      v-for="(child, index) in item.childern"
                      :key="index"
                      :class="child.isWhether ? 'activeClass' : ''"
                    >
                      <span
                        v-if="item.displaySeq !== '1'"
                        class="margin-top: 3px;"
                      >
                        <gj-checkbox
                          v-model="child.isChecked"
                          :indeterminate="child.indeterminate"
                          @change="
                            handleChange(
                              child,
                              index,
                              propertIndex,
                              item.displaySeq,
                              item
                            )
                          "
                        ></gj-checkbox>
                      </span>
                      <span
                        class="tree_text"
                        @click="
                          itemTree(
                            child,
                            index,
                            propertIndex,
                            item.displaySeq,
                            item
                          )
                        "
                      >
                        {{ child.queryCompatibilityValue }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </gj-col>
          </gj-row>
        </div>
        <!-- 从eBay导入 -->
        <div v-if="compatibilityVisible == 'import'">
          <gj-row :gutter="24">
            <gj-col :span="8">
              <gj-form-item
                label="Item ID"
                :label-col-style="{ 'justify-content': 'flex-start' }"
                class="import-form"
              >
                <gj-input v-model="compatibilityInfo.itemId" placeholder="" />
                <gj-button
                  type="primary"
                  size="small"
                  class="import-form-btn"
                  @click="importBtn"
                  >导入</gj-button
                >
              </gj-form-item>
            </gj-col>
          </gj-row>
        </div>
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="已选的兼容信息"
            >
              <gj-input-search
                :style="{ width: '320px' }"
                placeholder="Please enter something"
                @change="searchInfoFun"
              />
            </gj-form-item>
          </gj-col>
        </gj-row>
        <gj-row :gutter="24" class="table-operation">
          <gj-col :span="24">
            <gj-space>
              <gj-popconfirm @ok="okDelete('Notes')" position="bottom">
                <gj-button type="text" class="table-operation"
                  >Compatibility Notes</gj-button
                >
                <template #icon>
                  <span></span>
                </template>
                <template #content>
                  <gj-input
                    v-model="compatibilityInfo.Notes"
                    :max-length="50"
                    :style="{ width: '240px' }"
                    placeholder="请输入"
                    allow-clear
                    show-word-limit
                  >
                  </gj-input>
                  <div
                    style="margin: 16px 0 0 0; height: 1px; background: #e6e6ed"
                  ></div>
                </template>
              </gj-popconfirm>

              <gj-popconfirm
                content="确定要删除全部记录吗"
                okText="继续"
                cancelText="取消"
                @ok="okDelete('delete')"
              >
                <gj-button class="table-operation">批量删除</gj-button>
              </gj-popconfirm>
            </gj-space>
          </gj-col>
          <gj-col :span="24">
            <gj-table
              :row-key="'id'"
              :row-selection="rowSelection"
              :columns="columns"
              :data-source="source"
              :pagination="false"
            >
              <template #bodyCell="{ column, text, recordIndexs, record }">
                <template v-if="column.dataIndex === 'compatibilityNotes'">
                  <div>
                    <gj-input
                      v-model="source[recordIndexs[0]].compatibilityNotes"
                      size="mini"
                      placeholder="请输入"
                      allow-clear
                      @change="
                        recordNotes(
                          source[recordIndexs[0]].compatibilityNotes,
                          recordIndexs
                        )
                      "
                    ></gj-input>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                  <gj-button
                    type="text"
                    @click="okDelete('operation', record, recordIndexs)"
                    >删除</gj-button
                  >
                </template>
                <template v-else>
                  <!-- <p class="text-line">{{ text || '--' }}</p> -->
                  <gj-tooltip :content="text" position="tl">
                    <p class="text-line">{{ text || "--" }}</p>
                  </gj-tooltip>
                </template>
              </template>
            </gj-table>
            <div class="pagintion">
              <gj-pagination
                :total="pagination.total"
                :current="pagination.current"
                :page-size="pagination.pageSize"
                size="small"
                show-total
                show-jumper
                show-page-size
                :page-size-options="[10, 20, 50, 100, 300]"
                @change="currentChange"
                @page-size-change="pageSizeChange"
              />
            </div>
          </gj-col>
        </gj-row>
      </gj-form>
    </div>
  </div>
</template>

<script>
import {
  getCurrentInstance,
  reactive,
  toRefs,
  onBeforeMount,
  ref,
  watch,
} from "vue";
import { setForm } from "@/utils/fnBusiness";
import { useStore } from "vuex";
import {
  compatibilityPrototype,
  compatibilityCommonFun,
} from "../../components/compatibilityInfo.js";
import {
  queryFirstCompatibility,
  queryCompatibility,
  childQueryCompatibility,
  queryEbayCategoryCompatibleName,
  getCompatibilityQueryList,
  getItemCompatibility,
} from "@api/published/ebay.js";
import { GjMessage } from "@gj/atom";
export default {
  emits: ["setShowItemFun", "attrFun"],
  props: {
    actionType: {
      type: String,
      default: () => {
        return "";
      },
    },
    publicList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    goodsRowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    stroeCategoryId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const key = "compatibilityInfo";
    const data = reactive({
      locationData: [],
      importForm: {
        name: "",
        post: "",
        isRead: false,
      },
      compatibilityVisible: "add",
      source: [], //动态表格
      selectSource: [], //接口生成的数据
      currentSource: [], //分页原数据
      columns: [], //动态表头
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      allbox: [],
      flag: 2,
      templateData: [
        {
          Make: "SAM",
          Model: "Ambassador",
        },
        {
          Make: "SAM1",
          Model: "Ambassador1",
        },
      ],
      rowSelection: {
        selectRows: [],
        onChange: (selectedRowKeys) => {
          data.rowSelection.selectRows = selectedRowKeys;
        },
      },
      compatibilityInfo: {
        siteId: "",
        productType: "",
        compatibilityTemplateId: "",
        itemId: "183854363618",
        Notes: "",
        columns: [], //接口需要
        tableData: [], //接口需要
      },
      rules: {
        // siteId: [{ required: true, message: '站点必填' }],
      },
      compatibilityList: [],
      erpCompatibleType: 0, //兼容性类型
      queryMake: "",
      queryModel: "",
      queryYear: "",
      queryTrimOrEngine: "",
      istrue: true, //保存上次历史
      compatibilityItem: [], //当前选中的
      compatibilityTree: [], //树形结构做勾选和表格
      searchInfoFunData: [], //搜索
      optFlag: true,
    });

    const searchKey = ref("");
    const handleSubmit = () => {};
    // 模板列表
    const getTemplateList = (val) => {
      if (val) {
        let params = {
          id: "",
          name: "",
          pageCurrent: 1,
          pageSize: 1000,
          shopIds: [],
          siteIds: [store.getters.getgoodsData.siteId],
        };

        getCompatibilityQueryList(params).then((res) => {
          data.locationData = res.data.records;
        });
      }
    };

    // 兼容性名称
    const getqueryEbayCategoryCompatibleName = async (val) => {
      let status = false;
      if (!store.getters.getgoodsData.siteId) return console.log("siteId");
      if (!store.getters.getgoodsData.categoryId)
        return console.log("categoryId");
      let params = {
        siteId: store.getters.getgoodsData.siteId,
        categoryId: store.getters.getgoodsData.categoryId, //180025,,
      };

      if (data.optFlag) {
        if (
          store.getters.getgoodsData.categoryId == params.categoryId &&
          store.getters.getgoodsData.siteId == params.siteId
        ) {
          status = true;
          data.optFlag = false;
        } else {
          status = true;
          data.optFlag = true;
        }
      }
      if (!status) return;
      await queryEbayCategoryCompatibleName(params).then((res) => {
        data.compatibilityList = res.data.compatibleNameList.sort((a, b) => {
          return a.displaySeq - b.displaySeq;
        });
        let list = data.compatibilityList.map((item, index) => {
          if (item.displaySeq == "1") {
            data.queryMake = item.propertyName;
          }
          let sum = index - 1;
          return {
            ...item,
            parentName:
              index == 0 ? "" : data.compatibilityList[sum].propertyName,
            searchKeyVal: "",
            childern: [],
          };
        });
        data.erpCompatibleType = res.data.erpCompatibleType;
        data.compatibilityList = list;
        compatibilityListInit(val);
        // }
      });
    };

    // 初始化兼容性数据
    const compatibilityListInit = async (val) => {
      let params = {
        siteId: store.getters.getgoodsData.siteId,
        erpCompatibleType: data.erpCompatibleType,
        queryCompatibilityType: data.compatibilityList[0]?.propertyName,
      };
      await queryCompatibility(params).then((res) => {
        // 合并mack数据
        data.compatibilityList.forEach((item) => {
          if (item.propertyName == res.data.queryCompatibilityType) {
            res.data.compatibilityList.forEach((ele) => {
              item.childern.push({
                queryCompatibilityType: "Make",
                queryCompatibilityValue: ele,
                lave: 1,
              });
            });
          }
        });
      });
      let p = {
        siteId: store.getters.getgoodsData.siteId,
        erpCompatibleType: data.erpCompatibleType,
      };
      await queryFirstCompatibility(p).then((res) => {
        data.compatibilityTree = res.data; //备份数据
        let list = [];
        list.push(res.data);
        let trData = compatibilityPrototype.treeChildern(list);
        data.compatibilityList.forEach((item, index) => {
          let parentSum = index - 1 < 0 ? 0 : index - 1;
          trData.forEach((flag) => {
            if (item.propertyName == flag.queryCompatibilityType) {
              item.childern.push({
                ...flag,
                lave: item.displaySeq,
                isChecked: false,
                isWhether: false,
                indeterminate: false,
                parentValue:
                  data.compatibilityList[parentSum].propertyDisplayName, //父级
                parent:
                  data.compatibilityList[parentSum].childern[0]
                    .queryCompatibilityValue, //父级
                subset: "", //子级
                subsetValue: "", //子级
              });
            }
          });
          // 处理数据关联关系
          data.compatibilityList[index].childern.forEach((ele, falg) => {
            if (ele.sum == 0) {
              let obj = ele;
              if (
                data.compatibilityList[index].childern[0]
                  .queryCompatibilityValue !== ele.queryCompatibilityValue
              ) {
                data.compatibilityList[index].childern.splice(falg, 1);
                data.compatibilityList[index].childern.splice(0, 0, obj);
              }
            }
          });
          // 设置默认选中
          data.compatibilityList[index].childern[0].isWhether = true;
        });

        // 初始化请求参数

        data.queryMake =
          data.compatibilityList[0].childern[0].queryCompatibilityValue;
        data.queryModel =
          data.compatibilityList[1].childern[0].queryCompatibilityValue;
        data.queryYear =
          data.compatibilityList[2].childern[0].queryCompatibilityValue;
        data.queryTrimOrEngine =
          data.compatibilityList[3].childern[0].queryCompatibilityValue;

        // 处理详情自动勾选
        if (val) {
          let { compatibilityPage, compatibilityNames, compatibilityRecords } =
            props.goodsRowData;
          console.log(val, compatibilityRecords, "000");
          if (val == "copy") {
            compatibilityCommonFun.setAutoCheck(
              data.compatibilityList,
              compatibilityRecords,
              val
            );
            const { columnAll, tableAll } =
              compatibilityCommonFun.editSetTableData(
                compatibilityRecords,
                compatibilityNames,
                data.compatibilityList,
                val
              );
            data.columns = columnAll;
            data.source = tableAll;
            data.currentSource = tableAll;
          } else {
            compatibilityCommonFun.setAutoCheck(
              data.compatibilityList,
              compatibilityPage,
              val
            );
            const { columnAll, tableAll } =
              compatibilityCommonFun.editSetTableData(
                compatibilityPage,
                compatibilityNames,
                data.compatibilityList,
                val
              );
            data.columns = columnAll;
            data.source = tableAll;
            data.currentSource = tableAll;
          }
        }
      });
    };
    // 点击查询下级
    const getList = (value, index, displaySeq, subsetRow, parent) => {
      console.log(value, index, displaySeq, subsetRow, parent);
      let params = {
        siteId: store.getters.getgoodsData.siteId,
        queryCompatibilityType: subsetRow.propertyName,
        erpCompatibleType: data.erpCompatibleType,
      };
      if (displaySeq == 1) {
        data.queryMake = value.queryCompatibilityValue;
        params.queryMake = value.queryCompatibilityValue;
      }
      if (displaySeq == 2) {
        data.queryModel = value.queryCompatibilityValue;
        params.queryMake = data.queryMake;
        params.queryModel = value.queryCompatibilityValue;
      }
      if (displaySeq == 3) {
        data.queryYear = value.queryCompatibilityValue;
        params.queryMake = data.queryMake;
        params.queryModel = data.queryModel;
        params.queryYear = value.queryCompatibilityValue;
      }
      if (displaySeq == 4 || displaySeq == 5) {
        // params.queryYear = value.queryCompatibilityValue
        params.queryMake = data.queryMake;
        params.queryModel = data.queryModel;
        params.queryYear = data.queryYear;
        params.queryTrimOrEngine = value.queryCompatibilityValue;
      }

      console.log(params);

      queryCompatibility(params).then((res) => {
        // 更新下级数据
        console.log(
          value,
          index,
          displaySeq,
          subsetRow,
          parent,
          "点击查询下级"
        );
        if (res.data.compatibilityList.length !== 0) {
          data.compatibilityList[displaySeq].childern =
            res.data.compatibilityList.map((item) => {
              return {
                queryCompatibilityValue: item,
                queryCompatibilityType: res.data.queryCompatibilityType,
                fatherList: res.data.compatibilityList.length,
                childSzie: res.data.compatibilityList.length,
                isWhether: false,
                isChecked:
                  value.isChecked == undefined ? false : value.isChecked, //通过父级控制子集选中
                indeterminate: false,
                parent: res.data.fatherCompatibilityValue, //父级
                parentValue: value.queryCompatibilityType, //父级
              };
            });

          // 查询下级删除孙子级
          let currentIdex = Number(displaySeq) + 1;
          data.compatibilityList.forEach((item) => {
            if (item.displaySeq > currentIdex) {
              item.childern = [];
            }
            if (item.displaySeq < displaySeq) {
              item.childern = item.childern.map((j) => {
                if (j.isWhether) {
                  return {
                    ...j,
                    subset: value.queryCompatibilityType,
                    subsetValue: value.queryCompatibilityValue,
                  };
                } else {
                  return { ...j };
                }
              });
            }
            //设置当前层级父子name/value
            if (item.displaySeq == displaySeq) {
              item.childern = item.childern.map((k) => {
                if (k.isWhether) {
                  return {
                    ...k,
                    subsetValue: res.data.compatibilityList[0],
                    subset: res.data.queryCompatibilityType,
                    parentValue: parent.queryCompatibilityType,
                    parent: parent.queryCompatibilityValue,
                  };
                } else {
                  return { ...k };
                }
              });
            }
          });
        }
        console.log(data.compatibilityList, "建立岑寂关系");
      });
    };
    // 添加选中样式
    const itemTree = (value, index, propertIndex, displaySeq, list) => {
      list.childern.forEach((cunt) => {
        if (cunt.queryCompatibilityValue == value.queryCompatibilityValue) {
          cunt.isWhether = true;
        } else {
          cunt.isWhether = false;
        }
      });
      let subsetRow = {};
      // 获取下级信息
      let num = propertIndex + 2;
      data.compatibilityList.forEach((item) => {
        if (item.displaySeq == num) {
          subsetRow = item;
        }
      });
      // 获取上级信息
      let parent = {};
      let sum = propertIndex > 1 ? propertIndex - 1 : 0;
      data.compatibilityList[sum].childern.forEach((item) => {
        if (item.isWhether) {
          parent = item;
        }
      });
      getList(value, index, displaySeq, subsetRow, parent);
      // console.log(value, index, displaySeq, subsetRow, parent, '0000')
    };

    // 复选框
    const handleChange = (child, index, propertIndex, item, parent) => {
      console.log(child, index, propertIndex, item, parent, "勾选11111");
      let params = {
        siteId: store.getters.getgoodsData.siteId,
        queryCompatibilityType: parent.propertyName,
        erpCompatibleType: data.erpCompatibleType,
      };
      if (item == 1) {
        data.queryMake = child.queryCompatibilityValue;
        params.queryMake = child.queryCompatibilityValue;
      }
      if (item == 2) {
        data.queryModel = child.queryCompatibilityValue;
        params.queryMake = data.queryMake;
        params.queryModel = child.queryCompatibilityValue;
      }
      if (item == 3) {
        data.queryYear = child.queryCompatibilityValue;
        params.queryMake = data.queryMake;
        params.queryModel = data.queryModel;
        params.queryYear = child.queryCompatibilityValue;
      }
      if (item == 4 || item == 5) {
        params.queryMake = data.queryMake;
        params.queryModel = data.queryModel;
        params.queryYear = data.queryYear;
        params.queryTrimOrEngine = child.queryCompatibilityValue;
      }
      let nub = propertIndex + 1;
      // 全选
      if (child.indeterminate && child.isChecked) {
        child.indeterminate = false;
      }
      // 通过点击判断是否当前数据
      if (child.isWhether) {
        //点击的状态
        data.compatibilityList = compatibilityPrototype.clickedIndeterminate(
          nub,
          child,
          data.compatibilityList
        );
      } else {
        //没有点击的状态
        data.compatibilityList = compatibilityPrototype.notClickedIndeterminate(
          nub,
          child,
          data.compatibilityList
        );
      }
      if (child.isChecked) {
        childQueryCompatibility(params).then((res) => {
          // 点击末级生成一条数据
          if (res.data.queryCompatibilityType == null) {
            console.log(data.source, "点击末级生成一条数据");
            const { result, tableColumns } = compatibilityPrototype.tableTree(
              compatibilityPrototype.compatibilityListFun(
                data.compatibilityList
              )
            );
            data.columns = tableColumns;
            // 合并
            data.selectSource = [...result, data.source].flat();
            //表格总数据/分页
            data.currentSource = data.selectSource.flat().map((item, index) => {
              return {
                ...item,
                id: index,
              };
            });
            //当前页10条
            data.source = data.currentSource.slice(0, 10).map((item, index) => {
              return {
                ...item,
                id: index,
              };
            });
            data.pagination.total = data.source.length;

            const { paramsData, paramsColumn } =
              compatibilityPrototype.initParamstable(
                data.currentSource,
                data.compatibilityList
              );
            data.compatibilityInfo.tableData = paramsData;
            data.compatibilityInfo.columns = paramsColumn;
          } else {
            //接口返回生成表格数据
            console.log("接口返回生成表格数据");
            let list = [];
            list.push(res.data);
            const { tableData, tableColumns } =
              compatibilityPrototype.treeTable(list, data.compatibilityList);
            if (tableData.length !== 0) {
              data.columns = tableColumns;
              data.selectSource = tableData;
              //表格总数据/分页
              data.currentSource = [...data.source, ...data.selectSource]
                .flat()
                .map((item, index) => {
                  return {
                    ...item,
                    id: index,
                  };
                });
              //当前页10条
              data.source = data.currentSource
                .slice(0, 10)
                .map((item, index) => {
                  return {
                    ...item,
                    id: index,
                  };
                });
              data.pagination.total = data.currentSource.length;
              const { paramsData, paramsColumn } =
                compatibilityPrototype.initParamstable(
                  data.currentSource,
                  data.compatibilityList
                );
              data.compatibilityInfo.tableData = paramsData;
              data.compatibilityInfo.columns = paramsColumn;
            }
          }
        });
      } else {
        const { dataCurrentSourceArr } = compatibilityPrototype.remoteTable(
          child,
          data.currentSource
        );
        data.selectSource = dataCurrentSourceArr.map((item, index) => {
          return {
            ...item,
            id: index,
          };
        });
        // 表格总数据/分页
        data.currentSource = dataCurrentSourceArr.map((item, index) => {
          return {
            ...item,
            id: index,
          };
        });
        //当前页10条
        data.source = data.currentSource.slice(0, 10).map((item, index) => {
          return {
            ...item,
            id: index,
          };
        });
        data.pagination.total = data.currentSource.length;
        const { paramsData, paramsColumn } =
          compatibilityPrototype.initParamstable(
            data.currentSource,
            data.compatibilityList
          );
        data.compatibilityInfo.tableData = paramsData;
        data.compatibilityInfo.columns = paramsColumn;
      }
    };

    // 搜索
    const searchKeyChange = (val, index) => {
      if (data.istrue) {
        data.compatibilityItem = val.childern;
      }
      let list = val.childern.filter((item) => {
        if (item.queryCompatibilityValue.indexOf(val.searchKeyVal) > -1) {
          return item;
        }
      });
      data.istrue = false;
      data.compatibilityList[index].childern = list;

      if (val.searchKeyVal.length == 0) {
        data.compatibilityList[index].childern = data.compatibilityItem;
        data.istrue = true;
      }
    };

    const submitForm = () => {
      return setForm(proxy, key, data[key], "compatibilityForm");
    };
    const resetForm = () => {
      proxy.$refs.compatibilityForm.resetFields();
    };
    //从eBay导入
    const importCompatibility = () => {
      rest();
      data.compatibilityVisible = "import";
    };
    const offTable = () => {
      data.compatibilityVisible = "";
    };
    //添加兼容信息
    const addCompatibility = () => {
      rest();
      data.compatibilityVisible = "add";
    };
    // 重置
    const rest = () => {
      // 清楚选中状态
      data.compatibilityList.forEach((item) => {
        item.childern = item.childern.map((i) => {
          return {
            ...i,
            isChecked: false,
            indeterminate: false,
          };
        });
      });
      data.source = []; //点击末级生成数据
      data.selectSource = []; //接口生成的数据
      data.currentSource = []; //分页送数据
      data.pagination.total = 0;
      data.compatibilityInfo.tableData = [];
    };
    const okDelete = (val, record) => {
      if (val == "Notes") {
        if (data.rowSelection.selectRows.length !== 0) {
          data.currentSource = data.currentSource.map((item) => {
            let b = data.rowSelection.selectRows.filter((i) => item.id == i);
            return {
              ...item,
              compatibilityNotes:
                b.length == 0
                  ? item.compatibilityNotes
                  : data.compatibilityInfo.Notes,
            };
          });
          if (props.actionType == "edit" || props.actionType == "copy") {
            data.source = data.currentSource.slice(0, 10);
            // 缓存的勾选接口数据
            // data.selectSource = data.selectSource.map((item) => {
            //   return {
            //     ...item,
            //     compatibilityNotes: data.compatibilityInfo.Notes,
            //   }
            // })
          } else {
            data.source = data.currentSource.slice(0, 10).map((item, index) => {
              return {
                ...item,
                id: index,
              };
            });
          }
        } else {
          GjMessage.warning("请先在表格中勾选要操作的内容行");
        }
        data.compatibilityInfo.columns = data.columns;
        data.compatibilityInfo.tableData = data.currentSource;
      } else if (val == "operation") {
        // console.log(val, record, data.columns, '取消')
        const { table, currentTable, selectTable } =
          compatibilityPrototype.operationRemote(
            record,
            data.compatibilityList,
            data.columns,
            data.source,
            data.currentSource,
            data.selectSource
          );
        data.source = table.map((item, index) => {
          return {
            ...item,
            id: index,
          };
        });
        data.currentSource = currentTable.map((item, index) => {
          return {
            ...item,
            id: index,
          };
        });
        data.selectSource = selectTable.map((item, index) => {
          return {
            ...item,
            id: index,
          };
        });
        data.compatibilityInfo.columns = data.columns;
        data.compatibilityInfo.tableData = data.currentSource;
      } else {
        rest();
      }
    };

    // ebay 导入
    const importBtn = () => {
      data.columns = [
        {
          title: "compatibilityNotes",
          dataIndex: "compatibilityNotes",
        },
        {
          title: "operation",
          dataIndex: "operation",
        },
      ];
      let params = {
        itemId: data.compatibilityInfo.itemId,
        shopId: 0,
      };
      getItemCompatibility(params).then((res) => {
        let columns = res.data[0];
        let getColumns = columns.compatibilityNameValues.map((item) => {
          return {
            title: item.compatibilityName,
            dataIndex: item.compatibilityName,
          };
        });
        data.columns = [...getColumns, ...data.columns];

        let source = [];
        for (let i = 0; i < res.data.length; i++) {
          let tempObj = {};
          let obj = res.data[i].compatibilityNameValues.map((item) => {
            return {
              [item.compatibilityName]: item.compatibilityValue,
              compatibilityNotes: res.data[i].compatibilityNotes,
            };
          });
          obj.reduce((prev, cur) => {
            Object.assign(prev, cur);
            return prev;
          }, tempObj);
          source.push(tempObj);
        }
        data.currentSource = source
          .map((item, index) => {
            return {
              ...item,
              id: index,
            };
          })
          .flat();
        data.source = source.slice(0, 10).map((item, index) => {
          return {
            ...item,
            id: index,
          };
        });
        data.pagination.total = data.currentSource.length;
      });
    };
    //紧缺查询
    const searchInfoFun = (val) => {
      if (val) {
        data.searchInfoFunData = [];
        data.currentSource.forEach((item) => {
          Object.keys(item).forEach((key) => {
            // let str = item[key].toString()
            let b = item[key].toString().replace(/\s/g, "");
            if (b == val.toString().replace(/\s/g, "")) {
              data.searchInfoFunData.push(item);
            }
          });
        });
        data.source = data.searchInfoFunData.map((item, index) => {
          return {
            ...item,
            id: item.id ? item.id : index,
          };
        });
        data.pagination.total = data.searchInfoFunData.length;
        console.log(data.searchInfoFunData, data.currentSource, data.source);
      } else {
        data.searchInfoFunData = [];
        console.log(data.searchInfoFunData, data.currentSource, data.source);
        data.source = data.currentSource.slice(0, 20).map((item, index) => {
          return {
            ...item,
            id: item.id ? item.id : index,
          };
        });
        data.pagination.total = data.currentSource.length;
      }
    };
    // 单个输入框
    const recordNotes = (val, index) => {
      data.currentSource[index].compatibilityNotes = val;
      data.compatibilityInfo.tableData = compatibilityPrototype.initParamstable(
        data.currentSource
      );
      const { paramsData, paramsColumn } =
        compatibilityPrototype.initParamstable(
          data.currentSource,
          data.compatibilityList
        );
      data.compatibilityInfo.tableData = paramsData;
      data.compatibilityInfo.columns = paramsColumn;
    };
    // 分页
    const currentChange = (current) => {
      data.pagination.current = current;
      let index = (current - 1) * data.pagination.pageSize;
      let size = data.pagination.pageSize * current;
      data.source = data.currentSource
        .slice(index, size)
        .map((item, index) => {
          return {
            ...item,
            id: item.id ? item.id : index,
          };
        })
        .flat();
    };
    // 页码
    const pageSizeChange = (size) => {
      data.pagination.pageSize = size;
      let index = (data.pagination.current - 1) * data.pagination.pageSize;
      let sizeIndex = size * data.pagination.current;
      data.source = data.currentSource
        .slice(index, sizeIndex)
        .map((item, index) => {
          return {
            ...item,
            id: item.id ? item.id : index,
          };
        });
    };
    watch(
      () => store.getters.getgoodsData.CompatibleEnbale,
      (newVal) => {
        console.log(newVal, "Disabled");
        if (
          store.getters.getgoodsData.CompatibleEnbale.itemCompatibleEnbale ==
          "Disabled"
        ) {
          rest();
        } else {
          getqueryEbayCategoryCompatibleName(props.actionType);
        }
      },
      {
        immediate: true,
      }
    );
    watch(
      () => props.goodsRowData,
      () => {
        if (props.actionType == "edit" || props.actionType == "copy") {
          getqueryEbayCategoryCompatibleName(props.actionType);
        }
        // getEditTableFun()
      },
      {
        immediate: true,
      }
    );

    // 后台分页
    // const getEditTableFun = () => {
    //   let params = {
    //     pageCurrent: 1,
    //     pageSize: 100,
    //     productId: props.goodsRowData.id,
    //   }
    //   getProductCompatibilityList(params).then((res) => {
    //     console.log(res.data, 'pp')
    //   })
    // }
    onBeforeMount(() => {
      // if (props.actionType == 'add') {}
    });
    return {
      searchKey,
      ...toRefs(data),
      submitForm,
      resetForm,
      importCompatibility,
      addCompatibility,
      getqueryEbayCategoryCompatibleName,
      getList,
      compatibilityListInit,
      itemTree,
      searchKeyChange,
      handleChange,
      // rowSelection,
      handleSubmit,
      getTemplateList,
      importBtn,
      okDelete,
      currentChange,
      pageSizeChange,
      recordNotes,
      offTable,
      searchInfoFun,
      rest,
    };
  },
};
</script>

<style lang="scss" scoped>
.basic-info {
  .pt {
    padding: 16px 0px 2px 0px;
    .title {
      font-size: 14px;
    }
  }
  .header_rigth {
    text-align: left;
  }

  .basic-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }

  .cascader_box {
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-radius: 0 0 10px 10px;
    width: 100%;
    margin-left: 0 !important;
    box-sizing: border-box;

    .item_border {
      // border-right: 1px solid #ccc;
      // border-bottom: 1px solid #ccc;
    }
    .header_titel {
      height: 32px;
      font-weight: 400;
      color: #000430;
      font-size: 14px;
      padding: 6px 0px 0px 0px;
      box-sizing: border-box;
    }
    ul {
      height: 258px;
      overflow-y: auto;
      li {
        height: 30px;
        text-indent: 5px;
        box-sizing: border-box;
        padding: 5px 0px;
        display: flex;
        justify-content: flex-start;
        &:hover,
        &:focus {
          color: #1f6eef;
          cursor: pointer;
          // background: #f2f2f5;
          background: #f2f6fe;
        }
        &:active {
          color: #1051c9;
          cursor: pointer;
          // background: #f2f2f5;
          background: #f2f6fe;
        }
      }
      .activeClass {
        // background: #e6ecfe;
        background: #f2f2f5;
        // background: #f2f6fe;
        color: #1051c9;
      }
    }
  }
  .cascader_footer {
    height: 40px;
    width: 100%;
    text-align: right;
    padding-top: 6px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 10px 10px 0 0;
    padding-right: 16px;
  }
}

.arco-col-5 {
  flex: 0 0 20%;
  width: 20%;
}

.tree_text {
  padding-left: 5px;
  width: 80%;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  vertical-align: text-bottom;
  display: inline-block;
}

.import-form {
  width: 400px;
  margin-top: 10px;
  .import-form-btn {
    margin-left: 10px;
  }
}
.table-operation {
  margin-bottom: 10px;
}
.pagintion {
  display: flex;
  justify-content: end;
  height: 28px;
  margin-top: 10px;
}
.text-line {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示

  display: -webkit-box;

  -webkit-line-clamp: 1; // 超出多少行

  -webkit-box-orient: vertical;
}
</style>
