<template>
  <div class="change-userInfo">
    <div class="createInfo">
      <h3>
        <i class="fa fa-angle-left" aria-hidden="true" @click="goHome"></i> 基本信息
      </h3>
      <form class="formBox">
        <section>
          <label>您的姓名</label>
          <input type="text" v-model="info.realname">
        </section>
        <section>
          <label>您孩子的姓名</label>
          <input type="text" v-model="info.student.realname">
        </section>
        <section>
          <label>您孩子的性别</label>
          <mt-radio v-model="info.student.sex" :options="sexList" class="mt-radio"></mt-radio>
        </section>
        <section class="pd-radio">
          <label>您孩子的年级</label>
          <van-popup v-model="show" position="bottom">
            <van-picker :columns="columns" @change="onChange" />
          </van-popup>
          <input type="text" v-model="GrandList[info.student.gradeCode]" @click="showTrue" readonly="readonly">

          <div></div>
        </section>
        <section>
          <label>您孩子是否是独生子女</label>
          <mt-radio
            v-model="info.student.isSingle"
            :options="ifList"
            :value="info.student.isSingle"
            class="mt-radio"
          ></mt-radio>
        </section>

        <section class="pd-radio">
          <label>您是孩子的</label>
          <mt-radio
            v-model="info.relationType"
            :options="nexusList"
            :value="info.relationType"
            class="mt-radio"
          ></mt-radio>
        </section>
      </form>
      <div class="change-info">
        <mt-button class="change-button" @click="goInfo(info)">提交</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
import changeHeader from "@/components/common/userHeader.vue";
import { localData } from "../../../api";
export default {
  components: {
    changeHeader
  },
  props: {},
  created() {
    this.getInfo();
  },
  mounted() {},
  data() {
    return {
      info: {
        student: { sex: "", isSingle: "" },
      },
      columns: ['一年级', '二年级', '三年级', '四年级', '五年级','六年级', '七年级', '八年级', '九年级',"中考","高一","高二","高考"],
      show: false,
      sex: "",
      showToolbar: true,
      sexList: [{ value: "0", label: "女" }, { value: "1", label: "男" }],
      ifList: [{ value: "1", label: "是" }, { value: "0", label: "否" }],
      nexusList: [
        { value: "1", label: "父亲" },
        { value: "0", label: "母亲" },
        { value: "2", label: "其他监护人" }
      ],
      message: "请选择年级",
      grades: [], //学年列表
      userInfo: "" //
    };
  },
  methods: {
    //获取年级列表
    getGrade() {},
    getInfo() {
      this.info = localData.get("sendInfo").student ? localData.get("sendInfo") : this.info ;
      this.info.student.sex = this.info.student.sex + "";
      this.info.student.isSingle = this.info.student.isSingle + "";
    },
    //返回个人中心
    goHome() {
      this.$router.push({ path: "/mine" });
    },
    // 选择年级
    onChange(picker, value, index) {
      if(index<6){
        index = index + 11;
      }else if(5<index && index<10){
        index = index + 15; 
      }else{
        index = index + 21;
      }
      console.log(index)
      this.info.student.gradeCode = index
    },
    showTrue(){
      this.show = true;
    },
    //修改信息
    goInfo(i) {
      console.log(i);
      let sendData = {
        gradeCode: i.student.gradeCode || "",
        isSingle: i.student.isSingle,
        mobile: i.mobile,
        realname: i.realname,
        relationType: i.relationType,
        schoolCode: i.student.schoolId,
        schoolName: i.student.schoolName,
        sex: i.student.sex,
        studentName: i.student.realname || ""
      };
      this.$axios
        .post("/user/saveOrUpdateEvaluationParent", sendData)
        .then(res => {});
      this.$router.push({ path: "/userInfo" });
      localData.delete("sendInfo");
      localData.set("changeInfo", i);
    }
  },
  computed: {},
  filters: {}
};
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
.change-userInfo {
  .createInfo {
    // padding:1.2rem 1rem;
    background-color: #ffffff;
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
      .fa {
        position: absolute;
        // top: 0.29rem;
        left: 0.35rem;
        cursor: pointer;
      }
    }
    .formBox {
      background-color: #fff;
      font-size: 0.9rem;
      section {
        font-size: 0.36rem;
        color: #1a1a1a;
        padding: 0 0.3rem;
        padding-top: 0.44rem;
        input {
          width: 100%;
          height: 1rem;
          margin-top: 0.3rem;
          border: none;
          box-shadow: none;
          border: solid .01rem #ccc;
          box-sizing: border-box;
          padding-left: .4rem;
          // padding-left: .2rem;
        }
        input,
          textarea {
              border: 0; /* 方法1 */
              -webkit-appearance: none; /* 方法2 */
          }
      }
      span {
      }
      input,
      .my-content-list {
        padding: 0 0.6rem;
        box-shadow: none;
      }
      .mt-radio {
        .mint-cell {
          border: solid 0.01rem #ccc;
          margin-bottom: 0.2rem;
        }
        .mint-radio-label {
          color: #666;
          font-size: 0.3rem;
          margin-left: 0.2rem;
        }
      }
      .pd-radio {
        padding-top: 0.24rem;
      }
    }
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
      font-size: 0.24rem;
      color: #fff;
      border-radius: 0.11rem;
    }
  }
  input{
      width: 2.7rem;
          height: .7rem;
          //  border-radius: .05rem;
          border: solid .01rem #ccc!important;
          box-shadow:none ;
  }
}
</style>
