<template>
  <div class="basic-info" id="variantInfo-ebay">
    <h2 class="title">变体信息</h2>
    <gj-form
      ref="variantForm"
      :model="variantInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="submitForm"
    >
      <gj-row :gutter="24">
        <gj-col :span="24">
          <gj-table
            :data-source="variantInfo.templateData"
            :columns="fastColumns"
            bordered
            row-key="id"
            ref="noteTable"
            :pagination="false"
          >
            <template #bodyCell="{ record, index, column }">
              <template v-if="column.dataIndex === 'attrName'">
                <div>
                  <span class="attr-header-name" v-show="record.attrName">
                    {{ record.attrName }}
                  </span>
                  <gj-button
                    class="mr"
                    type="text"
                    v-if="!record.attrName && !record.isAttrName"
                    @click="addAttrName(record, index)"
                    >添加属性名
                  </gj-button>

                  <gj-space class="mr" v-show="record.isAttrName">
                    <gj-select
                      v-model="record.attrName"
                      placeholder="按回车完成输入"
                      allow-clear
                      allow-create
                      :style="{ width: '130px' }"
                      @change="selectNameChangs(record, index, record.attrName)"
                    >
                      <gj-option
                        v-for="item in personListOpt"
                        :key="item.userId"
                        :value="item.userId"
                        >{{ item.userName }}</gj-option
                      >
                    </gj-select>
                  </gj-space>
                </div>
              </template>
              <template v-if="column.dataIndex === 'attrValue'">
                <div>
                  <gj-space
                    v-for="(item, i) in record.list"
                    :key="item"
                    class="mr"
                  >
                    <div class="attr-val-box">
                      <span> {{ item }}</span>
                      <SvgIcon
                        svgClass="closeIcon"
                        :width="24"
                        @click="closeAttrVal(i, index)"
                      ></SvgIcon>
                    </div>
                  </gj-space>
                  <gj-button
                    class="mr"
                    type="text"
                    v-if="!record.isAttrValue"
                    @click="addAttrVal(record, index)"
                    >添加属性值
                  </gj-button>

                  <gj-space v-else class="mr">
                    <gj-select
                      v-model="record.selectValue"
                      placeholder="按回车完成输入"
                      allow-create
                      allow-clear
                      :style="{ width: '127px' }"
                      @change="
                        selectValChangs(record, index, record.selectValue)
                      "
                    >
                      <gj-option
                        v-for="item in personListOpt"
                        :key="item.userId"
                        :value="item.userId"
                        >{{ item.userName }}</gj-option
                      >
                    </gj-select>
                  </gj-space>
                </div>
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <div>
                  <gj-space>
                    <SvgIcon
                      svgClass="addTitle"
                      :width="24"
                      v-show="(index) => 0"
                      @click="addTitile"
                    ></SvgIcon>
                    <SvgIcon
                      svgClass="subtract"
                      v-show="index !== 0"
                      :width="24"
                      @click="removeTitile(index)"
                    ></SvgIcon>
                  </gj-space>
                </div>
              </template>
            </template>
          </gj-table>
        </gj-col>
      </gj-row>
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            field=""
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="建议售价"
          >
            <gj-input
              v-model="variantInfo.recommendPrice"
              :max-length="255"
              placeholder="请输入"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="upc"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="UPC"
          >
            <gj-select
              v-model="variantInfo.upc"
              placeholder="请选择"
              allow-clear
            >
              <gj-option
                v-for="item in ListOpt"
                :key="item.userId"
                :value="item.userId"
                >{{ item.userName }}</gj-option
              >
            </gj-select>
            <gj-button type="text" @click="setEntry">批量录入</gj-button>
          </gj-form-item>
        </gj-col>
      </gj-row>
      <gj-row :gutter="24">
        <gj-col :span="24">
          <gj-table
            :data-source="variantInfo.tableData"
            row-key="id"
            :columns="columns"
            ref="noteTable"
            :pagination="false"
            :row-selection="rowSelection"
          >
            <template #bodyCell="{ index, record, column, recordIndexs }">
              <template v-if="column.type === 'add'">
                <span v-if="!record?.isAttr">{{
                  record[column.dataIndex]
                }}</span>

                <div v-else>
                  <gj-space class="mr">
                    <gj-select
                      placeholder="按回车完成输入"
                      allow-create
                      allow-clear
                      :v-model="record[column.dataIndex]"
                      :style="{ width: '127px' }"
                      @popup-visible-change="
                        tableSelectPopupFun(column.dataIndex)
                      "
                      @change="saveTableSelectPopupFun"
                    >
                      <gj-option
                        v-for="(item, index) in selectOpt"
                        :key="index"
                        :value="item.attrValue"
                        >{{ item.attrValue }}</gj-option
                      >
                    </gj-select>
                  </gj-space>
                </div>
              </template>
              <template v-if="column.type === 'input'">
                <div v-if="!record?.isAttr">
                  <gj-input-number
                    :style="{ maxWidth: '214px' }"
                    v-model="
                      variantInfo.tableData[recordIndexs[0]].recommendPrice
                    "
                    placeholder="请输入"
                    allow-clear
                  />
                </div>
                <span v-else>
                  <gj-space>
                    <gj-button shape="round" @click="closeTableBtn"
                      >取消</gj-button
                    >
                    <gj-button
                      shape="round"
                      type="outline"
                      @click="saveTableBtn(record, recordIndexs)"
                      >保存</gj-button
                    >
                  </gj-space>
                </span>
              </template>
              <template v-if="column.dataIndex === 'upc'">
                <div v-if="!record?.isAttr">
                  <gj-select
                    placeholder="选择"
                    v-model="variantInfo.tableData[recordIndexs[0]].upc"
                    allow-clear
                    :style="{ maxWidth: '214px' }"
                  >
                    <gj-option
                      v-for="item in tableOptUpc"
                      :key="item.userId"
                      :value="item.userId"
                      >{{ item.userName }}</gj-option
                    >
                  </gj-select>
                </div>
                <span v-else></span>
              </template>
              <template v-if="column.dataIndex === 'sku'">
                <div v-if="!record?.isAttr" class="validate-lable">
                  <gj-form-item
                    :hide-label="true"
                    field="sku"
                    :rules="sku"
                    :validate-trigger="['change', 'input', 'blur']"
                    class="validate-lable-select"
                  >
                    <gj-select
                      placeholder=""
                      allow-clear
                      v-model="variantInfo.tableData[recordIndexs[0]].sku"
                      :style="{ maxWidth: '214px' }"
                      :trigger-props="{ autoFitPopupMinWidth: true }"
                      @popup-visible-change="selectPopupFun"
                    >
                      <gj-option
                        v-for="item in productOpt"
                        :key="item.sku"
                        :value="item.sku"
                        :label="item.skuName"
                        :disabled="item.disabled"
                        >{{ item.skuName }}</gj-option
                      >
                    </gj-select>
                  </gj-form-item>
                </div>
                <span v-else></span>
              </template>

              <template v-if="column.dataIndex === 'optional'">
                <div v-if="!record?.isAttr">
                  <gj-space>
                    <SvgIcon
                      v-if="isTableOk"
                      svgClass="addTitle"
                      :width="24"
                      @click="addTitileTable(index)"
                    ></SvgIcon>
                    <SvgIcon
                      svgClass="subtract"
                      :width="24"
                      @click="removeTitileTable(index)"
                    ></SvgIcon>
                  </gj-space>
                </div>
                <span v-else></span>
              </template>
            </template>
          </gj-table>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, watch } from "vue";
