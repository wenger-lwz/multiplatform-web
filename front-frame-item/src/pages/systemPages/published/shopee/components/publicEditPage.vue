<template>
  <gj-layout class="layout-demo">
    <gj-layout-header>
      <div>编辑商品</div>
      <gj-button>关闭</gj-button>
    </gj-layout-header>
    <gj-layout class="conentStyle">
      <gj-layout-content class="layoutConent">
        <div
          v-for="item in listData"
          :key="item.sectionId"
          :id="`${item.sectionId}`"
          class="layoutContentItem"
        >
          <template v-if="item.sectionId === templateName.basicInfo">
            <CommonFormHeader :title="item.sectionId"></CommonFormHeader>
            <basicInfo
              :formData="newFormData.basicInfo"
              ref="basicForm"
            ></basicInfo>
          </template>
          <template v-if="item.sectionId === templateName.logisticsPolicy">
            <CommonFormHeader :title="item.sectionId">
              <template #rigthBox>
                <rigthBox></rigthBox>
              </template>
            </CommonFormHeader>
            <!-- <logisticsPolicy
              :formData="newFormData.logisticsPolicy"
              ref="logisticsPolicyForm"
            ></logisticsPolicy> -->
          </template>
          <template v-if="item.sectionId === templateName.paymentPolicy">
            <CommonFormHeader
              :title="templateName.sectionId"
              :rigthBox="isShow"
            >
              <template #rigthBox>
                <rigthBox></rigthBox>
              </template>
            </CommonFormHeader>
            <!-- <paymentPolicy
              :formData="newFormData.paymentPolicy"
              ref="paymentPolicyForm"
            ></paymentPolicy> -->
          </template>
          <template v-if="item.sectionId === templateName.returnPolicy">
            <CommonFormHeader :title="item.sectionId" :rigthBox="isShow">
              <template #rigthBox>
                <rigthBox></rigthBox>
              </template>
            </CommonFormHeader>
            <!-- <returnPolicy
              :formData="newFormData.returnPolicy"
              ref="returnPolicyForm"
            ></returnPolicy> -->
          </template>
          <template v-if="item.sectionId === templateName.buyerRequirements">
            <CommonFormHeader :title="item.sectionId" :rigthBox="isShow">
              <template #rigthBox>
                <gj-form :model="fromDataList" label-width="100px">
                  <gj-form-item label="模版名称">
                    <gj-input
                      type="text"
                      v-model="name"
                      placeholder="请输入模版名称"
                      size="small"
                      style="width: 126px"
                    ></gj-input>
                    <gj-button
                      style="margin-left: 10px"
                      type="default"
                      size="small"
                      >取消</gj-button
                    >
                    <gj-button
                      style="margin-left: 10px"
                      type="primary"
                      size="small"
                      >保存</gj-button
                    >
                  </gj-form-item>
                </gj-form>
              </template>
            </CommonFormHeader>
            <!-- <buyerRequirements
              :formData="newFormData.buyerRequirements"
              ref="buyerRequirementsForm"
            ></buyerRequirements> -->
          </template>
          <template v-if="item.sectionId === templateName.locationOfGoods">
            <CommonFormHeader :title="item.sectionId" :rigthBox="isShow">
              <template #rigthBox>
                <rigthBox></rigthBox>
              </template>
            </CommonFormHeader>
            <!-- <locationOfGoods
              :formData="newFormData.locationOfGoods"
              ref="locationOfGoodsForm"
            ></locationOfGoods> -->
          </template>
          <template v-if="item.sectionId === templateName.salesInfo">
            <CommonFormHeader :title="item.sectionId"></CommonFormHeader>
            <!-- <salesInfo
              :formData="newFormData.salesInfo"
              ref="salesForm"
            ></salesInfo> -->
          </template>
          <template v-if="item.sectionId === templateName.compatibilityInfo">
            <CommonFormHeader :title="item.sectionId"></CommonFormHeader>
            <!-- <compatibilityInfo
              :formData="newFormData.compatibilityInfo"
              ref="compatibilityForm"
            ></compatibilityInfo> -->
          </template>
        </div>
      </gj-layout-content>
      <gj-layout-sider class="layoutSider">
        <!-- <gj-affix :offsetTop="10">
          <gj-anchor :change-hash="false">
            <gj-anchor-link
              v-for="item in listData"
              :href="`#${item.sectionId}`"
              :key="item.sectionId"
              >{{ $t(item.sectionId) }}</gj-anchor-link
            >
          </gj-anchor>
        </gj-affix> -->
      </gj-layout-sider>
    </gj-layout>
    <gj-layout-footer class="formFooter">
      <gj-space class="bd">
        <gj-button @click="save">取消</gj-button>
        <gj-button @click="submitForm">确认</gj-button>
        <gj-button @click="submitForm" type="primary">保存并生成草稿</gj-button>
      </gj-space>
    </gj-layout-footer>
  </gj-layout>
</template>

<script>
import { defineComponent, reactive, toRefs, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { getShopeeProductDetails } from "@api/published/shopee.js";

export default defineComponent({
  setup() {
    const $router = useRouter();

    const data = reactive({});

    // 查询商品资料详情
    const getDetailsData = async () => {
      try {
        const id = $router.currentRoute.value.query.id;
        const res = await getShopeeProductDetails(id);

        if (res.code === 200) {
          const {
            site,
            chargePersonName,
            categoryId,
            titles,
            condition,
            specsType,
            weight,
            width,
            length,
            height,
          } = res.data;

          // store.getters.getParams['detailsData'] = res.data

          // 基础信息
          const basicInfoContent = {
            site: [{ value: site }],
            chargePersonName: [{ value: chargePersonName }],
            categoryId: [{ value: categoryId }],
          };

          // 产品信息
          const t = titles.map((item) => {
            return { value: item };
          });

          const productInfoContent = {
            titles: t,
            condition: condition == 1 ? "全新" : "二手",
            specsType: specsType == 1 ? "单品" : "变体",
            weight,
            width,
            length,
            height,
          };

          data.basicInfoDetailsData = basicInfoContent;
          data.productInfoDetailsData = productInfoContent;
        }
      } catch (error) {
        console.log("查询失败！", error);
        throw error;
      }
    };

    onBeforeMount(async () => {
      await getDetailsData();
    });

    return {
      ...toRefs(data),
      getDetailsData,
    };
  },
});
</script>

<style lang="scss" scoped>
.layout-demo {
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
  display: flex;
  box-sizing: border-box;
  flex-flow: column;
  :deep(.arco-layout-header) {
    height: 40px;
    border: 1px solid#f2f2f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 24px;
  }
  .conentStyle {
    height: calc(100% - 100px);
    display: flex;
    justify-content: space-between;
  }
  .layoutConent {
    justify-content: flex-start;
  }
  .layoutSider {
    justify-content: flex-end;
    margin-left: 6px;
  }
  .arco-layout-sider-light {
    background: #fff;
    box-shadow: none;
  }
  :deep(.arco-layout-footer) {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 48px;
    z-index: 1;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: right;
    border-top: 1px solid #e6e6ed;
    // box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
    .bd {
      box-sizing: border-box;
      .el-button {
        border-radius: 2px;
      }
    }
  }
  .layoutConent .layoutContentItem:last-child :deep(.formStyle) {
    margin-bottom: 50px;
  }
  :deep(.arco-layout) {
    flex-direction: row;
  }
}
</style>
