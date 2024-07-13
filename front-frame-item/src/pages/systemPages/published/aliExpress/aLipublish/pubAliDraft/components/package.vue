<!--包装与物流-->
<template>
  <div class="blockBox">
    <div class="title">包装与物流</div>
    <gj-form
      :model="packagInfo"
      class="form"
      :rules="rules"
      ref="packagForm"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      label-align="left"
    >
      <gj-row :gutter="24">
        <!--发货期 -->
        <gj-col :span="8">
          <gj-form-item label="发货期" field="deliveryTime">
            <gj-input-number
              v-model="packagInfo.deliveryTime"
              :min="1"
              :max="30"
            >
              <template #prepend>天</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>

        <!-- 物流重量 -->
        <gj-col :span="8">
          <gj-form-item field="logisticsWeight">
            <template #label>
              <div class="inline">物流重量<span class="color1">(件)</span></div>
            </template>
            <gj-input-number
              v-model="packagInfo.logisticsWeight"
              placeholder="重量"
              :min="0.001"
              :max="500"
            >
              <template #append>kg</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>

        <!-- 自定义计重 -->
        <gj-col :span="8">
          <gj-form-item label="自定义计重">
            <gj-switch v-model="packagInfo.customWeight" />
          </gj-form-item>
        </gj-col>
      </gj-row>
      <!-- 物流重量/件 -->
      <gj-row v-if="packagInfo.customWeight" class="squre-line">
        <gj-col :span="24">
          <div class="weight">
            <span class="sp1">买家购买</span>
            <gj-input-number
              placeholder="请输入"
              v-model="packagInfo.pieceNumber"
              class="inputNumber"
            ></gj-input-number>
            <span class="sp2"
              >件以内，按单位产品重量计算运费。在此基础上，买家每多买</span
            >
            <gj-input-number
              v-model="packagInfo.morePieceNumber"
              placeholder="请输入"
              class="inputNumber"
            ></gj-input-number>
            <span class="sp3">件，重量增加</span>
            <gj-input-number
              v-model="packagInfo.weightIncrease"
              placeholder="重量"
              class="inputNumber"
              :min="0.001"
              :max="500"
            >
              <template #append>kg</template>
            </gj-input-number>
          </div>
        </gj-col>
      </gj-row>

      <gj-row :gutter="24">
        <!-- 物流尺寸 -->
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
                v-model="packagInfo.packageLength"
                :min="0"
                :max="1000"
                placeholder="请输入"
              >
                <template #prepend> 长 </template>
              </gj-input-number>
              <span class="sp1">*</span>
              <gj-input-number
                v-model="packagInfo.packageWidth"
                :min="0"
                :max="1000"
                placeholder="请输入"
              >
                <template #prepend> 宽 </template>
              </gj-input-number>
              <span class="sp1">*</span>
              <gj-input-number
                v-model="packagInfo.packageHeight"
                :min="0"
                :max="1000"
                placeholder="请输入"
              >
                <template #prepend> 高 </template>
              </gj-input-number>
            </div>
          </gj-form-item>
        </gj-col>

        <!--运费模板-->
        <gj-col :span="8">
          <gj-form-item field="freightTemplateId">
            <template #label>
              <div class="inline">
                运费模板
                <gj-button type="text" @click="syncPlat('6')">同步</gj-button>
              </div>
            </template>
            <gj-select
              v-model="packagInfo.freightTemplateId"
              placeholder="请选择物流模板"
              :trigger-props="{
                updateAtScroll: true,
                autoFitPopupMinWidth: true,
              }"
            >
              <gj-option
                v-for="item in costList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></gj-option>
            </gj-select>
          </gj-form-item>
        </gj-col>

        <!--服务模板-->
        <gj-col :span="8">
          <gj-form-item field="promiseTemplateId">
            <template #label>
              <div class="inline">
                服务模板
                <gj-button type="text" @click="syncPlat('7')">同步</gj-button>
              </div>
            </template>
            <gj-select
              v-model="packagInfo.promiseTemplateId"
              placeholder="请选择服务模板"
              :trigger-props="{
                updateAtScroll: true,
                autoFitPopupMinWidth: true,
              }"
            >
              <gj-option
                v-for="item in serviceList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></gj-option>
            </gj-select>
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  watch,
  computed,
  inject,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import { syncPlatform, getPlatform } from "@/api/published/aliexpress";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  props: {
    editInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    costList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    serviceList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const shopId = inject("shopId");
    const { proxy } = getCurrentInstance();

    const key = "packagInfo"; //

    const data = reactive({
      packagInfo: {
        deliveryTime: "", //发货期
        logisticsWeight: "",
        customWeight: true,
        pieceNumber: "",
        morePieceNumber: "",
        weightIncrease: "",
        packageLength: "",
        packageHeight: "",
        packageWidth: "",
        freightTemplateId: "",
        promiseTemplateId: "",
      },
      rules: {
        deliveryTime: [
          {
            required: true,
            message: "请输入发货期",
            trigger: "blur",
          },
        ],
        logisticsWeight: [
          {
            required: true,
            message: "请输入物流重量",
            trigger: "blur",
          },
        ],
        guaranteeDate: [
          {
            required: true,
            message: "请输入发货期",
            trigger: "blur",
          },
        ],
        freightTemplateId: [
          {
            required: true,
            message: "请选择运费模板",
            trigger: "blur",
          },
        ],
        promiseTemplateId: [
          {
            required: true,
            message: "请选择服务模板",
            trigger: "blur",
          },
        ],
      },
      editData: props.editInfo,
      costList: props.costList,
      serviceList: props.serviceList,
    });

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "packagForm");
    };

    const resetForm = () => {
      proxy.$refs["packagForm"].resetFields();
    };

    //获取运费模板下拉
    const getCostPlat = () => {
      if (!shopId.value) return;
      getPlatform({
        shopId: shopId.value,
        componentType: "6",
      }).then((res) => {
        data.costList = res.data;
      });
    };

    //获取服务模板下拉
    const getServicePlat = () => {
      if (!shopId.value) return;
      getPlatform({
        shopId: shopId.value,
        componentType: "7",
      }).then((res) => {
        data.serviceList = res.data;
      });
    };

    const syncPlat = (type) => {
      if (!shopId.value) {
        return GjMessage.warning("请先选择店铺");
      }
      syncPlatform({
        componentTypes: [type],
        shopId: [shopId.value],
      }).then(() => {
        if (type == "6") {
          getCostPlat();
        } else {
          getServicePlat();
        }
        GjMessage.success("同步成功");
      });
    };

    const total = computed(() => {
      if (
        !data.packagInfo.packageHeight &&
        !data.packagInfo.packageLength &&
        !data.packagInfo.packageWidth
      ) {
        return 0;
      } else {
        return (
          data.packagInfo.packageHeight *
            data.packagInfo.packageLength *
            data.packagInfo.packageWidth || 0
        );
      }
    });

    // watch(
    //   () => shopId.value,
    //   (newValue, oldValue) => {
    //     console.log(newValue, oldValue)
    //     getCostPlat()
    //     getServicePlat()
    //   }
    // )

    watch(
      () => props.costList,
      (newValue) => {
        data.costList = newValue;
      }
    );

    watch(
      () => props.serviceList,
      (newValue) => {
        data.serviceList = newValue;
      }
    );

    watch(
      () => props.editInfo,
      (newValue) => {
        if (JSON.stringify(newValue) === "{}") return;

        data.editData = JSON.parse(JSON.stringify(newValue));
        data.packagInfo.deliveryTime = data.editData.deliveryTime;
        data.packagInfo.logisticsWeight = +data.editData.logisticsWeight;
        data.packagInfo.customWeight = data.editData.customWeight;
        data.packagInfo.pieceNumber = data.editData.pieceNumber;
        data.packagInfo.morePieceNumber = data.editData.morePieceNumber;
        data.packagInfo.weightIncrease = +data.editData.weightIncrease;
        data.packagInfo.packageLength = data.editData.packageLength;
        data.packagInfo.packageHeight = data.editData.packageHeight;
        data.packagInfo.packageWidth = data.editData.packageWidth;
        data.packagInfo.freightTemplateId =
          data.editData.freightTemplateId + "";
        data.packagInfo.promiseTemplateId =
          data.editData.promiseTemplateId + "";
      },
      { deep: true }
    );

    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      syncPlat,
      total,
    };
  },
});
</script>
<style lang="scss" scoped>
.blockBox {
  .title {
    padding: 12px 0 2px 0px;
    font-size: 14px;
    font-weight: 600;
  }
  .form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;

    .inline {
      display: inline-block;
    }
    .squre-line {
      padding: 12px;
      box-sizing: border-box;
      width: 100%;
      border: 1px solid #e6e6ed;
      border-radius: 8px;
      margin-bottom: 10px;
      // :deep(.arco-form-item-content-flex) {
      //   display: inline;
      // }
    }

    .sizeWarp {
      display: flex;
      .sp1 {
        margin: 8px;
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
  }
}
.color1 {
  color: #808197;
}
</style>
