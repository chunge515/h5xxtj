<template>
  <div class="forget-password">
    <div class="login-title">
      <span>
        <i class="fa fa-angle-left" aria-hidden="true" @click="$router.go(-1)"></i>
      </span>
      <p v-if="flag == 1">验证身份</p>
      <p v-if="flag == 2" class="userArgee">重置密码</p>
    </div>
    <div class="login-contain">
      <div class="login-user" v-if="flag == 1">
        <!-- 手机号 -->
        <mt-field
          placeholder="手机号"
          type="tel"
          v-model="smsCodeAccount"
          class="phone"
          v-if="flag == 1"
        ></mt-field>
        <!-- 验证码 -->
        <mt-field placeholder="验证码" v-model="smsCode" class="yzm" v-if="flag == 1" disableClear>
          <span class="catch-yzm" v-if="clickyzm" @click="getCode">获取验证码</span>
          <span class="catch-yzm catch-yzm2" v-if="!clickyzm">再次获取({{Btn}}s)</span>
        </mt-field>
      </div>

      <div class="login-user" v-if="flag == 2">
        <!-- 密码 -->
        <mt-field
          placeholder="新密码"
          type="password"
          v-model="newPassword"
          class="phone"
          v-if="flag == 2"
        ></mt-field>
        <!-- 再输一次 -->
        <mt-field
          placeholder="再输一次"
          type="password"
          v-model="newPassword2"
          class="sgainPwd"
          v-if="flag == 2"
        ></mt-field>
        <p class="pwdMessage">只可包含数字、字母且6-20位</p>
      </div>

      <div class="login-button">
        <!-- 验证码登录 -->
        <mt-button class="but1" @click="registerImmediately" v-if="flag == 1">下一步</mt-button>
        <mt-button class="but1" @click="bindingBtn" v-if="flag == 2">提交</mt-button>
      </div>
      <!-- 备注 -->
      <div class="beizhu">
        <p>备注：已有案例重构账号或学业质量账号的用户，可先绑定手机号后，通过手机号进行密码找回</p>
      </div>

      <div class="login-in">
        <span>已有账号?</span>
        <span class="login-up" @click="goLogin">立即登录</span>
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
      yes: false, // 验证码时间控制
      checkbox: false,
      newPassword: "", //新密码
      newPassword2: "" //再次输入新密码
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
    //   显示密码
    hidePwd() {
      this.eye = true;
      this.pass = "tel";
    },
    // 用户协议
    argeement() {
      this.flag = 2;
    },
    // 返回注册页
    goBack() {
      this.flag = 1;
    },
    // 跳到登录页
    goLogin() {
      this.$router.push({ path: "/login" });
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
    //下一步按钮
    registerImmediately() {
      let self = this;
      // let myreg = /^1[34578]\d{9}$/;
      let myreg = /^1\d{10}$/;
      let str = /^[a-z0-9A-Z]{6,18}$/;
      if (self.smsCodeAccount.length > 0) {
        if (!myreg.test(self.smsCodeAccount)) {
          this.Toast("请填写正确的手机号");
          return;
        } else {
        }
      } else {
        this.Toast("请输入手机号码");
        return;
      }
      if (self.smsCode.length < 1) {
        this.Toast("请输入验证码");
        return;
      } else {
        self.$axios
          .post("/user/login", {
            username: self.smsCodeAccount, //账号
            password: null, //登录密码二选一
            smsCode: this.smsCode //登录验证码二选一
          })
          .then(res => {
            if (res.code == "000304") {
              self.Toast("验证码错误");
              return;
            } else {
              this.flag = 2;
            }
          });
      }
    },
    // 重置密码
    bindingBtn() {
      let self = this;
      // let myreg = /^1[34578]\d{9}$/;
      let myreg = /^1\d{10}$/;
      let str = /^[a-z0-9A-Z]{6,20}$/;
      if (self.newPassword.length < 1) {
        this.Toast("新密码不能为空");
        return;
      }
       if (/[^a-zA-Z0-9]/.test(self.password)) {
         this.Toast("只可包含数字、字母且6-20位");
          return;
      }
      if (!str.test(self.newPassword)) {
        this.Toast("新密码长度为6-20位");
        return;
      }
      if(self.newPassword2.length < 1){
        this.Toast("再次输入密码不能为空");
        return;
      }
      if (self.newPassword2 != self.newPassword) {
        this.Toast("两次密码不一致");
        return;
      }
      self.$axios
        .post("/user/resetPassword", {
          validateCode: self.smsCode,
          mobile: self.smsCodeAccount,
          newPassword: md5(self.newPassword)
        })
        .then(res => {
          if (res.code == "000304") {
            this.Toast("验证码不正确");
          }
          if (res.code == "000000") {
            this.Toast("密码重置成功");
            this.$router.push({path:"/login"})
          }
        });

      //   this.$axios
      //     .post("/user/accountBindMobile", {
      //       mobile: self.smsCodeAccount,
      //       account: self.smsCodeAccount,
      //       smsCode: self.smsCode,
      //       password: md5(self.password)
      //     })
      //     .then(res => {
      //       if (res.code == "000304") {
      //         self.ee = "验证码不正确";
      //       }
      //       if (res.code == "000304") {
      //         self.ee = "账号已经绑定";
      //       }
      //       if(res.code == '000000'){
      //           this.$router.push({path:"/login"})
      //         } else {
      //           this.Toast(res.message);
      //         }
      //     });
    }
  }
};
</script>

<style lang="scss">
.forget-password {
  background-color: #fff;
  min-height: 100%;
  position: relative;
  //   协议内容
  .font2 {
    padding: 0.44rem 0.38rem 0 0.38rem;
    color: #666;
    font-size: 0.24rem;
    line-height: 0.5rem;
  }
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
    .userArgee {
      background-color: #f5f5f5;
    }
  }
  //   登录手机验证码
  .login-user {
    .mint-cell {
      width: 6.35rem;
      margin: 0 auto;
      background: #f2f2f2;
      height: 0.74rem;
      margin-bottom: 0.5rem;
      min-height: 0;
      border-radius: .15rem ;
      .mint-cell-wrapper {
        padding-left: 0.3rem;
      }
      .mint-cell-value {
        .mint-field-core {
          background: #f2f2f2;
        }
      }
    }
    .pwd {
      margin-bottom: 0;
    }
    .pwdMessage {
      width: 6.35rem;
      margin: 0 auto;
      height: 0.7rem;
      font-size: 0.24rem;
      color: #999;
      //   text-align: left;
      line-height: 0.7rem;
    }
    .yzm {
    //   border-radius: 0 0.15rem 0.15rem 0;
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
      margin-bottom: 0.66rem;
    }
    .but2 {
      background-color: #fff;
      color: #be2120;
      border: solid 0.02rem #d16262;
    }
  }
  // 备注
  .beizhu{
    color: #666;
    font-size: .24rem;
    padding: 0 .5rem;
    margin-top: .3rem;
    line-height: .5rem;
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
  .pwdMessage {
    width: 6.35rem;
    margin: 0 auto;
    height: 0.7rem;
    font-size: 0.24rem;
    color: #999;
    //   text-align: left;
    line-height: 0.7rem;
  }
  .sgainPwd {
    margin-bottom: 0 !important;
  }
}
</style>


