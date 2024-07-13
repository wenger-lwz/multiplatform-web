export const itemList = [
  { value: "buyerName", label: "买家名称" },
  { value: "platformOrderId", label: "订单编号" },
  { value: "msku", label: "MSKU" },
  { value: "itemId", label: "商品ID" },
];
export const solutionList = [
  { value: "productName", label: "仅退款" },
  { value: "productId", label: " 退货且退款" },
];
export const returnReasonList = [
  { value: "NONE", label: "无" },
  { value: "NOT_RECEIPT", label: "未收到货" },
  { value: "WRONG_ITEM", label: "发错货" },
  { value: "ITEM_DAMAGED", label: "物品损坏" },
  { value: "DIFFERENT_DESCRIPTION", label: "描述不符" },
  { value: "MUTUAL_AGREE", label: "买卖双方已同意" },
  { value: "OTHER", label: "其它原因" },
  { value: "ITEM_WRONGDAMAGED", label: "物品损坏（越南站点）" },
  { value: "CHANGE_MIND", label: "不想要了" },
  { value: "ITEM_MISSING", label: "物品丢失" },
  { value: "EXPECTATION_FAILED", label: "EXPECTATION_FAILED" },
  { value: "ITEM_FAKE", label: "物品是假货" },
  { value: "PHYSICAL_DMG", label: "PHYSICAL_DMG" },
  { value: "FUNCTIONAL_DMG", label: "功能损坏" },
];
export const erpShopIdList = [
  { value: "NONE", label: "无" },
  { value: "NOT_RECEIPT", label: "未收到货" },
  { value: "WRONG_ITEM", label: "发错货" },
  { value: "ITEM_DAMAGED", label: "物品损坏" },
  { value: "DIFFERENT_DESCRIPTION", label: "描述不符" },
  { value: "MUTUAL_AGREE", label: "买卖双方已同意" },
  { value: "OTHER", label: "其它原因" },
  { value: "ITEM_WRONGDAMAGED", label: "物品损坏（越南站点）" },
  { value: "CHANGE_MIND", label: "不想要了" },
  { value: "ITEM_MISSING", label: "物品丢失" },
  { value: "EXPECTATION_FAILED", label: "EXPECTATION_FAILED" },
  { value: "ITEM_FAKE", label: "物品是假货" },
  { value: "PHYSICAL_DMG", label: "PHYSICAL_DMG" },
  { value: "FUNCTIONAL_DMG", label: "功能损坏" },
];

const mergeRow = ({ record }) => {
  const obj = {
    props: {},
  };
  if (record.rowSSpan > 1) {
    obj.props.rowSpan = record.rowSSpan || 1;
  }

  if (record.rowSpan > 1 && !record.rowSSpan) {
    obj.props.rowSpan = 0;
  }

  return obj;
};
// 表头内容
export const tableColumns = [
  {
    title: "商品名称/MSKU/商品ID",
    dataIndex: "itemInfo",
    minWidth: 160,
  },
  {
    title: "订单编号",
    dataIndex: "platformOrderId",
    customRender: mergeRow,
  },
  {
    title: "店铺",
    dataIndex: "erpShopName",
    customRender: mergeRow,
  },
  {
    title: "买家名称",
    dataIndex: "buyerName",
    customRender: mergeRow,
  },
  {
    title: "状态",
    dataIndex: "replyStatusName",
    customRender: mergeRow,
  },
  {
    title: "星级",
    dataIndex: "ratingStar",
    customRender: mergeRow,
  },
  {
    title: "评价内容",
    dataIndex: "comment",
    customRender: mergeRow,
  },
  {
    title: "评价时间",
    dataIndex: "evaluationCreateTime",
    customRender: mergeRow,
  },
  {
    title: "回复内容",
    dataIndex: "reply",
    customRender: mergeRow,
  },
  {
    title: "操作",
    dataIndex: "Action",
    customRender: mergeRow,
    width: 260,
  },
];
