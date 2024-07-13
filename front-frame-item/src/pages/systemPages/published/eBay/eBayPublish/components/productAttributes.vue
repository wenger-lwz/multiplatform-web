<template>
  <div class="basic-info" id="productAttributesInfo-ebay">
    <h2 class="title">产品属性</h2>
    <gj-form
      ref="productAttributesForm"
      :model="productAttributesInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="submitForm"
    >
      <!-- 必填属性 -->
      <gj-row :gutter="24">
        <gj-col :span="24">
          <div class="box_border mt" v-if="requiredArr.length > 0">
            <p class="title_header">必填属性</p>
            <gj-row :gutter="24">
              <gj-col
                :span="8"
                v-for="(item, index) in requiredArr"
                :key="index"
              >
                <gj-form-item
                  field="platformCategoryId"
                  :label="item.attributeName"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                >
                  <!-- "inputType":"输入类型（FREE_TEXT-可手动输入、SELECTION_ONLY-只可下拉框选择）" -->
                  <!-- "cardinality":"SINGLE-单选、MULTI-多选"                     -->
                  <gj-select
                    v-model="item.moduVal"
                    placeholder="请选择"
                    allow-clear
                    :multiple="item.cardinality == 'MULTI' ? true : false"
                    :allow-create="item.inputType == 'FREE_TEXT' ? true : false"
                    @change="getAttrValue"
                    @dropdown-reach-bottom="
                      handleReachBottom(
                        item.attributeName,
                        optionArr,
                        item.isPagination
                      )
                    "
                  >
                    <gj-option
                      v-for="childItem in item.page.records"
                      :key="childItem.id"
                      :value="childItem.attributeValue"
                      >{{ childItem.attributeValue }}</gj-option
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
                    :allow-create="item.inputType == 'FREE_TEXT' ? true : false"
                    @change="getAttrValue"
                    @dropdown-reach-bottom="
                      handleReachBottom(
                        item.attributeName,
                        optionArr,
                        item.isPagination
                      )
                    "
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
          <div class="box_border mt">
            <p class="title_header">可选属性</p>
            <gj-row :gutter="24" v-if="optionArr.length > 0">
              <gj-col :span="8" v-for="(item, index) in optionArr" :key="index">
                <gj-form-item
                  :label="item.attributeName"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                >
                  <gj-select
                    v-model="item.moduVal"
                    placeholder="请选择"
                    allow-clear
                    :max-tag-count="1"
                    :multiple="item.cardinality == 'MULTI' ? true : false"
                    :allow-create="item.inputType == 'FREE_TEXT' ? true : false"
                    @change="getAttrValue"
                    @dropdown-reach-bottom="
                      handleReachBottom(
                        item.attributeName,
                        optionArr,
                        item.isPagination
                      )
                    "
                  >
                    <gj-option
                      v-for="childItem in item.page.records"
                      :key="childItem.id"
                      :value="childItem.attributeValue"
                      >{{ childItem.attributeValue }}</gj-option
                    >
                  </gj-select>
                </gj-form-item>
              </gj-col>
            </gj-row>
            <!-- <div v-if="compatibleEnbale !== 'Disabled'"> //是否支持产品属性 -->//是否支持产品属性
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
            <!-- </div> -->
          </div>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, watch } from "vue";
