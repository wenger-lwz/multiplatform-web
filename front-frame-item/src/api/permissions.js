import request from "@/request/uacIndex";

// 按钮权限
export default function getPermissions(params) {
  return request({
    url: "/api/admin/system/sys-resource/get/buttonList",
    method: "get",
    params,
  });
}
