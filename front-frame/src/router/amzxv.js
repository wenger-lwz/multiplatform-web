export const amzXvRouter = [
  {
    path: '/amzxv-web/:page*',
    name: 'amzxv-web',
    meta: {
      plat: 'AMZ_XV',
      routeKey: 'amzxv-web'
    },
    component: () => import('../pages/system/iframeApps.vue')
  }
]
