<template>
  <div class="product-info" id="productInfo-lz">
    <h2 class="title">产品信息</h2>
    <gj-form
      ref="productInfoFormRef"
      :model="productInfo"
      class="product-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div class="mb16">
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item
              field="shopeeType"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              :rules="[{ required: true, message: 'Shopee分类必填' }]"
            >
              <template #label>
                Shopee分类
                <gj-popover>
                  <SvgIcon svgClass="vector02" :width="13"></SvgIcon>
                  <template #content>
                    <span
                      >因不同分类对应不同的产品详情，故选择分类后显示详情的编辑信息</span
                    >
                  </template>
                </gj-popover>
              </template>
              <gj-cascader
                :format-label="format"
                :options="lazadaTypeOptions"
                :model-value="productInfo.shopeeType"
                :input-value="productInfo.lazadaLabel"
                placeholder="请选择"
                :load-more="loadMore"
                @change="handleChange"
              />
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="规格"
            >
              <gj-radio-group
                v-model="productInfo.specsType"
                @change="specsTypeChange"
              >
                <gj-radio :value="1">单品</gj-radio>
                <gj-radio :value="2">变体</gj-radio>
              </gj-radio-group>
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>
      <!-- SKU -->
      <div class="squre-line mb8" v-if="productInfo.specsType !== 2">
        <gj-form-item
          field="sku"
          :label-col-style="{ 'justify-content': 'flex-start' }"
          :rules="[{ required: true, message: 'sku必填' }]"
        >
          <template #label>
            关联SKU
            <gj-button @click="skuDialogVisible = true" type="text"
              >选择SKU</gj-button
            >
          </template>
          <div>
            <p v-if="productInfo.sku">{{ productInfo.sku }}</p>
            <p v-else class="empty-sku">暂未关联SKU</p>
          </div>
        </gj-form-item>
      </div>
      <!-- SPU -->
      <div class="squre-line mb8" v-if="productInfo.specsType === 2">
        <gj-form-item
          field="spu"
          :label-col-style="{ 'justify-content': 'flex-start' }"
          :rules="[{ required: true, message: 'spu必填' }]"
        >
          <template #label>
            SPU
            <gj-button @click="spuDialogVisible = true" type="text"
              >选择SPU</gj-button
            >
          </template>
          <div>
            <p v-if="productInfo.spu">{{ productInfo.spu }}</p>
            <p v-else class="empty-sku">暂未关联SPU</p>
          </div>
        </gj-form-item>
      </div>

      <div class="mb16">
        <gj-row class="mb8">
          <gj-col :span="24">
            <gj-form-item
              field="titleList"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              :validate-trigger="validateTriggerOpt"
              :rules="[{ required: true, message: '产品标题必填' }]"
            >
              <template #label>
                <span>
                  产品标题
                  <gj-button type="text" @click="openMtCenterTitle"
                    >素材中心</gj-button
                  >
                </span>
              </template>
              <gj-input
                v-model="productInfo.titleList"
                :max-length="255"
                placeholder="请输入"
                allow-clear
                show-word-limit
              />
            </gj-form-item>
          </gj-col>
        </gj-row>
        <gj-row>
          <gj-col :span="8" style="padding-right: 24px">
            <gj-form-item
              field="msku"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              :validate-trigger="validateTriggerOpt"
              :rules="[{ required: true, message: '店铺SKU必填' }]"
            >
              <template #label>
                店铺SKU
                <gj-button type="text" @click="skuRule">自动生成</gj-button>
              </template>
              <gj-input
                v-model="productInfo.msku"
                :max-length="255"
                placeholder="请输入"
                allow-clear
                show-word-limit
              />
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item
              field="people"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="商品保存状况"
            >
              <gj-radio-group v-model="productInfo.condition">
                <gj-radio :value="1">全新</gj-radio>
                <gj-radio :value="2">二手</gj-radio>
              </gj-radio-group>
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>

      <div class="squre-line mb16">
        <gj-row class="mb8">
          <gj-col>
            <gj-form-item
              label="预购"
              :label-col-style="{ 'justify-content': 'flex-start' }"
            >
              <gj-radio-group v-model="productInfo.preOrderVal">
                <gj-radio :value="1"
                  >我将在3天内发货（不包括公共假期和快递服务休息日）</gj-radio
                >
                <gj-radio :value="2" class="pre-order-day">
                  <div class="txt">
                    <span class="need">我需要</span>
                    <gj-input-number
                      v-model="productInfo.preOrderDay"
                      :placeholder="请输入"
                      min="5"
                      max="10"
                      style="width: 125px"
                      @change="regInput(productInfo.preOrderDay)"
                    >
                    </gj-input-number>
                    <span>出货天数（您可以填写5至10）</span>
                  </div>
                </gj-radio>
              </gj-radio-group>
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>

      <!-- <VideoUrl ref="videoRef" pageType="draft" />
      <MarketingPicture ref="marketPictureRef" pageType="draft" /> -->
    </gj-form>
    <!-- 彈框 -->
    <gj-modal :visible="formDialogVisible" unmountOnClose>
      <template #title>提示</template>
      <div>切换分类后会清空下方编辑区域的所有信息，是否继续</div>
      <template #footer>
        <gj-button shape="round" @click="handleClose">取消</gj-button>
        <gj-button shape="round" type="primary" @click="handelSubmit"
          >确定</gj-button
        >
      </template>
    </gj-modal>

    <SelectSku
      v-if="productInfo.specsType !== 2"
      v-model:visible="skuDialogVisible"
      @confirm="setSku"
    />
    <SelectSpu @confirm="setSpu" v-model:visible="spuDialogVisible" v-else />

    <VariantInfo
      v-if="productInfo.specsType === 2"
      :name="变体信息"
      :related-skus="relatedSkus"
      ref="variantInfoRef"
    ></VariantInfo>

    <TradePrice ref="tradePriceRef" :type="productInfo.specsType"></TradePrice>

    <mtCenterTitle
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      @confirm="confirm"
      @close="cancel"
    />
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  nextTick,
  defineComponent,
} from "vue";
import { useStore } from "vuex";
import { GjMessage } from "@gj/atom";
import { M_T } from "@/store/mutationsTypes";
import { validateTriggerOpt } from "@/utils/common";
import { getSkuListBySpu, getSkuRule } from "@/api/public";
import { setForm2 } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
import { getShopeeCategories } from "@/api/published/shopee";
import SelectSku from "@/components/SelectSku.vue";
import SelectSpu from "@/components/SelectSpu.vue";
import VariantInfo from "@pagesSystem/published/shopee/components/publishedDraft/VariantInfo.vue";
import TradePrice from "@pagesSystem/published/shopee/components/publishedDraft/TradePrice.vue";
import mtCenterTitle from "@pagesSystem/published/materialCenter/modal/title.vue";
/* import VideoUrl from '../common/VideoUrl.vue';
import MarketingPicture from '../common/MarketingPicture.vue'; */
import { reg } from "@/utils/reg";

