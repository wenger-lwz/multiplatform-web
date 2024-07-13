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

export const siteListWithAll = [
  {
    platformCode: "",
    platformName: "全部",
  },
  ...siteList,
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

export const personList = [
  {
    value: "",
    nameValue: "负责人：全部",
    flag: "chargePerson",
    chargePersonName: "全部",
  },
  {
    value: "1001",
    nameValue: "负责人：张三",
    flag: "chargePerson",
    chargePersonName: "张三",
  },
];

export const specificationListWithAll = [
  {
    code: 0,
    productName: "",
  },
  ...specificationList,
  ...personList,
];

export const draftStatusList = [
  {
    label: "待发布",
    value: "1",
  },
  /* {
    label: "已发布",
    value: "2",
  }, */
  {
    label: "发布失败",
    value: "3",
  },
];

export const rowSelection = {
  type: "checkbox",
  showCheckedAll: true,
};

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

export const onLineListColumns = [
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
    key: "quanlity",
    dataIndex: "quanlity",
    title: "数量",
    minWidth: 150,
  },
  {
    key: "status",
    dataIndex: "status",
    title: "更新状态",
    minWidth: 150,
  },
  {
    key: "responePerson",
    dataIndex: "responePerson",
    title: "负责人",
    minWidth: 150,
  },
  {
    key: "createTime",
    dataIndex: "createTime",
    title: "创建时间",
    minWidth: 150,
  },
  {
    key: "updateTime",
    dataIndex: "updateTime",
    title: "更新时间",
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

export const timeOpt1 = [
  { label: "创建时间", value: "1" },
  { label: "更新时间", value: "2" },
];

export const timeOpt2 = [
  { label: "创建时间", value: "1" },
  { label: "更新时间", value: "2" },
];

export const timeOpt3 = [{ label: "下架时间", value: "1" }];

export const timeOpt4 = [
  { label: "创建时间", value: "1" },
  { label: "发布时间", value: "2" },
];

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

export const useChangeList = (target, source) => {
  let result = [];
  if (Array.isArray(target)) {
    result = target.filter((item) => item.showValue?.length > 0);
  } else {
    const index = source.findIndex((item) => item.id === target.id);
    result = [...source];
    const { showName, showValue } = target;
    if (index >= 0) {
      if (!showValue || showValue.length <= 0) {
        result.splice(index, 1);
      } else {
        result[index].showName = showName;
        result[index].showValue = showValue;
      }
    } else if (showValue.length > 0) {
      result.push(target);
    }
  }
  return result;
};
