export const platRouter = [
  {
    path: '/multiplatform-web/:page*',
    name: 'multiplatform-web',
    meta: {
      plat: 'PLAT',
      routeKey: 'multiplatform-web'
    },
    component: () => import('../pages/system/iframeApps.vue')
  },
]