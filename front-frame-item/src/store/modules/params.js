// 复杂参数组件值传递
import { M_T } from "../mutationsTypes";
const state = {
  params: {},
};
const getters = {
  getParams: (state) => {
    if (state) {
      return state.params;
    }
  },
};
const mutations = {
  [M_T.PARAMS_QUERY](state, newInfo) {
    if (Object.keys(newInfo).length <= 0) {
      state.params = {};
    } else {
      state.params = { ...state.params, ...newInfo };
    }
  },
};
const actions = {
  [M_T.PARAMS_QUERY](ctx, newInfo) {
    ctx.commit(M_T.PARAMS_QUERY, newInfo);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
