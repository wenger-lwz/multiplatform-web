<template>
  <CommonLog
    :platformCode="platformCode"
    :columnsLsit="columns"
    :requestApi="requestApi"
  >
    <template #loaddingPageStyle>
      <publishlLogDetail
        :isVisible="visible"
        @setVisible="getVisible"
        :formData="formList"
        :defaultSect="defaultSect"
        :detaillPageList="detaillPageList"
      ></publishlLogDetail>
    </template>
  </CommonLog>
</template>

<script>
import { defineComponent, reactive, toRefs, h } from "vue";
import CommonLog from "./components/CommonLog.vue";
import { onlineLog } from "@/api/public";
import { formData } from "./components/index.js";
import publishlLogDetail from "@pagesSystem/published/components/CommonLog/publishlLogDetail.vue";

export default defineComponent({
  name: "",
  components: {
    CommonLog,
    publishlLogDetail,
  },
  setup() {
    const data = reactive({
      platformCode: "EBAY",
      visible: false,
      formList: {},
      detaillPageList: {},
      defaultSect: [
        {
          // name: 'eBay.basicInfo',
          name: "店铺信息",
          componentName: "basicInfo",
          ref: "basicForm",
          sectionId: "店铺信息",
        },
        {
          // name: 'eBay.productInformation',
          name: "产品信息",
          componentName: "productInfo",
          ref: "productForm",
          sectionId: "产品信息",
        },
        {
          // name: 'eBay.productAttributes',
          name: "产品属性",
          componentName: "productAttributesInfo",
          ref: "productAttributesForm",
          sectionId: "产品属性",
        },
        {
          // name: 'eBay.accessoryCompatibility',
          name: "配件兼容性",
          componentName: "compatibilityInfo",
          ref: "compatibilityForm",
          sectionId: "配件兼容性",
        },
        {
          // name: 'eBay.salesInfo',
          name: "销售信息",
          componentName: "salesInfo",
          ref: "salesForm",
          sectionId: "销售信息",
        },
        {
          // name: 'eBay.pictureVideo',
          name: "图片视频",
          componentName: "pictureVideoInfo",
          ref: "pictureVideoForm",
          sectionId: "图片视频",
        },
        {
          // name: 'eBay.productDescription',
          name: "产品描述",
          componentName: "productDescriptionInfo",
          ref: "productDescriptionForm",
          sectionId: "产品描述",
        },
        {
          // name: 'eBay.logisticsPolicy',
          name: "物流政策",
          componentName: "logisticsPolicy",
          ref: "logisticsPolicyForm",
          sectionId: "物流政策",
        },
        {
          // name: 'eBay.packagingInformation',
          name: "包装信息",
          componentName: "packagingInformationInfo",
          ref: "packagingInformationForm",
          sectionId: "包装信息",
        },
        {
          // name: 'eBay.paymentPolicy',
          name: "付款政策",
          componentName: "paymentPolicy",
          ref: "paymentPolicyForm",
          sectionId: "付款政策",
        },
        {
          // name: 'eBay.returnPolicy',
          name: "退货政策",
          componentName: "returnPolicy",
          ref: "returnPolicyForm",
          sectionId: "退货政策",
        },
        {
          // name: 'eBay.locationOfGoods',
          name: "物品所在地",
          componentName: "locationOfGoods",
          ref: "locationOfGoodsForm",
          sectionId: "物品所在地",
        },
        {
          // name: 'eBay.buyerRequirements',
          name: "买家要求",
          componentName: "buyerRequirements",
          ref: "buyerRequirementsForm",
          sectionId: "买家要求",
        },
      ],
      columns: [
        {
          title: "标题",
          dataIndex: "title",
        },
        {
          title: "站点",
          dataIndex: "stationName",
        },
        {
          title: "店铺",
          dataIndex: "shopName",
        },

        {
          title: "店铺sku",
          dataIndex: "shopSku",
        },
        {
          title: "SKU",
          dataIndex: "sku",
        },
        {
          title: "负责人",
          dataIndex: "responsibleName",
        },
        {
          title: "更新人",
          dataIndex: "publisherName",
        },
        {
          title: "更新时间",
          dataIndex: "createdTime",
        },
        {
          title: "结果",
          dataIndex: "publishResult",
          render: (record) => {
            let text = "";
            let color = "";
            if (record.record.publishResult === 1) {
              text = <span>更新成功</span>;
              color = "color:green";
            } else if (record.record.publishResult === 2) {
              const failedReason = record.record.failedReason;
              text = (
                <gj-popover position="left" content={failedReason}>
                  <span>更新失败</span>
                </gj-popover>
              );
              color = "color:red";
            }
            return h(
              "span",
              {
                calss: ["publishResultStatus"],
                style: color,
              },
              text
            );
          },
        },
        {
          title: "操作",
          dataIndex: "Action",
          fixed: "right",
          width: 60,
          render: (record) =>
            h("span", null, [
              h(
                "span",
                {
                  onClick: () => {
                    lookDetailPage(record);
                  },
                },
                <gj-button type="text">详情</gj-button>
              ),
            ]),
        },
      ],
      requestApi: onlineLog,
    });
    // 详情页
    const lookDetailPage = (e) => {
      console.log("详情页数据", e);
      data.visible = true;
      data.formList = formData;
      // 详情数据
      data.detaillPageList = {
        newDetailList: {
          stationCode: "这是一个站点信息",
          shopCode: "店铺1",
          chargePersonName: "lizeyan ",
          categoryId: "分类一",
          shopCategory: "JJJJJ",
          secondShopCategory: "sadff",
          defaultTitle:
            "HJOODDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDOP",
          subtitle: "HJOOOP",
          msku: "HJOOOP",
          platformCategoryId: "HJOOOP",
          secondPlatformCategoryId: "HJOOOP",
          specsType: "HJOOOP",
          spu: "HJOOOP",
          listingType: "HJOOOP",
          upcCode: "HJOOOP",
          ebayCondition: "HJOOOP",
          conditionDescription: "HJOOOP",
          detailTemplate: "kkkkk",
          detailedDescription: "sssddd",
        },
        oldDetailList: {
          chargePersonName: "lizeyan 1",
          categoryId: "分类一1",
          shopCategory: "JJJJJ1",
          secondShopCategory: "店铺分类二",
          defaultTitle: "HJOOOP",
          subtitle: "HJOOOP",
          msku: "HJOOOP",
          platformCategoryId: "HJOOOP",
          secondPlatformCategoryId: "HJOOOP",
          specsType: "HJOOOP",
          spu: "HJOOOP",
          listingType: "HJOOOP",
          upcCode: "HJOOOP",
          ebayCondition: "HJOOOP",
          conditionDescription: "HJOOOP",
          detailTemplate: "sssss",
          detailedDescription: "sssdsssdd",
        },
      };
    };
    // 弹框显示
    const getVisible = (val) => {
      data.visible = val;
    };
    return {
      ...toRefs(data),
      lookDetailPage,
      getVisible,
    };
  },
});
</script>

<style scoped lang="scss"></style>
