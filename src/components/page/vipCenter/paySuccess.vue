<template>
  <div class="paySuccess">
    <div class="success-img">
      <img src="../../../assets/images/pay.png">
    </div>
    <p class="bt"></p>
    <div class="pay-contain">
      <p con>
        <label>支付金额</label>
        <span>30</span>
      </p>
      <p>
        <label>支付方式</label>
        <span>微信</span>
      </p>
    </div>
    <div class="test-net">
      <p>请您通过PC访问易教测评官网，体验测评服务</p>
      <p>testing.e-eduspace.com</p>
    </div>
    <div class="pay-button">
      <button @click="goBack">返回</button>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    methods: {
        goBack(){
            this.$router.push({path:'/payment'})
        }
    }
}
</script>

<style lang="scss">
.paySuccess {
  background-color: #fff;
  height: 100%;
  .success-img {
    img {
      width: 7.2rem;
    }
  }
  .bt {
    height: 0.18rem;
    background-color: #f5f5f5;
  }
  .pay-contain {
    padding: 0 0.34rem 0.3rem;
    p {
      height: 0.9rem;
      line-height: 0.9rem;
      font-size: 0.24rem;
      color: #666;
      border-bottom: solid 0.01rem #d9d9d9;
    }
  }
  .test-net {
    margin-top: 0.8rem;
    p {
      text-align: center;
      color: #999;
      font-size: .24rem;
      margin-bottom: .1rem;
    }
  }
  .pay-button {
    margin-top: 1.8rem;
    text-align: center;
    button {
      width: 3.2rem;
      height: 0.8rem;
      font-size: 0.24rem;
      color: #fff;
      background-color: #d03131;
      border-radius: 0.08rem;
      border: 0;
    }
  }
}
</style>


