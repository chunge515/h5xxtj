<template>
  <div class="vip-list">
    <div class="vip-info">
      <!-- 个人信息 -->
      <div class="info-contain">
        <p>
          <img src="../../../assets/images/head.png">
          <span>{{userMobile}}</span>
        </p>
        <div>
          <mt-button @click="goVipCenter">购买会员</mt-button>
        </div>
      </div>
      <!-- 会员列表 -->
    </div>
    <div class="info-list" >
      <div class="list-div" v-for="(i,index) in vipData" :key="index">
        <mt-button class="list-bt">{{i.gradeName}}{{i.subjectName}}</mt-button>
        <p class="list-p1">{{i.MEMBER_DESC}}</p>
        <p class="list-p2">到期时间: &nbsp;&nbsp;{{i.endTime}}</p>
        <img class="list-img" src="../../../assets/images/bg.png" alt>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      vipData:[],
      userMobile: ""
    }
  },
  created(){
    this.getVipList();
    this.getUserInfo()
    // this.userMobile = this.$route.query.mobile;
  },
  methods:{
    goVipCenter(){
      this.$router.push({path:"/vipCenter"})
    },
    // 获取个人信息
    getUserInfo(){
       let sendData = {
        appKey: null,
        token: null,
        userId: localStorage.getItem("token") || "0026671c593c480099998c47429c3536"
      };
      this.$axios.post("/user/getAssessmentAuthenticatedInfo", sendData,
        sendData
      ).then(res =>{
        if(res.code == "000000"){
         this.userMobile = res.mobile;
        }

      })
    },
    getVipList(){
       this.userId = localStorage.getItem("token");
      let sendData = {
        gradeCode: null,
        productType: 3,
        search: null,
        subjectCode: null,
        userId: localStorage.getItem("token") || "0026671c593c480099998c47429c3536"
      };
       this.$axios
        .post(this.lantianUrl + "member/getMemberList", sendData)
        .then(res => {
          if (res.httpCode == "200") {
            this.vipData = res.result.list || []

          }
        });
    },
  }
};
</script>

<style lang="scss">
.vip-list {
    background-color: #f3f3f3;
    height: 100%;
  .vip-info {
    width: 100%;
    height: 3.08rem;
    background-image: url("../../../assets/images/ban.png");
    background-size: cover;
    background-color: #f3f3f3;
    .info-contain {
      padding: 1.1rem 0 0 1.15rem;
      p {
        height: 0.7rem;
        img {
          width: 0.69rem;
          float: left;
        }
        span {
          height: 0.69rem;
          line-height: 0.69rem;
          color: #fff;
          font-size: 0.28rem;
          margin-left: 0.15rem;
        }
      }
      div {
        padding-left: 0.85rem;
        .mint-button {
          width: 1.48rem;
          height: 0.5rem;
          line-height: 0.5rem;
          padding: 0;
          border-radius: 0.5rem;
          color: #333;
          font-size: 0.24rem;
          background-color: #ead7b7;
        }
      }
    }
  }
  .info-list {
    // width: 7.2rem;
    height: 1.56rem;
    margin-top: 0.35rem;
    padding: 0 0.55rem 0 0.5rem;
    position: relative;
    .list-div {
     // border: solid 1px #ccc;
      height: 1.6rem;
      margin-bottom: 0.35rem;
      padding-left: 0.42rem;
      position: relative;
      background-color: #fff;
      border-radius: .08rem;
    box-shadow: 0px 3px 5px #ccc;
      .mint-button {
        padding: 0;
      }
      .list-bt {
        width: 1.15rem;
        height: 0.46rem;
        line-height: 0.46rem;
        color: #fff;
        font-size: 0.22rem;
        background-color: #5e5654;
        border-radius: 0 0 0.1rem 0.1rem;
        margin-bottom: 0.15rem;
      }
      .list-p1 {
        font-size: 0.28rem;
        color: #333;
        margin-bottom: 0.12rem;
      }
      .list-p2 {
        color: #999;
        font-size: 0.24rem;
      }
    }
    .list-img{
      width: 1.86rem;
        position: absolute;
        top: 0;
        right: 0;
    }
  }
}
</style>

