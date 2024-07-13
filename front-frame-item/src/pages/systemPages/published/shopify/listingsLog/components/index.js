const formData = {
  essentialInfo: {
    updated: false,
    info: [
      { colSpan: 24, label: "产品标题", prop: "titles" },
      {
        colSpan: 8,
        label: "店铺",
        prop: "storeName",
      },
      {
        colSpan: 8,
        label: "产品分类",
        prop: "categoryId",
        updated: true,
      },
      {
        colSpan: 8,
        label: "负责人",
        prop: "chargePersonName",
        updated: true,
      },
    ],
  },
  productInfo: {
    updated: false,
    info: [
      {
        colSpan: 8,
        label: "shopify产品类别",
        prop: "productCategory",
        updated: true,
      },
      { colSpan: 8, label: "供应商", prop: "supplier", updated: true },
      { colSpan: 8, label: "标签", prop: "tags", updated: true },
      {
        colSpan: 8,
        label: "产品系列",
        prop: "productCollectionId",
        updated: true,
      },
      {
        colSpan: 24,
        label: "销售渠道和应用",
        prop: "salesChannelsApplications",
        updated: true,
      },
      { colSpan: 8, label: "模板样式", prop: "templateStyle", updated: true },
    ],
  },
  variantInfo: {
    updated: true,
    info: [
      { colSpan: 8, label: "规格", prop: "specsType" },
      { colSpan: 8, label: "关联SPU", prop: "spu" },
    ],
  },
  pictureInfo: {
    updated: false,
    info: [
      { colSpan: 24, label: "产品图片", prop: "productImages" },
      { colSpan: 24, label: "变体图片", prop: "productImages" },
    ],
  },
  productDescriptionInfo: {
    updated: true,
    info: [{ colSpan: 24, label: "", prop: "descriptions" }],
  },
  searchEnginesInfo: {
    updated: false,
    info: [
      { colSpan: 24, label: "标题", prop: "searchEngineTitle" },
      { colSpan: 24, label: "元描述", prop: "searchEngineDesc" },
      { colSpan: 24, label: "url", prop: "searchEngineUrl" },
    ],
  },
};

export { formData };
