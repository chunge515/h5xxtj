<template>
  <!-- 测评页 -->
  <div class="EvaluationPage">
    <!-- 头部登录部分 -->
    <header class="EvaluationPage-header">
      <p class="all-btn" @click="screenBtn()">
        <b v-if="!from.gradeCode && !from.subjectCode && !from.bookTypeCode">全部</b>
        <b v-else>{{GrandList[from.gradeCode]}}{{commonSubject[from.subjectCode]}}{{bookTypeName}}</b>
        <span class="Check-mark"></span>
      </p>
      <div class="login-btn" v-if="!trues" @click.prevent="$router.push({path:'/login'})">登录</div>
      <div v-else class="already-logged-in" @click="goMine">
        <img src="../../../../static/img/touxiang.png" alt />
        <span>{{userData.mobile}}</span>
      </div>
    </header>
    <!-- banner -->
    <div class="EvaluationPage-banner">
      <mt-swipe :auto="4000">
        <mt-swipe-item>
          
          <img class="banner-img" src="../../../../static/img/ban1.png" alt />
        </mt-swipe-item>
        <mt-swipe-item>
          <img class="banner-img" src="../../../../static/img/ban2.png" alt />
        </mt-swipe-item>
        <!-- <mt-swipe-item>
                    <img class="banner-img" src="../../../../static/img/banner.png" alt="">
        </mt-swipe-item>-->
      </mt-swipe>
    </div>
    <!-- 加载内容 -->
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      class="goodsBox"
    >
      <li v-for="(item,index) in list" :key="index" @click="ClickToBuy(item)">
        <div class="EvaluationPage-content">
          <div class="EvaluationPage-content-left">
            <img class="banner-img" :src="item.coverImgUrl" alt />
          </div>
          <div class="EvaluationPage-content-right">
            <p>{{item.name}}</p>
            <ul>
              <li>{{GrandList[item.gradeCode]}}</li>
              <li>{{commonSubject[item.subjectCode]}}</li>
              <li>{{item.bookTypeName}}</li>
            </ul>
            <span>
              <i style="font-size: .24rem; font-style: normal">￥</i>
              {{item.price}}
            </span>
          </div>
        </div>
      </li>
    </ul>

    <!--头部筛选框-->
    <div class="gray" v-if="show"></div>
    <div class="EvaluationPage-screen" :style="showStyle">
      <p class="EvaluationPage-category">年级</p>
      <div class="EvaluationPage-grade">
        <p @click="AllSchoolYear()" :class="active === 10000 ? 'active' : ''">全部</p>
        <p
          v-for="(item,index) in Year"
          :key="index"
          @click="YearClick(item,index)"
          :class="index == active ?'active':''"
        >{{item.gradeName}}</p>
      </div>
      <p class="EvaluationPage-category">学科</p>
      <div class="EvaluationPage-subject">
        <p @click="AllTheSubjects()" :class="active1 === 10000 ? 'active' : ''">全部</p>
        <p
          v-for="(item,index) in subject"
          :key="index"
          @click="getVersions(item,index)"
          :class="index == active1 ?'active':''"
        >{{item.subjectName}}</p>
      </div>
      <!-- <p class="EvaluationPage-category">教材版本</p>
						<div class="EvaluationPage-Textbookversion">
							<p @click='Allversions()' :class="active2 === 10000 ? 'active' : ''">全部</p>
							<p v-for="(item,index) in bookTypes" :key="index"  @click='versions(item,index)' :class="index == active2 ?'active':''">{{item.bookType}}</p>
      </div>-->
      <footer class="footer-button2">
        <button @click="confirmBtn()">确认</button>
      </footer>
    </div>
  </div>
</template>

