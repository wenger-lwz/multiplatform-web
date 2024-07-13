import { M_T } from "../mutationsTypes";
const state = {
  userInfo: {
    name: "",
    token: "",
    language: "zh",
  },
  permissionsInfo: {},
};
const getters = {
  getUserInfo: (state) => {
    if (
      localStorage.getItem(M_T.USER_INFO) &&
      localStorage.getItem(M_T.USER_INFO) !== "undefined"
    ) {
      state.userInfo = JSON.parse(localStorage.getItem(M_T.USER_INFO));
    }
    return state.userInfo;
  },
  getPermissions: (state) => {
    if (
      localStorage.getItem(M_T.PREMISSIONS_INFO_NOW_BTN) &&
      localStorage.getItem(M_T.PREMISSIONS_INFO_NOW_BTN) !== "undefined"
    ) {
      state.permissionsInfo = JSON.parse(
        localStorage.getItem(M_T.PREMISSIONS_INFO_NOW_BTN)
      );
    }
    return state.permissionsInfo;
  },
};
const mutations = {
  [M_T.USER_INFO](state, newUserInfo) {
    state.userInfo = newUserInfo;
    localStorage.setItem(M_T.USER_INFO, newUserInfo);
  },
  [M_T.PREMISSIONS_INFO_NOW_BTN](state, newPermissionsInfo) {
    state.permissionsInfo = newPermissionsInfo;
    localStorage.setItem(M_T.PREMISSIONS_INFO_NOW_BTN, newPermissionsInfo);
  },
};
const actions = {
  [M_T.USER_INFO](ctx, newUserInfo) {
    ctx.commit(M_T.USER_INFO, newUserInfo);
  },
  [M_T.PREMISSIONS_INFO_NOW_BTN](ctx, newPermissionsInfo) {
    ctx.commit(M_T.PREMISSIONS_INFO_NOW_BTN, newPermissionsInfo);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
