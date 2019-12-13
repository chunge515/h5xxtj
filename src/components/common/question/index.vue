<template>
  <!--简单题型组件-->
  <div class="question">
    <div v-if="questionDetails.smallType == 1 || questionDetails.smallType == 2">
      <div class="stem">
        <span>{{questionDetails.quesIndex}}、</span>
        <span v-html="strUrlChange(questionDetails.stem)"></span>
      </div>
      <!--选择-->
      <div class="options">
        <div v-if="finish == 0" v-for="(optionitem,index) in questionDetails.quesOption" class="op">
          <span class="key">{{optionitem.optionKey}}</span>
          <span class="value" v-html="strUrlChange(optionitem.optionValue)"></span>
        </div>

        <div v-if="finish == 1" v-for="(optionitem,index) in questionDetails.quesOption" :class="['op',{active:optionitem.active == true && finish == 1}]" @click="onceChoice(questionDetails,index)">
          <span class="key">{{optionitem.optionKey}}</span>
          <span class="value" v-html="strUrlChange(optionitem.optionValue)"></span>
        </div>

        <div v-if="finish == 2" v-for="(optionitem,index) in questionDetails.quesOption" :class="['op',optionitem.ok]">
          <span class="key">{{optionitem.optionKey}}</span>
          <span class="value" v-html="strUrlChange(optionitem.optionValue)"></span>
        </div>

      </div>
    </div>

    <!--填空-->
    <div v-if="questionDetails.smallType == 4">
      <div class="stem">
        <span>{{questionDetails.quesIndex}}、</span>
        <span v-html="strUrlChange(questionDetails.stem)"></span>
      </div>
      <div v-if="finish == 1" class="blanks" v-for="(answertem,index) in questionDetails.answer">
        <div class="blank" v-if="finish == 1"><span class="index">{{index + 1}}</span><div class="cont"><input type="text" placeholder="请输入答案" v-model="answertem.userValue" @blur="onceChoice(questionDetails,answertem)"></div></div>
      </div>
      <div v-if="finish == 2" class="blanks" v-for="(answertem,index) in questionDetails.userAnswer">
        <div :class="['blank',answertem.ok]"><span class="index">{{index+1}}</span><div class="cont"><input type="text" readonly v-model="answertem.answerValue"></div></div>
      </div>
    </div>

    <!--判断题-->
    <div v-if="questionDetails.smallType == 3">
      <div class="stem">
        <span>{{questionDetails.quesIndex}}、</span>
        <span v-html="strUrlChange(questionDetails.stem)"></span>
      </div>
      <div class="judge" v-if="finish == 0">
        <div>√</div>
        <div>×</div>
      </div>
      <div class="judge" v-if="finish == 1">
        <div @click="onceChoice(questionDetails,'1')" :class="{active: questionDetails.userAnswer == 1}">√</div>
        <div @click="onceChoice(questionDetails,'0')" :class="{active: questionDetails.userAnswer == 0}">×</div>
      </div>
      <div class="judge" v-if="finish == 2">
        <div :class="questionDetails.userAnswer == 1 ? questionDetails.answer == 1 ? 'ok' : 'err' : ''">√</div>
        <div :class="questionDetails.userAnswer == 0 ? questionDetails.answer == 0 ? 'ok' : 'err' : ''">×</div>
      </div>
    </div>

    <!--完形填空-->
    <!--<div class="gestalt">-->
      <!--<div class="gestalt-item">-->
        <!--<div class="left-index">1.</div>-->
        <!--<div class="right-options">-->
          <!--<div class="ok">-->
            <!--<span class="key">A</span><span class="value">our name</span>-->
          <!--</div>-->
          <!--<div class="err">-->
            <!--<span class="key">A</span><span class="value">our name</span>-->
          <!--</div>-->
          <!--<div>-->
            <!--<span class="key">A</span><span class="value">our name</span>-->
          <!--</div>-->
          <!--<div>-->
            <!--<span class="key">A</span><span class="value">our name</span>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->


    <!--书面表达-->
    <div class="written" v-if="questionDetails.smallType == 5">
      <div class="stem">
        <span>{{questionDetails.quesIndex}}、</span>
        <span v-html="strUrlChange(questionDetails.stem)"></span>
      </div>
      <div v-if="finish == 1 && questionDetails.smallType == 5">
        <answerSheet :questionType="5" :questionDetails="questionDetails" @onceChoice="onceChoice"></answerSheet>
      </div>
      <div v-if="finish == 2 && questionDetails.smallType == 5" class="answer-wrap">
        <span :class="questionDetails.userAnswer == questionDetails.answer ? 'ok' : 'err'">{{questionDetails.userAnswer}}</span>
      </div>
    </div>

    <!--答案 解析-->
    <div  v-if="finish == 2">
      <div class="result answer" v-if="questionDetails.smallType == 1 || questionDetails.smallType == 2">
        <span class="name">答案：</span>
        <span class="value">{{questionDetails.answer}}</span>
      </div>
      <div class="result answer" v-if="questionDetails.smallType == 3">
        <span class="name">答案：</span>
        <span class="value">{{questionDetails.answer == 0 ? '×' : '√'}}</span>
      </div>
      <div class="result answer blanks-answer" v-if="questionDetails.smallType == 4">
        <span class="name">答案：</span>
        <div>
          <p class="value" v-for="answeritem in questionDetails.answer">{{answeritem.answerValue}}</p>
        </div>
      </div>
      <div class="result answer" v-if="questionDetails.smallType == 5">
        <span class="name">答案：</span>
        <span class="value">{{questionDetails.answer}}</span>
      </div>
    </div>

    <div  v-if="finish == 2">
      <div class="result analysis">
        <span class="name">解析：</span>
        <span class="value" v-html="JSON.parse(questionDetails.quesAnalyze)[0].analyzeValue == null ? '暂无解析' :strUrlChange(JSON.parse(questionDetails.quesAnalyze)[0].analyzeValue)"></span>
      </div>
    </div>

  </div>
