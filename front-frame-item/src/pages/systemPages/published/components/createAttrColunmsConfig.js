/***
 * 刊登 - 多属性生成table列的配置文件
 */
export const columnsAttr = {
  shopee: [
    /* {
      // 作用于value的绑定
      name: "concatSKU",
      // 要渲染的类型
      type: "btn",
      // （表头label）作用于语言切换，到时候需要配置成一个key
      label: "关联SKU",
      // 表格显示的内容
      text: "选择SKU",
      // 是否必填
      isReauired: false,
      // 是否有特殊header
      header: "",
      // 是否支持批量录入
      isBatchSet: false,
      // 批量录入的值
      value: "",
    }, */
    /* {
      name: "shopSKU",
      type: "input",
      label: "店铺SKU",
      text: "请输入店铺SKU",
      isReauired: true,
      header: "自动生成",
      // 是否支持批量录入
      isBatchSet: true,
      // 批量录入的值
      value: "",
    }, */
    {
      name: "price",
      type: "input-number",
      label: "请输入",
      title: "建议售价",
      dataIndex: "price",
      text: "请输入",
      isReauired: false,
      header: "",
      // 精度
      precision: 2,
      // 是否存在末尾单位
      isAppend: true,
      // 是否支持批量录入
      isBatchSet: true,
      // 批量录入的值
      value: "0",
    },
    {
      name: "isEnable",
      type: "switch",
      label: "启用",
      title: "启用",
      dataIndex: "isEnable",
      text: "",
      isReauired: false,
      header: "",
      // 精度
      precision: 2,
      // 是否存在末尾单位
      isAppend: true,
      // 是否支持批量录入
      isBatchSet: true,
      // 批量录入的值
      value: "",
    },
    /* {
      name: "count",
      type: "input-number",
      label: "数量",
      text: "请输入数量",
      isReauired: false,
      header: "",
      // 精度
      precision: 0,
      // 是否支持批量录入
      isBatchSet: true,
      // 批量录入的值
      value: "",
    }, */
  ],
  aliexpress: [
    {
      // 作用于value的绑定
      name: "concatSKU",
      // 要渲染的类型
      type: "btn",
      // （表头label）作用于语言切换，到时候需要配置成一个key
      label: "关联SKU",
      // 表格显示的内容
      text: "选择SKU",
      // 是否必填
      isReauired: true,
      // 是否有特殊header
      header: "",
      // 是否支持批量录入
      isBatchSet: false,
      // 批量录入的值
      value: "",
    },
    {
      name: "shopSKU",
      type: "input",
      label: "店铺SKU",
      text: "请输入店铺SKU",
      isReauired: true,
      header: "自动生成",
      // 是否支持批量录入
      isBatchSet: true,
      // 批量录入的值
      value: "",
    },
    {
      name: "price",
      type: "input-number",
      label: "售价",
      text: "请输入价格",
      isReauired: true,
      header: "",
      // 精度
      precision: 2,
      // 是否存在末尾单位
      isAppend: true,
      // 是否支持批量录入
      isBatchSet: true,
      // 批量录入的值
      value: "",
    },
    {
      name: "count",
      type: "input-number",
      label: "数量",
      text: "请输入数量",
      isReauired: true,
      header: "",
      // 精度
      precision: 0,
      // 是否支持批量录入
      isBatchSet: true,
      // 批量录入的值
      value: "",
    },
  ],
};
