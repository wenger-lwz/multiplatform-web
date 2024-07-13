export const amzRouter = [
  {
    path: '/amz-web/:page*',
    name: 'amz-web',
    meta: {
      plat: 'AMZ',
      routeKey: 'amz-web'
    },
    component: () => import('../pages/system/iframeApps.vue')
  }
]