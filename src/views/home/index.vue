<template>
  <el-container class="container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>电商后台管理系统</span>
        <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="toggleCollapse"></i>
      </div>
      <!-- 登录退出按钮 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 内容区域 -->
    <el-container>
      <!-- 边栏区域 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="uesr-avatar" v-show="!isCollapse">
          <img src="../../assets//img//avatar.jpg" alt="用户头像" />
          <span>用户</span>
        </div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#263238"
          text-color="#fff"
          active-text-color="#3691ff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router 
          :default-active="$route.path"
         
        >
          <!-- 菜单 -->
          <!-- index是点击菜单展开的标识，只能是字符串 -->
          <el-submenu :index=" items.id+''" v-for="items in menuList" :key="items.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <!-- 取这个对象的某个属性的值 -->
              <i :class="iconsObj[items.id]"></i>
              <span>{{items.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="item in items.children" 
            :key="item.id" 
            :index="'/'+item.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getMenuList} from '@/network/home'
export default {
  name: "home",
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 利用每个菜单名有自己独特的id进行绑定
      iconsObj: {
        "125": "el-icon-user-solid",
        "103": "el-icon-s-tools",
        "101": "el-icon-s-goods",
        "102": "el-icon-s-order",
        "145": "el-icon-s-data"
      },
      // 默认不折叠
      isCollapse: false
    };
  },
  // 页面一旦创建就要请求数据
  created() {
    // 调用方法
    this.getMenuList();
  },
  methods: {
    // 实现登录退出功能
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await getMenuList();
      console.log(res)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      // console.log(res);
    },
    // 切换isCollapse为true/false，是否折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  height: 100vh;
}
.el-header {
  background-color: #3691ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 20px;
    color: white;
    display: inline-block;
    width: 200px;
  }
  .el-icon-s-fold:before,
  .el-icon-s-unfold:before {
    color: #fff;
    font-size: 20px;
  }
}
.el-aside {
  background-color: #263238;
  .uesr-avatar {
    margin-top: 10px;
    color: #848a8e;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100px;
    img {
      border-radius: 50%;
      border: 3px solid #eee;
      overflow: hidden;
      height: 60px;
      width: 60px;
    }
  }
  .el-menu {
    border-right: none;
  }
}
</style>