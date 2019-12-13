<template>
  <!--复合题组件-->
  <div class="compound">
    <div class="stem" :style="{'padding-bottom': stemPB}">
      <span>{{compoundDetails.quesIndex}}、</span>
      <span v-html="strUrlChange(compoundDetails.stem)"></span>
      <span class="videoIcon" v-if="compoundDetails.questionAnalyzeType == 1 && finish == 1"><i class="fa fa-volume-up"></i></span>
    </div>
    <!-- 预览使用 -->
    <div v-for="(item4,index4) in compoundDetails.componentQuestionModels" v-if="finish != 1">
      <compoundItem :item4="item4" :finish="finish"></compoundItem>
    </div>

    <!--答题板-->
    <div v-if="finish == 1">
      <answerSheet questionType="6" @eheight="childHeight" @beginGestalt="beginGestalt" @getnowIndex="getnowIndex" @twoChoice="twoChoice" :componentQuestion="compoundDetails.componentQuestionModels" :finish="finish"></answerSheet>
    </div>

  </div>

</template>

<script>
  import singlequestion from "./index"
  import compoundItem from "./compoundItem"
  import answerSheet from "../answerSheet"

    export default {
      name: "compoundQuestion",
      props: ['compoundDetails','finish'],
      data() {
        return {
          stemPB:"0"  // 题干距离底部的padding值（复合题）
          // analysis: '',//解析
        }
      },
      created() {
        // console.log("复合复合")
        // console.log(this.compoundDetails)
        this.compoundDetails.componentQuestionModels=this.compoundDetails.componentQuestionModels.sort(this.compare('sort'));
        var index = 0;
        for(var i=0;i<this.compoundDetails.componentQuestionModels.length;i++) {
          index += 1;
          this.compoundDetails.componentQuestionModels[i].componentIndex = index;
        }

      },
      methods: {
        //复合题小题标签高度变化
        childHeight(rem){
          this.stemPB = rem +"rem";
        },
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
        //排序
        compare(property) {
          return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
          }
        },
        //复合题提交
        twoChoice(optionitem,emitoption) {
          this.$emit('twoChoice', optionitem,emitoption)
        },
        //复合题中点击开始作答
        beginGestalt(componentQuestion) {
          this.$emit('beginGestalt',componentQuestion);
        },
        //复合题中点击下方小题
        getnowIndex(item) {
          this.$emit('getnowIndex',item);
        }
      },
      components: {
        singlequestion,
        answerSheet,
        compoundItem
      }
    }
</script>

<style scoped lang="scss">
  .compound {
    margin-bottom: 0.6rem;
    .stem {
      padding: 0 0.5rem;
     // display: flex;
      font-size: 0.7rem;
      line-height: 1rem;
      white-space: pre-wrap;
      margin-top: 0.6rem;
      &>span {
        word-wrap: normal;
        word-break: break-word;
        line-height: 1.2rem;
      }
      .videoIcon {
        /*color: #f57665;*/
        margin-left: 0.5rem;
        fomnt-size: 1rem;
      }
    }

  }

</style>
