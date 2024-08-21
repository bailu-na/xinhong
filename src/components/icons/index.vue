<script setup>
import { computed, ref,onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Driver from "driver.js/dist/driver.min.js";
import "driver.js/dist/driver.min.css";
import { use } from 'echarts';

let router=useRouter()
let route=useRoute()
let path=computed(()=>{
      let paths = route.path.split('/');
      let breadcrumbs = [];
      // 这里我们累积路径，确保子路径能够获取完整的路径信息
      let accumulatedPath = '';

      route.matched.forEach((r) => {
        accumulatedPath += r.path;
        breadcrumbs.push({
          // 优先取 meta 中定义的中文名称
          text: r.meta.breadcrumbName || r.path.substring(1), // 如果没有 meta.breadcrumbName 就用路径名
          path: r.path
        });
      

      return breadcrumbs;
    });
    return {
      breadcrumbs,
    };
    
  
})
let iscollapse=ref(false)
let changeCollapse=()=>{
  iscollapse.value=!iscollapse.value
}
let userinfo=ref({})
onMounted(() => {
  if(!localStorage.getItem('first'))
  {
    localStorage.setItem('first','true')
    showTips();
  }
   userinfo.value=JSON.parse(localStorage.getItem('userinfo'))

})
function showTips() {
  const driver = new Driver({
    prevBtnText: '上一步',
    nextBtnText: '下一步',
    doneBtnText: '我知道了',
    closeBtnText: '关闭'
  })
  const steps = [
    {
      element: '.menu',
      popover: {
        title: '功能模块',
        description: '点击即可切换',
        position: 'right'
      }
    },
    {
      element: '.scrollbare',
      popover: {
        title: '操作区域',
        description: '可进行相应操作',
        position: 'mid-center'
      }
    },
    {
      element: '.header',
      popover: {
        title: '信息区域',
        description: '展示当前路径和用户信息',
        position: 'bottom'
      }
    }
  ]
  driver.defineSteps(steps)
  driver.start()
}
let loginout=()=>{
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }

  ).then(()=>{
    ElMessage({
        type: 'success',
        message: '退出成功',
      })
    localStorage.removeItem('userinfo')
    router.push('/login')
  })
}
</script>
<template>
   
  <div class="common-layout">
    <el-container class="container">
    
      <el-container class="middle">
       
          
                <el-menu class="menu" text-color="rgb(191, 203, 217)" active-text-color="rgb(64, 158, 255)"   default-active="1-1" :collapse="iscollapse"  :collapse-transition="true">
                    <el-sub-menu index="1" class="sub-menu">
                         <template #title>
                          <el-icon style="margin-right: 2vw;"><UserFilled /></el-icon>
                           用户管理
                        </template>
                       
                        <el-menu-item index="1-1" class="menu-item"><router-link to="/index/userdata" class="router-link-custom"><el-icon><TrendCharts /></el-icon>用户数据</router-link></el-menu-item>
                        <el-menu-item index="1-1" class="menu-item"><router-link to="/index/teacherMangaer" class="router-link-custom"><el-icon><User /></el-icon>教师管理</router-link></el-menu-item>
                        <el-menu-item index="1-2" class="menu-item"><router-link to="/index/ranking" class="router-link-custom"><el-icon><Medal /></el-icon>积分排行</router-link></el-menu-item>
                    </el-sub-menu>
                     <el-sub-menu index="2" class="sub-menu">
                        <template #title>
                          <el-icon  style="margin-right: 2vw;"><List /></el-icon>
                            推文管理
                        </template>
                        
                        <el-menu-item index="2-1" class="menu-item"><router-link to="/index/tweetdetail" class="router-link-custom"><el-icon><Histogram /></el-icon>推文数据</router-link></el-menu-item>
                        <el-menu-item index="2-2" class="menu-item"><router-link to="/index/tweetdata" class="router-link-custom"><el-icon><Memo /></el-icon>推文详情</router-link></el-menu-item>
                      
                    </el-sub-menu>
                     <el-sub-menu index="3" class="sub-menu">
                        <template #title>
                          <el-icon style="margin-right: 2vw;"><Calendar /></el-icon>活动管理
                        </template>
                        <el-menu-item index="3-1" class="menu-item"><router-link to="/index/activityMangaer" class="router-link-custom"> <el-icon><Flag /></el-icon>活动详情</router-link></el-menu-item>
                        <el-menu-item index="3-2" class="menu-item"><router-link to="/index/question" class="router-link-custom"> <el-icon><Present /></el-icon>答题详情</router-link></el-menu-item>
                        <el-menu-item index="3-3" class="menu-item"><router-link to="/index/race" class="router-link-custom"> <el-icon><TrophyBase /></el-icon>比赛详情</router-link></el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="4" class="sub-menu">
                        <template #title>
                          <el-icon style="margin-right: 2vw;"><Tools /></el-icon>查询管理
                        </template>
                        <el-menu-item index="4-1" class="menu-item"><router-link to="/index/message" class="router-link-custom"><el-icon><ChatDotRound /></el-icon>消息查询</router-link></el-menu-item>
                    </el-sub-menu>
                </el-menu>
    
       
        <!-- 右边展示区 -->
        <el-main class="main">
            <el-header class="header">
              <div style="display: flex;">
                <el-icon style="margin-right: 30px;" @click="changeCollapse"><MoreFilled /></el-icon>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item v-for="(item, index) in path.breadcrumbs" :key="index" :to="item.path">{{ item.text }}</el-breadcrumb-item>
  
                </el-breadcrumb>
              </div>
                <div class="avat">
                    <el-text style="margin-right: 20px;font-size: larger;">{{userinfo.nickname }}</el-text>
                    <el-avatar :src="userinfo.photourl" style="margin-right: 20px;"/>
                    <el-text class="mx-1" type="primary" @click="loginout" style="cursor: pointer;">退出登录</el-text>
                </div>

                </el-header>
            <el-scrollbar class="scrollbare">
                <router-view v-slot="{ Component }">
                  <transition name="fade" mode="out-in">
                    <component :is="Component"  :key="route.path" style="height: 100%;"/>
                  </transition>
                </router-view>
            </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
   
  </div>

</template>
<style scoped>

html,body{
    height: 100%;
}
*{
    padding: 0;
    margin: 0;
}
.common-layout{
    width: 100%;
    height: 100%;
}
.container{
    width: 100%;
    height:100%;
}


.main{
  height: 100vh;
    background-color: #f0f2f5;
    width:20vw;
}

.menu-item{
    padding: 0;
    background-color:rgb(48, 65, 86);
}
.menu-item:hover{  
  color: #409EFF !important;  
  background-color: #333;
}  

.menu{
    background-color:rgb(38, 52, 69);
    height: 100%;
    overflow: hidden;
}

.header{
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    justify-content: space-between;
}
.avat{
    display: flex;
    justify-content: center;
}
.router-link-custom {
  display: block;
    width: 100%;
  text-decoration: none; /* 去除下划线 */
  color: #fff; /* 链接的初始颜色 */
}


/* 当前激活的路由链接样式 */
.router-link-active {
  color: #409EFF; /* 激活时的颜色 */
}
.scrollbare{
  height: calc(100vh - 60px) !important;
  
}
.sub-menu:hover{
  color: #409EFF;
  background-color: #333;  
}
 /* 渐变设置 */
 .fade-enter-from, .fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
.fade-enter-active {
  transition: all 0.7s ease;
}
.fade-leave-active {
   transition: all 0.3s cubic-bezier(1, 0.6, 0.6, 1);
}

</style>