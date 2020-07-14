import {request} from './request'

// 获取权限列表
export function getRightsList(){
  return request({
    url:'rights/list'
  })
}
// 获取角色列表
export function getRolesList(){
  return  request({
    url:'roles', 
  })
}
// 添加角色
export function addRoles(data){
  return request({
    url:'roles',
    method:'POST',
    data
  })
}
// 删除角色
export function deleteRoles(id){
  return request({
    url:'roles/'+id,
    method:'DELETE'
  })
}
// 获取角色信息
export function getRoles(id){
  return request({
    url:'roles/'+id
  })
}
// 编辑角色
export function editRole(data){
  return request({
    url:'roles/'+data.roleId,
    method:'PUT',
    data
  })
}
// 删除角色权限
export function removeRight(roleId,rightId){
  return request({
    url:'roles/'+roleId+'/rights/'+rightId,
    method:'DELETE'
  })
}
// 获取权限-树形
export function getRightsTree(){
  return request({
    url:'rights/tree'
  })
}

// 为角色分配权限
export function allotRight(roleId,rids){
  return request({
    url:'roles/'+roleId+'/rights',
    method:'POST',
    data:{
      rids
    }
  })
}




