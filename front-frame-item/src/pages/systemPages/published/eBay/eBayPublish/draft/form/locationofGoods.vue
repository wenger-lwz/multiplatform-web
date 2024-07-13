// 物品所在地
<template>
  <div class="locationofGoods-info" id="locationofGoodsInfo-ebay">
    <gj-row :gutter="24" class="pt">
      <gj-col :span="12">
        <gj-space>
          <h2 class="title">物品所在地</h2>
        </gj-space>
      </gj-col>
      <gj-col :span="12" class="header_rigth">
        <gj-row justify="end">
          <gj-space>
            <gj-select
              size="small"
              :style="{ width: '160px' }"
              v-model="locationofGoodsInfo.itemLocationTemplateId"
              placeholder="请选择"
              allow-clear
              :trigger-props="{ autoFitPopupMinWidth: true }"
              @popup-visible-change="getItemLocationTemplateId"
            >
              <gj-option
                v-for="item in locationTemplateList"
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
      ref="returnPolicyForm"
      :model="locationofGoodsInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="submitForm"
    >
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            field="country"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="物品所在国家"
          >
            <gj-select
              size="small"
              v-model="locationofGoodsInfo.country"
              placeholder="请选择"
              allow-clear
              @popup-visible-change="popChangeLocationCountryList"
            >
              <gj-option
                v-for="item in locationCountryList"
                :key="item.country"
                :value="item.country"
                >{{ item.countryEnName }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>

        <gj-col :span="8">
          <gj-form-item
            field="postalCode"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="物品所在邮编"
          >
            <gj-input
              placeholder="请输入"
              v-model="locationofGoodsInfo.postalCode"
            >
            </gj-input>
          </gj-form-item>
        </gj-col>

        <gj-col :span="8">
          <gj-form-item
            field="location"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="物品所在地址"
          >
            <gj-input
              placeholder="请输入"
              v-model="locationofGoodsInfo.location"
            >
            </gj-input>
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
  getQueryEbayLocationCountry,
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
    const key = "locationofGoodsInfo";
    const data = reactive({
      locationofGoodsInfo: {
        itemLocationTemplateId: "", //物品所在地模板id
        postalCode: "", //物品所在邮编
        location: "", //物品所在地址
        country: "", //物品所在国家
      },
      locationCountryList: [],
      validateTriggerOpt,
      rules: {
        siteId: [{ required: true, message: "站点必填" }],
        location: [{ required: true, message: "必填" }],
        country: [{ required: true, message: "必填" }],
        chargePersonId: [{ required: true, message: "负责人必填" }],
      },
      locationTemplateList: [],
      returnTemplateList: [],
    });

    const popChangeLocationCountryList = () => {
      const prams = {
        siteId: store.getters.getgoodsData.siteId,
      };
      getQueryEbayLocationCountry(prams).then((res) => {
        data.locationCountryList = res.data;
      });
    };
    const submitForm = () => {
      return setForm(proxy, key, data[key], "returnPolicyForm");
    };
    const resetForm = () => {
      proxy.$refs.returnPolicyForm.resetFields();
    };

    const getItemLocationTemplateId = (val) => {
      if (val) {
        const params = {
          url: "location",
          params: {
            pageCurrent: 1,
            pageSize: 100,
            siteIds: [store.getters.getgoodsData.siteId],
          },
        };
        getEbayTemplateAssemblyInfo(params).then((res) => {
          data.locationTemplateList = res.data?.records.map((item) => {
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
        data.locationofGoodsInfo = { ...props.goodsRowData };
        popChangeLocationCountryList(true);
      }
    );

    onMounted(() => {
      // if (props.actionType == 'add') {}
    });
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      popChangeLocationCountryList,
      getItemLocationTemplateId,
    };
  },
};
</script>

<style lang="scss" scoped>
.locationofGoods-info {
  box-sizing: border-box;
  padding: 0 16px 0 8px;
  .titles {
    padding: 16px 0 2px 0px;
    font-size: 14px;
  }
  .pt {
    padding: 16px 0px 2px 0px;
    // margin-right: 7px !important;
    .title {
      font-size: 14px;
    }
  }
  .header_rigth {
    text-align: left;
  }
  .locationofGoods-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
</style>
