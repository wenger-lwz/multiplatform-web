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
            >
              <gj-option
                v-for="it in queryEbayBaseSiteInfo"
                :key="it.gerpId"
                :value="it.gerpId"
              >
                {{ it.nameEn }}</gj-option
              >
              <!-- <gj-option> 201001</gj-option> -->
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
      <gj-col :span="12" class="basicInfoForm">
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
import { addModuleData } from "./index.js";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { editFormData } from "./index.js";
import { getOnlyQueryEbayBaseSiteInfo } from "@/api/published/ebay.js";

const DEFAULT = [
  "shippingEnable",
  "paymentEnable",
  "returnEnable",
  "buyerEnable",
  "locationEnable",
];
export default defineComponent({
  name: "basicInfo",
  components: {},
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
  setup(props) {
    const { proxy } = getCurrentInstance();
    const key = "basicInfo";
    const $store = useStore();
    const datas = reactive({
      basicInfo: {
        name: "",
        shopId: "",
        siteId: "",
        addModuleData: [],
        shippingEnable: false,
        paymentEnable: false,
        returnEnable: false,
        buyerEnable: false,
        locationEnable: false,
      },
      formData: props.formData,
      rules: {
        siteId: [{ required: true, message: "站点必填" }],
        name: [{ required: true, message: "模板名称必填" }],
      },
      newAddModuleData: addModuleData,
    });
    // 添加模块，比如物流政策，付款政策等
    const getCheckoutDta = (val) => {
      let moduleData =
        $store.getters.getdynamicProperties.templateParams.listData;
      moduleData.splice(2);
      const newModuleList = datas.newAddModuleData?.children.filter((item) =>
        val.includes(item.valueId)
      );
      newModuleList.forEach((item) => {
        moduleData.push({
          name: item.value,
          sectionId: item.value,
          isShow: true,
        });
        datas[key][item.valueId] = true;
      });
    };
    // 是否显示标题的另存模板
    const isShow = computed(() => {
      return $store.getters.getdynamicProperties.templateParams.isShow;
    });
    onMounted(() => {
      // 默认选择第一站点
      datas.basicInfo.siteId = props.queryEbayBaseSiteInfo[0]?.gerpId || "";
      if (editFormData(datas[key])) {
        // 数据回显
        datas[key] = editFormData(datas[key]);
        datas.basicInfo.addModuleData = [];
        Object.keys(datas[key]).forEach((item) => {
          if (DEFAULT.includes(item) && datas[key][item]) {
            datas.basicInfo.addModuleData.push(item);
          }
        });
        getCheckoutDta(datas.basicInfo.addModuleData);
      }
    });
    //保存数据
    const submitForm = () => {
      return setForm2(proxy, key, datas[key], "basicForm");
    };
    // 重置清空缓存
    const resetForm = () => {
      proxy.$refs["basicForm"].resetFields();
    };
    // 获取店铺信息
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
        }
      },
      { deep: true, immediate: true }
    );
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
    return {
      ...toRefs(datas),
      getCheckoutDta,
      submitForm,
      resetForm,
      isShow,
      getShopId,
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
