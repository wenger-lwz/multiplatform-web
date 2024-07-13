import request from "@/request";
const modulePrefix =
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.6:8083" : "/listing";

// 通过平台枚举获取店铺信息列表
export const getStoreInformationlist = (params) => {
  return request({
    url: modulePrefix + "/listing-common/shop",
    method: "get",
    params: params,
  });
};

// 查询站点基本信息元数据
export const getListingCommonSiteId = (params) => {
  return request({
    url: modulePrefix + `/common/data/region`,
    method: "get",
    params,
  });
};

//  查询店铺基本信息元数据
export const getListingCommonShop = (params) => {
  return request({
    url: modulePrefix + `/listing-common/shop`,
    method: "get",
    params,
  });
};

//获取产品分类
export const getCategoryList = () => {
  return request({
    url: modulePrefix + "/products/getCategoryList",
    method: "get",
  });
};

// 获取负责人
export const getDirector = () => {
  return request({
    url: modulePrefix + "/listing-common/searchEmployee",
    method: "get",
  });
};
