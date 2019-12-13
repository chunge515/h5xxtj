<template>
  <!--用户基本信息-->
  <section class="signSuccess">
    <div class="page_banner">
      <div class="qrCode">
        <div class="sign_title">
          <p>我们将尽快与您联系!</p>
          <p>
            您可关注“<span style="color: #FF281C">学习体检</span>”公众号领取测评大礼包。
          </p>
          <div class="qr_img">
              <img src="../../../assets/images/insured/qrcode.png" alt="">
          </div>
          <p>长按识别关注“学习体检公众号”</p>
        </div>
        <img class="yellow" src="../../../assets/images/insured/yellow.png" alt="">
      </div>
    </div>
  </section>
</template>
<script>
export default {
  components: {},
  props: {},
  created() {},
  data() {
    return {};
  },
  methods: {},
  computed: {},
  filters: {}
};
</script>
<style lang="scss">
.signSuccess {
  position: relative;
  height: 100%;
  background-color: #15aab8;
  font-family: "PingFang-Medium";
  .page_banner {
    padding-top: 5.7rem;
    width: 7.5rem;
    height: 13.34rem;
    background-image: url("../../../assets/images/insured/signBanner.png");
    background-size: contain;
    background-image: no-repeat;
    box-sizing: border-box;
  }
  .qrCode {
    box-sizing: border-box;
    padding: 0.83rem 0 0.89rem;
    margin: 0 auto;
    width: 6.9rem;
    height: 6.66rem;
    border-radius: 0.1rem;
    background-color: #fff;
    font-size: 0.3rem;
    color: #333;
    text-align: center;
    position: relative;
    .sign_title {
        p:nth-child(1){
            margin-bottom: 0.2rem;
        }
    }
    .qr_img{
        margin: 0.67rem 0 0.27rem;
        img{
            width: 2.9rem;
        }
    }
    .yellow{
        position: absolute;
        width: 0.75rem;
        right: -0.2rem;
        bottom: -0.38rem;
    }
  }
}
</style>
