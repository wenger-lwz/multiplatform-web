<template>
  <div class="product-info" id="productInfo">
    <h2 class="title mb16">产品信息</h2>
    <gj-form
      ref="productInfoFormRef"
      :model="productInfo"
      class="product-info-form"
      label-align="left"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <!-- <div class="squre-line mb8">
        <div
          class="title-form-item mb16"
          v-for="(item, index) in productInfo.titleList"
          :key="index"
        >
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            field="titleDescript"
            :label="index >= 1 ? '' : '产品标题'"
            :rules="index >= 1 ? undefined : titleRules"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-input
              v-model="item.titleDesc"
              :max-length="255"
              placeholder="请输入"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
          <div class="btn-svg">
            <SvgIcon
              svgClass="addTitle"
              :width="24"
              v-show="index === productInfo.titleList.length - 1"
              @click="addTitile"
            ></SvgIcon
            ><SvgIcon
              v-show="productInfo.titleList.length > 1"
              svgClass="subtract"
              :width="24"
              @click="removeTitile(index)"
            ></SvgIcon>
          </div>
        </div>
      </div> -->
      <ProductTitle
        v-model:titleList="productInfo.titleList"
        :class="productInfo.productType === 2 ? 'mb16' : 'mb8'"
      />
      <div class="mb8">
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item
              field="platformCategoryId"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              :rules="[{ required: true, message: 'Shopee分类必填' }]"
            >
              <template #label>Shopee分类</template>
              <gj-cascader
                :format-label="format"
                id="shopeeCategory"
                :options="categories"
                v-model="productInfo.platformCategoryId"
                :input-value="productInfo.platformCategoryName"
                :placeholder="placeholder"
                :load-more="loadMore"
                :popup-visible="popupVisible"
                ref="shopeeCategory"
                @focus="init"
                @blur="popupVisible = false"
                @change="categoryChange"
              />
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item
              field="people"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="商品规格"
            >
              <gj-radio-group v-model="productInfo.productType">
                <gj-radio :value="1">单品</gj-radio>
                <gj-radio :value="2">变体</gj-radio>
              </gj-radio-group>
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item
              field="people"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="建议售价"
              v-model="productInfo.singleProduct.price"
            >
              <gj-input-number
                placeholder="请输入"
                v-model="productInfo.singleProduct.price"
                allow-clear
                min="0"
              >
                <template #prefix>{{
                  recommendPriceUnit ? recommendPriceUnit : "$"
                }}</template>
              </gj-input-number>
            </gj-form-item>
          </gj-col>
        </gj-row>
      </div>
      <div class="mb16">
        <div class="mb8">
          <gj-row :gutter="24">
            <gj-col :span="8">
              <gj-form-item
                field="people"
                :label-col-style="{ 'justify-content': 'flex-start' }"
                label="重量"
                v-model="productInfo.singleProduct.weight"
              >
                <gj-input-number
                  v-model="productInfo.singleProduct.weight"
                  placeholder="请输入"
                  allow-clear
                  min="0"
                  max="1000000"
                >
                  <template #suffix> Kg </template>
                </gj-input-number>
              </gj-form-item>
            </gj-col>
            <gj-col :span="8">
              <gj-form-item
                field="people"
                :label-col-style="{ 'justify-content': 'flex-start' }"
                label="商品保存状况"
              >
                <gj-radio-group v-model="productInfo.singleProduct.condition">
                  <gj-radio :value="1">全新</gj-radio>
                  <gj-radio :value="2">二手</gj-radio>
                </gj-radio-group>
              </gj-form-item>
            </gj-col>
            <gj-col :span="8">
              <gj-form-item
                :label-col-style="{ 'justify-content': 'flex-start' }"
                label="包裹尺寸(单位：CM)"
              >
                <gj-input-number
                  v-model="productInfo.singleProduct.long"
                  :style="{ width: '32%' }"
                  placeholder="请输入"
                  min="0"
                  max="1000000"
                >
                  <template #prefix> 长 </template>
                </gj-input-number>
                <span class="input-seperate">*</span>
                <gj-input-number
                  v-model="productInfo.singleProduct.width"
                  :style="{ width: '32%' }"
                  placeholder="请输入"
                  min="0"
                  max="1000000"
                >
                  <template #prefix> 宽 </template>
                </gj-input-number>
                <span class="input-seperate">*</span>
                <gj-input-number
                  v-model="productInfo.singleProduct.height"
                  :style="{ width: '32%' }"
                  placeholder="请输入"
                  min="0"
                  max="1000000"
                >
                  <template #prefix> 高 </template>
                </gj-input-number>
              </gj-form-item>
            </gj-col>
          </gj-row>
        </div>
      </div>
      <!-- SKU -->
      <div v-if="productInfo.productType === 1" class="squre-line mb16">
        <gj-form-item
          field="sku"
          :label-col-style="{ 'justify-content': 'flex-start' }"
          :rules="[{ required: true, message: 'sku必填' }]"
        >
          <template #label>
            关联SKU
            <gj-button @click="skuModalVisible = true" type="text" size="mini"
              >选择SKU</gj-button
            >
          </template>
          <div>
            <p v-if="productInfo.sku">{{ productInfo.sku }}</p>
            <p v-else style="color: #808197">暂未关联SKU</p>
          </div>
        </gj-form-item>
      </div>

      <div v-else class="squre-line mb16">
        <gj-form-item
          field="spu"
          :label-col-style="{ 'justify-content': 'flex-start' }"
          :rules="[{ required: true, message: 'spu必填' }]"
        >
          <template #label>
            关联SPU
            <gj-button @click="spuModalVisible = true" type="text" size="mini"
              >选择SPU</gj-button
            >
          </template>
          <div>
            <p v-if="productInfo.spu">{{ productInfo.spu }}</p>
            <p v-else style="color: #808197">暂未关联SPU</p>
          </div>
        </gj-form-item>
      </div>

      <select-sku
        v-if="productInfo.productType === 1"
        v-model:visible="skuModalVisible"
        @confirm="setSku"
      />
      <!-- SPU -->
      <select-spu v-else v-model:visible="spuModalVisible" @confirm="setSpu" />

      <VariantInfo
        v-if="productInfo.productType === 2"
        :name="变体信息"
        :related-skus="relatedSkus"
        ref="variantInfoRef"
      ></VariantInfo>
    </gj-form>

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
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  nextTick,
  watch,
  computed,
  onBeforeMount,
} from "vue";
import { useStore } from "vuex";
import { validateTriggerOpt } from "@common";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import { tranStrToNumber } from "@/utils/common";
import { getSkuListBySpu } from "@/api/public";
// import SvgIcon from '@/components/SvgIcon';
import SelectSku from "@/components/SelectSku.vue";
import SelectSpu from "@/components/SelectSpu.vue";
import VariantInfo from "@pagesSystem/published/shopee/components/VariantInfo.vue";
import { getShopeeCategories } from "@/api/published/shopee.js";
import ProductTitle from "./common/ProductTitle.vue";

