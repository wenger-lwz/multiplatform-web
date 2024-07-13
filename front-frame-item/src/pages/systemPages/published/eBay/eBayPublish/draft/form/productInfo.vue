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
      :rules="titleRules"
    >
      <gj-row :gutter="24" class="mb8">
        <gj-col :span="24" class="postinon-ret">
          <gj-form-item field="titleDesc" label="产品标题">
            <gj-input
              v-model="productInfo.titleDesc"
              :max-length="80"
              placeholder="请输入"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
          <gj-button
            class="position-abslot"
            type="text"
            size="small"
            @click="openModel('tp')"
            >素材中心</gj-button
          >
        </gj-col>
        <gj-col :span="24">
          <gj-form-item field="subtitle" label="副标题(收费)">
            <gj-input
              v-model="productInfo.subtitle"
              :max-length="55"
              placeholder="请输入"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8" class="postinon-ret">
          <gj-form-item field="msku" label="店铺SKU">
            <gj-input
              v-model="productInfo.msku"
              placeholder="Please enter something"
              allow-clear
            />
          </gj-form-item>
          <gj-button
            class="position-abslot"
            @click="getGeneralSku"
            size="small"
            type="text"
          >
            自动生成
          </gj-button>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item field="platformCategoryId" label="第一分类">
            <gj-cascader
              :options="options"
              v-model="productInfo.platformCategoryId"
              :input-value="platformCategoryIdInit"
              placeholder="请选择第一分类"
              :load-more="loadMore"
              :format-label="format"
              @popup-visible-change="getqueryEbayBaseCategory"
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
        <gj-col :span="24">
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
      </gj-row>

      <!-- SKU   :field="productInfo.specsType == '1' ? 'sku' : 'spu'" -->
      <div class="squre-line mb16 mt">
        <gj-form-item
          :field="productInfo.specsType == '1' ? 'sku' : 'spu'"
          :label-col-style="{ 'justify-content': 'flex-start' }"
          :rules="[{ required: true, message: '请选择' }]"
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
        <gj-col :span="8">
          <gj-form-item field="specsType" label="销售类型">
            <gj-radio-group
              v-model="productInfo.listingType"
              @change="getListingType"
            >
              <gj-radio value="FixedPriceItem">固定价</gj-radio>
              <gj-radio value="Chinese" :disabled="productInfo.specsType == '2'"
                >拍卖价</gj-radio
              >
            </gj-radio-group>
          </gj-form-item>
        </gj-col>

        <gj-col :span="8" v-if="productInfo.specsType == '1'">
          <!-- 编码三选一  等接口 -->
          <gj-form-item field="upcCode" label="UPC编码">
            <gj-select
              v-model="productInfo.upcCode"
              placeholder="请选择"
              allow-clear
            >
              <!-- UPC/EAN/ISBN -->
              <gj-option
                v-for="item in personListOpt"
                :key="item.userId"
                :value="item.userId"
                >{{ item.userName }}</gj-option
              >
            </gj-select>
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
  <!-- 素材中心 -->
  <picture-list
    v-model:visible="Visible"
    @confirm="confirm"
    @close="cancel"
  ></picture-list>
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
import { getSkuRule } from "@/api/public";
import SelectSku from "@/components/SelectSku.vue";
import SelectSpu from "@/components/SelectSpu.vue";
import { getSkuListBySpu } from "@/api/public";
import pictureList from "../../../../materialCenter/modal/title.vue";
import {
  queryEbayBaseCategory,
  getQueryEbayCategoryCondition,
} from "@api/published/ebay.js";

