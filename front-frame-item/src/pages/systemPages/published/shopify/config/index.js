// 筛选条件
export const timeOpt1 = [
  {
    label: "创建时间",
    value: "1",
  },
  {
    label: "更新时间",
    value: "2",
  },
];

export const draftTimeOption = [
  {
    label: "发布时间",
    value: "1",
  },
];

export const offlineTimeOption = [
  {
    label: "下架时间",
    value: "1",
  },
];

export const titleListOpt1 = [
  {
    label: "标题",
    value: "1",
  },
  {
    label: "SPU/SKU",
    value: "2",
  },
];

// 草稿
export const titleListOpt2 = [
  {
    value: "1",
    label: "标题",
  },
  {
    value: "2",
    label: "SPU/SKU",
  },
  {
    value: "3",
    label: "店铺SKU",
  },
];

// 草稿状态
export const draftStatusList = [
  {
    label: "待发布",
    value: "1",
  },
  {
    label: "发布失败",
    value: "3",
  },
];

// 在线商品
export const timeOpt3 = [
  {
    label: "下架时间",
    value: "1",
  },
];
// 筛选

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

export const weightOptions = [
  {
    value: "kg",
    label: "千克",
  },
  {
    value: "oz",
    label: "盎司",
  },
  {
    value: "g",
    label: "克",
  },
  {
    value: "lb",
    label: "磅",
  },
];

// 草稿/在线商品 的变体信息
export const variantListColumns = [
  {
    title: "店铺SKU",
    dataIndex: "storeSku",
    width: 120,
  },
  {
    title: "库存",
    dataIndex: "productNum",
    width: 100,
  },
  {
    title: "售价",
    dataIndex: "recommendPrice",
    width: 120,
    showRecommendPriceUnit: true,
  },
  {
    title: `原价`,
    dataIndex: "originalPrice",
    width: 130,
    showRecommendPriceUnit: true,
  },
];

export const specificationListWithAll = [
  {
    code: 0,
    productName: "",
  },
  ...specificationList,
];

export const rowSelection = {
  type: "checkbox",
  showCheckedAll: true,
};

// 在线
// 更改状态
export const onlineChangeStatus = [
  {
    label: "正常",
    value: 1,
  },
  {
    label: "更新未发布",
    value: 2,
  },
  {
    label: "更新失败",
    value: 3,
  },
];

export const onlineInputOptions = [
  {
    value: "1",
    label: "标题",
  },
  {
    value: "2",
    label: "商品 ID",
  },
  {
    value: "3",
    label: "SPU/SKU",
  },
  {
    value: "4",
    label: "店铺SKU",
  },
];

export const MAX_PACKING_WEIGHT = 2000000000;
export const MAX_RECOMMEND_PRICE = 1000000000000000000;
