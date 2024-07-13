export const amzvRouter = [
  {
    path: '/amzv-web/:page*',
    name: 'amzv-web',
    meta: {
      plat: 'AMZV',
      routeKey: 'amzv-web'
    },
    component: () => import('../pages/system/iframeApps.vue')
  }
]