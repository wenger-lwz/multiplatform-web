import { createUuid } from "./utils.js";

// 分支条件筛选数据模板 且条件
export const andCondition = {
  andListLeft: "",
  //  ['EQ', 'NEQ', 'GT', 'GTEQ', 'LT', 'LTEQ', 'INCLUDE', 'EXCLUDE', 'BELONG', 'NBELONG', 'UNDER', 'NUNDER', 'DYNAMIC']
  logicalJudge: "",
  type: "",
  andListRight: "",
};
// 分支条件筛选数据模板 或条件
export const branchCondition = {
  name: "或",
  andList: [new Condition(andCondition)],
};
/**
 * 条件筛选创建基类
 * @param {andCondition branchCondition} data 模型对象
 */
export function Condition(data) {
  Object.keys(data).forEach((key) => {
    this[key] = data[key];
  });
}
// 节点创建初始数据模板
export const nodeConfigMould = {
  // 审批节点
  examineAndApprove: {
    nodeType: "examineAndApprove",
    name: "未命名节点",
    isCreated: false,
    personInCharge: [],
    processFeedback: false,
    withdraw: false,
    viewLog: false,
    transfer: false,
    back: false,
    reject: false,
    preNodeIdList: [],
    nextNodeIdList: [],
  },
  // 填写节点
  fillIn: {
    nodeType: "fillIn",
    name: "未命名节点",
    isCreated: false,
    personInCharge: [{ value: "zhangsan", label: "张三" }],
    processFeedback: false,
    withdraw: false,
    viewLog: false,
    transfer: false,
    back: false,
    reject: false,
    preNodeIdList: [],
    nextNodeIdList: [],
  },
  // 分支节点
  branch: {
    nodeType: "branch",
    preNodeIdList: [],
    nextNodeIdList: [],
    conditions: [
      new Condition(branchCondition),
      new Condition(branchCondition),
    ],
  },
};
/**
 * 节点创建基类
 * @param {String} nodeType 节点创建类型
 * @param {String} parentId 上级ID
 */
export class Modeler {
  constructor(nodeType, parentId, preNodeIdList) {
    const nodeMouldData = nodeConfigMould[nodeType];
    Object.keys(nodeMouldData).forEach((key) => {
      this[key] = nodeMouldData[key];
    });
    this.id = createUuid();
    if (parentId) {
      this.parentId = parentId;
    }
    // 向上的指针
    if (preNodeIdList) {
      this.preNodeIdList = preNodeIdList;
    }
  }
}
