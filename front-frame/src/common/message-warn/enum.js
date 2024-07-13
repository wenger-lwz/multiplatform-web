export const BusinessType = {
  MY_TASK: 'my_task', // 我的任务
  PURCHASE_PLAN: 'purchase_plan', // 采购计划
  PURCHASE_ORDER: 'purchase_order', // 采购订单
  TRANSFER: 'transfer', // 调拨单
  FINANCE: 'finance', // 请款单
  DELIVERY: 'delivery', // 交货单
  INVOICE: 'invoice', // 发货单
  QC: 'qc', // 质检单
}

export const MsgType = {
  TASK: 'TASK',
  WARN: 'WARN',
  SYSTEM_MSG: "SYSTEM_MSG"
}

export const NoticeLevel = {
  COMMONLY: 0, // 中
  STRONG: 1, // 强
  WEAK: 2 // 弱
}

export const RemindLevelForSystem = {
  WEAK: 0,   // 弱
  MIDDLE: 1,   // 中
  STRONG: 2, // 强
}

export const NoticeStatusApiOptions = {
  [MsgType.TASK + '_' + NoticeLevel.COMMONLY]: {
    url: '/v2/taskNoticeModel/updateNoticeViewStatus'
  },
  [MsgType.TASK + '_' + NoticeLevel.STRONG]: {
    url: '/v2/taskNoticeModel/updateNoticeDelayTime'
  },
  [MsgType.WARN + '_' + NoticeLevel.COMMONLY]: {
    url: '/v2/warnItem/updateWarnItemViewStatus'
  },
  [MsgType.WARN + '_' + NoticeLevel.STRONG]: {
    url: '/v2/warnItem/updateWarnItemDelayTime'
  },
  [MsgType.SYSTEM_MSG + '_' + RemindLevelForSystem.MIDDLE]: {
    url: '/v2/systemNoticeModel/updateSystemMessageStatus'
  },
  [MsgType.SYSTEM_MSG + '_' + RemindLevelForSystem.STRONG]: {
    url: '/v2/systemNoticeModel/updatSystemMessageDelayTime'
  }
};

export const BusinessTypeOptions = [
  {
    id: BusinessType.MY_TASK,
    text: 'MESSAGE.myTask',
    routerLink: '/amz-web/approval/myTask',
    permission: '/approval/myTask/view'
  },
  {
    id: BusinessType.PURCHASE_PLAN,
    text: 'MESSAGE.purchasePlan',
    routerLink: '/amz-web/purchase/purchasePlan',
    permission: '/purchase/purchasePlan/view'
  },
  {
    id: BusinessType.PURCHASE_ORDER,
    text: 'MESSAGE.purchaseOrder',
    routerLink: '/amz-web/purchase/purchaseOrder',
    permission: '/purchase/purchaseOrder/view'
  },
  {
    id: BusinessType.TRANSFER,
    text: 'MESSAGE.transferOrder',
    routerLink: '/amz-web/warehouse/transferringOrder',
    permission: '/warehouse/transferringOrder/view'
  },
  {
    id: BusinessType.FINANCE,
    text: 'MESSAGE.paymentRequestOrder',
    routerLink: '/amz-web/finance/paymentOrder',
    permission: '/finance/paymentOrder/view'
  },
  {
    id: BusinessType.DELIVERY,
    text: 'MESSAGE.deliveryOrder',
    routerLink: '/amz-web/purchase/deliveryOrder',
    permission: '/purchase/deliveryOrder/view'
  },
  {
    id: BusinessType.INVOICE,
    text: 'MESSAGE.shippingOrder',
    routerLink: '/amz-web/logistics/logisticsBill',
    permission: '/logistics/logisticsBill/view'
  },
  {
    id: BusinessType.QC,
    text: 'MESSAGE.qualityInspectionOrder',
    routerLink: '/amz-web/warehouse/qualityOrder',
    permission: '/warehouse/qualityOrder/view'
  },
];

export function transFormMap(options, key = 'id') {
  const obj = {};
  if (options && options.length) {
    for (const item of options) {
      obj[item[key]] = item;
    }
    return obj;
  } else {
    return {};
  }
}
