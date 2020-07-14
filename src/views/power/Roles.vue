<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table 
      :data="rolelist"
      border
      style="width: 100%"
      >
      <!-- 展开列 -->
        <el-table-column type="expand" width="50%">
          <!-- 角色下对应的权限信息进行渲染 -->

          <!-- 获取当前角色的数据 -->
          <template v-slot="scope">
            <!-- 使用栅格布局 -->
            <el-row :class="['bdbottom',index1===0 ? 'bdtop':'','vcenter']"  v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close='removeRightById(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限  -->
              <el-col :span="19">
                  <el-row :class="[index2 !==0 ? 'border-top':'','vcenter']" v-for="(item2,index2) in item1.children" :key='item2.id' >
                  <el-col :span='6'>
                    <el-tag type="success" @close='removeRightById(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag v-for=" item3 in item2.children" :key='item3.id'
                            closable @close='removeRightById(scope.row,item3.id)'>
                            {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50%" />
        <el-table-column prop="roleName" label="角色名称"/>
        <el-table-column prop="roleDesc" label="角色描述"/>
        <el-table-column label="操作" >
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetAddRolesForm">
      <el-form :model="addRolesForm" ref="addRolesFormRef" label-width="100px" :rules="addRolesFormRules" >
        <el-form-item label="角色名称" prop="roleName" >
          <el-input  v-model='addRolesForm.roleName'></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input  v-model='addRolesForm.roleDesc'></el-input>
        </el-form-item>
      </el-form>    
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editRolesForm" ref="editRolesFormRef" label-width="100px" :rules="editRolesFormRules" >
        <el-form-item label="角色名称" prop="roleName" >
          <el-input  v-model='editRolesForm.roleName'></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input  v-model='editRolesForm.roleDesc'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close='setRightDialogClosed'>
      <el-tree :data="rightslist" :props="treeProps" 
       show-checkbox default-expand-all node-key="id"
       :default-checked-keys="defKeys" ref='treeRef'>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRolesList,addRoles,deleteRoles,getRoles,editRole,removeRight,getRightsTree,allotRight} from '@/network/power'
export default {
  name:'Roles',
  data(){
    return {
      rolelist:[],
      // 添加对话框的显示与隐藏
      addDialogVisible:false,
      // 增加的角色信息
      addRolesForm:{
        roleName:'',
        roleDesc:''
      },
      // 添加角色的校验规则
      addRolesFormRules:{
        roleName: [
          {required:true,message:"请输入角色名称",trigger:'blur'},
        ]
      },
      // 编辑对话框的显示与隐藏
      editDialogVisible :false,
      // 编辑角色的信息==根据用户id查询后返回的数据
      editRolesForm:{},
      // 编辑角色的校验规则
      editRolesFormRules:{
        roleName: [
          {required:true,message:"请输入角色名称",trigger:'blur'},
        ]
      },

      // 分配权限的对话框的显示与隐藏
      setRightDialogVisible:false,
      // 所有权限的数据
      rightslist:[],
      // 树形控件的属性绑定对象
      treeProps:{
        label: 'authName',
        children: 'children'
      },
      // 默认被选中的节点的id值的数组
      defKeys:[],
      //即将分配的角色id
      roleId:'',
      
      
      

    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    // 获取角色列表
    async getRolesList(){
    const {data:res} = await getRolesList()
    // console.log(res)
    if(res.meta.status !== 200 ) return this.$message.error('请求角色列表信息失败')
    this.rolelist = res.data;
    // console.log(this.rolelist)
    },
    // 重置添加对话框的表单
    resetAddRolesForm(){
      this.$refs.addRolesFormRef.resetFields()
    },
    // 添加角色
    addRoles(){
      this.$refs.addRolesFormRef.validate(async valid =>{
        if(!valid) return 
        // 发起请求
        console.log(this.addRolesForm)
        const {data:res} =  await addRoles(this.addRolesForm)
        if(res.meta.status !== 201) return this.$message.error("添加用户失败")
        this.addDialogVisible = false
        this.$message.success("用户添加成功")
        this.getRolesList()
      })
    },
    // 编辑角色信息

    // 删除角色,参数为角色的id
    async removeRoleById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // if选择 确定 返回 confirm 字符串
      // if选择 取消 返回 cancel 字符串
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // 当选择确定时候，发出请求
      const {data:res} = await deleteRoles(id)
      if(res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除用户成功！')
      this.getRolesList()
    },
    // 编辑角色对话框的展示,参数 用户id
    async showEditDialog(id){
      const {data :res} = await getRoles(id)
      if(res.meta.status !== 200 )  return this.$message.error('获取用户信息失败')
      this.editRolesForm = res.data
      this.editDialogVisible = true
    },
    // 编辑角色
    editRole(){
      this.$refs.editRolesFormRef.validate(async valid =>{
        if(!valid) return 
        const {data :res} = await editRole(this.editRolesForm)
        if(res.meta.status != 200) return this.$message.error('修改用户信息失败')
        this.editDialogVisible = false


        this.$message.success('修改角色信息成功')
        this.getRolesList()    
      })
    },
    // 删除角色权限
    async removeRightById(role,rightId){
      const confirmResult = await this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
      }).catch(err => err)
      // if选择 确定 返回 confirm 字符串
      // if选择 取消 返回 cancel 字符串
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // 发出删除权限请求
      // console.log(rightId)
      const {data:res} = await removeRight(role.id,rightId)
      console.log(res) 
      if(res.meta.status !== 200) return this.$message.error('取消角色权限失败')
      this.$message.success('取消角色权限成功')
      this.rolelist.children = res.data
    },


    // 分配权限对话框的展示
    // 参数，role的设置
    async showSetRightDialog(role){
      this.roleId = role.id
      // 获取所有权限的数据
      const {data : res} = await getRightsTree()
      if(res.meta.status !== 200) return this.$message.error('获取所有权限失败')
      this.rightslist = res.data
      // console.log(this.rightslist)
      // this.defKeys=this.getLeafKeys(role,this.defKeys)
      // 无需接受返回值，因为传入的数组已被push数据，地址传递
      this.getLeafKeys(role,this.defKeys)
      // console.log(this.defKeys)
      this.setRightDialogVisible=true
    },
    setRightDialogClosed(){
      this.defKeys=[]
    },
    // 通过递归函数，获取角色下所有三级权限的id值，存放在defKeys数组中
    // 参数node节点，arr数组
    getLeafKeys(node,arr){
      // 当前节点不包含children，就是三级节点
      if(!node.children){
        // console.log(node.id)
        return arr.push(node.id)
      }
      // 如果包含节点，遍历递归该函数
      node.children.forEach( item => {
        this.getLeafKeys(item,arr)
      })
    },
    // 为角色分配权限
    async allotRight(){
      // 获取当前被勾选的选项
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      // console.log(keys)获取的是数字数组
      const idStr = keys.join(',')
      // console.log(idStr)
      const {data:res} = await allotRight(this.roleId,idStr)
      if(res.meta.status!==200) return this.$message.error('分配权限失败！')

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}

</script>
<style lang="less" scoped>
  .el-table {
    margin-top: 15px;
  }
  .el-tag {
    margin: 8px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>