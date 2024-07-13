<!--产品属性-->
<template>
  <div class="blockBox">
    <div class="title">
      产品属性<gj-button type="text" @click="updateAttr">更新属性</gj-button>
    </div>
    <gj-form
      ref="productAttrForm"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      label-align="left"
      class="form"
    >
      <!-- 必填属性 -->
      <div class="squre-line">
        <div class="sonTitle">必填属性</div>
        <gj-row :gutter="24">
          <gj-col :span="8" v-for="(item, index) in requireData" :key="index">
            <!-- 数字输入框 -->
            <div
              v-if="
                item.attributeShowTypeValue === 'input' &&
                item.inputType === 'NUMBER'
              "
            >
              <gj-form-item
                :label="item.zhName"
                validate-trigger="change"
                :field="`model${index}`"
                :rules="[
                  {
                    required: true,
                    message: '必填',
                    validator: (value, cb) =>
                      customValidator(value, cb, item.model),
                  },
                ]"
              >
                <gj-input-number
                  placeholder="请输入"
                  v-model="item.model"
                ></gj-input-number>
              </gj-form-item>
            </div>

            <!-- 输入框 -->
            <div
              v-if="
                item.attributeShowTypeValue === 'input' &&
                item.inputType === 'STRING'
              "
            >
              <gj-form-item
                :field="`model${index}`"
                :label="item.zhName"
                validate-trigger="change"
                :rules="[
                  {
                    required: true,
                    message: '必填',
                    validator: (value, cb) =>
                      customValidator(value, cb, item.model),
                  },
                ]"
              >
                <gj-input placeholder="请输入" v-model="item.model">
                  <template #append v-if="item.units.length > 0">
                    <gj-select
                      :style="{ width: '100px', height: '28px' }"
                      placeholder="请选择"
                      :trigger-props="{
                        updateAtScroll: true,
                        autoFitPopupMinWidth: true,
                      }"
                      v-model="item.unitsModel"
                    >
                      <gj-option
                        v-for="item1 in item.units"
                        :value="item1.id"
                        :key="item1.id"
                        >{{ item1.zhName }}</gj-option
                      >
                    </gj-select>
                  </template>
                </gj-input>
              </gj-form-item>
            </div>

            <!-- 单选 -->
            <div v-if="item.attributeShowTypeValue === 'list_box'">
              <gj-form-item
                :field="`model${index}`"
                :label="item.zhName"
                validate-trigger="change"
                :rules="[
                  {
                    required: true,
                    message: '必填',
                    validator: (value, cb) =>
                      customValidator(value, cb, item.model),
                  },
                ]"
              >
                <gj-select
                  placeholder="请选择"
                  allow-search
                  v-model="item.model"
                  :trigger-props="{
                    updateAtScroll: true,
                    autoFitPopupMinWidth: true,
                  }"
                >
                  <gj-option
                    :value="item1.id"
                    v-for="item1 in item.values"
                    :key="item1.id"
                    >{{ item1.zhName }}</gj-option
                  >
                </gj-select>
              </gj-form-item>
            </div>

            <!-- 多选 -->
            <div v-if="item.attributeShowTypeValue === 'check_box'">
              <gj-form-item
                :field="`model${index}`"
                :label="item.zhName"
                validate-trigger="change"
                :rules="[
                  {
                    required: true,
                    message: '必填',
                    validator: (value, cb) =>
                      customValidator(value, cb, item.model),
                  },
                ]"
              >
                <gj-select
                  placeholder="请选择"
                  allow-search
                  v-model="item.model"
                  :multiple="item.sku ? false : true"
                  :trigger-props="{
                    updateAtScroll: true,
                    autoFitPopupMinWidth: true,
                  }"
                >
                  <gj-option
                    :value="item1.id"
                    v-for="item1 in item.values"
                    :key="item1.id"
                    >{{ item1.zhName }}</gj-option
                  >
                </gj-select>
              </gj-form-item>
            </div>
          </gj-col>
        </gj-row>
      </div>

      <!-- 选填属性 -->
      <div class="squre-line">
        <div class="sonTitle">选填属性</div>
        <gj-row :gutter="24">
          <gj-col :span="8" v-for="(item, index) in choiceData" :key="index">
            <!-- 数字输入框 -->
            <div
              v-if="
                item.attributeShowTypeValue === 'input' &&
                item.inputType === 'NUMBER'
              "
            >
              <gj-form-item :label="item.zhName">
                <gj-input-number
                  v-model="item.model"
                  placeholder="请输入"
                ></gj-input-number>
              </gj-form-item>
            </div>

            <!-- 输入框 -->
            <div
              v-if="
                item.attributeShowTypeValue === 'input' &&
                item.inputType === 'STRING'
              "
            >
              <gj-form-item :label="item.zhName">
                <gj-input placeholder="请输入" v-model="item.model">
                  <template #append v-if="item.units.length > 0">
                    <gj-select
                      :style="{ width: '100px', height: '28px' }"
                      placeholder="请选择"
                      v-model="item.unitsModel"
                      :trigger-props="{
                        updateAtScroll: true,
                        autoFitPopupMinWidth: true,
                      }"
                    >
                      <gj-option
                        v-for="item1 in item.units"
                        :value="item1.id"
                        :key="item1.id"
                        >{{ item1.zhName }}</gj-option
                      >
                    </gj-select>
                  </template>
                </gj-input>
              </gj-form-item>
            </div>

            <!-- 单选 -->
            <div v-if="item.attributeShowTypeValue === 'list_box'">
              <gj-form-item :label="item.zhName">
                <gj-select
                  placeholder="请选择"
                  allow-search
                  v-model="item.model"
                  :trigger-props="{
                    updateAtScroll: true,
                    autoFitPopupMinWidth: true,
                  }"
                >
                  <gj-option
                    :value="item1.id"
                    v-for="item1 in item.values"
                    :key="item1.id"
                    >{{ item1.zhName }}</gj-option
                  >
                </gj-select>
              </gj-form-item>
            </div>

            <!-- 多选 -->
            <div v-if="item.attributeShowTypeValue === 'check_box'">
              <gj-form-item :label="item.zhName">
                <gj-select
                  placeholder="请选择"
                  v-model="item.model"
                  allow-search
                  :multiple="item.sku ? false : true"
                  :trigger-props="{
                    updateAtScroll: true,
                    autoFitPopupMinWidth: true,
                  }"
                >
                  <gj-option
                    :value="item1.id"
                    v-for="item1 in item.values"
                    :key="item1.id"
                    >{{ item1.zhName }}</gj-option
                  >
                </gj-select>
              </gj-form-item>
            </div>
          </gj-col>
        </gj-row>
        <!-- 适用车型 -->
        <div v-if="isCarParam">
          <gj-row :gutter="24">
            <gj-col :span="8">
              <div class="inline">
                适用车型
                <gj-button type="text" @click="setTemplate">设置</gj-button>
              </div>
              <gj-select
                v-model="carTemplateId"
                placeholder="请选择车辆模板"
                v-if="showCarPlat"
                @change="changeCarTemplate"
                :trigger-props="{
                  updateAtScroll: true,
                  autoFitPopupMinWidth: true,
                }"
              >
                <gj-option
                  v-for="item in carList"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></gj-option>
              </gj-select>

              <!-- <div style="color: #808197">已选（0）</div> -->
            </gj-col>
          </gj-row>
          <!-- <carTable :modelType="modelType"></carTable> -->
          <compatibility
            :modelType="modelType"
            :carTableData="carTableData"
            ref="compatibility"
          ></compatibility>
        </div>
      </div>
      <div class="squre-line custom">
        <div class="sonTitle">自定义属性</div>
        <div class="attrTitle">
          <span class="sp1">属性名</span>
          <span class="sp2">属性值</span>
        </div>
        <div
          class="item"
          v-for="(item, index) in productAttr.customAttributeVOList"
          :key="index"
          :style="{
            'margin-bottom':
              index + 1 === productAttr.customAttributeVOList.length
                ? '0'
                : '8px',
          }"
        >
          <span class="sp1">
            <gj-input v-model="item.customAttrName" placeholder="请输入">
            </gj-input>
          </span>
          <span class="sp2">
            <gj-input
              v-model="item.customAttrValue"
              placeholder="请输入"
            ></gj-input>
          </span>
          <span class="sp3">
            <SvgIcon
              svgClass="addTitle"
              :width="24"
              @click="addCustom"
              v-if="index < 20"
              style="margin-right: 8px"
            />
            <SvgIcon
              svgClass="subtract"
              :width="24"
              @click="deleteCustom(index)"
              v-if="index != 0"
            />
          </span>
        </div>
      </div>
    </gj-form>
  </div>
