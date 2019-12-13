<template>
  <div class="vip-center">
    <!-- banner图 -->
    <div class="center-ban">
      <p>
        <span>全年服务</span>
        <span class="span2">免费测评+报告服务</span>
        <span>个性化学习资料</span>
      </p>
    </div>
    <!-- 选择学科 -->
    <div class="vip-contain">
      <p class="con-title">选择学科（已选择{{subjectNumber}}科）</p>
      <!-- 小学 -->
      <div class="con-sub sub-xiaoxue">
        <p class="sub-name">
          <span class="circle-red"></span> 小学:
        </p>
        <div class="con-sub-but">
          <van-checkbox-group v-model="checkArr1" @change="chooseSub">
            <van-checkbox
              v-for="(item, index) in data.xiaoxue.subjects"
              :key="index"
              :name="item.subjectCode"
              :class="{fontColor:item.isTrue}"
              @click="clickSub(item,index,item.subjectCode)"
            >{{ item.subjectName }}</van-checkbox>
          </van-checkbox-group>
        </div>
      </div>
      <!-- 初中 -->
      <div class="con-sub">
        <p class="sub-name">
          <span class="circle-red"></span> 初中:
        </p>
        <div class="con-sub-but">
          <van-checkbox-group v-model="checkArr2" @change="chooseSub">
            <van-checkbox
              v-for="(item, index) in data.chuzhong.subjects"
              :key="index"
              :name="item.subjectCode"
              :class="{fontColor:item.isTrue}"
              @click="clickSub(item,index)"
            >{{ item.subjectName }}</van-checkbox>
          </van-checkbox-group>
        </div>
      </div>
      <!-- 中考 -->
      <div class="con-sub">
        <p class="sub-name">
          <span class="circle-red"></span> 中考:
        </p>
        <div class="con-sub-but">
          <van-checkbox-group v-model="checkArr3" @change="chooseSub">
            <van-checkbox
              v-for="(item, index) in data.zhongkao.subjects"
              :key="index"
              :name="item.subjectCode"
              :class="{fontColor:item.isTrue}"
              @click="clickSub(item,index)"
            >{{ item.subjectName }}</van-checkbox>
          </van-checkbox-group>
        </div>
      </div>
      <!-- 高中 -->
      <div class="con-sub">
        <p class="sub-name">
          <span class="circle-red"></span> 高中:
        </p>
        <div class="con-sub-but">
          <van-checkbox-group v-model="checkArr4" @change="chooseSub">
            <van-checkbox
              v-for="(item, index) in data.gaozhong.subjects"
              :key="index"
              :name="item.subjectCode"
              :class="{fontColor:item.isTrue}"
              @click="clickSub(item,index)"
            >{{ item.subjectName }}</van-checkbox>
          </van-checkbox-group>
        </div>
      </div>
      <!-- 高考 -->
      <div class="con-sub">
        <p class="sub-name">
          <span class="circle-red"></span> 高考:
        </p>
        <div class="con-sub-but">
          <van-checkbox-group v-model="checkArr5" @change="chooseSub">
            <van-checkbox
              v-for="(item, index) in data.gaokao.subjects"
              :key="index"
              :name="item.subjectCode"
              :class="{fontColor:item.isTrue}"
              @click="clickSub(item,index)"
            >{{ item.subjectName }}</van-checkbox>
          </van-checkbox-group>
        </div>
      </div>
      <!-- 选择周期 -->
      <div class="choose-month">
        <p>选择周期:</p>
        <p>
          <!-- <van-button type="default" >12个月</van-button> -->
          <!-- <span class="month-button">12个月</span> -->
          <van-radio-group v-model="checkArr6" class="monthStyle">
            <van-radio name="2" @click="month3" class="m3" :class="{monthSty3: monthTrue3}">3个月</van-radio>
            <van-radio class="mon12" name="1" @click="month12" :class="{monthSty12: monthTrue12}">12个月</van-radio>
          </van-radio-group>
        </p>
      </div>
      <!-- 优惠码 -->
      <div class="choose-month">
        <p>兑换码:</p>
        <p class="counpm">
          <input type="text" @focus="delText" v-model="coupon" @input="changeCoupon(coupon)">
          <span class="ineffective">{{messageIfo}}</span>
        </p>
      </div>
    </div>
    <footer>
      <p>
        <label>支付金额:</label>
        <!-- <span>3000000</span> -->
        <span class="price" v-show="allTotalPrice!=0">{{allTotalPrice}}</span>
      </p>
      <button @click="buyNow">立即兑换</button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      idData: [], //默认12月
      idData6: [], //6个月集合
      idData3: [], //3个月集合
      allTotalPrice: 0,
      totalPrice: 0, //商品总价
      goodPrice: 0, //商品单价
      defaultPrice: 0, //默认价格
      totalPrice6: 0, //商品总价
      goodPrice6: 0, //商品单价
      defaultPrice6: 0, //默认价格
      totalPrice3: 0, //商品总价
      goodPrice3: 0, //商品单价
      defaultPrice3: 0, //默认价格
      subjectNumber: 0, //选课科目数量
      checkArr6: 12, //选择月份
      messageIfo: "", //购买提示信息
      month: "1",
      monthTrue3: false,
      monthTrue12: true,
      chooseMonth: "1",
      data: {
        chuzhong: [],
        gaokao: [],
        gaozhong: [],
        xiaoxue: [],
        zhongkao: []
      },
      type: "",
      subj: "",
      gridData: [],
      coupon: null,
      uesrCode: null,
      userId: null,
      userName: null,
      userMobile: null,
      isBuyCoupon: null,
      type: "",
      subj: "",
      subject: null,
      gradeCode: null,
      checkArr1: [],
      checkArr2: [],
      checkArr3: [],
      checkArr4: [],
      checkArr5: []
    };
  },
  created() {
    this.getData();
    this.getUserInfo();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      this.userId = localStorage.getItem("token");
      let sendData = {
        appKey: null,
        token: null,
        userId: this.userId
      };
      this.$axios
        .post("/user/getAssessmentAuthenticatedInfo", sendData)
        .then(res => {
          if (res.code == "000000") {
            this.uesrCode = res.userId;
            this.userName = res.realname;
            this.userMobile = res.mobile;
          }
        });
    },
    month12(n) {
      // console.log(122121)
      this.checkArr6 = 12;
      this.sendIdData = this.idData;
      this.allTotalPrice = this.totalPrice;
      this.monthTrue3 = false;
      this.monthTrue12 = true;
      // console.log(this.allTotalPrice);
    },
    month3() {
      // console.log(333)
      this.monthTrue3 = true
      this.monthTrue12 = false;
      this.checkArr6 = 3;
      this.sendIdData = this.idData3;
      this.allTotalPrice = this.totalPrice3;
      // console.log(this.allTotalPrice);
    },
    // 输入优惠码
    changeCoupon(e) {
      console.log(e);
      if (e.length > 0) {
        this.isColor = true;
        this.dis = false;
      } else {
        this.isColor = false;
        this.dis = true;
        this.messageIfo = "";
      }
    },
    // 获取焦点清空消息
    delText() {
      this.messageIfo = "";
    },
    // 获取默认科目
    getData() {
      this.$axios
        .get(this.lantianUrl + "member/getVipMemberList?productType=3")
        .then(res => {
          if (res.httpCode == "200") {
            this.data = res.result;
            // 添加isTrue属性
            this.data.xiaoxue.subjects.forEach(item => {
              item.isTrue = false;
            });
            this.data.chuzhong.subjects.forEach(item => {
              item.isTrue = false;
            });
            this.data.zhongkao.subjects.forEach(item => {
              item.isTrue = false;
            });
            this.data.gaozhong.subjects.forEach(item => {
              item.isTrue = false;
            });
            this.data.gaokao.subjects.forEach(item => {
              item.isTrue = false;
            });

            let sub = this.$route.query.subjectCode;
            let grade = this.$route.query.gradeCode;
            // // let type;
            // sub = parseInt(this.$route.query.subjectCode); //学科
            // grade = parseInt(this.$route.query.gradeCode); //年级
            // debugger
            // 判断是否为小学
            this.data.xiaoxue.grades.forEach(item => {
              if (item == grade) {
                this.checkArr1.push(sub);
                this.type = 1;
                this.subj = sub;
                this.data.xiaoxue.subjects[sub - 1].isTrue = true;
                this.toClick();
                return;
              }
            });
            // 判断是否为初中
            this.data.chuzhong.grades.forEach(item => {
              if (item == grade) {
                this.checkArr2.push(sub);
                this.data.chuzhong.subjects[sub - 1].isTrue = true;
                this.type = 2;
                this.subj = sub;
                this.toClick();
                return;
              }
            });
            // 判断是否为中考
            this.data.zhongkao.grades.forEach(item => {
              if (item == grade) {
                // debugger
                this.checkArr3.push(sub);
                this.data.zhongkao.subjects[sub - 1].isTrue = true;
                this.type = 3;
                this.subj = sub;
                this.toClick();
                return;
              }
            });
            // 判断是否为高中
            this.data.gaozhong.grades.forEach(item => {
              if (item == grade) {
                this.checkArr4.push(sub);
                this.data.gaozhong.subjects[sub - 1].isTrue = true;
                this.type = 4;
                this.subj = sub;
                this.toClick();
                return;
              }
            });
            // 判断是否为高考
            this.data.gaokao.grades.forEach(item => {
              if (item == grade) {
                this.checkArr5.push(sub);
                this.data.gaokao.subjects[sub - 1].isTrue = true;
                this.type = 5;
                this.subj = sub;
                this.toClick();
                return;
              }
            });
          }
        });
    },
    chooseSub(i) {
      // console.log(i);
    },
    // 点击科目接口
    toClick() {
      // 12个月
      let sendData = {
        productType: 3,
        subjectCode: this.subj,
        type: this.type,
        validityPeriod: 12
      };
      this.$axios
        .post(this.lantianUrl + "member/getVipMember", sendData)
        .then(res => {
          if (res.httpCode == "200") {
            this.defaultPrice = res.result.price * 100;
            if (this.idData.indexOf(res.result.id) <= -1) {
              this.idData.push(res.result.id);
              this.subjectNumber = this.idData.length || 0;
            }
            this.totalPrice = this.defaultPrice / 100;
          }
          // 默认12个月
          if (this.checkArr6 == 12) {
            this.sendIdData = this.idData;
            this.allTotalPrice = this.totalPrice;
          }
        });
      // 6个月
      // let sendData6 = {
      //   productType: 3,
      //   subjectCode: this.subj,
      //   type: this.type,
      //   validityPeriod: 6
      // };
      // this.$axios
      //   .post(this.lantianUrl + "member/getVipMember", sendData6)
      //   .then(res => {
      //     if (res.httpCode == "200") {
      //       this.defaultPrice6 = res.result.price * 100;
      //       if (this.idData6.indexOf(res.result.id) <= -1) {
      //         this.idData6.push(res.result.id);
      //         this.subjectNumber = this.idData6.length || 0;
      //       }
      //       this.totalPrice6 = this.defaultPrice6 / 100;

      //       if ((this.checkArr6 == 6)) {
      //         this.sendIdData = this.idData6;
      //         this.allTotalPrice = this.totalPrice6;
      //       }
      //     }
      //   });
      // 3个月
      let sendData3 = {
        productType: 3,
        subjectCode: this.subj,
        type: this.type,
        validityPeriod: 3
      };
      this.$axios
        .post(this.lantianUrl + "member/getVipMember", sendData3)
        .then(res => {
          if (res.httpCode == "200") {
            this.defaultPrice3 = res.result.price * 100;
            if (this.idData3.indexOf(res.result.id) <= -1) {
              this.idData3.push(res.result.id);
              this.subjectNumber = this.idData3.length || 0;
            }
            this.totalPrice3 = this.defaultPrice3 / 100;

            if (this.checkArr6 == 3) {
              this.sendIdData = this.idData3;
              this.allTotalPrice = this.totalPrice3;
            }
          }
        });
    },
    // 选择科目计算金额
    clickSub(i, index, j) {
      console.log(i, index, j);
      //  i.isTrue == true?false:true;
      if (i.isTrue == false) {
        i.isTrue = true;
      } else {
        i.isTrue = false;
      }

      // 12个月
      let sendData = {
        productType: 3,
        subjectCode: i.subjectCode || sub,
        type: i.type,
        validityPeriod: 12
      };
      let sendId;
      this.$axios
        .post(this.lantianUrl + "member/getVipMember", sendData)
        .then(res => {
          if (res.httpCode == "200") {
            sendId = res.result.id || null;
            if (this.idData.length == 0) {
              this.idData.push(sendId);
              this.defaultPrice = 0;
              this.goodPrice = res.result.price * 100;
              this.subjectNumber = this.idData.length || 0;
            } else {
              this.idData.forEach((item, ind, arr) => {
                if (item == sendId) {
                  arr.splice(ind, 1);
                  this.goodPrice -= res.result.price * 100;
                  this.subjectNumber = this.idData.length || 0;
                } else {
                  if (this.idData.indexOf(sendId) == -1) {
                    this.idData.push(sendId);
                    this.goodPrice += res.result.price * 100;
                    this.subjectNumber = this.idData.length || 0;
                  }
                }
              });
            }
            this.totalPrice = (this.goodPrice + this.defaultPrice) / 100;
            this.subjectNumber = this.idData.length || 0;

            if (this.checkArr6 == 12) {
              this.sendIdData = this.idData;
              this.allTotalPrice = this.totalPrice;
            }
          }
        });
      console.log(111, this.totalPrice);
      // 6个月
      // let sendData6 = {
      //   productType: 3,
      //   subjectCode: i.subjectCode || sub,
      //   type: i.type,
      //   validityPeriod: 6
      // };
      // let sendId6;
      // this.$axios
      //   .post(this.lantianUrl + "member/getVipMember", sendData6)
      //   .then(res => {
      //     if (res.httpCode == "200") {
      //       if (res.result) {
      //         sendId6 = res.result.id || null;
      //         if (this.idData6.length == 0) {
      //           this.idData6.push(sendId6);
      //           this.defaultPrice6 = 0;
      //           this.goodPrice6 = res.result.price * 100;
      //           this.subjectNumber = this.idData6.length || 0;
      //         } else {
      //           this.idData6.forEach((item, ind, arr) => {
      //             if (item == sendId6) {
      //               arr.splice(ind, 1);
      //               this.goodPrice6 -= res.result.price * 100;
      //               this.subjectNumber = this.idData6.length || 0;
      //             } else {
      //               if (this.idData6.indexOf(sendId6) == -1) {
      //                 this.idData6.push(sendId6);
      //                 this.goodPrice6 += res.result.price * 100;
      //                 this.subjectNumber = this.idData6.length || 0;
      //               }
      //             }
      //           });
      //         }
      //         this.totalPrice6 = (this.goodPrice6 + this.defaultPrice6) / 100;
      //         this.subjectNumber = this.idData6.length || 0;

      //         if (this.checkArr6 == 6) {
      //           this.sendIdData = this.idData6;
      //           this.allTotalPrice = this.totalPrice6;
      //         }
      //       }
      //     }
      //   });

      // 3个月
      let sendData3 = {
        productType: 3,
        subjectCode: i.subjectCode || sub,
        type: i.type,
        validityPeriod: 3
      };
      let sendId3;
      this.$axios
        .post(this.lantianUrl + "member/getVipMember", sendData3)
        .then(res => {
          if (res.httpCode == "200") {
            if (res.result) {
              sendId3 = res.result.id || null;
              if (this.idData3.length == 0) {
                this.idData3.push(sendId3);
                this.defaultPrice3 = 0;
                this.goodPrice3 = res.result.price * 100;
                this.subjectNumber = this.idData3.length || 0;
              } else {
                this.idData3.forEach((item, ind, arr) => {
                  if (item == sendId3) {
                    arr.splice(ind, 1);
                    this.goodPrice3 -= res.result.price * 100;
                    this.subjectNumber = this.idData3.length || 0;
                  } else {
                    if (this.idData3.indexOf(sendId3) == -1) {
                      this.idData3.push(sendId3);
                      this.goodPrice3 += res.result.price * 100;
                      this.subjectNumber = this.idData3.length || 0;
                    }
                  }
                });
              }
              this.totalPrice3 = (this.goodPrice3 + this.defaultPrice3) / 100;
              this.subjectNumber = this.idData3.length || 0;

              if (this.checkArr6 == 3) {
                this.sendIdData = this.idData3;
                this.allTotalPrice = this.totalPrice3;
              }
            }
          }
        });
      // console.log(111, this.idData);
      console.log(222, this.totalPrice3);
    },
    // 购买前判断
    beforeBuy() {
      let sendData = {
        productType: 3,
        userCode: this.userId
      };
      this.$axios
        .post(this.lantianUrl + "member/checkUserVipMemberRecord", sendData)
        .then(res => {
          if (res.httpCode == "200") {
            this.isBuyCoupon = res.result;
          }
        });
    },
    // 立即购买
    buyNow() {
      this.userId = localStorage.getItem("token");
      if (this.userId == null) {
        this.$router.push({ path: "/login" });
      } else {
        let sendData = {
          userCode: this.uesrCode,
          userName: this.userName,
          payType: null,
          liveCourseCode: null,
          productType: 3,
          orderType: 4,
          couponCode: this.coupon,
          userMobile: this.userMobile,
          vipMemberCodeList: this.sendIdData,
          price: this.totalPrice
        };
        if (this.isBuyCoupon == false && this.coupon.length == 0) {
          this.Toast("请前往代理商购买兑换码");
        }else if (!this.sendIdData) {
          this.Toast("请选择科目");
        } else if (this.checkArr6 == 0 && this.idData.length) {
          this.Toast("请选择周期");
        }else if (!this.coupon) {
          this.Toast("请输入兑换码");
        } else if (this.idData.length) {
          this.$axios
            .post(this.lantianUrl + "agency/saveOrder", sendData)
            .then(res => {
              if (res.httpCode == "300028") {
                this.Toast(res.message);
              } else if (res.httpCode == "300029") {
                this.Toast(res.message);
              } else if (res.httpCode == "300037") {
                this.Toast(res.message);
                this.messageIfo = res.message
              } else if (res.httpCode == "500") {
                this.Toast(res.message);
              } else if (res.httpCode == "200") {
                if (res.result.vip == true) {
                  this.$router.push({ path: "/vipList" });
                }
                // else {
                //   this.$router.push({
                //     path: "/paymentPage",
                //     query: {
                //       orderId: res.result.orderId,
                //       orderPrice: res.result.orderPrice,
                //       price: res.result.price,
                //       couponFaceValue: res.result.couponFaceValue
                //     }
                //   });
                // }
              }
            });
        } else {
          this.Toast("请选择商品");
        }
      }
    }
  }
};
</script>

