import request from "@/request";
import { createUuid } from "@/utils/common";
import { toFormData } from "@/utils/transform";
const modulePrefix = process.env.NODE_ENV === "localhost" ? "" : "/listing";
const modulePrefixs = process.env.NODE_EXNV === "localhost" ? "" : "meta";
const ebay = "/ebay/";
const template = ebay + "template/";

// const baseURL = process.env.NODE_ENV === "dev" ? "http://172.30.50.6:" : "";
// const baseURL = process.env.NODE_ENV === "dev" ? "http://172.30.50.181:" : "";
// const port1 = 8082;
// const port2 = 8083;
/*ebay 商品接口 */

// ebay商品列表查询
export const getProductLists = (params) => {
  return request({
    url: modulePrefix + ebay + "product/query/list",
    method: "post",
    data: params,
  });
};
// ebay生成草稿清单
export const getProductDraftLists = (data) => {
  return request({
    url: modulePrefix + ebay + "product/draft/list",
    method: "post",
    data,
  });
};
// ebay创建生成草稿清单
export const setProductDraftLists = (params) => {
  return request({
    url: modulePrefix + ebay + "product/draft",
    method: "post",
    data: params,
  });
};

// 根据id查询变体信息
export const getVariationLists = (id) => {
  return request({
    url: modulePrefix + ebay + `product/variation/${id}`,
    method: "get",
  });
};
// ebay创建商品
export const createProductList = (params) => {
  return request({
    url: modulePrefix + ebay + "product",
    method: "post",
    data: params,
  });
};
// ebay商品删除
export const deleteProductList = (params) => {
  return request({
    url: modulePrefix + ebay + "product",
    method: "delete",
    data: params,
  });
};
// ebay查询商品兼容性列表
export const getProductCompatibilityList = (params) => {
  return request({
    url: modulePrefix + ebay + "product/compatibility",
    method: "get",
    params,
  });
};
// ebay查询商品
export const getProductList = (id) => {
  return request({
    url: modulePrefix + ebay + `product/${id}`,
    method: "get",
  });
};
// ebay查询商品复制
export const getProductCopyList = (id) => {
  return request({
    url: modulePrefix + ebay + `product/${id}/copy`,
    method: "get",
  });
};
// ebay修改商品
export const modifyProduct = (id, params) => {
  return request({
    url: modulePrefix + ebay + `product/${id}`,
    method: "put",
    data: params,
  });
};
// ebay修改商品备注
export const modifyProductRemarks = (params, id) => {
  return request({
    url: modulePrefix + ebay + `product/${id}/remark?remark=${params}`,
    method: "put",
  });
};

// 根据itemId查询商品兼容性列表
export const getItemCompatibility = (params) => {
  return request({
    url:
      modulePrefix +
      ebay +
      `product/compatibility/${params.itemId}?shopId=${params.shopId}`,
    method: "get",
  });
};

// ebay刊登模板查询接口
export const getTemplateList = (params) => {
  return request({
    url: modulePrefix + ebay + "/template/listing/queryList",
    method: "post",
    data: params,
  });
};

/*ebay元素据接口*/

// 查询ebay分类基本信息元数据
export const queryEbayBaseCategory = (params) => {
  return request({
    url: modulePrefixs + ebay + "category/queryEbayBaseCategory",
    method: "post",
    data: params,
    isFlagUrl: 1,
  });
};
// 物品状况
export const getQueryEbayCategoryCondition = (params) => {
  return request({
    url: modulePrefixs + ebay + "category/queryEbayCategoryCondition",
    method: "get",
    params: params,
    isFlagUrl: 1,
  });
};

// 查询ebay产品属性元数据
export const queryEbayCategoryAttribute = (params) => {
  return request({
    url: modulePrefixs + ebay + "category/queryEbayCategoryAttribute",
    method: "get",
    params: params,
    isFlagUrl: 1,
  });
};

// 查询ebay产品属性元数据
export const queryCompatibility = (params) => {
  return request({
    url: modulePrefixs + ebay + "compatibility/queryCompatibility",
    method: "post",
    data: params,
    isFlagUrl: 1,
  });
};

// 查询ebay产品属性元数据
export const getFindAttributeValueByCondition = (params) => {
  return request({
    url: modulePrefixs + ebay + "category/findAttributeValueByCondition",
    method: "post",
    data: params,
    isFlagUrl: 1,
  });
};

// 查询ebay元数据兼容性名称
export const queryEbayCategoryCompatibleName = (params) => {
  return request({
    url: modulePrefixs + ebay + "category/queryEbayCategoryCompatibleName",
    method: "get",
    params: params,
    isFlagUrl: 1,
  });
};

