<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 项目名称 -->
      <div class="login_header">
        <h3>电商管理系统</h3>
      </div>
      <!-- 登录表单 -->
      <div class="login_content">
        <el-form :model="loginForm" status-icon :rules="loginFormRules" ref="loginRuleForm" class="login_form">
         <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
             v-model="loginForm.username"
              autocomplete="off" 
              prefix-icon="el-icon-user"
              placeholder="请输入用户名"
              type="text"
              tabindex="1"
              auto-complete="on"/>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input type="password" 
            v-model="loginForm.password" 
            autocomplete="off"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"></el-input>
          </el-form-item>
          <!-- 表单按钮 -->
          <el-form-item class='login_btn'>
            <!-- 登录按钮 -->
            <el-button type="primary" @click="submitForm('loginRuleForm')">登录</el-button>
            <!-- 重置按钮 -->
            <el-button @click="resetForm('loginRuleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
      name:'login',
      data() {
        // 表单数据校验规则

        // 验证用户名是否合法
      var validateUserName = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请输入用户名'));
        }else if( value.length<3 || value.length>10 ){
          callback(new Error('长度在3到10个字符'));
        }else{
          callback();
        }
      }
      // 验证密码是否合法
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if( value.length<6 || value.length >15){
          callback(new Error('长度在6到15个字符'));
        }else {
          callback();
        }
      };

      return {
         // 登录表单的数据绑定对象
        loginForm: {
          username:'admin',
          password: '123456'
        },
        // 表单的验证规则对象
        loginFormRules: {
          username: [
            {require:true, validator: validateUserName, trigger: 'blur' }
          ],
          password: [
            {require:true, validator: validatePass, trigger: 'blur' }
          ]
          
        }
      };
    },
    methods: {
      // 登录按钮，进行登录的提交
      submitForm(formName) {
        // validate方法的参数为 valid-->校验的结果true/false
        this.$refs[formName].validate(async (valid) => {
          if (!valid) {
            this.$message.error('登录失败')
            return false;
          } else {
            // post的第二个参数是post传入的参数
            // { data:res }解构，从data数据中取出res
            const{ data:res }= await this.$http.post("login",this.loginForm);
            // console.log(res)
            if(res.meta.status == 200){
            this.$message({
              message:'登录成功',
              type:"success"
            })
            // 获取token并将其存在sessionStorage中
            window.sessionStorage.setItem("token",res.data.token);
            // 通过编程式导航跳转到后台主页
            this.$router.push("/home")
            }else{
            this.$message.error('登录失败')
            }
            
          }
        });
      },
      // 点击按钮，重置表单
      // 参数为ref指定的$refs的表单名
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  
}

</script>
<style lang="less" scoped>
  .login_container {
    background: #fff;
    height: 100%;
    display: flex;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
  }
    .login_box {
      width: 350px;
      height: 300px;
      // height: 35%;
      background-color: #fff;
      border-radius: 3px;
      // border: 1px solid #ededed;
      box-shadow: 0px 0px 10px #a9a9a9;
      
      /* margin:0 auto;
      position: relative;
      top: 50%;
      transform: translateY(-50%); */
      .login_header {
        text-align: center;
        color: #3691ff;
        margin-top: 55px;
      }
      .login_content {
        margin-top: 20px;
        padding: 10px;
        box-sizing: border-box;
        .login_btn {
          display:flex;
          justify-content: center;
        }
      }
    }
 
        
      
</style>