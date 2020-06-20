import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
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


Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
