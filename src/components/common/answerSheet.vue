<template>
    <!--答题板组件  主观题 复合题-->
    <div>
      <div class="answerSheet"  v-if="questionType == 5">
        <div class="top-img" draggable='true' @touchmove = "move" @click = "toggle"><img src="../../../static/img/sheet_bg.png"/></div>
        <div class="bottom-written" v-show="writtentoggle" :style="{height: heightNum + 'rem',}">
          <textarea @blur="onceChoice(questionDetails,textCon)" v-model="textCon"></textarea>
          <!--<p>向左滑动屏幕进入答题卡</p>-->
        </div>


      </div>
      <div class="answerSheet" v-if="questionType == 6">
        <div v-show="gestaltShow == false" class="start" @click="beginGestalt(componentQuestion)">获取试题</div>
        <div v-show="gestaltShow == true">
          <div class="top-img" draggable='true' @touchmove = "move" @click = "toggle"><img src="../../../static/img/sheet_bg.png"/></div>
          <div class="bottom-gestalt" :style="{height: heightNum + 'rem'}">
            <div>
              <div class="swiper-container top-index">
                <div class="swiper-wrapper">
                  <div :class="['swiper-slide',{topactive: nowIndex == index5}]" style="width: 3.3rem !important;" @click="getnowIndex(item5,index5)" v-for="(item5,index5) in componentQuestion" :key="item5.bigId">
                    <span>{{index5 + 1}}</span>
                  </div>
                </div>
              </div>
              <div class="bottom-topic" :style="{height: (heightNum - 4.3) + 'rem'}">
                <div v-for="(item6,index6) in componentQuestion" v-show="nowQuestionDetail == index6">
                  <compoundItem @twoChoice="twoChoice" :item4="item6" :finish="finish"></compoundItem>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
</template>

<script>
  import compoundItem from "./question/compoundItem"
  import Swiper from 'swiper';
    export default {
      name: "answerSheet",
      props: ['questionType','componentQuestion','finish','questionDetails'],
      components: {
        compoundItem
      },
      data() {
        return {
          heightNum : '14.65',
          writtentoggle: false,
          nowIndex: 0,//当前题目下标
          nowQuestionDetail: 0,//答题板当前题目信息
          textCon: '',//主观题内容
          gestaltShow: false,//复合题答题板是否显示
        }
      },
      created() {

      },
      mounted() {
        if(this.questionType == 6) {
          this.nowQuestionDetail = this.componentQuestion[0];
        }

        //上方题下标
        new Swiper(".top-index",{
          // normalizeSlideIndex: true,
          slidesPerView: 'auto',
          observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
          // slideToClickedSlide: true,
          // slideActiveClass : 'topactive',
        });
        var _this = this;

        _this.nowIndex = 0;
        _this.nowQuestionDetail = 0;
        this.$emit("eheight",this.gestaltShow &&0 || 2.5)
      },
      methods: {
        //复合题中点击开始作答
        beginGestalt(componentQuestion) {
          this.gestaltShow = true;
          //复合题开始作答
          this.$emit('beginGestalt',componentQuestion)
          this.$emit("eheight",this.heightNum)
        },
        //复合题中点击下方小题
        getnowIndex(item,index) {
          // console.log(index)
          this.nowIndex = index;
          this.nowQuestionDetail = index;
          this.$emit('getnowIndex',item)
        },
        //调整高度
        move(e){
          // 1rem 等于多少px
          var renNum = document.documentElement.getBoundingClientRect().width * 40 / 720;
          //高度
          var screenHeight = document.documentElement.getBoundingClientRect().height;
          //高度rem数
          var screenRem = screenHeight / renNum;
          this.heightNum = screenRem - e.changedTouches[0].clientY / renNum
          if(this.heightNum >= (screenRem - 8.325)) {
            this.heightNum = screenRem - 8.325;
          }
          if(this.heightNum <= 10) {
            this.heightNum = 10
          }
          this.$emit("eheight",this.heightNum)
        },
        //点击答题板上方图标显示隐藏
        toggle() {
          if(this.questionType == 5) {
            this.writtentoggle = !this.writtentoggle;
            this.$emit("eheight",this.writtentoggle&&this.heightNum||0)
          }else {
            this.heightNum == 0 ?  this.heightNum = 14.65 : this.heightNum = 0;
            this.$emit("eheight",this.heightNum)
          }
        },
        //主观题提交
        onceChoice(questionDetails,textCon) {
          this.$emit('onceChoice', questionDetails,textCon);
        },
        //复合题提交
        twoChoice(optionitem,emitoption) {
          this.$emit('twoChoice', optionitem,emitoption)
        }
      }
    }
