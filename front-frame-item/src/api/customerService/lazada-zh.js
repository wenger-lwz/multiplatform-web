import request from "@/request";
// import { toFormData } from "../../utils/transform";

const prefix =
  process.env.NODE_ENV === "localhost" ? "http://172.30.51.0:8090" : "/media";

export const getShop = (params) => {
  return request({
    url: prefix + `/lazada/im/classify/shop`,
    method: "get",
    params,
  });
};

export const getLabel = (params) => {
  return request({
    url: prefix + `/lazada/im/classify/label`,
    method: "get",
    params,
  });
};
