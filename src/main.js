import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import TreeTable from 'vue-table-with-tree-grid'
import 'element-ui/lib/theme-chalk/index.css';//样式文件一定要引入

// 导入全局样式表
import '@/assets/css/global.css'
// 导入字体图标
import './icons'

// 引入axios
import axios from 'axios'
// 配置请求的路径
axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'
// Vue.prototype原型,之后可以直接 this.$http发起请求
Vue.prototype.$http = axios

// 请求拦截器
// 每次请求都会在config的头部Authorization 挂载携带token令牌
axios.interceptors.request.use(config => {
  // 为请求 头对象，onfig的headers挂载Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
