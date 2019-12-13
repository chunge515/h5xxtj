<template>
  <div class="do">
    hello world

    <mt-button type="default" @click="oast" class="hello">default</mt-button>
    <mt-button type="default" @click="box" class="hello">box</mt-button>
  </div>
</template>

<script>
  export default {
    name: "hello",
    created: function () {
      // console.log("hello")
      var _this = this;
      setTimeout(function () {
        _this.$axios.get("http://www.baidu.com").then(res=>{
          // console.log("=============",res)
        }).catch(e=>{
          // console.warn("===",e,e.message)
        })
      },1000)

    },
    methods: {
      box(){
        this.MessageBox({
          title:"hello",
          message:"world",
          showCancelButton: true
        })
      },
      oast() {
        // console.log(this)
        this.Toast({
          message: "这是提示",
          duration: 2000
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .do{
    .hello{
      color: red;
    }
  }
</style>
