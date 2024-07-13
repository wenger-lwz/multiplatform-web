<!--变体信息-->
<template>
  <div class="blockBox">
    <div class="title">变体信息</div>
    <gj-form
      ref="moreAttrForm"
      label-align="left"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div class="content-wrap">
        <div class="dafault-attr-wrap">
          <div class="table-title">
            <div class="div1">属性名</div>
            <div class="div2">属性值</div>
          </div>
          <div
            class="table-column"
            v-for="(item, index) in variantAttrInfo"
            :key="index"
          >
            <div class="div1">
              <span class="star" v-if="item.required">*</span
              ><span class="attrName">{{ item.zhName }}</span>
            </div>
            <div class="div2">
              <div class="value-wrap">
                <gj-form-item
                  :hide-label="true"
                  field="attrValue"
                  :rules="
                    item.required
                      ? [
                          {
                            required: true,
                            message: '请选择',
                            validator: (value, cb) =>
                              customValidatorSttrValue(
                                value,
                                cb,
                                item.attrValues
                              ),
                          },
                        ]
                      : []
                  "
                  validate-trigger="change"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                  :style="{ marginBottom: 0 }"
                >
                  <div
                    v-for="(item1, index1) in item.attrValues"
                    :key="index1"
                    class="valueItem pad5"
                  >
                    <gj-input
                      v-model="item1.attrValueDefinitionName"
                      placeholder="自定义名称"
                      size="small"
                      @change="attrValueDefinitionNamechange"
                    >
                      <template #prepend>{{ item1.zhName }}</template>
                    </gj-input>
                    <SvgIcon
                      svgClass="closeIcon"
                      :width="16"
                      @click="deleteAttr(index, index1)"
                      class="closeBtn"
                    />
                  </div>
                  <div class="button-wrap">
                    <gj-button @click="addAttr(index)" size="small" type="text"
                      >添加属性</gj-button
                    >
                  </div>
                </gj-form-item>
              </div>
            </div>
          </div>
        </div>
        <gj-row :gutter="24">
          <gj-col :span="6">
            <gj-form-item label="建议售价">
              <gj-input-number
                placeholder="请输入"
                size="small"
                v-model="batchPrice"
                :min="0"
                :max="100000000000000"
              >
                <template #prefix> $ </template>
              </gj-input-number>
            </gj-form-item>
          </gj-col>
          <gj-col :span="6">
            <gj-button @click="batchEntry" size="small" type="text"
              >批量录入</gj-button
            >
          </gj-col>
        </gj-row>

        <gj-table
          :rowKey="'index'"
          :columns="table1Colums"
          :data-source="tableData"
          :row-selection="rowSelection"
          :pagination="false"
          :scroll="scroll"
          :bordered="true"
        >
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'recommendPrice'">
              售价 *
            </template>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'sku'">
              <gj-select
                placeholder="请选择"
                v-model="tableData[index].sku"
                :trigger-props="{
                  updateAtScroll: true,
                  autoFitPopupMinWidth: true,
                }"
              >
                <gj-option
                  v-for="item in skuList"
                  :valeu="item.id"
                  :key="item.id"
                  >{{ item.sku }}</gj-option
                >
              </gj-select>
            </template>

            <template v-if="column.dataIndex === 'recommendPrice'">
              <gj-form-item
                :hide-label="true"
                field="recommendPrice"
                :rules="[
                  {
                    required: true,
                    message: '请输入价格',
                    validator: (value, cb) =>
                      customValidatorPrice(value, cb, record.recommendPrice),
                  },
                ]"
                validate-trigger="change"
                :label-col-style="{ 'justify-content': 'flex-start' }"
                :style="{ marginBottom: 0 }"
              >
                <gj-input-number
                  style="width: 125px"
                  placeholder="请输入"
                  v-model="tableData[index].recommendPrice"
                  @change="priceChange(record, $event)"
                  :min="0"
                  :max="100000000000000"
                >
                </gj-input-number>
              </gj-form-item>
            </template>

            <template v-if="column.dataIndex === 'open'">
              <gj-switch
                :default-checked="record.open"
                active-color="#1f6eef"
                @change="switchChange(record, $event)"
              />
            </template>
          </template>
        </gj-table>
      </div>
    </gj-form>
    <attrModal
      :visible="visible"
      @handleOk="handleOk"
      @handleCancel="handleCancel"
      :option="checkOption"
    ></attrModal>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onBeforeMount,
  watch,
  computed,
  inject,
} from "vue";
import SvgIcon from "@/components/SvgIcon";
import { calcDescartes } from "@/utils/common";
import { setForm2 } from "@/utils/fnBusiness";
import store from "@/store";
import attrModal from "../../../components/attrModal.vue";
import { GjMessage } from "@gj/atom";

