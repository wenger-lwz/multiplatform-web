export const siteList = [
  // platformCode 传给后台的值
  {
    platformCode: "my",
    platformName: "马来西亚",
  },
  {
    platformCode: "id",
    platformName: "印度尼西亚",
  },
  {
    platformCode: "sg",
    platformName: "新加坡",
  },
  {
    platformCode: "ph",
    platformName: "菲律宾",
  },
  {
    platformCode: "th",
    platformName: "泰国",
  },
  {
    platformCode: "vn",
    platformName: "越南",
  },
];

export const specificationList = [
  {
    code: 1,
    productName: "单品",
  },
  {
    code: 2,
    productName: "变体",
  },
];

// 在线商品页的更新状态
export const statusListOpt = [
  {
    label: "正常",
    value: "1",
  },
  {
    label: "更新失败",
    value: "2",
  },
  {
    label: "暂存未更新",
    value: "3",
  },
];

// 草稿列表页的状态
export const draftStatusList = [
  {
    label: "待发布",
    value: "1",
  },
  {
    label: "发布失败",
    value: "3",
  },
  {
    label: "已发布",
    value: "2",
  },
];

// 草稿/在线商品 的变体信息
export const variantListColumns = [
  {
    title: "店铺SKU",
    dataIndex: "msku",
    width: 120,
  },
  {
    title: "库存",
    dataIndex: "quantity",
    align: "right",
    width: 60,
  },
  {
    title: "价格",
    dataIndex: "recommendPrice",
    align: "right",
    width: 120,
    showRecommendPriceUnit: true,
  },
  {
    title: `促销价`,
    dataIndex: "specialPrice",
    align: "right",
    width: 130,
    showRecommendPriceUnit: true,
  },
];

export const offSelfColumns = [
  {
    key: "imgs",
    dataIndex: "imgs",
    title: "图片",
    minWidth: 50,
    fixed: "left",
  },
  {
    key: "title",
    dataIndex: "title",
    title: "标题",
    minWidth: 150,
    fixed: "left",
  },
  {
    key: "productId",
    dataIndex: "productId",
    title: "商品ID",
    minWidth: 150,
  },
  {
    key: "sku",
    dataIndex: "sku",
    title: "SPU/SKU",
    minWidth: 150,
  },
  {
    key: "shopName",
    dataIndex: "shopName",
    title: "店铺",
    minWidth: 150,
  },
  {
    key: "siteId",
    dataIndex: "siteId",
    title: "站点",
    minWidth: 150,
  },
  {
    key: "shopSku",
    dataIndex: "shopSku",
    title: "店铺SKU",
    minWidth: 150,
  },
  {
    key: "type",
    dataIndex: "type",
    title: "Lazada分类",
    minWidth: 150,
  },
  {
    key: "prType",
    dataIndex: "prType",
    title: "规格",
    minWidth: 150,
  },
  {
    key: "price",
    dataIndex: "price",
    title: "售价",
    minWidth: 150,
  },
  {
    key: "responePerson",
    dataIndex: "responePerson",
    title: "负责人",
    minWidth: 150,
  },
  {
    key: "offselfPerson",
    dataIndex: "offselfPerson",
    title: "下架人",
    minWidth: 150,
  },
  {
    key: "offselfTime",
    dataIndex: "offselfTime",
    title: "下架时间",
    minWidth: 150,
  },
  {
    key: "operation",
    dataIndex: "operation",
    title: "操作",
    minWidth: 150,
    fixed: "right",
  },
];
export const quantityCheckColumns = [
  {
    key: "imgs",
    dataIndex: "imgs",
    title: "图片",
    minWidth: 50,
    fixed: "left",
  },
  {
    key: "title",
    dataIndex: "title",
    title: "标题",
    minWidth: 150,
    fixed: "left",
  },
  {
    key: "productId",
    dataIndex: "productId",
    title: "商品ID",
    minWidth: 150,
  },
  {
    key: "sku",
    dataIndex: "sku",
    title: "SPU/SKU",
    minWidth: 150,
  },
  {
    key: "shopName",
    dataIndex: "shopName",
    title: "店铺",
    minWidth: 150,
  },
  {
    key: "siteId",
    dataIndex: "siteId",
    title: "站点",
    minWidth: 150,
  },
  {
    key: "shopSku",
    dataIndex: "shopSku",
    title: "店铺SKU",
    minWidth: 150,
  },
  {
    key: "type",
    dataIndex: "type",
    title: "Lazada分类",
    minWidth: 150,
  },
  {
    key: "prType",
    dataIndex: "prType",
    title: "规格",
    minWidth: 150,
  },
  {
    key: "price",
    dataIndex: "price",
    title: "售价",
    minWidth: 150,
  },
  {
    key: "responePerson",
    dataIndex: "responePerson",
    title: "负责人",
    minWidth: 150,
  },
  {
    key: "operation",
    dataIndex: "operation",
    title: "操作",
    minWidth: 150,
    fixed: "right",
  },
];

