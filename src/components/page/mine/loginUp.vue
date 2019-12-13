<template>
  <div class="login-up">
    <div class="login-title">
      <span>
        <i class="fa fa-angle-left" aria-hidden="true" @click="$router.go(-1)"></i>
      </span>
      <p v-if="flag == 1">注册</p>
      <p v-if="flag == 2" class="userArgee">用户服务协议</p>
    </div>
    <div class="login-contain" v-if="flag == 1">
      <div class="login-user">
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
        <!-- 密码 -->
        <mt-field
          placeholder="密码"
          :type="pass"
          v-model="password"
          v-if="flag == 1"
          class="pwd"
          disableClear
        >
          <i class="fa fa-eye" aria-hidden="true" v-if="eye" @click="showPwd"></i>
          <i class="fa fa-eye-slash" aria-hidden="true" v-if="!eye" @click="hidePwd"></i>
        </mt-field>

        <p class="pwdMessage">只可包含数字、字母且6-20位</p>
      </div>

      <div class="login-button">
        <!-- 验证码登录 -->
        <mt-button class="but1" @click="registerImmediately" v-if="flag == 1">注册</mt-button>
      </div>

      <!-- 已阅读 -->
      <div class="read">
        <van-checkbox v-model="checkbox" class="read-check" shape="square">已阅读并同意</van-checkbox>
        <span class="read-span" @click="argeement">《用户服务协议》</span>
      </div>

      <div class="login-in">
        <span>已有账号?</span>
        <span class="login-up" @click="goLogin">立即登录</span>
      </div>
    </div>
    <div v-if="flag == 2" class="font2">
      <div>1. 特别提示 
