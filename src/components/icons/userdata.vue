<script setup>
import { inject, onMounted,ref} from "vue";
import * as echarts from 'echarts';
// 初始化新的数组，用于存放 ECharts 需要的数据格式
const echartData = [];
let teacherNumber=ref(0)
onMounted(()=>{
api.getnumber((res)=>{
    if(res.data.status==200)
        {
             allnumber.value=res.data.data[0].num
        }
    })
api.getincreasenumber((res)=>{
    // 遍历原始数据
    res.data.data.forEach(element => {
    // 提取时间和计数值
     const time = element.time;
     const countnum = parseInt(element.countnum); // 转换为数字，确保是数值型数据

    // 构建新的对象，包含 x 轴和 y 轴的数据
    const newDataPoint = {
    x: time,
    y: countnum,
    };

  // 将新的对象添加到 ECharts 数据数组中
  echartData.push(newDataPoint);
})
})
api.getTeacher((res)=>{
       if(res.data.status==200)
       {
        teacherNumber.value=res.data.data.length
       }
       else{
        ElMessage('获取出错')
       }
    })
setTimeout(()=>{
   
    let myChart = echarts.init(document.getElementById('graphics'));
    myChart.setOption({
    legend: {
          data: ['用户数量'], 
          top:'5%'
        },
   grid: {
        left: '5%',       // grid 组件离容器左侧的距离。
        right: '5%',      // grid 组件离容器右侧的距离。
        top: '15%',        // grid 组件离容器顶部的距离。
        bottom: '5%',     // grid 组件离容器底部的距离。
        containLabel: true // 包含坐标轴的标签在内
    },
    tooltip: {
        trigger: 'axis', // 触发类型，默认数据项触发，可选为：'item' | 'axis'
        axisPointer: {  // 坐标轴指示器配置项。
            type: 'cross', // 十字准星指示器，显示横纵两个坐标轴的虚线。
            crossStyle: {
                color: '#1e90ff', // 十字准星颜色
                width: 1, // 十字准星线宽
                type: 'dashed', // 十字准星线的类型为虚线
                // 其他样式设置
            },
            label: {
                backgroundColor: '#6a7985' // 指示器的标签背景颜色
            },
            // 其他配置...
        }
    },
   xAxis: {
    data: echartData.map(datapoint=>datapoint.x),
    boundaryGap: false 
  },
  yAxis: {
    type: 'value',
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']  // 交替的颜色
            }
        }
  },
  series: [
    {
    name:'用户数量',
      data: echartData.map(datapoint=>datapoint.y),
      type: 'line',
      smooth: true,
      itemStyle:{
        normal:{
            color:'blue'
        }
      }
    }
  ]
});
},300)
})
let api=inject('api');
let allnumber=ref(0)

</script>
<template>
    <div class="main">
        <div class="header">
            <div class="usernumber head-item">
                <el-icon size="90px">
                    <Avatar />
                </el-icon>
                <div class="showdata">
                    <div>用户总量</div>
                    <div>{{ allnumber }}</div>
                    
                </div>
            </div>
            <div class="head-item" style="color: #79bbff;">
                <el-icon size="90px">
                    <Avatar />
                </el-icon>
                <div class="showdata">
                    <div>教师数量</div>
                    <div>{{ teacherNumber }}</div>
                    
                </div>
            </div>
            <div class="head-item" style="color: orange;">
                <el-icon size="90px">
                    <Avatar />
                </el-icon>
                <div class="showdata">
                    <div>学生数量</div>
                    <div>{{ allnumber-teacherNumber }}</div>
                    
                </div>
            </div>
        </div>
        <div id="graphics"></div>
    </div>
</template>
<style scoped>
.main{
      display: flex;
      flex-direction: column;
      padding-top: 30px;
      padding-bottom: 30px;
      width: 100%;
      align-items:center;
}
.header{
    
    width: 90%;
    height: 150px;
    display: flex;
    justify-content: space-between;
}
.head-item{
    border: 1px solid rgba(0,0,0,.05);
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0,0,0,.05);
    width: 30%;
    display: flex;
    justify-content:space-around;
    align-items: center;
    text-align: center;
    color: #95d475;
}
.head-item:hover{
    
    transform: translateY(-10px);
    transition: color 0.3s, transform 0.3s; 
    cursor: pointer;
  
}
.showdata{
    font-size: 20px;
}
#graphics{
    width: 90%;
    height: 350px;
    background-color: #fff;
    margin-top: 60px;
    
}
</style>