</template>
<script>
  import answerSheet from "../answerSheet"
  export default {
    name: "index",
    props: ['questionDetails','finish'],
    data() {
      return {
        analysis: '',//解析
        judgeActive: null,//判断是否正确
      }
    },
    mounted() {
      var _this = this;
      if(this.questionDetails.smallType == "1" || this.questionDetails.smallType == "2") {
        if(typeof this.questionDetails.quesOption != "object") {
          var obj = JSON.parse(this.questionDetails.quesOption);
          for(var i=0;i<obj.length;i++) {
            obj[i].active = false;
            if(_this.finish == 2) {
              obj[i].ok = '';
              var userAnswerStr = _this.questionDetails.userAnswer || '';
              var answerStr = _this.questionDetails.answer || '';
              if(userAnswerStr.indexOf(obj[i].optionKey) != -1) {
                if(answerStr.indexOf(obj[i].optionKey) != -1) {
                  obj[i].ok = 'ok';
                }else {
                  obj[i].ok = 'err';
                }
              }
            }
          }
          this.questionDetails.quesOption = obj;
        }
      }else if(this.questionDetails.smallType == "4") {
        if(typeof this.questionDetails.answer != "object") {
          if(_this.finish == 2 || _this.finish == 1) {
            var obj = JSON.parse(this.questionDetails.answer);
            if(_this.finish == 2) {
              var useranswerArr = JSON.parse(this.questionDetails.userAnswer);
            }
            for(var i = 0;i < obj.length; i ++) {
              if(_this.finish == 1) {
                obj[i].userValue = '';
              }
              if(_this.finish == 2) {
                if(obj[i].answerValue == useranswerArr[i].answerValue) {
                  useranswerArr[i].ok = 'ok';
                }else {
                  useranswerArr[i].ok = 'err';
                }
              }
            }
            if(_this.finish == 2) {
              this.$set(this.questionDetails,"userAnswer",useranswerArr);
            }
            this.$set(this.questionDetails,"answer",obj);
          }


        }
      }

    },
    methods: {
      /*
      * 参数说明
      * optionitem 题目详细信息
      * index 题目下标或者题目选项信息
      * */
      strUrlChange(str){
    if(!str || typeof  str != "string")return "";
    return str.replace(/http:\/\/.*?\.(mp3|jpg|jpeg|png|gif)/ig, function(w){
      if(/mp3$/i.test(w)){
        return '<audio src="' + w + '" controls/>'
      }else{
        return '<img class="media-middle"  src="' + w + '" style="max-width:100%"/>'
      }
    });
    },
      onceChoice: function(optionitem,index) {
        //要传的选中值
        var emitoption = null;

        //作答状态
        if(this.finish == 1) {
          if(this.questionDetails.smallType == 1) {//单选
            for(var i=0;i<this.questionDetails.quesOption.length;i++) {
              this.questionDetails.quesOption[i].active = false;
            }
            this.questionDetails.quesOption[index].active = true;

            emitoption = this.questionDetails.quesOption[index];
          }else if(this.questionDetails.smallType == 2) {//多选
            //若当前选中状态，点击取消选中
            if(this.questionDetails.quesOption[index].active == true) {
              this.questionDetails.quesOption[index].active = false;
            }else {
              this.questionDetails.quesOption[index].active = true;
            }

            emitoption = this.questionDetails.quesOption[index];
          }else if(this.questionDetails.smallType == 4) {//填空
            emitoption = this.questionDetails.answer;
          }else if(this.questionDetails.smallType == 3) {//判断
           // this.judgeActive = index;
            this.$set(optionitem,"userAnswer",index);
            emitoption = index;
          }else if(this.questionDetails.smallType == 5) {//主观题
            emitoption = index;
          }
          this.$emit('onceChoice', optionitem,emitoption)
        }

      }
    },
    components: {
      answerSheet
    }
  }
</script>

