<template>
  <div>
    <p>home</p>
    <!-- 登录退出按钮 -->
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name:'home',
  methods:{
    // 实现登录退出功能
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login')
    }
  }
}

</script>
<style lang="less" scoped>
</style>