// ebay根据站点和兼容性类型查询一组兼容性（以父级的第一个值查询下一级）
export const queryFirstCompatibility = (params) => {
  return request({
    url: modulePrefixs + ebay + "/compatibility/queryFirstCompatibility",
    method: "post",
    data: params,
    isFlagUrl: 1,
  });
};

// ebay根据站点和兼容性类型查询一组兼容性（以父级的第一个值查询下一级）
export const childQueryCompatibility = (params) => {
  return request({
    url: modulePrefixs + ebay + "/compatibility/queryAllCompatibility",
    method: "post",
    data: params,
    isFlagUrl: 1,
  });
};

// ebay兼容新模板列表成功
export const getCompatibilityQueryList = (params) => {
  return request({
    url: modulePrefix + template + "compatibility/queryList",
    method: "post",
    data: params,
    isFlagUrl: 2,
  });
};
// 在线数量
export const getEbayGenerallisting = (params) => {
  return request({
    url:
      modulePrefix +
      `/general/listing/record/page?pageCurrent=${params.pageCurrent}&pageSize=${params.pageSize}&productId=${params.productId}&businessType=${params.businessType}`,
    method: "get",
  });
};

/*ebay 刊登草稿 */
// ebay刊登草稿列表查询
export const getDraftLists = (params) => {
  return request({
    url: modulePrefix + ebay + "draft/query/list",
    method: "post",
    data: params,
  });
};
// ebay创建草稿
export const createDraftList = (params) => {
  return request({
    url: modulePrefix + ebay + "draft",
    method: "post",
    data: params,
  });
};

export const getdraftList = (id) => {
  return request({
    url: modulePrefix + ebay + `draft/${id}`,
    method: "get",
  });
};

export const setVerify = (params) => {
  return request({
    url: modulePrefix + ebay + "draft/verify",
    method: "post",
    data: params,
  });
};

// 草稿复制
export const getDraftCopyList = (id) => {
  return request({
    url: modulePrefix + ebay + `draft/${id}/copy`,
    method: "get",
  });
};
// 根据id查询变体信息
export const getdraftVariationLists = (id) => {
  return request({
    url: modulePrefix + ebay + `draft/ variation / ${id}`,
    method: "get",
  });
};
// ebay草稿删除
export const deleteDraftList = (params) => {
  return request({
    url: modulePrefix + ebay + "draft",
    method: "delete",
    data: params,
  });
};
// ebay草稿发布
export const getDraftRelease = (data) => {
  return request({
    url: modulePrefix + ebay + "draft/online",
    method: "put",
    data,
  });
};

// ebay草稿批量发布
export const getDraftReleaseBatch = (data) => {
  return request({
    url: modulePrefix + ebay + "draft/online/batch",
    method: "put",
    data,
  });
};

// ebay查询草稿兼容性列表
export const getDraftCompatibilityList = (params) => {
  return request({
    url: modulePrefix + ebay + "draft/compatibility",
    method: "get",
    params,
  });
};
// ebay根据商品资料创建草稿
export const setDraftProduct = (params) => {
  return request({
    url: modulePrefix + ebay + "draft/product",
    method: "post",
    params,
  });
};

// 刷新店铺分类
export const setResfCategorys = (params) => {
  return request({
    url: modulePrefix + ebay + "store/saveEbayStoreCategorys",
    method: "post",
    params,
  });
};
// store/queryEbayStoreCategorys
// 查询店铺分类
export const getqueryEbayStoreCategorysyList = (params) => {
  return request({
    url: modulePrefix + ebay + "store/queryEbayStoreCategorys",
    method: "get",
    params,
    isFlagUrl: 2,
  });
};

// ebay修改草稿
export const modifyDraft = (id, params) => {
  return request({
    url: modulePrefix + ebay + `draft/${id}`,
    method: "put",
    data: params,
  });
};

/*ebay 通用模版 */
// ebay模版查询
export const getEbayTemplateInfoList = (params) => {
  return request({
    url: modulePrefix + template + "listing/queryList",
    method: "post",
    data: params,
  });
};

// ebay模版创建
export const getEbayTemplateCreate = (params) => {
  return request({
    url: modulePrefix + template + "listing/create",
    method: "post",
    data: params,
  });
};
// ebay模版删除
export const getEbayTemplateDelete = (params) => {
  return request({
    url: modulePrefix + template + "listing",
    method: "delete",
    data: params,
  });
};

// ebay模版查询
export const getEbayTemplateSearch = (id) => {
  return request({
    url: modulePrefix + template + `listing / ${id}`,
    method: "get",
  });
};

