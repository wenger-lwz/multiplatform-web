export const labelTypeList = [
  { label: "Lazada", value: 1, codeId: "LAZADA" },
  { label: "Shopee", value: 2, codeId: "SHOPEE" },
  { label: "eBay", value: 3, codeId: "EBAY" },
  // { label: "Allexpreess", value: 4, codeId: "ALLEXPREESS" },
];
// 表头内容
export const tableColumns = [
  {
    title: "编号",
    dataIndex: "code",
    width: 280,
  },
  {
    title: "店铺",
    dataIndex: "erpShopName",
    width: 280,
  },
  {
    title: "平台",
    dataIndex: "platformId",
  },
  {
    title: "客服",
    dataIndex: "customerServerName",
  },
  {
    title: "状态",
    dataIndex: "isActive",
  },
  {
    title: "操作",
    dataIndex: "Action",
    width: 160,
  },
];
