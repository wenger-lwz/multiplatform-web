export const itemList = [
  { value: "orderId", label: "订单号" },
  { value: "buyerAccountId", label: " 买家id" },
  { value: "reviewId", label: "评价id" },
  { value: "itemId", label: "ITEM ID" },
  { value: "reviewContent", label: "评价内容" },
];
const statusBlue = ["产品中评", "物流中评", "服务中评"];
const statusGreen = ["产品好评", "物流好评", "服务好评"];
const statusRed = ["产品差评", "物流差评", "服务差评"];
export const getStatusColor = (status) => {
  let res = "#C9CDD4";
  if (statusBlue.indexOf(status) > -1) {
    res = "arcoblue";
  } else if (statusGreen.indexOf(status) > -1) {
    res = "green";
  } else if (statusRed.indexOf(status) > -1) {
    res = "red";
  }
  return res;
};
