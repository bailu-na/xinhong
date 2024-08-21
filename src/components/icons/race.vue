<!-- 推文管理 -->
<script setup>
import { descriptionProps, ElMessage } from "element-plus";
import { inject, onMounted,ref } from "vue";
const api=inject('api')
let datalist=ref([]);
let dialogFormVisible=ref(false)
let racename=ref('')
let name=ref('')
let time=ref('')
let number=ref('')
let loaction=ref('')
let content=ref('')
let nowid=ref('')
let Registration=ref(false)
let formdata=new FormData()
let result=ref('')
let checklist=(id,resulted)=>{
    nowid.value=id
    Registration.value=true
    result.value=resulted
}
let uploadresult=()=>{
    api.uploadresult(nowid.value,result.value,(res)=>{
        Registration.value=false
        result.value=''
        if(res.data.status==200)
          {
            ElMessage({ type: 'success',message: '发布成功' })
            api.getrace((res)=>{
                if(res.data.status==200)
                {
                    
                    datalist.value=res.data.data
                }
                else{
                    ElMessage('发布失败')
                }
            })
          }
          else{
            ElMessage('发布失败')
          }
    })
}
let upload=()=>{
    formdata.append('racename',racename.value)
    formdata.append('name',name.value)
    formdata.append('time',time.value)
    formdata.append('number',number.value)
    formdata.append('loaction',loaction.value)
    formdata.append('content',content.value)
    api.race(formdata,(res)=>{
        formdata=new FormData()
        racename.value=''
        name.value=''
        time.value=''
        number.value=''
        loaction.value=''
        content.value=''
        dialogFormVisible.value=false
        if(res.data.status==200)
          {
            ElMessage({ type: 'success',message: '发布成功' })
            api.getrace((res)=>{
                if(res.data.status==200)
                {
                    
                    datalist.value=res.data.data
                }
                else{
                    ElMessage('发布失败')
                }
            })
          }
          else{
            ElMessage('发布失败')
          }
    })
}
onMounted(()=>{
    api.getrace((res)=>{
        if(res.data.status==200)
        {
            
            datalist.value=res.data.data
        }
        else{
            ElMessage('发布失败')
        }
    })
})
</script>
<template>
    <div class="main"> 
       <div class="center">
        <el-button type="primary" @click="dialogFormVisible = true" size="large" style="font-size: medium;"><el-icon><CirclePlusFilled /></el-icon>&nbsp;&nbsp;发布比赛</el-button>
        <el-dialog v-model="dialogFormVisible" title="发布比赛" center align-center>
            <el-form class="content" label-position="right" label-width="100" >
                <el-form-item label="比赛名字" >
                        <el-input   v-model="racename"></el-input>
                    </el-form-item>
                <el-form-item label="发布者名字" >
                    <el-input   v-model="name"></el-input>
                    </el-form-item>   
                    <el-form-item label="活动时间" >
                        <el-input   v-model="time"></el-input>
                    </el-form-item>
                    <el-form-item label="活动地点" >
                        <el-input   v-model="loaction"></el-input>
                    </el-form-item>
                    <el-form-item label="活动内容" >
                        <el-input   v-model="content"></el-input>
                    </el-form-item>
                    <el-form-item label="比赛人数" >
                        <el-input   v-model="number"></el-input>
                    </el-form-item>
                    <el-button @click="upload" type="primary" size="large">发布</el-button>
                </el-form>
        </el-dialog>
        <el-dialog v-model="Registration" title="上传结果" center align-center>
            <el-form class="content" label-position="left" label-width="100" >
                
                <el-form-item label="比赛结果" >
                        <el-input   v-model="result"></el-input>
                    </el-form-item>
                    <el-button @click="uploadresult" type="primary" size="large">上传</el-button>
            </el-form>
        </el-dialog>
        <el-table :data="datalist" style="width: 100%;margin-top: 20px;;" stripe border :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }" height="100%"
        fit="true">
        <el-table-column type="index" label="序号" width="150">
      </el-table-column>
             <el-table-column prop="racename" label="比赛名字" width="150">
            </el-table-column>
            <el-table-column prop="name" label="发布者名字" width="200">
             
            </el-table-column>
            <el-table-column prop="time" label="比赛时间" width="120"/>
           
            <el-table-column prop="content" label="活动内容" width="160" />
            <el-table-column prop="loaction" label="活动地点" width="160" />
            <el-table-column prop="time" label="活动时间" width="160" />
            <el-table-column prop="team" label="应战方" width="160" />
            <el-table-column prop="class" label="应战班级" width="160" />
            <el-table-column prop="responsesName" label="姓名" width="160" />
            <el-table-column prop="studentid" label="学号" width="160" />
            <el-table-column prop="result" label="比赛结果" width="160" />
            
                <el-table-column prop="timelimit" label="操作" width="160" fixed="right">
                <template v-slot="{ row }">
                    <el-button link type="primary" @click="checklist(row.id,row.result)">上传比赛结果</el-button>
                </template>
                </el-table-column>
          
            </el-table>
            
       </div>
    </div>
</template>
<style scoped>
    .main{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }
    .center{
        width: 90%;
        margin-top: 30px;
    }
    .img{
        width: 50px;
        height: 50px;
    }
    .content{
        text-align: right;
    }
</style>