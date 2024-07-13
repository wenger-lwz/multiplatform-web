import request from "@/request";
// const modulePrefix = process.env.NODE_ENV === "localhost" ? "" : "/listing";
// http://172.30.50.210
// http://172.30.50.6
const modulePrefix83 =
  process.env.NODE_ENV === "localhost"
    ? "http://172.30.50.210:8083"
    : "/listing";
const modulePrefix82 =
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.210:8082" : "/meta";

// 商品资料 - [列表]
export const getList = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/product/query/list",
    method: "post",
    data: params,
  });
};

// 商品资料 - 添加备注 [单个]
export const addRemark = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/product/" + params.id,
    method: "put",
    params: {
      remark: params.remark,
    },
  });
};

// 商品资料 - 删除商品 [单个/批量]
export const deleteProduct = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/product",
    method: "delete",
    data: params,
  });
};

// 商品资料 - 修改商品 [单个]
export const updateProduct = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/product",
    method: "put",
    data: params,
  });
};

// 商品资料 - 新增商品 [单个]
export const createProduct = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/product",
    method: "post",
    data: params,
  });
};

// 商品资料 - 编辑商品 [单个]
export const editProduct = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/product/" + params.id,
    method: "get",
    params: {},
  });
};

// 生成草稿清单
export const getDraftList = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/product/draft",
    method: "get",
    params,
  });
};

// 根据草稿清单创建草稿
export const createDraftByList = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/draft/draftList",
    method: "post",
    data: params,
  });
};

// ladaza 类目数据
export const getCategoryById = (params) => {
  return request({
    url:
      modulePrefix82 +
      `/lazada/category/get_category/${params.siteId}/${params.parentId}`,
    method: "get",
    params: {},
  });
};

export const getBrandOption = (params) => {
  return request({
    url:
      modulePrefix82 +
      `/lazada/brand/get_brand/${params.name}/${params.siteId}`,
    method: "get",
    params: {},
  });
};

// 获取产品动态属性
export const getCategoryAttribute = (params) => {
  return request({
    url:
      modulePrefix82 +
      `/lazada/category/get_category_attribute/${params.siteId}/${params.categoryId}`,
    method: "get",
    params: {},
  });
};

// 获取产品变体信息
export const getVariantList = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/product/variant_info/" + params.id,
    method: "get",
    params: {},
  });
};

// 获取产品货币
export const getCurrency = () => {
  return request({
    url: modulePrefix83 + "/lazada/product/currency",
    method: "get",
    params: {},
  });
};

/****
 * @description 草稿相关
 */
// 草稿列表 - [列表]
export const getDraftTableList = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/draft/query/list",
    method: "post",
    data: params,
  });
};
// 获取草稿的变体详情
export const getDraftVariantList = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/draft/variant/" + params.id,
    method: "get",
    params: {},
  });
};

// 草稿 - 删除草稿 [单个/批量]
export const deleteDraft = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/draft",
    method: "delete",
    data: params,
  });
};
// 草稿 - 单个发布
export const releaseDraft = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/draft/release",
    method: "post",
    data: params,
  });
};
// 草稿 - 批量发布
export const patchReleaseDraft = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/draft/batch/release",
    method: "post",
    data: params,
  });
};

// 草稿 - 创建
export const createNewDraft = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/draft",
    method: "post",
    data: params,
  });
};

// 草稿 - 编辑
export const editDraft = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/draft",
    method: "put",
    data: params,
  });
};
// 草稿 - 发布
export const releaseTiming = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/draft/release/timing",
    method: "post",
    data: params,
  });
};

// 商品资料 - 编辑商品 [单个]
export const getDraftDetail = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/draft/" + params.id,
    method: "get",
    params: {},
  });
};

/**
 *
 * @param {*} params
 * @returns
 * @description 在线商品
 */

// 在线商品 -[列表]
export const getListing = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/query/list",
    method: "post",
    data: params,
  });
};

// 变体信息
export const getListingVariantList = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/variant/" + params.listingId,
    method: "get",
    params: {},
  });
};

export const listingPull = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/pull",
    method: "put",
    data: params,
  });
};

export const listingBatchPush = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/batch/push",
    method: "put",
    data: params,
  });
};

export const listingDown = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/down",
    method: "put",
    data: params,
  });
};

export const listingOnSelf = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/up",
    method: "put",
    data: params,
  });
};

// 在线商品详情
export const getListingDetail = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/" + params.listingId,
    method: "get",
    params: {},
  });
};

// 在线商品编辑 - 保存
export const lazadaUpdateToTemp = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing",
    method: "put",
    data: params,
  });
};

// 在线商品详情 - 更新
export const listingDirectPush = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/direct/push",
    method: "put",
    data: params,
  });
};

// 在线商品详情 - 获取暂存详情
export const getListingDetailStorage = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/storage/" + params.listingId,
    method: "get",
    params: {},
  });
};
// 在线商品详情 - 暂存-删除
export const listingStorageDelete = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/storage",
    method: "delete",
    data: params,
  });
};

// 跨境商品 -[列表]
export const getGlobalListing = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/listing/global/query/list",
    method: "post",
    data: params,
  });
};

// 跨境商品 -[列表]
export const getGlobalPrice = (params) => {
  return request({
    url: modulePrefix83 + `/lazada/product/global_price/${params.price}`,
    method: "get",
    params: {},
  });
};

// 跨境商品 -[列表] - 单个同步
export const globalSyncSingle = (params) => {
  return request({
    url: modulePrefix83 + `/lazada/listing/global_sync/${params.listingIds}`,
    method: "get",
    params: {},
  });
};

// 跨境商品 -[列表] - 单个同步
export const globalPatchSync = (params) => {
  return request({
    url: modulePrefix83 + `/lazada/listing/batch_global_sync`,
    method: "put",
    data: params,
  });
};

// 视频库 - 列表
export const getVideoList = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/video-lib/query",
    method: "post",
    data: params,
  });
};

// 视频库 - 同步
export const pullVideo = (params) => {
  return request({
    url: modulePrefix83 + "/lazada/video-lib/pull",
    method: "post",
    data: params,
  });
};

// 视频库 - 详情
export const getVideoDetail = (params) => {
  return request({
    url: modulePrefix83 + `/lazada/video-lib/${params.videoId}`,
    method: "get",
    params: {},
  });
};

// 上传视频确认按钮
export const saveVideoInfo = (data) => {
  return request({
    url: modulePrefix83 + "/listing-common/upload/video",
    method: "post",
    data,
  });
};
