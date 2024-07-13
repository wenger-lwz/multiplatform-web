<template>
  <div class="basic-info" id="productPropertyInfo-ebay">
    <h2 class="title">产品属性</h2>
    <gj-form
      ref="productPropertyForm"
      :model="productPropertyInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="submitForm"
    >
      <!-- 必填属性 -->
      <gj-row :gutter="24">
        <gj-col :span="24">
          <div
            class="box_border mt pb5"
            v-if="productPropertyInfo.requiredArr.length > 0"
          >
            <p class="title_header">必填属性</p>
            <gj-row :gutter="24">
              <gj-col
                :span="8"
                v-for="(item, index) in productPropertyInfo.requiredArr"
                :key="index"
              >
                <gj-form-item
                  field="platformCategoryId"
                  :label="item.display_attribute_name"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                >
                  <!-- "input_type":"输入类型（FREE_TEXT-可手动输入、SELECTION_ONLY-只可下拉框选择）" -->
                  <!-- "cardinality":"SINGLE-单选、MULTI-多选"                     -->
                  <gj-select
                    v-model="item.moduVal"
                    placeholder="请选择"
                    allow-clear
                    :multiple="
                      item.input_type == 'MULTIPLE_SELECT_COMBO_BOX'
                        ? true
                        : false
                    "
                    @change="getAttrValue"
                  >
                    <gj-option
                      v-for="childItem in item.page"
                      :key="childItem.value_id"
                      :value="childItem.display_value_name"
                      >{{ childItem.display_value_name }}</gj-option
                    >
                  </gj-select>
                </gj-form-item>
              </gj-col>
            </gj-row>
          </div>
        </gj-col>
      </gj-row>
      <!-- 推荐属性 -->
      <gj-row :gutter="24">
        <gj-col :span="24" v-if="usageArr.length > 0">
          <div class="box_border mt">
            <p class="title_header">推荐属性</p>
            <gj-row :gutter="24">
              <gj-col :span="8" v-for="(item, index) in usageArr" :key="index">
                <gj-form-item
                  field="platformCategoryId"
                  :label="item.attributeName"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                >
                  <gj-select
                    v-model="item.moduVal"
                    placeholder="请选择"
                    allow-clear
                    :multiple="item.cardinality == 'MULTI' ? true : false"
                    @change="getAttrValue"
                  >
                    <gj-option
                      v-for="childItem in item.page.records"
                      :key="childItem.id"
                      :value="childItem.attributeValue"
                    >
                      {{ childItem.attributeValue }}
                    </gj-option>
                  </gj-select>
                </gj-form-item>
              </gj-col>
            </gj-row>
          </div>
        </gj-col>
      </gj-row>
      <!-- 可选属性 -->
      <gj-row>
        <gj-col :span="24">
          <div class="box_border mt pb5">
            <p class="title_header">选填属性</p>
            <gj-row
              :gutter="24"
              v-if="productPropertyInfo.optionArr.length > 0"
            >
              <gj-col
                :span="8"
                v-for="(item, index) in productPropertyInfo.optionArr"
                :key="index"
              >
                <gj-form-item
                  :label="item.display_attribute_name"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                >
                  <gj-select
                    v-model="item.moduVal"
                    placeholder="请选择"
                    @change="getAttrValue"
                  >
                    <gj-option
                      v-for="childItem in item.page"
                      :key="childItem.value_id"
                      :value="childItem.display_value_name"
                      >{{ childItem.display_value_name }}</gj-option
                    >
                  </gj-select>
                </gj-form-item>
              </gj-col>
            </gj-row>

            <div v-for="(item, index) in fromList" :key="index">
              <gj-row :gutter="24">
                <gj-col :span="8">
                  <gj-form-item
                    field="platformCategoryId"
                    :label="index >= 1 ? '' : '属性名'"
                    :label-col-style="{ 'justify-content': 'flex-start' }"
                  >
                    <gj-input
                      v-model="item.arrtName"
                      placeholder="请选择"
                      allow-clear
                      @change="getAttrValue"
                    >
                    </gj-input>
                  </gj-form-item>
                </gj-col>
                <gj-col :span="8">
                  <gj-form-item
                    field="platformCategoryId"
                    :label="index >= 1 ? '' : '属性值'"
                    :label-col-style="{ 'justify-content': 'flex-start' }"
                  >
                    <gj-input
                      v-model="item.arrtVale"
                      placeholder="请选择"
                      allow-clear
                      @change="getAttrValue"
                    >
                    </gj-input>
                  </gj-form-item>
                </gj-col>
                <gj-col :span="4">
                  <div :class="index >= 1 ? '' : 'btn-svg'">
                    <SvgIcon
                      svgClass="addTitle"
                      :width="24"
                      @click="addTitile"
                      v-show="index === fromList.length - 1"
                    ></SvgIcon
                    ><SvgIcon
                      v-show="fromList.length > 1"
                      svgClass="subtract"
                      :width="24"
                      @click="removeTitile(index)"
                    ></SvgIcon>
                  </div>
                </gj-col>
              </gj-row>
            </div>
          </div>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, onMounted, watch } from "vue";
