export const handlerFunctions = (res, rowValue) => {
  const list = res.data || [];
  const result = [];
  let itemObj = null;
  let dkrColumns = [];
  let recommendPriceUnit = "";
  list.forEach((item, index) => {
    recommendPriceUnit = recommendPriceUnit || item.recommendPriceUnit;
    itemObj = { ...item, id: item.id || index };
    item.skuAttrs?.forEach((it) => {
      itemObj[it.attrName] = it.attrValue;
    });
    result.push(itemObj);
  });
  dkrColumns = list
    .map((item) => item.skuAttrs?.map((it) => it.attrName))
    .flat(1);
  dkrColumns = [...dkrColumns];
  dkrColumns = dkrColumns.map((item) => ({
    title: item,
    dataIndex: item,
    minWidth: 120,
  }));
  dkrColumns = dkrColumns.concat(
    rowValue.map((item) => ({
      ...item,
      title:
        item.showRecommendPriceUnit && recommendPriceUnit
          ? `${item.title}(${recommendPriceUnit})`
          : item.title,
    }))
  );

  return {
    tableList: { total: result.length, tableData: result },
    variantListColumns: [...unique(dkrColumns)],
  };
};

// 过滤数据，去重
const unique = (val) => {
  return val.reduce((prev, cur) => {
    let temp = prev.map((i) => i.dataIndex);
    return temp.includes(cur.dataIndex) ? prev : [...prev, cur];
  }, []);
};
// 处理tags
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
