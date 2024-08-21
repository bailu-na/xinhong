<script setup>
import { ElMessage } from "element-plus";
import { inject, onMounted,ref } from "vue";
const api=inject('api')
let datalist=ref([])
onMounted(()=>{
    api.getTeacher((res)=>{
       if(res.data.status==200)
       {
        datalist.value=res.data.data
       }
       else{
        ElMessage('获取出错')
       }
    })
})
</script>
<template>
    <div class="main">
      <div class="center">
        <el-table :data="datalist" style="width: 100%;margin-top: 20px;;" stripe border :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }" height="100%"
        fit="false">
        <el-table-column type="index" label="序号" width="150">
      </el-table-column>
            <el-table-column  prop="name" label="姓名" width="150" />
            <el-table-column prop="message" label="个人介绍" width="150" />
            <el-table-column prop="work_place" label="工作地点" width="150" />
            <el-table-column prop="reservation_phone" label="电话号码" width="150"/>
            <el-table-column  prop="work_time" label="工作时间" width="180" />
        </el-table>
      </div>
    </div>
</template>
<style scoped>
.main{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.center{
    margin-top: 10px;

}
</style>