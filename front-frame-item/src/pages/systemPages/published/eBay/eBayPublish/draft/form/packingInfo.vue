// 包装信息 付款政策 packingInfo
<template>
  <div class="packing-info" id="packingInfo-ebay">
    <h2 class="titles">
      包装信息{{ $store.getters.getdraftData?.domesticType }}
    </h2>
    <gj-form
      ref="packingForm"
      :model="packingInfo"
      class="packing-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="$store.getters.getdraftData?.domesticType ? rules : []"
      @submit="submitForm"
    >
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            field="shippingPackage"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="包裹类型"
          >
            <gj-select
              v-model="packingInfo.shippingPackage"
              placeholder="请选择"
              allow-clear
              @change="getshippingPackageName"
              @popup-visible-change="handlePopup"
            >
              <gj-option
                v-for="item in shippingPackageData"
                :key="item.shippingPackageCode"
                :value="item.shippingPackageCode"
                >{{ item.shippingPackageEnName }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="不规则包裹"
          >
            <gj-switch
              size="small"
              v-model="packingInfo.shippingIrregular"
              :checked-value="true"
              :unchecked-value="false"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="measurementUnit"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="测量单位"
          >
            <gj-select
              placeholder="请选择"
              v-model="packingInfo.measurementUnit"
            >
              <gj-option value="English">English</gj-option>
              <gj-option value="Metric">Metric</gj-option>
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="packageLength"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            :label="`物流尺寸(单位：${
              packingInfo.measurementUnit == 'English' ? 'inch' : 'cm'
            })`"
          >
            <gj-input-number
              placeholder=""
              :min="1"
              :max="1000000"
              :style="{ maxWidth: '140px' }"
              v-model="packingInfo.packageLength"
            >
              <template #prepend> 长 </template>
            </gj-input-number>
            <span class="pding">*</span>
            <gj-input-number
              :min="1"
              :max="1000000"
              placeholder=""
              :style="{ maxWidth: '140px' }"
              v-model="packingInfo.packageWidth"
            >
              <template #prepend>宽 </template>
            </gj-input-number>
            <span class="pding">*</span>
            <gj-input-number
              :min="1"
              :max="1000000"
              placeholder=""
              v-model="packingInfo.packageDepth"
              :style="{ maxWidth: '140px' }"
            >
              <template #prepend>高 </template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="weightMajor"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="重量"
          >
            <gj-input-number
              placeholder="包装重量较大值"
              :min="1"
              :max="packingInfo.measurementUnit == 'English' ? 16 : 999"
              v-model="packingInfo.weightMajor"
            >
              <template #prepend
                >{{ packingInfo.measurementUnit == "English" ? "IBS" : "kg" }}
              </template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>

        <gj-col :span="8">
          <gj-form-item
            field="weightMinor"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="重量"
          >
            <gj-input-number
              placeholder="包装重量较小值"
              :min="1"
              :max="999"
              v-model="packingInfo.weightMinor"
            >
              <template #prepend
                >{{ packingInfo.measurementUnit == "English" ? "OZ" : "g" }}
              </template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>

    <gj-row :gutter="24" class="pt">
      <gj-col :span="12">
        <gj-space>
          <h2 class="title">付款政策</h2>
        </gj-space>
      </gj-col>
      <gj-col :span="12" class="header_rigth">
        <gj-row justify="end">
          <gj-space>
            <gj-select
              size="small"
              :style="{ width: '160px' }"
              v-model="packingInfo.paymentTemplateId"
              placeholder="请选择模板"
              allow-clear
              :trigger-props="{ autoFitPopupMinWidth: true }"
              @popup-visible-change="getItemLocationTemplateId"
            >
              <gj-option
                v-for="item in templateList"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</gj-option
              >
            </gj-select>

            <gj-button type="text">另存为模板</gj-button>
          </gj-space>
        </gj-row>
      </gj-col>
    </gj-row>
    <gj-form
      :model="packingInfo"
      class="packing-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <gj-row :gutter="24">
        <gj-col :span="24">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="立即付款"
          >
            <gj-switch
              size="small"
              v-model="packingInfo.autoPay"
              :checked-value="true"
              :unchecked-value="false"
            /><span>已开启</span>
          </gj-form-item>
        </gj-col>
        <gj-col :span="24">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="付款说明"
          >
            <gj-textarea
              id="editorRef"
              :default-value="packingInfo.payDescription"
              placeholder="请输入描述"
              :max-length="4000"
              show-word-limit
              class="des-textarea"
            />
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, onMounted, watch } from "vue";
import { setForm } from "@/utils/fnBusiness";
import {
  getQueryEbayShippingPackages,
  getEbayTemplateAssemblyInfo,
} from "@api/published/ebay.js";
import { validateTriggerOpt } from "@common";
import { useStore } from "vuex";
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
  components: {},
  setup(props) {
    const { proxy } = getCurrentInstance();
    const store = new useStore();
    const key = "packingInfo";
    const data = reactive({
      packingInfo: {
        shippingPackage: "",
        shippingPackageName: "",
        shippingIrregular: false,
        measurementUnit: "English",
        packageLength: null,
        packageWidth: null,
        packageDepth: null,
        weightMajor: null,
        weightMinor: null,
        paymentTemplateId: "",
        autoPay: false, //立即付款
        payDescription: "", //付款说明
      },
      shippingPackageData: [],
      validateTriggerOpt,
      rules: {
        shippingPackage: [{ required: true, message: "必填" }],
        measurementUnit: [{ required: true, message: "必填" }],
        packageLength: [{ required: true, message: "必填" }],
        weightMajor: [
          { required: true, message: "必填" },
          { type: "number", max: 999, message: "包装重量较大值小于1000" },
        ],
        weightMinor: [
          { required: true, message: "必填" },
          { type: "number", max: 999, message: "包装重量较大值小于1000" },
        ],
      },
      templateList: [],
    });
    const getshippingPackageName = (e) => {
      console.log(e, "pp");

      // shippingPackageData
    };
    const handlePopup = (val) => {
      if (!val) return;
      let params = {
        siteId: store.getters.getgoodsData.siteId,
      };
      getQueryEbayShippingPackages(params).then((res) => {
        console.log(res);
        data.shippingPackageData = res.data;
      });
    };
    const submitForm = () => {
      return setForm(proxy, key, data[key], "packingForm");
    };
    const resetForm = () => {
      proxy.$refs.basicForm.resetFields();
    };
    const getItemLocationTemplateId = (val) => {
      if (val) {
        const params = {
          url: "payment",
          params: {
            pageCurrent: 1,
            pageSize: 100,
            siteIds: [store.getters.getgoodsData.siteId],
          },
        };
        getEbayTemplateAssemblyInfo(params).then((res) => {
          data.templateList = res.data?.records.map((item) => {
            return {
              name: item.name,
              id: item.id,
            };
          });
        });
      }
    };

    watch(
      () => props.goodsRowData,
      () => {
        data.packingInfo = { ...props.goodsRowData };
        getItemLocationTemplateId(true);
      }
    );

    onMounted(() => {});
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      handlePopup,
      getItemLocationTemplateId,
      getshippingPackageName,
    };
  },
};
</script>

<style lang="scss" scoped>
.packing-info {
  box-sizing: border-box;
  .titles {
    padding: 16px 0 2px 0px;
    font-size: 14px;
  }
  .pt {
    padding: 16px 0px 2px 0px;
    margin-right: 7px !important;
    .title {
      font-size: 14px;
    }
  }
  .header_rigth {
    text-align: left;
  }
  .packing-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
  .pding {
    padding: 8px;
  }
}
</style>
