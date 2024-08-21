 <script setup>
    import { ref,inject} from "vue";
    import { useRouter } from "vue-router";
    import {createuserinfo} from "@/stores/userinfo.js"
        const router = useRouter();
        let api=inject('api');
        let isloading=ref(false);
        let studentid=ref();
        let phonenumber=ref();
        let userinfo=createuserinfo()
        let istrue=ref(false);
        let check=()=>{
            const regEx = /^1[3-9]\d{9}$/;
            istrue.value = !regEx.test(phonenumber.value); 
        }
        let  login=async ()=>{
            if(istrue.value)
            {
                ElMessageBox.alert('请输入正确的手机号','提示',{
                    confirmButtonText: '确定'
                })
            }
            else{
                isloading.value=true
                 api.login(studentid.value,phonenumber.value,(res)=>{
                if(res.data.status==200)
                {
                    if(res.data.data.length>0)
                    {
                        let newuserinfo={
                            photourl:res.data.data[0].photo,
                            nickname:res.data.data[0].nick_name
                        }
                        localStorage.setItem('userinfo',JSON.stringify(newuserinfo))
                        userinfo.setnickname(newuserinfo.nickname);
                        userinfo.setphotourl(newuserinfo.photourl);
                       router.push('/index')
                       isloading.value=false;
                    }
                }
                else{
                    isloading.value=false;
                    ElMessageBox.alert('登录失败','提示',{
                    confirmButtonText: '确定'
                })
                    
                }
                
              })
            }
        };

</script>

<template>
    <div class="container">
        <div class="center">
            <div class="header">
                管理员登录
            </div>
            
                <el-form class="content" label-position="top">
                    <el-form-item label="学号" >
                        <el-input  size="large" v-model="studentid"></el-input>
                    </el-form-item>
                   <el-form-item label="手机号">
                        <el-input  size="large" v-model.number="phonenumber" @blur="check"></el-input>
                        <div style="color: red;" v-show="istrue"><el-icon><WarningFilled /></el-icon>请输入正确的手机号</div>
                   </el-form-item>
                   <el-form-item class="login-item">
                        <el-button :loading="isloading" class="loginbutton" @click="login" @keyup.enter="login">登录</el-button>
                   </el-form-item>
             
                </el-form>
            
        </div>
    </div>
</template>

<style scoped>


.container{
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: relative;
    background-image: url("@/assets/bc.jpg");
    background-size:cover;
    
}
.center{
    position:absolute;
    width: 30vw;
    height: 55vh;
    right: 30vw;
    top: 50%;
    transform: translateY(-50%);
   background-color:antiquewhite;
   border-radius: 30px;
   opacity: 0.8;
}
.header{
    width: 100%;
    height: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight:bolder;
    font-size:x-large;
    color: black;
    border-bottom: 3px solid white;
}
.content{
    width: 100%;
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
}
.el-form-item
{
    width: 70%;
}
.loginbutton{
    margin: 0 auto;
    width: 80px;
}

</style>
