export const walmartRouter = [
  {
    path: '/walmart-web/:page*',
    name: 'walmart-web',
    meta: {
      plat: 'WLMT',
      routeKey: 'walmart-web'
    },
    component: () => import('../pages/system/iframeApps.vue')
  },
]