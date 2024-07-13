import dayjs from "dayjs";

/**
 * 新页面跳转
 * @param {Stying} url
 * @returns
 */
export function openHelp(url) {
  if (!url) return;
  window.open(url);
}

/**
 * 获取search参数name
 * @param {Stying} itemType
 * @param {Stying} fuzzyType
 * @returns
 */
export function getSearchName(itemType, fuzzyType) {
  let searchName = "productNameExactSearch";
  if (itemType === "productName") {
    searchName = fuzzyType
      ? "productNameExactSearch"
      : "productNameFuzzySearch";
  } else if (itemType === "productId") {
    searchName = fuzzyType ? "productIdExactSearch" : "productIdFuzzySearch";
  } else if (itemType === "msku") {
    searchName = fuzzyType ? "mskuExactSearch" : "mskuFuzzySearch";
  } else if (itemType === "buyerAccountId") {
    searchName = fuzzyType
      ? "buyerAccountIdExactSearch"
      : "buyerAccountIdFuzzySearch";
  } else if (itemType === "buyerAccountEmail") {
    searchName = fuzzyType
      ? "buyerAccountEmailExactSearch"
      : "buyerAccountEmailFuzzySearch";
  }
  return searchName;
}
/**
 * 获取so状态颜色
 * @param {Stying} status 状态值
 * @returns
 */
const soOrangeList = ["PENDING", "STAY_CONFIRM"];
const soGreenList = ["CHECKED", "ALREADY_DELIVERY"];
const soRedList = ["DELETE"];
const soBlueList = [
  "SAVE",
  "NOTICE_DISTRIBUTION",
  "SHIPPING",
  "PARTIAL_DELIVERY",
  "SHIPPED",
];
export function getSoStatus(status) {
  let res = "";
  if (soOrangeList.indexOf(status) > -1) {
    res = "warning";
  } else if (soGreenList.indexOf(status) > -1) {
    res = "success";
  } else if (soRedList.indexOf(status) > -1) {
    res = "danger";
  } else if (soBlueList.indexOf(status) > -1) {
    res = "processing";
  } else {
    res = "normal";
  }
  return res;
}

/**
 * 获取so颜色
 * @param {Stying} status 状态值
 * @returns
 */
const soOrangeTagList = ["PENDING", "STAY_CONFIRM"];
const soGreenTagList = ["CHECKED", "ALREADY_DELIVERY"];
const soRedTagList = ["DELETE"];
const soBlueTagList = [
  "SAVE",
  "NOTICE_DISTRIBUTION",
  "SHIPPING",
  "PARTIAL_DELIVERY",
  "SHIPPED",
];
export function getSoTagStatus(status) {
  let res = "gray";
  if (soOrangeTagList.indexOf(status) > -1) {
    res = "orangered";
  } else if (soGreenTagList.indexOf(status) > -1) {
    res = "green";
  } else if (soRedTagList.indexOf(status) > -1) {
    res = "red";
  } else if (soBlueTagList.indexOf(status) > -1) {
    res = "arcoblue";
  }
  return res;
}

/**
 * 获取速卖通平台状态颜色
 * @param {Stying} status 状态值
 * @returns
 */
const aliPlatOrangeList = [
  "PLACE_ORDER_SUCCESS",
  "WAIT_SELLER_SEND_GOODS",
  "WAIT_SELLER_EXAMINE_MONEY",
];
const aliPlatRedList = ["IN_CANCEL", "IN_ISSUE", "IN_FROZEN", "RISK_CONTROL"];
const aliPlatBlueList = [
  "SELLER_PART_SEND_GOODS",
  "FUND_PROCESSING",
  "PAYMENT_PROCESSING",
];
export function getAliPlatColor(status) {
  let res = "gray";
  if (aliPlatOrangeList.indexOf(status) > -1) {
    res = "orangered";
  } else if (aliPlatRedList.indexOf(status) > -1) {
    res = "red";
  } else if (aliPlatBlueList.indexOf(status) > -1) {
    res = "arcoblue";
  }
  return res;
}

