<template>
  <div class="formInfo">
    <form class="formBox">
      <section>
        <label>1、您孩子的姓名</label><span class="xing">*</span>
        <input type="text" v-model="chilName"/>
      </section>
      <section>
        <label>2、您孩子的性别</label><span class="xing">*</span>
        <mt-radio
          v-model="sex"
          :options="sexList">
        </mt-radio>
      </section>
      <section>
        <label>3、您孩子的年级</label><span class="xing">*</span>
        <div class="my-content-list" @click="ShouPup">
           {{message}}
          <b class="down"></b>
        </div>
      </section>
      <section>
        <label>4、选择预约时间</label><span class="xing">*</span>
        <div class="datetime">
          <span class="date" @click="showDatePicker">{{date.real | getTime("year")}} <i class="down"></i></span>
          <span class="date" @click="showDatePicker">{{date.real | getTime("month")}} <i class="down"></i></span>
          <span class="date" @click="showDatePicker">{{date.real | getTime("date")}} <i class="down"></i></span>
        </div>
      </section>
      <section class="input_container">
        <label>5、您的手机号码</label><span class="xing">*</span>
        <input type="number" name="phone" id="" maxlength="11" v-model="phoneNumber">
      </section>
      <section class="input_container justyfy">
        <input type="text" name="mobileCode" maxlength="6" v-model="smsCode">
        <button @click.prevent="getVerifyCode" :class="{right_phone_number:isOverTime}">{{word}}</button>
      </section>
      <section class="input_container">
        <label>6、输入兑换劵码</label>
        <input type="text" name="phone"  maxlength="11" v-model="coupon">
      </section>

      <mt-popup v-model="popupVisible" popup-transition="popup-fade" closeOnClickModal="true" position="bottom">
        <mt-picker :slots="slots" @change="onValuesChange" showToolbar>
          <div class="picker-toolbar-title">
                <div class="usi-btn-cancel" @click="popupVisible = !popupVisible">取消</div>
              <div class="">请选择年级</div>
                <div class="usi-btn-sure" @click="popupVisible = !popupVisible">确定</div>
               </div>
        </mt-picker>
      </mt-popup>
      <mt-datetime-picker
        v-model="date.value"
        ref="datepicker"
        type="date"
        :startDate="date.min"
        :endDate="date.max"
        @confirm="dateConfirm"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日">
      </mt-datetime-picker>
    </form>
  </div>
