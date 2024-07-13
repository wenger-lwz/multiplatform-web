export const baseRouter = [
  {
    path: '404',
    name: '404',
    meta: {
      plat: 'base',
      routeKey: 'base-web'
    },
    component: () => import('../pages/system/iframeApps.vue')
  }
]
