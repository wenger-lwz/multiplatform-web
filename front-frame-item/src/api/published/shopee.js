import request from "@/request";
const modulePrefix = process.env.NODE_ENV === "localhost" ? "" : "/listing";
/* const metaPrefix = process.env.NODE_ENV === "localhost" ? "/meta" : "/meta"; */
const localMetaPrefix =
  // process.env.NODE_ENV === "localhost" ? "http://172.30.50.148:8082" : "/meta";
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.6:8082" : "/meta";
const categoriesPrefix =
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.6:8082" : "/meta";

// 查询所有商品资料列表
export const getShopeeProduct = (params) => {
  return request({
    url: modulePrefix + "/shopee/product",
    method: "get",
    params,
  });
};

// 添加商品备注
export const addRemark = (data) => {
  return request({
    url: `/shopee/product/remark`,
    method: "put",
    data,
  });
};

// 删除商品资料
export const deleteShopeeProduct = (params) => {
  return request({
    url: "/shopee/product",
    method: "delete",
    data: params,
  });
};

// 查询商品资料详情
export const getShopeeProductDetails = (id) => {
  return request({
    url: modulePrefix + `/shopee/product/${id}`,
    method: "get",
  });
};

// 商品资料 - 修改商品资料
export const updateProduct = (params) => {
  return request({
    url: modulePrefix + "/shopee/product",
    method: "put",
    data: params,
  });
};

// 商品资料 - 新增商品资料
export const createProduct = (params) => {
  return request({
    url: modulePrefix + "/shopee/product",
    method: "post",
    data: params,
  });
};

// 查询shopee产品属性元数据
export const queryShopeeCategoryAttribute = (params) => {
  return request({
    url: localMetaPrefix + "/shopee/product/query/attributes",
    method: "get",
    params: params,
    isFlagUrl: 1,
  });
};

export const getListExport = (data) => {
  return request({
    url: "http://172.30.50.131:8081/resource/upload",
    method: "post",
    data,
    headers: {
      "g-tenant-id": "tc_10000",
    },
  });
};

// 商品资料 - 生成草稿清单
export const createDraft = (params) => {
  return request({
    url: modulePrefix + "/shopee/product/draft/page",
    method: "post",
    data: params,
  });
};

// 商品资料 - 草稿清单批量生成草稿
export const setDraftLists = (params) => {
  return request({
    url: modulePrefix + "/shopee/product/draft/batch",
    method: "post",
    data: params,
  });
};

// 根据站点查询shopee分类
export const getShopeeCategories = (params) => {
  return request({
    url: localMetaPrefix + "/shopee/product/query/categories",
    method: "get",
    params,
  });
};

// 获取产品货币
export const getCurrency = () => {
  return request({
    url: modulePrefix + "/shopee/product/currency",
    method: "get",
    params: {},
  });
};

/****
 * @description 草稿相关接口
 */

// 查询显示草稿列表
export const getDraftTableList = (params) => {
  return request({
    url: modulePrefix + "/shopee/draft",
    method: "get",
    params,
  });
};

// 删除草稿 [单个/批量]
export const deleteDraft = (params) => {
  return request({
    url: modulePrefix + "/shopee/draft",
    method: "delete",
    data: params,
  });
};

// 单个/批量发布
export const releaseDraft = (params) => {
  return request({
    url: modulePrefix + "/shopee/draft/online",
    // url: "http://172.30.50.199:8083/shopee/draft/online",
    method: "put",
    data: params,
  });
};

// 查询单个草稿详情
export const getDraftDetail = (id) => {
  return request({
    url: modulePrefix + `/shopee/draft/${id}`,
    method: "get",
    params: {},
  });
};

// 同步物流
export const getLogistics = (params) => {
  return request({
    url: categoriesPrefix + `/shopee/logistics/query/channels`,
    method: "get",
    params,
  });
};

// 编辑草稿-保存
export const editDraft = (params) => {
  return request({
    url: modulePrefix + "/shopee/draft",
    method: "put",
    data: params,
  });
};

// 添加/创建草稿-保存
export const createNewDraft = (params) => {
  return request({
    url: modulePrefix + "/shopee/draft",
    method: "post",
    data: params,
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
    url: modulePrefix + "/shopee/online",
    method: "get",
    params,
  });
};

// 下架商品
export const listingDown = (params) => {
  return request({
    url: modulePrefix + "/shopee/online/offline",
    method: "post",
    data: params,
  });
};

// 同步在线商品
export const listingPull = (params) => {
  return request({
    url: modulePrefix + "/shopee/online/sync",
    method: "post",
    data: params,
  });
};

// 更新商品
export const listingBatchPush = (params) => {
  return request({
    url: modulePrefix + "/shopee/online/batchPush",
    method: "put",
    data: params,
  });
};

// 查询在线商品详情
export const getListingDetail = (params) => {
  return request({
    url: modulePrefix + "/shopee/online/" + params.id,
    method: "get",
    params: {},
  });
};

// 在线商品详情 - 更新
export const listingDirectPush = (params) => {
  return request({
    url: modulePrefix + "/shopee/online/push",
    method: "put",
    data: params,
  });
};

