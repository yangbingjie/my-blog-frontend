import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import Home from '@/components/Home'
import Profile from '@/components/Profile'
import Article from '@/components/Article'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
      // home页面并不需要被访问
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'Index',
          component: Index,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/profile',
          name: 'Profile',
          component: Profile,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/article',
          name: 'Article',
          component: Article,
          meta: {
            requireAuth: true
          }
        }
      ]
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
