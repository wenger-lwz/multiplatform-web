<template>
  <div class="basic-info" id="basicInfo">
    <h2 class="title">基础信息</h2>
    <gj-form
      ref="basicFormRef"
      :model="basicInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
    >
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            field="siteId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="站点"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              v-model="basicInfo.siteId"
              placeholder="请选择站点"
              allow-clear
              @change="onSelectSite(basicInfo.siteId)"
            >
              <gj-option
                v-for="item in siteIdList"
                :key="item.platformId"
                :value="item.platformId"
                >{{ item.nameCn }}</gj-option
              >
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
            <!-- <select-user
              v-model="basicInfo.chargePersonName"
              :cascader-props="cascaderProps"
            /> -->
            <select-director
              :cascaderProps="{
                placeholder: '请选择负责人',
                maxTagCount: 1,
              }"
              v-model="basicInfo.chargePersonId"
              @change="directorChange"
              @ok="ok"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
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
  computed,
  getCurrentInstance,
  onBeforeMount,
  reactive,
  toRefs,
  watch,
  defineComponent,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { validateTriggerOpt } from "@common";
import { M_T } from "@/store/mutationsTypes";
import { getCurrency } from "@/api/published/shopee";
import SelectDirector from "@/components/SelectDirector.vue";
import { getCategoryList } from "@api/published/common";

export default defineComponent({
  emits: ["site-change"],
  components: {
    SelectDirector,
  },
  props: {},
  setup(props, { emit }) {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const key = "basicInfo";

    const data = reactive({
      [key]: {
        siteId: "",
        chargePersonId: "",
        chargePersonName: "",
        categoryId: "",
        recommendPriceUnit: "",
        currencyOption: [],
      },
      productTypeOpt: [],
      rules: {
        siteId: [{ required: true, message: "站点必填" }],
        chargePersonId: [{ required: true, message: "负责人必填" }],
      },
      validateTriggerOpt,
    });

    const ok = (val) => {
      console.log("ok", val);
    };

    const directorChange = (directorItem) => {
      data[key].chargePersonName = directorItem.label;
      saveDataStore();
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

    // 获取产品分类
    const onGetCategoryList = () => {
      getCategoryList().then((res) => {
        if (res.code === 0) {
          data.productTypeOpt = res.data;
        }
      });
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "basicFormRef");
    };

    const validate = () => {
      return proxy.$refs.basicFormRef.validate();
    };

    const resetFields = () => {
      proxy.$refs.basicFormRef.resetFields();
    };

    const getSiteId = () => {
      store.dispatch(M_T.GET_SITEID_LIST, "SHOPEE");
    };

    getSiteId();

    const siteIdList = computed(() => {
      return store.state.common.siteIdList;
    });

    const onSelectSite = (id) => {
      // 设置站点id
      // sessionStorage.setItem('siteId', id);
      store.dispatch(M_T.SHOPEE_SITEID, id);
      emit("site-change", data[key].siteId);
      const item = data[key].currencyOption.find(
        (it) => it.site === data[key].siteId
      );
      data[key].recommendPriceUnit = item?.currency || "";
      saveDataStore();
    };

    const categoryChange = () => {
      if (data.basicInfo.categoryId) {
        store.dispatch(M_T.CATEGORYID, data.basicInfo.categoryId);

        const n = data.productTypeOpt.find(
          (item) => item.category == data.basicInfo.categoryId
        );

        if (n) {
          data[key].categoryName = n.categoryName;
        }
      }
    };

    // 根据站点查询shopee分类
    /* const onSetShopeeCategory = (id) => {
      store.dispatch(M_T.SHOPEE_CATEGORY, id);
    }; */

    // onSetShopeeCategory();

    const saveDataStore = () => {
      const params = {
        [key]: data[key],
      };
      store.dispatch(M_T.PARAMS_QUERY, params);
    };

    const setPageData = (aData) => {
      data[key].siteId = aData.site;
      data[key].categoryId = aData.categoryId;
      data[key].chargePersonId = aData.chargePersonId;
      data[key].chargePersonName = aData.chargePersonName;
      data[key].recommendPriceUnit = aData.recommendPriceUnit;
      store.dispatch(M_T.SHOPEE_SITEID, aData.site);
      directorChange({ label: aData.chargePersonName });
      categoryChange();
      saveDataStore();
    };

    watch(
      () => data[key],
      () => {
        const params = {
          [key]: data[key],
        };
        store.dispatch(M_T.PARAMS_QUERY, params);
      },
      { deep: true }
    );

    onBeforeMount(async () => {
      await onGetCategoryList();
      await getCurrencyReq();
    });

    return {
      ...toRefs(data),
      directorChange,
      validate,
      resetFields,
      submitForm,
      siteIdList,
      onSelectSite,
      categoryChange,
      setPageData,
      saveDataStore,
      ok,
    };
  },
});
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
}
</style>