/**
 * 获取ebay平台状态颜色
 * @param {Stying} status 状态值
 * @returns
 */
const ebayPlatOrangeList = ["ACTIVE", "DEFAULT", "CANCEL_PENDING"];
const ebayPlatGreenList = ["COMPLETED", "SHIPPED", "AUTHENTICATED"];
const ebayPlatBlueList = ["ALL", "IN_PROCESS"];
export function getEbayPlatColor(status) {
  let res = "gray";
  if (ebayPlatOrangeList.indexOf(status) > -1) {
    res = "orangered";
  } else if (ebayPlatGreenList.indexOf(status) > -1) {
    res = "green";
  } else if (ebayPlatBlueList.indexOf(status) > -1) {
    res = "arcoblue";
  }
  return res;
}

/**
 * 获取lazada平台状态颜色
 * @param {Stying} status 状态值
 * @returns
 */
const lazadaPlatOrangeList = [
  "unpaid",
  "pending",
  "packed",
  "ready_to_ship_pending",
  "read_to_ship",
  "damaged_by_3pl",
  "lost_by_3pl",
  "returned",
  "canceled",
  "failed_delivery",
];
const lazadaPlatGreenList = ["delivered"];
const lazadaPlatRedList = ["repacked"];
const lazadaPlatBlueList = ["shipped"];
export function getLazadaPlatColor(status) {
  let res = "gray";
  if (lazadaPlatOrangeList.indexOf(status) > -1) {
    res = "orangered";
  } else if (lazadaPlatGreenList.indexOf(status) > -1) {
    res = "green";
  } else if (lazadaPlatRedList.indexOf(status) > -1) {
    res = "red";
  } else if (lazadaPlatBlueList.indexOf(status) > -1) {
    res = "arcoblue";
  }
  return res;
}

/**
 * 获取shopee平台状态颜色
 * @param {Stying} status 状态值
 * @returns
 */
const shopeePlatOrangeList = [
  "UNPAID",
  "READY_TO_SHIP",
  "PROCESSED",
  "RETRY_SHIP",
  "IN_CANCEL",
  "TO_RETURN",
];
const shopeePlatGreenList = ["COMPLETED"];
const shopeePlatBlueList = ["SHIPPED", "TO_CONFIRM_RECEIVE", "CANCELLED"];
export function getShopeePlatColor(status) {
  let res = "gray";
  if (shopeePlatOrangeList.indexOf(status) > -1) {
    res = "orangered";
  } else if (shopeePlatGreenList.indexOf(status) > -1) {
    res = "green";
  } else if (shopeePlatBlueList.indexOf(status) > -1) {
    res = "arcoblue";
  }
  return res;
}

/**
 * 获取shopify平台状态颜色
 * @param {Stying} status 状态值
 * @returns
 */
const shopifyPlatOrangeList = ["partial"];
const shopifyPlatGreenList = ["fulfilled"];
const shopifyPlatRedList = ["not_eligible"];
export function getShopifyPlatColor(status) {
  let res = "gray";
  if (shopifyPlatOrangeList.indexOf(status) > -1) {
    res = "orangered";
  } else if (shopifyPlatGreenList.indexOf(status) > -1) {
    res = "green";
  } else if (shopifyPlatRedList.indexOf(status) > -1) {
    res = "red";
  }
  return res;
}

/**
 * UTC时间转为北京时间
 * @param {String} time 时间
 * @returns
 */
export function utcTimeToBj(time) {
  let result = "-";
  if (time) {
    // 处理utc时间为时间戳
    let timesTamp = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    timesTamp = new Date(Date.parse(time));
    timesTamp = timesTamp.getTime();
    // 处理成北京时间，多8时区
    let bjTime = timesTamp + 8 * 60 * 60 * 1000;
    result = dayjs(bjTime).format("YYYY-MM-DD HH:mm:ss");
  }
  return result;
}
