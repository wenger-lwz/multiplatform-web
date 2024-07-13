<template>
  <div class="basic-info" id="basicInfo-draft-lz">
    <h2 class="title">基础信息</h2>
    <gj-form
      ref="basicDraftFormRef"
      :model="basicInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
    >
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="siteId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="站点"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              allow-clear
              placeholder="请选择站点"
              v-model="basicInfo.siteId"
              :disabled="disabled"
              @change="siteCodeChange"
            >
              <gj-option
                v-for="item in siteListOpt"
                :key="item.platformCode"
                :value="item.platformCode"
                >{{ item.platformName }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="shopId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="店铺"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              v-model="basicInfo.shopId"
              @change="shopChange"
              :disabled="disabled"
              placeholder="请选择店铺"
              allow-clear
            >
              <gj-option
                :label="item.shopName"
                :value="item.shopId"
                v-for="item in basicInfo.shopListOpt"
                :key="item.shopId"
              ></gj-option>
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="chargePersonId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="负责人"
            :validate-trigger="validateTriggerOpt"
          >
            <select-director
              v-model="basicInfo.chargePersonId"
              :cascader-props="cascaderProps"
              @change="directorChange"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="categoryId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="产品分类"
          >
            <gj-select
              v-model="basicInfo.categoryId"
              placeholder="请选择"
              allow-clear
              @change="categoryChange"
            >
              <gj-option
                v-for="item in productTypeOpt"
                :key="item.category"
                :value="item.category"
                >{{ item.categoryName }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  ref,
  getCurrentInstance,
  reactive,
  toRefs,
  onMounted,
  defineComponent,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import { validateTriggerOpt } from "@common";
import { getCurrency } from "@/api/published/shopee";
import {
  getListingCommonSiteId,
  getCategoryList,
  getListingCommonShop,
} from "@/api/published/common";
import SelectDirector from "@/components/SelectDirector.vue";

export default defineComponent({
  name: "BasicInfo",
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  emits: ["site-change"],
  components: {
    SelectDirector,
  },
  setup(props, { emit }) {
    const store = useStore();
    const key = "basicInfo";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      [key]: {
        siteId: "",
        shopId: "",
        chargePersonId: "",
        chargePersonName: "",
        categoryId: "",
        categoryName: "",
        shopListOpt: [],
        currencyOption: [],
        recommendPriceUnit: "",
      },
      productTypeOpt: [],
    });

    const rules = {
      siteId: [{ required: true, message: "站点必填" }],
      shopId: [{ required: true, message: "店铺必填" }],
      chargePersonId: [{ required: true, message: "负责人必填" }],
    };
    const cascaderProps = {
      popupContainer: "#multiplatform-web",
      allowSearch: true,
      allowClear: true,
    };

    const siteListOpt = ref([]);
    const submitForm = () => {
      return setForm2(proxy, key, data[key], "basicDraftFormRef");
    };
    const validate = () => {
      return proxy.$refs.basicDraftFormRef.validate();
    };
    const resetFields = () => {
      proxy.$refs.basicDraftFormRef.resetFields();
    };

    const getCurrencyReq = () => {
      getCurrency()
        .then((res) => {
          data[key].currencyOption = res.data;
        })
        .finally(() => {
          data.currencyLoad = true;
        });
    };

    const saveDataStore = () => {
      const params = {
        [key]: data[key],
      };
      store.dispatch(M_T.PARAMS_QUERY, params);
    };

    const siteCodeChange = (val) => {
      console.log(val, "data[key].categoryId");
      store.dispatch(M_T.SHOPEE_SITEID, data[key].siteId);
      // store.dispatch(M_T.CATEGORYID, data[key].categoryId);
      // store.dispatch(proxy.$mt.GOODS_INFO_EBAY_CATEGORYID, platformCategoryId);
      emit("site-change", data[key].siteId);
      const item = data[key].currencyOption.find(
        (it) => it.site === data[key].siteId
      );
      data[key].recommendPriceUnit = item?.currency || "";
      saveDataStore();
    };

    const shopChange = () => {
      saveDataStore();
    };

    const directorChange = (val) => {
      data[key].chargePersonName = val.label;
      saveDataStore();
    };

    const categoryChange = (val) => {
      data[key].categoryName =
        data.productTypeOpt.find((it) => it.category === val)?.categoryName ||
        "";
      saveDataStore();
    };

    const setPageData = (respData) => {
      console.log(respData, "000000");
      data[key].siteId = respData.site;
      data[key].shopId = respData.shopId;
      data[key].categoryId = respData.categoryId;
      data[key].categoryName = respData.categoryName;
      data[key].chargePersonId = respData.chargePersonId;
      data[key].chargePersonName = respData.chargePersonName;
      data[key].recommendPriceUnit = respData.recommendPriceUnit;
      saveDataStore();
    };
    const getCategoryListReq = () => {
      getCategoryList().then((res) => {
        data.productTypeOpt = res.data;
      });
    };
    const getListingCommonSiteIdReq = () => {
      getListingCommonSiteId({ platformId: "SHOPEE" }).then((res) => {
        const list = res.data;
        siteListOpt.value = list.map((item) => {
          return {
            platformName: item.nameCn,
            platformCode: item.platformId,
          };
        });
      });
    };

    const getListingShopReq = () => {
      getListingCommonShop({ platformCode: "SHOPEE" }).then((res) => {
        data.basicInfo.shopListOpt = res.data;
      });
    };

    onMounted(() => {
      getListingCommonSiteIdReq();
      getListingShopReq();
      getCategoryListReq();
      getCurrencyReq();
    });

    return {
      ...toRefs(data),
      validateTriggerOpt,
      rules,
      cascaderProps,
      siteListOpt,
      validate,
      resetFields,
      submitForm,
      setPageData,
      siteCodeChange,
      shopChange,
      directorChange,
      categoryChange,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
</style>
