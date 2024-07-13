// 素材中心

const materialCenter = [
  {
    path: "/pictureManagement",
    name: "pictureManagement",
    meta: {
      key: "plantPublish/materialCenter/pictureManagement",
    },
    component: () =>
      import(
        "@pagesSystem/published/materialCenter/pictureManagement/pictureManagement.vue"
      ),
  },
  {
    path: "/productMaterial",
    name: "productMaterial",
    meta: {
      key: "plantPublish/materialCenter/productMaterial",
    },
    component: () =>
      import(
        "@pagesSystem/published/materialCenter/productMaterial/productMaterial.vue"
      ),
  },
  {
    path: "/videoManagement",
    name: "videoManagement",
    meta: {
      key: "plantPublish/materialCenter/videoManagement",
    },
    component: () =>
      import(
        "@pagesSystem/published/materialCenter/videoManagement/videoManagement.vue"
      ),
  },
  // {
  //   path: "/videoManagement2",
  //   name: "videoManagement2",
  //   meta: {
  //     key: "plantPublish/materialCenter/videoManagement2",
  //   },
  //   component: () =>
  //     import("@pagesSystem/published/materialCenter/videoManagement2.vue"),
  // },
];

export default materialCenter;
