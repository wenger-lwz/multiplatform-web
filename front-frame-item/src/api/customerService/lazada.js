import request from "@/request";

const prefix =
  process.env.NODE_ENV === "localhost"
    ? "http://172.30.50.6:8090"
    : "/customer-service";

export const getLazadaReview = (data) => {
  return request({
    url: prefix + `/lazada/review/`,
    method: "post",
    data,
  });
};
export const getLazadaReviewClassifyTag = () => {
  return request({
    url: prefix + `/lazada/review/classify/tag`,
    method: "get",
  });
};
export const getLazadaReviewReviewItemId = (data) => {
  return request({
    url: prefix + `/lazada/review/${data.id}`,
    method: "put",
    data,
  });
};
