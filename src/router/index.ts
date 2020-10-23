import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/lbl-array-planning',
    name: 'LBLArrayPlanning',
    component: () => import(/* webpackChunkName: "lbl-array-planning" */ '../views/LBLArrayPlanning.vue'),
    meta: {
      title: 'LBL Array Planning',
      icon: 'mdi-blur-radial'
    }
  },
  {
    path: '/tat-calculator',
    name: 'TATCalculator',
    component: () => import(/* webpackChunkName: "tat-calculator" */ '../views/TATCalculator.vue'),
    meta: {
      title: 'TAT Calculator',
      icon: 'mdi-blur-radial'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
