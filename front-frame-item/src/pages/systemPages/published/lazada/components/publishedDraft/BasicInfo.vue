<template>
  <div class="basic-info" id="basicInfo-draft-lz">
    <h2 class="title">基础信息</h2>
    <gj-form
      ref="basicDraftFormRef"
      class="basic-info-form"
      :model="basicInfoLz"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
    >
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            label="站点"
            class="mb8"
            field="siteId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              placeholder="请选择站点"
              allow-clear
              :disabled="disabled"
              :trigger-props="{
                updateAtScroll: true,
              }"
              v-model="basicInfoLz.siteId"
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
            label="店铺"
            field="shopId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              placeholder="请选择店铺"
              allow-clear
              :disabled="disabled"
              :trigger-props="{
                updateAtScroll: true,
              }"
              v-model="basicInfoLz.shopId"
              @change="shopChange"
            >
              <gj-option
                v-for="item in basicInfoLz.shopListOpt"
                :label="item.shopName"
                :value="item.shopId"
                :key="item.shopId"
              ></gj-option>
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            label="负责人"
            field="chargePersonId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :validate-trigger="validateTriggerOpt"
          >
            <select-director
              placeholder="请选择负责人"
              v-model="basicInfoLz.chargePersonId"
              :cascader-props="cascaderProps"
              @change="directorChange"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            label="产品分类"
            field="categoryId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
          >
            <gj-select
              placeholder="请选择产品分类"
              allow-clear
              :trigger-props="{
                updateAtScroll: true,
              }"
              v-model="basicInfoLz.categoryId"
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
import { getCurrency } from "@/api/published/lazada";
import {
  getListingCommonSiteId,
  getCategoryList,
  getListingCommonShop,
} from "@/api/published/common";
import SelectDirector from "@/components/SelectDirector.vue";

export default defineComponent({
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
    const key = "basicInfoLz";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      [key]: {
        siteId: "",
        siteName: "",
        shopId: "",
        chargePersonId: "",
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

    const siteCodeChange = () => {
      emit("site-change", data[key].siteId);
      const item = data[key].currencyOption.find(
        (it) => it.siteCode === data[key].siteId
      );
      data[key].recommendPriceUnit = item?.currency || "";
      setSiteName(data[key].siteId);
      saveDataStore();
    };

    const shopChange = () => {
      saveDataStore();
    };

    const directorChange = () => {
      saveDataStore();
    };

    const categoryChange = (val) => {
      data[key].categoryName =
        data.productTypeOpt.find((it) => it.category === val)?.categoryName ||
        "";
      saveDataStore();
    };

    const setSiteName = (siteId) => {
      data[key].siteName = siteListOpt.value.find(
        (item) => item.platformCode === siteId
      )?.platformName;
    };

    const setPageData = (respData) => {
      data[key].siteId = respData.siteCode;
      data[key].shopId = respData.shopId;
      data[key].categoryId = respData.categoryId;
      data[key].categoryName = respData.categoryName;
      data[key].chargePersonId = respData.chargePersonId;
      data[key].recommendPriceUnit = respData.recommendPriceUnit;
      saveDataStore();
    };
    const getCategoryListReq = () => {
      getCategoryList().then((res) => {
        data.productTypeOpt = res.data;
      });
    };
    const getListingCommonSiteIdReq = () => {
      getListingCommonSiteId({ platformId: "LAZADA" }).then((res) => {
        const list = res.data;
        siteListOpt.value = list.map((item) => {
          return {
            platformName: item.nameCn,
            platformCode: item.platformId,
          };
        });
        setSiteName(data[key].siteId);
      });
    };

    const getListingShopReq = () => {
      getListingCommonShop({ platformCode: "LAZADA" }).then((res) => {
        data.basicInfoLz.shopListOpt = res.data;
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
