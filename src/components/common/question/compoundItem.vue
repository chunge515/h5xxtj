<template>
  <!--复合题组件 单选 多选 判断 填空-->
  <div class="compoundItem">
    <!--{{componentQuestion}}-->
    <div>
      <!--单选多选-->
      <div v-if="item4.componentType == 1 || item4.componentType == 2">
        <div class="stem">
          <span v-show="false">({{item4.componentIndex}})、</span>
          <span v-html="strUrlChange(item4.stem)"></span>
        </div>
        <div class="options">
          <div v-if="finish == 0" v-for="(optionitem,index) in item4.quesOption" class="op">
            <span class="key">{{optionitem.optionKey}}</span>
            <span class="value" v-html="strUrlChange(optionitem.optionValue)"></span>
          </div>
          <div v-if="finish == 1" v-for="(optionitem,index) in item4.quesOption" :class="['op',{active:optionitem.active == true}]" @click="twoChoice(item4,index)">
            <span class="key">{{optionitem.optionKey}}</span>
            <span class="value" v-html="strUrlChange(optionitem.optionValue)"></span>
          </div>
          <div v-if="finish == 2" v-for="(optionitem,index) in item4.quesOption" :class="['op',optionitem.ok]">
            <span class="key">{{optionitem.optionKey}}</span>
            <span class="value" v-html="strUrlChange(optionitem.optionValue)"></span>
          </div>
          <!--<div class="op ok" v-if="finish == 2"><span class="key">A</span><span class="value">our name is yours</span></div>-->
          <!--<div class="op err" v-if="finish == 2"><span class="key">A</span><span class="value">our name is yours</span></div>-->
          <!--<div class="op active"><span class="key">A</span><span class="value">our name is yours</span></div>-->
        </div>
      </div>

      <!--判断题-->
      <div v-if="item4.componentType == 3">
        <div class="stem">
          <span v-show="false">({{item4.componentIndex}})、</span>
          <span v-html="strUrlChange(item4.stem)"></span>
        </div>
        <div class="judge" v-if="finish == 0">
          <div>√</div>
          <div>×</div>
        </div>
        <div class="judge" v-if="finish == 1">
          <div @click="twoChoice(item4,'1')" :class="{active: item4.userAnswer == 1}">√</div>
          <div @click="twoChoice(item4,'0')" :class="{active: item4.userAnswer == 0}">×</div>
        </div>
        <div class="judge" v-if="finish == 2">
          <div :class="item4.userAnswer == 1 ? item4.answer == 1 ? 'ok' : 'err' : ''">√</div>
          <div :class="item4.userAnswer == 0 ? item4.answer == 0 ? 'ok' : 'err' : ''">×</div>
        </div>

      </div>

      <!--填空-->
      <div v-if="item4.componentType == 4">
        <div class="stem">
          <span v-show="false">({{item4.componentIndex}})、</span>
          <span v-html="strUrlChange(item4.stem)"></span>
        </div>
        <div v-if="finish == 1" class="blanks" v-for="(answertem,index) in item4.answer">
          <div class="blank" v-if="finish == 1"><span class="index">{{index+1}}</span><div class="cont"><input type="text" placeholder="请输入答案" v-model="answertem.userValue" @blur="twoChoice(item4,answertem)"></div></div>
        </div>
        <div v-if="finish == 2" class="blanks" v-for="(answertem,index) in item4.userAnswer">
          <div :class="['blank',answertem.ok]"><span class="index">{{index+1}}</span><div class="cont"><input type="text" readonly v-model="answertem.answerValue"></div></div>
        </div>

      </div>

      <!--答案 解析-->
      <div v-if="finish == 2">
        <div class="result answer" v-if="item4.componentType == 1 || item4.componentType == 2">
          <span class="name">答案：</span>
          <span class="value">{{item4.answer || '暂无答案'}}</span>
        </div>
        <div class="result answer" v-if="item4.componentType == 3">
          <span class="name">答案：</span>
          <span class="value">{{item4.answer == 0 ? '×' : '√'}}</span>
        </div>
        <div class="result answer blanks-answer"  v-if="item4.componentType == 4">
          <span class="name">答案：</span>
          <div>
            <p class="value" v-for="answeritem in item4.answer">{{answeritem.answerValue}}</p>
          </div>
        </div>
      </div>

      <div  v-if="finish == 2">
        <div class="result analysis">
          <span class="name">解析：</span>
          <span class="value" v-html="JSON.parse(item4.quesAnalyze)[0].analyzeValue == null || JSON.parse(item4.quesAnalyze)[0].analyzeValue == '' ? '暂无解析' :JSON.parse(item4.quesAnalyze)[0].analyzeValue"></span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
      name: "compoundItem",
      props: ['item4','finish'],
      data() {
        return {
          judgeActive: null,//判断是否正确
        }
      },
      created() {
        var _this = this;
        if(this.item4.type == "1" || this.item4.type == "2") {
          if(typeof this.item4.quesOption != "object") {
            var obj = JSON.parse(this.item4.quesOption);
            for(var i=0;i<obj.length;i++) {
              obj[i].active = false;
              if(_this.finish == 2) {
                obj[i].ok = '';
                var userAnswerStr =  _this.item4.userAnswer || '';
                var answerStr = _this.item4.answer || '';
                if(userAnswerStr.indexOf(obj[i].optionKey) != -1) {
                  if(answerStr.indexOf(obj[i].optionKey) != -1) {
                    obj[i].ok = 'ok';
                  }else {
                    obj[i].ok = 'err';
                  }
                }
              }
            }
            this.item4.quesOption = obj;
          }
        }
        if(this.item4.type == "4") {
          if(typeof this.item4.answer != "object") {
            if(_this.finish == 2 || _this.finish == 1) {
              var obj = JSON.parse(this.item4.answer);
              if(_this.finish == 2) {
                var useranswerArr = JSON.parse(this.item4.userAnswer);
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
                  // console.log('------');
                  // console.log(useranswerArr)
                }
              }
              if(_this.finish == 2) {
                this.$set(this.item4,"userAnswer",useranswerArr);
              }
              this.$set(this.item4,"answer",obj);
            }
          }
        }
      },
      methods: {
        strUrlChange(str){
          if(!str || typeof  str != "string")return "";
          return str.replace(/http:\/\/.*?\.(mp3|jpg|jpeg|png|gif)/ig, function(w){
            if(/mp3$/i.test(w)){
              return '<audio src="' + w + '" controls/>'
            }else{
              return '<img class="media-middle"  src="' + w + '"/>'
            }
          });
        },
        //复合题提交
        twoChoice(item,index) {
          //要传的选中值
          var emitoption = null;

          //作答状态
          if(this.finish == 1) {
            if(this.item4.type == 1) {//单选
              for(var i=0;i<this.item4.quesOption.length;i++) {
                this.item4.quesOption[i].active = false;
              }
              this.item4.quesOption[index].active = true;

              emitoption = this.item4.quesOption[index];
            }
            else if(this.item4.type == 2) {//多选
              //若当前选中状态，点击取消选中
              if(this.item4.quesOption[index].active == true) {
                this.item4.quesOption[index].active = false;
              }else {
                this.item4.quesOption[index].active = true;
              }

              emitoption = this.item4.quesOption[index];
            }
            else if(this.item4.type == 4) {//填空
              emitoption = this.item4.answer;
            }
            else if(this.item4.type == 3) {//判断
              this.judgeActive = index;
              this.$set(item,'userAnswer',index)
              emitoption = index;
            }
            this.$emit('twoChoice', item,emitoption)
          }
        }
      }
    }
</script>

<style scoped lang="scss">
  .compoundItem {
    padding: 0 0.6rem;
    /*margin-bottom: 0.6rem;*/
    .stem {
      display: flex;
      font-size: 0.7rem;
      line-height: 1rem;
      white-space: pre-wrap;
      margin-top: 0.6rem;
      &>span {
        word-wrap: break-word;
        line-height: 1.2rem;
        word-break: break-all;
      }
    }
    /*选择*/
    .op {
      /*选择的key值*/
      .key {
        padding-right: .5rem;
        padding-left: 0.75rem;
      }
      /*height: 2.1rem;*/
      line-height: 2.1rem;
      border: 1px solid #cccccc;
      border-radius: 0.25rem;
      margin-top: .65rem;
      display: flex;
      font-size: 0.7rem;
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
        margin-top: 0.8rem;
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
    }
    /*答案 解析*/
    .result{
      padding-top: .55rem;
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
