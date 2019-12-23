import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import './assets/css/styles.css'
import './assets/font/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('Authorization')
  return config
})
Vue.prototype.$http = axios
Vue.component('treetable', ZkTable)
Vue.filter('dataformat', function(originval) {
  const dat = new Date(originval)
  const yy = dat.getFullYear()
  const mon = (dat.getMonth() + 1 + '').padStart(2, '0')
  const da = (dat.getDate() + '').padStart(2, '0')
  const hh = (dat.getHours() + '').padStart(2, '0')
  const mm = (dat.getMinutes() + '').padStart(2, '0')
  const ss = (dat.getSeconds() + '').padStart(2, '0')
  return `${yy}-${mon}-${da} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
