import request from "@/request";
const modulePrefix =
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.6:8083" : "/listing";
const sourcePrefix =
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.6:8082" : "/meta";
const apiPrefix = modulePrefix + "/shopify";

// 商品资料 - 列表
export const getList = (params) => {
  return request({
    url: apiPrefix + "/product/query",
    method: "post",
    data: params,
  });
};

// 商品资料 - 产品类别 - 第一层
export const getFirstFloorCategory = () => {
  return request({
    url: sourcePrefix + "/shopify/category/getFirstFloor",
    method: "get",
  });
};

// 商品资料 - 产品类别 - 获取子类
export const getCategoryByParentId = (params) => {
  return request({
    url: sourcePrefix + "/shopify/category/getByParentId",
    method: "get",
    params,
  });
};

// 商品资料 - 供应商列表
export const getSupplierList = () => {
  return request({
    url: sourcePrefix + "/source/data/getSupplierListList",
    method: "get",
  });
};

// 商品资料 - 标签列表
export const getNormalLabel = () => {
  return request({
    url: modulePrefix + "/general/labelInfo/queryNormal",
    method: "get",
    params: {
      labelType: 3,
    },
  });
};

// 商品资料 - 模板样式列表
export const getTemplateStyleList = () => {
  return request({
    url: sourcePrefix + "/source/data/getTemplateStyleList",
    method: "get",
  });
};

// 商品资料 - 销售渠道和应用列表
export const getSalesApplicationList = () => {
  return request({
    url: sourcePrefix + "/source/data/getSalesApplicationList",
    method: "get",
  });
};

// 商品资料 - 获取搜索引擎url前缀
export const getSearchEnginePrefix = (params) => {
  return request({
    url: apiPrefix + "/product/getSearchEnginePrefix",
    method: "get",
    params,
  });
};

// 商品资料 - 添加备注 [单个]
export const addRemark = (params) => {
  return request({
    url: apiPrefix + "/product/" + params.id + "/remark",
    method: "put",
    data: params,
  });
};

// 商品资料 - 删除商品 [单个/批量]
export const deleteProduct = (params) => {
  return request({
    url: apiPrefix + "/product",
    method: "delete",
    data: params,
  });
};

// 商品资料 - 新增商品 [单个]
export const createProduct = (params) => {
  return request({
    url: apiPrefix + "/product",
    method: "post",
    data: params,
  });
};

// 商品资料 - 获取商品详情 [单个]
export const getProductDetails = (params) => {
  return request({
    url: apiPrefix + "/product/" + params.id,
    method: "get",
  });
};

// 商品资料 - 修改商品 [单个]
export const updateProduct = (params) => {
  return request({
    url: apiPrefix + "/product/" + params.id,
    method: "put",
    data: params,
  });
};

// 生成草稿清单
export const generateDrafts = (data) => {
  return request({
    url: apiPrefix + "/product/configuration/draft",
    method: "post",
    data,
  });
};

// 创建生成草稿清单
export const createDrafts = (params) => {
  return request({
    url: apiPrefix + "/draft/createByProduct",
    method: "post",
    data: params,
  });
};

// 获取产品变体信息
export const getVariantList = (params) => {
  return request({
    url: apiPrefix + "/product/variant/" + params.id,
    method: "get",
    params: {},
  });
};

// 草稿
// 商品资料 - 列表
export const getDraftList = (params) => {
  return request({
    url: apiPrefix + "/draft/query",
    method: "post",
    data: params,
  });
};

export const deleteDraft = (params) => {
  return request({
    url: apiPrefix + "/draft",
    method: "delete",
    data: params,
  });
};

// 新增草稿
export const createDraft = (params) => {
  return request({
    url: apiPrefix + "/draft",
    method: "post",
    data: params,
  });
};

// 编辑草稿详情
export const editDraft = (params) => {
  return request({
    url: apiPrefix + "/draft/" + params.id,
    method: "put",
    data: params,
  });
};

// 草稿变体信息
export const getDraftVariantList = (params) => {
  return request({
    url: apiPrefix + "/draft/variant/" + params.id,
    method: "get",
  });
};

// 发布、批量发布草稿
export const publishDraft = (params) => {
  return request({
    url: apiPrefix + "/draft/release",
    method: "put",
    data: params,
  });
};

// 根据草稿详情发布
export const publishDetailDraft = (params) => {
  return request({
    url: apiPrefix + "/draft/draftInfoLeased",
    method: "put",
    data: params,
  });
};

// 获取店铺属性
export const getStoreProperties = (params) => {
  return request({
    url: apiPrefix + "/draft/properties",
    method: "get",
    params,
  });
};

// 获取草稿详情
export const getDraftDetails = (params) => {
  return request({
    url: apiPrefix + "/draft/" + params.id,
    method: "get",
  });
};

// 获取店铺下面仓库
export const getStoreWarehouse = (params) => {
  return request({
    url: apiPrefix + "/draft/getLocationList",
    method: "get",
    params,
  });
};

// 在线商品
export const getOnlineList = (params) => {
  return request({
    url: apiPrefix + "/listing/query",
    method: "post",
    data: params,
  });
};

// 在线变体信息
export const getOnlineGoodVariant = (params) => {
  return request({
    url: apiPrefix + "/listing/variant/" + params.id,
    method: "get",
    params: {
      platformStatus: 1,
    },
  });
};

// 查询详情
export const getOnlineDetail = (params) => {
  return request({
    url: apiPrefix + "/listing/" + params.id,
    method: "get",
    params,
  });
};

// 下架
export const offlineGoods = (params) => {
  return request({
    url: apiPrefix + "/listing/offline",
    method: "put",
    data: params,
  });
};

// 更新平台商品
export const updateGoods = (params) => {
  return request({
    url: apiPrefix + "/listing/batchPushById",
    method: "put",
    data: params,
  });
};

// 更新平台商品
export const updateDetailGood = (params) => {
  return request({
    url: apiPrefix + "/listing/pushByInfo",
    method: "put",
    data: params,
  });
};

// 同步在线商品
export const syncGoods = (params) => {
  return request({
    url: apiPrefix + "/listing/pull",
    method: "put",
    data: params,
  });
};

export const deleteOnlineGoods = (params) => {
  return request({
    url: apiPrefix + "/listing/delListing",
    method: "delete",
    data: params,
  });
};

// 查询暂存记录
export const getOnlineStoreDetail = (params) => {
  return request({
    url: apiPrefix + "/listing/storageById",
    method: "post",
    data: params,
  });
};

// 删除暂存
export const deleteOnlineStorage = (params) => {
  return request({
    url: apiPrefix + "/listing/storage",
    method: "delete",
    data: params,
  });
};

// 保存更新暂存
export const saveStorage = (params) => {
  return request({
    url: apiPrefix + "/listing/storage/save",
    method: "post",
    data: params,
  });
};

// 上架
export const relisting = (params) => {
  return request({
    url: apiPrefix + "/listing/relisting/batch",
    method: "put",
    data: params,
  });
};

// 更新上架
export const updateAndRelisting = (params) => {
  return request({
    url: apiPrefix + "/listing/updateToRelisting",
    method: "put",
    data: params,
  });
};
