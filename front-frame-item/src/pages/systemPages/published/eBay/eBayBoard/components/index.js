import store from "@/store";

const formData = {
  basicInfo: [
    {
      type: "input",
      label: "模版名称",
      placeholder: "请输入",
      prop: "name",
      maxLength: 100,
      field: true,
      showWordlimit: true,
    },
    {
      type: "shopIdSelect",
      label: "店铺",
      prop: "shopId",
      placeholder: "请选择店铺",
    },
    {
      type: "siteIdSelect",
      label: "站点",
      prop: "siteId",
      field: true,
      placeholder: "请选择站点",
    },
  ],
  salesInfo: [
    {
      type: "radio",
      label: "销售类型",
      prop: "listingType",
      isWarp: false,
      children: [
        { label: "固定价", value: "FixedPriceItem" },
        { label: "拍卖", value: "Chinese" },
      ],
    },
    {
      type: "switch",
      label: "私人购买",
      isWarp: false,
      prop: "privateListingEnable",
      children: [{ label: "允许买家匿名购买" }],
    },
    {
      type: "select",
      label: "刊登天数",
      isWarp: false,
      field: true,
      prop: "listingDuration",
    },
    {
      type: "selectInput",
      label: "价格",
      isWarp: true,
      placeholder: "请选择 ",
      prop: "priceCalculateType",
      inputValue: "priceCalculateValue",
      btnTxt: "priceUnit",
      children: [
        {
          platformName: "建议售价",
          platformCode: "建议售价",
          salesTaxRateInput: false,
        },
        {
          platformName: "建议售价+",
          platformCode: "建议售价+",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价-",
          platformCode: "建议售价-",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价*",
          platformCode: "dScribingPrice",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价÷",
          platformCode: "dScribingPrice",
          salesTaxRateInput: true,
        },
      ],
    },
    {
      type: "selectInput",
      label: "划线价",
      isWarp: true,
      placeholder: "请选择 ",
      prop: "linePriceCalculateType",
      inputValue: "linePriceCalculateValue",
      btnTxt: "priceUnit",
      children: [
        {
          platformName: "建议售价",
          platformCode: "建议售价",
          salesTaxRateInput: false,
        },
        {
          platformName: "建议售价+",
          platformCode: "建议售价+",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价-",
          platformCode: "建议售价-",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价*",
          platformCode: "dScribingPrice",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价÷",
          platformCode: "dScribingPrice",
          salesTaxRateInput: true,
        },
      ],
      scribingPriceinput: true,
    },
    {
      type: "selectInput",
      label: "起拍价",
      isWarp: true,
      field: true,
      placeholder: "请选择 ",
      prop: "startPriceCalculateType",
      inputValue: "startPriceCalculateValue",
      btnTxt: "priceUnit",
      children: [
        {
          platformName: "建议售价",
          platformCode: "建议售价",
          salesTaxRateInput: false,
        },
        {
          platformName: "建议售价+",
          platformCode: "建议售价+",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价-",
          platformCode: "建议售价-",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价*",
          platformCode: "建议售价*",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价÷",
          platformCode: "建议售价÷",
          salesTaxRateInput: true,
        },
      ],
      scribingPriceinput: true,
    },
    {
      type: "selectInput",
      label: "保底价",
      isWarp: true,
      placeholder: "请选择 ",
      prop: "reservePriceCalculateType",
      inputValue: "reservePriceCalculateValue",
      btnTxt: "priceUnit",
      children: [
        {
          platformName: "建议售价",
          platformCode: "建议售价",
          salesTaxRateInput: false,
        },
        {
          platformName: "建议售价+",
          platformCode: "建议售价+",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价-",
          platformCode: "建议售价-",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价*",
          platformCode: "建议售价*",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价÷",
          platformCode: "建议售价÷",
          salesTaxRateInput: true,
        },
      ],
    },
    {
      type: "selectInput",
      label: "一口价",
      isWarp: true,
      placeholder: "请选择 ",
      prop: "buyItNowPriceCalculateType",
      inputValue: "buyItNowPriceCalculateValue",
      btnTxt: "priceUnit",
      children: [
        {
          platformName: "建议售价",
          platformCode: "建议售价",
          salesTaxRateInput: false,
        },
        {
          platformName: "建议售价+",
          platformCode: "建议售价+",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价-",
          platformCode: "建议售价-",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价*",
          platformCode: "建议售价*",
          salesTaxRateInput: true,
        },
        {
          platformName: "建议售价÷",
          platformCode: "建议售价÷",
          salesTaxRateInput: true,
        },
      ],
    },
    {
      type: "inputNum",
      label: "库存",
      prop: "quantity",
      field: true,
      placeholder: "请输入",
    },
    {
      type: "salesSwitch",
      label: "批量销售",
      isWarp: false,
      prop: "lotSizeCheckbox",
      children: [{ label: "已关闭" }],
    },

    {
      type: "inputLotSize",
      label: "批发数量",
      prop: "lotSize",
      field: false,
      placeholder: "请输入",
    },
    {
      type: "selectInputCheckbox",
      label: "销售税率",
      isWarp: false,
      prop: "taxJurisdiction",
      inputValue: "salesTaxPercent",
      placeholder: "请选择",
      btnTxt: "%",
    },
    {
      type: "salesSwitch",
      label: "运费包含销售税",
      isWarp: false,
      prop: "shippingIncludedInTax",
      children: [{ label: "已关闭" }],
    },
    {
      type: "inputBox",
      label: "VAT税率",
      isWarp: false,
      prop: "vatTaxPercent",
      placeholder: "请输入",
      btnTxt: "%",
    },
    {
      type: "switchInput",
      acceptlabel: "接受议价",
      isWarp: false,
      prop: "bestOfferEnabled",
      acceptPrice: {
        label: "自动接受价格",
        type: "input",
        value: 1,
        propSwitch: "autoAcceptPriceEnabled",
        autoPrice: "autoAcceptPrice",
        prop: "bestOfferAutoAcceptPrice",
        placeholder: "请输入",
        inputValue: "bestOfferAutoAcceptType",
        btnTxt: "priceUnit",
        children: [
          {
            platformName: "建议售价",
            platformCode: "建议售价",
            salesTaxRateInput: false,
          },
          {
            platformName: "建议售价+",
            platformCode: "建议售价+",
            salesTaxRateInput: true,
          },
          {
            platformName: "建议售价-",
            platformCode: "建议售价-",
            salesTaxRateInput: true,
          },
          {
            platformName: "建议售价*",
            platformCode: "建议售价*",
            salesTaxRateInput: true,
          },
          {
            platformName: "建议售价÷",
            platformCode: "建议售价÷",
            salesTaxRateInput: true,
          },
        ],
      },
      refusePrice: {
        label: "自动拒绝价格",
        type: "input",
        value: 2,
        autoPrice: "offerPrice",
        propSwitch: "offerPriceEnabled",
        prop: "minimumBestOfferPrice",
        placeholder: "请输入",
        inputValue: "minimumBestOfferType",
        btnTxt: "priceUnit",
        children: [
          {
            platformName: "建议售价",
            platformCode: "建议售价",
            salesTaxRateInput: false,
          },
          {
            platformName: "建议售价+",
            platformCode: "建议售价+",
            salesTaxRateInput: true,
          },
          {
            platformName: "建议售价-",
            platformCode: "建议售价-",
            salesTaxRateInput: true,
          },
          {
            platformName: "建议售价*",
            platformCode: "建议售价*",
            salesTaxRateInput: true,
          },
          {
            platformName: "建议售价÷",
            platformCode: "建议售价÷",
            salesTaxRateInput: true,
          },
        ],
      },
    },
  ],
  logisticsPolicy: {
    formData: [
      {
        label: "国内运输",
        prop: "domesticShippingMethods",
        isIntl: false,
        children: [
          {
            type: "select",
            label: "处理时间:",
            placeHolder: "请选择",
            field: true,
            isWarp: true,
            prop: "domesticDispatchTime",
          },
          {
            type: "select",
            label: "运输类型:",
            placeHolder: "请选择",
            field: true,
            isWarp: true,
            prop: "domesticShippingType",
          },
          {
            type: "elInput",
            label: "处理费用:",
            placeHolder: "请输入",
            prop: "domesticDispatchCost",
            companyProp: "domesticDispatchCostUnit",
            ishide: true,
          },
          {
            type: "switch",
            label: "使用运费表",
            isWarp: true,
            prop: "domesticRateTableEnable",
          },
          {
            type: "freightTable",
            label: "运费表",
            isWarp: false,
            placeHolder: "请选择",
            children: [{ label: "使用运费表", value: 0 }],
            prop: "domesticRateTableEnable",
            selectProp: "domesticRateTable",
            shippingType: "DOMESTIC",
            btnTxt: "同步店铺运费表",
            identification: "domestic",
          },
          {
            type: "table",
            prop: "domesticRateTableEnable",
            selectProp: "domesticRateTable",
            btnTxt: "同步店铺表",
            identification: "domestic",
            modeOfTransport: "添加运输方式",
            tableHeadData: [
              {
                title: "国内运输方式",
                key: "domesticShippingMethod",
                dataIndex: "shippingMethod",
              },
              {
                title: "运费",
                key: "domesticShippingCost",
                dataIndex: "shippingCost",
                unitProp: "shippingCostUnit",
              },
              {
                title: "每件加收",
                dataIndex: "shippingAdditionalCost",
                key: "domesticShippingAdditionalCost",
                unitProp: "shippingAdditionalCostUnit",
              },
              {
                title: "免运费",
                dataIndex: "freeShipping",
                key: "domesticFreeShipping",
              },
              { title: "操作", dataIndex: "action" },
            ],
          },
        ],
      },
      {
        label: "国际运输",
        prop: "internationalShippingMethods",
        isIntl: true,
        children: [
          {
            type: "select",
            label: "运输类型:",
            isWarp: true,
            placeHolder: "请选择",
            prop: "internationalShippingType",
          },
          {
            type: "elInput",
            label: "处理费用:",
            placeHolder: "请输入",
            prop: "internationalDispatchCost",
            companyProp: "internationalDispatchCostUnit",
            ishide: true,
          },
          {
            type: "switch",
            label: "使用运费表",
            isWarp: true,
            prop: "internationalRateTableEnable",
          },
          {
            type: "freightTable",
            label: "运费表",
            placeHolder: "请选择",
            isWarp: false,
            children: [{ label: "使用运费表" }],
            shippingType: "INTERNATIONAL",
            prop: "internationalRateTableEnable",
            selectProp: "internationalRateTable",
            btnTxt: "同步店铺运费表",
            identification: "international",
          },
          {
            type: "table",
            prop: "internationalRateTableEnable",
            identification: "international",
            modeOfTransport: "添加运输方式",
            tableHeadData: [
              {
                title: "国际运输方式",
                key: "internaShippingMethod",
                dataIndex: "shippingMethod",
              },
              {
                title: "配送地区",
                dataIndex: "shippingLocations",
                key: "internaShippingLocations",
                width: 250,
              },
              {
                title: "运费",
                dataIndex: "shippingCost",
                unitProp: "shippingCostUnit",
                key: "internaShippingCostUnit",
              },
              {
                title: "每件加收",
                dataIndex: "shippingAdditionalCost",
                unitProp: "shippingAdditionalCostUnit",
                key: "internaShippingAdditionalCostUnit",
              },
              {
                title: "免运费",
                dataIndex: "freeShipping",
                key: "internaFreeShipping",
              },
              { title: "操作", dataIndex: "action" },
            ],
          },
        ],
      },
    ],
    formData1: [
      {
        label: "不运送地区",
        type: "radio",
        prop: "excludeLocationEnable",
        children: [
          { label: "运送至所有国家", value: false },
          { label: "选择不运送地区", value: true },
        ],
        btnTxt: "选择不运送地区",
        titleTxt: "已选择",
      },
    ],
  },
  paymentPolicy: [
    {
      type: "checkbox",
      label: "立即付款",
      prop: "autoPay",
    },
    { type: "textarea", label: "付款说明", prop: "payDescription" },
  ],
  returnPolicy: [
    {
      label: "国内退货",
      type: "title",
      prop: "domestic",
      children: [
        {
          type: "switch",
          label: "国内退货政策",
          prop: "domesticReturnEnable",
          btnTxt: "允许退货",
        },
        {
          type: "select",
          label: "退货天数",
          placeHolder: "请选择",
          prop: "domesticReturnTime",
          options: "returnsDurationValues",
        },
        {
          type: "select",
          label: "退款方式",
          placeHolder: "请选择",
          prop: "domesticReturnType",
          options: "refundMethod",
        },
        {
          type: "select",
          label: "退货运费由谁承担",
          prop: "domesticReturnCostBy",
          options: "shipmentPayeeValues",
        },
      ],
    },
    {
      label: "国际退货",
      type: "title",
      prop: "international",
      children: [
        {
          type: "switch",
          label: "国际退货政策",
          prop: "internationalReturnEnable",
          btnTxt: "允许退货",
        },
        {
          type: "select",
          label: "退货天数",
          placeHolder: "请选择",
          prop: "internationalReturnTime",
          options: "returnsDurationValues",
        },
        {
          type: "select",
          label: "退款方式",
          placeHolder: "请选择",
          prop: "internationalReturnType",
          options: "refundMethod",
        },
        {
          type: "select",
          label: "退货运费由谁承担",
          prop: "internationalReturnCostBy",
          options: "shipmentPayeeValues",
        },
      ],
    },
    { label: "退货政策说明:", type: "textarea", prop: "returnDescription" },
  ],
  buyerRequirements: [
    {
      type: "radio",
      label: "买家要求",
      prop: "disableBuyerRequirements",
      children: [
        { label: "允许所有买家购买我的物品", value: true },
        { label: "不允许以下买家购买我的物品", value: false },
      ],
    },
  ],
  locationOfGoods: [
    {
      type: "select",
      label: "物品所在国家",
      prop: "country",
      propChange: "getCountryOption",
      placehodler: "请选择",
    },
    {
      type: "input",
      label: "物品所在邮编",
      placehodler: "请输入",
      prop: "postalCode",
    },
    {
      type: "input",
      label: "物品所在地址",
      placehodler: "请输入",
      prop: "location",
    },
  ],
  compatibilityInfo: [
    { type: "button", label: "添加兼容信息", prop: "addCompatibilityInfo" },
    { type: "button", label: "从eBay导入", prop: "importFromEBay" },
  ],
};
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
  formData,
  addModuleData,
  editFormData,
  clearStoreData,
  formatTime,
  getSiteCnNames,
  getShopIds,
  getCategoryId,
  useChangeList,
};
