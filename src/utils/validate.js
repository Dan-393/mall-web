

//使用validate.js实现表单数据的验证

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 用户名正则校验
/**
 * @param {string} value
 * @returns {Boolean}
 */
export function  isUserNameReg (value) {
  // 用户名必须是4-10位之间的字母、下划线、@、.，并且不能以数字开头
  let reg = /^[a-zA-Z0-9_-]{4,16}$/;
  return reg.test(value) ? true:false;
} 

// 密码正则校验
/**
 * @param {string} value
 * @returns {Boolean}
 */
export function isPassWordReg(value) {
  let reg =  /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,16}$/;
  return reg.test(value) ? true:false;
}

/**
 * 过滤特殊字符
 */
export function stripscript(s) 
{ 
var pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？] ")        //格式 RegExp("[在中间定义特殊过滤字符]")
var rs = ""; 
for (var i = 0; i < s.length; i++) { 
 rs = rs+s.substr(i, 1).replace(pattern, ''); 
}
return rs;
}