import { setForm } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
import { useStore } from "vuex";
import {
  queryEbayCategoryAttribute,
  getFindAttributeValueByCondition,
} from "@api/published/ebay.js";
// import { GjMessage } from "@gj/atom";
export default {
  name: "productAttributesInfo",
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
    const key = "productAttributesInfo";
    const data = reactive({
      productAttributesInfo: {
        platformCategoryId: "",
        productList: [],
      },
      fromList: [
        {
          arrtName: "",
          arrtVale: "",
        },
      ],
      rules: {},
      requiredArr: [], //必填
      usageArr: [], //推荐
      optionArr: [], //可选
      optFlag: true,
      compatibleEnbale: "",
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
      let requiredArr = setData(data.requiredArr, "moduVal", "arr");
      let usageArr = setData(data.usageArr, "moduVal", "arr");
      let optionArr = setData(data.optionArr, "moduVal", "arr");

      data.productAttributesInfo.productList = [
        ...fromList,
        ...requiredArr,
        ...usageArr,
        ...optionArr,
      ].flat();
    };
    const getqueryEbayCategoryAttribute = () => {
      if (!store.getters.getgoodsData.categoryId) return;
      let params = {
        siteId: store.getters.getgoodsData.siteId,
        categoryId: store.getters.getgoodsData.categoryId, // 158789,
      };
      queryEbayCategoryAttribute(params).then((res) => {
        let page = {
          records: [],
        };
        data.optionArr = res.data.optionalAttributeList.map((item) => {
          let pageObj = {
            ...item.page,
            records: item.page == null ? page : item.page.records.slice(0, 50),
          };
          return {
            ...item,
            page: pageObj,
            moduVal: "",
            isPagination: item.page?.total > 300 ? true : false,
          };
        });
        data.usageArr = res.data.recommendedAttributeList.map((item) => {
          let pageObj = {
            ...item.page,
            records: item.page == null ? page : item.page.records.slice(0, 50),
          };
          return {
            ...item,
            page: pageObj,
            moduVal: "",
            isPagination: item.page?.total > 300 ? true : false,
          };
        });
        data.requiredArr = res.data.requiredAttributeList.map((item) => {
          let pageObj = {
            ...item.page,
            records: item.page == null ? page : item.page.records.slice(0, 50),
          };
          return {
            ...item,
            page: pageObj,
            moduVal: "",
            isPagination: item.page?.total > 300 ? true : false,
          };
        });

        if (props.actionType == "edit" || props.actionType == "copy") {
          if (props.goodsRowData.categoryAttributes.length == 0) return false;
          data.requiredArr = data.requiredArr.map((item) => {
            let b = props.goodsRowData.categoryAttributes.filter(
              (attr) => attr.attrName == item.attributeName
            );
            return {
              ...item,
              moduVal: b.length == 0 ? item.moduVal : b[0].attrValues.join(","),
            };
          });
          data.optionArr = data.optionArr.map((item) => {
            let b = props.goodsRowData.categoryAttributes.filter(
              (attr) => attr.attrName == item.attributeName
            );
            return {
              ...item,
              moduVal: b.length == 0 ? item.moduVal : b[0].attrValues.join(","),
            };
          });
          data.usageArr = data.usageArr.map((item) => {
            let b = props.goodsRowData.categoryAttributes.filter(
              (attr) => attr.attrName == item.attributeName
            );
            return {
              ...item,
              moduVal: b.length == 0 ? item.moduVal : b[0].attrValues.join(","),
            };
          });

          // data.fromList = categoryAttributes.map((item) => {
          //   return {
          //     arrtName: item.attrName,
          //     arrtVale: item.attrValues[0],
          //   }
          // })
          data.fromList = [{}];
        }
        console.log(data.requiredArr, data.usageArr, data.optionArr, "属性");
      });
    };

    const submitForm = () => {
      return setForm(proxy, key, data[key], "productAttributesForm");
    };
    const resetForm = () => {
      proxy.$refs.productAttributesForm.resetFields();
    };

    const handleReachBottom = (val, list, isBool) => {
      if (isBool) {
        let params = {
          pageCurrent: data.pageCurrent++,
          pageSize: data.pageSize,
          siteId: store.getters.getgoodsData.siteId,
          categoryId: store.getters.getgoodsData.categoryId, // 158789,
          attributeName: val,
        };
        getFindAttributeValueByCondition(params).then((res) => {
          let data = res.data.records;

          if (res.data.records.length == 0) {
            data.pageCurrent = data.pageCurrent > 1 ? data.pageCurrent-- : 1;
          } else {
            list.forEach((item) => {
              if (item.attributeName == val) {
                res.data.records.forEach((i) => {
                  item.page.records.push(i);
                });
              }
            });
          }
        });
      }
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
        data.productAttributesInfo = { ...props.goodsRowData };
        getqueryEbayCategoryAttribute();
      }
    );
    watch(
      () => props.stroeCategoryId,
      (newVal) => {
        data.compatibleEnbale =
          store.getters.getgoodsData?.CompatibleEnbale?.itemCompatibleEnbale;
        if (!newVal) return;
        getqueryEbayCategoryAttribute();
      }
    );

    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      addTitile,
      removeTitile,
      getqueryEbayCategoryAttribute,
      getAttrValue,
      handleReachBottom,
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
</style>
