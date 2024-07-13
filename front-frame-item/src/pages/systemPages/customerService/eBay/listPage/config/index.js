export const itemList = [
  { value: "itemTitle", label: "商品标题" },
  { value: "itemIds", label: "商品ID" },
];
// 表头内容
export const tableColumns = [
  {
    title: "图片",
    dataIndex: "itemImgUrl",
    width: 70,
  },
  {
    title: "商品名称/商品ID/MSKU",
    dataIndex: "itemInfo",
    minWidth: 160,
  },
  {
    title: "商品价格",
    dataIndex: "itemPrice",
  },
  {
    title: "议价类型",
    dataIndex: "discussType",
  },
  {
    title: "议价价格",
    dataIndex: "price",
  },
  {
    title: "议价数量",
    dataIndex: "quantity",
  },
  {
    title: "议价处理期限",
    dataIndex: "messageValidTime",
  },
  {
    title: "议价状态",
    dataIndex: "platformStatus",
  },
  {
    title: "卖家还价价格",
    dataIndex: "sellerPrice",
  },
  {
    title: "买家账号/邮箱",
    dataIndex: "buyerId",
  },
  {
    title: "店铺",
    dataIndex: "erpShopId",
  },
  {
    title: "操作",
    dataIndex: "Action",

    width: 260,
  },
];

const statusOneOranger = [
  "Pending",
  "PendingBuyerPayment",
  "PendingBuyerConfirmation",
];
const statusBlue = ["Countered", "Retracted"];
const statusRed = ["Declined"];
const statusGreen = ["Accepted"];
export const getStatusColor = (status) => {
  let res = "#C9CDD4";
  if (statusOneOranger.indexOf(status) > -1) {
    res = "#FF7D00";
  } else if (statusBlue.indexOf(status) > -1) {
    res = "#0045F0";
  } else if (statusGreen.indexOf(status) > -1) {
    res = "#00B42A";
  } else if (statusRed.indexOf(status) > -1) {
    res = "#F53F3F";
  }
  return res;
};
