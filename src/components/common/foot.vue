<template>
  <div class="footer" :class="bgtype">
    <div class="txt">
      <span class="l">电话:</span><a class="r" href="tel:400-1023-998">400-1023-998</a>
    </div>
    <div class="txt">
      <span class="l">地址:</span><span class="r">北京市西城区北三环中路23号燕莎盛世大厦8层</span>
    </div>
    <div class="erweima" v-show="!hideqrcode">
    <!--  <img src="../../assets/qrcode-xgr.jpg" alt="">-->
      <div class="desc">
        本活动的最终解释权归新国人书院
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "phone",
    data(){
      return {

      }
    },
    props:[
      "hideqrcode",  // :Boolean   是否隐藏二维码和解释说明
      "bgtype"  // 为空或者不填是红色背景，blue是蓝色背景
     ],

  }
</script>

<style scoped lang="scss">
  $rd: #a91515;
  $be: #3ebbe5;
  .footer {
    background-color: $rd;
    padding: .5rem 0;
  }

  .txt {
    text-indent: 0;
    background-color: transparent;
    width: 15rem;
    margin: 0 auto;
    color: #fff;
    line-height: 1.5;
    font-size: .78rem;
    padding: 0;
    display: flex;
    justify-content: space-between;
    margin-top: .2rem;
    .l{
      flex-basis: 3rem;
      letter-spacing: .32rem;
    }
    .r{
      flex: 2;
      color: #fff;
      outline: none;
      background: transparent;
      &:active,&:visited{
        background: transparent;
      }
    }
  }

  .erweima {
    width: 15rem;
    text-align: center;
    margin: 0 auto;
    margin-top: .6rem;
    img {
      width: 100%;
    }
    .desc {
      font-size: .7rem;
      color: #f4b8b8;
      margin-top: 1.3rem;
    }
  }

  .footer.blue{
    background-color: $be;
    .erweima{
      .desc{
        color: #fff;
      }
    }
  }
</style>
