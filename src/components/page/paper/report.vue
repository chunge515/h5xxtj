<template>

  <div>
    <!--报告页面-->
    <div class="report-con" v-if="reportType == 'report'">
      <!--头部-->
      <header class="repeat-head">
        <router-link :to="{path:'/paperList',query:{code:urlItem.code,inviteCode:urlItem.inviteCode}}">
          <i class="fa fa-angle-left" style="color: white;"></i>
        </router-link>
        <div class="headtitle">{{headname}}</div>
        <div class="rightIcon" @click="rightTestClick"><i class="fa fa-bars"></i></div>
      </header>

      <!--右方弹框内容-->
      <div class="rightTest" v-show="rightTestShow">
        <i class="fa fa-caret-up"></i>
        <ul>
          <li @click="openMyAnswer">我的作答</li>
          <li @click="againtest">再次测评</li>
          <!--<li @click="openhistest">历史报告</li>-->
        </ul>
      </div>

      <article class="report-article">
        <!--上部分分数部分-->
        <div class="branch">
          <div class="top-img">
            <img src="../../../../static/img/report-bg.png" />
          </div>
          <div class="bottom-con">
            <div class="branch-circle">
              <canvas-ground class="canvas" :circle="circleConfig"></canvas-ground>
            </div>
            <div class="branch-time">
              评测用时：<span>{{branchTime}}</span>
            </div>
          </div>
        </div>

        <!--学科能力发展及目标-->
        <div class="subject-ability title-wrap">
          <div class="top-title">学科能力发展及目标</div>
          <div class="sub-title">
            <p>该图体现了学生五大学科能力的发展情况</p>
            <p>应关注得分较低的能力，关注学科能力的均衡性</p>
          </div>
          <!--蜘蛛图-->
          <div>
            <div id="subjectAbility"></div>
          </div>
        </div>

        <!--知识点掌握情况-->
        <div class="knowledge title-wrap">
          <div class="top-title">知识点掌握情况</div>
          <div class="sub-title">
            <p>该图体现了学生在每个知识点上的掌握百分比 </p>
            <p>百分比越大，说明知识点掌握情况越好</p>
          </div>
          <div class="knowledge-body">
            <div class="knowledge-main">
              <div class="header">
                <div class="ling">
                  0%
                </div>
                50%
                <div class="hundred">
                  100%
                </div>
              </div>
              <div class="main">
                <div class="line" :style="{left:i*20 + '%'}" v-for="i in 4"></div>
                <div v-for="(know,index) in result.knowledgeGraspChart" class="main-item">
                  <div class="main-item-title">
                    {{know.baseKnowledgeName}}
                  </div>
                  <mt-progress :value="know.rightRatio" :bar-height="9"></mt-progress>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--各模块分数上升区间及有效增长点-->
        <div class="module title-wrap">
          <div class="top-title">各模块分数上升区间及有效增长点</div>
          <div class="sub-title">
            <p>该图体现了学生在每个知识模块上能够提高的分数分数越大，说明在该知识模块上提分空间越高</p>
          </div>
          <div class="module-body">
            <div class="module-main">
              <div class="header">
                <div v-for="i in 6" :class="{first:i==1,last:i==6}" class="percent-num-item">
                  {{modelMaxTotalScore / 5 * (i - 1)}}
                </div>
              </div>
              <div class="main">
                <div class="line" :style="{left:i*20 + '%'}" v-for="i in 4"></div>
                <div v-for="(know,index) in result.moduleScoreIncreaseChart" class="main-item">

                  <div class="main-item-title">
                    {{know.baseKnowledgeName}}
                  </div>
                  <div class="main-item-body">
                    <!--<mt-progress :value="item.colorScore" :bar-height="9"></mt-progress>-->
                    <div class="normal-wrap"></div>
                    <div class="hard-wrap" :style="{width: (know.hard||0)/modelMaxTotalScore*100 + '%'}" ></div>
                    <div class="easily-wrap" :style="{width: (know.easily||0)/modelMaxTotalScore*100 + '%'}" ></div>
                  </div>
                </div>
              </div>
              <div class="bottom">
                <div class="bottom-item">
                  <div class="yuan" style="background: #ff9234;"></div>较易提升部分
                </div>
                <div class="bottom-item">
                  <div class="yuan" style="background:#4ebaba;"></div>较难提升部分
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--历次考试分数波动曲线-->
        <div class="history title-wrap">
          <div class="top-title">历次考试分数波动曲线</div>
          <div class="sub-title">
            <p>该表记录了学生的历次考试分数关注每次考试成绩以及学科成绩变化情况 </p>
          </div>
          <div class="history-body">
            <div id="hisScore"></div>
          </div>
        </div>
      </article>


      <mt-popup
        v-model="histestListShow"
        popup-transition="popup-fade"
        class="histest-list"
      >
        <div>
          <ul>
            <li v-for="(item,index) in histestList" @click="gohisreport(item)"><span class="text">{{item.reportTime}}</span><span class="rightIcon"><i class="fa fa-angle-right"></i></span></li>
          </ul>
        </div>
      </mt-popup>
      <appoint @post="god" bgtype="blue" v-if="isShow"></appoint>
    </div>

    <!--我的作答页面-->
    <div v-if="reportType == 'myanswer'" class="myanswer">
      <mt-header fixed :title="headname" class="head">
        <div slot="left">
          <span class="closer" @click="clickX">x</span>
        </div>
      </mt-header>
      <div class="headmore">
        <span class="pull-left">作答时间：{{branchTime}}</span>
        <span class="pull-right">总分：<span>{{result.userScore}}分</span></span>
      </div>
      <div class="myanswer-con">
        <div v-for="(item, index) in myanswerDetail.bigQuestions" :key="item.bigId">
          <div class="big-name">{{item.bigSort2 | toPageNum}}、{{item.bigTitle}}（共{{item.smallQuestions.length}}题；共{{item.bigScore}}分）</div>
          <div v-for="(item2, index2) in item.smallQuestions" :key="index2">
            <question v-if="item.bigType!=6" :questionDetails="item2" :finish="2"></question>
            <compoundQuestion v-if="item.bigType==6" :compoundDetails="item2" :finish="2"></compoundQuestion>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import canvasGround from "../../common/canvasGroup";
  import question from "../../common/question/index"
  import compoundQuestion from "../../common/question/compoundQuestion"
  import appoint from "../../common/appointmentUnscramble"

    export default {
      name: "report",
      data() {
          return {
            reportCode: '',//报告code
            gradecode: '',//学年code
            headname: '',//头部标题
            rightTestShow: false,//右侧弹框是否显示
            result: {},//报告详细内容
            reportType: 'report', //report 显示报告  myanswer我的作答
            myanswerDetail: {},//我的作答详情
            histestListShow: false,//历史报告显示
            histestList: [],//历史报告列表
            nowScore: '0',//当前得分
            urlItem:JSON.parse(window.localStorage.getItem("urlQuery"))||{},
            isShow:true
          }
      },
      components: {
        canvasGround,
        question,
        compoundQuestion,
        appoint
      },
      mounted() {
        //报告code
        // console.log(this.$route.query.reportCode);
        //学年code
        // console.log(this.$route.query.gradecode);
        var _this = this;

        _this.reportCode = _this.$route.query.reportCode;
        _this.gradecode = _this.$route.query.gradecode;

        //获取报告详情
        _this.getReportDetail();
      },
      methods: {
        /*提交*/
        god:function(item){
          var $this = this;
          if(!item.date){
            $this.Toast({
              message: '请选择时间',
              iconClass: '',
              position: 'bottom',
            });
            return
          }
          // if(!item.code){
          //   $this.Toast({
          //     message: '请输入兑换卷码',
          //     iconClass: '',
          //     position: 'bottom',
          //   });
          //   return
          // }
          var userPostData = JSON.parse(localStorage.getItem('userPostData'));
          var obj = {
            "appointDateTime": $this.timeObj(item.date),
            /*  "childAge": userPostData,*/
            // "childGrade": userPostData.childGrade,
            // "childRealName": userPostData.childRealName,
            // "childSex": userPostData.childSex,
            "couponCode": item.code,
            // "tel": userPostData.tel,
            "userId": $this.localData.get('userid'),
            "reportId":$this.$route.query.reportId,//$this.result.paperId,
            "inviteCode":$this.$route.query.inviteCode,
            "type":1
          }
          this.$axios({
            method: "post",
            url: "/user/appointment",
            data:obj}).then((res) => {
            if(res.code == "000000"){
              this.Toast('提交成功');
              $this.isShow=false;
              $this.$nextTick(function () {
                $this.isShow=true;
              })
            }else{
              this.Toast(res.message);
            }
            console.log(res)
          }).catch(err => {
            // console.log(err);
            this.Toast('提交失败');
          })
        },
        /*
        * 返回上一页
        * */
        back() {
          window.history.go(-1);
        },
        /*
        * 右方弹框是否显示
        * */
        rightTestClick() {
          this.rightTestShow = !this.rightTestShow;
        },
        /*
        * 获取报告详情
        * */
        getReportDetail() {
          var _this = this;
          _this.$axios({
            method: "post",
            url: "/assessmentReport/createReport",
            data: {
              appKey: "string",
              evaluationRecordCode: _this.reportCode,//用户测评记录Code
              token: "string"
            }
          }).then((res) => {
            if(res.code == '000000') {
              // console.log("获取报告详情");
              // console.log(res);

              if(res.result == null) {
                _this.Toast('未获取到报告数据');
                // _this.reportCode = _this.$route.query.reportCode;
                return;
              }
              //头部标题
              _this.headname = res.result.paperName;


              //学科能力发展及目标
              for(var i=0;i<res.result.subjectAbilityChart.length;i++) {
                var rightRatio = res.result.subjectAbilityChart[i].rightRatio;
                res.result.subjectAbilityChart[i].rightRatio = parseInt(rightRatio*10000)/100
              }
              //知识点掌握情况
              for(var j=0;j<res.result.knowledgeGraspChart.length;j++) {
                var rightRatio = res.result.knowledgeGraspChart[j].rightRatio;
                res.result.knowledgeGraspChart[j].rightRatio = parseInt(rightRatio*10000)/100
              }

              //各模块分数上升区间及有效增长点
              for(var a=0;a<res.result.moduleScoreIncreaseChart.length;a++) {
                var productionColors = res.result.moduleScoreIncreaseChart[a].productionColors;
                var easily = 0;
                var hard = 0;
                for(var b=0;b<productionColors.length;b++) {
                  if(productionColors[b].colorCode != 'blue') {
                    hard += productionColors[b].colorScore;
                  }
                  if(productionColors[b].colorCode == 'yellow') {
                    easily = productionColors[b].colorScore;
                  }
                }
                res.result.moduleScoreIncreaseChart[a].easily = easily;
                res.result.moduleScoreIncreaseChart[a].hard = hard;
              }

              //报告详情
              _this.result = res.result;
              //学科能力发展及目标蜘蛛图
              _this.createSubjectAbility();
              //历次考试分数波动曲线
              _this.createHistoricalScore();

            }else {
              _this.Toast('获取报告出现错误');
            }
          }).catch(err => {
            // console.log(err);
            _this.Toast('获取报告出现错误');
          })
        },
        /*
        * 学科能力发展及目标蜘蛛图
        * */
        createSubjectAbility() {
          var _this = this;
          let subjectAbility = this.result.subjectAbilityChart;
          let myRadar_labelChart = [];
          let myRadar_dataChart = [];
          for (let i = 0; i < subjectAbility.length; i++) {
            myRadar_labelChart.push(subjectAbility[i].abilityName);
            myRadar_dataChart.push(subjectAbility[i].rightRatio);
          }
          Highcharts.chart("subjectAbility", {
            //图表展示容器，与 div 的 id 保持一致
            chart: {
              polar: true,
              type: "line",
              height: 300,
            },
            credits: {
              enabled: false
            },
            title: {
              text: " "
            },
            pane: {
              size: "80%"
            },
            xAxis: {
              categories: myRadar_labelChart,
              tickmarkPlacement: "on",
              lineWidth: 0
            },
            tooltip: {
              shared: true,
              pointFormat:
                '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}%</b><br/>'
            },
            yAxis: {
              gridLineInterpolation: "polygon",
              lineWidth: 0,
              min: 0,
              max: 100,
              tickInterval: 10,
              minorTickInterval: 10,
              tickmarkPlacement: "on",
              alternateGridColor: '#f2f2f2',
              labels: {}
            },
            legend: {
              align: "right",
              verticalAlign: "top",
              y: 10,
              layout: "vertical"
            },
            series: [
              {
                name: "能力",
                type: "area",
                data: myRadar_dataChart,
                pointPlacement: "on",
                showInLegend: false
              }
            ]
          });
        },
        /*
        * 历次考试分数波动曲线
        * */
        createHistoricalScore() {
          let historicalScore = this.result.historicalScoreChart;
          let examDate = [];
          let score = [];
          for (let i = 0; i < historicalScore.length; i++) {
            examDate.push(historicalScore[i].paperName);
            score.push(historicalScore[i].userScore);
          }
          Highcharts.chart("hisScore", {
            chart: {
              type: "line"
            },
            title: {
              text: "",
              x: 0
            },
            tooltip: {
              shared: true,
              pointFormat:
                '<span style="color:{series.color}">得分: <b>{point.y:,.0f}</b><br/>'
            },
            yAxis: {
              gridLineInterpolation: "polygon",
              lineWidth: 1,
              min: 0,
              title: {
                offset: 16,
                text: "考试分数（分)",
                x: -18
              }
            },
            xAxis: {
              categories: examDate,
              gridLineWidth: 1,
            },
            series: [
              {
                showInLegend: false,
                data: score,
                color: "#ff9234"
              }
            ],
            credits: { enabled: false },
            plotOptions: {
              line: {
                dataLabels: {
                  enabled: true // 开启数据标签
                },
                enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
              },
            }
          });
        },
        /*
        * 点击历史报告
        * */
        openhistest() {
          this.histestListShow = !this.histestListShow;
          this.rightTestShow = false;
          //获取历史报告
          this.gethistest();
        },
        /*
        * 点击查看历史报告
        * */
        gohisreport(item) {
          var _this = this;
          _this.reportCode = item.reportId;

          _this.getReportDetail();

          _this.histestListShow = false;
        },
        /*
        * 获取历史报告
        * */
        gethistest() {
          var _this = this;
          _this.$axios({
            method: "post",
            url: "/assessmentReport/getReportCatalogList",
            data: {
              paperId: _this.result.paperId,
              userId: _this.result.userId,
            }
          }).then((res) => {
            if(res.code == '000000') {
              // console.log("获取历史报告");
              // console.log(res);
              //历史报告列表
              _this.histestList = res.result;

            }else {
              _this.Toast('获取历史报告出现错误');
            }
          }).catch(err => {
            // console.log(err);
            _this.Toast('获取历史报告出现错误');
          })
        },
        /*
        * 点击再次测评
        * */
        againtest() {
          var _this = this;
          _this.$router.push({
            path: '/paper/static',
            query: {
              paperid: _this.result.paperId,
              gradecode: _this.gradecode,
            }
          })
        },
        /*
        *点击我的作答
        * */
        openMyAnswer() {
          this.reportType = 'myanswer';
          this.rightTestShow = false;
          //作答详情
          this.myanswerDetail = {};
          //获取我的作答详情数据
          this.getMyAnswerDetail();
        },
        /*
        * 我的作答点击X
        * */
        clickX() {
          this.reportType = 'report';
          this.rightTestShow = false;
          this.getReportDetail();
        },
        /*
        * 获取我的作答详情
        * */
        getMyAnswerDetail() {
          var _this = this;
          _this.$axios({
            method: "post",
            url: "/evaluation/getEvaluationAnswer",
            data: {
              appKey: "string",
              evaluationRecordCode: _this.reportCode,//用户测评记录Code
              token: "string"
            }
          }).then((res) => {
            if(res.code == '000000') {
              // console.log("获取作答详情");
              // console.log(res);

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

              //作答详情
              _this.myanswerDetail = res;

            }else {
              _this.Toast('获取作答出现错误');
            }
          }).catch(err => {
            // console.log(err);
            _this.Toast('获取作答出现错误');
          })
        },
        timeObj(value){
          var a = new Date(value);
          var month = "";
          var dateItem = "";
          var h = "";
          var m = "";
          var s = "";
          if(a.getMonth() + 1<10){
            month = "0" + (a.getMonth() + 1)
          }else{
            month = (a.getMonth() + 1)
          }
          if(a.getDate()<10){
            dateItem = "0" + a.getDate()
          }else{
            dateItem = a.getDate()
          }
          if(a.getHours()<10){
            h = "0" + a.getHours()
          }else{
            h = a.getHours()
          }
          if(a.getMinutes()<10){
            m = "0" + a.getMinutes()
          }else{
            m = a.getMinutes()
          }
          if(a.getSeconds()<10){
            s = "0" + a.getSeconds()
          }else{
            s = a.getSeconds()
          }
          var b  = a.getFullYear() + '-' + month + '-' + dateItem; //+ " " + h + ":" + m + ":" + s;
          return b
        },

      },
      computed: {
        /*
        * 得分
        * */
        circleConfig() {
          let result = this.result;
          return {
            totalScore: +result.paperScore || 100,
            width: 75,
            score: result.userScore || 0
          };
        },
        /*
        * 答题时间
        * */
        branchTime() {
          var branchtime = this.result.useTime;
          var minute=parseInt(branchtime/60);
          var second=parseInt(branchtime%60);
          if(minute == 0) {
            return second+'秒';
          }else {
            return minute+'分'+second+'秒';
          }
        },
        /*
        * 计算模块分数的相加最大值
        * */
        modelMaxTotalScore() {
          let temp = 0;
          //计算模块分数的相加最大值
          this.result &&
          this.result.moduleScoreIncreaseChart &&
          // this.result.moduleScoreIncreaseChart.forEach(
          //   ({ productionColors }) => {
          //     let num = 0;
          //     productionColors.forEach(
          //       ({colorScore}) => {
          //         num += colorScore;
          //       }
          //     );
          //     temp = num > temp ? num : temp;
          //   }
          // );
          this.result.moduleScoreIncreaseChart.forEach(
            function({ productionColors }) {
              let num = 0;
              productionColors.forEach(
                ({colorScore}) => {
                  num += colorScore;
                }
              );
              temp = num > temp ? num : temp;
            }
          );
          return Math.ceil(temp / 5) * 5;
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
    }
</script>

<style scoped lang="scss">

  /*
    报告页面
  */
  /*最外面容器*/
  .report-con {
    background: white;
    height: 100vh;
    /*头部*/
    .repeat-head {
      width: 100%;
      height: 2.1rem;
      line-height: 2.1rem;
      color: white;
      display: flex;
      justify-content: space-between;
      background: #3ebce5;
      box-sizing: border-box;
      padding: 0 0.8rem;
      position: fixed;
      top: 0;
      z-index: 2;
      .headtitle {
        font-size: 0.8rem;
        max-width: 8.5rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      & i {
        display: inline-block;
        font-size: 1rem;
        position: relative;
        top: 0.05rem;
      }
      .rightIcon {
        position: relative;
        z-index: 99;
      }
    }
    /*右方弹框内容*/
    .rightTest {
      width: 4.05rem;
      position: fixed;
      right: 0.6rem;
      top: 1.9rem;
      z-index: 2;
      &>i {
        color: white;
        position: absolute;
        right: 0.4rem;
        top: -0.6rem;
        font-size: 1rem;
        font-weight: 900;
      }
      & ul {
        border-radius: 0.3rem;
        /*border: 1px solid #d9d9d9;*/
        border-bottom: none;
        background: white;
        position: relative;
        &> li {
          width: 100%;
          height: 1.65rem;
          text-align: center;
          line-height: 1.65rem;
          border-bottom: 1px solid #d9d9d9;
          font-size: 0.6rem;
          color: #666666;
        }
        &>li:last-child {
          border: none;
        }
      }
    }
    /*报告内容*/
    .report-article {
      /*height: calc(100vh - 2.1rem);*/
      overflow: auto;
      background: white;
      width: 100%;
      margin-top: 2.1rem;
      /*上部分分数部分*/
      .branch {
        width: 100%;
        /*上方图片*/
        .top-img {
          width: 100%;
          height: 6rem;
          & img {
            width: 100%;
            height: 100%;
          }
        }
        /*下方分数*/
        .bottom-con {
          width: 16.4rem;
          height: 7rem;
          margin: 0 auto;
          background: white;
          position: relative;
          margin-top: -4.75rem;
          border-radius: 0.3rem;
          box-shadow: 0 3px 5px #888888;
          .branch-circle {
            text-align: center;
            padding-top: 1rem;
          }
          .branch-time {
            margin-top: 0.4rem;
            padding-right: 0.7rem;
            text-align: right;
            font-size: 0.6rem;
            color: #666666;
            &>span {
              color: #ff9234;
            }
          }
        }
      }
      /*学科能力发展及目标*/
      .subject-ability {
        /*width: 100%;*/
      }

      /*知识点掌握情况*/
      .knowledge {
        .knowledge-body {
          margin-top: 0.5rem;
          .knowledge-main {
            .header {
              text-align: center;
              position: relative;
              height: 1.2rem;
              line-height: 1.2rem;
              color:#666;
              font-size: 0.7rem;
              .ling {
                display: inline-block;
                position: absolute;
                top: 0;
                left: 0;
              }
              .hundred {
                display: inline-block;
                position: absolute;
                top: 0;
                right: 0;
              }
            }
            .main {
              padding: 0.7rem 0;
              position: relative;
              border: 1px solid #d9d9d9;
              .line {
                position: absolute;
                top: 0;
                height: 100%;
                width: 1px;
                background: #d9d9d9;
              }
              .main-item {
                position: relative;
                text-align: left;
                .main-item-title {
                  color: #333;
                  font-size: 0.7rem;
                }
              }
            }
          }
        }
      }

      /*各模块分数上升区间及有效增长点*/
      .module {
        .module-body {
          margin-top: 0.5rem;
          .module-main {
            .header {
              text-align: center;
              position: relative;
              height: 1.2rem;
              line-height: 1.2rem;
              color:#666;
              font-size: 0.7rem;
              .percent-num-item {
                width: 20%;
                display: inline-block;
                float: left;
              }
              .first {
                width: 10%;
                text-align: left;
              }
              .last {
                width: 10%;
                text-align: right;
              }
            }
            .main {
              border: 1px solid #d9d9d9;
              padding: 0.7rem 0;
              position: relative;
              .line {
                position: absolute;
                top: 0;
                height: 100%;
                width: 1px;
                background: #d9d9d9;
              }
              .main-item {
                position: relative;
                text-align: left;
                /*margin-bottom: 1rem;*/
                .main-item-title {
                  color: #333;
                  font-size: 0.7rem;
                  line-height: 1.5rem;
                }
                .main-item-body {
                  /*margin-top: 0.5rem;*/
                  height: 1rem;
                  position: relative;
                  .normal-wrap {
                    width: 100%;
                    height: 0.45rem;
                    background: #ebebeb;
                    border-radius: 0.5rem;
                    position: absolute;
                    top: 0;
                  }
                  .hard-wrap {
                    height: 0.45rem;
                    background: #4ebaba;
                    border-radius: 0.5rem;
                    position: absolute;
                    top: 0;
                  }
                  .easily-wrap {
                    height: 0.45rem;
                    background: #ff9234;
                    border-radius: 0.5rem;
                    position: absolute;
                    top: 0;
                  }
                }
              }
            }
            .bottom {
              width: 11.5rem;
              margin: 0 auto;
              display: flex;
              justify-content: space-between;
              .bottom-item {
                font-size: 0.7rem;
                color: #333;
                line-height: 1.4rem;
                display: flex;
                align-items: center;
                .yuan {
                  width: 0.5rem;
                  height: 0.5rem;
                  border-radius: 50%;
                  margin-right: 0.2rem;
                }
              }
            }
          }
        }

      }

      /*标题部分 公用 */
      .title-wrap {
        margin-top: 1rem;
        padding: 0 0.8rem;
        .top-title {
          font-size: 0.7rem;
          font-weight: 700;
          border-bottom: 1px solid #d9d9d9;
          line-height: 1.5rem;
        }
        .sub-title {
          color: #8c8c8c;
          font-size: 0.6rem;
          line-height: 1rem;
          margin-top: 0.4rem;
        }
        .history-body{
          margin-top: 0.5rem;
        }
      }

    }
  }

  /*
    我的作答
  */
  .myanswer {
    width: 100%;
    height: 100vh;
    background: white;
    .head {
      z-index: 2;
    }
    /*左上方 X 样式*/
    .closer {
      border-radius: 50%;
      font-size: 0.8rem;
      border: 0.05rem solid #fff;
      width: 0.9rem;
      height: 0.9rem;
      display: inline-block;
      text-align: center;
      line-height: 0.9rem;
    }
    /*头部下方条状*/
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
      .pull-right {
        span {
          color: #f57665;
        }
      }
    }
    /*作答内容*/
    .myanswer-con {
      padding: 0 0.5rem;
      padding-top: 4.325rem;
      padding-bottom: 0.5rem;
      overflow: auto;
      min-height: calc(100vh - 7.325rem);
      background: white;
      .big-name {
        font-size: 0.7rem;
        font-weight: bold;
        padding: 0.8rem 0;
      }
    }
  }

  /*历史报告页面*/
  .histest-list {
    width: 12rem;
    max-height: 20rem;
    overflow: auto;
    border-radius: 0.2rem;
    &>div {
      width: 100%;
      &>ul {
        width: 100%;
        height: 100%;
        li {
          width: 100%;
          height: 2.5rem;
          line-height: 2.5rem;
          font-size: 0.65rem;
          color: #666666;
          border-bottom: 1px solid #d9d9d9;
          position: relative;
          text-align: center;
          .text {
            width: 8rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
          }
          .rightIcon {
            position: absolute;
            right: 0.9rem;
            i {
              font-size: 1rem;
              color: #aaaaaa;
            }

          }
          &:last-child{
            border-bottom: none;
          }
        }
      }
    }
  }
</style>
