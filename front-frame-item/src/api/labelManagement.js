import request from "@/request";
const modulePrefix = process.env.NODE_ENV === "localhost" ? "" : "/listing";

// 标签列表
export const getList = (params) => {
  return request({
    url: modulePrefix + "/general/labelInfo/page",
    method: "post",
    data: params,
  });
};

// 编辑
export const updateLabel = (params) => {
  return request({
    url: modulePrefix + "/general/labelInfo/updateById",
    method: "post",
    data: params,
  });
};

// 新增
export const saveLabel = (params) => {
  return request({
    url: modulePrefix + "/general/labelInfo/save",
    method: "post",
    data: params,
  });
};

// 删除
export const deleteLabel = (params) => {
  return request({
    url: modulePrefix + `/general/labelInfo/bathDelete`,
    method: "get",
    params,
  });
};

// 数据异常列表
export const abnormalList = (params) => {
  return request({
    url: modulePrefix + `/general/excel/page`,
    method: "get",
    params,
  });
};
// 异常单个导出excel
export const downError = (params) => {
  return request({
    url: modulePrefix + `/general/labelInfo/downError`,
    method: "get",
    params,
  });
};

// 异常批量导出zip
export const bathDownError = (params) => {
  return request({
    url: modulePrefix + `/general/labelInfo/bathDownError`,
    method: "get",
    params,
    responseType: "blob",
  });
};

// 下载模板
export const downModule = (params) => {
  return request({
    url: modulePrefix + `/general/labelInfo/downModule`,
    method: "get",
    params,
    responseType: "blob",
  });
};
