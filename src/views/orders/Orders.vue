<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
        <!-- 卡片视图区域-->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容"  class="input-with-select"  clearable >
          <el-button slot="append" icon="el-icon-search"  ></el-button>
          </el-input>
         </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="ordersList" border stripe style="width: 100%">
        <el-table-column type="index" width="50" ></el-table-column>
        <el-table-column  prop="order_number"  label="订单编号" width="250px">
        </el-table-column>
        <el-table-column  prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column  prop="pay_status" label="是否付款">
          <template v-slot='scope'>
            <el-tag v-if="scope.row.pay_status==='0'" type="danger" else>未付款</el-tag>
            <el-tag v-else type ='success'>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column  prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column   label="下单时间" width="190px">
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column   label="操作" width="135px">
          <el-tooltip effect="dark" content="修改订单地址" placement="bottom-end" :enterable="false">
            <el-button type="primary" size='mini' class="el-icon-edit" @click='settingDialog'></el-button>            
          </el-tooltip>
          <el-tooltip effect="dark" content="物流信息" placement="bottom-end" :enterable="false">
            <el-button type="success" size='mini' class="el-icon-location" @click="showProgressDialog"></el-button>
          </el-tooltip>  
        </el-table-column>    
      </el-table>
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
    <!-- 修改订单对话框 -->
    <el-dialog
      title="修改订单地址"
      :visible.sync="settingdialogVisible"
      width="50%"
      @close='settingdialogClosed'>
      <el-form :model="settongForm" :rules="settingFormrules" ref="settingFormRef" label-width="100px" >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="settongForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"></el-cascader> 
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="settongForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="settingdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog
      title="查看物流进度"
      :visible.sync="progressDialogVisible"
      width="50%" >
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.ftime">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import cityData from '@/components/citydata'
import {getProgress,getOrdersList} from '@/network/orders'
export default {
  name:'Orders',
  data(){
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5,
      },
      ordersList:[],
      total:0,
      settingdialogVisible:false,
      settongForm:{
        address1:[],
        address2:''
      },
      settingFormrules:{
        address1:[
            { required: true, message: '请选择省市', trigger: 'change' }
          ],
        address2:[
            { required: true, message: '请填写详细地址', trigger: 'change' }
          ],
      },
      // 省份地区信息
      cityData,

      // 物流
      progressDialogVisible:false,
      progressInfo:[]
    }
  },
  created(){
    this.getOrdersList()
  },
  methods:{
    // 获取订单列表
    async getOrdersList(){
      const{data:res} = await getOrdersList(this.queryInfo)
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取订单数据失败')
      this.ordersList = res.data.goods
      this.total = res.data.total
      console.log(this.ordersList)
    },
    // 监听页面显示几个数据的数据变动
    handleSizeChange(newPagesize){
      this.queryInfo.pagesize = newPagesize
      this.getOrdersList()
    },
    // 监听页面页码的变化
     handleCurrentChange(newPagenum){
       this.queryInfo.pagenum = newPagenum
       this.getOrdersList()
     },
    //  显示与隐藏修改地址对话框
    settingDialog(){
      this.settingdialogVisible = true
    },
    // 关闭对话框
    settingdialogClosed(){
      // 清空表单
      this.$refs.settingFormRef.resetFields()
    },
    //点击弹出物流信息对话框
    async showProgressDialog(){
      const {data:res} = await getProgress('/kuaidi/1106975712662')
      if(res.meta.status!==200) this.$message.error('获取物流信息失败')
      this.progressInfo = res.data
      // console.log(this.progressInfo)
      this.progressDialogVisible = true
    }


    
  }
}

</script>
<style lang='less' scoped>
.el-table {
  margin-top: 15px;
  margin-bottom: 15px;
}
.el-cascader {
    width: 100%;
  }
</style>