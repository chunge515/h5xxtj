<template>
  <div class="my-order">
      <div class="guangwang">
      <p>请您通过PC访问易教测评官网，体验测评服务</p>
      <p>testing.e-eduspace.com</p>
    </div>
    <!-- <order-header></order-header> -->
    <div class="order-contain" :class="{sty: isH}">
      <div class="con-main" v-for="(i,index) in orderList" :key="index">
        <!-- 订单号 -->
        <div class="con-p">
          <p>
            <label>订单号:</label>
            <span>{{i.orderId}}</span>
            <!-- <span class="p-status">待支付</span> -->
            <span v-show="i.status == 1" class="p-status">待支付</span>
            <span v-show="i.status == 2" class="p-status-2">已支付</span>
            <span v-show="i.status == 3" class="p-status-2">已取消</span>
          </p>
        </div>
        <!-- 订单名称金额 -->
        <div class="con-detail">
          <p class="det-title">{{i.liveCourseName}}</p>
          <p>
            <label>包含服务:</label>
            <!-- <span>测评</span> -->
            <span v-show="i.liveCourseType == 3">测评</span>
            <span v-show="i.liveCourseType == 4">专家咨询</span>
            <span class="det-price">
              <label>实付金额:</label>
              <span>
                <!--<span v-show="i.price != 0">￥</span>-->
                {{i.price}}
              </span> 元
            </span>
          </p>
        </div>
        <!-- 继续支付 -->
        <div class="con-status" v-if="i.status == 1">
          <p>
            <span class="fa-button">
              <!-- <mt-button class="sta-button">取消订单</mt-button>
              <mt-button  >继续支付</mt-button>-->
              <span class="sta-button">取消订单</span>
              <span class="sta-button sta-pay">继续支付</span>
            </span>
          </p>
        </div>
      </div>

      <!-- <div class="con-main">
        订单号
        <div class="con-p">
          <p>
            <label>订单号:</label>
            <span>137464464654564</span>
            <span class="p-status-2">已支付</span>
          </p>
        </div>
        订单名称金额
        <div class="con-detail">
          <p class="det-title">2018年10月23日高三数学考试第一单元语文人教版</p>
          <p>
            <label>包含服务:</label>
            <span>测评</span>
            <span class="det-price">
              <label>实付金额:</label>
              <span>30</span> 元
            </span>
          </p>
        </div>
        继续支付
        <div class="con-status" v-show="isShow">
          <p>
            <span class="fa-button">
              <span class="sta-button">取消订单</span>
              <span class="sta-button sta-pay">继续支付</span>
            </span>
          </p>
        </div>
      </div>-->
    </div>
  
  </div>
</template>

<script>
import orderHeader from "@/components/common/userHeader.vue";
export default {
  data() {
    return {
      orderList: [],
      isShow: false,
      userId: null,
      isH: false,
      istrue:false
    };
  },
  components: {
    orderHeader
  },
  created() {
    this.getOrderList();

  },
  mounted(){

  },
  methods: {
    // 获取订单列表数据
    getOrderList() {
      this.userId = localStorage.getItem("token");
      let sendData = {
        orderId: null,
        payType: null,
        productType: 3,
        userCode: this.userId,
        status: null
      };
      this.$axios
        .post(this.lantianUrl + "agency/getOrderList", sendData)
        .then(res => {
          if (res.httpCode == "200") {
            console.log(res);
            this.orderList = res.result.list;
            if(this.orderList.length < 4){
              this.isH = true;
              this.istrue = true
              console.log(9999)
            }else{
               this.isH = false;
              this.istrue = false
            }
          }
        });
    }
  }
};
</script>
<style lang="scss">
.my-order {
  background-color: #f5f5f5;
  // min-height: 14rem;
  // height: 100%;
  .order-contain {
    margin-top: 0.25rem;
    padding: 0 0.2rem;
    // min-height: 9.9rem;
    .con-main {
      border-radius: 0.08rem;
      width: 100%;
      background-color: #fff;
      margin-bottom: 0.2rem;
      box-shadow: 3px 3px 5px #e9e9e9;
      p {
        height: 0.7rem;
        line-height: 0.7rem;
        color: #666;
        font-size: 0.24rem;
        padding: 0 0.2rem;
        .p-status {
          color: #d03131;
          float: right;
        }
        .p-status-2 {
          color: #666;
          float: right;
        }
      }
      .con-p {
        border-top: solid #d03131 0.025rem;
        margin: 0 0.05rem 0 0.05rem;
      }

      .con-detail {
        height: 1.54rem;
        border-top: solid 0.01rem #e8e8e8;
        font-size: 0.24rem;
        color: #666;
        .det-title {
          color: #333;
          font-size: 0.28rem;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .det-price {
          float: right;
          span {
            font-size: 0.32rem;
            color: #d03131;
          }
        }
      }
      .con-status {
        height: 0.85rem;
        border-top: solid 0.01rem #e8e8e8;
        color: #666;
        p {
          height: 0.85rem;
          line-height: 0.85rem;
          text-align: center;
          position: relative;
          .fa-button {
            display: inline-block;
            height: 0.4rem;
            position: absolute;
            right: 0.2rem;
          }
          // span{
          //     position: absolute;
          //     right: 0;
          // }
          .sta-pay {
            background-color: #ff9b19;
            border: 0;
            margin-left: 0.1rem;
          }
        }
        .sta-button {
          display: inline-block;
          font-size: 0.2rem;
          width: 1.26rem;
          height: 0.4rem;
          line-height: 0.45rem;
          border: solid 0.011rem #d9d9d9;
          border-radius: 0.5rem;
          padding: 0;
          cursor: pointer;
        }
      }
    }
  }
  .guangwang {
    padding-top:.5rem; 
    p {
      width: 100%;
      text-align: center;
      font-size: 0.24rem;
      color: #999;
    }
  }
  .guan{
    padding: 0;
    padding-bottom: 1rem;
    // margin-top: 10rem;
  }
  .sty{height: 12rem}
}
</style>


