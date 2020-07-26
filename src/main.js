// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import './assets/icon/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import mavonEditor from 'mavon-editor'

var axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8443/api'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(mavonEditor)

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user) {
      next()
    } else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
