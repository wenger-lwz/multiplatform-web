<template>
  <div class="basic-info" id="variantInfo-ebay">
    <h2 class="title">销售信息</h2>
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
          <div class="variantInfo-tb">
            <gj-table
              :data-source="variantInfo.templateData"
              :columns="fastColumns"
              row-key="id"
              ref="noteTable"
              :pagination="false"
              bordered
              class="temp-table"
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
                        @change="
                          selectNameChangs(record, index, record.attrName)
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
                <template v-if="column.dataIndex === 'attrValue'">
                  <div>
                    <gj-tag
                      class="value-tag"
                      size="large"
                      v-for="(item, i) in record.list"
                      :key="item"
                      closable
                      @close="closeAttrVal(i, index)"
                    >
                      <gb-text>{{ item }}</gb-text>
                    </gj-tag>
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
                  <template
                    v-if="
                      variantInfo.templateData.length >= MAX_KEY_LENGTH &&
                      showTooltip
                    "
                  >
                    <gj-tooltip
                      content="当前只能添加两个属性，需删除一个方可添加"
                      position="top"
                      background-color="#fdf2ea"
                      :content-style="{
                        color: '#ee7c30',
                      }"
                    >
                      <SvgIcon
                        @click="addTitile(record, index)"
                        svgClass="addTitle"
                        :width="24"
                        style="margin-right: 8px; cursor: pointer"
                      ></SvgIcon>
                      <SvgIcon
                        svgClass="subtract"
                        v-show="index !== 0"
                        :width="24"
                        @click="removeTitile(index)"
                      ></SvgIcon>
                    </gj-tooltip>
                  </template>
                  <div v-if="variantInfo.templateData.length < MAX_KEY_LENGTH">
                    <gj-space>
                      <SvgIcon
                        svgClass="addTitle"
                        :width="24"
                        v-show="(index) => 0"
                        @click="addTitile(record, index)"
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
          </div>
        </gj-col>
      </gj-row>
      <gj-row :gutter="24" v-if="showVariantTable">
        <gj-col :span="6">
          <gj-form-item
            field=""
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="店铺SKU"
          >
            <gj-input
              v-model="variantInfo.msku"
              placeholder="请输入"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="6">
          <gj-form-item
            field=""
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="数量"
          >
            <gj-input-number
              v-model="variantInfo.quantity"
              placeholder="请输入"
              min="0"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="6">
          <gj-form-item
            field=""
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="售价"
          >
            <gj-input-number
              v-model="variantInfo.recommendPrice"
              placeholder="请输入"
              min="0"
              allow-clear
              show-word-limit
            />
            <gj-button type="text" @click="setEntry">批量录入</gj-button>
          </gj-form-item>
        </gj-col>
      </gj-row>
      <gj-row :gutter="24" v-if="showVariantTable">
        <gj-col :span="24">
          <gj-table
            bordered
            :data-source="variantInfo.tableData"
            row-key="id"
            :columns="columns"
            ref="noteTable"
            :pagination="false"
          >
            <template #headerCell="{ title, column }">
              <template v-if="column.isRequired">
                <div>
                  <span class="require-symbol">*</span>{{ title }}
                  <span v-if="column.hasUnit">{{ recommendPriceUnit }}</span>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'msku'">
                <div>
                  <span class="require-symbol">*</span>店铺SKU
                  <gj-button type="text" @Click="skuRule" readonly
                    >自动生成</gj-button
                  >
                </div>
              </template>
              <span v-else
                >{{ title
                }}<span v-if="column.hasUnit">{{
                  recommendPriceUnit
                }}</span></span
              >
            </template>
            <template #bodyCell="{ record, index, column, recordIndexs }">
              <template v-if="column.dataIndex === 'msku'">
                <gj-form-item
                  class="mb0"
                  hide-label
                  field="msku"
                  :rules="[
                    {
                      required: true,
                      validator: (value, cb) => customMsku(value, cb, record),
                    },
                  ]"
                  :validate-trigger="validateTriggerOpt"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                >
                  <gj-input
                    v-model="record.msku"
                    placeholder="请输入"
                    allow-clear
                    :disabled="!record.isDisabled"
                  ></gj-input>
                </gj-form-item>
              </template>
              <template v-if="column.dataIndex === 'recommendPrice'">
                <gj-form-item
                  class="mb0"
                  hide-label
                  field="recommendPrice"
                  :rules="[
                    {
                      required: true,
                      validator: (value, cb) =>
                        customRecommendPrice(value, cb, record),
                    },
                  ]"
                  :validate-trigger="validateTriggerOpt"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                >
                  <gj-input-number
                    v-model="
                      variantInfo.tableData[recordIndexs[0]].recommendPrice
                    "
                    placeholder="请输入"
                    allow-clear
                    min="0"
                    :disabled="!record.isDisabled"
                    @change="recommendPriceChange"
                  />
                </gj-form-item>
              </template>
              <template v-if="column.dataIndex === 'quantity'">
                <gj-form-item
                  class="mb0"
                  hide-label
                  field="quantity"
                  :rules="[
                    {
                      required: true,
                      validator: (value, cb) =>
                        customQuantity(value, cb, record),
                    },
                  ]"
                  :validate-trigger="validateTriggerOpt"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                >
                  <gj-input-number
                    v-model="variantInfo.tableData[recordIndexs[0]].quantity"
                    placeholder="请输入"
                    allow-clear
                    min="0"
                    :disabled="!record.isDisabled"
                  />
                </gj-form-item>
              </template>
              <template v-if="column.dataIndex === 'sku'">
                <gj-form-item
                  class="mb0"
                  hide-label
                  field="sku"
                  :rules="[
                    {
                      required: true,
                      validator: (value, cb) => customSku(value, cb, record),
                    },
                  ]"
                  :validate-trigger="validateTriggerOpt"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                >
                  <gj-select
                    placeholder="选择"
                    allow-clear
                    v-model="variantInfo.tableData[recordIndexs[0]].sku"
                    :disabled="!record.isDisabled"
                  >
                    <gj-option
                      v-for="item in productOpt"
                      :key="item.userId"
                      :value="item.userId"
                      >{{ item.sku }}d（{{ item.userName }}）</gj-option
                    >
                  </gj-select>
                </gj-form-item>
              </template>
              <template v-if="column.dataIndex === 'newAttrValue'">
                <gb-text>{{ record[column.title] }}</gb-text>
              </template>
              <template v-if="column.dataIndex === 'optional'">
                <div>
                  <gj-space>
                    <gj-switch
                      :model-value="record.isDisabled"
                      @change="switchChange(index)"
                    />
                  </gj-space>
                </div>
              </template>
            </template>
          </gj-table>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  getCurrentInstance,
  reactive,
  toRefs,
  watch,
  nextTick,
  computed,
  ref,
} from "vue";
import { setForm } from "@/utils/fnBusiness";
import { useStore } from "vuex";
import { calcDescartes } from "@/utils/common";
import SvgIcon from "@/components/SvgIcon";
import { GjMessage } from "@gj/atom";
import { getSkuRule } from "@/api/public";
import { getSkuListBySpu } from "@/api/published/materialCenter";
const MAX_KEY_LENGTH = 2;

