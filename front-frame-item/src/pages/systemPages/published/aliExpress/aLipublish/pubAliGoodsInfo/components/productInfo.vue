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
      <!-- 标题 -->
      <gj-row class="squre-line">
        <gj-col :span="24">
          <div
            class="title-form-item mb16"
            v-for="(item, index) in productInfo.titles"
            :key="index"
          >
            <gj-form-item
              :label-col-style="{ 'justify-content': 'flex-start' }"
              field="titleDescript"
              :rules="index >= 1 ? undefined : titleRules"
              :validate-trigger="['change', 'input', 'blur']"
            >
              <template #label>
                <div v-if="index === 0" style="display: inline-block">
                  产品标题
                  <gj-button type="text" size="small" @click="open"
                    >素材中心</gj-button
                  >
                </div>
              </template>
              <gj-input
                v-model="item.value"
                :max-length="128"
                placeholder="请输入"
                allow-clear
                show-word-limit
              />
            </gj-form-item>
            <div class="btn-svg">
              <SvgIcon
                svgClass="addTitle"
                :width="24"
                v-show="index === productInfo.titles.length - 1"
                @click="addTitle"
              ></SvgIcon
              ><SvgIcon
                v-show="productInfo.titles.length > 1"
                svgClass="subtract"
                :width="24"
                @click="deleteTitle(index)"
              ></SvgIcon>
            </div>
          </div>
        </gj-col>
      </gj-row>
      <!-- AliExpress类目/商品规格 -->
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item label="AliExpress类目">
            <gj-cascader
              :options="options"
              :load-more="loadMore"
              ref="cascaderPlace"
              placeholder="请选择"
              :input-value="defaultValue"
              :model-value="productInfo.platformCategoryId"
              @change="cascaderChange"
              :format-label="format"
              :trigger-props="{
                updateAtScroll: true,
              }"
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
                @click="skuModalVisible = true"
                type="text"
                size="small"
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
                @click="spuModalVisible = true"
                type="text"
                size="small"
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

      <!-- 建议售价  物流重量 自定义计重 -->
      <gj-row :gutter="24">
        <gj-col :span="8" v-if="productInfo.specsType === 1">
          <gj-form-item label="建议售价">
            <gj-input-number
              v-model="productInfo.recommendPrice"
              placeholder="请输入"
              :min="0"
              :max="100000000000000"
            >
              <template #prefix> $ </template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>

        <gj-col :span="8">
          <gj-form-item label="物流重量（件）">
            <gj-input-number
              v-model="productInfo.logisticsWeight"
              placeholder="重量"
              :min="0"
              :max="100000000000000"
            >
              <template #append>kg</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>

        <gj-col :span="8">
          <gj-form-item label="自定义计重">
            <gj-switch v-model="productInfo.customWeight" />
          </gj-form-item>
        </gj-col>
      </gj-row>

      <!-- 物流重量/件 -->
      <gj-row v-if="productInfo.customWeight" class="squre-line">
        <gj-col :span="24">
          <div class="weight">
            <span class="sp1">买家购买</span>
            <gj-input-number
              placeholder="请输入"
              v-model="productInfo.pieceNumber"
              class="inputNumber"
            ></gj-input-number>
            <span class="sp2"
              >件以内，按单位产品重量计算运费。在此基础上，买家每多买</span
            >
            <gj-input-number
              v-model="productInfo.morePieceNumber"
              placeholder="请输入"
              class="inputNumber"
            ></gj-input-number>
            <span class="sp3">件，重量增加</span>
            <gj-input-number
              v-model="productInfo.weightIncrease"
              placeholder="重量"
              class="inputNumber"
            >
              <template #append>kg</template>
            </gj-input-number>
          </div>
        </gj-col>
      </gj-row>
      <!-- 物流尺寸 -->
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item>
            <template #label>
              <div>
                <span>物流尺寸</span><span class="color1">(单位：CM)</span
                ><span class="sp2">每件{{ total }}cm3</span>
              </div>
            </template>
            <div class="sizeWarp">
              <gj-input-number
                v-model="productInfo.packageLength"
                :min="0"
                :max="1000"
                placeholder="请输入"
              >
                <template #prepend> 长 </template>
              </gj-input-number>
              <span class="sp1">*</span>
              <gj-input-number
                v-model="productInfo.packageWidth"
                :min="0"
                :max="1000"
                placeholder="请输入"
              >
                <template #prepend> 宽 </template>
              </gj-input-number>
              <span class="sp1">*</span>
              <gj-input-number
                v-model="productInfo.packageHeight"
                :min="0"
                :max="1000"
                placeholder="请输入"
              >
                <template #prepend> 高 </template>
              </gj-input-number>
            </div>
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
  computed,
  watch,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import { getAliexpressMetaList } from "@/api/published/aliexpress";
