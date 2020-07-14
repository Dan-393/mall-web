// 为users页面提供方法请求url

import {request} from './request'
// 获取用户列表
export function getUserList(queryInfo){
  return request({
    url:'/users',
    params:queryInfo
  })
};
// 将最新的状况保存到数据库
export function changeMgstate(userInfo){
  return request({
    url:userInfo,
    method:'PUT',
  })
};
// 添加用户
export function addUser(data){
  console.log(data)
  return request({
    url:'users',
    method:'POST',
    data
  })
}

// 根据id查询用户的信息
export function getInfo(id){
  return request({
    url:`users/${id}`,
  })
}

// 修改用户
export function update(user){
  return request({
    url:`users/`+user.id,
    method:'PUT',
    data:{
      email:user.email,
      mobile:user.mobile
    }
  })
}

// 删除用户
export function deleteUser(id){
  return request({
    method:'DELETE',
    url:`users/${id}`
  })
}

// 获取角色列表
export function getRoles(){
  return request({
    url:'roles'
  })
}

// 分配角色
export function setRole(userId,roleId){
  return request({
    url:'users/'+userId+'/role',
    method:'PUT',
    data:{
      rid:roleId
    }
  })
}

