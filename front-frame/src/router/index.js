import { createRouter, createWebHistory } from "vue-router"
import { platRouter } from './plat'
import { uacRouter } from './uac'
import { walmartRouter } from './walmart'
import { amzRouter } from './amz'
import { amzvRouter } from './amzv'
import { baseRouter } from './base'

import store from '../store'
import {amzXvRouter} from "@/router/amzxv";
import {amzFbmRouter} from "@/router/amzfbm";
import {amzFvRouter} from "@/router/amzfv";

// 登录后的基础路由
const baseRouteListLogin = ['uac-web', 'multiplatform-web', 'walmart-web', 'amz-web', 'amzxv-web', 'amzfbm-web', 'amzfv-web', 'amzv-web']

const routes = [
  {
    path: '/auth/login',
    name: 'login',
    meta: {
      isToken: 'noToken'
    },
    component: () => import('../pages/public/login.vue')
  },
  {
    path: '/',
    component: () => import('../layout/Index.vue'),
    redirect: '/amz-web/index',
    children: [
      ...amzFvRouter,
      ...amzXvRouter,
      ...amzFbmRouter,
      ...amzRouter,
      ...amzvRouter,
      ...platRouter,
      ...uacRouter,
      ...walmartRouter,
      // 登录之后的404展示
      ...baseRouter
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 是否第一次系统后路由
let firstEnterAppRoute = true;

router.beforeEach((to, from, next) => {
  const token = store.getters?.getUserInfo?.token
  const currentApps = to.fullPath.split('/')[1] || to.fullPath.split('/')[0];
  const apps = currentApps.split('-'); // amz-ad-app
  // console.error(to.path, 'to.path')
  if (apps.length === 2 && apps[1] === 'app') {
    return void next(to.fullPath.replace(currentApps, `${apps[0]}-web`));
  }

  const reg = /^(\/[a-zA-Z]+-web)\/[a-zA-Z]+-app/;

  if (reg.test(to.fullPath)) {
    return void next(to.fullPath.replace(currentApps, ``));
  }
  // 查看进入的页面是否需要token
  if (to.meta.isToken === 'noToken') {
    if (to.path === '/auth/login' && token) {
      next('/amz-web/index')
    } else {
      next()
    }
  } else {
    if (!token) {
      if (to.path !== '/auth/login') {
        next('/auth/login')
      } else {
        next()
      }
    } else {
      // 存在token
      if (to.path === '/auth/login') {
        next('/amz-web/index')
      } else {
        // 如果跳转的不属于任何一个子项目，则展示404
        if (baseRouteListLogin.indexOf(currentApps) < 0) {
          if (firstEnterAppRoute) {
            /**
             * 大前端上线前，客户收藏的书签中的路由没有/amz-web/之类的前缀，如果客户直接通过书签进入系统，
             * 会导致404页面，所以第一次进入系统时如果是没有任何应用前缀，默认导航到dashboar页面
             */
            next('/amz-web/index');
            firstEnterAppRoute = false;
          }

          if (to.path !== '/404') {
            next('/404')
          } else {
            next()
          }
        } else {
          next()
        }
      }
    }
  }
})

export default router