import SvgIcon from "@/components/SvgIcon";
import SelectSku from "@/components/SelectSku.vue";
import SelectSpu from "@/components/SelectSpu.vue";
import store from "@/store";
import { getSkuListBySpu } from "@/api/public";
import titleModel from "@/pages/systemPages/published/materialCenter/modal/title.vue";
import { GjMessage } from "@gj/atom";
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
  },
  components: {
    SvgIcon,
    SelectSku,
    SelectSpu,
    titleModel,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();

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
            isCarParam: item.isCarParam,
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
            isCarParam: item.isCarParam,
          };
        });

        data.options = nodes;
      });
    });

    const total = computed(() => {
      if (
        !data.productInfo.packageHeight &&
        !data.productInfo.packageLength &&
        !data.productInfo.packageWidth
      ) {
        return 0;
      } else {
        return (
          data.productInfo.packageHeight *
            data.productInfo.packageLength *
            data.productInfo.packageWidth || 0
        );
      }
    });

    const data = reactive({
      key: "productInfo",
      skuModalVisible: false,
      spuModalVisible: false,
      productInfo: {
        titles: [
          {
            value: "",
          },
        ],
        platformCategoryId: "", //aliexpress类目
        specsType: props.specs, //商品规格
        spu: "",
        recommendPrice: "", //建议售价
        logisticsWeight: "", //物品重量
        customWeight: false, //自定义计重
        pieceNumber: "", //x件以内
        morePieceNumber: "", //每多买
        weightIncrease: "", //重量增加Xkg
        packageHeight: "",
        packageLength: "",
        packageWidth: "",
      },
      rules: {
        platformCategoryId: [
          {
            required: true,
            message: "请选择类目",
            trigger: "change",
          },
        ],
      },
      options: [],
      titleRules: [
        {
          required: true,
          message: "必填",
          validator: (value, cb) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                if (
                  !data.productInfo.titles.find((item) => item.value.trim())
                ) {
                  cb("必填");
                }
                resolve();
              }, 0);
            });
          },
        },
      ],
      relatedSkus: [],
      titleVisible: false,
      editData: props.editInfo,
      defaultValue: "",
      isCarParam: false,
      modelType: 1,
      formDialogVisible: false,
      saveCategoryId: "",
    });

    const submitForm = () => {
      // const params = store.getters.getParams
      // params[key] = data.productInfo
      // store.dispatch(proxy.$mt.PARAMS_QUERY, params)

      return setForm2(proxy, key, data[key], "productInfoForm");
      // return setForm(proxy, key, data[key], 'productInfoForm')
    };

    const resetForm = () => {
      proxy.$refs["productInfoForm"].resetFields();
    };

    const addTitle = () => {
      if (data.productInfo.titles.length >= 20) {
        return GjMessage.warning("最多添加20条");
      }
      data.productInfo.titles.push({
        value: "",
      });
    };

    const deleteTitle = (index) => {
      console.log(index);
      data.productInfo.titles.splice(index, 1);
    };

    const setSpu = (spu) => {
      store.commit("PRO_INFO_ALI_SPU", spu);
      data.productInfo.spu = spu;
      data.spuModalVisible = false;
      data.skuModalVisible = false;
      getSkuListBySpu({ spu }).then((res) => {
        data.relatedSkus = res.data;
        emit("getSkuList", data.relatedSkus);
      });
    };

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
      store.commit("setProCustomizedPic", []);
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
      store.commit(
        "PRO_INFO_ALI_SPUTYPE",
        data.productInfo.specsType == 1 ? 1 : 2
      );
    };

    const open = () => {
      data.titleVisible = true;
    };

    const confirmTitle = (list) => {
      console.log(list);
      data.titleVisible = false;

      list.forEach((element) => {
        if (data.productInfo.titles.length < 20) {
          data.productInfo.titles.push({
            value:
              element.content.length > 128
                ? element.content.substring(0, 128)
                : element.content,
          });
        }
      });
    };

    const closeTitle = () => {
      data.titleVisible = false;
    };

    const format = (options) => {
      const labels = options.map((option) => option.label);

      data.isCarParam = options[options.length - 1].isCarParam
        ? options[options.length - 1].isCarParam
        : false;
      data.modelType = options[0].value === 34 ? 1 : 2;
      emit("setCarParam", {
        isCarParam: data.isCarParam,
        modelType: data.modelType,
      });
      return labels.join("/");
    };

    watch(
      () => props.editInfo,
      (newValue) => {
        if (JSON.stringify(newValue) != "{}") {
          data.editData = JSON.parse(JSON.stringify(newValue));

          data.productInfo.titles = data.editData.titles.map((item) => {
            return {
              value: item,
            };
          });

          data.productInfo.platformCategoryId =
            data.editData.platformCategoryId;
          data.productInfo.specsType = data.editData.specsType;
          data.productInfo.spu = data.editData.spu;
          data.productInfo.recommendPrice = data.editData.recommendPrice;
          data.productInfo.logisticsWeight = data.editData.logisticsWeight;
          data.productInfo.customWeight = data.editData.customWeight;
          data.productInfo.pieceNumber = data.editData.pieceNumber;
          data.productInfo.morePieceNumber = data.editData.morePieceNumber;
          data.productInfo.weightIncrease = data.editData.weightIncrease;
          data.productInfo.packageHeight = data.editData.packageHeight;
          data.productInfo.packageLength = data.editData.packageLength;
          data.productInfo.packageWidth = data.editData.packageWidth;

          data.defaultValue = newValue?.platformCategories
            ?.map((item) => item.name)
            .reverse()
            .join("/");

          emit("getAttr", data.productInfo.platformCategoryId);
          store.commit("PRO_INFO_ALI_SPU", data.productInfo.spu);
          emit("specsChange", data.productInfo.specsType);
          store.commit(
            "PRO_INFO_ALI_SPUTYPE",
            data.productInfo.specsType == 1 ? 1 : 2
          );

          if (data.productInfo.specsType === 2) {
            getSkuListBySpu({ spu: data.productInfo.spu }).then((res) => {
              data.relatedSkus = res.data;
              emit("getSkuList", data.relatedSkus);
            });
          }
        } else {
          data.productInfo.titles = [
            {
              value: "",
            },
          ];
          data.productInfo.platformCategoryId = "";
          data.productInfo.spu = "";
          data.productInfo.recommendPrice = "";
          data.productInfo.logisticsWeight = "";
          data.productInfo.specsType = 1;
          data.productInfo.customWeight = false;
          data.productInfo.packageLength = "";
          data.productInfo.packageWidth = "";
          data.productInfo.pieceNumber = "";
          data.productInfo.packageHeight = "";
          data.productInfo.weightIncrease = "";
          data.productInfo.morePieceNumber = "";
          data.defaultValue = "";
          store.commit("PRO_INFO_ALI_SPU", "");
          store.commit("PRO_INFO_ALI_SPUTYPE", 1);
        }
      },
      { deep: true }
    );
    return {
      ...toRefs(data),
      // cascaderProps,
      loadMore,
      addTitle,
      deleteTitle,
      specsChange,
      cascaderChange,
      submitForm,
      resetForm,
      total,
      setSpu,
      open,
      confirmTitle,
      closeTitle,
      format,
      handleClose,
      handelSubmit,
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
    // padding-top: 12px;
    font-size: 14px;
    margin-bottom: 16px;
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
      .title-form-item {
        display: flex;
        justify-content: space-between;
        &:first-child {
          .btn-svg {
            padding-top: 58px;
            align-items: flex-start;
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
      }

      .btn-svg {
        margin-left: 16px;
        width: 56px;
        margin-top: -22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        svg:hover {
          cursor: pointer;
        }
      }
    }

    .weight {
      padding-top: 0px;
      align-items: center;
      display: flex;
      .sp1 {
        color: rgba(0, 4, 48, 0.5);
        margin-right: 8px;
      }
      .sp2 {
        color: rgba(0, 4, 48, 0.5);
        margin: 0px 8px;
      }

      .sp3 {
        color: rgba(0, 4, 48, 0.5);
        margin: 0px 8px;
      }

      .inputNumber {
        flex: 1;
        // max-width: 164px;
        // margin-top: 12px;
      }
    }

    .sizeWarp {
      display: flex;
      .sp1 {
        margin: 8px;
      }
    }
  }
}
</style>
