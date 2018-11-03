// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import moment from 'moment'
import '../src/assets/css/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import http from './plugin/http'
import router from './router'
// 全局过滤器
// 格式化日期
Vue.filter('fmtDate', (value, fmtString) => {
    return moment(value).format(fmtString)
})
Vue.use(ElementUI)
Vue.use(http)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})