<template>
  <div class="moreAttr-info blockBox" id="moreAttr">
    <!-- <CommonFormHeader :title="'变体属性'" /> -->
    <h2 class="title mb16">变体信息</h2>

    <gj-form
      ref="moreAttrFormRef"
      :model="form"
      class="moreAttr-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
    >
      <div class="bodyContent squre-line">
        <div class="addContent">
          <gj-button class="attrBtn" @click="handelAddAttr">添加属性</gj-button>
          <gj-button class="attrBtn" @click="handelNewCreate"
            >重新生成</gj-button
          >
        </div>

        <div class="listAttr" v-for="(item, index) in list" :key="index">
          <div class="attrListContent">
            <div class="attrNameContent">
              <div class="attrName">属性名</div>
              <gj-input
                size="mini"
                style="width: 90px"
                placeholder="属性名"
                v-model="item.attrName"
                @keyup.enter="setAttrName(index, item.attrName)"
              ></gj-input>
            </div>

            <div class="attrValueContent">
              <div class="attrName">属性值</div>
              <div class="tagContent">
                <!-- 小BUG 输入的时候会失去焦点 v-model的问题 -->
                <gj-tag
                  v-for="(tag, cIndex) in item.attrList"
                  :key="cIndex"
                  closable
                  :disable-transitions="false"
                  @click="setTag(index, cIndex, tag)"
                  @close="handleTagDelete(index, cIndex, tag)"
                  class="tag"
                >
                  <!--修改tag-->
                  <gj-input
                    size="mini"
                    :ref="'saveTagInput' + index + cIndex"
                    v-model="item.attrList[cIndex]"
                    v-if="
                      dbclickTag &&
                      tagLineIndex === index &&
                      tagcIndex === cIndex
                    "
                    @blur="setOverTag(index, cIndex, tag)"
                    class="tagInput"
                  />
                  <span v-else>{{ tag }}</span>
                </gj-tag>

                <gj-input
                  size="mini"
                  style="width: 120px"
                  v-model="item.attrValue"
                  @keyup.enter="handleTagConfirm(index)"
                  placeholder="按回车完成输入"
                ></gj-input>
              </div>
            </div>
          </div>
          <SvgIcon
            class="closeSvgLine"
            svgClass="close"
            :width="16"
            @click="handelDeleteList(index)"
          ></SvgIcon>
        </div>

        <!-- <div class="addContent">
          <gj-button
            class="attrBtn"
            @click="handelAddLine"
            :disabled="
              filterColumnsKeyValueFied.length === 0 || columns.length === 0
            "
            >+ 添加行</gj-button
          >
        </div> -->

        <!--批量录入-->
        <div class="batchSet">
          <div
            v-for="item in otherColumns"
            :key="item.name"
            class="batchSetList"
          >
            <!-- <gj-input
              v-model="item.value"
              :placeholder="item.label"
              style="width: 140px"
              v-if="item.isBatchSet && item.type === 'input'"
            ></gj-input> -->
            <gj-input-number
              v-model="item.value"
              :placeholder="item.label"
              :min="0"
              style="width: 316px"
              v-if="item.isBatchSet && item.type === 'input-number'"
            >
              <template #prefix>$</template>
            </gj-input-number>
            <!-- <div class="appendUnit" v-if="item.isAppend">单位</div> -->
          </div>

          <gj-button class="attrBtn" @click="batchSet">批量录入</gj-button>
          <!-- <gj-button class="attrBtn" @click="batchReset">重置</gj-button> -->
        </div>

        <div class="tableContent">
          <gj-table
            :columns="tableColumns"
            :data-source="tableData"
            :pagination="false"
            :row-selection="rowSelection"
            v-if="tableData.length > 0"
            @selection-change="handleSelectionChange"
          >
            <template #bodyCell="{ column }">
              <template v-if="column.dataIndex === 'associatedSKU'">
                <gj-select placeholder="请选择">
                  <gj-option v-for="item in associatedSKU" :key="item">{{
                    item
                  }}</gj-option>
                </gj-select>
              </template>
              <template v-if="column.dataIndex === 'price'">
                <gj-input-number
                  v-model="column.value"
                  :placeholder="column.text"
                  :precision="column.precision"
                  :controls="false"
                  :min="0"
                  ><template #prefix> $ </template></gj-input-number
                >
              </template>
              <template v-if="column.dataIndex === 'isEnable'">
                <gj-switch v-model="column.isReauired" />
              </template>
            </template>
            <template #columns>
              <!-- <gj-table-column width="40">
                <template #title>
                  <gj-checkbox
                    v-model="selectAll"
                    @change="handelChangeSelectAll"
                  ></gj-checkbox>
                </template>
                <template #cell="{ record, rowIndex }">
                  <gj-checkbox
                    v-model="record.selected"
                    @change="handleChoiseChange(rowIndex)"
                  ></gj-checkbox>
                </template>
              </gj-table-column> -->

              <!-- 关联SKU -->
              <gj-table-column title="关联SKU" width="220">
                <template #cell>
                  <gj-select placeholder="请选择">
                    <gj-option v-for="item in associatedSKU" :key="item">{{
                      item
                    }}</gj-option>
                  </gj-select>
                </template>
              </gj-table-column>

              <!-- 属性列 -->
              <gj-table-column
                v-for="item in columns"
                :key="item"
                :title="item"
                width="160"
              >
                <template #cell="{ record }">
                  {{ record[item] }}
                </template>
              </gj-table-column>

              <!--其他列-->
              <gj-table-column
                v-for="item in otherColumns"
                :key="item.name"
                :label="item.label"
              >
                <template #title>
                  <div class="headerContent" v-if="item.header">
                    <span class="isRequiredIcon" v-if="item.isReauired">*</span>
                    <span>{{ item.label }}</span>
                    <button class="actionTextBtn" @click="createShopeeSKU">
                      {{ item.header }}
                    </button>
                  </div>
                  <div v-else class="headerContent">
                    <span class="isRequiredIcon" v-if="item.isReauired">*</span>
                    <span>{{ item.label }}</span>
                  </div>
                </template>

                <template #cell="{ record }">
                  <gj-input
                    v-if="item.type === 'input'"
                    v-model="record[item.name]"
                    :placeholder="item.text"
                  ></gj-input>
                  <gj-button
                    v-else-if="item.type === 'btn'"
                    class="actionTextBtn"
                    @click="selectSKU"
                    >{{ item.text }}</gj-button
                  >
                  <div
                    v-if="item.type === 'input-number'"
                    class="numberContent"
                  >
                    <gj-input-number
                      v-model="record[item.name]"
                      :placeholder="item.text"
                      :precision="item.precision"
                      :controls="false"
                      :min="0"
                      ><template #prefix>$</template></gj-input-number
                    >
                    <!-- <div class="appendUnit" v-if="item.isAppend">单位</div> -->
                  </div>
                </template>
              </gj-table-column>

              <gj-table-column title="启用" v-if="tableData.length > 0">
                <template #cell="{ record }">
                  <!-- <gj-button
                    type="text"
                    @click="handleDeleteRow(rowIndex)"
                    >删除</gj-button
                  > -->
                  <gj-switch v-model="record.isReauired" />
                </template>
              </gj-table-column>
            </template>
          </gj-table>
        </div>
      </div>
      <!--选择关联SKU的弹框-->
      <CommonActionDalog
        @submit-action="selectSKUAction"
        @close-action="closeSKUAction"
        :actionDialogVisible="actionDialogVisible"
        :title="'请选择SKU'"
        :contentCtx="'数据模拟'"
      >
      </CommonActionDalog>
    </gj-form>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  watch,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import { GjMessage } from "@gj/atom";

