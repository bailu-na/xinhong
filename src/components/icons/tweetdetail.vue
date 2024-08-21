<script setup>
    import{inject, onMounted,ref} from 'vue'      
    const api=inject('api')
    let listdata=ref([])
    onMounted(()=>{
        api.getTweetData((res)=>{
          listdata.value=res.data.data[0]
        })
    })
</script>
<template>
    <div class="main">
        <div class="part" style="background-color: orange;">发布推文数：{{ listdata.num }}</div>
        <div class="part" style="background-color:#79bbff ;">推文点赞数：{{ listdata.like_num }}</div>
        <div class="part" style="background-color:goldenrod ;">推文阅读数：{{ listdata.read_num }}</div>
        <div class="part" style="background-color:aquamarine;">推文评论数：{{ listdata.reply }}</div>
    </div>
</template>
<style scoped>
.main{
    width: 100%;
    height: calc(100vh - 60px) !important;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    
}
.part{
    width: 40%;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(0,0,0,.05);
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0,0,0,.05);
    font-size: 30px;
}
.part:hover{
    
    transform: translateY(-10px);
    transition: color 0.3s, transform 0.3s; 
    cursor: pointer;
  
}
</style>