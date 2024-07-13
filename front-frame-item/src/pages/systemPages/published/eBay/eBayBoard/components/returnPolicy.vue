<template>
  <div>
    <gj-form
      ref="returnPolicyForm"
      :model="returnPolicyInfo"
      layout="vertical"
      class="formStyle"
    >
      <gj-row :gutter="24">
        <gj-col :span="24" v-for="(item, index) in formData" :key="index">
          <gj-form-item
            :label="`${item.label}`"
            :class="
              item.type === 'textarea' ? 'formDataStyle' : 'columnFormDataStyle'
            "
          >
            <template v-if="item.type === 'title'">
              <gj-form-item
                v-for="it in item.children"
                :key="it.prop"
                :label="`${it.label}:`"
                :prop="it.prop"
                class="itemFormStyle"
                style="color: #000; font-weight: 500"
              >
                <template v-if="it.type === 'select'">
                  <gj-select
                    v-model="returnPolicyInfo[it.prop]"
                    :placeholder="item.label"
                    clearable
                    size="small"
                    class="flexItem"
                    :disabled="getDisabled(it.prop)"
                    @popup-visible-change="getQueryEbaySiteReturn"
                  >
                    <gj-option
                      v-for="j in optionList[item.prop][it.options]"
                      :key="j"
                      :value="j"
                      >{{ j }}</gj-option
                    >
                  </gj-select>
                </template>
                <template v-if="it.type === 'switch'">
                  <gj-switch
                    v-model="returnPolicyInfo[it.prop]"
                    size="small"
                    :checked-value="checkedValue"
                    :unchecked-value="unCheckedValue"
                  /><span class="btnTxtStyle">{{ it.btnTxt }}</span>
                </template>
              </gj-form-item>
            </template>
            <gj-form-item v-if="item.type === 'textarea'">
              <gj-textarea
                v-model.trim="returnPolicyInfo[item.prop]"
                placeholder="请输入退款说明..."
                allow-clear
                :disabled="getDisabled(item.prop)"
              />
            </gj-form-item>
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  computed,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import { getQueryEbaySiteReturnPolicy } from "@/api/published/ebay.js";
import { editFormData, getSiteCnNames } from "./index.js";
export default defineComponent({
  name: "returnPolicy",
  components: {},
  props: {
    formData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const key = "returnPolicyInfo";
    const { proxy } = getCurrentInstance();
    const datas = reactive({
      checkedValue: true,
      unCheckedValue: false,
      returnPolicyInfo: {
        domesticReturnEnable: false,
        internationalReturnEnable: false,
        domesticReturnTime: "",
        internationalReturnTime: "",
        domesticReturnType: "",
        internationalReturnType: "",
        domesticReturnCostBy: "",
        internationalReturnCostBy: "",
        returnDescription: "",
      },
      siteReturnPolicyList: [],
      formData: props.formData,
      optionList: {
        domestic: {},
        international: {},
      },
      rules: {
        site: [
          {
            required: true,
            message: "请输入站点",
            trigger: "blur",
          },
        ],
        goodsCode: [
          {
            required: true,
            message: "请输入商品识别码",
            trigger: "blur",
          },
        ],
      },
    });
    // 保存数据
    const submitForm = () => {
      return setForm2(proxy, key, datas[key], "returnPolicyForm");
    };
    //  重置清空缓存
    const resetForm = () => {
      proxy.$refs["returnPolicyForm"].resetFields();
    };
    // 未联动时禁止输入
    const getDisabled = (val) => {
      if (
        (!datas[key]?.domesticReturnEnable &&
          (val === "domesticReturnTime" ||
            val === "domesticReturnType" ||
            val === "domesticReturnCostBy")) ||
        (!datas[key]?.internationalReturnEnable &&
          (val === "internationalReturnTime" ||
            val === "internationalReturnType" ||
            val === "internationalReturnCostBy"))
      ) {
        datas[key][val] = "";
        return true;
      } else if (
        !datas[key]?.domesticReturnEnable &&
        !datas[key]?.internationalReturnEnable &&
        val === "returnDescription"
      ) {
        datas[key][val] = "";
        return true;
      }
      return false;
    };
    // 接口--退货政策数据
    const getQueryEbaySiteReturn = (val) => {
      if (val) {
        const params = {
          siteId: siteCnName.value?.siteId,
        };
        getQueryEbaySiteReturnPolicy(params).then((res) => {
          datas.siteReturnPolicyList = res.data.forEach((item) => {
            if (item.returnPolicyType === "domestic") {
              datas.optionList.domestic = item;
            } else if (item.returnPolicyType === "international") {
              datas.optionList.international = item;
            }
          });
        });
      }
    };

    // 获取站点信息
    const siteCnName = computed(() => {
      return getSiteCnNames();
    });

    onMounted(() => {
      // 回显数据
      if (editFormData(datas[key])) {
        datas[key] = editFormData(datas[key]);
      }
    });
    return {
      ...toRefs(datas),
      submitForm,
      resetForm,
      getDisabled,
      getQueryEbaySiteReturn,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
.formDataStyle {
  font-weight: 700;
}

.columnFormDataStyle {
  font-weight: 700;
}
.btnTxtStyle {
  margin-left: 4px;
}
.itemFormStyle {
  margin-right: 24px;
}
</style>
