// 中台相关接口
import request from "@/request/uacIndex";
// 设置
export const setColumn = (params) => {
  return request({
    url: "/api/admin/system/sys-user-personalize/save",
    method: "put",
    data: params,
  });
};

// 获取上一次设置的
export const getClassify = (params) => {
  return request({
    url: `/api/admin/system/sys-user-personalize/${params.key}`,
    method: "get",
  });
};

// 恢复默认设置,同 setColumn

// 默认视图设置接口
export const setDefaultView = (params) => {
  return request({
    url: "/api/admin/system/sys-user-personalize/save",
    method: "put",
    data: params,
  });
};

// 获取设置的默认视图接口
export const getDefaultView = (id) => {
  return request({
    url: `/api/admin/system/sys-user-personalize/${id}`,
    method: "get",
  });
};
