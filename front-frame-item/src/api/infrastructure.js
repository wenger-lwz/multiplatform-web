import request from "@/request";
const modulePrefix = process.env.NODE_ENV === "localhost" ? "" : "/setting";

export const getList = (params) => {
  return request({
    url: modulePrefix + "/shop/",
    method: "get",
    params,
  });
};

export const plantfrom = (params) => {
  return request({
    url: modulePrefix + "/platform/",
    method: "get",
    params,
  });
};

export const create = (params) => {
  return request({
    url: modulePrefix + "/shop/",
    method: "post",
    data: params,
  });
};

export const deleteShop = (id) => {
  return request({
    url: modulePrefix + `/shop/${id}`,
    method: "delete",
  });
};

export const startShop = (id) => {
  return request({
    url: modulePrefix + `/shop/enable/${id}`,
    method: "put",
  });
};

export const stopShop = (id) => {
  return request({
    url: modulePrefix + `/shop/disable/${id}`,
    method: "put",
  });
};

export const writeShop = (params, id) => {
  return request({
    url: modulePrefix + `/shop/${id}`,
    method: "put",
    data: params,
  });
};

// 获取授权的链接
export const authorHandel = (params) => {
  return request({
    url: modulePrefix + `/auth/redirect/url`,
    method: "get",
    params,
  });
};

// 获取授权的token
export const authorToken = (params) => {
  return request({
    url: modulePrefix + `/auth/token/${params.platform}`,
    method: "get",
    params: params.otherParams,
  });
};

// 授权结果的查询
export const authorResult = (params) => {
  return request({
    url: modulePrefix + `/auth/state/${params.id}`,
    method: "get",
  });
};

// 获取子店铺
export const getChild = (params) => {
  return request({
    url: modulePrefix + `/shop/${params.id}/child`,
    method: "get",
  });
};
