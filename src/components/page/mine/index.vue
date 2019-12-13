<template>
  <div class="mine">
    <!-- <indexHeader></indexHeader> -->
    <div class="header">
      <!-- <img :src="headImg" alt class="head"> -->
      <img src="../../../../static/img/touxiang.png" alt class="head" />
      <span class="tel" @click="login">{{info.mobile||"登录 / 注册"}}</span>
    </div>
    <hr class="gap" />
    <div class="li">
      <div class="ico">
        <img src="../../../assets/images/headLogo1.png" alt />
      </div>
      <div class="item" @click="detailBasic">
        <span class="left">基本信息</span>
        <span class="right">{{basicText}}</span>
      </div>
    </div>
    <div class="li">
      <div class="ico">
        <img src="../../../assets/images/headLogo2.png" alt />
      </div>
      <div class="item" @click="detailReport">
        <span class="left">我的订单</span>
        <span class="right">&gt;</span>
      </div>
    </div>
    <div class="li">
      <div class="ico">
        <img src="../../../assets/images/headLogo3.png" alt />
      </div>
      <div class="item" @click="goVIP">
        <span class="left">会员中心</span>
        <span class="right">&gt;</span>
      </div>
    </div>

    <div class="li">
      <div class="ico">
        <img src="../../../assets/images/info4.png" alt />
      </div>
      <div class="item" @click="goYJCPd">
        <span class="left">学习体检</span>
        <span class="right">&gt;</span>
      </div>
    </div>

    <div class="li">
      <div class="ico">
        <img src="../../../assets/images/makeAppointment.png" alt />
      </div>
      <div class="item" @click="handleClickSub">
        <span class="left">预约咨询</span>
        <span class="right">&gt;</span>
      </div>
    </div>
    <mt-button
      type="default"
      v-if="info.userId"
      class="logout"
      size="large"
      @click.prevent="logout()"
    >退出</mt-button>
  </div>
</template>

<script>
import indexHeader from "@/components/common/userHeader.vue";
import { Indicator } from "mint-ui";
export default {
  name: "index",
  data() {
    return {
      headImg: "../../../../static/img/head-default.png",
      basicText: ">",
      info: {},
      userId: null
    };
  },
  components: {
    indexHeader
  },
  created() {
    this.getAuthenInfo();
    this.userId = localStorage.getItem("token");
  },
  mounted() {},
  methods: {
    //获取用户登录后的信息
    getAuthenInfo() {
      this.userId = localStorage.getItem("token");
      let sendData = {
        appKey: null,
        token: null,
        userId: localStorage.getItem("token") || ""
      };
      this.$axios
        .post("/user/getAssessmentAuthenticatedInfo",
          sendData,
          sendData
        )
        .then(res => {
          if (res.code == "000000") {
            this.info = res;
          }
        });
    },
    login() {
      if (this.info.mobile) {
        return;
      }
      this.$router.push("/login");
    },
    //跳到会员中心
    goVIP() {
      if (this.userId == null) {
        this.$router.push({ path: "/vipCenter" });
      } else {
        this.$router.push({ path: "/vipList" });
      }
    },
    // 跳到易教测评
    goYJCPd() {
      this.$router.push({ path: "/EvaluationPage" });
    },
    // 跳转至预约页面
    handleClickSub() {
      if (!localStorage.getItem("token")) {
        this.$router.push({ path: "/login" });
        return;
      }
      const orderInfoSub = {
        userCode: JSON.parse(localStorage.getItem("web")).userId
      };
      this.$axios
        .post(
          this.lantianUrl +
            "agency/assessMakeAppointment/getAssessMakeAppointmentPageList",
          orderInfoSub
        )
        .then(res => {
          if (res.httpCode == 200) {
            this.orderInfo = res.result.list;
            if (this.orderInfo.length > 0) {
              this.goBookinQinquiries();
            } else {
              this.goSubscribe();
            }
          }
        });
    },
    goSubscribe() {
      this.$router.push({ path: "/makeAppointment" });
    },
    goBookinQinquiries() {
      this.$router.push({ path: "/makeresults" });
    },
    detailBasic() {
      //信息填全了
      // this.userId = localStorage.getItem("token");
      // if (this.userId == null) {
      //   this.$router.push({ path: "/login" });
      // } else {
      //   this.$router.push("/userInfo");
      // }
      this.$router.push("/userInfo");
    },
    detailReport() {
      //已经登录了
      // this.userId = localStorage.getItem("token");
      // if (this.userId == null) {
      //   this.$router.push({ path: "/login" });
      // } else {
      //   this.$router.push({ path: "/order" });
      // }
      this.$router.push({ path: "/order" });
    },
    logout() {
      // debugger;
      window.localStorage.clear();
      this.info = {};
      window.location.reload();
    }
  }
};
</script>

<style scoped lang="scss">
.mine {
  min-height: 100%;
  background-color: #ffffff;
  position: relative;
  .header {
    box-sizing: border-box;
    padding: 0.54rem 0.35rem;
    .head {
      width: 1.34rem;
      height: 1.34rem;
      border-radius: 50%;
      border: none;
      vertical-align: middle;
    }
    .tel {
      font-size: 0.3rem;
      display: inline-block;
      margin-left: 0.38rem;
      color: #333333;
      font-weight: bold;
    }
  }
  .gap {
    border: none;
    border-top: 0.15rem solid #f3f3f3;
  }
  .li {
    box-sizing: border-box;
    // padding: .25rem .3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-bottom: 1px solid #e5e5e5;
    padding-left: 0.3rem;
    height: 0.9rem;
    .ico {
      flex-basis: 0.7rem;
      img {
        height: 0.42rem;
        margin-top: 0.05rem;
      }
    }
    .right {
      color: #d7d7d7;
    }
    .item {
      // padding: .8rem 0;
      border-bottom: 1px solid #e5e5e5;
      padding-right: 0.3rem;
      height: 0.9rem;
      flex: 2;
      display: flex;
      justify-content: space-between;
      vertical-align: bottom;
      align-items: center;
      font-size: 0.28rem;
    }
  }
  .logout {
    position: absolute;
    bottom: 0.5rem;
    z-index: 10;
    border: none;
    left: 5%;
    width: 90%;
    color: #a0a0a0;
    &:active:after {
      background-color: #dedede;
    }
  }
}
</style>

