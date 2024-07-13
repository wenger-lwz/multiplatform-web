import request from "@/request";
const modulePrefix =
  process.env.NODE_ENV === "localhost" ? "/shopify" : "/order/shopify";

// 订单详情
export const getDetail = (params) => {
  return request({
    url: modulePrefix + `/order/${params.orderId}`,
    method: "get",
  });
};

// 获取销售负责人
export const getDirector = (params) => {
  return request({
    url: modulePrefix + "/metadata/director",
    method: "get",
    params,
  });
};

// 获取店铺
export const getShop = (params) => {
  return request({
    url: modulePrefix + "/metadata/shop",
    method: "get",
    params,
  });
};

// 获取平台状态
export const getPlatStatus = (params) => {
  return request({
    url: modulePrefix + "/metadata/platform/status",
    method: "get",
    params,
  });
};

// 获取so状态
export const getOmsStatus = (params) => {
  return request({
    url: modulePrefix + "/metadata/oms/status",
    method: "get",
    params,
  });
};

// 获取退款状态
export const getRefundStatus = (params) => {
  return request({
    url: modulePrefix + "/metadata/refund/status",
    method: "get",
    params,
  });
};

// 获取取消状态
export const getCancelStatus = (params) => {
  return request({
    url: modulePrefix + "/metadata/cancel/status",
    method: "get",
    params,
  });
};

// 获取分页数据
export const getOrderList = (params) => {
  return request({
    url: modulePrefix + "/order",
    method: "post",
    data: params,
  });
};

// 获取分页数据统计数据
export const getStatistics = (params) => {
  return request({
    url: modulePrefix + "/order/statistics",
    method: "post",
    data: params,
  });
};
