import Cookies from 'js-cookie'

const TokenKey = 'vue_login_demo_token'

// 从cookie中取出
export function getToken(){
  return Cookies.get(TokenKey);
}

// 存到cookie中
export function setToken(token){
  return Cookies.set(TokenKey,token);
}

// 从cookie中国删除
export function removeToken(){
  return Cookies.remove(TokenKey);
}