1.1 北京易教空间教育科技股份有限公司（以下简称“易教空间“）同意按照本用户注册协议（以下称“本协议”）的规定及其发布的操作规则提供基于互联网以及移动网的相关服务（以下称“网络服务”）。为服务使用人（以下称“用户”）获得网络服务，用户应当同意本协议的全部条款并按照页面上的提示完成全部的注册程序。请务必审慎阅读、充分理解本协议各条款内容；请注意免除或限制易教空间责任的条款、权利许可和信息使用的条款、法律适用和争议解决的条款等。为使用户便于阅读本协议，免除或限制易教空间责任的条款已以加粗形式提示用户注意。用户在进行注册程序过程中点击“同意”按钮即表示用户完全接受本协议项下的全部条款。如果用户不同意本协议或其中任何条款约定，应立即停止注册程序，易教空间也将无法为您提供网络服务。未成年人用户请在父母或监护人陪同下阅读本协议，并在提交个人信息之前寻求父母或监护人的同意和指导。 
1.2 用户注册成功后，易教空间将给予每个用户一个用户帐号及相应的密码，该用户帐号和密码由用户或其监护人负责保管；用户应当对其帐号进行的所有活动和事件负法律责任。 
2. 服务内容 
2.1 易教空间网络服务的具体内容由易教空间提供，例如测评、报告解读、基于微信服务号的各类服务等。 
2.2 易教空间提供的部分网络服务（例如报告解读等）为收费的网络服务，用户使用收费网络服务需要向易教空间支付一定的费用。对于收费的网络服务，易教空间用户使用之前给予用户明确的提示，只有用户根据提示确认其愿意支付相关费用，用户才能使用该等收费网络服务。如用户拒绝支付相关费用，则易教空间不向用户提供该等收费网络服务。 
2.3 用户理解，易教空间仅提供相关的网络服务，除此之外与相关网络服务有关的设备（如个人电脑、手机、及其他与接入互联网或移动网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费）均应由用户自行负担。 
3. 服务变更、中断或终止 
3.1 鉴于网络服务的特殊性，用户同意易教空间有权随时变更、中断或终止部分或全部的网络服务（包括收费网络服务）。如变更、中断或终止的网络服务属于免费网络服务，易教空间无需通知用户，也无需对任何用户或任何第三方承担任何责任；如变更、中断或终止的网络服务属于收费网络服务，易教空间应当在变更、中断或终止之前事先通知用户，并应向受影响的用户提供等值的替代性的收费网络服务，如用户不愿意接受替代性的收费网络服务，就该用户已经向易教空间支付的服务费，易教空间应当按照该用户实际已经使用相应收费网络服务的情况扣除相应服务费之后将剩余的服务费退还给该用户。 
3.2 用户理解，易教空间需要定期或不定期地对提供网络服务的平台（如互联网网站、移动网络等）或相关的设备进行检修或者维护，如因此类情况而造成收费网络服务在合理时间内的中断，易教空间无需为此承担任何责任，但易教空间应尽可能事先进行通告。 
3.3 如发生下列任何一种情形，易教空间有权随时中断或终止向用户提供本协议项下的网络服务（包括收费网络服务）而无需对用户或任何第三方承担任何责任： 
3.3.1 用户提供的个人资料不真实； 
3.3.2 用户违反本协议中规定的使用规则； 
3.3.3 用户在使用收费网络服务时未按规定向易教测评支付相应的服务费。 
4. 使用规则 
4.1 用户在申请使用易教空间网络服务时，必须向易教空间提供准确的个人资料，如个人资料有任何变动，必须及时更新。 
4.2 用户不应将其帐号、密码转让或出借予他人使用。如用户发现其帐号遭他人非法使用，应立即通知易教空间。因黑客行为或用户的保管疏忽导致帐号、密码遭他人非法使用，易教空间不承担任何责任。 
4.3 用户同意易教空间有权在提供网络服务过程中以各种方式投放各种商业性广告或其他任何类型的商业信息（包括但不限于在易教空间网站的任何页面上投放广告）。 
5. 知识产权 
5.1 易教空间提供的网络服务中包含的任何文本、图片、图形、音频和/或视频资料均受版权、商标和/或其它财产所有权法律的保护，未经相关权利人同意，上述资料均不得在任何媒体直接或间接发布、播放、出于播放或发布目的而改写或再发行，或者被用于其他任何商业目的。所有这些资料或资料的任何部分仅可作为私人和非商业用途而保存在某台计算机内。就由上述资料产生或在传送或递交全部或部分上述资料过程中产生的延误、不准确、错误和遗漏或从中产生或由此产生的任何损害赔偿，易教空间不以任何形式，向用户或任何第三方负责。 
5.2 易教空间为提供网络服务而使用的任何软件（包括但不限于软件中所含的任何图象、照片、动画、录像、录音、音乐、文字和附加程序、随附的帮助材料）的一切权利均属于该软件的著作权人，未经该软件的著作权人许可，用户不得对该软件进行反向工程（reverse engineer）、反向编译（decompile）或反汇编（disassemble）。 
6. 免责声明 
6.1 用户明确同意其使用易教空间网络服务所存在的风险将完全由其自己承担；因其使用易教空间网络服务而产生的一切后果也由其自己承担，易教空间对用户不承担任何责任。 
7.2 易教空间不担保网络服务一定能满足用户的要求，也不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作担保。 
7.3 易教空间不保证为向用户提供便利而设置的外部链接的准确性和完整性，同时，对于该等外部链接指向的不由易教空间实际控制的任何网页上的内容，易教空间不承担任何责任。 
7.4 对于因不可抗力或易教空间不能控制的原因造成的网络服务中断或其它缺陷，易教空间担任何责任，但将尽力减少因此而给用户造成的损失和影响。 
7.5 用户理解并同意，对于易教空间向用户提供的下列产品或者服务的质量缺陷本身及其引发的任何损失，易教空间无需承担任何责任： 
8. 违约赔偿 
8.1 如因易教空间违反有关法律、法规或本协议项下的任何条款而给用户造成损失，易教空间同意承担由此造成的损害赔偿责任。 
8.2 用户同意保障和维护易教空间及其他用户的利益，如因用户违反有关法律、法规或本协议项下的任何条款而给易教空间或任何其他第三人造成损失，用户同意承担由此造成的损害赔偿责任。 
9. 协议修改 
9.1 易教空间有权随时修改本协议的任何条款，一旦本协议的内容发生变动，易教空间将会直接在易教空间网站上公布修改之后的协议内容，该公布行为视为易教空间已经通知用户修改内容。易教空间也可通过其他适当方式向用户提示修改内容。 
9.2 如果不同意易教空间对本协议相关条款所做的修改，用户有权停止使用网络服务。如果用户继续使用网络服务，则视为用户接受易教空间对本协议相关条款所做的修改。 
10. 通知送达 
10.1 本协议项下易教空间对于用户所有的通知均可通过网页公告、电子邮件、手机短信或常规的信件传送等方式进行；该等通知于发送之日视为已送达收件人。 
10.2 用户对于易教空间的通知应当通过易教空间对外正式公布的通信地址、传真号码、电子邮件地址等联系信息进行送达。 
11. 法律管辖 
11.1 本协议的订立、执行和解释及争议的解决均应适用中国法律并受中国法院管辖。 
11.2 如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向易教空间所在地的人民法院提起诉讼。 
12. 其他规定 
12.1 本协议构成双方对本协议之约定事项及其他有关事宜的完整协议，除本协议规定的之外，未赋予本协议各方其他权利。 
12.2 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。 
12.3 本协议中的标题仅为方便而设，在解释本协议时应被忽略。</div>
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
      checkbox: false
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
    goBack(){
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
            self.Toast("账号不存在");
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
            self.$router.push({ path: "/EvaluationPage" });
          } else {
            self.Toast(res.message);
          }
        });
    },
    //立即注册按钮
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
      }
      if (self.password.length < 1) {
        this.Toast("请输入密码");
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
      if (!this.checkbox) {
        this.Toast("请同意用户服务协议");
        return;
      }
      self.$axios
        .post("/user/register", {
          mobile: this.smsCodeAccount,
          password: md5(this.password),
          smsCode: this.smsCode
        })
        .then(res => {
          if (res.code == "000304") {
            this.Toast("验证码错误");
            return;
          }
          if (res.code == "000302") {
            this.Toast("账号已存在,请前往登录");
            // this.$router.push({path:"/login"})
            return;
          }
          if (res.code == "000000") {
            this.Toast("注册成功");
            this.$router.push({path:"/login"})
          } else {
            this.Toast(res.message);
          }
        });
    }
  }
};
</script>

<style lang="scss">
.login-up {
  background-color: #fff;
  min-height: 100%;
  position: relative;
  //   协议内容
  .font2 {
    padding: 0.44rem 0.38rem 0 0.38rem;
    color: #666;
    font-size: 0.24rem;
    line-height: .5rem;
    padding-bottom: .5rem
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
  //   已阅读
  .read {
    font-size: 0.24rem;
    color: #999;
    width: 100%;
    text-align: center;
    height: 0.44rem;
    line-height: 0.44rem;
    display: flex;
    align-content: center;
    justify-content: center;
    .read-span {
      margin-left: 0.12rem;
      color: #be2120;
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


