<template>
  <div class="login">
    <div class="login-title">
      <span>
        <i class="fa fa-angle-left" aria-hidden="true" @click="$router.go(-1)"></i>
      </span>
      <p v-if="flag == 1">手机快捷登录</p>
      <p v-if="flag == 2">账号登录</p>
    </div>
    <div class="login-contain">
      <div class="login-user">
        <!-- 快捷登录手机号 -->
        <mt-field
          placeholder="手机号"
          type="tel"
          v-model="smsCodeAccount"
          class="phone"
          v-if="flag == 1"
        ></mt-field>
        <!-- 账号登录 -->
        <mt-field
          placeholder="账号"
          type="tel"
          v-model="cellPhoneNumber"
          class="phone"
          v-if="flag == 2"
        ></mt-field>
        <!-- 快捷登录 -->
        <mt-field placeholder="验证码" v-model="smsCode" class="yzm" v-if="flag == 1" disableClear>
          <span class="catch-yzm" v-if="clickyzm" @click="getCode">获取验证码</span>
          <span class="catch-yzm catch-yzm2" v-if="!clickyzm">再次获取({{Btn}}s)</span>
        </mt-field>
        <!-- 密码登录 -->
        <mt-field
          placeholder="密码"
          :type="pass"
          v-model="password"
          v-if="flag == 2"
          class="pwd"
          disableClear
        >
          <i class="fa fa-eye" aria-hidden="true" v-if="eye" @click="showPwd"></i>
          <i class="fa fa-eye-slash" aria-hidden="true" v-if="!eye" @click="hidePwd"></i>
        </mt-field>
        <p class="forgetPwd" @click="forget">
          <span v-if="flag == 2">忘记密码?</span>
        </p>
      </div>

      <div class="login-button">
        <!-- 验证码登录 -->
        <mt-button class="but1" @click="TheLoginButton" v-if="flag == 1">登录</mt-button>
        <!-- 密码登录 -->
        <mt-button class="but1" @click="TheLoginButton1" v-if="flag == 2">登录</mt-button>
        <p>或</p>
        <mt-button class="but2" @click="loginType">
          <span v-if="flag == 1">账号登录</span>
          <span v-if="flag == 2">手机快捷登录</span>
        </mt-button>
      </div>

      <div class="login-in">
        <span>还没有账号?</span>
        <span class="login-up" @click="goUp">立即注册</span>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  data() {
    return {
      flag: 1, //登录方式
      smsCodeAccount: "", //手机号
      cellPhoneNumber: "", //账号
      smsCode: "", //验证码
      password: "", //密码
      pass: "password",
      Btn: 60, //获取验证码
      eye: false, //密码显示
      clickyzm: true, //切换验证码类型
      //   loginCertification:'',//快捷登录时候错误的提示信息
      yes: false // 验证码时间控制
    };
  },
  created() {},
  methods: {
    //   切换登录方式
    loginType() {
      if (this.flag == 2) {
        this.flag = 1;
      } else {
        this.flag = 2;
      }
    },
    //   隐藏密码
    showPwd() {
      this.eye = false;
      this.pass = "password";
    },
    // 忘记密码
    forget() {
      this.$router.push({ path: "/forgetPwd" });
    },
    //   显示密码
    hidePwd() {
      this.eye = true;
      this.pass = "tel";
    },
    // 跳到注册页面
    goUp() {
      this.$router.push({ path: "/loginUp" });
    },
    //登录获取验证码
    getCode() {
      if (this.yes) {
        return;
      }
      let self = this;
      let time = 60;
      // let myreg = /^1[34578]\d{9}$/;
      let myreg = /^1\d{10}$/;
      if (self.smsCodeAccount.length > 0) {
        if (!myreg.test(self.smsCodeAccount)) {
          this.Toast("请填写正确的手机号");
          return;
        } else {
          this.clickyzm = false;
        }
      } else {
        this.Toast("手机号码不能为空");
        return;
      }

      self.$axios
        .post("/sms/evaluationSMS", {
          mobile: self.smsCodeAccount,
          productType: 1
        })
        .then(res => {
          if (res.code == "000000") {
            this.Toast("动态码已发送,请查看手机");
            var sendTimer = setInterval(function() {
              self.yes = true;
              time--;
              self.Btn = time;
              if (time == 0) {
                self.clickyzm = true;
                self.yes = false;
                clearInterval(sendTimer);
              }
            }, 1000);
          }
        });
    },
    //验证码登录按钮
    TheLoginButton() {
      let self = this;
      // let myreg = /^1[34578]\d{9}$/;
      
      let myreg = /^1\d{10}$/;
      //验证码登录的校验
      if (self.smsCodeAccount.length > 0) {
        if (!myreg.test(self.smsCodeAccount)) {
          this.Toast("请填写正确的手机号");
          return;
        } else {
        }
      } else {
        this.Toast("手机号码不能为空");
        return;
      }
      if (self.smsCode.length < 1) {
        this.Toast("验证码不能为空");
        return;
      }
      self.$axios
        .post("/user/login", {
          username: self.smsCodeAccount, //账号
          password: null, //登录密码二选一
          smsCode: this.smsCode //登录验证码二选一
        })
        .then(res => {
          console.log(res);
          if (res.code == "000301") {
            self.Toast("账号不存在,请立即注册");
            // this.DL2 = true;
            return;
          }
          if (res.code == "000304") {
            self.Toast("验证码错误");
            return;
          }
          if (res.code == "000000") {
            self.smsCodeAccount = "";
            this.smsCode = "";
            this.localData.set("web", res);
            // self.$store.commit("userState", res.userId);
            sessionStorage.setItem("token", res.userId);
            localStorage.setItem("token", res.userId);

            const path = localStorage.getItem('path');
            const code = localStorage.getItem('queryCode');
            if (path) {
              
              localStorage.removeItem('path');
              localStorage.removeItem('queryCode');

              const parms = {
                path: path,
              }
              if (code) {
                parms.query = {
                  code: code
                }
              }
              self.$router.push(parms);
              return;
            }
              // self.$router.push({ path: "/EvaluationPage" });
              self.$router.push({ path: "/mine" });
          } else {
            self.Toast(res.message);
          }
        });
    },
    //账号密码登录按钮
    TheLoginButton1() {
      let self = this;
      // let myreg = /^1[34578]\d{9}$/;
      let myreg = /^1\d{10}$/;
      let str = /^[a-z0-9A-Z]{6,18}$/;
      if (self.cellPhoneNumber.length > 0) {
        // if (!myreg.test(self.cellPhoneNumber)) {
        //   this.Toast("请填写正确的手机号");
        //   return;
        // } else {
        // }
      } else {
        this.Toast("账号不能为空");
        return;
      }
      if (self.password.length < 1) {
        this.Toast("密码不能为空");
        return;
      }
       if (/[^a-zA-Z0-9]/.test(self.password)) {
         this.Toast("只可包含数字、字母且6-20位");
          return;
      }
      if (!str.test(self.password)) {
        this.Toast("密码长度为6-20位");
        return;
      }
      self.$axios
        .post("/user/login", {
          username: self.cellPhoneNumber, //账号
          password: md5(self.password), //登录密码二选一
          smsCode: null //登录验证码二选一
        })
        .then(res => {
          if (res.code == "000301") {
            this.Toast("账号不存在");
            return;
          }
          if (res.code == "000303") {
            this.Toast("密码错误");
            return;
          }
          if (res.code == "000000") {
            if (res.mobile == null) {
            this.$router.push({
              path: "/bindMobile",
              query: { account: this.cellPhoneNumber, pwd: this.password }
            });
            return;
            }
            self.cellPhoneNumber = "";
            self.password = "";
            // this.$store.commit("userState", res.userId);
            this.localData.set("web", res);
            sessionStorage.setItem("token", res.userId);
            localStorage.setItem("token", res.userId);
            localStorage.setItem("active", 0);
            // this.$store.commit("mobile", res.mobile);
            // this.$store.commit("active", 0);
            // self.$router.push({
            //   path: "/EvaluationPage",
            //   // query: {
            //   //   account: this.cellPhoneNumber,
            //   //   pwd: this.password
            //   // }
            // });
            const path = localStorage.getItem('path');
            const code = localStorage.getItem('queryCode');
            if (path) {
              localStorage.removeItem('path');
              localStorage.removeItem('queryCode');
              const parms = {
                path: path,
              }
              if (code) {
                parms.query = {
                  code: code
                }
              }
              self.$router.push(parms);
              return;
            }
              // self.$router.push({ path: "/EvaluationPage" });
              self.$router.push({ path: "/mine" });
          } else {
            this.Toast(res.message);
          }
        });
    }
  }
};
</script>

