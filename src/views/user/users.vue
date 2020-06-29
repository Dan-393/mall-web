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
          <el-input placeholder="请输入搜索内容"  class="input-with-select" v-model="queryInfo.query"  clearable @clear="getUserList">
          <el-button slot="append" icon="el-icon-search"  @click="getUserList"></el-button>
          </el-input>
         </el-col>
        <el-col :span="6"><el-button type="primary" @click="addDialogVisible = true">添加用户</el-button></el-col>
      </el-row>
      <el-table
      :data="uesrlist"
      border
      style="width: 100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="username" label="用户名" width="100" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" width="150" />
        <el-table-column label="状态" width="120">
          <!-- 数据通过:data="uesrlist" 以及传到子组件中-->
          <!-- 通过v-slot插槽+-接受当前作用域的数据 -->
          <template v-slot='slotProps'>
            <!-- 当前行的数据 -->
            <!-- {{slotProps.row}} -->
            <el-switch v-model="slotProps.row.mg_state"  @change="changeMgstate(slotProps.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" class='icon-conllinear' width="200">
          <template v-slot="scope" >
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
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
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5, 8,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetAddForm">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules"  label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%" 
       @close="resetEditForm">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules"  label-width="70px">
        <el-form-item label="用户名" >
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Users',
  data(){
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
      };
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
      // 验证邮箱是否合法
      var validateEmail = (rule, value, callback) => {
        var regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/; 
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } else if(!regEmail.test(value)){
          callback(new Error('你输入的邮箱不合法'));
        }else {
          callback();
        }
      };
      // 验证手机号是否合法
      var validatePhone = (rule, value, callback) => {
        var regPhone = /^1(3|4|5|6|7|8|9)\d{9}$/; 
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if(!regPhone.test(value)){
          callback(new Error('你输入的手机号不合法'));
        }else {
          callback();
        }
      };
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
      addDialogVisible:false,
      // 添加表单的数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      addFormRules:{
       username: [
            {require:true, validator: validateUserName, trigger: 'blur' }
          ],
        password: [
            {require:true, validator: validatePass, trigger: 'blur' }
          ],
        email: [
            {require:true, validator: validateEmail, trigger: 'blur' }
          ],
        mobile: [
            {require:true, validator: validatePhone, trigger: 'blur' }
          ],
      },
      // 对话框的显示与隐藏
      editDialogVisible:false,
      // 根据用户id查询后返回的数据
      editForm:{},
       editFormRules:{
        email: [
            {require:true, validator: validateEmail, trigger: 'blur' }
          ],
        mobile: [
            {require:true, validator: validatePhone, trigger: 'blur' }
          ],
      },
    }
  },
  // 页面一开始加载就调用该函数
  created(){
    this.getUserList();
  },
  methods:{
    async getUserList(){
      //发送网络请求
      const {data:res} = await this.$http.get('users', {params:this.queryInfo})
      // console.log(res)
      if(res.meta.status !=200 ) return this.$message.error('获取用户列表失败')
      this.uesrlist = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    
    handleSizeChange(pagesize){
      // 将监听后的值保存到父组件的data中
       this.queryInfo.pagesize = pagesize
       this.getUserList()
    },
    // 监听switvh开关状态的改变
    async changeMgstate(userInfo){
      // 调用api接口，将最新的状况保存到数据库
     const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
     if(res.meta.status !== 200){
       //  失败需要将已修改的状态还原
      userInfo.mg_state = !userInfo.mg_state
      return this.$message.error("更新用户状态失败")
     }
      this.$message.success("更新用户状态成功")
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(pagenum){
      this.queryInfo.pagenum = pagenum
      this.getUserList()
    },
    // 重置添加用户表单
    resetAddForm(){
       this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser(){
      // 对填入的书进行统一校验
      this.$refs.addFormRef.validate( async valid => {
        if(!valid) return 
        // 发起添加用户api请求
        const {data:res} =  await this.$http.post('users',this.addForm)
        // 隐藏对话框
        console.log(res)
        if(res.meta.status !== 201) {
          this.$message.error(res.meta.msg);
          return 
        }
        this.$message.success("添加用户成功")

        this.addDialogVisible = false
        this.getUserList()
      })
    },

    // 修改对话框的展示
    async showEditDialog(id){
      this.editDialogVisible = true
      // console.log(id)
      // 根据id查询用户的信息
      const {data:res} = await this.$http.get(`users/${id}`)
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error("获取用户信息失败")
      this.editForm = res.data
      // console.log(this.editForm)
    },
    // 修改对话框关闭后的表单重置
    resetEditForm(){
       this.$refs.editFormRef.resetFields();
    },
    //修改用户
    editUser(){
      // 提交表单前的预验证
      this.$refs.editFormRef.validate(async valid  =>{
        // console.log(valid)
        if(!valid) return 
        const {data:res} = await this.$http.put(
          `users/`+this.editForm.id,{
            email:this.editForm.email,
            mobile:this.editForm.mobile
          })
        // console.log(res)
        if(res.meta.status !== 200) return this.$message.err("更新用户信息失败")
        // 关闭对话框
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success("更新用户信息成功")
      })
    },
    // 根据id删除对应的用户信息
    async removeUserById(id){
      const confirmResult = await  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // if选择 确定 返回 confirm 字符串
        // if选择 取消 返回 cancel 字符串
      // console.log(confirmResult)
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const {data: res} = await this.$http.delete(`users/${id}`);
      // 注意，当你await没有写的时候，你得到的res是ndefined
      // console.log(res)
      if(res.meta.status !==200 ) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  },
  
}
</script>
<style lang="less" scoped>
  .el-table {
    margin-top: 15px;
  }
  .el-pagination {
    margin-top: 15 px;
  }
</style>