// 重新上架
export const listingOnSelf = (params) => {
  return request({
    url: modulePrefix + "/shopee/online/batchReline",
    method: "post",
    data: params,
  });
};

// 删除在线商品
export const deleteOnlineShopee = (params) => {
  return request({
    url: modulePrefix + "/shopee/online",
    method: "delete",
    data: params,
  });
};

// 在线商品编辑 - 保存
export const lazadaUpdateToTemp = (params) => {
  return request({
    url: modulePrefix + "/shopee/online",
    method: "put",
    data: params,
  });
};

// 编辑暂存保存 - 暂存
export const lazadaUpdateToStorage = (params) => {
  return request({
    url: modulePrefix + "/shopee/online/storage",
    method: "put",
    data: params,
  });
};

// 详情重新上架
export const onReline = (params) => {
  return request({
    url: modulePrefix + "/shopee/online/reline",
    method: "post",
    data: params,
  });
};

// 在线商品详情 - 获取暂存详情
export const getListingDetailStorage = (params) => {
  return request({
    url: modulePrefix + "/shopee/online/storage/" + params.id,
    method: "get",
    params: {},
  });
};

// 在线商品详情 - 暂存-删除
export const listingStorageDelete = (params) => {
  return request({
    url: modulePrefix + "/shopee/online/storage",
    method: "delete",
    data: params,
  });
};

/**
 *
 * @param {*} params
 * @returns
 * @description 全球商品
 */

// 全球商品列表
export const getGlobalListing = (params) => {
  return request({
    url: modulePrefix + "/shopee/global",
    method: "get",
    params,
  });
};

// 全球商品同步
export const onGlobalSync = (params) => {
  return request({
    url: modulePrefix + "/shopee/global/sync",
    method: "post",
    data: params,
  });
};

// 删除全球商品暂存
export const deleteGlobalStorage = (params) => {
  return request({
    url: modulePrefix + "/shopee/global/storage/" + params.id,
    method: "delete",
  });
};

// 全球商品详情
export const getGlobalDetail = (params) => {
  return request({
    url: modulePrefix + "/shopee/global/" + params.id,
    method: "get",
    params: {},
  });
};

// 全球商品暂存详情
export const getGlobalStoageDetail = (params) => {
  return request({
    url: modulePrefix + "/shopee/global/storage/" + params.id,
    method: "get",
    params: {},
  });
};

// 全球商品发布到站点店铺
export const onGlobalpublish = (params) => {
  return request({
    url: modulePrefix + "/shopee/global/publish/" + params.onlineId,
    method: "post",
    data: params,
  });
};

// 查询发布到站点店铺的item信息
export const getPublishItem = (params) => {
  return request({
    url: modulePrefix + "/shopee/global/publishItem/" + params.productId,
    method: "get",
    params: {},
  });
};

// 查询发布到站点店铺的item信息
export const getShopSite = (params) => {
  return request({
    url: modulePrefix + "/listing-common/shop/site",
    method: "get",
    params,
  });
};

// 查询全球商品进行发布的站点店铺
export const getPublishShop = (params) => {
  return request({
    url: modulePrefix + "/shopee/global/publishShop/" + params.productId,
    method: "get",
  });
};

/**
 *
 * @param {*} params
 * @returns
 * @description 视频库
 */

// 视频库列表筛选查询
export const getVideoLibraryList = (params) => {
  return request({
    url: modulePrefix + "/shopee/video",
    method: "get",
    params,
  });
};

// 查询视频详情
export const getVideoDetails = (params) => {
  return request({
    url: modulePrefix + "/shopee/video/" + params.id,
    method: "get",
    params: {},
  });
};

// 同步视频
export const setUpdateVideoStatus = (params) => {
  return request({
    url: modulePrefix + "/shopee/video/sync",
    method: "post",
    params,
  });
};

// 视频状态集合
export const getVideoStateShop = () => {
  return request({
    url: modulePrefix + "/listing-common/video_state?platformCode=SHOPEE",
    method: "get",
  });
};

// 上传视频确认按钮
export const saveShopeeVideoInfo = (data) => {
  return request({
    url: modulePrefix + "/listing-common/upload/video",
    method: "post",
    data,
  });
};

/**
 *
 * @param {*} params
 * @returns
 * @description 物流模板
 */

// 批量删除物流模板
export const delLogisticsTemplate = (params) => {
  return request({
    url: modulePrefix + "/shopee/template/del",
    method: "delete",
    data: params,
  });
};

// 分页查询物流模板列表
export const getLogisticList = (params) => {
  return request({
    url: modulePrefix + "/shopee/template/logistic/query",
    method: "post",
    data: params,
  });
};

// 根据id查询物流模板详情
export const getLogisticDetail = (params) => {
  return request({
    url: modulePrefix + "/shopee/template/logistic/" + params.id,
    method: "get",
    params: {},
  });
};

// 创建物流模板
export const createLogisticList = (params) => {
  return request({
    url: modulePrefix + "/shopee/template/logistic",
    method: "post",
    data: params,
  });
};

// 修改物流模板
export const editLogisticList = (params) => {
  return request({
    url: modulePrefix + "/shopee/template/logistic",
    method: "put",
    data: params,
  });
};