<style lang="scss">
.login {
  background-color: #fff;
  min-height: 100%;
  position: relative;
  //   登录头部消息
  .login-title {
    color: #333;
    font-size: 0.28rem;
    text-align: center;
    height: 0.84rem;
    line-height: 0.84rem;
    margin-bottom: 1.04rem;
    position: relative;
    span {
      position: absolute;
      left: 0.32rem;
    }
  }
  //   登录手机验证码
  .login-user {
    .mint-cell {
      width: 6.35rem;
      margin: 0 auto;
      background: #f2f2f2;
      height: 0.74rem;
      min-height: 0;
      border-radius: 0.15rem;
      .mint-cell-wrapper {
        padding-left: 0.3rem;
      }
      .mint-cell-value {
        .mint-field-core {
          background: #f2f2f2;
        }
      }
    }
    .phone {
      margin-bottom: 0.5rem;
    }
    .forgetPwd {
      width: 6.35rem;
      margin: 0 auto;
      height: 0.7rem;
      font-size: 0.24rem;
      color: #333;
      text-align: right;
      line-height: 0.7rem;
    }
    .yzm {
      // border-radius: 0 0.15rem 0.15rem 0;
      .mint-cell-wrapper {
        padding-right: 0;
      }
      .catch-yzm {
        display: inline-block;
        width: 1.73rem;
        height: 0.74rem;
        background-color: #404040;
        color: #fffefe;
        font-size: 0.24rem;
        text-align: center;
        line-height: 0.74rem;
        border-radius: 0 0.15rem 0.15rem 0;
      }
      .catch-yzm2 {
        background-color: #bfbfbf;
      }
    }
  }
  // 登录按钮
  .login-button {
    padding: 0 0.3rem;
    font-size: 0.26rem;
    text-align: center;
    .mint-button-text {
      font-size: 0.26rem;
    }
    p {
      width: 6.38rem;
      height: 0.8rem;
      text-align: center;
      line-height: 0.8rem;
      font-size: 0.24rem;
      color: #333;
      padding-left: 0.24rem;
    }
    .mint-button {
      display: inline-block;
      width: 6.38rem;
      height: 0.8rem;
    }
    .but1 {
      background-color: #be2120;
      color: #f1f1f1;
    }
    .but2 {
      background-color: #fff;
      color: #be2120;
      border: solid 0.02rem #d16262;
    }
  }
  //   注册
  .login-in {
    position: absolute;
    font-size: 0.24rem;
    color: #333;
    text-align: center;
    width: 100%;
    bottom: 0.44rem;
    .login-up {
      color: #67b6ee;
      padding-left: 0.15rem;
    }
  }
}
</style>


