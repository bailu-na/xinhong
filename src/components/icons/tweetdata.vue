<!-- 推文管理 -->
<script setup>
import { ElMessage } from "element-plus";
import { inject, onMounted,ref } from "vue";
const api=inject('api')
let datalist=ref([]);
let theme=ref('');
let dialogFormVisible=ref(false);
const coverformData = new FormData();
const contentformData=new FormData();
let  coverhttpRequest=(option)=>{
    
    coverformData.append('file',option.file)
}
let coverhandleRemove=(option)=>{
    coverformData.delete('file', option.file);
}
let  contenthttpRequest=(option)=>{
    
    contentformData.append('file',option.file)
}
let contenthandleRemove=(option)=>{
    contentformData.delete('file', option.file);
}
let upload=()=>{
    const date = new Date(); // 创建一个 Date 对象，表示当前时间
      const year = date.getFullYear(); // 获取年份
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，并确保格式为两位数
      const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并确保格式为两位数
      const hours = String(date.getHours()).padStart(2, '0'); // 获取小时，并确保格式为两位数
      const minutes = String(date.getMinutes()).padStart(2, '0'); // 获取分钟，并确保格式为两位数
       coverformData.append('time',`${year}-${month}-${day} ${hours}:${minutes}`);
        coverformData.append('title',theme.value)
        api.update_tweetcontent(contentformData,()=>{
            api.update_tweet(coverformData,(res)=>{
                
                if(res.data.status==202)
                {
                    ElMessage({ type: 'success',message: '发布成功' })
                    api.getalltweet((res)=>{
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
onMounted(()=>{
    api.getalltweet((res)=>{
        if(res.data.status==200)
        {
            
            datalist.value=res.data.data
        }
        else{
            ElMessage('获取出错！！！')
        }
    })
})
let deleteTweet=(title)=>{
    ElMessageBox.confirm(
    '确定删除推文吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }

  ).then(()=>{
    api.delete_tweet(title,(res)=>{
        if(res.data.status==202)
        {
            ElMessage({
        type: 'success',
        message: '删除成功',
      })
        api.getalltweet((res)=>{
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
            ElMessage('删除失败')
        }
    })
  })
}
</script>
<template>
    <div class="main">
       
       <div class="center">
        <el-button type="primary" @click="dialogFormVisible = true" size="large" style="font-size: medium;"><el-icon><CirclePlusFilled /></el-icon>&nbsp;&nbsp;发布推文</el-button>
        <el-dialog v-model="dialogFormVisible" title="新增推文内容">
            <el-form class="content" label-position="left" label-width="70" >
                    <el-form-item label="推文主题" >
                        <el-input   v-model="theme"></el-input>
                    </el-form-item>
                    <el-form-item label="推文封面">
                        <el-upload  :http-request="coverhttpRequest" multiple :show-file-list="true" list-type="picture-card" limit="1"  :on-remove="coverhandleRemove">
                            <el-icon><Plus /></el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="推文内容">
                        <el-upload  :http-request="contenthttpRequest" multiple :show-file-list="true" list-type="picture-card" limit="1"  :on-remove="contenthandleRemove">
                            <el-icon><Plus /></el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-button @click="upload" type="primary" size="large">发布</el-button>
                </el-form>
        </el-dialog>
        <el-table :data="datalist" style="width: 100%;margin-top: 20px;;" stripe border :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }" height="100%"
        fit="false" :default-sort="[{ prop: 'like_num', order: 'descending' },{prop:'read_num',order:'descending'}]">
        <el-table-column type="index" label="序号" width="150">
      </el-table-column>
            <el-table-column  prop="title" label="推文标题" width="150" />
            <el-table-column prop="like_num" label="点赞数" width="120"  sortable/>
            <el-table-column prop="read_num" label="阅读数" width="120"  sortable/>
            <el-table-column prop="o_photo" label="封面照片" width="120">
                <template v-slot="{ row }">
                    <el-image :src="row.o_photo" alt="封面照片" loading="lazy" :preview-src-list="[row.o_photo]" style="max-width: 100%; max-height: 100%;" preview-teleported></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="内容照片" width="400">
                <template v-slot="{ row }">
                    <el-image :src="row.content" alt="内容照片" class="img" loading="lazy" :preview-src-list="[row.content]" preview-teleported></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="send_time" label="发布时间" width="160" />
            <el-table-column fixed="right" label="操作" width="120">
            <template #default="{ row }">
                <el-button link type="primary" @click="deleteTweet(row.title)">删除</el-button>
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