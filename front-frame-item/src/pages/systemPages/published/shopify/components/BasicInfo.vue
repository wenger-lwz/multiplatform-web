<template>
  <div class="basic-info" id="basicInfo-lz">
    <h2 class="title">基础信息</h2>
    <gj-form
      ref="basicFormRef"
      :model="shopifyBasicInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
    >
      <gj-row :gutter="24">
        <gj-col v-if="detailType === 'draft'" :span="8">
          <gj-form-item
            field="shopItem"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="店铺"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              v-model="shopifyBasicInfo.shopItem"
              placeholder="请选择店铺"
              value-key="shopId"
              allow-clear
              :trigger-props="{
                updateAtScroll: true,
                autoFitPopupMinWidth: true,
              }"
              @change="shopChange"
            >
              <gj-option
                v-for="item in storeList"
                :label="item.shopName"
                :value="item"
                :key="item.shopId"
              />
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
              placeholder="请选择负责人"
              :allow-search="true"
              :allow-clear="true"
              popup-container="#multiplatform-web"
              v-model="shopifyBasicInfo.chargePersonId"
              @change="directorChange"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="categoryId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="产品分类"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              v-model="shopifyBasicInfo.categoryId"
              placeholder="请选择"
              size="medium"
              allow-clear
              :trigger-props="{
                updateAtScroll: true,
                autoFitPopupMinWidth: true,
              }"
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
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch,
  inject,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { validateTriggerOpt } from "@common";
import { M_T } from "@/store/mutationsTypes";
import {
  getStoreInformationlist,
  getCategoryList,
} from "@api/published/common";
import SelectDirector from "@/components/SelectDirector.vue";

export default defineComponent({
  name: "ShopifyBaseInfo",
  components: {
    SelectDirector,
  },
  props: {
    detailType: {
      type: String,
      default: "product",
    },
  },
  setup(props) {
    const store = useStore();
    const key = "shopifyBasicInfo";
    const { proxy } = getCurrentInstance();
    const isResetStoreInfo = inject("isResetStoreInfo", false);
    const data = reactive({
      [key]: {
        shopItem: null,
        storeName: "",
        chargePersonId: "",
        chargePersonName: "",
        categoryId: "",
      },
      storeList: [],
      productTypeOpt: [],
      rules: {
        shopId: [
          {
            required: true,
            message: "请选择店铺",
          },
        ],
        chargePersonId: [
          {
            required: true,
            message: "负责人必填",
          },
        ],
        categoryId: [
          {
            required: true,
            message: "产品分类必填",
          },
        ],
      },
    });

    watch(
      () => data[key],
      () => {
        const params = {
          [key]: data[key],
        };
        store.dispatch(M_T.PARAMS_QUERY, params);
      },
      {
        deep: true,
      }
    );

    const getStoreList = () => {
      let params = {
        platformCode: "SHOPIFY",
      };
      getStoreInformationlist(params).then((res) => {
        data.storeList = res.data.map((item) => {
          return {
            shopId: item.shopId,
            shopName: item.shopName,
          };
        });
      });
    };

    const getCategory = () => {
      getCategoryList().then((res) => {
        data.productTypeOpt = res.data;
      });
    };

    const init = () => {
      getCategory();
      if (props.detailType === "draft") {
        getStoreList();
      }
    };

    init();

    const shopChange = (shopItem) => {
      data[key].storeName = shopItem.shopName;
      isResetStoreInfo.value = true;
    };

    const directorChange = (val) => {
      data[key].chargePersonName = val?.label ?? "";
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "basicFormRef");
    };

    const saveForm = () => {
      return setForm2(proxy, key, data[key]);
    };

    const validate = () => {
      return proxy.$refs.basicFormRef.validate();
    };

    const resetFields = () => {
      proxy.$refs.basicFormRef.resetFields();
    };

    const setPageData = (aData) => {
      if (props.detailType === "draft") {
        data[key].shopItem = {
          shopId: aData.shopId,
        };
        data[key].storeName = aData.storeName; // 是否用shopName
      }
      data[key].categoryId = aData.categoryId;
      data[key].chargePersonId = aData.chargePersonId;
      data[key].chargePersonName = aData.chargePersonName;
      const params = {
        [key]: data[key],
      };
      store.dispatch(M_T.PARAMS_QUERY, params);
    };

    return {
      ...toRefs(data),
      shopChange,
      directorChange,
      validate,
      resetFields,
      submitForm,
      saveForm,
      setPageData,
      validateTriggerOpt,
    };
  },
});
</script>
