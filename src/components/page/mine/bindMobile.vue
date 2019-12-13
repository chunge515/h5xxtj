<template>
  <div class="bindMobile">
    <div class="login-title">
      <span>
        <i class="fa fa-angle-left" aria-hidden="true" @click="$router.go(-1)"></i>
      </span>
      <p class="userArgee">绑定手机号</p>
    </div>
    <div class="bind-style">
      <p class="p1">您当前登录账号为案例重构教学平台用</p>
      <p>户，需先绑定手机号，才可登录</p>
    </div>
    <div class="login-contain">
      <div class="login-user">
        <!-- 手机号 -->
        <mt-field placeholder="手机号" type="tel" v-model="smsCodeAccount" class="phone"></mt-field>

        <!-- 验证码 -->
        <mt-field placeholder="验证码" v-model="smsCode" class="yzm" disableClear>
          <span class="catch-yzm" v-if="clickyzm" @click="getCode">获取验证码</span>
          <span class="catch-yzm catch-yzm2" v-if="!clickyzm">再次获取({{Btn}}s)</span>
        </mt-field>
      </div>

      <div class="login-button">
        <!-- 验证码登录 -->
        <mt-button class="but1" @click="bindingBtn">绑定手机号</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  data() {
    return {
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
      checkbox: false
    };
  },
  created() {
      this.cellPhoneNumber = this.$route.query.account;
      this.password = this.$route.query.pwd;
      console.log(this.cellPhoneNumber,this.password)
  },
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
    // 跳到登录页
    goLogin() {
      this.$router.push({ path: "/login" });
    },
    //绑定账号提交
    bindingBtn() {
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
          this.Toast("手机号码不能为空");
        return;
      }
      if (self.smsCode.length < 1) {
          this.Toast("验证码不能为空");
        return;
      }
      this.$axios
        .post("/user/accountBindMobile", {
          mobile: self.smsCodeAccount,
          account: self.cellPhoneNumber,
          smsCode: self.smsCode,
          password: md5(self.password)
        })
        .then(res => {
          if (res.code == "000300") {
            this.Toast("token验证已失效,请重新登录");
          }
          if (res.code == "000304") {
            this.Toast("验证码错误");
          } if (res.code == "000305") {
            this.Toast("账号已绑定");
          }
          if (res.code == "000000") {
            this.Toast("绑定手机号成功");
            this.$router.push({path:"/EvaluationPage"})
          } else {
            this.Toast(res.message);
          }
        });
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
    }
  }
};
</script>

<style lang="scss">
.bindMobile {
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
    // margin-bottom: 1.04rem;
    position: relative;
    span {
      position: absolute;
      left: 0.32rem;
    }
    .userArgee {
      background-color: #f5f5f5;
    }
  }
  .bind-style {
    text-align: center;
    color: #666;
    font-size: 0.24rem;
    padding: 0.44rem 0;
    .p1 {
      margin-bottom: 0.1rem;
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
      border-radius: 0 0.15rem 0.15rem 0;
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
        // border-radius: 0 0.15rem 0.15rem 0;
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
}
</style>


