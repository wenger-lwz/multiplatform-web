/**
 *
 * @param {*} proxy 页面ref
 * @param {*} respData 接口返回需要回显在页面的数据
 * @param {*} excludeRefArr 需要排除的ref集合
 */
export const useRefSetData = (proxy, respData, excludeRefArr = []) => {
  const formList = proxy.$refs;
  Object.keys(formList).forEach((key) => {
    if (!excludeRefArr.includes(key)) {
      const targetRef = formList[key];
      const fn = targetRef?.setPageData;
      fn && fn(respData);
    }
  });
};

/**
 *
 * @param {*} value 用户输入的值
 * @returns 布尔值
 */
export const useCheckIsEmpty = (value) => {
  return value || value === 0 ? false : true;
};

export const useChangeList = (target, source) => {
  let result = [];
  if (Array.isArray(target)) {
    result = target.filter((item) => item.showValue?.length > 0);
  } else {
    const index = source.findIndex((item) => item.id === target.id);
    result = [...source];
    const { showName, showValue } = target;
    if (index >= 0) {
      if (!showValue || showValue.length <= 0) {
        result.splice(index, 1);
      } else {
        result[index].showName = showName;
        result[index].showValue = showValue;
      }
    } else if (showValue.length > 0) {
      result.push(target);
    }
  }
  return result;
};
