import Vue from 'vue'
import App from './App.vue'
import axios from './http/index'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$axios = axios
Vue.prototype.$moment = moment

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
