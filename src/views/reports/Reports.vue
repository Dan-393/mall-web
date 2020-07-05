<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域-->
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 700px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
// 使用_将两个对象合并
import _ from 'lodash'
export default {
  name: "Reports",
  data(){
    return {
      // 需要合并的选项
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      // 合并后的数据
      mergedData:{}

    }
  },
  created() {},
  // 需要在Dom挂载之后才加载echarts
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 图表的配置和数据
    const {data:res} = await this.$http.get('reports/type/1')
    console.log(res.data)
    if(res.meta.status!==200 ) return this.$message.error('获取折线图数据失败')
    this.mergedData=_.merge(res.data,this.options)
    // console.log()
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(this.mergedData);
  }
};
</script>
<style lang='less' scoped>
</style>