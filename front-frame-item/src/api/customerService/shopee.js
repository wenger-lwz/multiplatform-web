import request from "@/request";
const modulePrefix =
  process.env.NODE_ENV === "localhost"
    ? "http://172.30.50.6:8090"
    : "/customer-service";

const shopeeReturn = "/shopee/return/";
const shopeeCancel = "/shopee/cancel/";
const shopeeComment = "/shopee/comment/";

// 卖家接受买家的退款请求
export const getShopeeReturnConfirm = (data) => {
  return request({
    url: modulePrefix + shopeeReturn + `confirm`,
    method: "post",
    data,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};

// 获取指定退货退款订单详情
export const getShopeeReturnDetail = (params) => {
  return request({
    url: modulePrefix + shopeeReturn + `detail`,
    method: "get",
    params,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};

// 卖家向虾皮提出争议
export const getShopeeReturnDispute = (data) => {
  return request({
    url: modulePrefix + shopeeReturn + `dispute?erpShopId=${data.erpShopId}`,
    method: "post",
    data,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};

// 买家向虾皮提出争议原因
export const getShopeeReturnDisputeReason = (params) => {
  return request({
    url: modulePrefix + shopeeReturn + `dispute/reason`,
    method: "get",
    params,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};

// 获取退货退款订单分页数据
export const getShopeeReturnOrder = (data) => {
  return request({
    url: modulePrefix + shopeeReturn + `order`,
    method: "post",
    data,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};
// 手动同步退货退款数据
export const getShopeeReturnShopeeReturnPull = (data) => {
  return request({
    url: modulePrefix + shopeeReturn + `shopee/return/pull`,
    method: "post",
    data,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};
// 获取申请退货退款的原因
export const getShopeeReturnReason = (params) => {
  return request({
    url: modulePrefix + shopeeReturn + `reason`,
    method: "get",
    params,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};
// 获取申请退货退款的原因
export const getShopeeReturnShopRemark = (params) => {
  return request({
    url: modulePrefix + shopeeReturn + `shop/remark`,
    method: "get",
    params,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};
// 获取店铺列表
export const getShopeeReturnShop = (params) => {
  return request({
    url: modulePrefix + shopeeReturn + `shop`,
    method: "get",
    params,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};

// 处理买家取消请求
export const getShopeeCancelShop = (data) => {
  return request({
    url: modulePrefix + shopeeCancel + `buyCancel`,
    method: "post",
    data,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};

// 获取取消订单分页数据
export const getShopeeCancelOrder = (data) => {
  return request({
    url: modulePrefix + shopeeCancel + `order`,
    method: "post",
    data,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};

// 获取shopee取消原因数据
export const getShopeeCancelReason = (params) => {
  return request({
    url: modulePrefix + shopeeCancel + `reason`,
    method: "get",
    params,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};
// 获取shopee取消状态数据
export const getShopeeCancelStatus = (params) => {
  return request({
    url: modulePrefix + shopeeCancel + `status`,
    method: "get",
    params,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};

// 分页获取评论信息列表
export const getShopeeCommentPage_info = (data) => {
  return request({
    url: modulePrefix + shopeeComment + `page_info`,
    method: "post",
    data,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};
// 获取shopee评价星级列表
export const getShopeeCommentRating_star = (params) => {
  return request({
    url: modulePrefix + shopeeComment + `rating_star`,
    method: "get",
    params,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};
// 回复评论
export const getShopeeCommentReply = (data) => {
  return request({
    url: modulePrefix + shopeeComment + `reply`,
    method: "post",
    data,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};

// 获取shopee评价状态列表
export const getShopeeCommentReply_status = (params) => {
  return request({
    url: modulePrefix + shopeeComment + `reply_status`,
    method: "get",
    params,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};
// 上传提出争议的图片、视频证明
export const getShopeeReturnDisputeUpload = (data) => {
  return request({
    url: modulePrefix + "/shopee/return/dispute/upload",
    method: "post",
    data,
    "g-user-id": "652769251630276608",
    "g-tenant-id": "tc_10000",
  });
};