<script>
import CommponHeader from "../../common/CommponHeader.vue";
export default {
  components: {
    CommponHeader
  },
  computed: {
    showStyle() {
      if (this.show == true) {
        return {
          dispatch: "block",
          //height:'11rem',
          transition: "height 0.5s"
        };
      } else {
        return {
          dispatch: "none",
          height: "0rem",
          transition: "height 0.5s"
        };
      }
    }
  },
  data() {
    return {
      active: 10000,
      active1: 10000,
      active2: 10000,
      CellPhoneNumber: "17611743196",
      trues: false,
      total: 0, //总条数
      screen: "全部",
      list: [], //所有商品
      show: false,
      Year: [], //所有学年
      subject: [], //所有学科
      bookTypes: [], //教材版本
      userData: {},
      bookTypeName: "",
      from: {
        bookTypeCode: null, //教材版本号
        gradeCode: null, //年级code
        pageNum: 1, //当前第几页
        pageSize: 5, //一页多少条
        subjectCode: null, //学科code
        status: 1
      }
    };
  },
  created() {
    this.userData = this.localData.get("web") || {};
    if (this.userData.userId) {
      this.trues = true;
    }
    //localStorage.setItem('token','abdc39bc2d83479d9936e45c9c081fa7');
    this.getYear();
    this.AllgetSubject();
    this.getAssessProductPageList();
  },
  methods: {
    screenBtn() {
      //点击下拉筛选框
      this.show = !this.show;
    },
    // 点击跳到个人信息
    goMine() {
      this.$router.push({ path: "/mine" });
    },
    confirmBtn() {
      //确定关闭筛选框
      this.show = false;
      this.from.pageSize = 5;
      this.getAssessProductPageList();
    },
    getYear(item, index) {
      //初始化查询全部学年
      let self = this;
      self.$axios
        .post("/grade/getGrades", {
          stageCode: null
        })
        .then(res => {
          if (res.code == "000000") {
            self.Year = res.grades;
          }
        });
    },
    AllgetSubject() {
      //初始化请求所有学科
      let self = this;
      self.$axios.post("subject/getSubjects", {}).then(res => {
        if (res.code == "000000") {
          console.log(res.subjects);
          self.subject = res.subjects;
        }
      });
    },
    getBookTypes(item) {
      //教材版本
      if (!item) {
        this.bookTypes = [];
        return;
      }
      let self = this;
      var data = {
        subjectCode: this.from.subjectCode || null,
        gradeCode: this.from.gradeCode || null
      };
      self.$axios.post("/bookType/getBookTypes", data).then(res => {
        self.bookTypes = res.bookTypes;
      });
    },
    getSubject(item) {
      //根据学年获取学科
      let self = this;
      self.$axios
        .post("/subject/getCourses", {
          gradeCode: item.gradeCode,
          excludeRule: "omp"
        })
        .then(res => {
          self.subject = res.subjects;
          //self.getBookTypes()
        });
    },
    YearClick(item, index) {
      //单个学年点击
      this.active = index;
      this.active1 = 10000;
      this.active2 = 10000;
      this.from.gradeCode = item.gradeCode;
      this.from.subjectCode = null;
      this.from.bookTypeCode = null;
      this.bookTypeName = null;
      this.getSubject(item);
      //	this.getBookTypes(item)
    },
    getVersions(item, index) {
      //单个学科点击
      this.active1 = index;
      this.active2 = 10000;
      //	this.item.subjectCode = null
      this.from.bookTypeCode = null;
      this.bookTypeName = null;
      this.from.subjectCode = item.subjectCode;
      this.getBookTypes(item);
    },
    versions(item, index) {
      //单个教材版本点击
      this.active2 = index;
      this.from.bookTypeCode = item.ctbCode;
      this.bookTypeName = item.bookType;
      console.log(item);
    },
    getAssessProductPageList() {
      //查询商品
      this.$axios
        .post(
          this.lantianUrl +
            "/agency/agencyAssessProduct/getAssessProductPageList",
          this.from
        )
        .then(res => {
          if (res.httpCode == "200") {
            this.loading = false;
            this.list = res.result.list || [];
            this.total = res.result.total;
            for (let i = 0; i < this.list.length; i++) {
              for (let j in this.GrandList) {
                if (this.list[i].gradeCode == j) {
                  //   this.list[i].gradeCode = this.GrandList[j];
                }
              }
            }
            for (let i = 0; i < this.list.length; i++) {
              for (let j in this.commonSubject) {
                if (this.list[i].subjectCode == j) {
                  //   this.list[i].subjectCode = this.commonSubject[j];
                }
              }
            }
          }
        });
    },
    AllSchoolYear() {
      //全部学年点击
      this.active = 10000;
      this.active1 = 10000;
      this.active2 = 10000;
      this.from.gradeCode = null;
      this.from.subjectCode = null;
      this.from.bookTypeCode = null;
      this.bookTypeName = null;
      //this.getBookTypes()
    },
    AllTheSubjects() {
      //全部学科点击
      this.active1 = 10000;
      this.active2 = 10000;
      this.from.subjectCode = null;
      this.from.bookTypeCode = null;
      this.bookTypeName = null;
      //this.getBookTypes()
    },
    Allversions() {
      //全部教材版本点击
      this.active2 = 10000;
      this.from.bookTypeCode = null;
      this.bookTypeName = null;
    },
    loadMore() {
      //上拉加载
      let self = this;
      this.loading = true;
      // debugger
      this.from.pageSize = this.from.pageSize + 5;
      setTimeout(() => {
        self.getAssessProductPageList();
      }, 2000);
    },
    ClickToBuy(item) {
      console.log(item);
      //点击进入下一页

      // this.$router.push({
      //   path: "/EvaluationDetailsPage",
      //   query: {
      //     code: item.code
      //   }
      // });

      // 判断是否买过提分承保服务;
      // debugger;
      if (!localStorage.getItem("token")) {
        // this.$router.push({
        //   path: "/login"
        // });
        this.$router.push({
          path: "/EvaluationDetailsPage",
          query: {
            code: item.code,
          }
        });
      } else {
        let params = {
          gradeCode: item.gradeCode || null,
          subjectCode: item.subjectCode || null,
          userId: localStorage.getItem("token") || null
        };
        const _this = this;
        new Promise((resolve, reject) => {
          this.$axios
            .post(
              this.lantianUrl +
                "/agency/agencyAssessUserProduct/userIsBuyProduct",
              {
                productCode: item.code,
                userCode: localStorage.getItem("token")
              }
            )
            .then(res => {
              // debugger;
              if (res.httpCode == "200") {
                if (res.result == true) {
                  this.hint();
                } else {
                  reject();
                }
              } else {
                reject();
              }
            });
        })
          .then(() => {})
          .catch(() => {
            // debugger;
            _this.$axios
              .post(
                _this.lantianUrl + "/member/isUserPromotionPlanInsurance",
                params
              )
              .then(res => {
                if (res.result == true) {
                  _this.Toast(
                    "您是提分行动险承保用户，请前往PC端按提分方案进行学习及测评"
                  );
                } else {
                  _this.$router.push({
                    path: "/EvaluationDetailsPage",
                    query: {
                      code: item.code,
                      switchover: "yes",
                      cp: "测评",
                      gradeCode: item.gradeCode || null,
                      subjectCode: item.subjectCode || null
                    }
                  });
                }
              });
          });
      }
    },
    hint() {
      this.Toast("您已购买该测评，请前往PC端学习中心查看");
    }
  }
};
</script>