// 变体属性key的table
export const variantTableColumns1 = [
  {
    key: "properteyName",
    dataIndex: "properteyName",
    title: "属性名",
    width: 160,
  },
  {
    key: "properteyValue",
    dataIndex: "properteyValue",
    title: "属性值",
    autoHeight: true,
    minWidth: 160,
  },
  {
    key: "action",
    dataIndex: "action",
    title: "操作",
    width: 100,
    fixed: "right",
  },
];

export const timeOpt1 = [
  { label: "创建时间", value: "1" },
  { label: "发布时间", value: "2" },
];

export const timeOpt2 = [
  { label: "创建时间", value: "1" },
  { label: "更新时间", value: "2" },
];

export const timeOpt3 = [{ label: "下架时间", value: "1" }];
export const titleListOpt1 = [
  { label: "标题", value: "1" },
  { label: "SPU/SKU", value: "2" },
];
export const titleListOpt2 = [
  {
    label: "标题",
    value: "1",
  },
  {
    label: "商品ID",
    value: "2",
  },
  {
    label: "SKU",
    value: "3",
  },
  {
    label: "店铺SKU",
    value: "4",
  },
];

// 草稿
export const titleListOpt3 = [
  {
    value: "1",
    label: "标题",
  },
  {
    value: "2",
    label: "SKU",
  },
  {
    value: "3",
    label: "店铺SKU",
  },
];

export const variantColumns = [
  {
    title: "建议售价",
    dataIndex: "recommendPrice",
    width: 200,
  },
  {
    title: "关联SKU",
    dataIndex: "sku",
    width: 200,
    isRequired: true,
  },
  {
    title: "包装重量",
    dataIndex: "logisticsWeight",
    width: 120,
  },
  {
    title: "包装尺寸(单位：CM)",
    dataIndex: "logisticsSize",
    width: 350,
  },
  {
    title: "Taxes",
    dataIndex: "taxes",
    width: 130,
  },
  {
    title: "商品状态",
    dataIndex: "availability",
    width: 70,
    fixed: "right",
  },
];

export const variantColumnsDraft = [
  {
    title: "售价",
    dataIndex: "recommendPrice2",
    width: 120,
    isRequired: true,
    hasUnit: true,
  },
  {
    dataIndex: "msku",
    width: 150,
  },
  {
    title: "关联SKU",
    dataIndex: "sku",
    width: 120,
    isRequired: true,
  },
  {
    title: "促销价",
    dataIndex: "recomendPrice",
    width: 120,
  },
  {
    title: "库存",
    dataIndex: "remainNumber",
    width: 120,
    isRequired: true,
  },
  {
    title: "包装重量",
    dataIndex: "logisticsWeight2",
    width: 120,
    isRequired: true,
  },
  {
    title: "包装尺寸(CM)",
    dataIndex: "logisticsSize2",
    isRequired: true,
    width: 320,
  },
  {
    title: "Lazada SKU",
    dataIndex: "lazadaSku",
    width: 120,
  },
  {
    title: "Taxes",
    dataIndex: "taxes",
    width: 120,
  },
  {
    title: "商品状态",
    dataIndex: "availability",
    width: 70,
    fixed: "right",
  },
];

// 视频库
export const titleListOpt4 = [
  {
    label: "标题",
    value: "1",
  },
  {
    label: "id",
    value: "2",
  },
];

// 草稿列表页的状态
export const videoStatusListOpt = [
  // 准备上传，已上传，上传中，上传失败，审核中，审核失败，审核成功，已取消
  {
    label: "准备上传",
    value: "READY_FOR_TRANSCODE",
  },
  {
    label: "上传中",
    value: "TRANSCODING",
  },
  {
    label: "上传失败",
    value: "TRANSCODE_FAILED",
  },
  {
    label: "准备审核",
    value: "READY_FOR_AUDIT",
  },
  {
    label: "审核失败",
    value: "AUDIT_FAILED",
  },
  {
    label: "上传成功",
    value: "AUDIT_SUCCESS",
  },
  {
    label: "已取消",
    value: "DELETED",
  },
];
