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



Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.component('tree-table',TreeTable)

// 自定义格式化时间的全局过滤器
Vue.filter('dateFormat', originVal =>{
  // 日期时间对象
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate() +'').padStart(2,'0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMonth()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