// ebay模版修改
export const getEbayTemplateChange = (params) => {
  return request({
    url: modulePrefix + template + `listing / ${params.id}`,
    method: "put",
    data: params.params,
  });
};

// ebay草稿记录列表
export const getEbayDraftRecordChangePage = (params) => {
  return request({
    url: modulePrefix + "/draftRecord/page",
    method: "get",
    params,
  });
};
// ebay在线数量
export const getEbayOnlineShelvesPage = (params) => {
  return request({
    url: modulePrefix + "/onlineShelves/page",
    method: "get",
    params,
  });
};

/*ebay 组件模版 */
// ebay组件模版查询
export const getEbayTemplateAssemblyInfo = (params) => {
  return request({
    url: modulePrefix + template + params.url + "/queryList",
    method: "post",
    data: params.params,
  });
};

// ebay组件模版创建
export const getEbayTemplateAssemblyCreate = (params) => {
  return request({
    url: modulePrefix + template + params.url + "/create",
    method: "post",
    data: params.params,
  });
};
// ebay组件模版删除
export const getEbayTemplateAssemblyDelete = (params) => {
  return request({
    url: modulePrefix + template + params.url,
    method: "delete",
    data: params.params,
  });
};

// ebay组件模版查询
export const getEbayTemplateAssemblySearch = (params) => {
  return request({
    url: modulePrefix + template + `${params.url}` + "/" + `${params.id}`,
    method: "get",
  });
};

// ebay组件模版修改
export const getEbayTemplateAssemblyChange = (params) => {
  return request({
    url:
      modulePrefix + template + `${params.url}` + "/" + `${params.params.id}`,
    method: "put",
    data: params.params,
  });
};

