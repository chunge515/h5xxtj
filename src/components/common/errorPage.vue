<template>
  <!--用户基本信息-->
  <section class="errorPage">
      <img src="../../assets/images/insured/errorlogo.png" alt="">
      <p class="P1">当前网络不太稳定</p>
      <p class="p2">点击下方按钮再试一次</p>
    <button class="btn" @click="refresh">重新加载</button>
  </section>
</template>
<script>
export default {
  props: {},
  created() {},
  data() {
    return {};
  },
  methods: {
    //   刷新父组件
      refresh(){
          this.$emit('refreshFa')
      }
  },
  computed: {},
  filters: {}
};
</script>
<style lang="scss">
.errorPage {
    padding: 3.56rem 0  0;
    text-align: center;
    height: 13.34rem;
    background-color: #fff;
    box-sizing: border-box;
    img{
        width: 2.98rem;
        margin: 0 auto;
        margin-bottom: 0.7rem;
    }
    .p1{
        color: #333;
        font-size: 0.3rem;
    }
    .p2{
        color: #17ABB9;
        margin-top: 0.2rem;
        margin-bottom: 0.48rem;
    }
    .btn{
        width: 2.8rem;
        height: 0.8rem;
        background-color: #17ABB9;
        color: #fff;
        font-size: 0.3rem;
        border: none;
        border-radius: 0.1rem;
    }
}
</style>
