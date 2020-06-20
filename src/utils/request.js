import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
//判断是开发还是生产
const BASEURL = 'http://api_php.punuohui.cn/api3.2/index.php'
// create an axios instance 实例
const service = axios.create({
  baseURL:BASEURL,
  timeout: 5000
})

// request interceptor 
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// respose interceptor
service.interceptors.response.use(
  // 接受的信息过滤不必要的信息后返回

  // 通过自定义代码确定请求状态
  // 还可以通过HTTP状态代码判断状态
  response =>{
    const res = response.data

    // if the custom code is not 200，it is judged as an error
    if(res.code !== 200){
      Message({
        message:res.message || 'Error',
        type:'error',
        duration:5*1000
      })
    return Promise.reject(new Error(res.message || 'Error'))
  }else {
    return res
  }
},
error =>{
  console.log('err'+error)
  Message({
    message:error.message,
    type:'error',
    duration:5*1000
  })
  return Promise.reject(error)
}
)
export default service