// import CommonFormHeader from '@pagesSystem/published/components/CommonFormHeader.vue'
import SvgIcon from "@/components/SvgIcon.vue";
import { calcDescartes } from "@/utils/common";
// import CommonActionDalog from '@/components/CommonActionDalog.vue'
import { columnsAttr } from "./createAttrColunmsConfig";

export default defineComponent({
  components: {
    // CommonFormHeader,
    SvgIcon,
    // CommonActionDalog,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const key = "moreAttr";
    const plantFrom = "shopee";
    const store = useStore();
    // 定义list的数据结构[{ attrName: '属性名', attrList: ['值1', '值2'], attrVisible: false, attrValue: '', isAddLine: false }],
    const data = reactive({
      list: [], // 属性集合
      columns: [], // 自定义属性列
      otherColumns: columnsAttr[plantFrom], // 其他列
      tableData: [], // table 数据
      tableColumns: [
        {
          title: "关联SKU",
          dataIndex: "associatedSKU",
          width: 220,
        },
        ...columnsAttr[plantFrom],
      ],
      rowSelection: {
        type: "checkbox",
        showCheckedAll: true,
        selectRows: [],
      },
      tableDataCopy: [], // 全数据备份
      selectAll: false,
      // 单击编辑单个tag
      tagLineIndex: -1,
      tagcIndex: -1,
      dbclickTag: false,
      // 增量笛卡尔数据
      incrementalDKR: [],
      // 全量dkr数据
      fullDkr: [],
      // 选择SKU的弹框
      actionDialogVisible: false,
      // 记录删除行之后剩余的列的value，用于添加行的DKR计算
      filterColumnsKeyValueFied: [],
      associatedSKU: ["sku11", "sku22", "sku33"],
    });

    // 储存旧的属性值
    let oldValue = null;

    const handleSelectionChange = (rowsId) => {
      console.log(data.rowSelection.selectRows, "****999****", rowsId);
      // data.rowSelection.selectRows = rowsId
    };

    // 构建全量的dkr数据
    const setFullDkr = () => {
      const tempDkr = [];
      data.list.forEach((item) => {
        tempDkr.push(item.attrList);
      });
      data.fullDkr = calcDescartes(tempDkr);
      console.log("全量的DKR数据", data.fullDkr);
    };

    // 构建增量的dkr数据
    const setIncrementalDKR = (index) => {
      const tempDkr = [];
      data.list.forEach((item, key) => {
        if (item.attrList.length > 0) {
          if (index !== key) {
            tempDkr.push(item.attrList);
          } else {
            tempDkr.push([item.attrList[item.attrList.length - 1]]);
          }
        }
      });
      // console.log('生成的dkr参数为', tempDkr)
      data.incrementalDKR = calcDescartes(tempDkr);
    };

    // 创建table行
    const createTableLine = (dkrList) => {
      dkrList.forEach((item) => {
        const line = {};
        // 生成自定义属性列
        data.list.forEach((columnKey, columnIndex) => {
          if (columnKey.attrName && columnKey.attrList.length > 0) {
            // 生成table列
            if (data.columns.indexOf(columnKey.attrName) < 0) {
              // 如果存在列的新增，要清除表格的旧数据
              data.tableData = [];
              data.columns.push(columnKey.attrName);
            }
            // 生成自定义table行
            if (data.list.length <= 1) {
              line[columnKey.attrName] = item;
            } else {
              line[columnKey.attrName] =
                typeof item === "string" ? item : item[columnIndex];
            }
          }
        });
        // 生成其他行
        data.otherColumns.forEach((otherColumn) => {
          if (otherColumn.type === "input-number") {
            line[otherColumn.name] = 0;
          } else {
            line[otherColumn.name] = "";
          }
        });
        // 生成一个勾选项
        line.selected = false;
        // 是否是生成行
        line.isAddLine = false;

        data.tableData.push(line);
      });
    };

    // 构建添加行的数据
    const createAddLineSetData = () => {
      // 方案二 总数据 - 剩余的数据。目前采用方案二
      const filterColumnsKeyValue = [];
      if (data.tableData.length === 0) {
        return;
      } else if (data.columns.length === 1) {
        data.tableData.forEach((item) => {
          for (const key in item) {
            if (key === data.columns[0]) {
              filterColumnsKeyValue.push(item[key]);
            }
          }
        });
      } else {
        data.tableData.forEach((item) => {
          const temp = [];
          for (const key in item) {
            if (data.columns.indexOf(key) >= 0) {
              temp.push(item[key]);
            }
          }
          filterColumnsKeyValue.push(temp);
        });
      }

      data.filterColumnsKeyValueFied = [];
      if (data.columns.length === 1) {
        data.filterColumnsKeyValueFied = data.fullDkr.filter((item) => {
          if (filterColumnsKeyValue.indexOf(item) < 0) {
            return item;
          }
        });
      } else {
        data.filterColumnsKeyValueFied = data.fullDkr.filter((item) => {
          if (filterColumnsKeyValue.toString().indexOf(item.toString()) < 0) {
            return item;
          }
        });
      }
    };

    // 构建增量的table的数据结构
    const createTbaleData = () => {
      createTableLine(data.incrementalDKR);
    };

    // 输入属性名,或者修改属性名
    const setAttrName = (index, name) => {
      // 不允许为空的属性名，存在属性值
      if (
        !data.list[index].attrName ||
        data.list[index].attrName?.toString().trim() === ""
      ) {
        GjMessage.error("属性名不能为空");
        return;
      } else {
        // 属性名未做修改
        if (
          data.columns[index]?.toString().trim() === name?.toString().trim()
        ) {
          return;
        }
        // 如果不存在属性值
        if (data.list[index].attrList.length <= 0) {
          return;
        }
        // 修改table属性名
        data.columns[index] = name;
        if (data.tableData.length > 0) {
          // 不要去走生成table的dkr算法 进行重新生成数据
          // 获取任意一行table的数据,然后判断是哪一列需要修改
          const attrValueList = data.list[index].attrList;
          const max = data.tableData.length;
          const random = parseInt(Math.random() * max);
          const randomTableData = data.tableData[random];
          let updateKey = null;
          for (const key in randomTableData) {
            if (attrValueList.indexOf(randomTableData[key]) >= 0) {
              updateKey = key;
            }
          }
          data.tableData.map((item) => {
            for (const key in item) {
              if (key === updateKey) {
                item[name] = item[key];
              }
            }
            delete item[updateKey];
          });
        }
      }
      createAddLineSetData();
    };

    // 添加属性
    const handelAddAttr = () => {
      // 如果存在空的line,则不允许添加属性列
      let isAddLine = true;
      data.list.forEach((item) => {
        if (!item.attrName || item.attrList.length <= 0) {
          isAddLine = false;
        }
      });
      if (!isAddLine) {
        GjMessage.error("请将属性填写完整");
        return;
      }
      data.list.push({
        attrName: "",
        attrList: [],
        attrVisible: false,
        attrValue: "",
      });
    };

    // 删除单个tag
    const handleTagDelete = (index, cIndex, tag) => {
      // 是否进行到列删除,如果自定义属性只有一个则无需进行这个判断
      let isDeleteColumns = null;
      // 要删除的key
      const deletekey = data.list[index].attrName;
      data.list[index]?.attrList?.splice(cIndex, 1);

      // 判断是否进行列删除
      if (data.list[index]?.attrList?.length === 0) {
        if (data.list.length > 2) {
          isDeleteColumns = true;
        } else if (data.list.length === 2) {
          // 如果只剩2列,其中一列为空数据
          if (data.list[1].attrList.length === 0 && !data.list[1].attrName) {
            isDeleteColumns = false;
          } else {
            isDeleteColumns = true;
          }
        }
        data.columns.splice(index, 1);
        data.list.splice(index, 1);
      }
      if (!isDeleteColumns) {
        for (let i = 0; i < data.tableData.length; i++) {
          if (data.tableData[i][deletekey] === tag) {
            data.tableData.splice(i, 1);
            i--;
          }
        }
      } else {
        // 删除列
        data.tableData.map((item) => {
          if (item[deletekey] === tag) {
            delete item[deletekey];
          }
        });
      }
      isDeleteColumns = null;

      // 重新构建全量DKR
      setFullDkr();
      createAddLineSetData();
    };

    // 删除tag行
    const handelDeleteList = (index) => {
      if (data.list[index].attrList.length <= 0) {
        data.list.splice(index, 1);
        return;
      } else {
        // 获取要删除的数据源
        const lineList = data.list[index].attrList;
        if (lineList.length > 1) {
          lineList.forEach((item, cIndex) => {
            handleTagDelete(index, cIndex, item);
          });
          // 利用阻塞做删除tag行
          handleTagDelete(index, 0, lineList[0]);
        } else {
          handleTagDelete(index, 0, lineList[0]);
        }

        createAddLineSetData();
      }
    };

    // 生成单个tag
    const handleTagConfirm = (index) => {
      if (
        !data.list[index].attrName ||
        data.list[index].attrName?.toString().trim() === ""
      ) {
        GjMessage.error("属性名不能为空");
        return;
      }
      const inputValue = data.list[index].attrValue;
      if (
        inputValue &&
        inputValue?.toString()?.trim() &&
        data.list[index].attrList.indexOf(inputValue) < 0
      ) {
        data.list[index].attrList.push(inputValue.trim());
        data.list[index].attrVisible = false;
        data.list[index].attrValue = "";
        setIncrementalDKR(index);
        setFullDkr();
        createTbaleData();
      } else {
        GjMessage.error("属性值重复");
      }
    };

    // 删除table数据行
    const handleDeleteRow = (index) => {
      data.tableData.splice(index, 1);
      createAddLineSetData();
    };

    // 单击编辑tag
    const setTag = (index, cIndex, tag) => {
      data.dbclickTag = true;
      data.tagLineIndex = index;
      data.tagcIndex = cIndex;
      proxy.$nextTick(() => {
        console.log(proxy.$refs["saveTagInput" + index + cIndex][0], "88");
        // proxy.$refs['saveTagInput' + index + cIndex][0].input.focus()
      });
      oldValue = tag;
    };

    // 修改tag，这对生成table比较特殊
    const setOverTag = (index, cIndex) => {
      const newValue = data.list[index].attrList[cIndex];
      if (!newValue || !newValue?.toString().trim()) {
        GjMessage.error("属性值不能为空");
        return;
      }
      if (oldValue === newValue) {
        oldValue = null;
        return;
      }
      const key = data.list[index].attrName;
      data.tableData.map((item) => {
        if (item[key] === oldValue) {
          item[key] = newValue;
        }
      });
      data.dbclickTag = false;
      data.tagLineIndex = -1;
      data.tagcIndex = -1;
    };

    // 重新生成
    const handelNewCreate = () => {
      data.columns = [];
      data.tableData = [];
      data.filterColumnsKeyValueFied = [];
      createTableLine(data.fullDkr);
    };

    // 添加行
    const handelAddLine = () => {
      // 如果存在已经添加的行，则不允许继续添加

      if (
        data.tableData.length >= 1 &&
        data.tableData[data.tableData.length - 1].isAddLine
      ) {
        GjMessage.error("已存在添加行，请将数据补充完整后再继续添加");
        return;
      }

      // 全量DKR - table剩余行的value生成的dkr = 需要添加的DKR数据 data.filterColumnsKeyValueFied
      // 生成行数据
      const line = Object.assign({}, data.tableData[0]);
      data.columns.forEach((item, index) => {
        line[item] = [];
        line[item + "Value"] = "";
        line["isAddLine"] = true;
        line["selected"] = false;
        data.filterColumnsKeyValueFied.filter((value) => {
          if (line[item].indexOf(value[index]) < 0) {
            line[item].push({
              value: value[index],
              label: value[index],
            });
          }
        });
      });
      data.tableData.push(line);
    };

    // change
    const filterChange = (index) => {
      console.log(data.tableData, index);
      const setTableLine = data.tableData[index];
      let isSend = true;
      for (const key in setTableLine) {
        if (
          !data.tableData[index][key + "Value"] &&
          data.tableData[index][key + "Value"] !== "undefined" &&
          data.tableData[index][key + "Value"] !== undefined
        ) {
          isSend = false;
        }
      }
      if (isSend) {
        data.columns.forEach((item) => {
          setTableLine[item] = setTableLine[item + "Value"];
        });
        setTableLine["isAddLine"] = false;
        createAddLineSetData();
      }
    };

    // 单选
    const handleChoiseChange = (index) => {
      console.log("单选", index);
      let isSelectAll = true;
      data.tableData.map((item) => {
        if (!item.selected) {
          isSelectAll = false;
        }
      });
      data.selectAll = isSelectAll;
    };

    // 全选
    const handelChangeSelectAll = () => {
      data.tableData.map((item) => {
        if (data.selectAll) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      });
    };

    // 选择SKU
    const selectSKU = (row) => {
      console.log(row, "888");
      data.actionDialogVisible = true;
    };

    const selectSKUAction = () => {
      alert("选择SKU");
    };

    const closeSKUAction = () => {
      console.log("关闭SKU选择");
      data.actionDialogVisible = false;
    };

    // 自动生成店铺的SKU
    const createShopeeSKU = () => {
      alert("自动生成店铺SKU");
    };

    // 批量录入
    const batchSet = () => {
      if (data.rowSelection?.selectRows.length <= 0) {
        return GjMessage.error("请选择要批量录入的数据");
      }

      if (data.rowSelection?.selectRows.length <= 0) {
        return;
      }

      data.rowSelection.selectRows.forEach((rowsId) => {
        const row = data.tableData2.find((item) => item.rowskey === rowsId);
        Object.keys(data.batchMap).forEach((key) => {
          if (data.batchMap[key] || data.batchMap[key] === 0) {
            row[key] = data.batchMap[key];
          }
        });
      });

      /* const temp = {}
      data.otherColumns.forEach((item) => {
        if (item.value || item.value === 0) {
          temp[item.name] = item.value
        }
      })
      if (temp.toString() !== '{}') {
        data.tableData.map((item) => {
          if (item.selected) {
            for (const key in temp) {
              item[key] = temp[key]
            }
          }
        })
      } */
    };

    // 重置录入信息
    const batchReset = () => {
      data.otherColumns.map((item) => {
        if (item.type === "input-number") {
          item.value = 0;
        } else {
          item.value = null;
        }
      });
    };

    // 录入参数
    const setParams = () => {
      const params = {
        ...store.getters.getParams,
        moreAttrInfo: data.tableData,
      };
      store.dispatch(proxy.$mt.PARAMS_QUERY, params);
    };

    // 提交表单
    const submitForm = () => {
      // 表单验证
      let isSubmit = true;
      data.tableData.forEach((item) => {
        columnsAttr[plantFrom].forEach((key) => {
          if (!item[key.name]) {
            isSubmit = false;
          }
        });
      });
      setParams();
      if (!isSubmit) {
        GjMessage.error("请将多属性信息填写完整");
      }
      // return isSubmit
      isSubmit;
      return setForm2(proxy, key, data[key], "productPropertyFormRef");
    };
    // 清空,重置表单
    const resetForm = () => {
      data.tableData.map((item) => {
        item.selected = false;
        data.selectAll = false;
        columnsAttr[plantFrom].forEach((key) => {
          if (key.type === "input-number") {
            item[key.name] = 0;
          } else {
            item[key.name] = null;
          }
        });
      });
      setParams();
    };

    const validate = () => {
      return proxy.$refs.moreAttrFormRef.validate();
    };

    const resetFields = () => {
      proxy.$refs.moreAttrFormRef.resetFields();
    };

    watch(
      () => data[key],
      () => {
        const params = {
          [key]: data[key],
        };
        store.dispatch(M_T.PARAMS_QUERY, params);
      },
      { deep: true }
    );

    return {
      ...toRefs(data),
      handelAddAttr,
      handleTagDelete,
      handleSelectionChange,
      createTbaleData,
      handleTagConfirm,
      handelChangeSelectAll,
      handleChoiseChange,
      handleDeleteRow,
      handelDeleteList,
      setTag,
      setOverTag,
      selectSKU,
      selectSKUAction,
      closeSKUAction,
      validate,
      resetFields,
      submitForm,
      resetForm,
      batchSet,
      setAttrName,
      batchReset,
      handelNewCreate,
      handelAddLine,
      filterChange,
      createShopeeSKU,
    };
  },
});
</script>
<style scoped lang="scss">
.moreAttr-info {
  .squre-line {
    padding: 12px;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #e6e6ed;
    border-radius: 8px;
  }
  .mb16 {
    margin-bottom: 16px;
  }
  .title {
    padding: 16px 0 2px 0px;
    font-size: 14px;
  }
  .moreAttr-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
.bodyContent {
  // border: solid 1px #e6e6ed;
  min-height: 200px;
  padding: 0px 24px;
  .addContent {
    height: 72px;
    display: flex;
    align-items: center;
  }
}
.closeSvgLine {
  cursor: pointer;
  margin-left: 10px;
}
.closeSvgLine:hover {
  background-color: rgba(26, 44, 71, 0.1);
  border-radius: 50%;
}
.listAttr {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  .attrListContent {
    border-radius: 4px;
    border: solid 1px #e6e6ed;
    background-color: #fafafa;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    max-width: 80%;
    .attrName {
      color: #666883;
      font-size: 12px;
      margin-right: 10px;
    }
    .attrValueContent,
    .attrNameContent {
      display: flex;
      align-items: center;
    }
    .attrNameContent {
      margin-right: 20px;
      min-width: 160px;
    }
  }
}
.tagContent {
  display: flex;
  flex-wrap: wrap;
  .tag {
    margin-right: 10px;
    cursor: text;
    padding: 0px 10px 0px 10px;
  }
}
.tagInput {
  width: 80px;
}
.headerTitle {
  display: inline-block;
}

.headerContent {
  display: flex;
  align-items: center;
  .isRequiredIcon {
    transform: translateY(2px);
    margin-right: 4px;
    color: red;
  }
}

.numberContent {
  display: flex;
  align-items: center;
  height: 32px;
}
.appendUnit {
  min-width: 50px;
  background-color: #e6e6ed;
  height: 100%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.batchSet {
  display: flex;
  margin-bottom: 10px;
  height: 32px;
  .batchSetList {
    display: flex;
  }
  .batchSetList:nth-child(n + 2) {
    margin-right: 10px;
  }
}

.attrBtn {
  color: #0045f0;
}
</style>
