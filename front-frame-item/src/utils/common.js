import store from "@/store";
import { GjMessage } from "@gj/atom";
import html2canvas from "html2canvas";
import { uploadCoverImage } from "@/api/fileUpload";
import { setDesPreview } from "@api/published/ebay";

/**
 * 防抖函数
 * @param {Function} fn 需要防抖处理的函数
 * @param {Number} delay 延迟执行毫秒数
 * @returns
 */
export function debounce(fn, delay) {
  let timer = null; //借助闭包
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} func 需要节流处理的函数
 * @param {Number} wait 延迟执行毫秒数
 * @returns
 */
export function throttle(func, wait) {
  let timeout = null;
  return function (...args) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(this, args);
      }, wait);
    }
  };
}

/**
 * 替换翻译的模板字符串
 * @text {String} 需要替换的文本
 * @replaceKV {Object} 需要替换的模板和模板值
 * example: replaceAllText(`今天盈利了${monery}`, {monery: ${monery}})
 **/
export function replaceAllText(text = "", replaceKV = {}) {
  let textTemp = text;
  for (const key in replaceKV) {
    textTemp = text.replace(key, replaceKV[key]);
  }
  return textTemp;
}

/**
 * 获取地址栏参数
 * @return {}
 */
export function getQueryPrams() {
  const query = window.location.search;
  if (!query) {
    return {};
  } else {
    const temp = query.replace("?", "").split("&");
    const result = {};
    temp.forEach((item) => {
      const keyValue = item.split("=");
      result[keyValue[0]] = keyValue[1];
    });
    return result;
  }
}

/**
 * 笛卡尔积生成动态table的算法
 * @return []
 * @array []
 */
export function calcDescartes(array = []) {
  console.log("笛卡尔参数", array);
  if (array.length < 2) return array[0] || [];
  return array.reduce((total, currentValue) => {
    let res = [];
    total.forEach((t) => {
      currentValue.forEach((cv) => {
        if (t instanceof Array) {
          res.push([...t, cv]);
        } else {
          res.push([t, cv]);
        }
      });
    });
    return res;
  });
}

/***
 * 清空组合表达的store函数
 * @key store的key
 */
export function clearStore() {
  store.dispatch("PARAMS_QUERY", {});
}

/***
 * 复制功能
 */
export function copy(val) {
  let oInput = document.createElement("input");
  oInput.value = val;
  oInput.style.opacity = 0;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  document.execCommand("Copy"); // 执行浏览器复制命令
  GjMessage.success("复制成功");
  oInput.remove();
}

/***
 * 动态获取表格高度
 */
export function setScroll() {
  const bodyHeight = document.body.clientHeight - 90;
  const layoutHeader =
    document.getElementById("layoutHeader")?.clientHeight || 0;
  let tableHeight = 550; //表格默认高度
  return {
    x: 1100,
    y:
      bodyHeight - layoutHeader > tableHeight
        ? tableHeight
        : bodyHeight - layoutHeader,
  };
}

export const validateTriggerOpt = ["change", "input", "blur"];

function add0(m) {
  return m < 10 ? "0" + m : m;
}

// 格式化时间戳
export function formatTime(t) {
  let time = new Date(t),
    y = time.getFullYear(),
    m = time.getMonth() + 1,
    d = time.getDate(),
    h = time.getHours(),
    mm = time.getMinutes(),
    s = time.getSeconds();

  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
}

/**
 *
 * @param {string} str 需要转换成Number的字符串数字
 * @returns number | null
 */
export const tranStrToNumber = (str) => {
  const num = Number.parseFloat(str);
  return Number.isNaN(num) ? null : num;
};

/**
 * 生成唯一key
 * @returns {String} 唯一key
 */
export function createUuid() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf("/") + 1);
}
/**
 * base64转二进制流
 * * @param {String} dataurl base64URL
 * @returns {Blob} 二进制Blob对象
 */
export const toBlob = (dataurl) => {
  const arr = dataurl.split(",");
  const arrb = arr[1].substring(0, arr[1].length - 2);
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arrb);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime,
  });
};
/**
 * 生成富文本缩略图
 * * @param {element} el DOM元素
 * @returns {Promise} Promise
 */
export function createThumbnail(el) {
  return new Promise((resolve, reject) => {
    html2canvas(el, {
      width: el.offsetWidth,
      heigth: el.offsetHeight,
      useCORS: true, //是否使用CORS从服务器加载图像 !!!
      allowTaint: true, //是否允许跨域图像污染画布  !!!
    })
      .then((canvas) => {
        var url = canvas.toDataURL(); //这里上面不设值cors会报错
        uploadCoverImage({
          file: toBlob(url),
        })
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}

/**
 * 生成富文本缩略图
 * * @param {element} el DOM元素
 * @returns {Promise} Promise
 */
export function createThumbnailEbay(el) {
  return new Promise((resolve, reject) => {
    html2canvas(el, {
      width: el.offsetWidth,
      heigth: el.offsetHeight,
      useCORS: true, //是否使用CORS从服务器加载图像 !!!
      allowTaint: true, //是否允许跨域图像污染画布  !!!
    })
      .then((canvas) => {
        var url = canvas.toDataURL(); //这里上面不设值cors会报错
        setDesPreview({
          file: toBlob(url),
        })
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}

// 401 或者退出登录的方法
export const distoryLogin = () => {
  localStorage.clear();
  sessionStorage.clear();
  store.dispatch("USER_INFO", JSON.stringify({}));
};
