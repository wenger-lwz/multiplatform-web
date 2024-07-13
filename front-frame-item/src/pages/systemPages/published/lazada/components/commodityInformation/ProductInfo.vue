<template>
  <div class="product-info" id="productInfo-lz">
    <h2 class="title">产品信息</h2>
    <gj-form
      ref="productInfoFormRef"
      class="product-info-form"
      :model="productInfo"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div class="mb6">
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item
              :label-col-style="{ 'justify-content': 'flex-start' }"
            >
              <template #label>
                lazada分类
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
                placeholder="请选择lazada分类"
                :format-label="format"
                :options="lazadaTypeOptions"
                :model-value="productInfo.lazadaType"
                :input-value="productInfo.lazadaLabel"
                :load-more="loadMore"
                :trigger-props="{
                  updateAtScroll: true,
                }"
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
      <div class="squre-line mb16" v-if="productInfo.specsType !== 2">
        <gj-form-item
          field="sku"
          :label-col-style="{ 'justify-content': 'flex-start' }"
          :rules="[{ required: true, message: 'sku必填' }]"
        >
          <template #label>
            SKU
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
      <div class="squre-line mb16" v-if="productInfo.specsType === 2">
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

      <!-- 標題 -->
      <ProductTitle v-model:titleList="productInfo.titleList" class="mb8" />

      <div class="mb6" v-if="productInfo.specsType !== 2">
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item
              label="建议售价"
              :label-col-style="{ 'justify-content': 'flex-start' }"
            >
              <gj-input-number
                allow-clear
                hide-button
                placeholder="请输入"
                :precision="2"
                :max="MAX_NUM_15"
                v-if="!isSiteIdCB"
                v-model="productInfo.singleProduct.price"
              >
                <template #prefix>{{ recommendPriceUnit }}</template>
              </gj-input-number>
              <PopupRecommendPrice
                v-else
                v-model:globaRecommendPrice="productInfo.globaRecommendPrice"
              />
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="包装重量"
            >
              <gj-input-number
                :hide-button="true"
                :precision="3"
                :max="MAX_NUM_20"
                placeholder="请输入"
                allow-clear
                v-model="productInfo.singleProduct.weight"
              >
                <template #suffix> kg </template>
              </gj-input-number>
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="尺寸(单位：CM)"
            >
              <gj-input-number
                placeholder="请输入"
                :precision="3"
                :max="MAX_NUM_110"
                :hide-button="true"
                v-model="productInfo.singleProduct.long"
              >
                <template #prefix> 长 </template>
              </gj-input-number>
              <span class="input-seperate">*</span>
              <gj-input-number
                placeholder="请输入"
                :precision="3"
                :max="MAX_NUM_110"
                :hide-button="true"
                v-model="productInfo.singleProduct.width"
              >
                <template #prefix> 宽 </template>
              </gj-input-number>
              <span class="input-seperate">*</span>
              <gj-input-number
                placeholder="请输入"
                :precision="3"
                :max="MAX_NUM_110"
                :hide-button="true"
                v-model="productInfo.singleProduct.height"
              >
                <template #prefix> 高 </template>
              </gj-input-number>
            </gj-form-item>
          </gj-col>
        </gj-row>
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item
              label="Taxes"
              :label-col-style="{ 'justify-content': 'flex-start' }"
            >
              <gj-select
                placeholder="请选择"
                allow-clear
                :trigger-props="{
                  updateAtScroll: true,
                }"
                v-model="productInfo.singleProduct.taxes"
              >
                <gj-option>default</gj-option>
              </gj-select>
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>
      <VideoUrl ref="videoRef" />
      <MarketingPicture ref="marketPictureRef" />
    </gj-form>
    <!-- 彈框 -->
    <gj-modal :visible="formDialogVisible" unmountOnClose>
      <template #title>提示</template>
      <div>切换分类后会清空下方编辑区域的所有信息，是否继续</div>
      <template #footer>
        <gj-button @click="handleClose">取消</gj-button>
        <gj-button type="primary" @click="handelSubmit">确定</gj-button>
      </template>
    </gj-modal>
    <SelectSku v-model:visible="skuDialogVisible" @confirm="setSku"></SelectSku>
    <SelectSpu @confirm="setSpu" v-model:visible="spuDialogVisible"></SelectSpu>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  computed,
  defineComponent,
} from "vue";
import { useStore } from "vuex";
import { tranStrToNumber } from "@/utils/common";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import SvgIcon from "@/components/SvgIcon";
import { getSkuListBySpu } from "@/api/public";
import { getCategoryById, getCategoryAttribute } from "@/api/published/lazada";
import ProductTitle from "../common/ProductTitle.vue";
import SelectSku from "@/components/SelectSku.vue";
import SelectSpu from "@/components/SelectSpu.vue";
import VideoUrl from "../common/VideoUrl.vue";
import MarketingPicture from "../common/MarketingPicture.vue";
import PopupRecommendPrice from "../common/PopupRecommendPrice.vue";

