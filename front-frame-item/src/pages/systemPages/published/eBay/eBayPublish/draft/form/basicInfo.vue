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
              v-model="basicInfo.siteId"
              placeholder="请选择站点"
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
            field="shopId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="店铺"
          >
            <gj-select
              v-model="basicInfo.shopId"
              placeholder="请选择店铺"
              allow-clear
              @change="getShopId"
              @popup-visible-change="getShopIdList"
            >
              <gj-option
                v-for="item in shopList"
                :key="item.ebayshopId"
                :label="item.ebayName"
                :value="item.ebayId"
              ></gj-option>
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="chargePersonName"
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
        <gj-col :span="8" class="postinon-ret">
          <gj-form-item
            field="categoryId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="店铺分类"
          >
            <gj-select
              v-model="basicInfo.shopCategory"
              placeholder="请选择店铺分类"
              size="medium"
              allow-clear
              :disabled="basicInfo.shopId ? false : true"
              @change="productNameFun"
              @popup-visible-change="getShopList"
            >
              <gj-option
                v-for="item in shopCategoryOpt"
                :key="item.categoryId"
                :value="item.categoryId"
                >{{ item.categoryName }}</gj-option
              >
            </gj-select>
          </gj-form-item>
          <gj-button
            class="position-abslot"
            type="text"
            size="small"
            @click="refreshStore"
            >刷新店铺分类</gj-button
          >
        </gj-col>

        <gj-col :span="8">
          <gj-form-item
            field="categoryId"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="第二店铺分类"
          >
            <gj-select
              v-model="basicInfo.secondShopCategory"
              placeholder="请选择"
              size="medium"
              allow-clear
              :disabled="basicInfo.shopId ? false : true"
              @change="productNameFun"
              @popup-visible-change="getShopList"
            >
              <gj-option
                v-for="item in secondShopCategoryList"
                :key="item.categoryId"
                :value="item.categoryId"
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
  setResfCategorys,
  getqueryEbayStoreCategorysyList,
} from "@api/published/ebay.js";
import { getStoreInformationlist } from "@api/published/common.js";
import { validateTriggerOpt } from "@common";
import { getCategoryList } from "@api/published/common";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
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
      basicInfo: {
        siteId: "",
        siteName: "",
        shopId: "",
        shopName: "",
        chargePersonId: "",
        chargePersonName: "",
        categoryId: "", //18857
        categoryName: "",
        shopCategory: "",
        secondShopCategory: "",
        priceUnit: "", //根据站点获取的币种
      },
      validateTriggerOpt,
      productTypeOpt: [],
      shopCategoryOpt: [],
      secondShopCategoryList: [],
      rules: {
        siteId: [
          {
            required: true,
            message: "站点必填",
          },
        ],
        shopId: [{ required: true, message: "店铺必填" }],
      },
      shopList: [],
      locationData: [],
      cascaderProps: {
        popupContainer: "#multiplatform-web",
        allowSearch: true,
        allowClear: true,
      },
    });
    const getShopIdList = () => {
      let params = {
        platformCode: "EBAY",
      };
      getStoreInformationlist(params).then((res) => {
        data.shopList = res.data.map((item) => {
          return {
            ebayName: item.shopName,
            ebayId: item.shopId,
          };
        });
      });
    };

    const getSiteId = (val) => {
      data.basicInfo.shopId = "";
      data.basicInfo.siteId = val;
      data.locationData.forEach((item) => {
        if (item.platformCode == val) {
          data.basicInfo.siteName = item.platformName;
        }
      });
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY, val);
      infoPriceUnit(val);

      //店铺
    };

    const infoPriceUnit = (val) => {
      const params = {
        siteId: val,
        isAll: 0,
      };
      getOnlyQueryEbayBaseSiteInfo(params).then((res) => {
        data.basicInfo.priceUnit = res.data[0].siteCurrency;
        store.dispatch(
          proxy.$mt.DRAFT_INFO_PRICEUNIT,
          data.basicInfo.priceUnit
        );
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
    // 店铺分类
    const getShopList = (val) => {
      if (val) {
        let params = {
          shopId: data.basicInfo.shopId,
        };
        if (!data.basicInfo.shopId) return false;
        getqueryEbayStoreCategorysyList(params).then((res) => {
          console.log(res);
          data.shopCategoryOpt = res.data.map((item) => {
            return {
              categoryName: item.categoryName,
              categoryId: item.categoryId,
            };
          });
          data.secondShopCategoryList = data.shopCategoryOpt;
        });
      }
    };
    const getShopId = (val) => {
      data.shopList.forEach((item) => {
        if (item.ebayId == val) {
          data.basicInfo.shopName = item.ebayName;
        }
      });
      store.dispatch(proxy.$mt.DRAFT_INFO_EBAY, val);
    };
    const refreshStore = () => {
      if (data.basicInfo.shopId) {
        //刷新店铺分类
        let params = {
          shopId: data.basicInfo.shopId,
        };
        setResfCategorys(params).then(() => {});
        // 查询店铺分类
      } else {
        GjMessage.warning({
          content: "请选择店铺！",
        });
      }
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
        const { siteId, siteName, categoryName, category, shopName, shopId } =
          props.goodsRowData;
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY, siteId);
        store.dispatch(proxy.$mt.DRAFT_INFO_EBAY, shopId);
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
        data.shopList = [{ ebayName: shopName, ebayId: shopId }];
        infoPriceUnit(siteId);
        getShopList(true);

        if (props.actionType == "copy") {
          getRegionList(true);
        }
      }
    );

    onMounted(() => {});
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      getSiteId,
      getShopId,
      getShopList,
      getRegionList,
      getProducList,
      productNameFun,
      refreshStore,
      directorChange,
      getShopIdList,
      infoPriceUnit,
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
  .postinon-ret {
    position: relative;
  }
  .position-abslot {
    position: absolute;
    left: 90px;
    top: 2px;
    color: #0045f0;
  }
}
</style>