export default {
  emits: ["setShowItemFun", "attrFun"],
  components: {
    SelectSku,
    SelectSpu,
    pictureList,
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

  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const key = "productInfo";
    const data = reactive({
      Visible: false,
      openModelName: "图片库",
      productInfo: {
        titleDesc: "",
        msku: "", //店铺SKU
        sku: "", //sku
        spu: "",
        skutype: "",
        subtitle: "", //副标题:
        platformCategoryId: "", //第1分类
        categoryId: "", //后台接收的值
        platformCategories: [], //第1分类所有
        secondPlatformCategoryId: "", //第2分类
        secondCategoryId: "", //后台接收的值
        secondPlatformCategories: [], //第2分类所有
        specsType: "1", //规格(1:单品,2:变体) ,
        listingType: "FixedPriceItem", //销售类型
        upcCode: "Dose not apply", //编码 三选一
        isbn: "", //编码
        eanCode: "", //编码
        ebayCondition: "", //物品状况
        conditionDescription: "",
        originalUrl: "",
      },
      platformCategoryIdInit: "",
      secondPlatformCategoryIdInit: "",
      skuModalVisible: false,
      spuModalVisible: false,
      optionsSecond: [],
      options: [],
      conditionListOpt: [],
      personListOpt: [{ userId: "Dose not apply", userName: "Dose not apply" }],
      titleRules: {
        titleDesc: [{ required: true, message: "产品标题必填" }],
        msku: [{ required: true, message: "店铺SKU必填" }],
        platformCategoryId: [{ required: true, message: "第一分类必填" }],
      },
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
        // data.productInfo.titleDescript = props.goodsRowData.titles.map(
        //   (item) => {
        //     return { titleDesc: item }
        //   }
        // )
      }

      // data.productInfo.specsType = val
      // data.productInfo.listingType = 'FixedPriceItem'
      // store.dispatch(
      //   proxy.$mt.DRAFT_INFO_LISTINGTYPE,
      //   data.productInfo.listingType
      // )
      // val == 1 ? (data[key].spu = '') : (data[key].sku = '')
      // store.dispatch(proxy.$mt.GOODS_INFO_EBAY_SPECSTYPE, val)
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

    const format = (options) => {
      data.specsDisabled = false;
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
      console.log(options[sum], "info元数据对象");
      data.specsDisabled = !options[sum].variationsEnbale; // 是否支持变体

      if (options[sum].variationsEnbale) {
        data.specsDisabled = false; // 是否支持变体
      } else {
        data.productInfo.specsType = "1";
      }
      if (options[sum].itemCompatibleEnbale !== "Disabled") {
        emit("setShowItemFun", "compatibilityInfo", true); //是否支持兼容性列表
      } else {
        emit("setShowItemFun", "compatibilityInfo", false);
      }
      // if (options[sum].itemSpecificEnbale !== "Disabled") {
      //   emit("setShowItemFun", "productAttributesInfo", true); //是否支持产品属性
      // } else {
      //   emit("setShowItemFun", "productAttributesInfo", false);
      // }
      // 存储基础元数据对象
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_ENBALE, options[sum]);
      store.dispatch(
        proxy.$mt.GOODS_INFO_EBAY_CATEGORYID,
        data.productInfo.categoryId
      );
      emit("attrFun", data.productInfo.categoryId);

      return labels.join("/");
    };
    const getListingType = (val) => {
      store.dispatch(proxy.$mt.DRAFT_INFO_LISTINGTYPE, val);
    };
    const formatTo = (options) => {
      data.specsDisabled = false;
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

    const platformChange = (option, done) => {
      data.specsDisabled = false;
      console.log(data.options, option, done);
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
              label: item.categoryName,
              value: item.categoryId,
              leaf: item.leaf,
              itemCompatibleEnbale: item.itemCompatibleEnbale,
            };
          });
          data.optionsSecond = res.data.map((item) => {
            return {
              label: item.categoryName,
              value: item.categoryId,
              leaf: item.leaf,
              itemCompatibleEnbale: item.itemCompatibleEnbale,
            };
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
        getQueryEbayCategoryCondition(params).then((res) => {
          data.conditionListOpt = res.data;
        });
      }
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

    const getSpuList = (params) => {
      getSkuListBySpu(params).then((res) => {
        const { code } = res;
        if (code == 200 || code == 0) {
          let spuList = res.data || [];
          store.dispatch(proxy.$mt.GOODS_INFO_EBAY_RELATIONSPULIST, spuList);
        }
      });
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
    // 素材中心
    const cancel = () => {
      data.Visible = false;
    };
    // 素材中心
    const openModel = () => {
      data.Visible = true;
    };
    const confirm = (val) => {
      let obj = [...val];
      let str = obj.map((item) => {
        return item.content;
      });
      data.productInfo.titleDesc = str.join(",");
      cancel();
    };
    //自动生成规则
    const getGeneralSku = () => {
      getSkuRule({
        platformCode: "EBAY",
        shopCode: store.getters.getdraftData.shopId,
        variantCount: 1,
      }).then((res) => {
        // data.productInfo.msku = res.data.sonRuleStr[0]
        data.productInfo.msku = res.data.parentRuleStr;
        console.log(res);
      });
    };
    watch(
      () => store.getters.getgoodsData.siteId,
      (newVal, old) => {
        console.log(newVal);
        if (old) {
          data.productInfo.platformCategoryId = "";
          data.platformCategoryIdInit = "";
        }
      }
    );
    watch(
      () => props.goodsRowData,
      () => {
        data.productInfo = { ...props.goodsRowData };
        const {
          defaultTitle,
          platformCategories,
          secondPlatformCategories,
          specsType,
          platformCategoryId,
        } = props.goodsRowData;
        data.productInfo.sku = props.goodsRowData.spu;
        data.productInfo.spu = props.goodsRowData.spu;
        data.productInfo.titleDesc = defaultTitle;
        data.productInfo.specsType = specsType.toString() || 1;
        data.productInfo.categoryId = platformCategoryId;
        data.productInfo.platformCategoryId = platformCategoryId;
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

        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_SPECSTYPE, specsType);
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_PICTURE, skuObj);
        store.dispatch(
          proxy.$mt.GOODS_INFO_EBAY_CATEGORYID,
          platformCategoryId
        );
        if (props.actionType == "edit" || props.actionType == "copy") {
          getqueryEbayBaseCategory(true);
          getCondition(true);
        }
      }
    );
    onMounted(() => {});
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      loadMore,
      getqueryEbayBaseCategory,
      platformChange,
      getCondition,
      setSpecsType,
      setSku,
      setSpu,
      cancel,
      openModel,
      confirm,
      getGeneralSku,
      format,
      formatTo,
      getSpuList,
      getListingType,
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
  .postinon-ret {
    position: relative;
  }
  .position-abslot {
    position: absolute;
    left: 90px;
    top: 2px;
    color: #0045f0;
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
        background: #fafafa;
        border-radius: 6px;
      }
    }
  }
}
</style>