import { setForm } from "@/utils/fnBusiness";
import { useStore } from "vuex";
import { calcDescartes } from "@/utils/common";
import SvgIcon from "@/components/SvgIcon";
import { getSkuListBySpu } from "@/api/public";
import { GjMessage } from "@gj/atom";

export default {
  emits: ["setShowItemFun", "attrFun"],
  components: {
    SvgIcon,
  },
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
    const key = "variantInfo";
    const data = reactive({
      fastColumns: [
        {
          title: "属性名",
          dataIndex: "attrName",
        },
        {
          title: "属性值",
          dataIndex: "attrValue",
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: 150,
        },
      ],
      variantInfo: {
        recommendPrice: "",
        upc: "",
        templateData: [
          {
            attrName: "",
            attrValue: "",
            id: 0,
            isAttrValue: false,
            list: [],
            selectValue: "",
            isAttrName: false,
          },
        ], // table 变体属性数据
        tableData: [], // table 变体数据
      },
      rowSelection: {
        selectRows: [],
        onChange: (selectedRowKeys) => {
          data.rowSelection.selectRows = selectedRowKeys;
        },
      },
      personListOpt: [
        {
          userId: store.getters.getgoodsData.picture.value,
          userName: store.getters.getgoodsData.picture.value,
        },
      ],
      productOpt: [], //关联spu
      tableOptUpc: [{ userId: "Dose not apply", userName: " Dose not apply" }],
      ListOpt: [{ userId: "Dose not apply", userName: " Dose not apply" }],
      rules: {
        chargePersonName: [{ required: true, message: "负责人必填" }],
      },
      sku: [
        {
          required: true,
          message: "请选择sku",
          validator: (value, cb) => {
            return new Promise((resolve) => {
              console.log(data.variantInfo.tableData);
              setTimeout(() => {
                if (
                  !data.variantInfo.tableData.find((item) => item.sku.trim())
                ) {
                  cb("请选择sku");
                }

                resolve();
              }, 10);
            });
          },
        },
      ],
      otherColumns: [
        {
          title: "建议售价",
          dataIndex: "recommendPrice",
          type: "input",
        },
        {
          title: "upc",
          dataIndex: "upc",
          type: "select",
        },
        {
          title: "关联SKU",
          dataIndex: "sku",
          type: "select",
        },
        {
          title: "操作",
          dataIndex: "optional",
          type: "optional",
          width: 150,
        },
      ],
      columns: [], // 自定义属性列
      // 选择SKU的弹框
      actionDialogVisible: false,
      // 记录删除行之后剩余的列的value，用于添加行的DKR计算
      filterColumnsKeyValueFied: [],
      initDataList: [], //表格中的新增
      isTableOk: false,
      selectOpt: [],
      nodeCols: [],
      selectFlagName: "",
    });
    const submitForm = () => {
      return setForm(proxy, key, data[key], "variantForm");
    };
    const resetForm = () => {
      proxy.$refs.variantForm.resetFields();
    };
    const addTitile = () => {
      data.variantInfo.templateData.push({
        attrName: "",
        attrValue: "",
        isAttrValue: false,
        selectValue: "",
        list: [],
        id: data.variantInfo.templateData.length,
      });
      data.variantInfo.templateData = [...data.variantInfo.templateData];
    };
    const removeTitile = (index) => {
      data.variantInfo.templateData.splice(index, 1);
      data.variantInfo.templateData = [...data.variantInfo.templateData];
    };

    const removeTitileTable = (index) => {
      // 释放删除的关联sku
      data.productOpt = data.productOpt.map((i) => {
        return {
          ...i,
          disabled:
            data.variantInfo.tableData[index]?.sku == i.spuName
              ? false
              : i.disabled,
        };
      });
      // 删除的数据
      data.isTableOk = true;
      data.initDataList.push(data.variantInfo.tableData[index]);
      data.variantInfo.tableData.splice(index, 1);
      data.variantInfo.tableData = data.variantInfo.tableData.map(
        (item, index) => {
          return {
            ...item,
            id: index,
          };
        }
      );
    };
    //表格取消
    const closeTableBtn = () => {
      data.variantInfo.tableData.splice(0, 1);
      data.variantInfo.tableData = data.variantInfo.tableData.map(
        (item, index) => {
          return {
            ...item,
            id: index,
          };
        }
      );
      if (data.initDataList.length == 0) {
        data.isTableOk = false;
      }
    };
    // 表格确定
    const saveTableBtn = (row) => {
      let isBur = false;
      let sum = 0;
      data.nodeCols.forEach((ele) => {
        data.initDataList.forEach((item, index) => {
          if (item[ele] == row[ele]) {
            isBur = true;
            sum = index;
          } else {
            isBur = false;
          }
        });
      });
      if (isBur) {
        console.log("对比", sum);
        data.variantInfo.tableData.push(data.initDataList[sum]);
        data.variantInfo.tableData = data.variantInfo.tableData.map(
          (item, index) => {
            return {
              ...item,
              id: index,
            };
          }
        );
        data.initDataList.splice(sum, 1);
      } else {
        return GjMessage.warning("只能添加删除的数据，请重新选择");
      }
    };

    const addTitileTable = () => {
      if (!data.variantInfo.tableData[0].isAttr) {
        let newObj = {
          // obj: data.variantInfo.tableData[0],
          isAttr: true,
        };
        let obj = data.variantInfo.tableData[0];
        Object.keys(obj).forEach((key) => {
          newObj[key] = "";
        });
        data.variantInfo.tableData.unshift(newObj);
        data.variantInfo.tableData = data.variantInfo.tableData.map(
          (item, index) => {
            return {
              ...item,
              id: index,
            };
          }
        );
      }
    };
    //添加属性值
    const addAttrVal = (row, index) => {
      if (row.attrName.length == 0) {
        return GjMessage.warning("请先在表格中操作属性名。");
      } else {
        data.variantInfo.templateData = data.variantInfo.templateData.map(
          (item, flag) => {
            return {
              ...item,
              isAttrValue: flag == index ? true : false,
              selectValue: "",
            };
          }
        );
      }
    };
    //添加属性名
    const addAttrName = (record, index) => {
      data.variantInfo.templateData = data.variantInfo.templateData.map(
        (item, flag) => {
          return {
            ...item,
            isAttrName: flag == index ? true : false,
          };
        }
      );
    };
    const selectNameChangs = (row, index, val) => {
      data.variantInfo.templateData = data.variantInfo.templateData.map(
        (item, flag) => {
          return {
            ...item,
            isAttrName: false,
            attrName: flag == index ? val : item.attrName,
          };
        }
      );
    };

    const selectValChangs = (row, index, val) => {
      let iSbulen = true;
      if (row.list.length !== 0) {
        row.list.forEach((item) => {
          if (item.includes(val)) {
            iSbulen = false;
          }
        });
      }
      if (iSbulen) {
        data.variantInfo.templateData[index].list.push(val);
        data.variantInfo.templateData[index].isAttrValue = false;
        if (
          data.variantInfo.templateData.length > 0 &&
          !data.variantInfo.templateData[0].attrValue
        ) {
          createTbaleData();
        }
      } else {
        console.log("重复");
        return GjMessage.warning("已存在，请重新输入");
      }
    };

    // 批量录入
    const setEntry = () => {
      console.log(data.rowSelection.selectRows, "pps");

      if (data.rowSelection.selectRows.length == 0) {
        GjMessage.warning("请先在表格中勾选要操作的内容行");
      } else {
        let b = data.variantInfo.tableData.map((item, index) => {
          return {
            ...item,
            recommendPrice:
              item.id == data.rowSelection.selectRows[index]
                ? data.variantInfo.recommendPrice
                : item.recommendPrice,
            upc:
              item.id == data.rowSelection.selectRows[index]
                ? data.variantInfo.upc
                : item.upc,
          };
        });
        data.variantInfo.tableData = b.map((item) => {
          return {
            ...item,
            recommendPrice:
              Number(item.recommendPrice) == 0
                ? null
                : Number(item.recommendPrice),
          };
        });
      }

      // let b = data.variantInfo.tableData.map((item) => {
      //   return {
      //     ...item,
      //     recommendPrice: data.variantInfo.recommendPrice
      //       ? data.variantInfo.recommendPrice
      //       : item.recommendPrice,
      //     upc: data.variantInfo.upc,
      //   }
      // })
      // data.variantInfo.tableData = [...b]
    };
    // 构建table的数据结构
    const createTbaleData = () => {
      data.columns = [];
      // let oldTable = data.variantInfo.tableData
      data.variantInfo.tableData = [];
      let newTable = [];
      const dkr = [];
      // 生成列
      data.variantInfo.templateData.forEach((item) => {
        if (item.attrName && item.list.length > 0) {
          // 生成属性的table列
          data.columns.splice(0, 0, item.attrName);
          // 生成dkr数据源
          dkr.push(item.list);
        }
      });
      // 生成值
      if (data.columns.length > 0) {
        const tempData = calcDescartes(dkr.reverse());
        tempData.forEach((item, index) => {
          const line = {};
          data.columns.forEach((key, kIndex) => {
            if (data.columns.length <= 1) {
              // 如果只有一个属性返回一个一维数组
              line[key] = item;
            } else {
              line[key] = item[kIndex];
            }
          });
          // 生成其他值
          data.otherColumns.forEach((item) => {
            line[item.dataIndex] = "";
            if (item.type === "input") {
              line[item.dataIndex] = null;
            } else {
              line[item.dataIndex] = "";
            }
          });
          // 生成table数据行
          let obj = {
            ...line,
            id: index,
            skuAttrs: data.columns.map((flag) => {
              return {
                attrCustom: false,
                attrName: flag,
                attrValue: line[flag],
              };
            }),
          };
          data.variantInfo.tableData.push(obj);
          newTable.push(obj);
        });
        // // 待定
        // if (newTable.length == oldTable.length) {
        //   data.variantInfo.tableData = newTable;
        // } else {
        //   let sum = oldTable.length;
        //   newTable.splice(0, sum);
        //   let arr = [...newTable, ...oldTable];
        //   data.variantInfo.tableData = arr;
        // }
      }
      let cols = data.columns.map((item) => {
        return {
          title: item,
          dataIndex: item,
          type: "add", //处理表格第一行添加
          fixed: "left",
        };
      });
      data.columns = [...cols, ...data.otherColumns].flat();
      store.dispatch(
        proxy.$mt.GOODS_INFO_EBAY_ATTRIBUTELIST,
        data.variantInfo.templateData
      );
      // 动态标识
      data.nodeCols = cols.map((item) => {
        return item.title;
      });
    };
    const saveTableSelectPopupFun = (val) => {
      data.variantInfo.tableData = data.variantInfo.tableData.map(
        (item, index) => {
          if (index == 0) {
            return {
              ...item,
              [data.selectFlagName]: val,
            };
          } else {
            return item;
          }
        }
      );
    };
    // 生成select
    const tableSelectPopupFun = (val) => {
      data.selectFlagName = val;
      data.selectOpt = [];
      data.variantInfo.templateData.forEach((item) => {
        if (val == item.attrName) {
          data.selectOpt = item.list.map((i) => {
            return {
              attrName: i,
              attrValue: i,
            };
          });
        }
      });

      //全部数据
      // data.selectOpt = []
      // data.nodeCols.forEach((i) => {
      //   data.variantInfo.templateData.forEach((item) => {
      //     if (i == item.attrName) {
      //       let option = item.list.map((i) => {
      //         return {
      //           attrName: i,
      //           attrValue: i,
      //         }
      //       })
      //       data.selectOpt.push(option)
      //     }
      //   })
      // })
      // data.selectOpt = data.selectOpt.flat()
      // console.log(data.selectOpt, '全部数据')
    };
    // 关联spu
    const selectPopupFun = (val) => {
      data.productOpt = store.getters.getgoodsData.relationSpuList.map(
        (item) => {
          return {
            ...item,
            disabled: false,
          };
        }
      );
      if (val) {
        //禁用表格中已选中
        data.variantInfo.tableData.forEach((item) => {
          data.productOpt = data.productOpt.map((i) => {
            return {
              ...i,
              disabled: item.sku == i.sku ? true : i.disabled,
            };
          });
        });
      }
    };
    const spuListFn = (val) => {
      let params = {
        spu: val, // '81-BU6438J-BK',
      };
      getSkuListBySpu(params).then((res) => {
        const { code } = res;
        if (code == 200 || code == 0) {
          data.productOpt = res.data || [];
        }
      });
    };
    watch(
      () => props.goodsRowData,
      () => {
        if (props.actionType == "edit" || props.actionType == "copy") {
          data.variantInfo = {
            ...props.goodsRowData,
            tableData: [],
            templateData: [
              {
                attrName: "",
                attrValue: "",
                id: 0,
                isAttrValue: false,
                list: [],
                selectValue: "",
                isAttrName: false,
              },
            ],
            upc: props.goodsRowData.upcCode,
            // tableData: props.goodsRowData.variants,
            // templateData: props.goodsRowData.variantAttrs,
            recommendPrice: String(props.goodsRowData.recommendPrice),
          };
          const { variants, variantAttrs } = props.goodsRowData;
          if (store.getters.getgoodsData.picture.type == "spu") {
            spuListFn(store.getters.getgoodsData.picture.value);
          }
          if (variants.length !== 0) {
            let b = variants[0].skuAttrs;
            let col = b.map((item) => {
              return {
                title: item.attrName,
                dataIndex: item.attrName,
                type: "add", //处理表格第一行添加
                fixed: "left",
              };
            });
            data.columns = [...col, ...data.otherColumns];
            data.variantInfo.recommendPrice = "";
            data.variantInfo.upc = "";
            data.variantInfo.tableData = variants
              .map((item, index) => {
                let obj = item.skuAttrs;
                let cunt = [];
                Object.keys(obj).forEach((key) => {
                  let str = {
                    [obj[key].attrName]: obj[key].attrValue,
                  };
                  cunt.push(str);
                });

                let tempObj = {};
                cunt.reduce((prev, cur) => {
                  Object.assign(prev, cur);
                  return prev;
                }, tempObj);
                return {
                  ...item,
                  ...tempObj,
                  id: index,
                };
              })
              .flat();
            data.variantInfo.templateData = variantAttrs.map((item, index) => {
              return {
                attrName: item.attrName,
                attrValue: "",
                id: index,
                list: item.attrValues.map((item) => {
                  return item.attrValue;
                }),
              };
            });
          }
        }
      },
      {
        immediate: true,
      }
    );

    const closeAttrVal = (i, index) => {
      const list = data.variantInfo.templateData[index].list;
      list.splice(i, 1);
      createTbaleData();
    };

    return {
      ...toRefs(data),
      spuListFn,
      submitForm,
      resetForm,
      addTitile,
      removeTitile,
      removeTitileTable,
      addTitileTable,
      addAttrVal,
      selectValChangs,
      createTbaleData,
      setEntry,
      closeAttrVal,
      addAttrName,
      selectNameChangs,
      selectPopupFun,
      tableSelectPopupFun,
      saveTableSelectPopupFun,
      closeTableBtn,
      saveTableBtn,
      getSkuListBySpu,
    };
  },
};
</script>
<style lang="scss" scoped>
.basic-info {
  .title {
    padding: 16px 0 2px 0px;
    font-size: 14px;
  }
  .basic-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
  .mr {
    margin-left: 8px;
  }
  .closeIcon {
    color: #fff;
    vertical-align: bottom;
    font-size: 20px !important;
  }
  .attr-val-box {
    border: 1px solid #ccc;
    padding: 5px 8px;
    border-radius: 24px;
    text-align: center;
  }
  .attr-header-name {
    border: 1px solid #d9d9e0;
    display: inline-block;
    text-align: center;
    padding: 6px 15px;
    border-radius: 20px;
  }
}
.validate-lable {
  position: relative;
  .validate-lable-select {
    position: absolute;
    top: -15px;
  }
  :deep(.arco-form-item-message) {
    position: absolute;
    top: 6px;
    left: 12px;
  }
}
</style>
