// lazada 数据存储
import { M_T } from "../mutationsTypes";
const state = {
  lazadaData: {
    commodityInfo: {},
    propertyMapLazada: {},
  },
};
const getters = {
  getCommodityInfo: (state) => {
    return state.lazadaData.commodityInfo;
  },
  getProperty: (state) => {
    return state.lazadaData.propertyMapLazada;
  },
};
const mutations = {
  [M_T.COMMODITY_INFO](state, newInfo) {
    state.lazadaData.commodityInfo = newInfo;
  },
  [M_T.COMMODITY_PROPERTY](state, newInfo) {
    state.lazadaData.propertyMapLazada = newInfo;
  },
};
const actions = {
  [M_T.COMMODITY_INFO](ctx, newInfo) {
    ctx.commit(M_T.COMMODITY_INFO, newInfo);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
