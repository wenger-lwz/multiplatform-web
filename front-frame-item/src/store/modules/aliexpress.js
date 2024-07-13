import { M_T } from "../mutationsTypes";
const state = {
  wirelessVisible: false, //无线详描弹窗
  aliProductInfo: {}, //商品信息
  customizedPic: [], //商品草稿可上传图片的变体属性
  shopCode: "", //店铺id
  platformCategoryId: "", //草稿速卖通类目ID
  draftSpu: "", //草稿速卖SPU/SKU
  draftSpuType: 1, //草稿速卖通spu类型
  aliDraftInfo: {},

  proSpu: "",
  proSpuType: 1,

  proCustomizedPic: [], //商品资料可上传图片的变体属性
  saveMoreAttr: {}, //商品资料切换单体时，保存变体所填写的资料
};
const getters = {
  // getdynamicProperties: (state) => {
  //   if (state) {
  //     return state.dynamicProperties;
  //   }
  // },
  getWirelessVisible: (state) => {
    if (state) {
      return state.wirelessVisible;
    }
  },
};
const mutations = {
  setWirelessVisible(state, newValue) {
    state.wirelessVisible = newValue;
  },

  setAliProductInfo(state, newValue) {
    state.aliProductInfo = JSON.parse(JSON.stringify(newValue));
  },

  setCustomizedPic(state, newValue) {
    state.customizedPic = newValue;
  },

  setShopCode(state, newValue) {
    state.shopCode = newValue;
  },

  setPlatformCategoryId(state, newValue) {
    state.platformCategoryId = newValue;
  },

  setProCustomizedPic(state, newValue) {
    state.proCustomizedPic = newValue;
  },

  setSaveMoreAttr(state, newValue) {
    state.saveMoreAttr = newValue;
  },

  //草稿spu
  [M_T.DRAFT_INFO_ALI_SPU](state, newInfo) {
    state.draftSpu = newInfo;
  },

  //草稿spu类型
  [M_T.DRAFT_INFO_ALI_SPUTYPE](state, newInfo) {
    state.draftSpuType = newInfo;
  },

  //商品资料spu
  [M_T.PRO_INFO_ALI_SPU](state, newInfo) {
    state.proSpu = newInfo;
  },

  //商品资料spu类型
  [M_T.PRO_INFO_ALI_SPUTYPE](state, newInfo) {
    state.proSpuType = newInfo;
  },

  setAliDraftInfo(state, newValue) {
    state.aliDraftInfo = JSON.parse(JSON.stringify(newValue));
  },
  // [M_T.DYNAMIC_EBAY_SITEID](state, newInfo) {
  //   state.dynamicProperties.siteId = newInfo;
  // },
  // [M_T.DYNAMIC_EBAY_CATEGORYID](state, newInfo) {
  //   state.dynamicProperties.categoryId = newInfo;
  // },
  // [M_T.DYNAMIC_EBAY_TEMPLATE](state, newInfo) {
  //   state.dynamicProperties.templateParams = newInfo;
  // },
};
const actions = {
  // setWirelessVisible(ctx, newValue) {
  //   ctx.commit('setWirelessVisible', newValue);
  // }
  // [M_T.DYNAMIC_EBAY](ctx, newInfo) {
  //   ctx.commit(M_T.DYNAMIC_EBAY, newInfo);
  // },
  // [M_T.DYNAMIC_EBAY_TEMPLATE](ctx, newInfo) {
  //   ctx.commit(M_T.DYNAMIC_EBAY_TEMPLATE, newInfo);
  // },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