const DEFAULT_PRODUCT_TYPE = 1;
export default defineComponent({
  components: {
    SvgIcon,
    SelectSku,
    SelectSpu,
    VariantInfo,
    TradePrice,
    mtCenterTitle,
    /* VideoUrl,
    MarketingPicture, */
  },
  emits: ["spu-change", "clear-data", "specs-change"],
  setup(props, { emit }) {
    let newData = "";
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const key = "productInfo";
    const data = reactive({
      [key]: {
        shopeeType: "",
        lazadaLabel: "",
        msku: "",
        sku: "",
        spu: "",
        specsType: DEFAULT_PRODUCT_TYPE,
        titleList: "",
        platformCategories: [],
        condition: 1,
        preOrderVal: 1,
        preOrderDay: "",
      },
      formDialogVisible: false,
      lazadaTypeOptions: [],
      skuDialogVisible: false,
      spuDialogVisible: false,
      relatedSkus: [],
      dialogVisible: false,
    });

    const validate = () => {
      return proxy.$refs.productInfoFormRef.validate();
    };
    const resetFields = () => {
      proxy.$refs.productInfoFormRef.resetFields();
    };

    const clearSelfData = () => {
      const list = data[key];
      Object.keys(list).forEach((key) => {
        switch (key) {
          case "specsType":
            list[key] = DEFAULT_PRODUCT_TYPE;
            break;
          case "shopeeType":
            break;
          default:
            list[key] = "";
            break;
        }
      });
      resetFields();
    };

    const saveStoreData = () => {
      // 将数据保存store
      const params = {
        [key]: data[key],
      };
      store.commit(M_T.PARAMS_QUERY, params);
    };

    const switchCallback = () => {
      saveStoreData();
      // 请求数据
      /* const param = {
        siteId: store.getters.getParams?.basicInfoLz?.siteId,
        categoryId: data[key].shopeeType,
      }; */
      /* const propertyMapLazada = {
        mandatoryItem: [], // 必填属性
        advancedIsKeyPropItem: [], // 选填属性
        otherItem: [], // 其他属性
        salePropItem: [], // 可做变体属性
        warrantyItem: [], //保修信息属性
        packageItem: [], //包装信息属性
      }; */
      /* getCategoryAttribute(param)
        .then((res) => {
          const productInfoNameMap = [
            'package_width',
            'package_length',
            'package_height',
            'package_weight',
            'name',
            'special_price',
            'special_to_date',
            'special_from_date',
            'tax_class',
            'SellerSku',
            'price',
          ];
          const warrantyNameMap = [
            'warranty_type',
            'product_warranty_en',
            'warranty',
          ];
          const packageNameMap = ['package_content', 'Hazmat'];
          const prodcutAttributeList = res.data;
          prodcutAttributeList.forEach((item) => {
            if (
              item.name === 'video' ||
              productInfoNameMap.includes(item.name) ||
              item.inputType === 'richText' ||
              item.inputType === 'img'
            ) {
              // console.log('continue');
            } else if (warrantyNameMap.includes(item.name)) {
              propertyMapLazada.warrantyItem.push(item);
            } else if (packageNameMap.includes(item.name)) {
              propertyMapLazada.packageItem.push(item);
            } else if (item.mandatory === 1) {
              propertyMapLazada.mandatoryItem.push(item);
            } else if (item.advancedIsKeyProp === 1) {
              propertyMapLazada.advancedIsKeyPropItem.push(item);
            } else if (item.saleProp === 1) {
              propertyMapLazada.salePropItem.push(item);
            } else {
              propertyMapLazada.otherItem.push(item);
            }
          });
        })
        .finally(() => {
          store.commit(M_T.COMMODITY_PROPERTY, propertyMapLazada);
        }); */
    };

    const handleClose = () => {
      data.formDialogVisible = false;
    };
    const handelSubmit = () => {
      data.formDialogVisible = false;
      nextTick(() => {
        data[key].shopeeType = newData;
        clearSelfData();
        emit("clear-data");
        switchCallback();
      });
    };
    const loadMore = (option, done) => {
      const params = {
        site: store.getters.getParams.basicInfo?.siteId,
        parentId: option.value,
      };
      getShopeeCategories(params).then((res) => {
        let nodes = processOptData(res.data);
        done(nodes);
      });
    };

    const processOptData = (arr) => {
      return arr.map((item) => ({
        label: item.original_category_name,
        value: item.category_id,
        isLeaf: !item.has_children,
      }));
    };

    const getCategoryData = (siteId, isRefresh) => {
      if (isRefresh && data[key].shopeeType) {
        clearSelfData();
        saveStoreData();
        emit("clear-data");
      }
      if (siteId) {
        const params = {
          site: siteId,
          parentId: 0,
        };
        getShopeeCategories(params)
          .then((res) => {
            data.lazadaTypeOptions = processOptData(res.data || []);
          })
          .catch(() => {
            data.lazadaTypeOptions = [];
          });
      }
    };

    const specsTypeChange = () => {
      saveStoreData();
    };

    const handleChange = (path) => {
      if (data[key].shopeeType) {
        data.formDialogVisible = true;
        newData = path;
      } else {
        data[key].shopeeType = path;
        switchCallback();
      }
    };
    const submitForm = () => {
      proxy.$refs.tradePriceRef?.submitForm();

      return setForm2(proxy, key, data[key], "productInfoFormRef");
    };

    const setPageData = (respData) => {
      if (respData.specsType === 2) {
        data[key].spu = respData.spu;
        // 请求
        getSkuListBySpu({ spu: respData.spu }).then((res) => {
          data.relatedSkus = res.data;
          emit("spu-change", data.relatedSkus);
        });
      } else {
        data[key].sku = respData.spu;
      }
      if (respData.siteCode) {
        getCategoryData(respData.siteCode);
      }
      // label
      data[key].lazadaLabel = respData.platformCategoryName;
      // respData.platformCategories?.map((item) => item.name).join('/') || '';
      data[key].platformCategories = respData.platformCategories || [];
      data[key].shopeeType = respData.platformCategoryId;
      data[key].titleList = respData.defaultTitle;
      data[key].msku = respData.msku;
      data[key].specsType = respData.specsType;
      data[key].condition = respData.condition == "NEW" ? 1 : 2;
      if (respData.preOrder) {
        data[key].preOrderVal = respData.preOrder.preOrder === true ? 2 : 1;
      }
      if (respData.preOrder && respData.preOrder.preOrder === true) {
        data[key].preOrderDay = respData.preOrder.daysToShip;
        // data[key].oldPreOrderDay = respData.preOrder.days_to_ship;
      }

      switchCallback();
      proxy.$refs.tradePriceRef?.setPageData(respData);

      /* proxy.$refs.videoRef.setPageData(respData);
      proxy.$refs.marketPictureRef.setPageData(respData); */
    };

    const setSku = (sku) => {
      data[key].sku = sku;
      let skuObj = {
        type: "sku",
        value: sku,
      };
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_PICTURE, skuObj);
      // 保存数据到store
      saveStoreData();
      // 再次验证
      proxy.$refs.productInfoFormRef.validateField("sku");
    };

    const setSpu = (spu) => {
      data[key].spu = spu;
      let spuObj = {
        type: "spu",
        value: spu,
      };
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_PICTURE, spuObj);
      // 保存数据到store
      saveStoreData();
      // 再次验证
      proxy.$refs.productInfoFormRef.validateField("spu");
      getSkuListBySpu({ spu }).then((res) => {
        data.relatedSkus = res.data;
        emit("spu-change", data.relatedSkus);
      });
    };

    const skuRule = () => {
      const shopCode = store.getters.getParams?.basicInfo?.shopId;
      getSkuRule({ platformCode: "SHOPEE", shopCode })
        .then((res) => {
          data[key].msku = res.data.parentRuleStr;
        })
        .finally(() => {
          // 再次验证
          proxy.$refs.productInfoFormRef.validateField("msku");
        });
    };

    const format = (options) => {
      const labels = options.map((option) => option.label);
      data[key].platformCategories = options.map((item) => {
        return {
          id: item.value,
          name: item.label,
        };
      });
      store.dispatch(
        proxy.$mt.GOODS_INFO_EBAY_CATEGORYID,
        data[key].shopeeType
      );
      return labels.join("/");
    };

    const openMtCenterTitle = () => {
      data.dialogVisible = true;
    };

    const confirm = (val) => {
      if (val.length > 0) {
        data[key].titleList = val[0].content;
      }
      data.dialogVisible = false;
      // 再次验证
      proxy.$refs.productInfoFormRef.validateField("titleList");
    };

    const cancel = () => {
      data.dialogVisible = false;
    };

    // 校验出货天数
    const regInput = (v) => {
      let res = reg.integer5to10.test(v);
      if (!res) {
        data.productInfo.preOrderDay = "";
        console.log(data.productInfo.preOrderDay, "vvvvv");
        return GjMessage.error("只可以填写5至10之间的整数");
      }
    };

    return {
      ...toRefs(data),
      validateTriggerOpt,
      validate,
      resetFields,
      handleClose,
      handelSubmit,
      getCategoryData,
      loadMore,
      specsTypeChange,
      handleChange,
      submitForm,
      setPageData,
      setSku,
      setSpu,
      skuRule,
      format,
      openMtCenterTitle,
      confirm,
      cancel,
      regInput,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
.pre-order-day {
  /deep/.arco-radio-label {
    display: inline-block;
    position: relative;
    top: -3px;
  }
  display: inline-block;
  .txt {
    display: flex;
    span {
      display: inline-block;
      line-height: 32px;
    }
    .need {
      width: 37px;
      padding-right: 3px;
    }
    /* :nth-child(1)span {
    } */
    :nth-child(2) {
      height: 32px;
      margin-right: 5px;
    }
    :nth-child(3) {
      width: 320px;
    }
  }
}
</style>
