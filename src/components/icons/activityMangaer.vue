<!-- 推文管理 -->
<script setup>
import { descriptionProps, ElMessage } from "element-plus";
import { inject, onMounted,ref } from "vue";
import * as XLSX from 'xlsx'
const api=inject('api')
let datalist=ref([]);
let title=ref("")
let object=ref("");
let loaction=ref("");
let content=ref('');
let benefit=ref('');
let description=ref('')
let time=ref('')
let movie=ref('')
let groupimage=ref([])
let coverimage=ref([])
let timelimit=ref('')
let numberlimit=ref('')
let Registrationlist=ref([])
let Registration=ref(false)
let dialogFormVisible=ref(false);
let activityformdata = new FormData();
let coverformData=new FormData();
let  activityhttpRequest=(option)=>{
    
    activityformdata.append('file',option.file)
}
let activityhandleRemove=(option)=>{
    activityformdata.delete('file', option.file);
}
let  coverhttpRequest=(option)=>{
    
    coverformData.append('file',option.file)
}
let  coverhandleRemove=(option)=>{
    coverformData.delete('file', option.file);
}
/* 日期格式转化函数 */
let Dateutil=(s)=>{
    const dateObject = new Date(s)
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
    const day = dateObject.getDate();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime
}
/* 发布活动函数 */
let upload=()=>{
    activityformdata.append('object',object.value);
    activityformdata.append('loaction',loaction.value);
    activityformdata.append('content',content.value);
      activityformdata.append('time',time.value);
      activityformdata.append('benefit',benefit.value);
      activityformdata.append('description',description.value);
      activityformdata.append('movie',movie.value);   
      activityformdata.append('timelimit',timelimit.value);
      activityformdata.append('numberlimit',numberlimit.value);
      activityformdata.append('title',title.value)
      api.upload_cover(coverformData,()=>{
        api.upload_activity(activityformdata,(res)=>{
            activityformdata = new FormData();
            coverformData = new FormData();
            dialogFormVisible.value=false;
            object.value=''
            loaction.value=''
            content.value=''
            time.value=''
            benefit.value=''
            description.value=''
            movie.value=''
            timelimit.value=''
            numberlimit.value=''
            title.value=''
            coverimage.value=[]
            groupimage.value=[]
          if(res.data.status==202)
          {
              ElMessage({ type: 'success', message: '发布成功' })
            //重新获取最新的活动列表
            api.getactivity((res)=>{
                if(res.data.status==200)
                {
                    
                    datalist.value=res.data.data
                }
                else{
                    ElMessage('获取出错！！！')
                }
                })
          }
          else{
            ElMessage('发布失败')
          }
           
        })
      })     
}
let logout=()=>{
    const selectedAttributes = [ 'studentid','phonenumber'];
    const filteredData = Registrationlist.value.map(item => {
    const newItem = {};
    selectedAttributes.forEach(attr => {
      newItem[attr] = item[attr];
    });
    return newItem;
  });
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    ws['A1'].v='学号'
    ws['B1'].v='手机号'
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 
    XLSX.writeFile(wb, '活动报名情况表.xlsx');
}
onMounted(()=>{
    api.getactivity((res)=>{

        if(res.data.status==200)
        {
            
            datalist.value=res.data.data
        }
        else{
            ElMessage('获取出错！！！')
        }
    })
})
let checklist=(activityid)=>{
    api.getRegistrationlist(activityid,(res)=>{
        Registration.value=true
       if(res.data.status==200)
       {
        Registrationlist.value=res.data.data;
       }
       else{
        ElMessage('获取失败')
       }
    })
}
</script>
<template>
    <div class="main"> 
       <div class="center">
        <el-button type="primary" @click="dialogFormVisible = true" size="large" style="font-size: medium;"><el-icon><CirclePlusFilled /></el-icon>&nbsp;&nbsp;发布活动</el-button>
        <el-dialog v-model="dialogFormVisible" title="发布活动" center align-center>
            <el-form class="content" label-position="left" label-width="70" >
                <el-form-item label="活动主题" >
                        <el-input   v-model="title"></el-input>
                    </el-form-item>
                <el-form-item label="电影简介" >
                        <el-input   v-model="movie" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
                    </el-form-item>
                    <el-form-item label="活动对象" >
                        <el-input   v-model="object"></el-input>
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
                    <el-form-item label="活动福利" >
                        <el-input   v-model="benefit"></el-input>
                    </el-form-item>
                    <el-form-item label="人数限制" >
                        <el-input   v-model="numberlimit"></el-input>
                    </el-form-item>
                    <el-form-item label="报名说明" >
                        <el-input   v-model="description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
                    </el-form-item>
                    <el-form-item label="截止时间" >
                    <el-date-picker
                        v-model="timelimit"
                        type="datetime"
                        placeholder="Select date and time"
                    />
                      </el-form-item>
                    <el-form-item label="电影封面">
                        <el-upload  :http-request="coverhttpRequest" multiple :show-file-list="true" list-type="picture-card" limit="1"  :on-remove="coverhandleRemove" :file-list="coverimage">
                            <el-icon><Plus /></el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="活动报名群">
                        <el-upload  :http-request="activityhttpRequest" multiple :show-file-list="true" list-type="picture-card" limit="1"  :on-remove="activityhandleRemove" :file-list="groupimage">
                            <el-icon><Plus /></el-icon>
                        </el-upload>
                    </el-form-item>
                   
                    <el-button @click="upload" type="primary" size="large">发布</el-button>
                </el-form>
        </el-dialog>
        <el-dialog v-model="Registration" title="报名列表" center align-center>
            <el-button type="primary" size="large" @click="logout"><el-icon><Download /></el-icon>导出</el-button>
            <el-table :data="Registrationlist" style="margin-top: 20px;width: auto;" stripe border :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }" height="100%"
        fit="false">
        <el-table-column type="index" label="序号" width="150"/>
 
        <el-table-column prop="studentid" label="学号" width="300"/>
        <el-table-column prop="phonenumber" label="电话号码" width="300"/>
            </el-table>
        </el-dialog>
        <el-table :data="datalist" style="width: 100%;margin-top: 20px;;" stripe border :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }" height="100%"
        fit="true">
        <el-table-column type="index" label="序号" width="150">
      </el-table-column>
             <el-table-column prop="moviecover" label="电影海报" width="150">
                <template v-slot="{ row }">
                    <el-image :src="row.moviecover" alt="电影海报" class="img" loading="lazy" :preview-src-list="[row.moviecover]" preview-teleported></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="movie" label="电影简介" width="200">
                <template v-slot="{ row }">
                    <el-text line-clamp="3">{{row.movie}}</el-text>
                </template>
            </el-table-column>
            <el-table-column prop="benefit" label="活动福利" width="120"/>
            <el-table-column prop="group" label="活动群" width="120">
                <template v-slot="{ row }">
                    <el-image :src="row.group" alt="活动群" loading="lazy" :preview-src-list="[row.group]" style="max-width: 100%; max-height: 100%;" preview-teleported></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="活动内容" width="160" />
            <el-table-column prop="loaction" label="活动地点" width="160" />
            <el-table-column prop="time" label="活动时间" width="160" />
            <el-table-column prop="timelimit" label="报名截止时间" width="160">
                <template v-slot="{ row }">
                    <el-text>{{ Dateutil(row.timelimit) }}</el-text>
                </template>
                </el-table-column>
                <el-table-column prop="timelimit" label="操作" width="160" fixed="right">
                <template v-slot="{ row }">
                    <el-button link type="primary" @click="checklist(row.id)">查看报名情况</el-button>
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