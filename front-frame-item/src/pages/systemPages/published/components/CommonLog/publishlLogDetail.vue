<template>
  <fullScreenDialog :dialogVisible="isVisible" :showFooter="false">
    <template #title>
      <div class="dialog-title">
        <span>详情页</span>
        <gj-button @click="handleCancel" shape="round">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="detail-content">
        <div class="left-silder">
          <template v-for="item in defaultSect" :key="item.sectionId">
            <div class="formHeader">
              <gj-row type="flex" class="row-bg" justify="end">
                <gj-col :span="24">
                  <gj-space size="small">
                    <div class="titleName row-bg">
                      {{ item.sectionId }}
                    </div>
                    <div
                      v-if="formData[item.componentName]?.updated"
                      class="titleName row-bg"
                    >
                      <gj-space size="small">
                        <span class="updatedTxt">更新前:</span>
                        <gj-button class="btnModal" type="text" size="mini"
                          >查看</gj-button
                        >
                      </gj-space>
                    </div>
                  </gj-space>
                </gj-col>
              </gj-row>
            </div>
            <component
              :is="item.componentName"
              :ref="item.ref"
              :formData="formData[item.componentName]"
              :newDetailList="detaillPageList.newDetailList"
              :oldDetailList="detaillPageList.oldDetailList"
            />
          </template>
        </div>
      </div>
    </template>
  </fullScreenDialog>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import basicInfo from "./formComponents/basicInfo.vue";
import productInfo from "./formComponents/productInfo.vue";
import productAttributesInfo from "./formComponents/productAttributesInfo.vue";
import compatibilityInfo from "./formComponents/compatibilityInfo.vue";
import salesInfo from "./formComponents/salesInfo.vue";
import pictureVideoInfo from "./formComponents/pictureVideoInfo.vue";
import productDescriptionInfo from "./formComponents/productDescriptionInfo.vue";
import logisticsPolicy from "./formComponents/logisticsPolicy.vue";
import packagingInformationInfo from "./formComponents/packagingInformationInfo.vue";
import paymentPolicy from "./formComponents/paymentPolicy.vue";
import returnPolicy from "./formComponents/returnPolicy.vue";
import locationOfGoods from "./formComponents/locationOfGoods.vue";
import buyerRequirements from "./formComponents/buyerRequirements.vue";
// import { formData } from './index.js'

// import { useStore } from 'vuex'
import fullScreenDialog from "@pagesSystem/published/components/fullScreenDialog";
export default defineComponent({
  name: "eBayBoardDetail",
  components: {
    basicInfo,
    productInfo,
    productAttributesInfo,
    compatibilityInfo,
    salesInfo,
    pictureVideoInfo,
    productDescriptionInfo,
    logisticsPolicy,
    packagingInformationInfo,
    paymentPolicy,
    returnPolicy,
    locationOfGoods,
    buyerRequirements,
    fullScreenDialog,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    defaultSect: {
      type: Array,
      default: () => {
        return [];
      },
    },
    detaillPageList: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, ctx) {
    const data = reactive({});
    const handleCancel = () => {
      ctx.emit("setVisible", false);
    };
    return {
      ...toRefs(data),
      handleCancel,
    };
  },
});
</script>
<style scoped lang="scss">
.detail-content {
  padding: 0px 24px 16px 8px;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  .left-silder {
    padding-right: 24px;
    width: calc(100% - 0px);
  }
  .right-silder {
    padding-top: 16px;
    height: 500px;
    width: 100px;
    position: fixed;
    right: 24px;
    top: 80px;
    background: rgb(119, 128, 119);
    .arco-anchor {
      width: 100%;
    }
  }
  .formHeader {
    width: 100%;
    font-size: 14px;
    font-weight: 700;
    color: #000;
    .row-bg {
      height: 32px;
    }
    .titleName {
      display: flex;
      align-items: center;
    }
    .text_rigth {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .updatedTxt,
  :deep(.arco-btn-size-medium).btnModal {
    font-weight: normal;
  }
  .updatedTxt {
    color: #ff5c5c;
  }
  :deep(.arco-btn-size-medium).btnModal {
    padding: 0px;
  }
}
</style>