import { setForm } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
import { useStore } from "vuex";
import { queryShopeeCategoryAttribute } from "@api/published/shopee.js";
import { GjMessage } from "@gj/atom";
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
    const key = "productPropertyInfo";
    const data = reactive({
      productPropertyInfo: {
        platformCategoryId: "",
        productList: [],
        requiredArr: [], //必填
        optionArr: [], //可选
      },
      fromList: [
        {
          arrtName: "",
          arrtVale: "",
        },
      ],
      personListOpt: [
        { userId: "001", userName: "小华" },
        { userId: "002", userName: "小郑" },
      ],
      productTypeOpt: [
        { productTypeName: "分类①", productTypeCode: "1" },
        { productTypeName: "分类②", productTypeCode: "2" },
      ],
      rules: {},
      usageArr: [], //推荐
    });

    const setData = (list, name, type) => {
      let cutterLiat = [];
      list.forEach((element) => {
        if (element[name]) {
          let obj = {
            attrName: type == "z" ? element.arrtName : element.attributeName,
            attrValues: [element[name]].flat(),
          };
          cutterLiat.push(obj);
        }
      });

      return cutterLiat;
    };
    // 过滤选中的数据
    const getAttrValue = () => {
      let fromList = setData(data.fromList, "arrtVale", "z");
      let requiredArr = setData(
        data.productPropertyInfo.requiredArr,
        "moduVal",
        "arr"
      );
      let usageArr = setData(
        data.productPropertyInfo.usageArr,
        "moduVal",
        "arr"
      );
      let optionArr = setData(
        data.productPropertyInfo.optionArr,
        "moduVal",
        "arr"
      );

      data.productPropertyInfo.productList = [
        ...fromList,
        ...requiredArr,
        ...usageArr,
        ...optionArr,
      ].flat();
    };
    const getqueryEbayCategoryAttribute = () => {
      console.log(store.getters.getgoodsData, "store.state.common");
      if (!store.getters.getgoodsData.categoryId) return;
      let params = {
        /* site: 'MY',
        categoryId: 100135, */
        site: store.state.common.shopeeData.siteId,
        categoryId: store.getters.getgoodsData.categoryId,
      };
      queryShopeeCategoryAttribute(params).then((res) => {
        const { code, message } = res;
        if (code !== 0) {
          GjMessage.success(message);
        }
        let page = {
          records: [],
        };

        // 选填属性
        if (res.data && res.data.length > 0) {
          data.productPropertyInfo.optionArr = res.data.map((item) => {
            return {
              ...item,
              page: item.attribute_value_list,
              moduVal: "",
            };
          });
        }
        /* if (res.data.optionalAttributeList.length > 0) {
          data.optionArr = res.data.optionalAttributeList.map((item) => {
            return {
              ...item,
              page:
                item.attribute_value_list == null
                  ? page
                  : item.attribute_value_list,
              moduVal: "",
            };
          });
        } */

        // 推荐属性
        /* data.usageArr = res.data.recommendedAttributeList.map((item) => {
          return {
            ...item,
            page: item.page == null ? page : item.page,
            moduVal: '',
          };
        }); */

        // 必填属性
        // if (res.data.requiredAttributeList.length > 0) {
        if (res.data && res.data.requiredAttributeList) {
          data.productPropertyInfo.requiredArr =
            res.data.requiredAttributeList.map((item) => {
              return {
                ...item,
                page:
                  item.attribute_value_list == null
                    ? page
                    : item.attribute_value_list,
                moduVal: "",
              };
            });
        }
      });
    };

    const setPageData = (aData) => {
      if (aData.attributes && aData.attributes.length > 0) {
        let arr = aData.attributes.filter((item) => item.mandatory === false);

        data.productPropertyInfo.optionArr = arr.map((item) => {
          return {
            display_attribute_name: item.arrtName || "",
            page: item.attrValueList.map((it) => {
              return {
                value_id: it.attrValueId || "",
                display_value_name: it.attrValueName || "",
              };
            }),
            moduVal: item?.moduVal || "",
            display_value_name: item.attrName || "",
          };
        });
      }
    };

    const submitForm = () => {
      return setForm(proxy, key, data[key], "productPropertyForm");
    };
    const resetForm = () => {
      proxy.$refs.productPropertyForm.resetFields();
    };

    const addTitile = () => {
      data.fromList.push({
        arrtName: "",
        arrtVale: "",
      });
      data.fromList = [...data.fromList];
    };

    const removeTitile = (index) => {
      data.fromList.splice(index, 1);
    };

    watch(
      () => props.goodsRowData,
      () => {
        data.productPropertyInfo = { ...props.goodsRowData };
      }
    );

    watch(
      () => store.state.common.shopeeData.siteId,
      (newVal) => {
        if (!newVal) return;
        getqueryEbayCategoryAttribute();
      }
    );

    onMounted(() => {
      /* if (props.actionType == 'add') {
        // getqueryEbayCategoryAttribute()
      } */
    });

    return {
      treeData,
      ...toRefs(data),
      submitForm,
      resetForm,
      addTitile,
      removeTitile,
      getqueryEbayCategoryAttribute,
      getAttrValue,
      setPageData,
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
  .box_border {
    width: 100%;
    border: 1px solid #e6e6ed;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 0px 10px;
  }
  .mt {
    margin-top: 10px;
  }
  .pb5 {
    padding-bottom: 5px;
  }
  .btn-svg {
    margin-top: 36px;
  }
  .addTitle {
    margin-right: 8px;
  }
  .title_header {
    font-weight: bold;
    color: #000430;
    margin-top: 8px;
  }
}
/deep/.arco-form-item {
  margin-bottom: 5px;
}
</style>
