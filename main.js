import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import { config, ajax } from 'common/index.js'

Vue.prototype.$ajax = ajax

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
