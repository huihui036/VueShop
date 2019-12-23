import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/homes.vue'
import Login from '../components/Login.vue'
import Wellcome from '../components/wellcome'
import Users from '../components/users'
import Rights from '../components/rights'
import Roles from '../components/roles'
import Goods from '../components/goods/goodlist'
import Odelis from '../components/orderslis'
import Categories from '../components/categories'
import Params from '../components/params'
import Reports from '../components/reports'
import Addg from '../components/goods/addgoods'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/wellcome',
    children: [
      {
        path: '/wellcome',
        component: Wellcome
      },
      {
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/goods',
        name: 'goods',
        component: Goods
      },
      { path: '/orders', name: 'orders', component: Odelis },
      { path: '/categories', name: 'categories', component: Categories },
      { path: '/params', name: 'params', component: Params },
      { path: '/reports', name: 'reports', component: Reports },
      { path: '/goods/addgoods', name: 'addgondslist', component: Addg }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const toneks = window.sessionStorage.getItem('Authorization')
  if (!toneks) return next('/login')
  next()
})

export default router
