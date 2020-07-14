import {request} from './request'
// 获取分类列表
export function getCateList(queryInfo){
  return request({
    url:'categories',
    params:queryInfo
  })
}
// 获得父级分类的列表
export function getParentCateList(){
  return request({
    url:'categories',
    params:{
      type:2
    }
  })
}
// 添加分类
export function addCate(data){
  return request({
    url:'categories',
    method:'POST',
    data
  })
}