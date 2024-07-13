<template>
  <div>
    <gj-form
      ref="locationOfGoodsForm"
      :model="locationOfGoodsInfo"
      layout="vertical"
      class="formStyle"
    >
      <gj-row :gutter="24">
        <gj-col v-for="item in formData" :key="item.prop" :span="8">
          <gj-form-item :label="`${item.label}`" :prop="item.prop">
            <template v-if="item.type === 'input'">
              <gj-input
                v-model.trim="locationOfGoodsInfo[item.prop]"
                maxlength="100"
                :placeholder="item.placehodler"
                allow-clear
                class="flexItem"
              ></gj-input>
            </template>
            <template v-if="item.type === 'select'">
              <gj-select
                v-model="locationOfGoodsInfo.country"
                :placeholder="item.placehodler"
                allow-clear
                class="flexItem"
                @popup-visible-change="getCountryOption"
              >
                <gj-option
                  v-for="it in countryOption"
                  :key="it.country"
                  :value="it.country"
                  >{{ it.countryCnName || it.countryEnName }}</gj-option
                >
              </gj-select>
            </template>
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  onMounted,
  computed,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import { editFormData, getSiteCnNames } from "./index.js";
import { getQueryEbayLocationCountry } from "@/api/published/ebay.js";
export default defineComponent({
  name: "locationOfGoods",
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
    const { proxy } = getCurrentInstance();
    const key = "locationOfGoodsInfo";
    const datas = reactive({
      locationOfGoodsInfo: {
        country: "",
        postalCode: "",
        location: "",
      },
      formData: props.formData,
      countryOption: [],
    });
    // 保存数据
    const submitForm = () => {
      return setForm2(proxy, key, datas[key], "locationOfGoodsForm");
    };
    // 重置清空缓存
    const resetForm = () => {
      proxy.$refs["locationOfGoodsForm"].resetFields();
    };
    // 接口--所在国家数据
    const getCountryOption = (val) => {
      if (val) {
        const prams = {
          siteId: siteCnList.value?.siteId,
        };
        getQueryEbayLocationCountry(prams).then((res) => {
          datas.countryOption = res.data;
        });
      }
    };
    // 获取站点数据
    const siteCnList = computed(() => {
      return getSiteCnNames();
    });
    onMounted(() => {
      // 编辑回显
      if (editFormData(datas[key])) {
        datas[key] = editFormData(datas[key]);
      }
    });
    return {
      ...toRefs(datas),
      submitForm,
      resetForm,
      getCountryOption,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
