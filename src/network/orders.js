import {request} from './request'

// queryInfo请求订单数据的参数对象
export function getOrdersList(queryInfo){
  return request({
    url:'orders',
    params:queryInfo
  })
}
// 请求快递信息
export function getProgress(){
  return request({
    url:'/kuaidi/1106975712662',
  })
}