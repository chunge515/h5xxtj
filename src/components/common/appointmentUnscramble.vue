<!-- 预约报告解读组件 -->
<template>
  <div class="appoint">
    <div class="box" :class="bgtype">
      <div class="title">预约专家报告解读</div>
      <div class="datetime">
        <span class="date" @click="showDatePicker">{{date.real | getTime("year")}} <i class="triangle"></i></span>
        <span class="date" @click="showDatePicker">{{date.real | getTime("month")}} <i class="triangle"></i></span>
        <span class="date" @click="showDatePicker">{{date.real | getTime("date")}} <i class="triangle"></i></span>
      </div>
      <div class="written">
        <div class="name">专家解读报告</div>
        <div class="price">
          <span class="sm">&yen;</span>
          <span class="num">300</span>
          <span class="sm">元</span>
        </div>
      </div>
      <div class="invite">
        <input type="text" placeholder="请输入兑换券码" class="inviteCode" v-model.trim="exchangeCode">
      </div>
      <div class="des">注：输入兑换劵码即可获得“成长奖金”冲抵费用</div>
      <div class="post" @click="post">提交预约</div>
      <div class="txt">
        <span>电话：</span><span>400-1023-998</span>
      </div>
      <div class="txt">
        <span>地址：</span><span>北京市西城区北三环中路23号燕莎盛世大厦8层</span>
      </div>
      <div class="erweima">
        <!--<img src="../../assets/qrcode-xgr.jpg" alt="">-->
        <div class="desc">
          本活动的最终解释权归新国人书院
        </div>
      </div>
    </div>

    <mt-datetime-picker
      v-model="date.value"
      ref="datepicker"
      type="date"
      :startDate="date.min"
      :endDate="date.max"
      @confirm="dateConfirm"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日">
    </mt-datetime-picker>

  </div>
</template>

<script>
  export default {
    name: "appointment-unscramble",
    data() {
      return {
        exchangeCode: '',
        date: {
          min: new Date(),
          max: new Date("2019/12/31"),
          value: new Date(),
          real: new Date()  //真实值
        }
      }
    },
    props: {
      bgtype: String   // 为空或者不填是红色背景，blue是蓝色背景
    },

    created() {

    },
    methods: {
      //确认选择日期
      dateConfirm(val) {
        this.date.real = this.date.value;
      },
      //显示日期选择框
      showDatePicker() {
        this.$refs.datepicker.open();
      },
      // 提交
      post() {
        this.$emit("post",{code:this.exchangeCode,date:this.date.real})
      }
    },
    filters: {
      getTime(date, type) {
        var n = 0;
        if (type === "year") {
          return date.getFullYear()
        } else if (type === "month") {
          n = date.getMonth() + 1;
          return n > 9 ? n : "0" + n;
        } else if (type === "date") {
          n = date.getDate();
          return n > 9 ? n : "0" + n;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  $be: #3ebbe5;
  $rd: #a91515;
  .appoint {

    box-sizing: border-box;
    .box {
      /* 红色底 */
      background-color: $rd;
      border-radius: .2rem;
      padding-bottom: .9rem;
      .title {
        text-align: center;
        font-size: 1.2rem;
        color: #fff;
        padding: 1.1rem 0;
      }
      .datetime {
        margin: 0 auto;
        width: 15rem;
        display: flex;
        justify-content: space-between;
        color: #fff;
        .date {
          background-color: rgba(255, 255, 255, .3);
          padding: .4rem;
          border: 1px solid rgba(255, 255, 255, .4);
          border-radius: .3rem;
          width: 3rem;
        }
        .triangle {
          border-left: .4rem solid transparent;
          border-top: .4rem solid rgba(255, 255, 255, .3);
          border-right: .4rem solid transparent;
          float: right;
          margin-top: .2rem;
          height: 0;
          width: 0;
          border-bottom: 0;
          display: inline-block;
        }
      }
      .written {
        background: url("../../../static/img/appoint-write.png") no-repeat center center;
        background-size: cover;
        width: 15rem;
        height: 5.6rem;
        margin: 0.9rem auto;
        box-sizing: border-box;
        padding-left: 1.1rem;
        padding-top: 1rem;
        .name {
          font-size: 1.3rem;
          color: #ff6816;
        }
        .price {
          background-color: $rd;
          color: #fff;
          display: inline-block;
          font-size: .4rem;
          padding: .2rem .4rem;
          margin-top: .6rem;
          .num {
            font-size: .9rem;
          }
        }
      }
      .invite {
        width: 15rem;
        margin: 0 auto;
        input {
          width: 100%;
          font-size: .6rem;
          color: rgba(255, 255, 255, .8);
          background-color: rgba(255, 255, 255, .2);
          height: 1.5rem;
          line-height: 1.5rem;
          box-sizing: border-box;
          padding: .2rem;
          box-shadow: none;
          outline: none;
          border: 1px solid rgba(255, 255, 255, .4);
          &::placeholder {
            color: rgba(255, 255, 255, .6);
          }
        }
      }
      .des {
        width: 15rem;
        color: #fff;
        font-size: .6rem;
        margin: 0 auto;
        margin-top: .5rem;
      }
      .post {
        width: 15rem;
        text-align: center;
        font-size: .9rem;
        margin: 0 auto;
        color: $rd;
        background-color: #fff;
        box-shadow: 0 4px 0 rgba(0, 0, 0, .2);
        padding: .4rem 0;
        border-radius: .3rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
      }
      .txt {
        width: 15rem;
        margin: 0 auto;
        color: #fff;
        line-height: 1.5;
      }
      .erweima {
        width: 15rem;
        text-align: center;
        margin: 0 auto;
        margin-top: .5rem;
        img {
          width: 100%;
        }
        .desc {
          font-size: .3rem;
          color: #aaa;
        }
      }

      /* 蓝色底 */
      &.blue {
        background-color: $be;
        .written {
          .name {
            font-size: 1.3rem;
            color: #25a1f8;
          }
          .price {
            background-color: $be;

          }
        }
        .post {
          color: $be;
        }
      }
    }
  }
</style>
