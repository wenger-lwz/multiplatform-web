export const uacRouter = [
  {
    path: '/uac-web/:page*',
    name: 'uac-web',
    meta: {
      plat: 'UAC',
      routeKey: 'uac-web'
    },
    component: () => import('../pages/system/iframeApps.vue')
  }
]
