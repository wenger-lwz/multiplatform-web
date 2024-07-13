/*
 * vuex key 值配置表
 * 如有使用localStorage,也使用此KEY作为基准
 */
export const M_T = {
  USER_INFO: "USER_INFO", // 用户信息
  MENU_INFO: "MENU_INFO", // 快捷菜单信息
  REDIS_MENU: "REDIS_MENU", // 配置缓存页面黑白名单
  // LANGUAGE_KEY: "LANGUAGE_KEY", // 语言
  PREMISSIONS_INFO: "PREMISSIONS_INFO", // 所有权限集合
  PREMISSIONS_INFO_NOW_BTN: "PREMISSIONS_INFO_NOW_BTN", // 当前的路由的按钮, 表格列等权限集合
  SIDE_BAR_MENU: "SIDE_BAR_MENU", // 路由切换的时候获取该导航的父级菜单以及该导航本级的所有菜单(左侧菜单列表)
  PARAMS_QUERY: "PARAMS_QUERY", // 复杂参数
  DYNAMIC_FROM: "DYNAMIC_FROM", // 动态表单专用store
  DYNAMIC_EBAY: "DYNAMIC_EBAY", // 动态表单专用store
  DYNAMIC_EBAY_TEMPLATE: "DYNAMIC_EBAY_TEMPLATE", // 动态表单专用store
  DYNAMIC_EBAY_SITEID: "DYNAMIC_EBAY_SITEID", // 站点
  DYNAMIC_EBAY_CATEGORYID: "DYNAMIC_EBAY_CATEGORYID", // 产品分类
  COMMODITY_INFO: "COMMODITY_INFO", // LAZADA 商品资料
  COMMODITY_PROPERTY: "COMMODITY_PROPERTY", // LAZADA 切换分类返回的属性集
  GOODS_INFO_EBAY: "GOODS_INFO_EBAY", //商品资料基本信息
  GOODS_INFO_EBAY_PICTURE: "GOODS_INFO_EBAY_PICTURE", //素材中心目录
  GOODS_INFO_EBAY_ATTRIBUTELIST: "GOODS_INFO_EBAY_ATTRIBUTELIST", //变体信息
  GOODS_INFO_EBAY_ENBALE: "GOODS_INFO_EBAY_ENBALE", //兼容性列表
  GOODS_INFO_EBAY_CATEGORYID: "GOODS_INFO_EBAY_CATEGORYID",
  GOODS_INFO_EBAY_RELATIONSPULIST: "GOODS_INFO_EBAY_RELATIONSPULIST", //关联SPU
  GOODS_INFO_EBAY_SPECSTYPE: "GOODS_INFO_EBAY_SPECSTYPE", //商品资料基本信息
  DRAFT_INFO_EBAY: "DRAFT_INFO_EBAY",
  DRAFT_INFO_DOMESTICTYPE: "DRAFT_INFO_DOMESTICTYPE",
  DRAFT_INFO_LISTINGTYPE: "DRAFT_INFO_LISTINGTYPE",
  DRAFT_INFO_PRICEUNIT: "DRAFT_INFO_PRICEUNIT",
  GET_SITEID_LIST: "GET_SITEID_LIST", //站点元数据
  GET_SHOPID_LIST: "GET_SHOPID_LIST", //店铺元数据
  DRAFT_INFO_ALI_SPU: "DRAFT_INFO_ALI_SPU", //速卖通草稿spu
  DRAFT_INFO_ALI_SPUTYPE: "DRAFT_INFO_ALI_SPUTYPE", //速卖通草稿spu类型
  SHOPEE_CATEGORY: "SHOPEE_CATEGORY", //SHOPEE分类数据
  SHOPEE_SITEID: "SHOPEE_SITEID", //站点SITEID
  CATEGORYID: "CATEGORYID", //站点SITEID
  PRO_INFO_ALI_SPU: "PRO_INFO_ALI_SPU", //速卖通商品资料spu
  PRO_INFO_ALI_SPUTYPE: "PRO_INFO_ALI_SPUTYPE", //速卖通商品资料spu类型
};
