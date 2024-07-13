<template>
  <div class="basic-info" id="basicInfo-ebay">
    <h2 class="title">基础信息</h2>
    <gj-form
      ref="basicForm"
      :model="basicInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="submitForm"
    >
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            field="siteId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="站点"
          >
            <gj-select
              placeholder="请选择站点"
              v-model="basicInfo.siteId"
              allow-clear
              @change="getSiteId"
              @popup-visible-change="getRegionList"
            >
              <gj-option
                v-for="item in locationData"
                :key="item.platformCode"
                :value="item.platformCode"
                >{{ item.platformName }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="chargePersonId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="负责人"
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
              v-model="basicInfo.categoryName"
              placeholder="请选择产品分类"
              size="medium"
              allow-clear
              @change="productNameFun"
              @popup-visible-change="getProducList"
            >
              <gj-option
                v-for="item in productTypeOpt"
                :key="item.category"
                :value="item.productTypeCode"
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
import { getCurrentInstance, reactive, toRefs, onMounted, watch } from "vue";
import { setForm } from "@/utils/fnBusiness";
import SelectDirector from "@/components/SelectDirector.vue";
import {
  getQueryEbayBaseSiteInfo,
  getOnlyQueryEbayBaseSiteInfo,
} from "@api/published/ebay.js";
import { getCategoryList } from "@api/published/common";
import { validateTriggerOpt } from "@common";
import { useStore } from "vuex";
export default {
  emits: ["setShowItemFun", "attrFun"],
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
  components: {
    SelectDirector,
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const store = new useStore();
    const key = "basicInfo";
    const data = reactive({
      setShowItemFun: true,
      basicInfo: {
        siteId: "",
        siteName: "",
        chargePersonId: "",
        chargePersonName: "",
        categoryId: "",
        categoryName: "",
        priceUnit: "", //根据站点获取的币种
        // categoryId: "18857",
      },
      validateTriggerOpt,
      productTypeOpt: [],
      rules: {
        siteId: [{ required: true, message: "站点必填" }],
        chargePersonId: [{ required: true, message: "负责人必填" }],
      },
      locationData: [],
      cascaderProps: {
        popupContainer: "#multiplatform-web",
        allowSearch: true,
        allowClear: true,
      },
    });

    const getSiteId = (val) => {
      data.basicInfo.siteId = val;
      data.locationData.forEach((item) => {
        if (item.platformCode == val) {
          data.basicInfo.siteName = item.platformName;
        }
      });
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY, val);
      getPriceUnit(val);
    };

    const getPriceUnit = (val) => {
      const params = {
        siteId: val,
        isAll: 0,
      };
      getOnlyQueryEbayBaseSiteInfo(params).then((res) => {
        data.basicInfo.priceUnit = res.data[0].siteCurrency;
      });
    };
    const productNameFun = (val) => {
      data.productTypeOpt.forEach((item) => {
        if (item.categoryName == val) {
          data.basicInfo.categoryId = item.categoryId;
          data.basicInfo.categoryName = item.categoryName;
        }
      });
    };
    const submitForm = () => {
      return setForm(proxy, key, data[key], "basicForm");
    };
    const resetForm = () => {
      proxy.$refs.basicForm.resetFields();
    };

    const getRegionList = (val) => {
      if (val) {
        getQueryEbayBaseSiteInfo().then((res) => {
          data.locationData = res.data.map((item) => {
            return {
              platformCode: item.gerpId,
              platformName: item.nameCn,
            };
          });
        });
      }
    };
    const getProducList = (val) => {
      if (val) {
        getCategoryList().then((res) => {
          data.productTypeOpt = res.data.map((item) => {
            return {
              categoryName: item.categoryName,
              categoryId: item.category,
            };
          });
        });
      }
    };

    const directorChange = (directorItem) => {
      data[key].chargePersonName = directorItem.label;
    };
    watch(
      () => props.goodsRowData,
      () => {
        data.basicInfo = { ...props.goodsRowData };
        const { siteId, siteName, categoryName, category } = props.goodsRowData;
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY, siteId);
        data.locationData = [
          {
            platformCode: siteId,
            platformName: siteName,
          },
        ];
        data.productTypeOpt = [
          {
            categoryName: categoryName,
            categoryId: category,
          },
        ];
        getPriceUnit(siteId);
      }
    );

    onMounted(() => {
      // if (props.actionType == 'add') {
      // }
    });
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      getSiteId,
      getRegionList,
      getProducList,
      productNameFun,
      directorChange,
      getPriceUnit,
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
}
</style>
