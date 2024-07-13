import request from "@/request";

const prefix =
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.131:8081" : "/media";
const prefix83 = process.env.NODE_ENV === "localhost" ? "" : "/listing";

export function login(params) {
  return request({
    url: "/login",
    method: "get",
    params,
  });
}
export function publishLog(params) {
  return request({
    url: "/publishLog/page",
    method: "get",
    params,
  });
}
export function onlineLog(params) {
  return request({
    url: "/onlineLog/page",
    method: "get",
    params,
  });
}

export function getSkuListBySpu(params) {
  return request({
    url: prefix + "/resource/getSkuListBySpu",
    method: "get",
    params,
  });
}

// 刊登草稿的刊登队列
export function getQueueInfo(params) {
  return request({
    url: prefix83 + "/general/queueInfo/list",
    method: "get",
    params,
  });
}

// 商品资料列表的在线数量
export function getRecord(params) {
  return request({
    url: prefix83 + "/general/listing/record/page",
    method: "get",
    params,
  });
}

// 店铺SKU自动生成
export function getSkuRule(params) {
  return request({
    url: prefix83 + "/general/skuRule/set",
    method: "post",
    data: params,
  });
}
