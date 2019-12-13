<template>
    <div :class="{color:!queryItem.isParent}">
      <div class="top-title111">
        <p>请您完成基本信息填写</p>
        <p>为您形成专属报告</p>
      </div>
      <div class="createInfo">
        <h3>基本信息</h3>
        <form class="formBox">
          <section>
            <label>1、您孩子的姓名</label><span>*</span>
            <input type="text" v-model="chilName"/>
          </section>
          <section>
            <label>2、您孩子的性别</label><span>*</span>
            <mt-radio
              v-model="sex"
              :options="sexList">
            </mt-radio>
          </section>
          <section>
            <label>3、您孩子的年级</label><span>*</span>
            <div class="my-content-list" @click="ShouPup">
               {{message}}
              <b class="down"></b>
            </div>
          </section>
          <section>
            <label>4、您孩子是否是独生子女</label><span>*</span>
            <mt-radio
              v-model="one"
              :options="ifList">
            </mt-radio>
          </section>
          <section>
            <label>5、您是孩子的</label><span>*</span>
            <mt-radio
              v-model="nexus"
              :options="nexusList">
            </mt-radio>
          </section>
          <section v-if="flag">
            <section class="input_container">
              <label>6、您的手机号码</label><span>*</span>
              <input type="number" placeholder="手机号码" name="phone" id="" maxlength="11" v-model="phoneNumber">
            </section>
            <section class="input_container justyfy">
              <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="smsCode">
              <button @click.prevent="getVerifyCode" :class="{right_phone_number:isOverTime}">{{word}}</button>
            </section>
          </section>
          <mt-button type="default" size="large" @click.prevent="checkSMSCode()" class="submit">提交</mt-button>
          <mt-popup v-model="popupVisible" popup-transition="popup-fade" closeOnClickModal="true" position="bottom">
            <mt-picker :slots="slots" @change="onValuesChange" showToolbar>
              <div class="picker-toolbar-title">
                    <div class="usi-btn-cancel" @click="popupVisible = !popupVisible">取消</div>
                  <div class="">请选择年级</div>
                    <div class="usi-btn-sure" @click="popupVisible = !popupVisible">确定</div>
                   </div>
            </mt-picker>
          </mt-popup>
        </form>
      </div>
    </div>