const DEFAULT_PRODUCT_TYPE = 1;
const MAX_NUM_15 = Number("9".repeat(15)) - 0.01;
const MAX_NUM_20 = 20;
const MAX_NUM_110 = 110;
// 跨境站点用my
const SITEID_CB = "my";

export default defineComponent({
  inheritAttrs: false,
  components: {
    SvgIcon,
    ProductTitle,
    SelectSku,
    SelectSpu,
    VideoUrl,
    MarketingPicture,
    PopupRecommendPrice,
  },
  emits: ["spu-change", "clear-data", "specs-change"],
  setup(props, { emit }) {
    let newData = "";
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const key = "productInfo";
    const data = reactive({
      [key]: {
        lazadaType: "",
        lazadaLabel: "",
        sku: "",
        spu: "",
        specsType: DEFAULT_PRODUCT_TYPE,
        singleProduct: {
          long: null,
          width: null,
          height: null,
          price: null,
          weight: null,
          taxes: "",
        },
        titleList: [{ titleDesc: "" }],
        platformCategories: [],
        globaRecommendPrice: {},
      },
      formDialogVisible: false,
      lazadaTypeOptions: [],
      skuDialogVisible: false,
      spuDialogVisible: false,
      relatedSkus: [],
    });

    const recommendPriceUnit = computed(() => {
      return store.getters.getParams?.basicInfoLz?.recommendPriceUnit;
    });

    const isSiteIdCB = computed(() => {
      return store.getters.getParams?.basicInfoLz?.siteId === "cb";
    });

    const getSiteId = (siteId) => {
      return siteId === "cb" ? SITEID_CB : siteId;
    };

    const validate = () => {
      return proxy.$refs.productInfoFormRef.validate();
    };

    const clearValidate = () => {
      proxy.$refs.productInfoFormRef.clearValidate();
    };

    const clearSelfData = () => {
      const list = data[key];
      Object.keys(list).forEach((key) => {
        switch (key) {
          case "specsType":
            list[key] = DEFAULT_PRODUCT_TYPE;
            break;
          case "singleProduct":
            list[key] = {
              long: null,
              width: null,
              height: null,
              price: null,
              weight: null,
              taxes: "",
            };
            break;
          case "titleList":
            list[key] = [{ titleDesc: "" }];
            break;
          case "lazadaType":
            break;
          case "globaRecommendPrice":
            list[key] = {};
            break;
          default:
            list[key] = "";
            break;
        }
      });
      clearValidate();
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
      if (!data[key].lazadaType) {
        return;
      }
      const param = {
        siteId: getSiteId(store.getters.getParams?.basicInfoLz?.siteId),
        categoryId: data[key].lazadaType,
      };
      const propertyMapLazada = {
        mandatoryItem: [], // 必填属性
        advancedIsKeyPropItem: [], // 选填属性
        otherItem: [], // 其他属性
        salePropItem: [], // 可做变体属性
        warrantyItem: [], //保修信息属性
        packageItem: [], //包装信息属性
      };
      getCategoryAttribute(param)
        .then((res) => {
          const productInfoNameMap = [
            "package_width",
            "package_length",
            "package_height",
            "package_weight",
            "name",
            "special_price",
            "special_to_date",
            "special_from_date",
            "tax_class",
            "SellerSku",
            "price",
          ];
          const warrantyNameMap = [
            "warranty_type",
            "product_warranty_en",
            "warranty",
          ];
          const packageNameMap = ["package_content", "Hazmat"];
          const prodcutAttributeList = res.data;
          prodcutAttributeList.forEach((item) => {
            if (
              item.name === "video" ||
              productInfoNameMap.includes(item.name) ||
              item.inputType === "richText" ||
              item.inputType === "img"
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
        });
    };

    const handleClose = () => {
      data.formDialogVisible = false;
    };

    const handelSubmit = () => {
      data.formDialogVisible = false;
      data[key].lazadaType = newData;
      clearSelfData();
      emit("clear-data");
      switchCallback();
    };

    const processOptData = (arr) => {
      return arr.map((item) => ({
        label: item.categoryName,
        value: item.lazadaCategoryId,
        isLeaf: item.leaf,
      }));
    };

    const loadMore = (option, done) => {
      const params = {
        siteId: getSiteId(store.getters.getParams.basicInfoLz?.siteId),
        parentId: option.value,
      };
      getCategoryById(params).then((res) => {
        let nodes = processOptData(res.data);
        done(nodes);
      });
    };

    const getCategoryData = (siteId, isRefresh) => {
      if (isRefresh && data[key].lazadaType) {
        data[key].lazadaType = "";
        data[key].lazadaLabel = "";
        clearSelfData();
        saveStoreData();
        emit("clear-data");
      }
      if (siteId) {
        const params = {
          siteId: getSiteId(siteId),
          parentId: 0,
        };
        getCategoryById(params)
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
      emit("specs-change", data[key].specsType);
    };

    const handleChange = (path) => {
      if (data[key].lazadaType) {
        data.formDialogVisible = true;
        newData = path;
      } else {
        data[key].lazadaType = path;
        switchCallback();
      }
    };

    const submitForm = () => {
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
      data[key].lazadaLabel =
        respData.platformCategories?.map((item) => item.name).join("/") || "";
      data[key].platformCategories = respData.platformCategories || [];
      data[key].lazadaType = respData.platformCategoryId;

      data[key].singleProduct = {
        long: tranStrToNumber(respData.logisticsSizeLong),
        width: tranStrToNumber(respData.logisticsSizeWide),
        height: tranStrToNumber(respData.logisticsSizeHigh),
        price: tranStrToNumber(respData.recommendPrice),
        weight: tranStrToNumber(respData.logisticsWeight),
        taxes: respData.taxes,
      };
      if (Array.isArray(respData.titles) && respData.titles.length > 0) {
        data[key].titleList = [];
        respData.titles?.forEach((value) => {
          data[key].titleList.push({ titleDesc: value });
        });
      }
      data[key].specsType = respData.specsType;
      // 跨境回显, globalRelations不包含cb的
      if (isSiteIdCB.value && data[key].specsType !== 2) {
        respData.globalRelations?.forEach((item) => {
          data[key].globaRecommendPrice[item.siteCode] = item.price;
        });
        data[key].globaRecommendPrice["cb"] = respData.recommendPrice;
      }
      switchCallback();
      proxy.$refs.videoRef.setPageData(respData);
      proxy.$refs.marketPictureRef.setPageData(respData);
    };

    const setSku = (sku) => {
      data[key].sku = sku;
      // 保存数据到store
      saveStoreData();
      // 再次验证
      proxy.$refs.productInfoFormRef.validateField("sku");
    };

    const setSpu = (spu) => {
      data[key].spu = spu;
      // 保存数据到store
      saveStoreData();
      // 再次验证
      proxy.$refs.productInfoFormRef.validateField("spu");
      getSkuListBySpu({ spu }).then((res) => {
        data.relatedSkus = res.data;
        emit("spu-change", data.relatedSkus);
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
      return labels.join("/");
    };

    return {
      ...toRefs(data),
      MAX_NUM_15,
      MAX_NUM_20,
      MAX_NUM_110,
      recommendPriceUnit,
      isSiteIdCB,
      validate,
      clearValidate,
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
      format,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
.squre-line {
  padding-bottom: 6px;
}
</style>
