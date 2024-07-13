<template>
  <div class="blockBox">
    <div class="title">产品信息</div>
    <gj-form
      ref="productInfoForm"
      :model="productInfo"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      label-align="left"
      :rules="rules"
      class="form"
    >
      <!-- AliExpress类目/商品规格 -->
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item label="AliExpress类目" field="platformCategoryId">
            <gj-cascader
              :options="options"
              :load-more="loadMore"
              :model-value="productInfo.platformCategoryId"
              :input-value="defaultValue"
              ref="cascaderPlace"
              placeholder="请选择"
              @change="cascaderChange"
              :format-label="format"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item label="商品规格">
            <gj-radio-group
              v-model="productInfo.specsType"
              @change="specsChange"
            >
              <gj-radio :value="1">单品 </gj-radio>
              <gj-radio :value="2">变体 </gj-radio>
            </gj-radio-group>
          </gj-form-item>
        </gj-col>
      </gj-row>

      <!-- 关联SKU/SPU -->
      <gj-row class="squre-line">
        <gj-col :span="24" v-if="productInfo.specsType === 1">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            field="spu"
            :rules="[
              {
                required: true,
                message: '请选择SKU',
              },
            ]"
          >
            <template #label>
              关联SKU
              <gj-button
                type="text"
                size="small"
                @click="skuModalVisible = true"
                >选择SKU</gj-button
              >
            </template>
            <div>
              <p v-if="productInfo.spu">{{ productInfo.spu }}</p>
              <p v-else style="color: #808197">暂未关联SKU</p>
            </div>
          </gj-form-item>
        </gj-col>

        <gj-col :span="24" v-if="productInfo.specsType === 2">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            field="spu"
            :rules="[
              {
                required: true,
                message: '请选择SPU',
              },
            ]"
          >
            <template #label>
              关联SPU
              <gj-button
                type="text"
                size="small"
                @click="spuModalVisible = true"
                >选择SPU</gj-button
              >
            </template>
            <div>
              <p v-if="productInfo.spu">{{ productInfo.spu }}</p>
              <p v-else style="color: #808197">暂未关联SPU</p>
            </div>
          </gj-form-item>
        </gj-col>
      </gj-row>

      <!-- 标题 -->
      <gj-row>
        <gj-col :span="24">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            field="title"
          >
            <template #label>
              <div style="display: inline-block">
                产品标题
                <gj-button type="text" size="small" @click="open"
                  >素材中心</gj-button
                >
              </div>
            </template>
            <gj-input
              v-model="productInfo.title"
              :max-length="128"
              placeholder="请输入"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
        </gj-col>
      </gj-row>

      <!-- 商品分组/库存扣减方式/店铺sku -->
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item>
            <template #label>
              <div>
                商品分组
                <gj-button @click="syncProductPlat" type="text" size="small"
                  >同步</gj-button
                >
              </div>
            </template>
            <gj-select
              v-model="productInfo.groupId"
              placeholder="请选择"
              allow-clear
              :trigger-props="{
                updateAtScroll: true,
                autoFitPopupMinWidth: true,
              }"
            >
              <gj-option
                v-for="item in groupIdList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></gj-option>
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item label="库存扣减方式">
            <gj-radio-group v-model="productInfo.reduceStrategy">
              <gj-radio value="place_order_withhold">下单减库存</gj-radio>
              <gj-radio value="payment_success_deduct">支付减库存</gj-radio>
            </gj-radio-group>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8" v-if="productInfo.specsType === 1">
          <gj-form-item field="msku">
            <template #label>
              <div style="display: inline-block">
                店铺SKU
                <gj-button type="text" size="small" @click="setRules"
                  >设置生成规则</gj-button
                >
              </div>
            </template>
            <gj-input
              v-model="productInfo.msku"
              :max-length="255"
              placeholder="请输入"
            >
              <template #append>
                <gj-button @click="automaticSKU" type="text" size="small"
                  >自动生成</gj-button
                >
              </template>
            </gj-input>
          </gj-form-item>
        </gj-col>
      </gj-row>
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

    <select-sku
      v-if="productInfo.specsType === 1"
      v-model:visible="skuModalVisible"
      @confirm="setSpu"
    />
    <!-- SPU -->
    <select-spu v-else v-model:visible="spuModalVisible" @confirm="setSpu" />

    <skuRulesModal
      :visible="skuRulesModalVisible"
      @handleOk="confirmModal"
      @cancel="cancelModal"
      :skuRules="skuRules"
    ></skuRulesModal>

    <titleModel
      v-model:visible="titleVisible"
      @confirm="confirmTitle"
      @close="closeTitle"
    ></titleModel>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  watch,
  inject,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import {
  getAliexpressMetaList,
  syncPlatform,
  getPlatform,
} from "@/api/published/aliexpress";
import { getSkuRule } from "@/api/public";
// import SvgIcon from '@/components/SvgIcon'
import SelectSku from "@/components/SelectSku.vue";
import SelectSpu from "@/components/SelectSpu.vue";
import { getSkuListBySpu } from "@/api/public";
import skuRulesModal from "./skuModal.vue";
import { editSkuRule } from "@/api/published/generalTools";
import { GjMessage } from "@gj/atom";
import titleModel from "@/pages/systemPages/published/materialCenter/modal/title.vue";
export default defineComponent({
  props: {
    specs: {
      type: Number,
      default: () => {
        return 1;
      },
    },
    editInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    groupIdList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    // SvgIcon,
    SelectSku,
    SelectSpu,
    skuRulesModal,
    titleModel,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const shopId = inject("shopId");
    const key = "productInfo";
    const loadMore = (option, done) => {
      let parentId = option && option.value ? option.value : 0;
      getAliexpressMetaList(parentId).then((res) => {
        let nodes = res.data.map((item) => {
          let itemObj = JSON.parse(item.names);
          return {
            value: item.id,
            isLeaf: item.isleaf,
            level: item.level,
            label: itemObj["zh"],
            isCarParam: item.isCarParam || "",
          };
        });
        done(nodes);
      });
    };

    onMounted(() => {
      getAliexpressMetaList(0).then((res) => {
        let nodes = res.data.map((item) => {
          return {
            value: item.id,
            leaf: item.isleaf,
            level: item.level,
            label: item.zhName,
            isCarParam: item.isCarParam || "",
          };
        });
        data.options = nodes;
      });
    });

    const setSpu = (spu) => {
      data.productInfo.spu = spu;
      data.spuModalVisible = false;
      data.skuModalVisible = false;
      getSkuListBySpu({ spu }).then((res) => {
        data.relatedSkus = res.data;
        emit("getSkuList", { relatedSkus: data.relatedSkus, spu });
      });
    };

    const data = reactive({
      defaultValue: "",
      key: "productInfo",
      titleVisible: false,
      skuRules: {
        parentRule: [], // 父SKU列表数据
        sonRule: [], // 子SKU列表数据
        parentRuleStr: "",
        sonRuleStr: "",
        ruleType: "2",
        others: [
          {
            shopCode: "",
            platformCode: "ALIEXPRESS",
          },
        ],
      },
      skuRulesModalVisible: false,
      skuModalVisible: false,
      spuModalVisible: false,
      productInfo: {
        title: "",
        platformCategoryId: "", //aliexpress类目
        specsType: props.specs, //商品规格
        spu: "",
        groupId: "",
        reduceStrategy: "place_order_withhold",
        msku: "",
      },
      rules: {
        msku: [
          {
            required: true,
            message: "请输入店铺sku",
            trigger: "blur",
          },
        ],
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "change",
          },
        ],
        platformCategoryId: [
          {
            required: true,
            message: "请选择类目",
            trigger: "change",
          },
        ],
      },
      relatedSkus: [],
      options: [],
      groupIdList: props.groupIdList,
      editData: props.editInfo,
      isCarParam: false,
      modelType: 1,
      saveCategoryId: "",
      formDialogVisible: false,
    });

    const updateAttr = () => {
      emit("updateAttr");
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "productInfoForm");
    };

    // const cascaderChange = (val) => {
    //   emit('getAttr', val)
    // }
    const cascaderChange = (val) => {
      if (data.saveCategoryId === val) return;

      data.saveCategoryId = val;
      if (!data.productInfo.platformCategoryId) {
        switchCallback();
      } else {
        data.formDialogVisible = true;
      }
    };

    const switchCallback = () => {
      data.productInfo.platformCategoryId = data.saveCategoryId;

      emit("getAttr", data.saveCategoryId);
    };

    const handleClose = () => {
      data.saveCategoryId = data.productInfo.platformCategoryId;
      data.formDialogVisible = false;
    };

    const handelSubmit = () => {
      data.formDialogVisible = false;
      switchCallback();
    };

    const specsChange = () => {
      emit("specsChange", data.productInfo.specsType);
    };

    const automaticSKU = () => {
      if (!shopId.value) {
        return GjMessage.warning("请先选择店铺");
      }
      getSkuRule({
        platformCode: "ALIEXPRESS",
        shopCode: shopId.value,
        variantCount: 1,
      }).then((res) => {
        data.productInfo.msku = res.data.sonRuleStr[0];
        console.log(res);
      });
    };

    //获取商品分组下拉选项
    const getProductPlat = () => {
      if (!shopId.value) return;
      getPlatform({
        shopId: shopId.value,
        componentType: "1",
      }).then((res) => {
        data.groupIdList = res.data;
      });
    };

    const syncProductPlat = () => {
      if (!shopId.value) {
        return GjMessage.warning("请先选择店铺");
      }
      syncPlatform({
        componentTypes: ["1"],
        shopId: [shopId.value],
      }).then(() => {
        getProductPlat();
        GjMessage.success("同步成功");
      });
    };

    const setRules = () => {
      data.skuRulesModalVisible = true;
    };

    const confirmModal = () => {
      data.skuRulesModalVisible = false;
      // 保存接口，清除数据
      editSkuRule(data.skuRules).then((res) => {
        GjMessage.success(res.message || "编辑成功");
      });
    };

    const cancelModal = () => {
      data.skuRulesModalVisible = false;
    };

    const open = () => {
      data.titleVisible = true;
    };

    const confirmTitle = (list) => {
      console.log(list);
      data.titleVisible = false;
      data.productInfo.title =
        list[0].content.length > 128
          ? list[0].content.substring(0, 128)
          : list[0].content;
    };

    const closeTitle = () => {
      data.titleVisible = false;
    };

    const format = (options) => {
      data.isCarParam = options[options.length - 1].isCarParam
        ? options[options.length - 1].isCarParam
        : false;
      data.modelType = options[0].value === 34 ? 1 : 2;
      emit("setCarParam", {
        isCarParam: data.isCarParam,
        modelType: data.modelType,
      });
      // console.log('111这里面包含选择的所有数据', options)
      const labels = options.map((option) => option.label);
      // const laeblsSelect = options.map((item) => {
      //   return {
      //     label: item.label,
      //     value: item.lazadaCategoryId,
      //   }
      // })
      // // 这个字段 前后端自行商议，各个平台希望保持统一
      // data.params['labels'] = JSON.stringify(laeblsSelect)
      // data.params['other'] = '其他参数集合'
      // console.log('提交的参数', data.params)
      return labels.join("/");
    };

    // watch(
    //   () => shopId.value,
    //   (newValue) => {
    //     data.skuRules.others[0].shopCode = newValue
    //     getProductPlat()
    //   }
    // )

    watch(
      () => props.groupIdList,
      (newValue) => {
        data.groupIdList = newValue;
      }
    );

    watch(
      () => props.editInfo,
      (newValue) => {
        if (JSON.stringify(newValue) != "{}") {
          data.editData = JSON.parse(JSON.stringify(newValue));
          data.productInfo.title = data.editData.defaultTitle;
          data.productInfo.platformCategoryId =
            data.editData.platformCategoryId;
          data.productInfo.specsType = data.editData.specsType;
          data.productInfo.spu = data.editData.spu;
          data.productInfo.groupId = data.editData.groupId
            ? data.editData.groupId + ""
            : "";
          data.productInfo.reduceStrategy = data.editData.reduceStrategy;
          data.productInfo.msku = data.editData.msku;

          data.defaultValue = newValue?.platformCategories
            ?.map((item) => item.name)
            .reverse()
            .join("/");

          emit("getAttr", data.productInfo.platformCategoryId);
          emit("specsChange", data.productInfo.specsType);

          if (data.productInfo.specsType === 2) {
            getSkuListBySpu({ spu: data.productInfo.spu }).then((res) => {
              data.relatedSkus = res.data;
              emit("getSkuList", data.relatedSkus);
            });
          }
        } else {
          data.productInfo.title = "";
          data.productInfo.platformCategoryId = "";
          data.productInfo.specsType = 1;
          data.productInfo.spu = "";
          data.productInfo.groupId = "";
          data.productInfo.msku = "";
          data.defaultValue = "";
        }
      },
      { deep: true }
    );
    return {
      ...toRefs(data),
      // cascaderProps,
      loadMore,
      specsChange,
      cascaderChange,
      submitForm,
      automaticSKU,
      // getProductPlat,
      syncProductPlat,
      setSpu,
      setRules,
      cancelModal,
      confirmModal,
      open,
      confirmTitle,
      closeTitle,
      format,
      updateAttr,
      handelSubmit,
      handleClose,
    };
  },
});
</script>
<style lang="scss" scoped>
/deep/.arco-form-item-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.blockBox {
  // /deep/.arco-form-item-label-col {
  //   line-height: normal;
  // }
  .title {
    font-size: 14px;
    font-weight: 600;
  }
  .form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
    .squre-line {
      padding: 12px;
      box-sizing: border-box;
      width: 100%;
      border: 1px solid #e6e6ed;
      border-radius: 8px;
      margin-bottom: 10px;
      :deep(.arco-form-item-content-flex) {
        display: inline;
      }
    }
  }
}
</style>
