import request from "@/request";

const prefix =
  process.env.NODE_ENV === "localhost"
    ? "http://172.30.50.6:8090"
    : "/customer-service";

export const getEBayShopListMessage = (data) => {
  return request({
    url: prefix + `/eBay/customerservice/GetEBayShopListMessage`,
    method: "post",
    data,
  });
};

export const getEBayLabelListMessage = (data) => {
  return request({
    url: prefix + "/eBay/customerservice/GetEBayLabelListMessage",
    method: "post",
    data,
  });
};

// 获取eBay议价详情
export const getBestOfferDatail = (data) => {
  return request({
    url:
      prefix + `/eBay/customerservice/discussPrice/getBestOfferDatail/${data}`,
    method: "get",
  });
};

// 获取eBay议价状态列表数据
export const getBestOfferStatusList = () => {
  return request({
    url: prefix + "/eBay/customerservice/discussPrice/getBestOfferStatusList",
    method: "get",
  });
};
// 查询议价列表接口
export const getDiscussPriceList = (data) => {
  return request({
    url: prefix + "/eBay/customerservice/discussPrice/getDiscussPriceList",
    method: "post",
    data,
  });
};
// 从eBay拉取议价列表接口
export const pullBestOfferList = (data) => {
  return request({
    url: prefix + "/eBay/customerservice/discussPrice/pullBestOfferList",
    method: "post",
    data,
  });
};
// 回复议价
export const replyBestOffer = (data) => {
  return request({
    url: prefix + "/eBay/customerservice/discussPrice/replyBestOffer",
    method: "post",
    data,
  });
};
// 主动联系买家
export const addToBuyerIMCreateSession = (data) => {
  return request({
    url: prefix + "/eBay/customerservice/addToBuyerIMCreateSession",
    method: "post",
    data,
  });
};