// 查询ebay单个站点数据
export const getOnlyQueryEbayBaseSiteInfo = (params) => {
  return request({
    url: modulePrefixs + "/ebay/site/queryEbayBaseSiteInfo",
    method: "get",
    params,
    isFlagUrl: 1,
  });
};
// 描述图片
export const setDesPreview = (params) => {
  const data = toFormData(params);
  data.append("name", createUuid() + ".jpeg");
  return request({
    // /listing
    url: modulePrefix + "/listing-common/upload/description/preview",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};
// //  查询ebay站点基本信息元数据
// 查询ebay站点基本信息元数据
export const getQueryEbayBaseSiteInfo = () => {
  return request({
    url: modulePrefix + "/common/data/region?platformId=EBAY",
    method: "get",
    isFlagUrl: 3,
  });
};

// shopId: item.shopId,
// shopName: item.shopName,
//  查询ebay基本信息元数据
export const getListingCommonShop = () => {
  return request({
    url: modulePrefix + "/listing-common/shop?platformCode=EBAY",
    method: "get",
  });
};
//  查询ebay物品所在地
export const getQueryEbayLocationCountry = (params) => {
  return request({
    url: modulePrefixs + "/ebay/site/queryEbayLocationCountry",
    method: "get",
    params,
    isFlagUrl: 1,
  });
};
//  查询ebay不运送地区
export const getQueryEbayExcludeShippingLocations = (params) => {
  return request({
    url: modulePrefixs + "/ebay/site/queryEbayExcludeShippingLocations",
    method: "get",
    params,
    isFlagUrl: 1,
  });
};

//  查询ebay包装方式
export const getQueryEbayShippingPackages = (params) => {
  return request({
    url: modulePrefixs + "/ebay/site/queryEbayShippingPackages",
    method: "get",
    params,
    isFlagUrl: 1,
  });
};
//  查询ebay处理时间
export const getQueryEbayDispatchTimeMax = (params) => {
  return request({
    url: modulePrefixs + "/ebay/site/queryEbayDispatchTimeMax",
    method: "get",
    params,
    isFlagUrl: 1,
  });
};

//  查询ebay类型
export const getEbayShippingMethod = (params) => {
  return request({
    url: modulePrefixs + "/ebay/site/queryEbayShippingMethod",
    method: "post",
    data: params,
    isFlagUrl: 1,
  });
};

//  查询默认退货政策
export const getQueryEbaySiteReturnPolicy = (params) => {
  return request({
    url: modulePrefixs + "/ebay/site/queryEbaySiteReturnPolicy",
    method: "get",
    params,
    isFlagUrl: 1,
  });
};
//  查询fenlei退货政策
export const getQueryEbayCategoryReturnPolicy = (params) => {
  return request({
    url: modulePrefixs + "/ebay/category/queryEbayCategoryReturnPolicy",
    method: "get",
    params,
    isFlagUrl: 1,
  });
};
//  查询店铺的对应的运费表
export const getQueryEbayStoreRateTables = (params) => {
  return request({
    url: modulePrefix + "/ebay/store/queryEbayStoreRateTables",
    method: "get",
    params,
    isFlagUrl: 2,
  });
};
//  保存所有店铺的的运费表信息
export const setSaveEbayStoreRateTables = (params) => {
  return request({
    url: modulePrefix + "/ebay/store/saveEbayStoreRateTables",
    method: "post",
    params,
    isFlagUrl: 2,
  });
};
//  查询ebay运送地区元数据
export const getQueryEbayShippingLocations = (params) => {
  return request({
    url: modulePrefixs + "/ebay/site/queryEbayShippingLocations",
    method: "get",
    params,
    isFlagUrl: 1,
  });
};
//  查询ebay税收管辖区
export const getQueryEbayTaxJuridictions = (params) => {
  return request({
    url: modulePrefixs + "/ebay/site/queryEbayTaxJuridictions",
    method: "get",
    params,
    isFlagUrl: 1,
  });
};
//  查询刊登时长
export const getQueryEbaySiteListingDuration = (params) => {
  return request({
    url: modulePrefixs + "/ebay/site/queryEbaySiteListingDuration",
    method: "get",
    params,
  });
};

// ebay在线商品列表查询
export const getListing = (params) => {
  return request({
    url: modulePrefix + ebay + "listing/query/list",
    method: "post",
    data: params,
  });
};
// ebay批量下架
export const getListingOffline = (params) => {
  return request({
    url: modulePrefix + ebay + "listing/offline",
    method: "put",
    data: params,
  });
};
// ebay批量更新
export const getListingModifyBatch = (params) => {
  return request({
    url: modulePrefix + ebay + "listing/modify/batch",
    method: "put",
    data: params,
  });
};
// ebay批量同步
export const getListingSync = (params) => {
  return request({
    url: modulePrefix + ebay + "listing/sync",
    method: "post",
    data: params,
  });
};
// ebay批量上架
export const getListingRelistingBatch = (params) => {
  return request({
    url: modulePrefix + ebay + "listing/relisting/batch",
    method: "put",
    data: params,
  });
};

// ebay单个上架
export const getListingRelistingSingle = (id, params) => {
  return request({
    url: modulePrefix + ebay + `listing/relisting/${id}`,
    method: "put",
    data: params,
  });
};
// 复制在线商品
export const getListingCopy = (id) => {
  return request({
    url: modulePrefix + ebay + `listing/${id}/copy`,
    method: "get",
  });
};

// ebay在线商品详情
export const getListingDetails = (params) => {
  return request({
    url:
      modulePrefix +
      ebay +
      `listing/${params.id}?platformStatus=${params.status}`,
    method: "get",
  });
};
// ebay更新在线商品详情
export const getListingUpload = (id, data) => {
  return request({
    url: modulePrefix + ebay + `listing/${id}`,
    method: "put",
    data,
  });
};

// ebay在线商品暂存详情
export const getstoraggDetails = (id) => {
  return request({
    url: modulePrefix + ebay + `listing/storage/${id}`,
    method: "get",
  });
};

// ebay在线商品保存
export const setStoraggSave = (params) => {
  return request({
    url: modulePrefix + ebay + `listing/storage`,
    method: "post",
    data: params,
  });
};

// ebay在线商品删除暂存
export const deleteStoragg = (id) => {
  return request({
    url: modulePrefix + ebay + `listing/storage/${id}`,
    method: "DELETE",
  });
};

// 变体信息
export const getListingVariantList = (params) => {
  return request({
    url: modulePrefix + ebay + "listing/variation/" + params.listingId,
    method: "get",
  });
};
// 组件模板中兼容性列表
export const getCategoryQueryCompatibleName = (params) => {
  return request({
    url: modulePrefixs + ebay + "category/queryCompatibleName",
    method: "get",
    params,
  });
};
// 视屏库

export const getPubEBayVideoLibraryList = (params) => {
  return request({
    url: modulePrefix + ebay + "video/queryList",
    method: "post",
    data: params,
  });
};

// 同步
export const setUpdateVideoStatus = (params) => {
  return request({
    url: modulePrefix + ebay + `video/updateVideoStatus`,
    method: "post",
    params,
  });
};
// 视频状态集合
export const getVideoStateShop = () => {
  return request({
    url: modulePrefix + "/listing-common/video_state?platformCode=EBAY",
    method: "get",
  });
};

// 上传视频确认按钮
export const saveEbayVideoInfo = (data) => {
  return request({
    url: modulePrefix + "/listing-common/upload/video",
    method: "post",
    data,
    isFlagUrl: 4,
  });
};
