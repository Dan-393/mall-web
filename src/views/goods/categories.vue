<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table :data="catelist" :columns='columns'
      :selection-type="false" :expand-type="false"
      show-index border>
        <!-- 是否有效 -->
        <template  v-slot:isok='scope'>
          <i class="el-icon-success" style="color:lightgreen;"
          v-if="scope.row.cat_deleted===false"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order='scope'>
          <el-tag size='mini' v-if='scope.row.cat_level === 0'>一级</el-tag>
          <el-tag size='mini' type="success" v-else-if='scope.row.cat_level === 1'>二级</el-tag>
          <el-tag size='mini' type="warning" v-else>三级</el-tag>
        </template>
        <template v-slot:option='scope'>
          <el-button type="primary" size='mini' class="el-icon-edit">编辑</el-button>
          <el-button type='danger' size='mini' class="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,8,12,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>


    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close='addCateDialogClosed'>
        <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" >
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="handleChange"
              clearable>
            </el-cascader>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getCateList,getParentCateList,addCate} from '@/network/goods'
export default {
  data(){
    return {
      //查询商品分类列表的参数
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 商品分类列表
      catelist:[],
      //总数据条数
      total:0,
      // 为table指定列的含义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          // 表示，将当前列定义为模板列
          type:'template',
          // 表示当前列使用的模板名称
          template:'isok'
        },
        {
          label:'排序',
          type:'template',
          template:'order'
        },
        {
          label:'操作',
          type:'template',
          template:'option'
        }
      ],
      // 添加分类对话框的显示与隐藏
      addDialogVisible:false,
      addForm:{
        // 分级分类的id
        cat_pid:0,
        // 分类的等级，默认要添加的是1级分类
        cat_level:0,
        // 要添加的分类名
        cat_name:'',
      },
      // 添加分类表单的验证规则对象
      addFormRules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      // 父级分类的列表
      parentCateList:[],
      // 指定级联选择器的配置对象
      cascaderProps:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly:true
      },
      selectedKeys:[]
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){
      const {data:res} = await getCateList(this.queryInfo)
      // console.log(res)
      if(res.meta.status !==200 ) return this.$message.error('获取商品分类列表数据失败')
      // 将数据列表，赋值给catelist
      this.catelist = res.data.result
      // console.log(this.catelist)
      // 为总数据条数赋值
      this.total = res.data.total
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 添加分类对话框
    addDialog(){
      this.getParentCateList()
      this.addDialogVisible = true
      // this.getParentCateList()
      
    },
    // 获得父级分类的列表
    async getParentCateList(){
      const{data:res} = await getParentCateList()
      if(res.meta.status !== 200 ) return this.$message.error('获得父级分类的列表失败')
      this.parentCateList =res.data
      // console.log(this.parentCateList)
    },
    // 被级联选择器选择项发生变化触发的事件
    handleChange(){
      // console.log(this.selectedKeys)
      if(this.selectedKeys.length > 0){
        // 分类父 ID
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
        // 当前类 的分类的等级
        this.addForm.cat_level = this.selectedKeys.length
        return 
      }else{
        this.addForm.cat_pid = 0
        this.addForm.cat_level=0
      }
    },
    addCate(){
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return 
        const {data:res} = await addCate(this.addForm)
        console.log(res)
        if(res.meta.status !== 201) return this.$message.error("添加分类失败")
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addDialogVisible = false
      })
      
    },
    // 将对话框的数据重置
    addCateDialogClosed(){
      this.$refs.addFormRef.resetFields();
      this.selectedKeys=[];
      this.addForm.cat_level=0;
      this.addForm.cat_pid = 0
    }
  }
}

</script>
<style lang="less"  scoped>
  .el-button {
    margin-bottom: 15px;
  }
  .el-pagination {
    margin-top: 15px;
  }
  .el-cascader {
    width: 100%;
  }
</style>