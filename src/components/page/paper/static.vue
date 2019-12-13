<!-- 静态测评页面 -->
<template>
  <div class="paperstatic">
    <!-- 测评说明 -->
    <div class="readme" v-if="viewType=='readme'">
      <beginAnswer :header-name="headerName" @back="back" @begin="begin"></beginAnswer>
    </div>

    <!-- 预览整份试卷 -->
    <div class="preview" v-if="viewType=='viewall'">
      <mt-header fixed :title="headerName">
        <div slot="left">
          <span class="closer" @click="clickX">x</span>
        </div>
      </mt-header>
      <!--试题内容-->
      <div class="headmore">
        <!--<span class="pull-left">考试时间：{{ paperDetails.standardTime }}分钟&#45;&#45;{{ timeHtml }}</span>-->
        <span class="pull-left">考试时间：{{ timeHtml }}</span>
        <span class="pull-right">总分：{{ paperDetails.totalScore }}分</span>
      </div>
      <div class="content">
        <div v-for="(item, index) in paperDetails.bigQuestions" :key="item.bigId">
          <div class="big-name">{{item.bigSort2 | toPageNum}}、{{item.bigTitle}}（共{{item.smallQuestions.length}}题；共{{item.bigScore}}分）</div>
          <div v-for="(item2, index2) in item.smallQuestions" :key="index2">
            <question v-if="item.bigType!=6" :questionDetails="item2" :finish="finishquestion"></question>
            <compoundQuestion v-if="item.bigType==6" :compoundDetails="item2" :finish="finishquestion"></compoundQuestion>
          </div>
        </div>
      </div>
      <div class="start" @click="begin">开始作答</div>
    </div>

    <!--开始作答-->
    <div class="answerpaper" v-if="viewType=='question'">
      <div class="answerpaper-head">
        <div>
          <span class="closer" @click="clickX">x</span>
        </div>
        <div>
          <span class="clock">
            <i class="fa fa-clock-o" aria-hidden="true"></i>{{ timeHtml }}</span>
          <span @click="openAnswercard"><i class="fa fa-list-alt" aria-hidden="true"></i>答题卡[{{answercardShow?"返回":"提交"}}]</span>
        </div>
      </div>
      <div class="headmore">
        <span class="pull-left">{{headerName}}</span>
        <span class="pull-right">{{nowquesIndex}}/{{questionLength}}</span>
      </div>
      <div class="paper">
        <div class="swiper-container small answerpaperList" style="touch-action: none;">
          <div class="swiper-wrapper">
            <template v-for="(item, index) in paperDetails.bigQuestions">
              <!--<v-touch @swipeleft="toanswercard" class="swiper-slide" v-for="(item2, index2) in item.smallQuestions" :key="index2">-->
                <!--<div style="height: calc(100vh - 4.325rem);overflow: auto;">-->
                  <!--<div class="big-name">{{item.bigSort2 | toPageNum}}、{{item.bigTitle}}（共{{item.smallQuestions.length}}题；共{{item.bigScore}}分）</div>-->
                  <!--<div :key="index2">-->
                    <!--<question v-if="item.bigType!=6" @onceChoice="onceChoice" :questionDetails="item2" :finish="finishquestion"></question>-->
                    <!--<compoundQuestion @getnowIndex="getnowIndex" @beginGestalt="beginGestalt" v-if="item.bigType==6" @twoChoice="twoChoice" :compoundDetails="item2" :finish="finishquestion"></compoundQuestion>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</v-touch>-->
              <div class="swiper-slide" v-for="(item2, index2) in item.smallQuestions" :key="index2">
                <div style="height: calc(100vh - 4.325rem);overflow: auto;">
                  <div class="big-name">{{item.bigSort2 | toPageNum}}、{{item.bigTitle}}（共{{item.smallQuestions.length}}题；共{{item.bigScore}}分）</div>
                  <div :key="index2">
                    <question v-if="item.bigType!=6" @onceChoice="onceChoice" :questionDetails="item2" :finish="finishquestion"></question>
                    <compoundQuestion @getnowIndex="getnowIndex" @beginGestalt="beginGestalt" v-if="item.bigType==6" @twoChoice="twoChoice" :compoundDetails="item2" :finish="finishquestion"></compoundQuestion>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!--答题卡-->
    <div class="answercard" v-show="answercardShow">
      <mt-header title="答题卡">
        <div slot="left">
          <span class="closer" @click="openAnswercard">x</span>
        </div>
      </mt-header>
      <div class="answercard-con">
        <div v-for="(item, index) in paperDetails.bigQuestions" :key="item.bigId" class="answercard-con-item">
          <p>{{item.bigSort2 | toPageNum}}、{{item.bigTitle}}（共{{item.smallQuestions.length}}题；共{{item.bigScore}}分）</p>
          <ul>
            <li :class="{active:item2.hasAnswer == true }" v-for="(item2, index2) in item.smallQuestions" :key="index2" @click="routerToquestion(item2.quesIndex)">{{item2.quesIndex}}</li>
          </ul>
        </div>
      </div>
      <div class="bottom-btn" @click="submitAnswerCon">
        <mt-button class="btn" type="primary">交卷并查看报告</mt-button>
      </div>
    </div>

    <!--测评提交弹框-->
    <div class="mobile" v-show="mobileShow">
      <div class="mobile-wrap" @click.stop="">
        <div class="titleTop">共{{questionLength}}题，已作答{{answerlength}}题</div>
        <div class="titlebottom">为更好的提供后续服务，请在下方输入您的手机号码：</div>
        <div class="input-wrap">
          <div class="tel-wrap">
            <input type="number" class="tel" @blur="eblur" placeholder="输入手机号" v-model="tel" maxlength="11"/>
          </div>
          <div class="reset-wrap">
            <div>
              <input type="text" class="resnum" @blur="eblur" placeholder="输入验证码" v-model="smscode" @click.stop=""/>
            </div>
            <button :class="{smsActive: smscodeAvtive == true }" :disabled="smscodeAvtive" @click="sendCode">{{smsText}}</button>
          </div>
        </div>
        <div class="button-wrap">
          <button class="err" @click="mobilehide">取消</button>
          <button class="ok" @click="submitMobile">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import question from "../../common/question/index"
  import compoundQuestion from "../../common/question/compoundQuestion"
  import beginAnswer from "../../common/beginAnswer"