export default defineComponent({
  props: {
    variantAttrInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
    editInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    skuList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    SvgIcon,
    attrModal,
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const saveMoreAttr = inject("saveMoreAttr");
    const isSaveMoreAttrFalg = inject("isSaveMoreAttrFalg");

    const key = "moreAttr"; //

    const data = reactive({
      scroll: {
        x: 0,
        y: 400,
      },
      editData: props.editInfo,
      attr: props.attr,
      moreAttr: {},
      selectionData: [],
      batchPrice: "",
      variantAttrInfo: props.variantAttrInfo,
      columns: [],
      columns1: [
        {
          title: "关联sku",
          dataIndex: "sku",
          width: 160,
          fixed: "left",
        },
        {
          title: "售价",
          dataIndex: "recommendPrice",
          width: 150,
          fixed: "right",
        },
        {
          title: "启用",
          dataIndex: "open",
          width: 130,
          fixed: "right",
        },
      ],
      defaultCoums: [{}],
      tableData: [],
      tableOldData: [],
      incrementalDKR: [],
      incrementalIdDKR: [],
      visible: false,
      checkOption: [],
      checkList: [],
      actionIndex: 0,
      rowSelection: {
        fixed: "left",
        onChange: (rowKey) => {
          data.rowSelection.selectedRowKeys = rowKey;
          console.log(rowKey);
        },
        selectedRowKeys: [],
      },
      skuList: [],
    });

    onBeforeMount(() => {
      console.log(data.variantAttrInfo);
      // setIncrementalDKR()
      // createTbaleData()
    });
    const table1Colums = computed(() => {
      return data.columns.concat(data.columns1);
    });

    const customValidatorSttrValue = (value, cb, Num) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (Num.length === 0) {
            cb("请选择");
          }
          resolve();
        }, 0);
      });
    };

    const customValidatorPrice = (value, cb, recommendPrice) => {
      if (recommendPrice === 0) {
        recommendPrice = toString(recommendPrice);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!recommendPrice) {
            cb("价格必填");
          }
          resolve();
        }, 0);
      });
    };

    // const showAddAttrBut = (obj) => {
    //   if (!obj.attrValues) return false
    //   if (obj.attrValues.length >= obj.values.length) {
    //     return false
    //   } else {
    //     return true
    //   }
    // }

    watch(
      () => props.editInfo,
      (newValue) => {
        if (JSON.stringify(newValue) != "{}") {
          data.editData = JSON.parse(JSON.stringify(newValue));
        }
      },
      { deep: true }
    );

    watch(
      () => props.skuList,
      (newValue) => {
        data.skuList = newValue;
      }
    );

    watch(
      () => props.variantAttrInfo,
      (value, old) => {
        console.log(value, old);
        data.incrementalDKR = [];
        data.incrementalIdDKR = [];
        let newvalue = value.map((item) => {
          let newValueName = item.values
            ? item.values.map((item1) => {
                return {
                  ...item1,
                  visible: true,
                  check: false,
                };
              })
            : [];

          console.log(newValueName);
          return {
            ...item,
            values: newValueName,
            attrValues: [],
          };
        });
        data.variantAttrInfo = newvalue;
        data.columns = newvalue.map((item) => {
          return {
            id: item.id,
            zhName: item.zhName,
            title: item.zhName,
            dataIndex: item.zhName,
          };
        });
        data.tableData = [];
        data.tableOldData = [];

        if (JSON.stringify(data.editData) != "{}") {
          const variantAttrInfoList = data.editData.variantAttrInfoList || [];

          //变体回显
          data.tableData = data.editData.variants.map((item, index) => {
            const newItem = {
              ...item,
              index,
            };
            item.variationSkuAttr.forEach((item1) => {
              newItem[item1.attrName] = item1.attrValueDefinitionName
                ? item1.attrValueDefinitionName
                : item1.attrValueName;
            });

            return newItem;
          });

          console.log(data.tableData);
          console.log(data.columns);
          data.variantAttrInfo.forEach((item1) => {
            variantAttrInfoList.forEach((item2) => {
              if (item1.id == item2.attrId) {
                //找到属性已勾选的属性值
                item1.values.forEach((select1) => {
                  item2.attrValues.forEach((select2) => {
                    if (select1.id == select2.attrValueId) {
                      select1.visible = false;
                      select1.check = true;
                      item1.attrValues.push({
                        ...select1,
                        attrValueDefinitionName:
                          select2.attrValueDefinitionName,
                      });
                    }
                  });
                });
              }
            });
          });

          //保存变体图片信息
          if (saveCustomizedPic) {
            saveCustomizedPic();
          }
        }
        if (isSaveMoreAttrFalg.value) {
          data.tableData = store.state.aliexpress.saveMoreAttr?.tableData || [];
          data.variantAttrInfo =
            store.state.aliexpress.saveMoreAttr?.variantAttrInfo || [];
        }
      },
      { deep: true, immediate: true }
    );

    watch(
      () => data.tableData,
      (newValue) => {
        data.tableData = newValue;
        store.commit("setSaveMoreAttr", {
          tableData: data.tableData,
          variantAttrInfo: data.variantAttrInfo,
        });
      },
      { deep: true }
    );

    //修改属性别名是重新构建dkr数据
    const attrValueDefinitionNamechange = () => {
      data.tableOldData = [...data.tableData];
      data.tableData = [];
      setIncrementalDKR();
      createTbaleData();

      data.tableData.forEach((item, index) => {
        item.sku = data.tableOldData[index].sku;
        item.recommendPrice = data.tableOldData[index].recommendPrice;
      });
    };

    // 构建增量的dkr数据
    const setIncrementalDKR = () => {
      const tempDkr = [];
      const idDkr = [];
      data.variantAttrInfo.forEach((item) => {
        if (item.attrValues.length > 0) {
          tempDkr.push(
            item.attrValues.map((o) => {
              return o.attrValueDefinitionName
                ? o.attrValueDefinitionName
                : o.zhName;
            })
          );

          idDkr.push(
            item.attrValues.map((o) => {
              return o.id;
            })
          );
        }
      });

      data.incrementalDKR = calcDescartes(tempDkr);
      data.incrementalIdDKR = calcDescartes(idDkr);
    };

    // 构建增量的table的数据结构
    const createTbaleData = () => {
      createTableLine(data.incrementalDKR);
    };

    // 创建table行
    const createTableLine = (dkrList) => {
      dkrList.forEach((item, index) => {
        let wheelSpaceCount = 0; //轮空的个数，用来处理从中间开始添加属性，导致columnIndex不对应产生bug
        let line = {};
        let variationSkuAttr = [];

        variationSkuAttr = data.columns.map((item) => {
          return {
            attrId: item.id,
            attrName: item.zhName,
            attrValueId: "",
            attrValueName: "",
            attrValueDefinitionName: "",
          };
        });

        data.variantAttrInfo.forEach((columnKey, columnIndex) => {
          let currentDkrId = "";
          // console.log(data.variantAttrInfo)
          // console.log(columnKey)
          if (columnKey.zhName && columnKey.attrValues.length > 0) {
            let columnsNames = data.columns.map((item) => item.zhName);
            if (columnsNames.indexOf(columnKey.zhName) <= -1) {
              data.columns.push({
                zhName: columnKey.zhName,
                id: columnKey.id,
              });
            }

            if (data.variantAttrInfo.length <= 1) {
              line[columnKey.zhName] = item;
              //找到对应的id
              currentDkrId = data.incrementalIdDKR[index];
            } else {
              line[columnKey.zhName] =
                typeof item === "string"
                  ? item
                  : item[columnIndex - wheelSpaceCount];
              currentDkrId =
                typeof data.incrementalIdDKR[index] === "number"
                  ? data.incrementalIdDKR[index]
                  : data.incrementalIdDKR[index][columnIndex - wheelSpaceCount];
            }
            console.log(currentDkrId);

            variationSkuAttr.forEach((arrtItem) => {
              if (arrtItem.attrName === columnKey.zhName) {
                //根据对应的Id来找到对应项
                const currentItem = columnKey.attrValues.filter(
                  (item1) => item1.id === currentDkrId
                )[0];
                arrtItem.attrValueName = currentItem.zhName;
                arrtItem.attrValueId = currentItem.id;
                arrtItem.attrValueDefinitionName =
                  currentItem.attrValueDefinitionName;
              }
            });
          } else {
            wheelSpaceCount++;
          }
        });
        line.index = index;

        //建议售价
        line.recommendPrice = "";
        line.open = true;
        line.sku = "";
        line.variationSkuAttr = variationSkuAttr;
        line = complexValue(line, data.tableOldData);

        line.index = data.tableData.length;
        data.tableData.push(line);
        console.log(data.tableData, "数据源", data.variantAttrInfo);
      });
    };

    const complexValue = (line, oldData) => {
      let newLine = {};
      let equalIndex = -1;
      if (oldData.length > 0) {
        const computeArr = oldData.map((item) => {
          let newItem = { ...item };
          delete newItem.recommendPrice;
          delete newItem.open;
          delete newItem.sku;
          delete newItem.msku;
          delete newItem.quantity;
          delete newItem.variationSkuAttr;
          delete newItem.index;
          delete newItem.bulkDiscount;
          delete newItem.bulkOrder;
          delete newItem.skuId;
          delete newItem.wholesale;
          delete newItem.wholesalePrice;

          return newItem;
        });

        computeArr.forEach((item, index) => {
          const arr1 = Object.values(item);
          const arr2 = Object.values(line);
          const arr3 = arr2.filter((item) => arr1.indexOf(item) > -1);
          if (arr3.length === arr1.length) {
            equalIndex = index;
          }
        });
      }
      if (equalIndex > -1) {
        newLine = {
          ...line,
          recommendPrice: oldData[equalIndex].recommendPrice,
          open: oldData[equalIndex].open,
          sku: oldData[equalIndex].sku,
        };
      } else {
        newLine = { ...line };
      }
      return newLine;
    };

    const submitForm = () => {
      const formatAttrInfo = data.variantAttrInfo.map((item) => {
        return {
          attrId: item.id,
          attrName: item.zhName,
          attrValues: item.attrValues.map((item1) => {
            return {
              attrValueDefinitionName: item1.attrValueDefinitionName,
              attrValueId: item1.id,
              attrValueName: item1.zhName,
            };
          }),
        };
      });
      const formatVariants = data.tableData.map((item) => {
        return {
          variationSkuAttr: item.variationSkuAttr,
          open: item.open,
          recommendPrice: item.recommendPrice,
          sku: item.sku,
        };
      });
      console.log(formatAttrInfo);
      console.log(formatVariants);
      return setForm2(
        proxy,
        key,
        {
          variantAttrInfoList: formatAttrInfo,
          variants: formatVariants,
        },
        "moreAttrForm"
      );
      // return true
    };

    const resetForm = () => {
      proxy.$refs["moreAttrForm"].resetFields();
    };

    //批量录入价格
    const batchEntry = () => {
      if (data.rowSelection.selectedRowKeys.length == 0)
        return GjMessage.warning("至少选择一条要操作的数据");

      if (!data.batchPrice) return GjMessage.warning("请输入价格");
      data.rowSelection.selectedRowKeys.forEach((item) => {
        data.tableData[item].recommendPrice = data.batchPrice;
      });
    };

    const selectSKU = () => {
      console.log("关联SDK");
    };

    const addAttr = (index) => {
      data.visible = true;
      data.checkOption = [...data.variantAttrInfo[index].values];
      data.actionIndex = index;
    };

    const deleteAttr = (index, index1) => {
      const attrId = data.variantAttrInfo[index].attrValues[index1].id;

      //恢复未选中状态
      data.variantAttrInfo[index].values.forEach((item) => {
        if (item.id === attrId) {
          item.check = false;
          item.visible = true;
        }
      });

      //删除variantAttrInfo对应的属性

      // //找到对应columns的index
      // const delColumnsIndex = data.columns
      //   .map((item) => item.attrName)
      //   .indexOf(attrName)
      // if (data.variantAttrInfo[index].attrValues.length > 1) {
      //   // 删除行
      //   data.tableData = data.tableData.filter((item) => {
      //     return item[attrName] !== attrValueName
      //   })
      // } else {
      //   // 删除列
      //   data.tableData.forEach((item) => {
      //     delete item[attrName]
      //   })

      //   data.columns.splice(delColumnsIndex, 1)

      //   if (data.columns.length === 0) {
      //     data.tableData = []
      //   }
      // }
      data.variantAttrInfo[index].attrValues.splice(index1, 1);

      data.tableData = [];
      setIncrementalDKR();
      createTbaleData();

      saveCustomizedPic();
    };

    const handleCancel = () => {
      data.visible = false;
      data.checkOption = [];
    };

    const handleOk = (arr) => {
      data.visible = false;
      data.tableOldData = [...data.tableData];

      const coyeData = [...data.variantAttrInfo[data.actionIndex].attrValues];
      let ids = coyeData.map((item) => item.id);

      data.variantAttrInfo[data.actionIndex].attrValues = [];
      data.variantAttrInfo[data.actionIndex].values = arr;
      data.checkOption = arr;
      console.log(data.checkOption);
      data.checkOption.forEach((item) => {
        if (item.check) {
          item.visible = false;

          // if (!ids.includes(item.id)) {
          data.variantAttrInfo[data.actionIndex].attrValues.push({
            ...item,
            attrValueDefinitionName: "",
          });

          data.variantAttrInfo[data.actionIndex].attrValues.forEach((item) => {
            const copyIndex = ids.indexOf(item.id);
            if (copyIndex > -1) {
              item.attrValueDefinitionName =
                coyeData[copyIndex].attrValueDefinitionName;
            }
          });
          // }
          data.tableData = [];
          setIncrementalDKR();
          createTbaleData();
          saveCustomizedPic();
        }
      });
    };

    //保存可上传图片属性
    const saveCustomizedPic = () => {
      const arr = data.variantAttrInfo.filter(
        (item) => item.customizedPic === true
      );
      store.commit("setProCustomizedPic", arr);
    };

    const priceChange = (record, event) => {
      const index = record.index;
      data.tableData.map((item) => {
        if (item.index === index) {
          item.recommendPrice = event;
        }
      });
    };

    const switchChange = (record, event) => {
      const index = record.index;
      data.tableData.map((item) => {
        if (item.index === index) {
          item.open = event;
        }
      });
      // data.tableData
      console.log(data.tableData);
    };

    return {
      ...toRefs(data),
      attrValueDefinitionNamechange,
      addAttr,
      batchEntry,
      deleteAttr,
      selectSKU,
      // selectionChange,
      handleOk,
      handleCancel,
      priceChange,
      switchChange,
      submitForm,
      resetForm,
      table1Colums,
      // showAddAttrBut,
      customValidatorSttrValue,
      customValidatorPrice,
      saveMoreAttr,
      isSaveMoreAttrFalg,
    };
  },
});
</script>
<style lang="scss" scoped>
.blockBox {
  // /deep/.arco-form-item-label-col {
  //   line-height: normal;
  // }
  .title {
    padding-top: 12px;
    font-size: 14px;
    margin-bottom: 16px;
    font-weight: 600;
  }
  .content-wrap {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
    .dafault-attr-wrap {
      border-radius: 5px 5px 0 0;
      border: 1px solid #e9e9ef;
      margin-bottom: 16px;

      .table-title {
        height: 32px;
        display: flex;
        align-items: center;
        background: #f2f2f5;
        border-radius: 5px 5px 0 0;
        display: flex;
        .div1 {
          padding-left: 22px;
          font-size: 12px;
          width: 150px;
        }
        .div2 {
          padding-left: 22px;
          font-size: 12px;
          flex: 1;
        }
      }

      .table-column {
        min-height: 50px;
        display: flex;
        align-items: center;
        border-top: 1px solid #f2f2f5;
        .div1 {
          padding-left: 22px;
          font-size: 12px;
          width: 150px;
        }
        .div2 {
          padding-left: 22px;
          font-size: 12px;
          flex: 1;
        }
      }
      .attrName {
        font-size: 12px;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #d9d9e0;
        padding: 8px 12px;
        color: rgba(0, 4, 48, 0.8);
      }
      .star {
        color: #ff5c5c;
      }
      .value-wrap {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        /deep/.arco-form-item-content {
          flex-wrap: wrap;
        }
      }

      .button-wrap {
        display: flex;
        align-items: center;
        margin-right: 7px;
      }
      .valueItem {
        height: 32px;
        border: 1px solid #d9d9e0;
        border-radius: 16px;
        position: relative;
        padding-right: 12px;
        margin-right: 5px;
        margin: 5px 5px 5px 0px;
        :deep(.arco-input-prepend) {
          background-color: #fff;
          border-radius: 16px 0 0 16px;
          min-width: 20px;
          border: none;
        }
        :deep(.arco-input-wrapper) {
          border-radius: 0 16px 16px 0;
          background-color: #fff;
          width: 100px;
          border: none;
          border-left: 1px solid #d9d9e0;
        }

        :deep(.arco-input-focus) {
          border: none;
        }

        .closeBtn {
          position: absolute;
          cursor: pointer;
          top: 8px;
          right: 10px;
        }
      }
    }
  }
}
</style>
