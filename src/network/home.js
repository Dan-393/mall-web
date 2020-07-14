// 为home 提供方法url

import { request } from './request'

// 获取所有的菜单
export function getMenuList() {
  return request({
    url:'/menus'
  })
  
}