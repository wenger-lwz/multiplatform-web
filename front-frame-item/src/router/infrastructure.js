// 基础设置
export default [
  {
    path: "/authorizationManage",
    name: "AuthorizationManage",
    meta: {
      key: "PLAT_Infrastructure/PLAT_AuthorizationManage",
    },
    component: () =>
      import("@pagesSystem/infrastructure/authorizationManage.vue"),
  },
  {
    path: "/labelManage",
    name: "LabelManage",
    meta: {
      key: "PLAT_Infrastructure/PLAT_LabelManage",
    },
    component: () => import("@pagesSystem/infrastructure/labelManage.vue"),
  },
];