//  import answerSheet from "../../common/answerSheet"
  import swiper from 'swiper';

  import audio from '../../../util/audioPlay'

  var mySwiper;
  var audiowe;
  var time2;
  export default {
    name: "static",
    data() {
      return {
        headerName: "试卷名称",
        viewType: "readme",
        timeHtml: '',//倒计时
        paperDetails: {},//试卷详情
        finishquestion: 0,//是否完成作答  0预览  1做答中 2作答完成
        topicname: 0,//做题时间
        questionLength: 0,//题目条数
        answerlength: 0,//答题数目
        nowquesIndex: 0,//当前题目下标
        answercardShow: false,//答题卡是否显示
        submitCon: {
          appKey: '',
          gradeCode: "",//学年
          paperId: "",//试卷code ,
          paperName: "",//试卷name
          paperScore: 21,//试卷分数
          subjectCode: "3",//学科code
          userId: null,//用户id
          userName: null,//用户name
          mobile:'',//用户手机号
          questionList: [],//试题作答数组
          useTime: 0,//答题总时间
        },//提交内容
        nowTime: null,
        nextTime: null,
        mobileShow: false,//获取手机验证码是否显示
        tel: '',//手机号
        smscode: '',//验证码
        smscodeAvtive: false,
        smsText: '获取验证码',
        flag:false,//是否完善个人信息
        userInfo:{},//信息
      }
    },
    created() {
      var $this=this;
      $this.userInfo=$this.localData.get("userInfo") || {};
      if($this.userInfo.userId){
        $this.getAuthenInfo($this.userInfo.userId);
      }
      if(this.viewType=='question') {
        this.finishquestion = 1;//是否完成作答  0预览  1做答中 2作答完成
        this.nowquesIndex = 1;//当前题目下标
      }else {
        this.finishquestion = 0;//是否完成作答  0预览  1做答中 2作答完成
      }
    },
    mounted() {

      var _this = this;
      //获取试卷详情
      this.getPaperDetails();

      setTimeout(()=>{
        mySwiper = new swiper ('.answerpaperList', {
          loop: false,
          observer:true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents:true,//修改swiper的父元素时，自动初始化swiper
          onSlideChangeEnd: function(swiper){
              _this.nowquesIndex = swiper.activeIndex + 1;//当前题目下标
          },
        })
      })
    },
    methods: {
      /* 解决提交时弹框内文本框和按钮位置和事件不对应问题（fixed原因） */
      eblur(){
        $("body").scrollTop(0);
      },
      //获取试卷详情
      getPaperDetails() {
        this.$axios({
          method: "post",
          url: "/paper/getPaper",
          data: {
            "appKey": "string",
            "paperId":this.$route.query.paperid ,
            "token": "string"
          }
        }).then((res) => {
          if(res.code == '000000') {
            //试卷信息
            //增加一个下标
            var index = 0;
            for(var i = 0;i<res.bigQuestions.length;i++) {
              res.bigQuestions[i].bigSort2 = (i+1);
              for(var j=0;j<res.bigQuestions[i].smallQuestions.length;j++) {
                index += 1;
                res.bigQuestions[i].smallQuestions[j].quesIndex = index;
                res.bigQuestions[i].smallQuestions[j].hasAnswer = null;
              }
            }
            this.paperDetails = res;

            // console.log("试卷总信息");
            // console.log(res);
            //处理提交内容
            this.setsubmitCon(res);
            //试卷名称
            this.headerName = res.paperName;
            //做题时间倒计时
            this.topicname = this.paperDetails.standardTime * 60;
            //做题时间
            this.timeHtml = this.paperDetails.standardTime + '分钟';

            //试卷总条数
            var questionLength = 0;
            for(var i=0;i<res.bigQuestions.length;i++) {
              questionLength += res.bigQuestions[i].smallQuestions.length;
            }
            this.questionLength = questionLength;

          }else {
            this.Toast('获取试卷出现错误');
          }
        }).catch(err => {
          // console.log(err);
          this.Toast('获取试卷出现错误');
        })
      },
      //处理提交内容
      setsubmitCon(res) {
        var _this = this;
        var data = res;
        //学年
        _this.submitCon.gradeCode = _this.$route.query.gradecode;
        //试卷code
        _this.submitCon.paperId = data.paperId;
        //试卷name
        _this.submitCon.paperName = data.paperName;
        //试卷分数
        _this.submitCon.paperScore = data.totalScore;
        //学科code
        _this.submitCon.subjectCode = data.subjectCode;

        for(var i=0;i<data.bigQuestions.length;i++) {
          for(var j=0;j<data.bigQuestions[i].smallQuestions.length;j++) {
            var nowSmallQuestion = data.bigQuestions[i].smallQuestions[j];
            //复合题
            if(nowSmallQuestion.smallType == '6') {
              for(var y=0;y<nowSmallQuestion.componentQuestionModels.length;y++) {
                var obj = {
                  answerQuestionsTime:0,//答题时间
                  complexQuestionCode: '',//所属复合题code ,
                  isComplexQuestion:0,//是否是复合题
                  questionCode:"",//试题code
                  questionScore:0,//试题分值
                  questionSn:0,//试题题号
                  questionType:"",//试题类型
                  readingQuestionsTime:0,//阅读题干时间
                  rightAnswer: null,//正确答案
                  userAnswer:'',//用户答案
                };
                obj.isComplexQuestion = '1';
                var nowComponentQuestion = nowSmallQuestion.componentQuestionModels[y];
                obj.complexQuestionCode = nowComponentQuestion.smallId;
                obj.questionType = nowComponentQuestion.componentType;
                obj.questionCode = nowComponentQuestion.componentId;
                obj.questionScore = nowComponentQuestion.componentScore;
                obj.questionSn = nowComponentQuestion.componentSort;
                obj.rightAnswer = nowComponentQuestion.answer;

                if(nowComponentQuestion.componentType == '4') {
                  var componentAnswer = JSON.parse(nowComponentQuestion.answer);
                  for(var g=0;g<componentAnswer.length;g++){
                    componentAnswer[g].answerValue = ''
                  }
                  obj.userAnswer = JSON.stringify(componentAnswer);
                }else {
                  obj.userAnswer = '';
                }
                _this.submitCon.questionList.push(obj);
              }
            }else {//非复合题
              var obj = {
                answerQuestionsTime:0,//答题时间
                isComplexQuestion:0,//是否是复合题
                questionCode:"",//试题code
                questionScore:0,//试题分值
                questionSn:0,//试题题号
                questionType:"",//试题类型
                readingQuestionsTime:0,//阅读题干时间
                rightAnswer: null,//正确答案
                userAnswer:'',//用户答案
              };
              obj.isComplexQuestion = '0';
              obj.questionType = nowSmallQuestion.smallType;
              obj.questionCode = nowSmallQuestion.smallId;
              obj.questionScore = nowSmallQuestion.smallScore;
              obj.questionSn = nowSmallQuestion.smallSort;
              obj.rightAnswer = nowSmallQuestion.answer;

              if(nowSmallQuestion.smallType == '4') {
                if(nowSmallQuestion.answer!=null) {
                  var smallAnswer = JSON.parse(nowSmallQuestion.answer);
                  for(var f=0;f<smallAnswer.length;f++) {
                    smallAnswer[f].answerValue = ''
                  }
                  obj.userAnswer = JSON.stringify(smallAnswer);
                }
              }else {
                obj.userAnswer = '';
              }
              _this.submitCon.questionList.push(obj);
            }
          }
        }

        // console.log("要提交的数据");
        // console.log(_this.submitCon);
      },

      //测评说明组件头部点击返回按钮
      back() {
        // console.log("点击了返回");
        this.viewType = "readme";
        window.history.go(-1);
      },
      //预览试卷点击X
      clickX() {
        var _this = this;
        // 开始作答页面
        if(this.viewType === "question"){
          this.MessageBox.confirm('', {
            title: '提示',
            message: '确定放弃所做题目返回列表?',
            showConfirmButton:true,
            showCancelButton:true,
            confirmButtonText:'确定',
            cancelButtonText:'暂不'
          }).then(action => {
            if (action == 'confirm') {
              window.history.go(-1);
              _this.viewType = "readme";
            }
          }).catch(err => {
            if (err == 'cancel') {
              // console.log('暂不')
            }
          });
        }else if(this.viewType === "viewall"){//预览页面
          this.viewType = "readme";//测评说明页面
          this.finishquestion = 0;//是否完成作答  0预览  1做答中 2作答完成
        }
      },
      //开始作答
      begin() {
        var _this = this;
        clearInterval(time2)
        //倒计时开始
        this.countDown(this.topicname);
        if(this.viewType==="readme"){//测评说明

          if(JSON.stringify(this.paperDetails) == '{}'){
            this.Toast('试卷内容错误!请返回');
          }else {
            this.viewType = "viewall";//预览页面
            this.finishquestion = 0;//是否完成作答  0预览  1做答中 2作答完成
          }

        }else{
          this.finishquestion = 1;
          this.viewType = "question";//答题页面
          this.nowquesIndex = 1;//当前题目下标
          // //倒计时开始
          // this.countDown(this.topicname);

          //开始做题 时间开始
          this.nowTime = new Date().getTime();

          setTimeout(()=>{
            mySwiper = new swiper ('.answerpaperList', {
              loop: false,
              observer:true,//修改swiper自己或子元素时，自动初始化swiper
              observeParents:true,//修改swiper的父元素时，自动初始化swiper
              onInit: function() {
                if(_this.submitCon.questionList[0].isComplexQuestion && _this.submitCon.questionList[0].isComplexQuestion == '1'&& 0+1 >= _this.nowquesIndex ) {
                  _this.getAudio(_this.submitCon.questionList[0].complexQuestionCode || null);
                }
              },
              onSlideChangeEnd: function(swiper){
                  // console.log("当前"+_this.nowquesIndex )
                  // console.log("acyive--"+ swiper.activeIndex)

                var index =  _this.nowquesIndex - 1;
                _this.nextTime = new Date().getTime();
                if(_this.submitCon.questionList[index].isComplexQuestion == 0) {
                  _this.submitCon.questionList[index].answerQuestionsTime += parseInt((_this.nextTime - _this.nowTime)/1000);
                }
                if(audiowe) {
                  audiowe.pause();
                }
                if(_this.submitCon.questionList[index].isComplexQuestion && _this.submitCon.questionList[index].isComplexQuestion == '1'&& swiper.activeIndex+1 >= _this.nowquesIndex ) {
                  _this.getAudio(_this.submitCon.questionList[index].complexQuestionCode || null);
                }

                _this.nowTime = new Date().getTime();

                _this.nowquesIndex = swiper.activeIndex + 1;
              },
            })
          },0)
        }
      },
      //音频播放
      getAudio(val) {
        // console.log(val)
        var arr=[];
        var _this = this;
        for(var i=0;i<_this.paperDetails.bigQuestions.length;i++) {
          if(_this.paperDetails.bigQuestions[i].bigType == '6') {
            var smallquestion = _this.paperDetails.bigQuestions[i].smallQuestions;
            for(var j=0;j<smallquestion.length;j++) {
              if(smallquestion[j].smallId == val) {
                arr = arr.concat(smallquestion[j].streamMedias);
              }
            }
          }
        }
        // console.log(arr);
        if(arr.length > 0) {
          audiowe= new audio(arr);
          audiowe.play();
        }
      },
      //倒计时
      countDown(time) {
        var _this = this;
        // var time=_this.paperDetails.standardTime * 60;//分钟换算成1800秒
        time2 = setInterval(function(){
          _this.topicname -= 1;
          var minute=parseInt(_this.topicname/60);
          var second=parseInt(_this.topicname%60);
          // if(_this.viewType=='viewall') {
          //   _this.timeHtml= minute+'分'+second+'秒';
          // }else {
          //   _this.timeHtml= minute+'`'+second+'`';
          // }
          _this.timeHtml= minute+'分'+second+'秒';
          // console.log(this.timeHtml)
          if(_this.topicname <= 0) {
            _this.Toast('时间已到，请交卷！');
            _this.answercardShow = true;
          }
          if(_this.viewType == "readme"){
            clearInterval(time2)
          }
        },1000);
      },

      //复合题中点击开始作答获取阅读题干时间
      beginGestalt(componentQuestion) {
        // console.log("复合题中点击开始作答");-
        // console.log(componentQuestion);
        //复合题中阅读题干时间
        this.nextTime = new Date().getTime();
        for(var e=0;e<this.submitCon.questionList.length;e++) {
          for(var j=0;j<componentQuestion.length;j++) {
            if(componentQuestion[j].componentId == this.submitCon.questionList[e].questionCode) {
              this.submitCon.questionList[e].readingQuestionsTime = parseInt((this.nextTime - this.nowTime)/1000);
            }
          }
        }
        this.nowTime = new Date().getTime();
      },
      //复合题中点击下方小题获取答题时间
      getnowIndex(item) {
        // console.log('复合题中点击下方小题');
        // console.log(item);
        this.nextTime = new Date().getTime();
        for(var i=0;i<this.submitCon.questionList.length;i++) {
          if(item.componentId == this.submitCon.questionList[i].questionCode ) {
            this.submitCon.questionList[i].answerQuestionsTime += parseInt((this.nextTime - this.nowTime)/1000);
          }
        }
        this.nowTime = new Date().getTime();
      },
      //左滑到最后一题去答题卡页面
      toanswercard() {
        var _this = this;
        if(_this.nowquesIndex == _this.questionLength) {
          _this.openAnswercard();
          if(audiowe) {
            audiowe.pause();
          }
        }
      },


      //打开答题卡
      openAnswercard() {
        var _this = this;
        _this.AnswercardActive()
        if(this.answercardShow === true) {//答题卡页面
          this.viewType = "question";//// 开始作答页面
          this.finishquestion = 1;//是否完成作答  0预览  1做答中 2作答完成
          //倒计时开始
          // this.countDown();
        }
        if(_this.topicname <= 0) {
          _this.Toast('时间已到，请交卷！');
          _this.answercardShow = true;
        }else {
          this.answercardShow = !this.answercardShow;
        }
      },
      //答题卡做题情况
      AnswercardActive() {
        var _this = this;
        for(var i=0;i<_this.paperDetails.bigQuestions.length;i++) {
          for(var j=0;j<_this.paperDetails.bigQuestions[i].smallQuestions.length;j++) {
            var nowSmallQuestion = _this.paperDetails.bigQuestions[i].smallQuestions[j];
            if(nowSmallQuestion.smallType != '6') {
              if(nowSmallQuestion.smallType == '4') {
                for(var x=0;x<_this.submitCon.questionList.length;x++) {
                  if(nowSmallQuestion.smallId == _this.submitCon.questionList[x].questionCode) {
                    if(_this.submitCon.questionList[x].userAnswer == '') {
                      _this.paperDetails.bigQuestions[i].smallQuestions[j].hasAnswer = false;
                    }else {
                      var fourAnswer = true;
                      for(var b=0;b<JSON.parse(_this.submitCon.questionList[x].userAnswer).length;b++) {
                        if(JSON.parse(_this.submitCon.questionList[x].userAnswer)[b].answerValue == '') {
                          fourAnswer = false;
                        }
                      }
                      _this.paperDetails.bigQuestions[i].smallQuestions[j].hasAnswer = fourAnswer;
                    }
                  }
                }
              }else {
                for(var x=0;x<_this.submitCon.questionList.length;x++) {
                  if(nowSmallQuestion.smallId == _this.submitCon.questionList[x].questionCode) {
                    if(_this.submitCon.questionList[x].userAnswer != '') {
                      _this.paperDetails.bigQuestions[i].smallQuestions[j].hasAnswer = true;
                    }else {
                      _this.paperDetails.bigQuestions[i].smallQuestions[j].hasAnswer = false;
                    }
                  }
                }
              }
            }else {
              for(var c=0;c<nowSmallQuestion.componentQuestionModels.length;c++) {
                if(nowSmallQuestion.componentQuestionModels[c].componentType == '4') {
                  var hasAnswer = true;
                  for(var y=0;y<_this.submitCon.questionList.length;y++) {
                    if(nowSmallQuestion.componentQuestionModels[c].componentId == _this.submitCon.questionList[y].questionCode) {

                      if(_this.submitCon.questionList[y].userAnswer == '') {
                        _this.paperDetails.bigQuestions[i].smallQuestions[j].hasAnswer = false;
                      }else {
                        var fourAnswer = true;
                        for(var b=0;b<JSON.parse(_this.submitCon.questionList[y].userAnswer).length;b++) {
                          if(JSON.parse(_this.submitCon.questionList[y].userAnswer)[b].answerValue == '') {
                            fourAnswer = false;
                          }
                        }
                        _this.paperDetails.bigQuestions[i].smallQuestions[j].hasAnswer = fourAnswer;
                      }
                    }
                  }
                }else {
                  var hasAnswer = true;
                  for(var y=0;y<_this.submitCon.questionList.length;y++) {
                    if(nowSmallQuestion.componentQuestionModels[c].componentId == _this.submitCon.questionList[y].questionCode) {

                      if(_this.submitCon.questionList[y].userAnswer == '') {
                        hasAnswer = false;
                      }
                      _this.paperDetails.bigQuestions[i].smallQuestions[j].hasAnswer = hasAnswer;
                    }
                  }
                }
              }
            }
          }
        }
        // console.log(_this.paperDetails.bigQuestions)
      },
      //提交
      submitAnswerCon() {
        var _this = this;
        //做题数目
        var answerLength = 0;
        for(var i=0;i<_this.paperDetails.bigQuestions.length;i++) {
          for(var j=0;j<_this.paperDetails.bigQuestions[i].smallQuestions.length;j++) {
            var nowSmallQuestion = _this.paperDetails.bigQuestions[i].smallQuestions[j];
            if(nowSmallQuestion.hasAnswer == true) {
              answerLength += 1;
            }
          }
        }
        // console.log(answerLength);
        //答题数目
        _this.answerlength = answerLength;

        var messageCon = "";
        if(answerLength == _this.questionLength) {
          messageCon = '题目已全部完成，确认交卷吗？';
        }else {
          messageCon = '您有未做答的题目，提交后不可继续做题。确认交卷吗？';
        }
        this.MessageBox.confirm('', {
          title: '确认交卷？',
          message: messageCon,
          showConfirmButton:true,
          showCancelButton:true,
          confirmButtonText:'交卷',
          cancelButtonText:'取消'
        }).then(action => {
          if (action == 'confirm') {
            // console.log('胶圈')
            //获取手机验证码
            // _this.getmobile();
            _this.submitquestion();
          }
        }).catch(err => {
          if (err == 'cancel') {
            // console.log('暂不')
          }
        });
      },
      //提交验证手机验证码 显示手机验证码页面
      getmobile() {
        var _this = this;
        _this.tel = '';
        _this.smscode = '';
        _this.mobileShow = true;
      },
      //隐藏手机验证码页面
      mobilehide() {
        var _this = this;
        _this.mobileShow = false;
      },
      //提交
      submitMobile() {
        var _this = this;
        //验证验证码对错
        _this.$axios({
          method: "post",
          url: "/sms/checkSMSCode",
          data: {
            mobile: _this.tel,
            smsCode: _this.smscode,
          }
        }).then((res) => {
          if(res.code == '000000') {
            // this.Toast(res.message);
            // console.log(res);
            var obj={
              userId:res.userId,
              mobile:res.mobile
            }
            window.localStorage.setItem("userid",res.userId);
            window.localStorage.setItem("userInfo",JSON.stringify(obj));
            _this.submitCon.userId = res.userId;

            var invitecode=_this.$route.query.inviteCode;
            console.log('-------------------------------------')
            console.log(invitecode)
            if(invitecode != null) {
              //发送代理商
              _this.sendAgent();
            }

            //提交所做题目内容
            _this.submitquestion();

          }else {
            this.Toast('验证码错误！');
          }
        }).catch(err => {
          // console.log(err);
          this.Toast('发送验证码出现错误');
        })
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
              mobile: _this.tel,
              nickName: ''
            }
          },
        }).then((res) => {

        }).catch(err => {
          // console.log(err);
        })
      },
      getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
      },
      //提交所做题目内容
      submitquestion() {
        clearInterval(time2);
        var _this = this;
        // _this.submitCon.mobile = _this.tel;
        // _this.submitCon.smsCode = _this.smscode;
        _this.submitCon.useTime = _this.paperDetails.standardTime * 60 - _this.topicname;
        window.localStorage.setItem("paperResultData",JSON.stringify( _this.submitCon));
        //var userInfo=window.localStorage.getItem('userInfo');
        if(_this.$route.query.inviteCode){
          _this.$router.push({
            path: '/createInfo',
            query: {
              gradecode: _this.$route.query.gradecode,
              inviteCode: _this.$route.query.inviteCode,
            }
          })
        }else{
          if(_this.flag){
            _this.localData.set("userid",_this.userInfo.userId);
            _this.submitCon.mobile = _this.userInfo.mobile;
            _this.submitCon.userId = _this.userInfo.userId || null;
            _this.submitCon.isReport = true;
            _this.$axios({
                method: "post",
                url: "/evaluation/submit",
                data: _this.submitCon,
              }).then((res) => {
                if(res.code == '000000') {
                  // this.Toast(res.message);
                  // console.log(res);
                  var reportCode = res.evaluationRecordCode;
                  _this.Toast('提交成功！');

                  _this.$router.push({
                    path: '/report',
                    query: {
                      reportCode: reportCode, // 查看报告详情用
                      reportId:res.reportId,  //提交预约用
                      gradecode: _this.$route.query.gradecode,
                    }
                  })


                  // window.history.go(-1);
                  _this.viewType = "readme";
                  //隐藏手机验证码页面
                  _this.mobilehide();

                }else {
                  _this.Toast('提交答案出现错误！');
                  // console.log(res.message)
                }
              }).catch(err => {
                // console.log(err);
                _this.Toast('提交答案出现错误');
              })
          }else{
            _this.$router.push({
              path: '/createInfo',
              query: {
                gradecode: _this.$route.query.gradecode,
                inviteCode: _this.$route.query.inviteCode,
              }
            })
        }

        }
      },
      //获取用户登录后的信息
      getAuthenInfo(userId) {
        var _this = this;
        this.$axios.post("/user/getAuthenticatedInfo",{userId:userId}).then(function (res) {
          if(res.code === "000000"){
            _this.userInfo = res || {};
            _this.flag=res.student ? true:false
            // if(res.student){_this.flag=false}else{}
            _this.localData.set("userInfo",res);
            return ;
          }
          _this.Toast({message:res.message});
        }).catch(function (e) {
          _this.Toast({message:e});
        });
      },
      //发送验证码
      sendCode() {
        var _this = this;
        // console.log(_this.tel.length)
        if(_this.tel.length == 0){
          _this.Toast('请输入手机号');
          return;
        }
        if (!_this.checkPhone(_this.tel)){
          _this.Toast("您填写的手机号码格式不对");
          return;
        }
        //禁用 样式改变
        _this.smscodeAvtive = true;

        var timer;
        var i = 60;

        clearInterval(timer);

        //验证码
        _this.getCode();

        timer=setInterval(function(){
          _this.smsText = i + 's';
          if(i==0){
            i=60
            clearInterval(timer);
            _this.smscodeAvtive = false;
            _this.smsText = '重新获取';
          }
          if(_this.mobileShow == false) {
            i=60
            clearInterval(timer);
            _this.smscodeAvtive = false;
            _this.smsText = '获取验证码';
          }
          i--;
        },1000);
      },
      //获取验证码
      getCode() {
        var _this = this;
        // console.log('发送验证码');
        this.$axios({
          method: "post",
          url: "/sms/evaluationSMS",
          data: {
            appKey: "string",
            mobile: _this.tel,
            token: "string"
          }
        }).then((res) => {
          if(res.code == '000000') {
            // this.Toast(res.message);
            // console.log(res);
          }else {
            this.Toast(res.message);
          }
        }).catch(err => {
          // console.log(err);
          this.Toast('发送验证码出现错误');
        })
      },
      //答题卡中点击题目跳转页面
      routerToquestion(index) {
        var _this = this;
        _this.nowquesIndex = index
        if(_this.topicname <= 0) {
          _this.Toast('时间已到，请交卷！');
          _this.answercardShow = true;
        }else {
          _this.answercardShow = !this.answercardShow;
          mySwiper.slideTo(index-1, 1000, false);//切换到第一个slide，速度为1秒
        }
      },

      //简单题型的答案处理
      onceChoice(item,question) {
        // console.log("单选")
        // console.log(item);
        // console.log(question)

        for(var i=0;i<this.submitCon.questionList.length;i++) {
          var nowSubmitCon = this.submitCon.questionList[i];
          if(nowSubmitCon.questionCode == item.smallId) {
            // console.log("答案下标")
            // console.log(i)

            if(item.smallType == 1) {//单选
              this.submitCon.questionList[i].userAnswer = question.optionKey;
            }else if(item.smallType == 2) {//多选
              var answerArr = this.submitCon.questionList[i].userAnswer;
              //第一次添加
              if(answerArr == null || answerArr == '') {
                answerArr = [];
                if(question.active == true) {
                  answerArr.push(question.optionKey);
                }
              }else {
                answerArr = answerArr.split('');
                if(question.active == true) {
                  answerArr.push(question.optionKey);
                }else {
                  for(var c=0;c<answerArr.length;c++) {
                    if(answerArr[c] ==question.optionKey) {
                      answerArr.splice(c,1)
                    }
                  }
                }
              }
              this.submitCon.questionList[i].userAnswer = answerArr.join('');
            }else if(item.smallType == 4) {//填空
              this.submitCon.questionList[i].userAnswer = [];
              for(var d=0;d<question.length;d++) {
                var obj = {
                  score:1,
                  answerKey:[],
                  answerValue:"1",
                  productionCodes:""
                };
                obj.score = question[d].score;
                obj.answerKey = question[d].answerKey;
                obj.answerValue = question[d].userValue;
                obj.productionCodes = question[d].productionCodes;
                this.submitCon.questionList[i].userAnswer.push(obj);
              }
              this.submitCon.questionList[i].userAnswer = JSON.stringify(this.submitCon.questionList[i].userAnswer);
            }else if(item.smallType == 3) {//判断
              this.submitCon.questionList[i].userAnswer = question;
            }else if(item.smallType == 5) {//主观
              this.submitCon.questionList[i].userAnswer = question;
            }
          }
        }
        // console.log("学则后端安居客鲁大师")
        // console.log(this.submitCon.questionList)

      },
      //复合题型答案处理
      twoChoice(item,question) {
        // console.log("复合选")
        // console.log(item);
        // console.log(question)

        for(var i=0;i<this.submitCon.questionList.length;i++) {
          var nowSubmitCon = this.submitCon.questionList[i];
          if(nowSubmitCon.questionCode == item.componentId) {
            // console.log("下标")
            // console.log(i)
            if(item.componentType == 1) {//单选
              this.submitCon.questionList[i].userAnswer = question.optionKey;
            }else if(item.componentType == 2) {//多选
              var answerArr = this.submitCon.questionList[i].userAnswer;
              //第一次添加
              if(answerArr == null || answerArr == '') {
                answerArr = [];
                if(question.active == true) {
                  answerArr.push(question.optionKey);
                }
              }else {
                answerArr = answerArr.split('');
                if(question.active == true) {
                  answerArr.push(question.optionKey);
                }else {
                  for(var c=0;c<answerArr.length;c++) {
                    if(answerArr[c] ==question.optionKey) {
                      answerArr.splice(c,1)
                    }
                  }
                }
              }
              this.submitCon.questionList[i].userAnswer = answerArr.join('');
            } else if(item.componentType == 4) {//填空

              this.submitCon.questionList[i].userAnswer = [];
              for(var d=0;d<question.length;d++) {
                var obj = {
                  score:1,
                  answerKey:[],
                  answerValue:"1",
                  productionCodes:""
                };
                obj.score = question[d].score;
                obj.answerKey = question[d].answerKey;
                obj.answerValue = question[d].userValue;
                obj.productionCodes = question[d].productionCodes;
                this.submitCon.questionList[i].userAnswer.push(obj);
              }
              this.submitCon.questionList[i].userAnswer = JSON.stringify(this.submitCon.questionList[i].userAnswer);
            } else if(item.componentType == 3) {//判断
              this.submitCon.questionList[i].userAnswer = question;
            }
          }
        }
        // console.log("学则后端安居客鲁大师")
        // console.log(this.submitCon.questionList)

      },
      //验证手机号码
      checkPhone(phone) {
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){
          return false;
        } else {
          return true;
        }
      }
    },
    filters: {
      //局部过滤器
      toPageNum: function(value) {
        switch (value) {
          case 0:
            return "零";
          case 1:
            return "一";
          case 2:
            return "二";
          case 3:
            return "三";
          case 4:
            return "四";
          case 5:
            return "五";
          case 6:
            return "六";
          case 7:
            return "七";
          case 8:
            return "八";
          case 9:
            return "九";
          case 10:
            return "十";
        }
      }
    },
    components: {
      question,
      beginAnswer,
    //  answerSheet,
      compoundQuestion
    }
  }
