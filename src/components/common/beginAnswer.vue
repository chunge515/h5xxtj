<template>
    <!--测评说明组件-->
    <div class="begin-answer-wrap">
      <mt-header fixed :title="headerName" class="head-wrap">
          <mt-button icon="back" slot="left" @click = "back"></mt-button>
      </mt-header>
      <div class="img-wrap">
        <img src="../../../static/img/begin-answer.png"/>
      </div>
      <div class="text-wrap">
        <h2>测评说明</h2>
        <p>
          本测评以学科知识为载体，科学、精准的帮助广大学生进行学习能力与习惯、学科提分空间、学科知识短板等方面的测评与分析，旨在帮助学生精准定位自身知识、能力、思维、习惯、方法等问题，以便进行针对性的调整与干预，帮助学生建立深度学习习惯，实现终身学习状态。
<br>
          测评方式：<br>
          第一步：选择测评的学年和学科；<br>
          第二步：预览试卷，开始作答；<br>
          第三步：提交试卷，查看报告。<br>

          注意事项：<br>
          1.请提前准备草稿纸和笔；<br>
          2.请在答题时保证设备电量充足；<br>
          3.如用手机做答，建议在wifi环境下，开启飞行模式；<br>
          4.注意考试时间管理，考试时间到，试卷自动提交。
        </p>
      </div>
      <div class="btn-wrap" @click="begin">
        <mt-button type="primary" class="btn">预览试卷</mt-button>
      </div>
    </div>
</template>

<script>
  import explainDetail from '../../../static/data/explain'
    export default {
      name: "beginAnswer",
      props: ['headerName'],
      data(){
        return {
          explainJson: {}
        }
      },
      created() {
        this.explainJson = explainDetail;
        console.log(this.explainJson)
      },
      methods: {
        //返回
        back: function() {
          // 子组件中触发父组件方法并传值
          this.$emit('back', '开始测评组件里返回事件')
        },
        //开始作答
        begin: function() {
          this.$emit('begin', '开始作答')
        },
      }
    }
</script>

<style scoped>
  .begin-answer-wrap {
    background: white;
    height: 100%;
    padding-bottom: 30px;
  }

  .head-wrap {
    height: 2.1rem;
    font-size: 0.8rem;
  }

  .img-wrap {
    width: 100%;
    text-align: center;
    padding-top: 2.75rem;
  }
  .img-wrap img {
    width: 80%;
  }

  .text-wrap {

  }
  .text-wrap h2 {
    font-size: 0.8rem;
    text-align: center;
  }
  .text-wrap p {
    font-size: 0.6rem;
    padding: 0 2.3rem;
    padding-top: 1.4rem;
    line-height: 1rem;
  }
  .btn-wrap {
    width: 100%;
    text-align: center;
  }
  .btn {
    width: 12.5rem;
    margin-top: 2rem;
    border-radius: 1.5rem;
    font-size: 0.7rem;
  }
</style>
