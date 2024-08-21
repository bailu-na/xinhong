import { createRouter, createWebHistory } from 'vue-router'
import index from "@/components/icons/index.vue"
import login from "@/components/icons/login.vue"
import userdata from "@/components/icons/userdata.vue"
import ranking from "@/components/icons/ranking.vue"
import message from "@/components/icons/message.vue"
import tweetdata from "@/components/icons/tweetdata.vue"
import teacherMangaer from '@/components/icons/teacherMangaer.vue'
import tweetdetail from '@/components/icons/tweetdetail.vue'
import activityMangaer from '@/components/icons/activityMangaer.vue'
import question from '@/components/icons/question.vue'
import race from '@/components/icons/race.vue'
const router = createRouter({
  history: createWebHistory(),
  routes:[
    {
      path:'/',
      redirect:'/login'
    },
   {
    path:'/login',
    name:'login',
    component:login
   },
    {
      path:'/index',
      name:'index',
      component:index,
      meta: { breadcrumbName: '首页' },
      children:[
        {
          path:'userdata',
          component:userdata,
          meta: { breadcrumbName: '用户数据' }
        },
        {
            path:'',
            redirect:'/index/userdata'
        },
        {
          path:'ranking',
          component:ranking,
          meta: { breadcrumbName: '积分排行' }
        },
        {
          path:'message',
          component:message,
          meta:{breadcrumbName:'消息查询'}
        },
        {
          path:'tweetdata',
          component:tweetdata,
          meta:{breadcrumbName:'推文详情'}
        },
        {
          path:'teacherMangaer',
          component:teacherMangaer,
          meta:{breadcrumbName:'教师管理'}
        },
        {
          path:'tweetdetail',
          component:tweetdetail,
          meta:{breadcrumbName:'推文数据'}
        },
        {
          path:'activityMangaer',
          component:activityMangaer,
          meta:{breadcrumbName:'活动详情'}
        },
        {
          path:'question',
          component:question,
          meta:{breadcrumbName:'答题详情'}
        },
        {
          path:'race',
          component:race,
          meta:{breadcrumbName:'比赛详情'}
        }
      ]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  if(to.name!='login'&&!localStorage.getItem('userinfo'))
  {
    window.alert("请先登录");
    next('/login');
  }
  else{
    next();
  }
})
export default router