</script>

<style scoped lang="scss">

  .paperstatic {
    height: 100%;
  }
  .mint-header.is-fixed {
    /*z-index: 1000;*/
  }
  /*左上方 X 样式*/
  .closer {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    display: inline-block;
    font-size: 0.8rem;
    border: 0.05rem solid #fff;
    text-align: center;
    line-height: 0.9rem;
  }

  /*开始作答按钮*/
  .start {
    height: 2.5rem;
    font-size: .8rem;
    color: #fff;
    background-color: #3ebce5;
    line-height: 2.5rem;
    text-align: center;
  }

  /*头部下方条状*/
  .preview {
    position: relative;
  }
  .headmore {
    height: 2.125rem;
    background-color: #f2f2f2;
    color: #666666;
    font-size: 0.6rem;
    line-height: 1;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    justify-content: space-between;
    position: fixed;
    top: 2.2rem;
    left: 0;
    right: 0;
    z-index: 2;
  }

  /*试题预览试卷内容*/
  .content {
    /*padding: 0 0.5rem;*/
    padding-top: 4.325rem;
    padding-bottom: 0.5rem;
    overflow: auto;
    height: calc(100vh - 7.325rem);
  }

  /*开始作答*/
  .answerpaper {
    /*头部*/
    .answerpaper-head {
      background-color: #3ebce5;
      padding: 0 0.5rem;
      box-sizing: border-box;
      color: white;
      width: 100%;
      height: 2.2rem;
      display:flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
      .clock {
        padding-right: 1.4rem;
      }

    }
    /*试题*/
    .paper {
      width: 100%;
      height: calc(100vh - 4.325rem);
      box-sizing: border-box;
      margin-top: 4.325rem;
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 1;
      touch-action: none;
      /*border: 1px solid red;*/
      .swiper-container {
        width: 100%;
        height: 100%;
        .swiper-wrapper {
          width: 100%;
        }
        .swiper-slide {
          /*padding: 0 0.6rem;*/
          touch-action: none !important;
          /*overflow: auto;*/
        }
        .cony {
          padding: 0 0.5rem;
        }
      }
    }
    /*图标样式*/
    .fa {
      padding-right: .4rem;
      font-weight: 400;
    }

    .complex{
      position: fixed;
      /*z-index: 9999;*/
      top: 50%;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;
    }
  }

  /*试题类型*/
  .big-name {
    font-size: 0.7rem;
    font-weight: bold;
    padding: 0.8rem 0.6rem 0;
  }

  /*.question {*/
    /*padding-top: 1rem;*/
  /*}*/

  /*答题卡*/
  .answercard {
    width: 100%;
    position: fixed;
    z-index: 2;
    top: 0px;
    left: 0px;
    background: white;
    /*答题卡内容*/
    .answercard-con {
      width: 100%;
      height: calc(100vh - 4.2rem);
      /*padding-top: 2.2rem;*/
      overflow: auto;
      .answercard-con-item {
        padding: 0 0.8rem;
        border-bottom: 1px solid #d9d9d9;
        &>p {
          font-size: 0.8rem;
          margin-top: 1.15rem;
        }
        &> ul {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 0.9rem;
          &> li {
            width: 2rem;
            height: 2rem;
            text-align: center;
            line-height: 2rem;
            border: 1px solid #3ebce5;
            border-radius: 50%;
            margin: 1rem 0.6rem 0;
            font-size: 0.75rem;
          }
          .active {
            background-color: #3ebce5;
            color: white;
          }
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
    /*底部按钮*/
    .bottom-btn {
      width: 100%;
      position: fixed;
      bottom: 0;
      .btn {
        width: 100%;
        border-radius: 0;
        font-size: 0.8rem;
      }
    }
  }

  /*获取手机验证码*/
  .mobile {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.8);
    z-index: 3;
    .mobile-wrap {
      box-sizing: border-box;
      width: 15rem;
      margin: 5.5rem auto;
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      /*标题*/
      .titleTop {
        font-size: 0.7rem;
        font-weight: 700;
      }
      .titlebottom {
        font-size: 0.7rem;
        margin-top: 0.7rem;
      }
      /*手机号和验证码*/
      .input-wrap {
        .tel-wrap {
          height: 2.65rem;
          border-bottom: 1px solid #c3c3c3;
          display: flex;
          align-items: center;
          input {
            height: 100%;
            border: none;
            outline:none;
            font-size: 0.75rem;
          }
        }
        .reset-wrap {
          height: 2.65rem;
          border-bottom: 1px solid #c3c3c3;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &>div {
            height: 100%;
            input {
              width: 90%;
              height: 100%;
              border: none;
              outline:none;
              font-size: 0.75rem;
            }
          }
          &>button {
            width: 4rem;
            height: 1.5rem;
            white-space: nowrap;
            background: white;
            border: 1px solid #23d0eb;
            color: #23d0eb;
            border-radius: 0.15rem;
          }
          .smsActive {
            color:#808080;
            border: 1px solid #808080;
          }
        }
      }
      .button-wrap {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 1.75rem;
        &>button {
          width: 5.85rem;
          height: 1.75rem;
          border: none;
          border-radius: 0.2rem;
          font-size: 0.6rem;
        }
        .err {
          background-color: #cccccc;
        }
        .ok {
          background: #23d0eb;
          color: white;
        }
      }
    }
  }

</style>
