<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        :data="rightsList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          width="50%"/>
        <el-table-column
          prop="authName"
          label="权限名称"/>
        <el-table-column
          prop="path"
          label="路径"/>
        <el-table-column
          prop="level"
          label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level ==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level ==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getRightsList} from '@/network/power'
export default {
  name:'Rights',
  data(){
    return {
      // 权限列表数据
      rightsList:[]
    }
  },
  // 模板编译进入路由前调用该方法
  created(){
    this.getRightsList();
  },
  
  methods:{
    // 向API接口请求权限列表数据
    async getRightsList(){
      const{data:res} = await getRightsList()
      // console.log(res.data)
      this.rightsList = res.data 
    }
  }
}

</script>
<style scoped>
</style>