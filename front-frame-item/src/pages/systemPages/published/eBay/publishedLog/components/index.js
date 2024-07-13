const formData = {
  basicInfo: {
    updated: false,
    info: [
      { colSpan: 8, label: "站点", prop: "stationCode" },
      {
        colSpan: 8,
        label: "店铺",
        prop: "shopCode",
      },
      {
        colSpan: 8,
        label: "负责人",
        prop: "chargePersonName",
        updated: true,
      },
      {
        colSpan: 8,
        label: "产品分类",
        prop: "categoryId",
        updated: true,
      },
      {
        colSpan: 8,
        label: "店铺分类",
        prop: "shopCategory",
        updated: true,
      },
      {
        colSpan: 8,
        label: "第二店铺分类",
        prop: "secondShopCategory",
        updated: true,
      },
    ],
  },
  productInfo: {
    updated: false,
    info: [
      { colSpan: 24, label: "标题", prop: "defaultTitle", updated: true },
      { colSpan: 24, label: "副标题", prop: "subtitle", updated: true },
      { colSpan: 24, label: "店铺SKU", prop: "msku", updated: true },
      {
        colSpan: 24,
        label: "第一分类",
        prop: "platformCategoryId",
        updated: true,
      },
      {
        colSpan: 24,
        label: "第二分类",
        prop: "secondPlatformCategoryId",
        updated: true,
      },
      { colSpan: 8, label: "规格", prop: "specsType", updated: true },
      { colSpan: 8, label: "关联SKU", prop: "spu", updated: true },
      { colSpan: 8, label: "销售类型", prop: "listingType", updated: true },
      { colSpan: 8, label: "UPC编码", prop: "upcCode", updated: true },
      { colSpan: 8, label: "物品状况", prop: "ebayCondition", updated: true },
      {
        colSpan: 24,
        label: "状况描述",
        prop: "conditionDescription",
        updated: true,
      },
    ],
  },
  productDescriptionInfo: {
    updated: true,
    info: [
      { colSpan: 24, label: "详情模板", prop: "descriptionTemplateId" },
      { colSpan: 24, label: "详情描述", prop: "description" },
    ],
  },
  packagingInformation: {
    updated: true,
    info: [
      { colSpan: 8, label: "包装类型", prop: "shippingPackage" },
      // { colSpan: 8, label: "不规则包裹", prop: "detailedDescription", },
      { colSpan: 8, label: "测量单位", prop: "detailedDescription" },
      {
        colSpan: 8,
        label: "尺寸",
        propDepth: "packageDepth",
        propWidth: "packageWidth",
        propLength: "packageLength",
      },
      {
        colSpan: 8,
        label: "重量",
        propLength: "weightMajor",
        propWidth: "weightMinor",
      },
    ],
  },
  paymentPolicy: {
    updated: true,
    info: [
      { colSpan: 24, label: "立即付款", prop: "autoPay" },
      { colSpan: 24, label: "付款说明", prop: "payDescription" },
    ],
  },
  returnPolicy: {
    updated: true,
    info: [
      { colSpan: 24, label: "国内退货", prop: "title", isTitle: true },
      { colSpan: 6, label: "国内退货政策", prop: "domesticReturnEnable" },
      { colSpan: 6, label: "退货天数", prop: "domesticReturnTime" },
      { colSpan: 6, label: "退款方式", prop: "domesticReturnType" },
      { colSpan: 6, label: "退货运费由谁承担", prop: "domesticReturnCostBy" },
      { colSpan: 24, label: "国际退货", prop: "title", isTitle: true },
      { colSpan: 6, label: "国际退货政策", prop: "internationalReturnEnable" },
      { colSpan: 6, label: "退货天数", prop: "internationalReturnTime" },
      { colSpan: 6, label: "退款方式", prop: "internationalReturnType" },
      {
        colSpan: 6,
        label: "退货运费由谁承担",
        prop: "internationalReturnCostBy ",
      },
      { colSpan: 24, label: "退货政策说明", prop: "returnDescription" },
    ],
  },
  locationOfGoods: {
    updated: true,
    info: [
      { colSpan: 8, label: "物品所在国家", prop: "country " },
      { colSpan: 8, label: "物品所在邮编", prop: "postalCode" },
      { colSpan: 8, label: "物品所在地", prop: "itemLocationTemplateId" },
    ],
  },
  logisticsPolicy: {
    updated: true,
    info: [],
  },
};

export { formData };