export default {
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
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const key = "variantInfo";
    const data = reactive({
      showTooltip: false,
      MAX_KEY_LENGTH,
      fastColumns: [
        {
          title: "属性名",
          dataIndex: "attrName",
          autoHeight: true,
        },
        {
          title: "属性值",
          dataIndex: "attrValue",
          autoHeight: true,
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: 100,
          autoHeight: true,
        },
      ],
      isDb: false,
      variantInfo: {
        quantity: "",
        recommendPrice: "",
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
      personListOpt: [
        {
          userId: store.getters.getgoodsData.picture.value,
          userName: store.getters.getgoodsData.picture.value,
        },
      ],
      productOpt: [
        { userId: "2020", userName: "测试1" },
        { userId: "2021", userName: "测试3" },
      ],
      ListOpt: [{ userId: " Dose not apply", userName: " Dose not apply" }],
      rules: {
        siteId: [{ required: true, message: "站点必填" }],
        chargePersonName: [{ required: true, message: "负责人必填" }],
      },
      otherColumns: [
        {
          title: "售价",
          dataIndex: "recommendPrice",
          type: "input",
          isRequired: true,
        },
        {
          title: "数量",
          dataIndex: "quantity",
          type: "input",
          isRequired: true,
        },
        {
          title: "操作",
          dataIndex: "optional",
          type: "optional",
          width: 100,
        },
      ],
      columns: [], // 自定义属性列
      // 选择SKU的弹框
      actionDialogVisible: false,
      // 记录删除行之后剩余的列的value，用于添加行的DKR计算
      filterColumnsKeyValueFied: [],
      showVariantTable: false,
    });

    const selectRows = ref([]);
    const rowSelection = computed(() => {
      return {
        selectRows: selectRows.value,
        onChange: (selectedRowKeys, selectedRows) => {
          selectRows.value = selectedRows;
        },
        getCheckboxProps: (record) => ({
          disabled: !record.isDisabled,
        }),
      };
    });

    const submitForm = () => {
      return setForm(proxy, key, data[key], "variantForm");
    };
    const resetForm = () => {
      proxy.$refs.variantForm.resetFields();
    };

    const addTitile = (row) => {
      if (data.variantInfo?.templateData?.length >= MAX_KEY_LENGTH) {
        return;
      }
      if (!row.selectValue) {
        return GjMessage.warning("请先在表格中操作属性值。");
      }
      data.variantInfo.templateData.push({
        attrName: "",
        attrValue: "",
        isAttrValue: false,
        selectValue: "",
        list: [],
        id: data.variantInfo.templateData.length,
      });
      data.variantInfo.templateData = [...data.variantInfo.templateData];
      nextTick(() => {
        data.showTooltip = true;
      });
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
              autoHeight: true,
            };
          }
        );
      }
    };
    //添加属性名
    const addAttrName = async (record, index) => {
      if (!store.getters.getgoodsData.picture.value) {
        return GjMessage.warning("请先选择关联SPU");
      }

      const spu = { spu: store.getters.getgoodsData.picture.value };

      await getSkuListBySpu(spu).then((result) => {
        const d = result.data;
        const r = d.map((item) => {
          return {
            sku: item.sku,
            userId: item.id,
            userName: item.skuName,
          };
        });
        data.productOpt = r;

        data.variantInfo.templateData = data.variantInfo.templateData.map(
          (item, flag) => {
            return {
              ...item,
              isAttrName: flag == index ? true : false,
              autoHeight: true,
            };
          }
        );
      });

      // const d = result.data;
      /* const r = {
        sku: 2352,
        userId: 464654,
        userName: 'gsgs',
      };
      data.productOpt = r;

      data.variantInfo.templateData = data.variantInfo.templateData.map(
        (item, flag) => {
          return {
            ...item,
            isAttrName: flag == index ? true : false,
          };
        }
      ); */
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
      console.log(iSbulen);
      if (row.list.length !== 0) {
        row.list.forEach((item) => {
          if (item.includes(val)) {
            iSbulen = false;
          }
        });
      }

      data.variantInfo.templateData[index].list.push(val);
      data.variantInfo.templateData[index].isAttrValue = false;
      if (
        data.variantInfo.templateData.length > 0 &&
        !data.variantInfo.templateData[0].attrValue
      ) {
        data.showVariantTable = true;
        createTbaleData();
      } else {
        data.showVariantTable = false;
      }

      /* let iSbulen = true;
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
        console.log('重复');
        return GjMessage.warning('已存在，请重新输入');
      } */
    };

    // 批量录入
    const setEntry = () => {
      let b = data.variantInfo.tableData.map((item) => {
        if (item.isDisabled === true) {
          return {
            ...item,
            msku: data.variantInfo.msku,
            quantity: data.variantInfo.quantity,
            recommendPrice: data.variantInfo.recommendPrice,
          };
        } else {
          return data.variantInfo.tableData;
        }
      });
      data.variantInfo.tableData = [...b];
    };

    const skuRule = () => {
      const shopCode = store.getters.getParams?.basicInfo?.shopId;
      getSkuRule({
        platformCode: "SHOPEE",
        shopCode,
        variantCount: data.variantInfo.tableData.length,
      })
        .then((res) => {
          const list = [...data.variantInfo.tableData];
          list.forEach((item, index) => {
            item.msku = res.data?.sonRuleStr?.[index];
          });
          data.variantInfo.tableData = [...list];
        })
        .finally(() => {
          // 校验必填
          proxy.$refs.variantForm.validateField("msku");
        });
    };

    const customMsku = (value, cb, record) => {
      return new Promise((resolve) => {
        if (!record.msku) {
          cb("店铺SKU必填");
        }
        resolve();
      });
    };

    const customRecommendPrice = (value, cb, record) => {
      return new Promise((resolve) => {
        if (!record.recommendPrice) {
          cb("售价必填");
        }
        resolve();
      });
    };

    const customQuantity = (value, cb, record) => {
      return new Promise((resolve) => {
        if (!record.quantity) {
          cb("数量必填");
        }
        resolve();
      });
    };

    const customSku = (value, cb, record) => {
      return new Promise((resolve) => {
        if (!record.sku) {
          cb("关联sku必填");
        }
        resolve();
      });
    };

    // 构建table的数据结构
    const createTbaleData = () => {
      data.columns = [];
      // let oldData = data.variantInfo.tableData;
      data.variantInfo.tableData = [];
      let newTable = [];
      const dkr = [];
      // 生成列data.variantInfo.templateData[index]
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
        const tempData = calcDescartes(dkr);
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
            isDisabled: true,
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
        /* let sumNuber = oldData.length;
        newTable.splice(0, sumNuber);
        data.variantInfo.tableData = [...oldData, ...newTable]; */
      }
      let cols = data.columns.map((item) => {
        return {
          title: item,
          dataIndex: "newAttrValue",
          type: "add", //处理表格第一行添加
        };
      });
      data.columns = [
        [
          {
            title: "关联SKU",
            dataIndex: "sku",
            type: "select",
            isRequired: true,
          },
          {
            title: "店铺SKU",
            dataIndex: "msku",
          },
        ],
        ...cols,
        ...data.otherColumns,
      ].flat();

      store.dispatch(
        proxy.$mt.GOODS_INFO_EBAY_ATTRIBUTELIST,
        data.variantInfo.templateData
      );
      // 动态标识
      data.nodeCols = cols.map((item) => {
        return item.title;
      });
    };
    watch(
      () => props.goodsRowData,
      () => {
        data.variantInfo = {
          ...props.goodsRowData,
          tableData: [],
          templateData: [],
          // tableData: props.goodsRowData.variants,
          // templateData: props.goodsRowData.variantAttrs,
          recommendPrice: String(props.goodsRowData.recommendPrice),
        };

        const { variants, variantAttrs } = props.goodsRowData;
        let b = variants[0];
        let obj = Object.keys(b).map((key) => {
          return {
            title: key,
            dataIndex: key,
            type: "add", //处理表格第一行添加
          };
        });
        data.columns = obj;
        data.variantInfo.tableData = variants.map((item, index) => {
          return {
            ...item,
            is: index,
          };
        });

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
    );
    const closeAttrVal = (i, index) => {
      const list = data.variantInfo.templateData[index].list;
      list.splice(i, 1);
      createTbaleData();
    };

    const switchChange = (index) => {
      const list = data.variantInfo.tableData;
      list[index].isDisabled = !list[index].isDisabled;
      data.variantInfo.tableData = [...list];
    };

    const recommendPriceChange = (value) => {
      console.log(value, "change");
    };

    return {
      treeData,
      rowSelection,
      locationData,
      ...toRefs(data),
      submitForm,
      resetForm,
      addTitile,
      removeTitile,
      removeTitileTable,
      addAttrVal,
      selectValChangs,
      createTbaleData,
      setEntry,
      closeAttrVal,
      addAttrName,
      selectNameChangs,
      switchChange,
      skuRule,
      recommendPriceChange,
      customMsku,
      customRecommendPrice,
      customQuantity,
      customSku,
    };
  },
};