</template>
<script>
import {
  defineComponent,
  toRefs,
  reactive,
  getCurrentInstance,
  watch,
  inject,
  ref,
  nextTick,
} from "vue";
import SvgIcon from "@/components/SvgIcon";
import { setForm2 } from "@/utils/fnBusiness";
import { useStore } from "vuex";
import compatibility from "../../../components/compatibility";
import { getTemplateDetail } from "@/api/published/aliexpress";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  props: {
    attr: {
      type: Number,
      default: () => {
        return 2;
      },
    },
    productAttrArray: {
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
    carList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showCarPlat: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  components: {
    SvgIcon,
    compatibility,
  },
  setup(props, { emit }) {
    const isCarParam = inject("isCarParam");
    const modelType = inject("modelType");
    const { proxy } = getCurrentInstance();
    const key = "productAttr";
    const compatibility = ref();
    const store = new useStore();
    const data = reactive({
      carTemplateId: "",
      carList: props.carList,
      showCarPlat: props.showCarPlat,
      attr: props.attr, //1为单体，需显示额外属性
      variantAttrInfo: props.productAttrArray,
      productAttr: {
        customAttributeVOList: [
          {
            customAttrName: "",
            customAttrValue: "",
          },
        ],
      },
      choiceData: [],
      requireData: [],
      editData: props.editInfo,
      carTableData: [],
    });

    const customValidator = (value, cb, model) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (model === 0) {
            model = toString(model);
          }
          if (model.length === 0) {
            cb("必填");
          }
          resolve();
        }, 0);
      });
    };

    const updateAttr = () => {
      emit("updateAttr");
    };

    watch(
      () => props.attr,
      (newValue) => {
        data.attr = newValue;
      }
    );

    watch(
      () => modelType.value,
      (newValue) => {
        setTimeout(() => {
          if (compatibility.value) {
            compatibility?.value?.modelTypeChange(newValue);
          }
        }, 0);
      }
    );

    watch(
      () => props.carList,
      (newValue) => {
        data.carList = newValue;
        data.carTemplateId = "";
      }
    );

    watch(
      () => props.productAttrArray,
      (newValue) => {
        data.variantAttrInfo = newValue.map((item) => {
          let isMultiple =
            item.attributeShowTypeValue === "check_box" ? true : false;
          if (item.units && item.units.length > 0) {
            return {
              ...item,
              model: isMultiple ? [] : "",
              unitsModel: "",
            };
          } else {
            return {
              ...item,
              model: isMultiple ? [] : "",
            };
          }
        });

        //不为空时为编辑
        if (JSON.stringify(data.editData) != "{}") {
          const categoryAttributes = data.editData.categoryAttributes || [];

          data.variantAttrInfo.forEach((item) => {
            categoryAttributes.forEach((item1) => {
              if (item.id == item1.attrNameId) {
                //多选
                if (item.attributeShowTypeValue === "check_box") {
                  if (item1.attrValueId) {
                    item.model.push(
                      item1.attrValueId ? +item1.attrValueId : ""
                    );
                  }
                } else if (item.attributeShowTypeValue === "list_box") {
                  //单选
                  item.model = item1.attrValueId ? +item1.attrValueId : "";
                } else if (item.attributeShowTypeValue === "input") {
                  //输入框
                  item.model = item1.attrValue;
                } else {
                  item.model = item1.attrValueId;
                }
              }
            });
          });
          console.log(data.variantAttrInfo);
          console.log(store.state.aliexpress.aliProductInfo);
        }
        data.choiceData = data.variantAttrInfo.filter((item) => !item.required);
        data.requireData = data.variantAttrInfo.filter((item) => item.required);
      }
    );

    watch(
      () => props.editInfo,
      (newValue) => {
        data.editData = newValue;
        data.editData = JSON.parse(JSON.stringify(newValue));
        if (data.editData.customAttributeVOList) {
          data.productAttr.customAttributeVOList =
            data.editData?.customAttributeVOList;
        }

        if (data.editData.carDataList) {
          nextTick(() => {
            compatibility?.value?.modelTypeChange(modelType.value);
            data.carTableData = data.editData?.carDataList.map((item) => {
              return {
                ...item,
                rowKey:
                  data.editData.modelType === 1
                    ? `${item.enginePid}-${item.engineId}`
                    : `${item.submodelPid}-${item.submodelId}`,
              };
            });
          });
        }
      },
      { deep: true }
    );

    const submitForm = () => {
      let formatAttr = [];
      let newArr = data.choiceData.concat(data.requireData);
      newArr.forEach((item) => {
        if (Array.isArray(item.model)) {
          item.model.forEach((item1) => {
            formatAttr.push({
              attrName: item.zhName,
              required: item.required,
              attrNameId: item.id,
              attrValueId: item1,
              attrValue: item.values.filter((item2) => item2.id === item1)[0]
                ?.zhName,
            });
          });
        } else {
          formatAttr.push({
            attrName: item.zhName,
            attrNameId: item.id,
            attrValueId:
              item.attributeShowTypeValue == "input" ? "" : item.model,
            required: item.required,
            attrValue:
              item.attributeShowTypeValue == "input"
                ? item.model
                : item.values.filter((item1) => item1.id === item.model)[0]
                    ?.zhName,
          });
        }
      });
      return setForm2(
        proxy,
        key,
        {
          customAttributeVOList: data.productAttr.customAttributeVOList,
          categoryAttributes: formatAttr,
          carDataList: compatibility?.value?.compatibilityTableData || [],
          modelType: isCarParam.vlaue ? modelType.value : "",
        },
        "productAttrForm"
      );
    };

    const resetForm = () => {
      proxy.$refs["productAttrForm"].resetFields();
    };

    const addCustom = () => {
      if (data.productAttr.customAttributeVOList.length >= 20) {
        return GjMessage.warning("最多添加20条");
      }
      data.productAttr.customAttributeVOList.push({
        customAttrName: "",
        customAttrValue: "",
      });
    };

    const deleteCustom = (index) => {
      console.log(index);
      data.productAttr.customAttributeVOList.splice(index, 1);
    };

    const setTemplate = () => {
      compatibility?.value?.addCompatibility();
    };

    const changeCarTemplate = (val) => {
      getTemplateDetail(val).then((res) => {
        data.carTableData =
          res.data.carDataList.map((item) => {
            return {
              ...item,
              rowKey:
                data.editData.modelType === 1
                  ? `${item.enginePid}-${item.engineId}`
                  : `${item.submodelPid}-${item.submodelId}`,
            };
          }) || [];
      });
    };

    return {
      ...toRefs(data),
      addCustom,
      deleteCustom,
      setTemplate,
      submitForm,
      resetForm,
      customValidator,
      updateAttr,
      isCarParam,
      modelType,
      changeCarTemplate,
      compatibility,
    };
  },
});
</script>
<style lang="scss" scoped>
.blockBox {
  .title {
    padding: 12px 0 2px 0px;
    font-size: 14px;
    margin-bottom: 16px;
    font-weight: 600;
  }
  .form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
  .squre-line {
    padding: 12px;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #e6e6ed;
    border-radius: 8px;
    margin-bottom: 14px;
  }
  .sonTitle {
    font-size: 12px;
    font-weight: 600;
  }
  .custom {
    .attrTitle {
      .sp1 {
        display: inline-block;
        width: 300px;
        margin-right: 24px;
      }
      .sp2 {
        display: inline-block;
        width: 300px;
        margin-right: 16px;
      }
    }
    .item {
      display: flex;
      align-items: center;
      .sp1 {
        display: inline-block;
        width: 300px;
        margin-right: 24px;
      }
      .sp2 {
        display: inline-block;
        width: 300px;
        margin-right: 16px;
      }

      .sp3 {
        display: flex;
        width: 56px;
        .buttonGroup {
          display: flex;
          margin-left: 16px;
          align-items: center;
        }
      }
    }
  }
}
/deep/.compatibility-wrap {
  padding: 0;
}
</style>
