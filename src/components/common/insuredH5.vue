<template>
  <!--用户基本信息-->
  <section class="insured">
    <div class="page_main">
      <!-- 提交表单 -->
      <div class="page_submit">
        <p class="sub_title">请如实填写以下信息</p>
        <p class="sub_tips">（注意：上海、江苏暂不支持此活动）</p>
        <div class="sub_div">
          <mt-field label="*" type="text" placeholder="请输入学生姓名" v-model="username"></mt-field>
        </div>
        <div class="sub_div" v-if="type == 1">
          <mt-field
            label="*"
            placeholder="请输入您的手机号"
            :disableClear="true"
            type="tel"
            v-model="phone"
          >
            <span class="yzm_style" @click="getVerCode" v-if="time == 60 ">获取验证码</span>
            <span class="yzm_style" v-else>
              再次获取
              <span class="countdown_style">{{time}}</span> s
            </span>
          </mt-field>
        </div>
        <div class="sub_div" v-if="type == 1">
          <mt-field label="*" placeholder="请输入验证码" type="text" v-model="yzm"></mt-field>
        </div>
        <div class="sub_div">
          <mt-field
            label="*"
            placeholder="请选择所在省份"
            v-model="provinceName"
            ref="scanTextbox"
            :readonly="true"
            :disableClear="true"
            @focus.native.capture="checkProvince"
          >
            <mt-popup v-model="popupShow" position="bottom" class="pro_popup" lockScroll="false" @touchmove.native.stop.prevent>
              <mt-picker :slots="provinceList" value-key="areaName" showToolbar ref="mypicker">
                <div class="picker-toolbar-title">
                  <span class="usi-btn-cancel" @click="popupShow = false">取消</span>
                  <!-- <span class>{{provinceName}}</span> -->
                  <span class="usi-btn-sure" @click="selectArea">确定</span>
                </div>
              </mt-picker>
            </mt-popup>
            <img class="xia" src="../../assets/images/insured/xia.png" alt />
          </mt-field>
        </div>
        <!-- 选择学科 -->
        <div class="subject_style" v-if="isBeijing != 0">
          <p class="sub_p_title">
            <span class="star">*</span>
            <span class="sub_span2">高考科目</span>
            <span v-if="isBeijing == 1">
              (除
              <span class="sub_blue">语数英</span>外, 请再选三个学科)
            </span>
            <span v-if="isBeijing == 2">(请选择文科或理科)</span>
          </p>
          <!-- 北京天津 -->
          <div class="sub_btn" v-if="isBeijing == 1">
            <div class="sub_btn_div">
              <mt-button
                v-for="(item, index) in subjectList"
                :key="index"
                :class="item.isChoose ? 'active_btn' : ''"
                @click="chooseSubject(item, index)"
              >{{item.name}}</mt-button>
            </div>
          </div>
          <!-- 其他城市 -->
          <div v-if="isBeijing == 2" class="admitted">
            <p @click="chooseDiscipline('1')" :class="artType == '1' ? 'check_style' : ''">文科</p>
            <p @click="chooseDiscipline('2')" :class="artType == '2' ? 'check_style' : ''">理科</p>
          </div>
          <p class="sub_notice">注意:&ensp; 确认科目后不可更改!</p>
        </div>
        <div class="sub_div no_margin_btm">
          <mt-field placeholder="请输入邀请码 (非必填)" v-model="inviteCode"></mt-field>
        </div>

        <div class="signUp">
          <mt-button @click="appointment">预约报名</mt-button>
        </div>

        <!-- 确认弹框 -->
        <div class="confirmation_box">
          <mt-popup v-model="confirmationShow" class="confim_box">
            <div class="con_box_ban">
              <img src="../../assets/images/insured/banner3.png" alt />
            </div>
            <div class="con_box_con">
              <p>
                <label>学生姓名</label>
                <span></span>
                <span>{{username}}</span>
              </p>
              <p>
                <label>手机号</label>
                <span></span>
                <span>{{phone}}</span>
              </p>
              <p>
                <label>学生省份</label>
                <span>{{provinceName}}</span>
              </p>
              <p>
                <label>所选学科</label>
                <span v-for="(item,index) in selectSub" :key="index">{{item.name}}&ensp;</span>
              </p>
              <p>
                <label>邀请码</label>
                <span>{{inviteCode}}</span>
              </p>
            </div>

            <div class="signUp confim_btn">
              <mt-button @click="confirmation">预约报名</mt-button>
            </div>
          </mt-popup>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  components: {},
  props: ["type"], //1--> 宣传页
  data() {
    return {
      username: "", // 学生姓名
      phone: "",
      pwd: "",
      yzm: "",
      provinceName: "", //省名称
      provinceId: "", //省id,
      popupShow: false, //选择省弹框
      provinceList: [{ values: [] }], //省
      inviteCode: "", //邀请码
      subjectList: [
        { name: "物理", code: "4", isChoose: false },
        { name: "化学", code: "5", isChoose: false },
        { name: "生物", code: "6", isChoose: false },
        { name: "历史", code: "7", isChoose: false },
        { name: "地理", code: "8", isChoose: false },
        { name: "政治", code: "9", isChoose: false }
      ],
      selectSub: [], //所选的科目

      time: 60, //获取验证码倒计时
      confirmationShow: false, //确认报名
      yzmIsTrue: false,
      isBeijing: 0, //默认不选, 1-->北京天津浙江  , 2其他城市
      artType: 0, //文理科 0-->不分  1-->文科 2-->理科
      isDelProvince: false //是否取消选择省份
    };
  },
  created() {
    if (this.type == 1) {
      localStorage.clear();
    }
    this.username =
      (JSON.parse(localStorage.getItem("web")) &&
        JSON.parse(localStorage.getItem("web")).realname) ||
      "";
    this.phone =
      (JSON.parse(localStorage.getItem("web")) &&
        JSON.parse(localStorage.getItem("web")).mobile) ||
      "";
  },
  mounted() {
    this.getProvince();
  },
  methods: {
    // 点击选择省份
    checkProvince(e) {
      let _this = this;
      _this.popupShow = true;
      //   _this.$refs.scanTextbox.$refs.input.blur(); //禁止弹出手机键盘
    },
    // 点击省份
    selectArea() {
      const val = this.$refs.mypicker.getValues();
      if (!val[0]) return;
      //制空所选学科或文理科
      this.subjectList.forEach(item => {
        item.isChoose = false;
      });
      this.selectSub = [];
      this.artType = 0;
      this.provinceName = val[0].areaName;
      this.provinceId = val[0].areaId;
      if (
        this.provinceId == "110000" ||
        this.provinceId == "120000" ||
        this.provinceId == "330000"
      ) {
        this.isBeijing = 1; //选择的北京天津
      } else {
        this.isBeijing = 2; //其他城市
      }

      this.popupShow = false;
    },
    // 选择文理科
    chooseDiscipline(val) {
      this.artType = val;
    },
    // 获取省接口
    getProvince() {
      this.$axios.post("/area/getAreas", {}).then(res => {
        if (res.code == "000000") {
          // 去除上海/江苏选项
          this.provinceList[0].values = res.areas.filter(
            (item, i) => item.areaId !== "320000" && item.areaId !== "310000"
          );

          let info = JSON.parse(localStorage.getItem("web"));
          const provinceId =
            info && info.student.provinceId ? info.student.provinceId : "";
          if (provinceId) {
            const slotValue = res.areas.filter(
              (item, i) => item.areaId === provinceId
            );
            this.provinceName = slotValue[0].areaName;
            this.provinceId = slotValue[0].areaId;
            if (
              this.provinceId == "110000" ||
              this.provinceId == "120000" ||
              this.provinceId == "330000"
            ) {
              this.isBeijing = 1; //选择的北京天津
            } else {
              this.isBeijing = 2; //其他城市
            }
          }
        }
      });
    },
    getUserInfo() {},
    // 选择学科
    chooseSubject(i, index) {
      this.selectSub = [];
      this.subjectList.forEach((item, index) => {
        if (item.isChoose) {
          this.selectSub.push({ name: item.name, code: item.code });
        }
      });
      if (this.selectSub.length == 3 && !i.isChoose) {
        this.Toast("只能选择三门学科");
        return;
      }
      if (this.selectSub.length == 2 && !i.isChoose) {
        //选择两科后再选一科
        this.selectSub.push({ name: i.name, code: i.code });
      }
      if (this.selectSub.length == 3 && i.isChoose) {
        //选满三科后撤销一科
        this.selectSub = this.selectSub.filter(item => {
          item.code != i.code;
        });
      }
      this.subjectList[index].isChoose = !i.isChoose;
    },
    // 获取验证码
    getVerCode() {
      let self = this;
      if (self.time != 60) return;
      // let myreg = /^1[34578]\d{9}$/;
      let myreg = /^1\d{10}$/;
      if (this.phone.length > 0) {
        if (!myreg.test(this.phone)) {
          this.Toast("请填写正确的手机号");
          return;
        }
      } else {
        this.Toast("手机号码不能为空");
        return;
      }

      self.$axios
        .post("/sms/evaluationSMS", {
          mobile: self.phone,
          productType: 1
        })
        .then(res => {
          if (res.code == "000000") {
            this.Toast("动态码已发送,请查看手机");
            var sendTimer = setInterval(function() {
              self.time--;
              if (self.time == 0) {
                clearInterval(sendTimer);
                self.time = 60;
              }
            }, 1000);
          }
        });
    },
    // 校验验证码
    checkSMSCode() {
      if (!this.yzm) {
        this.Toast("验证码不能为空");
        return;
      }
      return this.$axios.post("sms/checkSMSCode", {
        mobile: this.phone,
        smsCode: this.yzm
      });
    },

    // 预约报名
    appointment() {
      if (!this.username) {
        this.Toast("学生姓名不能为空");
        return;
      }
      let myreg = /^1\d{10}$/;
      if (this.phone.length > 0) {
        if (!myreg.test(this.phone)) {
          this.Toast("请填写正确的手机号");
          return;
        }
      } else {
        this.Toast("手机号码不能为空");
        return;
      }

      if (!this.provinceName) {
        this.Toast("省份不能为空");
        return;
      }
      if (this.isBeijing == 1 && this.selectSub.length < 3) {
        //北京天津
        this.Toast("所选学科不够三科");
        return;
      }
      if (!this.artType && this.isBeijing == 2) {
        this.Toast("请选择文理科");
        return;
      }

      // 学习体检内嵌页面,不验证手机号,手机号跟随登录手机号
      if (!this.artType) {
        // 去重科目
        this.selectSub = [
          { name: "语文", code: "1" },
          { name: "数学", code: "2" },
          { name: "英语", code: "3" }
        ].concat(this.selectSub);
        let obj = {};
        this.selectSub = this.selectSub.reduce(function(item, next) {
          obj[next.code] ? "" : (obj[next.code] = true && item.push(next));
          return item;
        }, []);
      } else if (this.artType == 1) {
        this.selectSub = [
          { name: "语文", code: "1" },
          { name: "数学", code: "2" },
          { name: "英语", code: "3" },
          { name: "历史", code: "7" },
          { name: "地理", code: "8" },
          { name: "政治", code: "9" }
        ];
      } else {
        this.selectSub = [
          { name: "语文", code: "1" },
          { name: "数学", code: "2" },
          { name: "英语", code: "3" },
          { name: "物理", code: "4" },
          { name: "化学", code: "5" },
          { name: "生物", code: "6" }
        ];
      }

      this.selectSub.sort((a, b) => {
        return a.code - b.code;
      });
      if (this.type == 1) {
        this.checkSMSCode().then(res => {
          if (res.code != "000000") {
            this.Toast(res.message);
          } else {
            this.confirmationShow = true;
          }
        });
      } else {
        this.confirmationShow = true;
      }
    },
    // 确认报名
    confirmation() {
      let subjectcode = [];
      this.selectSub.forEach(item => {
        subjectcode.push(item.code);
      });
      subjectcode = subjectcode.join();
      let params = {
        childRealName: this.username,
        parentMobile: this.phone,
        yzm: this.yzm,
        areaId: this.provinceId,
        areaName: this.provinceName,
        gradeCode: "33",
        inviteCode: this.inviteCode,
        subjectCodes: subjectcode,
        artType: this.artType
      };
      //h5跳到测评页
      this.$axios
        .post("userSubjectInsuranceRecord/saveRecord", params)
        .then(res => {
          if (res.code === "000000") {
            if (this.type == 1) {
              //宣传页跳转到预约成功
              this.$router.push({
                path: "/signSuccess"
              });
            } else {
              this.$emit("isGoFather", params);
            }
          } else if (res.code === "000600") {
            this.Toast(res.message);
          }
        });
    },
  },
  computed: {},
  filters: {}
};
</script>
<style lang="scss">
.insured {
  background-color: #fff;
  font-family: "PingFangRegular";
  // height: 100%;
  .page_main {
    .page_banner {
      width: 100%;
      height: 5rem;
      background-color: #ccc;
    }
    .page_submit {
      .sub_title {
        padding-top: 0.67rem;
        margin-bottom: 0.1rem;
        text-align: center;
        color: #08535a;
        font-size: 0.36rem;
        width: 100%;
      }
      .sub_tips {
        color: #08535a;
        font-size: 0.25rem;
        text-align: center;
        margin-bottom: 0.2rem;
      }
      .sub_div {
        position: relative;
        padding: 0 0.55rem;
        margin-bottom: 0.4rem;
        .mint-cell-title {
          width: 0.19rem;
          color: #ed190d;
          font-size: 0.3rem;
          margin-right: 0.2rem;
        }
        .mint-cell-wrapper,
        .mint-cell:last-child {
          background-size: 100% 0;
        }
        .mint-cell-wrapper {
          padding: 0;
        }
        .mint-cell {
          border-bottom: solid 0.01rem #b2b2b2;
        }
        .yzm_style {
          font-size: 0.3rem;
          color: #17abb8;
        }
        .mint-field-core {
          color: #333;
          font-size: 0.34rem;
          font-family: "PingFangMedium";
        }
        .countdown_style {
          display: inline-block;
          width: 20px;
          text-align: center;
          color: #ff281c;
        }
        .xia {
          width: 0.2rem;
        }
      }
    }
    .pro_popup {
      width: 100%;
      .picker-toolbar-title {
        padding: 0.3rem 0rem 0;
        display: flex;
        justify-content: space-around;
        span {
          flex: 1;
        }
        span:first-child {
          padding-left: 0.3rem;
        }
        span:last-child {
          text-align: right;
          padding-right: 0.3rem;
        }
      }
    }
    .subject_style {
      padding: 0 0.55rem;
      font-size: 0.3rem;
      color: #393939;
      margin-bottom: 0.2rem;
      .sub_p_title {
        .star {
          color: #ed190d;
          margin-right: 0.2rem;
        }
        .sub_span2 {
          font-size: 0.34rem;
        }
        .sub_blue {
          color: #17abb8;
        }
      }
      .sub_notice {
        color: #ff281c;
        width: 100%;
        text-align: center;
        font-size: 0.25rem;
      }
      .sub_btn {
        margin: 0.5rem 0 0.2rem;
        .mint-button {
          width: 1.72rem;
          height: 0.8rem;
          background: #fff;
          color: #a9a9a9;
          border-radius: 0.1rem;
          font-size: 0.34rem;
          border: solid 0.01rem #b2b2b2;
        }
        .sub_btn_div {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .mint-button:nth-child(1) {
            margin-bottom: 0.4rem;
          }
        }
        .div1 {
          margin-bottom: 0.4rem;
        }
      }
      .active_btn {
        background-color: #17abb8 !important;
        color: #fff !important;
        border: none !important;
      }
      .admitted {
        p {
          width: 6.42rem;
          height: 0.8rem;
          line-height: 0.8rem;
          text-align: center;
          margin: 0 auto;
          font-size: 0.34rem;
          color: #a9a9a9;
          border: solid 1px #b2b2b2;
          margin-bottom: 0.4rem;
          border-radius: 0.1rem;
        }
        p:nth-child(1) {
          margin-top: 0.51rem;
        }
        p:nth-child(2) {
          margin-bottom: 0.2rem;
        }
      }
      .check_style {
        background-color: #17abb8;
        color: #fff !important;
        border: solid 1px #17abb8 !important;
      }
    }
    .no_margin_btm {
      margin-bottom: 0 !important;
      .mint-cell {
        padding-left: 0.38rem;
      }
    }
    .red {
      color: red;
    }
    .signUp {
      margin: 0 0.54rem;
      margin-top: 0.55rem;
      padding-bottom: 1.12rem;
      .mint-button {
        width: 100%;
        height: 0.96rem;
        background-color: #17abb8;
        color: #fff;
        font-size: 0.34rem;
      }
    }
    .confirmation_box {
      width: 100%;
      .confim_box {
        font-family: "PingFangMedium";
        width: 92%;
        border-radius: 0.1rem;
        overflow: hidden;
        .con_box_ban {
          height: 3.3rem;
          width: 100%;
          background: #17abb8;
          margin-bottom: 0.64rem;
          img {
            width: 100%;
          }
        }
        .con_box_con {
          // padding: 0 0.4rem;
          padding-left: 0.4rem;
          p {
            font-size: 0.3rem;
            margin-bottom: 0.2rem;
            label {
              color: #828282;
              display: inline-block;
              width: 1.3rem;
              text-align: justify;
              text-align-last: justify;
              margin-right: 0.24rem;
            }
            span {
              color: #08535a;
            }
          }
        }
        .confim_btn {
          padding-bottom: 0.8rem;
          margin: 0.7rem 0.4rem 0;
        }
      }
    }
  }

  input::-webkit-input-placeholder {
    font-family: "PingFangRegular" !important;
    font-weight: 300;
  }
  input::-moz-input-placeholder {
    font-family: "PingFangRegular" !important;
  }
  input::-ms-input-placeholder {
    font-family: "PingFangRegular" !important;
  }
  // 使用全局样式样式去掉
  * {
    touch-action: pan-y;
  }
}
</style>
