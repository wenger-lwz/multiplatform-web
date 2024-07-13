import { M_T } from "../mutationsTypes";
const state = {
  dynamicProperties: {
    platform: "",
    templateParams: {},
    siteId: "",
    categoryId: "",
  },
  //
  goodsData: {
    siteId: "",
    specsType: "1",
    CompatibleEnbale: "Disabled", // 存储是否需要兼容性列表
    picture: {}, //素材中心目录sku/spu
    attributeListL: [], //变体信息
    relationSpuList: [], //关联spu
    categoryId: "", //第一分类
  },
  draftData: {
    shopId: "",
    domesticType: "", //运输类型
    listingType: "FixedPriceItem", //销售类型
    priceUnit: "", //PRICEUNIT
  },
};
const getters = {
  getdynamicProperties: (state) => {
    if (state) {
      return state.dynamicProperties;
    }
  },
  getgoodsData: (state) => {
    if (state) {
      return state.goodsData;
    }
  },
  getdraftData: (state) => {
    if (state) {
      return state.draftData;
    }
  },
};
const mutations = {
  // 站点
  [M_T.DYNAMIC_EBAY_SITEID](state, newInfo) {
    state.dynamicProperties.siteId = newInfo;
  },
  [M_T.DYNAMIC_EBAY_CATEGORYID](state, newInfo) {
    state.dynamicProperties.categoryId = newInfo;
  },
  [M_T.DYNAMIC_EBAY_TEMPLATE](state, newInfo) {
    state.dynamicProperties.templateParams = newInfo;
  },

  // 站点
  [M_T.GOODS_INFO_EBAY](state, newInfo) {
    state.goodsData.siteId = newInfo;
  },
  [M_T.GOODS_INFO_EBAY_CATEGORYID](state, newInfo) {
    state.goodsData.categoryId = newInfo;
  },
  // 变体类型
  [M_T.GOODS_INFO_EBAY_SPECSTYPE](state, newInfo) {
    state.goodsData.specsType = newInfo;
  },

  // 兼容性列表
  [M_T.GOODS_INFO_EBAY_ENBALE](state, newInfo) {
    state.goodsData.CompatibleEnbale = newInfo;
  },
  // 素材中心目录
  [M_T.GOODS_INFO_EBAY_PICTURE](state, newInfo) {
    state.goodsData.picture = newInfo;
  },
  // 变体信息
  [M_T.GOODS_INFO_EBAY_ATTRIBUTELIST](state, newInfo) {
    state.goodsData.attributeListL = newInfo;
  },
  //关联spu
  [M_T.GOODS_INFO_EBAY_RELATIONSPULIST](state, newInfo) {
    state.goodsData.relationSpuList = newInfo;
  },

  [M_T.DRAFT_INFO_EBAY](state, newInfo) {
    state.draftData.shopId = newInfo;
  },

  [M_T.DRAFT_INFO_DOMESTICTYPE](state, newInfo) {
    state.draftData.domesticType = newInfo;
  },
  [M_T.DRAFT_INFO_LISTINGTYPE](state, newInfo) {
    state.draftData.listingType = newInfo;
  },
  [M_T.DRAFT_INFO_PRICEUNIT](state, newInfo) {
    state.draftData.priceUnit = newInfo;
  },
};
const actions = {
  [M_T.DYNAMIC_EBAY](ctx, newInfo) {
    ctx.commit(M_T.DYNAMIC_EBAY, newInfo);
  },
  [M_T.DYNAMIC_EBAY_TEMPLATE](ctx, newInfo) {
    ctx.commit(M_T.DYNAMIC_EBAY_TEMPLATE, newInfo);
  },
  // goodsId
  [M_T.GOODS_INFO_EBAY](ctx, newInfo) {
    ctx.commit(M_T.GOODS_INFO_EBAY, newInfo);
  },

  [M_T.GOODS_INFO_EBAY_CATEGORYID](ctx, newInfo) {
    ctx.commit(M_T.GOODS_INFO_EBAY_CATEGORYID, newInfo);
  },
  // 变体类型
  [M_T.GOODS_INFO_EBAY_SPECSTYPE](ctx, newInfo) {
    ctx.commit(M_T.GOODS_INFO_EBAY_SPECSTYPE, newInfo);
  },
  // 兼容性列表
  [M_T.GOODS_INFO_EBAY_ENBALE](ctx, newInfo) {
    ctx.commit(M_T.GOODS_INFO_EBAY_ENBALE, newInfo);
  },
  // 素材中心目录
  [M_T.GOODS_INFO_EBAY_PICTURE](ctx, newInfo) {
    ctx.commit(M_T.GOODS_INFO_EBAY_PICTURE, newInfo);
  },
  // 变体信息
  [M_T.GOODS_INFO_EBAY_ATTRIBUTELIST](ctx, newInfo) {
    ctx.commit(M_T.GOODS_INFO_EBAY_ATTRIBUTELIST, newInfo);
  },
  //关联spu
  [M_T.GOODS_INFO_EBAY_RELATIONSPULIST](ctx, newInfo) {
    ctx.commit(M_T.GOODS_INFO_EBAY_RELATIONSPULIST, newInfo);
  },
  [M_T.DRAFT_INFO_EBAY](ctx, newInfo) {
    ctx.commit(M_T.DRAFT_INFO_EBAY, newInfo);
  },
  [M_T.DRAFT_INFO_DOMESTICTYPE](ctx, newInfo) {
    ctx.commit(M_T.DRAFT_INFO_DOMESTICTYPE, newInfo);
  },
  [M_T.DRAFT_INFO_LISTINGTYPE](ctx, newInfo) {
    ctx.commit(M_T.DRAFT_INFO_LISTINGTYPE, newInfo);
  },
  [M_T.DRAFT_INFO_PRICEUNIT](ctx, newInfo) {
    ctx.commit(M_T.DRAFT_INFO_PRICEUNIT, newInfo);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