<style lang="scss">
.vip-center {
  background-color: #f3f3f3;
  height: 100%;
  //   会员权益
  .center-ban {
    //   width: 7.2rem;
    height: 2.8rem;
    background-image: url("../../../assets/images/vipCenter.png");
    background-size: cover;
    position: relative;
    margin-bottom: 0.15rem;
    p {
      color: #333;
      font-size: 0.24rem;
      position: absolute;
      top: 2.1rem;
      left: 0.9rem;
      .span2 {
        margin-left: 0.78rem;
        margin-right: 0.4rem;
      }
    }
  }
  //   购买会员
  .vip-contain {
    background-color: #fff;
    padding: 0.38rem 0 1.7rem 0.32rem;
    // height: 100%;
    .con-title {
      margin-bottom: 0.35rem;
      font-size: 0.28rem;
      color: #333;
    }
    .con-sub {
      // padding-top: 0.35rem;
      .sub-name {
        margin-bottom: 0.35rem;
        .circle-red {
          display: inline-block;
          width: 0.1rem;
          height: 0.1rem;
          border-radius: 50%;
          background-color: #d03131;
          position: relative;
          top: -0.03rem;
          margin-right: 0.2rem;
        }
      }
    }
    .con-sub {
      font-size: 0.24rem;
      .mint-button {
        width: 1.1rem;
        height: 0.48rem;
        padding: 0;
        border: solid 1px #fcc;
        border-radius: 0.28rem;
        font-size: 0.2rem;
        color: #d03131;
        margin-right: 0.2rem;
        margin-bottom: 0.34rem;
      }
      padding-top: .3rem;
      margin-right: .3rem;
      border-top: solid .01rem #d9d9d9;
    }
    .sub-xiaoxue{
      border-top: none;
    }
    .choose-month {
      font-size: 0.28rem;
      color: #333;
      p {
        margin-bottom: 0.3rem;
      }
      .month-button {
        text-align: center;
        display: inline-block;
        width: 1.7rem;
        height: 0.7rem;
        line-height: 0.7rem;
        // background-color: #f0f0f0;
        font-size: 0.28rem;
        color: #333;
      }

      .counpm {
        margin-bottom: 0;
        input{
          // border: none;
          width: 2.7rem;
          height: .7rem;
          //  border-radius: .05rem;
          border: solid .01rem #ccc!important;
          box-shadow:none ;
          
        }
      }
      .monthStyle {
        position: relative;
        .van-radio {
          display: inline-block;
          position: relative;
          height: 0.8rem;
          .van-radio__icon {
            // height: 0.78rem;
            height: .55rem;
            .van-icon {
              // width: 1.7rem;
              // height: 0.7rem;
              // font-size: 0;
              // background: #fff;
              // border-radius: .28rem;

                 width: 1.4rem;
    padding: 0 .4rem;
    height: 0.46rem;
    padding: 0;
    /* padding: 0 .6rem; */
    border: 0;
    border-radius: 0.28rem;
    font-size: 0;
    color: #333;
    margin-right: 0.2rem;
    text-align: center;
    margin-left: 0;
            }
          }
          .van-radio__label {
            // position: absolute;
            // left: 0;
            // bottom: 0;
            // width: 1.68rem;
            // height: 0.7rem;
            // text-align: center;
            // line-height: 0.7rem;
            // margin-left: 0;

           height: 0.55rem;
    padding: 0 .3rem;
    border-radius: 0.28rem;
    font-size: 0.2rem;
    color: #333;
    margin-right: 0.2rem;
    display: inline-block;
    text-align: center;
    line-height: 0.57rem;
    margin-left: 0;
    position: absolute;
    left: 0;
    border: #ccc 1px solid;
          }
        }
        // .m3{ margin-right: 20px;}
        .monthSty12{
          .van-radio__label{
            border: solid 1px #ffdada!important;
            color:#d03131;
          }
        }
        .monthSty3{
          .van-radio__label{
            border: solid 1px #ffdada!important;
            color:#d03131;
          }
        }
        .mon12{
          position: absolute;
          left: 1.5rem;
        }
      }
    }
  }
  footer {
    height: 0.9rem;
    padding-left: 0.3rem;
    line-height: 0.9rem;
    background-color: #fff;
    font-size: 0.24rem;
    border-top: solid 0.01rem #d9d9d9;
    position: fixed;
    width: 100%;
    bottom: 0;
    p {
      float: left;
      label {
        color: #666;
      }
      span {
        color: #d03131;
        font-size: .32rem;
      }
    }
    button {
      width: 3.2rem;
      height: 0.9rem;
      background-color: #d03131;

      color: #fff;
      float: right;
      border: 0;
    }
  }
  .ineffective {
    display: block;
    position: relative;
    top: .1rem;
    color: #f00;
  }
  .con-sub-but {
    .van-checkbox {
      display: inline-block;
      margin-bottom: 0.34rem;
      position: relative;
    }
    .van-checkbox__icon {
      // display: none;
      height: 0.55rem;
    }
    .van-checkbox__label {
      // width: 1.1rem;

      height: 0.5rem;
      padding: 0 .28rem;
      // border: solid 1px #fcc;
      // border:solid .01rem #eee;
      border-radius: 0.28rem;
      font-size: 0.2rem;
      // color: #d03131;
      color: #333;
      margin-right: 0.2rem;
      display: inline-block;
      text-align: center;
      line-height: 0.55rem;
      margin-left: 0;
      position: absolute;
      left: 0;
      border: #ccc 1px solid;
    }
    .van-icon {
      width: 1.1rem;
      height: 0.46rem;
      padding: 0;
      border: 0;
      // border: solid 1px #fcc;
      // border:solid .01rem #eee;
      border-radius: 0.28rem;
      font-size: 0;
      // color: #d03131;
      color: #333;
      margin-right: 0.2rem;

      text-align: center;
      // line-height: 0.48rem;
      margin-left: 0;
    }
    .van-checkbox__icon--checked {
      .van-icon {
        background-color: #fff;
        // border: solid 1px #fcc;
        height: 0.46rem;
      }
    }
    
    .fontColor {
      .van-checkbox__label {
        color: #d03131;
        border: solid 1px #ffdada;
      }
    }
  }
}
</style>