</template>
<script>
    import {localData} from "../../../api/index";

    export default {
        components: {},
        props: {},
        created() {
        },
        mounted() {
          this.getGrade();
          var Info=this.localData.get('userInfo') || {};
          if(this.queryItem.inviteCode){
            this.flag=true;
          }else{
            if(Info){
              this.userInfo=Info;
              if(this.userInfo.mobile){
                this.flag=false;
              }
            }else{
              this.flag=true;
            }
          }

        },
        data() {
            return {
              userInfo:{},
              flag:true,//是否隐藏手机号验证码
              queryItem:this.$route.query,
              chilName:'',
              sex:'',
              one:'',//独生子女
              nexus:'',//关系
              showToolbar: true,
              sexList:[
                {value:'0',label:'女'},
                {value:'1',label:'男'}
              ],
              ifList:[
                {value:'1',label:'是'},
                {value:'0',label:'否'}
              ],
              nexusList:[
                {value:'1',label:'父亲'},
                {value:'0',label:'母亲'},
                {value:'2',label:'其他监护人'},
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
            }
        },
        methods: {
          //获取年级列表
          getGrade() {
            this.$axios({
              method: "post",
              url:  this.apiURL + "/jeecg/rest/support/grade/getGrades",
              data: {
                appKey: "string",
                token: "string"
              }
            }).then((res) => {
              this.grades = res.result || [];
              var gradeName=this.grades.map(val=>{
                return val.gradeName
              });
              gradeName.unshift("");
              this.slots[0].values=gradeName
            }).catch(err => {
              // console.log(err);
              this.Toast(err.message);
            })
          },
          //获取验证码
          getCode() {
            var _this = this;
            this.$axios({
              method: "post",
              url: "/sms/evaluationSMS",
              data: {
                appKey: "string",
                mobile: _this.phoneNumber,
                token: "string"
              }
            }).then((res) => {
              if(res.code == '000000') {

              }else {
                this.Toast(res.message);
              }
            }).catch(err => {
              // console.log(err);
              this.Toast('发送验证码出现错误');
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
            console.log('00000')
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
          //提交
          submit(){
            var $this = this;
            var obj={
              'realname':this.chilName,
              'sex':this.sex,
              'isSingle':this.one,
              'relationType':this.nexus,
              'parentMobile':this.phoneNumber,
              'userId': this.userId || null,
              'inviteCode':$this.queryItem.inviteCode || null
            }
            $this.grades.forEach(function (val) {
              if(val.gradeName==$this.message){
                obj.gradeCode=val.gradeCode
              }
            })
            if($this.queryItem.inviteCode){
              $this.sendAgent()
            }
            this.$axios({
              method: "post",
              url: "/user/addStudentWechat",
              data:obj
            }).then(function(res){
              if(res.code == '000000') {

                if(!$this.queryItem.inviteCode){
                  var data={
                    'mobile':obj.parentMobile,
                    'userId': $this.userId || null,
                  }
                $this.localData.set("userInfo",data);
                }
                /*家长提交参数*/
                console.log($this.queryItem.isParent,"111")
                if($this.queryItem.isParent){
                  obj.optionList = [];
                  var arrItem = JSON.parse(localStorage.getItem('paperData'))||null;
                  if(!arrItem){
                    $this.Toast({
                      message: '没有提交的问卷数据，请重新填写哦~',
                    });
                    return
                  }
                  for(var i=0;i<arrItem.length;i++){
                    obj.optionList.push({
                      "id": arrItem[i].id,
                      // "isMultiple": 0,
                      "optionCode": arrItem[i].optionCode,
                      "optionId": arrItem[i].id,
                      "optionName": arrItem[i].optionName,
                      "questionId": arrItem[i].id,
                      // "tempUserCode": "string"
                    })
                  }
                  $this.$axios({
                    method: "post",
                    url: "/parentTest/submit",
                    data: obj
                  }).then((res) => {
                    if(res.code == '000000') {
                      $this.localData.set("userid",$this.userInfo.userId);
                      $this.$router.push(
                        {path: '/parent/text/report',query:{code:$this.queryItem.code,isParent:true,inviteCode:$this.queryItem.inviteCode}}
                      );
                      window.localStorage.setItem("datalist",JSON.stringify(res.result));
                      window.localStorage.setItem("userPostData",JSON.stringify(obj));
                    }else {
                      $this.Toast(res.message);
                    }
                  }).catch(err => {
                    // console.log(err);
                    $this.Toast('err');
                  })
                }else{ /*学生提交参数*/
                  console.log('3333')
                  $this.submitquestion(obj)
                }
              }else {
                console.log("sss")
                $this.Toast(res.message);
              }
            }).catch(function(err) {
              $this.Toast(err.message);
            });
          },
          //提交所做题目内容
          submitquestion(itemObj) {
            var _this = this;
            if(_this.queryItem.inviteCode){

              _this.sendAgent()
            }
            // _this.submitCon.mobile = _this.tel;
            // _this.submitCon.smsCode = _this.smscode;
            var paperResult = _this.localData.get("paperResultData");
            paperResult.mobile = this.phoneNumber;
            paperResult.userId = this.userId || null;
            paperResult.isReport = true;
            _this.$axios({
              method: "post",
              url: "/evaluation/submit",
              data: paperResult,
            }).then((res) => {
              if(res.code == '000000') {
                // this.Toast(res.message);
                // console.log(res);
                var reportCode = res.reportId;
                var evaluationRecordCode = res.evaluationRecordCode
                // _this.Toast('提交成功！');
                _this.$router.push({
                  path: '/report',
                  query: {
                    reportCode:evaluationRecordCode,
                    gradecode: _this.$route.query.gradecode,
                    reportId:reportCode,
                    inviteCode:_this.$route.query.inviteCode
                  }
                })
               // _this.postStudent(itemObj,reportCode,evaluationRecordCode);
                // _this.$router.push({
                //   path: '/report',
                //   query: {
                //     reportCode: reportCode,
                //     gradecode: _this.$route.query.gradecode,
                //   }
                // })



              }else {
                _this.Toast('提交答案出现错误！');
                // console.log(res.message)
              }
            }).catch(err => {
              // console.log(err);
              _this.Toast('提交答案出现错误');
            })
          },
          /*学生信息提交*/
          postStudent:function(itemObj,reportCode,evaluationRecordCode){
            var $this = this;
            itemObj.assessmentReportId = reportCode;
            // var invitecode=_this.$route.query.inviteCode;
            $this.$axios({
              method: "post",
              url: "/parentTest/saveStudentEvaluation",
              data: itemObj,
            }).then((res) => {
              if(res.code == '000000') {
                $this.Toast('提交成功！');
                window.localStorage.setItem("userid",this.userId);
                $this.$router.push({
                  path: '/report',
                  query: {
                    reportCode:evaluationRecordCode,
                    gradecode: $this.$route.query.gradecode,
                    reportId:res.result.reportId,
                    inviteCode:$this.$route.query.inviteCode
                  }
                })
              }else {
                $this.Toast('提交信息出现错误！');
                // console.log(res.message)
              }
            }).catch(err => {
              // console.log(err);
              $this.Toast('提交信息出现错误');
            })
          },
          //校验数据验证码
          checkSMSCode(){
            var _this=this;
            if(this.chilName=="" || this.sex=="" || this.nexus=="" || this.message==""){
              this.Toast('请将信息填写完整！');
              return false;
            }
            if(_this.flag){
              var flag=_this.testPhone();
              if(flag){
                if(this.smscode==""){
                  this.Toast('请输入验证码！');
                  return false;
                }
                _this.$axios({
                  method: "post",
                  url: "/sms/checkSMSCode",
                  data: {
                    mobile: _this.phoneNumber,
                    smsCode: _this.smsCode,
                  }
                })
                  .then((res) => {
                    if(res.code == '000000') {
                      _this.localData.set("userid",res.userId);
                      _this.userId = res.userId;
                      _this.submit();
                    }else {
                      this.Toast('验证码错误！');
                    }
                  }).catch(err => {
                  // console.log(err);
                  this.Toast('发送验证码出现错误');
                })
              }
            }else {
              _this.localData.set("userid",_this.userInfo.userId);
              _this.userId=_this.userInfo.userId;
              _this.phoneNumber=_this.userInfo.mobile;
              _this.submit();
            }

          },
          //发送代理商
          sendAgent() {
            var _this= this;
            var invitecode=_this.$route.query.inviteCode;
            _this.$axios({
              method: "post",
              url: _this.agentUrl+"user/savenUser",
              data: {
                param: {
                  inviteCode: invitecode,
                  mobile: _this.phoneNumber,
                  nickName: ''
                }
              },
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
  .top-title111{
    padding:0.75rem 0;
    background-color:#a91515;
    color:#FFF;
    text-align:center;
    p{
      font-size:0.9rem;
      line-height:1.3rem;
    }
  }
.createInfo{
  padding:1.2rem 1rem;
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
    span{
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
    margin-bottom: 1.5rem;
    input,button{
      width:7.6rem;
      margin:0;
    }
    button{
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
  .my-content-list{
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

}
.color{
  .mint-radio-input:checked + .mint-radio-core{
    background-color: #3ebbe5 !important;
    border-color: #3ebbe5 !important;
  }
  .submit,.justyfy button{
    background-color: #3ebce5!important;
  }
  .right_phone_number{
    background-color: #c1c1c1!important;
  }
  .top-title111{
    background-color:#3ebbe5 !important;
  }
}
</style>
