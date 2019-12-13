<template>
  <!--用户基本信息-->
    <section class="userInfo">
      <section class="head">基本信息</section>
      <section class="body">
        <ul>
          <li><span>1、您孩子的姓名</span><span>{{student.realname}}</span></li>
          <li><span>2、您孩子的性别</span><span>{{student.sex==0?"女":"男"}}</span></li>
          <li><span>3、您孩子的年级</span><span>{{gradeName}}</span></li>
          <li><span>4、是否为独生子女</span><span>{{student.isSingle==0?"否":"是"}}</span></li>
          <li><span>5、您是孩子的</span><span>{{relation[student.relationType]}}</span></li>
        </ul>
      </section>
      <mt-button type="default" size="large" @click.prevent="change()">修改</mt-button>
    </section>
</template>
<script>
    export default {
        components: {},
        props: {},
        created() {
        },
        mounted() {
          var $this=this;
          $this.userInfo=JSON.parse(window.localStorage.getItem("userInfo"));
          $this.student=$this.userInfo.student;
          $this.student.relationType=$this.userInfo.relationType;
          $this.getGrade();
        },
        data() {
            return {
              userInfo:'',
              student:{},
              relation:{
                "0":'母亲',
                "1":'父亲',
                "2":'其他监护人'
              },
              gradeName:''
            }
        },
        methods: {
          //修改按钮
          change(){
            this.$router.push({path:'/userInfo',query:{type:1}})
          },
          //获取年级列表
          getGrade() {
            var $this=this;
            this.$axios({
              method: "post",
              url:  this.apiURL + "/jeecg/rest/support/grade/getGrades",
              data: {
                appKey: "string",
                token: "string"
              }
            }).then((res) => {
              var grades = res.result || [];
              grades.forEach(function (val) {
                if(val.gradeCode==$this.student.gradeCode){
                  $this.gradeName=val.gradeName
                }
              })
            }).catch(err => {
              // console.log(err);
              this.Toast(err.message);
            })
          },
        },
        computed: {},
        filters: {},
    }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
.userInfo{
  background-color: #f4f4f4;
  min-height:100%;
  width:100%;
  .head{
    height: 3.65rem;
    line-height:3.65rem;
    border-bottom: 0.2rem solid #f2f2f2;
    padding:0 1rem;
    box-sizing: border-box;
    font-size: 1rem;
    color: #333;
    font-weight: bold;
    background-color: #fff;
  }
  .body,ul{
    width:100%;
    li{
      width:100%;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      flex-wrap: wrap;
      height:3rem;
      line-height: 3rem;
      border-bottom: 1px solid #d8d8d8;
      padding:0 1rem;
      box-sizing: border-box;
      background-color: #fff;
      &:last-child{
        border:none;
      }
    }

  }
  button{
    margin:0 1rem;
    position: fixed;bottom: 1rem;
    left:0;
    box-sizing: border-box;
    width:-webkit-calc(100% - 2rem);
    width:-moz-calc(100% - 2rem);
    width:calc(100% - 2rem);
    border:none;
    color: #fff;
    background-color:#a91515 ;
  }
}
</style>
