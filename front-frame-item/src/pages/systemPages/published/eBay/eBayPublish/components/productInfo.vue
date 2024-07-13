<template>
  <div class="product-info" id="productInfo-ebay">
    <h2 class="title mb16">产品信息</h2>
    <gj-form
      ref="productForm"
      :model="productInfo"
      class="product-info-form"
      label-align="left"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div class="squre-line mb8">
        <div
          class="title-form-item mb16"
          v-for="(item, index) in productInfo.titleDescript"
          :key="index"
        >
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            field="titleDescript"
            :label="index >= 1 ? '' : '产品标题'"
            :rules="index >= 1 ? undefined : titleRules"
            :validate-trigger="['change', 'input', 'blur']"
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
              v-show="index === productInfo.titleDescript.length - 1"
              @click="addTitile"
            ></SvgIcon
            ><SvgIcon
              v-show="productInfo.titleDescript.length > 1"
              svgClass="subtract"
              :width="24"
              @click="removeTitile(index)"
            ></SvgIcon>
          </div>
        </div>
      </div>
      <gj-row :gutter="24" class="mb8">
        <gj-col :span="8">
          <gj-form-item field="subtitle" label="副标题(收费)">
            <gj-input
              v-model="productInfo.subtitle"
              :max-length="255"
              placeholder="请输入"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="platformCategoryId"
            :rules="productInfoRules"
            :validate-trigger="['change', 'input', 'blur']"
            label="第一分类"
          >
            <gj-cascader
              :options="options"
              :model-value="productInfo.platformCategoryId"
              :input-value="platformCategoryIdInit"
              placeholder="请选择第一分类"
              :load-more="loadMore"
              :format-label="format"
              @popup-visible-change="getqueryEbayBaseCategory"
              @change="categoryChange"
            />
          </gj-form-item>
        </gj-col>

        <gj-col :span="8">
          <gj-form-item field="secondPlatformCategoryId" label="第二分类(收费)">
            <gj-cascader
              v-model="productInfo.secondPlatformCategoryId"
              :input-value="secondPlatformCategoryIdInit"
              placeholder="请选择第二分类(收费)"
              :options="options"
              :load-more="loadMore"
              :format-label="formatTo"
            />
          </gj-form-item>
        </gj-col>
      </gj-row>
      <gj-row :gutter="24" class="mb8">
        <gj-col :span="8">
          <gj-form-item field="specsType" label="商品规格">
            <gj-radio-group
              v-model="productInfo.specsType"
              @change="setSpecsType"
            >
              <gj-radio value="1">单品</gj-radio>
              <gj-radio value="2" :disabled="specsDisabled">变体</gj-radio>
            </gj-radio-group>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8" v-if="productInfo.specsType == 1">
          <gj-form-item field="recommendPrice" label="建议售价">
            <gj-input
              v-model="productInfo.recommendPrice"
              :max-length="255"
              placeholder="请输入"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
        </gj-col>
        <gj-col
          :span="8"
          style="position: relative"
          v-if="productInfo.specsType == 1 && isUps"
        >
          <!-- 编码三选一 UPC/EAN/ISBN  等接口 -->
          <gj-button
            class="position-abslot"
            @click="getGeneralCode"
            size="small"
            type="text"
          >
            Dose not apply
          </gj-button>
          <gj-form-item field="upcCode" label="UPC编码" v-if="isUpsbool == 0">
            <gj-input
              v-model="productInfo.upcCode"
              placeholder="请选择"
              allow-clear
            >
            </gj-input>
          </gj-form-item>
          <gj-form-item field="isbn" label="ISBN编码" v-if="isUpsbool == 1">
            <gj-input
              v-model="productInfo.isbn"
              placeholder="请选择"
              allow-clear
            >
            </gj-input>
          </gj-form-item>
          <gj-form-item field="eanCode" label="EAN编码" v-if="isUpsbool == 2">
            <gj-input
              v-model="productInfo.eanCode"
              placeholder="请选择"
              allow-clear
            >
            </gj-input>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item field="ebayCondition" label="物品状况">
            <gj-select
              v-model="productInfo.ebayCondition"
              placeholder="请选择"
              allow-clear
              @popup-visible-change="getCondition"
            >
              <gj-option
                v-for="item in conditionListOpt"
                :key="item.conditionId"
                :value="item.conditionId"
                >{{ item.displayName }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
      </gj-row>
      <!-- SKU -->
      <div class="squre-line mb16 mt">
        <gj-form-item
          :field="productInfo.specsType == '1' ? 'sku' : 'spu'"
          :label-col-style="{ 'justify-content': 'flex-start' }"
          :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
        >
          <template #label>
            <span v-if="productInfo.specsType == '1'"
              >关联SKU

              <gj-button
                @click="skuModalVisible = true"
                type="text"
                size="small"
                >选择SKU</gj-button
              >
            </span>

            <span v-if="productInfo.specsType == '2'"
              >关联SPU
              <gj-button
                @click="spuModalVisible = true"
                type="text"
                size="small"
                >选择SPU</gj-button
              >
            </span>
          </template>
          <div>
            <p
              v-if="
                productInfo.specsType == '1' ? productInfo.sku : productInfo.spu
              "
            >
              {{
                productInfo.specsType == "1" ? productInfo.sku : productInfo.spu
              }}
            </p>
            <p v-else style="color: #808197">
              {{ productInfo.specsType == "2" ? "暂未关联SPU" : "暂未关联SKU" }}
            </p>
          </div>
        </gj-form-item>
      </div>
      <gj-row :gutter="24" class="mb8">
        <gj-col :span="24">
          <gj-form-item field="conditionDescription" label="状况描述">
            <gj-textarea
              v-model="productInfo.conditionDescription"
              placeholder="状况描述"
              allow-clear
            />
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
  <select-sku v-model:visible="skuModalVisible" @confirm="setSku" />
  <!-- SPU -->
  <select-spu v-model:visible="spuModalVisible" @confirm="setSpu" />
  <goods-modal
    :cancelVisible="cancelVisible"
    @cancelHandleOk="cancelHandleOk"
    @cancelHandleOff="cancelHandleOff"
  ></goods-modal>
</template>

<script>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  watch,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import { setForm } from "@/utils/fnBusiness";
import SvgIcon from "@/components/SvgIcon";
import SelectSku from "@/components/SelectSku.vue";
import SelectSpu from "@/components/SelectSpu.vue";
import { getSkuListBySpu } from "@/api/public";
import {
  queryEbayBaseCategory,
  getQueryEbayCategoryCondition,
} from "@api/published/ebay.js";
import goodsModal from "@/pages/systemPages/published/eBay/eBayPublish/components/goodsModal.vue";
export default {
  components: {
    SvgIcon,
    SelectSku,
    SelectSpu,
    goodsModal,
  },
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
  emits: ["setShowItemFun", "attrFun"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const key = "productInfo";
    const data = reactive({
      cancelVisible: false,
      newold: "",
      productInfo: {
        titleDescript: [{ titleDesc: "" }],
        titles: [],
        sku: "", //sku
        spu: "",
        subtitle: "", //副标题:
        platformCategoryId: "", //第1分类
        categoryId: "", //后台接收的值
        platformCategories: [], //第1分类所有
        secondPlatformCategoryId: "", //第2分类
        secondCategoryId: "", //后台接收的值
        secondPlatformCategories: [], //第2分类所有
        specsType: store.getters.getgoodsData.specsType, //规格(1:单品,2:变体) ,
        recommendPrice: null, //建议售价
        // Dose not apply
        upcCode: "", //编码 0
        isbn: "", //编码1
        eanCode: "", //编码2
        ebayCondition: "", //物品状况
        conditionDescription: "",
      },
      isUps: true,
      isUpsbool: 0,
      platformCategoryIdInit: "",
      secondPlatformCategoryIdInit: "",
      skuModalVisible: false,
      spuModalVisible: false,
      optionsSecond: [],
      options: [],
      conditionListOpt: [],
      personListOpt: [{ userId: "Dose not apply", userName: "Dose not apply" }],
      titleRules: [
        {
          required: true,
          message: "必填",
          validator: (value, cb) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                if (
                  !data.productInfo.titleDescript.find((item) =>
                    item.titleDesc.trim()
                  )
                ) {
                  cb("必填");
                }
                resolve();
              }, 0);
            });
          },
        },
      ],
      productInfoRules: [
        {
          required: true,
          message: "必填",
          validator: (value, cb) => {
            return new Promise((resolve) => {
              if (!data.productInfo.platformCategoryId) {
                cb("必填");
              }
              resolve();
            });
          },
        },
      ],
      specsDisabled: true,
      currentNode: [],
    });
    const setSpecsType = (val) => {
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_SPECSTYPE, val);
      if (val == 2) {
        emit("setShowItemFun", "variantInfo", true); //变体信息
        nextTick(() => {
          data.productInfo.specsType =
            store.getters.getgoodsData.specsType.toString();
        });
      } else {
        emit("setShowItemFun", "variantInfo", false); //变体信息
        nextTick(() => {
          data.productInfo.specsType =
            store.getters.getgoodsData.specsType.toString();
        });
      }

      if (props.actionType == "edit" || props.actionType == "copy") {
        if (val == props.goodsRowData.specsType) {
          if (props.goodsRowData.specsType == 1 && data.productInfo.sku) {
            resetForm();
          }
          if (props.goodsRowData.specsType == 2 && data.productInfo.spu) {
            resetForm();
          }
        }
        // 处理vif导致resetForm（）动态验证
        data.productInfo.titleDescript = props.goodsRowData.titles.map(
          (item) => {
            return { titleDesc: item };
          }
        );
      }
    };
    const loadMore = (option, done) => {
      let params = {
        categoryId: option.value,
        queryType: "C",
        siteId: store.getters.getgoodsData.siteId,
      };
      queryEbayBaseCategory(params).then((res) => {
        if (res.data.length !== 0) {
          data.currentNode = res.data;
        }
        const nodes = res.data.map((item) => {
          return {
            ...item,
            label: item.categoryName,
            value: item.categoryId,
            isLeaf: item.leaf == null ? false : true,
            itemCompatibleEnbale: item.itemCompatibleEnbale,
          };
        });
        done(nodes);
      });
    };
    const addTitile = () => {
      data.productInfo.titleDescript.push({ titleDesc: "" });
    };
    const removeTitile = (index) => {
      data.productInfo.titleDescript[index].titleDesc = "";
      data.productInfo.titleDescript.splice(index, 1);
    };

    const getqueryEbayBaseCategory = (val) => {
      if (val) {
        data.productInfo.categoryId = "";
        let params = {
          categoryId: data.productInfo.categoryId,
          queryType: data.productInfo.categoryId ? "S" : "F",
          siteId: store.getters.getgoodsData.siteId,
        };
        queryEbayBaseCategory(params).then((res) => {
          data.options = res.data.map((item) => {
            return {
              ...item,
              label: item.categoryName,
              value: item.categoryId,
              leaf: item.leaf,
              itemCompatibleEnbale: item.itemCompatibleEnbale,
            };
          });
          data.optionsSecond = res.data.map((item) => {
            return {
              ...item,
              label: item.categoryName,
              value: item.categoryId,
              leaf: item.leaf,
              itemCompatibleEnbale: item.itemCompatibleEnbale,
            };
          });
        });
      }
    };

    const getEditQueryEbayBaseCategory = (val) => {
      if (val) {
        let params = {
          categoryId: data.productInfo.categoryId,
          queryType: data.productInfo.categoryId ? "S" : "F",
          siteId: store.getters.getgoodsData.siteId,
        };
        queryEbayBaseCategory(params).then((res) => {
          res.data.forEach((item) => {
            if (props.actionType == "edit" || props.actionType == "copy") {
              console.log(item, data.productInfo, "info元数据对象");

              // 不支持、支持、必填
              let arr = ["Disabled", "Enabled", "Required"];
              let isbnbled = arr.includes(item.isbnEnable);
              let eanbled = arr.includes(item.eanEnable);
              let upcbled = arr.includes(item.upcEnable);
              console.log(isbnbled, eanbled, upcbled);
              if (!isbnbled && !eanbled && !upcbled) {
                data.isUps = false;
              } else {
                if (isbnbled) {
                  console.log(item.isbnEnable, "sbnbled", "edit");
                  data.isUpsbool = 2;
                } else if (eanbled) {
                  console.log(item.eanEnable, "eanbled", "edit");
                  data.isUpsbool = 1;
                } else {
                  console.log(item.upcEnable, "upcbled", "edit");
                  data.isUpsbool = 0;
                }
              }
              data.specsDisabled = !item.variationsEnbale; // 是否支持变体
              if (item.variationsEnbale) {
                data.specsDisabled = false; // 是否支持变体
              } else {
                data.productInfo.specsType = "1";
              }
              if (data.productInfo.specsType == 2) {
                emit("setShowItemFun", "variantInfo", true); //变体信息
              } else {
                emit("setShowItemFun", "variantInfo", false); //变体信息
              }
              if (item.itemCompatibleEnbale !== "Disabled") {
                emit("setShowItemFun", "compatibilityInfo", true); //是否支持兼容性列表
              } else {
                emit("setShowItemFun", "compatibilityInfo", false);
              }
              // if (item.itemSpecificEnbale !== "Disabled") {
              //   emit("setShowItemFun", "productAttributesInfo", true); //是否支持产品属性
              // } else {
              //   emit("setShowItemFun", "productAttributesInfo", true);
              // }
              // 存储基础元数据对象
              store.dispatch(proxy.$mt.GOODS_INFO_EBAY_ENBALE, item);
            }
          });
        });
      }
    };

    const submitForm = () => {
      return setForm(proxy, key, data[key], "productForm");
    };
    const resetForm = () => {
      proxy.$refs.productForm.resetFields();
    };
    // 物品状况
    const getCondition = (val) => {
      if (val) {
        let params = {
          siteId: store.getters.getgoodsData.siteId,
          categoryId:
            data.productInfo.categoryId ||
            props.goodsRowData.platformCategoryId, //'181763', //第一分类
        };
        if (params.categoryId) {
          getQueryEbayCategoryCondition(params).then((res) => {
            data.conditionListOpt = res.data;
          });
        }
      }
    };

    const format = (options) => {
      const labels = options.map((option) => option.label);
      const sum = options.length - 1;
      data.productInfo.categoryId = options[sum].value;
      data.productInfo.platformCategories = options.map((item) => {
        return {
          name: item.label,
          id: item.value,
          itemCompatibleEnbale: item.itemCompatibleEnbale,
        };
      });
      console.log(options[sum], "format元数据对象");
      // Disabled、Enabled、Required
      // 不支持、支持、必填
      let arr = ["Disabled", "Enabled", "Required"];
      let isbnbled = arr.includes(options[sum].isbnEnable);
      let eanbled = arr.includes(options[sum].eanEnable);
      let upcbled = arr.includes(options[sum].upcEnable);
      console.log(isbnbled, eanbled, upcbled);
      if (!isbnbled && !eanbled && !upcbled) {
        data.isUps = false;
      } else {
        if (isbnbled) {
          console.log(options[sum].isbnEnable, "sbnbled");
          data.isUpsbool = 2;
        } else if (eanbled) {
          console.log(options[sum].eanEnable, "eanbled");
          data.isUpsbool = 1;
        } else {
          console.log(options[sum].upcEnable, "upcbled");
          data.isUpsbool = 0;
        }
      }
      data.specsDisabled = !options[sum].variationsEnbale; // 是否支持变体
      if (options[sum].variationsEnbale) {
        data.specsDisabled = false; // 是否支持变体
      } else {
        data.productInfo.specsType = "1";
        emit("setShowItemFun", "variantInfo", false); //变体信息
      }
      if (options[sum].itemCompatibleEnbale !== "Disabled") {
        emit("setShowItemFun", "compatibilityInfo", true); //是否支持兼容性列表
      } else {
        emit("setShowItemFun", "compatibilityInfo", false);
      }
      // 存储基础元数据对象
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_ENBALE, options[sum]);
      store.dispatch(
        proxy.$mt.GOODS_INFO_EBAY_CATEGORYID,
        data.productInfo.categoryId
      );
      emit("attrFun", data.productInfo.categoryId);
      return labels.join("/");
    };

    const formatTo = (options) => {
      const labels = options.map((option) => option.label);
      const sum = options.length - 1;
      data.productInfo.secondCategoryId = options[sum].value;
      data.productInfo.secondPlatformCategories = options.map((item) => {
        return {
          name: item.label,
          id: item.value,
          itemCompatibleEnbale: item.itemCompatibleEnbale,
        };
      });
      return labels.join("/");
    };
    const setSku = (sku) => {
      data[key].spu = "";
      data[key].sku = sku;
      let skuObj = {
        type: "sku",
        value: sku,
      };
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_PICTURE, skuObj);
    };

    const setSpu = (val) => {
      data[key].sku = "";
      data[key].spu = val;
      let spuObj = {
        type: "spu",
        value: val,
      };
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_PICTURE, spuObj);
      let params = {
        spu: val, // '81-BU6438J-BK',
      };
      getSpuList(params);
    };
    const getSpuList = (params) => {
      getSkuListBySpu(params).then((res) => {
        const { code } = res;
        if (code == 200 || code == 0) {
          let spuList = res.data || [];
          store.dispatch(proxy.$mt.GOODS_INFO_EBAY_RELATIONSPULIST, spuList);
        }
      });
    };
    const cancelHandleOk = () => {
      data.productInfo.platformCategoryId = data.newold;
      data.cancelVisible = false;
    };
    const cancelHandleOff = () => {
      data.cancelVisible = false;
    };
    watch(
      () => store.getters.getgoodsData.siteId,
      (newVal, old) => {
        if (old) {
          console.log(newVal);
          data.productInfo.platformCategoryId = "";
          data.platformCategoryIdInit = "";
        }
      }
    );
    const categoryChange = (val) => {
      if (data.productInfo.platformCategoryId) {
        // if (data.productInfo.platformCategoryId == val) return false
        data.newold = val;
        data.cancelVisible = true;
      } else {
        data.productInfo.platformCategoryId = val;
      }
    };
    watch(
      () => props.goodsRowData,
      () => {
        data.productInfo = {
          // ...props.goodsRowData,
          specsType: props.goodsRowData.specsType.toString(),
          recommendPrice: props.goodsRowData.recommendPrice.toString(),
          titleDescript: props.goodsRowData.titles.map((item) => {
            return { titleDesc: item };
          }),
          sku: props.goodsRowData.specsType == 1 ? props.goodsRowData.spu : "",
          spu: props.goodsRowData.specsType == 2 ? props.goodsRowData.spu : "",
          subtitle: props.goodsRowData.subtitle || "", //副标题:
          platformCategoryId: props.goodsRowData.platformCategoryId || "", //第1分类
          categoryId: props.goodsRowData.platformCategoryId || "", //后台接收的值
          secondPlatformCategoryId:
            props.goodsRowData.secondPlatformCategoryId || "", //第2分类
          secondCategoryId: props.goodsRowData.secondCategoryId || "", //后台接收的值
          upcCode: props.goodsRowData.upcCode || "", //编码 三选一
          isbn: props.goodsRowData.isbn || "", //编码
          eanCode: props.goodsRowData.eanCode || "", //编码
          ebayCondition: props.goodsRowData.ebayCondition || "", //物品状况
          conditionDescription: props.goodsRowData.conditionDescription || "",
          platformCategories: props.goodsRowData.platformCategories,
          secondPlatformCategories: props.goodsRowData.secondPlatformCategories,
        };
        const {
          platformCategories,
          secondPlatformCategories,
          specsType,
          platformCategoryId,
        } = props.goodsRowData;

        data.platformCategoryIdInit = platformCategories
          ?.map((item) => {
            return item.name;
          })
          .join("/");

        data.secondPlatformCategoryIdInit = secondPlatformCategories
          ?.map((item) => {
            return item.name;
          })
          .join("/");
        platformCategories?.length == 0
          ? (data.specsDisabled = true)
          : (data.specsDisabled = false);
        let skuObj = {};
        if (specsType == 2) {
          skuObj = {
            type: "spu",
            value: props.goodsRowData.spu,
          };
        } else {
          skuObj = {
            type: "sku",
            value: props.goodsRowData.spu,
          };
        }

        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_PICTURE, skuObj);
        // 第一分类
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_SPECSTYPE, specsType);
        store.dispatch(
          proxy.$mt.GOODS_INFO_EBAY_CATEGORYID,
          platformCategoryId
        );
        if (props.actionType == "edit" || props.actionType == "copy") {
          getCondition(true);
          if (props.goodsRowData.platformCategoryId) {
            getEditQueryEbayBaseCategory(true);
            getqueryEbayBaseCategory(true);
          }
        }
      }
    );
    const getGeneralCode = () => {
      if (data.isUpsbool == 0) {
        data.productInfo.upcCode = "Dose not apply";
      } else if (data.isUpsbool == 1) {
        data.productInfo.isbn = "Dose not apply";
      } else {
        data.productInfo.eanCode = "Dose not apply";
      }
    };
    onMounted(() => {});
    return {
      ...toRefs(data),
      addTitile,
      getGeneralCode,
      removeTitile,
      // validate,
      submitForm,
      resetForm,
      loadMore,
      getqueryEbayBaseCategory,
      getEditQueryEbayBaseCategory,
      getCondition,
      setSpecsType,
      setSku,
      setSpu,
      getSpuList,
      format,
      formatTo,
      cancelHandleOk,
      cancelHandleOff,
      categoryChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.product-info {
  .mb8 {
    margin-bottom: 8px;
  }
  .mt {
    margin-top: 8px;
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
.position-abslot {
  position: absolute;
  left: 90px;
  top: 4px;
  color: #0045f0;
}
:deep(.arco-form-item-content) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
