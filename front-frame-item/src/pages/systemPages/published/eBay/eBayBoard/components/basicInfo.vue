<template>
  <gj-form
    ref="basicForm"
    :model="basicInfo"
    :rules="rules"
    layout="vertical"
    class="formStyle"
  >
    <gj-row :gutter="24">
      <gj-col
        :span="item.type === 'input' ? 16 : 8"
        v-for="item in formData"
        :key="item.prop"
        class="basicInfoForm"
      >
        <gj-form-item
          :label="`${item.label}`"
          :field="item.field ? item.prop : ''"
          :required="item.field ? item.field : false"
        >
          <template v-if="item.type === 'input'">
            <gj-input
              v-model.trim="basicInfo[item.prop]"
              :placeholder="item.placeholder"
              :max-length="100"
              show-word-limit
              :class="item.prop === 'name' ? 'tempateNameItem' : 'flexItem'"
            ></gj-input>
          </template>
          <template v-if="item.type === 'siteIdSelect'">
            <gj-select
              v-model="basicInfo[item.prop]"
              :placeholder="item.placeholder"
              class="flexItem"
              @change="setSiteIdFun"
            >
              <gj-option
                v-for="it in queryEbayBaseSiteInfo"
                :key="it.gerpId"
                :value="it.gerpId"
              >
                {{ it.nameCn }}</gj-option
              >
              <!-- <gj-option> 201004</gj-option> -->
            </gj-select>
          </template>
          <template v-if="item.type === 'shopIdSelect'">
            <gj-select
              v-model="basicInfo[item.prop]"
              :placeholder="item.placeholder"
              allow-clear
              class="flexItem"
              @change="getShopId"
            >
              <gj-option
                v-for="item in listingCommonShopId"
                :key="item.shopId"
                :value="item.shopId"
              >
                {{ item.shopName }}
              </gj-option>
            </gj-select>
          </template>
        </gj-form-item>
      </gj-col>
      <!-- <gj-col :span="10" class="basicInfoForm">
        <gj-form-item
          v-if="isShow"
          :label="`${newAddModuleData.label}:`"
          :prop="newAddModuleData.prop"
          class="checkboxItem"
        >
          <template v-if="newAddModuleData.type === 'checkbox'">
            <gj-checkbox-group
              v-model="basicInfo[newAddModuleData.prop]"
              @change="getCheckoutDta"
            >
              <gj-checkbox
                v-for="it in newAddModuleData.children"
                :key="it.valueId"
                :value="it.valueId"
                >{{ it.label }}</gj-checkbox
              >
            </gj-checkbox-group>
          </template>
        </gj-form-item>
      </gj-col> -->
      <gj-col :span="8" v-if="isTemplateType">
        <gj-form-item label="模板类型">
          <gj-radio-group v-model="basicInfo.compatibilityTemplateType">
            <gj-radio value="0">汽配模板</gj-radio>
            <gj-radio value="1">船舶模板</gj-radio>
            <gj-radio value="2">摩托模板</gj-radio>
          </gj-radio-group>
        </gj-form-item>
      </gj-col>
      <gj-col :span="8">
        <slot name="formItem"></slot>
      </gj-col>
    </gj-row>
  </gj-form>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  computed,
  onMounted,
  watch,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { editFormData } from "./index.js";
import { getOnlyQueryEbayBaseSiteInfo } from "@/api/published/ebay.js";

export default defineComponent({
  name: "basicInfo",
  components: {},
  emits: ["setStroeSiteId"],
  props: {
    formData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    queryEbayBaseSiteInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
    listingCommonShopId: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const key = "basicInfo";
    const $store = useStore();
    const datas = reactive({
      basicInfo: {
        name: "",
        shopId: "",
        siteId: "",
        compatibilityTemplateType: "0",
      },
      formData: props.formData,

      rules: {
        siteId: [{ required: true, message: "站点必填" }],
        name: [{ required: true, message: "模板名称必填" }],
      },
    });

    const isShow = computed(() => {
      return $store.getters.getdynamicProperties.templateParams.isShow;
    });
    const isTemplateType = computed(() => {
      return (
        $store.getters.getdynamicProperties.templateParams?.templateTypeList ||
        false
      );
    });

    onMounted(() => {
      datas.basicInfo.siteId = props.queryEbayBaseSiteInfo[0]?.gerpId || "";
      if (isTemplateType.value) {
        datas.basicInfo.compatibilityTemplateType = datas.basicInfo
          .compatibilityTemplateType
          ? datas.basicInfo.compatibilityTemplateType
          : "0";
      }
      if (editFormData(datas[key])) {
        datas[key] = editFormData(datas[key]);
        datas.basicInfo.compatibilityTemplateType = String(
          datas[key].compatibilityTemplateType
        );
        // Object.keys(datas[key]).forEach((item) => {
        //   if (DEFAULT.includes(item) && datas[key][item]) {
        //     datas.basicInfo.addModuleData.push(item)
        //   }
        // })
      }
    });
    // 保存数据
    const submitForm = () => {
      return setForm2(proxy, key, datas[key], "basicForm");
    };
    // 重置清空缓存
    const resetForm = () => {
      proxy.$refs["basicForm"].resetFields();
    };
    //  获取店铺信息
    const getShopId = (val) => {
      let templateParams = $store.getters?.getdynamicProperties?.templateParams;
      templateParams.shopId = val;
      $store.dispatch(proxy.$mt.DYNAMIC_EBAY_TEMPLATE, templateParams);
    };
    // 监听站点变化
    watch(
      () => datas.basicInfo.siteId,
      (val) => {
        if (val) {
          getSiteCnName(val);
          emit("setStroeSiteId", val);
        }
      },
      { deep: true }
    );
    // 监听站点变化
    watch(
      () => datas.basicInfo.compatibilityTemplateType,
      (newVal) => {
        if (newVal && isTemplateType.value) {
          getCompatibilityTemplateType(newVal);
        }
      },
      { deep: true }
    );
    const setSiteIdFun = (val) => {
      emit("setStroeSiteId", val);
    };
    // 接口-- 属于该站点的数据
    const getSiteCnName = (val) => {
      const params = {
        siteId: val,
        isAll: 0,
      };
      getOnlyQueryEbayBaseSiteInfo(params).then((res) => {
        let templateParams =
          $store.getters?.getdynamicProperties?.templateParams;
        templateParams.siteList = res.data[0];
        $store.dispatch(proxy.$mt.DYNAMIC_EBAY_TEMPLATE, templateParams);
      });
    };
    // 获取模板类型
    const getCompatibilityTemplateType = (val) => {
      let templateParams = $store.getters?.getdynamicProperties?.templateParams;
      templateParams.compatibilityTemplateType = val;
      $store.dispatch(proxy.$mt.DYNAMIC_EBAY_TEMPLATE, templateParams);
    };
    return {
      ...toRefs(datas),
      submitForm,
      resetForm,
      isShow,
      getShopId,
      isTemplateType,
      setSiteIdFun,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "./index.scss";

:deep(.arco-form-item-content-wrapper) {
  width: 358px;
}
.basicInfoForm {
  :deep(.arco-form-item-content-wrapper) {
    width: 100%;
  }
}
.basicInfoForm:first-child {
  .arco-form-item {
    margin-bottom: 0px;
  }
}
</style>
