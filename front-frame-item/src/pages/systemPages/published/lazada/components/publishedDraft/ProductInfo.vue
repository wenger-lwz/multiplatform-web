<template>
  <div class="product-info" id="productInfo-lz">
    <h2 class="title">产品信息</h2>
    <gj-form
      ref="productInfoFormRef"
      class="product-info-form"
      :model="productInfo"
      :rules="rules"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div class="mb16">
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item
              field="lazadaType"
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
              label="规格"
              :label-col-style="{ 'justify-content': 'flex-start' }"
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
          <gj-col :span="8" v-if="productInfo.specsType !== 2">
            <gj-form-item
              field="msku"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              :validate-trigger="validateTriggerOpt"
            >
              <template #label>
                店铺SKU
                <gj-button type="text" @click="skuRule">自动生成</gj-button>
              </template>
              <gj-input
                placeholder="请输入"
                allow-clear
                show-word-limit
                :max-length="MAX_LENGTH"
                v-model="productInfo.msku"
              />
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>
      <!--单品 Lazada SKU -->
      <div
        class="mb16"
        v-if="pageType === 'online' && productInfo.specsType !== 2"
      >
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item
              label="Lazada SKU"
              :label-col-style="{ 'justify-content': 'flex-start' }"
            >
              <div>{{ emptyFilter(lazadaSku) }}</div>
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>
      <!-- SKU -->
      <div class="squre-line mb8" v-if="productInfo.specsType !== 2">
        <gj-form-item
          field="sku"
          :label-col-style="{ 'justify-content': 'flex-start' }"
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
      <div class="squre-line mb8" v-if="productInfo.specsType === 2">
        <gj-form-item
          field="spu"
          :label-col-style="{ 'justify-content': 'flex-start' }"
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
        <gj-row>
          <gj-col :span="24">
            <gj-form-item
              field="titleList"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              :validate-trigger="validateTriggerOpt"
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
                placeholder="请输入"
                allow-clear
                show-word-limit
                :max-length="MAX_LENGTH"
                v-model="productInfo.titleList"
              />
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>

      <VideoUrl ref="videoRef" :pageType="pageType" />
      <MarketingPicture ref="marketPictureRef" :pageType="pageType" />
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

    <SelectSku v-model:visible="skuDialogVisible" @confirm="setSku" />
    <SelectSpu @confirm="setSpu" v-model:visible="spuDialogVisible" />
    <mtCenterTitle
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      @confirm="confirm"
      @close="cancel"
    />
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, defineComponent } from "vue";
import { useStore } from "vuex";
import { M_T } from "@/store/mutationsTypes";
import { emptyFilter } from "@/utils/format";
import { validateTriggerOpt } from "@/utils/common";
import { getSkuListBySpu, getSkuRule } from "@/api/public";
import { setForm2 } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
import { getCategoryById, getCategoryAttribute } from "@/api/published/lazada";
import SelectSku from "@/components/SelectSku.vue";
import SelectSpu from "@/components/SelectSpu.vue";
import mtCenterTitle from "@pagesSystem/published/materialCenter/modal/title.vue";
import VideoUrl from "../common/VideoUrl.vue";
import MarketingPicture from "../common/MarketingPicture.vue";

const DEFAULT_PRODUCT_TYPE = 1;
const MAX_LENGTH = 255;
// 跨境站点用my
const SITEID_CB = "my";

export default defineComponent({
  components: {
    SvgIcon,
    SelectSku,
    SelectSpu,
    mtCenterTitle,
    VideoUrl,
    MarketingPicture,
  },
  props: {
    pageType: {
      type: String,
      default: "",
    },
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
        msku: "",
        sku: "",
        spu: "",
        specsType: DEFAULT_PRODUCT_TYPE,
        titleList: "",
        platformCategories: [],
      },
      formDialogVisible: false,
      lazadaTypeOptions: [],
      skuDialogVisible: false,
      spuDialogVisible: false,
      relatedSkus: [],
      dialogVisible: false,
      lazadaSku: "",
    });

    const rules = {
      lazadaType: [{ required: true, message: "Lazada分类必填" }],
      msku: [{ required: true, message: "店铺SKU必填" }],
      sku: [{ required: true, message: "sku必填" }],
      spu: [{ required: true, message: "spu必填" }],
      titleList: [{ required: true, message: "产品标题必填" }],
    };

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
          case "lazadaType":
            break;
          case "lazadaLabel":
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

    const processOptData = (arr) => {
      return arr.map((item) => ({
        label: item.categoryName,
        value: item.lazadaCategoryId,
        isLeaf: item.leaf,
      }));
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
      data[key].titleList = respData.defaultTitle;
      data[key].msku = respData.msku;
      data[key].specsType = respData.specsType;
      data.lazadaSku = respData.lazadaSku;
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

    const skuRule = () => {
      const shopCode = store.getters.getParams?.basicInfoLz?.shopId;
      getSkuRule({ platformCode: "LAZADA", shopCode })
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
      return labels.join("/");
    };

    const openMtCenterTitle = () => {
      data.dialogVisible = true;
    };

    const confirm = (val) => {
      if (val.length > 0) {
        data[key].titleList = val[0].content?.slice(0, MAX_LENGTH);
      }
      data.dialogVisible = false;
      // 再次验证
      proxy.$refs.productInfoFormRef.validateField("titleList");
    };

    const cancel = () => {
      data.dialogVisible = false;
    };

    return {
      ...toRefs(data),
      MAX_LENGTH,
      emptyFilter,
      validateTriggerOpt,
      rules,
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
      skuRule,
      format,
      openMtCenterTitle,
      confirm,
      cancel,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
</style>
