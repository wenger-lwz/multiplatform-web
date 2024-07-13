export const platformList = [
  { label: "Lazada", value: 1, codeId: "LAZADA" },
  { label: "Shopee", value: 2, codeId: "SHOPEE" },
  { label: "eBay", value: 3, codeId: "EBAY" },
  // { label: "Allexpreess", value: 4, codeId: "ALLEXPREESS" },
];
// 表头内容
export const columnsList = [
  {
    title: "编号",
    dataIndex: "code",
  },
  {
    title: "标签",
    dataIndex: "labelName",
  },
  {
    title: "关键词",
    dataIndex: "keyword",
  },
  {
    title: "使用平台",
    dataIndex: "platformList",
  },
  {
    title: "启用",
    dataIndex: "isActive",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
  },
];
