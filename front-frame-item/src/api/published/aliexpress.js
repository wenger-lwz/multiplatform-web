import request from "@/request";
const modulePrefix = process.env.NODE_ENV === "localhost" ? "" : "/listing";
const modulePrefix1 =
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.6:8082" : "/meta";
const modulePrefix2 = process.env.NODE_ENV === "localhost" ? "" : "/media";

export const getShopInfoList = (params) => {
  return request({
    url: modulePrefix + "/shopInfo/",
    method: "get",
    params,
  });
};

// 商品资料 列表
export const getGoodsInfoList = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/product/list",
    method: "post",
    data: params,
  });
};

// 添加商品资料
export const addProduct = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/product",
    method: "post",
    data: params,
  });
};

// 添加商品备注
export const addRemark = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/product/${params.productId}`,
    method: "put",
    params,
  });
};

// 批量删除商品资料
export const batchDelete = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/product/batch-delete",
    method: "post",
    data: params,
  });
};

// 删除商品资料
export const deleteProduct = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/product/${params}`,
    method: "delete",
  });
};

//查询aliexpress类目接口
export const getAliexpressMetaList = (params) => {
  return request({
    url: modulePrefix1 + `/aliexpress-meta/category/parent/${params}`,
    method: "get",
  });
};

//获取类目属性
export const getAttrById = (params) => {
  return request({
    url: modulePrefix1 + `/aliexpress-meta/category-attr/${params}`,
    method: "get",
  });
};

//更新类目属性
export const updateAttrById = (params) => {
  return request({
    url: modulePrefix1 + `/aliexpress-meta/category-attr/${params}`,
    method: "put",
  });
};

//获取商品详情
export const getProductDetail = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/product/${params}`,
    method: "get",
  });
};

// 编辑商品资料
export const editProduct = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/product",
    method: "put",
    data: params,
  });
};

//获取在线数量记录
export const getOnLineRecord = (params) => {
  return request({
    url: modulePrefix + "/general/listing/record/page",
    method: "get",
    params,
  });
};

//获取店铺
export const getShopList = (params) => {
  return request({
    url: modulePrefix + "/listing-common/shop",
    method: "get",
    params,
  });
};

//上传图片
export const fileUpload = (params) => {
  return request({
    url: modulePrefix2 + "/resource/upload",
    method: "post",
    data: params,
  });
};

//查询草稿清单
export const getDraftLists = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/product/draft-list",
    method: "post",
    data: params,
  });
};

//批量创建草稿
export const createDrafts = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/product/draft/batch",
    method: "post",
    data: params,
  });
};

//查询刊登负责人
export const searchEmployee = (params) => {
  return request({
    url: modulePrefix + "/listing-common/searchEmployee",
    method: "get",
    params,
  });
};

//查询队列
export const getQueueInfoList = (params) => {
  return request({
    url: modulePrefix + "/general/queueInfo/list",
    method: "get",
    params,
  });
};

// 草稿
// 草稿列表
export const getAliDraftList = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/draft/list",
    method: "post",
    data: params,
  });
};
//草稿发布
export const releaseDraft = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/draft/release",
    method: "put",
    data: params,
  });
};

//草稿批量发布
export const batchrReleaseDraft = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/draft/release/batch",
    method: "post",
    data: params,
  });
};

//删除草稿
export const deleteDraft = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/draft/${params}`,
    method: "delete",
  });
};

//批量删除草稿
export const batchDeleteDraft = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/draft/delete-batch",
    method: "post",
    data: params,
  });
};

//生成店铺sku
export const createdSKU = (params) => {
  return request({
    method: "post",
    data: params,
    url: modulePrefix + "/general/skuRule/set",
  });
};

//获取模板选项
export const getPlatform = (params) => {
  return request({
    method: "get",
    params,
    url: modulePrefix + "/aliexpress/component-template/platform",
  });
};

//同步模板
export const syncPlatform = (params) => {
  return request({
    method: "put",
    data: params,
    url: modulePrefix + "/aliexpress/component-template/batch-sync",
  });
};

export const createDraft = (params) => {
  return request({
    method: "post",
    url: modulePrefix + `/aliexpress/draft`,
    data: params,
  });
};

//草稿详情
export const getDraftDetail = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/draft/${params}`,
    method: "get",
  });
};

// 编辑草稿资料
export const editDraft = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/draft",
    method: "put",
    data: params,
  });
};

//刊登 --> 在线商品
// 在线商品列表
export const getOnlineGoodsInfoList = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/listing/list",
    method: "post",
    data: params,
  });
};

//编辑在线商品
export const editOnlineGoods = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/listing",
    method: "put",
    data: params,
  });
};

//批量操作 （上架，下架，同步，更新, 删除）
export const batchOnlineGoods = (params) => {
  return request({
    url: modulePrefix + "/aliexpress/listing/batch",
    method: "post",
    data: params,
  });
};

//删除暂存
export const deleteTemporary = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/listing/temporary/${params}`,
    method: "delete",
    data: params,
  });
};

//查询在线商品暂存
export const getTemporary = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/listing/temporary/${params}`,
    method: "get",
    data: params,
  });
};

//查询在新商品详情
export const getOnlineGoodsDetail = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/listing/${params}`,
    method: "get",
    data: params,
  });
};

//下架
export const downOnlineGoods = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/listing/${params}/down`,
    method: "put",
  });
};

//同步
export const syncOnlineGoods = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/listing/${params}/sync`,
    method: "put",
  });
};

//上架
export const upOnlineGoods = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/listing/${params}/up`,
    method: "put",
  });
};

//更新
export const updateOnlineGoods = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/listing/${params}/update`,
    method: "put",
  });
};

//删除
export const deleteOnlineGoods = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/listing/${params}`,
    method: "delete",
  });
};

//获取模板列表
export const getTemplateList = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/component-template/list`,
    method: "post",
    data: params,
  });
};

//删除模板
export const delTemplate = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/component-template/${params}`,
    method: "delete",
  });
};

//编辑模板
export const editTemplate = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/component-template`,
    method: "put",
    data: params,
  });
};

//添加模板
export const createTemplate = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/component-template`,
    method: "post",
    data: params,
  });
};
editTemplate;

//获取模板详情
export const getTemplateDetail = (params) => {
  return request({
    url: modulePrefix + `/aliexpress/component-template/${params}`,
    method: "get",
  });
};

export function getNextMotorAttr(query) {
  return request({
    url: `${modulePrefix1}/aliexpress-meta/car-attr/${query.type}`,
    method: "get",
    params: query,
  });
}

export function getAllMotorAttr(query) {
  return request({
    url: `${modulePrefix1}/aliexpress-meta/car-attr/${query.type}/all`,
    method: "get",
    params: query,
  });
}
