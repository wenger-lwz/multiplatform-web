// 复杂参数组件值传递
import { M_T } from "../mutationsTypes";
import {
  getListingCommonSiteId,
  getListingCommonShop,
} from "@/api/published/common.js";
const state = {
  siteIdList: [],
  shopIdList: [],
  shopeeData: {
    siteId: "",
  },
  shopeeCategoryList: [],
  categoryId: "",
};
const getters = {
  getSiteIdParams: (state) => {
    if (state) {
      return state;
    }
  },
};

const mutations = {
  //设置国家
  [M_T.GET_SITEID_LIST](state, list) {
    state.siteIdList = list;
  },
  //设置店铺
  [M_T.GET_SHOPID_LIST](state, list) {
    state.shopIdList = list;
  },
  //设置SHOPEE站点ID
  [M_T.SHOPEE_SITEID](state, list) {
    state.shopeeData.siteId = list;
  },
  //设置SHOPEE分类
  [M_T.SHOPEE_CATEGORY](state, list) {
    state.shopeeCategoryList = list;
  },
  //设置SHOPEE categoryId
  [M_T.CATEGORYID](state, list) {
    state.categoryId = list;
  },
};

const actions = {
  //获取站点
  [M_T.GET_SITEID_LIST](ctx, params) {
    getListingCommonSiteId({ platformId: params }).then((res) => {
      ctx.commit(M_T.GET_SITEID_LIST, res?.data);
    });
  },

  //获取店铺
  [M_T.GET_SHOPID_LIST](ctx, params) {
    getListingCommonShop({ platformCode: params }).then((res) => {
      ctx.commit(M_T.GET_SHOPID_LIST, res?.data);
    });
  },

  //获取SHOPEE分类
  [M_T.SHOPEE_SITEID](ctx, params) {
    if (params) {
      // state.shopeeData.siteId = params;
      ctx.commit(M_T.SHOPEE_SITEID, params);

      /* getShopeeCategories({ site: params }).then((res) => {
        ctx.commit(M_T.SHOPEE_CATEGORY, res?.data?.category_list);
      }); */
    }
  },

  //获取SHOPEE categoryId
  [M_T.CATEGORYID](ctx, params) {
    ctx.commit(M_T.CATEGORYID, params);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
