/***
 * 本项目所有正则都写到这里
 */

export const reg = {
  // 除了http:// .com 的域名验证
  doMain: /^[A-Za-z0-9-]{1,58}$/,
  // shopName
  shopNameReg: /^\S+(\s+\S+)*$/,
  // 授权code码验证
  authorCode: /^[a-zA-Z0-9~!@#$%^&*()_+-|'".,/?=<>]{10,300}$/,
  // 电话号码，包含手机和固话
  phone: /^([1][3-9][0-9]{9})|([0-9]{2,6}[-][0-9]{1,9})$/,
  // 邮箱
  email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  // 金额
  money: /^([1-9]\d{0,15}|0)(\.\d{1,2})?$/,
  // date
  date: /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))\\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
  // html标签
  html: /<(?:[^"'>]|(["'])[^"']*\1)*>/g,
  // emoji
  emoji:
    /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g,
  // 5-10正整数
  integer5to10: /^([5-9]|10)$/,
};
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
