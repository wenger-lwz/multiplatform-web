export const amzFvRouter = [
  {
    path: '/amzfv-web/:page*',
    name: 'amzfv-web',
    meta: {
      plat: 'AMZ_FV',
      routeKey: 'amzfv-web'
    },
    component: () => import('../pages/system/iframeApps.vue')
  }
]
