import request from "@/request";
// const modulePrefix = "/customer-service";
const modulePrefix =
  process.env.NODE_ENV === "localhost"
    ? "http://172.30.50.6:8090"
    : "customer-service";
// process.env.NODE_ENV === "localhost" ? "" : "/customer-service";

const baseUrl = "/basic/message/";

// 分配规则
// 获取分配规则列表
export const getAllocationRuleList = (params) => {
  return request({
    url: modulePrefix + baseUrl + `allocationRule`,
    method: "get",
    params,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 新建分配规则
export const addAllocationRule = (data) => {
  return request({
    url: modulePrefix + baseUrl + `allocationRule`,
    method: "post",
    data,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 编辑分配规则
export const editAllocationRule = (data) => {
  return request({
    url: modulePrefix + baseUrl + `allocationRule`,
    method: "put",
    data,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 删除分配规则
export const delAllocationRule = (data) => {
  return request({
    url: modulePrefix + baseUrl + `allocationRule/delete`,
    method: "delete",
    data,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 开启/禁用分配规则
export const disableOrEnableAllocationRule = (params) => {
  return request({
    url:
      modulePrefix +
      baseUrl +
      `allocationRule/${params.url}` +
      "/" +
      `${params.id}`,
    method: "put",
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 获取人员组织架构
export const getAllocationRuleDepartmentList = (params) => {
  return request({
    url: modulePrefix + baseUrl + `allocationRule/department`,
    method: "get",
    params,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 获取店铺树
export const getAllocationRuleshopsList = (params) => {
  return request({
    url: modulePrefix + baseUrl + `allocationRule/shops`,
    method: "get",
    params,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};

// 分类标签
// 获取分类标签列表
export const getClassificationLabelList = (params) => {
  return request({
    url: modulePrefix + baseUrl + `label`,
    method: "get",
    params,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 新建分类标签
export const addClassificationLabel = (data) => {
  return request({
    url: modulePrefix + baseUrl + `label`,
    method: "post",
    data,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 编辑分类标签
export const editClassificationLabel = (data) => {
  return request({
    url: modulePrefix + baseUrl + `label`,
    method: "put",
    data,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 删除分类标签
export const delClassificationLabel = (data) => {
  return request({
    url: modulePrefix + baseUrl + `label/delete`,
    method: "delete",
    data,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};

// 开启/禁用标签
export const disableOrEnableLabel = (params) => {
  return request({
    url: modulePrefix + baseUrl + `label/${params.url}` + "/" + `${params.id}`,
    method: "put",
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};

// 处理时效
// 获取处理时效列表
export const getHandlePeriodList = (params) => {
  return request({
    url: modulePrefix + baseUrl + `handlePeriod`,
    method: "get",
    params,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};

// 开启/禁用标签
export const disableOrEnableHandlePeriodList = (params) => {
  return request({
    url:
      modulePrefix +
      baseUrl +
      `handlePeriod/${params.url}` +
      "/" +
      `${params.platformId}`,
    method: "put",
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 修改标签
export const editHandlePeriodList = (params) => {
  return request({
    url:
      modulePrefix +
      baseUrl +
      `handlePeriod/period/${params.platformId}?${params.hours}`,
    method: "put",
    params,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};

// 评价标签
// 获取评价标签列表
export const getCommentLabelList = (params) => {
  return request({
    url: modulePrefix + `/basic/comment/label`,
    method: "get",
    params,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 新增评价标签
export const addCommentLabel = (params) => {
  return request({
    url: modulePrefix + `/basic/comment/label`,
    method: "post",
    params,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};

// 开启/禁用评价标签
export const disableOrEnableCommentLabelList = (params) => {
  return request({
    url:
      modulePrefix +
      `/basic/comment/label/${params.url}` +
      "/" +
      `${params.id}`,
    method: "put",
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 修改评分区间
export const scoringIntervalCommentLabel = (data) => {
  return request({
    url: modulePrefix + `/basic/comment/label`,
    method: "put",
    data,
    "g-user-id": "652769251630276608",
    "g-tenant-id": 200,
  });
};

// 常用语
// 获取常用语列表
export const getTemplateReplyList = (params) => {
  return request({
    url: modulePrefix + `/basic/template/reply`,
    method: "get",
    params,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 新建常用语
export const addTemplateReply = (data) => {
  return request({
    url: modulePrefix + `/basic/template/reply`,
    method: "post",
    data,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 编辑常用语
export const editTemplateReply = (data) => {
  return request({
    url: modulePrefix + `/basic/template/reply`,
    method: "put",
    data,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 删除常用语
export const delTemplateReply = (data) => {
  return request({
    url: modulePrefix + `/basic/template/reply/delete`,
    method: "delete",
    data,
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};

// 开启/禁用常用语
export const disableOrEnableTemplateReply = (params) => {
  return request({
    url:
      modulePrefix +
      `/basic/template/reply/${params.url}` +
      "/" +
      `${params.id}`,
    method: "put",
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
// 获取平台信息
export const getCommonDataPlatform = () => {
  return request({
    url: modulePrefix + `/common/data/platform`,
    method: "get",
    // "g-user-id": "652769251630276608",
    // "g-tenant-id": 200,
  });
};