export default {
  components: {
    // SvgIcon,
    SelectSku,
    SelectSpu,
    VariantInfo,
    ProductTitle,
  },
  emits: ["spu-change", "clear-data", "specs-change"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const key = "productInfo";
    const data = reactive({
      placeholder: "请选择分类",
      popupVisible: false,
      categories: [],
      validateTriggerOpt,
      skuModalVisible: false,
      spuModalVisible: false,
      relatedSkus: [],
      [key]: {
        titleDescript: "",
        shopeeType: "",
        sku: "",
        spu: "",
        productType: 1,
        singleProduct: {
          long: null,
          width: null,
          height: null,
          price: null,
          weight: null,
          condition: 1,
        },
        titleList: [{ titleDesc: "" }],
        videoList: [{ videoSrc: "" }],
        platformCategoryId: "",
        platformCategoryName: "",
        platformCategories: [],
      },

      tableData: [{ key: 1 }],
      tableData2: [{ key: 1 }],
      rowSelection: {
        type: "checkbox",
        showCheckedAll: true,
      },
      titleRules: [
        {
          required: true,
          message: "标题为必填",
          validator: (value, cb) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                if (
                  !data[key].titleList.find((item) => item.titleDesc.trim())
                ) {
                  cb("标题为必填");
                }
                resolve();
              }, 0);
            });
          },
        },
      ],
      shopeeTypeOpt: [
        { shopeeTypeCode: 1, shopeeTypeName: "分类一" },
        { shopeeTypeCode: 2, shopeeTypeName: "分类二" },
        { shopeeTypeCode: 3, shopeeTypeName: "分类三" },
      ],
      formDialogVisible: false,
      hasOverHandlerFlag: false,
      shopeeTypeOptions: [
        { shopeeTypeCode: 1, shopeeTypeName: "分类一" },
        { shopeeTypeCode: 2, shopeeTypeName: "分类二" },
        { shopeeTypeCode: 3, shopeeTypeName: "分类三" },
      ],
      siteId: "",
    });

    const cascaderProps = {
      popupContainer: "#multiplatform-web",
      allowSearch: true,
      allowClear: true,
    };

    const addTitile = () => {
      data[key].titleList.push({ titleDesc: "" });
    };

    const removeTitile = (index) => {
      data[key].titleList[index].titleDesc = "";
      data[key].titleList.splice(index, 1);
    };

    const addVideoList = () => {
      data[key].videoList.push({ videoSrc: "" });
    };

    const removeVideoList = (index) => {
      data[key].videoList[index].videoSrc = "";
      data[key].videoList.splice(index, 1);
    };

    const previewVideo = () => {};
    const selectSku = () => {
      data[key].sku = "sku111111";
    };
    const selectSpu = () => {
      data[key].spu = "spu222222";
    };
    const select = () => {};
    const selectAll = () => {};

    const recommendPriceUnit = computed(() => {
      return store.getters.getParams?.basicInfo?.recommendPriceUnit;
    });

    const validate = () => {
      return proxy.$refs.productInfoFormRef.validate();
    };
    const resetFields = () => {
      proxy.$refs.productInfoFormRef.resetFields();
    };

    let oldData = "";
    let newData = "";

    const clearData = () => {
      const list = data[key];
      Object.keys(list).forEach((key) => {
        if (key !== "shopeeType") {
          list[key] = "";
        }
      });
      resetFields();
    };

    const switchCallback = () => {
      // 将数据保存store
      const params = {
        [key]: data[key],
      };
      store.commit(M_T.PARAMS_QUERY, params);
      // 请求数据
      /* const param = {
        siteId: store.getters.getParams?.basicInfoLz?.siteId,
        categoryId: data[key].lazadaType,
      } */
      /* const propertyMapLazada = {
        mandatoryItem: [], // 必填属性
        advancedIsKeyPropItem: [], // 选填属性
        otherItem: [], // 其他属性
        salePropItem: [], // 可做变体属性
        warrantyItem: [], //保修信息属性
        packageItem: [], //包装信息属性
      } */

      /*  getCategoryAttribute(param)
        .then((res) => {
          if (res.code === 200) {
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
            ]
            const warrantyNameMap = [
              'warranty_type',
              'product_warranty_en',
              'warranty',
            ]
            const packageNameMap = ['package_content', 'Hazmat']
            const prodcutAttributeList = res.data
            prodcutAttributeList.forEach((item) => {
              if (
                item.name === 'video' ||
                productInfoNameMap.includes(item.name) ||
                item.inputType === 'richText' ||
                item.inputType === 'img'
              ) {
                // console.log('continue');
              } else if (warrantyNameMap.includes(item.name)) {
                propertyMapLazada.warrantyItem.push(item)
              } else if (packageNameMap.includes(item.name)) {
                propertyMapLazada.packageItem.push(item)
              } else if (item.mandatory === 1) {
                propertyMapLazada.mandatoryItem.push(item)
              } else if (item.advancedIsKeyProp === 1) {
                propertyMapLazada.advancedIsKeyPropItem.push(item)
              } else if (item.saleProp === 1) {
                propertyMapLazada.salePropItem.push(item)
              } else {
                propertyMapLazada.otherItem.push(item)
              }
            })
          }
        })
        .finally(() => {
          store.commit(M_T.COMMODITY_PROPERTY, propertyMapLazada)
        }) */
    };

    const handleClose = () => {
      // showDialogFlag = false
      data.hasOverHandlerFlag = true;
      data.formDialogVisible = false;
      data.productInfo.shopeeType = oldData;
      nextTick(() => {
        // showDialogFlag = true
        data.hasOverHandlerFlag = false;
        switchCallback();
      });
    };
    const handelSubmit = () => {
      data.hasOverHandlerFlag = true;
      data.formDialogVisible = false;
      nextTick(() => {
        data[key].shopeeType = newData;

        clearData();
        switchCallback();
      });
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

    const handleChange = (path) => {
      if (data[key].shopeeType) {
        data.formDialogVisible = true;
        newData = path;
      } else {
        data[key].shopeeType = path;
        switchCallback();
      }
    };

    const setSku = (sku) => {
      data[key].sku = sku;
      let skuObj = {
        type: "sku",
        value: sku,
      };
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_PICTURE, skuObj);
    };

    const setSpu = (spu) => {
      data[key].spu = spu;
      let spuObj = {
        type: "spu",
        value: spu,
      };
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_PICTURE, spuObj);
    };

    const clear = () => {
      console.log("clear");
    };

    const loadMore = (option, done) => {
      const params = {
        site: data.siteId || 0,
        parentId: option.value,
      };

      getShopeeCategories(params).then((res) => {
        const data = res?.data ?? [];
        let nodes = [];
        nodes = createTree(data);
        done(nodes);
      });
    };

    const createTree = (data) => {
      let traverse = function (nodes = []) {
        let newArr = [];
        newArr = nodes.map((item) => {
          return {
            value: item.category_id,
            label: item.original_category_name,
            isLeaf: !item.has_children,
            children: item?.children?.length ? traverse(item.children) : null,
          };
        });
        return newArr;
      };
      return traverse(data);
    };

    const siteId = computed(() => store.state.common.shopeeData.siteId);

    // 获取shopee分类数据
    const getCategoryData = (siteId) => {
      if (siteId) {
        const params = {
          site: data.siteId,
          parentId: 0,
        };

        getShopeeCategories(params).then((res) => {
          const d = res?.data ?? [];
          const categories = d.map((category) => {
            return {
              value: category.category_id,
              label: category.original_category_name,
              isLeaf: !category.has_children,
            };
          });
          data.categories = categories;
        });
        /* .catch(() => {
            data.categories = [];
          }); */
      }
    };

    const init = () => {
      console.log(
        store.state.common.shopeeData.siteId,
        "store.state.common.shopeeData.siteId",
        data.siteId
      );
      const s = store.state.common.shopeeData.siteId;
      if (!s) {
        data.placeholder = "请确认是否选择站点";
        return;
      }

      data.siteId = s;
      data.popupVisible = true;
      getCategoryData(data.siteId);
    };
    // init();

    const categoryChange = () => {
      data.popupVisible = false;
      nextTick(() => {
        const d = document
          .querySelector("#shopeeCategory .arco-select-view-input")
          .getAttribute("placeholder");
        data[key].platformCategoryName = d;
      });
      switchCallback();
    };

    const setPageData = (aData) => {
      store.dispatch(M_T.SHOPEE_SITEID, aData.site);

      if (Array.isArray(aData.titles) && aData.titles.length > 0) {
        data[key].titleList = [];
        aData.titles?.forEach((value) => {
          data[key].titleList.push({ titleDesc: value });
        });
      }

      if (aData.specsType === 2) {
        data[key].sku = aData.spu;
        setSpu(aData.spu);

        // 请求
        getSkuListBySpu({ spu: aData.spu }).then((res) => {
          data.relatedSkus = res.data;
          emit("spu-change", data.relatedSkus);
        });
      } else {
        data[key].sku = aData.spu;
        setSku(aData.spu);
      }

      if (aData.site) {
        data.siteId = aData.site;
        getCategoryData(aData.site);
      }
      // label
      /* data[key].platformCategoryId =
        aData.platformCategories?.map((item) => item.name).join('/') || ''; */
      // data[key].platformCategories = aData.platformCategories || [];
      data[key].platformCategoryId = aData.platformCategoryId;
      data[key].platformCategoryType = aData.platformCategoryId;
      /* data[key].platformCategoryName = aData.platformCategoryName; */
      data[key].platformCategoryName =
        aData.platformCategories?.map((item) => item.name).join("/") || "";

      data[key].singleProduct = {
        long: tranStrToNumber(aData.dimension.length),
        width: tranStrToNumber(aData.dimension.width),
        height: tranStrToNumber(aData.dimension.height),
        price: tranStrToNumber(aData.recommendPrice),
        weight: tranStrToNumber(aData.weight),
        condition: aData.condition == "NEW" ? 1 : 2,
      };

      data[key].productType = aData.specsType;
      switchCallback();
      /*  proxy.$refs.videoRef.setPageData(aData);
      proxy.$refs.marketPictureRef.setPageData(aData); */
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

    const submitForm = () => {
      proxy.$refs.variantInfoRef?.submitForm();
      return setForm2(proxy, key, data[key], "productInfoFormRef");
    };

    onBeforeMount(() => {
      data.siteId = store.state.common.shopeeData.siteId;
    });

    return {
      ...toRefs(data),
      addTitile,
      removeTitile,
      addVideoList,
      removeVideoList,
      previewVideo,
      selectSku,
      selectSpu,
      select,
      selectAll,
      validate,
      resetFields,
      handleClose,
      handelSubmit,
      submitForm,
      handleChange,
      setSku,
      setSpu,
      cascaderProps,
      clear,
      loadMore,
      siteId,
      init,
      format,
      categoryChange,
      setPageData,
      recommendPriceUnit,
      getCategoryData,
    };
  },
};
</script>

<style lang="scss" scoped>
.product-info {
  .mb8 {
    margin-bottom: 8px;
  }
  .mb16 {
    margin-bottom: 16px;
  }
  .title {
    padding: 12px 0 2px 0px;
    font-size: 14px;
  }
  .product-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
    .squre-line {
      padding: 12px;
      box-sizing: border-box;
      width: 100%;
      border: 1px solid #e6e6ed;
      border-radius: 8px;
    }
    .arco-form-item {
      margin-bottom: 0;
    }
    .title-form-item {
      display: flex;
      justify-content: space-between;
      &:first-child {
        .btn-svg {
          padding-top: 35px;
          align-items: flex-start;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .input-seperate {
      padding: 0 8px;
    }
    .table-content {
      width: 100%;
    }
    .btn-svg {
      margin-left: 16px;
      width: 56px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      svg:hover {
        cursor: pointer;
      }
    }
    .image-tips {
      font-size: 12px;
      span {
        color: #808197;
      }
    }
    .image-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      .image-box {
        width: 120px;
        height: 120px;
        background: #ccc;
        border-radius: 6px;
      }
    }
  }
}

/deep/.gj-skySelect {
  .arco-modal-body {
    height: inherit !important;
  }
}
</style>
