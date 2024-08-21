<script setup>
import { ElMessage } from "element-plus";
import {ref,onMounted, inject } from "vue";
import * as XLSX from 'xlsx'
const myTable = ref(null);
const api=inject('api');
let TotalRanking=ref([])
let logout=()=>{
    const selectedAttributes = [ 'studentid','integral','yearintegral','monthlyintegral','phonenumber'];
    const filteredData = myTable.value.store.states.data._rawValue.map(item => {
    const newItem = {};
    selectedAttributes.forEach(attr => {
      newItem[attr] = item[attr];
    });
    return newItem;
  });

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    ws['A1'].v='学号'
    ws['B1'].v='总积分'
    ws['C1'].v='年度积分'
    ws['D1'].v='月季积分'
    ws['E1'].v='电话号码'
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 
    XLSX.writeFile(wb, '积分排行表.xlsx');
}
onMounted(()=>{
    api.getTotalRanking((res)=>{
        if(res.data.status==200)
        {
            TotalRanking.value=res.data.data
           
        }
        else{
            ElMessage('获取失败')
        }
    })
})
let isshow=ref(false)
let scroll=(oj)=>{
    if(oj.scrollTop>=300)
    {
        isshow.value=true
    }
    else{
        isshow.value=false;
    }
}
let returnTop=()=>{
   scroll.setScrollTop(0);
}
</script>
<template>
    <el-scrollbar class="main" always @scroll="scroll" ref="scroll">
        <div class="backtop" v-show="isshow"><el-icon style="font-size:30px;" @click="returnTop"><Top /></el-icon></div>
    <div class="center">
    
    <el-button type="primary" size="large" @click="logout"><el-icon><Download /></el-icon>导出</el-button>
    <el-table :data="TotalRanking" style="width: 100%;margin-top: 20px;" stripe border :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }" height="100%"
        fit="false" :default-sort="[{ prop: 'integral', order: 'descending' },{prop:'yearintegral',order:'descending'},{prop:'monthlyintegral',order:'descending'}]" ref="myTable">
        <el-table-column type="index" label="序号" width="150">
      </el-table-column>
            <el-table-column  prop="nick_name" label="昵称" width="150" />
            <el-table-column prop="integral" label="总积分" width="150"  sortable/>
            <el-table-column prop="yearintegral" label="年度积分" width="150"  sortable/>
            <el-table-column prop="monthlyintegral" label="月季积分" width="150" sortable/>
            <el-table-column  prop="phonenumber" label="手机号" width="180" />
            <el-table-column prop="studentid" label="学号" width="180"/>
            </el-table>
    </div>
</el-scrollbar>
    
</template>
<style scoped>
.main{
    width: 100%;
    height: calc(100vh - 60px) !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    
 
}
.center{
    margin-top: 10px;
    height: 100%;

}
.backtop{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: absolute;
    right: 30px;
    bottom: 30px;
    border: 3px solid #79bbff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #79bbff;
}
</style>