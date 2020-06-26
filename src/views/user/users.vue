<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域-->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容"  class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
         </el-col>
        <el-col :span="6"><el-button type="primary">添加用户</el-button></el-col>
      </el-row>
      <el-table
      :data="uesrlist"
      border
      style="width: 100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="username" label="姓名" width="100" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" width="150" />
        <el-table-column label="状态" width="120">
          <!-- 数据通过:data="uesrlist" 以及传到子组件中-->
          <!-- 通过v-slot插槽+-接受当前作用域的数据 -->
          <template v-slot='slotProps'>
            <!-- 当前行的数据 -->
            <!-- {{slotProps.row}} -->
            <el-switch v-model="slotProps.row.mg_state" />
          </template>
        </el-table-column>
        <el-table-column label="操作" class='icon-conllinear' width="200">
          <template v-slot="scope" >
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="warning" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
               <el-button type="danger" icon="el-icon-s-tools" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页页表条区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
 
    </el-card>
  </div>
</template>

<script>
export default {
  name:'Users',
  data(){
    return {
      // 获取用户列表的参数对象
      queryInfo:{
        // 查询参数
        query:'',
        // 当前页码
        pagenum:1,
        // 每条显示数
        pagesize:3,
      },
      uesrlist:[],
      total:0,
    }
  },
  // 页面一开始加载就调用该函数
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
      //发送网络请求
      const {data:res} = await this.$http.get('users', {params:this.queryInfo})
      console.log(res)
      if(res.meta.status !=200 ) return this.$message.error('获取用户列表失败')
      this.uesrlist = res.data.users
      this.total = res.data.total
    }
  }
}

</script>
<style lang="less" scoped>
  .el-table {
    margin-top: 15px;
  }
</style>