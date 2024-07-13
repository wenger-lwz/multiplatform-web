import i18n from "@/i18n";
import _ from "lodash";
import dayjs from "dayjs";

/**
 * 判断对象是否有意义 map对象和数组 不能使用
 * @param {string} object
 * @example
 * let a = null
 * isMeaningful(a) = false
 */
export const isMeaningful = (object) => {
  return object !== null && object !== undefined && object !== "";
};

/**
 * 文件大小计算
 * @param {number} size  - 文件字节数
 * @returns {string} 返回文件b kb mb进制
 */
export const getFileSize = (size) => {
  if (size < 1024) {
    return size + "B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1048576).toFixed(2) + "MB";
  }
};
const formatNum = (num) => (num < 10 ? `0${num}` : num);
export const getDuration = (duration) => {
  const h = Math.floor(duration / 3600);
  const m = Math.floor((duration % 3600) / 60);
  const s = Math.ceil(duration % 60);
  if (duration < 60) {
    return `${formatNum(s)}s`;
  } else if (duration < 3600) {
    return `${formatNum(m)}m${formatNum(s)}s`;
  } else {
    return `${formatNum(h)}h${formatNum(m)}m${formatNum(s)}s`;
  }
};

// 过滤数组中的某个值
export const filterText = (val, arr, options) => {
  const defaultOptions = { labelKey: "label", valueKey: "value" };
  options = Object.assign({}, defaultOptions, options);
  const instance = arr.find((v) => v[options.valueKey] === val);
  return instance ? instance[options.labelKey] : "-";
};

// 格式化数字千分位展示
export const formatNumThou = (val) => {
  if (!isMeaningful(val)) return "-";
  val = String(val);
  const s = val.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
    return s + ",";
  });
  return s;
};

// 格式化金额
export const formatAmt = (val, syb) => {
  if (!isMeaningful(val)) return "-";
  val = String(val);
  const getFormatFloat = (v) => {
    if (!v) return "00";
    v = String(v).substring(0, 2);
    return v.length === 1 ? `${v}0` : v;
  };
  const getFormatAmt = (v) => {
    const f = v.split(".");
    return `${syb || ""}${formatNumThou(f[0])}.${getFormatFloat(f[1])}`;
  };
  return getFormatAmt(val);
};

/**
 * 将多选项的value转成label 如 [1,2,3] => ['店铺1','店铺2','店铺3']
 *
 * @param arr1 勾选多选下拉框的绑定数组
 * @param arr2 对比数组
 * @param key1 需对比属性值，默认是value
 * @param key2 需获取属性值，默认是label
 */

export const convertSelectedValue = (
  arr1,
  arr2,
  key1 = "value",
  key2 = "label"
) => {
  let arr = null;
  if (_.isString(arr1)) {
    arr = "";
    arr2.forEach((o) => {
      if (arr1 === o[key1]) {
        arr = o[key2];
      }
    });
    return arr;
  } else if (Array.isArray(arr1)) {
    arr = [];
    arr1.forEach((item) => {
      arr2.forEach((o) => {
        if (item === o[key1]) {
          arr.push(o[key2]);
        }
      });
    });
    return arr;
  }
};

export const translate = (key) => {
  return i18n.global?.t(key) || key;
};

export const emptyValue = "-";
export const emptyFilter = (filterData) => {
  return filterData || filterData === 0 ? filterData : emptyValue;
};

export const formatDateTime = (
  dateTime,
  format = "YYYY-MM-DD HH:mm:ss",
  empty = emptyValue
) => {
  if (dateTime) {
    return dayjs(dateTime).format(format);
  } else {
    return empty;
  }
};
// 结束时间11:59:59s
export const TIME_TO_TOMORROW = 24 * 60 * 60 * 1000 - 1;

// tag筛选的多选时设置显示项数 例子：us，us等4项
export const setSearchValue = (target, type) => {
  let Symbol = ",";
  if (Array.isArray(target) && target.length >= 4) {
    return `${target[0].trim()}${Symbol}${target[1].trim()}等${
      target.length
    }项`;
  } else if (type === "time" || type === "numericalValue") {
    Symbol = "~";
  }
  return Array.isArray(target)
    ? target
        .filter((item) => item && item.trim())
        .map((item) => item.trim())
        .join(Symbol)
    : target?.trim();
};

//下载文件
export const downFile = (content, filename, filteType = "xlsx") => {
  var ele = document.createElement("a");
  if (!(content instanceof Blob)) {
    content = new Blob([content]);
  }
  ele.style.display = "none";
  ele.href = URL.createObjectURL(content);
  ele.download = filename + "." + filteType; // 指定下载文件名
  // 绑定点击时间
  document.body.appendChild(ele);
  ele.click();
  document.body.removeChild(ele);
  window.URL.revokeObjectURL(content); // 释放掉blob对象
};

// 下载地址文件
export const downUrlFile = (content) => {
  var ele = document.createElement("a");
  ele.style.display = "none";
  ele.href = content;
  // 绑定点击时间
  document.body.appendChild(ele);
  ele.click();
  document.body.removeChild(ele);
  window.URL.revokeObjectURL(content); // 释放掉blob对象
};
