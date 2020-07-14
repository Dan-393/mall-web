import axios from 'axios'

export function request(config){
  // 1.创建axios实例
  const instance = axios.create({
    baseURL:'http://47.115.124.102:8888/api/private/v1/',
    timeout:5000
  })

  // 2.axios的拦截器
 // 每次请求都会在config的头部Authorization 挂载携带token令牌
  instance.interceptors.request.use(config => {
    // 为请求 头对象，onfig的headers挂载Token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // console.log(config)
    return config
  })
   // 3.传入对象进行网络请求，发送真正的网络请求
  return instance(config)


}

// Vue.prototype原型,之后可以直接 this.$http发起请求
// Vue.prototype.$http = axios