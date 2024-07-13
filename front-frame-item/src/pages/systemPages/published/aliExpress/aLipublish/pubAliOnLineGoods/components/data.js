// item下拉
export const titleListOpt = [
  { value: 1, label: "标题" },
  { value: 2, label: "SKU" },
  { value: 3, label: "店铺SKU" },
  { value: 4, label: "itemID" },
];

// 时间下拉框
export const timeOpt = [
  { value: 1, label: "创建时间" },
  { value: 2, label: "更新时间" },
];

// 规格
export const specificationList = [
  { value: 1, label: "单品" },
  { value: 2, label: "变体" },
];

// 状态
export const updateStateList = [
  { value: 1, label: "正常" },
  { value: 2, label: "暂存未更新" },
  { value: 3, label: "更新失败" },
];

//变体表格
export const variantColumnList = [
  {
    title: "店铺sku",
    dataIndex: "msku",
    width: 100,
  },
  {
    title: "库存",
    dataIndex: "quantity",
    width: 80,
  },
  {
    title: "售价",
    dataIndex: "recommendPrice",
    width: 100,
  },
];

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

export const getLabel = (list, value) => {
  return list.find((item) => item.value === value)?.label || "";
};
