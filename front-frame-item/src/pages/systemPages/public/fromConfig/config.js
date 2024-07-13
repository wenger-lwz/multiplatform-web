import encoder from "./encoder";

const __config_list__ = [
  {
    type: "layout",
    name: "区域组",
    gutter: 10,
    placeholder: "这是一个区域组",
    permission: ["title", "placeholder"],
    drag: [
      {
        list: [],
      },
    ],
    svgClass: "groupIcon",
  },
  {
    type: "RichText",
    name: "富文本",
    size: "mini",
    width: "100%",
    permission: ["name", "placeholder", "value", "required"],
    value: "",
    disabled: false,
    labelWidth: "80px",
    placeholder: "这是一个富文本",
    required: false,
    rules: [{ required: true, message: "请输入...", trigger: "blur" }],
    svgClass: "groupIcon",
  },
  {
    type: "SingleLineText",
    name: "单行文本",
    size: "mini",
    width: "100%",
    permission: ["name", "placeholder", "value", "required", "limitNumber"],
    value: "",
    disabled: false,
    labelWidth: "80px",
    placeholder: "这是一个单行文本",
    rules: [{ required: true, message: "请输入...", trigger: "blur" }],
    required: false,
    limitNumber: false,
    min: 0,
    max: 0,
    svgClass: "textIcon",
  },
  {
    type: "MultiLineText",
    name: "多行文本",
    size: "mini",
    width: "100%",
    permission: ["name", "placeholder", "mulValue", "required", "limitNumber"],
    value: "",
    disabled: false,
    labelWidth: "80px",
    placeholder: "这是一个多行文本",
    required: false,
    limitNumber: false,
    min: 0,
    max: 0,
    rules: [],
    svgClass: "mulTextIcon",
  },
  {
    type: "Number",
    name: "数字",
    size: "mini",
    width: "100%",
    permission: [
      "name",
      "placeholder",
      "value",
      "required",
      "limitDot",
      "limitRange",
      "limitUnit",
      "tips",
    ],
    value: "",
    disabled: false,
    labelWidth: "80px",
    placeholder: "这是一个数字输入框",
    required: false,
    limitDotquality: undefined,
    limitDot: false,
    limitRange: false,
    min: 0,
    max: 0,
    limitUnit: false,
    limitUnits: "1",
    option: [
      { value: "1", label: "￥ 人民币", icon: "￥" },
      { value: "2", label: "＄ 美元", icon: "＄" },
      { value: "3", label: "€ 欧元", icon: "€" },
      { value: "4", label: "₩ 韩元", icon: "₩" },
      { value: "5", label: "円 日元", icon: "円" },
      { value: "6", label: "NT 新台币", icon: "NT" },
      { value: "7", label: "₹ 印度卢比", icon: "₹" },
      { value: "8", label: "₱ 菲律宾比索", icon: "₱" },
      { value: "9", label: "៛ 柬埔寨瑞尔", icon: "៛" },
      { value: "10", label: "₲ 巴拉圭瓜拉尼", icon: "₲" },
      { value: "11", label: "₭ 老挝基普", icon: "₭" },
      { value: "12", label: "kr 克朗", icon: "kr" },
      { value: "13", label: "Lm 马耳他里拉", icon: "Lm" },
      { value: "14", label: "₦ 尼日利亚奈拉", icon: "₦" },
      { value: "15", label: "Ft 匈牙利福林", icon: "Ft" },
      { value: "16", label: "P 博茨瓦纳普拉", icon: "P" },
      { value: "17", label: "Q 危地马拉格查尔", icon: "Q" },
      { value: "18", label: "R 南非兰特", icon: "R" },
      { value: "19", label: "all.SlovakKoruna", icon: "all.SlovakKoruna" },
      { value: "20", label: "Rp 印尼盾", icon: "Rp" },
      { value: "21", label: "৲৳ 卢比", icon: "৲৳" },
      { value: "22", label: "R$ 雷亚尔", icon: "R$" },
      { value: "23", label: "〒 哈萨克斯坦坚戈", icon: "〒" },
      { value: "24", label: "₮ 图格里克", icon: "₮" },
      { value: "25", label: "zł 波兰兹罗提", icon: "zł" },
      { value: "26", label: "₴ 赫里夫尼亚", icon: "₴" },
      { value: "27", label: "₪ 以色列新舍克", icon: "₪" },
      { value: "28", label: "﷼ 伊朗里亚尔", icon: "﷼" },
      { value: "29", label: "руб 俄罗斯卢比", icon: "руб" },
      { value: "30", label: "₣ 瑞士法郎", icon: "₣" },
    ],
    rules: [],
    svgClass: "numberIcon",
  },
  {
    type: "LinkSrc",
    name: "链接",
    size: "mini",
    width: "100%",
    permission: ["name", "placeholder", "value", "required"],
    value: "",
    disabled: false,
    required: false,
    labelWidth: "80px",
    placeholder: "这是一个链接输入框",
    rules: [
      { required: true, message: "请输入...", trigger: "blur" },
      // { pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/, message: '请输入正确的链接', trigger: 'blur' }
    ],
    svgClass: "linkIcon",
  },
  {
    type: "DateTime",
    name: "日期",
    size: "mini",
    width: "100%",
    permission: [
      "name",
      "placeholder",
      "dateTimeValue",
      "required",
      "showType",
    ],
    value: "",
    disabled: false,
    required: false,
    labelWidth: "80px",
    placeholder: "这是一个日期选择",
    showType: "date",
    option: [
      { label: "年-月-日", value: "date" },
      { label: "年-月-日 时-分-秒", value: "datetime" },
    ],
    rules: [],
    svgClass: "dateIcon",
  },
  {
    type: "DateRange",
    name: "起止时间",
    size: "mini",
    width: "100%",
    permission: [
      "name",
      "placeholder",
      "dateRangeValue",
      "required",
      "showType",
    ],
    value: [],
    disabled: false,
    required: false,
    labelWidth: "80px",
    placeholder: "这是一个时间选择",
    showType: "daterange",
    option: [
      { label: "年-月-日", value: "daterange" },
      { label: "年-月-日 时-分-秒", value: "datetimerange" },
    ],
    rules: [],
    svgClass: "timeIcon",
  },
  {
    type: "Telphone",
    name: "电话",
    size: "mini",
    width: "100%",
    permission: ["name", "placeholder", "value", "required", "support"],
    value: "",
    disabled: false,
    required: false,
    labelWidth: "80px",
    placeholder: "这是一个手机号码输入框",
    support: false,
    rules: [
      { required: true, message: "请输入...", trigger: "blur" },
      {
        pattern: /^1[3456789]\d{9}$/,
        message: "请输入正确的电话号码",
        trigger: "blur",
      },
    ],
    svgClass: "phoneIcon",
  },
  {
    type: "Email",
    name: "邮箱",
    size: "mini",
    width: "100%",
    permission: ["name", "placeholder", "value", "required"],
    value: "",
    disabled: false,
    labelWidth: "80px",
    placeholder: "这是一个邮箱输入框",
    required: false,
    rules: [
      { required: true, message: "请输入...", trigger: "blur" },
      {
        pattern:
          /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/,
        message: "请输入正确的邮箱",
        trigger: "blur",
      },
    ],
    svgClass: "messageIcon",
  },
  {
    type: "Radio",
    name: "单项选择",
    size: "mini",
    width: "100%",
    permission: ["name", "selectValue", "required", "layout", "selectContent"],
    value: "",
    multiple: false,
    disabled: false,
    labelWidth: "80px",
    placeholder: "这是一个单项选择",
    layout: "1",
    required: false,
    option: [
      {
        label: "1",
        value: "未命名1",
        connect: [],
      },
      {
        label: "2",
        value: "未命名2",
        connect: [],
      },
      {
        label: "3",
        value: "未命名3",
        connect: [],
      },
    ],
    rules: [],
    svgClass: "redioIcon",
  },
  {
    type: "Select",
    name: "下拉选择",
    size: "mini",
    width: "100%",
    permission: [
      "name",
      "placeholder",
      "selectValue",
      "required",
      "layout",
      "multiSelect",
      "selectContent",
    ],
    value: "",
    multiple: false,
    disabled: false,
    multiSelect: false,
    labelWidth: "80px",
    placeholder: "这是一个下拉选择",
    layout: "1",
    required: false,
    option: [
      {
        label: "1",
        value: "未命名1",
        connect: [],
      },
      {
        label: "2",
        value: "未命名2",
        connect: [],
      },
      {
        label: "3",
        value: "未命名3",
        connect: [],
      },
    ],
    rules: [],
    svgClass: "selectIcon",
  },
  {
    type: "Checkbox",
    name: "多项选择",
    size: "mini",
    width: "100%",
    permission: [
      "name",
      "selectValue",
      "required",
      "layout",
      "limitSelect",
      "selectContent",
    ],
    value: [],
    multiple: true,
    disabled: false,
    labelWidth: "80px",
    placeholder: "这是一个多项选择",
    layout: "1",
    required: false,
    limitSelect: false,
    min: 0,
    max: 0,
    option: [
      {
        value: "1",
        label: "未命名1",
        connect: [],
      },
      {
        value: "2",
        label: "未命名2",
        connect: [],
      },
      {
        value: "3",
        label: "未命名3",
        connect: [],
      },
    ],
    rules: [],
    svgClass: "squireIcon",
  },
  {
    type: "ImageSelect",
    name: "图片选择",
    size: "mini",
    width: "100%",
    // value: [],
    disabled: false,
    labelWidth: "80px",
    permission: ["name", "required", "limitSelect", "uploadContent"],
    required: false,
    limitSelect: false,
    min: 0,
    max: 0,
    option: [
      { value: "1", label: "未命名1", url: "", checked: false },
      { value: "2", label: "未命名2", url: "", checked: false },
      { value: "3", label: "未命名3", url: "", checked: false },
    ],
    rules: [],
    svgClass: "imgIcon",
  },
  {
    type: "FileUpload",
    name: "附件上传",
    size: "mini",
    width: "100%",
    permission: [
      "name",
      "placeholder",
      "required",
      "limitSize",
      "autoZip",
      "limitFileNum",
      "limitType",
      "uploadValue",
    ],
    disabled: false,
    labelWidth: "80px",
    required: false,
    limitSize: 10,
    autoZip: false,
    limitFileNum: false,
    limitNum: 2,
    limitType: false,
    // limitTypeList: ['1'],
    limitTypeStr: "1",
    option: [
      { value: "1", label: "文档", checked: false },
      { value: "2", label: "图片", checked: false },
      { value: "3", label: "音频", checked: false },
    ],
    rules: [],
    svgClass: "uploadIcon",
  },
  {
    type: "Adress",
    name: "地址",
    size: "mini",
    width: "100%",
    value: [],
    permission: [
      "name",
      "placeholder",
      "required",
      "adressType",
      "adressValue",
    ],
    disabled: false,
    labelWidth: "80px",
    placeholder: "省/地区、市、区/县、详细地址",
    required: false,
    adressType: "1",
    detailAdress: "",
    option: [
      {
        value: "guide",
        label: "Guide",
        children: [
          {
            value: "disciplines",
            label: "Disciplines",
            children: [
              {
                value: "consistency",
                label: "Consistency",
              },
              {
                value: "feedback",
                label: "Feedback",
              },
              {
                value: "efficiency",
                label: "Efficiency",
              },
              {
                value: "controllability",
                label: "Controllability",
              },
            ],
          },
          {
            value: "navigation",
            label: "Navigation",
            children: [
              {
                value: "side nav",
                label: "Side Navigation",
              },
              {
                value: "top nav",
                label: "Top Navigation",
              },
            ],
          },
        ],
      },
    ],
    rules: [],
    svgClass: "addressIcon",
  },
  // {
  //   type: 'description',
  //   name: '描述文字',
  //   size: 'mini',
  //   value: '',
  //   disabled: false,
  //   labelWidth: '80px',
  //   rules: [],
  //   svgClass: 'mulTextIcon'
  // }
];

class modeler {
  constructor(list = [], _BuMap_ = {}) {
    this.__config_list__ = __config_list__;
    if (list.length >= 0) {
      list.forEach((config) => this.put(config));
    }
    this.__encoder__ = new encoder(_BuMap_);
  }

  put(config) {
    const index = this.__fn_search__(config.type);
    if (index < 0) {
      this.__config_list__.push(config);
    } else {
      this.__config_list__.splice(index, 1, config);
    }
  }

  del(...types) {
    types.forEach((type) => {
      const index = this.__fn_search__(type);
      if (index >= 0) {
        this.__config_list__.splice(index, 1);
      }
    });
  }

  build(data, preview) {
    return this.__encoder__.build(data, preview);
  }

  __fn_search__(type) {
    return !type
      ? -1
      : this.__config_list__.findIndex((config) => {
          return type === config.type;
        });
  }

  get list() {
    return this.__config_list__;
  }
}

export default modeler;
