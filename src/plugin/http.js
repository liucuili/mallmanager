import http from 'axios'
const HttpToop = {}
HttpToop.install = function (Vue, options) {
  http.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = http
}
export default HttpToop
