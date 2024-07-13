export const amzFbmRouter = [
  {
    path: '/amzfbm-web/:page*',
    name: 'amzfbm-web',
    meta: {
      plat: 'AMZ_FBM',
      routeKey: 'amzfbm-web'
    },
    component: () => import('../pages/system/iframeApps.vue')
  }
]
