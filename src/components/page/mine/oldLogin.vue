
<template>
    <div class="loginBox">
      <form class="loginForm">
        <section class="input_container">
          <input type="number" placeholder="手机号码" name="phone" id="" maxlength="11" v-model="phoneNumber">
        </section>
        <section class="input_container justyfy">
          <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
          <button @click.prevent="getVerifyCode" :class="{right_phone_number:isOverTime}">{{word}}</button>
        </section>
        <!--<section class="input_container">
          <input type="text" placeholder="邀请码" name="mobileCode" maxlength="6" v-model="inviteCode">
        </section>-->
        <mt-button type="default" size="large" @click.prevent="login()">登录</mt-button>
      </form>
    </div>
</template>
<script>
    export default {
        components: {},
        props: {},
        created() {
        },
        mounted() {
        },
        data() {
            return {
              phoneNumber:'',
              mobileCode:'',
              inviteCode:'',
              isOverTime:false,
              word:'获取验证码'
            }
        },
        methods: {
          testPhone(){
            var isF=true;
            if(this.phoneNumber==""){
              this.Toast({
                message: '请输入手机号',
                position: 'top',
                duration: 3000
              });
              isF=false;
              return;
            }
            var flag= /^1\d{10}$/gi.test(this.phoneNumber);
            if(!flag){
              this.Toast({
                message: '手机号码格式错误',
                position: 'top',
                duration: 3000
              });
              isF=false
            }
            return isF
          },
          //获取验证码
          getVerifyCode(){
            if(this.isOverTime){
              return false;
            }
            let that = this,time = 61;
            var flag=this.testPhone();
            if(flag){
              this.getCode();
              var sendTimer = setInterval(function(){
                that.isOverTime = true;
                time--;
                that.word = time+"S后重试";
                if(time < 0){
                  that.isOvertime = false;
                  clearInterval(sendTimer);
                  that.word = "重新发送";
                  that.isOverTime = false;
                }
              },1000)
            }
          },
          getCode() {
            var _this = this;
            this.$axios({
              method: "post",
              url: "/sms/evaluationSMS",
              data: {
                appKey: "string",
                mobile: _this.phoneNumber,
                token: "string"
              }
            }).then(function(res){
              if(res.code == '000000') {
              }else {
                _this.Toast(res.message);
              }
            }).catch(function(err) {
              // console.log(err);
              _this.Toast('发送验证码出现错误');
            })
          },
          login(){
            var that=this;
            var flag=that.testPhone();
            if(flag){
              if(that.mobileCode==""){
                that.Toast({
                  message: '请输入验证码',
                  position: 'top',
                  duration: 3000
                });
                return false;
              }
              this.$axios({
                method: "post",
                url: "/user/loginOrRegister",
                data: {
                  appKey: "string",
                  account: that.phoneNumber,
                  secret: that.mobileCode
                }
              }).then(function(res){
                if(res.code == '000000') {
                  var obj={
                    userId:res.userId,
                    mobile:res.mobile,
                  }
                  if(res.student){
                    window.localStorage.setItem("userInfo",JSON.stringify(obj));
                    that.$router.push({path:'/mine'})

                  }else{
                    obj.student=res.student;
                    window.localStorage.setItem("userInfo",JSON.stringify(obj));
                    that.$router.push({path:'/userInfo',query:{userId:res.userId}})
                  }
                }else {
                  that.Toast(res.message);
                }
              }).catch(function(err) {
                // console.log(err);
                that.Toast('发送验证码出现错误');
              })

            }
          }
        },
      computed: {
      },
        filters: {},
    }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
  .loginBox{
    width:100%;
    box-sizing: border-box;
    min-height:100%;
    padding:.4rem .2rem 0;
    background-color: #fff;
    .loginForm{
      .input_container{
        height: 0.88rem;
        line-height:0.88rem;
        margin-bottom:.2rem;
        font-size: 0.16rem;
        input,button{
          height:.88rem;
          border-radius: 0.05rem;
          border:none;
          box-sizing: border-box;
        }
        input{
          width:100%;
          padding:0 0.02rem;
          box-shadow: 1px 2px 10px #ccc;
          font-size: 0.16rem;
        }
      }
      .justyfy{
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: .04rem;
        input,button{
          width:7.6rem;
          margin:0;
        }
      }
      button{
        border:none;
        background-color: #a91515;
        color: #fff;
        font-size: 0.16rem;
        height:0.9rem;
      }
      .right_phone_number{
        background-color: #c1c1c1;
      }
    }
  }
</style>