</script>

<style scoped>
  .answerSheet {
    width: 100%;
    /*height: 15.45rem;*/
    position: fixed;
    bottom: 0;
    /*left: 0;*/
    z-index: 100;
  }
  .start {
    height: 2.5rem;
    font-size: .8rem;
    color: #fff;
    background-color: #3ebce5;
    line-height: 2.5rem;
    text-align: center;
  }

  /*上方图片*/
  .top-img {
    width: 100%;
    height: 0.75rem;
    text-align: center;
  }
  .top-img img {
    width: 2rem;
    height: 0.75rem;
  }

  /*下方内容*/
  /*主观题*/
  .bottom-written {
    background: white;
    /*height: 14.65rem;*/
    box-shadow: 0 -3px 0 0 #eeeeee;
    padding: 0.8rem;
    /*display: none;*/
  }
  .bottom-written textarea {
    width: 100%;
    height: 100%;
    resize: none;
    border: 1px solid #d9d9d9;
    font-size: 0.8rem;
  }
  /*.bottom-written p {*/
    /*font-size: 0.7rem;*/
    /*color: #666666;*/
  /*}*/

  /*完形填空*/
  .bottom-gestalt {
    height: 14.65rem;
    box-shadow: 0 -3px 0 0 #eeeeee;
    background: white;
    overflow: hidden;
  }
  /*上方题目index*/
  .top-index {
    width: 100%;
    overflow: hidden;
    margin: 0.95rem 0;
  }
  .top-index ul {
    display: flex;
    /*width: 900px;*/
    /*overflow-y: scroll;*/
  }
  .top-index .swiper-wrapper .swiper-slide {
    /*width: 3.3rem;*/
    /*width: 70px !important;*/
    /*height: 1.4rem;*/
    /*width: auto !important;*/
    line-height: 1.4rem;
    text-align: center;
    margin-right: 0.6rem;
    display: inline-block;
    border-radius: 0.2rem;
    border: 1px solid #b3b3b3;
    color: #b3b3b3;
  }

  .topactive {
    border: 1px solid #3ebce5 !important;
    box-shadow: 0 0 6px 1px #3ebce5 inset;
    color: #3ebce5 !important;
  }
  /*.topdefault {*/
    /*border: 1px solid #b3b3b3;*/
    /*color: #b3b3b3;*/
  /*}*/

  /*下方题目内容*/
  .bottom-topic {
    margin: 0 0.7rem 0.7rem;
    overflow: auto;
    /*border: 1px solid #b3b3b3;*/
  }
  /*.bottom-topic > div {*/
    /*overflow-y: auto;*/
  /*}*/
  /*.bottom-topic .swiper-wrapper .swiper-slide p {*/
    /*font-size: 0.7rem;*/
  /*}*/
  /*.bottom-topic .swiper-wrapper .swiper-slide .topic-op {*/
    /*!*width: 100%;*!*/
    /*height: 2.1rem;*/
    /*line-height: 2.1rem;*/
    /*border: 1px solid #e0e0e0;*/
    /*border-radius: 0.2rem;*/
    /*margin-top: 0.7rem;*/
    /*font-size: 0.7rem;*/
  /*}*/
  /*.bottom-topic .swiper-wrapper .swiper-slide .topic-op .key {*/
    /*padding-right: 0.5rem;*/
    /*padding-left: 0.6rem;*/
  /*}*/

  /*.active {*/
     /*background-color: #3ebce5;*/
     /*color: white;*/
   /*}*/
  /*!*正确情况*!*/
  /*.ok {*/
     /*background-color: #7ac858;*/
     /*color: white;*/
   /*}*/
  /*!*错误情况*!*/
  /*.err {*/
     /*background-color: #f57665;*/
     /*color: white;*/
   /*}*/

</style>
