import store from "@/store";

const addModuleData = {
  type: "checkbox",
  label: "添加模块",
  prop: "addModuleData",
  children: [
    {
      label: "物流政策",
      value: "eBay.logisticsPolicy",
      valueId: "shippingEnable",
    },
    {
      label: "付款政策",
      value: "eBay.paymentPolicy",
      valueId: "paymentEnable",
    },
    { label: "退货政策", value: "eBay.returnPolicy", valueId: "returnEnable" },
    {
      label: "买家要求",
      value: "eBay.buyerRequirements",
      valueId: "buyerEnable",
    },
    {
      label: "物品所在地",
      value: "eBay.locationOfGoods",
      valueId: "locationEnable",
    },
  ],
};

const editFormData = (row) => {
  let list = { ...row };
  const editForm =
    store?.getters?.getdynamicProperties?.templateParams?.eaditCell;
  if (editForm) {
    Object.keys(list).forEach((key) => {
      if (Object.keys(list).includes(key)) {
        list[key] = editForm[key];
      }
    });
    return list;
  }
  return false;
};

const clearStoreData = () => {
  const templateParams = store.getters.getdynamicProperties.templateParams;
  if (templateParams.eaditCell) {
    delete store.getters.getdynamicProperties.templateParams.eaditCell;
  }
};

const add0 = (m) => {
  return m < 10 ? "0" + m : m;
};

// 格式化时间戳
const formatTime = (t) => {
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
};
const getSiteCnNames = () => {
  return store?.getters?.getdynamicProperties?.templateParams?.siteList || {};
};

const getShopIds = () => {
  return store?.getters?.getdynamicProperties?.templateParams?.shopId || "";
};
const getCategoryId = () => {
  return (
    store?.getters?.getdynamicProperties?.templateParams
      ?.compatibilityTemplateType || "0"
  );
};

const useChangeList = (target, source) => {
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

export {
  addModuleData,
  editFormData,
  clearStoreData,
  formatTime,
  getSiteCnNames,
  getShopIds,
  getCategoryId,
  useChangeList,
};