</template>
<script>
  export default {
    components: {},
    props: ['stageCode'],
    created() {
    },
    mounted() {
      this.getGrade();
    },
    data() {
      return {
        chilName:'',
        sex:'',
        showToolbar: true,
        coupon:'',//兑换码
        sexList:[
          {value:'0',label:'男'},
          {value:'1',label:'女'}
        ],
        message: "请选择年级",
        popupVisible: false,
        grades:[],//学年列表
        slots:[
          {
            flex: 1,
            values:[],
          }
        ],
        phoneNumber:'',
        smsCode:'',//验证码
        isOverTime:false,
        word:'获取验证码',
        userId:'',//
        date: {
          min: new Date(),
          max: new Date("2019/12/31"),
          value: new Date(),
          real: new Date()  //真实值
        }
      }
    },
    methods: {
      //确认选择日期
      dateConfirm(val) {
        this.date.real = this.date.value;
      },
      //显示日期选择框
      showDatePicker() {
        this.$refs.datepicker.open();
      },
      //获取年级列表
      getGrade() {
        var that=this;
        this.$axios({
          method: "post",
          url: this.apiURL + "/jeecg/rest/support/grade/getGrades",
          data: {
            stageCode:this.stageCode,
          }
        }).then(function(res) {
          that.grades = res.result || [];
          var gradeName=that.grades.map(function(val){
            return val.gradeName
          });
          gradeName.unshift("");
          that.slots[0].values=gradeName
        }).catch(function(err){
          // console.log(err);
          that.Toast(err.message);
        })
      },
      //获取验证码
      getCode() {
        var _this = this;
        _this.$axios({
          method: "post",
          url: "/sms/evaluationSMS",
          data: {
            appKey: "string",
            mobile: _this.phoneNumber,
            token: "string"
          }
        }).then(function(res)  {
          if(res.code == '000000') {
          }else {
            _this.Toast(res.message);
          }
        }).catch(function(err) {
          this.isOverTime=false;
          // console.log(err);
          _this.Toast(err);
        })
      },
      ShouPup() {
        this.popupVisible = true
      },
      onValuesChange(picker, values) {
        this.message = values[0];
        if(values[0] > values[1]) {
          picker.setSlotValue(1, values[0]);
        }
      },
      //检验手机号码
      testPhone(){
        var isF=true;
        if(this.phoneNumber==""){
          this.Toast({
            message: '请输入手机号',
          });
          isF=false;
          return;
        }
        var flag= /^1\d{10}$/gi.test(this.phoneNumber);
        if(!flag){
          this.Toast({
            message: '手机号码格式错误',
          });
          isF=false
        }
        return isF
      },
      getVerifyCode(){
        if(this.isOverTime){
          return false;
        }
        let that = this,time = 61;
        var flag=this.testPhone();
        if(flag){
          that.isOverTime = true;
          this.getCode();
          var sendTimer = setInterval(function(){
            time--;
            that.word = time+"S后重试";
            if(time < 0){
              that.isOvertime = false;
              clearInterval(sendTimer);
              that.word = "重新发送";
              that.isOverTime = false;
            }
          },1000)
        }
      },
      //校验数据验证码
      getData(){
        var _this=this;
        if(this.chilName=="" || this.sex=="" || this.message==""){
          this.Toast('请将信息填写完整！');
          return false;
        }
        var flag=_this.testPhone();
        if(flag){
          if(this.smsCode==""){
            this.Toast('请输入验证码！');
            return false;
          }
          var obj={
            'childRealName':this.chilName,
            'childSex':this.sex==0 ? "男" :"女",
            'childGrade':this.message,
            'tel':this.phoneNumber,
            'appointDateTime':this.date.real,
            'smsCode':this.smsCode
          }
          if(this.discountCode!=""){
            obj.coupon =this.coupon
          }
          return obj;
        }else{
          return false;
        }

      }
    },
    computed: {},
    filters: {
      getTime(date, type) {
        var n = 0;
        if (type === "year") {
          return date.getFullYear()
        } else if (type === "month") {
          n = date.getMonth() + 1;
          return n > 9 ? n : "0" + n;
        } else if (type === "date") {
          n = date.getDate();
          return n > 9 ? n : "0" + n;
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
  .formInfo{
    padding:.2rem 1rem 0;
    background-color: #fff;
    min-height:100%;
    color: #1a1a1a;
    h3{
      color: #1a1a1a;
      font-size: 1.2rem;
      line-height: 1.5rem;
      font-weight: normal;
    }
    .formBox{
      font-size: 0.9rem;
      label{
        height:2rem;
        line-height: 2rem;
      }
      .xing{
        content: "*";
        color: #ef5666;
        margin-left:0.1rem;
      }
      input,.my-content-list{
        padding:0 0.6rem;
        box-shadow: none;
      }
      input,.mint-cell,.my-content-list{
        width:100%;
        height:2rem; line-height: 2rem;
        border: 1px solid #ccc;
        box-sizing: border-box;
        border-radius: 0.2rem;
        margin-bottom: 0.6rem;
        font-size: 0.9rem;
        color: #666;
      }
      .mint-radiolist-title{
        display: none;
      }
      .mint-radio-input:checked + .mint-radio-core{
        background-color: #a91515;
        border-color: #a91515;
      }
      .mint-cell{
        .mint-cell-wrapper{
          background:none;
        }
      }
      .mint-radio-label{
        margin-left:0.5rem;
        color: #666;
        font-size:0.9rem ;
      }
    }
    .mint-popup,.picker{
      width:100%!important;
    }
    .picker-toolbar-title {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      height: 40px;
      line-height: 40px;
      font-size: 16px;  }
      .usi-btn-cancel, .usi-btn-sure {  color: #FF6600  }
    .justyfy{
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      flex-wrap: wrap;
      input,button{
        width:7.6rem;
        margin:0;
      }
      button{
        height:2rem;
        border-radius: 0.2rem;
        border:none;
        background-color: #a91515;
        color: #fff;
        font-size: 0.9rem;
      }
      .right_phone_number{
        background-color: #c1c1c1;
      }
    }
    .submit{
      height: 2.2rem;
      background-color: #a91515;
      color: #fff;
    }
    .my-content-list,.date{
      position: relative;
      .down {
        position: absolute;
        right:0.6rem;
        top:50%;
        margin-top:-4px;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid #666666;

      }
    }
    .datetime {
      margin: 0 auto;
      width:100%;
      display: flex;
      justify-content: space-between;
      color: #fff;
      .date {
        padding: 0 .6rem;
        height:2rem;
        line-height: 2rem;
        border: 1px solid #ccc;
        border-radius: .3rem;
        width: 3rem;
        color: #666;
        font-weight: normal;
      }

    }
  }
</style>
