import Vue from 'vue'
import App from './App'
import BaiduMap from 'vue-baidu-map'

Vue.config.productionTip = false
Vue.use(BaiduMap, {
  ak: 'U43Xy5aiHHDKWZwQOxPn7NS8kGdv8kFO'
})
import config from "./common/config.js"
Vue.prototype.config = config

import User from "./common/user.js"
Vue.prototype.User = User

import request from "./common/request.js"
Vue.prototype.$http = request

import CoordTrans from "./common/transformCoordinate.js"
Vue.prototype.CoordTrans = CoordTrans

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
