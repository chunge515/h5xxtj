<template>
  <div class="userInfo">
    <div class="createInfo">
      <h3><i class="fa fa-angle-left" aria-hidden="true" @click="goHome"></i> 基本信息</h3>
      <form class="formBox">
        <section>
          <label>您的姓名</label>
          <span>{{info.realname}}</span>
        </section>
        <section>
          <label>您孩子的姓名</label>
          <span>{{info.student.realname}}</span>
        </section>
        <section>
          <label>您孩子的性别</label>
          <span v-if="info.student.sex == 1">男</span>
          <span v-if="info.student.sex == 0">女</span>
        </section>
        <section>
          <label>您孩子的年级</label>
          <span>{{GrandList[info.student.gradeCode]}}</span>
        </section>
        <section>
          <label>您孩子是否是独生子女</label>
          <span v-if="info.student.isSingle == 1">是</span>
          <span v-if="info.student.isSingle == 0">否</span>
        </section>
        <section class="endSection">
          <label>您是孩子的</label>
          <span v-if="info.relationType == 0">母亲</span>
          <span v-if="info.relationType == 1">父亲</span>
          <span v-if="info.relationType == 2">其它监护人</span>
        </section>
      </form>
      <div class="change-info">
        <mt-button class="change-button" @click="goChangeInfo(info)">修改</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
import infoHeader from '@/components/common/userHeader.vue'
import { localData } from '../../../api';
export default {
  components: {
    infoHeader,
  },
  props: {},
  created() {
    this.getAuthenInfo()
  },
  mounted() {},
  data() {
    return {
      info:{
        student:{}
      },
    };
  },
  methods: {
    //获取用户登录后的信息
    getAuthenInfo() {
      this.userId = localStorage.getItem("token");
      console.log
      let sendData = {
        appKey: null,
        token: null,
        userId: localStorage.getItem("token") || "0026671c593c480099998c47429c3536"
      };
      this.$axios.post("/user/getAssessmentAuthenticatedInfo", sendData,
        sendData
      ).then(res =>{
        if(res.code == "000000"){
          this.info = this.localData.get("changeInfo") || res
        }

      })
    },
    //返回个人中心
    goHome(){
      this.$router.push({path:"/mine"})
    },

    //修改信息
    goChangeInfo(i){
      localData.delete("changeInfo")
      console.log(i)
      this.$router.push({path:"/changeInfo"})
      let sendInfo;
      localData.set("sendInfo",i)
    },
  },
  computed: {},
  filters: {}
};
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
.userInfo {
  background-color: #f5f5f5;
  height: 100%;
  .createInfo {
    // padding:1.2rem 1rem;
    background-color: #f5f5f5;
    // min-height:100%;
    // color: #1a1a1a;
    h3 {
      color: #333;
      font-size: 0.28rem;
      line-height: 0.9rem;
      text-align: center;
      height: 0.9rem;
      font-weight: normal;
      background-color: #f5f5f5;
      border-bottom: solid #e1e1e1 0.01rem;
      position: relative;
      .fa{
        position: absolute;
        top: 0;
        left: .35rem;
        cursor: pointer;
      }
    }
    .formBox {
      background-color: #fff;
      // font-size: 0.9rem;
      section {
        height: 1.2rem;
        font-size: 0.307rem;
        color: #333;
        line-height: 1.2rem;
        padding: 0 0.3rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: #e1e1e1 solid 0.01rem;
      }
      label {
        // height:2rem;
        // line-height: 2rem;
      }
      span {
        content: "*";
        // color: #ef5666;
        margin-left: 0.1rem;
        float: right;
      }
      input,
      .my-content-list {
        padding: 0 0.6rem;
        box-shadow: none;
      }
    }
    .endSection{border: 0!important}
  }
  .change-info {
    width: 100%;
    text-align: center;
    margin-top: 1.4rem;
    .change-button {
      width: 3.21rem;
      height: 0.77rem;
      line-height: 0.77rem;
      background-color: #d03131;
      font-size: .28rem;
      color: #fff;
      border-radius: 0.11rem;
    }
  }
}
</style>