<style lang='scss' scoped>
.EvaluationPage {
  background: #f5f5f5;
  position: relative;
  .commpon-header {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
  }
  .EvaluationPage-header {
    background-color: #f5f5f5;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    line-height: 0.85rem;
    height: 0.85rem;
    display: flex;
    align-items: center;
    padding: 0 0.32rem 0 0.32rem;
    justify-content: space-between;
    width: calc(100% - 0.64rem);
    .all-btn {
      font-size: 0.28rem;
      b {
        font-weight: normal;
      }
      .Check-mark {
        width: 0.15rem;
        height: 0.07rem;
        display: inline-block;
        background: url(../../../../static/img/xia.png) 0 0 no-repeat;
        background-size: 100%;
        margin-left: 0.07rem;
        position: relative;
        bottom: 0.05rem;
      }
    }
    .already-logged-in {
      font-size: 0.24rem;
      color: #333333;
      img {
        width: 0.58rem;
        margin-right: 0.19rem;
        margin-top: 0.13rem;
        float: left;
        border-radius: 50%;
        border: 1px solid #c80032;
      }
    }

    .login-btn {
      width: 1.02rem;
      height: 0.49rem;
      line-height: 0.49rem;
      border: 1px solid #d13535;
      color: #d13535;
      font-size: 0.21rem;
      text-align: center;
      border-radius: 0.5rem;
      box-sizing: border-box;
    }
  }

  .EvaluationPage-banner {
    height: 2.8rem;
    margin: 0 0.15rem;
    border-radius: 0.05rem;
    // background: red;
    margin-bottom: 0.19rem;
    margin-top: 0.85rem;
    .banner-img {
      width: 100%;
      // height: 100%;
    }
    .is-active {
    }
  }
  .goodsBox {
    li {
      cursor: pointer;
    }
  }
  .EvaluationPage-content {
    height: 2rem;
    margin: 0 0.32rem;
    margin-top: 0.17rem;
    background-color: #fff;
    border-radius: 0.1rem;
    overflow: hidden;
    display: flex;
    .EvaluationPage-content-left {
      width: 2.28rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .EvaluationPage-content-right {
      position: relative;
      padding: 0 0.22rem;
      flex: 1;
      p {
        font-size: 0.32rem;
        line-height: 0.38rem;
        margin-top: 0.2rem;
        color: #333333;
      }
      ul {
        position: absolute;
        bottom: 0.3rem;
        left: 0.2rem;
        li {
          float: left;
          font-size: 0.24rem;
          margin-right: 0.16rem;
          color: #999999;
        }
      }
      span {
        position: absolute;
        right: 0.27rem;
        bottom: 0.3rem;
        font-size: 0.32rem;
        color: #d03131;
      }
    }
  }
  .EvaluationPage-screen {
    overflow: hidden;
    position: fixed;
    top: 0.85rem;
    left: 0;
    //height: 10rem;
    font-size: 0.23rem;
    background-color: #fff;
    color: #333333;
    width: 100%;
    .EvaluationPage-category {
      line-height: 0.58rem;
      height: 0.58rem;
      padding-left: 0.64rem;
      background: url(../../../../static/img/dot.png) 0.32rem 0.2rem no-repeat;
      background-size: 0.12rem;
      border-top: 1px solid #efefef;
    }
    div {
      width: calc(100% - 0.64rem);
      padding-left: 0.32rem;
      padding-right: 0.32rem;
      display: flex;
      flex-wrap: wrap;
      p {
        width: 17%;
        margin-left: 2%;
        margin-right: 2%;
        padding-left: 2%;
        padding-right: 2%;
        text-align: center;
        height: 0.48rem;
        line-height: 0.48rem;
        margin-bottom: 0.34rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .active {
        background: #67b6ee;
        color: #fff;
        border-radius: 0.5rem;
      }
    }
    .footer-button2 {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1.03rem;
      border-top: 0.01rem solid #efefef;
      button {
        width: 1.46rem;
        height: 0.56rem;
        background: #d03131;
        color: #fff;
        font-size: 0.23rem;
        border: none;
        border-radius: 5px;
      }
    }
  }
  .gray {
    background-color: #000;
    opacity: 0.2;
    position: absolute;
    width: 100%;
    min-height: 100vh;
    height: 100%;
    left: 0;
    top: 0;
  }
}
</style>
<style lang="scss">
.EvaluationPage {
  .mint-swipe-indicators {
    .is-active {
      background: #fff !important;
      opacity: 1;
    }
    bottom: 0.3rem;
  }
}
</style>