<style scoped lang="scss">
  /*外层容器*/
  .question {
    .stem, .key, .value {
      font-size: 0.7rem;
      line-height: 1rem;
      white-space: pre-wrap;
      word-break: break-word;
      &>span {
        word-wrap: break-word;
        line-height: 1.2rem;
        img{
          width:100%!important;display: block;
        }
      }
    }
    .stem {

      padding: 0.6rem 0.6rem 0;
      &>span:first-child {
        white-space: nowrap;
      }
    }
    /*选择*/
    .op {
      /*选择的key值*/
      .key {
        padding-right: .5rem;
      }
      box-sizing: border-box;
      padding: 0.75rem 0.65rem 0.65rem 0.75rem;
      border: 1px solid #cccccc;
      border-radius: 0.25rem;
      margin: .65rem 0.6rem 0;
      display: flex;
      /*点击情况*/
      &.active {
        border: 1px solid #3ebce5;
        box-shadow: 0 0 6px 1px #3ebce5 inset;
      }
      /*正确情况*/
      &.ok {
        border: 1px solid #7ac858;
        box-shadow: 0 0 6px 1px #7ac858 inset;
      }
      /*错误情况*/
      &.err {
        border: 1px solid #f57665;
        box-shadow: 0 0 6px 1px #f57665 inset;
      }
    }
    /*填空*/
    .blanks{
      .blank{
        border: 1px solid #ccc;
        font-size: .65rem;
        height: 2.125rem;
        line-height: 2.125rem;
        border-radius: .25rem;
        margin: 0.8rem 0.6rem 0;
        position: relative;
        z-index: 1;
        overflow: hidden;
        /*填空key值*/
        .index{
          width: 1.9rem;
          text-align: center;
          background-color: #3ebce5;
          color: #fff;
          height: 2.125rem;
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 1;
        }
        /*input外层容器*/
        .cont{
          position: absolute;
          left: 1.9rem;
          right: 0;
          top: 0;
          bottom: 0;
          padding: 0 8px;
          box-sizing: border-box;
          z-index: 1;
        }
        input{
          outline: none;
          border: none;
          width: 100%;
          height: 100%;
          font-size: 0.7rem;
          background-color: transparent;
        }
        /*正确*/
        &.ok{
          border: 1px solid #7ac858;
          .index{
            background-color: #7ac858;
          }
        }
        /*错误*/
        &.err{
          border: 1px solid #f57665;
          .index{
            background-color: #f57665;
          }
        }
      }
    }

    /*判断题*/
    .judge {
      display: flex;
      margin: .65rem 0.6rem 0;
      &>div {
        border: 1px solid #ccc;
        font-size: .8rem;
        border-radius: .1rem;
        width: 2rem;
        height: 1.3rem;
        line-height: 1.3rem;
        text-align: center;
        margin: 0.4rem;
        /*点击情况*/
        &.active {
          border: 1px solid #3ebce5;
          box-shadow: 0 0 6px 1px #3ebce5 inset;
        }
        &.ok {
          border: 1px solid #7ac858;
          box-shadow: 0 0 6px 1px #7ac858 inset;
        }
        &.err {
          border: 1px solid #f57665;
          box-shadow: 0 0 6px 1px #f57665 inset;
        }
      }
    }

    /*完形填空*/
    .gestalt {
      .gestalt-item {
        display: flex;
        justify-content: space-between;
        /*左侧index值*/
        .left-index {
          margin-top: 1.4rem;
          font-szie: 0.75rem;
        }
        /*右侧选项值*/
        .right-options {
          width: 15.45rem;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          & >div {
            width: 7.45rem;
            height: 2.1rem;
            line-height: 2.1rem;
            border: 1px solid #cccccc;
            border-radius: 0.25rem;
            margin-top: 0.6rem;
            .key {
              font-szie: 0.65rem;
              padding-right: 0.5rem;
              padding-left: 0.75rem;
            }
            .value {
              font-szie: 0.7rem;
            }
          }
          /*正确情况*/
          .ok {
            background-color: #7ac858;
            color: white;
          }
          /*错误情况*/
          .err {
            background-color: #f57665;
            color: white;
          }
        }
      }
    }

    /*书面表达*/
    .written {
      /*line-height: 1.2rem;*/
      font-size: 0.7rem;
      .answer-wrap {
        border: 1px solid #d9d9d9;
        margin: 0.6rem 0.6rem 0;
        padding: 0.6rem;
        word-break: break-word;
        line-height: 1rem;
        border-radius: 0.2rem;
      }
      /*正确情况*/
      .ok {
        color: #7ac858;
      }
      /*错误情况*/
      .err {
        color: #f57665;
      }
    }
    /*答案 解析*/
    .result{
      padding: 0.55rem 0.6rem 0;
      .name,.value{
        font-size: .75rem;
        line-height: 1.2rem;
      }
      &.analysis .value{
        color: #808080;
      }
      &.answer .value{
        color: #7ac858;
      }
    }
    /*填空题答案*/
    .blanks-answer {
      display: flex;
    }
  }
</style>
