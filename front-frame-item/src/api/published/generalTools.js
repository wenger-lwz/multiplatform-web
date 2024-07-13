import request from "@/request";
const modulePrefix = "/listing";
// 通用工具基础数据接口

// 获取所有平台数据接口
// http://localhost:8083/skuMapping/getAllPlatformList
export const getAllPlatformList = (params) => {
  return request({
    url: modulePrefix + "/general/skuMapping/getAllPlatformList",
    method: "get",
    params,
  });
};

// 获取店铺列表数据
// http://localhost:8083/skuMapping/getShopByCondition?platformCode=ALIEXPRESS&stationCode=TH
export const getShopByCondition = (params) => {
  return request({
    url: modulePrefix + "/general/skuMapping/getShopByCondition",
    method: "get",
    params,
  });
};

// 根据平台code查询站点数据
// http://localhost:8083/skuMapping/getRegionListByPlatformId?platformCode=EBABY
export const getRegionListByPlatformId = (params) => {
  return request({
    url: modulePrefix + "/general/skuMapping/getRegionListByPlatformId",
    method: "get",
    params,
  });
};

// 号码池数据接口
export const getPhonePoolList = (params) => {
  return request({
    url: modulePrefix + "/general/codePool/list",
    method: "get",
    params,
  });
};

// 保存号码池新增数据接口
export const savePhonePoolData = (params) => {
  return request({
    url: modulePrefix + "/general/codePool/bathSave",
    method: "post",
    data: params,
  });
};

// sku映射列表数据接口
export const getSkuMappingList = (params) => {
  return request({
    url: modulePrefix + "/general/skuMapping/page",
    method: "get",
    params,
  });
};

// 新增sku数据接口
export const saveSkuMappingData = (params) => {
  return request({
    url: modulePrefix + "/general/skuMapping/save",
    method: "post",
    data: params,
  });
};

// 查询SKU编码接口
export const getSkuListByCondition = (params) => {
  return request({
    url: modulePrefix + "/general/skuMapping/getSkuListByCondition",
    method: "get",
    params,
  });
};

// 更新sku数据接口
export const updateSkuMappingData = (params) => {
  return request({
    url: modulePrefix + "/general/skuMapping/update",
    method: "post",
    data: params,
  });
};

// sku自动生成规则查询接口
export const deleteSkuMappingData = (params) => {
  return request({
    url: modulePrefix + "/general/skuMapping/delete",
    method: "get",
    params,
  });
};

// sku自动生成规则查询接口
export const getSkuRuleData = (params) => {
  return request({
    url: modulePrefix + "/general/skuRule/page",
    method: "get",
    params,
  });
};

// 编辑sku自动生成规则的接口
export const editSkuRule = (params) => {
  return request({
    url: modulePrefix + "/general/skuRule/edit",
    method: "post",
    data: params,
  });
};

// 取消sku规则接口
export const cancelSkuRule = (params) => {
  return request({
    url: modulePrefix + "/general/skuRule/cancel",
    method: "get",
    params,
  });
};
