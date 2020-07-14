import{request}  from './request'

export function loginSubmit(data){
  return request({
    url:'/login',
    method:'POST',
    data,
  })
}