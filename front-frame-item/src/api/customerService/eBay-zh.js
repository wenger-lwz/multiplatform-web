import request from "@/request";
import { toFormData } from "../../utils/transform";

const prefix =
  process.env.NODE_ENV === "localhost" ? "http://172.30.51.0:8090" : "/media";

export const getMessageList = (data) => {
  return request({
    url: prefix + "/eBay/customerservice/getMessageList",
    method: "post",
    data,
  });
};

export const getSessionList = (data) => {
  return request({
    url: prefix + "/eBay/customerservice/getSessionList",
    method: "post",
    data,
  });
};

export const uploadMessageImg = (params) => {
  const data = toFormData(params);
  return request({
    url: prefix + "/eBay/customerservice/uploadMessageImg",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};

export const replyMessage = (data) => {
  return request({
    url: prefix + "/eBay/customerservice/replyMessage",
    method: "post",
    data,
  });
};

export const addMemberMessageAAQToPartner = (data) => {
  return request({
    url: prefix + "/eBay/customerservice/addMemberMessageAAQToPartner",
    method: "post",
    data,
  });
};

export const getOrder = (sessionId) => {
  return request({
    url: prefix + `/eBay/customerservice/${sessionId}/order`,
    method: "get",
  });
};

export const getDiscussPriceList = (data) => {
  return request({
    url: prefix + `/eBay/customerservice/discussPrice/getDiscussPriceList`,
    method: "post",
    data,
  });
};

export const getReplyTemplate = (params) => {
  return request({
    url: prefix + `/basic/template/reply`,
    method: "get",
    params,
  });
};

// 转交会话
export const updateSessionReceiver = (data) => {
  return request({
    url: prefix + `/eBay/customerservice/updateSessionReceiver`,
    method: "post",
    data,
  });
};

// 查看回复列表 和 查看消息列表
export const getQueryMessageList = (data) => {
  return request({
    url: prefix + `/eBay/customerservice/queryMessageList`,
    method: "post",
    data,
  });
};

// 转交记录
export const getTransferRecordList = (data) => {
  return request({
    url: prefix + `/basic/message/transfer/getTransferRecordList`,
    method: "post",
    data,
  });
};
