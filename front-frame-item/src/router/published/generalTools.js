export default [
  {
    path: "/phonePool",
    name: "PhonePool",
    meta: {
      key: "plantPublish/generalTools/phonePool",
    },
    component: () =>
      import(
        /* webpackChunkName: "shopifyComponentsTemplate" */ "@pagesSystem/published/generalTools/phonePool.vue"
      ),
  },
  {
    path: "/SKUAtuoGenerated",
    name: "SKUAtuoGenerated",
    meta: {
      key: "plantPublish/generalTools/SKUAtuoGenerated",
    },
    component: () =>
      import(
        /* webpackChunkName: "shopifyComponentsTemplate" */ "@pagesSystem/published/generalTools/SKUAtuoGenerated.vue"
      ),
  },
  {
    path: "/SKUMap",
    name: "SKUMap",
    meta: {
      key: "plantPublish/generalTools/SKUMap",
    },
    component: () =>
      import(
        /* webpackChunkName: "shopifyComponentsTemplate" */ "@pagesSystem/published/generalTools/SKUMap.vue"
      ),
  },
];