const treeData = [
  {
    key: "node1",
    title: "Trunk",
    disabled: true,
    children: [
      {
        key: "node2",
        title: "Leaf",
      },
    ],
  },
  {
    key: "node3",
    title: "Trunk2",

    children: [
      {
        key: "node4",
        title: "Leaf",
      },
      {
        key: "node5",
        title: "Leaf",
      },
    ],
  },
];
const locationData = [
  {
    platformName: "全部",
    platformCode: "",
  },
  {
    platformName: "美国",
    platformCode: "USA",
  },
  {
    platformName: "加拿大（英语）",
    platformCode: "CanadaEnglish",
  },
  {
    platformName: "加拿大（法语）",
    platformCode: "CanadaFrench",
  },
  {
    platformName: "eBay汽车",
    platformCode: "eBayMotors",
  },
  {
    platformName: "德国",
    platformCode: "Germany",
  },
  {
    platformName: "西班牙",
    platformCode: "Spain",
  },
  {
    platformName: "意大利",
    platformCode: "Italy",
  },
  {
    platformName: "澳大利亚",
    platformCode: "Australia",
  },
];
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

  .attr-header-name {
    border: 1px solid #d9d9e0;
    display: inline-block;
    text-align: center;
    padding: 6px 15px;
    border-radius: 20px;
  }
}
.basic-info /deep/.surely-table-bordered {
  border-bottom: 0;
}
:deep(.require-symbol) {
  color: red;
}
/deep/.v-btn {
  line-height: inherit;
}
/deep/.mb0 {
  margin-bottom: 0;
}
.variantInfo-tb {
  margin-bottom: 10px;
}
/deep/.temp-table .surely-table-body .surely-table-cell {
  align-items: flex-start;
}
.value-tag {
  border-radius: 16px;
  max-width: 105px;
  padding-right: 24px;
  margin: 2px 8px 2px 0;
  position: relative;
  :deep(.arco-tag-close-btn) {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
