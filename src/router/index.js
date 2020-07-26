import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import Home from '@/components/Home'
import More from '@/components/More'
import Profile from '@/components/Profile'
import ArticleDetails from '@/components/ArticleDetails'
import ArticleEditor from '@/components/ArticleEditor'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
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
          path: '/more',
          name: 'More',
          component: More,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/article/details/:article_id',
          name: 'ArticleDetails',
          component: ArticleDetails,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/profile',
          name: 'Profile',
          component: Profile
        }, {
          path: '/article/editor/:article_id',
          name: 'ArticleEditor',
          component: ArticleEditor
        }
      ]
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
