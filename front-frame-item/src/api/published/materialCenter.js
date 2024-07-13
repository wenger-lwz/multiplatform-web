import request from "@/request";
const prefix =
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.6:8081" : "/media";

export const getProductCategoryList = (params) => {
  return request({
    url: prefix + "/categoryTree/getProductCategoryList",
    method: "get",
    params,
  });
};

// export const getProductPageList = (params) => {
//   return request({
//     url: "/resource/productPageList",
//     method: "get",
//     params,
//   });
// };

export const getLanguageList = (params) => {
  return request({
    url: prefix + "/resource/getLanguageList",
    method: "get",
    params,
  });
};

// 产品素材编辑页 获取编辑详情
export const getBindInfoBySku = (params) => {
  return request({
    url: prefix + "/resource/getBindInfoBySku",
    method: "get",
    params,
  });
};

export const saveBind = (data) => {
  return request({
    url: prefix + "/resource/saveBind",
    method: "post",
    data,
  });
};

export const addTitle = (params) => {
  return request({
    url: prefix + "/resource/addTitle",
    method: "get",
    params,
  });
};

export const getOtherCategoryList = (params) => {
  return request({
    url: prefix + "/categoryTree/getOtherCategoryList",
    method: "get",
    params,
  });
};

// export const getOtherImgPageList = (params) => {
//   return request({
//     url: "/resource/otherImgPageList",
//     method: "get",
//     params,
//   });
// };

export const getBindInfoList = (params) => {
  return request({
    url: prefix + "/resource/getBindInfoList",
    method: "get",
    params,
  });
};

export const productImgJumpPageList = (params) => {
  return request({
    url: prefix + "/resource/productImgJumpPageList",
    method: "get",
    params,
  });
};

export const getAllLabelList = (params) => {
  return request({
    url: prefix + "/label/getAllLabelList",
    method: "get",
    params,
  });
};

export const getLabelByResourceId = (id) => {
  return request({
    url: prefix + `/label/getLabelByResourceId/${id}`,
    method: "get",
  });
};

export const deleteResourceLabel = (params) => {
  return request({
    url: prefix + `/label/deleteResourceLabel`,
    method: "delete",
    params,
  });
};

export const makeLabel = (data) => {
  return request({
    url: prefix + "/resource/makeLabel",
    method: "post",
    data,
  });
};

export const addCategory = (data) => {
  return request({
    url: prefix + "/categoryTree/addCategory",
    method: "post",
    data,
  });
};

export const getOtherParentCategories = (params) => {
  return request({
    url: prefix + "/categoryTree/otherParentCategories",
    method: "get",
    params,
  });
};

export const bathDeleteProductImages = (params) => {
  return request({
    url: prefix + `/resource/bathDeleteProductImages?resourceIds=${params}`,
    method: "delete",
  });
};

export const bathDeleteImages = (params) => {
  return request({
    url: prefix + `/resource/bathDeleteImages?resourceIds=${params}`,
    method: "delete",
  });
};

// export const productVideoPageList = (params) => {
//   return request({
//     url: "/video/productVideoPageList",
//     method: "get",
//     params,
//   });
// };

export const productVideoJumpPageList = (params) => {
  return request({
    url: prefix + "/video/productVideoJumpPageList",
    method: "get",
    params,
  });
};

export const bathDeleteProductVideo = (params) => {
  return request({
    url: prefix + `/video/bathDeleteProductVideo?resourceIds=${params}`,
    method: "delete",
  });
};

// 全部目录
export const getUploadDir = (params) => {
  return request({
    url: prefix + "/categoryTree/getUploadDir",
    method: "get",
    params,
  });
};

// 其他图片的 上传目录
export const getCustomUploadDir = (params) => {
  return request({
    url: prefix + "/categoryTree/getCustomUploadDir",
    method: "get",
    params,
  });
};

export const skuInfoList = (params) => {
  return request({
    url: prefix + "/resource/skuInfoList",
    method: "get",
    params,
  });
};

export const spuInfoList = (params) => {
  return request({
    url: prefix + "/resource/spuInfoList",
    method: "get",
    params,
  });
};
// 查询spu下的sku
export const getSkuListBySpu = (params) => {
  return request({
    url: prefix + "/resource/getSkuListBySpu",
    method: "get",
    params,
  });
};
